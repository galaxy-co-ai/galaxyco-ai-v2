# GalaxyCo Design System - Framer-Inspired

**Professional, polished, high-quality aesthetic inspired by Framer**

---

## 🎨 Color Palette (Framer-Inspired)

### Primary Colors (Replace Purple with Sophisticated Blue)

**From Framer's approach:**

```css
/* Primary Brand */
--primary-50: #eff6ff /* Lightest blue */ --primary-100: #dbeafe --primary-200: #bfdbfe
  --primary-300: #93c5fd --primary-400: #60a5fa --primary-500: #3b82f6 /* Main brand blue */
  --primary-600: #2563eb /* Darker blue for depth */ --primary-700: #1d4ed8 --primary-800: #1e40af
  --primary-900: #1e3a8a /* Darkest */ /* Accent (Keep subtle purple for AI elements) */
  --accent-violet: #8b5cf6 /* For AI-specific features */ --accent-indigo: #6366f1
  /* For interactive elements */ /* Neutral (Professional grays) */ --gray-50: #f9fafb
  --gray-100: #f3f4f6 --gray-200: #e5e7eb --gray-300: #d1d5db --gray-500: #6b7280
  --gray-700: #374151 --gray-900: #111827 /* Semantic */ --success: #10b981 --warning: #f59e0b
  --error: #ef4444 --info: #3b82f6;
```

**Gradients (Framer-style):**

```css
/* Sophisticated, not flashy */
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)
background: linear-gradient(to bottom, #eff6ff 0%, #ffffff 100%)
```

---

## 📐 Spacing & Layout (Framer's Generous Approach)

### Spacing Scale

```css
/* Use Tailwind but with Framer's generous feel */
gap-8      /* 32px - between major sections */
gap-6      /* 24px - between related items */
gap-4      /* 16px - between elements */
p-8        /* 32px - card padding (was p-4 or p-6) */
p-12       /* 48px - page padding */

/* Vertical spacing */
space-y-12  /* Between page sections */
space-y-8   /* Between content blocks */
space-y-4   /* Between form fields */
```

**Key Change:**

- ❌ OLD: Dense, cramped (p-4, gap-2)
- ✅ NEW: Generous, breathing room (p-8, gap-6)

---

## 🔤 Typography (Framer's Clean Hierarchy)

### Font Stack

```css
/* Keep your existing fonts but with Framer's sizing */
font-sans: Inter, system-ui, sans-serif
font-mono: 'JetBrains Mono', monospace
```

### Type Scale (Larger, More Impact)

```css
/* Headings */
h1: text-5xl font-bold tracking-tight      /* 48px - Hero */
h2: text-4xl font-bold                     /* 36px - Page title */
h3: text-2xl font-semibold                 /* 24px - Section */
h4: text-xl font-semibold                  /* 20px - Card title */
h5: text-lg font-medium                    /* 18px - Subsection */

/* Body */
text-base: 16px (default body text)
text-sm: 14px (secondary text)
text-xs: 12px (captions, labels)

/* Special */
text-muted-foreground: text-gray-500 dark:text-gray-400
```

**Key Change:**

- ❌ OLD: Small, cramped text
- ✅ NEW: Larger, more readable

---

## 🎯 Component Standards (Kibo UI + Framer Polish)

### Cards (Framer's Elevated Feel)

```typescript
// ❌ OLD: Flat cards
<Card className="p-4 border">

// ✅ NEW: Elevated, modern cards
<Card className="p-8 border-0 shadow-sm bg-white dark:bg-gray-900 rounded-xl">
  {/* More padding, no border, subtle shadow, rounded corners */}
</Card>
```

### Buttons (Framer's Confident Style)

```typescript
// ❌ OLD: Small, timid buttons
<Button size="sm">Click Me</Button>

// ✅ NEW: Confident, clear buttons
<Button
  size="default"
  className="px-6 py-3 font-medium rounded-lg"
>
  Click Me
</Button>

// Primary action
<Button className="bg-primary-600 hover:bg-primary-700 text-white">
  Create Agent
</Button>

// Secondary action
<Button variant="outline" className="border-gray-200">
  Cancel
</Button>
```

### Inputs (Framer's Refined Forms)

```typescript
// ❌ OLD: Basic inputs
<Input placeholder="Enter name" />

// ✅ NEW: Polished inputs with labels
<div className="space-y-2">
  <Label className="text-sm font-medium text-gray-700">Agent Name</Label>
  <Input
    placeholder="e.g., Email Campaign Agent"
    className="h-11 px-4 rounded-lg border-gray-200 focus:border-primary-500 focus:ring-primary-500"
  />
  <p className="text-xs text-gray-500">Choose a descriptive name</p>
</div>
```

---

## ✨ Animation (Framer's Subtle Motion)

### Entrance Animations (Framer Motion)

```typescript
import { motion } from 'framer-motion'

// Cards fade up on load
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  <Card>{/* content */}</Card>
</motion.div>

// Stagger children (Framer's signature move)
<motion.div className="grid grid-cols-3 gap-6">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</motion.div>
```

### Interaction Animations

```typescript
// Hover states (subtle)
<Button className="transition-all hover:scale-[1.02] hover:shadow-md">

// Active states
<Card className="cursor-pointer transition-shadow hover:shadow-lg active:scale-[0.98]">

// Loading states (Framer's smooth spinners)
<Loader2 className="h-5 w-5 animate-spin text-primary-600" />
```

---

## 🏗️ Layout Principles (Framer's Structure)

### Page Structure

```typescript
// ✅ Framer-inspired page layout
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Generous padding */}
      <div className="container mx-auto px-8 py-12">

        {/* Clear hierarchy */}
        <div className="space-y-8">

          {/* Hero section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Page Title
            </h1>
            <p className="text-xl text-gray-600">
              Clear, concise description
            </p>
          </div>

          {/* Content section */}
          <div className="grid grid-cols-3 gap-8">
            {/* Cards with breathing room */}
          </div>

        </div>
      </div>
    </div>
  )
}
```

### Grid Spacing

```typescript
// ❌ OLD: Tight grids
<div className="grid grid-cols-3 gap-4">

// ✅ NEW: Generous grids (Framer-style)
<div className="grid grid-cols-3 gap-8">
```

---

## 🎯 Component Replacements

### Dashboard Cards

**Before:**

```typescript
<Card className="p-4">
  <h3 className="text-sm font-medium">Agents</h3>
  <p className="text-2xl font-bold">12</p>
</Card>
```

**After (Framer-inspired):**

```typescript
<Card className="p-8 border-0 shadow-sm rounded-xl">
  <div className="space-y-3">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
      Active Agents
    </p>
    <p className="text-5xl font-bold text-gray-900 dark:text-white">
      12
    </p>
    <p className="text-sm text-gray-600 flex items-center gap-1">
      <TrendingUp className="h-4 w-4 text-green-600" />
      <span>+2 this week</span>
    </p>
  </div>
</Card>
```

**Changes:**

- More padding (p-8 vs p-4)
- Larger numbers (text-5xl vs text-2xl)
- Subtle shadow (shadow-sm)
- More rounded (rounded-xl vs rounded)
- Better hierarchy (uppercase labels, trend indicators)

---

### Navigation

**Before:**

```typescript
<nav className="flex gap-4">
  <Link href="/dashboard">Dashboard</Link>
  <Link href="/agents">Agents</Link>
</nav>
```

**After (Framer-inspired):**

```typescript
<nav className="flex gap-2 border-b border-gray-200">
  <Link
    href="/dashboard"
    className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-primary-600 hover:text-primary-600 transition-colors"
  >
    Dashboard
  </Link>
  <Link
    href="/agents"
    className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-primary-600 text-primary-600"
  >
    Agents
  </Link>
</nav>
```

**Changes:**

- Active state indicator (border-bottom)
- Smooth transitions
- Clear hover states
- Professional spacing

---

## 📊 UI Audit Checklist

**For each page, verify:**

### Visual Consistency

- [ ] Colors match design system
- [ ] Spacing is generous (Framer-style)
- [ ] Typography follows scale
- [ ] Shadows are subtle
- [ ] Borders are minimal or none

### Component Quality

- [ ] Cards have p-8 padding (not p-4)
- [ ] Buttons are confident size
- [ ] Inputs have proper labels
- [ ] Icons are consistent size
- [ ] Loading states exist

### Layout

- [ ] Generous page padding (px-8 py-12)
- [ ] Grid gaps are 6-8 (not 2-4)
- [ ] Vertical spacing is clear
- [ ] Content breathes
- [ ] Hierarchy is obvious

### Polish

- [ ] Smooth animations
- [ ] Hover states
- [ ] Focus states (accessibility)
- [ ] Dark mode works
- [ ] Mobile responsive

---

## 🚀 Implementation Strategy

### Batch 1: Design Tokens

```typescript
// apps/web/lib/design-tokens.ts
export const tokens = {
  colors: {
    primary: {
      /* Framer blues */
    },
    accent: {
      /* Subtle violets */
    },
    neutral: {
      /* Professional grays */
    },
  },
  spacing: {
    card: '2rem', // p-8
    section: '3rem', // p-12
    gap: '2rem', // gap-8
  },
  typography: {
    hero: 'text-5xl font-bold',
    title: 'text-4xl font-bold',
    heading: 'text-2xl font-semibold',
  },
};
```

### Batch 2: Update Tailwind Config

```typescript
// apps/web/tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          /* Framer blues */
        },
        accent: {
          /* Subtle violets */
        },
      },
    },
  },
};
```

### Batch 3: Component Updates

- Update all Card components
- Update all Button components
- Update all Input components
- Update page layouts

---

## ✅ Success Criteria

**Before:**

- Inconsistent spacing
- Cramped layouts
- Generic purple everywhere
- Flat, basic appearance

**After:**

- Consistent spacing (Framer-generous)
- Breathing room (professional)
- Sophisticated blue palette
- Elevated, polished appearance

**Feel:** "This looks like a $10M/year platform, not a startup MVP"

---

**This design system + automated testing = Professional UI at scale**

---

**Created:** November 2, 2025
**Inspired By:** Framer brand guidelines
**Implemented With:** Kibo UI + shadcn/ui
