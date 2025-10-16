# Wireframes: List, Detail & Settings Templates

**Templates covered:** 4-6  
**Pages:** 60 total

---

## Template 4: List + Filters

**Used by:** `/agents`, `/workflows`, `/templates/*`, `/marketplace`, `/prospects`, `/emails/campaigns`, `/integrations`, `/support/tickets` (25 pages)

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Header Bar ─────────────────────────┐│
│                                 │ │ ┌──────────────┐  [Grid] [List]  [+]││
│ • Dashboard                     │ │ │ 🔍 Search... │  View:    New Agent││
│ • Agents                        │ │ └──────────────┘                     ││
│ • Workflows                     │ └──────────────────────────────────────┘│
│ • Templates                     │                                          │
│                                 │ ┌─ Filter Bar ─────────────────────────┐│
│ ┌─ Filters ─────────────────┐  │ │ Status: All ▼  |  Type: All ▼  [Clear│
│ │ Filters                   │  │ │ ]                                    ││
│ │                           │  │ └──────────────────────────────────────┘│
│ │ ☑ Status                  │  │                                          │
│ │   ☑ Active (12)           │  │ ┌─ Results Grid ───────────────────────┐│
│ │   ☐ Paused (3)            │  │ │ Showing 12 of 43 results             ││
│ │   ☐ Archived (28)         │  │ │                                      ││
│ │                           │  │ │ ┌────────┐ ┌────────┐ ┌────────┐    ││
│ │ ☑ Type                    │  │ │ │ 🤖     │ │ 🤖     │ │ 🤖     │    ││
│ │   ☐ Chatbot (8)           │  │ │ │ Sales  │ │Support │ │ Market │    ││
│ │   ☑ Automation (4)        │  │ │ │ Agent  │ │ Agent  │ │ Agent  │    ││
│ │   ☐ Analytics (7)         │  │ │ │        │ │        │ │        │    ││
│ │                           │  │ │ │ Active │ │ Active │ │ Paused │    ││
│ │ Created Date              │  │ │ │ 1.2K   │ │ 856    │ │ 423    │    ││
│ │ [Date range picker]       │  │ │ │ runs   │ │ runs   │ │ runs   │    ││
│ │                           │  │ │ └────────┘ └────────┘ └────────┘    ││
│ │ [Reset All Filters]       │  │ │ ┌────────┐ ┌────────┐ ┌────────┐    ││
│ └───────────────────────────┘  │ │ │ 🤖     │ │ 🤖     │ │ 🤖     │    ││
│                                 │ │ │ Email  │ │ Data   │ │ Lead   │    ││
│                                 │ │ │ Agent  │ │ Agent  │ │ Agent  │    ││
│                                 │ │ └────────┘ └────────┘ └────────┘    ││
│                                 │ │                                      ││
│                                 │ │ ┌─ Pagination ──────────────────────┐││
│                                 │ │ │ ← Previous  1 [2] 3 4 5  Next → │││
│                                 │ │ └───────────────────────────────────┘││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────┐
│ ┌─ Top Bar ────────────────┐│
│ │ [☰] Agents    [🔍] [+]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Search & Filter ────────┐│
│ │ ┌─────────────────────┐ ││
│ │ │ 🔍 Search agents... │ ││
│ │ └─────────────────────┘ ││
│ │ [Filters: 2] [Sort ▼]   ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Results List ───────────┐│
│ │ Showing 12 of 43         ││
│ │                          ││
│ │ ┌────────────────────┐  ││
│ │ │ 🤖  Sales Agent    │  ││
│ │ │ Active • 1.2K runs │  ││
│ │ │ Last run: 2m ago   │  ││
│ │ └────────────────────┘  ││
│ │                          ││
│ │ ┌────────────────────┐  ││
│ │ │ 🤖  Support Agent  │  ││
│ │ │ Active • 856 runs  │  ││
│ │ │ Last run: 5m ago   │  ││
│ │ └────────────────────┘  ││
│ │                          ││
│ │ ┌────────────────────┐  ││
│ │ │ 🤖  Marketing Agent│  ││
│ │ │ Paused • 423 runs  │  ││
│ │ │ Last run: 2h ago   │  ││
│ │ └────────────────────┘  ││
│ │                          ││
│ │ [Load More]              ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Filter Sidebar

```jsx
<aside className="w-60 border-r border-border p-6 space-y-6">
  <div>
    <h3 className="text-sm font-semibold text-foreground mb-3">Filters</h3>

    {/* Status Filter */}
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-2"
        onClick={() => toggleSection('status')}
      >
        Status
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="space-y-2 pl-2">
          {statusOptions.map(option => (
            <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status.includes(option.value)}
                onChange={() => toggleFilter('status', option.value)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-foreground-muted">
                {option.label} ({option.count})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Type Filter */}
    <div className="mb-4">
      {/* Similar structure */}
    </div>

    {/* Date Range */}
    <div>
      <label className="text-sm font-medium text-foreground block mb-2">
        Created Date
      </label>
      <DateRangePicker {...} />
    </div>
  </div>

  <button
    onClick={resetFilters}
    className="w-full px-4 py-2 text-sm text-foreground-muted hover:text-foreground
               border border-border rounded hover:border-border-hover transition-colors"
  >
    Reset All Filters
  </button>
</aside>
```

**Measurements:**

- Sidebar width: `w-60` (240px)
- Section spacing: `space-y-6` (24px)
- Filter label: `text-sm font-medium` (14px)
- Checkbox spacing: `space-y-2` (8px)
- Indent: `pl-2` (8px)

---

#### 2. Search & View Toggle Bar

```jsx
<div className="flex items-center justify-between mb-6">
  <div className="flex-1 max-w-md">
    <div className="relative">
      <input
        type="search"
        placeholder="Search agents..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-subtle
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                   text-sm"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
    </div>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-sm text-foreground-muted">View:</span>
    <div className="flex border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setView("grid")}
        className={cn(
          "px-3 py-1.5 text-sm transition-colors",
          view === "grid"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-hover text-foreground-muted",
        )}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView("list")}
        className={cn(
          "px-3 py-1.5 text-sm transition-colors border-l border-border",
          view === "list"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-hover text-foreground-muted",
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>

    <button
      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                       hover:bg-primary-hover transition-colors text-sm font-medium"
    >
      + New Agent
    </button>
  </div>
</div>
```

**Measurements:**

- Search max width: `max-w-md` (448px)
- Search height: `py-2` (8px vertical, ~40px total)
- Button padding: `px-3 py-1.5` (12px × 6px)
- Icon size: `w-4 h-4` (16px × 16px)

---

#### 3. Grid Card

```jsx
<div
  className="bg-background-elevated border border-border rounded-lg p-6
                hover:border-primary hover:shadow-md transition-all duration-fast
                cursor-pointer group"
>
  <div className="flex items-start justify-between mb-4">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
      🤖
    </div>
    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreVertical className="w-5 h-5 text-foreground-muted hover:text-foreground" />
    </button>
  </div>

  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
    Sales Agent
  </h3>

  <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
    Automates sales outreach and follow-ups with personalized messaging.
  </p>

  <div className="flex items-center justify-between pt-4 border-t border-border">
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                       bg-success/10 text-success border border-success/20"
      >
        Active
      </span>
    </div>
    <div className="text-sm text-foreground-muted">1.2K runs</div>
  </div>
</div>
```

**Grid Layout:**

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <GridCard {...} />)}
</div>
```

**Measurements:**

- Card padding: `p-6` (24px)
- Icon container: `w-12 h-12` (48px × 48px)
- Title: `text-lg` (18px)
- Description: `text-sm` (14px), max 2 lines (`line-clamp-2`)
- Badge padding: `px-2 py-1` (8px × 4px)
- Grid: 1 col mobile, 2 tablet, 3 desktop, 4 XL

---

#### 4. List Row

```jsx
<div
  className="bg-background-elevated border border-border rounded-lg p-4 mb-3
                hover:border-primary transition-colors duration-fast cursor-pointer"
>
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
      🤖
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-foreground truncate">Sales Agent</h3>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                         bg-success/10 text-success border border-success/20 flex-shrink-0"
        >
          Active
        </span>
      </div>
      <p className="text-sm text-foreground-muted truncate">
        Automates sales outreach and follow-ups
      </p>
    </div>

    <div className="flex items-center gap-6 flex-shrink-0">
      <div className="text-right">
        <div className="text-sm font-medium text-foreground">1.2K</div>
        <div className="text-xs text-foreground-muted">runs</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-foreground-muted">Last run</div>
        <div className="text-xs text-foreground-muted">2 min ago</div>
      </div>
      <button>
        <MoreVertical className="w-5 h-5 text-foreground-muted hover:text-foreground" />
      </button>
    </div>
  </div>
</div>
```

**Measurements:**

- Row padding: `p-4` (16px)
- Icon: `w-10 h-10` (40px × 40px)
- Gap between elements: `gap-4` (16px)
- Stat spacing: `gap-6` (24px)

---

#### 5. Pagination

```jsx
<div className="flex items-center justify-between pt-6 border-t border-border">
  <div className="text-sm text-foreground-muted">
    Showing <span className="font-medium text-foreground">1-12</span> of{" "}
    <span className="font-medium text-foreground">43</span> results
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={page === 1}
      className="px-3 py-1.5 text-sm border border-border rounded-lg
                 hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      ← Previous
    </button>

    {pageNumbers.map((num) => (
      <button
        key={num}
        onClick={() => setPage(num)}
        className={cn(
          "w-9 h-9 text-sm rounded-lg transition-colors",
          page === num
            ? "bg-primary text-primary-foreground"
            : "border border-border hover:border-border-hover",
        )}
      >
        {num}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      className="px-3 py-1.5 text-sm border border-border rounded-lg
                 hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      Next →
    </button>
  </div>
</div>
```

**Measurements:**

- Button padding: `px-3 py-1.5` (12px × 6px)
- Page number button: `w-9 h-9` (36px square)
- Gap: `gap-2` (8px)

---

## Template 5: Detail/Editor View

**Used by:** `/agents/[id]`, `/workflows/[workflowId]`, `/marketplace/[packId]`, `/prospects/[id]`, `/reports/[reportId]` (20 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Header ─────────────────────────────┐│
│                                 │ │ ← Back to Agents                     ││
│ • Dashboard                     │ │                                      ││
│ • Agents                        │ │ 🤖  Sales Agent                      ││
│ • Workflows                     │ │     Active • Last run: 2 min ago     ││
│ • Templates                     │ │                                      ││
│                                 │ │ [Edit] [Duplicate] [Delete] [...]   ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Tabs ───────────────────────────────┐│
│                                 │ │ [Overview] [Settings] [Analytics] [Lo││
│                                 │ │ gs]                                  ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Overview Content ───────────────────┐│
│                                 │ │ ┌─ Description ────────────────────┐││
│                                 │ │ │ About this agent                 │││
│                                 │ │ │                                  │││
│                                 │ │ │ This agent automates sales       │││
│                                 │ │ │ outreach and follow-ups with     │││
│                                 │ │ │ personalized messaging for leads │││
│                                 │ │ │ in your CRM.                     │││
│                                 │ │ └──────────────────────────────────┘││
│                                 │ │                                      ││
│                                 │ │ ┌─ Key Metrics ────────────────────┐││
│                                 │ │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │││
│                                 │ │ │ │1.2K│ │92% │ │$45K│ │3.2K│    │││
│                                 │ │ │ │Runs│ │Succ│ │Rev │ │Msgs│    │││
│                                 │ │ │ └────┘ └────┘ └────┘ └────┘    │││
│                                 │ │ └──────────────────────────────────┘││
│                                 │ │                                      ││
│                                 │ │ ┌─ Recent Activity ────────────────┐││
│                                 │ │ │ • Sent 12 emails (2 min ago)     │││
│                                 │ │ │ • Updated 5 prospects (8 min)    │││
│                                 │ │ │ • Generated report (15 min)      │││
│                                 │ │ └──────────────────────────────────┘││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Sidebar (Optional) ─────────────────┐│
│                                 │ │ Details                              ││
│                                 │ │ ──────────────────────────────────  ││
│                                 │ │ Created: Jan 15, 2025               ││
│                                 │ │ Modified: 2 hours ago               ││
│                                 │ │ Owner: you@company.com              ││
│                                 │ │                                      ││
│                                 │ │ Tags                                 ││
│                                 │ │ ──────────────────────────────────  ││
│                                 │ │ [sales] [automation] [email]        ││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [←] Sales Agent    [⋯]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Status Badge ───────────┐│
│ │ 🤖 Active                ││
│ │ Last run: 2 min ago      ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Tabs (Scroll) ──────────┐│
│ │ [Overview] Settings … →  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Description ────────────┐│
│ │ About this agent         ││
│ │                          ││
│ │ This agent automates     ││
│ │ sales outreach and       ││
│ │ follow-ups...            ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Metrics (2-col) ────────┐│
│ │ ┌──────┐  ┌──────┐      ││
│ │ │ 1.2K │  │ 92%  │      ││
│ │ │ Runs │  │Succes│      ││
│ │ └──────┘  └──────┘      ││
│ │ ┌──────┐  ┌──────┐      ││
│ │ │ $45K │  │ 3.2K │      ││
│ │ │ Rev  │  │ Msgs │      ││
│ │ └──────┘  └──────┘      ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Activity ───────────────┐│
│ │ Recent Activity          ││
│ │ ──────────────────────── ││
│ │ • Sent 12 emails (2m)    ││
│ │ • Updated 5 prospects    ││
│ │ [View All →]             ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Detail Header

```jsx
<header className="border-b border-border pb-6 mb-8">
  <Link
    to="/agents"
    className="inline-flex items-center gap-2 text-sm text-foreground-muted
               hover:text-foreground transition-colors mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Agents
  </Link>

  <div className="flex items-start justify-between">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
        🤖
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Agent</h1>
        <div className="flex items-center gap-3 text-sm text-foreground-muted">
          <span
            className="inline-flex items-center px-2 py-1 rounded-full
                           bg-success/10 text-success border border-success/20 font-medium"
          >
            Active
          </span>
          <span>Last run: 2 minutes ago</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        className="px-4 py-2 text-sm border border-border rounded-lg
                         hover:border-border-hover transition-colors"
      >
        Edit
      </button>
      <button
        className="px-4 py-2 text-sm border border-border rounded-lg
                         hover:border-border-hover transition-colors"
      >
        Duplicate
      </button>
      <button
        className="px-4 py-2 text-sm text-destructive border border-destructive/20 rounded-lg
                         hover:bg-destructive/10 transition-colors"
      >
        Delete
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center border border-border rounded-lg
                         hover:border-border-hover transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  </div>
</header>
```

**Measurements:**

- Icon container: `w-16 h-16` (64px × 64px)
- Title: `text-3xl` (30px)
- Buttons: `px-4 py-2` (16px × 8px)
- Gap: `gap-4` (16px) between icon and text

---

#### 2. Tab Navigation

```jsx
<div className="border-b border-border mb-8">
  <nav className="-mb-px flex gap-6 overflow-x-auto">
    {tabs.map((tab) => (
      <Link
        key={tab.id}
        to={tab.href}
        className={cn(
          "inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-foreground-muted hover:text-foreground hover:border-border",
        )}
      >
        <tab.icon className="w-4 h-4" />
        {tab.label}
        {tab.count && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-background-subtle text-xs">
            {tab.count}
          </span>
        )}
      </Link>
    ))}
  </nav>
</div>
```

**Measurements:**

- Tab padding: `py-3 px-1` (12px × 4px)
- Border: `border-b-2` (2px)
- Gap: `gap-6` (24px) between tabs
- Font size: `text-sm` (14px)

---

#### 3. Content Section

```jsx
<section className="bg-background-elevated border border-border rounded-lg p-6 mb-6">
  <h2 className="text-lg font-semibold text-foreground mb-4">
    About this agent
  </h2>
  <p className="text-foreground-muted leading-relaxed">
    This agent automates sales outreach and follow-ups with personalized
    messaging for leads in your CRM.
  </p>
</section>
```

**Measurements:**

- Section padding: `p-6` (24px)
- Title: `text-lg` (18px)
- Body: `text-base` (16px) with `leading-relaxed` (1.625)
- Section spacing: `mb-6` (24px)

---

## Template 6: Settings/Configuration

**Used by:** `/settings/*`, `/billing/*`, `/admin/*` (15 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ LEFT NAV (240px)               │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ Settings                        │ ┌─ Header ─────────────────────────────┐│
│                                 │ │ Profile Settings                     ││
│ ACCOUNT                         │ │ Manage your personal information     ││
│ • Profile                       │ └──────────────────────────────────────┘│
│ • Security                      │                                          │
│ • Notifications                 │ ┌─ Form Section ───────────────────────┐│
│ • Preferences                   │ │ Personal Information                 ││
│                                 │ │ ──────────────────────────────────  ││
│ WORKSPACE                       │ │                                      ││
│ • General                       │ │ Full Name                            ││
│ • Team Members                  │ │ ┌────────────────────────────────┐  ││
│ • Roles & Permissions           │ │ │ John Doe                       │  ││
│ • Billing                       │ │ └────────────────────────────────┘  ││
│                                 │ │                                      ││
│ DEVELOPER                       │ │ Email Address                        ││
│ • API Keys                      │ │ ┌────────────────────────────────┐  ││
│ • Webhooks                      │ │ │ john@company.com               │  ││
│ • Integrations                  │ │ └────────────────────────────────┘  ││
│                                 │ │                                      ││
│                                 │ │ Profile Photo                        ││
│                                 │ │ ┌──────┐                            ││
│                                 │ │ │ [JD] │ [Upload New] [Remove]     ││
│                                 │ │ └──────┘                            ││
│                                 │ │                                      ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Form Section ───────────────────────┐│
│                                 │ │ Account Preferences                  ││
│                                 │ │ ──────────────────────────────────  ││
│                                 │ │                                      ││
│                                 │ │ ☑ Email notifications                ││
│                                 │ │ ☐ SMS notifications                  ││
│                                 │ │ ☑ Weekly summary emails              ││
│                                 │ │                                      ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Sticky Footer ──────────────────────┐│
│                                 │ │ [Cancel]              [Save Changes] ││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [☰] Settings       [✓]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Page Title ─────────────┐│
│ │ Profile Settings         ││
│ │ Manage your personal     ││
│ │ information              ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Form Section ───────────┐│
│ │ Personal Information     ││
│ │ ──────────────────────── ││
│ │                          ││
│ │ Full Name                ││
│ │ ┌──────────────────────┐││
│ │ │ John Doe             │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ Email Address            ││
│ │ ┌──────────────────────┐││
│ │ │ john@company.com     │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ Profile Photo            ││
│ │ ┌──────┐                ││
│ │ │ [JD] │                ││
│ │ └──────┘                ││
│ │ [Upload New] [Remove]   ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Form Section ───────────┐│
│ │ Account Preferences      ││
│ │ ──────────────────────── ││
│ │ ☑ Email notifications    ││
│ │ ☐ SMS notifications      ││
│ │ ☑ Weekly summary emails  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Actions ────────────────┐│
│ │ [Cancel]  [Save Changes] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Settings Navigation (Left Sidebar)

```jsx
<nav className="w-60 border-r border-border p-6">
  <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>

  {settingsGroups.map((group) => (
    <div key={group.id} className="mb-6">
      <h3 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-2">
        {group.label}
      </h3>
      <ul className="space-y-1">
        {group.items.map((item) => (
          <li key={item.id}>
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground-muted hover:bg-hover hover:text-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ))}
</nav>
```

**Measurements:**

- Nav width: `w-60` (240px)
- Section title: `text-xs uppercase` (12px)
- Nav item: `px-3 py-2` (12px × 8px)
- Icon: `w-4 h-4` (16px × 16px)
- Group spacing: `mb-6` (24px)

---

#### 2. Form Section

```jsx
<div className="bg-background-elevated border border-border rounded-lg p-6 mb-6">
  <h3 className="text-lg font-semibold text-foreground mb-1">
    Personal Information
  </h3>
  <p className="text-sm text-foreground-muted mb-6">
    Update your personal details and how we can reach you
  </p>

  <div className="space-y-6">
    {/* Text Input */}
    <div>
      <label
        htmlFor="fullName"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Full Name
      </label>
      <input
        id="fullName"
        type="text"
        defaultValue="John Doe"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background-subtle
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                   text-foreground placeholder:text-foreground-subtle"
      />
    </div>

    {/* Email Input */}
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Email Address
      </label>
      <input
        id="email"
        type="email"
        defaultValue="john@company.com"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background-subtle
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <p className="mt-2 text-xs text-foreground-muted">
        We'll send important updates to this email
      </p>
    </div>

    {/* File Upload */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Profile Photo
      </label>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center
                        text-lg font-semibold text-primary"
        >
          JD
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm border border-border rounded-lg
                             hover:border-border-hover transition-colors"
          >
            Upload New
          </button>
          <button
            className="px-4 py-2 text-sm text-destructive border border-destructive/20 rounded-lg
                             hover:bg-destructive/10 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Measurements:**

- Section padding: `p-6` (24px)
- Title: `text-lg` (18px)
- Label: `text-sm` (14px)
- Input padding: `px-3 py-2` (12px × 8px)
- Input spacing: `space-y-6` (24px)
- Help text: `text-xs` (12px)
- Avatar: `w-16 h-16` (64px × 64px)

---

#### 3. Checkbox Group

```jsx
<div className="space-y-4">
  {options.map((option) => (
    <label
      key={option.id}
      className="flex items-start gap-3 cursor-pointer group"
    >
      <input
        type="checkbox"
        checked={option.checked}
        onChange={() => toggleOption(option.id)}
        className="mt-0.5 w-5 h-5 rounded border-border text-primary
                   focus:ring-primary focus:ring-offset-0 cursor-pointer"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {option.label}
        </div>
        {option.description && (
          <div className="text-xs text-foreground-muted mt-1">
            {option.description}
          </div>
        )}
      </div>
    </label>
  ))}
</div>
```

**Measurements:**

- Checkbox size: `w-5 h-5` (20px × 20px)
- Gap: `gap-3` (12px)
- Label: `text-sm` (14px)
- Description: `text-xs` (12px)
- Spacing: `space-y-4` (16px)

---

#### 4. Sticky Footer Actions

```jsx
<div className="sticky bottom-0 bg-background border-t border-border p-6 mt-8 -mx-6 -mb-6">
  <div className="flex items-center justify-between max-w-5xl mx-auto">
    <div className="text-sm text-foreground-muted">Unsaved changes</div>
    <div className="flex items-center gap-3">
      <button
        onClick={handleCancel}
        className="px-4 py-2 text-sm border border-border rounded-lg
                   hover:border-border-hover transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg
                   hover:bg-primary-hover transition-colors font-medium"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>
```

**Measurements:**

- Footer padding: `p-6` (24px)
- Button padding: `px-4 py-2` (16px × 8px)
- Gap: `gap-3` (12px)
- Position: `sticky bottom-0`

---

## Responsive Behavior Summary

### Template 4 (List + Filters)

- **Desktop:** Sidebar filters + grid (3-4 cols)
- **Tablet:** Collapsible filters + grid (2 cols)
- **Mobile:** Filter sheet + list view (1 col)

### Template 5 (Detail/Editor)

- **Desktop:** Full header + tabs + 2-col content
- **Tablet:** Full header + tabs + single col
- **Mobile:** Compact header + horizontal scroll tabs + single col

### Template 6 (Settings)

- **Desktop:** Left nav (240px) + content + optional right sidebar
- **Tablet:** Hamburger nav + content
- **Mobile:** Hamburger nav + stacked content + bottom actions

---

## Next Steps

1. **Review Templates 4-6** for accuracy
2. **Proceed to Templates 7-12** (Forms, Auth, Search, Notifications, Mobile, Errors)

---

**Status:** Templates 4-6 complete ✅
