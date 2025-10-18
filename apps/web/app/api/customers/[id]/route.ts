import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { updateCustomerSchema } from "@/lib/validation/crm";
import { safeValidateRequest, formatValidationError } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/customers/[id]
 * Get a single customer by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized customer fetch attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 2. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Verify workspace membership
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

    // 4. Fetch customer (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mockCustomer = {
      id: customerId,
      workspaceId,
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1-555-0100",
      website: "https://acme.com",
      status: "active",
      industry: "Technology",
      size: "51-200",
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "USA",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      customer: mockCustomer,
    });
  } catch (error) {
    logger.error("Fetch customer error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/customers/[id]
 * Update a customer
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized customer update attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.CRM_CREATE,
    );
    if (!rateLimitResult.success) {
      logger.warn("Customer update rate limit exceeded", {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
      });
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.`,
        },
        { status: 429 },
      );
    }

    const customerId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get and validate request body
    const body = await req.json();
    const validation = safeValidateRequest(updateCustomerSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid customer update request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, { status: 400 });
    }

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

    // 6. Update customer (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database update in Phase 2
    const updatedCustomer = {
      id: customerId,
      workspaceId,
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    const durationMs = Date.now() - startTime;

    logger.info("Customer updated successfully", {
      userId: user.id,
      workspaceId,
      customerId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Update customer error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to update customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/customers/[id]
 * Soft delete a customer
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized customer delete attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.CRM_CREATE,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const customerId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

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

    // 5. Delete customer (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual soft delete in Phase 2
    const durationMs = Date.now() - startTime;

    logger.info("Customer deleted successfully", {
      userId: user.id,
      workspaceId,
      customerId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Delete customer error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to delete customer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
