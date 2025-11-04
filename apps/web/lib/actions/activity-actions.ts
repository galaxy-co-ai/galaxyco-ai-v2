/**
 * Server Actions for Activity Feed
 *
 * Provides audit log and activity tracking functionality
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { auditLogs, users } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { headers } from 'next/headers';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

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

const GetActivityLogsSchema = z.object({
  workspaceId: z.string().uuid(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  resourceType: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().uuid().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }
  return clerkUserId;
}

async function getUserMetadata() {
  const headersList = headers();
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';

  return { ipAddress, userAgent };
}

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    console.error('[Activity Action Error]', error);

    if (error.message.includes('not found')) {
      return 'Activity log not found';
    }
    if (error.message.includes('permission')) {
      return "You don't have permission to perform this action";
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Log an activity/audit event
 *
 * @param data Activity log data
 * @returns Success/error result
 */
export async function logActivity(data: z.infer<typeof CreateActivityLogSchema>) {
  try {
    const validated = CreateActivityLogSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to log activities' };
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Get request metadata
    const { ipAddress, userAgent } = await getUserMetadata();

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

    return {
      success: true,
      activity: {
        id: activity.id,
        action: activity.action,
        resourceType: activity.resourceType,
        createdAt: activity.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get activity logs for a workspace
 *
 * @param params Query parameters
 * @returns Activity logs or error
 */
export async function getActivityLogs(params: z.infer<typeof GetActivityLogsSchema>) {
  try {
    const validated = GetActivityLogsSchema.parse(params);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view activity logs' };
    }

    // Build query with multi-tenant isolation
    let query = db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, validated.workspaceId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(validated.limit || 50)
      .offset(validated.offset || 0);

    // Apply filters
    const conditions = [eq(auditLogs.workspaceId, validated.workspaceId)];

    if (validated.resourceType) {
      conditions.push(eq(auditLogs.resourceType, validated.resourceType));
    }

    if (validated.action) {
      conditions.push(eq(auditLogs.action, validated.action));
    }

    if (validated.userId) {
      conditions.push(eq(auditLogs.userId, validated.userId));
    }

    query = db
      .select()
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(validated.limit || 50)
      .offset(validated.offset || 0);

    const activities = await query;

    // Get total count
    const totalQuery = db
      .select()
      .from(auditLogs)
      .where(and(...conditions));

    const totalActivities = await totalQuery;

    return {
      success: true,
      activities,
      total: totalActivities.length,
      limit: validated.limit || 50,
      offset: validated.offset || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get activity logs for a specific resource
 *
 * @param workspaceId Workspace ID
 * @param resourceType Resource type (e.g., 'agent', 'workflow')
 * @param resourceId Resource ID
 * @returns Activity logs for the resource
 */
export async function getResourceActivity(
  workspaceId: string,
  resourceType: string,
  resourceId: string,
) {
  try {
    z.string().uuid().parse(workspaceId);
    z.string().min(1).parse(resourceType);
    z.string().min(1).parse(resourceId);

    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view activity logs' };
    }

    const activities = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.workspaceId, workspaceId),
          eq(auditLogs.resourceType, resourceType),
          eq(auditLogs.resourceId, resourceId),
        ),
      )
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return {
      success: true,
      activities,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get activity summary/stats for a workspace
 *
 * @param workspaceId Workspace ID
 * @returns Activity statistics
 */
export async function getActivityStats(workspaceId: string) {
  try {
    z.string().uuid().parse(workspaceId);

    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view activity stats' };
    }

    // Get all activities for the workspace
    const activities = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId));

    // Calculate stats
    const stats = {
      total: activities.length,
      byAction: activities.reduce(
        (acc, activity) => {
          acc[activity.action] = (acc[activity.action] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byResourceType: activities.reduce(
        (acc, activity) => {
          acc[activity.resourceType] = (acc[activity.resourceType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      recent24h: activities.filter(
        (a) => new Date(a.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000,
      ).length,
      recent7d: activities.filter(
        (a) => new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).length,
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
