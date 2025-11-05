/**
 * AI Assistant Monitoring & Analytics
 *
 * Tracks AI assistant usage, performance, and user interactions.
 * Provides insights for optimization and improvement.
 */

'use server';

import { db } from '@galaxyco/database';
import { aiConversations, aiMessages } from '@galaxyco/database/schema';
import { eq, and, gte, desc, count, sql } from 'drizzle-orm';
import { performanceTracker } from './performance';

export interface AssistantMetrics {
  totalConversations: number;
  totalMessages: number;
  toolExecutions: number;
  averageResponseTime: number;
  successRate: number;
  popularTools: Array<{ tool: string; count: number }>;
  userSatisfaction: number;
}

/**
 * Log AI assistant usage
 */
export async function logAssistantUsage(params: {
  workspaceId: string;
  userId: string;
  conversationId: string;
  message: string;
  toolsUsed?: string[];
  responseTime: number;
  success: boolean;
}) {
  try {
    // Log to console for now (in production, would send to analytics service)
    if (process.env.NODE_ENV === 'development') {
      console.log('Assistant Usage:', {
        workspace: params.workspaceId,
        tools: params.toolsUsed,
        responseTime: `${params.responseTime}ms`,
        success: params.success,
      });
    }

    // Store metrics in performance tracker
    performanceTracker.record('assistant_usage', 1);
    
    if (params.toolsUsed && params.toolsUsed.length > 0) {
      performanceTracker.record('tools_executed', params.toolsUsed.length);
    }

    // In production, would send to Sentry/analytics service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Would send structured event to Sentry here
    }
  } catch (error) {
    console.error('Failed to log assistant usage:', error);
    // Don't throw - logging shouldn't break the app
  }
}

/**
 * Get AI assistant metrics for a workspace
 */
export async function getAssistantMetrics(
  workspaceId: string,
  timeRange: 'day' | 'week' | 'month' = 'week',
): Promise<AssistantMetrics> {
  try {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get conversation count
    const conversations = await db.query.aiConversations.findMany({
      where: and(
        eq(aiConversations.workspaceId, workspaceId),
        gte(aiConversations.createdAt, startDate),
      ),
    });

    // Get message count and tool usage
    const messages = await db.query.aiMessages.findMany({
      where: and(
        sql`${aiMessages.conversationId} IN (
          SELECT id FROM ${aiConversations} WHERE workspace_id = ${workspaceId}
        )`,
        gte(aiMessages.createdAt, startDate),
      ),
    });

    // Calculate metrics
    const toolExecutions = messages.filter(
      (m) => m.metadata && (m.metadata as any).toolsUsed?.length > 0,
    ).length;

    const responseTimes = messages
      .map((m) => (m.metadata as any)?.responseTime)
      .filter((rt): rt is number => typeof rt === 'number');

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length
        : 0;

    const successfulMessages = messages.filter(
      (m) => m.metadata && (m.metadata as any).success !== false,
    ).length;

    const successRate =
      messages.length > 0 ? (successfulMessages / messages.length) * 100 : 100;

    // Count tool usage
    const toolUsage: Record<string, number> = {};
    messages.forEach((m) => {
      const tools = (m.metadata as any)?.toolsUsed || [];
      tools.forEach((tool: string) => {
        toolUsage[tool] = (toolUsage[tool] || 0) + 1;
      });
    });

    const popularTools = Object.entries(toolUsage)
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalConversations: conversations.length,
      totalMessages: messages.length,
      toolExecutions,
      averageResponseTime: Math.round(averageResponseTime),
      successRate: Math.round(successRate),
      popularTools,
      userSatisfaction: 95, // Would calculate from feedback in production
    };
  } catch (error) {
    console.error('Failed to get assistant metrics:', error);
    
    // Return default metrics on error
    return {
      totalConversations: 0,
      totalMessages: 0,
      toolExecutions: 0,
      averageResponseTime: 0,
      successRate: 0,
      popularTools: [],
      userSatisfaction: 0,
    };
  }
}

/**
 * Performance optimization: Cache frequently used data
 */
export const ASSISTANT_CACHE_TTL = {
  METRICS: 60 * 5, // 5 minutes
  POPULAR_TOOLS: 60 * 15, // 15 minutes
  CONVERSATION_HISTORY: 60 * 60, // 1 hour
};

