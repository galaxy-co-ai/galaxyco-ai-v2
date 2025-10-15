import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/services/user-session';
import { db } from '@galaxyco/database';
import { knowledgeItems } from '@galaxyco/database/schema';
import { and, eq, desc, like, inArray } from 'drizzle-orm';
import { ragService } from '@/lib/services/rag-service';

export const runtime = 'nodejs';

/**
 * GET /api/documents
 * List user's documents with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const collectionId = searchParams.get('collectionId');
    const type = searchParams.get('type');
    const tags = searchParams.get('tags')?.split(',');
    const query = searchParams.get('query');

    // If there's a search query, use semantic search
    if (query) {
      const results = await ragService.searchDocuments({
        query,
        workspaceId,
        limit,
        filters: {
          collectionIds: collectionId ? [collectionId] : undefined,
          types: type ? [type] : undefined,
          tags,
        },
      });

      return NextResponse.json({
        documents: results.map((r) => ({
          ...r.item,
          relevanceScore: r.relevanceScore,
          snippet: r.snippet,
        })),
      });
    }

    // Otherwise, regular list query
    const conditions = [eq(knowledgeItems.workspaceId, workspaceId)];

    if (collectionId) {
      conditions.push(eq(knowledgeItems.collectionId, collectionId));
    }

    if (type) {
      conditions.push(eq(knowledgeItems.type, type as any));
    }

    if (tags && tags.length > 0) {
      // Check if any of the tags match
      conditions.push(
        // This is a simple approach - for production, use proper array overlap query
        like(knowledgeItems.tags, `%${tags[0]}%`)
      );
    }

    const documents = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(limit);

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
