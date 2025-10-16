# Atomic Components Implementation Checklist

**Sprint 1: Complete Atomic Component Library**  
**Start Date:** 2025-10-16  
**Status:** 🔄 In Progress  
**Completion:** 10/30 components (33%)

---

## Progress Summary

| Category    | Total  | Existing | To Build | Status     |
| ----------- | ------ | -------- | -------- | ---------- |
| Typography  | 5      | 0        | 5        | ⏳ Pending |
| Forms       | 6      | 3        | 3        | ⏳ Pending |
| Indicators  | 8      | 4        | 4        | ⏳ Pending |
| Media       | 4      | 0        | 4        | ⏳ Pending |
| Interactive | 4      | 1        | 3        | ⏳ Pending |
| Layout      | 3      | 2        | 1        | ⏳ Pending |
| **TOTAL**   | **30** | **10**   | **20**   | **33%**    |

---

## ✅ Existing Components (10)

### Forms (3)

- ✅ Button (`button.tsx`) - Complete with cva, all variants
- ✅ Input (`input.tsx`) - Complete with variants, addons
- ✅ Textarea (`textarea.tsx`) - Basic implementation exists

### Indicators (4)

- ✅ Badge (`badge.tsx`) - Complete with all variants
- ✅ Progress (`progress.tsx`) - Basic Radix implementation
- ✅ Skeleton (`skeleton.tsx`) - Loading placeholder
- ✅ Toast (`toast.tsx` + `toaster.tsx`) - Radix toast system

### Interactive (1)

- ✅ Tooltip (`tooltip.tsx`) - Radix primitive

### Layout (2)

- ✅ Card (`card.tsx`) - Container component
- ✅ Separator (`separator.tsx`) - Horizontal/vertical divider

---

## 🔨 Components to Build (20)

### Typography (5) - ⏳ Not Started

- [ ] **Heading** (`heading.tsx`)
  - Variants: h1-h6, sizes xs→5xl
  - Props: level, as, size, className
  - Status: Not started
- [ ] **Text** (`text.tsx`)
  - Variants: body, muted, subtle, accent
  - Sizes: xs, sm, base, lg
  - Status: Not started
- [ ] **Caption** (`caption.tsx`)
  - Variants: default, muted, subtle, success, warning, error
  - With optional icon
  - Status: Not started
- [ ] **Code** (`code.tsx`)
  - Variants: inline, block
  - Syntax: font-mono, bg-muted
  - Status: Not started
- [ ] **Link** (`link.tsx`)
  - Variants: primary, muted, underline, no-underline
  - Integration with wouter
  - Status: Not started

---

### Forms (3) - ⏳ Not Started

- [ ] **Checkbox** (`checkbox.tsx`)
  - **Dependency:** Install `@radix-ui/react-checkbox`
  - Sizes: sm (16px), md (20px), lg (24px)
  - States: checked, unchecked, indeterminate
  - Status: Not started
- [ ] **Switch** (`switch.tsx`)
  - **Dependency:** Install `@radix-ui/react-switch`
  - Sizes: sm (36px), md (44px), lg (52px)
  - Animation: Thumb slide
  - Status: Not started
- [ ] **Textarea (Enhanced)** (`textarea.tsx`)
  - Enhance existing with: auto-resize, char count
  - Variants: default, destructive, success
  - Status: Not started

---

### Indicators (4) - ⏳ Not Started

- [ ] **Tag** (`tag.tsx`)
  - Variants: default, primary, success, warning, destructive
  - Removable with close button
  - Status: Not started
- [ ] **Spinner** (`spinner.tsx`)
  - Sizes: xs (12px) → xl (32px)
  - Variants: default, primary, success, warning, destructive
  - Status: Not started
- [ ] **Progress Bar (Enhanced)** (`progress-bar.tsx`)
  - Enhance existing with: striped, animated, percentage
  - Status: Not started
- [ ] **Dot Indicator** (`dot.tsx`)
  - Sizes: xs (6px) → lg (12px)
  - Pulse animation
  - Status: Not started
- [ ] **Status Indicator** (`status-indicator.tsx`)
  - Variants: online, offline, busy, away, inactive
  - With labels and pulse
  - Status: Not started

---

### Media (4) - ⏳ Not Started

- [ ] **Icon** (`icon.tsx`)
  - Wrapper for lucide-react
  - Sizes: xs (12px) → 2xl (48px)
  - Status: Not started
- [ ] **Avatar** (`avatar.tsx`)
  - **Dependency:** Install `@radix-ui/react-avatar`
  - Variants: circle, square
  - Sizes: xs (24px) → 2xl (64px)
  - Status: Not started
- [ ] **Logo** (`logo.tsx`)
  - Variants: full, icon-only, wordmark
  - Light/dark mode support
  - Status: Not started
- [ ] **Image** (`image.tsx`)
  - Lazy loading, skeleton, error state
  - Props: src, alt, aspectRatio, fit, rounded
  - Status: Not started

---

### Interactive (3) - ⏳ Not Started

- [ ] **Tooltip (Enhanced)** (`tooltip-enhanced.tsx`)
  - Enhance existing or create variant system
  - Variants: default, dark, light
  - Status: Not started
- [ ] **Kbd** (`kbd.tsx`)
  - Display keyboard shortcuts
  - Platform detection (⌘ vs Ctrl)
  - Status: Not started
- [ ] **Divider with Text** (`divider.tsx`)
  - Text variants: center, left, right
  - Use case: OAuth "OR" dividers
  - Status: Not started

---

## 📦 Dependencies to Install

Run in apps/web directory:

```bash
npm install @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-switch
```

**Required:**

- [ ] `@radix-ui/react-avatar` - For Avatar component
- [ ] `@radix-ui/react-checkbox` - For Checkbox component
- [ ] `@radix-ui/react-switch` - For Switch component

**Already Installed:**

- ✅ `class-variance-authority` - For variant management
- ✅ `lucide-react` - For icons
- ✅ `@radix-ui/react-tooltip` - For tooltips
- ✅ `@radix-ui/react-separator` - For separators
- ✅ All other Radix primitives

---

## 🎯 Implementation Phases

### Phase 0: Audit & Setup ✅ COMPLETE

- ✅ Inventory existing components (10 found)
- ✅ Identify missing components (20 needed)
- ✅ Check dependencies (3 to install)
- ✅ Create this checklist

### Phase 1: Typography Atoms (5 components)

- [ ] Heading
- [ ] Text
- [ ] Caption
- [ ] Code
- [ ] Link

**Time Estimate:** 2 hours  
**Status:** Not started

### Phase 2: Form Elements (3 components)

- [ ] Install dependencies first
- [ ] Checkbox
- [ ] Switch
- [ ] Textarea (Enhanced)

**Time Estimate:** 1.5 hours  
**Status:** Not started

### Phase 3: Indicators (4 components)

- [ ] Tag
- [ ] Spinner
- [ ] Progress Bar (Enhanced)
- [ ] Dot Indicator
- [ ] Status Indicator

**Time Estimate:** 2 hours  
**Status:** Not started

### Phase 4: Media (4 components)

- [ ] Install Avatar dependency first
- [ ] Icon
- [ ] Avatar
- [ ] Logo
- [ ] Image

**Time Estimate:** 2 hours  
**Status:** Not started

### Phase 5: Interactive (3 components)

- [ ] Tooltip (Enhanced)
- [ ] Kbd
- [ ] Divider

**Time Estimate:** 1.5 hours  
**Status:** Not started

### Phase 6-10: Integration, Testing, Deployment

- [ ] Barrel export (`ui/index.ts`)
- [ ] JSDoc documentation
- [ ] Accessibility audit
- [ ] Visual testing
- [ ] Commit & deploy

**Time Estimate:** 4 hours  
**Status:** Not started

---

## 📊 Quality Gates

Each component must meet:

- ✅ Uses `cva` for variants
- ✅ Full TypeScript types (no `any`)
- ✅ Design tokens only (no arbitrary values)
- ✅ Accessibility (ARIA, keyboard nav)
- ✅ Light + dark mode support
- ✅ Mobile-first responsive
- ✅ JSDoc documentation

---

## 🚀 Deployment Checklist

- [ ] TypeScript: `npm run typecheck` - zero errors
- [ ] Lint: `npm run lint` - zero errors
- [ ] Build: `npm run build` - success
- [ ] Visual test: All components in light/dark mode
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Commit: Proper conventional commit message
- [ ] Push: `git push origin main`
- [ ] Verify: Preview deployment works

---

## 📝 Notes

- **Pattern:** All components use class-variance-authority (cva)
- **Styling:** Tailwind + design tokens from tailwind.config.ts
- **Accessibility:** WCAG 2.1 AA minimum
- **File naming:** kebab-case (e.g., `heading.tsx`)
- **Export pattern:** Named exports with types

---

**Last Updated:** 2025-10-16 21:00 UTC  
**Next Action:** Install missing Radix UI dependencies
