import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { agents, users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Single Agent API Routes
 * 
 * GET: Get agent by ID
 * PUT: Update agent
 * DELETE: Delete/archive agent
 * 
 * SECURITY: Multi-tenant isolation enforced via workspace_id filter
 */

/**
 * GET /api/agents/[id]
 * Get agent details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get agent
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, agent.workspaceId), // REQUIRED: tenant filter
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access agent ${params.id} in workspace ${agent.workspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to agent" },
        { status: 403 }
      );
    }

    return NextResponse.json({ agent });
  } catch (error: any) {
    console.error("Agent fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/[id]
 * Update agent
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get agent
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, agent.workspaceId), // REQUIRED: tenant filter
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to update agent ${params.id} in workspace ${agent.workspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to agent" },
        { status: 403 }
      );
    }

    // 5. Parse request body
    const body = await request.json();
    const updateData: any = {};

    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    
    // Handle config updates (merge with existing config)
    if (body.config !== undefined) {
      updateData.config = {
        ...agent.config,
        ...body.config,
      };
    }

    // Always update updatedAt
    updateData.updatedAt = new Date();

    // 6. Update agent
    const [updatedAgent] = await db
      .update(agents)
      .set(updateData)
      .where(eq(agents.id, params.id))
      .returning();

    return NextResponse.json({
      agent: updatedAgent,
      message: "Agent updated successfully",
    });
  } catch (error: any) {
    console.error("Agent update error:", error);
    return NextResponse.json(
      { error: "Failed to update agent", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id]
 * Delete (archive) agent
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get agent
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, agent.workspaceId), // REQUIRED: tenant filter
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to delete agent ${params.id} in workspace ${agent.workspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to agent" },
        { status: 403 }
      );
    }

    // 5. Archive agent (soft delete)
    const [archivedAgent] = await db
      .update(agents)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(agents.id, params.id))
      .returning();

    return NextResponse.json({
      agent: archivedAgent,
      message: "Agent archived successfully",
    });
  } catch (error: any) {
    console.error("Agent delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete agent", details: error.message },
      { status: 500 }
    );
  }
}
