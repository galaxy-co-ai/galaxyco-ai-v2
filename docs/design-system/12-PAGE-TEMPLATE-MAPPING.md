# Page Template Mapping

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Total Pages:** 100  
**Templates:** 12  
**Status:** Ready for Implementation

---

## Dashboard Template (8 Pages)

### 1. `/dashboard` - Main Dashboard

**Stats:** Active Agents, Total Runs, Success Rate, Revenue  
**Charts:** 7-day activity line chart, Agent performance bar chart  
**Table:** Recent agent executions  
**Unique:** Hero banner with quick actions

### 2. `/sales` - Sales Dashboard

**Stats:** Total Deals, Win Rate, Avg Deal Size, Pipeline Value  
**Charts:** Sales funnel, Revenue trend  
**Table:** Top performing campaigns  
**Unique:** Deal stage breakdown donut chart

### 3. `/time-usage` - Time Tracking

**Stats:** Hours Tracked, Billable Hours, Efficiency Score, Active Projects  
**Charts:** Time by project pie chart, Weekly hours trend  
**Table:** Time entries by user  
**Unique:** Calendar heatmap

### 4. `/marketing` - Marketing Performance

**Stats:** Impressions, Clicks, Conversions, ROI  
**Charts:** Campaign performance, Channel breakdown  
**Table:** Campaign list with metrics  
**Unique:** Multi-channel attribution chart

### 5. `/outreach` - Outreach Metrics

**Stats:** Emails Sent, Open Rate, Reply Rate, Meetings Booked  
**Charts:** Funnel visualization, Daily send volume  
**Table:** Campaign performance  
**Unique:** Email engagement timeline

### 6. `/analytics` - Custom Analytics

**Stats:** User-configurable metrics  
**Charts:** User-selected visualizations  
**Table:** Custom reports  
**Unique:** Report builder sidebar

### 7. `/admin` - Admin Overview

**Stats:** Total Users, Active Workspaces, API Calls, System Health  
**Charts:** User growth, API usage  
**Table:** Recent admin actions  
**Unique:** System status indicators

### 8. `/reports` - Saved Reports

**Stats:** Report count, Scheduled count, Shared count  
**Charts:** None (report previews instead)  
**Table:** Report list with thumbnails  
**Unique:** Report preview cards

---

## List + Filters Template (25 Pages)

### Agents Section (8 pages)

9. `/agents` - Filters: Status, Template, Created Date
10. `/agents/new` - Wizard variant
11. `/workflows` - Filters: Category, Complexity
12. `/workflows/new` - Wizard variant
13. `/workflows/[id]` - Detail variant
14. `/templates` - Filters: Category, Popularity
15. `/templates/[category]` - Category pre-filtered
16. `/templates/[id]` - Detail variant

### Marketplace (5 pages)

17. `/marketplace` - Filters: Category, Price, Rating
18. `/marketplace/categories/[cat]` - Category pre-filtered
19. `/marketplace/[packId]` - Detail variant
20. `/marketplace/[packId]/install` - Wizard variant
21. `/marketplace/my-purchases` - No filters needed

### Prospects (5 pages)

22. `/prospects` - Filters: Status, Tags, Source
23. `/prospects/new` - Form variant
24. `/prospects/import` - Wizard variant
25. `/prospects/segments` - Filters: Active, Created By
26. `/prospects/segments/[id]` - Detail variant

### Emails (5 pages)

27. `/emails` - Filters: Folder, Date, Status
28. `/emails/campaigns` - Filters: Status, Date
29. `/emails/campaigns/new` - Wizard variant
30. `/emails/templates` - Filters: Category
31. `/emails/compose` - Form variant

### Other (2 pages)

32. `/integrations` - Filters: Category, Status
33. `/support/tickets` - Filters: Status, Priority

---

## Detail/Editor Template (20 Pages)

### Agent Details

34. `/agents/[id]` - Tabs: Overview, Settings, Analytics, Logs
35. `/agents/[id]/test` - Tabs: Input, Run, Results
36. `/workflows/[workflowId]` - Tabs: Builder, Settings, History

### Marketplace

37. `/marketplace/[packId]` - Tabs: Overview, Reviews, Changelog

### Prospects

38. `/prospects/[id]` - Tabs: Overview, Activity, Emails, Notes
39. `/prospects/[id]/overview` - Contact info, Company details
40. `/prospects/[id]/activity` - Timeline of interactions
41. `/prospects/[id]/emails` - Email thread view
42. `/prospects/[id]/notes` - Notes editor
43. `/prospects/segments/[id]` - Tabs: Members, Rules, Analytics

### Emails

44. `/emails/campaigns/[id]` - Tabs: Overview, Analytics, Recipients
45. `/emails/campaigns/[id]/analytics` - Performance metrics
46. `/emails/templates/[id]` - WYSIWYG editor

### Reports

47. `/reports/[reportId]` - Tabs: View, Schedule, Share
48. `/reports/[reportId]/edit` - Report builder

### Integrations

49. `/integrations/[provider]` - Tabs: Overview, Settings, Logs
50. `/integrations/[provider]/settings` - Configuration form
51. `/integrations/webhooks` - Webhook list + test interface

### University

52. `/university/courses/[courseId]` - Tabs: Lessons, Resources, Progress
53. `/help/articles/[id]` - Article content + TOC sidebar

---

## Settings Template (15 Pages)

### Account Settings (5 pages)

54. `/settings/profile` - Name, Email, Avatar
55. `/settings/account` - Account details, Timezone
56. `/settings/security` - Password, 2FA, Sessions
57. `/settings/notifications` - Email prefs, Push prefs
58. `/settings/appearance` - Theme, Language, Density

### Billing (4 pages)

59. `/billing` - Current plan, Usage
60. `/billing/subscription` - Plan selection, Upgrade/Downgrade
61. `/billing/payment-methods` - Cards, Add new
62. `/billing/invoices` - Invoice list (uses List template)

### Admin (6 pages)

63. `/admin/team` - Team member list + invite
64. `/admin/roles` - Role management
65. `/admin/audit-log` - Audit trail (uses List template)
66. `/admin/api-keys` - API key management
67. `/settings/integrations` - Connected apps
68. `/integrations/[provider]/connect` - OAuth flow (wizard)

---

## Form/Wizard Template (8 Pages)

69. `/onboarding` - Steps: Welcome, Profile, Workspace, Integrations
70. `/agents/new` - Steps: Template, Configuration, Test, Deploy
71. `/packs/create` - Steps: Info, Agent Selection, Pricing, Publish
72. `/reports/new` - Steps: Data Source, Metrics, Visualization, Schedule
73. `/reports/create` - Alias for `/reports/new`
74. `/support/tickets/new` - Steps: Category, Details, Attachments
75. `/prospects/import` - Steps: Upload, Map Fields, Review, Import
76. `/emails/compose` - Steps: Recipients, Content, Schedule

---

## Content Hub Template (4 Pages)

77. `/resources` - Categories: Docs, Templates, University, Help
78. `/docs` - Categories by section
79. `/templates` (landing) - Categories: Sales, Marketing, Support
80. `/university` - Categories: Courses, Tutorials, Webinars

---

## Documentation Template (10 Pages)

81. `/docs/getting-started` - TOC sidebar, prose content
82. `/docs/agents/creating` - TOC sidebar, code examples
83. `/docs/agents/testing` - TOC sidebar, screenshots
84. `/docs/[category]/[slug]` - Dynamic docs (7 pages)

---

## Authentication Template (5 Pages)

91. `/login` - Email/password, OAuth buttons, "Forgot password" link
92. `/signup` - Email/password, OAuth buttons, Terms checkbox
93. `/verify-email` - Verification code input, Resend button
94. `/forgot-password` - Email input only
95. `/reset-password` - New password fields

---

## Error Pages Template (5 Pages)

96. `/404` - "Page not found", Search bar, Home link
97. `/500` - "Server error", Retry button, Support link
98. `/403` - "Access denied", Request access button
99. `/maintenance` - "Under maintenance", ETA, Status link
100.  `/error` - Generic error, Error details (dev mode)

---

## Search/Results Template (3 Pages - Bonus)

101. `/search` - Global search with filters
102. `/help/search` - Help-specific search
103. `/marketplace/categories/[category]` - Marketplace search

---

## Notification Center Template (2 Pages)

104. `/notifications` - Timeline view, Filter tabs
105. `/activity` - User activity timeline

---

## Mobile Companion Template (3 Pages)

106. `/m/dashboard` - Mobile-optimized dashboard
107. `/m/agents` - Mobile agent list
108. `/m/notifications` - Mobile notifications

---

## API Endpoint Mapping

### Convention

`Page path → API endpoint path`

**Examples:**

- `/agents` → `GET /api/agents`
- `/agents/[id]` → `GET /api/agents/:id`
- `/agents/new` → `POST /api/agents`
- `/prospects/[id]/emails` → `GET /api/prospects/:id/emails`

### API Contract Example

```typescript
// GET /api/agents
interface AgentListResponse {
  data: Agent[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
}

// GET /api/agents/:id
interface AgentDetailResponse {
  data: Agent;
}

// POST /api/agents
interface CreateAgentRequest {
  name: string;
  templateId?: string;
  config: Record<string, any>;
}
```

---

## Content Requirements per Page

### Example: `/agents` Page

**Required Content:**

- Page title: "Agents"
- Empty state: "Create your first agent"
- CTA: "New Agent" button
- Filter labels: Status, Template, Date
- Table columns: Name, Status, Last Run, Actions

### Example: `/agents/[id]` Page

**Required Content:**

- Breadcrumb: "Agents > {Agent Name}"
- Tab labels: Overview, Settings, Analytics, Logs
- Overview fields: Name, Description, Template, Status
- Action buttons: Run, Edit, Duplicate, Delete

---

**Status:** Complete ✅  
**Next:** File structure conventions
