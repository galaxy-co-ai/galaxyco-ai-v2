# Route → Page Mapping

**Purpose:** Map API routes to UI pages for Phase 3 integration  
**Status:** Foundation for Week 1-3 work  
**Last Updated:** 2025-10-18

---

## Week 1: Core Pages (20 pages - KEEP & CONNECT)

### Dashboard

| Page         | API Route(s)                      | Priority    | Status  |
| ------------ | --------------------------------- | ----------- | ------- |
| `/dashboard` | `/api/agents`, `/api/analytics/*` | 🔴 Critical | ⏭️ Next |

### CRM Core (4 pages)

| Page         | API Route(s)     | Priority    | Status    |
| ------------ | ---------------- | ----------- | --------- |
| `/customers` | `/api/customers` | 🔴 Critical | ⏸️ Week 1 |
| `/contacts`  | `/api/contacts`  | 🔴 Critical | ⏸️ Week 1 |
| `/projects`  | `/api/projects`  | 🔴 Critical | ⏸️ Week 1 |
| `/prospects` | `/api/prospects` | 🔴 Critical | ⏸️ Week 1 |

### Work Items (4 pages - will move to `/work` in Week 2)

| Page             | API Route(s)         | Priority    | Status    |
| ---------------- | -------------------- | ----------- | --------- |
| `/tasks`         | `/api/tasks`         | 🔴 Critical | ⏸️ Week 1 |
| `/calendar`      | `/api/calendar`      | 🔴 Critical | ⏸️ Week 1 |
| `/inbox`         | `/api/inbox`         | 🔴 Critical | ⏸️ Week 1 |
| `/notifications` | `/api/notifications` | 🔴 Critical | ⏸️ Week 1 |

### Automation (2 pages - will move to `/automation` in Week 2)

| Page         | API Route(s)                      | Priority    | Status    |
| ------------ | --------------------------------- | ----------- | --------- |
| `/agents`    | `/api/agents`                     | 🔴 Critical | ✅ Done   |
| `/workflows` | `/api/workflows` (needs creation) | 🔴 Critical | ⏸️ Week 1 |

### Analytics (6 pages - will consolidate to `/insights` in Week 2)

| Page                    | API Route(s)                | Priority | Status    |
| ----------------------- | --------------------------- | -------- | --------- |
| `/analytics`            | All `/api/analytics/*`      | 🟡 High  | ⏸️ Week 1 |
| `/analytics/sales`      | `/api/analytics/sales`      | 🟡 High  | ⏸️ Week 1 |
| `/analytics/marketing`  | `/api/analytics/marketing`  | 🟡 High  | ⏸️ Week 1 |
| `/analytics/outreach`   | `/api/analytics/outreach`   | 🟡 High  | ⏸️ Week 1 |
| `/analytics/time-usage` | `/api/analytics/time-usage` | 🟡 High  | ⏸️ Week 1 |
| `/analytics/usage`      | `/api/analytics/usage`      | 🟡 High  | ⏸️ Week 1 |

---

## Week 2: Navigation Refactor (Will Move Pages)

### New Structure Created in Week 2

#### `/work` hub (5 tabs)

- Approvals (new stub)
- Tasks (moved from `/tasks`)
- Calendar (moved from `/calendar`)
- Inbox (moved from `/inbox`)
- Meetings (new stub for Week 4+)

#### `/automation` hub (4 tabs)

- Agents (moved from `/agents`)
- Workflows (moved from `/workflows`)
- Templates (new stub)
- Transcriptions (new stub for Week 4+)

#### `/insights` hub

- Consolidates all `/analytics/*` pages into tabs

#### `/outreach` hub

- Emails
- Campaigns

#### `/crm` hub

- Customers
- Contacts
- Prospects
- Projects

---

## Week 3: Remaining Pages (60 pages)

### Settings (7 pages)

| Page                      | API Route(s)                      | Priority  | Status    |
| ------------------------- | --------------------------------- | --------- | --------- |
| `/settings/profile`       | `/api/users/me`                   | 🟡 High   | ⏸️ Week 3 |
| `/settings/workspace`     | `/api/workspaces/current`         | 🟡 High   | ⏸️ Week 3 |
| `/settings/team`          | `/api/workspaces/current/members` | 🟡 High   | ⏸️ Week 3 |
| `/settings/billing`       | Stripe integration (stub)         | 🟢 Medium | ⏸️ Week 3 |
| `/settings/integrations`  | `/api/integrations`               | 🟢 Medium | ⏸️ Week 3 |
| `/settings/security`      | Workspace security                | 🟢 Medium | ⏸️ Week 3 |
| `/settings/notifications` | User preferences                  | 🟢 Medium | ⏸️ Week 3 |

### Admin (5 pages)

| Page                | API Route(s)            | Priority  | Status    |
| ------------------- | ----------------------- | --------- | --------- |
| `/admin`            | Aggregate admin view    | 🟡 High   | ⏸️ Week 3 |
| `/admin/users`      | `/api/admin/users`      | 🟡 High   | ⏸️ Week 3 |
| `/admin/workspaces` | `/api/admin/workspaces` | 🟡 High   | ⏸️ Week 3 |
| `/admin/analytics`  | `/api/admin/analytics`  | 🟢 Medium | ⏸️ Week 3 |
| `/admin/settings`   | `/api/admin/settings`   | 🟢 Medium | ⏸️ Week 3 |

### Communication (2 pages)

| Page                                    | API Route(s)  | Priority  | Status    |
| --------------------------------------- | ------------- | --------- | --------- |
| `/chat`                                 | `/api/chat`   | 🟢 Medium | ⏸️ Week 3 |
| `/emails` (moves to `/outreach/emails`) | `/api/emails` | 🟡 High   | ⏸️ Week 3 |

### Business (2 pages)

| Page                                          | API Route(s)     | Priority | Status    |
| --------------------------------------------- | ---------------- | -------- | --------- |
| `/invoices`                                   | `/api/invoices`  | 🟡 High  | ⏸️ Week 3 |
| `/campaigns` (moves to `/outreach/campaigns`) | `/api/campaigns` | 🟡 High  | ⏸️ Week 3 |

### Developer Tools (3 pages)

| Page          | API Route(s)      | Priority  | Status    |
| ------------- | ----------------- | --------- | --------- |
| `/webhooks`   | `/api/webhooks`   | 🟢 Medium | ⏸️ Week 3 |
| `/audit-log`  | `/api/audit-log`  | 🟢 Medium | ⏸️ Week 3 |
| `/playground` | `/api/playground` | 🟢 Medium | ⏸️ Week 3 |

### Mobile Pages (12 pages)

| Page               | API Route(s)                | Priority  | Status    |
| ------------------ | --------------------------- | --------- | --------- |
| `/m/dashboard`     | Reuse desktop APIs          | 🟢 Medium | ⏸️ Week 3 |
| `/m/agents`        | `/api/agents`               | 🟢 Medium | ⏸️ Week 3 |
| `/m/notifications` | `/api/notifications`        | 🟢 Medium | ⏸️ Week 3 |
| `/m/tasks`         | `/api/tasks`                | 🟢 Medium | ⏸️ Week 3 |
| `/m/contacts`      | `/api/contacts`             | 🟢 Medium | ⏸️ Week 3 |
| `/m/calendar`      | `/api/calendar`             | 🟢 Medium | ⏸️ Week 3 |
| `/m/chat`          | `/api/chat`                 | 🟢 Medium | ⏸️ Week 3 |
| `/m/search`        | Search API (needs creation) | 🟢 Medium | ⏸️ Week 3 |
| `/m/settings`      | Reuse settings APIs         | 🟢 Medium | ⏸️ Week 3 |
| `/m/workflows`     | `/api/workflows`            | 🟢 Medium | ⏸️ Week 3 |
| `/m/prospects`     | `/api/prospects`            | 🟢 Medium | ⏸️ Week 3 |
| `/m/documents`     | `/api/documents`            | 🟢 Medium | ⏸️ Week 3 |

### Documents (2 pages)

| Page         | API Route(s)       | Priority  | Status    |
| ------------ | ------------------ | --------- | --------- |
| `/documents` | `/api/documents`   | 🟢 Medium | ⏸️ Week 3 |
| `/knowledge` | Knowledge base API | 🟢 Medium | ⏸️ Week 3 |

### Utility (3 pages)

| Page        | API Route(s)                     | Priority  | Status    |
| ----------- | -------------------------------- | --------- | --------- |
| `/activity` | `/api/activity` (needs creation) | ⚪ Low    | ⏸️ Week 3 |
| `/search`   | Search API (needs creation)      | 🟢 Medium | ⏸️ Week 3 |
| `/reports`  | `/api/reports`                   | 🟢 Medium | ⏸️ Week 3 |

---

## Static Pages (No API Connection Needed)

### Documentation (~15 pages)

- `/docs/*` - All documentation pages
- `/help/*` - Help center pages
- `/resources/*` - Resource library

### Error Pages (3 pages)

- `/403` - Forbidden
- `/404` - Not Found
- `/500` - Server Error

### Marketing (2 pages)

- `/changelog` - Product changelog
- `/status` - System status page

### Onboarding (2 pages)

- `/onboarding` - User onboarding flow
- `/design-system` - Design system showcase

---

## API Routes Needing Creation

| Route                 | Purpose             | Week   | Priority    |
| --------------------- | ------------------- | ------ | ----------- |
| `/api/workflows`      | Workflow management | Week 1 | 🔴 Critical |
| `/api/workflows/[id]` | Individual workflow | Week 1 | 🔴 Critical |
| `/api/search`         | Global search       | Week 3 | 🟢 Medium   |
| `/api/activity`       | Activity feed       | Week 3 | ⚪ Low      |

---

## Summary

- **Total Pages:** 108
- **Week 1 (Connect):** 20 pages
- **Week 2 (Move):** Same 20 pages to new structure
- **Week 3 (Connect):** ~40 additional dynamic pages
- **Static (Skip):** ~30 pages (docs, help, errors)

---

**Created:** 2025-10-18  
**Next Update:** After Week 1 completion
