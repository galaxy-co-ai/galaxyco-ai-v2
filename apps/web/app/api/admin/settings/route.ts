import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { checkSystemAdmin } from "@/lib/auth/admin-check";

/**
 * GET /api/admin/settings
 * Get system settings (admin only)
 *
 * Requires: Admin or Owner role
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized admin/settings request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn("Non-admin attempted to access settings", { clerkUserId });
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    // 3. Fetch admin/settings (PLACEHOLDER - system settings)
    // TODO: Replace with actual database query in Phase 2
    const mockSettings = {
      maintenanceMode: false,
      allowSignups: true,
      maxWorkspacesPerUser: 5,
      featureFlags: {
        aiAgents: true,
        knowledgeBase: true,
        customPacks: false,
      },
      rateLimit: {
        requestsPerMinute: 60,
        burstSize: 100,
      },
    };

    logger.info("Admin settings fetched", { userId: adminCheck.user.id });

    return NextResponse.json({
      settings: mockSettings,
    });
  } catch (error) {
    logger.error("List admin/settings error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch admin/settings" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update system settings (admin only)
 */
export async function PUT(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting
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

    // 3. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn("Non-admin attempted to update settings", { clerkUserId });
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    // 4. Get and validate body
    const body = await req.json();

    // TODO: Add validation with adminSettingsSchema
    // TODO: Update settings in database in Phase 2

    const durationMs = Date.now() - startTime;
    logger.info("Admin settings updated", {
      userId: adminCheck.user.id,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      settings: body,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Update settings error", {
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
