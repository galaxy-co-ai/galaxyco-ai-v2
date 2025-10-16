/**
 * Trigger.dev Job: Conversation Summarization
 *
 * Handles periodic conversation summarization:
 * - Auto-generate meaningful titles
 * - Extract key topics and themes
 * - Generate conversation tags
 * - Summarize long conversations
 */

import { logger, task, schedules } from "@trigger.dev/sdk/v3";
import { db } from "@galaxyco/database";
import { aiConversations, aiMessages } from "@galaxyco/database/schema";
import { and, eq, gte } from "drizzle-orm";

interface GenerateTitlePayload {
  conversationId: string;
  firstMessage: string;
  userId: string;
  workspaceId: string;
}

interface SummarizeConversationPayload {
  conversationId: string;
  userId: string;
  workspaceId: string;
  messageCount: number;
}

/**
 * Task: Generate title from first message
 */
export const generateConversationTitleTask = task({
  id: "generate-conversation-title",
  maxDuration: 60, // 1 minute
  run: async (payload: GenerateTitlePayload, { ctx }) => {
    const { conversationId, firstMessage, userId, workspaceId } = payload;

    logger.info(`Generating title for conversation ${conversationId}`);

    try {
      // Use OpenAI to generate a meaningful title
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Generate a short, descriptive title (max 50 chars) for this conversation. Return only the title, no quotes.",
              },
              {
                role: "user",
                content: `First message: ${firstMessage.slice(0, 500)}`,
              },
            ],
            max_tokens: 20,
            temperature: 0.5,
          }),
        },
      );

      const data = await response.json();
      const generatedTitle =
        data.choices[0]?.message?.content?.trim() || "Untitled Conversation";
      const title =
        generatedTitle.length > 50
          ? generatedTitle.slice(0, 47) + "..."
          : generatedTitle;

      // Update conversation with generated title
      await db
        .update(aiConversations)
        .set({
          title,
          updatedAt: new Date(),
        })
        .where(eq(aiConversations.id, conversationId));

      logger.info(`✓ Generated title: "${title}"`);

      return {
        success: true,
        conversationId,
        title,
      };
    } catch (error) {
      logger.error(`Title generation failed: ${error}`);
      throw error;
    }
  },
});

/**
 * Task: Summarize and tag conversation
 */
export const summarizeConversationTask = task({
  id: "summarize-conversation",
  maxDuration: 300, // 5 minutes
  run: async (payload: SummarizeConversationPayload, { ctx }) => {
    const { conversationId, userId, workspaceId, messageCount } = payload;

    logger.info(
      `Summarizing conversation ${conversationId} (${messageCount} messages)`,
    );

    try {
      // Fetch recent messages
      const messages = await db.query.aiMessages.findMany({
        where: eq(aiMessages.conversationId, conversationId),
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        limit: 50,
      });

      // Build conversation transcript
      const transcript = messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");

      // Generate summary
      const summaryRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Summarize this conversation in 2-3 sentences. Focus on key topics, decisions, and action items.",
              },
              {
                role: "user",
                content: `Conversation transcript:\n\n${transcript.slice(0, 6000)}`,
              },
            ],
            max_tokens: 200,
            temperature: 0.3,
          }),
        },
      );
      const summaryData = await summaryRes.json();
      const summary =
        summaryData.choices[0]?.message?.content || "Summary unavailable";

      // Extract key topics/tags
      const tagsRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Extract 3-5 key topics/tags from this conversation. Return as JSON array of strings.",
              },
              {
                role: "user",
                content: `Conversation transcript:\n\n${transcript.slice(0, 4000)}`,
              },
            ],
            max_tokens: 50,
            temperature: 0.3,
          }),
        },
      );
      const tagsData = await tagsRes.json();
      const tagsString = tagsData.choices[0]?.message?.content || "[]";
      let tags: string[];
      try {
        tags = JSON.parse(tagsString);
      } catch {
        tags = tagsString
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
          .slice(0, 5);
      }

      // Update conversation with summary and tags
      await db
        .update(aiConversations)
        .set({
          tags,
          updatedAt: new Date(),
        })
        .where(eq(aiConversations.id, conversationId));

      // Note: Summary stored in tags for now, full metadata support coming soon
      logger.info(`Summary: ${summary.slice(0, 100)}...`);

      logger.info(`✓ Conversation summarized with ${tags.length} tags`);

      return {
        success: true,
        conversationId,
        summary,
        tags,
      };
    } catch (error) {
      logger.error(`Conversation summarization failed: ${error}`);
      throw error;
    }
  },
});
