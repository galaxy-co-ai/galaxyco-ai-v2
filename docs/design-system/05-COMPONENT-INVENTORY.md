# Component Inventory

**Purpose:** Complete list of UI components needed for all 12 templates, organized by atomic design principles.

---

## Atomic Design Structure

```
Atoms (Basic building blocks)
  └─> Molecules (Simple combinations)
      └─> Organisms (Complex combinations)
          └─> Templates (Page-level patterns)
```

---

## Atoms (30 components)

### 1. Typography

- **Heading** (H1-H6)
- **Paragraph**
- **Label**
- **Caption**
- **Code** (inline)

### 2. Buttons

- **Button** (primary, secondary, destructive, ghost, outline)
- **IconButton**
- **ButtonGroup**

### 3. Form Elements

- **Input** (text, email, password, number, search)
- **Textarea**
- **Checkbox**
- **Radio**
- **Switch**
- **Select** (native dropdown)

### 4. Indicators

- **Badge** (status indicator)
- **Tag** (removable label)
- **Spinner** (loading)
- **Progress Bar**
- **Skeleton** (loading placeholder)
- **Dot** (unread indicator)

### 5. Icons & Media

- **Icon** (Lucide React wrapper)
- **Avatar**
- **Logo**
- **Image**

### 6. Dividers

- **Separator** (horizontal/vertical)
- **Divider** (with text)

### 7. Interactive

- **Link**
- **Tooltip**
- **Kbd** (keyboard shortcut display)

---

## Molecules (25 components)

### 1. Form Molecules

- **FormField** (Label + Input + Error message)
- **PasswordInput** (Input + toggle visibility)
- **SearchInput** (Input + search icon)
- **TagInput** (Input + tag pills)
- **DateRangePicker** (Two date inputs + calendar)
- **FileUpload** (Input + drag-drop zone + preview)

### 2. Navigation Molecules

- **Breadcrumb**
- **Tab** (single tab item)
- **TabsList** (horizontal tab navigation)
- **PaginationItem** (single page number)
- **NavItem** (sidebar navigation item)

### 3. Content Molecules

- **KPICard** (Metric card with icon, value, trend)
- **StatCard** (Simple stat display)
- **EmptyState** (Icon + message + CTA)
- **ErrorMessage** (Icon + text)
- **SuccessMessage** (Icon + text)
- **WarningMessage** (Icon + text)

### 4. Interactive Molecules

- **Dropdown** (Radix DropdownMenu)
- **Combobox** (Searchable select)
- **ContextMenu** (Right-click menu)

### 5. Media Molecules

- **AvatarGroup** (Stacked avatars)
- **ThumbnailGrid** (Image grid)
- **VideoPlayer** (Video with controls)

---

## Organisms (35 components)

### 1. Navigation Organisms

- **Sidebar** (Logo + nav items + footer)
- **TopNav** (Logo + actions + user menu)
- **BottomNav** (Mobile navigation)
- **MobileMenu** (Hamburger drawer)
- **SettingsNav** (Grouped nav items)

### 2. Data Display Organisms

- **DataTable** (Table + sorting + pagination)
- **CardGrid** (Grid of cards with filters)
- **ListItem** (Complex list row)
- **ActivityFeed** (Timeline of events)
- **NotificationList** (Grouped notifications)
- **SearchResults** (Grouped search results)

### 3. Forms Organisms

- **LoginForm** (Email + password + OAuth)
- **SignupForm** (Multi-field registration)
- **SettingsForm** (Grouped settings sections)
- **WizardStep** (Single step in multi-step form)
- **FilterPanel** (Collapsible filter groups)

### 4. Content Organisms

- **DashboardHeader** (Title + actions + breadcrumb)
- **HeroSection** (Title + description + search)
- **CategoryGrid** (Grid of category cards)
- **FeaturedCarousel** (Scrollable content carousel)
- **TableOfContents** (Sticky sidebar TOC)
- **ProseContent** (Styled article content)

### 5. Modal/Overlay Organisms

- **Modal** (Dialog with header, body, footer)
- **Drawer** (Slide-out panel)
- **Sheet** (Bottom sheet for mobile)
- **Popover** (Floating content)
- **CommandPalette** (Cmd+K search)

### 6. Feedback Organisms

- **Toast** (Temporary notification)
- **Alert** (Persistent notification)
- **ConfirmDialog** (Yes/No prompt)

### 7. Charts (Tremor)

- **LineChart**
- **BarChart**
- **AreaChart**
- **DonutChart**

---

## Component Specifications

### Button Component

**Purpose:** Primary interactive element for actions

**Variants:**

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**States:**

- Default
- Hover
- Active (pressed)
- Focus (keyboard)
- Disabled
- Loading (spinner replaces content)

**Sizes:**

- Small: `px-3 py-1.5 text-sm` (12px × 6px, 14px text)
- Medium: `px-4 py-2 text-sm` (16px × 8px, 14px text)
- Large: `px-6 py-3 text-base` (24px × 12px, 16px text)

**Tailwind Classes:**

```tsx
// Primary
'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active';

// Secondary
'bg-secondary text-secondary-foreground hover:bg-secondary-hover';

// Destructive
'bg-destructive text-destructive-foreground hover:bg-destructive/90';

// Ghost
'text-foreground hover:bg-hover active:bg-active';

// Outline
'border border-border bg-background hover:bg-hover';
```

**Accessibility:**

- Always has `type="button"` (unless in form)
- Has `aria-disabled` when disabled
- Has `aria-label` when icon-only
- Focus visible ring: `focus-visible:ring-2 focus-visible:ring-primary`

---

### Input Component

**Purpose:** Text input for forms

**Types:**

```tsx
type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

interface InputProps {
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  required?: boolean;
}
```

**States:**

- Default
- Focus
- Error
- Disabled
- Read-only

**Sizes:**

- Small: `px-3 py-1.5 text-sm` (12px × 6px)
- Medium: `px-4 py-2 text-sm` (16px × 8px) - default
- Large: `px-4 py-3 text-base` (16px × 12px)

**Tailwind Classes:**

```tsx
// Default
"w-full px-4 py-2 rounded-lg border border-border bg-background-subtle
 text-foreground placeholder:text-foreground-subtle
 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
 transition-colors duration-fast"

// Error state
"border-destructive focus:ring-destructive"

// Disabled
"opacity-50 cursor-not-allowed"
```

**Accessibility:**

- Always has associated `<label>` with `htmlFor`
- Has `aria-invalid` when error present
- Has `aria-describedby` pointing to error message
- Required fields have `required` attribute

---

### Card Component

**Purpose:** Container for grouped content

**Variants:**

```tsx
type CardVariant = 'default' | 'elevated' | 'outline';

interface CardProps {
  variant?: CardVariant;
  interactive?: boolean; // Adds hover state
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Sizes (Padding):**

- None: `p-0`
- Small: `p-4` (16px)
- Medium: `p-6` (24px) - default
- Large: `p-8` (32px)

**Tailwind Classes:**

```tsx
// Default
'bg-background-elevated border border-border rounded-lg';

// Elevated (with shadow)
'bg-background-elevated border border-border rounded-lg shadow-md';

// Outline
'bg-background border-2 border-border rounded-lg';

// Interactive
'hover:border-border-hover hover:shadow-md transition-all duration-fast cursor-pointer';
```

---

### Badge Component

**Purpose:** Status indicator or label

**Variants:**

```tsx
type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Sizes:**

- Small: `px-2 py-0.5 text-xs` (8px × 2px, 12px text)
- Medium: `px-2 py-1 text-sm` (8px × 4px, 14px text)

**Tailwind Classes:**

```tsx
// Default
"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
 bg-background-subtle text-foreground border border-border"

// Success
"bg-success/10 text-success border border-success/20"

// Warning
"bg-warning/10 text-warning border border-warning/20"

// Destructive
"bg-destructive/10 text-destructive border border-destructive/20"
```

---

### DataTable Component

**Purpose:** Display and interact with tabular data

**Features:**

- Column sorting
- Row selection (checkboxes)
- Pagination
- Search/filter
- Empty state
- Loading skeleton
- Expandable rows (optional)
- Sticky header (optional)

**Props:**

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  };
  selection?: {
    selectedRows: string[];
    onSelectionChange: (selectedRows: string[]) => void;
  };
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
}
```

**Column Definition:**

```tsx
interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}
```

**States:**

- Loading (skeleton rows)
- Empty (empty state component)
- Error (error message)
- Loaded (data displayed)

**Responsive:**

- Desktop: Full table with all columns
- Tablet: Hide less important columns
- Mobile: Convert to card view (stacked data)

---

### Modal Component

**Purpose:** Dialog overlay for focused interactions

**Props:**

```tsx
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeButton?: boolean;
}
```

**Sizes:**

- Small: `max-w-sm` (384px)
- Medium: `max-w-md` (448px) - default
- Large: `max-w-lg` (512px)
- XL: `max-w-2xl` (672px)
- Full: `max-w-full` (responsive padding)

**Structure:**

```jsx
<Modal open={open} onOpenChange={setOpen}>
  <ModalHeader>
    <ModalTitle>Title</ModalTitle>
    <ModalDescription>Description</ModalDescription>
  </ModalHeader>
  <ModalBody>{/* Content */}</ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSubmit}>Confirm</Button>
  </ModalFooter>
</Modal>
```

**Animation (Framer Motion):**

```tsx
const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
```

**Accessibility:**

- Traps focus inside modal
- Returns focus to trigger on close
- ESC key closes modal
- Click outside closes modal (optional)
- Has `role="dialog"` and `aria-modal="true"`
- Has `aria-labelledby` pointing to title
- Has `aria-describedby` pointing to description

---

### Toast Component

**Purpose:** Temporary notification message

**Props:**

```tsx
interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  duration?: number; // ms (default 5000)
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Position:**

- Desktop: Bottom-right (`bottom-4 right-4`)
- Mobile: Bottom-center (`bottom-20 left-4 right-4`)

**Animation:**

```tsx
const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.5 },
};
```

**Usage:**

```tsx
// Using a toast hook
const { toast } = useToast();

toast({
  title: 'Agent deployed',
  description: 'Your sales agent is now live',
  variant: 'success',
});
```

---

## Component Dependencies

### Core Libraries

- **React 18**: Base framework
- **Radix UI**: Accessible primitives (Dialog, Dropdown, Tabs, etc.)
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **React Hook Form**: Form state management
- **Zod**: Form validation

### Recommended Structure

```
src/
├── components/
│   ├── ui/                    # Atoms & Molecules (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── organisms/             # Complex components
│   │   ├── data-table.tsx
│   │   ├── sidebar.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   └── templates/             # Page-level layouts
│       ├── dashboard-layout.tsx
│       ├── auth-layout.tsx
│       └── ...
├── lib/
│   ├── utils.ts              # cn() helper
│   └── hooks/                # Custom hooks
└── types/
    └── index.ts              # Shared TypeScript types
```

---

## Implementation Priority

### Phase 1: Core Atoms (Week 1)

1. Button
2. Input
3. Label
4. Badge
5. Spinner
6. Icon

### Phase 2: Form Molecules (Week 1)

1. FormField
2. PasswordInput
3. SearchInput
4. Checkbox
5. Select

### Phase 3: Layout Organisms (Week 2)

1. Sidebar
2. TopNav
3. BottomNav
4. Card

### Phase 4: Data Organisms (Week 2)

1. DataTable
2. CardGrid
3. ActivityFeed

### Phase 5: Overlay Organisms (Week 3)

1. Modal
2. Toast
3. Drawer
4. Popover

### Phase 6: Chart Components (Week 3)

1. LineChart (Tremor)
2. BarChart (Tremor)
3. KPICard

---

## Next Steps

1. **Install shadcn/ui** for pre-built accessible components
2. **Create component storybook** for visual testing
3. **Write Playwright tests** for critical user flows
4. **Document component APIs** in code comments

---

**Status:** Component inventory complete ✅
