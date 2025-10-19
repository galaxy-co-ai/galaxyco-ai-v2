# New Information Architecture Design - GalaxyCo.ai 2.0

**Date:** October 19, 2025  
**Week:** 2 of 3 (IA Refactor Sprint)  
**Purpose:** Define new workflow-based navigation structure

---

## Design Principles

1. **Workflow-Centric** - Organize by user task flows, not technical categories
2. **Flat When Possible** - Minimize nesting depth (max 2-3 levels)
3. **Consistent Naming** - Route paths match visible labels
4. **Central Hub** - `/my-work` as primary entry point for daily tasks
5. **Preserve APIs** - All Week 1 API connections maintained

---

## New Navigation Structure

### **Primary Navigation (7 items)**

```
1. My Work        → /my-work          [NEW - Central hub]
2. Agents         → /agents           [Existing]
3. CRM            → /crm              [NEW - Consolidates customers/contacts/projects/prospects]
4. Analytics      → /analytics        [Existing]
5. Library        → /library          [Renamed from /knowledge]
6. Automations    → /automations      [Existing]
7. Settings       → /settings         [Existing]
```

### **Secondary Access (Bottom of sidebar or submenu)**

```
8. Admin          → /admin            [For admin users only]
9. Help           → /help             [Support resources]
10. Developer     → /developer        [API, webhooks, playground]
```

---

## Complete Route Mapping (106 Pages)

### 1. My Work Hub [NEW]

**New Routes:**

- `/my-work` - Central dashboard (tasks, calendar, inbox, notifications aggregated)

**Purpose:** Single starting point for daily work

---

### 2. Agents & Workflows

**Keep as-is:**

- `/agents` - Agent list ✅ Real API
- `/agents/[id]` - Agent detail
- `/agents/[id]/edit` - Agent editor
- `/agents/[id]/logs` - Agent logs
- `/agents/[id]/executions/[executionId]` - Execution detail
- `/agents/new` - Create agent
- `/workflows` - Workflow list
- `/workflows/[id]` - Workflow detail
- `/workflows/[id]/edit` - Workflow editor
- `/workflows/[id]/runs` - Workflow runs
- `/workflows/new` - Create workflow

---

### 3. CRM [NEW SECTION]

**New grouped routes:**

- `/crm` - CRM dashboard (overview)
- `/crm/customers` - Customer list ✅ Real API (was `/customers`)
- `/crm/contacts` - Contact list ✅ Real API (was `/contacts`)
- `/crm/projects` - Project list ✅ Real API (was `/projects`)
- `/crm/prospects` - Prospect list ✅ Real API (was `/prospects`)
- `/crm/segments` - Customer segments (was `/segments`)

**Redirects needed:**

- `/customers` → `/crm/customers`
- `/contacts` → `/crm/contacts`
- `/projects` → `/crm/projects`
- `/prospects` → `/crm/prospects`
- `/segments` → `/crm/segments`

---

### 4. Analytics & Reporting

**Keep as-is:**

- `/analytics` - Analytics overview ✅ Real API
- `/analytics/sales` - Sales analytics ✅ Real API
- `/analytics/marketing` - Marketing analytics ✅ Real API
- `/analytics/outreach` - Outreach analytics ✅ Real API
- `/analytics/time-usage` - Time tracking analytics ✅ Real API
- `/analytics/usage` - Platform usage analytics ✅ Real API
- `/analytics/conversions` - Conversion analytics
- `/analytics/engagement` - Engagement analytics

**Merge into Analytics:**

- `/sales` → `/analytics/sales` (already exists, redirect)
- `/marketing` → `/analytics/marketing` (already exists, redirect)
- `/outreach` → `/analytics/outreach` (already exists, redirect)
- `/time-usage` → `/analytics/time-usage` (already exists, redirect)
- `/usage` → `/analytics/usage` (already exists, redirect)

**Redirects needed:**

- `/sales` → `/analytics/sales`
- `/marketing` → `/analytics/marketing`
- `/outreach` → `/analytics/outreach`
- `/time-usage` → `/analytics/time-usage`
- `/usage` → `/analytics/usage`

---

### 5. Library (Knowledge & Content)

**New grouped routes:**

- `/library` - Library home (was `/knowledge`)
- `/library/documents` - Document list (was `/documents`)
- `/library/documents/[id]` - Document detail (was `/documents/[id]`)
- `/library/files/[id]` - File viewer (was `/files/[id]`)
- `/library/templates` - Template library (was `/templates`)
- `/library/resources` - Resource center (was `/resources`)

**Redirects needed:**

- `/knowledge` → `/library`
- `/documents` → `/library/documents`
- `/documents/[id]` → `/library/documents/[id]`
- `/files/[id]` → `/library/files/[id]`
- `/templates` → `/library/templates`
- `/resources` → `/library/resources`

---

### 6. Automations

**Keep top-level route, consolidate related:**

- `/automations` - Automation hub
- `/automations/workflows` - Workflow list (keep `/workflows` as alias)
- `/automations/integrations` - Integration browser (was `/integrations`)
- `/automations/integrations/[id]` - Integration detail (was `/integrations/[id]`)
- `/automations/integrations/browse` - Browse integrations (was `/integrations/browse`)
- `/automations/integrations/new` - Add integration (was `/integrations/new`)

**Redirects needed:**

- `/integrations` → `/automations/integrations`
- `/integrations/[id]` → `/automations/integrations/[id]`
- `/integrations/browse` → `/automations/integrations/browse`
- `/integrations/new` → `/automations/integrations/new`

---

### 7. Work Items (Components of My Work)

**Keep as standalone, also show in My Work hub:**

- `/tasks` - Task list ✅ Real API
- `/calendar` - Calendar view ✅ Real API
- `/inbox` - Inbox ✅ Real API
- `/notifications` - Notifications ✅ Real API
- `/activity` - Activity feed

---

### 8. Business Operations

**New grouped routes:**

- `/business` - Business dashboard
- `/business/invoices` - Invoice list ✅ Real API (was `/invoices`)
- `/business/campaigns` - Campaign list ✅ Real API (was `/campaigns`)
- `/business/emails` - Email threads ✅ Real API (was `/emails`)

**Redirects needed:**

- `/invoices` → `/business/invoices`
- `/campaigns` → `/business/campaigns`
- `/emails` → `/business/emails`

---

### 9. Settings & Configuration

**Keep hierarchy as-is:**

- `/settings` - Settings hub
- `/settings/profile` - User profile
- `/settings/team` - Team management
- `/settings/team/invite` - Invite team
- `/settings/workspace` - Workspace settings
- `/settings/billing` - Billing & plans
- `/settings/integrations` - Integration settings (keep separate from automations)
- `/settings/api-keys` - API key management
- `/settings/security` - Security settings
- `/settings/security/sessions` - Active sessions
- `/settings/notifications` - Notification preferences
- `/settings/notifications/preferences` - Notification settings

**Consolidate duplicate:**

- `/api-keys` → `/settings/api-keys` (redirect)

---

### 10. Admin Portal

**Keep as-is (role-gated):**

- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/workspaces` - Workspace management
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Platform settings

---

### 11. Developer Tools

**New grouped section:**

- `/developer` - Developer hub
- `/developer/api` - API explorer (was `/api`)
- `/developer/api-keys` - API keys (alias to `/settings/api-keys`)
- `/developer/webhooks` - Webhook management (was `/webhooks`)
- `/developer/webhooks/test` - Webhook testing (was `/webhooks/test`)
- `/developer/playground` - API playground (was `/playground`)

**Redirects needed:**

- `/api` → `/developer/api`
- `/webhooks` → `/developer/webhooks`
- `/webhooks/test` → `/developer/webhooks/test`
- `/playground` → `/developer/playground`

---

### 12. Data Management

**New grouped routes:**

- `/data` - Data management hub
- `/data/exports` - Data exports (was `/exports`)
- `/data/exports/templates` - Export templates (was `/exports/templates`)
- `/data/imports` - Data imports (was `/imports`)
- `/data/audit-log` - Audit trail (was `/audit-log`)

**Redirects needed:**

- `/exports` → `/data/exports`
- `/exports/templates` → `/data/exports/templates`
- `/imports` → `/data/imports`
- `/audit-log` → `/data/audit-log`

---

### 13. Support & Help

**Keep as-is:**

- `/help` - Help center
- `/help/contact` - Contact support
- `/help/faq` - FAQ
- `/feedback` - User feedback
- `/changelog` - Product changelog
- `/status` - System status
- `/releases` - Release notes

---

### 14. Documentation

**Keep as-is:**

- `/docs` - Documentation home
- `/docs/getting-started` - Getting started
- `/docs/api-reference` - API reference
- `/docs/api-reference/[section]` - API section
- `/docs/guides/[slug]` - Guide pages
- `/docs/tutorials` - Tutorials

---

### 15. Communication

**Keep standalone:**

- `/chat` - Chat/messaging
- `/search` - Global search

---

### 16. Mobile Views

**DECISION: Deprecate mobile-specific routes, use responsive design**

All `/m/*` routes will redirect to their desktop equivalents:

- `/m/dashboard` → `/dashboard`
- `/m/agents` → `/agents`
- `/m/calendar` → `/calendar`
- `/m/chat` → `/chat`
- `/m/contacts` → `/crm/contacts`
- `/m/documents` → `/library/documents`
- `/m/notifications` → `/notifications`
- `/m/prospects` → `/crm/prospects`
- `/m/search` → `/search`
- `/m/settings` → `/settings`
- `/m/tasks` → `/tasks`
- `/m/workflows` → `/workflows`

---

### 17. Utility Pages

**Keep as-is:**

- `/dashboard` - Main dashboard ✅ Real API
- `/onboarding` - Onboarding flow
- `/design-system` - Design system showcase
- `/maintenance` - Maintenance page

---

### 18. Error & Auth

**Keep as-is:**

- `/403` - Forbidden
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/` - Root/landing

---

## Navigation Hierarchy Summary

```
Primary Navigation (Sidebar):
├── My Work          /my-work (NEW)
├── Agents           /agents
├── CRM              /crm (NEW GROUP)
│   ├── Customers    /crm/customers
│   ├── Contacts     /crm/contacts
│   ├── Projects     /crm/projects
│   ├── Prospects    /crm/prospects
│   └── Segments     /crm/segments
├── Analytics        /analytics
│   ├── Sales        /analytics/sales
│   ├── Marketing    /analytics/marketing
│   ├── Outreach     /analytics/outreach
│   ├── Time Usage   /analytics/time-usage
│   └── Usage        /analytics/usage
├── Library          /library (RENAMED)
│   ├── Documents    /library/documents
│   ├── Templates    /library/templates
│   └── Resources    /library/resources
├── Automations      /automations
│   ├── Workflows    /workflows (alias)
│   └── Integrations /automations/integrations
└── Settings         /settings
    ├── Profile      /settings/profile
    ├── Team         /settings/team
    ├── Billing      /settings/billing
    └── Security     /settings/security

Secondary Navigation (Bottom/Menu):
├── Admin            /admin
├── Help             /help
└── Developer        /developer
    ├── API          /developer/api
    ├── Webhooks     /developer/webhooks
    └── Playground   /developer/playground
```

---

## Redirect Mapping (42 Redirects)

### CRM Consolidation (5 redirects)

1. `/customers` → `/crm/customers`
2. `/contacts` → `/crm/contacts`
3. `/projects` → `/crm/projects`
4. `/prospects` → `/crm/prospects`
5. `/segments` → `/crm/segments`

### Analytics Consolidation (5 redirects)

6. `/sales` → `/analytics/sales`
7. `/marketing` → `/analytics/marketing`
8. `/outreach` → `/analytics/outreach`
9. `/time-usage` → `/analytics/time-usage`
10. `/usage` → `/analytics/usage`

### Library Consolidation (6 redirects)

11. `/knowledge` → `/library`
12. `/documents` → `/library/documents`
13. `/documents/[id]` → `/library/documents/[id]`
14. `/files/[id]` → `/library/files/[id]`
15. `/templates` → `/library/templates`
16. `/resources` → `/library/resources`

### Business Consolidation (3 redirects)

17. `/invoices` → `/business/invoices`
18. `/campaigns` → `/business/campaigns`
19. `/emails` → `/business/emails`

### Developer Consolidation (4 redirects)

20. `/api` → `/developer/api`
21. `/webhooks` → `/developer/webhooks`
22. `/webhooks/test` → `/developer/webhooks/test`
23. `/playground` → `/developer/playground`

### Automations Consolidation (4 redirects)

24. `/integrations` → `/automations/integrations`
25. `/integrations/[id]` → `/automations/integrations/[id]`
26. `/integrations/browse` → `/automations/integrations/browse`
27. `/integrations/new` → `/automations/integrations/new`

### Data Management (4 redirects)

28. `/exports` → `/data/exports`
29. `/exports/templates` → `/data/exports/templates`
30. `/imports` → `/data/imports`
31. `/audit-log` → `/data/audit-log`

### Settings Consolidation (1 redirect)

32. `/api-keys` → `/settings/api-keys`

### Mobile Deprecation (10 redirects)

33. `/m/dashboard` → `/dashboard`
34. `/m/agents` → `/agents`
35. `/m/calendar` → `/calendar`
36. `/m/chat` → `/chat`
37. `/m/contacts` → `/crm/contacts`
38. `/m/documents` → `/library/documents`
39. `/m/notifications` → `/notifications`
40. `/m/prospects` → `/crm/prospects`
41. `/m/search` → `/search`
42. `/m/settings` → `/settings`
43. `/m/tasks` → `/tasks`
44. `/m/workflows` → `/workflows`

**Total Redirects:** 44

---

## Implementation Strategy

### Phase 1: Implement Redirects (Week 2, Day 1)

- Create middleware with all 44 redirects
- Test redirect functionality
- Add logging for monitoring

### Phase 2: Update Navigation (Week 2, Day 1)

- Update sidebar component with new structure
- Add collapsible sections for grouped items
- Test navigation on mobile and desktop

### Phase 3: Create New Grouped Pages (Week 2, Day 2-3)

- `/my-work` - My Work Hub
- `/crm` - CRM Dashboard
- `/library` - Library Home
- `/business` - Business Dashboard
- `/developer` - Developer Hub
- `/data` - Data Management Hub

### Phase 4: Move Existing Pages (Week 2, Day 3-4)

- Move CRM pages to `/crm/*`
- Move Library pages to `/library/*`
- Move Business pages to `/business/*`
- Move Developer pages to `/developer/*`
- Move Data pages to `/data/*`

### Phase 5: Testing & Verification (Week 2, Day 5)

- Test all redirects work
- Verify all API connections maintained
- Test navigation flows
- Run TypeScript/build checks
- Update documentation

---

## Benefits of New Structure

1. **✅ Clearer Mental Model** - Grouped by workflow, not scattered
2. **✅ Easier Discovery** - Related features together
3. **✅ Scalable** - Easy to add new pages to groups
4. **✅ Consistent** - Predictable URL patterns
5. **✅ Preserves Work** - All Week 1 API connections maintained
6. **✅ Backward Compatible** - Old URLs still work via redirects

---

**Status:** ✅ IA Design complete - Ready for implementation
