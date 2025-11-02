/**
 * GalaxyCo.ai Messages API
 * Save and load messages for conversations
 * November 2, 2025
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, aiMessages, aiConversations, users } from '@/lib/db';
import { eq, and, asc } from 'drizzle-orm';

// GET - Load messages for a conversation
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversation ID from query params
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user owns this conversation
    const conversation = await db.query.aiConversations.findFirst({
      where: and(eq(aiConversations.id, conversationId), eq(aiConversations.userId, user.id)),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or unauthorized' },
        { status: 404 },
      );
    }

    // Fetch messages for conversation
    const conversationMessages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(asc(aiMessages.createdAt));

    return NextResponse.json({ messages: conversationMessages });
  } catch (error) {
    console.error('Load messages error:', error);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}

// POST - Save messages to conversation
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, messages } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify user owns this conversation
    const conversation = await db.query.aiConversations.findFirst({
      where: and(eq(aiConversations.id, conversationId), eq(aiConversations.userId, user.id)),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or unauthorized' },
        { status: 404 },
      );
    }

    // Save messages to database
    const saved = await db
      .insert(aiMessages)
      .values(
        messages.map((msg: any) => ({
          conversationId,
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata || {},
        })),
      )
      .returning();

    // Update conversation metadata
    await db
      .update(aiConversations)
      .set({
        lastMessageAt: new Date(),
        messageCount: (conversation.messageCount || 0) + messages.length,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));

    return NextResponse.json({ messages: saved });
  } catch (error) {
    console.error('Save messages error:', error);
    return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
  }
}
