# GalaxyCo.ai Accessibility Guidelines

**Version:** 1.0  
**Last Updated:** November 3, 2025  
**Status:** ✅ WCAG 2.1 AA Compliant

---

## 🎯 Purpose

This document provides accessibility standards and patterns for all GalaxyCo.ai components. Following these guidelines ensures our platform remains accessible to all users.

---

## 📋 Quick Checklist

Before shipping any component, verify:

- [ ] All interactive elements have accessible names
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Color contrast meets 4.5:1 minimum
- [ ] Works at 320px viewport width
- [ ] Focus indicators are visible
- [ ] ARIA attributes used correctly

---

## 🔧 ARIA Label Patterns

### Icon-Only Buttons

**❌ Bad:**
```tsx
<button>
  <Settings className="w-5 h-5" />
</button>
```

**✅ Good:**
```tsx
<button aria-label="Settings">
  <Settings className="w-5 h-5" />
</button>
```

### Dynamic Labels (Conditional States)

**❌ Bad:**
```tsx
<button>
  {isOpen ? <X /> : <Menu />}
</button>
```

**✅ Good:**
```tsx
<button aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
  {isOpen ? <X /> : <Menu />}
</button>
```

### Toggle Buttons

**✅ Pattern:**
```tsx
<button
  aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
  aria-pressed={isPinned}
  onClick={togglePin}
>
  <Pin className={isPinned ? "fill-current" : ""} />
  <span>Pin Sidebar</span>
</button>
```

### Search Inputs

**✅ Pattern:**
```tsx
<input
  type="search"
  placeholder="Search..."
  aria-label="Search GalaxyCo"
/>
```

### File Upload Buttons

**✅ Pattern:**
```tsx
<button aria-label="Upload files">
  <Paperclip className="h-4 w-4" />
</button>
```

### Remove/Close Buttons

**✅ Pattern (Dynamic):**
```tsx
<button
  onClick={() => removeFile(filename)}
  aria-label={`Remove ${filename}`}
>
  <X className="h-3 w-3" />
</button>
```

---

## ⌨️ Keyboard Navigation

### Required Key Support

| Key | Action | Use Case |
|-----|--------|----------|
| **Tab** | Move focus forward | Navigate through interactive elements |
| **Shift+Tab** | Move focus backward | Navigate in reverse |
| **Enter** | Activate | Links, buttons, form submission |
| **Space** | Activate | Buttons, checkboxes, toggles |
| **Escape** | Close/Cancel | Modals, dialogs, dropdowns |
| **Arrow keys** | Navigate | Lists, menus, tabs, radio groups |

### Focus Management

**✅ Visible Focus Indicators:**
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

**✅ Skip Links:**
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

**✅ Focus Trap in Modals:**
```tsx
// Keep focus within modal when open
// Allow Escape to close
// Return focus to trigger element on close
```

### Tab Order

**Principles:**
1. Logical visual order (left-to-right, top-to-bottom)
2. Skip link comes first
3. Main navigation accessible early
4. Forms follow natural flow

---

## 🎨 Color Contrast

### WCAG AA Standards

| Text Type | Minimum Contrast | GalaxyCo Standard |
|-----------|-----------------|------------------|
| Normal text | 4.5:1 | 4.5:1+ |
| Large text (18pt+) | 3:1 | 3:1+ |
| UI components | 3:1 | 3:1+ |

### Approved Text Colors

**On White Background:**
- **Body text:** `#0f172a` (14.8:1) ✅
- **Muted text:** `#64748b` (4.54:1) ✅
- **Primary blue:** `#0055FF` (5.3:1) ✅
- **Warning:** `rgb(217 119 6)` (4.5:1) ✅
- **Success:** `rgb(34 197 94)` (3.5:1 for large text) ✅

**On Dark Background:**
- **Body text:** `#ffffff` (21:1) ✅
- **Muted text:** `#cbd5e1` (9.8:1) ✅

### Testing Contrast

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (Inspect > Accessibility)
- [Contrast Ratio](https://contrast-ratio.com/)

**Manual Test:**
```tsx
// Check computed colors in browser
const element = document.querySelector('.text-muted-foreground');
const color = window.getComputedStyle(element).color;
const bgColor = window.getComputedStyle(element).backgroundColor;
```

---

## 📱 Responsive Design

### Breakpoints

```tsx
// Mobile first approach
className="flex-col md:flex-row"

// Breakpoints
sm: 640px   // Small mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Minimum Width: 320px

**Test all pages at 320px width (iPhone SE)**

**Requirements:**
- ✅ No horizontal scroll
- ✅ All text readable (min 16px)
- ✅ Touch targets ≥ 44×44px
- ✅ Content reflows logically

### Touch Targets

**Minimum Size:** 44×44px (iOS guidelines)

**✅ Button Sizing:**
```tsx
// Too small ❌
className="h-6 w-6"

// Good ✅
className="h-9 w-9"  // 36px
className="h-11 w-11" // 44px
```

---

## 🏗️ Semantic HTML

### Use Proper Elements

**❌ Bad:**
```tsx
<div onClick={handleClick}>Click me</div>
```

**✅ Good:**
```tsx
<button onClick={handleClick}>Click me</button>
```

### Landmark Roles

**✅ Required Structure:**
```tsx
<header>
  <nav>Navigation</nav>
</header>

<main id="main-content">
  <article>Content</article>
</main>

<footer>Footer</footer>
```

### Heading Hierarchy

**✅ Correct:**
```tsx
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

**❌ Wrong:**
```tsx
<h1>Page Title</h1>
  <h3>Skipped h2!</h3> ❌
```

---

## 📝 Form Accessibility

### Label Association

**✅ Pattern 1 (Explicit):**
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

**✅ Pattern 2 (Implicit):**
```tsx
<label>
  Email
  <input type="email" />
</label>
```

**✅ Pattern 3 (ARIA):**
```tsx
<input type="email" aria-label="Email address" />
```

### Required Fields

**✅ Pattern:**
```tsx
<label htmlFor="email">
  Email <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>
```

### Error Messages

**✅ Pattern:**
```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" role="alert" className="text-destructive">
    Please enter a valid email address
  </span>
)}
```

### Form Validation

**✅ Use React Hook Form + Zod:**
```tsx
const schema = z.object({
  email: z.string().email("Invalid email address"),
});

const { register, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

// Errors automatically have proper ARIA attributes
```

---

## 🖼️ Images & Media

### Alternative Text

**✅ Meaningful Images:**
```tsx
<img src="/logo.png" alt="GalaxyCo Logo" />
```

**✅ Decorative Images:**
```tsx
<img src="/decoration.png" alt="" role="presentation" />
```

**✅ Complex Images:**
```tsx
<figure>
  <img src="/chart.png" alt="Sales chart showing 50% growth" />
  <figcaption>
    Detailed description: Sales increased from $10k to $15k...
  </figcaption>
</figure>
```

### Icons

**✅ Meaningful Icons:**
```tsx
<button aria-label="Settings">
  <Settings className="w-5 h-5" aria-hidden="true" />
</button>
```

**✅ Decorative Icons:**
```tsx
<div>
  <CheckCircle className="w-4 h-4" aria-hidden="true" />
  <span>Task completed</span>
</div>
```

---

## 🎭 ARIA States & Properties

### Common Patterns

**Expandable Content:**
```tsx
<button
  onClick={toggleExpanded}
  aria-expanded={isExpanded}
  aria-controls="panel-1"
>
  {isExpanded ? "Collapse" : "Expand"}
</button>
<div id="panel-1" hidden={!isExpanded}>
  Content
</div>
```

**Loading States:**
```tsx
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

**Live Regions:**
```tsx
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

**Modal Dialogs:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-description">This action cannot be undone.</p>
</div>
```

---

## ✅ Testing Checklist

### Automated Testing

**Run on Every PR:**
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Accessibility scan (manual for now)
# TODO: Add automated a11y testing
```

### Manual Testing

**Before Shipping:**
1. **Keyboard Test**
   - [ ] Unplug mouse
   - [ ] Tab through entire page
   - [ ] Verify all actions work
   - [ ] Check focus indicators

2. **Screen Reader Test** (Optional but recommended)
   - [ ] VoiceOver (Mac): Cmd+F5
   - [ ] NVDA (Windows): Free download
   - [ ] Test critical flows

3. **Color Contrast**
   - [ ] Check all text against backgrounds
   - [ ] Verify muted text is readable

4. **Responsive**
   - [ ] Test at 320px width
   - [ ] Test at 768px width
   - [ ] Test at 1920px width

5. **Focus Management**
   - [ ] Modals trap focus
   - [ ] Skip links work
   - [ ] Focus returns after closing dialogs

---

## 🚫 Common Mistakes

### 1. Missing ARIA Labels

**❌ Wrong:**
```tsx
<button><X /></button>
```

**✅ Correct:**
```tsx
<button aria-label="Close"><X /></button>
```

### 2. Incorrect ARIA Usage

**❌ Wrong:**
```tsx
<div role="button" onClick={handleClick}>Click</div>
```

**✅ Correct:**
```tsx
<button onClick={handleClick}>Click</button>
```

### 3. Poor Color Contrast

**❌ Wrong:**
```tsx
<p className="text-gray-400">Low contrast text</p>
```

**✅ Correct:**
```tsx
<p className="text-muted-foreground">Readable text</p>
```

### 4. Keyboard Traps

**❌ Wrong:**
```tsx
// Modal without Escape key handler
<dialog open={isOpen}>...</dialog>
```

**✅ Correct:**
```tsx
<dialog open={isOpen} onKeyDown={(e) => {
  if (e.key === 'Escape') closeModal();
}}>
  ...
</dialog>
```

### 5. Skipping Headings

**❌ Wrong:**
```tsx
<h1>Title</h1>
<h3>Subsection</h3> {/* Skipped h2 */}
```

**✅ Correct:**
```tsx
<h1>Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

---

## 📚 Resources

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools

### Learning
- [WebAIM](https://webaim.org/) - Web accessibility tutorials
- [A11y Project](https://www.a11yproject.com/) - Accessibility checklist
- [Inclusive Components](https://inclusive-components.design/) - Accessible patterns

---

## 🤝 Getting Help

**Questions about accessibility?**
- Check this guide first
- Review WCAG 2.1 quickref
- Test with keyboard + screen reader
- Ask in #engineering-standards channel

**Need a pattern not documented here?**
- Check ARIA Authoring Practices
- Look for similar components in codebase
- Document new patterns here

---

**Remember:** Accessibility is not optional. It's a core requirement for all GalaxyCo components.

---

*Last Updated: November 3, 2025*  
*Maintained by: UI/UX Design Team*  
*Status: WCAG 2.1 AA Compliant ✅*

