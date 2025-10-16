# Design Tokens System

**Version:** 1.0  
**Purpose:** Single source of truth for all design decisions (colors, typography, spacing, shadows, animations)

---

## Overview

Design tokens are named variables that store visual design attributes. They ensure consistency and make theme updates trivial (change once, update everywhere).

---

## Color System

### Philosophy
- **Semantic naming:** Colors named by purpose (primary, success) not appearance (blue, green)
- **HSL format:** Easier to create variations (lighten/darken) than hex
- **Dark mode first:** Optimized for dark mode, light mode derived

### Brand Colors

```javascript
// Primary (Purple) - Used for CTAs, links, focus states
primary: {
  DEFAULT: 'hsl(262, 83%, 58%)',      // #8b5cf6
  foreground: 'hsl(0, 0%, 100%)',     // Text on primary buttons
  hover: 'hsl(262, 83%, 52%)',        // Hover state
  active: 'hsl(262, 83%, 46%)',       // Active/pressed state
  muted: 'hsl(262, 83%, 96%)',        // Light backgrounds
  subtle: 'hsl(262, 20%, 88%)',       // Borders, dividers
}

// Secondary (Slate Blue) - Used for secondary actions
secondary: {
  DEFAULT: 'hsl(215, 25%, 27%)',      // #344050
  foreground: 'hsl(0, 0%, 98%)',      // Text on secondary buttons
  hover: 'hsl(215, 25%, 32%)',
  active: 'hsl(215, 25%, 22%)',
}

// Success (Green) - Confirmations, completed states
success: {
  DEFAULT: 'hsl(142, 76%, 36%)',      // #16a34a
  foreground: 'hsl(0, 0%, 100%)',
  light: 'hsl(142, 76%, 96%)',        // Success message backgrounds
  border: 'hsl(142, 76%, 45%)',
}

// Warning (Amber) - Warnings, attention needed
warning: {
  DEFAULT: 'hsl(38, 92%, 50%)',       // #f59e0b
  foreground: 'hsl(0, 0%, 0%)',       // Dark text for contrast
  light: 'hsl(38, 92%, 96%)',
  border: 'hsl(38, 92%, 55%)',
}

// Error/Destructive (Red) - Errors, destructive actions
destructive: {
  DEFAULT: 'hsl(0, 84%, 60%)',        // #ef4444
  foreground: 'hsl(0, 0%, 100%)',
  light: 'hsl(0, 84%, 96%)',
  border: 'hsl(0, 84%, 65%)',
}
```

---

### Neutral Scale (Dark Mode - Default)

```javascript
// Background layers (darkest to lightest)
background: 'hsl(240, 10%, 4%)',        // #0a0a0b - Page background
backgroundElevated: 'hsl(240, 6%, 10%)', // #18181b - Cards, modals
backgroundSubtle: 'hsl(240, 4%, 16%)',   // #27272a - Hover states, subtle backgrounds

// Foreground (text)
foreground: 'hsl(0, 0%, 98%)',          // #fafafa - Primary text
foregroundMuted: 'hsl(240, 5%, 65%)',   // #a1a1aa - Secondary text
foregroundSubtle: 'hsl(240, 4%, 46%)',  // #71717a - Tertiary text, placeholders

// Borders & dividers
border: 'hsl(240, 4%, 24%)',            // #3f3f46 - Default borders
borderHover: 'hsl(240, 4%, 32%)',       // #52525b - Hover borders
borderFocus: 'hsl(262, 83%, 58%)',      // Primary color for focus rings

// Interactive states
hover: 'hsl(240, 4%, 16%)',             // #27272a - Hover backgrounds
active: 'hsl(240, 4%, 12%)',            // #1f1f23 - Active/pressed backgrounds
selected: 'hsl(262, 60%, 16%)',         // #2d1b4e - Selected items (purple tint)
```

---

### Neutral Scale (Light Mode)

```javascript
// Background layers (lightest to darker)
background: 'hsl(0, 0%, 100%)',         // #ffffff - Page background
backgroundElevated: 'hsl(240, 5%, 98%)', // #fafafa - Cards, modals
backgroundSubtle: 'hsl(240, 5%, 96%)',   // #f4f4f5 - Hover states

// Foreground (text)
foreground: 'hsl(240, 10%, 4%)',        // #0a0a0b - Primary text
foregroundMuted: 'hsl(240, 5%, 35%)',   // #52525b - Secondary text
foregroundSubtle: 'hsl(240, 4%, 54%)',  // #71717a - Tertiary text

// Borders & dividers
border: 'hsl(240, 6%, 90%)',            // #e4e4e7 - Default borders
borderHover: 'hsl(240, 5%, 84%)',       // #d4d4d8 - Hover borders
borderFocus: 'hsl(262, 83%, 58%)',      // Primary color for focus rings

// Interactive states
hover: 'hsl(240, 5%, 96%)',             // #f4f4f5 - Hover backgrounds
active: 'hsl(240, 5%, 92%)',            // #e4e4e7 - Active/pressed
selected: 'hsl(262, 60%, 96%)',         // #f5f3ff - Selected items
```

---

## Typography System

### Font Families

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
}
```

**Inter:** Primary UI font (designed for screens, excellent readability)  
**JetBrains Mono:** Code blocks, technical content (ligatures, optimized for code)

### Font Sizes & Line Heights

```javascript
fontSize: {
  // [fontSize, lineHeight]
  xs:   ['0.75rem',  '1rem'],      // 12px / 16px - Labels, captions
  sm:   ['0.875rem', '1.25rem'],   // 14px / 20px - Small body, table text
  base: ['1rem',     '1.5rem'],    // 16px / 24px - Body text (default)
  lg:   ['1.125rem', '1.75rem'],   // 18px / 28px - Subheadings
  xl:   ['1.25rem',  '1.75rem'],   // 20px / 28px - Card titles
  '2xl': ['1.5rem',  '2rem'],      // 24px / 32px - Section titles
  '3xl': ['1.875rem', '2.25rem'],  // 30px / 36px - Page titles
  '4xl': ['2.25rem',  '2.5rem'],   // 36px / 40px - Hero headlines
  '5xl': ['3rem',     '1'],        // 48px / 48px - Display (rare)
}
```

### Font Weights

```javascript
fontWeight: {
  normal:    400,  // Body text
  medium:    500,  // Emphasized text, table headers
  semibold:  600,  // Buttons, section titles
  bold:      700,  // Headlines (use sparingly)
}
```

**Guidelines:**
- Body text: `font-normal` (400)
- Interactive elements (buttons, tabs): `font-medium` (500)
- Headings: `font-semibold` (600)
- Hero headlines: `font-bold` (700)

---

## Spacing System

### Philosophy
- **8px base grid:** All spacing is a multiple of 4px (for consistency)
- **T-shirt sizing:** Named for intuition (xs, sm, base, lg, xl)
- **Composable:** Use `gap`, `p-*`, `m-*` to build layouts

### Scale

```javascript
spacing: {
  px: '1px',
  0:  '0',
  1:  '0.25rem',   // 4px  - Tight spacing (badges, chips)
  2:  '0.5rem',    // 8px  - Small gaps (icon + text)
  3:  '0.75rem',   // 12px - Medium-tight
  4:  '1rem',      // 16px - Base spacing (default padding/margin)
  5:  '1.25rem',   // 20px - Comfortable
  6:  '1.5rem',    // 24px - Section padding
  8:  '2rem',      // 32px - Large section spacing
  10: '2.5rem',    // 40px - Very large
  12: '3rem',      // 48px - Extra large
  16: '4rem',      // 64px - Massive (hero sections)
  20: '5rem',      // 80px - XXL
  24: '6rem',      // 96px - XXXL
}
```

**Common Patterns:**
- Button padding: `px-4 py-2` (16px × 8px)
- Card padding: `p-6` (24px all sides)
- Section spacing: `py-12 md:py-16` (48px mobile, 64px desktop)
- Page margin: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

## Border Radius

```javascript
borderRadius: {
  none: '0',
  sm:   '0.25rem',   // 4px  - Small elements (badges)
  DEFAULT: '0.5rem', // 8px  - Buttons, inputs, cards
  md:   '0.75rem',   // 12px - Larger cards
  lg:   '1rem',      // 16px - Modals, dialogs
  xl:   '1.5rem',    // 24px - Hero sections
  full: '9999px',    // Pills, avatars
}
```

**Guidelines:**
- Buttons/inputs: `rounded` (8px)
- Cards: `rounded-lg` (16px)
- Modals: `rounded-xl` (24px)
- Avatars/pills: `rounded-full`

---

## Shadows (Elevation)

### Philosophy
- **Subtle by default:** Avoid heavy drop shadows
- **Elevation hierarchy:** Increasing shadow = higher elevation
- **Dark mode:** Shadows less visible, use borders instead

```javascript
boxShadow: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  // Small elements (dropdowns, tooltips)
  
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  // Cards, buttons
  
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  // Elevated cards, popovers
  
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  // Modals, drawers
  
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  // Floating panels
  
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  // Pressed buttons, inset inputs
}
```

**Dark Mode Override:**
```javascript
// In dark mode, reduce shadow opacity and add subtle borders
.dark .shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  border: 1px solid hsl(240, 4%, 24%);
}
```

---

## Animation System

### Timing Functions

```javascript
transitionTimingFunction: {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',     // Default (ease-in-out)
  snappy: 'cubic-bezier(0.4, 0, 1, 1)',       // Quick exit (ease-in)
  bounce: 'cubic-bezier(0, 0, 0.2, 1)',       // Gentle entry (ease-out)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Overshoot effect
}
```

### Duration

```javascript
transitionDuration: {
  fast:    '150ms',   // Micro-interactions (hover, focus)
  base:    '200ms',   // Default transitions
  slow:    '300ms',   // Larger movements (modals, drawers)
  slower:  '500ms',   // Complex animations (page transitions)
}
```

**Guidelines:**
- Hover states: `transition-colors duration-fast`
- Modals opening: `transition-all duration-slow`
- Page transitions: `duration-slower`

### Framer Motion Presets

```javascript
// Fade in
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

// Slide up (modals, toasts)
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
}

// Scale (popovers, dropdowns)
const scale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.15, ease: [0, 0, 0.2, 1] }
}

// Slide from right (drawers)
const slideFromRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
}
```

---

## Z-Index Scale

```javascript
zIndex: {
  hide:      -1,
  base:      0,
  dropdown:  1000,
  sticky:    1100,
  overlay:   1200,
  modal:     1300,
  popover:   1400,
  tooltip:   1500,
  toast:     1600,
}
```

**Usage:**
- Sticky headers: `z-sticky` (1100)
- Modals: `z-modal` (1300)
- Toasts: `z-toast` (1600)

---

## Breakpoints (Responsive)

```javascript
screens: {
  sm: '640px',    // Tablet portrait
  md: '768px',    // Tablet landscape
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large desktop
}
```

**Mobile-First Usage:**
```jsx
// Base styles = mobile
<div className="p-4 sm:p-6 lg:p-8">
  // 16px mobile, 24px tablet, 32px desktop
</div>
```

---

## Prose (Typography Plugin)

```javascript
// For long-form content (docs, blog posts)
typography: {
  DEFAULT: {
    css: {
      color: 'hsl(0, 0%, 98%)',
      a: {
        color: 'hsl(262, 83%, 58%)',
        '&:hover': { color: 'hsl(262, 83%, 52%)' },
      },
      strong: { color: 'hsl(0, 0%, 98%)' },
      code: {
        color: 'hsl(262, 83%, 68%)',
        backgroundColor: 'hsl(240, 4%, 16%)',
        borderRadius: '0.25rem',
        padding: '0.125rem 0.25rem',
      },
      'pre code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  },
}
```

---

## Complete Tailwind Config

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: 'hsl(262, 83%, 58%)',
          foreground: 'hsl(0, 0%, 100%)',
          hover: 'hsl(262, 83%, 52%)',
          active: 'hsl(262, 83%, 46%)',
          muted: 'hsl(262, 83%, 96%)',
          subtle: 'hsl(262, 20%, 88%)',
        },
        secondary: {
          DEFAULT: 'hsl(215, 25%, 27%)',
          foreground: 'hsl(0, 0%, 98%)',
          hover: 'hsl(215, 25%, 32%)',
          active: 'hsl(215, 25%, 22%)',
        },
        success: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(0, 0%, 100%)',
          light: 'hsl(142, 76%, 96%)',
          border: 'hsl(142, 76%, 45%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 92%, 50%)',
          foreground: 'hsl(0, 0%, 0%)',
          light: 'hsl(38, 92%, 96%)',
          border: 'hsl(38, 92%, 55%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 100%)',
          light: 'hsl(0, 84%, 96%)',
          border: 'hsl(0, 84%, 65%)',
        },
        
        // Dark mode neutrals (default)
        background: 'hsl(240, 10%, 4%)',
        'background-elevated': 'hsl(240, 6%, 10%)',
        'background-subtle': 'hsl(240, 4%, 16%)',
        foreground: 'hsl(0, 0%, 98%)',
        'foreground-muted': 'hsl(240, 5%, 65%)',
        'foreground-subtle': 'hsl(240, 4%, 46%)',
        border: 'hsl(240, 4%, 24%)',
        'border-hover': 'hsl(240, 4%, 32%)',
        hover: 'hsl(240, 4%, 16%)',
        active: 'hsl(240, 4%, 12%)',
        selected: 'hsl(262, 60%, 16%)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      
      fontSize: {
        xs:   ['0.75rem',  '1rem'],
        sm:   ['0.875rem', '1.25rem'],
        base: ['1rem',     '1.5rem'],
        lg:   ['1.125rem', '1.75rem'],
        xl:   ['1.25rem',  '1.75rem'],
        '2xl': ['1.5rem',  '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem',  '2.5rem'],
        '5xl': ['3rem',     '1'],
      },
      
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        snappy: 'cubic-bezier(0.4, 0, 1, 1)',
        bounce: 'cubic-bezier(0, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      
      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1100',
        overlay: '1200',
        modal: '1300',
        popover: '1400',
        tooltip: '1500',
        toast: '1600',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config
```

---

## Usage Examples

### Button (Primary)
```jsx
<button className="
  bg-primary hover:bg-primary-hover active:bg-primary-active
  text-primary-foreground
  px-4 py-2 rounded font-medium
  transition-colors duration-fast
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
">
  Primary Action
</button>
```

### Card
```jsx
<div className="
  bg-background-elevated border border-border
  rounded-lg shadow-md
  p-6
  hover:border-border-hover transition-colors duration-fast
">
  Card content
</div>
```

### Input
```jsx
<input className="
  bg-background-subtle border border-border
  text-foreground placeholder:text-foreground-subtle
  px-3 py-2 rounded
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
  transition-all duration-fast
" />
```

---

## Accessibility Requirements

### Focus Rings
- **Always visible:** Use `focus-visible:ring-2 focus-visible:ring-primary`
- **Never remove:** Don't use `outline-none` without `focus-visible` alternative
- **Color contrast:** Focus ring must have 3:1 contrast with background

### Color Contrast
- **Body text:** 4.5:1 minimum (WCAG AA)
- **Large text (18px+):** 3:1 minimum
- **Interactive elements:** 4.5:1 minimum

### Typography
- **Line height:** 1.5 minimum for body text (1.75 preferred)
- **Line length:** 45-75 characters for optimal readability
- **Font size:** 16px minimum for body text

---

## Next Steps

1. **Copy Tailwind config** to `tailwind.config.js`
2. **Install fonts:**
   ```bash
   # Add to index.html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
   ```
3. **Review wireframes** to see tokens in action
4. **Proceed to Phase 2** for component specifications

---

**Status:** Complete & ready for implementation ✅
