# 🎯 MASTER CHECKLIST: IA Refactor + Data Integration

**Duration:** 3 weeks (Oct 18 - Nov 8, 2025)  
**Goal:** Reorganize navigation + connect all pages to real API data  
**Status:** 🟡 In Progress

---

## ✅ WEEK 1: Core Pages + Real Data (Phase 3-Light)

**Objective:** Connect 20 critical pages that survive IA redesign

### Day 1-2: Foundation ✅ COMPLETE

- [x] 1.1 Run quality gates baseline (typecheck, lint, build) ✅
- [x] 1.2 Fix schema keyword conflict (exports/imports) ✅
- [x] 1.3 Audit existing API routes (64 routes functional) ✅
- [x] 1.4 Document current route → page mappings ✅
- [x] 1.5 Create `PAGES_TO_KEEP.md` list (20 pages) ✅

### Day 3-4: Dashboard & Analytics ✅ COMPLETE

- [x] 2.1 Dashboard (`/dashboard`) - Connected to real APIs ✅
  - [x] Fetch real agent count from `/api/agents`
  - [x] Fetch analytics from `/api/analytics/sales`, `/marketing`, `/outreach`, `/usage`
  - [x] Replace mock data with real metrics (580 lines → 420 lines)
  - [x] Add loading states (Spinner component)
  - [x] Add error handling (toast notifications)
  - [x] Commit: `feat(web): connect dashboard to real apis` (407d546)
- [x] 2.2 Analytics pages (6 pages) - Connected to real APIs ✅
  - [x] `/analytics` → Overview with all analytics (converted)
  - [x] `/analytics/sales` → Created, fetches revenue/invoices/customers/projects
  - [x] `/analytics/marketing` → Created, fetches campaigns/prospects/emails
  - [x] `/analytics/outreach` → Created, fetches tasks/events/contacts/emails
  - [x] `/analytics/time-usage` → Created, fetches task completion/distribution
  - [x] `/analytics/usage` → Created, fetches agent activity/knowledge metrics
  - [x] Commit: `feat(web): connect analytics pages to real apis (6 pages)` (677d8c1)

### Day 5-7: CRM Core

- [ ] 3.1 Customers (`/customers`) → `/api/customers`
- [ ] 3.2 Contacts (`/contacts`) → `/api/contacts`
- [ ] 3.3 Projects (`/projects`) → `/api/projects`
- [ ] 3.4 Prospects (`/prospects`) → `/api/prospects`
- [ ] 3.5 Verify RLS policies work (multi-tenant isolation)

### Day 8-10: Work Items (Will move to `/work` but connect now)

- [ ] 4.1 Tasks (`/tasks`) → `/api/tasks`
- [ ] 4.2 Calendar (`/calendar`) → `/api/calendar`
- [ ] 4.3 Inbox (`/inbox`) → `/api/inbox`
- [ ] 4.4 Notifications (`/notifications`) → `/api/notifications`

### Week 1 Quality Gates

- [ ] 5.1 Run `pnpm typecheck` (must pass)
- [ ] 5.2 Run `pnpm lint` (must pass)
- [ ] 5.3 Run `pnpm build` (must succeed)
- [ ] 5.4 Test 20 pages in browser (real data loads)
- [ ] 5.5 Commit: `feat(ui): connect Week 1 core pages to APIs`
- [ ] 5.6 Push to main
- [ ] 5.7 Update `CURRENT_SESSION.md`

**Week 1 Deliverable:** 20/112 pages with real data ✅

---

## 🔧 WEEK 2: Navigation Refactor

**Objective:** Implement new 7-item IA + route structure

### Day 1-2: Route Infrastructure

- [ ] 6.1 Create new route structure
  - [ ] Create `/work/layout.tsx` (5 tabs: Approvals, Tasks, Calendar, Inbox, Meetings)
  - [ ] Create `/automation/layout.tsx` (4 tabs: Agents, Workflows, Templates, Transcriptions)
  - [ ] Create `/insights/layout.tsx` (consolidate analytics)
  - [ ] Create `/outreach/layout.tsx` (Emails, Campaigns)
  - [ ] Create `/crm/layout.tsx` (Prospects, Contacts, Deals)
- [ ] 6.2 Create middleware redirects (40 redirects from old → new paths)
  - [ ] `/agents` → `/automation/agents`
  - [ ] `/workflows` → `/automation/workflows`
  - [ ] `/analytics/*` → `/insights?tab=*`
  - [ ] `/emails` → `/outreach/emails`
  - [ ] `/campaigns` → `/outreach/campaigns`
  - [ ] Document all redirects in `docs/routing/REDIRECTS.md`

### Day 3-4: Navigation Components

- [ ] 7.1 Update sidebar navigation (7 primary items)
  - [ ] Create `navigation.json` (canonical menu structure)
  - [ ] Update `Sidebar.tsx` to consume navigation.json
  - [ ] Add collapsible sub-menus for Work, Automation
  - [ ] Add mobile bottom nav (5 items)
- [ ] 7.2 Update breadcrumbs component
- [ ] 7.3 Update mobile navigation
- [ ] 7.4 Add keyboard shortcuts (⌘K, ⌘N)

### Day 5-7: Page Moves & Updates

- [ ] 8.1 Move pages to new structure
  - [ ] `/agents/*` → `/automation/agents/*`
  - [ ] `/workflows/*` → `/automation/workflows/*`
  - [ ] Move analytics pages under `/insights`
  - [ ] Move communication pages under `/outreach`
- [ ] 8.2 Update all internal links (use global search/replace)
- [ ] 8.3 Fix breadcrumb paths
- [ ] 8.4 Update test file paths

### Day 8-10: My Work Hub

- [ ] 9.1 Create `/work/approvals/page.tsx` (stub)
- [ ] 9.2 Move `/tasks` → `/work/tasks`
- [ ] 9.3 Move `/calendar` → `/work/calendar`
- [ ] 9.4 Move `/inbox` → `/work/inbox`
- [ ] 9.5 Create `/work/meetings/page.tsx` (stub for Week 4+)
- [ ] 9.6 Wire up tab navigation

### Week 2 Quality Gates

- [ ] 10.1 All redirects working (test 40 old paths)
- [ ] 10.2 Sidebar navigation functional
- [ ] 10.3 Mobile navigation working
- [ ] 10.4 No broken internal links
- [ ] 10.5 Breadcrumbs show correct paths
- [ ] 10.6 Run `pnpm typecheck && pnpm lint && pnpm build`
- [ ] 10.7 Commit: `feat(navigation): implement new 7-item IA structure`
- [ ] 10.8 Push to main
- [ ] 10.9 Update `CURRENT_SESSION.md`

**Week 2 Deliverable:** New IA live, all pages accessible via new structure ✅

---

## 📡 WEEK 3: Complete API Connections

**Objective:** Connect remaining 60 pages in final positions

### Day 1-3: Automation Pages

- [ ] 11.1 Agents (`/automation/agents`) - Verify connection (already done)
- [ ] 11.2 Workflows (`/automation/workflows`) → `/api/workflows`
- [ ] 11.3 Templates (`/automation/templates`) → stub or mock (low priority)
- [ ] 11.4 Transcriptions (`/transcriptions`) → stub (Week 4+ feature)

### Day 4-6: Settings & Admin

- [ ] 12.1 Settings pages (7 pages)
  - [ ] `/settings/profile` → `/api/users/me`
  - [ ] `/settings/workspace` → `/api/workspaces/current`
  - [ ] `/settings/team` → `/api/workspaces/current/members`
  - [ ] `/settings/billing` → stub or Stripe integration
  - [ ] `/settings/integrations` → `/api/integrations`
  - [ ] `/settings/security` → workspace security settings
  - [ ] `/settings/notifications` → user preferences
- [ ] 12.2 Admin pages (5 pages)
  - [ ] `/admin/users` → `/api/admin/users`
  - [ ] `/admin/workspaces` → `/api/admin/workspaces`
  - [ ] `/admin/analytics` → `/api/admin/analytics`
  - [ ] `/admin/settings` → `/api/admin/settings`
  - [ ] `/admin` (dashboard) → aggregate admin view

### Day 7-9: Communication & Outreach

- [ ] 13.1 Outreach pages
  - [ ] `/outreach/emails` → `/api/emails`
  - [ ] `/outreach/campaigns` → `/api/campaigns`
- [ ] 13.2 Chat (`/chat`) → `/api/chat`
- [ ] 13.3 Verify inbox/notifications (already connected)

### Day 10-12: Mobile Pages

- [ ] 14.1 Mobile variants (12 pages under `/m/*`)
  - [ ] `/m/dashboard` → reuse desktop data fetching
  - [ ] `/m/agents` → reuse agents API
  - [ ] `/m/notifications` → reuse notifications API
  - [ ] `/m/tasks` → reuse tasks API
  - [ ] `/m/contacts` → reuse contacts API
  - [ ] `/m/calendar` → reuse calendar API
  - [ ] `/m/chat` → reuse chat API
  - [ ] `/m/search` → implement search
  - [ ] `/m/settings` → reuse settings
  - [ ] `/m/workflows` → reuse workflows API
  - [ ] `/m/prospects` → reuse prospects API
  - [ ] `/m/documents` → `/api/documents`

### Day 13-15: Secondary & Utility Pages

- [ ] 15.1 Audit remaining pages (52 pages)
  - [ ] Identify truly static pages (skip API connections)
  - [ ] Connect dynamic pages (Activity, Search, Exports, Imports)
  - [ ] Update empty states with proper CTAs
- [ ] 15.2 Documents & Knowledge
  - [ ] `/documents` → `/api/documents`
  - [ ] `/knowledge` → knowledge base API

### Week 3 Quality Gates

- [ ] 16.1 Audit all 112 pages (documented in spreadsheet)
- [ ] 16.2 ~80 pages with real API connections
- [ ] 16.3 ~30 pages marked as static (no API needed)
- [ ] 16.4 No mock data arrays in production code
- [ ] 16.5 All loading states implemented
- [ ] 16.6 All error states handled
- [ ] 16.7 Run comprehensive tests
  - [ ] `pnpm typecheck` (0 errors)
  - [ ] `pnpm lint` (0 errors)
  - [ ] `pnpm build` (success)
  - [ ] `pnpm test:run` (all tests pass)
- [ ] 16.8 Browser testing (Chrome, Firefox, Safari, mobile)
- [ ] 16.9 Lighthouse audits on key pages (>90 score)
- [ ] 16.10 Commit: `feat(ui): complete API connections for all dynamic pages`
- [ ] 16.11 Push to main
- [ ] 16.12 Tag release: `git tag v2.0.0-ia-complete`

**Week 3 Deliverable:** All pages audited, 80 connected, 30 static, clean IA ✅

---

## 📊 WEEK 4+ (Separate Sprint): Advanced Features

**Objective:** Transcriptions + Page Agents (NOT in this checklist scope)

### Transcriptions Feature (2-3 weeks)

- [ ] Audio/video upload infrastructure
- [ ] Twilio/Layercode integration
- [ ] AI transcription (OpenAI Whisper?)
- [ ] Meeting AI summarization
- [ ] Meeting → Task linking
- [ ] Audio player component
- [ ] Database schema updates

### Page Agents System (2-3 weeks)

- [ ] Agent registry and SDK
- [ ] Context providers per page
- [ ] Agent UI components (toggle, sidebar)
- [ ] Per-page configurations (8 agents)
- [ ] Agent runtime and API calls

**NOTE:** These are tracked in separate sprint planning docs

---

## 🎯 Success Criteria (End of Week 3)

### Functional

- [ ] ✅ All 112 pages accessible via new IA
- [ ] ✅ 80+ pages with real API data
- [ ] ✅ Zero mock data in production code
- [ ] ✅ All redirects working
- [ ] ✅ Mobile navigation functional
- [ ] ✅ Loading/error states on all async operations

### Quality

- [ ] ✅ TypeScript: 0 errors
- [ ] ✅ ESLint: 0 errors
- [ ] ✅ Build: Success
- [ ] ✅ Lighthouse: >90 on key pages
- [ ] ✅ Tests: All passing

### Documentation

- [ ] ✅ `CURRENT_SESSION.md` updated
- [ ] ✅ `REDIRECTS.md` complete
- [ ] ✅ `navigation.json` canonical
- [ ] ✅ Page audit spreadsheet

### Performance

- [ ] ✅ Page load times <2s (p95)
- [ ] ✅ API response times <500ms (p95)
- [ ] ✅ No layout shifts (CLS <0.1)

---

## 📈 Progress Tracking

| Week   | Pages Connected | Routes Moved | Quality Gates | Status         |
| ------ | --------------- | ------------ | ------------- | -------------- |
| Week 1 | 20/112 (18%)    | 0            | ✅ All Pass   | ✅ DONE        |
| Week 2 | 20/112 (18%)    | 40 redirects | ✅ All Pass   | 🟡 In Progress |
| Week 3 | 80/112 (71%)    | All final    | ✅ All Pass   | ⏸️ Planned     |

**Current Status:** Week 1 Day 1 - Pre-flight complete, starting dashboard conversion

---

## 🚫 OUT OF SCOPE (This Sprint)

These are explicitly NOT part of this 3-week checklist:

- ❌ Transcriptions feature
- ❌ Page Agents system
- ❌ Twilio/Layercode integration
- ❌ Audio/video processing
- ❌ AI summarization beyond existing capabilities
- ❌ New database migrations (use existing schema)
- ❌ Payment/billing system changes
- ❌ Marketing site updates
- ❌ Mobile app (React Native)

If any of these come up, **STOP and discuss with user before proceeding.**

---

**Last Updated:** 2025-10-18  
**Owner:** Dalton + Warp AI  
**Repository:** galaxyco-ai-2.0
