# Wireframes: Dashboard & Content Templates

**Templates covered:** 1-3  
**Pages:** 22 total

---

## Template 1: Dashboard

**Used by:** `/sales`, `/time-usage`, `/marketing`, `/outreach`, `/analytics`, `/admin`, `/dashboard`, `/reports` (8 pages)

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Header ─────────────────────────────┐│
│                                 │ │ Dashboard Title         [Filter] [⚙]││
│ • Dashboard                     │ │ Last updated: 2 min ago              ││
│ • Analytics                     │ └──────────────────────────────────────┘│
│ • Reports                       │                                          │
│ • Settings                      │ ┌─ KPI Cards Row ─────────────────────┐│
│                                 │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───┐││
│                                 │ │ │ 1.2K  │ │ $45K  │ │ 89%   │ │+12│││
│                                 │ │ │ Users │ │Revenue│ │ Conv. │ │%  │││
│                                 │ │ │ ↑ 8%  │ │ ↑ 15% │ │ ↓ 2%  │ │   │││
│                                 │ │ └───────┘ └───────┘ └───────┘ └───┘││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Visualization Row ─────────────────┐│
│                                 │ │ ┌─────────────────┐ ┌─────────────┐││
│                                 │ │ │                 │ │             │││
│                                 │ │ │  Line Chart     │ │  Bar Chart  │││
│                                 │ │ │  (Revenue)      │ │  (Sources)  │││
│                                 │ │ │                 │ │             │││
│                                 │ │ │                 │ │             │││
│                                 │ │ └─────────────────┘ └─────────────┘││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Data Table / Activity Feed ────────┐│
│                                 │ │ Recent Activity              [Export]││
│                                 │ │ ─────────────────────────────────── ││
│                                 │ │ • User signed up (2m ago)           ││
│                                 │ │ • Payment received $299 (5m ago)    ││
│                                 │ │ • Agent deployed (12m ago)          ││
│                                 │ │ • Error reported (15m ago)          ││
│                                 │ │ ─────────────────────────────────── ││
│                                 │ │ [View All Activity →]               ││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [☰] Dashboard      [⚙]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ KPI Cards (Scroll) ────┐│
│ │ ┌────────┐ ┌────────┐   ││
│ │ │ 1.2K   │ │ $45K   │ →││
│ │ │ Users  │ │Revenue │   ││
│ │ │ ↑ 8%   │ │ ↑ 15%  │   ││
│ │ └────────┘ └────────┘   ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Chart (Full Width) ────┐│
│ │                          ││
│ │   Line Chart             ││
│ │   (Revenue Trend)        ││
│ │                          ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Activity Feed ──────────┐│
│ │ Recent Activity          ││
│ │ ──────────────────────── ││
│ │ • User signed up (2m)    ││
│ │ • Payment received (5m)  ││
│ │ [View All →]             ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. KPI Card
```jsx
<div className="bg-background-elevated border border-border rounded-lg p-6 hover:border-border-hover transition-colors duration-fast">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-foreground-muted">Total Users</span>
    <TrendingUp className="w-4 h-4 text-success" />
  </div>
  <div className="text-3xl font-semibold text-foreground">1,234</div>
  <div className="flex items-center gap-1 mt-2">
    <ArrowUp className="w-3 h-3 text-success" />
    <span className="text-sm text-success">8% vs last month</span>
  </div>
</div>
```

**Measurements:**
- Card padding: `p-6` (24px)
- Border radius: `rounded-lg` (16px)
- Metric size: `text-3xl` (30px)
- Label size: `text-sm` (14px)
- Spacing: `gap-4` (16px) between cards

**States:**
- Default: `border-border`
- Hover: `border-border-hover`
- Positive trend: Green arrow + text
- Negative trend: Red arrow + text

---

#### 2. Chart Container
```jsx
<div className="bg-background-elevated border border-border rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-foreground">Revenue Over Time</h3>
    <select className="text-sm border border-border rounded px-2 py-1">
      <option>Last 7 days</option>
      <option>Last 30 days</option>
      <option>Last 90 days</option>
    </select>
  </div>
  <div className="h-64">
    {/* Tremor Chart Component */}
    <LineChart {...} />
  </div>
</div>
```

**Measurements:**
- Container padding: `p-6` (24px)
- Chart height: `h-64` (256px) for compact, `h-80` (320px) for full
- Title size: `text-lg` (18px)
- Header margin: `mb-4` (16px)

---

#### 3. Activity Feed
```jsx
<div className="bg-background-elevated border border-border rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
    <button className="text-sm text-primary hover:text-primary-hover">
      Export
    </button>
  </div>
  <div className="space-y-3">
    {activities.map(activity => (
      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{activity.description}</p>
          <p className="text-xs text-foreground-muted mt-1">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Measurements:**
- Item spacing: `space-y-3` (12px)
- Icon container: `w-8 h-8` (32px × 32px)
- Text size: `text-sm` (14px)
- Timestamp: `text-xs` (12px)

---

### Responsive Breakpoints

```css
/* Mobile: Stacked layout */
@media (max-width: 767px) {
  - KPI cards: 2 per row
  - Charts: Full width, stacked
  - Tables: Horizontal scroll or card view
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  - KPI cards: 3 per row
  - Charts: 2 per row
  - Sidebar: Collapsible (hamburger)
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  - KPI cards: 4 per row
  - Charts: 2 per row (8-col + 4-col grid)
  - Sidebar: Fixed 240px
}
```

---

## Template 2: Content Hub Landing

**Used by:** `/resources`, `/docs`, `/templates`, `/university` (4 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Hero Section ──────────────────────┐│
│                                 │ │                                      ││
│ • Home                          │ │   📚 Resource Library                ││
│ • Documentation                 │ │   Your central hub for templates,    ││
│ • Templates                     │ │   guides, and workflows              ││
│ • University                    │ │                                      ││
│ • Support                       │ │   ┌───────────────────────────────┐ ││
│                                 │ │   │ 🔍 Search resources...       │ ││
│                                 │ │   └───────────────────────────────┘ ││
│                                 │ │                                      ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Category Grid ─────────────────────┐│
│                                 │ │ ┌────────────┐ ┌────────────┐ ┌────┐││
│                                 │ │ │ 📄         │ │ 🔧         │ │ 🤖 │││
│                                 │ │ │ Documents  │ │ Workflows  │ │Agen│││
│                                 │ │ │ 24 items   │ │ 18 items   │ │12  │││
│                                 │ │ └────────────┘ └────────────┘ └────┘││
│                                 │ │ ┌────────────┐ ┌────────────┐ ┌────┐││
│                                 │ │ │ ✉️         │ │ 📊         │ │ 📚 │││
│                                 │ │ │ Emails     │ │ Reports    │ │Guid│││
│                                 │ │ │ 31 items   │ │ 9 items    │ │15  │││
│                                 │ │ └────────────┘ └────────────┘ └────┘││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Featured Content ──────────────────┐│
│                                 │ │ Featured Resources                   ││
│                                 │ │ ─────────────────────────────────── ││
│                                 │ │ [< Carousel >]                       ││
│                                 │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐││
│                                 │ │ │ Getting │ │ API     │ │ Best    │││
│                                 │ │ │ Started │ │ Guide   │ │Practice │││
│                                 │ │ └─────────┘ └─────────┘ └─────────┘││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [☰] Resources      [🔍] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Hero ───────────────────┐│
│ │  📚 Resource Library     ││
│ │  Your central hub        ││
│ │                          ││
│ │  ┌─────────────────────┐││
│ │  │ 🔍 Search...       │││
│ │  └─────────────────────┘││
│ └──────────────────────────┘│
│                             │
│ ┌─ Categories (2-col) ─────┐│
│ │ ┌──────┐   ┌──────┐     ││
│ │ │ 📄   │   │ 🔧   │     ││
│ │ │ Docs │   │Works │     ││
│ │ │ 24   │   │ 18   │     ││
│ │ └──────┘   └──────┘     ││
│ │ ┌──────┐   ┌──────┐     ││
│ │ │ 🤖   │   │ ✉️   │     ││
│ │ │Agents│   │Email │     ││
│ │ │ 12   │   │ 31   │     ││
│ │ └──────┘   └──────┘     ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Featured (Scroll) ──────┐│
│ │ Featured Resources       ││
│ │ ──────────────────────── ││
│ │ ┌────┐ ┌────┐ ┌────┐    ││
│ │ │ 1  │ │ 2  │ │ 3  │ → ││
│ │ └────┘ └────┘ └────┘    ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Hero Section
```jsx
<div className="bg-gradient-to-br from-primary/10 to-background rounded-xl p-12 mb-8">
  <div className="max-w-2xl">
    <h1 className="text-4xl font-bold text-foreground mb-4">
      📚 Resource Library
    </h1>
    <p className="text-lg text-foreground-muted mb-6">
      Your central hub for templates, guides, and workflows
    </p>
    <div className="relative">
      <input
        type="search"
        placeholder="Search resources..."
        className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-background-elevated
                   focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
    </div>
  </div>
</div>
```

**Measurements:**
- Padding: `p-12` (48px) desktop, `p-6` (24px) mobile
- Title: `text-4xl` (36px)
- Description: `text-lg` (18px)
- Search input: `py-3` (12px vertical)
- Border radius: `rounded-xl` (24px)

---

#### 2. Category Card
```jsx
<Link
  to={category.href}
  className="block bg-background-elevated border border-border rounded-lg p-6
             hover:border-primary hover:shadow-md transition-all duration-fast
             group"
>
  <div className="text-4xl mb-3">{category.icon}</div>
  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary">
    {category.title}
  </h3>
  <p className="text-sm text-foreground-muted">
    {category.count} items
  </p>
</Link>
```

**Grid Layout:**
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {categories.map(category => <CategoryCard {...} />)}
</div>
```

**Measurements:**
- Card padding: `p-6` (24px)
- Icon size: `text-4xl` (36px emoji or icon)
- Title: `text-lg` (18px)
- Count: `text-sm` (14px)
- Grid gap: `gap-4` (16px)
- Grid: 2 cols mobile, 3 cols desktop

---

#### 3. Featured Carousel
```jsx
<div className="bg-background-elevated border border-border rounded-lg p-6">
  <h2 className="text-xl font-semibold text-foreground mb-4">
    Featured Resources
  </h2>
  <div className="relative">
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
      {featured.map(item => (
        <div key={item.id} className="flex-shrink-0 w-72 snap-start">
          <div className="bg-background border border-border rounded-lg p-4 hover:border-primary transition-colors">
            <img src={item.thumbnail} className="w-full h-40 object-cover rounded mb-3" />
            <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-foreground-muted">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
    <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                       w-10 h-10 rounded-full bg-background-elevated shadow-lg">
      <ChevronLeft className="w-5 h-5" />
    </button>
    <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                       w-10 h-10 rounded-full bg-background-elevated shadow-lg">
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
</div>
```

**Measurements:**
- Carousel item width: `w-72` (288px)
- Item gap: `gap-4` (16px)
- Thumbnail height: `h-40` (160px)
- Navigation buttons: `w-10 h-10` (40px × 40px)

---

## Template 3: Documentation/Article View

**Used by:** `/docs/*`, `/help/articles/[id]`, `/company/blog/[slug]` (10 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR (240px)  │ MAIN CONTENT (flex-1)        │ RIGHT SIDEBAR   │
│                       │                               │ (240px)         │
│ Table of Contents     │ ┌─ Breadcrumb ──────────────┐│                 │
│ (Sticky)              │ │ Docs > Getting Started    ││ On This Page    │
│                       │ └───────────────────────────┘│ (Sticky)        │
│ • Getting Started     │                               │                 │
│   - Installation      │ # Getting Started             │ - Prerequisites │
│   - Quick Start       │                               │ - Installation  │
│   - Configuration     │ Welcome to GalaxyCo.ai! This  │ - Configuration │
│                       │ guide will help you get up    │ - Next Steps    │
│ • Core Concepts       │ and running in minutes.       │                 │
│   - Agents            │                               │ ───────────────│
│   - Workflows         │ ## Prerequisites              │                 │
│   - Integrations      │                               │ Related Links   │
│                       │ Before you begin, ensure you  │                 │
│ • API Reference       │ have the following:           │ • API Reference │
│   - Authentication    │                               │ • Examples      │
│   - Endpoints         │ - Node.js 18+                 │ • Community     │
│   - Webhooks          │ - npm or yarn                 │                 │
│                       │ - API key (sign up)           │                 │
│ • Guides              │                               │                 │
│   - Best Practices    │ ## Installation               │                 │
│   - Troubleshooting   │                               │                 │
│                       │ ```bash                       │                 │
│                       │ npm install @galaxyco/sdk     │                 │
│                       │ ```                           │                 │
│                       │                               │                 │
│                       │ [Continue reading...]         │                 │
│                       │                               │                 │
│                       │ ┌─ Bottom Nav ───────────────┐│                 │
│                       │ │ ← Previous  |  Next →     ││                 │
│                       │ │ Quick Start | Configuration││                 │
│                       │ └───────────────────────────┘│                 │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [☰] Docs           [🔍] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Breadcrumb ─────────────┐│
│ │ Docs > Getting Started  ││
│ └──────────────────────────┘│
│                             │
│ # Getting Started           │
│                             │
│ Welcome to GalaxyCo.ai!     │
│ This guide will help you    │
│ get up and running in       │
│ minutes.                    │
│                             │
│ ## Prerequisites            │
│                             │
│ Before you begin, ensure    │
│ you have:                   │
│                             │
│ - Node.js 18+               │
│ - npm or yarn               │
│ - API key (sign up)         │
│                             │
│ ## Installation             │
│                             │
│ ```bash                     │
│ npm install @galaxyco/sdk   │
│ ```                         │
│                             │
│ [Continue reading...]       │
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ ← Previous  |  Next →   ││
│ │ Quick Start | Config    ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Table of Contents (Left Sidebar)
```jsx
<nav className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-6 border-r border-border">
  <h3 className="text-sm font-semibold text-foreground mb-4">Table of Contents</h3>
  <ul className="space-y-1">
    {sections.map(section => (
      <li key={section.id}>
        <Link
          to={section.href}
          className={cn(
            "block px-3 py-2 rounded text-sm transition-colors duration-fast",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground-muted hover:bg-hover hover:text-foreground"
          )}
        >
          {section.title}
        </Link>
        {section.subsections && (
          <ul className="ml-4 mt-1 space-y-1">
            {section.subsections.map(sub => (
              <li key={sub.id}>
                <Link {...} className="text-xs">
                  {sub.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
</nav>
```

**Measurements:**
- Sticky top: `top-20` (80px, accounts for header)
- Item padding: `px-3 py-2` (12px × 8px)
- Font size: `text-sm` (14px) for main, `text-xs` (12px) for subsections
- Spacing: `space-y-1` (4px between items)

---

#### 2. Prose Content Area
```jsx
<article className="prose prose-invert max-w-3xl mx-auto px-6 py-8">
  <Breadcrumb items={breadcrumbs} />
  
  <h1>{article.title}</h1>
  
  <div className="text-sm text-foreground-muted mb-8 flex items-center gap-4">
    <span>Last updated: {article.updatedAt}</span>
    <span>•</span>
    <span>{article.readTime} min read</span>
  </div>
  
  <div dangerouslySetInnerHTML={{ __html: article.content }} />
  
  <footer className="mt-12 pt-8 border-t border-border">
    <div className="flex items-center justify-between">
      {article.previous && (
        <Link to={article.previous.href} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          <div>
            <div className="text-xs text-foreground-muted">Previous</div>
            <div className="font-medium">{article.previous.title}</div>
          </div>
        </Link>
      )}
      {article.next && (
        <Link to={article.next.href} className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-foreground-muted">Next</div>
            <div className="font-medium">{article.next.title}</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  </footer>
</article>
```

**Measurements:**
- Max width: `max-w-3xl` (768px) for readability
- Padding: `px-6 py-8` (24px × 32px)
- Prose styling: Tailwind Typography plugin
- Footer margin: `mt-12` (48px)

---

#### 3. On This Page (Right Sidebar)
```jsx
<aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-6 border-l border-border">
  <h3 className="text-sm font-semibold text-foreground mb-4">On This Page</h3>
  <ul className="space-y-2">
    {headings.map(heading => (
      <li key={heading.id}>
        <a
          href={`#${heading.id}`}
          className={cn(
            "block text-sm transition-colors duration-fast",
            activeHeading === heading.id
              ? "text-primary font-medium"
              : "text-foreground-muted hover:text-foreground",
            heading.level === 3 && "ml-4"
          )}
        >
          {heading.text}
        </a>
      </li>
    ))}
  </ul>
  
  <div className="mt-8 pt-8 border-t border-border">
    <h3 className="text-sm font-semibold text-foreground mb-4">Related Links</h3>
    <ul className="space-y-2">
      {relatedLinks.map(link => (
        <li key={link.id}>
          <Link to={link.href} className="text-sm text-primary hover:text-primary-hover">
            {link.title} →
          </Link>
        </li>
      ))}
    </ul>
  </div>
</aside>
```

**Measurements:**
- Font size: `text-sm` (14px)
- Spacing: `space-y-2` (8px)
- Nested indent: `ml-4` (16px) for H3 headings
- Section divider: `mt-8 pt-8` (32px)

---

### Responsive Behavior

**Desktop (1024px+):**
- Three-column layout: Left TOC (240px) + Content (flex) + Right sidebar (240px)
- Both sidebars sticky

**Tablet (768px - 1023px):**
- Two-column: Content + Right sidebar (collapsible)
- Left TOC accessible via hamburger menu

**Mobile (< 768px):**
- Single column: Content only
- TOC in hamburger drawer
- On This Page in accordion above content

---

## Next Steps

1. **Review wireframes** for accuracy
2. **Proceed to Template 4-6** (List, Detail, Settings views)
3. **Continue to Templates 7-12** for forms, auth, search patterns

---

**Status:** Templates 1-3 complete ✅
