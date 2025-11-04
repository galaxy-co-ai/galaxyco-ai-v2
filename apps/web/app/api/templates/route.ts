/**
 * Workflow Templates API
 * CRUD operations for workflow templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@galaxyco/database';
import { gridTemplates } from '@galaxyco/database';
import { desc, eq, and, or, like } from 'drizzle-orm';
import { CreateTemplateSchema } from '@/lib/templates/types';
import { randomUUID } from 'crypto';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/templates
 * List all workflow templates
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const complexity = searchParams.get('complexity') || '';
    const featured = searchParams.get('featured') || '';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    // Create cache key based on query parameters
    const cacheKey = `templates:workflows:${query}:${category}:${complexity}:${featured}:${limit}:${offset}`;

    // Use cache wrapper (30 min TTL for templates - less frequently updated)
    const result = await withCache(
      cacheKey,
      cacheTTL.long, // 30 minutes (templates rarely change)
      async () => {
        // Build query
        const conditions: any[] = [];

        if (category) {
          conditions.push(eq(gridTemplates.category, category));
        }

        if (complexity && ['beginner', 'intermediate', 'advanced'].includes(complexity)) {
          conditions.push(eq(gridTemplates.complexity, complexity as any));
        }

        if (featured !== '') {
          conditions.push(eq(gridTemplates.featured, featured === 'true'));
        }

        if (query) {
          const nameCondition = like(gridTemplates.name, `%${query}%`);
          const descCondition = like(gridTemplates.description, `%${query}%`);
          if (nameCondition && descCondition) {
            conditions.push(or(nameCondition, descCondition));
          }
        }

        let templates;
        if (conditions.length > 0) {
          templates = await db
            .select()
            .from(gridTemplates)
            .where(and(...conditions))
            .orderBy(desc(gridTemplates.uses))
            .limit(parseInt(limit))
            .offset(parseInt(offset));
        } else {
          templates = await db
            .select()
            .from(gridTemplates)
            .orderBy(desc(gridTemplates.uses))
            .limit(parseInt(limit))
            .offset(parseInt(offset));
        }

        // Get total count
        const totalTemplates = await db.select().from(gridTemplates);

        return {
          templates,
          total: totalTemplates.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
        };
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/templates
 * Create a new workflow template
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const templateData = CreateTemplateSchema.parse(body);

    // Create template
    const [newTemplate] = await db
      .insert(gridTemplates)
      .values({
        id: randomUUID(),
        name: templateData.name,
        description: templateData.description || null,
        category: templateData.category,
        tags: templateData.tags,
        thumbnailUrl: templateData.thumbnailUrl || null,
        previewData: templateData.previewData,
        complexity: templateData.complexity || null,
        estimatedTime: templateData.estimatedTime || null,
        uses: 0,
        rating: null,
        featured: false,
        authorId: userId,
        createdAt: new Date(),
      })
      .returning();

    // Invalidate templates cache after creation
    try {
      const { cache } = await import('@/lib/cache/redis');
      await cache.del('templates:workflows:::::50:0'); // Default templates view
      await cache.del(`templates:workflows::${templateData.category}:::50:0`); // Category-specific cache
    } catch (cacheError) {
      console.error('[Cache Invalidation Error]', cacheError);
    }

    return NextResponse.json({
      success: true,
      template: newTemplate,
    });
  } catch (error) {
    console.error('Error creating template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors[0]?.message || 'Validation failed',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
