# 🎯 Next Session TODO - Phase 3 & 4 Execution Plan

**Date:** November 2, 2025  
**Branch:** `UI-UX-improvements-top-bar-redesign-and-logo-integration`  
**Status:** ✅ Ready for Next Agent - Phases 1-2 Complete

---

## ✅ What's Complete (Don't Redo)

### **Phase 1: Real Integrations** ✅ DONE

- Gmail integration (OAuth, send/receive emails, 12 tests)
- Slack integration (OAuth, send/read messages, 8 tests)
- CRM integrations (HubSpot + Pipedrive, contacts/deals, 14 tests)
- 40+ files, 5,500+ lines, 34 tests, 3 docs

### **Phase 2: Templates Library** ✅ DONE

- 10 pre-built workflow templates across 6 categories
- Template browser UI with search/filters
- Start from template feature in Flow Builder
- 13 files, 2,700+ lines, 18 tests, 1 doc

**Combined:** 53+ files, 8,200+ lines, 52+ tests, 22 commits

---

## 🎯 Phase 3: Agent Marketplace (Next Priority)

**Goal:** Enable agent discovery and installation  
**Estimated Time:** 6-8 hours autonomous work  
**Priority:** HIGH - Marketplace = user value discovery

### **Tasks:**

#### **1. Marketplace Infrastructure** (2 hours)

- [ ] Review existing `agentTemplates` and `agentPacks` database schema
- [ ] Create agent template API routes:
  - `GET /api/marketplace/agents` - List marketplace agents
  - `GET /api/marketplace/agents/[id]` - Agent detail
  - `POST /api/marketplace/agents/[id]/install` - Install agent
  - `POST /api/marketplace/agents/[id]/rate` - Rate agent
- [ ] Create agent template types and schemas
- [ ] Build installation service (copy template to workspace)
- [ ] Write 15+ tests for marketplace API

#### **2. Marketplace UI** (2 hours)

- [ ] Build `MarketplaceBrowser.tsx` component
  - Agent cards with ratings
  - Search and filter by category
  - Sort by popular/newest/rated
  - Featured agents section
- [ ] Create `/marketplace` page
- [ ] Create `/marketplace/agents/[id]` detail page
  - Agent preview
  - Installation button
  - Rating/review display
- [ ] Add "Browse Marketplace" button to agents page

#### **3. Agent Templates** (2 hours)

- [ ] Create 5 production-ready agent templates:
  1. **Email Assistant** - Manage inbox, draft replies
  2. **Research Agent** - Web research and summaries
  3. **Content Writer** - Blog posts, social media
  4. **Data Analyst** - Reports and insights
  5. **Customer Support** - Ticket handling, FAQs
- [ ] Define agent capabilities and configurations
- [ ] Add template metadata (category, tags, complexity)
- [ ] Write seed script to populate marketplace

#### **4. Installation Flow** (1 hour)

- [ ] Build installation modal with configuration
- [ ] Create post-installation setup wizard
- [ ] Add "Get Started" guide for installed agents
- [ ] Success notifications and next steps

#### **5. Rating System** (1 hour)

- [ ] Implement star rating component
- [ ] Create rating submission API
- [ ] Display average ratings on agent cards
- [ ] Add review count to agent metadata

#### **6. Testing & Documentation** (1 hour)

- [ ] Write 25+ marketplace tests:
  - API operations (15 tests)
  - Installation flow (5 tests)
  - Rating system (5 tests)
- [ ] Create `docs/features/agent-marketplace.md`
- [ ] Update user documentation

### **Success Criteria Phase 3:**

- ✅ Marketplace UI complete with search/filters
- ✅ 5 agent templates available
- ✅ Users can browse and install agents
- ✅ Installation flow works end-to-end
- ✅ Rating system functional
- ✅ All tests passing (25+ tests)

---

## 🎯 Phase 4: Billing & Payments (After Phase 3)

**Goal:** Enable revenue generation  
**Estimated Time:** 5-7 hours autonomous work  
**Priority:** CRITICAL - Required for monetization

### **Tasks:**

#### **1. Stripe Integration** (2 hours)

- [ ] Install Stripe SDK
- [ ] Create Stripe configuration
- [ ] Build Stripe webhook handler (`/api/webhooks/stripe`)
- [ ] Create subscription management service
- [ ] Write 15+ Stripe integration tests

#### **2. Billing UI** (2 hours)

- [ ] Update `/settings/billing` page:
  - Current plan display
  - Usage metrics
  - Upgrade/downgrade buttons
  - Payment method management
- [ ] Create pricing page (`/pricing`)
- [ ] Build subscription management modals
- [ ] Add billing alerts and notifications

#### **3. Free + Paid Tiers** (2 hours)

- [ ] Define tier limits:
  - **Free:** 100 agent runs/month, 2 agents max
  - **Pro:** 10,000 runs/month, unlimited agents, $29/month
  - **Enterprise:** Unlimited, priority support, custom pricing
- [ ] Implement feature gating middleware
- [ ] Add usage tracking and metering
- [ ] Create upgrade prompts and paywalls
- [ ] Build admin tier management

#### **4. Testing & Documentation** (1 hour)

- [ ] Write 20+ billing tests:
  - Stripe integration (10 tests)
  - Feature gating (5 tests)
  - Usage tracking (5 tests)
- [ ] Create `docs/features/billing-and-payments.md`
- [ ] Update pricing documentation

### **Success Criteria Phase 4:**

- ✅ Stripe integration working
- ✅ Free + Pro + Enterprise tiers implemented
- ✅ Users can subscribe and manage billing
- ✅ Feature gating works correctly
- ✅ Usage tracking accurate
- ✅ All tests passing (20+ tests)

---

## 📋 Quick Start for Next Agent

### **Step 1: Review Context** (5 min)

Read these files in order:

1. `SESSION-PROGRESS-SUMMARY.md` - What was just completed
2. `PHASE-1-INTEGRATIONS-COMPLETE.md` - Integration details
3. `PHASE-2-TEMPLATES-COMPLETE.md` - Templates details
4. `PROJECT-ASSESSMENT-AND-NEXT-STEPS.md` - Overall plan
5. This file (`NEXT-SESSION-TODO.md`) - Your tasks

### **Step 2: Verify Environment** (2 min)

```bash
# Check branch
git status

# Verify dependencies
pnpm install

# Run type checks
pnpm --filter web run typecheck

# Run tests
pnpm test
```

### **Step 3: Start Phase 3** (Immediately)

```bash
# You're ready! Start with:
```

**Task:** Build Agent Marketplace

**First Action:** Review `agentTemplates` and `agentPacks` database schema in `packages/database/src/schema.ts`

**Then:** Create marketplace API routes

**Estimated Time:** 6-8 hours for complete Phase 3

---

## 🛠️ Technical Context

### **Database Schema:**

**Already exists:**

- `agentTemplates` table - Individual marketplace templates
- `agentPacks` table - Bundled agent collections
- Both have: name, description, category, tags, config, pricing

**You need to:**

- Use existing schema (don't modify)
- Create API routes to query these tables
- Build UI to display templates
- Implement installation logic

### **API Patterns to Follow:**

**Reference these files for patterns:**

- `apps/web/app/api/templates/route.ts` - List/create pattern
- `apps/web/app/api/templates/[id]/route.ts` - Detail/delete pattern
- `apps/web/app/api/integrations/*/callback/route.ts` - OAuth pattern

**Follow same structure:**

- Zod validation for all inputs
- Auth check first
- Proper error handling
- Return consistent response format

### **UI Patterns to Follow:**

**Reference these components:**

- `apps/web/components/templates/TemplateBrowser.tsx` - Browser pattern
- `apps/web/app/(app)/workflows/templates/page.tsx` - Page pattern

**Follow Linear design system:**

- `bg-muted/30 hover:bg-muted/50` for cards
- `bg-muted` for icon containers
- Semantic Badge variants
- See `.cursor/current-sprint.md` for design tokens

---

## ⚡ Key Commands

### **Development:**

```bash
# Start dev server
pnpm --filter web run dev

# Type check
pnpm --filter web run typecheck

# Lint
pnpm --filter web run lint

# Format
pnpm prettier --write .

# Run tests
pnpm test
```

### **Git:**

```bash
# Check status
git status

# See recent commits
git log --oneline -10

# Create new commit
git add -A
git commit -m "feat(web): [your message]"

# Push when ready (after Dalton reviews)
# git push origin UI-UX-improvements-top-bar-redesign-and-logo-integration
```

---

## 📚 Essential Files Reference

### **Database Schema:**

- `packages/database/src/schema.ts` - All table definitions

### **Integration Examples:**

- `apps/web/lib/integrations/gmail/` - Gmail integration pattern
- `apps/web/lib/integrations/slack/` - Slack integration pattern
- `apps/web/lib/integrations/crm/` - CRM integration pattern

### **Template Examples:**

- `apps/web/lib/templates/prebuilt-templates.ts` - Template structure
- `apps/web/components/templates/TemplateBrowser.tsx` - Browser UI

### **Design System:**

- `apps/web/lib/design-tokens.ts` - Design tokens
- `docs/design-system/LINEAR-UI-PATTERNS.md` - UI patterns

---

## ✅ Quality Checklist

Before committing Phase 3:

- [ ] TypeScript checks pass (`pnpm --filter web run typecheck`)
- [ ] Linting passes (`pnpm --filter web run lint`)
- [ ] Code formatted (`pnpm prettier --write .`)
- [ ] Tests passing (25+ new tests for marketplace)
- [ ] Documentation complete
- [ ] Follows Linear design patterns
- [ ] Uses design tokens properly
- [ ] Semantic Badge variants (not colorful)

---

## 🎯 Success Metrics

After Phase 3 completion, users should be able to:

- ✅ Browse agent marketplace
- ✅ Search and filter agents by category
- ✅ View agent details and capabilities
- ✅ Install agents with one click
- ✅ Rate and review agents
- ✅ See popular and featured agents

After Phase 4 completion, users should be able to:

- ✅ Subscribe to Pro plan ($29/month)
- ✅ Manage payment methods
- ✅ View usage and billing
- ✅ Upgrade/downgrade plans
- ✅ Access tier-specific features

---

## 💡 Pro Tips

### **1. Follow Existing Patterns:**

Don't reinvent the wheel. The integration and template systems provide excellent patterns to follow.

### **2. Commit Frequently:**

Commit at each checkpoint as I did:

- After infrastructure setup
- After each integration
- After UI components
- After tests
- After documentation

### **3. Test As You Go:**

Write tests while building features, not after. Ensures quality from the start.

### **4. Reference Schema:**

Database schema is already perfect. Don't modify it, use it as designed.

---

## 🚀 Expected Outcome

After completing Phases 3 & 4, GalaxyCo will have:

**Phase 3 Outcome:**

- Marketplace with 5+ ready-to-install agents
- Discovery system for user value
- Installation flow working
- Rating system for quality

**Phase 4 Outcome:**

- Revenue generation enabled
- Free + Pro + Enterprise tiers
- Usage tracking and metering
- Feature gating working

**Combined:** Complete, production-ready platform ready for launch! 🎉

---

## 📞 Questions?

If you're unsure about anything:

1. **Check existing patterns** - Similar features already exist
2. **Read the database schema** - Shows data structure
3. **Review completed phases** - Provides implementation patterns
4. **Follow design system** - Linear patterns documented

---

**Ready to execute!** Just start with Phase 3, Task 1: Review agent schema and create marketplace API routes.

**Estimated time to 100% completion: 11-15 hours**

**You've got this!** 🚀

---

_Last Updated: November 2, 2025_  
_Session: Phases 1-2 Complete, Phases 3-4 Ready_  
_Status: 50% of roadmap complete_
