import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { agents, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

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
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get request body
    const body = await req.json();
    const {
      workspaceId,
      name,
      description,
      workflow,
      edges,
      variantType,
      originalPrompt,
      enhancedPrompt,
      integrations,
    } = body;

    // 3. Validate required fields
    if (!workspaceId || !name || !workflow) {
      return NextResponse.json(
        { error: 'Missing required fields: workspaceId, name, workflow' },
        { status: 400 }
      );
    }

    // 4. Verify workspace membership and get user ID
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
      ),
      with: {
        user: true,
      },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json(
        { error: 'Forbidden: User not a member of this workspace' },
        { status: 403 }
      );
    }

    const userId = membership.user.id;

    // 5. Build agent config
    const config = {
      aiProvider: 'openai' as const, // Default, can be customized later
      model: 'gpt-4',
      systemPrompt: enhancedPrompt || originalPrompt || '',
      // Store workflow and metadata in a compatible way
      tools: integrations || [],
      triggers: [
        {
          type: 'manual',
          config: {
            workflow,
            edges: edges || [],
            variantType: variantType || 'basic',
            originalPrompt,
            enhancedPrompt,
          },
        },
      ],
    };

    // 6. Insert agent as draft
    const [newAgent] = await db
      .insert(agents)
      .values({
        workspaceId,
        name,
        description: description || '',
        type: 'custom',
        status: 'draft',
        config,
        isCustom: true,
        createdBy: userId,
        version: '1.0.0',
      })
      .returning();

    // 7. Return success
    return NextResponse.json({
      success: true,
      agent: {
        id: newAgent.id,
        name: newAgent.name,
        description: newAgent.description,
        status: newAgent.status,
        createdAt: newAgent.createdAt,
      },
    });
  } catch (error) {
    console.error('[API] Save agent error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 }
      );
    }

    // 3. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
      ),
      with: {
        user: true,
      },
    });

    if (!membership || membership.user.clerkUserId !== clerkUserId) {
      return NextResponse.json(
        { error: 'Forbidden: User not a member of this workspace' },
        { status: 403 }
      );
    }

    // 4. Fetch agents (placeholder - will expand in Phase 4E)
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
    console.error('[API] List agents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
