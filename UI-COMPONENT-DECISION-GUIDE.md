# 🎯 COMPONENT DECISION GUIDE

## GalaxyCo.ai UI System - When to Use What

**Last Updated:** November 4, 2025  
**Version:** 1.0  
**Purpose:** Clear decision tree for choosing the right component approach

---

## 🌳 DECISION TREE

```
Need a UI component?
│
├─ 1. Is it a BASE UI element?
│   ├─ Button, Input, Select, Checkbox, Radio, Switch
│   ├─ Dialog, Dropdown, Popover, Tooltip, Toast
│   ├─ Card, Table, Tabs, Accordion
│   └─ ✅ USE: components/ui/ (shadcn/ui)
│
├─ 2. Is it an ADVANCED/UNIQUE component?
│   ├─ CreditCard, Spinner, Status, Ticker
│   ├─ AvatarStack, Banner, CodeBlock, Marquee
│   ├─ Dropzone, MiniCalendar, Tree
│   ├─ ContributionGraph, Comparison
│   └─ ✅ USE: src/components/kibo-ui/
│
├─ 3. Is it GALAXY-BRANDED/CUSTOM?
│   ├─ AgentCard, FlowBuilder, NodeSidebar
│   ├─ Custom visualizations
│   ├─ Brand-specific patterns
│   └─ ✅ USE: components/galaxy/
│
└─ 4. Is it FEATURE-SPECIFIC?
    ├─ Agent management → components/agents/
    ├─ Dashboard widgets → components/dashboard/
    ├─ Marketplace items → components/marketplace/
    ├─ Chat widget → components/chat/
    ├─ AI Assistant → components/assistant/
    └─ ✅ USE: components/{feature}/
```

---

## 📦 COMPONENT LIBRARY REFERENCE

### **1. shadcn/ui** (`components/ui/`)

**When to Use:**
- ✅ Building forms
- ✅ Creating dialogs/modals
- ✅ Standard interactive elements
- ✅ Common UI patterns
- ✅ Accessible base components

**Available Components (90):**

| Category | Components |
|----------|-----------|
| **Forms** | Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label |
| **Overlays** | Dialog, Sheet, Dropdown, Popover, Tooltip, Toast, Command |
| **Layout** | Card, Separator, Tabs, Accordion, ScrollArea |
| **Data** | Table, Progress, Badge, Avatar, Skeleton |
| **And more...** | See full list in `components/ui/` |

**Example Usage:**
```tsx
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

<Dialog>
  <Input placeholder="Enter name" />
  <Button>Save</Button>
</Dialog>
```

**Styling:**
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Customizable with `cn()` utility
- Uses design tokens from `globals.css`

---

### **2. Kibo UI** (`src/components/kibo-ui/`)

**When to Use:**
- ✅ Need advanced interactions
- ✅ Want unique visual components
- ✅ Require data visualizations
- ✅ Building rich displays

**Available Components (23):**

#### **Core Components (2)**
- `CreditCard` - Card with special styling
- `Spinner` - Loading spinner

#### **Display Components (14)**
- `Status` - Status indicators
- `Ticker` - Scrolling ticker
- `Badge` - Enhanced badges
- `Tags` - Tag clouds
- `Typography` - Rich typography
- `AvatarStack` - Overlapping avatars
- `Banner` - Alert banners
- `CodeBlock` - Syntax highlighted code
- `Announcement` - Announcement bars
- `Pill` - Pill buttons
- `Rating` - Star ratings
- `RelativeTime` - Time display
- `Marquee` - Scrolling marquee
- `ThemeSwitcher` - Dark mode toggle

#### **Interaction Components (3)**
- `Dropzone` - File upload
- `MiniCalendar` - Compact calendar
- `Tree` - Tree view

#### **Data Visualization (3)**
- `ContributionGraph` - GitHub-style graph
- `Comparison` - Side-by-side comparison
- `Patterns` - Visual patterns

**Example Usage:**
```tsx
import { CreditCard } from '@/components/kibo/credit-card';
import { Spinner } from '@/components/kibo/spinner';
import { Status } from '@/components/kibo/status';

<CreditCard>
  {isLoading ? <Spinner /> : <Status value="active" />}
</CreditCard>
```

---

### **3. Galaxy Components** (`components/galaxy/`)

**When to Use:**
- ✅ Building GalaxyCo-specific features
- ✅ Creating branded experiences
- ✅ Custom complex components
- ✅ Unique to your product

**Available Components (2 + flows):**
- `AgentCardKibo` - Agent display card
- `FlowBuilder` - Visual workflow builder
- `FlowNodes` - Flow node components
- `NodeSidebar` - Flow configuration
- `GridView` - Make.com-style grid

**Example Usage:**
```tsx
import { AgentCardKibo } from '@/components/galaxy';
import { FlowBuilder } from '@/components/galaxy/flows';

<AgentCardKibo agent={agent} />
<FlowBuilder initialFlow={flow} />
```

---

### **4. Feature-Specific Components**

**When to Use:**
- ✅ Component only used in one feature
- ✅ Tightly coupled to business logic
- ✅ Not reusable across features

**Example Locations:**
- `components/agents/` - Agent management
- `components/dashboard/` - Dashboard widgets
- `components/chat/` - Floating chat widget
- `components/assistant/` - Full AI assistant
- `components/marketplace/` - Marketplace items

**Example Usage:**
```tsx
import { AgentFilters } from '@/components/agents';
import { StatsCard } from '@/components/dashboard';

<AgentFilters onFilter={handleFilter} />
<StatsCard title="Active Agents" value={42} />
```

---

## 🎨 STYLING GUIDELINES

### **1. Use Design Tokens**

Always use CSS variables from `globals.css`:

```tsx
// ❌ DON'T: Hardcoded colors
<div className="bg-blue-500 text-white">

// ✅ DO: Design tokens
<div className="bg-primary text-primary-foreground">
```

**Available Tokens:**

| Token | Purpose | Example |
|-------|---------|---------|
| `primary` | Main brand color (Framer blue) | `bg-primary`, `text-primary` |
| `secondary` | Secondary actions | `bg-secondary`, `text-secondary` |
| `destructive` | Dangerous actions | `bg-destructive`, `text-destructive` |
| `muted` | Subtle backgrounds | `bg-muted`, `text-muted-foreground` |
| `accent` | Highlights | `bg-accent`, `text-accent-foreground` |
| `border` | Borders | `border-border` |
| `input` | Form inputs | `border-input` |
| `background` | Page background | `bg-background` |
| `foreground` | Main text color | `text-foreground` |

### **2. Use Utility Classes**

```tsx
// Spacing
className="p-6 gap-4 space-y-2"

// Layout
className="flex items-center justify-between"

// Responsive
className="flex-col md:flex-row lg:grid lg:grid-cols-3"
```

### **3. Use cn() for Conditional Styles**

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "bg-primary",
  isLarge ? "p-6" : "p-4"
)} />
```

---

## 🏗️ BUILDING NEW COMPONENTS

### **Step 1: Choose Location**

Ask yourself:
1. Is it a standard UI pattern? → `components/ui/`
2. Is it advanced/unique? → `src/components/kibo-ui/`
3. Is it GalaxyCo-branded? → `components/galaxy/`
4. Is it feature-specific? → `components/{feature}/`

### **Step 2: Follow Patterns**

**File Structure:**
```tsx
// component-name.tsx
'use client'; // Only if needed (useState, useEffect, etc.)

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ComponentNameProps {
  title: string;
  variant?: 'default' | 'primary';
}

export function ComponentName({ title, variant = 'default' }: ComponentNameProps) {
  return (
    <div className={cn(
      "base-styles",
      variant === 'primary' && "primary-styles"
    )}>
      <Button>{title}</Button>
    </div>
  );
}
```

### **Step 3: Document**

Add JSDoc comments:
```tsx
/**
 * ComponentName - Brief description
 * 
 * @param title - Component title
 * @param variant - Visual variant (default | primary)
 * @example
 * <ComponentName title="Hello" variant="primary" />
 */
```

---

## 📋 COMMON PATTERNS

### **Pattern 1: Forms**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(1),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('name')} />
      <Button type="submit">Save</Button>
    </form>
  );
}
```

### **Pattern 2: Data Display**

```tsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DataCard({ data }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <Badge variant="success">{data.status}</Badge>
      </div>
    </Card>
  );
}
```

### **Pattern 3: Loading States**

```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/kibo/spinner';

export function MyComponent({ isLoading, data }) {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return <div>{data}</div>;
}
```

---

## ❌ COMMON MISTAKES

### **Mistake 1: Wrong Component Choice**

```tsx
// ❌ DON'T: Using Kibo UI for basic button
import { Button } from '@/components/kibo/button';

// ✅ DO: Use shadcn/ui for basic UI
import { Button } from '@/components/ui/button';
```

### **Mistake 2: Hardcoded Colors**

```tsx
// ❌ DON'T
<div className="bg-[#0055FF]">

// ✅ DO
<div className="bg-primary">
```

### **Mistake 3: Inline Styles**

```tsx
// ❌ DON'T
<div style={{ padding: '20px', color: 'blue' }}>

// ✅ DO
<div className="p-5 text-primary">
```

### **Mistake 4: Mixing Component Libraries**

```tsx
// ❌ DON'T: Unnecessary complexity
import { Button as ShadcnButton } from '@/components/ui/button';
import { Button as KiboButton } from '@/components/kibo/button';

// ✅ DO: Use one component library per purpose
import { Button } from '@/components/ui/button'; // For standard buttons
```

---

## 🎯 QUICK REFERENCE

| Need | Use | Import From |
|------|-----|-------------|
| Button | shadcn/ui | `@/components/ui/button` |
| Card with special style | Kibo UI | `@/components/kibo/credit-card` |
| Agent display | Galaxy | `@/components/galaxy` |
| Dashboard stat | Feature-specific | `@/components/dashboard` |
| Loading spinner | Kibo UI | `@/components/kibo/spinner` |
| Form input | shadcn/ui | `@/components/ui/input` |
| Status badge | Kibo UI | `@/components/kibo/status` |
| Flow builder | Galaxy | `@/components/galaxy/flows` |

---

## 📚 FURTHER READING

- **Design System:** `DESIGN-SYSTEM.md`
- **Color System:** `apps/web/styles/globals.css`
- **Tailwind Config:** `apps/web/tailwind.config.ts`
- **Component Tests:** `apps/web/components/ui/__tests__/`

---

**Updated:** November 4, 2025  
**Maintained By:** AI Development Agent  
**Status:** ✅ Active - Follow this guide for all component decisions

