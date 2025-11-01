import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { galaxyGrids, gridNodes, gridEdges, gridTemplates } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/studio/grids/from-template
 * Creates a new grid from a template
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, workspaceId } = body;

    if (!templateId || !workspaceId) {
      return NextResponse.json(
        { error: 'Template ID and Workspace ID are required' },
        { status: 400 },
      );
    }

    // Fetch the template
    const [template] = await db
      .select()
      .from(gridTemplates)
      .where(eq(gridTemplates.id, templateId))
      .limit(1);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create the new grid
    const gridId = nanoid();
    const [newGrid] = await db
      .insert(galaxyGrids)
      .values({
        id: gridId,
        workspaceId: workspaceId,
        name: `${template.name} (Copy)`,
        description: template.description,
        status: 'draft',
        version: 1,
        isTemplate: false,
        thumbnailUrl: null,
        tags: template.tags || [],
        viewport: template.previewData.viewport || { x: 0, y: 0, zoom: 1 },
        createdBy: userId,
      })
      .returning();

    // Clone nodes from template
    const nodeIdMap = new Map<string, string>(); // Old ID -> New ID
    const newNodes = template.previewData.nodes.map((node: any) => {
      const newNodeId = nanoid();
      nodeIdMap.set(node.id, newNodeId);
      return {
        id: newNodeId,
        gridId: gridId,
        nodeType: node.type,
        label: node.label,
        position: node.position,
        config: node.config || {},
        agentId: null,
        status: 'idle' as const,
      };
    });

    if (newNodes.length > 0) {
      await db.insert(gridNodes).values(newNodes);
    }

    // Clone edges from template
    const newEdges = template.previewData.edges.map((edge: any) => ({
      id: nanoid(),
      gridId: gridId,
      sourceNodeId: nodeIdMap.get(edge.source) || edge.source,
      targetNodeId: nodeIdMap.get(edge.target) || edge.target,
      sourceHandle: null,
      targetHandle: null,
      edgeType: edge.type,
      label: edge.label || null,
      condition: null,
      animated: edge.type === 'default',
    }));

    if (newEdges.length > 0) {
      await db.insert(gridEdges).values(newEdges);
    }

    // Increment template uses counter
    await db
      .update(gridTemplates)
      .set({
        uses: template.uses + 1,
      })
      .where(eq(gridTemplates.id, templateId));

    logger.info('Created grid from template', {
      templateId,
      gridId,
      workspaceId,
      userId,
      nodeCount: newNodes.length,
      edgeCount: newEdges.length,
    });

    return NextResponse.json({
      gridId,
      grid: newGrid,
      message: 'Grid created successfully from template',
    });
  } catch (error) {
    logger.error('Failed to create grid from template', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Failed to create grid from template',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
