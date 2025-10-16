# Information Architecture - Complete Site Map

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Total Pages:** 100  
**Navigation Levels:** 3  
**Status:** Ready for Implementation

---

## Navigation Hierarchy

### Primary Navigation (Top-Level)
1. **Dashboard** (Home)
2. **Agents** (Build & Manage)
3. **Prospects** (CRM)
4. **Emails** (Outreach)
5. **Reports** (Analytics)
6. **Resources** (Learning)
7. **Settings** (Configuration)

### Secondary Navigation (Within Sections)
- Tabs within detail pages
- Sidebar filters on list pages
- Contextual actions on cards

### Tertiary Navigation (Utility)
- User menu (top-right)
- Notifications (top-right)
- Command palette (⌘K)
- Help/Support (bottom-right)

---

## URL Structure Convention

```
/{section}/{action}/{id?}/{tab?}

Examples:
/agents                      → List view
/agents/new                  → Create new
/agents/abc123               → Detail view
/agents/abc123/settings      → Settings tab
/agents/abc123/analytics     → Analytics tab
```

---

## Complete Page Map (100 Pages)

### 🏠 Dashboard & Home (8 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 1 | `/` or `/dashboard` | Dashboard | Main dashboard with KPIs |
| 2 | `/sales` | Dashboard | Sales pipeline dashboard |
| 3 | `/time-usage` | Dashboard | Time tracking analytics |
| 4 | `/marketing` | Dashboard | Marketing performance |
| 5 | `/outreach` | Dashboard | Outreach campaign metrics |
| 6 | `/analytics` | Dashboard | Custom analytics builder |
| 7 | `/admin` | Dashboard | Admin overview dashboard |
| 8 | `/reports` | Dashboard | Saved reports list |

---

### 🤖 Agents (18 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 9 | `/agents` | List+Filters | All agents grid/list |
| 10 | `/agents/new` | Form/Wizard | Create new agent wizard |
| 11 | `/agents/[id]` | Detail/Editor | Agent overview tab |
| 12 | `/agents/[id]/overview` | Detail/Editor | Agent details |
| 13 | `/agents/[id]/settings` | Detail/Editor | Agent configuration |
| 14 | `/agents/[id]/analytics` | Detail/Editor | Agent performance |
| 15 | `/agents/[id]/logs` | Detail/Editor | Execution logs |
| 16 | `/agents/[id]/test` | Form/Wizard | Test agent with data |
| 17 | `/workflows` | List+Filters | Workflow templates |
| 18 | `/workflows/new` | Form/Wizard | Create workflow |
| 19 | `/workflows/[id]` | Detail/Editor | Workflow builder |
| 20 | `/workflows/[id]/overview` | Detail/Editor | Workflow details |
| 21 | `/workflows/[id]/settings` | Detail/Editor | Workflow config |
| 22 | `/workflows/[id]/analytics` | Detail/Editor | Workflow metrics |
| 23 | `/templates` | List+Filters | Agent templates |
| 24 | `/templates/[category]` | List+Filters | Category filtered |
| 25 | `/templates/[id]` | Detail/Editor | Template preview |
| 26 | `/templates/[id]/use` | Form/Wizard | Customize template |

---

### 🏪 Marketplace (5 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 27 | `/marketplace` | List+Filters | All marketplace packs |
| 28 | `/marketplace/categories/[category]` | Search/Results | Category browse |
| 29 | `/marketplace/[packId]` | Detail/Editor | Pack details |
| 30 | `/marketplace/[packId]/install` | Form/Wizard | Install & configure |
| 31 | `/marketplace/my-purchases` | List+Filters | Purchased packs |

---

### 👤 Prospects (CRM) (10 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 32 | `/prospects` | List+Filters | All prospects |
| 33 | `/prospects/new` | Form/Wizard | Add prospect manually |
| 34 | `/prospects/import` | Form/Wizard | Import CSV |
| 35 | `/prospects/[id]` | Detail/Editor | Prospect profile |
| 36 | `/prospects/[id]/overview` | Detail/Editor | Contact info |
| 37 | `/prospects/[id]/activity` | Detail/Editor | Activity timeline |
| 38 | `/prospects/[id]/emails` | Detail/Editor | Email history |
| 39 | `/prospects/[id]/notes` | Detail/Editor | Notes & tasks |
| 40 | `/prospects/segments` | List+Filters | Prospect segments |
| 41 | `/prospects/segments/[id]` | Detail/Editor | Segment details |

---

### ✉️ Emails (10 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 42 | `/emails` | List+Filters | All emails (unified) |
| 43 | `/emails/inbox` | List+Filters | Inbox view |
| 44 | `/emails/sent` | List+Filters | Sent emails |
| 45 | `/emails/campaigns` | List+Filters | Email campaigns |
| 46 | `/emails/campaigns/new` | Form/Wizard | Create campaign |
| 47 | `/emails/campaigns/[id]` | Detail/Editor | Campaign details |
| 48 | `/emails/campaigns/[id]/analytics` | Detail/Editor | Campaign metrics |
| 49 | `/emails/templates` | List+Filters | Email templates |
| 50 | `/emails/templates/[id]` | Detail/Editor | Template editor |
| 51 | `/emails/compose` | Form/Wizard | Compose new email |

---

### 📊 Reports (7 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 52 | `/reports` | List+Filters | Saved reports |
| 53 | `/reports/new` | Form/Wizard | Create custom report |
| 54 | `/reports/[reportId]` | Detail/Editor | Report viewer |
| 55 | `/reports/[reportId]/edit` | Form/Wizard | Edit report config |
| 56 | `/reports/[reportId]/share` | Modal | Share settings |
| 57 | `/reports/scheduled` | List+Filters | Scheduled reports |
| 58 | `/reports/templates` | List+Filters | Report templates |

---

### 🔗 Integrations (5 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 59 | `/integrations` | List+Filters | All integrations |
| 60 | `/integrations/[provider]` | Detail/Editor | Integration details |
| 61 | `/integrations/[provider]/connect` | Form/Wizard | OAuth flow |
| 62 | `/integrations/[provider]/settings` | Settings | Integration config |
| 63 | `/integrations/webhooks` | List+Filters | Webhook endpoints |

---

### 📚 Resources & Learning (10 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 64 | `/resources` | Content Hub | Resource library landing |
| 65 | `/docs` | Content Hub | Documentation home |
| 66 | `/docs/[category]` | List+Filters | Category docs |
| 67 | `/docs/[category]/[slug]` | Documentation | Article view |
| 68 | `/templates` | Content Hub | Template library |
| 69 | `/university` | Content Hub | Learning center |
| 70 | `/university/courses` | List+Filters | Course catalog |
| 71 | `/university/courses/[courseId]` | Documentation | Course content |
| 72 | `/help` | Search/Results | Help center |
| 73 | `/help/articles/[id]` | Documentation | Help article |

---

### ⚙️ Settings (15 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 74 | `/settings` | Settings | Account settings (redirect) |
| 75 | `/settings/profile` | Settings | User profile |
| 76 | `/settings/account` | Settings | Account details |
| 77 | `/settings/security` | Settings | Password & 2FA |
| 78 | `/settings/notifications` | Settings | Notification prefs |
| 79 | `/settings/appearance` | Settings | Theme & display |
| 80 | `/settings/integrations` | Settings | Connected apps |
| 81 | `/billing` | Settings | Billing overview |
| 82 | `/billing/subscription` | Settings | Plan & subscription |
| 83 | `/billing/payment-methods` | Settings | Cards & payment |
| 84 | `/billing/invoices` | List+Filters | Invoice history |
| 85 | `/admin/team` | Settings | Team members |
| 86 | `/admin/roles` | Settings | Role permissions |
| 87 | `/admin/audit-log` | List+Filters | Audit trail |
| 88 | `/admin/api-keys` | Settings | API key management |

---

### 🔔 Notifications & Activity (2 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 89 | `/notifications` | Notification Center | All notifications |
| 90 | `/activity` | Notification Center | Activity timeline |

---

### 🆘 Support (3 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 91 | `/support` | Content Hub | Support center |
| 92 | `/support/tickets` | List+Filters | Support tickets |
| 93 | `/support/tickets/new` | Form/Wizard | Create ticket |

---

### 🔍 Search & Discovery (3 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 94 | `/search` | Search/Results | Global search |
| 95 | `/help/search` | Search/Results | Help search |
| 96 | `/marketplace/categories/[category]` | Search/Results | Marketplace search |

---

### 🔐 Authentication (5 pages)

| # | Path | Template | Description |
|---|------|----------|-------------|
| 97 | `/login` | Authentication | Sign in |
| 98 | `/signup` | Authentication | Create account |
| 99 | `/verify-email` | Authentication | Email verification |
| 100 | `/forgot-password` | Authentication | Password reset |

---

### ❌ Error Pages (Bonus)

| Path | Template | Description |
|------|----------|-------------|
| `/404` | Error Pages | Not found |
| `/500` | Error Pages | Server error |
| `/403` | Error Pages | Forbidden |
| `/maintenance` | Error Pages | Maintenance mode |

---

## Navigation Component Specs

### Desktop Sidebar Navigation

**Structure:**
```
â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"
â"‚ Logo            â"‚
â"œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"¤
â"‚ [Icon] Dashboard â"‚
â"‚ [Icon] Agents    â"‚
â"‚ [Icon] Prospects â"‚
â"‚ [Icon] Emails    â"‚
â"‚ [Icon] Reports   â"‚
â"‚ [Icon] Resources â"‚
â"œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"¤
â"‚ [Icon] Settings  â"‚
â"‚ [Avatar] User    â"‚
â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜
```

**Active States:**
- Blue left border + background tint
- Icon color changes to primary blue

---

### Mobile Bottom Navigation

**Structure:**
```
â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"
â"‚ [Home] [Agents] [+] [Msgs] [Menu] â"‚
â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜
```

**Items:**
1. Home (Dashboard)
2. Agents (Most used)
3. Quick Action (Create new)
4. Messages/Notifications
5. More Menu (Everything else)

---

## Breadcrumb Patterns

### Format
`Section > Sub-section > Page Title`

### Examples
- `Agents > Templates > Sales Outreach`
- `Settings > Billing > Invoices`
- `Resources > Docs > Getting Started`

---

## Search Scope

### Global Search (⌘K)
Searches across:
- Agents
- Prospects
- Emails
- Reports
- Documentation
- Marketplace packs

### Scoped Search
- `/agents` page: Search only agents
- `/docs` page: Search only docs
- `/prospects` page: Search only prospects

---

## User Menu Items

**Location:** Top-right corner

**Items:**
1. Profile → `/settings/profile`
2. Account Settings → `/settings/account`
3. Billing → `/billing`
4. Help & Support → `/support`
5. What's New → `/changelog` (future)
6. Divider
7. Logout

---

## Permission-Based Navigation

### Free Tier
Hide:
- Advanced analytics
- Custom reports
- API keys
- Team management

### Pro Tier
Show all features

### Admin Users
Show:
- Admin settings
- Audit log
- Team management
- Billing

---

## Template → Page Mapping Summary

| Template | Page Count | Key Pages |
|----------|-----------|-----------|
| Dashboard | 8 | Home, Sales, Analytics |
| Content Hub | 4 | Resources, Docs, University |
| Documentation | 10 | Help articles, Docs |
| List+Filters | 25 | Agents, Prospects, Campaigns |
| Detail/Editor | 20 | Agent details, Prospect profiles |
| Settings | 15 | Account, Billing, Admin |
| Form/Wizard | 8 | Onboarding, Create flows |
| Authentication | 5 | Login, Signup |
| Error Pages | 5 | 404, 500, 403 |
| Search/Results | 3 | Global search, Help search |
| Notification Center | 2 | Notifications, Activity |
| Mobile Companion | 3 | Mobile dashboard, agents |

**Total:** 100 pages mapped to 12 templates

---

## Mobile-First Pages

**Priority pages for mobile optimization:**
1. `/dashboard` (Quick overview)
2. `/agents` (Manage on-the-go)
3. `/notifications` (Stay informed)
4. `/prospects` (Quick contact)
5. `/m/*` (Dedicated mobile views)

---

## Deep Linking Structure

**Format:** `galaxyco://[section]/[action]/[id]`

**Examples:**
- `galaxyco://agents/view/abc123`
- `galaxyco://prospects/view/xyz789`
- `galaxyco://notifications/view/notif456`

---

## Next Steps

1. **Review page list** - Add/remove pages as needed
2. **Validate URL patterns** - Ensure consistency
3. **Map API endpoints** - Align backend routes
4. **Create navigation components** - Build Sidebar, BottomNav
5. **Implement routing** - Use Wouter with this structure

---

**Status:** Complete ✅ Ready for Phase 2
