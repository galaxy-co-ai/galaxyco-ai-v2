import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { gridTemplates, users } from '@galaxyco/database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { logger } from '@/lib/utils/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/studio/templates
 * Fetches all available workflow templates from the marketplace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    // Fetch templates with author information
    const templates = await db
      .select({
        id: gridTemplates.id,
        name: gridTemplates.name,
        description: gridTemplates.description,
        category: gridTemplates.category,
        tags: gridTemplates.tags,
        thumbnail_url: gridTemplates.thumbnailUrl,
        preview_data: gridTemplates.previewData,
        complexity: gridTemplates.complexity,
        estimated_time: gridTemplates.estimatedTime,
        uses: gridTemplates.uses,
        rating: gridTemplates.rating,
        featured: gridTemplates.featured,
        author_id: gridTemplates.authorId,
        author_name: users.firstName,
        created_at: gridTemplates.createdAt,
        updated_at: gridTemplates.updatedAt,
      })
      .from(gridTemplates)
      .leftJoin(users, eq(gridTemplates.authorId, users.id))
      .orderBy(desc(gridTemplates.featured), desc(gridTemplates.uses));

    logger.info('Fetched templates', {
      workspaceId,
      count: templates.length,
    });

    return NextResponse.json({
      templates,
      count: templates.length,
    });
  } catch (error) {
    logger.error('Failed to fetch templates', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
