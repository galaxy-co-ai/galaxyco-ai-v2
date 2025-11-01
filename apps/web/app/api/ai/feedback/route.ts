import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { aiMessageFeedback, aiMessages } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { messageId, feedbackType, comment } = body;

    // Validate input
    if (!messageId || !feedbackType) {
      return NextResponse.json(
        { error: 'messageId and feedbackType are required' },
        { status: 400 },
      );
    }

    if (!['positive', 'negative'].includes(feedbackType)) {
      return NextResponse.json(
        { error: "feedbackType must be 'positive' or 'negative'" },
        { status: 400 },
      );
    }

    // Get message to verify it exists and get workspace ID
    const message = await db.query.aiMessages.findFirst({
      where: eq(aiMessages.id, messageId),
      with: {
        conversation: true,
      },
    });

    if (!message || !message.conversation) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const workspaceId = message.conversation.workspaceId;

    // Check if feedback already exists
    const existingFeedback = await db.query.aiMessageFeedback.findFirst({
      where: and(eq(aiMessageFeedback.messageId, messageId), eq(aiMessageFeedback.userId, userId)),
    });

    if (existingFeedback) {
      // Update existing feedback
      const [updated] = await db
        .update(aiMessageFeedback)
        .set({
          feedbackType,
          comment: comment || null,
        })
        .where(eq(aiMessageFeedback.id, existingFeedback.id))
        .returning();

      logger.info('AI message feedback updated', {
        feedbackId: updated.id,
        messageId,
        userId,
        workspaceId,
        feedbackType,
      });

      return NextResponse.json({
        success: true,
        feedback: updated,
        updated: true,
      });
    } else {
      // Create new feedback
      const [created] = await db
        .insert(aiMessageFeedback)
        .values({
          messageId,
          workspaceId,
          userId,
          feedbackType,
          comment: comment || null,
        })
        .returning();

      logger.info('AI message feedback created', {
        feedbackId: created.id,
        messageId,
        userId,
        workspaceId,
        feedbackType,
      });

      return NextResponse.json({
        success: true,
        feedback: created,
        updated: false,
      });
    }
  } catch (error) {
    logger.error('Failed to submit AI message feedback', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
