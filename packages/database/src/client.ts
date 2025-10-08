/**
 * GalaxyCo.ai Database Client
 * 
 * Multi-tenant safe database access with automatic tenant filtering.
 * 
 * SECURITY RULE (4kR94Z3XhqK4C54vwDDwnq):
 * Always use `withTenant(db, workspaceId)` to ensure tenant isolation.
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, SQL } from 'drizzle-orm';
import * as schema from './schema';

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

/**
 * Multi-tenant query builder helper
 * 
 * Usage:
 * ```ts
 * const tenantDb = withTenant(db, workspaceId);
 * const agents = await tenantDb.query.agents.findMany();
 * ```
 * 
 * This helper automatically adds `workspaceId` filter to all queries
 * for tables that have a `workspaceId` column.
 */
export function withTenant(database: typeof db, workspaceId: string) {
  return {
    ...database,
    // Wrap query builder to auto-inject tenant filter
    query: {
      ...database.query,
      // Add tenant filters to applicable tables
      agents: {
        ...database.query.agents,
        findMany: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.agents.workspaceId, workspaceId), config.where)
            : eq(schema.agents.workspaceId, workspaceId);
          return database.query.agents.findMany({ ...config, where });
        },
        findFirst: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.agents.workspaceId, workspaceId), config.where)
            : eq(schema.agents.workspaceId, workspaceId);
          return database.query.agents.findFirst({ ...config, where });
        },
      },
      agentExecutions: {
        ...database.query.agentExecutions,
        findMany: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.agentExecutions.workspaceId, workspaceId), config.where)
            : eq(schema.agentExecutions.workspaceId, workspaceId);
          return database.query.agentExecutions.findMany({ ...config, where });
        },
        findFirst: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.agentExecutions.workspaceId, workspaceId), config.where)
            : eq(schema.agentExecutions.workspaceId, workspaceId);
          return database.query.agentExecutions.findFirst({ ...config, where });
        },
      },
      workspaceMembers: {
        ...database.query.workspaceMembers,
        findMany: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.workspaceMembers.workspaceId, workspaceId), config.where)
            : eq(schema.workspaceMembers.workspaceId, workspaceId);
          return database.query.workspaceMembers.findMany({ ...config, where });
        },
        findFirst: (config?: any) => {
          const where = config?.where
            ? and(eq(schema.workspaceMembers.workspaceId, workspaceId), config.where)
            : eq(schema.workspaceMembers.workspaceId, workspaceId);
          return database.query.workspaceMembers.findFirst({ ...config, where });
        },
      },
    },
  };
}

/**
 * Utility to validate tenant access
 * Throws error if user doesn't have access to workspace
 */
export async function validateTenantAccess(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(schema.workspaceMembers.userId, userId),
      eq(schema.workspaceMembers.workspaceId, workspaceId),
      eq(schema.workspaceMembers.isActive, true)
    ),
  });

  if (!member) {
    // Log security incident (rule 4kR94Z3XhqK4C54vwDDwnq)
    console.error('[SECURITY] Unauthorized tenant access attempt', {
      userId,
      workspaceId,
      timestamp: new Date().toISOString(),
    });
    throw new Error('Unauthorized: No access to this workspace');
  }

  return true;
}

// Re-export schema and types
export * from './schema';
export type { NeonHttpDatabase as NeonDatabase } from 'drizzle-orm/neon-http';
