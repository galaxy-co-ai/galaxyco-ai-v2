# Navigation Audit - GalaxyCo.ai 2.0

**Date:** October 19, 2025  
**Purpose:** Audit current navigation structure before Week 2 IA refactor  
**Total Pages:** 106 pages

---

## Current Navigation Structure (Flat)

**Main Sidebar (7 items):**

1. Dashboard → `/dashboard`
2. Agents → `/agents`
3. Sales → `/sales`
4. Time Usage → `/time-usage`
5. Library → `/knowledge`
6. Marketing → `/marketing`
7. Outreach → `/emails`

**Settings:** `/settings` (bottom section)

---

## Complete Route Inventory (106 Pages)

### ✅ Week 1 API-Connected Pages (18 pages)

**Dashboard & Analytics (7 pages):**

- `/dashboard` ✅ Real API
- `/analytics` ✅ Real API
- `/analytics/sales` ✅ Real API
- `/analytics/marketing` ✅ Real API
- `/analytics/outreach` ✅ Real API
- `/analytics/time-usage` ✅ Real API
- `/analytics/usage` ✅ Real API

**CRM Core (4 pages):**

- `/customers` ✅ Real API
- `/contacts` ✅ Real API
- `/projects` ✅ Real API
- `/prospects` ✅ Real API

**Work Items (4 pages):**

- `/tasks` ✅ Real API
- `/calendar` ✅ Real API
- `/inbox` ✅ Real API
- `/notifications` ✅ Real API

**Business Operations (3 pages):**

- `/invoices` ✅ Real API
- `/campaigns` ✅ Real API
- `/emails` ✅ Real API

### Automation & Workflows (7 pages)

- `/agents` - Agent list
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

### CRM & Communication (Extended) (8 pages)

- `/segments` - Customer segments
- `/customers` ✅
- `/contacts` ✅
- `/projects` ✅
- `/prospects` ✅
- `/team` - Team directory
- `/sales` - Sales dashboard
- `/marketing` - Marketing dashboard

### Documents & Knowledge (6 pages)

- `/documents` - Document list
- `/documents/[id]` - Document detail
- `/files/[id]` - File viewer
- `/knowledge` - Knowledge base
- `/templates` - Template library
- `/resources` - Resource center

### Settings & Configuration (13 pages)

- `/settings` - Settings hub
- `/settings/profile` - User profile
- `/settings/team` - Team management
- `/settings/team/invite` - Invite team
- `/settings/workspace` - Workspace settings
- `/settings/billing` - Billing & plans
- `/settings/integrations` - Integrations
- `/settings/api-keys` - API key management
- `/settings/security` - Security settings
- `/settings/security/sessions` - Active sessions
- `/settings/notifications` - Notification preferences
- `/settings/notifications/preferences` - Notification settings

### Admin Portal (4 pages)

- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/workspaces` - Workspace management
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Platform settings

### Support & Help (6 pages)

- `/help` - Help center
- `/help/contact` - Contact support
- `/help/faq` - FAQ
- `/feedback` - User feedback
- `/changelog` - Product changelog
- `/status` - System status

### Developer Tools (7 pages)

- `/api` - API explorer
- `/api-keys` - API key management (duplicate?)
- `/webhooks` - Webhook management
- `/webhooks/test` - Webhook testing
- `/playground` - API playground
- `/integrations` - Integration browser
- `/integrations/[id]` - Integration detail
- `/integrations/browse` - Browse integrations
- `/integrations/new` - Add integration

### Data Management (6 pages)

- `/exports` - Data exports
- `/exports/templates` - Export templates
- `/imports` - Data imports
- `/audit-log` - Audit trail
- `/releases` - Release notes
- `/maintenance` - Maintenance page

### Documentation (6 pages)

- `/docs` - Documentation home
- `/docs/getting-started` - Getting started
- `/docs/api-reference` - API reference
- `/docs/api-reference/[section]` - API section
- `/docs/guides/[slug]` - Guide pages
- `/docs/tutorials` - Tutorials

### Mobile Views (12 pages)

- `/m/dashboard` - Mobile dashboard
- `/m/agents` - Mobile agents
- `/m/calendar` - Mobile calendar
- `/m/chat` - Mobile chat
- `/m/contacts` - Mobile contacts
- `/m/documents` - Mobile documents
- `/m/notifications` - Mobile notifications
- `/m/prospects` - Mobile prospects
- `/m/search` - Mobile search
- `/m/settings` - Mobile settings
- `/m/tasks` - Mobile tasks
- `/m/workflows` - Mobile workflows

### Utility & Secondary (9 pages)

- `/activity` - Activity feed
- `/search` - Global search
- `/chat` - Chat/messaging
- `/outreach` - Outreach hub
- `/time-usage` - Time tracking
- `/usage` - Usage analytics
- `/automations` - Automation hub
- `/design-system` - Design system showcase
- `/onboarding` - Onboarding flow

### Error & Auth (5 pages)

- `/403` - Forbidden
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/` - Root/landing

**Total:** 106 pages

---

## Problems with Current Structure

### 1. Flat Navigation (No Hierarchy)

- All top-level pages compete for attention
- No clear workflow grouping
- Users must remember exact location of each feature

### 2. Inconsistent Naming

- `/knowledge` in sidebar shown as "Library"
- `/emails` in sidebar shown as "Outreach"
- Disconnected labels

### 3. No Central Workflow Hub

- No single "My Work" entry point
- Users jump between scattered pages
- Hard to see "what's next"

### 4. Hidden Features

- 90+ pages not in main navigation
- Settings pages buried
- Admin portal not easily accessible

### 5. Redundant Routes

- `/api-keys` exists at both `/api-keys` AND `/settings/api-keys`
- Multiple integration entry points
- Confusing for users

### 6. Poor Mobile Experience

- 12 separate mobile routes (`/m/*`)
- Duplicates desktop functionality
- Maintenance burden

---

## User Workflow Patterns (Identified)

### Primary Workflows:

1. **Daily Work** - Tasks, Calendar, Inbox, Notifications
2. **Agent Management** - Create, monitor, optimize agents
3. **CRM & Sales** - Manage customers, prospects, projects
4. **Communication** - Emails, campaigns, outreach
5. **Analytics & Insights** - Performance tracking across all areas
6. **Administration** - Team, billing, settings

### Secondary Workflows:

7. **Content & Knowledge** - Documents, templates, resources
8. **Automation** - Workflows, automations, integrations
9. **Developer Tools** - API, webhooks, playground
10. **Support & Learning** - Help, docs, tutorials

---

## Reorganization Needs

### High Priority:

1. ✅ Create `/my-work` hub - Central entry point for daily tasks
2. ✅ Group by workflow, not feature type
3. ✅ Implement nested navigation for complex areas
4. ✅ Consolidate redundant routes
5. ✅ Add breadcrumb navigation for deep pages

### Medium Priority:

6. ⏳ Simplify mobile routes (use responsive design instead)
7. ⏳ Create clear settings hierarchy
8. ⏳ Separate admin from user features

### Low Priority:

9. ⏳ Optimize developer tools section
10. ⏳ Improve documentation navigation

---

## Next Steps

1. Design new IA structure based on workflows
2. Create route mapping (old → new)
3. Implement middleware redirects
4. Update navigation components
5. Migrate pages to new structure
6. Test and verify all routes work

---

**Status:** ✅ Audit complete - Ready for IA design phase
