import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { agents, workspaceMembers, users } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import {
  createAgentSchema,
  safeValidateRequest,
  formatValidationError,
} from "@/lib/validation";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * POST /api/agents
 * Save a new agent as draft
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Agent data (name, description, workflow, etc.)
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized agent creation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.AGENT_CREATE,
    );
    if (!rateLimitResult.success) {
      logger.warn("Agent creation rate limit exceeded", {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
        reset: rateLimitResult.reset,
      });
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many agent creation requests. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.`,
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
    const validation = safeValidateRequest(createAgentSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid agent creation request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const {
      workspaceId,
      name,
      description,
      workflow,
      variantType,
      originalPrompt,
      enhancedPrompt,
      integrations,
    } = validation.data;

    // Note: edges is not in schema but used in config - get from body if present
    const edges = body.edges || [];

    // 5. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 6. Verify workspace membership
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

    const userId = user.id;

    // 7. Build agent config
    const config = {
      aiProvider: "openai" as const, // Default, can be customized later
      model: "gpt-4",
      systemPrompt: enhancedPrompt || originalPrompt || "",
      // Store workflow and metadata in a compatible way
      tools: integrations || [],
      triggers: [
        {
          type: "manual",
          config: {
            workflow,
            edges: edges || [],
            variantType: variantType || "basic",
            originalPrompt,
            enhancedPrompt,
          },
        },
      ],
    };

    // 8. Insert agent as draft
    const [newAgent] = await db
      .insert(agents)
      .values({
        workspaceId,
        name,
        description: description || "",
        type: "custom",
        status: "draft",
        config,
        isCustom: true,
        createdBy: userId,
        version: "1.0.0",
      })
      .returning();

    // 9. Return success
    const durationMs = Date.now() - startTime;

    logger.info("Agent created successfully", {
      userId,
      workspaceId,
      agentId: newAgent.id,
      agentName: newAgent.name,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      agent: {
        id: newAgent.id,
        name: newAgent.name,
        description: newAgent.description,
        status: newAgent.status,
        createdAt: newAgent.createdAt,
      },
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
    logger.error("Save agent error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to save agent",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/agents
 * List all agents for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - status: optional filter (draft, active, paused, archived)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized agent list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
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

    // 5. Fetch agents (placeholder - will expand in Phase 4E)
    const agentsList = await db.query.agents.findMany({
      where: eq(agents.workspaceId, workspaceId),
      orderBy: (agents, { desc }) => [desc(agents.createdAt)],
      limit: 50,
    });

    return NextResponse.json({
      agents: agentsList,
      total: agentsList.length,
    });
  } catch (error) {
    logger.error("List agents error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 },
    );
  }
}
