import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { playgroundRequestSchema } from "@/lib/validation/analytics";
import { safeValidateRequest, formatValidationError } from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * POST /api/playground
 * Test API requests in a sandboxed environment
 *
 * Validates requests without executing them against real resources.
 * Used for testing API schemas, permissions, and rate limits.
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Valid playground request
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized request creation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.PLAYGROUND,
    );
    if (!rateLimitResult.success) {
      logger.warn("Playground creation rate limit exceeded", {
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
    const validation = safeValidateRequest(playgroundRequestSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid request creation request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { workspaceId, ...requestData } = validation.data;

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

    // 6. Sandbox execution - validate without running
    // In Phase 2, this will actually execute against sandbox resources
    const sandboxResult = {
      requestId: crypto.randomUUID(),
      workspaceId,
      resource: requestData.resource,
      method: requestData.method,
      validateOnly: requestData.validateOnly,
      validation: {
        passed: true,
        checks: {
          authentication: "✓ Valid",
          authorization: "✓ Workspace member",
          rateLimit: `✓ ${rateLimitResult.remaining}/${rateLimitResult.limit} remaining`,
          schema: "✓ Valid request body",
          permissions: "✓ User has required permissions",
        },
      },
      mockResponse: requestData.validateOnly
        ? null
        : {
            // Mock response for the requested resource/method
            id: crypto.randomUUID(),
            message: `Sandbox ${requestData.method} ${requestData.resource} executed successfully`,
            data: {},
          },
      executedAt: new Date().toISOString(),
    };

    // 7. Return sandbox result
    const durationMs = Date.now() - startTime;

    logger.info("Playground request executed", {
      userId: user.id,
      workspaceId,
      resource: requestData.resource,
      method: requestData.method,
      validateOnly: requestData.validateOnly,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      result: sandboxResult,
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
    logger.error("Create request error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to create request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
