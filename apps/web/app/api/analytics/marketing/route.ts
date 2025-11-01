import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import {
  users,
  workspaceMembers,
  campaigns,
  prospects,
  emailThreads,
} from '@galaxyco/database/schema';
import { eq, and, count, gte } from 'drizzle-orm';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/analytics/marketing
 * List all analytics/marketing for a workspace
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
      logger.warn('Unauthorized analytics/marketing list request');
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

    // 5. Fetch marketing analytics from database
    const dateRange = searchParams.get('dateRange') || '30d';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Total campaigns
    const campaignCount = await db
      .select({ count: count() })
      .from(campaigns)
      .where(eq(campaigns.workspaceId, workspaceId));

    // Campaigns by status
    const campaignsByStatus = await db
      .select({
        status: campaigns.status,
        count: count(),
      })
      .from(campaigns)
      .where(eq(campaigns.workspaceId, workspaceId))
      .groupBy(campaigns.status);

    // Total prospects
    const prospectCount = await db
      .select({ count: count() })
      .from(prospects)
      .where(eq(prospects.workspaceId, workspaceId));

    // Prospects by stage
    const prospectsByStage = await db
      .select({
        stage: prospects.stage,
        count: count(),
      })
      .from(prospects)
      .where(eq(prospects.workspaceId, workspaceId))
      .groupBy(prospects.stage);

    // Email threads count
    const emailCount = await db
      .select({ count: count() })
      .from(emailThreads)
      .where(
        and(eq(emailThreads.workspaceId, workspaceId), gte(emailThreads.createdAt, startDate)),
      );

    const analytics = {
      campaigns: {
        total: campaignCount[0]?.count || 0,
        byStatus: campaignsByStatus,
      },
      prospects: {
        total: prospectCount[0]?.count || 0,
        byStage: prospectsByStage,
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
    logger.error('List analytics/marketing error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch analytics/marketing' }, { status: 500 });
  }
}
