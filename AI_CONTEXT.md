# GalaxyCo.ai 2.0 - Complete AI Context

**⚡ START HERE for AI Assistants ⚡**  
**Last Updated**: October 14, 2025  
**Auto-read by**: Warp AI at conversation start (see WARP.md)

---

## 🎯 **What This Project Is (30 seconds)**

**GalaxyCo.ai 2.0** is a multi-agent AI platform where users get personalized dashboards with AI agent "Packs" that deliver measurable outcomes from Day 1. Built for ambitious non-technical operators who need AI that actually works.

**Core Value Prop**: Make multi-agent AI useful in minutes (not weeks)

**Business Context**:

- 2-3 day sprint cycles, no corner-cutting
- Production-grade quality always
- $200-$300/month post-setup budget
- 70 hrs/week development intensity
- Primary user: Jason (Rise Roofing → now general platform)

---

## 🏗️ **Architecture (Quick Mental Model)**

```
┌─────────────────────────────────────────────────────┐
│                   User Dashboard                     │
├─────────────────────────────────────────────────────┤
│  Next.js 14 App (Vercel) ←→ NestJS API (AWS ECS)   │
│           ↓                         ↓                │
│    React Components            Python Agents        │
│    Tailwind CSS               (FastAPI + LangGraph) │
│           ↓                         ↓                │
│  Clerk Auth ←→ Postgres (Neon) + Redis (Upstash)   │
└─────────────────────────────────────────────────────┘
```

**Tech Stack**:

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend**: NestJS (REST + WebSocket) + Python agents (FastAPI + LangGraph)
- **Database**: Postgres with pgvector (Neon) + Redis cache (Upstash)
- **Auth**: Clerk
- **Hosting**: Vercel (web) + AWS ECS (api/agents)
- **Monorepo**: Turborepo + pnpm workspaces

---

## 📁 **Repository Structure (What Lives Where)**

```
galaxyco-ai-2.0/
├── 📱 apps/
│   ├── web/              # Next.js frontend → THIS IS WHERE YOU'LL WORK MOST
│   │   ├── app/          # Next.js 14 app router pages
│   │   ├── components/   # React components (error/, loading/, layout/, agents/)
│   │   ├── lib/          # Utilities (errors.ts, ai-gateway.ts, etc.)
│   │   ├── hooks/        # Custom React hooks (use-error.ts)
│   │   └── contexts/     # React Context (SidebarContext.tsx)
│   └── api/              # NestJS backend → AWS ECS
├── 🤖 services/
│   └── agents/           # Python FastAPI agents → AWS ECS
├── 📦 packages/
│   ├── database/         # Shared Drizzle ORM
│   ├── ui/               # Shared React components
│   └── config/           # Shared configs
├── 📚 docs/              # Human-focused documentation
├── 🔧 scripts/           # Utility scripts
├── 🏗️ infra/             # Infrastructure as Code (Terraform)
├── 🤖 AI_CONTEXT.md      # This file (AI onboarding)
├── ⚙️ WARP.md            # Project rules (AUTHORITATIVE)
└── 📋 QUICK_REFERENCE.md # Commands cheat sheet
```

---

## 🚨 **CRITICAL Rules (ALWAYS Follow)**

⚠️ **For complete rules, see `WARP.md` - this is just the most critical subset**

### **Multi-tenancy (Security)**

- **ALWAYS** include `tenant_id` (or `workspace_id`) filter in WHERE clauses
- **NEVER** expose data across tenant boundaries
- Log cross-tenant access attempts as security incidents
- **Reference**: WARP.md lines 58-62

### **AI Gateway Pattern**

- **NEVER** call AI providers (OpenAI, Anthropic) directly
- **ALWAYS** use `AIGatewayService.generateText()` with tenant/user/agent context
- **Reference**: WARP.md lines 78-100

### **Environment Security**

- **NEVER** print environment variable values in terminal output or logs
- **ALWAYS** reference by name only and mask sensitive values
- **Reference**: WARP.md lines 49-54

### **Development Standards**

- **Package Manager**: ALWAYS use `pnpm` (never npm/yarn)
- **Commits**: Follow Conventional Commits: `type(scope): message`
- **Health Checks**: Run `pnpm typecheck && pnpm lint` before changes
- **Reference**: WARP.md lines 175-195

---

## 📍 **Current State (Live Status)**

- **Branch**: `deployment-ready`
- **Phase**: Deployment & UI Polish (nearly complete)
- **Status**: ✅ Production-ready, awaiting final testing
- **Last Session**: October 13, 2025 - Error Handling & Loading States Implementation
- **Deployment**:
  - Preview: `https://galaxyco-ai-20-git-deployment-ready-daltons-projects-7f1e31bb.vercel.app`
  - Production: Waiting for merge to `main`

### **Recent Major Accomplishments** ✅

1. **Responsive Sidebar System** (Oct 12) - Global state via React Context
2. **Comprehensive Error Handling** (Oct 13) - Custom error classes + React boundaries
3. **Professional Loading States** (Oct 13) - Content-aware skeletons + spinners
4. **Agent Execution Architecture** - Mock/live modes with Python FastAPI

### **Known Issues** (Non-blocking)

- Drizzle ORM type errors in `node_modules` (doesn't affect builds)
- API package build issues (unrelated to web app)
- Some pre-commit hook warnings (cosmetic only)

---

## 🔑 **Key Files You Must Know**

### **Essential Reading**

- `WARP.md` - **Project rules & standards** (AUTHORITATIVE - 461 lines)
- `AI_CONTEXT.md` - This file (AI onboarding)
- `docs/status/SESSION_HANDOFF_2025-10-13_ERROR_LOADING.md` - Latest context
- `package.json` - Scripts & dependencies

### **Critical Implementation Files**

- `apps/web/lib/errors.ts` - Error handling system (269 lines)
- `apps/web/hooks/use-error.ts` - Error management hooks
- `apps/web/contexts/SidebarContext.tsx` - Global layout state
- `apps/web/components/error/` - Error display components
- `apps/web/components/loading/` - Loading skeleton components

### **Architecture Files**

- `apps/web/app/layout.tsx` - Root layout with SidebarProvider
- `apps/web/components/layout/MainSidebar.tsx` - Responsive sidebar
- `apps/web/app/api/agents/[id]/execute/route.ts` - Agent execution endpoint
- `services/agents/app.py` - Python FastAPI agent service

---

## 🎨 **Design System (User Experience)**

### **Visual Style**

- **Theme**: Clean, minimal, enterprise-professional hybrid
- **Colors**: Cool tones, neutral grayscale base + blue-purple-teal accents
- **Components**: Card-based units, rounded corners, subtle dividers, medium shadows
- **Icons**: Space theme (🚀 rocket, 🛰️ satellite, 🌍 planet) - **NO emojis in UI**

### **Layout Inspiration**

- **StackAI** (enterprise polish)
- **OpenSea** (card-driven discovery, search bar top-left)
- **OpenAI Agent Builder** (simplicity)
- **Vercel** (dashboard aesthetics)

### **Responsive Behavior**

- **Sidebar**: Hover to expand (64px → 240px), pin to keep expanded
- **Mobile**: < 768px hides sidebar offset
- **Content**: Shifts smoothly with sidebar (300ms transitions)
- **Reference**: WARP.md lines 148-173

---

## 🧭 **How to Navigate for Common Tasks**

### **Adding a New Page**

```bash
# Location
apps/web/app/[route]/page.tsx

# Pattern
export default function PageName() {
  return (
    <ErrorBoundary>
      <PageContent />
    </ErrorBoundary>
  );
}

# Example
apps/web/app/marketplace/page.tsx
```

### **Creating a New Component**

```bash
# Location
apps/web/components/[category]/[component-name].tsx

# Pattern
interface ComponentProps {
  // TypeScript props
}

export function ComponentName({ ...props }: ComponentProps) {
  // React + Tailwind CSS
}

# Examples
apps/web/components/error/error-display.tsx
apps/web/components/loading/skeletons.tsx
```

### **Adding an API Endpoint**

```bash
# Location
apps/web/app/api/[route]/route.ts

# Pattern - ALWAYS include multi-tenant security
export async function GET(request: Request) {
  // 1. Validate tenant_id from auth
  // 2. Apply tenant filter to queries
  // 3. Use error handling patterns
}

# Example
apps/web/app/api/agents/[id]/execute/route.ts
```

### **Working with Agents**

```bash
# Python Service
services/agents/app.py

# Coordination Layer
apps/api/ (NestJS coordinates execution)

# Frontend Integration
apps/web/components/agents/TestPanel.tsx
apps/web/lib/actions/agent-actions.ts
```

---

## 🚫 **Anti-Patterns (NEVER Do These)**

❌ **Direct AI provider calls** → Use AI Gateway  
❌ **Cross-tenant data access** → Always filter by tenant_id  
❌ **Hardcoded secrets** → Use environment variables  
❌ **Print env values** → Reference by name only  
❌ **Modify existing migrations** → Create new ones  
❌ **Use npm/yarn** → Always use pnpm  
❌ **Reference "Rise Roofing"** → This is from old project version  
❌ **Skip health checks** → Run typecheck + lint before commits

**Full anti-patterns list**: WARP.md lines 386-407

---

## 📚 **Documentation Navigation Map**

### **For Quick Context**

- **Current Status**: `docs/status/SESSION_HANDOFF_[latest].md`
- **Commands**: `QUICK_REFERENCE.md`
- **Rules Summary**: `WARP.md` lines 1-50

### **For Development Work**

- **Full Rules**: `WARP.md` (AUTHORITATIVE - read sections as needed)
- **Setup Guide**: `docs/guides/development-setup.md`
- **Architecture**: `docs/technical/architecture/README.md`
- **Deployment**: `docs/deployment/DEPLOYMENT_GUIDE.md`

### **For Debugging**

1. **Latest Session**: `docs/status/SESSION_HANDOFF_2025-10-13_ERROR_LOADING.md`
2. **Known Issues**: `WARP.md` lines 413-425
3. **Error Patterns**: `apps/web/lib/errors.ts`
4. **Troubleshooting**: `docs/guides/troubleshooting.md`

### **For Architecture Understanding**

- **Sidebar System**: `WARP.md` lines 148-173
- **Agent Execution**: `WARP.md` lines 119-139
- **Error Handling**: Session handoff Oct 13 lines 25-95
- **AI Gateway**: `WARP.md` lines 75-101

---

## 🎯 **Context by Task Type**

### **🔨 Building a New Feature**

1. Read: `WARP.md` development workflow (lines 104-196)
2. Check: Current branch status (`git status`)
3. Follow: TypeScript patterns in existing components
4. Test: Run `pnpm typecheck && pnpm lint` before commit
5. Pattern: Wrap with ErrorBoundary + loading states

### **🐛 Debugging an Issue**

1. Read: Latest session handoff (`docs/status/SESSION_HANDOFF_[latest].md`)
2. Check: `WARP.md` known issues section
3. Run: Health checks (`pnpm typecheck`, check console errors)
4. Reference: Error handling patterns in `apps/web/lib/errors.ts`

### **🚀 Deploying Changes**

1. Read: Pre-deployment checklist (`WARP.md` lines 200-227)
2. Test: Preview deployment functionality
3. Verify: No TypeScript errors, no console errors
4. Merge: `deployment-ready` → `main` for production

### **🏗️ Understanding Architecture**

1. Start: This file's architecture section
2. Deep-dive: `WARP.md` repository structure (lines 26-42)
3. Technical: `docs/technical/architecture/README.md`
4. Current: Latest session handoff for recent changes

---

## 🤝 **Communication & Collaboration Context**

### **Developer Profile**

- **Intensity**: 70 hours/week development
- **Standards**: No corner-cutting, production-grade always
- **Tools**: Warp terminal preferred
- **Style**: Values comprehensive solutions over quick fixes
- **AI Partnership**: Wants AI to remember project details across sessions

### **Session Management**

- **Handoffs**: Each session documented in `docs/status/`
- **Context**: AI should preserve context across Warp conversations
- **KPIs**: Track sprint/phase durations for timeline optimization

### **Review Expectations**

- **Testing Lists**: Provide actionable to-do lists for user testing
- **Quick Turnarounds**: Note what works/doesn't work for rapid iteration
- **Context Preservation**: Maintain project momentum across sessions

---

## ⚡ **Quick Command Reference**

```bash
# Health Checks (run before any changes)
pnpm typecheck        # TypeScript compilation
pnpm lint            # ESLint checking

# Development
pnpm dev             # Start all dev servers
pnpm build           # Production build
pnpm test            # Test suite

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database

# Git (follow Conventional Commits)
git commit -m "feat(web): add new component"
git commit -m "fix(api): handle missing tenant_id"
git commit -m "docs(readme): update setup instructions"

# Deployment
vercel ls            # List deployments
git merge deployment-ready  # Deploy to production
```

**Full commands**: `QUICK_REFERENCE.md`

---

## 🔗 **Related Files & Deep Dives**

- **📋 Full Project Rules**: `WARP.md` (461 lines - AUTHORITATIVE)
- **🚀 Quick Commands**: `QUICK_REFERENCE.md`
- **📊 Latest Session**: `docs/status/SESSION_HANDOFF_2025-10-13_ERROR_LOADING.md`
- **🏗️ Setup Guide**: `docs/guides/development-setup.md`
- **🚀 Deployment**: `docs/deployment/DEPLOYMENT_GUIDE.md`
- **🏛️ Architecture**: `docs/technical/architecture/README.md`

---

## 🎯 **Success Metrics & Goals**

### **Primary Objectives**

1. Build polished dashboard environment (2-3 day sprints)
2. Phased feature rollout for consistent user upgrades
3. Production-grade quality (no corner-cutting)
4. Budget-conscious operation ($200-$300/month post-setup)
5. AI that saves and recalls project details across sessions

### **Current Success Metrics**

- **WSAO**: Weekly Successful Agent Outcomes
- **Fast deployment cycles**: Preview → Production in minutes
- **Clean codebase**: TypeScript strict, comprehensive error handling
- **Excellent UX**: Responsive design, loading states, error recovery

---

## 🎬 **What to Do Next**

### **If Starting Fresh**

1. Read this entire file (you're doing it!) ✅
2. Scan `WARP.md` for detailed rules
3. Check latest session handoff for current context
4. Run `pnpm dev` and explore the UI

### **If Continuing Work**

1. Check git status and recent commits
2. Read latest session handoff
3. Review any TODOs or action items
4. Run health checks before making changes

### **If Deploying**

1. Test preview deployment thoroughly
2. Follow pre-deployment checklist (WARP.md)
3. Merge `deployment-ready` → `main`
4. Monitor production deployment

---

## 🆘 **If You Need Help**

### **For Context Questions**

- **Project rules**: `WARP.md`
- **Current state**: Latest session handoff in `docs/status/`
- **Architecture**: This file + `docs/technical/`

### **For Implementation Questions**

- **Examples**: Look at existing components in `apps/web/components/`
- **Patterns**: Follow established patterns in codebase
- **Error handling**: Reference `apps/web/lib/errors.ts`

### **For Debugging**

- **TypeScript errors**: `cd apps/web && pnpm typecheck`
- **Runtime errors**: Check browser console + dev server logs
- **Known issues**: `WARP.md` known issues section

---

## 🏁 **Summary for AI Assistants**

You now have complete context for GalaxyCo.ai 2.0:

✅ **What it is**: Multi-agent AI platform for ambitious operators  
✅ **Where we are**: Production-ready, awaiting final deployment  
✅ **How it works**: Next.js + NestJS + Python agents, multi-tenant, AI Gateway  
✅ **What to avoid**: Anti-patterns that break security or architecture  
✅ **Where to find things**: Repository structure and navigation guide  
✅ **How to help**: Follow established patterns, maintain quality standards

**You're ready to assist with confidence!** 🚀

---

_Last Updated: October 14, 2025_  
_Next Update: When major architecture or status changes occur_  
_Maintenance: Keep current state section updated after each session_
