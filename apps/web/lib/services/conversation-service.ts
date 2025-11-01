/**
 * Conversation Service
 *
 * Manages AI chat conversations, message history, context tracking,
 * and user preferences.
 */

import { db } from '@galaxyco/database';
import {
  aiConversations,
  aiMessages,
  aiUserPreferences,
  type AiConversation,
  type AiMessage,
  type NewAiMessage,
  type NewAiConversation,
  type AiUserPreferences,
} from '@galaxyco/database/schema';
import { and, eq, desc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface CreateConversationParams {
  userId: string;
  workspaceId: string;
  title?: string;
  context?: {
    page?: string;
    selectedItems?: {
      agentId?: string;
      prospectId?: string;
      workflowId?: string;
    };
    documentIds?: string[];
  };
}

export interface AddMessageParams {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    sources?: Array<{
      type: 'document' | 'knowledge_item' | 'agent' | 'prospect';
      id: string;
      title: string;
      relevanceScore?: number;
    }>;
    model?: string;
    tokensUsed?: number;
    durationMs?: number;
    functionCalls?: Array<{
      name: string;
      args: any;
      result: any;
    }>;
  };
}

export interface ConversationContext {
  conversation: AiConversation;
  recentMessages: AiMessage[];
  userPreferences: AiUserPreferences | null;
}

export class ConversationService {
  /**
   * Create a new conversation
   */
  async createConversation(params: CreateConversationParams): Promise<AiConversation> {
    const { userId, workspaceId, title, context } = params;

    const conversation = await db
      .insert(aiConversations)
      .values({
        id: nanoid(),
        userId,
        workspaceId,
        title: title || 'New Conversation',
        context: context || {},
      })
      .returning();

    return conversation[0];
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(
    conversationId: string,
    workspaceId: string,
  ): Promise<ConversationContext | null> {
    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.workspaceId, workspaceId),
      ),
      with: {
        messages: {
          orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          limit: 10,
        },
      },
    });

    if (!conversation) {
      return null;
    }

    // Get user preferences
    const userPreferences = await this.getUserPreferences(conversation.userId, workspaceId);

    return {
      conversation,
      recentMessages: conversation.messages.reverse(),
      userPreferences,
    };
  }

  /**
   * Get user conversations
   */
  async getUserConversations(
    userId: string,
    workspaceId: string,
    limit: number = 20,
  ): Promise<AiConversation[]> {
    const conversations = await db.query.aiConversations.findMany({
      where: and(eq(aiConversations.userId, userId), eq(aiConversations.workspaceId, workspaceId)),
      orderBy: (conversations, { desc }) => [desc(conversations.lastMessageAt)],
      limit,
    });

    return conversations;
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(params: AddMessageParams): Promise<AiMessage> {
    const { conversationId, role, content, metadata } = params;

    // Create the message
    const [message] = await db
      .insert(aiMessages)
      .values({
        id: nanoid(),
        conversationId,
        role,
        content,
        metadata: metadata || {},
      })
      .returning();

    // Update conversation
    await db
      .update(aiConversations)
      .set({
        lastMessageAt: new Date(),
        messageCount: sql`${aiConversations.messageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));

    // Update title from first user message if needed
    if (role === 'user') {
      const conversation = await db.query.aiConversations.findFirst({
        where: eq(aiConversations.id, conversationId),
      });

      if (conversation && conversation.title === 'New Conversation') {
        await this.generateConversationTitle(conversationId, content);
      }
    }

    return message;
  }

  /**
   * Generate a title for the conversation based on the first message
   */
  private async generateConversationTitle(
    conversationId: string,
    firstMessage: string,
  ): Promise<void> {
    // Simple title generation - take first 50 chars
    const title = firstMessage.length > 50 ? firstMessage.slice(0, 47) + '...' : firstMessage;

    await db
      .update(aiConversations)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string, workspaceId: string): Promise<AiUserPreferences | null> {
    const preferences = await db.query.aiUserPreferences.findFirst({
      where: and(
        eq(aiUserPreferences.userId, userId),
        eq(aiUserPreferences.workspaceId, workspaceId),
      ),
    });

    return preferences || null;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    workspaceId: string,
    updates: Partial<AiUserPreferences>,
  ): Promise<AiUserPreferences> {
    // Check if preferences exist
    const existing = await this.getUserPreferences(userId, workspaceId);

    if (existing) {
      // Update existing
      const [updated] = await db
        .update(aiUserPreferences)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(
          and(eq(aiUserPreferences.userId, userId), eq(aiUserPreferences.workspaceId, workspaceId)),
        )
        .returning();

      return updated;
    } else {
      // Create new
      const [created] = await db
        .insert(aiUserPreferences)
        .values({
          id: nanoid(),
          userId,
          workspaceId,
          ...updates,
        })
        .returning();

      return created;
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(conversationId: string, workspaceId: string): Promise<boolean> {
    const result = await db
      .delete(aiConversations)
      .where(
        and(eq(aiConversations.id, conversationId), eq(aiConversations.workspaceId, workspaceId)),
      );

    return !!result;
  }

  /**
   * Search conversations
   */
  async searchConversations(
    userId: string,
    workspaceId: string,
    query: string,
  ): Promise<AiConversation[]> {
    // Get conversations with matching titles or content
    const conversations = await db.query.aiConversations.findMany({
      where: and(eq(aiConversations.userId, userId), eq(aiConversations.workspaceId, workspaceId)),
      with: {
        messages: {
          where: (messages, { like }) => like(messages.content, `%${query}%`),
          limit: 1,
        },
      },
      orderBy: (conversations, { desc }) => [desc(conversations.lastMessageAt)],
    });

    // Filter to those with matching title or messages
    const filtered = conversations.filter(
      (conv) => conv.title.toLowerCase().includes(query.toLowerCase()) || conv.messages.length > 0,
    );

    return filtered;
  }

  /**
   * Pin/unpin a conversation
   */
  async togglePinConversation(conversationId: string, workspaceId: string): Promise<boolean> {
    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.workspaceId, workspaceId),
      ),
    });

    if (!conversation) {
      return false;
    }

    await db
      .update(aiConversations)
      .set({
        isPinned: !conversation.isPinned,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));

    return true;
  }

  /**
   * Add tags to a conversation
   */
  async updateConversationTags(
    conversationId: string,
    workspaceId: string,
    tags: string[],
  ): Promise<void> {
    await db
      .update(aiConversations)
      .set({
        tags,
        updatedAt: new Date(),
      })
      .where(
        and(eq(aiConversations.id, conversationId), eq(aiConversations.workspaceId, workspaceId)),
      );
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(
    userId: string,
    workspaceId: string,
  ): Promise<{
    totalConversations: number;
    totalMessages: number;
    averageMessageLength: number;
    mostUsedTags: string[];
  }> {
    const conversations = await db.query.aiConversations.findMany({
      where: and(eq(aiConversations.userId, userId), eq(aiConversations.workspaceId, workspaceId)),
      with: {
        messages: true,
      },
    });

    const totalConversations = conversations.length;
    const allMessages = conversations.flatMap((c) => c.messages);
    const totalMessages = allMessages.length;

    const averageMessageLength =
      allMessages.length > 0
        ? allMessages.reduce((sum, m) => sum + m.content.length, 0) / allMessages.length
        : 0;

    // Count tags
    const tagCounts = new Map<string, number>();
    conversations.forEach((conv) => {
      conv.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const mostUsedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    return {
      totalConversations,
      totalMessages,
      averageMessageLength: Math.round(averageMessageLength),
      mostUsedTags,
    };
  }
}

// Export singleton instance
export const conversationService = new ConversationService();
