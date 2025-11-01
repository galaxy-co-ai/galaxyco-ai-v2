import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { galaxyGrids, gridNodes, gridEdges } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/studio/grids/[gridId]
 * Fetches a single grid with its nodes and edges
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gridId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { gridId } = resolvedParams;

    // Fetch grid
    const [grid] = await db.select().from(galaxyGrids).where(eq(galaxyGrids.id, gridId)).limit(1);

    if (!grid) {
      return NextResponse.json({ error: 'Grid not found' }, { status: 404 });
    }

    // Fetch nodes
    const nodes = await db.select().from(gridNodes).where(eq(gridNodes.gridId, gridId));

    // Fetch edges
    const edges = await db.select().from(gridEdges).where(eq(gridEdges.gridId, gridId));

    logger.info('Fetched grid details', {
      gridId,
      userId,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    });

    return NextResponse.json({
      grid,
      nodes,
      edges,
    });
  } catch (error) {
    logger.error('Failed to fetch grid details', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch grid details',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/studio/grids/[gridId]
 * Updates grid metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gridId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { gridId } = resolvedParams;
    const body = await request.json();
    const { name, description, status, viewport, tags } = body;

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (viewport !== undefined) updates.viewport = viewport;
    if (tags !== undefined) updates.tags = tags;

    const [updatedGrid] = await db
      .update(galaxyGrids)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(galaxyGrids.id, gridId))
      .returning();

    if (!updatedGrid) {
      return NextResponse.json({ error: 'Grid not found' }, { status: 404 });
    }

    logger.info('Updated grid', {
      gridId,
      userId,
      updates: Object.keys(updates),
    });

    return NextResponse.json({
      grid: updatedGrid,
      message: 'Grid updated successfully',
    });
  } catch (error) {
    logger.error('Failed to update grid', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Failed to update grid',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/studio/grids/[gridId]
 * Deletes a grid and all its nodes and edges
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gridId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { gridId } = resolvedParams;

    // Delete grid (cascade will handle nodes and edges)
    await db.delete(galaxyGrids).where(eq(galaxyGrids.id, gridId));

    logger.info('Deleted grid', {
      gridId,
      userId,
    });

    return NextResponse.json({
      message: 'Grid deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete grid', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Failed to delete grid',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
