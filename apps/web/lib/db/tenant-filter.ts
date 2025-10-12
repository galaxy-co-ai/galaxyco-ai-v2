/**
 * Multi-tenancy utilities for database queries
 * 
 * SECURITY CRITICAL: All database queries MUST include tenant_id filters
 * to prevent cross-tenant data access.
 */

import { eq, and, SQL } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, workspaceMembers } from '@galaxyco/database/schema';

export interface TenantContext {
  tenantId: string;
  userId: string;
}

/**
 * Get the current tenant context from Clerk session
 * @throws {Error} If user is not authenticated or tenant not found
 */
export async function getCurrentTenantContext(): Promise<TenantContext> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Get user's workspace memberships from database
  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.userId, 
        db.select({ id: users.id }).from(users).where(eq(users.clerkUserId, userId)).limit(1)
      ),
      eq(workspaceMembers.isActive, true)
    ),
    columns: {
      workspaceId: true,
      userId: true,
    },
  });

  if (!membership || !membership.workspaceId) {
    throw new Error('User workspace not found');
  }

  return {
    tenantId: membership.workspaceId,
    userId: membership.userId,
  };
}

/**
 * Create a tenant filter for database queries
 * @param tenantId The tenant ID to filter by
 * @returns Drizzle filter condition
 */
export function withTenantFilter(tenantId: string, tenantColumn: any): SQL {
  if (!tenantId) {
    throw new Error('tenant_id required for query');
  }
  return eq(tenantColumn, tenantId);
}

/**
 * Combine multiple conditions with tenant filter
 * @param tenantId The tenant ID to filter by
 * @param tenantColumn The tenant column to filter on
 * @param additionalConditions Additional where conditions
 * @returns Combined where clause
 */
export function withTenantAndConditions(
  tenantId: string,
  tenantColumn: any,
  ...additionalConditions: SQL[]
): SQL {
  const tenantFilter = withTenantFilter(tenantId, tenantColumn);
  
  if (additionalConditions.length === 0) {
    return tenantFilter;
  }
  
  return and(tenantFilter, ...additionalConditions)!;
}

/**
 * Validate that a resource belongs to the current tenant
 * @param userTenantId The user's tenant ID
 * @param resourceTenantId The resource's tenant ID
 * @throws {Error} If tenant IDs don't match
 */
export function validateTenantAccess(userTenantId: string, resourceTenantId: string): void {
  if (userTenantId !== resourceTenantId) {
    // Log security incident
    console.error('[SECURITY] Cross-tenant access attempt', {
      userTenantId,
      resourceTenantId,
      timestamp: new Date().toISOString(),
      stack: new Error().stack,
    });
    
    throw new Error('Cross-tenant access denied');
  }
}

/**
 * Higher-order function to ensure tenant isolation in database operations
 * @param operation The database operation to execute
 * @returns Wrapped operation with tenant context
 */
export function withTenantIsolation<T>(
  operation: (context: TenantContext) => Promise<T>
): () => Promise<T> {
  return async (): Promise<T> => {
    const context = await getCurrentTenantContext();
    return operation(context);
  };
}

/**
 * Type guard to ensure tenant_id is present on query results
 * @param resource The resource to check
 * @param tenantId The expected tenant ID
 * @returns True if resource belongs to tenant
 */
export function belongsToTenant(
  resource: { tenantId?: string },
  tenantId: string
): resource is { tenantId: string } {
  return resource.tenantId === tenantId;
}