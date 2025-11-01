import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, workspaces } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { adminWorkspaceUpdateSchema } from '@/lib/validation/analytics';
import { safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { checkSystemAdmin } from '@/lib/auth/admin-check';

/**
 * GET /api/admin/workspaces/[id]
 * Get a single workspace by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn('Non-admin attempted to access workspace', { clerkUserId });
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // 3. Fetch workspace from database
    const workspaceId = params.id;
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    logger.info('Admin workspace fetched', {
      userId: adminCheck.user.id,
      workspaceId,
    });

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    logger.error('Fetch workspace error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Failed to fetch workspace' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/workspaces/[id]
 * Update a workspace
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting
    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.ADMIN_OPS);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 3. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn('Non-admin attempted to update workspace', { clerkUserId });
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // 4. Validate request body
    const workspaceId = params.id;
    const body = await req.json();
    const validation = safeValidateRequest(adminWorkspaceUpdateSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      return NextResponse.json(formattedError, { status: 400 });
    }

    // 5. Check workspace exists
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // 6. Update workspace in database
    const [updated] = await db
      .update(workspaces)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    const durationMs = Date.now() - startTime;
    logger.info('Admin workspace updated successfully', {
      userId: adminCheck.user.id,
      workspaceId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      workspace: updated,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Update workspace error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
    });
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/workspaces/[id]
 * Delete a workspace
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting
    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.ADMIN_OPS);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 3. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn('Non-admin attempted to delete workspace', { clerkUserId });
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // 4. Check workspace exists
    const workspaceId = params.id;
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // 5. Soft delete workspace (set isActive = false)
    await db
      .update(workspaces)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId));

    const durationMs = Date.now() - startTime;
    logger.info('Admin workspace deleted successfully', {
      userId: adminCheck.user.id,
      workspaceId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Delete workspace error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
    });
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
  }
}
