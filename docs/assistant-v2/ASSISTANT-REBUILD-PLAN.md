# 🤖 AI Assistant V2 - Complete Rebuild Plan

**Date:** November 4, 2025  
**Status:** Planning Phase  
**Goal:** Build a world-class AI chat assistant from scratch using best practices

---

## 🎯 Vision

Create an **AI assistant that rivals ChatGPT, Claude, and Cursor** with:

- **Streaming responses** with real-time typing
- **Multi-model support** (GPT-4, Claude, Gemini)
- **RAG integration** for workspace knowledge
- **Tool calling** for actions (create agents, search CRM, etc.)
- **Beautiful UX** with Framer/Linear-level polish
- **Conversation memory** with smart context management
- **Code highlighting** with syntax highlighting
- **File attachments** with vision support
- **Voice input/output** (optional Phase 2)

---

## 🔧 Tech Stack (Best-in-Class)

### **AI/LLM Layer**

- **Vercel AI SDK** - Streaming, tool calling, multi-model support
  - `ai` package for unified streaming API
  - Built-in support for OpenAI, Anthropic, Google, etc.
  - Native React hooks (`useChat`, `useCompletion`)
- **LangChain.js** (optional) - Advanced agent workflows
  - Tool calling and function execution
  - Memory management
  - Chain-of-thought reasoning

- **OpenAI GPT-4** - Main conversational AI
  - Function calling for actions
  - Vision for image analysis
- **Anthropic Claude** - Deep reasoning and analysis
  - Extended context (200K tokens)
  - Better at complex multi-step tasks

### **RAG/Knowledge**

- **Pinecone** - Vector search (already integrated)
- **OpenAI Embeddings** - text-embedding-3-small
- **Upstash Redis** - Conversation caching
- **Neon Postgres** - Conversation persistence

### **UI Components**

- **Kibo UI** - Advanced chat components
  - `markdown` component with syntax highlighting
  - `code-block` with copy button
  - `avatar-stack` for multi-user conversations
- **React Markdown** - Message rendering
- **Prism/Shiki** - Code syntax highlighting
- **Framer Motion** - Smooth animations

### **State Management**

- **Zustand** - Chat state (messages, streaming status)
- **React Query** - Server state (conversation history)
- **Vercel AI SDK hooks** - Streaming state

---

## 🏗️ Architecture

### **File Structure**

```
apps/web/app/(app)/assistant/
├── page.tsx                 # Main chat page (Server Component)
├── components/
│   ├── ChatContainer.tsx    # Main chat UI (Client Component)
│   ├── MessageList.tsx      # Scrollable message list
│   ├── MessageBubble.tsx    # Individual message with markdown
│   ├── ChatInput.tsx        # Input with file upload, voice, etc.
│   ├── ConversationSidebar.tsx  # Conversation history
│   ├── ModelSelector.tsx    # Switch between GPT-4, Claude, etc.
│   ├── ToolCallDisplay.tsx  # Show function calls in progress
│   └── StreamingIndicator.tsx   # Typing animation
├── hooks/
│   ├── useAssistantChat.ts  # Vercel AI SDK useChat wrapper
│   ├── useConversations.ts  # Conversation CRUD
│   └── useRAG.ts            # Knowledge retrieval
└── actions/
    ├── chat-actions.ts      # Server Actions for persistence
    └── tool-actions.ts      # Server Actions for tool calling

apps/web/lib/ai/
├── assistant/
│   ├── chat-service.ts      # Main chat orchestration
│   ├── rag-service.ts       # Knowledge retrieval
│   ├── tool-registry.ts     # Available tools/functions
│   └── system-prompt.ts     # Dynamic system prompts
└── providers/
    ├── vercel-ai.ts         # Vercel AI SDK setup
    ├── openai-assistant.ts  # GPT-4 specific
    └── claude-assistant.ts  # Claude specific
```

### **Data Flow**

```
User Input → ChatInput
    ↓
Vercel AI SDK useChat hook → Streaming API Route
    ↓
AI Provider (GPT-4/Claude) ← RAG Context (if needed)
    ↓
Streaming Response → Real-time UI Update
    ↓
Tool Calls (if any) → Execute Server Actions → Update UI
    ↓
Save to Database (Neon) + Cache (Redis)
```

---

## 🎨 UI/UX Design (Framer/Linear Quality)

### **Layout**

```
┌─────────────────────────────────────────────┐
│  Conversation Sidebar  │   Main Chat Area   │
│  (collapsible)         │                     │
│                        │   ┌───────────────┐ │
│  • New Chat            │   │  Model: GPT-4 │ │
│  • Yesterday           │   └───────────────┘ │
│    - "Help with..."    │                     │
│    - "Create agent..." │   ╔═════════════════╗
│  • Last Week          │   ║  Messages       ║
│    - "Analyze data..." │   ║  (scrollable)   ║
│                        │   ║                 ║
│  [+ New Conversation]  │   ╚═════════════════╝
│                        │                     │
│                        │   ┌───────────────┐ │
│                        │   │ Type message  │ │
│                        │   │ [📎][🎤][→]   │ │
│                        │   └───────────────┘ │
└─────────────────────────────────────────────┘
```

### **Message Bubbles**

- **User messages:** Right-aligned, blue background
- **AI messages:** Left-aligned, white card with shadow
- **Tool calls:** Special card with icon + status
- **Code blocks:** Syntax highlighted with copy button
- **Streaming:** Character-by-character animation

### **Interactions**

- **Hover:** Message actions appear (copy, edit, regenerate)
- **Click code:** Auto-copy with feedback
- **File upload:** Drag-and-drop with preview
- **Model switch:** Dropdown with descriptions

---

## 🛠️ Key Features

### **Phase 1: Core Chat** (MVP)

- [ ] Vercel AI SDK integration with streaming
- [ ] GPT-4 as primary model
- [ ] Message persistence (save/load conversations)
- [ ] Markdown rendering with code highlighting
- [ ] Conversation sidebar with search
- [ ] Mobile-responsive layout
- [ ] Error handling + retry logic

### **Phase 2: Advanced Features**

- [ ] RAG integration (search workspace knowledge)
- [ ] Tool calling (create agents, search CRM, etc.)
- [ ] Multi-model support (Claude, Gemini)
- [ ] File attachments (PDFs, images)
- [ ] Voice input (Whisper API)
- [ ] Conversation sharing/export
- [ ] Prompt templates library

### **Phase 3: Power Features**

- [ ] Multi-turn function calling (complex workflows)
- [ ] Canvas mode (artifact editing like Claude)
- [ ] Conversation branching (explore alternate responses)
- [ ] Team collaboration (shared conversations)
- [ ] Custom instructions (per-workspace system prompts)
- [ ] Usage analytics + cost tracking

---

## 📦 Dependencies to Install

```json
{
  "ai": "^3.0.0", // Vercel AI SDK
  "openai": "^4.20.0", // OpenAI official SDK
  "@anthropic-ai/sdk": "^0.10.0", // Claude official SDK
  "langchain": "^0.1.0", // Advanced agent workflows (optional)
  "react-markdown": "^9.0.0", // Markdown rendering
  "remark-gfm": "^4.0.0", // GitHub Flavored Markdown
  "rehype-highlight": "^7.0.0", // Code syntax highlighting
  "rehype-raw": "^7.0.0", // Raw HTML in markdown
  "prism-react-renderer": "^2.3.0", // Better code highlighting
  "react-textarea-autosize": "^8.5.3", // Auto-growing input
  "use-sound": "^4.0.1" // Sound effects (optional)
}
```

---

## 🎨 Component Breakdown

### **ChatContainer** (Main orchestrator)

```tsx
'use client';

export function ChatContainer({ initialConversationId }) {
  const { messages, input, handleSubmit, isLoading, append } = useChat({
    api: '/api/assistant/chat',
    initialMessages: loadedMessages,
    onFinish: saveConversation,
  });

  return (
    <div className="flex h-screen">
      <ConversationSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader model={currentModel} onModelChange={setModel} />
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
```

### **MessageBubble** (Beautiful message rendering)

```tsx
export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-4 group', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && <Avatar src="/ai-avatar.png" />}

      <Card
        className={cn(
          'max-w-2xl p-6 rounded-2xl',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-card hover:shadow-lg transition-all',
        )}
      >
        <ReactMarkdown
          components={{
            code: CodeBlock, // Custom code block with copy
            pre: PreBlock,
            // ... other components
          }}
        >
          {message.content}
        </ReactMarkdown>

        {/* Tool calls */}
        {message.toolInvocations?.map((tool) => (
          <ToolCallDisplay key={tool.id} tool={tool} />
        ))}

        {/* Message actions (on hover) */}
        <MessageActions message={message} className="opacity-0 group-hover:opacity-100" />
      </Card>

      {isUser && <Avatar src={user.imageUrl} />}
    </motion.div>
  );
}
```

### **ChatInput** (Powerful input field)

```tsx
export function ChatInput({ value, onChange, onSubmit, disabled }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="border-t p-6">
      {/* File previews */}
      {files.length > 0 && <FilePreviewList files={files} onRemove={...} />}

      <form onSubmit={onSubmit} className="relative">
        <TextareaAutosize
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder="Ask me anything..."
          className="w-full resize-none rounded-xl border-2 p-4 pr-32 focus:scale-[1.01] transition-all"
          maxRows={10}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />

        <div className="absolute right-3 bottom-3 flex gap-2">
          <FileUploadButton onUpload={setFiles} />
          <VoiceInputButton onTranscript={append} />
          <Button type="submit" disabled={disabled} size="icon">
            <Send className="size-4" />
          </Button>
        </div>
      </form>

      <div className="mt-2 text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
```

---

## 🚀 API Route (Streaming + Tools)

```typescript
// apps/web/app/api/assistant/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, conversationId, workspaceId } = await req.json();

  // Load RAG context
  const context = await getWorkspaceContext(workspaceId, messages);

  // Define tools
  const tools = {
    createAgent: tool({
      description: 'Create a new AI agent',
      parameters: z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(['email', 'research', 'crm']),
      }),
      execute: async (params) => {
        // Server Action to create agent
        return await createAgentAction(params, workspaceId);
      },
    }),

    searchCustomers: tool({
      description: 'Search CRM customers',
      parameters: z.object({
        query: z.string(),
        limit: z.number().optional(),
      }),
      execute: async ({ query, limit }) => {
        return await searchCRMAction(query, workspaceId, limit);
      },
    }),

    analyzeWorkflow: tool({
      description: 'Analyze a workflow performance',
      parameters: z.object({
        workflowId: z.string(),
      }),
      execute: async ({ workflowId }) => {
        return await getWorkflowAnalyticsAction(workflowId, workspaceId);
      },
    }),
  };

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      {
        role: 'system',
        content: generateSystemPrompt(workspaceId, context),
      },
      ...messages,
    ],
    tools,
    maxTokens: 4000,
    temperature: 0.7,
  });

  return result.toAIStreamResponse();
}
```

---

## 🎨 UI Components (Framer/Linear Quality)

### **Color Palette**

```typescript
// Assistant-specific colors
const assistantColors = {
  userBubble: 'hsl(var(--primary))', // Blue
  aiBubble: 'hsl(var(--card))', // White card
  toolCall: 'hsl(var(--accent))', // Light blue
  streaming: 'hsl(var(--muted))', // Gray
  codeBackground: 'hsl(222 47% 11%)', // VS Code dark
};
```

### **Typography**

```typescript
// Message text
h1: 'text-2xl font-bold tracking-tight',
h2: 'text-xl font-bold tracking-tight',
h3: 'text-lg font-bold',
p: 'text-base leading-relaxed',
code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
```

### **Animations**

```typescript
// Message entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Streaming cursor
<motion.span
  animate={{ opacity: [1, 0] }}
  transition={{ repeat: Infinity, duration: 0.8 }}
>
  ▊
</motion.span>
```

---

## 📝 System Prompt Strategy

### **Dynamic Context Injection**

```typescript
function generateSystemPrompt(workspaceId: string, context: RAGContext) {
  return `
You are GalaxyCo AI Assistant, an expert AI operating system companion.

## Your Capabilities
- Create and manage AI agents
- Analyze workflows and data
- Search CRM customers and contacts
- Generate insights from workspace knowledge
- Execute multi-step business tasks

## Workspace Context
${
  context.recentAgents
    ? `
Recent Agents:
${context.recentAgents.map((a) => `- ${a.name}: ${a.description}`).join('\n')}
`
    : ''
}

${
  context.recentCustomers
    ? `
Recent Customers:
${context.recentCustomers.map((c) => `- ${c.name} (${c.email})`).join('\n')}
`
    : ''
}

## Guidelines
- Be concise but helpful
- Use markdown formatting for clarity
- Suggest actions when appropriate
- Always confirm before executing destructive actions
- Cite sources when using workspace knowledge

## Available Tools
You have access to tools for creating agents, searching CRM, analyzing workflows, and more.
Use them proactively to help the user accomplish their goals.
`;
}
```

---

## 🔥 Advanced Features

### **1. RAG-Powered Responses**

```typescript
async function getWorkspaceContext(workspaceId: string, messages: Message[]) {
  const lastUserMessage = messages.findLast((m) => m.role === 'user');

  // Generate embedding for search
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: lastUserMessage.content,
  });

  // Search Pinecone
  const results = await pinecone.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    filter: { workspaceId },
  });

  return {
    relevantDocs: results.matches,
    recentAgents: await getRecentAgents(workspaceId),
    recentCustomers: await getRecentCustomers(workspaceId),
  };
}
```

### **2. Conversation Branching**

```typescript
// Allow users to explore alternate responses
interface ConversationBranch {
  id: string;
  parentMessageId: string;
  messages: Message[];
  createdAt: Date;
}

// UI: Show branch selector on any message
<Button onClick={() => createBranch(message.id)}>
  <GitBranch className="size-4" /> Explore alternate response
</Button>
```

### **3. Prompt Templates**

```typescript
const templates = [
  {
    name: 'Analyze Sales Data',
    prompt: 'Analyze my sales data for the last 30 days and identify trends',
    icon: TrendingUp,
  },
  {
    name: 'Create Email Agent',
    prompt: 'Help me create an AI agent that handles customer emails',
    icon: Mail,
  },
  {
    name: 'Workflow Optimization',
    prompt: 'Review my workflows and suggest optimizations',
    icon: Zap,
  },
];
```

---

## 🧪 Testing Strategy

### **Unit Tests**

- Message rendering (markdown, code blocks)
- Input validation
- File upload handling
- Tool call execution

### **Integration Tests**

- End-to-end chat flow
- RAG context retrieval
- Tool execution + response
- Conversation persistence

### **E2E Tests** (Playwright)

- Full conversation flow
- Model switching
- File upload
- Mobile responsiveness

---

## 📊 Success Metrics

### **Performance**

- **First response:** < 500ms
- **Streaming start:** < 200ms
- **Message load:** < 100ms
- **Search:** < 300ms

### **UX**

- **Mobile-responsive:** 100% functional on mobile
- **Keyboard shortcuts:** Full keyboard navigation
- **Accessibility:** WCAG 2.1 AA compliant
- **Error recovery:** Graceful fallbacks

### **AI Quality**

- **Relevance:** RAG improves accuracy by 40%+
- **Tool usage:** Proactive, not reactive
- **Context retention:** Remember full conversation
- **Multi-turn:** Handle complex workflows

---

## 🚀 Implementation Phases

### **Week 1: Foundation**

- Set up Vercel AI SDK
- Build basic chat UI
- Implement streaming
- Add conversation persistence

### **Week 2: Intelligence**

- Integrate RAG
- Add tool calling
- Multi-model support
- Prompt engineering

### **Week 3: Polish**

- File attachments
- Voice input
- Animations
- Mobile optimization

### **Week 4: Advanced**

- Conversation branching
- Prompt templates
- Team features
- Analytics

---

## 💡 Differentiators (vs current implementation)

| Current                         | New V2                               |
| ------------------------------- | ------------------------------------ |
| Custom streaming implementation | Vercel AI SDK (battle-tested)        |
| Basic markdown                  | Full markdown + code highlighting    |
| No tool calling                 | Rich tool calling with 10+ actions   |
| No RAG                          | Full workspace knowledge integration |
| Single model                    | Multi-model (GPT-4, Claude, Gemini)  |
| Static system prompt            | Dynamic context-aware prompts        |
| Basic UI                        | Framer/Linear-quality polish         |
| No file uploads                 | Full file + vision support           |
| Conversation list only          | Search, branch, share, export        |
| No mobile optimization          | Fully responsive                     |

---

## 🎯 Next Steps

1. **Review this plan** - Get feedback on architecture
2. **Prototype UI** - Build static UI first (no AI)
3. **Wire Vercel AI SDK** - Get streaming working
4. **Add persistence** - Save conversations
5. **Integrate RAG** - Connect workspace knowledge
6. **Add tools** - Implement function calling
7. **Polish** - Animations, errors, mobile
8. **Test** - Comprehensive testing
9. **Deploy** - Ship to production
10. **Monitor** - Usage analytics

---

**Ready to build the best AI assistant in the industry?** 🚀
