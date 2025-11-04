/**
 * Integration Action Executor
 * Executes integration actions in workflows
 */

import type { IntegrationType, IntegrationAction } from './integration-config';

// Gmail actions
import { sendGmailEmail, receiveGmailEmails } from './gmail/gmail-actions';

// Slack actions
import { postSlackMessage, readSlackChannels } from './slack/slack-actions';

// HubSpot actions
import {
  createHubSpotContact,
  updateHubSpotContact,
  createHubSpotDeal,
  updateHubSpotDeal,
} from './hubspot/hubspot-actions';

export interface IntegrationExecutionParams {
  integrationId: IntegrationType;
  action: IntegrationAction;
  connectionId: string;
  parameters: Record<string, any>;
}

export interface IntegrationExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
}

/**
 * Execute an integration action
 */
export async function executeIntegrationAction(
  params: IntegrationExecutionParams,
): Promise<IntegrationExecutionResult> {
  const startTime = Date.now();

  try {
    let result;

    // Route to appropriate integration handler
    switch (params.integrationId) {
      case 'gmail':
        result = await executeGmailAction(params);
        break;
      case 'slack':
        result = await executeSlackAction(params);
        break;
      case 'hubspot':
        result = await executeHubSpotAction(params);
        break;
      case 'google-calendar':
        result = { success: false, error: 'Google Calendar not implemented yet' };
        break;
      default:
        result = { success: false, error: `Unknown integration: ${params.integrationId}` };
    }

    const executionTime = Date.now() - startTime;

    return {
      ...result,
      executionTime,
    };
  } catch (error) {
    console.error('Integration execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Execute Gmail actions
 */
async function executeGmailAction(
  params: IntegrationExecutionParams,
): Promise<Pick<IntegrationExecutionResult, 'success' | 'data' | 'error'>> {
  switch (params.action) {
    case 'send_email':
      return await sendGmailEmail(params.connectionId, {
        to: params.parameters.to,
        subject: params.parameters.subject,
        body: params.parameters.body,
        cc: params.parameters.cc,
        bcc: params.parameters.bcc,
      });

    case 'receive_email':
      return await receiveGmailEmails(params.connectionId, {
        query: params.parameters.query,
        maxResults: params.parameters.maxResults,
      });

    default:
      return { success: false, error: `Unknown Gmail action: ${params.action}` };
  }
}

/**
 * Execute Slack actions
 */
async function executeSlackAction(
  params: IntegrationExecutionParams,
): Promise<Pick<IntegrationExecutionResult, 'success' | 'data' | 'error'>> {
  switch (params.action) {
    case 'post_message':
      return await postSlackMessage(params.connectionId, {
        channel: params.parameters.channel,
        text: params.parameters.text,
        thread_ts: params.parameters.thread_ts,
      });

    case 'read_channels':
      return await readSlackChannels(params.connectionId, {
        types: params.parameters.types,
        limit: params.parameters.limit,
      });

    default:
      return { success: false, error: `Unknown Slack action: ${params.action}` };
  }
}

/**
 * Execute HubSpot actions
 */
async function executeHubSpotAction(
  params: IntegrationExecutionParams,
): Promise<Pick<IntegrationExecutionResult, 'success' | 'data' | 'error'>> {
  switch (params.action) {
    case 'create_contact':
      return await createHubSpotContact(params.connectionId, {
        email: params.parameters.email,
        firstname: params.parameters.firstname,
        lastname: params.parameters.lastname,
        company: params.parameters.company,
        phone: params.parameters.phone,
      });

    case 'update_contact':
      return await updateHubSpotContact(params.connectionId, {
        contactId: params.parameters.contactId,
        properties: params.parameters.properties,
      });

    case 'create_deal':
      return await createHubSpotDeal(params.connectionId, {
        dealname: params.parameters.dealname,
        amount: params.parameters.amount,
        dealstage: params.parameters.dealstage,
      });

    case 'update_deal':
      return await updateHubSpotDeal(params.connectionId, {
        dealId: params.parameters.dealId,
        properties: params.parameters.properties,
      });

    default:
      return { success: false, error: `Unknown HubSpot action: ${params.action}` };
  }
}

/**
 * Validate integration parameters before execution
 */
export function validateIntegrationParameters(
  integrationId: IntegrationType,
  action: IntegrationAction,
  parameters: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Get required fields for this action (simplified validation)
  const requiredFields: Record<string, string[]> = {
    send_email: ['to', 'subject', 'body'],
    post_message: ['channel', 'text'],
    create_contact: ['email'],
    create_deal: ['dealname'],
  };

  const required = requiredFields[action] || [];

  for (const field of required) {
    if (!parameters[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
