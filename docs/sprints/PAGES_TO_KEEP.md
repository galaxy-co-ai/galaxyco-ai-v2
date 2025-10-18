# Pages to Keep - Week 1 Core Pages

**Purpose:** 20 critical pages that survive IA redesign and get API connections first  
**Status:** Foundation list for Week 1 work  
**Last Updated:** 2025-10-18

---

## The 20 Core Pages (Week 1 Priority)

These pages will:

1. Be connected to real APIs in Week 1
2. Move to new locations in Week 2 (but code stays functional)
3. Form the foundation of the new IA

---

### 1. Dashboard (1 page)

- **Path:** `/dashboard`
- **APIs:** `/api/agents`, `/api/analytics/*`
- **Why Keep:** Command center, highest traffic
- **Week 2 Destination:** Stays at `/dashboard`

---

### 2. CRM Core (4 pages)

- **Path:** `/customers`
  - API: `/api/customers`
  - Why: Customer database foundation
  - Week 2: Moves to `/crm/customers`

- **Path:** `/contacts`
  - API: `/api/contacts`
  - Why: Contact management core
  - Week 2: Moves to `/crm/contacts`

- **Path:** `/projects`
  - API: `/api/projects`
  - Why: Project tracking
  - Week 2: Moves to `/crm/projects`

- **Path:** `/prospects`
  - API: `/api/prospects`
  - Why: Lead pipeline
  - Week 2: Moves to `/crm/prospects`

---

### 3. Work Items (4 pages)

- **Path:** `/tasks`
  - API: `/api/tasks`
  - Why: Task management core
  - Week 2: Moves to `/work/tasks`

- **Path:** `/calendar`
  - API: `/api/calendar`
  - Why: Calendar/scheduling
  - Week 2: Moves to `/work/calendar`

- **Path:** `/inbox`
  - API: `/api/inbox`
  - Why: Message hub
  - Week 2: Moves to `/work/inbox`

- **Path:** `/notifications`
  - API: `/api/notifications`
  - Why: Notification center
  - Week 2: Moves to `/work/notifications`

---

### 4. Automation (2 pages)

- **Path:** `/agents`
  - API: `/api/agents`
  - Why: AI agent management
  - Status: ✅ Already connected
  - Week 2: Moves to `/automation/agents`

- **Path:** `/workflows`
  - API: `/api/workflows` (needs creation)
  - Why: Workflow automation
  - Week 2: Moves to `/automation/workflows`

---

### 5. Analytics (6 pages)

- **Path:** `/analytics`
  - API: All `/api/analytics/*`
  - Why: Analytics overview
  - Week 2: Becomes `/insights` with tabs

- **Path:** `/analytics/sales`
  - API: `/api/analytics/sales`
  - Week 2: Becomes `/insights?tab=sales`

- **Path:** `/analytics/marketing`
  - API: `/api/analytics/marketing`
  - Week 2: Becomes `/insights?tab=marketing`

- **Path:** `/analytics/outreach`
  - API: `/api/analytics/outreach`
  - Week 2: Becomes `/insights?tab=outreach`

- **Path:** `/analytics/time-usage`
  - API: `/api/analytics/time-usage`
  - Week 2: Becomes `/insights?tab=time`

- **Path:** `/analytics/usage`
  - API: `/api/analytics/usage`
  - Week 2: Becomes `/insights?tab=usage`

---

### 6. Business (3 pages - added to hit 20 total)

- **Path:** `/invoices`
  - API: `/api/invoices`
  - Why: Billing core
  - Week 2: Stays at `/invoices` or moves to `/crm/invoices`

- **Path:** `/campaigns`
  - API: `/api/campaigns`
  - Why: Marketing campaigns
  - Week 2: Moves to `/outreach/campaigns`

- **Path:** `/emails`
  - API: `/api/emails`
  - Why: Email management
  - Week 2: Moves to `/outreach/emails`

---

## Total: 20 Pages

**Breakdown:**

- Dashboard: 1
- CRM: 4
- Work Items: 4
- Automation: 2
- Analytics: 6
- Business: 3

---

## Week 1 Execution Order

### Day 1-2: Foundation ✅

- [x] Quality gates
- [x] Schema fixes
- [x] Audit API routes
- [x] Document mappings
- [x] Create this list

### Day 3-4: Dashboard & Analytics (7 pages)

- [ ] Dashboard (most complex)
- [ ] Analytics overview
- [ ] Analytics/sales
- [ ] Analytics/marketing
- [ ] Analytics/outreach
- [ ] Analytics/time-usage
- [ ] Analytics/usage

### Day 5-7: CRM Core (4 pages)

- [ ] Customers
- [ ] Contacts
- [ ] Projects
- [ ] Prospects

### Day 8-10: Work Items & Business (7 pages)

- [ ] Tasks
- [ ] Calendar
- [ ] Inbox
- [ ] Notifications
- [ ] Invoices
- [ ] Campaigns
- [ ] Emails

### Automation (2 pages - Parallel work)

- [ ] Workflows (needs API creation first)
- [x] Agents (already done)

---

## Pages NOT in Week 1 (Deferred)

### Week 2/3 Pages:

- Settings (7 pages)
- Admin (5 pages)
- Mobile (12 pages)
- Documents (2 pages)
- Developer tools (3 pages)
- Chat (1 page)
- Utility pages (3 pages)

### Static Pages (Never Connect):

- Documentation (~15 pages)
- Error pages (3 pages)
- Marketing pages (2 pages)
- Onboarding (2 pages)

**Total Deferred:** ~88 pages

---

## Success Criteria (End of Week 1)

- [ ] All 20 pages fetch real data from APIs
- [ ] Zero mock data in these 20 pages
- [ ] Loading states implemented (Spinner component)
- [ ] Error handling with toast notifications
- [ ] All pages tested in browser
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Build: Success
- [ ] Committed & pushed to main

---

## Notes

- **Agents page already done:** Can use as reference pattern
- **Workflows needs API creation:** Block on this early in week
- **Dashboard is most complex:** Allocate 4-6 hours
- **Analytics pages similar:** Can batch convert (copy-paste pattern)
- **CRM pages similar:** Can batch convert (list/detail pattern)

---

**Created:** 2025-10-18  
**For:** Week 1 execution (Days 1-10)  
**Next Update:** Mark items complete as work progresses
