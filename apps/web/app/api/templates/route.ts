/**
 * Workflow Templates API
 * CRUD operations for workflow templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@galaxyco/database';
import { gridTemplates } from '@galaxyco/database';
import { desc, eq, and, sql, or } from 'drizzle-orm';
import { CreateTemplateSchema } from '@/lib/templates/types';
import { randomUUID } from 'crypto';

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

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    let query = db.select().from(gridTemplates);

    // Apply filters
    const conditions = [];

    if (category) {
      conditions.push(eq(gridTemplates.category, category));
    }

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

    return NextResponse.json(
      {
        template: newTemplate,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
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
