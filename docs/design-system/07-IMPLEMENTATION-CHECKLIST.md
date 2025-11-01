# Implementation Checklist

**Purpose:** Step-by-step guide for implementing the complete design system with Warp AI.

---

## Pre-Implementation Setup

### ✅ Environment Setup

- [ ] Create new Vite + React + TypeScript project
- [ ] Install Tailwind CSS 3.4+
- [ ] Install shadcn/ui CLI
- [ ] Install Radix UI primitives
- [ ] Install Framer Motion
- [ ] Install Lucide React icons
- [ ] Install React Hook Form + Zod
- [ ] Install TanStack Query
- [ ] Install Zustand (state management)
- [ ] Install Wouter (routing)

### ✅ Configuration Files

- [ ] Copy Tailwind config from `01-DESIGN-TOKENS.md`
- [ ] Create `tsconfig.json` with path aliases
- [ ] Create `.prettierrc` and `.eslintrc`
- [ ] Set up `vite.config.ts`
- [ ] Add font imports to `index.html` (Inter, JetBrains Mono)

---

## Phase 1: Design Tokens & Base Styles

### Step 1.1: Implement Tailwind Config

**File:** `tailwind.config.js`

```bash
# Copy complete config from 01-DESIGN-TOKENS.md
# Ensure all custom colors, fonts, spacing defined
```

**Verification:**

- [ ] Run `npm run dev` without errors
- [ ] Test dark mode toggle
- [ ] Verify custom colors in browser DevTools

---

### Step 1.2: Create Global Styles

**File:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 4%;
    --foreground: 0 0% 98%;
    /* ... other CSS vars from tokens doc */
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      'rlig' 1,
      'calt' 1;
  }
}
```

**Verification:**

- [ ] Dark background renders
- [ ] Inter font loads correctly
- [ ] No FOUC (flash of unstyled content)

---

### Step 1.3: Set Up Utils

**File:** `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Verification:**

- [ ] No TypeScript errors
- [ ] Can import `cn` from `@/lib/utils`

---

## Phase 2: Atomic Components (Atoms)

### Step 2.1: Install shadcn/ui Components

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add skeleton
```

**Verification:**

- [ ] All components in `src/components/ui/`
- [ ] Can render `<Button>` without errors
- [ ] Tailwind classes apply correctly

---

### Step 2.2: Customize Atomic Components

Update each component to match design tokens:

**Button variants:**

- [ ] Primary matches `bg-primary`
- [ ] Secondary matches `bg-secondary`
- [ ] Destructive matches `bg-destructive`
- [ ] Ghost has no background
- [ ] Outline has `border-border`

**Input states:**

- [ ] Focus ring is `ring-primary`
- [ ] Error state is `border-destructive`
- [ ] Disabled has `opacity-50`

**Verification:**

- [ ] Create test page with all variants
- [ ] Check states (hover, focus, active, disabled)
- [ ] Verify accessibility (keyboard nav, focus visible)

---

## Phase 3: Molecular Components

### Step 3.1: Form Components

**Files to create:**

- [ ] `src/components/ui/form-field.tsx`
- [ ] `src/components/ui/password-input.tsx`
- [ ] `src/components/ui/search-input.tsx`
- [ ] `src/components/ui/tag-input.tsx`

**Reference:** Component specs in `05-COMPONENT-INVENTORY.md`

**Verification:**

- [ ] FormField shows label, input, error message
- [ ] PasswordInput toggles visibility on click
- [ ] SearchInput has search icon
- [ ] TagInput adds/removes tags

---

### Step 3.2: Navigation Components

**Files to create:**

- [ ] `src/components/ui/breadcrumb.tsx`
- [ ] `src/components/ui/tabs.tsx` (or use shadcn)
- [ ] `src/components/ui/pagination.tsx`

**Verification:**

- [ ] Breadcrumb renders with separators
- [ ] Tabs switch content on click
- [ ] Pagination updates page number

---

### Step 3.3: Content Components

**Files to create:**

- [ ] `src/components/ui/kpi-card.tsx`
- [ ] `src/components/ui/empty-state.tsx`
- [ ] `src/components/ui/stat-card.tsx`

**Reference:** Wireframes in `02-WIREFRAMES-DASHBOARDS.md`

**Verification:**

- [ ] KPI card shows metric, label, trend
- [ ] Empty state shows icon, message, CTA
- [ ] Stat card renders value and label

---

## Phase 4: Organism Components

### Step 4.1: Layout Organisms

**Files to create:**

- [ ] `src/components/organisms/sidebar.tsx`
- [ ] `src/components/organisms/top-nav.tsx`
- [ ] `src/components/organisms/bottom-nav.tsx`
- [ ] `src/components/organisms/mobile-menu.tsx`

**Reference:** Navigation structure in `06-INFORMATION-ARCHITECTURE.md`

**Verification:**

- [ ] Sidebar renders with all nav groups
- [ ] TopNav shows search, notifications, user menu
- [ ] BottomNav fixed at bottom on mobile
- [ ] MobileMenu slides in from left

---

### Step 4.2: Data Display Organisms

**Files to create:**

- [ ] `src/components/organisms/data-table.tsx`
- [ ] `src/components/organisms/card-grid.tsx`
- [ ] `src/components/organisms/activity-feed.tsx`
- [ ] `src/components/organisms/notification-list.tsx`

**Reference:** Component specs in `05-COMPONENT-INVENTORY.md`

**Verification:**

- [ ] DataTable sorts columns on click
- [ ] DataTable paginates correctly
- [ ] CardGrid switches to list view
- [ ] ActivityFeed groups by date

---

### Step 4.3: Modal/Overlay Organisms

**Install shadcn components:**

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add toast
```

**Verification:**

- [ ] Modal opens with animation
- [ ] Modal closes on ESC or overlay click
- [ ] Sheet slides from right/bottom
- [ ] Toast appears and auto-dismisses

---

## Phase 5: Template Layouts

### Step 5.1: Create Layout Components

**Files to create:**

- [ ] `src/components/templates/dashboard-layout.tsx`
- [ ] `src/components/templates/auth-layout.tsx`
- [ ] `src/components/templates/settings-layout.tsx`
- [ ] `src/components/templates/content-layout.tsx`

**Structure example (Dashboard):**

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TopNav />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

**Verification:**

- [ ] Sidebar fixed on left (desktop)
- [ ] Main content scrolls independently
- [ ] Layout responsive (mobile = bottom nav)

---

### Step 5.2: Implement 12 Master Templates

#### Template 1: Dashboard

**File:** `src/pages/dashboard.tsx`

**Reference:** `02-WIREFRAMES-DASHBOARDS.md`

**Components needed:**

- [ ] KPI card row (4 cards)
- [ ] Chart section (Tremor charts)
- [ ] Activity feed or data table

**Verification:**

- [ ] KPI cards display correctly
- [ ] Charts render data
- [ ] Activity feed shows recent items

---

#### Template 2: Content Hub Landing

**File:** `src/pages/resources.tsx`

**Reference:** `02-WIREFRAMES-DASHBOARDS.md`

**Components needed:**

- [ ] Hero section with search
- [ ] Category grid (6 cards)
- [ ] Featured carousel

**Verification:**

- [ ] Search input functional
- [ ] Categories clickable
- [ ] Carousel scrolls horizontally

---

#### Template 3: Documentation/Article View

**File:** `src/pages/docs/[slug].tsx`

**Reference:** `02-WIREFRAMES-DASHBOARDS.md`

**Components needed:**

- [ ] Left TOC sidebar (sticky)
- [ ] Prose content area
- [ ] Right "On This Page" sidebar
- [ ] Prev/Next navigation

**Verification:**

- [ ] TOC highlights current section
- [ ] Prose styles apply (Tailwind Typography)
- [ ] Prev/Next buttons work

---

#### Template 4: List + Filters

**File:** `src/pages/agents.tsx`

**Reference:** `03-WIREFRAMES-CONTENT.md`

**Components needed:**

- [ ] Filter sidebar (collapsible)
- [ ] Search + view toggle bar
- [ ] Card grid or table view
- [ ] Pagination

**Verification:**

- [ ] Filters update results
- [ ] Search works
- [ ] View toggle switches layout
- [ ] Pagination changes page

---

#### Template 5: Detail/Editor View

**File:** `src/pages/agents/[id].tsx`

**Reference:** `03-WIREFRAMES-CONTENT.md`

**Components needed:**

- [ ] Header with breadcrumb, title, actions
- [ ] Tab navigation
- [ ] Content sections
- [ ] Optional sidebar

**Verification:**

- [ ] Tabs switch content
- [ ] Actions (Edit, Delete) work
- [ ] Metadata sidebar renders

---

#### Template 6: Settings/Configuration

**File:** `src/pages/settings/profile.tsx`

**Reference:** `03-WIREFRAMES-CONTENT.md`

**Components needed:**

- [ ] Left settings nav
- [ ] Form sections
- [ ] Sticky footer actions

**Verification:**

- [ ] Settings nav highlights active page
- [ ] Form validates on submit
- [ ] Save button updates data
- [ ] Cancel button resets form

---

#### Template 7: Form/Wizard Flow

**File:** `src/pages/onboarding.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Progress stepper
- [ ] Form sections per step
- [ ] Back/Next buttons
- [ ] Auto-save indicator

**Verification:**

- [ ] Stepper updates on next/back
- [ ] Form validates before proceeding
- [ ] Data persists between steps
- [ ] Auto-save works

---

#### Template 8: Authentication

**File:** `src/pages/login.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Centered card
- [ ] Email + password inputs
- [ ] Remember me checkbox
- [ ] OAuth buttons
- [ ] Footer links

**Verification:**

- [ ] Form submits on Enter
- [ ] Password toggle works
- [ ] OAuth buttons redirect
- [ ] Links navigate correctly

---

#### Template 9: Error Pages

**File:** `src/pages/404.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Icon/emoji
- [ ] Error code + title
- [ ] Message
- [ ] Action buttons

**Verification:**

- [ ] Page renders centered
- [ ] Buttons navigate home
- [ ] Works for 404, 500, 403, etc.

---

#### Template 10: Search/Results

**File:** `src/pages/search.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Search input (pre-filled)
- [ ] Filter sidebar
- [ ] Results grouped by type
- [ ] Pagination

**Verification:**

- [ ] Search updates results
- [ ] Filters work
- [ ] Results highlight matches
- [ ] "No results" state shows

---

#### Template 11: Notification Center

**File:** `src/pages/notifications.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Tab filters (All, Unread, @Mentions)
- [ ] Timeline grouped by date
- [ ] Notification items
- [ ] Mark all read button

**Verification:**

- [ ] Tabs filter notifications
- [ ] Clicking item marks as read
- [ ] Mark all read works
- [ ] Unread dot shows

---

#### Template 12: Mobile Companion Views

**File:** `src/pages/m/dashboard.tsx`

**Reference:** `04-WIREFRAMES-DATA.md`

**Components needed:**

- [ ] Chat interface
- [ ] Message bubbles (user + AI)
- [ ] Quick reply chips
- [ ] Input with voice button
- [ ] Bottom nav

**Verification:**

- [ ] Messages append on send
- [ ] Quick replies work
- [ ] Voice button shows (UI only)
- [ ] Bottom nav fixed

---

## Phase 6: Routing & Navigation

### Step 6.1: Set Up Router

**File:** `src/App.tsx`

```tsx
import { Route, Switch } from 'wouter';

function App() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agents" component={AgentsList} />
      <Route path="/agents/:id" component={AgentDetail} />
      {/* ... all 100 routes */}
      <Route component={NotFound} />
    </Switch>
  );
}
```

**Verification:**

- [ ] All routes render correct component
- [ ] Dynamic routes work (`:id`, `:slug`)
- [ ] 404 catches unmatched routes

---

### Step 6.2: Implement Navigation

**File:** `src/components/organisms/sidebar.tsx`

**Reference:** `06-INFORMATION-ARCHITECTURE.md`

**Groups:**

- [ ] Workspace (Dashboard, Sales, etc.)
- [ ] Automation (Agents, Workflows)
- [ ] Contacts (Prospects, Emails)
- [ ] Insights (Analytics, Reports)
- [ ] Resources (Library, Docs, University, Marketplace)

**Verification:**

- [ ] Active route highlights
- [ ] Groups collapse/expand
- [ ] All links navigate correctly

---

## Phase 7: State Management

### Step 7.1: Set Up Zustand Stores

**Files to create:**

- [ ] `src/stores/auth-store.ts` (user, session)
- [ ] `src/stores/ui-store.ts` (sidebar open, theme)
- [ ] `src/stores/filter-store.ts` (filters, search)

**Example (UI Store):**

```typescript
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

**Verification:**

- [ ] Sidebar toggle works
- [ ] Theme persists in localStorage
- [ ] State shared across components

---

### Step 7.2: Set Up TanStack Query

**File:** `src/lib/query-client.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

**Verification:**

- [ ] Wrap app in `QueryClientProvider`
- [ ] Can use `useQuery` in components
- [ ] Cache works (check DevTools)

---

## Phase 8: Data Fetching & API Integration

### Step 8.1: Create API Client

**File:** `src/lib/api-client.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

**Verification:**

- [ ] Fetcher works with mock API
- [ ] Errors handled gracefully
- [ ] Can pass auth headers

---

### Step 8.2: Create Query Hooks

**Files to create:**

- [ ] `src/hooks/use-agents.ts`
- [ ] `src/hooks/use-workflows.ts`
- [ ] `src/hooks/use-analytics.ts`

**Example:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => fetcher('/agents'),
  });
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agents', id],
    queryFn: () => fetcher(`/agents/${id}`),
  });
}
```

**Verification:**

- [ ] Data loads on mount
- [ ] Loading state shows spinner
- [ ] Error state shows message
- [ ] Can refetch manually

---

## Phase 9: Forms & Validation

### Step 9.1: Set Up React Hook Form + Zod

**Example form:**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const agentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.enum(['sales', 'marketing', 'support'])
})

type AgentFormData = z.infer<typeof agentSchema>

function AgentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema)
  })

  const onSubmit = (data: AgentFormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Agent Name"
        error={errors.name?.message}
        {...register('name')}
      />
      {/* ... other fields */}
      <Button type="submit">Create Agent</Button>
    </form>
  )
}
```

**Verification:**

- [ ] Form validates on submit
- [ ] Errors show below fields
- [ ] Can't submit with errors
- [ ] Success state works

---

## Phase 10: Animations

### Step 10.1: Add Framer Motion Variants

**File:** `src/lib/animations.ts`

```typescript
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const scale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};
```

**Apply to components:**

- [ ] Modal uses `scale` variant
- [ ] Toast uses `slideUp` variant
- [ ] Page transitions use `fadeIn`
- [ ] Sidebar menu uses `slideUp` for items

**Verification:**

- [ ] Animations smooth (60fps)
- [ ] No layout shift
- [ ] Prefers-reduced-motion respected

---

## Phase 11: Accessibility

### Step 11.1: Accessibility Audit

**Tools:**

- [ ] Install `eslint-plugin-jsx-a11y`
- [ ] Run Lighthouse audit
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Test keyboard navigation

**Checklist:**

- [ ] All buttons have accessible names
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Focus visible on all interactive elements
- [ ] Color contrast 4.5:1 for text
- [ ] Headings in logical order (H1 → H2 → H3)
- [ ] Skip to main content link
- [ ] ARIA labels where needed

---

## Phase 12: Testing

### Step 12.1: Unit Tests

**Install:**

```bash
npm install -D vitest @testing-library/react @testing-library/user-event
```

**Test files:**

- [ ] `src/components/ui/button.test.tsx`
- [ ] `src/components/ui/input.test.tsx`
- [ ] `src/lib/utils.test.ts`

**Verification:**

- [ ] All tests pass
- [ ] Coverage >80%

---

### Step 12.2: Integration Tests

**Install:**

```bash
npm install -D @playwright/test
```

**Test flows:**

- [ ] User can log in
- [ ] User can create agent
- [ ] User can view analytics
- [ ] User can update settings

**Verification:**

- [ ] All flows pass
- [ ] Screenshots match expectations

---

## Phase 13: Performance Optimization

### Step 13.1: Code Splitting

- [ ] Lazy load routes
- [ ] Lazy load heavy components (charts, editors)
- [ ] Preload critical routes on hover

### Step 13.2: Image Optimization

- [ ] Use WebP format
- [ ] Lazy load below-the-fold images
- [ ] Serve responsive images

### Step 13.3: Bundle Optimization

- [ ] Tree shake unused code
- [ ] Minify CSS/JS
- [ ] Compress with Brotli

**Verification:**

- [ ] Lighthouse score >90
- [ ] FCP <1.5s
- [ ] LCP <2.5s
- [ ] CLS <0.1

---

## Phase 14: Final QA

### Step 14.1: Visual Regression

- [ ] Take screenshots of all templates
- [ ] Compare to wireframes
- [ ] Fix spacing inconsistencies

### Step 14.2: Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Step 14.3: Responsive Testing

- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)

---

## Deployment Checklist

### Pre-Deploy

- [ ] Run `npm run build` without errors
- [ ] Test production build locally
- [ ] Run Lighthouse on production build
- [ ] Check bundle size (<500kb gzipped)

### Deploy

- [ ] Set environment variables
- [ ] Deploy to staging
- [ ] Run smoke tests on staging
- [ ] Deploy to production

### Post-Deploy

- [ ] Monitor error logs (Sentry)
- [ ] Check analytics (GA, Mixpanel)
- [ ] Verify all routes accessible
- [ ] Test critical flows

---

## Success Criteria

### Design Quality

- ✅ Zero spacing inconsistencies
- ✅ All states implemented (hover, focus, active, disabled)
- ✅ Color contrast passes WCAG AA
- ✅ Typography scale used consistently

### Performance

- ✅ Lighthouse score >90
- ✅ FCP <1.5s
- ✅ LCP <2.5s
- ✅ CLS <0.1
- ✅ TTI <3.5s

### Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation works
- ✅ Screen reader accessible
- ✅ Focus visible on all interactive elements

### Developer Experience

- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ All components documented
- ✅ All tests passing

---

**Status:** Implementation checklist complete ✅

**Next Action:** Hand off all documents to Warp AI for implementation.
