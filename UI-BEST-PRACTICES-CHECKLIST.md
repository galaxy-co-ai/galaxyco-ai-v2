# ✅ UI BEST PRACTICES CHECKLIST

## GalaxyCo.ai UI Development Standards

**Last Updated:** November 4, 2025  
**Purpose:** Quality checklist for all UI development  
**Use:** Review before committing any UI changes

---

## 🎯 BEFORE YOU START

- [ ] Read `DESIGN-SYSTEM.md` (understand the vision)
- [ ] Read `UI-COMPONENT-DECISION-GUIDE.md` (know which components to use)
- [ ] Understand the feature requirements
- [ ] Know your target devices (mobile, tablet, desktop)

---

## 🏗️ COMPONENT SELECTION

### **Choosing the Right Component**

- [ ] Checked if shadcn/ui has this component (`components/ui/`)
- [ ] Checked if Kibo UI has this component (`src/components/kibo-ui/`)
- [ ] Checked if a feature-specific component exists
- [ ] Created new component only if necessary
- [ ] Placed component in correct directory

### **Component Structure**

- [ ] Component has clear, descriptive name (`ComponentName`, not `Comp1`)
- [ ] Props are properly typed with TypeScript
- [ ] Component is properly exported
- [ ] Added JSDoc comments for complex components
- [ ] Used `'use client'` directive only when needed (useState, useEffect, etc.)

---

## 🎨 STYLING

### **Color Usage**

- [ ] ALL colors use design tokens (no hardcoded `#HEX` or `rgb()` values)
- [ ] NO inline styles (no `style={{...}}`)
- [ ] NO arbitrary values (no `bg-[#0055FF]`)
- [ ] Used semantic color names (`bg-primary`, `text-destructive`)
- [ ] Respects 90/10 rule (90% neutrals, 10% accent colors)
- [ ] Text has sufficient contrast (WCAG AA: 4.5:1 minimum)

**Common Colors:**

```tsx
✅ bg-primary, text-foreground, border-border
❌ bg-blue-500, text-gray-600, border-[#ECECEC]
```

### **Typography**

- [ ] Uses type scale (`text-base`, `text-xl`, NOT `text-[17px]`)
- [ ] Uses font weight scale (`font-semibold`, NOT custom weights)
- [ ] Headings use `font-semibold` (or `font-bold` for hero)
- [ ] Headings have tight letter-spacing (default: `-0.02em`)
- [ ] Body text uses `text-base` (16px)
- [ ] Small text uses `text-sm` (14px), captions use `text-xs` (12px)

### **Spacing**

- [ ] Uses spacing scale (`p-4`, `gap-6`, NOT `p-[17px]`)
- [ ] Follows 4px grid (`p-1` to `p-24`)
- [ ] Cards use `p-6` (24px padding)
- [ ] Sections use `py-24` (96px vertical padding)
- [ ] Elements use `gap-4` or `space-y-4` (16px)
- [ ] Consistent spacing throughout component

---

## 📱 RESPONSIVE DESIGN

### **Mobile-First Approach**

- [ ] Base styles work on mobile (320px minimum)
- [ ] Used responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- [ ] Text is readable on small screens
- [ ] Touch targets are 44px minimum
- [ ] Images are optimized for mobile
- [ ] Tested on actual mobile device or DevTools

**Breakpoints:**

```tsx
✅ className="flex-col md:flex-row"
✅ className="text-2xl md:text-4xl"
✅ className="px-4 sm:px-6 lg:px-8"
```

### **Layout**

- [ ] Layout doesn't break at any screen size
- [ ] Horizontal scrolling is intentional (not accidental)
- [ ] Content is centered on large screens (`max-w-*`, `mx-auto`)
- [ ] Grid columns collapse appropriately (`grid-cols-1 md:grid-cols-2`)

---

## ♿ ACCESSIBILITY

### **Required for ALL Interactive Elements**

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] ARIA labels where needed (`aria-label`, `aria-labelledby`)
- [ ] Keyboard navigation works (`Tab`, `Enter`, `Space`)
- [ ] Focus indicators visible (`:focus-visible`)
- [ ] Images have `alt` text
- [ ] Forms have associated `<label>` elements

**Example:**

```tsx
✅ <button aria-label="Close dialog">×</button>
✅ <img src="/logo.png" alt="GalaxyCo logo" />
✅ <label htmlFor="email">Email</label><Input id="email" />
❌ <div onClick={...}>Click me</div>  {/* Use <button> */}
❌ <img src="/logo.png" />  {/* Missing alt */}
```

### **Screen Reader Support**

- [ ] Content makes sense when read linearly
- [ ] Decorative elements have `aria-hidden="true"`
- [ ] Status messages use `role="status"` or `role="alert"`
- [ ] Skip links for navigation (`<a href="#main">Skip to content</a>`)

---

## ⚡ PERFORMANCE

### **Images & Media**

- [ ] Used Next.js `<Image />` component (NOT `<img />`)
- [ ] Images have `width` and `height` attributes
- [ ] Large images are lazy-loaded
- [ ] Icons use SVG or icon font (Lucide React)
- [ ] No unnecessary animations on scroll

### **Code Efficiency**

- [ ] No console.log in production code
- [ ] No unused imports
- [ ] No duplicated code (DRY principle)
- [ ] Components are reasonably sized (< 300 lines)
- [ ] Heavy computations are memoized (`useMemo`, `useCallback`)

---

## 🔄 STATES & INTERACTIONS

### **All States Handled**

- [ ] **Default** - Component renders correctly
- [ ] **Loading** - Shows Skeleton or Spinner
- [ ] **Error** - Shows user-friendly error message
- [ ] **Empty** - Shows EmptyState component
- [ ] **Success** - Shows success feedback (toast, check mark)
- [ ] **Disabled** - Visually disabled, not interactive

**Example:**

```tsx
✅ {isLoading && <Skeleton />}
✅ {error && <ErrorMessage />}
✅ {!data.length && <EmptyState />}
✅ {data && <DataDisplay />}
```

### **User Feedback**

- [ ] Button shows loading state when submitting
- [ ] Form validation shows helpful messages
- [ ] Actions show toast notifications
- [ ] Long operations show progress indicators
- [ ] Optimistic UI updates where appropriate

---

## 🧪 TESTING

### **Manual Testing**

- [ ] Tested in Chrome
- [ ] Tested in Firefox or Safari
- [ ] Tested on mobile (DevTools or real device)
- [ ] Tested dark mode (if applicable)
- [ ] Tested keyboard navigation
- [ ] Tested with screen reader (basic check)

### **Code Quality**

- [ ] TypeScript compiles without errors
- [ ] ESLint passes (no warnings for UI code)
- [ ] Prettier formatted
- [ ] No browser console errors
- [ ] Component renders without warnings

---

## 📝 CODE REVIEW CHECKLIST

### **Before Committing**

- [ ] Removed all `console.log` statements
- [ ] Removed commented-out code
- [ ] Removed unused imports and variables
- [ ] Code follows project conventions
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed

### **Git Commit**

- [ ] Used conventional commit format (`feat(web): add component`)
- [ ] Commit message is clear and descriptive
- [ ] Only committed relevant files
- [ ] No sensitive data in commit

**Conventional Commit Format:**

```
feat(scope): message
fix(scope): message
chore(scope): message
```

**Scopes:** `web`, `api`, `db`, `infra`, `agents`, `flows`, `companion`

---

## 🎨 DESIGN SYSTEM COMPLIANCE

### **Must Follow**

- [ ] Uses Inter font (system fallback)
- [ ] Follows Linear minimal aesthetic
- [ ] Uses Framer blue (#0055FF) for primary actions ONLY
- [ ] 90% neutrals, 10% accent color
- [ ] Generous spacing (24px cards, 96px sections)
- [ ] Subtle shadows (`shadow-sm`, `shadow`, `shadow-md`)
- [ ] Minimal borders (1px, `border-border`)

### **Visual Polish**

- [ ] Component looks professional
- [ ] Hover states are defined
- [ ] Active states are defined
- [ ] Transitions are smooth (150ms-200ms)
- [ ] Layout is balanced and aligned
- [ ] Typography is hierarchical and clear

---

## 🚫 COMMON MISTAKES TO AVOID

### **Styling Mistakes**

- ❌ Hardcoded colors: `className="bg-blue-500"`
- ❌ Inline styles: `style={{ padding: '20px' }}`
- ❌ Custom values: `className="text-[17px]"`
- ❌ Arbitrary spacing: `className="mb-7"`
- ❌ Too many colors: Using 5+ different colors in one component

### **Component Mistakes**

- ❌ Creating custom component when shadcn/ui exists
- ❌ Using `<div onClick>` instead of `<button>`
- ❌ Missing `key` prop in lists
- ❌ Not handling loading/error states
- ❌ Components over 500 lines (break it down!)

### **Accessibility Mistakes**

- ❌ Missing `alt` on images
- ❌ Missing `aria-label` on icon buttons
- ❌ No keyboard navigation
- ❌ Poor color contrast (< 4.5:1)
- ❌ Using `<div>` for interactive elements

### **Performance Mistakes**

- ❌ Using `<img>` instead of Next.js `<Image />`
- ❌ Not lazy-loading images
- ❌ Rendering large lists without virtualization
- ❌ Re-rendering on every keystroke (use debounce)
- ❌ Importing entire libraries (import specific modules)

---

## 📊 QUALITY METRICS

### **Component Quality Score**

Rate your component 1-10 on each:

- **Functionality** - Does it work correctly?
- **Accessibility** - Can everyone use it?
- **Responsiveness** - Works on all screens?
- **Performance** - Fast and efficient?
- **Code Quality** - Clean, readable, maintainable?
- **Design System Compliance** - Follows standards?

**Target:** 8+/10 on ALL metrics before merging

---

## 🎯 QUICK REFERENCE

### **Every Component Must Have:**

1. ✅ TypeScript types
2. ✅ Design system colors (no hardcoded)
3. ✅ Proper spacing (4px grid)
4. ✅ Loading state
5. ✅ Error state
6. ✅ Responsive design
7. ✅ Keyboard navigation
8. ✅ ARIA labels (if interactive)
9. ✅ No console.log
10. ✅ Professional appearance

### **Before Committing:**

```bash
# 1. TypeScript check
pnpm typecheck

# 2. Lint check
pnpm lint

# 3. Format
pnpm prettier --write .

# 4. Manual review of this checklist

# 5. Test in browser

# 6. Commit with conventional commit format
```

---

## 📚 RESOURCES

### **Documentation**

- `DESIGN-SYSTEM.md` - Overall design philosophy
- `UI-COMPONENT-DECISION-GUIDE.md` - Which component to use
- `UI-COLOR-SYSTEM-REFERENCE.md` - All colors explained
- `UI-TYPOGRAPHY-SPACING-GUIDE.md` - Type & spacing standards

### **Component Libraries**

- **shadcn/ui:** `components/ui/` - Base components
- **Kibo UI:** `src/components/kibo-ui/` - Advanced components
- **Galaxy:** `components/galaxy/` - Custom branded components

### **External**

- Tailwind CSS Docs: https://tailwindcss.com/docs
- Radix UI Docs: https://www.radix-ui.com/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- React Best Practices: https://react.dev/

---

**Updated:** November 4, 2025  
**Maintained By:** AI Development Agent  
**Status:** ✅ Active - Use this checklist for ALL UI development

---

## ✨ REMEMBER

> "Good design is obvious. Great design is transparent." - Joe Sparano

**Quality over speed. Polish over perfection. Accessibility for all.**

---

**Before you commit, ask yourself:**

1. Would I be proud to show this to users?
2. Can everyone use it (including people with disabilities)?
3. Does it follow the design system?
4. Is it maintainable by other developers?

If the answer to any is "no", keep polishing! 💎
