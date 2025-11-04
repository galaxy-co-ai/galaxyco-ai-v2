import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';
// import { assistantTools } from '@/lib/ai/assistant/tools'; // Tools disabled temporarily
import {
  getWorkspaceContext,
  generateSystemPromptWithContext,
} from '@/lib/ai/assistant/rag-service';
import { db, users, workspaceMembers } from '@galaxyco/database';
import { eq, and } from 'drizzle-orm';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key not configured',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
      with: {
        workspaceMembers: {
          where: eq(workspaceMembers.isActive, true),
          limit: 1,
        },
      },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Get active workspace
    const workspaceId = user.workspaceMembers?.[0]?.workspaceId;
    if (!workspaceId) {
      return new Response('No active workspace', { status: 400 });
    }

    // Parse request body
    const body = await req.json();
    const { messages = [], model = 'gpt-4-turbo' } = body;

    // Get RAG context for the workspace
    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1]?.content : '';
    const ragContext = await getWorkspaceContext(workspaceId, lastUserMessage);

    // Base system prompt
    const basePrompt = `You are GalaxyCo AI Assistant, an expert AI operating system for business automation.

**Your Capabilities:**
- Create and manage AI agents (use createAgent tool)
- Search and analyze CRM data (use searchCustomers tool)
- Build automation workflows (use createWorkflow tool)
- Analyze workflow performance (use analyzeWorkflow tool)
- Search knowledge base (use searchDocuments tool)
- Get agent status (use getAgentStatus tool)
- Analyze sales metrics (use analyzeSales tool)
- List workspace agents (use listAgents tool)

**Guidelines:**
- Be proactive: Use tools to actually DO things, not just describe them
- Be concise and actionable
- Use markdown for clarity (headings, lists, bold)
- When user asks to create something, use the appropriate tool
- After using a tool, explain what you did and provide next steps
- Be professional but friendly`;

    // Enhance with RAG context
    const systemPrompt = generateSystemPromptWithContext(
      basePrompt,
      ragContext,
      user.firstName || 'User',
    );

    // Convert messages to CoreMessages
    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content || '',
    }));

    // Select AI provider based on model
    const getModel = (modelId: string) => {
      if (modelId.startsWith('claude-')) {
        return anthropic(modelId);
      } else if (modelId.startsWith('gemini-')) {
        return google(modelId);
      } else {
        // Default to OpenAI
        return openai(modelId);
      }
    };

    // Stream response with tools
    const result = await streamText({
      model: getModel(model),
      system: systemPrompt,
      messages: coreMessages,
      // tools: assistantTools, // TEMPORARILY DISABLED - fix tool types separately
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Assistant API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
