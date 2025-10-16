# Composite Components Specification

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Component Count:** 27 composite components (15 molecules + 12 organisms)  
**Status:** Ready for Implementation

---

## Molecules (15 Components)

### 1. SearchBar

**Composition:** Input + Icon + Clear Button  
**Purpose:** Search input with integrated actions

**Props:**

```typescript
interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  shortcuts?: string; // Display "⌘K"
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}
```

**Layout:**

```
┌───────────────────────────────────┐
│ 🔍  [Search query...]      [⌘K] ✕ │
└───────────────────────────────────┘
```

**Behavior:**

- Clear button appears only when value exists
- Enter key triggers onSearch
- Escape key clears input
- Loading spinner replaces search icon

---

### 2. Pagination

**Composition:** Buttons + Text + Select

**Props:**

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  totalItems?: number;
  siblingCount?: number; // Pages shown on each side
}
```

**Layout:**

```
┌──────────────────────────────────────────────┐
│ Rows per page: [10▼]                         │
│                                               │
│ [←] [1] [2] [3] ... [8] [9] [10] [→]       │
│                                               │
│ Showing 1-10 of 100 items                    │
└──────────────────────────────────────────────┘
```

**Behavior:**

- First/last always shown
- Ellipsis for gaps
- Current page highlighted
- Prev/next disabled at boundaries

---

### 3. Breadcrumb

**Composition:** Links + Divider Icons

**Props:**

```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    icon?: ReactNode;
  }>;
  separator?: ReactNode; // Default: ChevronRight
  maxItems?: number; // Collapse to dropdown if exceeded
}
```

**Layout:**

```
Home > Agents > Templates > Sales Outreach
```

**Behavior:**

- Last item not clickable (current page)
- If maxItems exceeded, show: Home > ... > Current

---

### 4. Tabs

**Composition:** Button Group + Content Panels

**Props:**

```typescript
interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
    content: ReactNode;
  }>;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "line" | "pills";
  size?: "sm" | "md" | "lg";
}
```

**Variants:**

**Line (Default)**

```
Overview | Settings | Analytics | Logs
────────
[Tab content here]
```

**Pills**

```
[Overview] [Settings] [Analytics] [Logs]
[Tab content here]
```

**Behavior:**

- Arrow keys navigate between tabs
- Active tab has blue indicator/background
- Badge shows count (e.g., "Logs (5)")

---

### 5. Accordion

**Composition:** Button + Collapsible Content

**Props:**

```typescript
interface AccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: ReactNode;
    icon?: ReactNode;
  }>;
  defaultOpen?: string[]; // IDs of initially open items
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
}
```

**Layout:**

```
┌─────────────────────────────────┐
│ ▼ Section Title                 │
├─────────────────────────────────┤
│   Content here                  │
│   Can be multiple lines         │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ ▶ Collapsed Section             │
└─────────────────────────────────┘
```

**Animation:**

- Height transitions smoothly
- Chevron rotates 90deg
- Duration: 200ms ease

---

### 6. DropdownMenu

**Composition:** Trigger Button + Floating Menu

**Props:**

```typescript
interface DropdownMenuProps {
  trigger: ReactNode; // Button or custom trigger
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    isDivider?: boolean;
    isDestructive?: boolean;
    isDisabled?: boolean;
    shortcut?: string; // e.g., "⌘D"
  }>;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
}
```

**Layout:**

```
[Trigger Button ▼]
┌──────────────────────┐
│ 🏠 Home        ⌘H    │
│ ⚙️  Settings   ⌘,    │
│ ──────────────────── │
│ ⚠️  Delete           │
└──────────────────────┘
```

**Behavior:**

- Opens on click or keyboard (Space/Enter)
- Arrow keys navigate items
- Escape closes menu
- Click outside closes menu

---

### 7. Toast (Notification)

**Composition:** Alert + Dismiss Button + Auto-dismiss Timer

**Props:**

```typescript
interface ToastProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  description: string;
  duration?: number; // ms, 0 = persistent
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│ ✓ Success                      [✕]  │
│ Your changes have been saved        │
│                        [Undo Action]│
└─────────────────────────────────────┘
```

**Position:** Bottom-right corner  
**Stack:** Multiple toasts stack vertically  
**Animation:** Slide in from right, fade out

---

### 8. StatCard

**Composition:** Card + Icon + Metric + Trend

**Props:**

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  change?: string; // e.g., "+12% from last month"
  onClick?: () => void;
  isLoading?: boolean;
}
```

**Layout:**

```
┌─────────────────────────┐
│ 📊                      │
│                         │
│ Total Revenue           │
│ $45,230                 │
│                         │
│ ↑ 12.5%  vs last month  │
└─────────────────────────┘
```

**Skeleton State:**

- Show shimmer while loading
- Preserve layout dimensions

---

### 9. FileUpload

**Composition:** Dropzone + File List + Progress

**Props:**

```typescript
interface FileUploadProps {
  accept?: string; // MIME types
  maxSize?: number; // Bytes
  maxFiles?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  preview?: boolean;
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│         ⬆️                           │
│   Drop files here or click to       │
│   browse                            │
│                                     │
│   Supports: PDF, DOCX, CSV          │
│   Max size: 10MB                    │
└─────────────────────────────────────┘

Uploaded:
┌─────────────────────────────────────┐
│ 📄 document.pdf    2.3 MB      [✕] │
│ ────────────────  100%             │
└─────────────────────────────────────┘
```

**States:**

- Idle: Dashed border
- Hover: Solid border
- Uploading: Progress bar
- Error: Red border + message

---

### 10. CommandPalette

**Composition:** Modal + SearchBar + Results List

**Props:**

```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    shortcut?: string;
    category?: string;
    onSelect: () => void;
  }>;
  placeholder?: string;
}
```

**Layout:**

```
┌────────────────────────────────────────┐
│ 🔍 Search commands...                  │
├────────────────────────────────────────┤
│ Navigation                             │
│   🏠 Go to Dashboard              ⌘H   │
│   🤖 Go to Agents                 ⌘A   │
│                                        │
│ Actions                                │
│   ➕ Create New Agent              ⌘N   │
│   📧 Compose Email                ⌘E   │
└────────────────────────────────────────┘
```

**Behavior:**

- Opens with ⌘K
- Fuzzy search across labels
- Arrow keys navigate results
- Enter selects command
- Escape closes palette

---

## Organisms (12 Components)

### 1. DataTable

**Composition:** Table + Header + Sorting + Filters + Pagination + Row Actions

**Props:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (row: T) => ReactNode;
    width?: string;
    align?: "left" | "center" | "right";
  }>;
  rowActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    isDestructive?: boolean;
  }>;
  bulkActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (rows: T[]) => void;
  }>;
  isLoading?: boolean;
  emptyState?: ReactNode;
  pagination?: PaginationProps;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<string, any>) => void;
}
```

**Features:**

- Sortable columns (click header)
- Multi-select rows (checkboxes)
- Bulk actions toolbar
- Row actions menu (3-dot)
- Sticky header on scroll
- Responsive: collapses to cards on mobile

---

### 2. Sidebar (Desktop Navigation)

**Composition:** Logo + Nav Items + Sections + Footer

**Props:**

```typescript
interface SidebarProps {
  items: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    href: string;
    badge?: number;
    children?: Array<{
      id: string;
      label: string;
      href: string;
    }>;
  }>;
  activeItem?: string;
  footer?: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
  width?: number; // Default 256px
}
```

**Layout:**

```
┌──────────────────┐
│ [Logo]           │
├──────────────────┤
│ 🏠 Dashboard     │
│ 🤖 Agents     (3)│
│   ├ My Agents    │
│   └ Templates    │
│ 👤 Prospects     │
│ ✉️ Emails        │
│ 📊 Reports       │
│ 📚 Resources     │
├──────────────────┤
│ ⚙️  Settings     │
│ [Avatar] User    │
└──────────────────┘
```

**Behavior:**

- Active item: blue left border + bg tint
- Collapsible sub-items
- Collapsed mode: icons only, tooltip on hover
- Resizable via drag handle

---

### 3. BottomNav (Mobile)

**Composition:** Icon Buttons + Labels + Badge

**Props:**

```typescript
interface BottomNavProps {
  items: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    href: string;
    badge?: number;
  }>;
  activeItem?: string;
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│ [🏠]    [🤖]    [➕]    [✉️]    [☰]    │
│ Home   Agents   New   Msgs    More     │
└─────────────────────────────────────────┘
```

**Specs:**

- Height: 64px (includes safe area)
- Icons: 24px
- Active: primary color
- Inactive: muted color
- Badge: top-right corner

---

### 4. Modal

**Composition:** Overlay + Card + Header + Body + Footer

**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

**Sizes:**

- sm: 384px (24rem)
- md: 512px (32rem)
- lg: 768px (48rem)
- xl: 1024px (64rem)
- full: 100vw - padding

**Animation:**

```typescript
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
```

**Behavior:**

- Escape key closes (if allowed)
- Focus trap inside modal
- Scroll locked on body
- Overlay click closes (if allowed)

---

### 5. Drawer (Slide-out Panel)

**Composition:** Overlay + Sliding Panel + Header + Body + Footer

**Props:**

```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
}
```

**Sizes (for left/right):**

- sm: 320px
- md: 480px
- lg: 640px
- full: 90vw

**Animation:**

- Slides from placement edge
- Duration: 300ms ease-out
- Overlay fades in

---

### 6. Stepper (Multi-step Form)

**Composition:** Steps + Progress + Content + Navigation

**Props:**

```typescript
interface StepperProps {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    content: ReactNode;
  }>;
  currentStep: number;
  onStepChange: (step: number) => void;
  orientation?: "horizontal" | "vertical";
}
```

**Layout (Horizontal):**

```
1. Basic Info ────── 2. Details ────── 3. Review
   Complete           Current           Upcoming

[Step Content Here]

[Back]                           [Next]
```

**Status Indicators:**

- Complete: ✓ + blue circle
- Current: Number + blue circle
- Upcoming: Number + gray circle

---

### 7. NotificationPanel

**Composition:** Popover + Header + Timeline + Footer

**Props:**

```typescript
interface NotificationPanelProps {
  notifications: Array<{
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    isRead: boolean;
    type: "info" | "success" | "warning" | "error";
    onClick?: () => void;
  }>;
  onMarkAllRead?: () => void;
  onNotificationClick?: (id: string) => void;
}
```

**Layout:**

```
┌─────────────────────────────────────┐
│ Notifications            Mark all   │
├─────────────────────────────────────┤
│ ✓ Agent completed                   │
│   Sales Outreach finished           │
│   2 minutes ago                     │
├─────────────────────────────────────┤
│ ⚠️ Error in workflow                 │
│   Weekly Report failed              │
│   1 hour ago                        │
├─────────────────────────────────────┤
│          View All (25)              │
└─────────────────────────────────────┘
```

---

### 8. Calendar

**Composition:** Month Grid + Navigation + Events

**Props:**

```typescript
interface CalendarProps {
  events?: Array<{
    id: string;
    date: Date;
    title: string;
    color?: string;
  }>;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}
```

**Layout:**

```
  October 2025     [<] [>]
Su Mo Tu We Th Fr Sa
          1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30 31

• Today: Blue circle
• Selected: Blue background
• Has events: Dot indicator
• Disabled: Gray text
```

---

### 9. Chart (Dashboard Viz)

**Composition:** Tremor Chart Components

**Props:**

```typescript
interface ChartProps {
  type: "line" | "bar" | "area" | "donut" | "pie";
  data: Array<Record<string, any>>;
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}
```

**Using Tremor:**

```tsx
import { LineChart } from "@tremor/react";

<LineChart
  data={data}
  index="date"
  categories={["revenue", "expenses"]}
  colors={["blue", "red"]}
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>;
```

---

### 10. UserMenu

**Composition:** Avatar + Dropdown + Profile Section

**Props:**

```typescript
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  menuItems: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
    isDivider?: boolean;
  }>;
}
```

**Layout:**

```
[Avatar ▼]
┌──────────────────────────────┐
│ [Avatar]  Dalton Cox         │
│           dalton@galaxy.ai   │
├──────────────────────────────┤
│ 👤 Profile                   │
│ ⚙️  Settings                 │
│ 💳 Billing                   │
├──────────────────────────────┤
│ 🚪 Logout                    │
└──────────────────────────────┘
```

---

## Integration Patterns

### With Forms (React Hook Form)

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <Input {...field} error={form.formState.errors.email?.message} />
  )}
/>
```

### With State Management (Zustand)

```typescript
const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
```

### With Routing (Wouter)

```typescript
<Sidebar items={navItems} activeItem={location} />
```

---

## Testing Strategy

### Unit Tests (Vitest)

- Props render correctly
- Event handlers fire
- States update properly

### Integration Tests (Testing Library)

- Multi-component interactions
- Form submissions
- Navigation flows

### Visual Tests (Playwright)

- Screenshot comparisons
- Responsive layouts
- Dark mode

---

**Status:** Complete ✅  
**Next:** Animation specifications
