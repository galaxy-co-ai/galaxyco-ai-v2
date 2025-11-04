import { NextRequest, NextResponse } from 'next/server';
import { rateAgentTemplate } from '@/lib/actions/marketplace-actions';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * POST /api/marketplace/agents/[id]/rate
 * Rate an agent template
 *
 * Body:
 * - rating: number (1-5)
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = z.string().uuid().parse(params.id);
    const body = await req.json();

    const result = await rateAgentTemplate({
      templateId,
      rating: body.rating,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      newRating: result.newRating,
    });
  } catch (error) {
    console.error('[Marketplace Rate Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: 'Rating must be between 1 and 5',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to rate agent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
