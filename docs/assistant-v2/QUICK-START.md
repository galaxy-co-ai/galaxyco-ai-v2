# ⚡ AI Assistant V2 - Quick Start Guide

**For Dalton:** Here's how to kickstart the rebuild

---

## 🎯 TL;DR

**Current Assistant:** 852-line monolith, broken streaming, no tools, ugly UI  
**New Assistant:** Vercel AI SDK, 8 focused components, tool calling, RAG, beautiful UX

**Effort:** 2-3 weeks  
**ROI:** World-class assistant that rivals ChatGPT/Claude

---

## 🚀 Getting Started (First Hour)

### **Step 1: Install Dependencies** (5 min)

```bash
cd apps/web

# Vercel AI SDK (the magic sauce)
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic

# Markdown rendering
pnpm add react-markdown remark-gfm rehype-highlight

# UI enhancements
pnpm add react-textarea-autosize
pnpm add react-syntax-highlighter @types/react-syntax-highlighter -D

# Optional: Voice
pnpm add @openai/realtime-api-beta
```

### **Step 2: Create Minimal Chat UI** (20 min)

```bash
# Create new directory
mkdir -p apps/web/app/\(app\)/assistant-v2/components

# Create files
touch apps/web/app/\(app\)/assistant-v2/page.tsx
touch apps/web/app/\(app\)/assistant-v2/components/ChatContainer.tsx
touch apps/web/app/\(app\)/assistant-v2/components/MessageBubble.tsx
touch apps/web/app/\(app\)/assistant-v2/components/ChatInput.tsx
```

**Minimal `page.tsx`:**
```tsx
export default async function AssistantV2Page() {
  const user = await currentUser();
  const workspace = await getCurrentWorkspace();
  
  return <ChatContainer workspaceId={workspace.id} />;
}
```

### **Step 3: Wire Streaming API** (20 min)

**Create `/api/assistant-v2/chat/route.ts`:**
```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });
  
  return result.toAIStreamResponse();
}
```

### **Step 4: Connect UI** (15 min)

**In `ChatContainer.tsx`:**
```tsx
'use client';
import { useChat } from 'ai/react';

export function ChatContainer({ workspaceId }: { workspaceId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/assistant-v2/chat',
  });
  
  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map(m => (
          <div key={m.id}>{m.role}: {m.content}</div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### **Step 5: Test It** (5 min)

```bash
# Start dev server
pnpm dev

# Navigate to
http://localhost:3000/assistant-v2

# Type a message and watch it stream! 🎉
```

---

## 🎨 Next: Make It Beautiful (Day 2)

Once streaming works, polish the UI:

1. Replace `<div>` with `MessageBubble` component
2. Style with Tailwind (Framer/Linear quality we just achieved)
3. Add `TextareaAutosize` for input
4. Add loading states
5. Add Framer Motion animations

---

## 🧠 Then: Add Intelligence (Days 3-5)

1. **Tool Calling** - Let AI create agents, search CRM
2. **RAG** - Give AI workspace knowledge
3. **Multi-Model** - Switch between GPT-4/Claude
4. **Persistence** - Save conversations

---

## 📚 Full Documentation Created

I've created 3 comprehensive guides:

1. **`ASSISTANT-REBUILD-PLAN.md`** - Complete architecture and vision
2. **`CURRENT-PROBLEMS.md`** - Analysis of what's broken (29 issues!)
3. **`COMPONENT-SPECS.md`** - Detailed component specifications
4. **`IMPLEMENTATION-GUIDE.md`** - Tools, database, testing, deployment
5. **`QUICK-START.md`** - This file (get running in 1 hour)

---

## 💡 My Recommendations

### **Approach 1: Big Bang (Recommended)**
- Build complete V2 at `/assistant-v2`
- Polish to perfection
- Feature flag rollout
- Switch everyone over
- **Time:** 2-3 weeks
- **Risk:** Low (parallel development)

### **Approach 2: Incremental**
- Fix current assistant piece by piece
- **Time:** 6+ weeks
- **Risk:** High (breaking changes)
- **NOT RECOMMENDED** - too much technical debt

---

## 🎯 What Makes This Better

### **Architecture**
- ✅ Vercel AI SDK = Battle-tested, maintained by Vercel
- ✅ Small focused components = Easy to maintain
- ✅ Proper state management = No bugs
- ✅ Server Actions = Type-safe, secure

### **Features**
- ✅ Tool calling = AI can actually DO things
- ✅ RAG = AI knows your workspace
- ✅ Multi-model = Choose best AI for task
- ✅ File upload = Vision, PDFs, docs

### **UX**
- ✅ Streaming = Feel like ChatGPT
- ✅ Code highlighting = Developer-friendly
- ✅ Animations = Delightful interactions
- ✅ Mobile-optimized = Works everywhere

---

## 🏁 Ready to Start?

**Suggested First Sprint:**

**Day 1-2:** Get basic streaming working (follow Quick Start above)  
**Day 3:** Polish UI to Framer/Linear quality  
**Day 4:** Add conversation persistence  
**Day 5:** Add first 3 tools (createAgent, searchCustomers, analyzeWorkflow)  

**By end of Week 1:** You'll have a working assistant that's already better than current version.

Then we iterate from there! 🚀

---

**Want me to start building this?** Just say the word and I'll scaffold the entire structure with working code.

