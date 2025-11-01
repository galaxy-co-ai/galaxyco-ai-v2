import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaces } from '@galaxyco/database/schema';
import { eq, desc } from 'drizzle-orm';
import { checkSystemAdmin } from '@/lib/auth/admin-check';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// NOTE: Admin routes don't create resources, only list and update existing ones

/**
 * GET /api/admin/workspaces
 * List all workspaces (admin only - cross-tenant)
 *
 * Query params:
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized admin workspaces list request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 3. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn('Non-admin attempted to access workspaces', { clerkUserId });
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // 4. Fetch all workspaces from database
    const allWorkspaces = await db.query.workspaces.findMany({
      orderBy: [desc(workspaces.createdAt)],
      limit,
      offset,
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      workspaces: allWorkspaces,
      total: allWorkspaces.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('List admin workspaces error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
  }
}
