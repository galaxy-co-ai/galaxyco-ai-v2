import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { galaxyGrids } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { withCache } from '@/lib/cache/with-cache';
import { cacheTTL } from '@/lib/cache/redis';

/**
 * GET /api/workflows
 * List all workflows for the current workspace
 *
 * Query params:
 * - workspaceId: string (required)
 * - status?: 'active' | 'draft' | 'paused' | 'archived'
 * - limit?: number
 * - offset?: number
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status') || '';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // Create cache key based on workspace and filters
    const cacheKey = `workspace:${workspaceId}:workflows:${status}:${limit}:${offset}`;

    // Use cache wrapper (1 min TTL for user-specific data)
    const result = await withCache(
      cacheKey,
      cacheTTL.short, // 1 minute (frequently changing user data)
      async () => {
        // Query database with filters
        let query = db
          .select()
          .from(galaxyGrids)
          .where(eq(galaxyGrids.workspaceId, workspaceId)) // CRITICAL: Multi-tenant isolation
          .orderBy(desc(galaxyGrids.updatedAt))
          .limit(parseInt(limit))
          .offset(parseInt(offset));

        // Apply status filter if provided
        if (status && ['draft', 'published', 'archived'].includes(status)) {
          query = db
            .select()
            .from(galaxyGrids)
            .where(
              and(
                eq(galaxyGrids.workspaceId, workspaceId),
                eq(galaxyGrids.status, status as 'draft' | 'published' | 'archived'),
              ),
            )
            .orderBy(desc(galaxyGrids.updatedAt))
            .limit(parseInt(limit))
            .offset(parseInt(offset));
        }

        const workflows = await query;

        // Get total count
        const totalCountQuery = db
          .select()
          .from(galaxyGrids)
          .where(eq(galaxyGrids.workspaceId, workspaceId));

        const totalWorkflows = await totalCountQuery;
        const total = totalWorkflows.length;

        return {
          workflows,
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        };
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflows API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch workflows',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const CreateWorkflowSchema = z.object({
      workspaceId: z.string().uuid(),
      name: z.string().min(1).max(255),
      description: z.string().max(1000).optional(),
      viewport: z
        .object({
          x: z.number(),
          y: z.number(),
          zoom: z.number(),
        })
        .optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      tags: z.array(z.string()).optional(),
    });

    const validated = CreateWorkflowSchema.parse(body);

    // Insert into database with multi-tenant isolation
    const [workflow] = await db
      .insert(galaxyGrids)
      .values({
        workspaceId: validated.workspaceId,
        name: validated.name,
        description: validated.description || '',
        viewport: validated.viewport || { x: 0, y: 0, zoom: 1 },
        status: validated.status || 'draft',
        tags: validated.tags || [],
        createdBy: clerkUserId,
        isPublic: false,
        version: 1,
      })
      .returning();

    // Invalidate workflows cache after creation
    try {
      const { cache } = await import('@/lib/cache/redis');
      await cache.del(`workspace:${validated.workspaceId}:workflows:::50:0`); // Default workflow view for workspace
      await cache.del(
        `workspace:${validated.workspaceId}:workflows:${validated.status || 'draft'}:50:0`,
      ); // Status-specific cache
    } catch (cacheError) {
      console.error('[Cache Invalidation Error]', cacheError);
    }

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (error) {
    console.error('[Workflows API Error]', error);

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
        error: 'Failed to create workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
