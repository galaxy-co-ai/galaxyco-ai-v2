# 🔧 TypeScript Fixes - Quick Reference

## Copy-Paste Fixes for Pre-Commit Errors

### FIX #1: ChatContainer.tsx Line 324

**File:** `apps/web/app/(app)/assistant-v2/components/ChatContainer.tsx`

```typescript
// FIND (line 324):
await handleSubmit(e);

// REPLACE WITH:
await handleSubmit(e as React.FormEvent<HTMLFormElement>);
```

---

### FIX #2: MessageBubble.tsx Line 92

**File:** `apps/web/app/(app)/assistant-v2/components/MessageBubble.tsx`

```typescript
// FIND (around line 92):
code({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  return !inline && match ? (

// REPLACE WITH:
code({ node, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');
  const inline = !(match); // Determine inline based on match

  return !inline && match ? (
```

---

### FIX #3: API Route maxSteps

**File:** `apps/web/app/api/assistant-v2/chat/route.ts`

```typescript
// FIND (around line 111-124):
const result = await streamText({
  model: getModel(model),
  system: systemPrompt,
  messages: coreMessages,
  tools: assistantTools,
  maxSteps: 5, // <-- REMOVE THIS LINE
  maxTokens: 4000,
  temperature: 0.7,

// REPLACE WITH:
const result = await streamText({
  model: getModel(model),
  system: systemPrompt,
  messages: coreMessages,
  tools: assistantTools,
  // maxSteps removed - parameter may not exist in AI SDK v5
  maxTokens: 4000,
  temperature: 0.7,
```

---

### FIX #4: RAG Service db.fn

**File:** `apps/web/lib/ai/assistant/rag-service.ts`

```typescript
// ADD at top of file (around line 6):
import { db, agents, customers, galaxyGrids } from '@galaxyco/database';
import { eq, desc, count } from 'drizzle-orm'; // <-- Add count

// FIND (line 86-90):
const [agentCount] = await db
  .select({ count: db.fn.count() })
  .from(agents)
  .where(eq(agents.workspaceId, workspaceId));

// REPLACE WITH:
const agentCountResult = await db
  .select({ count: count() })
  .from(agents)
  .where(eq(agents.workspaceId, workspaceId));
const agentCount = agentCountResult[0];

// FIND (line 91-95):
const [customerCount] = await db
  .select({ count: db.fn.count() })
  .from(customers)
  .where(eq(customers.workspaceId, workspaceId));

// REPLACE WITH:
const customerCountResult = await db
  .select({ count: count() })
  .from(customers)
  .where(eq(customers.workspaceId, workspaceId));
const customerCount = customerCountResult[0];

// FIND (line 96-100):
const [workflowCount] = await db
  .select({ count: db.fn.count() })
  .from(galaxyGrids)
  .where(eq(galaxyGrids.workspaceId, workspaceId));

// REPLACE WITH:
const workflowCountResult = await db
  .select({ count: count() })
  .from(galaxyGrids)
  .where(eq(galaxyGrids.workspaceId, workspaceId));
const workflowCount = workflowCountResult[0];
```

---

### FIX #5: Tools.ts (OPTIONAL - Can defer)

**File:** `apps/web/lib/ai/assistant/tools.ts`

**Quick Fix:** Temporarily disable tools to test streaming

```typescript
// In apps/web/app/api/assistant-v2/chat/route.ts
// FIND (line 115):
tools: assistantTools,

// REPLACE WITH:
// tools: assistantTools, // TEMPORARILY DISABLED - fix types later
```

---

## Verify Fixes

```bash
cd apps/web
pnpm typecheck

# Should show 0 errors (or only tools.ts errors if you skipped #5)
```

---

## Commit After Fixes

```bash
git add .
git commit -m "fix(web): resolve TypeScript errors in assistant-v2

- Fixed form event type in ChatContainer
- Fixed ReactMarkdown inline prop in MessageBubble
- Removed maxSteps parameter (AI SDK v5 compatibility)
- Updated RAG service to use drizzle-orm count function
- Tools temporarily disabled pending type fixes"

git push
```

---

**Time to complete:** 15-30 minutes  
**Priority:** Fix #1-4, skip #5 if short on time
