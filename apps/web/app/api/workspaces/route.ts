import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { workspaceMembers, users } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/workspaces
 * List all workspaces for the authenticated user
 */
export async function GET() {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json([
        {
          id: 'dev-workspace-123',
          name: 'Development Workspace',
          slug: 'dev-workspace',
          role: 'admin',
        },
      ]);
    }
    
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. First find the user by clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 3. Fetch user's workspaces through memberships
    const memberships = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, user.id),
      with: {
        workspace: true,
      },
    });

    // 4. Transform to workspace format expected by frontend
    const workspaces = memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
    }));

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('[API] List workspaces error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}