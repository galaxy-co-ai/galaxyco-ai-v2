/**
 * Workflow Template Detail API
 * Get, update, delete individual template
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { gridTemplates } from '@galaxyco/database';
import { eq, sql } from 'drizzle-orm';

/**
 * GET /api/templates/[id]
 * Get template by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await db.query.gridTemplates.findFirst({
      where: eq(gridTemplates.id, params.id),
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/templates/[id]/use
 * Increment usage count when template is used
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Increment uses count
    await db
      .update(gridTemplates)
      .set({
        uses: sql`${gridTemplates.uses} + 1`,
      })
      .where(eq(gridTemplates.id, params.id));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error incrementing template usage:', error);
    return NextResponse.json(
      {
        error: 'Failed to update template usage',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete template (author only)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this template
    const template = await db.query.gridTemplates.findFirst({
      where: eq(gridTemplates.id, params.id),
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete template
    await db.delete(gridTemplates).where(eq(gridTemplates.id, params.id));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
