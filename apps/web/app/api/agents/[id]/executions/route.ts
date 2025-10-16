import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import {
  agentExecutions,
  agents,
  workspaceMembers,
  users,
} from "@galaxyco/database/schema";
import { eq, and, desc, gte, lte, count, sql } from "drizzle-orm";

/**
 * GET /api/agents/[id]/executions
 * Fetch paginated execution history for an agent with filtering
 *
 * Query parameters:
 * - page: number (default 1)
 * - limit: number (default 20, max 100)
 * - status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
 * - trigger: 'manual' | 'scheduled' | 'webhook'
 * - startDate: ISO date string
 * - endDate: ISO date string
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = params.id;
    const url = new URL(req.url);

    // Parse query parameters
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(url.searchParams.get("limit") || "20")),
    );
    const status = url.searchParams.get("status") as
      | "pending"
      | "running"
      | "completed"
      | "failed"
      | "cancelled"
      | null;
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // 1. Verify agent exists and user has access
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 2. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, agent.workspaceId)),
      with: { user: true },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Build filters
    const filters = [eq(agentExecutions.agentId, agentId)];

    if (status) {
      filters.push(eq(agentExecutions.status, status));
    }

    if (startDate) {
      filters.push(gte(agentExecutions.createdAt, new Date(startDate)));
    }

    if (endDate) {
      filters.push(lte(agentExecutions.createdAt, new Date(endDate)));
    }

    // 4. Get total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(agentExecutions)
      .where(and(...filters));

    // 5. Fetch executions with pagination
    const executions = await db.query.agentExecutions.findMany({
      where: and(...filters),
      orderBy: [desc(agentExecutions.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        triggeredByUser: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 6. Get execution stats for overview
    const stats = await db
      .select({
        total: count(),
        completed: count(
          sql`CASE WHEN ${agentExecutions.status} = 'completed' THEN 1 END`,
        ),
        failed: count(
          sql`CASE WHEN ${agentExecutions.status} = 'failed' THEN 1 END`,
        ),
        pending: count(
          sql`CASE WHEN ${agentExecutions.status} = 'pending' THEN 1 END`,
        ),
        running: count(
          sql`CASE WHEN ${agentExecutions.status} = 'running' THEN 1 END`,
        ),
        avgDuration: sql<number>`AVG(${agentExecutions.durationMs})`,
      })
      .from(agentExecutions)
      .where(eq(agentExecutions.agentId, agentId));

    // 7. Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      executions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      stats: stats[0] || {
        total: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        running: 0,
        avgDuration: 0,
      },
    });
  } catch (error) {
    console.error("[API] Get agent executions error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch executions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
