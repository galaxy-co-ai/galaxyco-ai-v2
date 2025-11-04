# 🚀 AI Assistant V2 - Implementation Guide

**Date:** November 4, 2025  
**Purpose:** Step-by-step guide to build the new assistant

---

## 📋 Implementation Checklist

### **Phase 1: Foundation** (Week 1)

#### **Day 1: Setup & Dependencies**

- [ ] Install Vercel AI SDK (`pnpm add ai @ai-sdk/openai @ai-sdk/anthropic`)
- [ ] Install markdown deps (`pnpm add react-markdown remark-gfm rehype-highlight`)
- [ ] Install UI deps (`pnpm add react-textarea-autosize framer-motion`)
- [ ] Create folder structure (`apps/web/app/(app)/assistant-v2/`)
- [ ] Set up environment variables

```bash
# Install all dependencies
cd apps/web
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic
pnpm add react-markdown remark-gfm rehype-highlight rehype-raw
pnpm add react-textarea-autosize react-syntax-highlighter
pnpm add @types/react-syntax-highlighter -D
pnpm add prism-react-renderer
```

#### **Day 2: Basic Chat UI** (No AI yet)

- [ ] Create `ChatContainer.tsx` (layout only)
- [ ] Create `MessageBubble.tsx` (static messages)
- [ ] Create `ChatInput.tsx` (no submission)
- [ ] Create `MessageList.tsx` (scroll container)
- [ ] Test responsive layout
- [ ] Add Framer Motion animations

#### **Day 3: Streaming API Route**

- [ ] Create `/api/assistant-v2/chat/route.ts`
- [ ] Set up Vercel AI SDK `streamText`
- [ ] Test with basic GPT-4 responses
- [ ] Add error handling
- [ ] Test edge runtime

```typescript
// apps/web/app/api/assistant-v2/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, workspaceId } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    maxTokens: 4000,
    temperature: 0.7,
  });

  return result.toAIStreamResponse();
}
```

#### **Day 4: Wire UI to API**

- [ ] Connect `ChatContainer` to API with `useChat`
- [ ] Test streaming in browser
- [ ] Add loading states
- [ ] Add error toasts
- [ ] Test character-by-character streaming

#### **Day 5: Conversation Persistence**

- [ ] Create database schema (conversations, messages tables)
- [ ] Create Server Actions for CRUD
- [ ] Add save on message finish
- [ ] Add load on mount
- [ ] Test persistence

```sql
-- Database schema (Drizzle ORM)
CREATE TABLE assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  title TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4-turbo',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  tool_invocations JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_workspace ON assistant_conversations(workspace_id, updated_at DESC);
CREATE INDEX idx_messages_conversation ON assistant_messages(conversation_id, created_at ASC);
```

---

### **Phase 2: Intelligence** (Week 2)

#### **Day 6-7: RAG Integration**

- [ ] Create `getWorkspaceContext()` function
- [ ] Generate embeddings for user query
- [ ] Search Pinecone for relevant docs
- [ ] Inject context into system prompt
- [ ] Test context relevance

```typescript
// apps/web/lib/ai/assistant/rag-service.ts
import { openai } from '@/lib/ai/openai-client';
import { pinecone } from '@/lib/pinecone';

export async function getWorkspaceContext(
  workspaceId: string,
  userQuery: string,
): Promise<RAGContext> {
  // Generate embedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuery,
  });

  // Search vectors
  const namespace = pinecone.namespace(`workspace-${workspaceId}`);
  const searchResults = await namespace.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

  // Get structured data
  const [agents, customers, workflows] = await Promise.all([
    db.select().from(agents).where(eq(agents.workspaceId, workspaceId)).limit(5),
    db.select().from(customers).where(eq(customers.workspaceId, workspaceId)).limit(5),
    db.select().from(workflows).where(eq(workflows.workspaceId, workspaceId)).limit(5),
  ]);

  return {
    relevantDocs: searchResults.matches.map((m) => ({
      content: m.metadata.content,
      title: m.metadata.title,
      score: m.score,
    })),
    recentAgents: agents.map((a) => ({ id: a.id, name: a.name, description: a.description })),
    recentCustomers: customers.map((c) => ({ id: c.id, name: c.name, email: c.email })),
    recentWorkflows: workflows.map((w) => ({ id: w.id, name: w.name, status: w.status })),
  };
}
```

#### **Day 8-9: Tool Calling**

- [ ] Create tool registry
- [ ] Implement 5 core tools
- [ ] Wire tools to API route
- [ ] Create `ToolCallCard` component
- [ ] Test multi-step tool calling

```typescript
// apps/web/lib/ai/assistant/tool-registry.ts
import { tool } from 'ai';
import { z } from 'zod';

export const assistantTools = {
  // 1. Create Agent
  createAgent: tool({
    description: 'Create a new AI agent in the workspace',
    parameters: z.object({
      name: z.string().describe('Name of the agent'),
      description: z.string().describe('What the agent does'),
      type: z.enum(['email', 'research', 'crm', 'support']).describe('Agent type'),
      schedule: z.string().optional().describe('Cron schedule (optional)'),
    }),
    execute: async (params, { workspaceId }) => {
      const agent = await createAgentAction({
        ...params,
        workspaceId,
        status: 'draft',
      });

      return {
        success: true,
        agentId: agent.id,
        message: `Created agent "${params.name}" successfully`,
      };
    },
  }),

  // 2. Search CRM
  searchCustomers: tool({
    description: 'Search for customers in the CRM',
    parameters: z.object({
      query: z.string().describe('Search query'),
      limit: z.number().default(10).describe('Max results'),
      filters: z
        .object({
          status: z.enum(['active', 'inactive', 'all']).optional(),
          tags: z.array(z.string()).optional(),
        })
        .optional(),
    }),
    execute: async ({ query, limit, filters }, { workspaceId }) => {
      const customers = await searchCustomersAction(workspaceId, {
        query,
        limit,
        ...filters,
      });

      return {
        results: customers.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          company: c.company,
          lastContact: c.lastContactAt,
        })),
        totalFound: customers.length,
      };
    },
  }),

  // 3. Analyze Workflow
  analyzeWorkflow: tool({
    description: 'Get analytics and insights for a workflow',
    parameters: z.object({
      workflowId: z.string().describe('Workflow ID to analyze'),
      timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
    }),
    execute: async ({ workflowId, timeRange }, { workspaceId }) => {
      const analytics = await getWorkflowAnalyticsAction(workflowId, workspaceId, timeRange);

      return {
        totalRuns: analytics.totalRuns,
        successRate: analytics.successRate,
        avgDuration: analytics.avgDuration,
        lastRun: analytics.lastRun,
        topErrors: analytics.topErrors,
      };
    },
  }),

  // 4. Create Workflow
  createWorkflow: tool({
    description: 'Create a new automation workflow',
    parameters: z.object({
      name: z.string().describe('Workflow name'),
      description: z.string().describe('What the workflow does'),
      trigger: z.object({
        type: z.enum(['schedule', 'webhook', 'event']),
        config: z.record(z.any()),
      }),
      steps: z.array(
        z.object({
          action: z.string(),
          parameters: z.record(z.any()),
        }),
      ),
    }),
    execute: async (params, { workspaceId }) => {
      const workflow = await createWorkflowAction({
        ...params,
        workspaceId,
        status: 'draft',
      });

      return {
        success: true,
        workflowId: workflow.id,
        message: `Created workflow "${params.name}"`,
      };
    },
  }),

  // 5. Send Email Campaign
  sendCampaign: tool({
    description: 'Send an email campaign to customers',
    parameters: z.object({
      subject: z.string(),
      content: z.string(),
      recipients: z.object({
        segment: z.string().optional(),
        customerIds: z.array(z.string()).optional(),
      }),
      schedule: z.string().optional().describe('When to send (ISO date or "now")'),
    }),
    execute: async (params, { workspaceId }) => {
      const campaign = await createCampaignAction({
        ...params,
        workspaceId,
      });

      return {
        success: true,
        campaignId: campaign.id,
        estimatedRecipients: campaign.recipientCount,
        scheduledFor: campaign.scheduledAt,
      };
    },
  }),

  // 6. Get Agent Status
  getAgentStatus: tool({
    description: 'Check the status and performance of an AI agent',
    parameters: z.object({
      agentId: z.string().describe('Agent ID'),
    }),
    execute: async ({ agentId }, { workspaceId }) => {
      const agent = await getAgentAction(agentId, workspaceId);
      const stats = await getAgentStatsAction(agentId);

      return {
        name: agent.name,
        status: agent.status,
        lastRun: stats.lastRun,
        successRate: stats.successRate,
        totalExecutions: stats.totalExecutions,
      };
    },
  }),

  // 7. Upload Document
  uploadDocument: tool({
    description: 'Upload a document to the workspace library',
    parameters: z.object({
      title: z.string(),
      content: z.string(),
      type: z.enum(['text', 'markdown', 'code']),
      tags: z.array(z.string()).optional(),
    }),
    execute: async (params, { workspaceId }) => {
      const doc = await createDocumentAction({
        ...params,
        workspaceId,
      });

      // Generate and store embedding
      await embedDocumentAction(doc.id);

      return {
        success: true,
        documentId: doc.id,
        url: `/library/documents/${doc.id}`,
      };
    },
  }),

  // 8. Schedule Meeting
  scheduleMeeting: tool({
    description: 'Schedule a meeting with calendar integration',
    parameters: z.object({
      title: z.string(),
      attendees: z.array(z.string().email()),
      duration: z.number().describe('Duration in minutes'),
      proposedTimes: z.array(z.string()).describe('Preferred times (ISO)'),
    }),
    execute: async (params) => {
      // Integrate with Google Calendar
      const meeting = await scheduleCalendarEventAction(params);

      return {
        success: true,
        meetingId: meeting.id,
        confirmedTime: meeting.startTime,
        calendarLink: meeting.link,
      };
    },
  }),
};
```

---

## 🎨 System Prompt Engineering

### **Dynamic Context Injection**

```typescript
// apps/web/lib/ai/assistant/system-prompt.ts

export function generateSystemPrompt(workspaceId: string, context: RAGContext, user: User): string {
  const timestamp = new Date().toLocaleString();

  return `
# You are GalaxyCo AI Assistant

## Identity
You are an expert AI operating system assistant for ${user.firstName}'s business workspace.
You have deep knowledge of their agents, customers, workflows, and data.
Current time: ${timestamp}

## Capabilities
${
  context.recentAgents?.length > 0
    ? `
### AI Agents (${context.recentAgents.length} active)
You can create, manage, and analyze AI agents. Recent agents:
${context.recentAgents.map((a) => `- **${a.name}**: ${a.description} (Status: ${a.status})`).join('\n')}
`
    : ''
}

${
  context.recentCustomers?.length > 0
    ? `
### CRM Data (${context.recentCustomers.length} recent customers)
You have access to customer data and can search, analyze, and create segments:
${context.recentCustomers.map((c) => `- ${c.name} (${c.email}) - ${c.company || 'No company'}`).join('\n')}
`
    : ''
}

${
  context.recentWorkflows?.length > 0
    ? `
### Workflows (${context.recentWorkflows.length} active)
You can create and manage automation workflows:
${context.recentWorkflows.map((w) => `- **${w.name}**: ${w.description} (Runs: ${w.executionCount})`).join('\n')}
`
    : ''
}

${
  context.relevantDocs?.length > 0
    ? `
### Relevant Knowledge
Based on the conversation, here are relevant workspace documents:
${context.relevantDocs.map((d) => `- **${d.title}**: ${d.content.substring(0, 200)}... (Relevance: ${(d.score * 100).toFixed(0)}%)`).join('\n')}
`
    : ''
}

## Tools Available
You have access to powerful tools:
- **createAgent** - Build new AI agents
- **searchCustomers** - Find and analyze CRM data
- **analyzeWorkflow** - Get workflow insights
- **createWorkflow** - Build automations
- **sendCampaign** - Launch email campaigns
- **getAgentStatus** - Check agent performance
- **uploadDocument** - Add to knowledge base
- **scheduleMeeting** - Calendar integration

## Guidelines
1. **Be proactive**: Suggest actions and tools when helpful
2. **Use markdown**: Format responses for clarity (headings, lists, code blocks)
3. **Cite sources**: When using knowledge base, mention document names
4. **Confirm actions**: Always confirm before executing destructive operations
5. **Be concise**: Respect the user's time - be helpful but brief
6. **Show reasoning**: For complex tasks, explain your thinking
7. **Use tools**: Don't just describe what to do - actually do it with tools

## Conversation Style
- Professional but friendly
- Technical when needed, simple by default
- Proactive about suggesting improvements
- Ask clarifying questions for ambiguous requests
- Celebrate wins (agent deployments, campaign successes, etc.)

## Current Context
Workspace: ${context.workspaceName || 'Unknown'}
User: ${user.firstName} ${user.lastName}
Role: ${user.role || 'Member'}

Let's help ${user.firstName} accomplish their goals! 🚀
`;
}
```

---

## 🔧 Tool Execution Flow

### **How Tools Work**

```
User: "Create an email agent called Support Bot"
   ↓
AI decides to use createAgent tool
   ↓
Tool invocation sent to client
   ↓
ToolCallCard shows "Creating agent..." (loading)
   ↓
Server Action executes
   ↓
Result returned to AI
   ↓
AI responds: "✅ Created Support Bot! Here's what I set up..."
   ↓
ToolCallCard shows success state
```

### **API Route with Tools**

```typescript
// apps/web/app/api/assistant-v2/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { assistantTools } from '@/lib/ai/assistant/tool-registry';
import { generateSystemPrompt } from '@/lib/ai/assistant/system-prompt';
import { getWorkspaceContext } from '@/lib/ai/assistant/rag-service';

export async function POST(req: Request) {
  const { messages, workspaceId, model = 'gpt-4-turbo' } = await req.json();

  // Get user
  const user = await currentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Get RAG context
  const lastUserMessage = messages.findLast((m: any) => m.role === 'user');
  const context = await getWorkspaceContext(workspaceId, lastUserMessage.content);

  // Generate dynamic system prompt
  const systemPrompt = generateSystemPrompt(workspaceId, context, user);

  // Stream with tools
  const result = await streamText({
    model: openai(model),
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    tools: assistantTools,
    maxTokens: 4000,
    temperature: 0.7,

    // Tool execution context
    toolContext: {
      workspaceId,
      userId: user.id,
    },

    // Callbacks
    onFinish: async ({ text, toolCalls }) => {
      // Log for analytics
      await logAssistantUsage({
        workspaceId,
        userId: user.id,
        model,
        tokensUsed: text.length / 4, // Rough estimate
        toolsUsed: toolCalls?.length || 0,
      });
    },
  });

  return result.toAIStreamResponse();
}
```

---

## 🎨 UI Patterns (Framer/Linear Quality)

### **Empty State** (No messages yet)

```tsx
export function ChatEmptyState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="size-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center">
            <Sparkles className="size-10 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">What can I help with?</h1>
          <p className="text-lg text-muted-foreground">
            I can create agents, analyze data, search your CRM, and more
          </p>
        </div>

        {/* Quick prompts */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: Bot,
              title: 'Create an agent',
              prompt: 'Help me create an AI agent that handles customer support emails',
            },
            {
              icon: TrendingUp,
              title: 'Analyze sales',
              prompt: 'Analyze my sales data for the last 30 days and show trends',
            },
            {
              icon: Search,
              title: 'Find customers',
              prompt: 'Search for all customers in the tech industry',
            },
            {
              icon: Zap,
              title: 'Optimize workflows',
              prompt: 'Review my workflows and suggest performance improvements',
            },
          ].map((item) => (
            <Button
              key={item.title}
              variant="outline"
              className="h-auto p-6 justify-start text-left hover:bg-primary/5 hover:border-primary/20 hover:scale-[1.02] transition-all"
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <item.icon className="size-6 mr-4 text-primary shrink-0" />
              <div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.prompt}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            <span>Workspace knowledge</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            <span>Real-time actions</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            <span>Multi-model</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### **Streaming Indicator** (Typing animation)

```tsx
export function StreamingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 px-6 py-4"
    >
      <Avatar className="size-10">
        <AvatarImage src="/ai-avatar.png" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

      <Card className="p-4 rounded-2xl bg-card">
        <div className="flex items-center gap-2">
          {/* Animated dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="size-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
        </div>
      </Card>
    </motion.div>
  );
}
```

---

## 🧪 Testing Strategy

### **Unit Tests** (Vitest)

````typescript
// __tests__/assistant/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '@/components/assistant-v2/MessageBubble';

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      role: 'user',
      content: 'Hello AI',
      createdAt: new Date(),
    };

    render(<MessageBubble message={message} />);
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
  });

  it('renders markdown with code blocks', () => {
    const message = {
      id: '2',
      role: 'assistant',
      content: '```typescript\nconst x = 1;\n```',
      createdAt: new Date(),
    };

    render(<MessageBubble message={message} />);
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('shows copy button on hover', async () => {
    const message = { id: '3', role: 'assistant', content: 'Test' };
    const { container } = render(<MessageBubble message={message} />);

    // Hover trigger
    const bubble = container.querySelector('.group');
    fireEvent.mouseEnter(bubble);

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
});
````

### **Integration Tests**

```typescript
// __tests__/assistant/chat-flow.test.ts
describe('Chat Flow', () => {
  it('sends message and receives streaming response', async () => {
    const { user } = renderWithProviders(<ChatContainer />);

    const input = screen.getByPlaceholderText('Ask me anything...');
    await user.type(input, 'Hello AI');
    await user.click(screen.getByRole('button', { name: /send/i }));

    // Wait for streaming response
    await waitFor(() => {
      expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });

    // Verify message saved
    const messages = await db.select().from(assistantMessages);
    expect(messages).toHaveLength(2); // User + AI
  });

  it('executes tool calls', async () => {
    const { user } = renderWithProviders(<ChatContainer />);

    await user.type(input, 'Create an agent called "Test Agent"');
    await user.click(sendButton);

    // Wait for tool execution
    await waitFor(() => {
      expect(screen.getByText(/Creating agent/i)).toBeInTheDocument();
    });

    // Verify agent created
    const agents = await db.select().from(agents);
    expect(agents[0].name).toBe('Test Agent');
  });
});
```

---

## 📊 Performance Optimizations

### **1. Message Virtualization** (for long conversations)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

export function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimated message height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const message = messages[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MessageBubble message={message} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### **2. Conversation Caching** (Redis)

```typescript
// apps/web/lib/ai/assistant/cache-service.ts
import { redis } from '@/lib/redis';

export async function getCachedConversation(conversationId: string) {
  const cached = await redis.get(`conversation:${conversationId}`);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheConversation(conversationId: string, messages: Message[]) {
  await redis.setex(
    `conversation:${conversationId}`,
    3600, // 1 hour TTL
    JSON.stringify(messages),
  );
}
```

### **3. Debounced Auto-Save**

```typescript
const debouncedSave = useMemo(
  () =>
    debounce(async (conversationId: string, messages: Message[]) => {
      await saveConversationAction(conversationId, messages);
    }, 2000),
  [],
);

useEffect(() => {
  if (messages.length > 0) {
    debouncedSave(conversationId, messages);
  }
}, [messages]);
```

---

## 🎯 Migration Strategy

### **Approach: Parallel Development**

**Don't break existing assistant during rebuild:**

1. **Build at new route:** `/assistant-v2` (parallel to `/assistant`)
2. **Test thoroughly** with power users
3. **Feature flag rollout** (gradual migration)
4. **Full switch** after validation
5. **Deprecate old** `/assistant`

### **Feature Flag Implementation**

```typescript
// apps/web/lib/features.ts
export async function isAssistantV2Enabled(userId: string): Promise<boolean> {
  // Check feature flag
  const flag = await db
    .select()
    .from(featureFlags)
    .where(eq(featureFlags.key, 'assistant-v2'))
    .where(eq(featureFlags.userId, userId))
    .limit(1);

  return flag[0]?.enabled || false;
}

// In layout or route
const useV2 = await isAssistantV2Enabled(user.id);
if (useV2) {
  redirect('/assistant-v2');
}
```

---

## 📦 Database Schema

```typescript
// packages/database/schema/assistant.ts
import { pgTable, uuid, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';

export const assistantConversations = pgTable('assistant_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id),
  userId: text('user_id').notNull(), // Clerk user ID
  title: text('title').notNull(),
  model: text('model').default('gpt-4-turbo'),
  isPinned: boolean('is_pinned').default(false),
  messageCount: integer('message_count').default(0),
  tokenCount: integer('token_count').default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assistantMessages = pgTable('assistant_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => assistantConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system' | 'tool'
  content: text('content').notNull(),
  toolInvocations: jsonb('tool_invocations'), // Vercel AI SDK tool calls
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

// Indexes for performance
export const conversationWorkspaceIdx = index('idx_conversations_workspace').on(
  assistantConversations.workspaceId,
  assistantConversations.updatedAt,
);

export const messageConversationIdx = index('idx_messages_conversation').on(
  assistantMessages.conversationId,
  assistantMessages.createdAt,
);
```

---

## 🔒 Security Considerations

### **1. Multi-Tenant Isolation**

```typescript
// ALWAYS filter by workspaceId
const messages = await db
  .select()
  .from(assistantMessages)
  .where(
    and(
      eq(assistantMessages.conversationId, id),
      eq(assistantConversations.workspaceId, workspaceId), // CRITICAL
    ),
  );
```

### **2. Input Validation**

```typescript
// Validate all inputs with Zod
const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().max(10000), // Prevent abuse
    }),
  ),
  workspaceId: z.string().uuid(),
  model: z.enum(['gpt-4-turbo', 'claude-3-opus', 'gemini-1.5-pro']),
});
```

### **3. Rate Limiting**

```typescript
// Limit requests per user
const rateLimit = rateLimit({
  interval: '1m',
  uniqueTokenPerInterval: 500,
});

const userId = user.id;
const { success } = await rateLimit.limit(userId);
if (!success) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables set (OPENAI_API_KEY, ANTHROPIC_API_KEY)
- [ ] Database migrations run
- [ ] Redis configured
- [ ] Pinecone namespace created
- [ ] Feature flags configured
- [ ] Rate limits set
- [ ] Error tracking (Sentry) configured
- [ ] Analytics events set up
- [ ] Mobile tested
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Performance tested (Lighthouse 90+)

---

## 📈 Success Metrics

### **Performance**

- First token: < 200ms
- Full response (1K tokens): < 10s
- Message load: < 100ms
- Tool execution: < 2s

### **Quality**

- User satisfaction: 90%+
- Tool success rate: 95%+
- RAG relevance: 80%+
- Error rate: < 1%

### **Usage**

- Daily active users: Track
- Messages per session: Track
- Tool usage rate: Track
- Conversation length: Track

---

**This is how we build a world-class AI assistant.** 🚀
