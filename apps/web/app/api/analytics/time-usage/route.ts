import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers, tasks } from "@galaxyco/database/schema";
import { eq, and, count, gte, sql } from "drizzle-orm";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/analytics/time-usage
 * List all analytics/time-usage for a workspace
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
      logger.warn("Unauthorized analytics/time-usage list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 5. Fetch time usage analytics from database
    const dateRange = searchParams.get("dateRange") || "30d";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Tasks completed in period
    const completedTasks = await db
      .select({ count: count() })
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          eq(tasks.status, "done"),
          gte(tasks.updatedAt, startDate),
        ),
      );

    // Tasks by priority
    const tasksByPriority = await db
      .select({
        priority: tasks.priority,
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId))
      .groupBy(tasks.priority);

    // Tasks by assignee (top 10)
    const tasksByAssignee = await db
      .select({
        assignedTo: tasks.assignedTo,
        count: count(),
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.workspaceId, workspaceId),
          sql`${tasks.assignedTo} IS NOT NULL`,
        ),
      )
      .groupBy(tasks.assignedTo)
      .limit(10);

    const analytics = {
      tasks: {
        completed: completedTasks[0]?.count || 0,
        period: dateRange,
      },
      distribution: {
        byPriority: tasksByPriority,
        byAssignee: tasksByAssignee,
      },
    };

    return NextResponse.json({
      analytics,
      workspaceId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("List analytics/time-usage error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch analytics/time-usage" },
      { status: 500 },
    );
  }
}
