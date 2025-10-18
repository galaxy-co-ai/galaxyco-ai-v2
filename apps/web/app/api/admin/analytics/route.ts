import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { checkSystemAdmin } from "@/lib/auth/admin-check";
import { db } from "@galaxyco/database";
import {
  users,
  workspaces,
  agents,
  agentExecutions,
} from "@galaxyco/database/schema";
import { count, gte } from "drizzle-orm";

/**
 * GET /api/admin/analytics
 * Get cross-tenant analytics (admin only)
 *
 * Query params:
 * - period: optional (last-7-days, last-30-days, etc.)
 * - metric: optional (users, workspaces, executions, etc.)
 *
 * Requires: Admin or Owner role
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized admin analytics request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn("Non-admin attempted to access analytics", { clerkUserId });
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    // 3. Get query params
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") || "last-30-days";
    const metric = searchParams.get("metric") || "overview";

    // 4. Fetch cross-tenant analytics from database
    const startDate = new Date();
    if (period === "last-7-days") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    // Total workspaces
    const workspaceCount = await db.select({ count: count() }).from(workspaces);

    // Total users
    const userCount = await db.select({ count: count() }).from(users);

    // Active users (logged in within period)
    const activeUserCount = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.lastLoginAt, startDate));

    // Total agents
    const agentCount = await db.select({ count: count() }).from(agents);

    // Total executions
    const executionCount = await db
      .select({ count: count() })
      .from(agentExecutions);

    // Recent executions
    const recentExecutionCount = await db
      .select({ count: count() })
      .from(agentExecutions)
      .where(gte(agentExecutions.startedAt, startDate));

    const analytics = {
      period,
      metric,
      data: {
        totalWorkspaces: workspaceCount[0]?.count || 0,
        totalUsers: userCount[0]?.count || 0,
        activeUsers: activeUserCount[0]?.count || 0,
        totalAgents: agentCount[0]?.count || 0,
        totalExecutions: executionCount[0]?.count || 0,
        recentExecutions: recentExecutionCount[0]?.count || 0,
      },
      generatedAt: new Date().toISOString(),
    };

    logger.info("Admin analytics fetched", {
      userId: adminCheck.user.id,
      period,
      metric,
    });

    return NextResponse.json({
      analytics,
    });
  } catch (error) {
    logger.error("List admin/analytics error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch admin/analytics" },
      { status: 500 },
    );
  }
}
