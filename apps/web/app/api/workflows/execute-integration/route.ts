/**
 * Execute Integration API - Execute workflow integration nodes
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@galaxyco/database';
import { sendGmailMessage, receiveGmailMessages, GmailCredentials } from '@/lib/integrations/gmail';
import { sendSlackMessage, readSlackMessages, SlackCredentials } from '@/lib/integrations/slack';
import { CRMCredentials, Contact, Deal } from '@/lib/integrations/crm/types';
import {
  createHubSpotContact,
  updateHubSpotContact,
  getHubSpotContact,
  createHubSpotDeal,
  searchHubSpotContacts,
} from '@/lib/integrations/crm/hubspot/api';
import {
  createPipedrivePerson,
  updatePipedrivePerson,
  getPipedrivePerson,
  createPipedriveDeal,
  searchPipedrivePersons,
} from '@/lib/integrations/crm/pipedrive/api';

const ExecuteIntegrationRequestSchema = z.object({
  nodeId: z.string(),
  integration: z.string().optional(),
  config: z.record(z.any()).optional(),
  workspaceId: z.string(),
  variables: z.record(z.any()).optional(),
  previousResults: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nodeId, integration, config, workspaceId, variables, previousResults } =
      ExecuteIntegrationRequestSchema.parse(body);

    if (!integration) {
      return NextResponse.json({ error: 'Integration type is required' }, { status: 400 });
    }

    // Execute the integration based on type
    let result;

    switch (integration.toLowerCase()) {
      case 'gmail':
        result = await executeGmailIntegration(userId, config, variables, previousResults);
        break;

      case 'slack':
        result = await executeSlackIntegration(userId, config, variables, previousResults);
        break;

      case 'hubspot':
        result = await executeHubSpotIntegration(userId, config, variables, previousResults);
        break;

      case 'pipedrive':
        result = await executePipedriveIntegration(userId, config, variables, previousResults);
        break;

      default:
        return NextResponse.json(
          { error: `Integration type "${integration}" not supported` },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      nodeId,
      integration,
      executedAt: new Date().toISOString(),
      output: result,
    });
  } catch (error) {
    console.error('Error executing integration:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to execute integration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Execute Gmail integration
 */
async function executeGmailIntegration(
  userId: string,
  config: Record<string, any> | undefined,
  variables: Record<string, any> | undefined,
  previousResults: Record<string, any> | undefined,
) {
  // Get Gmail integration from database
  const integration = await db.query.integrations.findFirst({
    where: (integrations, { and, eq }) =>
      and(
        eq(integrations.userId, userId),
        eq(integrations.provider, 'google'),
        eq(integrations.type, 'gmail'),
      ),
    with: {
      oauthTokens: true,
    },
  });

  if (!integration || integration.status !== 'active') {
    throw new Error('Gmail integration not connected. Please connect Gmail first.');
  }

  // Get OAuth tokens
  const tokens = await db.query.oauthTokens.findFirst({
    where: (oauthTokens, { eq }) => eq(oauthTokens.integrationId, integration.id),
  });

  if (!tokens) {
    throw new Error('Gmail credentials not found. Please reconnect Gmail.');
  }

  const credentials: GmailCredentials = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken || '',
    expiresAt: tokens.expiresAt ? tokens.expiresAt.getTime() : Date.now() + 3600000,
    email: integration.email || '',
  };

  if (!config?.action) {
    throw new Error('Gmail action is required (send, receive, or search)');
  }

  switch (config.action) {
    case 'send': {
      if (!config.to || !config.subject || !config.body) {
        throw new Error('Gmail send requires: to, subject, and body');
      }

      // Replace variables in email content
      const replacedBody = replaceVariables(config.body, variables, previousResults);
      const replacedSubject = replaceVariables(config.subject, variables, previousResults);

      const result = await sendGmailMessage(credentials, {
        to: config.to,
        subject: replacedSubject,
        body: replacedBody,
        cc: config.cc,
        bcc: config.bcc,
      });

      return {
        action: 'send',
        messageId: result.id,
        threadId: result.threadId,
        to: config.to,
        subject: replacedSubject,
      };
    }

    case 'receive': {
      const maxResults = config.maxResults || 10;
      const query = config.query;

      const messages = await receiveGmailMessages(credentials, {
        maxResults,
        query,
      });

      return {
        action: 'receive',
        count: messages.length,
        messages: messages.map((msg) => ({
          id: msg.id,
          from: msg.from,
          subject: msg.subject,
          receivedAt: msg.receivedAt,
        })),
      };
    }

    case 'search': {
      if (!config.query) {
        throw new Error('Gmail search requires a query parameter');
      }

      const maxResults = config.maxResults || 10;
      const messages = await receiveGmailMessages(credentials, {
        query: config.query,
        maxResults,
      });

      return {
        action: 'search',
        query: config.query,
        count: messages.length,
        messages: messages.map((msg) => ({
          id: msg.id,
          from: msg.from,
          subject: msg.subject,
          receivedAt: msg.receivedAt,
        })),
      };
    }

    default:
      throw new Error(`Unknown Gmail action: ${config.action}`);
  }
}

/**
 * Execute Slack integration
 */
async function executeSlackIntegration(
  userId: string,
  config: Record<string, any> | undefined,
  variables: Record<string, any> | undefined,
  previousResults: Record<string, any> | undefined,
) {
  // Get Slack integration from database
  const integration = await db.query.integrations.findFirst({
    where: (integrations, { and, eq }) =>
      and(
        eq(integrations.userId, userId),
        eq(integrations.provider, 'slack'),
        eq(integrations.type, 'messaging'),
      ),
  });

  if (!integration || integration.status !== 'active') {
    throw new Error('Slack integration not connected. Please connect Slack first.');
  }

  // Get OAuth tokens
  const tokens = await db.query.oauthTokens.findFirst({
    where: (oauthTokens, { eq }) => eq(oauthTokens.integrationId, integration.id),
  });

  if (!tokens) {
    throw new Error('Slack credentials not found. Please reconnect Slack.');
  }

  const credentials: SlackCredentials = {
    accessToken: tokens.accessToken,
    tokenType: tokens.tokenType || 'Bearer',
    scope: tokens.scope || '',
    botUserId: integration.config?.botUserId,
    appId: integration.config?.appId,
    teamId: integration.providerAccountId,
    teamName: integration.displayName || undefined,
  };

  if (!config?.action) {
    throw new Error('Slack action is required (send_message, read_messages, etc.)');
  }

  switch (config.action) {
    case 'send_message': {
      if (!config.channel || !config.text) {
        throw new Error('Slack send_message requires: channel and text');
      }

      // Replace variables in message content
      const replacedText = replaceVariables(config.text, variables, previousResults);

      const result = await sendSlackMessage(credentials, {
        channel: config.channel,
        text: replacedText,
        threadTs: config.threadTs,
      });

      return {
        action: 'send_message',
        ts: result.ts,
        channel: result.channel,
        text: replacedText,
      };
    }

    case 'read_messages': {
      if (!config.channel) {
        throw new Error('Slack read_messages requires: channel');
      }

      const limit = config.limit || 10;
      const messages = await readSlackMessages(credentials, {
        channel: config.channel,
        limit,
        oldest: config.oldest,
        latest: config.latest,
      });

      return {
        action: 'read_messages',
        channel: config.channel,
        count: messages.length,
        messages: messages.map((msg) => ({
          user: msg.user,
          text: msg.text,
          ts: msg.ts,
        })),
      };
    }

    default:
      throw new Error(`Unknown Slack action: ${config.action}`);
  }
}

/**
 * Execute HubSpot CRM integration
 */
async function executeHubSpotIntegration(
  userId: string,
  config: Record<string, any> | undefined,
  variables: Record<string, any> | undefined,
  previousResults: Record<string, any> | undefined,
) {
  // Get HubSpot integration from database
  const integration = await db.query.integrations.findFirst({
    where: (integrations, { and, eq }) =>
      and(eq(integrations.userId, userId), eq(integrations.provider, 'hubspot')),
  });

  if (!integration || integration.status !== 'active') {
    throw new Error('HubSpot integration not connected. Please connect HubSpot first.');
  }

  const tokens = await db.query.oauthTokens.findFirst({
    where: (oauthTokens, { eq }) => eq(oauthTokens.integrationId, integration.id),
  });

  if (!tokens) {
    throw new Error('HubSpot credentials not found. Please reconnect HubSpot.');
  }

  const credentials: CRMCredentials = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken || undefined,
    expiresAt: tokens.expiresAt ? tokens.expiresAt.getTime() : undefined,
  };

  if (!config?.action) {
    throw new Error('HubSpot action is required');
  }

  switch (config.action) {
    case 'create_contact': {
      const contactData = config.contactData as Contact;
      const contact = await createHubSpotContact(credentials, contactData);
      return {
        action: 'create_contact',
        contactId: contact.id,
        contact,
      };
    }

    case 'update_contact': {
      if (!config.contactId) throw new Error('contactId is required');
      const contactData = config.contactData as Partial<Contact>;
      const contact = await updateHubSpotContact(credentials, config.contactId, contactData);
      return {
        action: 'update_contact',
        contactId: contact.id,
        contact,
      };
    }

    case 'get_contact': {
      if (!config.contactId) throw new Error('contactId is required');
      const contact = await getHubSpotContact(credentials, config.contactId);
      return {
        action: 'get_contact',
        contact,
      };
    }

    case 'create_deal': {
      const dealData = config.dealData as Deal;
      const deal = await createHubSpotDeal(credentials, dealData);
      return {
        action: 'create_deal',
        dealId: deal.id,
        deal,
      };
    }

    case 'search_contacts': {
      if (!config.searchQuery) throw new Error('searchQuery is required');
      const contacts = await searchHubSpotContacts(credentials, config.searchQuery);
      return {
        action: 'search_contacts',
        count: contacts.length,
        contacts,
      };
    }

    default:
      throw new Error(`Unknown HubSpot action: ${config.action}`);
  }
}

/**
 * Execute Pipedrive CRM integration
 */
async function executePipedriveIntegration(
  userId: string,
  config: Record<string, any> | undefined,
  variables: Record<string, any> | undefined,
  previousResults: Record<string, any> | undefined,
) {
  // Get Pipedrive integration from database
  const integration = await db.query.integrations.findFirst({
    where: (integrations, { and, eq }) =>
      and(
        eq(integrations.userId, userId),
        eq(integrations.provider, 'salesforce'), // Using salesforce enum for Pipedrive
        eq(integrations.type, 'pipedrive'),
      ),
  });

  if (!integration || integration.status !== 'active') {
    throw new Error('Pipedrive integration not connected. Please connect Pipedrive first.');
  }

  const tokens = await db.query.oauthTokens.findFirst({
    where: (oauthTokens, { eq }) => eq(oauthTokens.integrationId, integration.id),
  });

  if (!tokens) {
    throw new Error('Pipedrive credentials not found. Please reconnect Pipedrive.');
  }

  const credentials: CRMCredentials = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken || undefined,
    expiresAt: tokens.expiresAt ? tokens.expiresAt.getTime() : undefined,
  };

  if (!config?.action) {
    throw new Error('Pipedrive action is required');
  }

  switch (config.action) {
    case 'create_contact': {
      const contactData = config.contactData as Contact;
      const person = await createPipedrivePerson(credentials, contactData);
      return {
        action: 'create_contact',
        personId: person.id,
        person,
      };
    }

    case 'update_contact': {
      if (!config.contactId) throw new Error('contactId is required');
      const contactData = config.contactData as Partial<Contact>;
      const person = await updatePipedrivePerson(credentials, config.contactId, contactData);
      return {
        action: 'update_contact',
        personId: person.id,
        person,
      };
    }

    case 'get_contact': {
      if (!config.contactId) throw new Error('contactId is required');
      const person = await getPipedrivePerson(credentials, config.contactId);
      return {
        action: 'get_contact',
        person,
      };
    }

    case 'create_deal': {
      const dealData = config.dealData as Deal;
      const deal = await createPipedriveDeal(credentials, dealData);
      return {
        action: 'create_deal',
        dealId: deal.id,
        deal,
      };
    }

    case 'search_contacts': {
      if (!config.searchQuery) throw new Error('searchQuery is required');
      const persons = await searchPipedrivePersons(credentials, config.searchQuery);
      return {
        action: 'search_contacts',
        count: persons.length,
        persons,
      };
    }

    default:
      throw new Error(`Unknown Pipedrive action: ${config.action}`);
  }
}

/**
 * Replace variables in text with actual values
 */
function replaceVariables(
  text: string,
  variables?: Record<string, any>,
  previousResults?: Record<string, any>,
): string {
  let result = text;

  // Replace {{variable}} syntax
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
  }

  // Replace {{result.key}} syntax
  if (previousResults) {
    Object.entries(previousResults).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          result = result.replace(new RegExp(`{{${key}.${subKey}}}`, 'g'), String(subValue));
        });
      }
    });
  }

  return result;
}
