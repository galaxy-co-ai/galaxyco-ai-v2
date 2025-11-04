import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { auditLogs, users } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

/**
 * GET /api/activity
 * Get activity logs for a workspace
 *
 * Query params:
 * - workspaceId: string (required)
 * - limit?: number (default: 50)
 * - offset?: number (default: 0)
 * - resourceType?: string (filter by resource type)
 * - action?: string (filter by action)
 * - userId?: string (filter by user)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const resourceType = searchParams.get('resourceType');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // Validate UUID
    z.string().uuid().parse(workspaceId);

    // Build query with multi-tenant isolation
    const conditions = [eq(auditLogs.workspaceId, workspaceId)];

    if (resourceType) {
      conditions.push(eq(auditLogs.resourceType, resourceType));
    }

    if (action) {
      conditions.push(eq(auditLogs.action, action));
    }

    if (userId) {
      z.string().uuid().parse(userId);
      conditions.push(eq(auditLogs.userId, userId));
    }

    const activities = await db
      .select()
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalActivities = await db
      .select()
      .from(auditLogs)
      .where(and(...conditions));

    return NextResponse.json({
      activities,
      total: totalActivities.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Activity API Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch activity logs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/activity
 * Create an activity log entry
 *
 * DEPRECATED: Use Server Actions in /lib/actions/activity-actions.ts instead
 * This endpoint is kept for backwards compatibility
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const CreateActivityLogSchema = z.object({
      workspaceId: z.string().uuid(),
      action: z.string().min(1).max(100),
      resourceType: z.string().min(1).max(100),
      resourceId: z.string().optional(),
      changes: z
        .object({
          before: z.record(z.any()).optional(),
          after: z.record(z.any()).optional(),
        })
        .optional(),
      metadata: z.record(z.any()).optional(),
    });

    const validated = CreateActivityLogSchema.parse(body);

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get request metadata
    const ipAddress =
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Create audit log entry
    const [activity] = await db
      .insert(auditLogs)
      .values({
        workspaceId: validated.workspaceId,
        userId: user.id,
        userEmail: user.email,
        ipAddress,
        userAgent,
        action: validated.action,
        resourceType: validated.resourceType,
        resourceId: validated.resourceId || null,
        changes: validated.changes || {},
        metadata: validated.metadata || {},
      })
      .returning();

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error('[Activity Create Error]', error);

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
        error: 'Failed to create activity log',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
