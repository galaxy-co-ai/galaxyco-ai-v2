# Component Inventory - Complete Catalog

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Phase:** 1 - Foundation  
**Status:** Ready for Implementation

---

## Component Philosophy

### Atomic Design Hierarchy

1. **Atoms:** Smallest units (Button, Input, Badge)
2. **Molecules:** Simple combinations (SearchBar = Input + Icon + Button)
3. **Organisms:** Complex components (DataTable, Sidebar, Modal)
4. **Templates:** Page layouts (already defined in Master Plan)

### Naming Convention

- **Component:** PascalCase (e.g., `DataTable`, `SearchBar`)
- **Props:** camelCase (e.g., `variant`, `isDisabled`)
- **Variants:** lowercase strings (e.g., "primary", "ghost", "sm")

---

## Atoms (26 Components)

### 1. Button

**Purpose:** Primary interactive element  
**Variants:** primary, secondary, ghost, danger, outline  
**Sizes:** xs, sm, md, lg, xl  
**States:** default, hover, active, disabled, loading  
**Props:**

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isDisabled?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

**Accessibility:**

- ARIA label when icon-only
- Focus ring on keyboard navigation
- Disabled cursor and opacity

---

### 2. Input

**Purpose:** Text entry field  
**Variants:** default, error, success  
**Sizes:** sm, md, lg  
**States:** default, focus, error, disabled, readonly  
**Props:**

```typescript
interface InputProps {
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  error?: string;
}
```

**Accessibility:**

- Label association
- Error announcement to screen readers
- Required indicator

---

### 3. Badge

**Purpose:** Status indicators, tags  
**Variants:** default, success, warning, danger, info  
**Sizes:** sm, md, lg  
**Props:**

```typescript
interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
}
```

---

### 4. Avatar

**Purpose:** User profile images  
**Variants:** circle, square  
**Sizes:** xs, sm, md, lg, xl, 2xl  
**Props:**

```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  fallback?: string; // Initials
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "circle" | "square";
  status?: "online" | "offline" | "away" | "busy"; // Shows indicator dot
}
```

---

### 5. Icon

**Purpose:** Visual symbols (Lucide React library)  
**Sizes:** xs, sm, md, lg, xl  
**Props:**

```typescript
interface IconProps {
  name: string; // Lucide icon name
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string; // Tailwind color class
  className?: string;
}
```

---

### 6. Checkbox

**Purpose:** Multi-select option  
**States:** unchecked, checked, indeterminate, disabled  
**Props:**

```typescript
interface CheckboxProps {
  isChecked?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}
```

---

### 7. Radio

**Purpose:** Single-select option  
**States:** unchecked, checked, disabled  
**Props:**

```typescript
interface RadioProps {
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange?: () => void;
  label?: string;
  description?: string;
  name: string; // Radio group name
}
```

---

### 8. Toggle (Switch)

**Purpose:** On/off binary control  
**Sizes:** sm, md, lg  
**Props:**

```typescript
interface ToggleProps {
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}
```

---

### 9. Label

**Purpose:** Form field labels  
**Props:**

```typescript
interface LabelProps {
  htmlFor: string;
  children: ReactNode;
  isRequired?: boolean;
  tooltip?: string;
}
```

---

### 10. Spinner

**Purpose:** Loading indicator  
**Sizes:** xs, sm, md, lg, xl  
**Variants:** circular, dots, bars  
**Props:**

```typescript
interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "circular" | "dots" | "bars";
  label?: string; // For screen readers
}
```

---

### 11. Skeleton

**Purpose:** Loading placeholder  
**Variants:** text, circle, rectangle  
**Props:**

```typescript
interface SkeletonProps {
  variant?: "text" | "circle" | "rectangle";
  width?: string;
  height?: string;
  count?: number; // Multiple lines
}
```

---

### 12. Divider

**Purpose:** Content separation  
**Variants:** horizontal, vertical  
**Props:**

```typescript
interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string; // Centered text on line
}
```

---

### 13. Link

**Purpose:** Navigation links  
**Variants:** default, subtle, button  
**States:** default, hover, visited, active  
**Props:**

```typescript
interface LinkProps {
  href: string;
  variant?: "default" | "subtle" | "button";
  isExternal?: boolean;
  children: ReactNode;
}
```

---

### 14. Text

**Purpose:** Typography wrapper  
**Variants:** display, heading, body, caption, code  
**Sizes:** xs, sm, md, lg, xl, 2xl, 3xl, 4xl  
**Props:**

```typescript
interface TextProps {
  variant?: "display" | "heading" | "body" | "caption" | "code";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: string;
  children: ReactNode;
}
```

---

### 15. Tooltip

**Purpose:** Contextual help text  
**Placement:** top, bottom, left, right  
**Props:**

```typescript
interface TooltipProps {
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  delay?: number;
}
```

---

### 16. Progress

**Purpose:** Progress indicator  
**Variants:** bar, circle, ring  
**Props:**

```typescript
interface ProgressProps {
  value: number; // 0-100
  max?: number;
  variant?: "bar" | "circle" | "ring";
  size?: "sm" | "md" | "lg";
  label?: string;
  showPercentage?: boolean;
}
```

---

### 17. Chip (Interactive Badge)

**Purpose:** Filters, tags with actions  
**Variants:** default, selected, removable  
**Props:**

```typescript
interface ChipProps {
  label: string;
  variant?: "default" | "selected";
  isRemovable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  icon?: ReactNode;
}
```

---

### 18. KBD (Keyboard Key)

**Purpose:** Display keyboard shortcuts  
**Props:**

```typescript
interface KbdProps {
  children: string; // e.g., "⌘K"
  size?: "sm" | "md";
}
```

---

### 19. Code

**Purpose:** Inline code display  
**Props:**

```typescript
interface CodeProps {
  children: string;
  language?: string;
  isBlock?: boolean; // Inline vs block
}
```

---

### 20. Alert

**Purpose:** Inline notification/message  
**Variants:** info, success, warning, error  
**Props:**

```typescript
interface AlertProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  description: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}
```

---

### 21. EmptyState

**Purpose:** No data placeholder  
**Props:**

```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

---

### 22. Card

**Purpose:** Content container  
**Variants:** default, elevated, outlined  
**Props:**

```typescript
interface CardProps {
  variant?: "default" | "elevated" | "outlined";
  isPressable?: boolean; // Hover effect
  onClick?: () => void;
  children: ReactNode;
}
```

---

### 23. Select (Dropdown)

**Purpose:** Single-select from options  
**Props:**

```typescript
interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; icon?: ReactNode }>;
  placeholder?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
}
```

---

### 24. Textarea

**Purpose:** Multi-line text input  
**Props:**

```typescript
interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  error?: string;
}
```

---

### 25. Slider

**Purpose:** Range input  
**Props:**

```typescript
interface SliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
  showValue?: boolean;
}
```

---

### 26. DatePicker

**Purpose:** Date selection  
**Props:**

```typescript
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  isDisabled?: boolean;
}
```

---

## Molecules (15 Components)

### 27. SearchBar

**Composition:** Input + Icon + Optional Clear Button  
**Props:**

```typescript
interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  shortcuts?: string; // e.g., "⌘K"
  isLoading?: boolean;
}
```

---

### 28. Pagination

**Composition:** Buttons + Text + Select (rows per page)  
**Props:**

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  totalItems?: number;
}
```

---

### 29. Breadcrumb

**Composition:** Links + Divider  
**Props:**

```typescript
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  separator?: ReactNode;
}
```

---

### 30. Tabs

**Composition:** Button Group + Content Panels  
**Props:**

```typescript
interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: ReactNode; badge?: number }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "line" | "pills";
}
```

---

### 31. Accordion

**Composition:** Button + Collapsible Content  
**Props:**

```typescript
interface AccordionProps {
  items: Array<{ id: string; title: string; content: ReactNode }>;
  allowMultiple?: boolean;
  defaultOpen?: string[];
}
```

---

### 32. Toast

**Composition:** Alert + Dismiss Button  
**Props:**

```typescript
interface ToastProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  description: string;
  duration?: number; // Auto-dismiss in ms
  onDismiss?: () => void;
}
```

---

### 33. Dropdown Menu

**Composition:** Button + Menu Items  
**Props:**

```typescript
interface DropdownMenuProps {
  trigger: ReactNode;
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    isDivider?: boolean;
    isDestructive?: boolean;
  }>;
  align?: "start" | "center" | "end";
}
```

---

### 34. Avatar Group

**Composition:** Multiple Avatars + Overflow Count  
**Props:**

```typescript
interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt: string; fallback?: string }>;
  max?: number; // Show +N after this
  size?: "xs" | "sm" | "md" | "lg";
}
```

---

### 35. Stat Card

**Composition:** Card + Icon + Metric + Label + Trend  
**Props:**

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  change?: string; // e.g., "+12% from last month"
}
```

---

### 36. File Upload

**Composition:** Input + Preview + Progress  
**Props:**

```typescript
interface FileUploadProps {
  accept?: string; // MIME types
  maxSize?: number; // Bytes
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  preview?: boolean;
}
```

---

### 37. Command Palette

**Composition:** SearchBar + Results List + Keyboard Nav  
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
    onSelect: () => void;
  }>;
  placeholder?: string;
}
```

---

### 38. Filter Bar

**Composition:** Chips + Dropdown + Clear All  
**Props:**

```typescript
interface FilterBarProps {
  filters: Array<{
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  activeFilters: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
}
```

---

### 39. Form Field

**Composition:** Label + Input/Select/Textarea + Error  
**Props:**

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "select" | "textarea";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  description?: string;
}
```

---

### 40. Tag Input

**Composition:** Input + Chip List  
**Props:**

```typescript
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
}
```

---

### 41. Rating

**Composition:** Interactive Stars/Icons  
**Props:**

```typescript
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  isReadOnly?: boolean;
  icon?: ReactNode;
}
```

---

## Organisms (12 Components)

### 42. DataTable

**Composition:** Table + Sorting + Filters + Pagination + Row Actions  
**Props:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
    width?: string;
  }>;
  rowActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    isDestructive?: boolean;
  }>;
  isLoading?: boolean;
  emptyState?: ReactNode;
  pagination?: PaginationProps;
}
```

---

### 43. Sidebar (Navigation)

**Composition:** Logo + Nav Items + Footer  
**Props:**

```typescript
interface SidebarProps {
  items: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    href: string;
    badge?: number;
    children?: Array<{ id: string; label: string; href: string }>;
  }>;
  activeItem?: string;
  footer?: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
}
```

---

### 44. Bottom Navigation

**Composition:** Icon Buttons + Labels  
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

---

### 45. Modal

**Composition:** Overlay + Card + Header + Body + Footer  
**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
}
```

---

### 46. Drawer (Slide-out Panel)

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

---

### 47. Stepper (Progress Steps)

**Composition:** Steps + Connector Lines + Content  
**Props:**

```typescript
interface StepperProps {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    status: "complete" | "current" | "upcoming" | "error";
  }>;
  orientation?: "horizontal" | "vertical";
}
```

---

### 48. Timeline

**Composition:** List + Timestamps + Content Cards  
**Props:**

```typescript
interface TimelineProps {
  items: Array<{
    id: string;
    timestamp: string;
    title: string;
    description?: string;
    icon?: ReactNode;
    user?: { name: string; avatar?: string };
  }>;
  isLoading?: boolean;
}
```

---

### 49. Calendar

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
}
```

---

### 50. Chart (Dashboard Visualization)

**Composition:** Tremor Chart Components  
**Variants:** Line, Bar, Area, Donut, Pie  
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
}
```

---

### 51. Notification Panel

**Composition:** Popover + Timeline + Mark All Read  
**Props:**

```typescript
interface NotificationPanelProps {
  notifications: Array<{
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    isRead: boolean;
    onClick?: () => void;
  }>;
  onMarkAllRead?: () => void;
  onNotificationClick?: (id: string) => void;
}
```

---

### 52. User Menu

**Composition:** Avatar + Dropdown + Profile Links  
**Props:**

```typescript
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  menuItems: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    isDivider?: boolean;
  }>;
}
```

---

### 53. Settings Panel

**Composition:** Form Sections + Save/Cancel + Auto-save Indicator  
**Props:**

```typescript
interface SettingsPanelProps {
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    fields: Array<FormFieldProps>;
  }>;
  onSave?: (values: Record<string, any>) => void;
  isAutoSave?: boolean;
  isSaving?: boolean;
}
```

---

## Component Relationships Map

```
Templates (12)
  â""â"€â"€ Organisms (12)
      â"œâ"€â"€ DataTable
      â"‚   â""â"€â"€ Pagination
      â"‚   â""â"€â"€ FilterBar
      â"‚   â""â"€â"€ SearchBar
      â"œâ"€â"€ Sidebar
      â"‚   â""â"€â"€ Avatar
      â"‚   â""â"€â"€ Badge
      â"‚   â""â"€â"€ Link
      â"œâ"€â"€ Modal
      â"‚   â""â"€â"€ Button
      â"‚   â""â"€â"€ Card
      â""â"€â"€ ... other organisms
  â""â"€â"€ Molecules (15)
      â""â"€â"€ Atoms (26)
```

---

## Next Steps

1. **Review this inventory** - Add/remove components as needed
2. **Move to Phase 2** - Generate detailed specs for each component
3. **Prioritize implementation** - Start with most-used atoms (Button, Input)
4. **Build incrementally** - Test each component before moving to next

---

**Status:** Complete âœ… Ready for Phase 2
