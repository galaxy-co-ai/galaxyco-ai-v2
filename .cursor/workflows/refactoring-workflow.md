# Refactoring Workflow

**Systematic approach to refactoring GalaxyCo code**

---

## 🎯 Refactoring Principles

1. **Test first** - Ensure tests exist before refactoring
2. **Small steps** - Make incremental changes
3. **Verify constantly** - Run tests after each change
4. **Document changes** - Update comments and docs
5. **Maintain behavior** - Don't change functionality

---

## 📋 Common Refactoring Patterns

### Pattern 1: Client Component → Server Component

**When to do it:**
- Component doesn't use state
- No event handlers
- Only displays data
- No browser APIs

**Steps:**

1. **Verify eligibility:**
```bash
# Check if component can be a Server Component
grep -E "(useState|useEffect|onClick|onChange)" component.tsx
```

2. **Before (Client Component):**
```typescript
'use client';

import { useState, useEffect } from 'react';

export function AgentsList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
      setLoading(false);
    }
    fetchAgents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
}
```

3. **After (Server Component):**
```typescript
// No 'use client' directive
import { Suspense } from 'react';
import { getAgents } from '@/lib/queries/get-agents';
import { AgentsListSkeleton } from './agents-list-skeleton';

export async function AgentsList() {
  // Fetch data directly in Server Component
  const agents = await getAgents();

  return (
    <div>
      <Suspense fallback={<AgentsListSkeleton />}>
        {agents.map(agent => (
          <div key={agent.id}>{agent.name}</div>
        ))}
      </Suspense>
    </div>
  );
}
```

4. **Benefits:**
- ✅ Faster initial load (no client JS)
- ✅ Better SEO
- ✅ Direct database access
- ✅ No loading state management

---

### Pattern 2: API Route → Server Action

**When to do it:**
- API route is only used by your app
- Simple CRUD operations
- Want better type safety
- Want simpler caching

**Steps:**

1. **Before (API Route):**
```typescript
// app/api/agents/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@packages/database/schema';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { orgId } = await auth();
  
  if (!orgId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await request.json();

  const [created] = await db
    .insert(agents)
    .values({ ...body, orgId })
    .returning();

  return NextResponse.json(created);
}
```

2. **After (Server Action):**
```typescript
// lib/actions/create-agent.ts
'use server';

import { db } from '@/lib/db';
import { agents } from '@packages/database/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function createAgent(input: unknown) {
  const { orgId } = await auth();
  
  if (!orgId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const validated = createAgentSchema.parse(input);

    const [created] = await db
      .insert(agents)
      .values({ ...validated, orgId })
      .returning();

    revalidatePath('/agents');

    return { success: true, data: created };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create agent',
    };
  }
}
```

3. **Update client code:**
```typescript
// Before (API Route)
const response = await fetch('/api/agents', {
  method: 'POST',
  body: JSON.stringify(data),
});
const result = await response.json();

// After (Server Action)
import { createAgent } from '@/lib/actions/create-agent';

const result = await createAgent(data);
```

4. **Benefits:**
- ✅ Type-safe (no JSON parsing)
- ✅ Built-in validation
- ✅ Simpler caching (revalidatePath)
- ✅ Better error handling
- ✅ Less boilerplate

---

### Pattern 3: Prop Drilling → Context/Zustand

**When to do it:**
- Passing props through 3+ components
- Same props passed to many components
- Global state needed

**Steps:**

1. **Before (Prop Drilling):**
```typescript
// ❌ Props passed through multiple levels
function App() {
  const [theme, setTheme] = useState('light');
  
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}

function ThemeToggle({ theme, setTheme }) {
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle</button>;
}
```

2. **After (Zustand Store):**
```typescript
// stores/theme-store.ts
import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));

// Components
function App() {
  return <Layout />;
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <ThemeToggle />;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  
  return <button onClick={toggleTheme}>Toggle ({theme})</button>;
}
```

3. **Benefits:**
- ✅ No prop drilling
- ✅ Components decoupled
- ✅ Easy to add new consumers
- ✅ Better performance (selective updates)

---

### Pattern 4: Large Component → Multiple Components

**When to do it:**
- Component > 200 lines
- Multiple responsibilities
- Hard to test
- Hard to understand

**Steps:**

1. **Before (Large Component):**
```typescript
// ❌ 500 lines, does too much
export function DashboardPage() {
  // State for agents
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // State for metrics
  const [metrics, setMetrics] = useState({});
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Fetch agents
  useEffect(() => {
    // ... 50 lines
  }, []);

  // Fetch tasks
  useEffect(() => {
    // ... 50 lines
  }, []);

  // Fetch metrics
  useEffect(() => {
    // ... 50 lines
  }, []);

  // Render agents
  function renderAgents() {
    // ... 50 lines
  }

  // Render tasks
  function renderTasks() {
    // ... 50 lines
  }

  // Render metrics
  function renderMetrics() {
    // ... 50 lines
  }

  return (
    <div>
      {/* ... 200 lines of JSX */}
    </div>
  );
}
```

2. **After (Multiple Components):**
```typescript
// dashboard-page.tsx (Server Component)
import { Suspense } from 'react';
import { AgentsSection } from './sections/agents-section';
import { TasksSection } from './sections/tasks-section';
import { MetricsSection } from './sections/metrics-section';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<AgentsSkeleton />}>
        <AgentsSection />
      </Suspense>
      
      <Suspense fallback={<TasksSkeleton />}>
        <TasksSection />
      </Suspense>
      
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsSection />
      </Suspense>
    </div>
  );
}

// sections/agents-section.tsx (Server Component)
import { getAgents } from '@/lib/queries/get-agents';
import { AgentCard } from './agent-card';

export async function AgentsSection() {
  const agents = await getAgents();

  return (
    <section>
      <h2>Agents</h2>
      <div className="grid gap-4">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}

// Similar for TasksSection and MetricsSection
```

3. **Benefits:**
- ✅ Each component has single responsibility
- ✅ Easier to test
- ✅ Easier to understand
- ✅ Better performance (Suspense per section)
- ✅ Easier to maintain

---

### Pattern 5: Untyped → Fully Typed

**When to do it:**
- Using `any` type
- TypeScript errors ignored
- Props not typed
- API responses not typed

**Steps:**

1. **Before (Untyped):**
```typescript
// ❌ Using 'any' everywhere
export function AgentCard({ agent }: { agent: any }) {
  const handleAction = async (data: any) => {
    const response = await fetch('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const result: any = await response.json();
    return result;
  };

  return <div>{agent.name}</div>;
}
```

2. **After (Fully Typed):**
```typescript
// types/agent.ts
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAgentInput {
  name: string;
  description?: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// components/agent-card.tsx
import { Agent, CreateAgentInput, ActionResult } from '@/types/agent';
import { createAgent } from '@/lib/actions/create-agent';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const handleAction = async (data: CreateAgentInput): Promise<ActionResult<Agent>> => {
    return await createAgent(data);
  };

  return <div>{agent.name}</div>;
}
```

3. **Benefits:**
- ✅ Type safety
- ✅ Better IDE autocomplete
- ✅ Catch errors at compile time
- ✅ Self-documenting code
- ✅ Easier refactoring

---

## 🛠️ Refactoring Workflow

### Step-by-Step Process

1. **Identify Code Smell**
   - Large components (> 200 lines)
   - Prop drilling (3+ levels)
   - Duplicate code
   - Complex functions (> 50 lines)
   - Missing types (`any`)
   - Missing error handling

2. **Write Tests (If Missing)**
   ```bash
   # Create test file first
   pnpm test:run component.test.tsx
   ```

3. **Plan Refactoring**
   - What pattern to apply?
   - What files to change?
   - What tests to update?
   - Impact on other code?

4. **Make Small Changes**
   - One pattern at a time
   - Commit after each step
   - Run tests frequently

5. **Verify Functionality**
   ```bash
   # Run tests
   pnpm test:run
   
   # Type check
   turbo run typecheck
   
   # Lint
   turbo run lint
   ```

6. **Update Documentation**
   - Update comments
   - Update README if needed
   - Document architectural changes

---

## 🎯 Refactoring Checklist

Before marking refactoring complete:

- [ ] Tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Functionality unchanged
- [ ] Code more readable
- [ ] Better performance (if applicable)
- [ ] Documentation updated
- [ ] Code review completed
- [ ] Deployed to preview
- [ ] Manual testing done

---

## 🚨 Refactoring Anti-Patterns

**Don't do these:**

1. **Big Bang Refactoring**
   - ❌ Rewrite entire feature at once
   - ✅ Make incremental changes

2. **Refactoring + New Features**
   - ❌ Mix refactoring with new features
   - ✅ Separate commits for each

3. **No Tests**
   - ❌ Refactor without tests
   - ✅ Write tests first

4. **Changing Behavior**
   - ❌ Change functionality during refactoring
   - ✅ Keep behavior identical

5. **Premature Optimization**
   - ❌ Optimize before measuring
   - ✅ Profile first, optimize second

---

## 📊 Measuring Success

**Before refactoring, measure:**
- Lines of code
- Complexity (cyclomatic)
- Test coverage
- Type coverage
- Build time
- Bundle size

**After refactoring, verify improvement:**
```bash
# Lines of code
cloc src/

# Type coverage
tsc --noEmit --pretty

# Test coverage
pnpm test:coverage

# Bundle size
pnpm build && du -sh .next/
```

---

## 🎓 Refactoring Resources

- Database patterns: `.cursor/rules/database-rules.md`
- Component patterns: `.cursor/rules/component-patterns.md`
- API conventions: `.cursor/rules/api-conventions.md`
- Testing standards: `.cursor/rules/testing-standards.md`

---

**Remember: Refactoring is about improving code structure without changing behavior. Test, verify, commit, repeat!**

