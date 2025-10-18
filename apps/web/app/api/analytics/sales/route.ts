import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import {
  users,
  workspaceMembers,
  customers,
  invoices,
  projects,
} from "@galaxyco/database/schema";
import { eq, and, sum, count, gte, sql } from "drizzle-orm";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/analytics/sales
 * List all analytics/sales for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized analytics/sales list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Verify workspace membership
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

    // 5. Fetch sales analytics from database
    const dateRange = searchParams.get("dateRange") || "30d";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    // Total revenue from invoices
    const revenueResult = await db
      .select({ total: sum(invoices.total) })
      .from(invoices)
      .where(
        and(
          eq(invoices.workspaceId, workspaceId),
          gte(invoices.createdAt, startDate),
        ),
      );

    // Total customers
    const customerCount = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.workspaceId, workspaceId));

    // Total projects
    const projectCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId));

    // Invoice breakdown by status
    const invoicesByStatus = await db
      .select({
        status: invoices.status,
        count: count(),
        total: sum(invoices.total),
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.workspaceId, workspaceId),
          gte(invoices.createdAt, startDate),
        ),
      )
      .groupBy(invoices.status);

    const analytics = {
      revenue: {
        total: revenueResult[0]?.total || "0",
        period: dateRange,
      },
      customers: {
        total: customerCount[0]?.count || 0,
      },
      projects: {
        total: projectCount[0]?.count || 0,
      },
      invoices: {
        byStatus: invoicesByStatus,
      },
    };

    return NextResponse.json({
      analytics,
      workspaceId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("List analytics/sales error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch analytics/sales" },
      { status: 500 },
    );
  }
}
