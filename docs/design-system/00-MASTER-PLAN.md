# GalaxyCo.ai Design System Master Plan v1.0

**Last Updated:** October 16, 2025  
**Phase:** 1 - Foundation  
**Owner:** Dalton  
**Status:** Ready for Implementation

---

## Vision & Principles

### Core Vision
Build a professional, modern design system that feels like **Linear meets Stripe**—clean, fast, powerful, but never boring or intimidating.

### Design Principles

1. **Mobile-First, Desktop-Primary**
   - Desktop is where power users do real work
   - Mobile is a companion for quick tasks and AI assistant interactions
   - Progressive enhancement for larger screens

2. **Accessible by Default**
   - WCAG 2.1 AA compliance minimum
   - Keyboard navigation for all interactions
   - Screen reader optimized
   - Color contrast ratios: 4.5:1 (body), 3:1 (large text)

3. **Performance First**
   - 60fps animations (use transform/opacity only)
   - Layout shift prevention (reserve space for dynamic content)
   - Lazy load below-the-fold content
   - Bundle size: <100kb for critical CSS

4. **Consistency Over Cleverness**
   - Reuse patterns aggressively
   - 12 master templates cover 100 pages
   - Predictable layouts reduce cognitive load

5. **Message → Result UX**
   - Bottom nav on mobile for thumb access
   - Clear primary actions
   - Success states always shown
   - Zero dead-ends

---

## Phase Structure

### ✅ Phase 1: Foundation & Wireframes (CURRENT)
**Deliverables:**
- [x] Design token system (colors, typography, spacing)
- [x] 12 master template wireframes
- [x] Component inventory
- [x] Information architecture map
- [x] Implementation checklist

**Timeline:** 1 conversation  
**Status:** COMPLETE

---

### 🔨 Phase 2: Component Library Spec (NEXT)
**Deliverables:**
- [ ] Atomic components (Button, Input, Badge, etc.)
- [ ] Composite components (DataTable, Sidebar, Nav)
- [ ] Props/variants/states per component
- [ ] Accessibility requirements
- [ ] Animation specifications

**Timeline:** 1 conversation  
**Status:** Not started

---

### 📦 Phase 3: Template Implementation Guides
**Deliverables:**
- [ ] Full React + TypeScript code for 12 templates
- [ ] Responsive breakpoints defined
- [ ] Data fetching patterns
- [ ] Loading/error/empty states
- [ ] Framer Motion animation variants

**Timeline:** 1 conversation  
**Status:** Not started

---

### 🗺️ Phase 4: Page Mapping & Variations
**Deliverables:**
- [ ] Map 100 pages to 12 templates
- [ ] Unique variations per page
- [ ] Content requirements
- [ ] API endpoint contracts

**Timeline:** 1 conversation  
**Status:** Not started

---

### 🚀 Phase 5: Implementation Playbook
**Deliverables:**
- [ ] File structure conventions
- [ ] Tailwind config (production-ready)
- [ ] Radix integration guide
- [ ] QA checklist
- [ ] Playwright test templates
- [ ] Visual regression setup

**Timeline:** 1 conversation  
**Status:** Not started

---

## 12 Master Templates (Pattern Library)

### 1. Dashboard Template
**Used by:** `/sales`, `/time-usage`, `/marketing`, `/outreach`, `/analytics`, `/admin`, `/dashboard`, `/reports` (8 pages)

**Structure:**
- Top: KPI card row (4-6 metrics)
- Middle: Visualization section (2-3 charts/graphs)
- Bottom: Data table or activity feed
- Sidebar (optional): Filters, date range picker

**File:** `02-WIREFRAMES-DASHBOARDS.md`

---

### 2. Content Hub Landing
**Used by:** `/resources`, `/docs`, `/templates`, `/university` (4 pages)

**Structure:**
- Hero: Title + search bar
- Category grid: 4-6 cards with icons
- Featured content carousel
- CTA footer

**File:** `02-WIREFRAMES-DASHBOARDS.md`

---

### 3. Documentation/Article View
**Used by:** `/docs/*`, `/help/articles/[id]`, `/company/blog/[slug]` (10 pages)

**Structure:**
- Left sidebar: Table of contents (sticky)
- Main: Prose content area
- Right sidebar: "On this page" + related links
- Bottom: Prev/Next navigation

**File:** `02-WIREFRAMES-DASHBOARDS.md`

---

### 4. List + Filters
**Used by:** `/agents`, `/workflows`, `/templates/*`, `/marketplace`, `/prospects`, `/emails/campaigns`, `/integrations`, `/support/tickets` (25 pages)

**Structure:**
- Top bar: Search + filters + view toggle + "New" button
- Sidebar: Category filters (collapsible)
- Main: Card grid or table rows
- Pagination or infinite scroll

**File:** `03-WIREFRAMES-CONTENT.md`

---

### 5. Detail/Editor View
**Used by:** `/agents/[id]`, `/workflows/[workflowId]`, `/marketplace/[packId]`, `/prospects/[id]`, `/reports/[reportId]` (20 pages)

**Structure:**
- Header: Breadcrumb, title, action buttons
- Tabs: Overview, Settings, Analytics, Logs
- Main: Tab content
- Sidebar (optional): Metadata, activity log

**File:** `03-WIREFRAMES-CONTENT.md`

---

### 6. Settings/Configuration
**Used by:** `/settings/*`, `/billing/*`, `/admin/*` (15 pages)

**Structure:**
- Left sidebar: Settings nav (grouped)
- Main: Form sections with dividers
- Right sidebar (optional): Help text
- Bottom: Save/Cancel (sticky on scroll)

**File:** `03-WIREFRAMES-CONTENT.md`

---

### 7. Form/Wizard Flow
**Used by:** `/onboarding`, `/packs/create`, `/reports/create`, `/support/tickets/new`, `/prospects/import` (8 pages)

**Structure:**
- Progress indicator (stepper or progress bar)
- Form sections (collapsible or paginated)
- Back/Next buttons (bottom-right)
- Auto-save indicator (top-right)

**File:** `04-WIREFRAMES-DATA.md`

---

### 8. Authentication
**Used by:** `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password` (5 pages)

**Structure:**
- Centered card (max-w-md)
- Logo + headline
- Form fields + submit button
- Footer links

**File:** `05-WIREFRAMES-FORMS-AUTH.md`

---

### 9. Error Pages
**Used by:** `/404`, `/500`, `/403`, `/maintenance`, `/error` (5 pages)

**Structure:**
- Centered content (icon + status + message)
- Action button
- Minimal layout (no nav/footer)

**File:** `04-WIREFRAMES-DATA.md`

---

### 10. Search/Results
**Used by:** `/search`, `/help/search`, `/marketplace/categories/[category]` (3 pages)

**Structure:**
- Search bar (pre-filled)
- Faceted filters (left sidebar)
- Result cards (grouped by type)
- Pagination

**File:** `04-WIREFRAMES-DATA.md`

---

### 11. Notification Center
**Used by:** `/notifications`, `/activity` (2 pages)

**Structure:**
- Timeline layout (chronological)
- Filter tabs (All, Unread, @Mentions)
- Grouped by date
- Mark all read button

**File:** `05-WIREFRAMES-FORMS-AUTH.md`

---

### 12. Mobile Companion Views
**Used by:** `/m/dashboard`, `/m/agents`, `/m/notifications` (3 pages)

**Structure:**
- Bottom nav (4-5 items)
- Chat interface (message → result)
- Minimal chrome
- Voice input button

**File:** `05-WIREFRAMES-FORMS-AUTH.md`

---

## Tech Stack Reference

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS 3.4+
- **Components:** Radix UI (primitives)
- **Animation:** Framer Motion
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Router:** Wouter

### Component Libraries (Accelerators)
- **shadcn/ui:** Core component library (copy-paste, owned by us)
- **Tailwind UI:** Template accelerator (optional, $299)
- **Tremor:** Dashboard charts (free, open-source)

### Design Tokens
- See `01-DESIGN-TOKENS.md` for complete specification

---

## Implementation Handoff Checklist

### Before Handing to Warp AI
- [x] All design tokens defined in Tailwind config format
- [x] All 12 wireframes annotated with exact measurements
- [x] Component inventory complete with atomic breakdown
- [x] Accessibility requirements specified per pattern
- [x] Responsive behavior documented (mobile-first)
- [x] Animation timing specified (Framer Motion)
- [ ] Phase 2 complete (component specs)
- [ ] Phase 3 complete (template code)
- [ ] Phase 4 complete (page mapping)
- [ ] Phase 5 complete (playbook)

### Warp AI Receives
- This master plan
- All supporting documents (tokens, wireframes, components, IA)
- Tailwind config (copy-paste ready)
- Component TypeScript interfaces
- File structure conventions
- QA checklist

---

## Success Metrics

### Design Quality
- [ ] Zero spacing inconsistencies across pages
- [ ] All interactive elements have hover/active/disabled states
- [ ] Color contrast passes WCAG AA (4.5:1 minimum)
- [ ] Typography scale used consistently (no one-off sizes)

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### Developer Experience
- [ ] Components reusable across templates
- [ ] Prop interfaces clear and typed
- [ ] No magic numbers (all values from design tokens)
- [ ] Dark mode works without visual bugs

---

## Glossary

**Design Token:** A named variable for a design decision (e.g., `spacing-4` = `16px`)  
**Master Template:** A reusable page layout pattern (e.g., Dashboard Template)  
**Atomic Component:** A smallest UI unit (e.g., Button, Badge)  
**Composite Component:** A combination of atomic components (e.g., DataTable = Table + Pagination + Search)  
**Prose Content:** Long-form text content (articles, docs) styled with Tailwind Typography plugin

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Oct 16, 2025 | Initial master plan created | Claude |

---

## Next Actions

1. **You (Dalton):** Review this master plan + all supporting docs
2. **Feedback window:** Suggest any adjustments to colors, templates, or approach
3. **Approval:** Reply "approved" or "ship Phase 2"
4. **Next conversation:** Start Phase 2 (Component Library Spec) with this doc uploaded

---

**Status:** Ready for review 🚀
