/**
 * Server Actions for User Feedback
 *
 * Collects user feedback and feature requests
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const SubmitFeedbackSchema = z.object({
  workspaceId: z.string().uuid(),
  type: z.enum(['bug', 'feature', 'improvement', 'praise', 'other']),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
  rating: z.number().min(1).max(5).optional(), // 1-5 stars
  page: z.string().optional(), // Which page was the user on?
  metadata: z.record(z.any()).optional(),
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

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    console.error('[Feedback Action Error]', error);
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Submit user feedback
 *
 * NOTE: This is a stub implementation. In production, integrate with:
 * - Linear (for feature requests/bugs)
 * - PostHog (for product analytics)
 * - Canny (for feedback/roadmap)
 * - Or custom feedback system
 */
export async function submitFeedback(data: z.infer<typeof SubmitFeedbackSchema>) {
  try {
    const validated = SubmitFeedbackSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to submit feedback' };
    }

    // Get user info
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // TODO: Integrate with feedback system (Linear, Canny, etc.)
    // For now, log to console
    console.log('[User Feedback Submitted]', {
      workspaceId: validated.workspaceId,
      userId: user.id,
      userEmail: user.email,
      type: validated.type,
      title: validated.title,
      message: validated.message,
      rating: validated.rating,
      page: validated.page,
      metadata: validated.metadata,
      createdAt: new Date().toISOString(),
    });

    // Generate feedback ID
    const feedbackId = `FEEDBACK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      feedback: {
        id: feedbackId,
        type: validated.type,
        title: validated.title,
        status: 'submitted',
        createdAt: new Date(),
      },
      message:
        'Thank you for your feedback! We review all submissions and will get back to you if needed.',
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get feedback submissions for a workspace
 *
 * NOTE: Stub implementation
 * TODO: Integrate with feedback system
 */
export async function getFeedback(workspaceId: string) {
  try {
    z.string().uuid().parse(workspaceId);

    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view feedback' };
    }

    // TODO: Fetch from feedback system
    return {
      success: true,
      feedback: [],
      message: 'Feedback integration pending. Submissions will appear here once configured.',
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
