import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { workspaces, users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/workspaces/current/security
 * Get workspace security settings
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

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get workspace settings
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Extract security settings from workspace settings
    const settings = workspace.settings as any;
    const securitySettings = {
      twoFactorRequired: settings?.security?.twoFactorRequired || false,
      sessionTimeout: settings?.security?.sessionTimeout || 30, // days
      ipWhitelist: settings?.security?.ipWhitelist || [],
      allowedDomains: settings?.security?.allowedDomains || [],
      passwordPolicy: settings?.security?.passwordPolicy || {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
      },
    };

    return NextResponse.json({
      security: securitySettings,
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch security settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/workspaces/current/security
 * Update workspace security settings
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, ...securitySettings } = body;

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

    // Get current workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Update security settings
    const currentSettings = (workspace.settings as any) || {};
    const updatedSettings = {
      ...currentSettings,
      security: {
        ...(currentSettings.security || {}),
        ...securitySettings,
      },
    };

    await db
      .update(workspaces)
      .set({
        settings: updatedSettings,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId));

    return NextResponse.json({
      success: true,
      security: updatedSettings.security,
    });
  } catch (error) {
    console.error('Update security settings error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update security settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
