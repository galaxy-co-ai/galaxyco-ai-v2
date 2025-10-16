import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import {
  agentExecutions,
  agents,
  workspaceMembers,
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/agents/[id]/executions/[executionId]
 * Fetch detailed execution information including logs, inputs, outputs
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; executionId: string } },
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: agentId, executionId } = params;

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

    // 3. Fetch execution with full details
    const execution = await db.query.agentExecutions.findFirst({
      where: and(
        eq(agentExecutions.id, executionId),
        eq(agentExecutions.agentId, agentId),
      ),
      with: {
        agent: {
          columns: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
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

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 },
      );
    }

    // 4. Format execution logs from error/output data
    const logs = [];

    // Add start log
    logs.push({
      id: "start",
      timestamp: execution.createdAt,
      level: "info",
      message: "Execution started",
      details: execution.startedAt
        ? `Started at ${execution.startedAt.toISOString()}`
        : undefined,
    });

    // Add input processing log
    if (execution.input) {
      logs.push({
        id: "input",
        timestamp: execution.startedAt || execution.createdAt,
        level: "info",
        message: "Processing input data",
        details: `Input contains ${Object.keys(execution.input).length} fields`,
      });
    }

    // Add completion/error logs
    if (execution.status === "completed") {
      logs.push({
        id: "complete",
        timestamp: execution.completedAt || execution.createdAt,
        level: "success",
        message: "Execution completed successfully",
        details: execution.durationMs
          ? `Completed in ${execution.durationMs}ms`
          : undefined,
      });

      if (execution.output) {
        logs.push({
          id: "output",
          timestamp: execution.completedAt || execution.createdAt,
          level: "info",
          message: "Generated output",
          details: `Output contains ${Object.keys(execution.output).length} fields`,
        });
      }
    } else if (execution.status === "failed" && execution.error) {
      logs.push({
        id: "error",
        timestamp: execution.completedAt || execution.createdAt,
        level: "error",
        message: execution.error.message || "Execution failed",
        details: execution.error.code
          ? `Error code: ${execution.error.code}`
          : undefined,
      });
    } else if (execution.status === "running") {
      logs.push({
        id: "running",
        timestamp: new Date(),
        level: "info",
        message: "Execution in progress...",
        details: execution.durationMs
          ? `Running for ${execution.durationMs}ms`
          : undefined,
      });
    }

    // 5. Calculate derived metrics
    const metrics = {
      duration:
        execution.durationMs ||
        (execution.completedAt && execution.startedAt
          ? execution.completedAt.getTime() - execution.startedAt.getTime()
          : null),
      tokensUsed: execution.tokensUsed || 0,
      cost: execution.cost || 0,
      inputSize: execution.input ? JSON.stringify(execution.input).length : 0,
      outputSize: execution.output
        ? JSON.stringify(execution.output).length
        : 0,
    };

    return NextResponse.json({
      success: true,
      execution: {
        ...execution,
        logs,
        metrics,
      },
    });
  } catch (error) {
    console.error("[API] Get execution details error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch execution details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/agents/[id]/executions/[executionId]
 * Update execution status (cancel, retry, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; executionId: string } },
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: agentId, executionId } = params;
    const body = await req.json();
    const { action } = body; // 'cancel', 'retry', etc.

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

    // 3. Get current execution
    const execution = await db.query.agentExecutions.findFirst({
      where: and(
        eq(agentExecutions.id, executionId),
        eq(agentExecutions.agentId, agentId),
      ),
    });

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 },
      );
    }

    // 4. Handle different actions
    let updateData: any = {};

    if (action === "cancel") {
      if (!["pending", "running"].includes(execution.status)) {
        return NextResponse.json(
          { error: "Can only cancel pending or running executions" },
          { status: 400 },
        );
      }
      updateData = {
        status: "cancelled" as const,
        completedAt: new Date(),
        durationMs: execution.startedAt
          ? Date.now() - execution.startedAt.getTime()
          : null,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid action. Supported: cancel" },
        { status: 400 },
      );
    }

    // 5. Update execution
    const [updatedExecution] = await db
      .update(agentExecutions)
      .set(updateData)
      .where(eq(agentExecutions.id, executionId))
      .returning();

    return NextResponse.json({
      success: true,
      execution: updatedExecution,
      message: `Execution ${action}ed successfully`,
    });
  } catch (error) {
    console.error("[API] Update execution error:", error);
    return NextResponse.json(
      {
        error: "Failed to update execution",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
