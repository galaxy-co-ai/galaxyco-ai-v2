# Atomic Components Specification

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Component Count:** 26 atoms  
**Status:** Ready for Implementation

---

## Implementation Guidelines

### File Structure

```
src/components/atoms/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   ├── Button.test.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   ├── Input.test.tsx
│   └── index.ts
└── ...
```

### TypeScript Convention

```typescript
// Component.types.ts
export interface ComponentProps {
  // Required props first
  // Optional props second
  // Event handlers last
}

// Component.tsx
export const Component = forwardRef<HTMLElement, ComponentProps>((props, ref) => {
  // Implementation
});

Component.displayName = 'Component';
```

---

## 1. Button

### Visual Spec

**Height:** xs=28px, sm=32px, md=40px, lg=48px, xl=56px  
**Padding:** Horizontal = 0.75em, Vertical from height  
**Border Radius:** md (6px)  
**Font Weight:** Medium (500)

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Loading state - shows spinner
   * @default false
   */
  isLoading?: boolean;

  /**
   * Full width button
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Icon before label
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon after label
   */
  rightIcon?: React.ReactNode;

  /**
   * Button content
   */
  children?: React.ReactNode;
}
```

### Variants

**Primary (Default)**

```css
bg-primary text-primary-foreground
hover:bg-primary-hover
active:bg-primary-active
focus:ring-2 ring-primary ring-offset-2
disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed
```

**Secondary**

```css
bg-secondary text-secondary-foreground
hover:bg-secondary-hover
active:bg-secondary-active
```

**Ghost**

```css
bg-transparent text-foreground
hover:bg-muted
active:bg-accent
```

**Danger**

```css
bg-destructive text-destructive-foreground
hover:bg-destructive-hover
active:bg-destructive-active
```

**Outline**

```css
border border-border bg-background text-foreground
hover:bg-accent hover:text-accent-foreground
active:bg-accent
```

### States

**Loading**

- Replace leftIcon with Spinner
- Disable button
- Keep width stable (reserve space)

**Disabled**

- Opacity 50%
- Cursor not-allowed
- No hover effects

### Accessibility

```typescript
// Required
aria-label={iconOnly ? label : undefined}
aria-disabled={isDisabled}
aria-busy={isLoading}

// Focus management
tabIndex={isDisabled ? -1 : 0}
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick?.(e);
  }
}}
```

### Animation

```typescript
// Framer Motion variant
const buttonVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
};
```

---

## 2. Input

### Visual Spec

**Height:** sm=32px, md=40px, lg=48px  
**Padding:** Horizontal = 12px  
**Border:** 1px solid border color  
**Border Radius:** md (6px)  
**Font Size:** sm=14px, md=16px, lg=18px

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Visual state variant
   * @default 'default'
   */
  variant?: 'default' | 'error' | 'success';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Left addon (icon or text)
   */
  leftAddon?: React.ReactNode;

  /**
   * Right addon (icon or text)
   */
  rightAddon?: React.ReactNode;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Required field indicator
   * @default false
   */
  isRequired?: boolean;

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Read-only state
   * @default false
   */
  isReadOnly?: boolean;
}
```

### Variants

**Default**

```css
border-border bg-background text-foreground
focus:border-primary focus:ring-2 ring-primary ring-offset-0
```

**Error**

```css
border-destructive
focus:border-destructive focus:ring-2 ring-destructive
```

**Success**

```css
border-success
focus:border-success focus:ring-2 ring-success
```

### Addons

**Left Addon**

- Absolute position left
- Padding adjustment: pl-10 (if icon)
- Icon size: 16px for sm, 20px for md, 24px for lg

**Right Addon**

- Absolute position right
- Padding adjustment: pr-10 (if icon)

### Accessibility

```typescript
// Required
id={uniqueId}
aria-label={ariaLabel}
aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
aria-invalid={!!error}
aria-required={isRequired}

// Error announcement
{error && (
  <span id={`${id}-error`} role="alert" className="sr-only">
    {error}
  </span>
)}
```

---

## 3. Badge

### Visual Spec

**Height:** sm=20px, md=24px, lg=28px  
**Padding:** Horizontal = 8px  
**Border Radius:** full (rounded-full)  
**Font Size:** xs=11px, sm=12px, md=14px  
**Font Weight:** Medium (500)

### Props

```typescript
interface BadgeProps {
  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Show dismiss button
   * @default false
   */
  isDismissible?: boolean;

  /**
   * Dismiss handler
   */
  onDismiss?: () => void;

  /**
   * Leading icon
   */
  icon?: React.ReactNode;
}
```

### Variants

```typescript
const variants = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-destructive/10 text-destructive border border-destructive/20',
  info: 'bg-primary/10 text-primary border border-primary/20',
};
```

### Animation

```typescript
// Dismiss animation
const badgeVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};
```

---

## 4. Avatar

### Visual Spec

**Sizes:** xs=24px, sm=32px, md=40px, lg=48px, xl=56px, 2xl=64px  
**Border Radius:** circle=50%, square=md (6px)  
**Font Size:** Initials scale with size

### Props

```typescript
interface AvatarProps {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for image
   */
  alt: string;

  /**
   * Fallback text (initials)
   */
  fallback?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Shape variant
   * @default 'circle'
   */
  variant?: 'circle' | 'square';

  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy';
}
```

### Status Indicator

**Position:** Bottom-right corner  
**Size:** 25% of avatar size  
**Border:** 2px solid background color  
**Colors:**

- online: bg-success (green)
- offline: bg-muted (gray)
- away: bg-warning (yellow)
- busy: bg-destructive (red)

### Fallback Logic

```typescript
1. Try loading src image
2. If error → show fallback initials
3. If no fallback → show generic icon
```

### Accessibility

```typescript
<img
  src={src}
  alt={alt}
  role="img"
  onError={handleImageError}
/>

// Or for initials fallback
<div role="img" aria-label={alt}>
  {initials}
</div>
```

---

## 5. Checkbox

### Visual Spec

**Size:** 18px × 18px (all states)  
**Border:** 2px solid  
**Border Radius:** sm (4px)  
**Check Icon:** Lucide Check (14px)

### Props

```typescript
interface CheckboxProps {
  /**
   * Checked state
   */
  isChecked?: boolean;

  /**
   * Indeterminate state (for "select all")
   */
  isIndeterminate?: boolean;

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper/description text
   */
  description?: string;

  /**
   * Name for form
   */
  name?: string;
}
```

### States

**Unchecked**

```css
border-border bg-background
hover:border-primary
focus:ring-2 ring-primary ring-offset-2
```

**Checked**

```css
border-primary bg-primary text-primary-foreground
hover:bg-primary-hover
```

**Indeterminate**

```css
border-primary bg-primary text-primary-foreground
/* Show minus icon instead of check */
```

**Disabled**

```css
opacity-50 cursor-not-allowed
```

### Accessibility

```typescript
<input
  type="checkbox"
  checked={isChecked}
  disabled={isDisabled}
  aria-checked={isIndeterminate ? 'mixed' : isChecked}
  aria-label={label}
  aria-describedby={description ? `${id}-desc` : undefined}
  onChange={(e) => onChange?.(e.target.checked)}
/>
```

---

## 6. Radio

### Visual Spec

**Size:** 18px × 18px  
**Border:** 2px solid  
**Border Radius:** full (circle)  
**Indicator:** Inner circle 8px × 8px

### Props

```typescript
interface RadioProps {
  /**
   * Selected state
   */
  isChecked?: boolean;

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Change handler
   */
  onChange?: () => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper/description text
   */
  description?: string;

  /**
   * Radio group name (required)
   */
  name: string;

  /**
   * Radio value
   */
  value: string;
}
```

### States

**Unchecked**

```css
border-border bg-background
hover:border-primary
focus:ring-2 ring-primary ring-offset-2
```

**Checked**

```css
border-primary bg-background
/* Inner circle */
after:bg-primary after:w-2 after:h-2
```

### Radio Group

```typescript
interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    isDisabled?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
}
```

---

## 7. Toggle (Switch)

### Visual Spec

**Dimensions:** sm=36×20px, md=44×24px, lg=52×28px  
**Thumb Size:** sm=16px, md=20px, lg=24px  
**Border Radius:** full (pill shape)  
**Transition:** transform 200ms ease

### Props

```typescript
interface ToggleProps {
  /**
   * Checked state
   */
  isChecked?: boolean;

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;

  /**
   * Label text
   */
  label?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}
```

### States

**Unchecked**

```css
bg-muted
/* Thumb on left */
transform: translateX(0)
```

**Checked**

```css
bg-primary
/* Thumb on right */
transform: translateX(100%)
```

### Animation

```typescript
// Framer Motion
<motion.div
  animate={{
    x: isChecked ? thumbOffset : 0,
  }}
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
/>
```

---

## 8. Spinner

### Visual Spec

**Sizes:** xs=12px, sm=16px, md=24px, lg=32px, xl=48px  
**Stroke Width:** 2px  
**Animation:** Rotate 360deg in 1s linear infinite

### Props

```typescript
interface SpinnerProps {
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Color (Tailwind class)
   * @default 'text-primary'
   */
  color?: string;

  /**
   * Accessible label
   */
  label?: string;
}
```

### Animation

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### Accessibility

```typescript
<div
  role="status"
  aria-label={label || 'Loading'}
  aria-live="polite"
>
  {/* Spinner SVG */}
  <span className="sr-only">{label || 'Loading'}</span>
</div>
```

---

## 9. Skeleton

### Visual Spec

**Base Color:** bg-muted  
**Shimmer Color:** bg-muted-foreground/10  
**Border Radius:** Matches content type  
**Animation:** Pulse or shimmer

### Props

```typescript
interface SkeletonProps {
  /**
   * Skeleton shape
   * @default 'text'
   */
  variant?: 'text' | 'circle' | 'rectangle';

  /**
   * Width (CSS value)
   */
  width?: string;

  /**
   * Height (CSS value)
   */
  height?: string;

  /**
   * Number of skeleton items
   * @default 1
   */
  count?: number;

  /**
   * Animation type
   * @default 'pulse'
   */
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### Variants

**Text**

- Height: 1em (line height)
- Width: Random 60-100% per line
- Border radius: sm

**Circle**

- Equal width & height
- Border radius: full

**Rectangle**

- Custom dimensions
- Border radius: md

### Animation

```css
/* Pulse */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

---

## 10. Progress

### Visual Spec

**Height:** Bar=8px, Circle/Ring varies by size  
**Border Radius:** full  
**Colors:** Track=muted, Fill=primary

### Props

```typescript
interface ProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Visual variant
   * @default 'bar'
   */
  variant?: 'bar' | 'circle' | 'ring';

  /**
   * Size (for circle/ring)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show percentage text
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Color variant
   * @default 'primary'
   */
  color?: 'primary' | 'success' | 'warning' | 'danger';
}
```

### Variants

**Bar**

```jsx
<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
  <div
    className="h-full bg-primary transition-all duration-300"
    style={{ width: `${percentage}%` }}
  />
</div>
```

**Circle / Ring**

- Use SVG with animated stroke-dashoffset
- Center text shows percentage

### Accessibility

```typescript
<div
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={label}
>
  {/* Progress visual */}
</div>
```

---

## Testing Checklist (Per Component)

### Visual Tests

- [ ] All variants render correctly
- [ ] All sizes render correctly
- [ ] Dark mode works
- [ ] Hover states visible
- [ ] Focus states visible
- [ ] Active states visible
- [ ] Disabled states styled correctly

### Functional Tests

- [ ] Click handlers fire
- [ ] onChange handlers fire with correct values
- [ ] Keyboard navigation works
- [ ] Disabled prop prevents interaction
- [ ] Loading state prevents interaction

### Accessibility Tests

- [ ] Focus ring visible on keyboard nav
- [ ] Screen reader labels present
- [ ] ARIA attributes correct
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard shortcuts work

### Responsive Tests

- [ ] Mobile sizes work (if applicable)
- [ ] Touch targets ≥44px
- [ ] No horizontal overflow

---

## Next Steps

1. **Implement atoms 1-10** (this doc)
2. **Create Storybook stories** for each
3. **Write unit tests** for each
4. **Generate remaining atoms 11-26** (separate doc)
5. **Move to molecules** (composite components)

---

**Status:** Complete ✅ (Atoms 1-10 specified)
**Remaining:** Atoms 11-26 in next iteration
