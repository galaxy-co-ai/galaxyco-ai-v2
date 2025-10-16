# GalaxyCo.ai Design System Foundation

**Last Updated**: October 14, 2025  
**Purpose**: Eliminate UI iteration paralysis with clear, reusable patterns

---

## 🎯 Problem This Solves

**Before**: Spending hours tweaking individual components, creating code churn  
**After**: Reference this document, make decisions in minutes, move on

---

## 🎨 Core Design Tokens

### Colors

```tsx
// Primary Palette
const colors = {
  // Neutral base
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    500: "#6B7280",
    700: "#374151",
    900: "#111827",
  },

  // Brand accents (blue-purple-teal)
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    500: "#6366F1", // Indigo
    600: "#4F46E5",
    700: "#4338CA",
  },

  secondary: {
    500: "#06B6D4", // Cyan
    600: "#0891B2",
  },

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};
```

### Typography

```tsx
// Font stack
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

// Scale
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
text-2xl: 1.5rem (24px)
text-3xl: 1.875rem (30px)

// Weights
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

### Spacing

```tsx
// Use Tailwind's 4px scale
gap-2 = 8px
gap-3 = 12px
gap-4 = 16px  // Most common
gap-6 = 24px
gap-8 = 32px
```

### Shadows

```tsx
// Card shadow
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)  // Use this for cards

// Hover shadow
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

### Border Radius

```tsx
rounded-sm: 2px
rounded: 4px
rounded-md: 6px   // Buttons
rounded-lg: 8px   // Cards (STANDARD)
rounded-xl: 12px  // Modal dialogs
rounded-2xl: 16px // Large containers
```

---

## 📦 Component Patterns

### 1. Card Pattern (MOST COMMON)

```tsx
// Standard card wrapper
<div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
  {/* Card content */}
</div>

// Compact card (for dense layouts like marketplace)
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-primary-500 transition-all duration-200">
  {/* Card content */}
</div>
```

### 2. Button Patterns

```tsx
// Primary action
<button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors">
  Deploy Agent
</button>

// Secondary action
<button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 rounded-md transition-colors">
  Test
</button>

// Danger action
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors">
  Delete
</button>
```

### 3. Input Patterns

```tsx
// Standard input
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
  type="text"
/>

// Search input (top-left pattern from OpenSea)
<div className="relative">
  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  <input
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
    placeholder="Search agents..."
  />
</div>
```

### 4. Badge Patterns

```tsx
// Category badge
<span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
  Automation
</span>

// Status badge (success)
<span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
  Active
</span>

// Status badge (warning)
<span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
  Draft
</span>
```

### 5. Stat Display Pattern

```tsx
// Dashboard stat card
<div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-600">Total Agents</span>
    <TrendingUpIcon className="h-4 w-4 text-green-500" />
  </div>
  <p className="text-3xl font-bold text-gray-900">24</p>
  <p className="text-sm text-green-600 mt-1">+12% from last week</p>
</div>
```

---

## 🎯 Layout Patterns

### Dashboard Grid

```tsx
// Stats row (4 columns)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat cards */}
</div>

// Content grid (3 columns)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Agent cards */}
</div>
```

### Marketplace Grid (Compact)

```tsx
// Dense grid inspired by OpenSea
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {/* Compact agent cards */}
</div>
```

### Search + Filter Layout (OpenSea Style)

```tsx
<div className="space-y-4">
  {/* Top: Search bar - left aligned */}
  <div className="flex items-center justify-between">
    <SearchInput className="w-96" />
    <FilterButtons />
  </div>

  {/* Below search: Category pills */}
  <div className="flex gap-2 overflow-x-auto pb-2">
    <CategoryPill active>All</CategoryPill>
    <CategoryPill>Automation</CategoryPill>
    <CategoryPill>Research</CategoryPill>
  </div>

  {/* Content grid */}
  <MarketplaceGrid />
</div>
```

---

## 🚀 Quick Decision Rules

### When to use what spacing:

- **Between sections**: `gap-8` or `gap-12`
- **Between cards**: `gap-4` or `gap-6`
- **Inside cards**: `p-4` or `p-6`
- **Between text elements**: `gap-2` or `space-y-2`

### When to use what shadow:

- **Default cards**: `shadow-md`
- **Hover cards**: `shadow-lg`
- **Floating elements (modals, dropdowns)**: `shadow-xl`
- **Subtle cards**: `shadow-sm`

### When to use what border radius:

- **Everything by default**: `rounded-lg` (8px)
- **Small badges**: `rounded-full`
- **Buttons**: `rounded-md` (6px)
- **Modals**: `rounded-xl` (12px)

---

## 📐 Component Size Standards

### Avatar Sizes

```tsx
// User avatar
sm: 32px (h-8 w-8)
md: 40px (h-10 w-10)  // Standard
lg: 48px (h-12 w-12)

// Agent avatar
sm: 40px (h-10 w-10)
md: 64px (h-16 w-16)  // Standard
lg: 96px (h-24 w-24)
```

### Icon Sizes

```tsx
// In buttons/badges
h-4 w-4 (16px)

// In cards
h-5 w-5 (20px)  // Standard

// In headers
h-6 w-6 (24px)
```

### Button Sizes

```tsx
// Small (compact views)
px-3 py-1.5 text-sm

// Medium (standard)
px-4 py-2 text-base

// Large (CTAs)
px-6 py-3 text-lg
```

---

## 🎨 Reference Implementations

### OpenSea-Inspired Search Bar

```tsx
<div className="mb-6">
  <div className="relative max-w-md">
    <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search agents..."
      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    />
  </div>

  <div className="flex gap-2 mt-3 overflow-x-auto">
    <button className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-full">
      All
    </button>
    <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-primary-500">
      Automation
    </button>
    {/* More categories */}
  </div>
</div>
```

### Vercel-Inspired Dashboard Card

```tsx
<div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
        <RocketIcon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">Email Agent</h3>
        <p className="text-sm text-gray-600">Automation</p>
      </div>
    </div>
    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
      Active
    </span>
  </div>

  <p className="text-sm text-gray-600 mb-4">
    Automatically processes and responds to customer emails using AI.
  </p>

  <div className="flex items-center justify-between text-sm">
    <div className="flex gap-4 text-gray-600">
      <span>127 runs</span>
      <span>98% success</span>
    </div>
    <div className="flex gap-2">
      <button className="px-3 py-1.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
        Test
      </button>
      <button className="px-3 py-1.5 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors">
        Edit
      </button>
    </div>
  </div>
</div>
```

---

## ✅ Usage Workflow

**Before implementing ANY UI component:**

1. **Check this doc first** - Does a pattern exist?
2. **If yes** → Copy the pattern, customize minimally
3. **If no** → Use V0.dev to generate, then add pattern here
4. **Never** iterate more than 2 times on a component
5. **When stuck** → Reference Tailwind UI examples

**This eliminates:**

- ❌ Endless tweaking
- ❌ Inconsistent styling
- ❌ Code churn
- ❌ Design paralysis

**This enables:**

- ✅ Fast decisions
- ✅ Consistent UI
- ✅ Clean codebase
- ✅ Production quality

---

## 🔗 External Resources

- **V0.dev**: https://v0.dev (free component generation)
- **Tailwind UI**: https://tailwindui.com ($299 - recommended purchase)
- **shadcn/ui blocks**: https://ui.shadcn.com/blocks (free examples)
- **Lucide icons**: https://lucide.dev (already installed)

---

**Rule**: Reference this doc before writing ANY UI component. Make decisions in minutes, not hours.
