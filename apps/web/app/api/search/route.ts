import { NextRequest, NextResponse } from 'next/server';
import { universalSearch } from '@/lib/actions/search-actions';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * GET /api/search
 * Universal search across all entities
 *
 * Query params:
 * - workspaceId: string (required)
 * - q: string (required) - search query
 * - types?: string[] (optional) - comma-separated list of types to search
 * - limit?: number (default: 50)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const query = searchParams.get('q');
    const typesParam = searchParams.get('types');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    if (!query) {
      return NextResponse.json({ error: 'q (query) parameter is required' }, { status: 400 });
    }

    z.string().uuid().parse(workspaceId);

    // Parse types parameter
    const types = typesParam
      ? typesParam
          .split(',')
          .filter((t) =>
            [
              'agents',
              'workflows',
              'knowledge',
              'customers',
              'contacts',
              'prospects',
              'projects',
              'tasks',
            ].includes(t),
          )
      : undefined;

    // Execute search using Server Action
    const result = await universalSearch({
      workspaceId,
      query,
      types: types as any,
      limit,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      results: result.results,
      total: result.total,
      byType: result.byType,
    });
  } catch (error) {
    console.error('[Search API Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
