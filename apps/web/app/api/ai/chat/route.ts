import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireSession } from '@/lib/services/user-session';
import { conversationService } from '@/lib/services/conversation-service';
import { ragService } from '@/lib/services/rag-service';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are an AI assistant for GalaxyCo.ai, a multi-agent AI automation platform.

GalaxyCo helps users automate outreach and lead generation with AI agents:

**Key Features:**
- **AI Agents**: Research Agent (prospect enrichment), Email Agent (personalized outreach), CRM Sync Agent (HubSpot/Salesforce/Pipedrive)
- **Workflows**: Chain multiple agents together for end-to-end automation
- **Prospects**: Manage enriched leads with confidence scores and enrichment data
- **Emails**: Review and approve AI-generated outreach emails before sending
- **Integrations**: Connect HubSpot, Gmail, LinkedIn, and other services
- **Dashboard**: Track metrics like active agents, prospects enriched, emails sent, reply rates

**Navigation:**
- Dashboard: Overview of key metrics
- Agents: Create and manage AI agents
- Workflows: Build multi-step automation
- Prospects: View enriched prospect database
- Emails: Review AI-generated emails
- Settings: Profile, integrations, notifications

Be helpful, concise, and guide users to the right features. Answer questions about agents, workflows, prospects, emails, and platform capabilities.`;

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user session
    const session = await requireSession();
    const { userId, workspaceId } = session;

    const body = await req.json();
    const { messages, conversationId, context } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    // Get or create conversation
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const newConversation = await conversationService.createConversation({
        userId,
        workspaceId,
        context: context || {},
      });
      activeConversationId = newConversation.id;
    }

    // Get RAG context from user's documents
    const userQuery = lastMessage.content;
    const ragContext = await ragService.getRAGContext(
      userQuery,
      workspaceId,
      activeConversationId
    );

    // Build enhanced system prompt with RAG context
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    if (ragContext.sources.length > 0) {
      const sourceText = ragContext.sources
        .map((source, idx) => 
          `[Source ${idx + 1}: ${source.item.title}]\n${source.snippet}`
        )
        .join('\n\n');
      
      enhancedSystemPrompt += `\n\n**Relevant Information from User's Documents:**\n${sourceText}\n\nUse this information to provide more accurate, personalized answers.`;
    }

    // Add page context if available
    if (context?.page) {
      enhancedSystemPrompt += `\n\n**User Context:** Currently viewing page: ${context.page}`;
      if (context.selectedItems) {
        enhancedSystemPrompt += `, Selected items: ${JSON.stringify(context.selectedItems)}`;
      }
    }

    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json(
        { error: 'No AI API keys configured' },
        { status: 500 }
      );
    }

    const startTime = Date.now();
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
        max_tokens: 800,
        temperature: 0.7,
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

    const durationMs = Date.now() - startTime;

    // Save user message to database
    await conversationService.addMessage({
      conversationId: activeConversationId,
      role: 'user',
      content: userQuery,
    });

    // Save assistant reply to database with metadata
    await conversationService.addMessage({
      conversationId: activeConversationId,
      role: 'assistant',
      content: reply,
      metadata: {
        sources: ragContext.sources.map(source => ({
          type: 'knowledge_item' as const,
          id: source.item.id,
          title: source.item.title,
          relevanceScore: source.relevanceScore,
        })),
        model: modelUsed,
        tokensUsed,
        durationMs,
      },
    });

    return NextResponse.json({ 
      reply,
      conversationId: activeConversationId,
      sources: ragContext.sources.map(source => ({
        id: source.item.id,
        title: source.item.title,
        relevanceScore: source.relevanceScore,
        snippet: source.snippet,
      })),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
