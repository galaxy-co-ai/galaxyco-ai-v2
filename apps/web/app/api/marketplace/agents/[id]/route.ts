import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { agentTemplates } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/marketplace/agents/[id]
 * Get agent template details
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = z.string().uuid().parse(params.id);

    // Create cache key for specific agent template
    const cacheKey = `marketplace:agent:${templateId}`;

    // Use cache wrapper (10 min TTL for template details)
    const template = await withCache(
      cacheKey,
      cacheTTL.long, // 30 minutes
      async () => {
        const [result] = await db
          .select()
          .from(agentTemplates)
          .where(eq(agentTemplates.id, templateId));

        return result;
      },
    );

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (!template.isPublished) {
      return NextResponse.json({ error: 'Template not available' }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('[Marketplace Agent Get Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
