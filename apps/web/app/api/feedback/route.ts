import { NextRequest, NextResponse } from 'next/server';
import { submitFeedback, getFeedback } from '@/lib/actions/feedback-actions';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * GET /api/feedback
 * Get feedback submissions for a workspace
 *
 * Query params:
 * - workspaceId: string (required)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    const result = await getFeedback(workspaceId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      feedback: result.feedback,
      message: result.message,
    });
  } catch (error) {
    console.error('[Feedback Get Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/feedback
 * Submit user feedback
 *
 * Body:
 * - workspaceId: string
 * - type: 'bug' | 'feature' | 'improvement' | 'praise' | 'other'
 * - title: string
 * - message: string
 * - rating?: number (1-5)
 * - page?: string
 * - metadata?: object
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const result = await submitFeedback(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      feedback: result.feedback,
      message: result.message,
    });
  } catch (error) {
    console.error('[Feedback Submit Error]', error);

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
        error: 'Failed to submit feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
