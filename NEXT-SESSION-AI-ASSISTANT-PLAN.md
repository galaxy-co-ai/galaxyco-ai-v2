# 🤖 AI Assistant Build - Complete Execution Plan

**Session Goal:** Build ChatGPT-quality AI Assistant in 4-6 hours
**Date Prepared:** November 2, 2025
**Context:** Following successful Linear UI transformation & Make.com Grid implementation

---

## 🎯 What We're Building

**A production-ready AI Assistant that:**

- Feels as smooth as ChatGPT/Claude
- Integrates with our Grid canvas for tool visualization
- Handles files, voice, and complex tool execution
- Provides conversation history and persistence
- Uses our Linear minimal design language

**Reference products:**

- ChatGPT (conversation flow, file handling)
- Claude (artifacts/canvas integration)
- Perplexity (citations, sources)
- v0.dev (split view, live preview)

---

## 📊 Session Breakdown (6 hours)

### **Hour 1: Foundation & Page Setup**

**Goal:** Create the `/assistant` page with ChatGPT-style layout

**Tasks:**

1. Create `apps/web/app/(app)/assistant/page.tsx`
2. Implement layout:
   - Center-aligned chat area (max-width 800px)
   - Collapsible history sidebar (left, 280px)
   - Clean, spacious Linear design
   - Empty state with example prompts
3. Add to navigation/sidebar
4. Test routing

**Key Design Elements:**

```tsx
<div className="flex h-screen">
  {/* Collapsible History Sidebar */}
  <aside className="w-[280px] border-r">{/* Conversation list */}</aside>

  {/* Main Chat Area */}
  <main className="flex-1 flex flex-col">
    <div className="flex-1 overflow-y-auto">{/* Messages */}</div>
    <div className="border-t p-4">{/* Input area */}</div>
  </main>
</div>
```

**Success criteria:**

- Page renders without errors
- Layout matches ChatGPT structure
- Responsive (collapses sidebar on mobile)

---

### **Hour 2: Chat Components**

**Goal:** Build reusable chat UI components

**Create these files:**

1. **`components/assistant/ChatInterface.tsx`**
   - Main container component
   - Manages conversation state
   - Handles message sending/receiving

2. **`components/assistant/MessageList.tsx`**
   - Renders message history
   - Auto-scrolls to bottom
   - Supports markdown rendering
   - User vs AI message distinction

3. **`components/assistant/MessageBubble.tsx`**
   - Individual message component
   - Avatar (user vs AI)
   - Message actions (copy, regenerate, edit)
   - Timestamp

4. **`components/assistant/InputArea.tsx`**
   - Text input with auto-resize
   - File attachment button
   - Voice input button
   - Send button
   - Keyboard shortcuts (Enter to send, Shift+Enter for newline)

**Component structure:**

```tsx
// MessageBubble.tsx
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
}

// InputArea.tsx
interface InputAreaProps {
  onSendMessage: (message: string, files?: File[]) => void;
  onVoiceInput?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}
```

**Success criteria:**

- Messages display correctly
- Input handles multi-line text
- Linear design applied (minimal, spacious)
- All interactions work

---

### **Hour 3: API Routes - Streaming Chat**

**Goal:** Implement OpenAI streaming chat API

**Create these files:**

1. **`app/api/assistant/chat/route.ts`**
   - Streaming OpenAI GPT-4 responses
   - System prompt configuration
   - Conversation context management
   - Error handling

```typescript
// app/api/assistant/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are GalaxyCo AI Assistant, helping users build and manage AI agents...',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

2. **`app/api/assistant/conversations/route.ts`**
   - GET: List user's conversations
   - POST: Create new conversation
   - PATCH: Update conversation (rename, archive)
   - DELETE: Delete conversation

**Success criteria:**

- Streaming responses work
- Conversations persist in database
- Error handling is user-friendly
- Multi-tenant isolation (filter by workspaceId)

---

### **Hour 4: Tool Execution & Grid Integration**

**Goal:** AI can execute tools and visualize in Grid canvas

**Create these files:**

1. **`app/api/assistant/execute-tool/route.ts`**
   - Tool execution endpoint
   - Supported tools:
     - create_agent
     - create_workflow
     - search_data
     - analyze_metrics
   - Returns results + metadata

2. **`components/assistant/ExecutionPanel.tsx`**
   - Shows when AI is executing tools
   - Uses our GridView component for workflow visualization
   - Progress indicators
   - Results display

**Tool execution flow:**

```typescript
// AI detects user wants to create workflow
// 1. AI generates workflow structure
// 2. Calls execute-tool endpoint
// 3. ExecutionPanel shows Grid preview
// 4. User confirms or modifies
// 5. Workflow is created
```

**Integration with Grid:**

```tsx
<ExecutionPanel>
  {executingTool === 'create_workflow' && (
    <GridView workflows={[previewWorkflow]} isPreview={true} />
  )}
</ExecutionPanel>
```

**Success criteria:**

- AI can create agents/workflows via chat
- Grid canvas shows live preview
- User can approve/reject actions
- Results feed back into conversation

---

### **Hour 5: File Upload & Advanced Features**

**Goal:** Handle file uploads, voice input, conversation history

**Create these files:**

1. **`app/api/assistant/upload/route.ts`**
   - Handle file uploads (PDFs, CSVs, images, docs)
   - Store in storage (S3 or similar)
   - Extract text/metadata
   - Return file reference for AI context

2. **`components/assistant/FileUpload.tsx`**
   - Drag & drop zone
   - File preview
   - Upload progress
   - Supported formats display

3. **`components/assistant/VoiceInput.tsx`**
   - Browser Speech API integration
   - Recording indicator
   - Transcription display
   - Error handling

4. **`components/assistant/ConversationHistory.tsx`**
   - Sidebar component
   - Search conversations
   - Quick actions (rename, delete, archive)
   - New conversation button

**File handling flow:**

```typescript
// User uploads CSV
// 1. File sent to /api/assistant/upload
// 2. Backend extracts data
// 3. File reference added to conversation context
// 4. AI can reference file contents
// 5. User: "Analyze this data"
// 6. AI reads file data and provides insights
```

**Success criteria:**

- Files upload successfully
- AI can read and analyze files
- Voice input works (Chrome/Edge)
- History persists across sessions

---

### **Hour 6: Polish, Testing & Edge Cases**

**Goal:** Production-ready quality

**Tasks:**

1. **Visual Polish**
   - Smooth animations (Framer Motion)
   - Loading states (skeleton screens)
   - Empty states with helpful prompts
   - Error states with retry options

2. **Edge Cases**
   - Very long conversations (pagination/virtualization)
   - Network errors (retry logic)
   - Slow responses (timeout handling)
   - Rate limiting (graceful degradation)

3. **Keyboard Shortcuts**
   - Cmd/Ctrl + K: New conversation
   - Cmd/Ctrl + /: Focus input
   - Escape: Close modals
   - Arrow up: Edit last message

4. **Testing**
   - TypeScript: 0 errors
   - Linter: Clean
   - Manual testing:
     - Send message → streaming response
     - Upload file → AI can read it
     - Create workflow → Grid preview shows
     - Voice input → transcription works
     - History → conversations persist

**Success criteria:**

- Feels as smooth as ChatGPT
- All features work end-to-end
- No TypeScript/linter errors
- Linear design throughout

---

## 🗂️ Complete File Structure

```
apps/web/
├── app/(app)/assistant/
│   └── page.tsx                          # Main assistant page
│
├── components/assistant/
│   ├── ChatInterface.tsx                 # Main chat container
│   ├── MessageList.tsx                   # Message history
│   ├── MessageBubble.tsx                 # Individual message
│   ├── InputArea.tsx                     # Text input + actions
│   ├── ExecutionPanel.tsx                # Tool execution display
│   ├── FileUpload.tsx                    # Drag & drop files
│   ├── VoiceInput.tsx                    # Speech-to-text
│   └── ConversationHistory.tsx           # Sidebar conversations
│
└── app/api/assistant/
    ├── chat/route.ts                     # Streaming chat
    ├── execute-tool/route.ts             # Tool execution
    ├── upload/route.ts                   # File handling
    └── conversations/
        ├── route.ts                      # List/create conversations
        └── [id]/route.ts                 # Update/delete conversation
```

---

## 🎨 Design Standards (Linear Minimal)

### Colors

```css
/* Use existing design tokens */
--background: white --foreground: black --muted: #f5f5f5 (subtle fills) --primary: #0055ff
  (CTAs only) /* Message bubbles */ User: bg-primary text-white AI: bg-muted/30 text-foreground;
```

### Spacing

```css
/* Generous Linear spacing */
Message padding: 24px
Input area: 16px vertical, 24px horizontal
Sidebar: 16px padding
Gap between messages: 24px
```

### Typography

```css
/* Inter font (already loaded) */
Messages: 16px, line-height 1.6
Timestamps: 12px, text-muted-foreground
Input: 16px
```

### Components

- Use shadcn/ui Button, Input, Dialog
- Use Kibo UI Spinner for loading
- Use GridView for workflow previews
- All hover states: 150ms transition

---

## 🔧 Technical Implementation Details

### 1. Streaming Setup

```bash
# Install AI SDK
cd apps/web
pnpm add ai
pnpm add openai
```

### 2. Database Schema

```sql
-- Add to existing schema
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  metadata JSONB, -- For file refs, tool results, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_workspace ON conversations(workspace_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### 3. Environment Variables

```bash
# Add to .env.local (already have OPENAI_API_KEY)
OPENAI_API_KEY=sk-...
```

### 4. State Management

```typescript
// Use React hooks + React Query
import { useChat } from 'ai/react';

// In ChatInterface.tsx
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/assistant/chat',
  initialMessages: conversationHistory,
});
```

---

## 📋 Quality Checklist

Before considering complete:

**Functionality:**

- [ ] Chat sends messages
- [ ] Streaming responses work
- [ ] Conversations save to database
- [ ] History sidebar shows all conversations
- [ ] Files upload successfully
- [ ] AI can read uploaded files
- [ ] Voice input transcribes correctly
- [ ] Tool execution creates workflows
- [ ] Grid preview shows workflow structure
- [ ] Message actions work (copy, regenerate)

**Design:**

- [ ] Linear minimal aesthetic throughout
- [ ] Generous spacing (24px+)
- [ ] Subtle shadows (linear-shadow class)
- [ ] Smooth transitions (150ms)
- [ ] Responsive (mobile-friendly)
- [ ] Empty states have helpful prompts
- [ ] Loading states use Kibo Spinner

**Code Quality:**

- [ ] TypeScript: 0 errors
- [ ] Linter: Clean
- [ ] No console.logs
- [ ] Error handling on all API calls
- [ ] Multi-tenant isolation (workspaceId filter)
- [ ] Try-catch on all async functions

**Performance:**

- [ ] Streaming feels instant
- [ ] Long conversations virtualized
- [ ] File uploads show progress
- [ ] No layout shift during streaming

---

## 🚀 Execution Strategy

### Start of Session:

1. Read this document (5 min)
2. Review ChatGPT for UX reference (5 min)
3. Start building hour 1

### During Session:

- Build → Test → Fix → Move on
- Commit after each hour
- Test streaming immediately (don't wait)
- Use existing Grid components (already built!)

### End of Session:

- Full quality check (checklist above)
- TypeScript clean
- Linter clean
- Create demo video showing features
- Document any limitations

---

## 💡 Pro Tips

**Speed Hacks:**

1. Copy ChatGPT's keyboard shortcuts exactly
2. Use `useChat` hook from Vercel AI SDK (handles streaming)
3. Reuse our GridView component (already perfect)
4. shadcn/ui Dialog for file preview
5. Browser Speech API for voice (no backend needed)

**Common Pitfalls to Avoid:**

- ❌ Don't build custom streaming (use Vercel AI SDK)
- ❌ Don't over-engineer tool system (start with 3-4 tools)
- ❌ Don't add authentication logic (use existing Clerk)
- ❌ Don't rebuild Grid (import existing GridView)

**Quality Shortcuts:**

- Copy exact spacing from Linear screenshots
- Use existing design tokens (don't invent new)
- Test streaming on first message (catches issues early)
- Voice is "nice to have" - prioritize core chat

---

## 🎯 Success Criteria

**MVP (Must Have):**

- ✅ Chat with streaming GPT-4 responses
- ✅ Conversation history
- ✅ File upload + AI reads files
- ✅ Create workflow via chat → Grid preview
- ✅ Linear minimal design
- ✅ All quality gates pass

**Nice to Have (if time):**

- Voice input
- Message editing
- Conversation search
- Export conversation
- Dark mode support

---

## 📚 References

**Review Before Starting:**

1. `LINEAR-DESIGN-SYSTEM-ANALYSIS.md` - Design standards
2. `DESIGN-SYSTEM.md` - Our design tokens
3. ChatGPT - Live reference for UX
4. `components/galaxy/flows/GridView.tsx` - Use this for previews

**Code Examples:**

- Streaming: https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot
- File upload: Use existing `/api/workflows` patterns
- Grid integration: Import GridView component

---

## ⚡ Quick Start Commands

```bash
# Install dependencies
cd apps/web
pnpm add ai openai

# Create directory structure
mkdir -p components/assistant
mkdir -p app/api/assistant/{chat,execute-tool,upload,conversations}

# Start dev server
pnpm dev

# Run tests after each hour
pnpm typecheck && pnpm lint
```

---

## 🎉 Expected Outcome

**After 6 hours, you'll have:**

- Production-ready AI Assistant
- ChatGPT-quality UX
- Full integration with Grid canvas
- File upload capabilities
- Conversation persistence
- Linear minimal design throughout

**Dalton's reaction:**
"This is exactly what I wanted. Ship it! 🚀"

---

## 📝 Notes from Current Session

**What's Already Built (Can Reuse):**

- ✅ GridView component (isometric workflow cards)
- ✅ NodeSidebar component (context panel)
- ✅ 3D FlowNodes (Make.com style)
- ✅ Design tokens (Linear + Framer)
- ✅ Linear typography (Inter font loaded)
- ✅ Utility classes (linear-shadow, perspective-1000)

**Database Connection:**

- Already configured (Neon Postgres)
- Use existing Drizzle ORM patterns
- Multi-tenant (workspace_id filter)

**Authentication:**

- Clerk already integrated
- Get user from `auth()` in Server Components
- Get workspaceId from context

---

**Total Time:** 6 hours
**Difficulty:** Medium (well-documented, clear patterns)
**Impact:** HIGH - Major feature completion

**LET'S BUILD THE BEST AI ASSISTANT! 🤖✨**
