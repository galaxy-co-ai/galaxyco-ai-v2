/**
 * Integration Management Tools
 *
 * Tools for connecting, managing, and disconnecting integrations.
 * These tools allow the AI Assistant to:
 * - Initiate OAuth flows for Gmail, Slack, HubSpot, Pipedrive
 * - List connected integrations
 * - Disconnect integrations
 * - Check integration status
 */

import { z } from 'zod';
import { type Tool, Permission, ToolError } from './types';
import { db } from '@galaxyco/database';
import { integrations } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Connect Integration Tool
 * Initiates OAuth flow for an integration
 */
export const connectIntegrationTool: Tool = {
  name: 'connect_integration',
  description: `Connect an external integration like Gmail, Slack, HubSpot, or Pipedrive.
Examples:
- "Connect my Gmail account"
- "Link Slack to my workspace"
- "Integrate HubSpot CRM"
- "Connect Pipedrive"`,
  category: 'integrations',
  requiredPermissions: [Permission.INTEGRATIONS_CONNECT],
  parameters: z.object({
    provider: z
      .enum(['gmail', 'slack', 'hubspot', 'pipedrive', 'microsoft'])
      .describe('Integration provider to connect'),
  }),

  async execute(params, context) {
    try {
      // Generate OAuth URL based on provider
      const oauthUrls: Record<string, string> = {
        gmail: `/api/integrations/gmail/authorize?workspaceId=${context.workspaceId}`,
        slack: `/api/integrations/slack/authorize?workspaceId=${context.workspaceId}`,
        hubspot: `/api/integrations/hubspot/authorize?workspaceId=${context.workspaceId}`,
        pipedrive: `/api/integrations/pipedrive/authorize?workspaceId=${context.workspaceId}`,
        microsoft: `/api/integrations/microsoft/connect?workspaceId=${context.workspaceId}`,
      };

      const authUrl = oauthUrls[params.provider] || oauthUrls.gmail;

      return {
        success: true,
        data: { authUrl, provider: params.provider },
        message: `🔗 Initiating ${params.provider.toUpperCase()} connection. You'll be redirected to authorize...`,
        action: {
          type: 'navigate',
          target: authUrl,
          label: `Authorize ${params.provider}`,
        },
      };
    } catch (error: any) {
      throw new ToolError(
        `Failed to initiate ${params.provider} connection: ${error.message}`,
        'EXECUTION_ERROR',
      );
    }
  },
};

/**
 * List Integrations Tool
 * Shows all connected integrations
 */
export const listIntegrationsTool: Tool = {
  name: 'list_integrations',
  description: `List all connected integrations.
Examples:
- "Show me my connected integrations"
- "What apps are integrated?"
- "List my OAuth connections"`,
  category: 'integrations',
  requiredPermissions: [Permission.INTEGRATIONS_READ],
  parameters: z.object({
    status: z
      .enum(['all', 'active', 'expired', 'error'])
      .default('all')
      .describe('Filter by status'),
  }),

  async execute(params, context) {
    try {
      const conditions = [eq(integrations.workspaceId, context.workspaceId)];

      if (params.status !== 'all') {
        conditions.push(eq(integrations.status, params.status));
      }

      const integrationsList = await db.query.integrations.findMany({
        where: and(...conditions),
        orderBy: [desc(integrations.createdAt)],
      });

      return {
        success: true,
        data: integrationsList.map((int) => ({
          id: int.id,
          provider: int.provider,
          status: int.status,
          createdAt: int.createdAt,
          lastSyncAt: int.lastSyncAt,
        })),
        message:
          integrationsList.length > 0
            ? `You have ${integrationsList.length} integration(s) connected`
            : 'No integrations connected yet',
      };
    } catch (error: any) {
      throw new ToolError(`Failed to list integrations: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Disconnect Integration Tool
 * Removes an OAuth connection
 */
export const disconnectIntegrationTool: Tool = {
  name: 'disconnect_integration',
  description: `Disconnect an integration and revoke access.
Examples:
- "Disconnect my Gmail"
- "Remove Slack integration"
- "Unlink HubSpot"`,
  category: 'integrations',
  requiredPermissions: [Permission.INTEGRATIONS_DISCONNECT],
  isDestructive: true,
  parameters: z.object({
    integrationId: z.string().optional().describe('Integration ID to disconnect'),
    provider: z
      .enum(['gmail', 'slack', 'hubspot', 'pipedrive', 'microsoft'])
      .optional()
      .describe('Provider name (if not using ID)'),
  }),

  async execute(params, context) {
    try {
      let integration;

      // Find integration by ID or provider
      if (params.integrationId) {
        integration = await db.query.integrations.findFirst({
          where: and(
            eq(integrations.id, params.integrationId),
            eq(integrations.workspaceId, context.workspaceId),
          ),
        });
      } else if (params.provider) {
        integration = await db.query.integrations.findFirst({
          where: and(
            eq(integrations.provider, params.provider),
            eq(integrations.workspaceId, context.workspaceId),
          ),
        });
      }

      if (!integration) {
        throw new ToolError('Integration not found or access denied', 'NOT_FOUND');
      }

      // Delete integration
      await db
        .delete(integrations)
        .where(
          and(
            eq(integrations.id, integration.id),
            eq(integrations.workspaceId, context.workspaceId),
          ),
        );

      return {
        success: true,
        message: `✅ Disconnected ${integration.provider.toUpperCase()} integration`,
        action: {
          type: 'delete',
          target: `integration-${integration.id}`,
          label: 'Integration disconnected',
        },
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to disconnect integration: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Check Integration Status Tool
 * Gets detailed status of an integration
 */
export const checkIntegrationStatusTool: Tool = {
  name: 'check_integration_status',
  description: `Check the status and health of an integration.
Examples:
- "Is my Gmail connected?"
- "Check Slack integration status"
- "What's the status of HubSpot?"`,
  category: 'integrations',
  requiredPermissions: [Permission.INTEGRATIONS_READ],
  parameters: z.object({
    provider: z
      .enum(['gmail', 'slack', 'hubspot', 'pipedrive', 'microsoft'])
      .describe('Provider to check'),
  }),

  async execute(params, context) {
    try {
      const integration = await db.query.integrations.findFirst({
        where: and(
          eq(integrations.provider, params.provider),
          eq(integrations.workspaceId, context.workspaceId),
        ),
      });

      if (!integration) {
        return {
          success: true,
          data: { connected: false, provider: params.provider },
          message: `${params.provider.toUpperCase()} is not connected`,
        };
      }

      const isHealthy = integration.status === 'active';

      return {
        success: true,
        data: {
          connected: true,
          provider: params.provider,
          status: integration.status,
          createdAt: integration.createdAt,
          lastSyncAt: integration.lastSyncAt,
          isHealthy,
        },
        message: isHealthy
          ? `✅ ${params.provider.toUpperCase()} is connected and healthy`
          : `⚠️ ${params.provider.toUpperCase()} is connected but has status: ${integration.status}`,
      };
    } catch (error: any) {
      throw new ToolError(
        `Failed to check integration status: ${error.message}`,
        'EXECUTION_ERROR',
      );
    }
  },
};
