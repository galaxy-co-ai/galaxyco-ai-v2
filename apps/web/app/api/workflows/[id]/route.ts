import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { galaxyGrids } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

/**
 * GET /api/workflows/[id]
 * Get a single workflow by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate ID
    const workflowId = z.string().uuid().parse(params.id);

    // 3. Get workspace ID from query (temporary - should come from auth context)
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // 4. Query database with multi-tenant isolation
    const [workflow] = await db
      .select()
      .from(galaxyGrids)
      .where(
        and(
          eq(galaxyGrids.id, workflowId),
          eq(galaxyGrids.workspaceId, workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      );

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('[Workflow Get Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid workflow ID' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/workflows/[id]
 * Update a workflow
 *
 * DEPRECATED: Use Server Actions in /lib/actions/workflow-actions.ts instead
 * This endpoint is kept for backwards compatibility
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = z.string().uuid().parse(params.id);
    const body = await req.json();

    // Validate input
    const UpdateWorkflowSchema = z.object({
      workspaceId: z.string().uuid(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(1000).optional(),
      viewport: z
        .object({
          x: z.number(),
          y: z.number(),
          zoom: z.number(),
        })
        .optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      tags: z.array(z.string()).optional(),
    });

    const validated = UpdateWorkflowSchema.parse(body);

    // Update in database with multi-tenant isolation
    const [workflow] = await db
      .update(galaxyGrids)
      .set({
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.viewport && { viewport: validated.viewport }),
        ...(validated.status && { status: validated.status }),
        ...(validated.tags && { tags: validated.tags }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(galaxyGrids.id, workflowId),
          eq(galaxyGrids.workspaceId, validated.workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (error) {
    console.error('[Workflow Update Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors[0]?.message || 'Validation failed',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow
 *
 * DEPRECATED: Use Server Actions in /lib/actions/workflow-actions.ts instead
 * This endpoint is kept for backwards compatibility
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = z.string().uuid().parse(params.id);

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // Delete from database with multi-tenant isolation
    const result = await db
      .delete(galaxyGrids)
      .where(
        and(
          eq(galaxyGrids.id, workflowId),
          eq(galaxyGrids.workspaceId, workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Workflow Delete Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid workflow ID' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to delete workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
