import { NextRequest, NextResponse } from 'next/server';
import { createSupportTicket, getSupportTickets } from '@/lib/actions/support-actions';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * GET /api/support
 * Get support tickets for the current workspace
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

    const result = await getSupportTickets(workspaceId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      tickets: result.tickets,
      message: result.message,
    });
  } catch (error) {
    console.error('[Support Get Error]', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch support tickets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/support
 * Create a new support ticket
 *
 * Body:
 * - workspaceId: string
 * - subject: string
 * - message: string
 * - priority?: 'low' | 'medium' | 'high' | 'urgent'
 * - category?: 'bug' | 'feature' | 'question' | 'other'
 * - attachments?: Array<{ name, url, size }>
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const result = await createSupportTicket(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
      message: result.message,
    });
  } catch (error) {
    console.error('[Support Create Error]', error);

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
        error: 'Failed to create support ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
