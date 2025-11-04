import { NextRequest, NextResponse } from 'next/server';
import { searchMarketplace } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/marketplace
 * Browse marketplace agents
 *
 * Query params:
 * - query?: string (search in name/description)
 * - category?: string
 * - featured?: boolean
 * - sortBy?: 'popular' | 'newest' | 'rating' | 'trending'
 * - limit?: number (default: 50)
 * - offset?: number (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') || '';
    const sortBy = searchParams.get('sortBy') || 'trending';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    // Create cache key based on query parameters
    const cacheKey = `marketplace:agents:${query}:${category}:${featured}:${sortBy}:${limit}:${offset}`;

    // Use cache wrapper (5 min TTL for marketplace data)
    const result = await withCache(
      cacheKey,
      cacheTTL.medium, // 5 minutes
      async () => {
        return await searchMarketplace({
          query: query || undefined,
          category: category || undefined,
          featured: featured === 'true' ? true : undefined,
          sortBy: (sortBy as any) || undefined,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
        });
      },
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      templates: result.templates,
      total: result.total,
    });
  } catch (error) {
    console.error('[Marketplace API Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch marketplace agents',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
