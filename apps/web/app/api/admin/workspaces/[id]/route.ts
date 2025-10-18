import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { adminWorkspaceUpdateSchema } from "@/lib/validation/analytics";
import { safeValidateRequest, formatValidationError } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/admin/workspaces/[id]
 * Get a single workspace by ID
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

    const workspaceId = params.id;

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Add admin role check in Phase 2

    // PLACEHOLDER - Replace with actual database query in Phase 2
    const mockAdminWorkspaceUpdate = {
      id: workspaceId,
      name: "Example Workspace",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      workspace: mockAdminWorkspaceUpdate,
    });
  } catch (error) {
    logger.error("Fetch workspace error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/workspaces/[id]
 * Update a workspace
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.ADMIN_OPS,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const workspaceId = params.id;

    const body = await req.json();
    const validation = safeValidateRequest(adminWorkspaceUpdateSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      return NextResponse.json(formattedError, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Add admin role check in Phase 2

    // PLACEHOLDER - Replace with actual database update in Phase 2
    const updatedAdminWorkspaceUpdate = {
      id: workspaceId,
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    const durationMs = Date.now() - startTime;
    logger.info("Admin workspace updated successfully", {
      userId: user.id,
      workspaceId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      workspace: updatedAdminWorkspaceUpdate,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Update workspace error", {
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/workspaces/[id]
 * Delete a workspace
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.ADMIN_OPS,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const workspaceId = params.id;

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    // PLACEHOLDER - Replace with actual soft delete in Phase 2
    const durationMs = Date.now() - startTime;
    logger.info("Admin workspace deleted successfully", {
      userId: user.id,
      workspaceId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: "Admin/workspaces deleted successfully",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Delete workspace error", {
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 },
    );
  }
}
