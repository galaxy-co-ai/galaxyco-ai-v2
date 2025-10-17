/* eslint-disable no-console */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import {
  agents,
  agentSchedules,
  workspaceMembers,
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * PUT /api/agents/[id]/activate
 * Activate an agent with schedule configuration
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Agent ownership or permissions
 * - Schedule configuration in body
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = params.id;

    // 2. Get request body
    const body = await req.json();
    const { scheduleConfig } = body;

    if (!scheduleConfig || !scheduleConfig.triggerType) {
      return NextResponse.json(
        { error: "Missing schedule configuration" },
        { status: 400 },
      );
    }

    // Validate scheduled trigger has cron
    if (scheduleConfig.triggerType === "scheduled" && !scheduleConfig.cron) {
      return NextResponse.json(
        { error: "Cron expression required for scheduled trigger" },
        { status: 400 },
      );
    }

    // 3. Get agent and verify workspace membership
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 4. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(eq(workspaceMembers.workspaceId, agent.workspaceId)),
      with: {
        user: true,
      },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 5. Calculate next run time for scheduled agents
    let nextRunAt: Date | null = null;
    if (scheduleConfig.triggerType === "scheduled") {
      // Simple calculation - in production, use a cron parser library
      // For now, set next run to 1 hour from now as placeholder
      nextRunAt = new Date(Date.now() + 60 * 60 * 1000);
    }

    // 6. Update agent status to active
    const [updatedAgent] = await db
      .update(agents)
      .set({
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(agents.id, agentId))
      .returning();

    // 7. Create or update schedule
    const existingSchedule = await db.query.agentSchedules.findFirst({
      where: eq(agentSchedules.agentId, agentId),
    });

    let schedule;
    if (existingSchedule) {
      // Update existing schedule
      [schedule] = await db
        .update(agentSchedules)
        .set({
          triggerType: scheduleConfig.triggerType,
          cron: scheduleConfig.cron || null,
          timezone: scheduleConfig.timezone || "America/Chicago",
          webhookUrl: scheduleConfig.webhookUrl || null,
          webhookSecret:
            scheduleConfig.triggerType === "webhook" ? nanoid(32) : null,
          enabled: scheduleConfig.enabled !== false,
          nextRunAt,
          updatedAt: new Date(),
        })
        .where(eq(agentSchedules.id, existingSchedule.id))
        .returning();
    } else {
      // Create new schedule
      [schedule] = await db
        .insert(agentSchedules)
        .values({
          workspaceId: agent.workspaceId,
          agentId,
          triggerType: scheduleConfig.triggerType,
          cron: scheduleConfig.cron || null,
          timezone: scheduleConfig.timezone || "America/Chicago",
          webhookUrl: scheduleConfig.webhookUrl || null,
          webhookSecret:
            scheduleConfig.triggerType === "webhook" ? nanoid(32) : null,
          enabled: scheduleConfig.enabled !== false,
          nextRunAt,
        })
        .returning();
    }

    // 8. Return success with webhook info if applicable
    const response: any = {
      success: true,
      agent: updatedAgent,
      schedule: {
        ...schedule,
        // Only include webhook secret in response for webhook triggers
        webhookSecret:
          schedule.triggerType === "webhook"
            ? schedule.webhookSecret
            : undefined,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Activate agent error:", error);
    return NextResponse.json(
      {
        error: "Failed to activate agent",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
