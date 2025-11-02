# GalaxyCo.ai - Project Context

**Read this file when starting any work on GalaxyCo**

---

## 🎯 The Vision

**GalaxyCo.ai is THE AI operating system for businesses.**

Not just another AI tool. Not another chatbot. THE platform where ANY business in ANY vertical can build AI solutions through natural language in 60 seconds.

**What makes us different:**

- **CRM Power of Pipedrive/HubSpot** - But with 10x better UX that empowers non-technical users
- **Visual Workflow Building like Make.com** - Natural language → visual grids showing all business processes
- **n8n-Level Integration Power** - Without requiring any technical knowledge
- **File Management like Gamma.app + Dropbox** - Smart document creation meets enterprise storage
- **AI Marketing Partner** - Not just tools, but an AI that deeply understands the business
- **Professional AI Companionship** - Visual feedback that builds trust between human and AI

---

## 📊 Current State

**Foundation:** ✅ Complete

- Next.js 15 with App Router
- Neon Postgres + Pinecone
- Clerk authentication
- Turborepo monorepo
- Component library (shadcn + Kibo UI ready to integrate)
- AI infrastructure (OpenAI + Claude + Pinecone)

**In Progress:** 🚧

- Visual Flow Builder (React Flow)
- AI Companion enhancements
- Dev environment optimization

**Planned:** 📅

- Kibo UI integration (1,101 patterns)
- Smart Documents (Gamma-style)
- Integration Hub (Nango - 200+ connectors)
- Multi-agent orchestration

**Latest Status:** See `docs/08-status/CURRENT_SESSION.md`

---

## 🏗️ Architecture

**Monorepo Structure:**

```
galaxyco-ai-2.0/
├── apps/
│   ├── web/          Next.js 15 frontend (Vercel)
│   └── api/          NestJS backend (AWS ECS)
├── packages/
│   ├── database/     Drizzle ORM + schemas
│   ├── agents-core/  AI agent logic
│   ├── types/        Shared TypeScript types
│   └── ui/           Shared components
```

**Tech Stack:**

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI Libraries:** shadcn/ui (base), Kibo UI (advanced - to integrate)
- **Backend:** NestJS, Node.js
- **Database:** Neon Postgres (relational), Pinecone (vectors)
- **Auth:** Clerk (clean setup)
- **AI:** OpenAI GPT-4, Claude, OpenAI Embeddings
- **Deployment:** Vercel (web), AWS ECS (api)

**Why These Choices:**

- ✅ Neon Postgres - Working great (NOT Supabase)
- ✅ Clerk - Simple auth setup
- ✅ Kibo UI - Solves UI consistency (1,101 patterns)
- ✅ React Flow - Visual workflows (key differentiator)

---

## 🎯 Success Metrics

**The 60-Second Test:**
Natural language → working agent: < 60 seconds

**User Success:**

- Non-technical user success rate: > 95%
- Users describe platform as "AI business partner" not "tool"
- AI companion trust score: > 4.5/5

**Business Impact:**

- 10+ hours saved per week per user
- Users feel like "superheroes"
- Platform described as THE operating system, not a tool

---

## 💡 Core Principles

### 1. Natural Language First

"Every feature should be describable and controllable via natural language"

If you can't explain it in natural language, it shouldn't exist in the product.

### 2. Visual Feedback Mandatory

"Every action should have visual confirmation"

No silent failures. No invisible processing. Users must SEE what AI is doing.

### 3. Zero Technical Knowledge Required

"Non-technical users should succeed 95% of the time"

If it needs documentation, the UX failed.

### 4. AI as Companion

"Not just a tool, but a trusted colleague"

The AI should feel like working with a brilliant colleague who "gets it."

### 5. Simple Without Sacrificing Power

"Simple, engaging UI/UX WITHOUT EVER sacrificing any horsepower"

This is the mantra. Beautiful UI that hides complexity, but power is always there.

---

## 🚧 Current Sprint

**See:** `.cursor/current-sprint.md` for active tasks

**Priority This Week:**

1. Visual Flow Builder with React Flow
2. Natural Language → Visual workflow parser
3. AI Companion enhancements

---

## 📚 Key Resources

**Master Context:**

- Read `../devops-hq/.cursor/master-context.md` for universal context
- Read `.cursor/galaxyco-rules.md` for project-specific standards
- Read `.cursor/component-guide.md` for component implementations

**Project Documentation:**

- `docs/AI_CONTEXT.md` - Comprehensive 489-line project overview
- `docs/08-status/CURRENT_SESSION.md` - Latest session status
- `docs/ARCHITECTURE.md` - System architecture
- `PROJECT_GUIDE.md` - Quick reference

**Development:**

- `.cursorrules` - Development standards
- `.vscode/settings.json` - Editor config
- `.vscode/tasks.json` - Common tasks

---

## 🎨 UI/UX Philosophy

### The User Experience Mantras

1. **"If it needs docs, the UX failed"**
   - Interfaces should be self-explanatory
   - Natural language guides users
   - Visual feedback confirms actions

2. **"Visual > Text, Always"**
   - Show workflows as connected grids, not lists
   - Use colors, animations, visual indicators
   - Make complex things look simple

3. **"Every interaction builds trust"**
   - Show AI thinking
   - Explain decisions
   - Celebrate successes
   - Admit uncertainty

4. **"Make users feel like superheroes"**
   - Empower non-technical users to do technical things
   - Visual accomplishment
   - Progressive disclosure of power

---

## 🔄 Session Start Checklist

**When starting work on GalaxyCo, AI should:**

1. ✅ Read this file (context.md)
2. ✅ Read `current-sprint.md` (what we're working on)
3. ✅ Read `../devops-hq/.cursor/master-context.md` (partnership protocol)
4. ✅ Check `docs/08-status/CURRENT_SESSION.md` (latest status)
5. ✅ Ask: "What's the priority today?"

---

## 💬 Communication Style

**When working on GalaxyCo:**

- Think "AI operating system" not "AI tool"
- Focus on user empowerment
- Emphasize visual/UX aspects
- Consider non-technical users first
- Maintain high quality standards

---

## 🎯 The North Star

**"Make users feel like they have a brilliant AI business partner who truly understands their company and helps them succeed."**

Everything we build should support this vision.

---

**Last Updated:** November 2, 2025
**Status:** Foundation complete, visual workflows next
**Version:** 1.0
