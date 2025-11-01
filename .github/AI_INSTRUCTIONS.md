# AI Coding Assistant Instructions

## 🤖 **For GitHub Copilot, Cursor, and other AI coding tools**

When working in this GalaxyCo.ai 2.0 repository:

---

## 📋 **Essential Context**

**First Action**: Read `AI_CONTEXT.md` at the project root for complete project context.

**Project Type**: Multi-agent AI platform (Next.js + NestJS + Python agents)  
**Stage**: Production-ready, deployment phase  
**Standards**: Enterprise-grade, no corner-cutting

---

## 🏗️ **Code Style & Patterns**

### **TypeScript**

- Strict mode enabled
- Explicit type annotations for function parameters and returns
- Use `interface` for object shapes, `type` for unions/intersections
- Prefer functional components with hooks

### **React Components**

```typescript
// Pattern: Functional component with proper TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function ComponentName({ title, onAction }: ComponentProps) {
  // Component logic
  return (
    <div className="card">
      {title}
    </div>
  );
}
```

### **API Endpoints**

```typescript
// Pattern: Multi-tenant security + error handling
export async function GET(request: Request) {
  try {
    // 1. Extract tenant_id from auth
    const { userId } = auth();
    const tenantId = await getTenantId(userId);

    // 2. Apply tenant filter to ALL queries
    const data = await db.select().from(table).where(eq(table.tenantId, tenantId));

    // 3. Return with proper error handling
    return Response.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### **Error Handling**

```typescript
// Always wrap components with ErrorBoundary
export default function PageName() {
  return (
    <ErrorBoundary>
      <PageContent />
    </ErrorBoundary>
  );
}

// Use custom error handling utilities
import { apiRequest, handleApiError } from '@/lib/errors';

const response = await apiRequest('/api/endpoint', {}, tenantId);
```

---

## 🚨 **Critical Patterns (ALWAYS Follow)**

### **Multi-tenancy Security**

```typescript
// ✅ ALWAYS filter by tenant_id
const agents = await db.select().from(agentsTable).where(eq(agentsTable.tenantId, tenantId));

// ❌ NEVER query without tenant filter
const agents = await db.select().from(agentsTable); // SECURITY RISK
```

### **AI Gateway Usage**

```typescript
// ✅ ALWAYS use AI Gateway
import { AIGatewayService } from '@/lib/ai-gateway';

const response = await AIGatewayService.generateText({
  tenantId,
  userId,
  agentId,
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: prompt }],
});

// ❌ NEVER call AI providers directly
const response = await openai.chat.completions.create(); // FORBIDDEN
```

### **Environment Variables**

```typescript
// ✅ Reference by name only
console.log('Database connection configured');

// ❌ NEVER print values
console.log(`Database URL: ${process.env.DATABASE_URL}`); // SECURITY RISK
```

---

## 🎨 **Styling Conventions**

### **Tailwind CSS**

- Use design tokens: `bg-primary`, `text-secondary`
- Responsive: `md:`, `lg:` breakpoints
- Card-based layout: `bg-white rounded-lg shadow-md border`

### **Component Architecture**

```typescript
// Wrap with loading states and error boundaries
function DataComponent() {
  const { data, isLoading, error } = useAsyncOperation();

  if (isLoading) return <CardSkeleton count={3} />;
  if (error) return <ErrorDisplay error={error} />;

  return <div>{/* render data */}</div>;
}
```

---

## 📦 **Package Manager**

**ALWAYS use `pnpm`** (never npm or yarn):

```bash
pnpm install package-name
pnpm dev
pnpm build
```

---

## 🔧 **File Organization**

### **Components**

```
apps/web/components/
├── error/           # Error handling components
├── loading/         # Loading states & skeletons
├── layout/          # Layout components (sidebar, topbar)
├── agents/          # Agent-related components
└── ui/              # Shared UI components
```

### **API Routes**

```
apps/web/app/api/
├── agents/[id]/execute/route.ts    # Agent execution
├── auth/callback/route.ts          # Authentication
└── [feature]/route.ts              # Feature APIs
```

---

## 🚫 **Anti-Patterns (NEVER Do)**

❌ **Direct AI provider calls** → Use AI Gateway  
❌ **Cross-tenant queries** → Always filter by tenant_id  
❌ **Hardcoded secrets** → Use environment variables  
❌ **Print env values** → Reference by name only  
❌ **Skip error boundaries** → Wrap components  
❌ **Use npm/yarn** → Always use pnpm  
❌ **Modify existing migrations** → Create new ones

---

## 🧪 **Testing Patterns**

### **Before Commits**

```bash
# Run health checks
pnpm typecheck
pnpm lint

# Only commit if clean
git commit -m "feat(web): add new component"
```

### **Commit Format**

```
type(scope): description

# Examples:
feat(web): add agent execution interface
fix(api): handle missing tenant_id validation
docs(readme): update setup instructions
```

---

## 🔗 **Key References**

- **Complete Context**: `AI_CONTEXT.md` (READ FIRST)
- **Detailed Rules**: `WARP.md` (authoritative)
- **Commands**: `QUICK_REFERENCE.md`
- **Latest Session**: `docs/status/SESSION_HANDOFF_[latest].md`

---

## 🎯 **When in Doubt**

1. **Check existing patterns** in the codebase
2. **Follow TypeScript** - let the types guide you
3. **Maintain security** - always filter by tenant_id
4. **Ask for clarification** rather than assume

---

_This project maintains high standards. When suggesting code, ensure it meets production quality._
