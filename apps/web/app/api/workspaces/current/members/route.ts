import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { workspaceMembers, users } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/workspaces/current/members
 * Get workspace team members
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, currentUser.id),
      ),
    });

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all workspace members
    const members = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    const formattedMembers = members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      isActive: m.isActive,
      joinedAt: m.joinedAt,
      user: {
        id: m.user.id,
        email: m.user.email,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        avatarUrl: m.user.avatarUrl,
        name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
      },
    }));

    return NextResponse.json({
      members: formattedMembers,
      total: formattedMembers.length,
    });
  } catch (error) {
    console.error('Get workspace members error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch workspace members',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workspaces/current/members
 * Invite new team member (stub - would need email service)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, email, role = 'member' } = body;

    if (!workspaceId || !email) {
      return NextResponse.json({ error: 'workspaceId and email are required' }, { status: 400 });
    }

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user has admin access
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, currentUser.id),
      ),
    });

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // TODO: In real implementation:
    // 1. Create invitation record
    // 2. Send invitation email
    // 3. Return invitation details

    return NextResponse.json({
      success: true,
      message: 'Invitation would be sent (stub implementation)',
      invitation: {
        email,
        role,
        workspaceId,
        status: 'pending',
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Invite member error:', error);
    return NextResponse.json(
      {
        error: 'Failed to invite member',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
