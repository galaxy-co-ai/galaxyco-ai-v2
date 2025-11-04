import { NextRequest, NextResponse } from 'next/server';
import { getTrendingAgents } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/marketplace/trending
 * Get trending agent templates
 *
 * Query params:
 * - limit?: number (default: 10)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Create cache key based on limit
    const cacheKey = `marketplace:trending:${limit}`;

    // Use cache wrapper (5 min TTL for trending data)
    const result = await withCache(
      cacheKey,
      cacheTTL.medium, // 5 minutes
      async () => {
        return await getTrendingAgents(limit);
      },
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      templates: result.templates,
    });
  } catch (error) {
    console.error('[Marketplace Trending Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch trending agents',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
