# GalaxyCo.ai Development Standards

**Project-specific rules and conventions**

**⚠️ IMPORTANT: Universal patterns and partnership protocol are in `devops-hq`**

- Universal patterns: `C:\Users\Owner\workspace\devops-hq\.cursor\universal-patterns.md`
- Partnership protocol: `C:\Users\Owner\workspace\devops-hq\.cursor\master-context.md`
- Usage guidelines: `C:\Users\Owner\workspace\devops-hq\.cursor\DEVOPS-HQ-USAGE-GUIDELINES.md`

**This file contains GalaxyCo-specific rules only.** Universal patterns stay in devops-hq.

---

## 🎯 Core Principles

1. **Every component must be composable and reusable**
   - Build once, use everywhere
   - Props for configuration, not hardcoded values

2. **Use Kibo UI + shadcn for ALL UI components**
   - shadcn: Base components (button, card, input)
   - Kibo UI: Advanced components (editor, credit-card, status)
   - No custom components that duplicate existing patterns

3. **Natural language should drive everything**
   - If it can't be described in natural language, rethink it
   - Every AI feature needs natural language interface

4. **Visual feedback is mandatory for all actions**
   - Loading states for async operations
   - Success animations
   - Error messages with visual indicators
   - Progress bars for multi-step processes

5. **AI companion personality must shine through**
   - Friendly but professional tone
   - Visual emotions (thinking, confident, celebrating)
   - Proactive suggestions
   - Trust-building interactions

---

## 📁 Component Architecture

### File Structure (Monorepo)

```
apps/web/components/
├── ui/                      (shadcn base components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── kibo/                    (Kibo UI components)
│   ├── editor.tsx
│   ├── credit-card.tsx
│   ├── status.tsx
│   └── ...
└── galaxy/                  (GalaxyCo custom compositions)
    ├── crm/
    │   ├── LeadScoring.tsx
    │   ├── PipelineView.tsx
    │   ├── EmailIntelligence.tsx
    │   └── ActivityTracker.tsx
    ├── agents/
    │   ├── AgentCard.tsx        (using Kibo credit-card)
    │   ├── AgentBuilder.tsx     (natural language → agent)
    │   ├── AgentTemplates.tsx
    │   └── AgentOrchestrator.tsx
    ├── flows/
    │   ├── FlowBuilder.tsx      (React Flow integration)
    │   ├── FlowNodes.tsx
    │   ├── FlowParser.ts        (NL → visual nodes)
    │   └── FlowExecutor.tsx
    ├── companion/
    │   ├── CompanionAvatar.tsx
    │   ├── CompanionChat.tsx
    │   ├── CompanionPersonality.tsx
    │   └── CompanionFeedback.tsx
    └── documents/
        ├── SmartEditor.tsx
        ├── DocumentTemplates.tsx
        └── VersionHistory.tsx
```

### Import Patterns

```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/kibo/editor';
import { AgentCard } from '@/components/galaxy/agents/AgentCard';

// ❌ WRONG
import Button from '../../../components/ui/button';
```

---

## 💻 Code Standards

### TypeScript

```typescript
// ✅ ALWAYS strict mode
// tsconfig.json: "strict": true

// ✅ Explicit return types
export function calculateScore(lead: Lead): number {
  return lead.engagement * 0.4 + lead.timing * 0.6
}

// ✅ Proper types (no 'any')
interface AgentConfig {
  name: string
  type: 'sales' | 'support' | 'analyst'
  capabilities: string[]
}

// ❌ AVOID 'any'
function processData(data: any) { ... }  // Only if absolutely necessary
```

---

### React Patterns

```typescript
// ✅ Server Components by default
export default function AgentsPage() {
  const agents = await fetchAgents()
  return <AgentList agents={agents} />
}

// ✅ Client Components only when needed
'use client'
import { useState } from 'react'

export function AgentBuilder() {
  const [state, setState] = useState()
  // Interactive component
}
```

---

### Validation (Zod)

```typescript
// ✅ ALWAYS validate external input
import { z } from 'zod';

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['sales', 'support', 'analyst', 'marketer']),
  capabilities: z.array(z.string()).min(1),
});

export async function createAgent(data: unknown) {
  const validated = CreateAgentSchema.parse(data);
  // Safe to use validated data
}
```

---

## 🤖 AI Integration Patterns

### OpenAI Usage

```typescript
import { openai } from '@/lib/ai/openai'

// For main reasoning
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [...]
})

// For structured output
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  response_format: { type: "json_object" },
  messages: [...]
})
```

---

### Claude Usage

```typescript
import { claude } from '@/lib/ai/claude'

// For complex analysis
const response = await claude.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 4096,
  messages: [...]
})
```

---

### Embeddings

```typescript
// For vector search
import { openai } from '@/lib/ai/openai';

const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text,
});

// Store in Pinecone with org namespace
await pinecone
  .index('platform')
  .namespace(orgId)
  .upsert([
    {
      id: docId,
      values: embedding.data[0].embedding,
      metadata: { content: text, type: 'document' },
    },
  ]);
```

---

## 🗄️ Database Conventions

### Neon Postgres

```typescript
// ✅ Use Drizzle ORM (type-safe)
import { db } from '@/lib/db/neon';
import { agents } from '@/packages/database/src/schema';
import { eq, and } from 'drizzle-orm';

const result = await db
  .select()
  .from(agents)
  .where(
    and(
      eq(agents.id, agentId),
      eq(agents.orgId, currentOrgId), // Multi-tenant isolation!
    ),
  );

// ❌ NEVER raw SQL
const result = await db.execute('SELECT * FROM agents WHERE id = ?', [id]);
```

---

### Pinecone

```typescript
// ✅ Always use org namespace
await pinecone.index('platform').namespace(orgId).upsert([...])

// ✅ Include metadata for filtering
metadata: {
  orgId,
  type: 'document',
  timestamp: new Date().toISOString()
}
```

---

## 🎨 State Management

### Zustand for Global State

```typescript
// stores/agent-store.ts
import { create } from 'zustand';

export const useAgentStore = create((set) => ({
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));
```

---

### React Query for Server State

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetching
const { data: agents, isLoading } = useQuery({
  queryKey: ['agents', orgId],
  queryFn: () => fetchAgents(orgId),
  refetchInterval: 60000, // Refresh every minute
});

// Mutating
const { mutate: createAgent } = useMutation({
  mutationFn: (data) => createAgentAPI(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['agents']);
    toast.success('Agent created!');
  },
});
```

---

### Local State (useState)

```typescript
// For form inputs, modals, UI state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});
```

---

## ⚠️ Error Handling

### Every async function needs try-catch

```typescript
async function handleSubmit() {
  setIsLoading(true);
  try {
    await createAgent(data);
    toast.success('Agent created successfully!');
  } catch (error) {
    console.error('Agent creation failed:', error);
    toast.error('Could not create agent. Please try again.');
  } finally {
    setIsLoading(false);
  }
}
```

---

### User-friendly error messages

```typescript
// ❌ NEVER show technical errors to users
toast.error(error.message); // "Column 'xyz' not found"

// ✅ ALWAYS use friendly messages
toast.error('Something went wrong. Please try again.');
```

---

### Log errors to monitoring

```typescript
import { logger } from '@/lib/monitoring/logger'

catch (error) {
  logger.error('Agent creation failed', {
    error,
    userId,
    orgId,
    context: 'agent-builder'
  })
  toast.error('Could not create agent')
}
```

---

## 🧪 Testing Requirements

### Unit Tests (Utilities)

```typescript
// lib/utils.test.ts
import { cn } from './utils';

test('merges class names correctly', () => {
  expect(cn('px-4', 'px-6')).toBe('px-6');
});
```

---

### Integration Tests (API Routes)

```typescript
// app/api/agents/route.test.ts
test('POST /api/agents creates agent', async () => {
  const response = await POST(mockRequest);
  expect(response.status).toBe(201);
});
```

---

### Component Tests

```typescript
// components/galaxy/agents/AgentCard.test.tsx
import { render, screen } from '@testing-library/react'

test('displays agent information', () => {
  render(<AgentCard agent={mockAgent} />)
  expect(screen.getByText('Email Agent')).toBeInTheDocument()
})
```

---

### E2E Tests (Critical Flows)

```typescript
// tests/e2e/agent-creation.spec.ts
test('user can create agent from natural language', async ({ page }) => {
  await page.goto('/agents/new');
  await page.fill('[placeholder="Describe your agent"]', 'Email new leads');
  await page.click('text=Create Agent');
  await expect(page.locator('text=Agent created')).toBeVisible();
});
```

---

## 🚀 Performance Rules

### Lazy Load Routes

```typescript
// app/(dashboard)/workflows/page.tsx
import dynamic from 'next/dynamic'

const FlowBuilder = dynamic(
  () => import('@/components/galaxy/flows/FlowBuilder'),
  { ssr: false, loading: () => <Skeleton /> }
)
```

---

### Image Optimization

```typescript
import Image from 'next/image'

// ✅ ALWAYS use Next.js Image
<Image
  src="/hero.png"
  alt="GalaxyCo Dashboard"
  width={1200}
  height={630}
  priority  // For above-fold images
/>

// ❌ NEVER use <img>
<img src="/hero.png" />  // No optimization!
```

---

### Code Splitting

```typescript
// For large components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />
})
```

---

### Virtual Scrolling (Lists > 100 items)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// For large lists
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

---

## 🎨 Styling Standards

### Tailwind Only

```typescript
// ✅ GOOD
<div className="flex items-center gap-4 p-6 bg-violet-50 rounded-lg">

// ❌ BAD
<div style={{ display: 'flex', padding: '24px' }}>

// ✅ EXCEPTION: Gradients and dynamic colors
<div style={{
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
}}>
```

---

### Color Palette (Purple/Violet Theme)

```typescript
// Primary colors
bg-violet-50 to bg-violet-950
text-violet-600
border-violet-200

// Gradients
from-violet-500 to-purple-600
from-violet-600 to-indigo-600
```

---

## 🔄 Git Conventions

### Conventional Commits

```bash
# Format: type(scope): message

feat(web): add visual flow builder
fix(api): resolve agent execution bug
docs: update setup instructions
chore(deps): upgrade next to 15.0
refactor(agents): extract common logic
test(flows): add flow builder tests
```

### Branch Naming

```bash
feature/visual-flow-builder
fix/agent-execution-error
refactor/component-structure
```

---

## 📝 Component File Template

```typescript
// components/galaxy/[category]/ComponentName.tsx

'use client'  // Only if needs interactivity

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ComponentNameProps {
  // Props with JSDoc
  /** The unique identifier */
  id: string
  /** Optional callback */
  onSuccess?: () => void
}

/**
 * [Component purpose in one sentence]
 *
 * @example
 * <ComponentName id="123" onSuccess={handleSuccess} />
 */
export function ComponentName({ id, onSuccess }: ComponentNameProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useQuery({
    queryKey: ['key', id],
    queryFn: () => fetchData(id)
  })

  async function handleAction() {
    setIsLoading(true)
    try {
      await performAction()
      toast.success('Success!')
      onSuccess?.()
    } catch (error) {
      console.error('Action failed:', error)
      toast.error('Action failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!data) return <Skeleton />

  return (
    <Card className="p-6">
      {/* Component content */}
    </Card>
  )
}
```

---

## 🎯 AI-Specific Patterns

### Natural Language Processing

```typescript
// lib/ai/flow-parser.ts
export async function parseNLToFlow(input: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Convert natural language to workflow nodes.
        Return JSON with: { nodes: [...], edges: [...] }
        Node types: trigger, action, condition, agent, integration`,
      },
      {
        role: 'user',
        content: input,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

### Visual Feedback for AI Processing

```typescript
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'

export function AIProcessing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
      <span>AI is thinking...</span>
      <Loader2 className="h-4 w-4 animate-spin" />
    </motion.div>
  )
}
```

---

## 📊 Component Checklist

**Every component must have:**

- [ ] TypeScript types/interfaces
- [ ] Loading state (if async)
- [ ] Error handling (if can fail)
- [ ] Props with JSDoc
- [ ] Tailwind styling (no CSS files)
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support
- [ ] Accessibility (ARIA labels)

**Optional but recommended:**

- [ ] Framer Motion animations
- [ ] Empty state handling
- [ ] Test file alongside component
- [ ] Storybook story (future)

---

## ✅ Quality Gates

**Before committing:**

- [ ] No console.log statements (use proper logging)
- [ ] No TypeScript errors (`pnpm turbo run typecheck`)
- [ ] No ESLint errors (`pnpm turbo run lint`)
- [ ] Prettier formatted (`pnpm prettier --check .`)
- [ ] Tests pass (`pnpm turbo run test`)

**Pre-commit hook does this automatically!**

---

## 🎯 Remember

**The Vision:**
We're building THE platform, not a collection of tools.

**The Standard:**
Simple UI/UX WITHOUT EVER sacrificing any horsepower.

**The Goal:**
Make users feel like superheroes with an AI business partner.

---

**Last Updated:** November 2, 2025
**Version:** 1.0
