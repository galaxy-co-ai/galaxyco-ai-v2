import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import {
  agents,
  agentSchedules,
  agentExecutions,
  workspaceMembers,
} from "@galaxyco/database/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * GET /api/agents/[id]
 * Fetch a single agent with schedule and recent executions
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

    // Fetch agent with relations
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
      with: {
        schedule: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, agent.workspaceId)),
      with: { user: true },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch recent executions (last 5)
    const recentExecutions = await db.query.agentExecutions.findMany({
      where: eq(agentExecutions.agentId, agentId),
      orderBy: [desc(agentExecutions.createdAt)],
      limit: 5,
    });

    // Calculate metrics from executions
    const allExecutions = await db.query.agentExecutions.findMany({
      where: eq(agentExecutions.agentId, agentId),
    });

    const metrics = {
      successRate:
        allExecutions.length > 0
          ? (allExecutions.filter((e) => e.status === "completed").length /
              allExecutions.length) *
            100
          : 0,
      avgDuration:
        allExecutions.length > 0
          ? allExecutions.reduce((sum, e) => sum + (e.durationMs || 0), 0) /
            allExecutions.length
          : 0,
      totalRuns: allExecutions.length,
      lastRunAt: agent.lastExecutedAt,
    };

    return NextResponse.json({
      agent: {
        ...agent,
        schedule: agent.schedule,
        recentExecutions,
        metrics,
      },
    });
  } catch (error) {
    logger.error("[API] Get agent error", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/agents/[id]
 * Update agent details
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = params.id;
    const body = await req.json();
    const { name, description, status } = body;

    // Get agent
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, agent.workspaceId)),
      with: { user: true },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update agent
    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const [updatedAgent] = await db
      .update(agents)
      .set(updateData)
      .where(eq(agents.id, agentId))
      .returning();

    return NextResponse.json({ agent: updatedAgent, success: true });
  } catch (error) {
    logger.error("[API] Update agent error", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/agents/[id]
 * Delete an agent (with cascade to schedule and executions)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = params.id;

    // Get agent
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, agent.workspaceId)),
      with: { user: true },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete agent (cascade handles schedule and executions)
    await db.delete(agents).where(eq(agents.id, agentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[API] Delete agent error", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 },
    );
  }
}
