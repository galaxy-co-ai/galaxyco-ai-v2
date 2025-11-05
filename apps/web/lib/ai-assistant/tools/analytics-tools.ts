/**
 * Analytics & Reporting Tools
 *
 * Tools for querying platform analytics, metrics, and usage data.
 * These tools allow the AI Assistant to:
 * - Get dashboard statistics
 * - Query agent performance
 * - Show usage metrics
 * - Generate reports
 */

import { z } from 'zod';
import { type Tool, Permission, ToolError } from './types';
import { db } from '@galaxyco/database';
import { agents, agentExecutions, workspaces } from '@galaxyco/database/schema';
import { eq, and, gte, count, sql } from 'drizzle-orm';

/**
 * Get Dashboard Stats Tool
 * Retrieves overview metrics for the workspace
 */
export const getDashboardStatsTool: Tool = {
  name: 'get_dashboard_stats',
  description: `Get dashboard overview statistics and metrics.
Examples:
- "Show me my dashboard stats"
- "What's my workspace overview?"
- "Give me a summary of my platform usage"`,
  category: 'analytics',
  requiredPermissions: [Permission.ANALYTICS_READ],
  parameters: z.object({
    timeRange: z
      .enum(['today', 'week', 'month', 'all'])
      .default('week')
      .describe('Time range for stats'),
  }),

  async execute(params, context) {
    try {
      // Get agent counts by status
      const agentStats = await db
        .select({
          status: agents.status,
          count: count(),
        })
        .from(agents)
        .where(eq(agents.workspaceId, context.workspaceId))
        .groupBy(agents.status);

      // Get execution stats
      const executionStats = await db
        .select({
          status: agentExecutions.status,
          count: count(),
        })
        .from(agentExecutions)
        .innerJoin(agents, eq(agentExecutions.agentId, agents.id))
        .where(eq(agents.workspaceId, context.workspaceId))
        .groupBy(agentExecutions.status);

      // Calculate totals
      const totalAgents = agentStats.reduce((sum, stat) => sum + Number(stat.count), 0);
      const activeAgents = agentStats.find((s) => s.status === 'active')?.count || 0;
      const totalExecutions = executionStats.reduce((sum, stat) => sum + Number(stat.count), 0);
      const successfulExecutions = executionStats.find((s) => s.status === 'completed')?.count || 0;

      const stats = {
        agents: {
          total: totalAgents,
          active: Number(activeAgents),
          byStatus: Object.fromEntries(agentStats.map((s) => [s.status, Number(s.count)])),
        },
        executions: {
          total: totalExecutions,
          successful: Number(successfulExecutions),
          successRate:
            totalExecutions > 0
              ? Math.round((Number(successfulExecutions) / totalExecutions) * 100)
              : 0,
          byStatus: Object.fromEntries(executionStats.map((s) => [s.status, Number(s.count)])),
        },
        timeRange: params.timeRange,
      };

      return {
        success: true,
        data: stats,
        message: `📊 Dashboard Stats: ${totalAgents} agent(s), ${totalExecutions} execution(s), ${stats.executions.successRate}% success rate`,
      };
    } catch (error: any) {
      throw new ToolError(`Failed to get dashboard stats: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Get Usage Metrics Tool
 * Shows AI usage and resource consumption
 */
export const getUsageMetricsTool: Tool = {
  name: 'get_usage_metrics',
  description: `Get AI usage metrics and resource consumption.
Examples:
- "How much AI have I used this month?"
- "Show my usage statistics"
- "What's my token consumption?"`,
  category: 'analytics',
  requiredPermissions: [Permission.ANALYTICS_READ],
  parameters: z.object({
    period: z.enum(['today', 'week', 'month']).default('month').describe('Usage period'),
  }),

  async execute(params, context) {
    try {
      // Get workspace subscription tier
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, context.workspaceId),
      });

      if (!workspace) {
        throw new ToolError('Workspace not found', 'NOT_FOUND');
      }

      // Get execution counts (proxy for usage)
      const executions = await db.query.agentExecutions.findMany({
        where: and(
          sql`${agentExecutions.agentId} IN (
            SELECT id FROM ${agents} WHERE workspace_id = ${context.workspaceId}
          )`,
        ),
        limit: 1000, // Get last 1000 executions
      });

      const usage = {
        period: params.period,
        subscriptionTier: workspace.subscriptionTier,
        metrics: {
          totalExecutions: executions.length,
          avgExecutionsPerDay: Math.round(executions.length / 30), // Simplified
          // In production, would calculate actual token usage from AI Gateway logs
          estimatedTokens: executions.length * 1000, // Rough estimate
        },
        limits: {
          tier: workspace.subscriptionTier,
          // Would fetch actual limits from subscription config
        },
      };

      return {
        success: true,
        data: usage,
        message: `📊 ${params.period} usage: ${usage.metrics.totalExecutions} executions on ${usage.subscriptionTier} tier`,
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to get usage metrics: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};
