/**
 * Tenant Context Middleware
 *
 * Ensures workspace_id is available in all requests
 * and validates user has access to the workspace
 */

import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export interface TenantContext {
  userId: string;
  workspaceId: string;
  userDbId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

/**
 * Get tenant context from request
 *
 * This should be called at the start of every API route
 * to enforce multi-tenant isolation
 */
export async function getTenantContext(workspaceId: string): Promise<TenantContext | null> {
  try {
    // 1. Get authenticated user
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return null;
    }

    // 2. Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return null;
    }

    // 3. Verify workspace membership
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, user.id)),
      );

    if (!membership || !membership.isActive) {
      return null;
    }

    // 4. Return tenant context
    return {
      userId: clerkUserId,
      workspaceId,
      userDbId: user.id,
      role: membership.role,
    };
  } catch (error) {
    console.error('[Tenant Context Error]', error);
    return null;
  }
}

/**
 * Require tenant context (throws if not authorized)
 *
 * Use this in API routes that require workspace access
 */
export async function requireTenantContext(workspaceId: string): Promise<TenantContext> {
  const context = await getTenantContext(workspaceId);

  if (!context) {
    throw new Error('Unauthorized: Invalid workspace access');
  }

  return context;
}

/**
 * Check if user has specific role
 */
export function hasRole(
  context: TenantContext,
  minRole: 'owner' | 'admin' | 'member' | 'viewer',
): boolean {
  const roleHierarchy = {
    owner: 4,
    admin: 3,
    member: 2,
    viewer: 1,
  };

  return roleHierarchy[context.role] >= roleHierarchy[minRole];
}

/**
 * Require specific role (throws if insufficient permissions)
 */
export function requireRole(
  context: TenantContext,
  minRole: 'owner' | 'admin' | 'member' | 'viewer',
): void {
  if (!hasRole(context, minRole)) {
    throw new Error(`Unauthorized: Requires ${minRole} role or higher`);
  }
}
