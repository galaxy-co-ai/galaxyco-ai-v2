import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import {
  users,
  workspaceMembers,
  contacts,
  tasks,
  calendarEvents,
  emailThreads,
} from '@galaxyco/database/schema';
import { eq, and, count, gte } from 'drizzle-orm';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/analytics/outreach
 * List all analytics/outreach for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized analytics/outreach list request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: User not a member of this workspace' },
        { status: 403 },
      );
    }

    // 5. Fetch outreach analytics from database
    const dateRange = searchParams.get('dateRange') || '30d';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Total contacts
    const contactCount = await db
      .select({ count: count() })
      .from(contacts)
      .where(eq(contacts.workspaceId, workspaceId));

    // Total tasks
    const taskCount = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId));

    // Tasks by status
    const tasksByStatus = await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId))
      .groupBy(tasks.status);

    // Calendar events in period
    const eventCount = await db
      .select({ count: count() })
      .from(calendarEvents)
      .where(
        and(eq(calendarEvents.workspaceId, workspaceId), gte(calendarEvents.startTime, startDate)),
      );

    // Email threads in period
    const emailCount = await db
      .select({ count: count() })
      .from(emailThreads)
      .where(
        and(eq(emailThreads.workspaceId, workspaceId), gte(emailThreads.createdAt, startDate)),
      );

    const analytics = {
      contacts: {
        total: contactCount[0]?.count || 0,
      },
      tasks: {
        total: taskCount[0]?.count || 0,
        byStatus: tasksByStatus,
      },
      events: {
        total: eventCount[0]?.count || 0,
        period: dateRange,
      },
      emails: {
        total: emailCount[0]?.count || 0,
        period: dateRange,
      },
    };

    return NextResponse.json({
      analytics,
      workspaceId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('List analytics/outreach error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch analytics/outreach' }, { status: 500 });
  }
}
