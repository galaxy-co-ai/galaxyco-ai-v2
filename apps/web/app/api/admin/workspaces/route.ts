import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// NOTE: Admin routes don't create resources, only list and update existing ones

/**
 * GET /api/admin/workspaces
 * List all workspaces (admin only - cross-tenant)
 *
 * Query params:
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized admin workspaces list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Add admin role check in Phase 2
    // For now, allow any authenticated user

    // 4. Fetch all workspaces (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mockWorkspaces = [
      {
        id: crypto.randomUUID(),
        name: "Example Workspace",
        createdAt: new Date().toISOString(),
      },
    ].slice(offset, offset + limit);

    return NextResponse.json({
      workspaces: mockWorkspaces,
      total: mockWorkspaces.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error("List admin workspaces error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 },
    );
  }
}
