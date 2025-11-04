import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { auditLogs } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

/**
 * GET /api/activity/stats
 * Get activity statistics for a workspace
 *
 * Query params:
 * - workspaceId: string (required)
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

    z.string().uuid().parse(workspaceId);

    // Get all activities for the workspace
    const activities = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId));

    // Calculate stats
    const stats = {
      total: activities.length,
      byAction: activities.reduce(
        (acc, activity) => {
          acc[activity.action] = (acc[activity.action] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byResourceType: activities.reduce(
        (acc, activity) => {
          acc[activity.resourceType] = (acc[activity.resourceType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      recent24h: activities.filter(
        (a) => new Date(a.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000,
      ).length,
      recent7d: activities.filter(
        (a) => new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).length,
      recent30d: activities.filter(
        (a) => new Date(a.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).length,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('[Activity Stats Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid workspaceId' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch activity stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
