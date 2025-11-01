# Animation Specifications

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Animation Library:** Framer Motion  
**Performance Target:** 60fps

---

## Animation Principles

### 1. Performance First

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Prefer CSS transforms over JS animations

### 2. Duration Guidelines

- **Micro:** 100-200ms (hover, focus)
- **Minor:** 200-300ms (dropdowns, tooltips)
- **Major:** 300-500ms (modals, drawers)
- **Complex:** 500-800ms (page transitions)

### 3. Easing Functions

```typescript
const easings = {
  // Default for most animations
  easeOut: [0.16, 1, 0.3, 1],

  // Snappy interactions
  easeInOut: [0.4, 0, 0.2, 1],

  // Smooth exits
  easeIn: [0.4, 0, 1, 1],

  // Spring physics
  spring: { type: 'spring', stiffness: 500, damping: 30 },
};
```

---

## Framer Motion Variant Library

### Page Transitions

```typescript
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

// Usage
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {/* Page content */}
</motion.div>
```

---

### Modal / Drawer

```typescript
export const modalVariants = {
  // Overlay
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Modal content
  content: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  },
};

export const drawerVariants = {
  right: {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    hidden: { x: '-100%' },
    visible: { x: 0 },
    exit: { x: '-100%' },
  },
  top: {
    hidden: { y: '-100%' },
    visible: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' },
  },
};
```

---

### Dropdown / Tooltip

```typescript
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.1,
    },
  },
};
```

---

### List Item Stagger

```typescript
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Usage
<motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={listItemVariants}>
      {item.label}
    </motion.li>
  ))}
</motion.ul>
```

---

### Toast Notifications

```typescript
export const toastVariants = {
  initial: {
    opacity: 0,
    x: 400,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 400,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};
```

---

### Button Interactions

```typescript
export const buttonVariants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

// Usage
<motion.button
  whileHover="hover"
  whileTap="tap"
  variants={buttonVariants}
>
  Click me
</motion.button>
```

---

### Loading Skeleton

```typescript
export const skeletonVariants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};
```

---

### Accordion / Collapse

```typescript
export const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

---

### Progress Indicators

```typescript
export const progressVariants = {
  bar: {
    width: ['0%', '100%'],
    transition: {
      duration: 2,
      ease: 'linear',
    },
  },
  spinner: {
    rotate: [0, 360],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};
```

---

## Micro-interactions

### Hover States

```typescript
// Card hover
const cardHover = {
  scale: 1.02,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.2 },
};

// Icon hover
const iconHover = {
  scale: 1.1,
  rotate: 5,
  transition: { duration: 0.15 },
};
```

---

### Focus States

```typescript
const focusVariants = {
  focused: {
    scale: 1.01,
    borderColor: 'rgb(59, 130, 246)', // primary
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    transition: { duration: 0.15 },
  },
  blurred: {
    scale: 1,
    borderColor: 'rgb(229, 231, 235)', // border
    boxShadow: 'none',
    transition: { duration: 0.15 },
  },
};
```

---

## Layout Animations

### AnimatePresence Usage

```typescript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

---

### Layout Shifts (Shared Layouts)

```typescript
<motion.div layout layoutId="card-1">
  {/* Content */}
</motion.div>

// On different page/state:
<motion.div layout layoutId="card-1">
  {/* Expanded content */}
</motion.div>
```

---

## Performance Optimizations

### 1. useReducedMotion Hook

```typescript
import { useReducedMotion } from 'framer-motion';

const AnimatedComponent = () => {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <motion.div variants={variants} />
  );
};
```

---

### 2. LazyMotion (Reduce Bundle Size)

```typescript
import { LazyMotion, domAnimation, m } from 'framer-motion';

// Wrap app
<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }}>
    {/* Use 'm' instead of 'motion' */}
  </m.div>
</LazyMotion>
```

---

### 3. Avoid Layout Thrashing

```css
/* ✅ Good - GPU accelerated */
transform: translateX(100px);
opacity: 0.5;

/* ❌ Bad - Causes reflow */
width: 100px;
margin-left: 100px;
```

---

## Accessibility

### Respecting prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animation Audit Checklist

- [ ] Duration < 500ms for UI interactions
- [ ] Only animating transform/opacity
- [ ] Respects prefers-reduced-motion
- [ ] No layout shifts during animation
- [ ] Runs at 60fps (check DevTools performance)
- [ ] AnimatePresence used for exit animations
- [ ] Easing curves feel natural

---

**Status:** Complete ✅  
**Next:** Template code library
