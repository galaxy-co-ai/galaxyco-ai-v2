# Template Code Library

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Templates:** 12 master templates with code  
**Status:** Ready for Implementation

---

## Template Implementation Guidelines

### File Structure per Template

```
src/templates/
├── DashboardTemplate/
│   ├── DashboardTemplate.tsx
│   ├── DashboardTemplate.types.ts
│   ├── components/
│   │   ├── StatCard.tsx
│   │   ├── ChartSection.tsx
│   │   └── ActivityFeed.tsx
│   └── index.ts
```

### TypeScript Template Props Pattern

```typescript
interface BaseTemplateProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error;
}
```

---

## 1. Dashboard Template

**Used by:** `/dashboard`, `/sales`, `/analytics` (8 pages)

### Code Structure

```typescript
// DashboardTemplate.tsx
import { StatCard, ChartSection, DataTable } from '@/components';

interface DashboardTemplateProps {
  stats: Array<{
    label: string;
    value: string | number;
    trend?: { value: number; isPositive: boolean };
    icon?: React.ReactNode;
  }>;
  charts?: React.ReactNode;
  table?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const DashboardTemplate = ({ stats, charts, table, sidebar }: DashboardTemplateProps) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (optional) */}
      {sidebar && (
        <aside className="w-64 border-r border-border bg-background-subtle">
          {sidebar}
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        {charts && (
          <div className="mb-6">
            {charts}
          </div>
        )}

        {/* Data Table */}
        {table && (
          <div className="bg-card rounded-lg border border-border">
            {table}
          </div>
        )}
      </main>
    </div>
  );
};
```

### Responsive Behavior

```css
/* Mobile: Stack stats vertically */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 2. List + Filters Template

**Used by:** `/agents`, `/prospects`, `/emails/campaigns` (25 pages)

### Code Structure

```typescript
interface ListTemplateProps<T> {
  title: string;
  data: T[];
  filters?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  renderItem: (item: T) => React.ReactNode;
  viewMode?: 'grid' | 'list' | 'table';
  onViewModeChange?: (mode: 'grid' | 'list' | 'table') => void;
  pagination?: React.ReactNode;
  emptyState?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const ListTemplate = <T,>({
  title,
  data,
  filters,
  searchPlaceholder,
  onSearch,
  renderItem,
  viewMode = 'grid',
  onViewModeChange,
  pagination,
  emptyState,
  headerActions,
}: ListTemplateProps<T>) => {
  const [search, setSearch] = React.useState('');

  return (
    <div className="h-screen flex">
      {/* Filters Sidebar (Desktop) */}
      {filters && (
        <aside className="hidden lg:block w-64 border-r border-border p-4 overflow-auto">
          {filters}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="flex gap-2">
              {headerActions}
            </div>
          </div>

          {/* Search + View Toggle */}
          <div className="flex gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              className="flex-1"
            />
            <ViewToggle value={viewMode} onChange={onViewModeChange} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {data.length === 0 ? (
            emptyState || <EmptyState title="No items found" />
          ) : (
            <div className={cn(
              viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
              viewMode === 'list' && 'space-y-2',
            )}>
              {data.map(renderItem)}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <footer className="border-t border-border p-4">
            {pagination}
          </footer>
        )}
      </main>
    </div>
  );
};
```

---

## 3. Detail/Editor Template

**Used by:** `/agents/[id]`, `/prospects/[id]` (20 pages)

### Code Structure

```typescript
interface DetailTemplateProps {
  breadcrumb?: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  sidebar?: React.ReactNode;
}

export const DetailTemplate = ({
  breadcrumb,
  title,
  subtitle,
  headerActions,
  tabs,
  sidebar,
}: DetailTemplateProps) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-6">
        {breadcrumb}
        <div className="flex items-start justify-between mt-4">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            {headerActions}
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {tabs.find(t => t.id === activeTab)?.content}
        </main>

        {/* Sidebar (optional) */}
        {sidebar && (
          <aside className="w-80 border-l border-border p-6 overflow-auto">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
};
```

---

## 4. Form/Wizard Template

**Used by:** `/onboarding`, `/agents/new`, `/prospects/import` (8 pages)

### Code Structure

```typescript
interface WizardStep {
  id: string;
  label: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => Promise<boolean>;
}

interface WizardTemplateProps {
  title: string;
  steps: WizardStep[];
  onComplete: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
}

export const WizardTemplate = ({ title, steps, onComplete, onCancel }: WizardTemplateProps) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({});

  const handleNext = async () => {
    const isValid = await steps[currentStep]?.validate?.();
    if (isValid === false) return;

    if (currentStep === steps.length - 1) {
      await onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-6">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <Stepper
          steps={steps.map((s, i) => ({
            ...s,
            status: i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming',
          }))}
        />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {steps[currentStep]?.content}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border p-6 flex justify-between">
        <Button variant="ghost" onClick={onCancel} disabled={!onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </footer>
    </div>
  );
};
```

---

## 5. Settings Template

**Used by:** `/settings/*`, `/billing/*`, `/admin/*` (15 pages)

### Code Structure

```typescript
interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  fields: React.ReactNode;
}

interface SettingsTemplateProps {
  title: string;
  navigation: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    href: string;
  }>;
  sections: SettingsSection[];
  onSave?: (data: Record<string, any>) => Promise<void>;
  isSaving?: boolean;
}

export const SettingsTemplate = ({
  title,
  navigation,
  sections,
  onSave,
  isSaving,
}: SettingsTemplateProps) => {
  return (
    <div className="h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <nav className="space-y-1">
          {navigation.map(item => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6">
          {sections.map((section, i) => (
            <div key={section.id} className={cn(i > 0 && 'mt-8')}>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-muted-foreground mt-1">{section.description}</p>
                )}
              </div>
              <div className="space-y-4">
                {section.fields}
              </div>
              {i < sections.length - 1 && <Divider className="mt-8" />}
            </div>
          ))}

          {/* Save Button (Sticky) */}
          {onSave && (
            <div className="sticky bottom-0 bg-background border-t border-border pt-4 mt-8">
              <Button onClick={() => onSave({})} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
```

---

## Data Fetching Patterns

### TanStack Query Integration

```typescript
// In page component
const AgentsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  if (isLoading) {
    return <DashboardTemplate stats={[]} isLoading />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <DashboardTemplate
      stats={transformToStats(data)}
      table={<AgentsTable data={data} />}
    />
  );
};
```

---

## Loading States

### Skeleton Templates

```typescript
export const DashboardSkeleton = () => (
  <DashboardTemplate
    stats={Array(4).fill(null).map((_, i) => ({
      label: <Skeleton width="100px" />,
      value: <Skeleton width="60px" />,
    }))}
  />
);
```

---

## Error States

### Error Boundary Pattern

```typescript
<ErrorBoundary fallback={<ErrorTemplate />}>
  <DashboardTemplate {...props} />
</ErrorBoundary>
```

---

**Status:** Complete ✅ (Core templates)  
**Next:** Page mapping document
