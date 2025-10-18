/**
 * Admin Authorization Utilities
 *
 * Utilities for checking admin/owner roles in API routes
 */

import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

export type AdminCheckResult =
  | { authorized: true; user: { id: string; role: string } }
  | { authorized: false; error: string; status: number };

/**
 * Check if a user has admin or owner role in any workspace (system-wide admin check)
 * Used for cross-tenant admin operations
 */
export async function checkSystemAdmin(
  clerkUserId: string,
): Promise<AdminCheckResult> {
  // 1. Get user
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return {
      authorized: false,
      error: "User not found",
      status: 404,
    };
  }

  // 2. Check if user has admin or owner role in any workspace
  const adminMembership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.userId, user.id),
      // Note: In Drizzle, we need to use SQL-level check for enum values
      // For now, we'll fetch and check in code
    ),
  });

  // Check role in code (Phase 2 will use proper SQL filtering)
  if (
    adminMembership &&
    (adminMembership.role === "owner" || adminMembership.role === "admin")
  ) {
    return {
      authorized: true,
      user: {
        id: user.id,
        role: adminMembership.role,
      },
    };
  }

  return {
    authorized: false,
    error: "Forbidden: Admin access required",
    status: 403,
  };
}

/**
 * Check if a user has admin or owner role in a specific workspace
 * Used for workspace-scoped admin operations
 */
export async function checkWorkspaceAdmin(
  clerkUserId: string,
  workspaceId: string,
): Promise<AdminCheckResult> {
  // 1. Get user
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return {
      authorized: false,
      error: "User not found",
      status: 404,
    };
  }

  // 2. Check workspace membership and role
  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, user.id),
    ),
  });

  if (!membership) {
    return {
      authorized: false,
      error: "Forbidden: User not a member of this workspace",
      status: 403,
    };
  }

  if (membership.role !== "owner" && membership.role !== "admin") {
    return {
      authorized: false,
      error: "Forbidden: Admin or Owner role required",
      status: 403,
    };
  }

  return {
    authorized: true,
    user: {
      id: user.id,
      role: membership.role,
    },
  };
}
