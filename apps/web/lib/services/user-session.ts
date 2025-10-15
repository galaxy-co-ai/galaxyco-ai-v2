/**
 * User Session Service
 * 
 * Maps Clerk authentication to database users and workspaces.
 * Handles user creation on first login via Clerk webhook.
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, workspaces } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export interface UserSession {
  userId: string; // Database user ID
  clerkUserId: string;
  workspaceId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export class UserSessionService {
  /**
   * Get current user session with workspace
   */
  async getCurrentSession(): Promise<UserSession | null> {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return null;
    }

    // Find user in database by Clerk ID
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!dbUser) {
      // User doesn't exist yet - this should only happen if webhook failed
      // Try to create them from Clerk data
      const clerkUser = await currentUser();
      if (!clerkUser) return null;

      return await this.createUserFromClerk(clerkUser);
    }

    // Get user's workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, dbUser.id),
      with: {
        workspace: true,
      },
    });

    if (!membership) {
      throw new Error('User has no workspace membership');
    }

    return {
      userId: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      workspaceId: membership.workspaceId,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: membership.role,
    };
  }

  /**
   * Create user and workspace from Clerk data
   * Called on first login or from Clerk webhook
   */
  async createUserFromClerk(clerkUser: any): Promise<UserSession> {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error('No email address found for Clerk user');
    }

    // Check if user already exists
    let dbUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });

    if (!dbUser) {
      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId: clerkUser.id,
          email,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          avatarUrl: clerkUser.imageUrl,
        })
        .returning();
      
      dbUser = newUser;
    }

    // Check if user has a workspace
    let membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, dbUser.id),
      with: {
        workspace: true,
      },
    });

    if (!membership) {
      // Create default workspace for user
      const workspaceName = clerkUser.firstName 
        ? `${clerkUser.firstName}'s Workspace`
        : 'My Workspace';
      
      const [workspace] = await db
        .insert(workspaces)
        .values({
          name: workspaceName,
          slug: `${dbUser.id.slice(0, 8)}-workspace`,
          clerkOrganizationId: null, // Can be set later if using Clerk orgs
        })
        .returning();

      // Add user as owner
      await db.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: dbUser.id,
        role: 'owner',
      });

      // Fetch membership
      membership = await db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.userId, dbUser.id),
          eq(workspaceMembers.workspaceId, workspace.id)
        ),
        with: {
          workspace: true,
        },
      });
    }

    if (!membership) {
      throw new Error('Failed to create workspace membership');
    }

    return {
      userId: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      workspaceId: membership.workspaceId,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: membership.role,
    };
  }

  /**
   * Get user ID from Clerk user ID
   */
  async getUserIdFromClerkId(clerkUserId: string): Promise<string | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    return user?.id || null;
  }

  /**
   * Get workspace ID for user
   */
  async getWorkspaceIdForUser(userId: string): Promise<string | null> {
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, userId),
    });

    return membership?.workspaceId || null;
  }
}

// Export singleton instance
export const userSessionService = new UserSessionService();

/**
 * Helper function to get session in API routes
 */
export async function requireSession(): Promise<UserSession> {
  const session = await userSessionService.getCurrentSession();
  
  if (!session) {
    throw new Error('Unauthorized - no valid session');
  }

  return session;
}
