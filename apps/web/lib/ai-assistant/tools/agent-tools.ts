/**
 * Agent Management Tools
 *
 * Tools for creating, updating, configuring, and managing AI agents.
 * These tools allow the AI Assistant to:
 * - Create new agents from user descriptions
 * - Update agent configurations
 * - Activate/deactivate agents
 * - Delete agents
 * - Query agent status and analytics
 */

import { z } from 'zod';
import { type Tool, Permission, ToolError } from './types';
import {
  createAgentAction,
  updateAgentAction,
  deleteAgentAction,
} from '@/lib/actions/agent-actions';
import { db } from '@galaxyco/database';
import { agents, agentExecutions } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Create Agent Tool
 * Creates a new AI agent from natural language description
 */
export const createAgentTool: Tool = {
  name: 'create_agent',
  description: `Create a new AI agent. Use this when user wants to create an agent for automation.
Examples:
- "Create an email triage agent"
- "Make an agent to manage my CRM"
- "I want an agent that monitors support inbox"`,
  category: 'agents',
  requiredPermissions: [Permission.AGENTS_CREATE],
  parameters: z.object({
    name: z.string().min(1).describe('Agent name (e.g., "Email Triage Agent")'),
    description: z
      .string()
      .describe(
        'What the agent does (e.g., "Automatically categorizes and prioritizes support emails")',
      ),
    type: z
      .enum(['email', 'crm', 'workflow', 'data-enrichment', 'custom'])
      .describe('Type of agent'),
    triggerConfig: z
      .object({
        type: z.enum(['schedule', 'webhook', 'manual', 'realtime']),
        schedule: z.string().optional().describe('Cron expression for scheduled agents'),
        webhookUrl: z.string().optional(),
      })
      .optional()
      .describe('How the agent is triggered'),
    autoActivate: z
      .boolean()
      .default(false)
      .describe('Automatically activate agent after creation'),
  }),

  async execute(params, context) {
    try {
      // Create agent via Server Action
      const agent = await createAgentAction({
        workspaceId: context.workspaceId,
        createdBy: context.userId, // Add required field
        name: params.name,
        description: params.description,
        type: params.type,
        status: params.autoActivate ? 'active' : 'inactive',
        configuration: {
          trigger: params.triggerConfig || {
            type: 'manual',
          },
        },
      });

      return {
        success: true,
        data: agent,
        message: `✅ Created "${params.name}" agent. ${params.autoActivate ? "It's now active!" : 'Activate it when ready.'}`,
        action: {
          type: 'navigate',
          target: `/agents/${agent.id}`,
          label: 'View agent details',
          data: { agentId: agent.id },
        },
      };
    } catch (error: any) {
      throw new ToolError(`Failed to create agent: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Update Agent Tool
 * Updates an existing agent's configuration
 */
export const updateAgentTool: Tool = {
  name: 'update_agent',
  description: `Update an existing agent's settings or configuration.
Examples:
- "Change my email agent's schedule to run hourly"
- "Update the support agent description"
- "Modify agent settings"`,
  category: 'agents',
  requiredPermissions: [Permission.AGENTS_UPDATE],
  parameters: z.object({
    agentId: z.string().describe('ID of agent to update'),
    updates: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['active', 'inactive', 'paused']).optional(),
      configuration: z.any().optional(),
    }),
  }),

  async execute(params, context) {
    try {
      // Verify agent belongs to workspace (security)
      const agent = await db.query.agents.findFirst({
        where: and(eq(agents.id, params.agentId), eq(agents.workspaceId, context.workspaceId)),
      });

      if (!agent) {
        throw new ToolError('Agent not found or access denied', 'NOT_FOUND');
      }

      // Update agent
      const updated = await updateAgentAction(params.agentId, params.updates);

      return {
        success: true,
        data: updated,
        message: `✅ Updated "${agent.name}" successfully`,
        action: {
          type: 'update',
          target: `agent-${params.agentId}`,
          label: 'Agent updated',
        },
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to update agent: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Delete Agent Tool
 * Permanently deletes an agent
 */
export const deleteAgentTool: Tool = {
  name: 'delete_agent',
  description: `Delete an agent permanently. Use with caution!
Examples:
- "Delete the test agent"
- "Remove my old email agent"
- "Get rid of the agent I just created"`,
  category: 'agents',
  requiredPermissions: [Permission.AGENTS_DELETE],
  isDestructive: true, // Requires confirmation
  parameters: z.object({
    agentId: z.string().describe('ID of agent to delete'),
  }),

  async execute(params, context) {
    try {
      // Verify agent belongs to workspace
      const agent = await db.query.agents.findFirst({
        where: and(eq(agents.id, params.agentId), eq(agents.workspaceId, context.workspaceId)),
      });

      if (!agent) {
        throw new ToolError('Agent not found or access denied', 'NOT_FOUND');
      }

      // Delete agent
      await deleteAgentAction(params.agentId);

      return {
        success: true,
        message: `✅ Deleted "${agent.name}" agent`,
        action: {
          type: 'delete',
          target: `agent-${params.agentId}`,
          label: 'Agent deleted',
        },
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to delete agent: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * List Agents Tool
 * Retrieves all agents for the workspace
 */
export const listAgentsTool: Tool = {
  name: 'list_agents',
  description: `List all agents in the workspace.
Examples:
- "Show me all my agents"
- "What agents do I have?"
- "List active agents"`,
  category: 'agents',
  requiredPermissions: [Permission.AGENTS_READ],
  parameters: z.object({
    status: z
      .enum(['all', 'active', 'inactive', 'paused'])
      .default('all')
      .describe('Filter by status'),
    limit: z.number().default(50).describe('Maximum agents to return'),
  }),

  async execute(params, context) {
    try {
      // Query agents with filters
      const conditions = [eq(agents.workspaceId, context.workspaceId)];

      if (params.status !== 'all') {
        conditions.push(eq(agents.status, params.status));
      }

      const agentsList = await db.query.agents.findMany({
        where: and(...conditions),
        orderBy: [desc(agents.createdAt)],
        limit: params.limit,
      });

      // Get execution stats for each agent
      const agentsWithStats = await Promise.all(
        agentsList.map(async (agent) => {
          const executions = await db.query.agentExecutions.findMany({
            where: eq(agentExecutions.agentId, agent.id),
            orderBy: [desc(agentExecutions.createdAt)],
            limit: 10,
          });

          return {
            ...agent,
            executionCount: executions.length,
            lastExecution: executions[0]?.createdAt || null,
            successRate:
              executions.length > 0
                ? (executions.filter((e) => e.status === 'completed').length / executions.length) *
                  100
                : 0,
          };
        }),
      );

      return {
        success: true,
        data: agentsWithStats,
        message: `Found ${agentsWithStats.length} agent(s)`,
      };
    } catch (error: any) {
      throw new ToolError(`Failed to list agents: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Get Agent Analytics Tool
 * Retrieves performance metrics for an agent
 */
export const getAgentAnalyticsTool: Tool = {
  name: 'get_agent_analytics',
  description: `Get performance metrics and analytics for an agent.
Examples:
- "How is my email agent performing?"
- "Show stats for the support agent"
- "What's the success rate of my CRM agent?"`,
  category: 'analytics',
  requiredPermissions: [Permission.ANALYTICS_READ],
  parameters: z.object({
    agentId: z.string().describe('Agent ID to get analytics for'),
    timeRange: z
      .enum(['day', 'week', 'month', 'all'])
      .default('week')
      .describe('Time range for analytics'),
  }),

  async execute(params, context) {
    try {
      // Verify agent access
      const agent = await db.query.agents.findFirst({
        where: and(eq(agents.id, params.agentId), eq(agents.workspaceId, context.workspaceId)),
      });

      if (!agent) {
        throw new ToolError('Agent not found or access denied', 'NOT_FOUND');
      }

      // Calculate time range
      const now = new Date();
      const startDate = new Date();
      switch (params.timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate.setFullYear(2020); // All time
      }

      // Get executions in time range
      const executions = await db.query.agentExecutions.findMany({
        where: and(
          eq(agentExecutions.agentId, params.agentId),
          // Filter by date (would need proper date comparison)
        ),
        orderBy: [desc(agentExecutions.createdAt)],
      });

      // Calculate metrics
      const totalExecutions = executions.length;
      const successfulExecutions = executions.filter((e) => e.status === 'completed').length;
      const failedExecutions = executions.filter((e) => e.status === 'failed').length;
      const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

      const analytics = {
        agent: {
          id: agent.id,
          name: agent.name,
          status: agent.status,
        },
        timeRange: params.timeRange,
        metrics: {
          totalExecutions,
          successfulExecutions,
          failedExecutions,
          successRate: Math.round(successRate),
          averageExecutionTime: 0, // Would calculate from execution data
        },
        recentExecutions: executions.slice(0, 5),
      };

      return {
        success: true,
        data: analytics,
        message: `📊 "${agent.name}" analytics: ${successRate.toFixed(1)}% success rate over ${totalExecutions} executions`,
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to get analytics: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};
