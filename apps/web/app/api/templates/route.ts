/**
 * Workflow Templates API
 * CRUD operations for workflow templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
<<<<<<< Updated upstream
import { db } from '@galaxyco/database';
import { gridTemplates } from '@galaxyco/database';
import { desc, eq, and, sql, or } from 'drizzle-orm';
import { CreateTemplateSchema } from '@/lib/templates/types';
import { randomUUID } from 'crypto';
=======
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    let query = db.select().from(gridTemplates);

    // Apply filters
    const conditions = [];
=======
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const complexity = searchParams.get('complexity') || '';
    const featured = searchParams.get('featured') || '';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    // Create cache key based on query parameters
    const cacheKey = `templates:workflows:${query}:${category}:${complexity}:${featured}:${limit}:${offset}`;
>>>>>>> Stashed changes

    // Use cache wrapper (10 min TTL for templates - less frequently updated)
    const result = await withCache(
      cacheKey,
      cacheTTL.long, // 30 minutes (templates rarely change)
      async () => {
        // Build query
        const conditions: any[] = [];

<<<<<<< Updated upstream
    if (featured) {
      conditions.push(eq(gridTemplates.featured, true));
    }

    if (search) {
      conditions.push(
        or(
          sql`${gridTemplates.name} ILIKE ${`%${search}%`}`,
          sql`${gridTemplates.description} ILIKE ${`%${search}%`}`,
        ),
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Order by featured, then uses, then created date
    const templates = await query
      .orderBy(
        desc(gridTemplates.featured),
        desc(gridTemplates.uses),
        desc(gridTemplates.createdAt),
      )
      .limit(limit);

    return NextResponse.json({
      templates,
      count: templates.length,
    });
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    return NextResponse.json(
      {
        template: newTemplate,
      },
      { status: 201 },
    );
=======
    // Invalidate templates cache after creation
    try {
      const { cache } = await import('@/lib/cache/redis');
      await cache.del('templates:workflows:::::50:0'); // Default templates view
      await cache.del(`templates:workflows::${validated.category}:::50:0`); // Category-specific cache
    } catch (cacheError) {
      console.error('[Cache Invalidation Error]', cacheError);
    }

    return NextResponse.json({
      success: true,
      template,
    });
>>>>>>> Stashed changes
  } catch (error) {
    console.error('Error creating template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
<<<<<<< Updated upstream
        { error: 'Invalid request', details: error.errors },
=======
        {
          error: 'Invalid input',
          details: error.errors[0]?.message || 'Validation failed',
        },
>>>>>>> Stashed changes
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
