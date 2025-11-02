# GalaxyCo Learnings

**Patterns and gotchas specific to this project**

---

## 🎯 Development Environment

### Monorepo Gotchas

**Learning:** lint-staged can't run root-level eslint

```json
// ❌ Fails in monorepo
"lint-staged": {
  "*.ts": ["eslint --fix"]
}

// ✅ Works
"lint-staged": {
  "*.ts": ["prettier --write"]
}
```

**Why:** ESLint needs per-workspace configs in monorepos.

**Solution:** Use workspace-specific eslint configs:

- `apps/web/.eslintrc.json`
- `apps/api/eslint.config.mjs`

---

### Cursor Settings Location

**Learning:** Cursor-specific settings don't go in `.vscode/settings.json`

**Wrong:**

```json
// .vscode/settings.json
{
  "cursor.agent.mode": "enabled" // ❌ Won't work
}
```

**Right:**

- Configure in Cursor UI: Settings → AI
- Document in guide files
- Keep `.vscode/settings.json` for VS Code settings only

---

## 🎨 UI/UX Patterns

### Kibo UI + shadcn Combination

**Learning:** Two-tier component system works beautifully

**Pattern:**

```typescript
// Base components: shadcn
import { Button, Card, Input } from '@/components/ui';

// Advanced components: Kibo UI
import { Editor, CreditCard, Status } from '@/components/kibo';

// Custom compositions: Galaxy
import { AgentCard, FlowBuilder } from '@/components/galaxy';
```

**Why:** shadcn for simplicity, Kibo for advanced patterns, Galaxy for unique value.

---

## 🤖 AI Integration

### Streaming for Better UX

**Learning:** Users prefer seeing AI "think" vs waiting

**Pattern:**

```typescript
// Show progress immediately
setIsThinking(true)
stream AI response
show tokens as they arrive
setIsThinking(false)
```

**Impact:** Perceived speed improvement, trust building

---

### Vector Embeddings Strategy

**Learning:** Embed everything for future AI context

**Pattern:**

```typescript
// When user creates content
1. Save to database
2. Generate embedding
3. Store in Pinecone (org namespace)
4. Future AI queries benefit from this context
```

---

## 🗄️ Database

### Multi-Tenant Isolation

**Learning:** ALWAYS filter by orgId

**Critical Pattern:**

```typescript
// ❌ DANGEROUS
const agents = await db.select().from(agents).where(eq(agents.id, id));

// ✅ SAFE
const agents = await db
  .select()
  .from(agents)
  .where(
    and(
      eq(agents.id, id),
      eq(agents.orgId, currentOrgId), // Critical for tenant isolation!
    ),
  );
```

**Why:** Prevents data leaks between organizations.

---

### Neon Connection Pooling

**Learning:** Use neon() for serverless, not pg Pool

**Pattern:**

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**Why:** Serverless needs HTTP-based connections, not persistent pools.

---

## ⚠️ Error Handling

### Console.log in Production

**Learning:** console.log warnings in API are intentional (startup, auth errors)

**Solution:** Add inline ESLint disable comments

```typescript
// eslint-disable-next-line no-console -- Startup log
console.log('Server started');
```

**Future:** Replace with proper logger (Winston, Pino)

---

## 🚀 Performance

### Lazy Loading Heavy Components

**Learning:** React Flow and visual builders are heavy

**Pattern:**

```typescript
const FlowBuilder = dynamic(
  () => import('@/components/galaxy/flows/FlowBuilder'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96" />
  }
)
```

**Impact:** Faster initial page load

---

## 🧪 Testing

### Component Testing with React Query

**Learning:** Need to wrap components with QueryClientProvider

**Pattern:**

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

test('component renders', () => {
  const queryClient = new QueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  )
})
```

---

## 📝 To Be Added

**As we continue development, capture:**

- [ ] Visual Flow Builder patterns
- [ ] Kibo UI integration gotchas
- [ ] Natural language parsing best practices
- [ ] AI companion personality learnings
- [ ] Integration hub patterns (Nango)
- [ ] Performance optimizations
- [ ] User testing insights

---

## 💡 How to Use This File

**When you encounter a gotcha:**

1. Document it here
2. Explain the issue
3. Show the solution
4. Explain why it matters

**When you discover a pattern:**

1. Document it here
2. Show before/after code
3. Explain the benefit

**This file grows with the project!**

---

**Last Updated:** November 2, 2025
**Entries:** 8 learnings captured
**Version:** 1.0
