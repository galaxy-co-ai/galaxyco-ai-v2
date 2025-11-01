/**
 * Database Tools
 *
 * Tools for agents to query and interact with workspace data.
 * These tools are multi-tenant safe and respect workspace boundaries.
 *
 * SECURITY (Rule 4kR94Z3XhqK4C54vwDDwnq):
 * All queries use withTenant() helper to enforce workspace isolation.
 */

import { createTool } from '../tools';
import type { Tool, ExecutionContext } from '../types';
import { db, withTenant, agents } from '@galaxyco/database';
import { like, or, eq } from 'drizzle-orm';

/**
 * Search agents in workspace
 */
export function createSearchAgentsTool(): Tool {
  return createTool(
    'search_agents',
    'Search for agents in the current workspace by name, type, or description',
    {
      query: {
        type: 'string',
        description: 'Search query (name, type, or description)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 10)',
        required: false,
      },
    },
    async (args: { query: string; limit?: number }, context?: ExecutionContext) => {
      try {
        if (!context?.workspaceId) {
          return {
            success: false,
            error: 'Workspace context required for database queries',
            agents: [],
          };
        }

        const { query, limit = 10 } = args;
        const { workspaceId } = context;

        // Query using withTenant for workspace isolation
        const tenantDb = withTenant(db, workspaceId);
        const results = await tenantDb.query.agents.findMany({
          where: or(like(agents.name, `%${query}%`), like(agents.description, `%${query}%`)),
          limit,
          columns: {
            id: true,
            name: true,
            type: true,
            status: true,
            description: true,
          },
        });

        return {
          success: true,
          agents: results,
          count: results.length,
          query,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to search agents',
          agents: [],
        };
      }
    },
  );
}

/**
 * Get agent details by ID
 */
export function createGetAgentTool(): Tool {
  return createTool(
    'get_agent',
    'Get detailed information about a specific agent by ID',
    {
      agentId: {
        type: 'string',
        description: 'The ID of the agent to retrieve',
      },
    },
    async (args: { agentId: string }, context?: ExecutionContext) => {
      try {
        if (!context?.workspaceId) {
          return {
            success: false,
            error: 'Workspace context required for database queries',
          };
        }

        const { agentId } = args;
        const { workspaceId } = context;

        // Query agent with workspace isolation
        const tenantDb = withTenant(db, workspaceId);
        const agent = await tenantDb.query.agents.findFirst({
          where: eq(agents.id, agentId),
        });

        if (!agent) {
          return {
            success: false,
            error: `Agent ${agentId} not found in workspace`,
          };
        }

        return {
          success: true,
          agent: {
            id: agent.id,
            name: agent.name,
            type: agent.type,
            status: agent.status,
            description: agent.description,
            config: agent.config,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to get agent',
        };
      }
    },
  );
}

/**
 * Get workspace statistics
 */
export function createGetWorkspaceStatsTool(): Tool {
  return createTool(
    'get_workspace_stats',
    'Get statistics about the current workspace (agent count, executions, etc.)',
    {},
    async (args: Record<string, never>, context?: ExecutionContext) => {
      try {
        if (!context?.workspaceId) {
          return {
            success: false,
            error: 'Workspace context required for database queries',
          };
        }

        const { workspaceId } = context;

        // Get all agents for this workspace
        const tenantDb = withTenant(db, workspaceId);
        const allAgents = await tenantDb.query.agents.findMany();

        const totalAgents = allAgents.length;
        const activeAgents = allAgents.filter((agent) => agent.status === 'active').length;

        // Get execution counts
        const allExecutions = await tenantDb.query.agentExecutions.findMany();

        return {
          success: true,
          stats: {
            totalAgents,
            activeAgents,
            totalExecutions: allExecutions.length,
            workspaceId,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to get workspace stats',
        };
      }
    },
  );
}

/**
 * Create all database tools
 */
export function createDatabaseTools(): Tool[] {
  return [createSearchAgentsTool(), createGetAgentTool(), createGetWorkspaceStatsTool()];
}
