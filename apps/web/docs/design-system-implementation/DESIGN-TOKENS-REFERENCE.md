# Design Tokens Reference

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Implementation Status:** ✅ Complete

---

## Overview

This document provides a complete reference for the GalaxyCo.ai design token system implemented in Phase 2 of the design system rollout. All design tokens have been implemented in `tailwind.config.ts` and `styles/globals.css`.

---

## Color System

### Brand Colors

#### Primary (Purple)

```tsx
// Usage in components
className = "bg-primary text-primary-foreground hover:bg-primary-hover";

// Available tokens
primary; // hsl(262, 83%, 58%) - #8b5cf6
primary - foreground; // hsl(0, 0%, 100%) - White text
primary - hover; // hsl(262, 83%, 52%) - Hover state
primary - active; // hsl(262, 83%, 46%) - Active state
primary - muted; // hsl(262, 83%, 96%) - Light backgrounds
primary - subtle; // hsl(262, 20%, 88%) - Borders
```

#### Secondary (Slate Blue)

```tsx
// Usage
className = "bg-secondary text-secondary-foreground hover:bg-secondary-hover";

// Available tokens
secondary; // hsl(215, 25%, 27%) - #344050
secondary - foreground; // hsl(0, 0%, 98%)
secondary - hover; // hsl(215, 25%, 32%)
secondary - active; // hsl(215, 25%, 22%)
```

#### Semantic Colors

```tsx
// Success (Green)
success; // hsl(142, 76%, 36%) - #16a34a
success - foreground; // hsl(0, 0%, 100%)
success - light; // hsl(142, 76%, 96%) - Message backgrounds
success - border; // hsl(142, 76%, 45%)

// Warning (Amber)
warning; // hsl(38, 92%, 50%) - #f59e0b
warning - foreground; // hsl(0, 0%, 0%) - Dark text for contrast
warning - light; // hsl(38, 92%, 96%)
warning - border; // hsl(38, 92%, 55%)

// Destructive (Red)
destructive; // hsl(0, 84%, 60%) - #ef4444
destructive - foreground; // hsl(0, 0%, 100%)
destructive - light; // hsl(0, 84%, 96%)
destructive - border; // hsl(0, 84%, 65%)
```

### Neutral Colors (Dark Mode Default)

```tsx
// Background layers
background; // hsl(240, 10%, 4%) - Page background
background - elevated; // hsl(240, 6%, 10%) - Cards, modals
background - subtle; // hsl(240, 4%, 16%) - Hover states

// Text colors
foreground; // hsl(0, 0%, 98%) - Primary text
foreground - muted; // hsl(240, 5%, 65%) - Secondary text
foreground - subtle; // hsl(240, 4%, 46%) - Tertiary text

// Interactive colors
border; // hsl(240, 4%, 24%) - Default borders
border - hover; // hsl(240, 4%, 32%) - Hover borders
border - focus; // hsl(262, 83%, 58%) - Focus rings
hover; // hsl(240, 4%, 16%) - Hover backgrounds
active; // hsl(240, 4%, 12%) - Active/pressed
selected; // hsl(262, 60%, 16%) - Selected items
```

---

## Typography System

### Font Families

```tsx
font - sans; // Inter, system-ui, -apple-system, sans-serif
font - mono; // JetBrains Mono, Menlo, Monaco, monospace
```

### Font Sizes & Line Heights

```tsx
text-xs      // 12px / 16px - Labels, captions
text-sm      // 14px / 20px - Small body, table text
text-base    // 16px / 24px - Body text (default)
text-lg      // 18px / 28px - Subheadings
text-xl      // 20px / 28px - Card titles
text-2xl     // 24px / 32px - Section titles
text-3xl     // 30px / 36px - Page titles
text-4xl     // 36px / 40px - Hero headlines
text-5xl     // 48px / 48px - Display (rare)
```

### Font Weights

```tsx
font - normal; // 400 - Body text
font - medium; // 500 - Emphasized text, table headers
font - semibold; // 600 - Buttons, section titles
font - bold; // 700 - Headlines (use sparingly)
```

---

## Spacing System (4px Grid)

```tsx
// Tailwind classes with pixel equivalents
p - 1; // 4px  - Tight spacing (badges, chips)
p - 2; // 8px  - Small gaps (icon + text)
p - 3; // 12px - Medium-tight
p - 4; // 16px - Base spacing (default padding/margin)
p - 5; // 20px - Comfortable
p - 6; // 24px - Section padding
p - 8; // 32px - Large section spacing
p - 10; // 40px - Very large
p - 12; // 48px - Extra large
p - 16; // 64px - Massive (hero sections)
p - 20; // 80px - XXL
p - 24; // 96px - XXXL
```

### Common Patterns

```tsx
// Button padding
className = "px-4 py-2"; // 16px × 8px

// Card padding
className = "p-6"; // 24px all sides

// Section spacing
className = "py-12 md:py-16"; // 48px mobile, 64px desktop

// Page margins
className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
```

---

## Border Radius

```tsx
rounded - none; // 0
rounded - sm; // 4px  - Small elements (badges)
rounded; // 8px  - Buttons, inputs, cards (DEFAULT)
rounded - md; // 12px - Larger cards
rounded - lg; // 16px - Modals, dialogs
rounded - xl; // 24px - Hero sections
rounded - full; // 9999px - Pills, avatars
```

### Guidelines

```tsx
// Buttons/inputs
className = "rounded"; // 8px

// Cards
className = "rounded-lg"; // 16px

// Modals
className = "rounded-xl"; // 24px

// Avatars/pills
className = "rounded-full";
```

---

## Shadows (Elevation)

```tsx
shadow - sm; // Small elements (dropdowns, tooltips)
shadow; // Cards, buttons (DEFAULT)
shadow - md; // Elevated cards, popovers
shadow - lg; // Modals, drawers
shadow - xl; // Floating panels
shadow - inner; // Pressed buttons, inset inputs
```

---

## Responsive Breakpoints

```tsx
// Mobile-first approach
sm:     // 640px  - Tablet portrait
md:     // 768px  - Tablet landscape
lg:     // 1024px - Desktop
xl:     // 1280px - Large desktop
2xl:    // 1536px - Extra large desktop
```

### Usage Examples

```tsx
// Base styles = mobile, then add breakpoints
className = "p-4 sm:p-6 lg:p-8";
// 16px mobile, 24px tablet, 32px desktop
```

---

## Z-Index Scale

```tsx
z - hide; // -1
z - base; // 0
z - dropdown; // 1000
z - sticky; // 1100
z - overlay; // 1200
z - modal; // 1300
z - popover; // 1400
z - tooltip; // 1500
z - toast; // 1600
```

---

## Animation Tokens

### Transition Durations

```tsx
duration - fast; // 150ms - Micro-interactions (hover, focus)
duration - base; // 200ms - Default transitions
duration - slow; // 300ms - Larger movements (modals, drawers)
duration - slower; // 500ms - Complex animations (page transitions)
```

### Timing Functions

```tsx
ease - smooth; // cubic-bezier(0.4, 0, 0.2, 1) - Default (ease-in-out)
ease - snappy; // cubic-bezier(0.4, 0, 1, 1) - Quick exit (ease-in)
ease - bounce; // cubic-bezier(0, 0, 0.2, 1) - Gentle entry (ease-out)
ease - spring; // cubic-bezier(0.34, 1.56, 0.64, 1) - Overshoot effect
```

### Pre-built Animations

```tsx
animate-fade-in     // fadeIn 0.15s ease-out
animate-fade-out    // fadeOut 0.15s ease-in
animate-slide-up    // slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)
animate-slide-down  // slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)
animate-scale-in    // scaleIn 0.15s cubic-bezier(0, 0, 0.2, 1)
animate-scale-out   // scaleOut 0.15s cubic-bezier(0, 0, 0.2, 1)
```

---

## CSS Component Classes

### Button Variants

```tsx
.btn-primary      // Primary button with design tokens
.btn-secondary    // Secondary button
.btn-ghost        // Transparent background
.btn-outline      // Border button
```

### Card Components

```tsx
.card            // Basic card with design tokens
.card-hover      // Card with hover effects
.kpi-card        // KPI card component
```

### Badge Variants

```tsx
.badge           // Base badge styles
.badge-default   // Default badge
.badge-success   // Success badge (green)
.badge-warning   // Warning badge (amber)
.badge-destructive // Error badge (red)
```

### Status Indicators

```tsx
.status-dot      // Base dot styles
.status-active   // Success state (green)
.status-idle     // Primary state (blue)
.status-paused   // Warning state (amber)
.status-error    // Error state (red)
.status-disabled // Disabled state (gray)
```

---

## Migration Guide

### From Old System

```tsx
// OLD (don't use)
className = "bg-blue-500 text-white";

// NEW (design system)
className = "bg-primary text-primary-foreground";
```

### Component Updates Required

1. **Buttons**: Replace hardcoded colors with semantic tokens
2. **Cards**: Use `bg-background-elevated` instead of `bg-white`
3. **Text**: Use `text-foreground` instead of `text-gray-900`
4. **Borders**: Use `border-border` instead of `border-gray-200`
5. **Inputs**: Use `bg-background-subtle` instead of `bg-gray-50`

---

## Light Mode Support

The system defaults to dark mode but supports light mode via CSS variables. Light mode colors are automatically applied when `.dark` class is not present.

### Light Mode Overrides

```css
:root {
  --background: 0 0% 100%; /* White backgrounds */
  --foreground: 240 10% 4%; /* Dark text */
  --border: 240 6% 90%; /* Light borders */
  /* ... other light mode colors */
}
```

---

## Accessibility Notes

### Focus States

- All interactive elements have visible focus rings using `focus-visible:ring-2 focus-visible:ring-primary`
- Focus rings use primary color with 2px width
- Outline offset of 2px for better visibility

### Color Contrast

- All text colors meet WCAG AA standards (4.5:1 minimum)
- Light backgrounds on dark text and vice versa
- Warning text uses dark text for better contrast

### Reduced Motion

- All animations respect `prefers-reduced-motion: reduce`
- Critical functionality doesn't rely on animations

---

## Next Steps

1. **Phase 3**: Update atomic components (buttons, inputs, badges) to use these tokens
2. **Phase 4**: Update complex components (data tables, modals, navigation)
3. **Phase 5**: Apply to page templates and existing pages
4. **Testing**: Verify responsive behavior and accessibility compliance

---

## Implementation Files

- **Tailwind Config**: `apps/web/tailwind.config.ts`
- **Global CSS**: `apps/web/styles/globals.css`
- **Backup**: `apps/web/lib/design-tokens.ts.backup`

---

**Status:** ✅ Complete - Ready for Phase 3 (Component Updates)
