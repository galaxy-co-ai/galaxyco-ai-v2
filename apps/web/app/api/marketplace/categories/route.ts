import { NextRequest, NextResponse } from 'next/server';
import { getMarketplaceCategories } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/marketplace/categories
 * Get all marketplace categories with agent counts
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create cache key for categories
    const cacheKey = 'marketplace:categories';

    // Use cache wrapper (10 min TTL - categories rarely change)
    const result = await withCache(
      cacheKey,
      cacheTTL.long, // 30 minutes
      async () => {
        return await getMarketplaceCategories();
      },
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      categories: result.categories,
    });
  } catch (error) {
    console.error('[Marketplace Categories Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
