# 🚀 Integration Sprint - Agent Kickoff Message

**Copy/paste this message to start a new Warp AI session:**

---

## Quick Context

I'm ready to start the **Integration Sprint** for GalaxyCo.ai 2.0. The project has EXCEEDED its goal with 112/108 pages (104% completion) 🎉 with all UI built, but ~95% of pages use mock data. This sprint will connect all pages to real API endpoints and database.

## Required Reading

**Before you respond, please read these files in order:**

1. `/c/Users/Owner/workspace/galaxyco-ai-2.0/docs/status/CURRENT_SESSION.md` - Current project state
2. `/c/Users/Owner/workspace/galaxyco-ai-2.0/docs/sprints/INTEGRATION_SPRINT_PLAN.md` - Comprehensive 565-line sprint plan with 7 phases

## Project State Summary

- ✅ **Pages**: 112/108 (104%) built - EXCEEDED GOAL! 🎉
- ✅ **Components**: 48 reusable components
- ✅ **Design System**: 92% complete
- ✅ **Tests**: 519 tests passing
- ✅ **Quality**: TypeScript strict, WCAG 2.1 AA, zero errors
- ⚠️ **Data**: ~95% mock data (needs replacement)

## Sprint Overview

**Goal**: Connect all 112 pages to real API endpoints and database  
**Duration**: 14-18 hours across 6-7 sessions  
**Phases**: 7 phases from API routes to final verification  
**Priority**: HIGH - Critical for production readiness

### 7 Phases

1. **API Routes Foundation** (3-4h) - Create ~50 API routes
2. **Database Schema** (2-3h) - Add 16 new tables
3. **Data Fetching Layer** (4-5h) - Replace mock data in 112 pages
4. **Loading & Error States** (2h) - Implement async feedback
5. **Optimistic Updates** (2h) - Instant UI feedback
6. **Integration Testing** (2-3h) - E2E and API tests
7. **Verification & Polish** (1-2h) - Final checks

## Recommended Starting Point

**Start with Phase 1: API Routes Foundation**

Why:

- Foundation for all other phases
- Can be tested independently
- Enables parallel work on database
- Allows immediate integration by frontend

### Phase 1 Deliverables

Create API routes for:

- **Core CRM** (6 routes): customers, projects, contacts, tasks, calendar, prospects
- **Business Ops** (5 routes): invoices, campaigns, segments, exports, imports
- **Communication** (4 routes): inbox, emails, chat, notifications
- **Analytics** (6 routes): sales, marketing, outreach, time-usage, usage, reports
- **Dev Tools** (4 routes): api-keys, webhooks, audit-log, playground
- **Admin** (4 routes): users, workspaces, analytics, settings

Each route needs:

- ✅ RESTful conventions (GET, POST, PUT, DELETE)
- ✅ Zod validation for requests
- ✅ Error handling with typed responses
- ✅ Multi-tenant RLS isolation
- ✅ Logging with tenant_id and user_id
- ✅ Tests with Vitest

## Success Criteria

By end of sprint:

- [ ] All 112 pages fetch real data from API
- [ ] Zero mock data in production code
- [ ] All API routes tested with >80% coverage
- [ ] E2E tests cover all critical flows
- [ ] All loading/error states implemented
- [ ] Optimistic updates for instant feedback
- [ ] Multi-tenant isolation verified
- [ ] Performance targets met (Lighthouse >90)
- [ ] All quality gates green

## Commands Reference

**Setup**:

```bash
cd /c/Users/Owner/workspace/galaxyco-ai-2.0
git pull origin main
pnpm install
cd apps/web && pnpm dev
```

**Quality Checks**:

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

**Database**:

```bash
pnpm db:migration:create <name>
pnpm db:migrate
pnpm db:generate
pnpm db:studio
```

## Execution Pattern

For each phase:

1. **Plan** - Review phase details in INTEGRATION_SPRINT_PLAN.md
2. **Build** - Create routes/migrations/tests autonomously
3. **Test** - Run quality checks (typecheck, lint, test)
4. **Commit** - Use conventional commits format
5. **Document** - Update CURRENT_SESSION.md with progress
6. **Move Next** - Proceed to next phase or report blockers

## Communication Style

- Brief progress updates after each major milestone
- Only ask blocking questions
- Default to action over permission (except destructive ops)
- Show results, not checklists
- Commit after each phase completion

## What to Ask Me

**Confirm before starting**:

1. Which phase should I start with? (recommend Phase 1)
2. Any specific priorities or constraints?
3. Database access available? (needed for Phase 2)

Then execute autonomously with quality gates.

## Key Principles

- ✅ Autonomous execution - don't ask permission for obvious tasks
- ✅ Quality first - all quality gates must pass
- ✅ Commit frequently - after each phase
- ✅ Update docs - keep CURRENT_SESSION.md current
- ✅ Multi-tenant aware - all routes enforce RLS
- ✅ Security conscious - never log secrets
- ✅ Test everything - >80% coverage target

---

**Ready to start? Please:**

1. Read CURRENT_SESSION.md
2. Read INTEGRATION_SPRINT_PLAN.md
3. Confirm which phase to begin
4. Execute with confidence! 🚀
