/**
 * Server Actions for AI Assistant V2
 * Handles conversation persistence and management
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db, aiConversations, aiMessages, users, workspaceMembers } from '@galaxyco/database';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CreateConversationSchema = z.object({
  title: z.string().optional(),
  context: z.record(z.any()).optional(),
});

const SaveMessagesSchema = z.object({
  conversationId: z.string().uuid(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      metadata: z.record(z.any()).optional(),
    }),
  ),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
    with: {
      workspaceMembers: {
        where: eq(workspaceMembers.isActive, true),
        limit: 1,
      },
    },
  });

  if (!user || !user.workspaceMembers?.[0]) return null;

  return {
    id: user.id,
    clerkUserId,
    workspaceId: user.workspaceMembers[0].workspaceId,
  };
}

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create a new conversation
 */
export async function createConversation(data?: z.infer<typeof CreateConversationSchema>) {
  try {
    const validated = data ? CreateConversationSchema.parse(data) : {};
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Create conversation
    const [conversation] = await db
      .insert(aiConversations)
      .values({
        workspaceId: user.workspaceId,
        userId: user.id,
        title: validated.title || 'New Conversation',
        context: validated.context || {},
        messageCount: 0,
      })
      .returning();

    revalidatePath('/assistant-v2');

    return {
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
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
 * List conversations for current workspace
 */
export async function listConversations(limit: number = 50, offset: number = 0) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get conversations
    const conversations = await db
      .select({
        id: aiConversations.id,
        title: aiConversations.title,
        messageCount: aiConversations.messageCount,
        isPinned: aiConversations.isPinned,
        lastMessageAt: aiConversations.lastMessageAt,
        createdAt: aiConversations.createdAt,
        updatedAt: aiConversations.updatedAt,
      })
      .from(aiConversations)
      .where(
        and(eq(aiConversations.workspaceId, user.workspaceId), eq(aiConversations.userId, user.id)),
      )
      .orderBy(desc(aiConversations.updatedAt))
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      conversations,
      total: conversations.length,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
      conversations: [],
    };
  }
}

/**
 * Get a single conversation with messages
 */
export async function getConversation(conversationId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get conversation
    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.workspaceId, user.workspaceId),
        eq(aiConversations.userId, user.id),
      ),
      with: {
        messages: {
          orderBy: [desc(aiMessages.createdAt)],
        },
      },
    });

    if (!conversation) {
      return { success: false, error: 'Conversation not found' };
    }

    return {
      success: true,
      conversation,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Save messages to a conversation
 * Called after each AI response
 */
export async function saveMessages(data: z.infer<typeof SaveMessagesSchema>) {
  try {
    const validated = SaveMessagesSchema.parse(data);
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Verify conversation belongs to user
    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, validated.conversationId),
        eq(aiConversations.workspaceId, user.workspaceId),
        eq(aiConversations.userId, user.id),
      ),
    });

    if (!conversation) {
      return { success: false, error: 'Conversation not found' };
    }

    // Insert messages
    const insertedMessages = await db
      .insert(aiMessages)
      .values(
        validated.messages.map((msg) => ({
          conversationId: validated.conversationId,
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
        messageCount: conversation.messageCount + validated.messages.length,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, validated.conversationId));

    revalidatePath('/assistant-v2');

    return {
      success: true,
      messages: insertedMessages,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Update conversation (title, pin status, etc.)
 */
export async function updateConversation(
  conversationId: string,
  data: { title?: string; isPinned?: boolean; tags?: string[] },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Update conversation
    const [updated] = await db
      .update(aiConversations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(aiConversations.id, conversationId),
          eq(aiConversations.workspaceId, user.workspaceId),
          eq(aiConversations.userId, user.id),
        ),
      )
      .returning();

    if (!updated) {
      return { success: false, error: 'Conversation not found' };
    }

    revalidatePath('/assistant-v2');

    return {
      success: true,
      conversation: updated,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Delete conversation
 */
export async function deleteConversation(conversationId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'You must be signed in' };
    }

    // Delete conversation (messages will cascade delete)
    await db
      .delete(aiConversations)
      .where(
        and(
          eq(aiConversations.id, conversationId),
          eq(aiConversations.workspaceId, user.workspaceId),
          eq(aiConversations.userId, user.id),
        ),
      );

    revalidatePath('/assistant-v2');

    return {
      success: true,
      message: 'Conversation deleted',
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
