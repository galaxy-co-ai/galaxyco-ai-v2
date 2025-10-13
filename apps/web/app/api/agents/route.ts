import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { agents, users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and, desc, like, or, count } from "drizzle-orm";

/**
 * Agents API Routes
 * 
 * GET: List agents for a workspace with filtering and pagination
 * POST: Create a new agent
 * 
 * SECURITY: Multi-tenant isolation enforced via workspace_id filter
 */

/**
 * GET /api/agents
 * List agents with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID - check header first, then cookie
    const searchParams = request.nextUrl.searchParams;
    const requestedWorkspaceId = 
      request.headers.get("x-workspace-id") || 
      searchParams.get("workspaceId");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Parse query parameters
    const statusParam = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 6. Build query conditions
    const conditions = [eq(agents.workspaceId, requestedWorkspaceId)]; // REQUIRED: tenant filter

    // Filter by status (handle 'all' separately)
    if (statusParam && statusParam !== "all") {
      const status = statusParam as "draft" | "active" | "paused" | "archived";
      conditions.push(eq(agents.status, status));
    }

    // Search in name or description
    if (search) {
      conditions.push(
        or(
          like(agents.name, `%${search}%`),
          like(agents.description, `%${search}%`)
        )!
      );
    }

    // 7. Query agents
    const agentsList = await db
      .select()
      .from(agents)
      .where(and(...conditions))
      .orderBy(desc(agents.createdAt))
      .limit(limit)
      .offset(offset);

    // 8. Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(agents)
      .where(and(...conditions));
    
    const totalCount = countResult[0]?.count || 0;

    return NextResponse.json({
      agents: agentsList,
      total: totalCount || 0,
      pagination: {
        limit,
        offset,
        hasMore: offset + agentsList.length < (totalCount || 0),
      },
    });
  } catch (error: any) {
    console.error("Agents list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * Create a new agent
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Parse request body
    const body = await request.json();
    const {
      name,
      description,
      type,
      config,
      workspaceId,
    } = body;

    // 4. Validate required fields
    if (!name || !type || !workspaceId) {
      return NextResponse.json(
        { error: "name, type, and workspaceId are required" },
        { status: 400 }
      );
    }

    // 5. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to create agent in workspace ${workspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 6. Create agent with default config
    const defaultConfig = {
      aiProvider: "openai" as const,
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: "",
      tools: [],
      triggers: [],
      knowledgeBase: {
        enabled: false,
        scope: "all" as const,
        collectionIds: [],
        maxResults: 5,
      },
      ...config,
    };

    const [newAgent] = await db
      .insert(agents)
      .values({
        workspaceId, // REQUIRED: tenant isolation
        createdBy: user.id,
        name,
        description: description || "",
        type,
        config: defaultConfig,
        status: "draft",
        isCustom: true,
      })
      .returning();

    return NextResponse.json(
      { agent: newAgent, message: "Agent created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Agent creation error:", error);
    return NextResponse.json(
      { error: "Failed to create agent", details: error.message },
      { status: 500 }
    );
  }
}
