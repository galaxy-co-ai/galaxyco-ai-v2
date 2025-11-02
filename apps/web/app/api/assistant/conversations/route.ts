/**
 * GalaxyCo.ai Conversations API
 * List and create conversations
 * November 2, 2025
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, aiConversations, users } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// GET - List user's conversations
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database to get UUID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch conversations for the user
    const userConversations = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, user.id))
      .orderBy(desc(aiConversations.updatedAt))
      .limit(50);

    return NextResponse.json({ conversations: userConversations });
  } catch (error) {
    console.error('List conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

/**
 * Generate smart conversation title from context
 */
function generateTitleFromContext(context?: any): string {
  if (!context) return 'New Conversation';

  // Generate title based on page
  if (context.page) {
    if (context.page.includes('/agents')) {
      return context.selectedItems?.agentId
        ? 'Agent Discussion'
        : 'Agent Assistance';
    } else if (context.page.includes('/workflows') || context.page.includes('/studio')) {
      return context.selectedItems?.workflowId
        ? 'Workflow Optimization'
        : 'Workflow Creation';
    } else if (context.page.includes('/crm/customers')) {
      return 'Customer Insights';
    } else if (context.page.includes('/crm/prospects')) {
      return 'Prospect Strategy';
    } else if (context.page.includes('/dashboard')) {
      return 'Dashboard Review';
    }
  }

  return 'New Conversation';
}

// POST - Create new conversation
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, workspaceId, context } = await req.json();

    // Get user from database to get UUID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate smart title from context if not provided
    const conversationTitle = title || generateTitleFromContext(context);

    // Create new conversation
    const newConversation = await db
      .insert(aiConversations)
      .values({
        workspaceId: workspaceId || null,
        userId: user.id,
        title: conversationTitle,
        context: context || {}, // Store page context
      })
      .returning();

    return NextResponse.json({ conversation: newConversation[0] }, { status: 201 });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

