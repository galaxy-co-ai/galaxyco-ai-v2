# Page Template System Guide

**Version:** 1.0.0  
**Last Updated:** 2025-10-17  
**Status:** ✅ Production Ready

---

## Overview

The page template system provides 4 reusable templates for building consistent, production-ready pages with minimal code. All templates extend the **PageShell** foundation and include built-in features like breadcrumbs, loading states, error handling, and empty states.

### Available Templates

| Template       | Use Case                 | Components Used                             |
| -------------- | ------------------------ | ------------------------------------------- |
| **PageShell**  | Foundation for all pages | Breadcrumb, DashboardHeader, Skeleton       |
| **ListPage**   | Collection/list views    | PageShell, CardGrid, DataTable, FilterPanel |
| **DetailPage** | Detail/show views        | PageShell, Card, Tabs, Metrics              |
| **FormPage**   | Create/edit forms        | PageShell, Card, WizardStep, Form atoms     |

---

## PageShell (Foundation)

Base template that all others extend. Provides consistent layout structure.

### Features

- Breadcrumb navigation
- Page header (title, subtitle, actions)
- Loading states
- Error boundaries
- Empty states
- Responsive max-width constraints

### Props

```typescript
interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  contentClassName?: string;
  maxWidth?: "full" | "7xl" | "6xl" | "5xl" | "4xl"; // default: '7xl'
}
```

### Example

```tsx
import { PageShell } from "@/components/templates";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <PageShell
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      actions={<Button>Take Action</Button>}
      isLoading={false}
    >
      {/* Your page content */}
      <div>Content goes here</div>
    </PageShell>
  );
}
```

---

## ListPage Template

Template for collection/list views with search, filters, and view toggle.

### Features

- Search bar with icon
- View mode toggle (grid/list)
- Collapsible filter panel
- Active filter count badge
- Toolbar with custom actions
- All PageShell features

### Props

```typescript
interface ListPageProps extends Omit<PageShellProps, "children"> {
  searchQuery?: string;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean; // default: true
  filters?: ListPageFilter[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (filterId: string, values: string[]) => void;
  onClearFilters?: () => void;
  showFilters?: boolean; // default: true
  children: React.ReactNode;
  toolbarActions?: React.ReactNode;
}

interface ListPageFilter {
  id: string;
  label: string;
  type: "checkbox" | "radio";
  options: Array<{ value: string; label: string; count?: number }>;
}
```

### Example - Agents List

```tsx
import { useState } from "react";
import { ListPage } from "@/components/templates";
import { CardGrid } from "@/components/organisms/card-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState({});

  return (
    <ListPage
      title="Agents"
      subtitle="Manage your AI agents"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Agents" }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      }
      searchQuery={searchQuery}
      searchPlaceholder="Search agents..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active", count: 12 },
            { value: "draft", label: "Draft", count: 5 },
            { value: "paused", label: "Paused", count: 3 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={(id, values) =>
        setActiveFilters({ ...activeFilters, [id]: values })
      }
      onClearFilters={() => setActiveFilters({})}
      isEmpty={agents.length === 0}
      emptyMessage="No agents found"
    >
      <CardGrid items={agents} viewMode={viewMode} />
    </ListPage>
  );
}
```

---

## DetailPage Template

Template for detail/show views with metrics and tabs.

### Features

- Metric cards row (responsive grid)
- Tabbed content navigation
- Tab badges for counts
- Trend indicators (up/down/neutral)
- All PageShell features

### Props

```typescript
interface DetailPageProps extends Omit<PageShellProps, "children"> {
  metrics?: MetricCard[];
  tabs?: TabConfig[];
  defaultTab?: string;
  activeTab?: string; // controlled
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode; // for non-tabbed content
}

interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
}
```

### Example - Agent Detail

```tsx
import { DetailPage } from "@/components/templates";
import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";

export default function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DetailPage
      title="Sales Agent"
      subtitle="Last active 2 hours ago"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Agents", href: "/agents" },
        { label: "Sales Agent" },
      ]}
      actions={
        <>
          <Button variant="outline">Pause</Button>
          <Button>Edit</Button>
        </>
      }
      metrics={[
        {
          label: "Total Runs",
          value: 1234,
          icon: <Play className="h-5 w-5" />,
        },
        {
          label: "Success Rate",
          value: "98.2%",
          change: "+2.4%",
          trend: "up",
          icon: <TrendingUp className="h-5 w-5" />,
        },
        {
          label: "Avg Duration",
          value: "2.3s",
          change: "-0.2s",
          trend: "up",
        },
        {
          label: "Version",
          value: "v1.2.0",
        },
      ]}
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: <OverviewTab />,
        },
        {
          id: "workflow",
          label: "Workflow",
          content: <WorkflowTab />,
        },
        {
          id: "executions",
          label: "Executions",
          badge: 25,
          content: <ExecutionsTab />,
        },
        {
          id: "settings",
          label: "Settings",
          content: <SettingsTab />,
        },
      ]}
    />
  );
}
```

---

## FormPage Template

Template for create/edit forms with multi-step wizard support.

### Features

- Multi-step wizard with progress indicator
- Step validation
- Navigation buttons (Back/Next/Submit)
- Loading states during submission
- Configurable form width
- All PageShell features

### Props

```typescript
interface FormPageProps extends Omit<PageShellProps, "children"> {
  steps?: FormStep[]; // for wizard
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string; // default: 'Save'
  cancelText?: string; // default: 'Cancel'
  isSubmitting?: boolean;
  children?: React.ReactNode; // for simple forms
  formWidth?: "sm" | "md" | "lg" | "xl" | "full"; // default: 'lg'
}

interface FormStep {
  id: string;
  label: string;
  description?: string;
  content: React.ReactNode;
  isValid?: boolean; // disable Next/Submit if false
}
```

### Example - Simple Form

```tsx
import { FormPage } from "@/components/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function CreateAgentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Submit logic here
    await createAgent(formData);
    router.push("/agents");
  };

  return (
    <FormPage
      title="Create Agent"
      breadcrumbs={[{ label: "Agents", href: "/agents" }, { label: "Create" }]}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/agents")}
      isSubmitting={isSubmitting}
      formWidth="md"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Agent Name</Label>
          <Input id="name" placeholder="Enter agent name" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="Enter description" />
        </div>
      </div>
    </FormPage>
  );
}
```

### Example - Multi-Step Wizard

```tsx
import { useState } from "react";
import { FormPage } from "@/components/templates";

export default function CreateAgentWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <FormPage
      title="Create Agent"
      breadcrumbs={[{ label: "Agents", href: "/agents" }, { label: "Create" }]}
      steps={[
        {
          id: "basic",
          label: "Basic Info",
          description: "Name and description",
          content: <BasicInfoStep data={formData} onChange={setFormData} />,
          isValid: !!formData.name,
        },
        {
          id: "config",
          label: "Configuration",
          description: "AI model and settings",
          content: <ConfigStep data={formData} onChange={setFormData} />,
          isValid: !!formData.model,
        },
        {
          id: "review",
          label: "Review",
          description: "Confirm and create",
          content: <ReviewStep data={formData} />,
        },
      ]}
      currentStep={step}
      onStepChange={setStep}
      onSubmit={handleCreateAgent}
      onCancel={() => router.push("/agents")}
    />
  );
}
```

---

## Common Patterns

### Pattern 1: Loading Data

```tsx
export default function MyPage() {
  const { data, isLoading, error } = useQuery("/api/items");

  return (
    <ListPage
      title="Items"
      isLoading={isLoading}
      error={error}
      isEmpty={!isLoading && data?.length === 0}
      emptyMessage="No items found"
    >
      <CardGrid items={data || []} />
    </ListPage>
  );
}
```

### Pattern 2: Search + Filter

```tsx
export default function MyPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.includes(search);
    const matchesFilters = Object.entries(filters).every(
      ([key, values]) => values.length === 0 || values.includes(item[key]),
    );
    return matchesSearch && matchesFilters;
  });

  return (
    <ListPage
      searchQuery={search}
      onSearchChange={setSearch}
      filters={filterConfig}
      activeFilters={filters}
      onFilterChange={(id, values) => setFilters({ ...filters, [id]: values })}
    >
      <CardGrid items={filtered} />
    </ListPage>
  );
}
```

### Pattern 3: Controlled Tabs

```tsx
export default function MyDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DetailPage
      title="Item Detail"
      tabs={tabsConfig}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}
```

---

## Best Practices

### 1. Always Provide Breadcrumbs

Breadcrumbs improve navigation and user context:

```tsx
breadcrumbs={[
  { label: 'Dashboard', href: '/' },
  { label: 'Section', href: '/section' },
  { label: 'Current Page' } // no href for current page
]}
```

### 2. Use Meaningful Empty States

Provide helpful empty messages and actions:

```tsx
isEmpty={items.length === 0}
emptyMessage="No agents created yet. Get started by creating your first agent."
emptyAction={
  <Button onClick={() => router.push('/agents/create')}>
    Create First Agent
  </Button>
}
```

### 3. Handle Loading and Errors

Always provide loading and error states:

```tsx
isLoading = { isLoading };
error = { error };
```

### 4. Keep Actions Minimal

Only show primary actions in page header:

```tsx
// Good - 1-2 primary actions
actions={
  <>
    <Button variant="outline">Secondary</Button>
    <Button>Primary Action</Button>
  </>
}

// Bad - too many actions
actions={<>...5+ buttons...</>} // Use dropdown menu instead
```

### 5. Consistent Max Width

Use appropriate max-width for content type:

- **List views:** `maxWidth="7xl"` (default, wide)
- **Detail views:** `maxWidth="6xl"` (slightly narrower)
- **Forms:** Set via `formWidth` prop
- **Content-heavy:** `maxWidth="4xl"` (optimal reading width)

### 6. Form Validation

For multi-step wizards, validate each step:

```tsx
steps={[
  {
    id: 'step1',
    label: 'Step 1',
    content: <Step1 />,
    isValid: validateStep1(formData), // disable Next if invalid
  }
]}
```

---

## Quick Reference

### When to Use Each Template

| Page Type     | Template   | Example                     |
| ------------- | ---------- | --------------------------- |
| List of items | ListPage   | Agents, Documents, Users    |
| Item details  | DetailPage | Agent detail, Document view |
| Create/edit   | FormPage   | Create agent, Edit profile  |
| Custom layout | PageShell  | Dashboard, Reports          |

### Folder Structure

```
components/
  templates/
    page-shell.tsx       # Foundation
    list-page.tsx        # List views
    detail-page.tsx      # Detail views
    form-page.tsx        # Forms
    index.ts             # Barrel export
```

### Import Pattern

```tsx
import { ListPage, DetailPage, FormPage } from "@/components/templates";
```

---

## Migration Guide

### Converting Existing Pages

**Before (Manual Layout):**

```tsx
export default function AgentsPage() {
  return (
    <div>
      <header>
        <h1>Agents</h1>
        <button>Create</button>
      </header>
      <input type="search" />
      <div>{/* filters */}</div>
      <div>{/* content */}</div>
    </div>
  );
}
```

**After (Template):**

```tsx
import { ListPage } from "@/components/templates";

export default function AgentsPage() {
  return (
    <ListPage
      title="Agents"
      actions={<Button>Create</Button>}
      searchQuery={query}
      onSearchChange={setQuery}
      filters={filters}
    >
      <CardGrid items={agents} />
    </ListPage>
  );
}
```

**Benefits:**

- ✅ 60% less code
- ✅ Consistent UI/UX
- ✅ Built-in loading/error states
- ✅ Mobile responsive
- ✅ Accessible by default

---

## TypeScript Support

All templates are fully typed. Import types as needed:

```typescript
import type {
  PageShellProps,
  ListPageProps,
  ListPageFilter,
  DetailPageProps,
  MetricCard,
  TabConfig,
  FormPageProps,
  FormStep,
} from "@/components/templates";
```

---

## Troubleshooting

### Issue: Template not found

**Solution:** Ensure barrel export exists:

```tsx
// components/templates/index.ts
export * from "./page-shell";
export * from "./list-page";
export * from "./detail-page";
export * from "./form-page";
```

### Issue: Filters not working

**Solution:** Ensure you're managing filter state correctly:

```tsx
const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
  {},
);

const handleFilterChange = (filterId: string, values: string[]) => {
  setActiveFilters((prev) => ({ ...prev, [filterId]: values }));
};
```

### Issue: Wizard steps not advancing

**Solution:** Check `isValid` prop on each step:

```tsx
steps={[
  {
    id: 'step1',
    label: 'Step 1',
    content: <Step1 />,
    isValid: formData.requiredField !== '', // Must be true to advance
  }
]}
```

---

## Performance Tips

1. **Lazy load tab content** - Only render active tab content
2. **Virtualize long lists** - Use CardGrid with virtualization for 100+ items
3. **Debounce search** - Add debounce to search input (300ms recommended)
4. **Memoize filters** - Use `useMemo` for expensive filter operations

---

**Documentation Complete** ✅

For questions or issues, refer to component source code or create a support ticket.
