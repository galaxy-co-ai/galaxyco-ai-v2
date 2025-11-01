# 🎯 MASTER CHECKLIST: IA Refactor + Data Integration (VERIFIED)

**Duration:** 3 weeks (Oct 18 - Nov 8, 2025)  
**Goal:** Reorganize navigation + connect all pages to real API data  
**Status:** ✅ Week 1 COMPLETE (95%) | ✅ Week 2 COMPLETE (100%)  
**Last Verified:** 2025-10-19 06:50 UTC

---

## 📊 ACTUAL PROGRESS (Verified Against Codebase)

**Week 1 Target:** 20/112 pages connected to real APIs  
**Actual Complete:** 18/19 pages (95%)  
**Remaining:** 1 page (Workflows - out of scope)

**Completion Status:**

- ✅ Dashboard & Analytics: 7/7 pages (100%)
- ✅ CRM Core: 4/4 pages (100%)
- ✅ Work Items: 4/4 pages (100%)
- ✅ Business Pages: 3/3 pages (100%)
- ⚠️ Automation: Agents done, Workflows out of scope

---

## ✅ WEEK 1: VERIFIED COMPLETED PAGES (12/20)

### 1. Dashboard & Analytics (7 pages) - COMPLETE

#### 1.1 Dashboard (`/dashboard`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/dashboard/page.tsx`  
**Evidence:**

```typescript
// Line 65-71: Real API call
const agentsRes = await fetch(`/api/agents?workspaceId=${currentWorkspace.id}&limit=5`);

// Line 75-81: Real analytics API
const salesRes = await fetch(
  `/api/analytics/sales?workspaceId=${currentWorkspace.id}&dateRange=30`,
);
```

**API Endpoints:** `/api/agents`, `/api/analytics/sales`  
**Commit:** `feat(web): connect dashboard to real apis` (407d546)  
**Date:** Oct 17, 2025

#### 1.2 Analytics Overview (`/analytics`) ✅

**Status:** Connected to real APIs  
**Verified:** Fetches from multiple analytics endpoints

#### 1.3 Analytics Sales (`/analytics/sales`) ✅

**Status:** Connected to real APIs  
**Verified:** Revenue, invoices, customers, projects metrics

#### 1.4 Analytics Marketing (`/analytics/marketing`) ✅

**Status:** Connected to real APIs  
**Verified:** Campaigns, prospects, email threads

#### 1.5 Analytics Outreach (`/analytics/outreach`) ✅

**Status:** Connected to real APIs  
**Verified:** Tasks, events, contacts, emails

#### 1.6 Analytics Time Usage (`/analytics/time-usage`) ✅

**Status:** Connected to real APIs  
**Verified:** Task completion, distribution metrics

#### 1.7 Analytics Usage (`/analytics/usage`) ✅

**Status:** Connected to real APIs  
**Verified:** Agent activity, knowledge base growth

**Analytics Commit:** `feat(web): connect analytics pages to real apis (6 pages)` (677d8c1)

---

### 2. CRM Core (4 pages) - COMPLETE

#### 2.1 Customers (`/customers`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/customers/page.tsx`  
**Evidence:**

```typescript
// Line 100: Real API fetch
const res = await fetch(`/api/customers?${params}`);

// Line 103-104: Sets real data
const data = await res.json();
setCustomers(data.customers);
```

**API Endpoint:** `/api/customers`  
**Commit:** `feat(web): connect customers page to real api` (befaa4f)

#### 2.2 Contacts (`/contacts`) ✅

**Status:** Connected to real APIs  
**API Endpoint:** `/api/contacts`  
**Commit:** `feat(web): connect contacts page to real api` (741a80d)

#### 2.3 Projects (`/projects`) ✅

**Status:** Connected to real APIs  
**API Endpoint:** `/api/projects`  
**Commit:** `feat(web): connect projects and prospects pages to real apis` (c0e226e)

#### 2.4 Prospects (`/prospects`) ✅

**Status:** Connected to real APIs  
**API Endpoint:** `/api/prospects`  
**Commit:** `fix(api): connect prospects endpoint to database query` (aedb651)

---

### 3. Work Items (4/4 pages) - COMPLETE

#### 3.1 Tasks (`/tasks`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/tasks/page.tsx`  
**API Endpoint:** `/api/tasks`  
**Evidence:** Real API fetch from `/api/tasks?workspaceId=${currentWorkspace.id}`

#### 3.2 Calendar (`/calendar`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/calendar/page.tsx`  
**API Endpoint:** `/api/calendar`  
**Commit:** `feat(web): convert calendar and inbox pages to real apis (batch 1/2)` (dbbaf84)  
**Date:** Oct 19, 2025

#### 3.3 Inbox (`/inbox`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/inbox/page.tsx`  
**API Endpoint:** `/api/inbox`  
**Commit:** `feat(web): convert calendar and inbox pages to real apis (batch 1/2)` (dbbaf84)  
**Date:** Oct 19, 2025

#### 3.4 Notifications (`/notifications`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/notifications/page.tsx`  
**API Endpoint:** `/api/notifications`  
**Commit:** `feat(web): convert calendar and inbox pages to real apis (batch 1/2)` (dbbaf84)  
**Date:** Oct 19, 2025

---

## ✅ WEEK 1: ALL PAGES COMPLETED (18/19)

### 4. Business Pages (3/3 pages) - COMPLETE

#### 4.1 Invoices (`/invoices`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/invoices/page.tsx`  
**API Endpoint:** `/api/invoices`  
**Commit:** `feat(web): convert business pages to real apis (invoices, campaigns, emails)` (de40118)  
**Date:** Oct 19, 2025  
**Note:** Amounts stored in cents, properly divided by 100 for display

#### 4.2 Campaigns (`/campaigns`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/campaigns/page.tsx`  
**API Endpoint:** `/api/campaigns`  
**Commit:** `feat(web): convert business pages to real apis (invoices, campaigns, emails)` (de40118)  
**Date:** Oct 19, 2025

#### 4.3 Emails (`/emails`) ✅

**Status:** Connected to real APIs  
**File:** `apps/web/app/(app)/emails/page.tsx`  
**API Endpoint:** `/api/emails`  
**Commit:** `feat(web): convert business pages to real apis (invoices, campaigns, emails)` (de40118)  
**Date:** Oct 19, 2025

---

### 6. Automation Pages (2 pages)

#### 6.1 Agents (`/agents`) ✅

**Status:** Already connected to real APIs  
**Note:** Verified in earlier session, uses `/api/agents`

#### 6.2 Workflows (`/workflows`) ⚠️ OUT OF SCOPE

**Status:** NO DATABASE TABLE EXISTS  
**File:** `packages/database/src/schema.ts`  
**Evidence:** Searched entire schema, no `workflows` table defined  
**Decision:** Document as future work, exclude from Week 1  
**Reason:** Cannot convert without database migration

---

## 🎯 VERIFIED COMPLETION BREAKDOWN

| Category              | Target | Complete | Remaining | % Done  |
| --------------------- | ------ | -------- | --------- | ------- |
| Dashboard & Analytics | 7      | 7        | 0         | 100%    |
| CRM Core              | 4      | 4        | 0         | 100%    |
| Work Items            | 4      | 4        | 0         | 100%    |
| Business Pages        | 3      | 3        | 0         | 100%    |
| Automation            | 2      | 1        | 1\*       | 50%     |
| **TOTAL WEEK 1**      | **20** | **18**   | **2**     | **90%** |

\*Workflows excluded - out of scope (no DB table)

**Adjusted Week 1 Target:** 19 pages (excludes Workflows)  
**Final Completion:** 18/19 pages (95%) ✅ ACHIEVED

---

## ✅ WEEK 2: NAVIGATION REFACTOR - 100% COMPLETE

**Duration:** Oct 19, 2025 (4 hours)  
**Goal:** Reorganize 106 pages into workflow-based IA structure  
**Status:** ✅ COMPLETE

### What Was Accomplished

#### 2.1 Foundation (3 hours)

1. **Navigation Audit** - `docs/navigation/NAVIGATION_AUDIT.md`
   - Documented all 106 pages
   - Identified workflow patterns and pain points
   - Current structure problems documented

2. **New IA Design** - `docs/navigation/NEW_IA_DESIGN.md`
   - Workflow-centric structure designed
   - Complete route mapping for 106 pages
   - 44 redirect mappings documented

3. **Middleware Redirects** - `apps/web/middleware.ts`
   - 44 redirects implemented:
     - CRM consolidation: 5 redirects
     - Analytics consolidation: 5 redirects
     - Library consolidation: 6 redirects
     - Business consolidation: 3 redirects
     - Developer consolidation: 4 redirects
     - Automations consolidation: 4 redirects
     - Data management: 4 redirects
     - Settings: 1 redirect
     - Mobile deprecation: 12 redirects
   - Dynamic route handling (documents/[id], files/[id], etc.)
   - **Commit:** `6a475f5`

4. **My Work Hub** - `apps/web/app/(app)/my-work/page.tsx`
   - Central workflow dashboard
   - Aggregates tasks, calendar, inbox, notifications
   - Real API integration with Week 1 endpoints
   - Mobile-responsive grid layout
   - 394 lines

5. **Sidebar Navigation Update** - `apps/web/components/layout/main-sidebar.tsx`
   - New structure: My Work, Dashboard, Agents, CRM, Analytics, Library, Automations
   - Updated all route paths

6. **Page Migrations** - 28 pages moved
   - **CRM** (`/crm/*`): customers, contacts, projects, prospects, segments
   - **Library** (`/library/*`): knowledge→library, documents, templates, resources
   - **Business** (`/business/*`): invoices, campaigns, emails
   - **Developer** (`/developer/*`): api, webhooks, playground
   - **Data** (`/data/*`): exports, imports, audit-log
   - Used `git mv` to preserve history
   - **Commit:** `4b11a47`

#### 2.2 Hub Pages (30 minutes)

7. **CRM Hub** - `apps/web/app/(app)/crm/page.tsx`
   - Dashboard with live metrics from APIs
   - Links to all CRM pages
   - 220 lines

8. **Business Hub** - `apps/web/app/(app)/business/page.tsx`
   - Links to invoices, campaigns, emails
   - 93 lines

9. **Developer Hub** - `apps/web/app/(app)/developer/page.tsx`
   - Links to API, webhooks, playground
   - 87 lines

10. **Data Hub** - `apps/web/app/(app)/data/page.tsx`
    - Links to exports, imports, audit log
    - 93 lines

11. **Automations Hub** - Pre-existing at `/automations/page.tsx`

**Total Hub Pages:** 5 (CRM, Business, Developer, Data, Automations)

**Commit:** `98986b1`

### New Navigation Structure

```
Primary Navigation:
├── My Work (/my-work) ✨ NEW
├── Dashboard (/dashboard)
├── Agents (/agents)
├── CRM (/crm) ✨ NEW GROUP
│   ├── Hub page
│   ├── Customers
│   ├── Contacts
│   ├── Projects
│   ├── Prospects
│   └── Segments
├── Analytics (/analytics/*)
├── Library (/library) ✨ RENAMED from /knowledge
│   ├── Hub page
│   ├── Documents
│   ├── Templates
│   └── Resources
├── Business (/business) ✨ NEW GROUP
│   ├── Hub page
│   ├── Invoices
│   ├── Campaigns
│   └── Emails
├── Developer (/developer) ✨ NEW GROUP
│   ├── Hub page
│   ├── API Explorer
│   ├── Webhooks
│   └── Playground
├── Data (/data) ✨ NEW GROUP
│   ├── Hub page
│   ├── Exports
│   ├── Imports
│   └── Audit Log
└── Automations (/automations)
    ├── Hub page
    ├── Workflows
    └── Integrations
```

### Quality Gates - Week 2

- ✅ TypeScript: 0 errors
- ✅ Build: Success
- ✅ Lint: Pass (1 acceptable API warning)
- ✅ Prettier: Formatted
- ✅ Git: 5 commits pushed
- ✅ All redirects active
- ✅ Zero breaking changes
- ✅ Backward compatibility maintained

### Week 2 Metrics

**Files Changed:** 36  
**Lines Added:** ~2,100  
**Lines Removed:** ~50  
**Commits:** 5

1. `6a475f5` - IA refactor foundation
2. `4b11a47` - Page migrations
3. `38bfda4` - Documentation update (85%)
4. `98986b1` - Hub pages completion
5. `0738a7d` - Documentation update (100%)

### Impact

**User Experience:**

- Clearer mental model (workflow-based grouping)
- Central "My Work" entry point
- Hub pages for quick navigation
- All old URLs work via redirects

**Developer Experience:**

- Scalable structure for growth
- Consistent route patterns
- Easy to add new features
- Git history preserved

**Technical:**

- Zero breaking changes
- Mobile-responsive maintained
- Production-ready

**Week 2 Status:** ✅ 100% COMPLETE

---

## 🔧 API READINESS MATRIX

| Page          | API Endpoint         | Status   | Database Table   | Query Type                 |
| ------------- | -------------------- | -------- | ---------------- | -------------------------- |
| Calendar      | `/api/calendar`      | ✅ Ready | `calendarEvents` | SELECT + workspace filter  |
| Inbox         | `/api/inbox`         | ✅ Ready | `inboxMessages`  | SELECT + status filter     |
| Notifications | `/api/notifications` | ✅ Ready | `notifications`  | SELECT + user/workspace    |
| Invoices      | `/api/invoices`      | ✅ Ready | `invoices`       | SELECT + customer relation |
| Campaigns     | `/api/campaigns`     | ✅ Ready | `campaigns`      | SELECT + metrics           |
| Emails        | `/api/emails`        | ✅ Ready | `emailThreads`   | SELECT + participants      |

**All APIs Verified:** ✅ All 6 endpoints exist with proper database queries  
**Schema Verified:** ✅ All tables exist in `packages/database/src/schema.ts`  
**Ready to Convert:** ✅ Yes, infrastructure is complete

---

## 📝 CONVERSION PATTERN (Proven & Tested)

This pattern was successfully used for Tasks, Customers, Contacts, Projects, and Prospects:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface DataType {
  // Copy exact schema from database
  id: string;
  workspaceId: string;
  // ... other fields
}

export default function PageName() {
  const { currentWorkspace } = useWorkspace();
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/endpoint?workspaceId=${currentWorkspace.id}&limit=100`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Failed to fetch:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    // Keep existing UI, replace mock array with 'data' state
  );
}
```

**Success Rate:** 100% (12/12 pages converted successfully)  
**Average Lines Changed:** 50-150 per page  
**Average Time:** 15-30 minutes per page

---

## 🚀 RECOMMENDED ACTION PLAN

### Phase 1: Immediate (Next 2-3 hours)

Convert remaining 6 pages using proven pattern:

**Batch 1 - Work Items (3 pages):**

1. Calendar → `/api/calendar`
2. Inbox → `/api/inbox`
3. Notifications → `/api/notifications`

**Batch 2 - Business Pages (3 pages):** 4. Invoices → `/api/invoices` (note: amounts in cents) 5. Campaigns → `/api/campaigns` 6. Emails → `/api/emails`

**Commit Strategy:**

```bash
# After each batch
git add apps/web/app/(app)/{calendar,inbox,notifications}/page.tsx
git commit -m "feat(web): connect work items pages to real apis"

git add apps/web/app/(app)/{invoices,campaigns,emails}/page.tsx
git commit -m "feat(web): connect business pages to real apis"
```

### Phase 2: Documentation (30 minutes)

- Update `CURRENT_SESSION.md` with new completion status
- Mark checklist items 4.2-4.4 and 5.1-5.3 as complete
- Document Workflows as out of scope

### Phase 3: Quality Gates (30 minutes)

```bash
pnpm typecheck  # Must pass: 0 errors
pnpm lint       # 0 errors (1 warning acceptable)
pnpm build      # Must succeed
```

### Phase 4: Final Push

```bash
git add docs/sprints/*.md docs/status/*.md
git commit -m "docs: complete week 1 api integration (18/19 pages)"
git push origin main
```

---

## ⚠️ KNOWN GOTCHAS (From Previous Conversions)

1. **Enum Mismatches**
   - Database: `in_progress`
   - UI sometimes expects: `in-progress`
   - **Solution:** Map on display or create status config object

2. **Monetary Values**
   - All amounts stored in **cents**
   - **Solution:** `(value / 100).toFixed(2)` for display
   - Applies to: invoices, campaigns (budget/spent)

3. **Optional Fields**
   - Many schema fields are nullable
   - **Solution:** Use conditional rendering `field || 'Default'`
   - Common: email, phone, location, assignedTo

4. **Workspace Context**
   - Must check `currentWorkspace?.id` exists
   - **Solution:** Early return in useEffect if undefined

5. **JSONB Fields**
   - attendees, metadata, participants stored as objects
   - **Solution:** Type as `any`, handle carefully in display

---

## 📊 PROGRESS TRACKING TABLE

|| Week | Focus | Achievement | Quality Gates | Status |
|| ------ | -------------------- | ------------------------ | ------------- | ------------- |
|| Week 1 | API Integration | 18/19 pages (95%) | ✅ All Pass | ✅ Complete |
|| Week 2 | Navigation Refactor | 44 redirects, 28 moved | ✅ All Pass | ✅ Complete |
|| Week 3 | API Completion | Target: ~88 more pages | ⏳ Pending | 🟡 Next Sprint |

**Current Sprint Velocity:** 12 pages / 10 days = 1.2 pages/day  
**Estimated Completion of Remaining 6:** 5 days (conservative) or 3 hours (optimistic)  
**Week 1 On Track:** ✅ Yes, with 3 hours of focused work

---

## 🎯 WEEK 3: REMAINING API CONNECTIONS (Estimated: 15-20 hours)

**Goal:** Connect all remaining pages to real APIs  
**Status:** ⏳ Not Started  
**Prerequisites:** ✅ Week 1 Complete, ✅ Week 2 Complete

### 3.1 Library Pages (4 pages) - Est: 2 hours

**New Routes (after Week 2 migration):**

1. `/library/documents` → `/api/documents`
2. `/library/templates` → `/api/templates`
3. `/library/resources` → `/api/resources`
4. `/library/files` → `/api/files`

**Notes:**

- All moved from `/knowledge/*` and `/documents/*` in Week 2
- Redirects already in place
- Need to verify API endpoints exist

---

### 3.2 Automation Pages (3 pages) - Est: 2 hours

**Routes:**

1. `/automations/workflows` → `/api/workflows` (⚠️ Verify DB table exists)
2. `/automations/integrations` → `/api/integrations`
3. `/automations/templates` → `/api/automation-templates`

**Note:** Workflows may need DB migration first

---

### 3.3 CRM Extended (3 pages) - Est: 1.5 hours

**New Routes (after Week 2 migration):**

1. `/crm/segments` → `/api/segments`
2. `/crm/deals` → `/api/deals` (if exists)
3. `/crm/leads` → `/api/leads` (if exists)

**Note:** Verify which CRM pages actually exist in codebase

---

### 3.4 Business Extended (2 pages) - Est: 1 hour

**New Routes (after Week 2 migration):**

1. `/business/proposals` → `/api/proposals` (if exists)
2. `/business/quotes` → `/api/quotes` (if exists)

---

### 3.5 Settings & Admin (12 pages) - Est: 3-4 hours

**Routes:**

1. `/settings/workspace` → `/api/workspaces/:id`
2. `/settings/members` → `/api/members`
3. `/settings/teams` → `/api/teams`
4. `/settings/roles` → `/api/roles`
5. `/settings/permissions` → `/api/permissions`
6. `/settings/billing` → `/api/billing`
7. `/settings/subscription` → `/api/subscriptions`
8. `/settings/api-keys` → `/api/api-keys`
9. `/settings/webhooks` → `/api/webhooks`
10. `/settings/logs` → `/api/audit-logs`
11. `/settings/security` → `/api/security-settings`
12. `/settings/integrations` → `/api/workspace-integrations`

**Note:** Settings pages often load data from multiple endpoints

---

### 3.6 Developer Tools (3 pages) - Est: 1.5 hours

**New Routes (after Week 2 migration):**

1. `/developer/api` → `/api/api-explorer`
2. `/developer/webhooks` → `/api/webhooks`
3. `/developer/playground` → Execute code directly

**Note:** API Explorer and Playground may need special handling

---

### 3.7 Data Management (3 pages) - Est: 1.5 hours

**New Routes (after Week 2 migration):**

1. `/data/exports` → `/api/exports`
2. `/data/imports` → `/api/imports`
3. `/data/audit-log` → `/api/audit-logs`

---

### 3.8 Mobile Pages (12 pages) - Est: 3-4 hours

**Status:** ⚠️ DEPRECATED in Week 2

**Routes (all redirect to desktop equivalents):**

1. `/m/dashboard` → `/dashboard`
2. `/m/agents` → `/agents`
3. `/m/tasks` → `/tasks`
4. `/m/calendar` → `/calendar`
5. `/m/inbox` → `/inbox`
6. `/m/customers` → `/crm/customers`
7. `/m/contacts` → `/crm/contacts`
8. `/m/projects` → `/projects`
9. `/m/analytics` → `/analytics`
10. `/m/settings` → `/settings`
11. `/m/notifications` → `/notifications`
12. `/m/search` → `/search`

**Decision:** Likely can DELETE these pages if they're just duplicates with mobile styling. Modern responsive design handles mobile views.

---

### 3.9 Secondary Pages (~50 pages) - Est: 5-8 hours

**Categories:**

1. **Detail Pages** (need dynamic routing):
   - `/crm/customers/[id]` → `/api/customers/:id`
   - `/crm/contacts/[id]` → `/api/contacts/:id`
   - `/crm/projects/[id]` → `/api/projects/:id`
   - `/library/documents/[id]` → `/api/documents/:id`
   - `/agents/[id]` → `/api/agents/:id`
   - `/automations/workflows/[id]` → `/api/workflows/:id`

2. **Utility Pages**:
   - `/search` → `/api/search`
   - `/activity` → `/api/activity-feed`
   - `/reports` → `/api/reports`
   - `/favorites` → `/api/favorites`
   - `/recent` → `/api/recent-items`

3. **Profile & User**:
   - `/profile` → `/api/users/:id`
   - `/profile/settings` → `/api/user-settings`

**Note:** Many detail pages may already be using templates with API connections

---

### 3.10 Quality Gates & Testing - Est: 2-3 hours

**After All Conversions:**

1. **TypeScript Check:**

   ```bash
   pnpm typecheck  # 0 errors required
   ```

2. **Lint Check:**

   ```bash
   pnpm lint  # 0 errors (warnings acceptable)
   ```

3. **Build Test:**

   ```bash
   pnpm build  # Must succeed
   ```

4. **Manual Testing:**
   - Navigate to each converted page
   - Verify data loads
   - Test error states (disconnect API)
   - Test loading states
   - Verify mobile responsiveness

5. **Browser Console:**
   - Zero console errors
   - No 404s on API calls
   - No CORS issues

6. **Database Verification:**
   ```bash
   # Check all referenced tables exist
   grep -r "from.*schema" apps/api/src/**/*.ts
   ```

---

## 📊 WEEK 3 EFFORT BREAKDOWN

|| Category | Pages | Hours | Priority |
|| ------------------ | ----- | ----- | -------- |
|| Library | 4 | 2 | High |
|| Automation | 3 | 2 | High |
|| CRM Extended | 3 | 1.5 | Medium |
|| Business Extended | 2 | 1 | Medium |
|| Settings & Admin | 12 | 4 | High |
|| Developer Tools | 3 | 1.5 | Medium |
|| Data Management | 3 | 1.5 | High |
|| Mobile Pages | 12 | 0\* | Low |
|| Secondary Pages | 50 | 8 | Medium |
|| Quality & Testing | - | 3 | Critical |
|| **TOTAL** | **92**| **24**| - |

\*Mobile pages likely can be deleted (deprecated)

**Revised Estimate:** 20-24 hours of focused work

---

## 🚀 WEEK 3 EXECUTION STRATEGY

### Phase 1: High-Value Pages (Day 1-2, 8 hours)

**Batch 1 - Library & Automation (6 hours):**

1. Audit which API endpoints exist vs need creation
2. Convert Library pages (4 pages)
3. Convert Automation pages (3 pages)
4. Commit: `feat(web): connect library and automation pages to real apis`

**Batch 2 - Settings (2 hours):**

1. Settings pages (12 pages) - many are simple forms
2. Commit: `feat(web): connect settings pages to real apis`

### Phase 2: Extended Features (Day 3, 6 hours)

**Batch 3 - CRM, Business, Developer, Data (6 hours):**

1. CRM extended (3 pages)
2. Business extended (2 pages)
3. Developer tools (3 pages)
4. Data management (3 pages)
5. Commit: `feat(web): connect extended crm, business, developer, and data pages`

### Phase 3: Secondary & Detail Pages (Day 4-5, 8 hours)

**Batch 4 - Detail Pages (4 hours):**

1. Audit which detail pages need conversion
2. Convert customer/contact/project detail pages
3. Convert document/agent/workflow detail pages
4. Commit: `feat(web): connect detail pages to real apis`

**Batch 5 - Utility Pages (4 hours):**

1. Search, activity, reports, favorites
2. Profile and user settings
3. Commit: `feat(web): connect utility and profile pages to real apis`

### Phase 4: Mobile Decision (Day 5, 2 hours)

**Option A - Delete Mobile Pages:**

- Remove `/m/*` pages entirely
- Keep redirects in middleware
- Desktop pages are already responsive
- Commit: `refactor(web): remove deprecated mobile pages`

**Option B - Keep Mobile Pages:**

- If they have unique mobile-optimized UI, keep them
- Connect to same APIs as desktop
- Commit: `feat(web): connect mobile pages to real apis`

### Phase 5: Quality Assurance (Day 6-7, 6 hours)

1. **Automated Checks (1 hour):**
   - Run typecheck, lint, build
   - Fix any errors

2. **Manual Testing (3 hours):**
   - Test every converted page
   - Verify data accuracy
   - Test error/loading states
   - Check mobile responsiveness

3. **Documentation (2 hours):**
   - Update CURRENT_SESSION.md
   - Update Master Checklist
   - Create Sprint Retrospective doc
   - Document any technical debt

---

## 🎯 WEEK 3 SUCCESS CRITERIA

**Functional:**

- [ ] 100% of pages connected to real APIs (excluding deprecated)
- [ ] Zero mock data in entire application
- [ ] All detail pages work with dynamic routing
- [ ] Search functionality operational
- [ ] All forms submit to real endpoints

**Quality:**

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Build: Success
- [ ] All API endpoints return valid data
- [ ] Zero console errors in browser

**Testing:**

- [ ] Manual smoke test of all pages
- [ ] API response validation
- [ ] Error handling verification
- [ ] Mobile responsiveness check

**Documentation:**

- [ ] CURRENT_SESSION.md updated
- [ ] Master Checklist 100% verified
- [ ] Sprint retrospective written
- [ ] Technical debt documented
- [ ] Handoff doc for next sprint

---

## ⚠️ WEEK 3 RISKS & MITIGATION

### Risk 1: Missing API Endpoints

**Probability:** Medium  
**Impact:** High

**Mitigation:**

- Audit API endpoints FIRST before starting conversions
- Create list of endpoints to build
- Build missing endpoints in batches
- Alternative: Use placeholder endpoints with TODO comments

### Risk 2: Complex Data Relationships

**Probability:** High  
**Impact:** Medium

**Mitigation:**

- Detail pages often need multiple API calls
- Use Promise.all() for parallel fetching
- Implement proper loading states
- Cache data where appropriate

### Risk 3: Database Schema Gaps

**Probability:** Medium  
**Impact:** High

**Mitigation:**

- Verify all DB tables exist before conversion
- Create migrations for missing tables
- Document schema changes needed

### Risk 4: Time Overrun

**Probability:** Medium  
**Impact:** Low

**Mitigation:**

- Focus on high-value pages first
- Secondary pages can be Phase 2
- Mobile pages can be deleted to save time
- Maintain quality over speed

---

## ✅ SUCCESS CRITERIA (Week 1)

**Functional:**

- [x] 12/19 pages fetching real data (63%)
- [x] Zero mock data in completed 12 pages
- [x] Loading states on all pages
- [x] Error handling with toast
- [ ] 6 remaining pages converted
- [ ] Final verification completed

**Quality:**

- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors (1 acceptable warning)
- [x] Build: Success
- [x] All services operational

**Documentation:**

- [x] CURRENT_SESSION.md updated
- [x] Master checklist verified with evidence
- [ ] Final completion summary
- [ ] Week 2 handoff ready

---

## 📌 CURRENT STATUS LINE

**Last Updated:** 2025-10-19 00:30 UTC  
**Verified By:** Codebase analysis (grep, file inspection, API verification)  
**Confidence Level:** 🟢 HIGH (Evidence-based, not documentation-based)

**Week 1 Status:**

- **Target:** 19 pages (Workflows excluded)
- **Complete:** 12 pages (63%)
- **Remaining:** 6 pages with mock data
- **Blocked:** 1 page (Workflows - no DB table)
- **APIs Ready:** 6/6 endpoints functional
- **Est. Time to Complete:** 3 hours focused work

**Next Session Start Point:**
Read `docs/status/HANDOFF_WEEK1_COMPLETION.md` and execute conversion pattern for remaining 6 pages.

---

**Repository:** galaxyco-ai-2.0  
**Branch:** main  
**Sprint:** IA Refactor + Data Integration (3 weeks)  
**Owner:** Dalton + Warp AI
