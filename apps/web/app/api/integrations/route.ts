import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/integrations
 * Get workspace integrations
 *
 * NOTE: Stub implementation - would query integrations table in production
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

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user has access
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // TODO: Query integrations table when it exists
    // For now, return stub data with common integration types

    const stubIntegrations = [
      {
        id: 'gmail-stub',
        name: 'Gmail',
        type: 'gmail',
        status: 'inactive',
        description: 'Send and read emails through Gmail',
        config: {},
        connectedAt: null,
      },
      {
        id: 'calendar-stub',
        name: 'Google Calendar',
        type: 'calendar',
        status: 'inactive',
        description: 'Create and manage calendar events',
        config: {},
        connectedAt: null,
      },
      {
        id: 'slack-stub',
        name: 'Slack',
        type: 'slack',
        status: 'inactive',
        description: 'Send notifications to Slack channels',
        config: {},
        connectedAt: null,
      },
      {
        id: 'github-stub',
        name: 'GitHub',
        type: 'github',
        status: 'inactive',
        description: 'Create issues and PRs automatically',
        config: {},
        connectedAt: null,
      },
    ];

    return NextResponse.json({
      integrations: stubIntegrations,
      total: stubIntegrations.length,
    });
  } catch (error) {
    console.error('Get integrations error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch integrations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/integrations
 * Create or update an integration
 *
 * NOTE: Stub implementation
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, name, type, config } = body;

    if (!workspaceId || !name || !type) {
      return NextResponse.json(
        { error: 'workspaceId, name, and type are required' },
        { status: 400 },
      );
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user has admin access
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // TODO: Create integration record in database

    return NextResponse.json({
      success: true,
      message: 'Integration would be created (stub)',
      integration: {
        id: Math.random().toString(36).substring(7),
        name,
        type,
        status: 'active',
        config,
        connectedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Create integration error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create integration',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
