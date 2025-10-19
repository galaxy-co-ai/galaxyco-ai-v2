# Remaining Pages to Convert from Mock → Real APIs

**Date**: 2025-10-19  
**Status**: Phase 3 Complete, Phase 4 Starting

## ✅ Already Converted (30+ pages)

- Dashboard
- Analytics (6 pages: overview, sales, marketing, outreach, time-usage, usage)
- CRM Core (4 pages: customers, contacts, projects, prospects)
- Work Items (4 pages: tasks, calendar, inbox, notifications)
- Business (3 pages: invoices, campaigns, emails)
- Agents (1 page: agents list)
- Settings (7 pages: profile, notifications, team, workspace, billing, integrations, security)
- Admin (5 pages: dashboard, users, workspaces, settings, analytics)

## 🎯 Priority 1: Core Feature Pages with APIs (15 pages)

### Agent Management (5 pages)

- [ ] agents/[id]/page.tsx - Agent detail view
- [ ] agents/[id]/edit/page.tsx - Edit agent
- [ ] agents/[id]/logs/page.tsx - Agent execution logs
- [ ] agents/[id]/executions/[executionId]/page.tsx - Specific execution details
- [ ] agents/new/page.tsx - Create new agent

### Library/Knowledge Base (5 pages)

- [ ] library/page.tsx - Library hub
- [ ] library/documents/page.tsx - Documents list
- [ ] library/documents/[id]/page.tsx - Document detail
- [ ] library/resources/page.tsx - Resources list
- [ ] library/templates/page.tsx - Templates list

### Integrations (4 pages)

- [ ] integrations/page.tsx - Integrations hub
- [ ] integrations/[id]/page.tsx - Integration detail
- [ ] integrations/browse/page.tsx - Browse available integrations
- [ ] integrations/new/page.tsx - Add new integration

### CRM (1 page)

- [ ] crm/segments/page.tsx - Customer segments

## 🎯 Priority 2: Important Feature Pages (13 pages)

### Workflows (5 pages)

- [ ] workflows/page.tsx - Workflows list
- [ ] workflows/[id]/page.tsx - Workflow detail
- [ ] workflows/[id]/edit/page.tsx - Edit workflow
- [ ] workflows/[id]/runs/page.tsx - Workflow runs history
- [ ] workflows/new/page.tsx - Create new workflow

### Data Management (5 pages)

- [ ] data/page.tsx - Data hub
- [ ] data/audit-log/page.tsx - System audit log
- [ ] data/exports/page.tsx - Data exports
- [ ] data/exports/templates/page.tsx - Export templates
- [ ] data/imports/page.tsx - Data imports

### Analytics (2 pages)

- [ ] analytics/conversions/page.tsx - Conversion analytics
- [ ] analytics/engagement/page.tsx - Engagement analytics

### Automations (1 page)

- [ ] automations/page.tsx - Automations hub

## 🎯 Priority 3: Developer & Secondary Pages (18 pages)

### Developer Tools (5 pages)

- [ ] developer/page.tsx - Developer hub
- [ ] developer/api/page.tsx - API documentation
- [ ] developer/playground/page.tsx - API playground
- [ ] developer/webhooks/page.tsx - Webhooks management
- [ ] developer/webhooks/test/page.tsx - Webhook testing

### Billing (3 pages)

- [ ] billing/page.tsx - Billing overview
- [ ] billing/invoices/page.tsx - Invoice history
- [ ] billing/payment-methods/page.tsx - Payment methods

### Misc Feature Pages (10 pages)

- [ ] activity/page.tsx - Activity feed
- [ ] api-keys/page.tsx - API keys management
- [ ] chat/page.tsx - Chat interface
- [ ] my-work/page.tsx - My work dashboard (may be done)
- [ ] team/page.tsx - Team management
- [ ] search/page.tsx - Global search
- [ ] reports/page.tsx - Reports hub
- [ ] marketplace/page.tsx - App marketplace
- [ ] files/[id]/page.tsx - File viewer
- [ ] onboarding/page.tsx - User onboarding

## 🎯 Priority 4: Hub/Navigation Pages (3 pages)

- [ ] business/page.tsx - Business hub
- [ ] crm/page.tsx - CRM hub
- [ ] settings/page.tsx - Settings hub

## 🎯 Priority 5: Help & Documentation (8 pages)

- [ ] docs/page.tsx - Documentation home
- [ ] docs/getting-started/page.tsx - Getting started guide
- [ ] docs/api-reference/page.tsx - API reference
- [ ] docs/tutorials/page.tsx - Tutorials
- [ ] help/page.tsx - Help center
- [ ] help/faq/page.tsx - FAQ
- [ ] help/contact/page.tsx - Contact support
- [ ] feedback/page.tsx - User feedback

## 🎯 Priority 6: Utility Pages (6 pages)

- [ ] 403/page.tsx - Forbidden error
- [ ] changelog/page.tsx - Product changelog
- [ ] design-system/page.tsx - Design system showcase
- [ ] maintenance/page.tsx - Maintenance mode
- [ ] releases/page.tsx - Release notes
- [ ] status/page.tsx - System status

## 🎯 Priority 7: Mobile Pages (12 pages - lower priority duplicates)

- [ ] m/agents/page.tsx
- [ ] m/calendar/page.tsx
- [ ] m/chat/page.tsx
- [ ] m/contacts/page.tsx
- [ ] m/dashboard/page.tsx
- [ ] m/documents/page.tsx
- [ ] m/notifications/page.tsx
- [ ] m/prospects/page.tsx
- [ ] m/search/page.tsx
- [ ] m/settings/page.tsx
- [ ] m/tasks/page.tsx
- [ ] m/workflows/page.tsx

---

## Summary

- **Total Remaining**: ~75 pages
- **Priority 1-3**: ~46 pages (core features)
- **Priority 4-7**: ~29 pages (hubs, docs, utilities)

## Conversion Strategy

1. Start with Priority 1 (Agent Management + Library + Integrations)
2. Move to Priority 2 (Workflows + Data + Analytics)
3. Complete Priority 3 (Developer + Billing)
4. Hub pages last (they aggregate already-converted pages)
5. Defer mobile pages until main pages complete
6. Defer docs/help pages (mostly static content)
