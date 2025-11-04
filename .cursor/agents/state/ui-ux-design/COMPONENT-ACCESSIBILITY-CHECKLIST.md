# Component Accessibility Checklist

Use this checklist when creating or reviewing any component in GalaxyCo.ai.

---

## 🎯 Pre-Flight Checklist

Before shipping any component:

### 1. Keyboard Accessibility

- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Focus order is logical (follows visual flow)
- [ ] Focus indicators are visible (2px ring)
- [ ] Escape key closes modals/dialogs
- [ ] No keyboard traps
- [ ] Skip links work (if applicable)

### 2. Screen Reader Support

- [ ] All icon-only buttons have `aria-label`
- [ ] All form inputs have labels or `aria-label`
- [ ] Images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Buttons describe their action (not just "Click here")
- [ ] State changes announced (loading, success, error)
- [ ] Proper heading hierarchy (h1 → h2 → h3)

### 3. Visual Design

- [ ] Text contrast meets 4.5:1 minimum (normal text)
- [ ] Large text contrast meets 3:1 minimum (18pt+)
- [ ] UI components contrast meets 3:1 minimum
- [ ] Focus indicators are visible against all backgrounds
- [ ] Disabled states are visually distinct

### 4. Responsive Design

- [ ] Works at 320px viewport width (iPhone SE)
- [ ] Content reflows without horizontal scroll
- [ ] Touch targets are minimum 44×44px
- [ ] Text remains readable (min 16px body)
- [ ] No content loss at any breakpoint

### 5. Semantic HTML

- [ ] Uses proper HTML elements (`<button>`, `<nav>`, `<main>`)
- [ ] ARIA used only when HTML insufficient
- [ ] Landmark roles present (`<nav>`, `<main>`, `<header>`)
- [ ] Forms use `<label>` elements
- [ ] Links vs buttons used correctly (navigation vs actions)

---

## 📋 Component-Specific Patterns

### Button Components

**Requirements:**

- [ ] If icon-only: Must have `aria-label`
- [ ] If toggle: Must have `aria-pressed` state
- [ ] If expandable: Must have `aria-expanded` state
- [ ] Loading state: Must have `aria-busy` attribute
- [ ] Disabled: `disabled` attribute (not just styling)

**Example:**

```tsx
<button aria-label="Settings" aria-pressed={isActive} disabled={isLoading}>
  <Settings />
</button>
```

---

### Form Components

**Requirements:**

- [ ] Every input has associated `<label>` or `aria-label`
- [ ] Required fields have `aria-required="true"`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Error messages have `role="alert"` and `id` linked via `aria-describedby`
- [ ] Field hints linked via `aria-describedby`

**Example:**

```tsx
<label htmlFor="email">Email *</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" role="alert">
    Invalid email
  </span>
)}
```

---

### Modal/Dialog Components

**Requirements:**

- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Has `aria-labelledby` (title) and `aria-describedby` (description)
- [ ] Traps focus when open
- [ ] Returns focus to trigger on close
- [ ] Closes with Escape key
- [ ] Background content marked `inert` (or prevented from focus)

**Example:**

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">This cannot be undone.</p>
</div>
```

---

### Navigation Components

**Requirements:**

- [ ] Wrapped in `<nav>` element
- [ ] Has `aria-label` if multiple navs on page
- [ ] Current page indicated with `aria-current="page"`
- [ ] Expandable menus have `aria-expanded`
- [ ] Submenus have `aria-label` describing purpose

**Example:**

```tsx
<nav aria-label="Main navigation">
  <Link href="/dashboard" aria-current={isActive ? 'page' : undefined}>
    Dashboard
  </Link>
</nav>
```

---

### Card/List Components

**Requirements:**

- [ ] If clickable: Entire card is `<a>` or has click handler on semantic element
- [ ] Has clear heading (h2, h3)
- [ ] Action buttons have descriptive labels
- [ ] Lists use `<ul>` or `<ol>` elements
- [ ] List items use `<li>` elements

**Example:**

```tsx
<article className="card">
  <h3>Agent Name</h3>
  <p>Description</p>
  <button aria-label="Edit Agent Name">
    <Pencil />
  </button>
</article>
```

---

### Search Components

**Requirements:**

- [ ] Input has `type="search"`
- [ ] Input has `aria-label` if no visible label
- [ ] Has clear button (if applicable) with `aria-label="Clear search"`
- [ ] Results announced to screen readers (aria-live)
- [ ] Loading state announced

**Example:**

```tsx
<input
  type="search"
  aria-label="Search GalaxyCo"
  placeholder="Search..."
/>
<div aria-live="polite" aria-atomic="true">
  {resultCount} results found
</div>
```

---

### Tab Components

**Requirements:**

- [ ] Tab buttons have `role="tab"`
- [ ] Tab list has `role="tablist"`
- [ ] Tab panels have `role="tabpanel"`
- [ ] Selected tab has `aria-selected="true"`
- [ ] Arrow keys navigate tabs
- [ ] Tab panel linked via `aria-controls` and `aria-labelledby`

**Example:**

```tsx
<div role="tablist">
  <button
    role="tab"
    aria-selected={isActive}
    aria-controls="panel-1"
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
>
  Content
</div>
```

---

### Dropdown/Select Components

**Requirements:**

- [ ] Button has `aria-haspopup="menu"` or `aria-haspopup="listbox"`
- [ ] Button has `aria-expanded` state
- [ ] Menu has `role="menu"` or `role="listbox"`
- [ ] Items have `role="menuitem"` or `role="option"`
- [ ] Keyboard navigation works (Arrow keys, Enter, Escape)
- [ ] Selected item indicated visually and with `aria-selected`

---

### Loading/Skeleton Components

**Requirements:**

- [ ] Has `aria-busy="true"` on loading container
- [ ] Has `aria-live="polite"` on status updates
- [ ] Loading text announced to screen readers
- [ ] Spinners have `role="status"` and descriptive text

**Example:**

```tsx
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? (
    <div role="status">
      <span className="sr-only">Loading...</span>
      <Spinner />
    </div>
  ) : (
    content
  )}
</div>
```

---

### Toast/Notification Components

**Requirements:**

- [ ] Has `role="alert"` for important notifications
- [ ] Has `role="status"` for non-critical updates
- [ ] Has `aria-live="assertive"` for urgent alerts
- [ ] Has `aria-live="polite"` for normal updates
- [ ] Close button has `aria-label="Close notification"`
- [ ] Auto-dismiss: Minimum 5 seconds display time

**Example:**

```tsx
<div role="alert" aria-live="assertive" aria-atomic="true">
  <p>{message}</p>
  <button aria-label="Close notification">
    <X />
  </button>
</div>
```

---

## 🧪 Testing Protocol

### 1. Keyboard Test (5 minutes)

```
1. Unplug mouse
2. Tab through component
3. Verify focus visible
4. Test Enter/Space/Escape
5. Verify no traps
```

### 2. Screen Reader Test (10 minutes)

```
VoiceOver (Mac):
1. Cmd+F5 to start
2. Ctrl+Option+Right Arrow to navigate
3. Listen to announcements
4. Verify labels make sense

NVDA (Windows):
1. Start NVDA
2. Use arrow keys to navigate
3. Listen to announcements
4. Verify context is clear
```

### 3. Contrast Test (2 minutes)

```
1. Open Chrome DevTools
2. Inspect text element
3. Check contrast ratio in Accessibility tab
4. Verify ≥ 4.5:1 for normal text
5. Verify ≥ 3:1 for large text
```

### 4. Responsive Test (5 minutes)

```
1. Open DevTools
2. Toggle device toolbar
3. Test at 320px width
4. Test at 768px width
5. Test at 1920px width
6. Verify no horizontal scroll
```

### 5. Focus Management (3 minutes)

```
1. Open modal
2. Tab through elements
3. Verify focus stays in modal
4. Press Escape
5. Verify focus returns to trigger
```

---

## ✅ Sign-Off

Before merging, confirm:

- [ ] All checklist items complete
- [ ] Manual testing passed
- [ ] No linter errors
- [ ] No TypeScript errors
- [ ] Documentation updated (if new pattern)
- [ ] Reviewed by accessibility champion (if available)

---

## 📊 Quick Reference

### Minimum Standards

- **Contrast:** 4.5:1 (normal), 3:1 (large)
- **Touch targets:** 44×44px
- **Viewport:** 320px minimum
- **Focus ring:** 2px visible
- **Keyboard:** 100% accessible

### Common ARIA Attributes

- `aria-label` - Label for icon-only elements
- `aria-labelledby` - Reference to label element
- `aria-describedby` - Reference to description
- `aria-expanded` - Expanded/collapsed state
- `aria-pressed` - Toggle button state
- `aria-selected` - Selected state
- `aria-invalid` - Invalid form field
- `aria-required` - Required field
- `aria-live` - Live region updates
- `aria-hidden` - Hide from screen readers
- `aria-current` - Current page/step

---

**Remember:** When in doubt, test with keyboard and screen reader. If it's hard for you, it's impossible for someone with disabilities.

---

_Version 1.0 - November 3, 2025_  
_GalaxyCo.ai Accessibility Standards_
