import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, agents, knowledgeItems } from '@galaxyco/database/schema';
import { eq, and, count, gte } from 'drizzle-orm';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/analytics/usage
 * List all analytics/usage for a workspace
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
      logger.warn('Unauthorized analytics/usage list request');
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

    // 5. Fetch usage analytics from database
    const dateRange = searchParams.get('dateRange') || '30d';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Total agents
    const agentCount = await db
      .select({ count: count() })
      .from(agents)
      .where(eq(agents.workspaceId, workspaceId));

    // Active agents
    const activeAgentCount = await db
      .select({ count: count() })
      .from(agents)
      .where(and(eq(agents.workspaceId, workspaceId), eq(agents.status, 'active')));

    // Total knowledge items
    const knowledgeItemCount = await db
      .select({ count: count() })
      .from(knowledgeItems)
      .where(eq(knowledgeItems.workspaceId, workspaceId));

    // Recent knowledge items
    const recentKnowledgeItemCount = await db
      .select({ count: count() })
      .from(knowledgeItems)
      .where(
        and(eq(knowledgeItems.workspaceId, workspaceId), gte(knowledgeItems.createdAt, startDate)),
      );

    const analytics = {
      agents: {
        total: agentCount[0]?.count || 0,
        active: activeAgentCount[0]?.count || 0,
      },
      knowledge: {
        total: knowledgeItemCount[0]?.count || 0,
        recent: recentKnowledgeItemCount[0]?.count || 0,
        period: dateRange,
      },
    };

    return NextResponse.json({
      analytics,
      workspaceId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('List analytics/usage error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch analytics/usage' }, { status: 500 });
  }
}
