# GalaxyCo Design System

**Version:** 1.0
**Last Updated:** November 2, 2025
**Philosophy:** Linear's minimal aesthetic + Framer's bold blue + Make.com's 3D canvas

---

## 🎨 Visual Language

### Core Principles

1. **Minimal** - Like Linear
   - 90% neutrals, 10% accent color
   - Barely any borders (use subtle fills instead)
   - Generous white space
   - Clean, uncluttered interfaces

2. **Spacious** - Breathing Room
   - 96px between major sections
   - 24-32px card padding
   - 16-24px element gaps
   - Never cramped

3. **Professional** - Enterprise Quality
   - Inter font family
   - Tight letter-spacing on headings
   - Clear hierarchy
   - Subtle, purposeful animations

4. **Bold Accent** - Framer Blue
   - Primary: #0055FF (Framer blue)
   - Secondary: #0099FF (lighter blue)
   - Used sparingly (CTAs, status, highlights)
   - 90% of UI is neutral grays

---

## 🎯 Component Hierarchy

**Always use components in this order:**

### 1. Kibo UI (Advanced Components)
```tsx
import { CreditCard } from '@/components/kibo/credit-card';
import { Spinner } from '@/components/kibo/spinner';
```

**Use for:**
- Agent/workflow cards → CreditCard
- Loading states → Spinner
- Advanced interactions → 1,101 patterns available via MCP

### 2. shadcn/ui (Base Components)
```tsx
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
```

**Use for:**
- Buttons, inputs, forms
- Dialogs, sheets, popovers
- Tables, tabs, accordions
- 41 components available

### 3. Custom (Last Resort)
Only create custom components when neither Kibo nor shadcn provides the pattern.

**Always ask:** "Can Kibo or shadcn do this?"

---

## 🎨 Colors

### Palette (Linear-Inspired)

```css
/* Primary (Framer Blue) */
--primary: #0055FF;
--primary-hover: #0044DD;
--primary-light: #0099FF;

/* Neutrals (90% of UI) */
--background: #FFFFFF;
--foreground: #000000;
--muted: #F5F5F5;
--muted-foreground: #666666;
--border: #ECECEC;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Usage Rules

✅ **DO:**
- Use Framer blue for CTAs only
- Use neutrals for 90% of interface
- Use semantic colors for status
- Keep backgrounds clean (white/subtle gray)

❌ **DON'T:**
- Add color everywhere
- Use heavy gradients on cards (minimal style!)
- Use bright colors for decoration
- Create custom colors without justification

---

## 📝 Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Why Inter:**
- Used by Linear, Notion, Vercel
- Professional, highly readable
- Excellent at all sizes
- Free and web-optimized

### Type Scale

```css
/* Hero (Landing pages) */
--text-6xl: 60px;
--text-5xl: 48px;

/* Headings */
--text-4xl: 36px;  /* H1 */
--text-3xl: 30px;  /* H2 */
--text-2xl: 24px;  /* H3 */
--text-xl: 20px;   /* H4 */

/* Body */
--text-base: 16px;  /* Default */
--text-sm: 14px;    /* Small */
--text-xs: 12px;    /* Tiny */
```

### Letter Spacing

```css
/* Headings: Tight */
h1, h2, h3, h4, h5, h6 {
  letter-spacing: -0.02em;
}

/* Body: Normal */
p, span {
  letter-spacing: 0;
}
```

### Line Height

```css
--leading-tight: 1.1;   /* Hero headlines */
--leading-snug: 1.2;    /* Headings */
--leading-normal: 1.5;  /* UI text */
--leading-relaxed: 1.6; /* Body copy */
```

---

## 📐 Spacing System

### Base Unit: 4px

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
--spacing-24: 96px;
```

### Usage Patterns

**Sections (Vertical):**
```tsx
<section className="py-24">  {/* 96px top/bottom */}
  <div className="space-y-16">  {/* 64px between blocks */}
```

**Cards:**
```tsx
<div className="p-6">  {/* 24px all around */}
  <div className="space-y-4">  {/* 16px between elements */}
```

**Elements:**
```tsx
<div className="flex gap-4">  {/* 16px gap */}
<div className="mb-6">  {/* 24px margin bottom */}
```

**Key Insight:** More space = more premium feel

---

## 🎭 Effects

### Shadows (Subtle)

```css
/* Minimal - Almost invisible */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.03);

/* Subtle - Cards, hovers */
--shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* Medium - Elevated elements */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Large - Dialogs, popovers */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

### Borders (Minimal)

```css
/* Default - Very light */
border: 1px solid #ECECEC;

/* Muted - Even lighter */
border: 1px solid #F5F5F5;
```

**Rule:** Use subtle fills instead of borders when possible!

### Border Radius

```css
--radius-sm: 4px;   /* Small elements */
--radius: 6px;      /* Default (Linear style) */
--radius-md: 8px;   /* Cards */
--radius-lg: 12px;  /* Large cards */
--radius-xl: 16px;  /* Hero elements */
```

### Transitions (Fast)

```css
/* Default - Snappy */
transition: all 150ms ease;

/* Hover lift */
transition: transform 150ms ease, box-shadow 150ms ease;
```

**Rule:** Keep animations fast and purposeful, never sluggish.

---

## 🎨 Component Patterns

### Buttons

**Primary (Framer Blue):**
```tsx
<Button className="bg-primary hover:bg-primary-hover">
  Get Started
</Button>
```

**Secondary (Outline):**
```tsx
<Button variant="outline">
  Learn More
</Button>
```

**Ghost (Minimal):**
```tsx
<Button variant="ghost">
  Cancel
</Button>
```

### Cards

**Use Kibo UI CreditCard:**
```tsx
<CreditCard className="p-6">
  <h3 className="text-xl font-semibold mb-2">Title</h3>
  <p className="text-muted-foreground">Description</p>
</CreditCard>
```

**Or Minimal div:**
```tsx
<div className="rounded-lg bg-muted/30 p-6 hover:bg-muted/50 transition-colors">
  {/* Content */}
</div>
```

### Tables

**Clean, Linear style:**
```tsx
<div className="rounded-lg border overflow-hidden">
  <table className="w-full">
    <thead className="bg-muted/30">
      <tr>
        <th className="text-left p-3 text-sm font-medium">Name</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="p-3">Value</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Stats Cards

**Minimal, no heavy borders:**
```tsx
<div className="p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
  <div className="text-sm text-muted-foreground mb-1">Label</div>
  <div className="text-3xl font-semibold">Value</div>
  <div className="text-xs text-muted-foreground mt-1">Change</div>
</div>
```

---

## 🚫 Forbidden Patterns

### Never Use:

❌ **Inline Styles**
```tsx
// BAD
<div style={{ color: 'blue', padding: '20px' }}>
```

✅ **Use Tailwind Classes**
```tsx
// GOOD
<div className="text-blue-500 p-5">
```

---

❌ **Heavy Borders**
```tsx
// BAD
<div className="border-2 border-gray-400">
```

✅ **Subtle Fills Instead**
```tsx
// GOOD
<div className="bg-muted/30 border border-border">
```

---

❌ **Hardcoded Colors**
```tsx
// BAD
<div className="bg-[#FF5733]">
```

✅ **Use Design Tokens**
```tsx
// GOOD
<div className="bg-primary">
```

---

❌ **Colorful Gradients Everywhere**
```tsx
// BAD (too much color)
<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
```

✅ **Minimal, Subtle Backgrounds**
```tsx
// GOOD
<div className="bg-muted/30">
```

---

❌ **Custom Card Components**
```tsx
// BAD
const MyCard = () => <div className="...custom...">
```

✅ **Use Kibo UI CreditCard**
```tsx
// GOOD
import { CreditCard } from '@/components/kibo/credit-card';
```

---

## ✅ Required Patterns

### Must Have:

✅ **Inter Font**
- All text uses Inter
- Load from Google Fonts or rsms.me/inter

✅ **8px Spacing Grid**
- Everything aligns to 4px/8px
- Generous spacing throughout

✅ **Framer Blue for CTAs Only**
- Primary actions use #0055FF
- Everything else is neutral

✅ **90% Neutrals, 10% Accent**
- Most of UI is black/white/gray
- Color used sparingly

✅ **Subtle Shadows**
- 0 1px 3px rgba(0,0,0,0.05)
- Never heavy drop shadows

✅ **Fast Transitions**
- 150ms default
- Snappy, responsive feel

✅ **Minimal Borders**
- 1px #ECECEC max
- Prefer subtle fills

---

## 🎯 Page Layouts

### Landing Page

```tsx
// Hero
<section className="py-32 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-6xl font-bold tracking-tight mb-6">
      Headline
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
      Subheading
    </p>
    <div className="flex items-center justify-center gap-4">
      <Button size="lg">Primary CTA</Button>
      <Button size="lg" variant="outline">Secondary</Button>
    </div>
  </div>
</section>

// Features
<section className="py-24 px-4 bg-muted/30">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-semibold text-center mb-16">
      Features
    </h2>
    <div className="grid md:grid-cols-3 gap-12">
      {/* Feature cards */}
    </div>
  </div>
</section>
```

### Dashboard

```tsx
// Stats
<div className="grid grid-cols-4 gap-6 mb-8">
  {/* Stat cards */}
</div>

// Table
<div className="rounded-lg border overflow-hidden">
  <table className="w-full">
    {/* Clean table */}
  </table>
</div>
```

---

## 🎨 Special: Make.com Grid Canvas

### 3D Isometric Nodes

```tsx
<div className="perspective-1000">
  <motion.div
    style={{
      transform: 'rotateX(5deg)',
      transformStyle: 'preserve-3d',
    }}
    whileHover={{ scale: 1.05, rotateX: -2 }}
  >
    {/* Node content */}
  </motion.div>
</div>
```

### Purple Highlights

```tsx
// Dependency circles
<div className="absolute rounded-full border-2 border-purple-400 bg-purple-100/20">
```

---

## 📋 Quality Checklist

Before shipping any page, verify:

- [ ] Inter font loaded and applied
- [ ] 90% neutrals, 10% Framer blue
- [ ] Generous spacing (96px sections, 24px cards)
- [ ] Minimal borders (subtle fills instead)
- [ ] Subtle shadows only (0 1px 3px)
- [ ] Fast transitions (150ms)
- [ ] Using Kibo UI for cards
- [ ] Using shadcn/ui for base components
- [ ] No inline styles
- [ ] No hardcoded colors
- [ ] Clean, professional appearance
- [ ] Matches Linear's minimal aesthetic

---

## 🚀 Implementation

### Quick Start

1. **Typography:** Add Inter font to globals.css
2. **Colors:** Use Framer blue (#0055FF) for CTAs only
3. **Spacing:** Use py-24 for sections, p-6 for cards
4. **Components:** Kibo UI → shadcn → Custom
5. **Style:** Minimal borders, subtle fills, generous space

### Testing

```bash
# Visual check
- Does it look as good as Linear?
- Is there enough breathing room?
- Is color usage minimal?

# Code check
pnpm typecheck  # 0 errors
pnpm lint       # Clean
```

---

## 📚 References

- **Linear:** https://linear.app (minimal aesthetic)
- **Framer:** https://framer.com (our blue accent)
- **Make.com:** Grid canvas reference
- **Inter Font:** https://rsms.me/inter/

---

## 🎯 Success = Linear Quality + Framer Blue + Professional Polish

**This is our single source of truth for all design decisions.**

**When in doubt, copy Linear. When adding color, use Framer blue sparingly. When building components, use Kibo/shadcn first.**

---

**Last Updated:** November 2, 2025
**Maintained By:** AI Development Agent
**Status:** ✅ Active - Follow religiously

