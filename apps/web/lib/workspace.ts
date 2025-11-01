/**
 * Workspace Resolution Utilities
 * Server-side helpers for multi-tenant workspace context
 *
 * Security Rule: 4kR94Z3XhqK4C54vwDDwnq
 * ALL queries MUST include tenant_id filter in WHERE clauses
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { db } from '@galaxyco/database';
import { workspaceMembers, users } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/utils/logger';

export interface WorkspaceResolution {
  id: string;
  source: 'cookie' | 'default' | 'none';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

/**
 * Get current workspace ID using fallback hierarchy:
 * 1. Cookie (server-side persistence)
 * 2. First workspace in user's memberships (DB query)
 * 3. None (redirect to onboarding)
 */
export async function getCurrentWorkspaceId(): Promise<WorkspaceResolution> {
  // 1. Check cookie first
  const cookieStore = cookies();
  const workspaceId = cookieStore.get('workspaceId')?.value;

  if (workspaceId && workspaceId !== 'undefined') {
    return { id: workspaceId, source: 'cookie' };
  }

  // 2. Fallback to first workspace for user
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return { id: '', source: 'none' };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
      with: {
        workspaceMembers: {
          where: eq(workspaceMembers.isActive, true),
          with: {
            workspace: true,
          },
          limit: 1,
        },
      },
    });

    const firstMembership = user?.workspaceMembers[0];

    if (firstMembership?.workspace) {
      const firstWorkspaceId = firstMembership.workspace.id;

      // Set cookie for future requests
      await setWorkspaceCookie(firstWorkspaceId);

      return { id: firstWorkspaceId, source: 'default' };
    }
  } catch (error) {
    logger.error('Failed to fetch default workspace', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return { id: '', source: 'none' };
}

/**
 * Set workspace cookie (HTTP-only, secure, same-site)
 */
export async function setWorkspaceCookie(workspaceId: string): Promise<void> {
  const cookieStore = cookies();

  cookieStore.set('workspaceId', workspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Get full workspace details with user role
 * SECURITY: Validates user has access to workspace
 */
export async function getWorkspaceDetails(workspaceId: string): Promise<Workspace | null> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return null;
    }

    // Find membership for this specific workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId), // REQUIRED: tenant filter
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true),
      ),
      with: {
        workspace: true,
      },
    });

    if (!membership?.workspace) {
      logger.warn('Unauthorized workspace access attempt', {
        clerkUserId,
        workspaceId,
      });
      return null;
    }

    return {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      plan: membership.workspace.subscriptionTier,
      role: membership.role,
    };
  } catch (error) {
    logger.error('Failed to fetch workspace details', {
      workspaceId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * List all workspaces user has access to
 * SECURITY: Only returns workspaces user is a member of
 */
export async function getUserWorkspaces(): Promise<Workspace[]> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return [];
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
      with: {
        workspaceMembers: {
          where: eq(workspaceMembers.isActive, true),
          with: {
            workspace: true,
          },
          orderBy: (workspaceMembers, { asc }) => [asc(workspaceMembers.joinedAt)],
        },
      },
    });

    if (!user) {
      return [];
    }

    return user.workspaceMembers.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      plan: membership.workspace.subscriptionTier,
      role: membership.role,
    }));
  } catch (error) {
    logger.error('Failed to fetch user workspaces', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Validate user has access to specific workspace
 * SECURITY: Prevents cross-tenant data access
 */
export async function validateWorkspaceAccess(workspaceId: string): Promise<boolean> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return false;
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return false;
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId), // REQUIRED: tenant filter
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true),
      ),
    });

    return !!membership;
  } catch (error) {
    logger.error('Failed to validate workspace access', {
      workspaceId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
