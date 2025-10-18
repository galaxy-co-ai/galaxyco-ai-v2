import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { checkSystemAdmin } from "@/lib/auth/admin-check";

/**
 * GET /api/admin/analytics
 * Get cross-tenant analytics (admin only)
 *
 * Query params:
 * - period: optional (last-7-days, last-30-days, etc.)
 * - metric: optional (users, workspaces, executions, etc.)
 *
 * Requires: Admin or Owner role
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized admin analytics request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn("Non-admin attempted to access analytics", { clerkUserId });
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    // 3. Get query params
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") || "last-30-days";
    const metric = searchParams.get("metric") || "overview";

    // 4. Fetch cross-tenant analytics (PLACEHOLDER)
    // TODO: Replace with actual aggregated analytics in Phase 2
    const mockAnalytics = {
      period,
      metric,
      data: {
        totalWorkspaces: 42,
        activeUsers: 156,
        totalExecutions: 3420,
        avgExecutionsPerWorkspace: 81.4,
        topWorkspacesByActivity: [],
      },
      generatedAt: new Date().toISOString(),
    };

    logger.info("Admin analytics fetched", {
      userId: adminCheck.user.id,
      period,
      metric,
    });

    return NextResponse.json({
      analytics: mockAnalytics,
    });
  } catch (error) {
    logger.error("List admin/analytics error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch admin/analytics" },
      { status: 500 },
    );
  }
}
