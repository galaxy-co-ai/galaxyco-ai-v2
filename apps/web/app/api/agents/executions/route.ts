import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import { agentExecutions, agents } from "@galaxyco/database/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

// Force dynamic rendering
export const dynamic = "force-dynamic";

/**
 * GET /api/agents/executions
 *
 * Retrieves agent execution history with filtering options
 *
 * Query params:
 * - workspaceId: string (required)
 * - agentId: string (optional)
 * - status: string (optional) - success | error | running | pending
 * - startDate: string (optional) - ISO date
 * - endDate: string (optional) - ISO date
 * - limit: number (optional, default 50)
 * - offset: number (optional, default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const agentId = searchParams.get("agentId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    // Build filter conditions
    const conditions = [eq(agents.workspaceId, workspaceId)];

    if (agentId) {
      conditions.push(eq(agentExecutions.agentId, agentId));
    }

    if (status) {
      conditions.push(eq(agentExecutions.status, status as any));
    }

    if (startDate) {
      conditions.push(gte(agentExecutions.startedAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(agentExecutions.startedAt, new Date(endDate)));
    }

    // Fetch executions with agent details
    const executions = await db
      .select({
        id: agentExecutions.id,
        agentId: agentExecutions.agentId,
        agentName: agents.name,
        status: agentExecutions.status,
        input: agentExecutions.input,
        output: agentExecutions.output,
        error: agentExecutions.error,
        startedAt: agentExecutions.startedAt,
        completedAt: agentExecutions.completedAt,
        durationMs: agentExecutions.durationMs,
        tokensUsed: agentExecutions.tokensUsed,
        createdAt: agentExecutions.createdAt,
      })
      .from(agentExecutions)
      .innerJoin(agents, eq(agentExecutions.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(agentExecutions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(agentExecutions)
      .innerJoin(agents, eq(agentExecutions.agentId, agents.id))
      .where(and(...conditions));

    // Calculate aggregate metrics
    const metrics = await db
      .select({
        totalExecutions: sql<number>`count(*)::int`,
        successfulExecutions: sql<number>`count(*) FILTER (WHERE ${agentExecutions.status} = 'success')::int`,
        failedExecutions: sql<number>`count(*) FILTER (WHERE ${agentExecutions.status} = 'error')::int`,
        runningExecutions: sql<number>`count(*) FILTER (WHERE ${agentExecutions.status} = 'running')::int`,
        avgDurationMs: sql<number>`avg(${agentExecutions.durationMs})::int`,
        totalTokens: sql<number>`sum(${agentExecutions.tokensUsed})::int`,
      })
      .from(agentExecutions)
      .innerJoin(agents, eq(agentExecutions.agentId, agents.id))
      .where(and(...conditions));

    return NextResponse.json({
      executions,
      total: count,
      limit,
      offset,
      metrics: metrics[0] || {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        runningExecutions: 0,
        avgDurationMs: 0,
        totalTokens: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching agent executions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
