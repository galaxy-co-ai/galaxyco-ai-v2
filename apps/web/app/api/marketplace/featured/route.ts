import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedAgents } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/marketplace/featured
 * Get featured agent templates
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create cache key for featured agents
    const cacheKey = 'marketplace:featured';

    // Use cache wrapper (5 min TTL for featured data)
    const result = await withCache(
      cacheKey,
      cacheTTL.medium, // 5 minutes
      async () => {
        return await getFeaturedAgents();
      },
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      templates: result.templates,
    });
  } catch (error) {
    console.error('[Marketplace Featured Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch featured agents',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
