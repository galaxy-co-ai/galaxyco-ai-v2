import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/utils/logger';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, workspaces } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { checkSystemAdmin } from '@/lib/auth/admin-check';
import { adminUserUpdateSchema } from '@/lib/validation/analytics';
import { safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * POST /api/admin/users
 * Create a new user
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - Users data
 */

/**
 * GET /api/admin/users
 * List all users (admin only - cross-tenant)
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
      logger.warn('Unauthorized admin/users list request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check admin role
    const adminCheck = await checkSystemAdmin(clerkUserId);
    if (!adminCheck.authorized) {
      logger.warn('Non-admin attempted to access users', { clerkUserId });
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // 3. Get query params
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 4. Fetch all users from database
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      limit,
      offset,
      with: {
        workspaceMembers: {
          with: {
            workspace: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: allUsers,
      total: allUsers.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('List admin/users error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to fetch admin/users' }, { status: 500 });
  }
}
