import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, webhooks } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateWebhookSecret } from '@/lib/webhooks/signature';
import { createWebhookSchema } from '@/lib/validation/analytics';
import { safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * POST /api/webhooks
 * Create a new webhook
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Webhooks data
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized webhook creation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.WEBHOOK_OPS);
    if (!rateLimitResult.success) {
      logger.warn('Webhooks creation rate limit exceeded', {
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
    const validation = safeValidateRequest(createWebhookSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn('Invalid webhook creation request', {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { workspaceId, ...webhookData } = validation.data;

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

    // 6. Create webhook in database with secret
    const secret = generateWebhookSecret();

    const insertValues: typeof webhooks.$inferInsert = {
      workspaceId,
      name: webhookData.name,
      url: webhookData.url,
      events: webhookData.events,
      secret, // Store in plain text (consider encryption for production)
      createdBy: user.id,
    };

    const [webhook] = await db.insert(webhooks).values(insertValues).returning();

    // 7. Return success
    const durationMs = Date.now() - startTime;

    logger.info('Webhook created successfully', {
      userId: user.id,
      workspaceId,
      webhookId: webhook.id,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      webhook,
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset));

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Create webhook error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: 'Failed to create webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/webhooks
 * List all webhooks for a workspace
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
      logger.warn('Unauthorized webhooks list request');
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

    // 5. Fetch webhooks (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mockWebhooks = [
      {
        id: crypto.randomUUID(),
        workspaceId,
        createdAt: new Date().toISOString(),
      },
    ].slice(offset, offset + limit);

    return NextResponse.json({
      webhooks: mockWebhooks,
      total: mockWebhooks.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('List webhooks error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}
