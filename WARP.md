# GalaxyCo.ai 2.0 - Project Rules

**Last Updated**: January 10, 2025  
**Project**: GalaxyCo.ai 2.0 - Make multi-agent AI useful in minutes  
**Current Phase**: Phase 9B - Live Execution & Testing

---

## 🎯 Project Overview

GalaxyCo.ai is a multi-agent AI platform where users get personalized dashboards with AI agent "Packs" that deliver measurable outcomes from Day 1.

**Key Architecture**:

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend**: NestJS (REST + WebSocket) + Python agents (FastAPI + LangGraph)
- **Database**: Postgres with pgvector (Neon)
- **Cache**: Redis (Upstash)
- **Auth**: Clerk
- **Hosting**: Vercel (web) + AWS ECS (api/agents)
- **Monorepo**: Turborepo + pnpm workspaces

---

## 📁 Repository Structure

```
galaxyco-ai-2.0/
├── apps/
│   ├── web/              # Next.js frontend (Vercel)
│   └── api/              # NestJS backend (AWS ECS)
├── services/
│   └── agents/           # Python agents (AWS ECS)
├── packages/
│   ├── database/         # Shared database package
│   ├── ui/               # Shared React components
│   └── config/           # Shared configs
├── docs/                 # Comprehensive documentation
├── scripts/              # Utility scripts
└── infra/terraform/      # Infrastructure as Code
```

---

## 🔐 Security & Best Practices

### Environment Variables

- **NEVER** commit secrets to git
- **NEVER** print environment variable values in terminal output or logs
- Always reference secrets by name only and mask sensitive values
- Store production secrets in AWS Secrets Manager
- Use `.env.local` for local development only

### Multi-tenancy

- **ALWAYS** include `tenant_id` (or `workspace_id`) filter in WHERE clauses
- Never expose data across tenant boundaries
- Use row-level security policies where applicable
- Validate tenant_id matches authenticated user's tenant
- Log any cross-tenant data access attempts as security incidents

### Database Migrations (Drizzle)

1. Create migrations: `npm run db:migration:create -- migration_name`
2. Review generated SQL before applying
3. Test migration on dev environment first: `npm run db:migrate`
4. Include rollback plan in migration comments
5. Never modify existing migrations—create new ones for changes
6. Naming convention: `YYYYMMDD_descriptive_name.sql`

---

## 🤖 AI Gateway Service

### Always Use AI Gateway

**NEVER** call AI providers (OpenAI, Anthropic) directly. Always use the centralized AI Gateway service.

```typescript
import { AIGatewayService } from "@/lib/ai-gateway";

const response = await AIGatewayService.generateText({
  tenantId: "workspace_123",
  userId: "user_456",
  agentId: "agent_789",
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Hello!" }],
});
```

**Benefits**:

- ✅ Automatic cost tracking
- ✅ Comprehensive logging (tenant, user, agent)
- ✅ Error handling & retry support
- ✅ Performance monitoring

**Reference**: `docs/AI_GATEWAY_QUICK_REF.md`

---

## 💻 Development Workflow

### Before Making Code Changes

Run health checks to ensure codebase is clean:

```bash
# From apps/web
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
```

**Block changes if any health checks fail.**

### Agent Execution Architecture ✅ NEW

The platform supports both **mock** and **live** agent execution:

```
TestPanel (React) → /api/agents/[id]/execute → Python FastAPI → AI Providers
     │                        │                      │
     │                        ├─ Mock Mode          │
     │                        └─ Live Mode ─────────┘
     └─ Rich UI with metrics, error handling, mode toggle
```

**Mock Mode**: Returns deterministic responses without calling AI providers  
**Live Mode**: Routes through Python service using LangChain + OpenAI/Anthropic

**Key Files**:

- `apps/web/components/agents/TestPanel.tsx` - Frontend execution interface
- `apps/web/app/api/agents/[id]/execute/route.ts` - API endpoint with mode switching
- `services/agents/app.py` - Python FastAPI service for live execution
- `apps/web/lib/actions/agent-actions.ts` - Unified execution client

**Features**:

- ✅ Multi-tenant security (workspace isolation)
- ✅ Real-time metrics (tokens, cost, latency)
- ✅ Professional UI with loading states
- ✅ Comprehensive error handling
- ✅ Mobile-responsive test panel

### Git Commit Standards

Follow Conventional Commits format:

**Format**: `type(scope): message`

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Scopes**: `web`, `api`, `agents`, `db`, `infra`, `docs`

**Examples**:

- `feat(web): add agent builder visual editor`
- `fix(api): handle missing workspace_id in agent execution`
- `docs(readme): update AI Gateway usage instructions`

### Git Configuration

- **Username**: `galaxy-co-ai`
- **Organization**: `galaxyco-ai`

---

## 🚀 Deployment

### Pre-Deployment Checklist

Before deploying to production:

1. ✅ Verify all smoke tests pass on staging
2. ✅ Check Sentry for recent errors in staging
3. ✅ Confirm database migrations applied successfully to staging
4. ✅ Review agent performance metrics (success rate, avg duration)
5. ✅ Have rollback plan ready (documented in workflow)
6. ✅ Notify team in Discord #deployments channel

**NEVER** deploy on Fridays after 2pm or before major holidays.

### Deployment Targets

- **Vercel**: Frontend (apps/web) - Auto-deploys from `main` and `develop`
- **Project Name**: `galaxyco-ai-platform`
- **AWS ECS**: Backend (apps/api) + Agents (services/agents)

### Confirmation for Destructive Operations

Always confirm before executing:

- Database resets
- File deletions
- Production deployments
- Cache clearing operations

---

## 🧪 Testing & Quality

### Test Coverage Requirements

- All new features must include tests
- Test agents with mock data before connecting real integrations
- Run full test suite before PRs: `pnpm test`

### Code Quality Tools

- **Linting**: `pnpm lint`
- **Type Checking**: `pnpm typecheck`
- **Formatting**: Prettier (auto-format on save)

---

## 📚 Documentation

### Quick Documentation Reference

- **Setup**: `docs/setup/QUICK_START.md`
- **AI Gateway**: `docs/AI_GATEWAY_QUICK_REF.md`
- **Development**: `docs/development/internal_dev_workflow_warp_6.md`
- **Deployment**: `docs/deployment/DEPLOYMENT_GUIDE.md`
- **Project Status**: `docs/planning/PROJECT_STATUS.md`
- **Working Docs**: `docs/working/INDEX.md` (collaboration system)

### AI Collaboration on Documentation

**CRITICAL**: AI is a critical advisor, not a blind implementer.

**Working Docs System** (`docs/working/`):

1. **User creates** research/docs in `drafts/` - capture everything liberally
2. **AI revises** critically - filters noise, adds analysis, moves to `reviewed/`
3. **User approves** - reviews AI's judgment and recommendations
4. **AI integrates** - creates artifacts and places in proper locations

**AI Must**:

- ✅ Analyze research critically (not implement everything found)
- ✅ Filter what fits our project stage (MVP vs V1 vs V2)
- ✅ Challenge ideas that don't fit our architecture
- ✅ Recommend with clear reasoning (Implement/Adapt/Defer/Skip)
- ✅ Flag questions requiring human judgment
- ✅ Revise documents to meet quality standards before integration

**Reference**: `docs/working/AI-COLLABORATION-PRINCIPLES.md`

### When to Update Docs

Update documentation when:

- ✅ New features implemented
- ✅ Architecture decisions made
- ✅ Process changes
- ✅ Troubleshooting guides needed
- ✅ Session handoffs
- ✅ Research findings (use `docs/working/` system)

### Documentation Format

- Use clear, step-by-step instructions
- Include code examples
- Collapse verbose logs to essential information
- Always show diffs for file changes
- Format command outputs for readability

---

## 🎨 Design & UI Standards

### Visual Style

- **Theme**: Clean, minimal, enterprise-professional hybrid
- **Default**: Light theme with optional dark mode
- **Colors**: Cool tones with neutral grayscale base + blue-purple-teal accents
- **Components**: Card-based units, rounded corners, subtle dividers, medium shadows

### Inspirations

- StackAI (enterprise polish)
- OpenSea (card-driven discovery)
- OpenAI Agent Builder (simplicity)
- Sider (knowledge UI)
- Vercel (dashboard aesthetics)

---

## 🔧 Development Environment

### Required Tools

- **Node.js**: 20+
- **pnpm**: 9+
- **Python**: 3.11+
- **Git**: Latest
- **Terminal**: Warp (preferred)

### Package Manager

**ALWAYS use pnpm**, never npm or yarn.

```bash
# Install dependencies
pnpm install

# Run dev servers
pnpm dev

# Build all packages
pnpm build
```

---

## 🚫 What NOT to Do

### Avoid These Patterns

- ❌ Direct AI provider calls (use AI Gateway)
- ❌ Hard-coded API keys (use environment variables)
- ❌ Cross-tenant data exposure
- ❌ Committing secrets to git
- ❌ Modifying existing database migrations
- ❌ Deploying without running health checks
- ❌ Using npm or yarn (use pnpm)

### Legacy References

- ❌ Do NOT reference "Rise Roofing" - this is from a past project version
- ❌ Do NOT use outdated agent patterns - follow AI Gateway standards

### AI Collaboration Anti-Patterns

- ❌ Do NOT implement everything from research docs without critical analysis
- ❌ Do NOT skip the working docs review process (`docs/working/`)
- ❌ Do NOT assume all findings are relevant to current project stage

---

## 📊 Project Metadata

- **Current Phase**: Phase 9B - Live Execution & Testing
- **Repository**: `galaxyco-ai-2.0`
- **Organization**: `galaxyco-ai`
- **Primary Developer**: galaxy-co-ai
- **Development Hours**: High intensity (70 hrs/week target)

---

## 🤝 Collaboration Workflow

### Session Management

- Track sprint/phase durations for KPIs
- Update handoff documents for session continuity
- Maintain context across Warp chat sessions

### Review Step Template

During reviews, provide:

1. ✅ To-do list of actions to test
2. ✅ Expected outcomes
3. ✅ Quick turnaround notes (what works, what doesn't)

---

## 🎯 Project Goals

### Primary Objectives

1. Build polished dashboard environment (2-3 day sprints)
2. Phased feature rollout for consistent user upgrades
3. No corner-cutting - production-grade quality always
4. Budget-conscious ($200-$300/month post-setup)
5. AI that saves and recalls important project details

### Success Metrics

- **WSAO**: Weekly Successful Agent Outcomes
- Fast deployment cycles
- Clean, maintainable codebase
- Comprehensive documentation
- Excellent user experience

---

**Built with ❤️ to make multi-agent AI useful in minutes**
