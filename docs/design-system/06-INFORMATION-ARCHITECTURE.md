# Information Architecture

**Purpose:** Complete site structure showing all 100 pages, their relationships, and navigation hierarchy.

---

## Site Map (Visual Tree)

```
GalaxyCo.ai
│
├─ 🏠 Core App
│  ├─ /dashboard (Dashboard Template)
│  ├─ /sales (Dashboard Template)
│  ├─ /time-usage (Dashboard Template)
│  ├─ /library (Content Hub Template)
│  ├─ /marketing (Dashboard Template)
│  └─ /outreach (Dashboard Template)
│
├─ 🤖 Agent Management
│  ├─ /agents (List + Filters Template)
│  ├─ /agents/[id] (Detail/Editor Template)
│  ├─ /agents/[id]/settings (Settings Template)
│  ├─ /agents/[id]/analytics (Dashboard Template)
│  ├─ /agents/[id]/logs (List + Filters Template)
│  ├─ /agents/templates (List + Filters Template)
│  └─ /agents/import (Form/Wizard Template)
│
├─ 🔄 Workflow Management
│  ├─ /workflows (List + Filters Template)
│  ├─ /workflows/[workflowId] (Detail/Editor Template)
│  ├─ /workflows/[workflowId]/analytics (Dashboard Template)
│  ├─ /workflows/[workflowId]/versions (List + Filters Template)
│  ├─ /workflows/templates (List + Filters Template)
│  └─ /workflows/import (Form/Wizard Template)
│
├─ 📚 Resources Hub
│  ├─ /resources (Content Hub Template)
│  ├─ /docs (Content Hub Template)
│  │  ├─ /docs/getting-started (Documentation Template)
│  │  ├─ /docs/api-reference (Documentation Template)
│  │  ├─ /docs/integration-guides (Documentation Template)
│  │  └─ /docs/best-practices (Documentation Template)
│  └─ /templates (Content Hub Template)
│     ├─ /templates/workflows (List + Filters Template)
│     ├─ /templates/documents (List + Filters Template)
│     ├─ /templates/agents (List + Filters Template)
│     └─ /templates/emails (List + Filters Template)
│
├─ 🎓 AI University
│  ├─ /university (Content Hub Template)
│  ├─ /university/courses (List + Filters Template)
│  ├─ /university/certifications (List + Filters Template)
│  ├─ /university/tutorials (List + Filters Template)
│  └─ /university/webinars (List + Filters Template)
│
├─ 🏢 Company Pages
│  ├─ /company (Content Hub Template)
│  ├─ /company/about (Documentation Template)
│  ├─ /company/blog (List + Filters Template)
│  ├─ /company/blog/[slug] (Documentation Template)
│  ├─ /company/support (Content Hub Template)
│  ├─ /company/status (Dashboard Template)
│  └─ /company/contact (Form/Wizard Template)
│
├─ 🔐 Authentication & Onboarding
│  ├─ /login (Authentication Template)
│  ├─ /signup (Authentication Template)
│  ├─ /verify-email (Authentication Template)
│  ├─ /forgot-password (Authentication Template)
│  ├─ /reset-password (Authentication Template)
│  ├─ /invite/[code] (Authentication Template)
│  ├─ /onboarding (Form/Wizard Template)
│  └─ /onboarding/[step] (Form/Wizard Template)
│
├─ 💳 Billing & Subscription
│  ├─ /billing (Dashboard Template)
│  ├─ /billing/upgrade (Form/Wizard Template)
│  ├─ /billing/usage (Dashboard Template)
│  ├─ /billing/payment-methods (Settings Template)
│  └─ /billing/invoices/[invoiceId] (Detail/Editor Template)
│
├─ ⚙️ Settings & Configuration
│  ├─ /settings (Settings Template)
│  ├─ /settings/profile (Settings Template)
│  ├─ /settings/security (Settings Template)
│  ├─ /settings/notifications (Settings Template)
│  ├─ /settings/preferences (Settings Template)
│  ├─ /settings/team (List + Filters Template)
│  ├─ /settings/team/invite (Form/Wizard Template)
│  ├─ /settings/organization (Settings Template)
│  ├─ /settings/api-keys (List + Filters Template)
│  ├─ /settings/webhooks (List + Filters Template)
│  └─ /settings/roles (List + Filters Template)
│
├─ 🛒 Marketplace
│  ├─ /marketplace (List + Filters Template)
│  ├─ /marketplace/[packId] (Detail/Editor Template)
│  ├─ /marketplace/categories (Content Hub Template)
│  ├─ /marketplace/categories/[category] (List + Filters Template)
│  ├─ /my-packs (List + Filters Template)
│  ├─ /packs/create (Form/Wizard Template)
│  └─ /packs/[packId]/edit (Detail/Editor Template)
│
├─ 📊 Analytics & Reporting
│  ├─ /analytics (Dashboard Template)
│  ├─ /analytics/agents (Dashboard Template)
│  ├─ /analytics/workflows (Dashboard Template)
│  ├─ /analytics/usage (Dashboard Template)
│  ├─ /reports (List + Filters Template)
│  ├─ /reports/[reportId] (Detail/Editor Template)
│  └─ /reports/create (Form/Wizard Template)
│
├─ 🔗 Integrations
│  ├─ /integrations (List + Filters Template)
│  ├─ /integrations/[integrationId] (Detail/Editor Template)
│  ├─ /integrations/oauth/callback (Authentication Template)
│  ├─ /integrations/oauth/success (Authentication Template)
│  └─ /integrations/oauth/error (Error Template)
│
├─ 💬 Support & Help
│  ├─ /support (Content Hub Template)
│  ├─ /support/tickets (List + Filters Template)
│  ├─ /support/tickets/new (Form/Wizard Template)
│  ├─ /support/tickets/[ticketId] (Detail/Editor Template)
│  ├─ /help (Content Hub Template)
│  ├─ /help/search (Search/Results Template)
│  └─ /help/articles/[articleId] (Documentation Template)
│
├─ 🔔 Notifications & Activity
│  ├─ /notifications (Notification Center Template)
│  ├─ /notifications/settings (Settings Template)
│  ├─ /activity (Notification Center Template)
│  └─ /search (Search/Results Template)
│
├─ 📧 Email & Prospects
│  ├─ /prospects (List + Filters Template)
│  ├─ /prospects/[id] (Detail/Editor Template)
│  ├─ /prospects/import (Form/Wizard Template)
│  ├─ /emails (List + Filters Template)
│  ├─ /emails/[id] (Detail/Editor Template)
│  ├─ /emails/templates (List + Filters Template)
│  └─ /emails/campaigns (List + Filters Template)
│
├─ 🧠 Knowledge Base
│  ├─ /knowledge/sources (List + Filters Template)
│  ├─ /knowledge/sources/[sourceId] (Detail/Editor Template)
│  └─ /knowledge/upload (Form/Wizard Template)
│
├─ 💼 Enterprise/Admin
│  ├─ /admin (Dashboard Template)
│  ├─ /admin/users (List + Filters Template)
│  ├─ /admin/organizations (List + Filters Template)
│  ├─ /admin/audit (List + Filters Template)
│  ├─ /admin/settings (Settings Template)
│  ├─ /compliance (Content Hub Template)
│  ├─ /compliance/soc2 (Documentation Template)
│  ├─ /compliance/gdpr (Documentation Template)
│  └─ /compliance/hipaa (Documentation Template)
│
├─ 🚨 Error & Status Pages
│  ├─ /404 (Error Template)
│  ├─ /500 (Error Template)
│  ├─ /403 (Error Template)
│  ├─ /maintenance (Error Template)
│  └─ /error (Error Template)
│
└─ 📱 Mobile-Optimized Routes
   ├─ /m/dashboard (Mobile Companion Template)
   ├─ /m/agents (Mobile Companion Template)
   └─ /m/notifications (Mobile Companion Template)
```

---

## Navigation Structure

### Primary Sidebar Navigation (Desktop)

```
┌─────────────────────────┐
│ [GalaxyCo Logo]         │
│                         │
│ WORKSPACE               │
│ ● Dashboard             │
│ ● Sales                 │
│ ● Time Usage            │
│ ● Marketing             │
│ ● Outreach              │
│                         │
│ AUTOMATION              │
│ ● Agents                │
│ ● Workflows             │
│ ● Templates             │
│                         │
│ CONTACTS                │
│ ● Prospects             │
│ ● Emails                │
│                         │
│ INSIGHTS                │
│ ● Analytics             │
│ ● Reports               │
│                         │
│ RESOURCES               │
│ ● Library               │
│ ● Docs                  │
│ ● University            │
│ ● Marketplace           │
│                         │
│ [Settings]              │
│ [User Profile]          │
└─────────────────────────┘
```

### Bottom Navigation (Mobile)

```
┌───────────────────────────────────┐
│ [Home] [Agents] [Add] [Bell] [Me] │
└───────────────────────────────────┘
```

### Top Navigation Actions (All Devices)

```
┌─────────────────────────────────────────────┐
│ [Search] [Notifications] [Help] [User Menu] │
└─────────────────────────────────────────────┘
```

---

## User Flows

### Flow 1: Create New Agent
```
1. /agents (List)
   → Click "+ New Agent"
2. /agents/create (Form Wizard)
   Step 1: Basic Info
   Step 2: Configuration
   Step 3: Review
   Step 4: Deploy
3. /agents/[id] (Detail View)
   → Agent created successfully
```

### Flow 2: Run Analytics Report
```
1. /analytics (Dashboard)
   → Click "Create Report"
2. /reports/create (Form Wizard)
   Step 1: Select data source
   Step 2: Choose metrics
   Step 3: Configure filters
   Step 4: Generate
3. /reports/[reportId] (Detail View)
   → View/download report
```

### Flow 3: Onboard New User
```
1. /signup (Auth)
   → Create account
2. /verify-email (Auth)
   → Confirm email
3. /onboarding (Form Wizard)
   Step 1: Profile info
   Step 2: Team details
   Step 3: Use case
   Step 4: Integrations
4. /dashboard (Dashboard)
   → Welcome tour
```

### Flow 4: Purchase Marketplace Pack
```
1. /marketplace (List + Filters)
   → Browse packs
2. /marketplace/[packId] (Detail)
   → View pack details
   → Click "Purchase"
3. /billing/upgrade (Form)
   → Enter payment info
4. /my-packs (List)
   → Access purchased pack
```

### Flow 5: Get Support
```
1. /help (Content Hub)
   → Search articles
2a. /help/articles/[articleId] (Documentation)
    → Read solution
OR
2b. /support/tickets/new (Form)
    → Create ticket
3. /support/tickets/[ticketId] (Detail)
   → Track ticket status
```

---

## Page Template Mapping

### Template Usage Summary

| Template | Pages Using | Count |
|----------|-------------|-------|
| Dashboard | `/sales`, `/analytics`, `/admin`, etc. | 12 |
| List + Filters | `/agents`, `/workflows`, `/marketplace`, etc. | 35 |
| Detail/Editor | `/agents/[id]`, `/reports/[reportId]`, etc. | 22 |
| Settings | `/settings/*`, `/billing/*` | 15 |
| Form/Wizard | `/onboarding`, `/packs/create`, etc. | 8 |
| Authentication | `/login`, `/signup`, etc. | 6 |
| Content Hub | `/resources`, `/docs`, `/university` | 8 |
| Documentation | `/docs/*`, `/help/articles/*` | 10 |
| Search/Results | `/search`, `/help/search` | 3 |
| Notification Center | `/notifications`, `/activity` | 2 |
| Error | `/404`, `/500`, etc. | 5 |
| Mobile Companion | `/m/*` | 3 |
| **TOTAL** | | **100** |

---

## Access Control (User Roles)

### Free Tier
**Access:**
- Dashboard (limited metrics)
- Agents (max 2)
- Workflows (max 5)
- Templates (view only)
- Docs & Help
- Basic support tickets

**Restricted:**
- Analytics (limited)
- Marketplace (view only)
- Integrations (limited)
- No team features
- No API access

---

### Pro Tier
**Access:**
- Everything in Free
- Unlimited agents & workflows
- Full analytics
- Marketplace (purchase packs)
- Integrations (all)
- Team features (up to 5 members)
- API access
- Priority support

**Restricted:**
- Admin panel
- Audit logs
- Enterprise integrations
- SSO
- Compliance docs

---

### Enterprise Tier
**Access:**
- Everything in Pro
- Admin panel
- Audit logs
- Compliance docs (SOC2, GDPR, HIPAA)
- SSO
- Enterprise integrations
- Dedicated support
- Custom SLA

---

## SEO & Meta Structure

### Page Metadata Template

```tsx
interface PageMeta {
  title: string // Max 60 chars
  description: string // Max 160 chars
  ogImage?: string
  canonical?: string
  robots?: 'index,follow' | 'noindex,nofollow'
}
```

### Example Implementations

**Homepage:**
```tsx
{
  title: "GalaxyCo.ai - AI Automation Platform",
  description: "Build and deploy AI agents for sales, marketing, and automation. No code required.",
  ogImage: "/og/home.png",
  canonical: "https://galaxyco.ai",
  robots: "index,follow"
}
```

**Marketplace Pack:**
```tsx
{
  title: "[Pack Name] - GalaxyCo Marketplace",
  description: "[Pack description - first 160 chars]",
  ogImage: "[Pack thumbnail]",
  canonical: "https://galaxyco.ai/marketplace/[packId]",
  robots: "index,follow"
}
```

**Docs:**
```tsx
{
  title: "[Article Title] - GalaxyCo Docs",
  description: "[Article excerpt - first 160 chars]",
  ogImage: "/og/docs.png",
  canonical: "https://galaxyco.ai/docs/[slug]",
  robots: "index,follow"
}
```

**Settings:**
```tsx
{
  title: "Settings - GalaxyCo.ai",
  description: "Manage your account settings and preferences",
  robots: "noindex,nofollow" // Private pages
}
```

---

## Breadcrumb Patterns

### Dashboard Pages
```
Home > Dashboard
Home > Sales Dashboard
Home > Analytics > Agents
```

### Agent Management
```
Home > Agents
Home > Agents > Sales Agent
Home > Agents > Sales Agent > Settings
```

### Settings
```
Home > Settings
Home > Settings > Profile
Home > Settings > Team > Invite Member
```

### Marketplace
```
Home > Marketplace
Home > Marketplace > Category Name
Home > Marketplace > Pack Name
```

### Docs
```
Home > Docs
Home > Docs > Getting Started
Home > Docs > API Reference > Authentication
```

---

## URL Naming Conventions

### Rules
1. **Lowercase only:** `/agents` not `/Agents`
2. **Kebab-case:** `/api-keys` not `/api_keys`
3. **No trailing slashes:** `/dashboard` not `/dashboard/`
4. **Plural for collections:** `/agents` not `/agent`
5. **Singular for items:** `/agents/[id]` not `/agents/[id]s`
6. **Meaningful slugs:** `/blog/how-to-build-agents` not `/blog/post-123`

### Dynamic Segments
- IDs: `/agents/[id]` (e.g., `/agents/abc123`)
- Slugs: `/blog/[slug]` (e.g., `/blog/getting-started`)
- Codes: `/invite/[code]` (e.g., `/invite/xyz789`)

---

## Search Index Structure

### Searchable Content Types

1. **Agents**
   - Name, description, tags
   - Searchable: ✅
   - Indexed fields: `name`, `description`, `tags`, `type`, `status`

2. **Workflows**
   - Name, description, steps
   - Searchable: ✅
   - Indexed fields: `name`, `description`, `steps`, `category`

3. **Docs**
   - Title, content, tags
   - Searchable: ✅
   - Indexed fields: `title`, `content`, `tags`, `category`

4. **Marketplace Packs**
   - Name, description, tags
   - Searchable: ✅
   - Indexed fields: `name`, `description`, `tags`, `category`, `author`

5. **Help Articles**
   - Title, content, category
   - Searchable: ✅
   - Indexed fields: `title`, `content`, `category`

6. **Templates**
   - Name, description, type
   - Searchable: ✅
   - Indexed fields: `name`, `description`, `type`, `category`

---

## Performance Optimization

### Route-based Code Splitting

```tsx
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Agents = lazy(() => import('./pages/Agents'))
const AgentDetail = lazy(() => import('./pages/AgentDetail'))

// Preload on hover
<Link to="/agents" onMouseEnter={() => import('./pages/Agents')}>
  Agents
</Link>
```

### Critical Routes (Load Immediately)
- `/dashboard`
- `/agents`
- `/workflows`
- `/settings`

### Lazy Routes (Load on Demand)
- `/marketplace`
- `/university`
- `/admin`
- `/compliance`

---

## Analytics Events

### Page View Tracking
```tsx
trackPageView({
  path: '/agents/[id]',
  title: 'Agent Detail - Sales Agent',
  userId: user.id
})
```

### Navigation Events
```tsx
trackNavigation({
  from: '/agents',
  to: '/agents/[id]',
  method: 'click' | 'keyboard' | 'back-button'
})
```

---

## Next Steps

1. **Validate IA with stakeholders**
2. **Create route configuration file** (`routes.ts`)
3. **Build navigation components** (Sidebar, TopNav, BottomNav)
4. **Implement search index** (Algolia or similar)
5. **Set up analytics tracking** (Segment, Mixpanel)
6. **Configure meta tags** per page type

---

**Status:** Information architecture complete ✅
