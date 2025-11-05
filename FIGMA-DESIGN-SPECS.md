# 🎨 AI Native Business Suite - Complete Design Specifications

**Extracted from Figma Export**  
**Date:** November 5, 2025  
**Project:** GalaxyCo.ai Dashboard Design

---

## 📋 Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Color Tokens](#color-tokens)
3. [Typography](#typography)
4. [Components Library](#components-library)
5. [Page Layouts](#page-layouts)
6. [Implementation Guide](#implementation-guide)

---

## 🎨 Design System Overview

This design follows a **modern, clean aesthetic** with:

- **shadcn/ui** component library as the foundation
- **Tailwind CSS** for utility styling
- **OKLCH color space** for better color perception
- **Rounded, soft corners** (default radius: 0.625rem)
- **Subtle shadows** with layered elevation
- **Gradient accents** for visual interest

---

## 🌈 Color Tokens

### Light Mode

```css
--background: #ffffff --foreground: oklch(0.145 0 0) /* Near black */ --primary: #030213
  /* Dark blue-black */ --secondary: oklch(0.95 0.0058 264.53) /* Very light purple */
  --muted: #ececf0 /* Light gray */ --muted-foreground: #717182 /* Medium gray */ --accent: #e9ebef
  /* Light gray-blue */ --border: rgba(0, 0, 0, 0.1) /* 10% black */ --destructive: #d4183d
  /* Red */ --radius: 0.625rem /* 10px */;
```

### Dark Mode

```css
--background: oklch(0.145 0 0) /* Near black */ --foreground: oklch(0.985 0 0) /* Near white */
  --primary: oklch(0.985 0 0) /* Near white */ --secondary: oklch(0.269 0 0) /* Dark gray */
  --muted: oklch(0.269 0 0) /* Dark gray */ --muted-foreground: oklch(0.708 0 0) /* Medium gray */
  --accent: oklch(0.269 0 0) /* Dark gray */ --border: oklch(0.269 0 0) /* Dark gray */;
```

### Semantic Colors (Status)

```css
/* Success / Active */
--success-bg: bg-green-500/10 --success-text: text-green-600 --success-border: border-green-500/20
  /* Processing / Info */ --processing-bg: bg-blue-500/10 --processing-text: text-blue-600
  --processing-border: border-blue-500/20 /* Warning */ --warning-bg: bg-orange-500/10
  --warning-text: text-orange-600 --warning-border: border-orange-500/20 /* Idle / Neutral */
  --idle-bg: bg-gray-500/10 --idle-text: text-gray-600 --idle-border: border-gray-500/20
  /* Error / Attention */ --error-bg: bg-red-500/10 --error-text: text-red-600
  --error-border: border-red-500/20;
```

### Chart Colors

```css
--chart-1: oklch(0.646 0.222 41.116) /* Orange */ --chart-2: oklch(0.6 0.118 184.704) /* Cyan */
  --chart-3: oklch(0.398 0.07 227.392) /* Blue */ --chart-4: oklch(0.828 0.189 84.429)
  /* Yellow-green */ --chart-5: oklch(0.769 0.188 70.08) /* Green */;
```

---

## 📝 Typography

### Font Stack

```css
font-family:
  ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';
```

### Font Sizes

```css
--font-size: 16px /* Base */ --text-xs: 0.75rem /* 12px */ --text-sm: 0.875rem /* 14px */
  --text-base: 1rem /* 16px */ --text-lg: 1.125rem /* 18px */ --text-xl: 1.25rem /* 20px */
  --text-2xl: 1.5rem /* 24px */ --text-3xl: 1.875rem /* 30px */;
```

### Font Weights

```css
--font-weight-normal: 400 --font-weight-medium: 500;
```

### Typography Scale

```typescript
h1: {
  fontSize: "var(--text-2xl)",      // 24px
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.5
}

h2: {
  fontSize: "var(--text-xl)",       // 20px
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.5
}

h3: {
  fontSize: "var(--text-lg)",       // 18px
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.5
}

h4: {
  fontSize: "var(--text-base)",     // 16px
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.5
}

p: {
  fontSize: "var(--text-base)",     // 16px
  fontWeight: "var(--font-weight-normal)",
  lineHeight: 1.5
}
```

---

## 🧩 Components Library

### 1. Dashboard Stats Pills

**Component:** `DashboardStats.tsx`

**Specs:**

```typescript
- Height: 32px (h-8)
- Padding: 16px horizontal (px-4)
- Border Radius: Full rounded (rounded-full)
- Border: None (border-0)
- Background: Gradient with 10-20% opacity
- Icon Size: 14px (h-3.5 w-3.5)
- Text Size: 12px (text-xs)
- Shadow: Soft elevation with hover state
```

**Color Variants:**

```typescript
Blue (Active Agents):
  gradient: "from-blue-500/10 to-blue-500/20"
  text: "text-blue-600"
  shadow: "shadow-[0_2px_10px_rgb(59,130,246,0.15)]"
  hover: "shadow-[0_4px_20px_rgb(59,130,246,0.25)]"

Green (Tasks Completed):
  gradient: "from-green-500/10 to-green-500/20"
  text: "text-green-600"
  shadow: "shadow-[0_2px_10px_rgb(34,197,94,0.15)]"
  hover: "shadow-[0_4px_20px_rgb(34,197,94,0.25)]"

Purple (Hours Saved):
  gradient: "from-purple-500/10 to-purple-500/20"
  text: "text-purple-600"
  shadow: "shadow-[0_2px_10px_rgb(168,85,247,0.15)]"
  hover: "shadow-[0_4px_20px_rgb(168,85,247,0.25)]"

Orange (Success Rate):
  gradient: "from-orange-500/10 to-orange-500/20"
  text: "text-orange-600"
  shadow: "shadow-[0_2px_10px_rgb(249,115,22,0.15)]"
  hover: "shadow-[0_4px_20px_rgb(249,115,22,0.25)]"
```

---

### 2. Agent Status Card

**Component:** `AgentStatusCard.tsx`

**Specs:**

```typescript
Container:
  - Padding: 16px (p-4)
  - Border Radius: 12px (rounded-xl)
  - Border: None (border-0)
  - Shadow: "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
  - Hover: "shadow-[0_6px_30px_rgb(0,0,0,0.08)]"
  - Transition: all

Icon Container:
  - Size: 48px × 48px (h-12 w-12)
  - Border Radius: 12px (rounded-xl)
  - Background: "from-purple-500/10 to-blue-500/10"

Status Badge:
  - Border Radius: Full (rounded-full)
  - Border: None (border-0)
  - Text Size: 12px (text-xs)
  - Status Indicator: 6px dot (h-1.5 w-1.5)
  - Animation: pulse on "processing"
```

**Status Colors:**

```typescript
Processing: bg: 'bg-blue-500/10';
text: 'text-blue-600';
dot: 'bg-blue-600 animate-pulse';

Active: bg: 'bg-green-500/10';
text: 'text-green-600';
dot: 'bg-green-600';

Idle: bg: 'bg-gray-500/10';
text: 'text-gray-600';
dot: 'bg-gray-600';
```

---

### 3. Floating Toolbar

**Specs:**

```typescript
Container:
  - Background: "bg-background/80 backdrop-blur-lg"
  - Border: "border border-border"
  - Border Radius: Full (rounded-full)
  - Shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
  - Padding: 12px 8px (px-3 py-2)
  - Gap: 4px (gap-1)

Buttons:
  - Size: 36px × 36px (h-9 w-9)
  - Border Radius: Full (rounded-full)
  - Variant: ghost
  - Hover: "hover:bg-accent"

Tooltip:
  - Border Radius: Full (rounded-full)
  - Padding: 4px 12px (py-1 px-3)

Separator:
  - Height: 24px (h-6)
  - Margin: 4px horizontal (mx-1)
```

---

### 4. Activity Feed

**Component:** `ActivityFeed.tsx`

**Specs:**

```typescript
Container Card:
  - Border Radius: 24px (rounded-2xl)
  - Border: None (border-0)
  - Shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
  - Overflow: hidden

Scroll Area:
  - Height: 400px (h-[400px])

Activity Item:
  - Gap: 12px (gap-3)
  - Padding Bottom: 16px (pb-4)
  - Border Bottom: "border-b last:border-0"

Status Dot:
  - Size: 8px (h-2 w-2)
  - Border Radius: Full (rounded-full)
  - Colors: green-500, yellow-500, red-500

Timeline Connector:
  - Width: 1px (w-px)
  - Background: "bg-border"
  - Margin Top: 8px (mt-2)
```

---

### 5. Workflow Visualizer

**Specs:**

```typescript
Canvas:
  - Border Radius: 12px (rounded-xl)
  - Background: Gradient backdrop
  - Dot Grid: 24px × 24px spacing
  - Grid Opacity: 30%

Workflow Nodes:
  - Size: 80px × 80px (h-20 w-20)
  - Border Radius: 16px (rounded-2xl)
  - Icon Size: 32px (h-8 w-8)
  - Shadow: "shadow-xl"
  - Hover: scale-105 transition

Node Colors:
  Trigger: "from-blue-500 to-blue-600"
  Filter: "from-yellow-500 to-yellow-600"
  Action: "from-purple-500 to-purple-600"

Connectors:
  - Stroke: "#6366f1" (indigo)
  - Stroke Width: 2px
  - Opacity: 0.4
  - Dash Array: "5,5"

Shadow Effect:
  - Width: 56px (w-14)
  - Height: 8px (h-2)
  - Gradient: "from-purple-500/20 to-purple-500/10"
  - Blur: sm
```

---

### 6. Integration Cards

**Specs:**

```typescript
Card:
  - Padding: 20px (p-5)
  - Border Radius: 12px (rounded-xl)
  - Border: None (border-0)
  - Shadow: "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
  - Hover: "shadow-[0_6px_30px_rgb(0,0,0,0.08)]"

Icon Container:
  - Size: 48px × 48px (h-12 w-12)
  - Border Radius: 12px (rounded-xl)
  - Background: Gradient (varies per integration)
  - Shadow: "shadow-lg"
  - Hover: scale-110 transition

Connected Badge:
  - Background: "bg-green-500"
  - Text: White
  - Border: None (border-0)
  - Border Radius: Full (rounded-full)
  - Icon: Check (12px)

Connect Button:
  - Width: Full (w-full)
  - Size: sm
  - Border Radius: Full (rounded-full)
```

---

## 📐 Layout Specifications

### Main Dashboard Layout

```typescript
Grid Layout:
  - Mobile: 1 column
  - Tablet: 2 columns (md:grid-cols-2)
  - Desktop: 3 columns (lg:grid-cols-3)
  - Gap: 24px (gap-6)

Content Padding:
  - All sides: 24px (p-6)

Header:
  - Height: 64px (h-16)
  - Background: "bg-white/95 backdrop-blur"
  - Border: "border-b border-border"
  - Sticky: top-0
  - Z-index: 10

Sidebar:
  - Background: "oklch(0.985 0 0)"
  - Border Right: "oklch(0.922 0 0)"

Main Content:
  - Background: "bg-gray-50/50"
  - Overflow: auto
```

---

## 🎯 Shadow System

### Elevation Scale

```typescript
Level 1 (Subtle):
  "shadow-[0_2px_10px_rgb(0,0,0,0.04)]"

Level 2 (Default):
  "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
  Hover: "shadow-[0_6px_30px_rgb(0,0,0,0.08)]"

Level 3 (Elevated):
  "shadow-[0_8px_30px_rgb(0,0,0,0.06)]"

Level 4 (Modal/Floating):
  "shadow-[0_8px_40px_rgb(0,0,0,0.08)]"

Color-specific shadows (with glow):
  Blue: "shadow-[0_2px_10px_rgb(59,130,246,0.15)]"
  Green: "shadow-[0_2px_10px_rgb(34,197,94,0.15)]"
  Purple: "shadow-[0_2px_10px_rgb(168,85,247,0.15)]"
  Orange: "shadow-[0_2px_10px_rgb(249,115,22,0.15)]"
```

---

## 🔧 Implementation Guide

### Quick Integration for GalaxyCo

1. **Copy Design Tokens:**
   - Use `project-extracted/styles/globals.css` as your base
   - Already compatible with Tailwind CSS
   - OKLCH color space for better accessibility

2. **Import Components:**

   ```bash
   # All shadcn/ui components already included
   project-extracted/components/ui/
   ```

3. **Use Custom Components:**

   ```typescript
   import { AgentStatusCard } from '@/components/AgentStatusCard';
   import { ActivityFeed } from '@/components/ActivityFeed';
   import { DashboardStats } from '@/components/DashboardStats';
   ```

4. **Adapt for GalaxyCo:**
   - Replace mock data with real GalaxyCo data
   - Connect to your agent API endpoints
   - Integrate with your state management (Zustand)

---

## 📦 Component Manifest

### Pages (5)

- `Dashboard.tsx` - Main dashboard with stats, agents, activity
- `Studio.tsx` - Agent studio/builder
- `CRM.tsx` - CRM integration page
- `KnowledgeBase.tsx` - Knowledge base management
- `Marketing.tsx` - Marketing automation

### Custom Components (9)

- `ActivityFeed.tsx` - Real-time activity stream
- `AgentStatusCard.tsx` - Individual agent status display
- `AppSidebar.tsx` - Main navigation sidebar
- `DashboardStats.tsx` - KPI stat cards
- `DocumentsPanel.tsx` - Document management panel
- `FloatingAIAssistant.tsx` - Floating chat assistant
- `QuickActions.tsx` - Quick action toolbar
- `VisualGridBuilder.tsx` - Grid/canvas builder
- `WorkflowVisualizer.tsx` - Workflow diagram renderer

### shadcn/ui Components (43)

All standard shadcn/ui components included in `components/ui/`

---

## 🎨 Design Principles Applied

1. **Visual Hierarchy**
   - Clear primary actions (rounded, bold buttons)
   - Subtle secondary actions (ghost buttons)
   - Muted tertiary elements (gray text)

2. **Color Psychology**
   - Blue: Trust, stability (primary actions)
   - Green: Success, active states
   - Orange: Warning, attention needed
   - Purple: AI/intelligence, premium features
   - Red: Errors, critical alerts

3. **Micro-interactions**
   - Smooth transitions (transition-all)
   - Hover state elevation (shadow increase)
   - Scale animations (scale-105, scale-110)
   - Pulse animations for processing states

4. **Accessibility**
   - OKLCH color space (perceptually uniform)
   - Semantic HTML (proper heading hierarchy)
   - ARIA-compatible components (shadcn/ui)
   - Keyboard navigation support

5. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px)
   - Flexible grid layouts
   - Collapsible sidebar

---

## 📊 Data Structure Examples

### Agent Data Type

```typescript
interface ActiveAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  tasksCompleted: number;
  lastActive: string;
  type: string;
}
```

### Activity Data Type

```typescript
interface RecentActivity {
  id: string;
  agent: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}
```

### Workflow Data Type

```typescript
interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'processing';
  triggers: number;
  actions: number;
  runs: number;
  nodes: WorkflowNode[];
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'filter' | 'action';
  label: string;
  icon: LucideIcon;
  position: { x: number; y: number };
}
```

---

## 🚀 Next Steps for GalaxyCo Integration

1. **Copy extracted components** to `apps/web/components/galaxy/`
2. **Merge globals.css** with your existing styles
3. **Update Dashboard page** with new components
4. **Connect to real data** via Server Actions
5. **Add loading states** (Skeleton components)
6. **Implement error boundaries**
7. **Test responsive behavior**
8. **Add animations** with Framer Motion (optional)

---

## 📄 Attribution

- UI Components: [shadcn/ui](https://ui.shadcn.com/) (MIT License)
- Icons: [Lucide Icons](https://lucide.dev/)
- Design System: Custom for GalaxyCo.ai
- Export Tool: Figma Dev Mode

---

**Generated:** November 5, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
