import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { updateImportSchema } from "@/lib/validation/business";
import { safeValidateRequest, formatValidationError } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/imports/[id]
 * Get a single import by ID
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

    const importId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

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

    // PLACEHOLDER - Replace with actual database query in Phase 2
    const mockImport = {
      id: importId,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      import: mockImport,
    });
  } catch (error) {
    logger.error("Fetch import error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to fetch import" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/imports/[id]
 * Update a import
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
      RATE_LIMITS.IMPORT_CREATE,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const importId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const validation = safeValidateRequest(updateImportSchema, body);

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

    // PLACEHOLDER - Replace with actual database update in Phase 2
    const updatedImport = {
      id: importId,
      workspaceId,
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    const durationMs = Date.now() - startTime;
    logger.info("Imports updated successfully", {
      userId: user.id,
      workspaceId,
      importId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      import: updatedImport,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Update import error", {
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });
    return NextResponse.json(
      { error: "Failed to update import" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/imports/[id]
 * Delete a import
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
      RATE_LIMITS.IMPORT_CREATE,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const importId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

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
    logger.info("Imports deleted successfully", {
      userId: user.id,
      workspaceId,
      importId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: "Imports deleted successfully",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Delete import error", {
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });
    return NextResponse.json(
      { error: "Failed to delete import" },
      { status: 500 },
    );
  }
}
