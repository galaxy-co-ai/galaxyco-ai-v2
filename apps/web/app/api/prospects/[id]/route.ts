import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { updateProspectSchema } from '@/lib/validation/crm';
import { safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/prospects/[id]
 * Get a single prospect by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prospectId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // PLACEHOLDER - Replace with actual database query in Phase 2
    const mockProspect = {
      id: prospectId,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      prospect: mockProspect,
    });
  } catch (error) {
    logger.error('Fetch prospect error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Failed to fetch prospect' }, { status: 500 });
  }
}

/**
 * PUT /api/prospects/[id]
 * Update a prospect
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.CRM_CREATE);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const prospectId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const validation = safeValidateRequest(updateProspectSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      return NextResponse.json(formattedError, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // PLACEHOLDER - Replace with actual database update in Phase 2
    const updatedProspect = {
      id: prospectId,
      workspaceId,
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    const durationMs = Date.now() - startTime;
    logger.info('Prospects updated successfully', {
      userId: user.id,
      workspaceId,
      prospectId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      prospect: updatedProspect,
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Update prospect error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
    });
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
  }
}

/**
 * DELETE /api/prospects/[id]
 * Delete a prospect
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.CRM_CREATE);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const prospectId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query param: workspaceId' },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // PLACEHOLDER - Replace with actual soft delete in Phase 2
    const durationMs = Date.now() - startTime;
    logger.info('Prospects deleted successfully', {
      userId: user.id,
      workspaceId,
      prospectId,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: 'Prospects deleted successfully',
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Delete prospect error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs,
    });
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 });
  }
}
