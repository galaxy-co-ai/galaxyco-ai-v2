/**
 * GalaxyCo.ai Database Client
 *
 * Multi-tenant safe database access with automatic tenant filtering.
 *
 * SECURITY RULE (4kR94Z3XhqK4C54vwDDwnq):
 * Always use `withTenant(db, workspaceId)` to ensure tenant isolation.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import * as schema from "./schema";

// Handle build-time vs runtime
const getDatabaseUrl = () => {
  // Check if we're in a build environment
  if (
    typeof process.env.DATABASE_URL === "undefined" &&
    process.env.VERCEL_ENV === "production"
  ) {
    // During build, return a dummy URL to prevent errors
    console.warn(
      "DATABASE_URL not available during build, using dummy connection",
    );
    return "postgresql://dummy@localhost/db";
  }

  const url = process.env.DATABASE_URL;

  if (!url) {
    // In development, throw error; in production, return dummy to prevent crash
    if (process.env.NODE_ENV === "production") {
      console.error("DATABASE_URL not set in production!");
      return "postgresql://dummy@localhost/db";
    }
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return url;
};

const sql = neon(getDatabaseUrl(), {
  fetchOptions: {
    signal: AbortSignal.timeout(10000), // 10 second timeout
  },
});

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
            ? and(
                eq(schema.agentExecutions.workspaceId, workspaceId),
                config.where,
              )
            : eq(schema.agentExecutions.workspaceId, workspaceId);
          return database.query.agentExecutions.findMany({ ...config, where });
        },
        findFirst: (config?: any) => {
          const where = config?.where
            ? and(
                eq(schema.agentExecutions.workspaceId, workspaceId),
                config.where,
              )
            : eq(schema.agentExecutions.workspaceId, workspaceId);
          return database.query.agentExecutions.findFirst({ ...config, where });
        },
      },
      workspaceMembers: {
        ...database.query.workspaceMembers,
        findMany: (config?: any) => {
          const where = config?.where
            ? and(
                eq(schema.workspaceMembers.workspaceId, workspaceId),
                config.where,
              )
            : eq(schema.workspaceMembers.workspaceId, workspaceId);
          return database.query.workspaceMembers.findMany({ ...config, where });
        },
        findFirst: (config?: any) => {
          const where = config?.where
            ? and(
                eq(schema.workspaceMembers.workspaceId, workspaceId),
                config.where,
              )
            : eq(schema.workspaceMembers.workspaceId, workspaceId);
          return database.query.workspaceMembers.findFirst({
            ...config,
            where,
          });
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
  workspaceId: string,
): Promise<boolean> {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(schema.workspaceMembers.userId, userId),
      eq(schema.workspaceMembers.workspaceId, workspaceId),
      eq(schema.workspaceMembers.isActive, true),
    ),
  });

  if (!member) {
    // Log security incident (rule 4kR94Z3XhqK4C54vwDDwnq)
    console.error("[SECURITY] Unauthorized tenant access attempt", {
      userId,
      workspaceId,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Unauthorized: No access to this workspace");
  }

  return true;
}

// Re-export schema and types
export * from "./schema";
export type { NeonHttpDatabase as NeonDatabase } from "drizzle-orm/neon-http";
