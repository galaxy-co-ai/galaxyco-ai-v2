import { NextRequest, NextResponse } from 'next/server';
import { installAgentTemplate } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { cache } from '@/lib/cache/redis';

/**
 * POST /api/marketplace/agents/[id]/install
 * Install an agent template to workspace
 *
 * Body:
 * - workspaceId: string
 * - customName?: string (optional custom name for installed agent)
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = z.string().uuid().parse(params.id);
    const body = await req.json();

    const result = await installAgentTemplate({
      templateId,
      workspaceId: body.workspaceId,
      customName: body.customName,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Invalidate marketplace cache after installation
    // This ensures marketplace data reflects updated install counts
    try {
      // Note: Upstash doesn't support pattern deletion, so we invalidate common cache keys
      await cache.del('marketplace:agents::::trending:50:0'); // Default marketplace view
      await cache.del(`marketplace:agents:::::${templateId}`); // Template-specific cache
      await cache.del('marketplace:trending:10'); // Trending agents (default limit)
      await cache.del('marketplace:featured'); // Featured agents
      await cache.del('marketplace:categories'); // Categories list
      await cache.del(`marketplace:agent:${templateId}`); // Agent details
    } catch (cacheError) {
      // Cache invalidation failure shouldn't break the install
      console.error('[Cache Invalidation Error]', cacheError);
    }

    return NextResponse.json({
      success: true,
      agent: result.agent,
      message: result.message,
    });
  } catch (error) {
    console.error('[Marketplace Install Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to install agent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
