import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, notifications } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { createNotificationSchema } from '@/lib/validation/communication';
import { safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * POST /api/notifications
 * Create a new notification
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Notifications data
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized notification creation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.CRM_CREATE);
    if (!rateLimitResult.success) {
      logger.warn('Notifications creation rate limit exceeded', {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
        reset: rateLimitResult.reset,
      });
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.`,
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(rateLimitResult.reset - Math.floor(Date.now() / 1000)),
          },
        },
      );
    }

    // 3. Get and validate request body
    const body = await req.json();
    const validation = safeValidateRequest(createNotificationSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn('Invalid notification creation request', {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { workspaceId, ...notificationData } = validation.data;

    // 4. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: User not a member of this workspace' },
        { status: 403 },
      );
    }

    // 6. Create notification in database
    const insertValues: typeof notifications.$inferInsert = {
      workspaceId,
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      actionUrl: notificationData.actionUrl,
      actionLabel: notificationData.actionLabel,
      metadata: notificationData.metadata || {},
    };

    const [notification] = await db.insert(notifications).values(insertValues).returning();

    // 7. Return success
    const durationMs = Date.now() - startTime;

    logger.info('Notifications created successfully', {
      userId: user.id,
      workspaceId,
      notificationId: notification.id,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      notification,
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset));

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Create notification error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: 'Failed to create notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/notifications
 * List all notifications for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized notifications list request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden: User not a member of this workspace' },
        { status: 403 },
      );
    }

    // 5. Fetch notifications from database
    const userNotifications = await db.query.notifications.findMany({
      where: and(eq(notifications.workspaceId, workspaceId), eq(notifications.userId, user.id)),
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({
      notifications: userNotifications,
      total: userNotifications.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('List notifications error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
