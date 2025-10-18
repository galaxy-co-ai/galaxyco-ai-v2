import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { createCustomerSchema } from "@/lib/validation/crm";
import { safeValidateRequest, formatValidationError } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * POST /api/customers
 * Create a new customer
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Customer data (name, email, etc.)
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized customer creation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.CRM_CREATE,
    );
    if (!rateLimitResult.success) {
      logger.warn("Customer creation rate limit exceeded", {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
        reset: rateLimitResult.reset,
      });
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.`,
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": String(rateLimitResult.reset),
            "Retry-After": String(
              rateLimitResult.reset - Math.floor(Date.now() / 1000),
            ),
          },
        },
      );
    }

    // 3. Get and validate request body
    const body = await req.json();
    const validation = safeValidateRequest(createCustomerSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid customer creation request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { workspaceId, ...customerData } = validation.data;

    // 4. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Verify workspace membership
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

    // 6. Create customer (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database insert in Phase 2
    const mockCustomer = {
      id: crypto.randomUUID(),
      workspaceId,
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 7. Return success
    const durationMs = Date.now() - startTime;

    logger.info("Customer created successfully", {
      userId: user.id,
      workspaceId,
      customerId: mockCustomer.id,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      customer: mockCustomer,
    });

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
    response.headers.set(
      "X-RateLimit-Remaining",
      String(rateLimitResult.remaining),
    );
    response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Create customer error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to create customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/customers
 * List all customers for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - status: optional filter (active, inactive, churned, prospect)
 * - search: optional search query
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized customer list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
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

    // 5. Fetch customers (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mockCustomers = [
      {
        id: crypto.randomUUID(),
        workspaceId,
        name: "Acme Corporation",
        email: "contact@acme.com",
        status: "active",
        industry: "Technology",
        size: "51-200",
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        workspaceId,
        name: "TechStart Inc",
        email: "hello@techstart.com",
        status: "prospect",
        industry: "SaaS",
        size: "11-50",
        createdAt: new Date().toISOString(),
      },
    ]
      .filter((customer) => !status || customer.status === status)
      .filter(
        (customer) =>
          !search || customer.name.toLowerCase().includes(search.toLowerCase()),
      )
      .slice(offset, offset + limit);

    return NextResponse.json({
      customers: mockCustomers,
      total: mockCustomers.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error("List customers error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
