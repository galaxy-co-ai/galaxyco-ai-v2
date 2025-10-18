import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { systemSettings } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";
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

    // 3. Fetch system settings from database
    // Get the first (and only) row from system_settings table
    const settingsRecord = await db.query.systemSettings.findFirst();

    if (!settingsRecord) {
      logger.error("System settings not found in database", {
        userId: adminCheck.user.id,
      });
      return NextResponse.json(
        { error: "System settings not initialized" },
        { status: 500 },
      );
    }

    logger.info("Admin settings fetched", {
      userId: adminCheck.user.id,
      settingsId: settingsRecord.id,
    });

    return NextResponse.json({
      settings: settingsRecord.settings,
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

    // Basic validation - ensure body is an object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 },
      );
    }

    // 5. Get current settings record
    const settingsRecord = await db.query.systemSettings.findFirst();

    if (!settingsRecord) {
      return NextResponse.json(
        { error: "System settings not initialized" },
        { status: 500 },
      );
    }

    // 6. Update settings in database
    const [updated] = await db
      .update(systemSettings)
      .set({
        settings: body,
        updatedBy: clerkUserId,
        updatedAt: new Date(),
      })
      .where(eq(systemSettings.id, settingsRecord.id))
      .returning();

    const durationMs = Date.now() - startTime;
    logger.info("Admin settings updated", {
      userId: adminCheck.user.id,
      updatedBy: clerkUserId,
      settingsId: updated.id,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      settings: updated.settings,
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
