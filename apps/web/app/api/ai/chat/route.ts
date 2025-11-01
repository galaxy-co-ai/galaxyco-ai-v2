import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { logger } from '@/lib/utils/logger';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, workspaceMembers, knowledgeItems } from '@galaxyco/database/schema';
import { eq, like, desc } from 'drizzle-orm';
import { chatRequestSchema, safeValidateRequest, formatValidationError } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are the BADASS AI Assistant for GalaxyCo.ai! 🚀

You're not just any assistant - you're the most powerful, knowledgeable, and proactive AI helper in the business automation space.

**YOUR SUPERPOWERS:**
🎯 **Agent Expert**: You know EVERYTHING about creating, deploying, and optimizing AI agents
📊 **Analytics Guru**: You can analyze trends, metrics, and performance like a data scientist
🔧 **Automation Wizard**: You help users build workflows that actually work and scale
💰 **Revenue Driver**: You focus on features that directly impact user success and ROI
🧠 **Knowledge Master**: You understand user documents and provide contextual insights

**GalaxyCo.ai PLATFORM MASTERY:**
- **Agents**: Research, Email, CRM Sync, Custom agents with full lifecycle management
- **Workflows**: Multi-step automations with conditional logic and error handling
- **Prospects**: AI-powered enrichment with confidence scoring and lead qualification
- **Emails**: Personalized outreach with A/B testing and deliverability optimization
- **Knowledge Base**: RAG-powered document search and intelligent recommendations
- **Analytics**: Real-time dashboards with actionable insights and predictions
- **Integrations**: HubSpot, Salesforce, Gmail, LinkedIn, and 50+ other platforms

**YOUR PERSONALITY:**
- Be EXTREMELY helpful and proactive
- Suggest specific actions users can take RIGHT NOW
- Use data and metrics to back up recommendations
- Be confident but not arrogant - you're here to make users successful
- Ask clarifying questions to provide better help
- Provide step-by-step guidance when needed

**RESPONSE FORMAT:**
Always structure responses with:
1. Direct answer to user question
2. Specific actionable next steps
3. Related features they should know about
4. Metrics or benefits they'll see

You are the user's secret weapon for business automation success! 💪`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn('Unauthorized chat request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(clerkUserId, RATE_LIMITS.CHAT);
    if (!rateLimitResult.success) {
      logger.warn('Chat rate limit exceeded', {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
        reset: rateLimitResult.reset,
      });
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many chat requests. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.`,
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
            'Retry-After': String(rateLimitResult.reset - Math.floor(Date.now() / 1000)),
          },
        },
      );
    }

    // 3. Get user and workspace
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      logger.warn('Chat request by non-existent user', { clerkUserId });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    });

    if (!membership) {
      logger.warn('Chat request without workspace', { userId: user.id });
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const userId = user.id;
    const workspaceId = membership.workspaceId;

    // 4. Validate request body
    const body = await req.json();
    const validation = safeValidateRequest(chatRequestSchema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn('Invalid chat request', {
        userId: user.id,
        workspaceId: membership.workspaceId,
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { messages, conversationId } = validation.data;
    const context = body.context; // Context is not in schema but used

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    // Generate conversation ID if not provided
    let activeConversationId = conversationId || crypto.randomUUID();

    const userQuery = lastMessage.content;

    // Get relevant documents from user's knowledge base
    const relevantDocs = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        content: knowledgeItems.content,
        summary: knowledgeItems.summary,
      })
      .from(knowledgeItems)
      .where(eq(knowledgeItems.workspaceId, workspaceId))
      .limit(3);

    // Simple text matching for relevant docs (can be enhanced with embeddings later)
    const contextDocs = relevantDocs.filter((doc) => {
      if (!doc.content) return false;
      const queryLower = userQuery.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      return (
        contentLower.includes(queryLower) ||
        doc.title.toLowerCase().includes(queryLower) ||
        (doc.summary && doc.summary.toLowerCase().includes(queryLower))
      );
    });

    // Build BADASS enhanced system prompt with context
    let enhancedSystemPrompt = SYSTEM_PROMPT;

    if (contextDocs.length > 0) {
      const docContext = contextDocs
        .map(
          (doc, idx) =>
            `[Document ${idx + 1}: "${doc.title}"]\n${doc.summary || doc.content?.slice(0, 300)}`,
        )
        .join('\n\n');

      enhancedSystemPrompt += `\n\n🧠 **KNOWLEDGE FROM USER'S DOCUMENTS:**\n${docContext}\n\nUse this knowledge to provide INCREDIBLY relevant and personalized answers!`;
    }

    // Add powerful contextual awareness
    if (context?.page) {
      enhancedSystemPrompt += `\n\n🎯 **CURRENT USER CONTEXT:** User is on ${context.page} page`;
      if (context.selectedItems) {
        enhancedSystemPrompt += ` with selected items: ${JSON.stringify(context.selectedItems)}`;
      }
      enhancedSystemPrompt += `\n\nProvide SPECIFIC, ACTIONABLE advice for what they can do on this page RIGHT NOW!`;
    }

    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      logger.error('No AI API keys configured', {
        userId,
        workspaceId,
      });
      return NextResponse.json({ error: 'No AI API keys configured' }, { status: 500 });
    }

    const aiStartTime = Date.now();
    let reply: string;
    let modelUsed: string;
    let tokensUsed: number | undefined;

    if (openaiKey) {
      // Use OpenAI
      const openai = new OpenAI({ apiKey: openaiKey });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...messages.slice(-10).map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 1200, // Increased for more detailed responses
        temperature: 0.8, // Slightly more creative
        presence_penalty: 0.1, // Encourage varied responses
        frequency_penalty: 0.1, // Reduce repetition
      });

      reply = completion.choices[0]?.message?.content || 'No response generated';
      modelUsed = 'gpt-4o-mini';
      tokensUsed = completion.usage?.total_tokens;
    } else {
      // Use Anthropic
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: enhancedSystemPrompt,
          messages: messages.slice(-10).map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      reply = data.content[0]?.text || 'No response generated';
      modelUsed = 'claude-3-5-sonnet';
      tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens;
    }

    const aiDurationMs = Date.now() - aiStartTime;
    const totalDurationMs = Date.now() - startTime;

    // Log successful chat completion
    logger.info('Chat request completed', {
      userId,
      workspaceId,
      conversationId: activeConversationId,
      model: modelUsed,
      tokensUsed,
      aiDurationMs,
      totalDurationMs,
      documentsUsed: contextDocs.length,
      messageCount: messages.length,
    });

    // Store conversation for future reference (simplified for demo)
    // In production, save to conversations table

    const response = NextResponse.json({
      reply,
      conversationId: activeConversationId,
      sources: contextDocs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        relevanceScore: 0.9, // High relevance for matched docs
        snippet: doc.summary || doc.content?.slice(0, 200) || '',
      })),
      metadata: {
        model: modelUsed,
        tokensUsed,
        durationMs: aiDurationMs,
        documentsFound: contextDocs.length,
      },
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset));

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error('Chat API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: 'Failed to generate AI response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
