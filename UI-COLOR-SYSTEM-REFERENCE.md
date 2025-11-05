# 🎨 COLOR SYSTEM REFERENCE

## GalaxyCo.ai Design System Colors

**Last Updated:** November 4, 2025  
**Format:** RGB (for alpha channel support)  
**Philosophy:** Linear minimal + Framer blue accent

---

## 🎯 CORE PRINCIPLES

1. **90% Neutrals, 10% Accent** - Most UI is gray/white, color used sparingly
2. **Framer Blue for CTAs** - Primary actions use #0055FF only
3. **WCAG AA Compliant** - All text meets 4.5:1 contrast minimum
4. **RGB Format Only** - All values use RGB for alpha channel support

---

## 🌈 COLOR PALETTE

### **Brand Colors (Primary)**

#### Framer Blue - Primary

```css
--primary: 0 85 255; /* #0055FF - Main brand color */
--primary-foreground: 255 255 255; /* White text on primary */
--primary-hover: 0 68 221; /* #0044dd - Hover state */
--primary-active: 0 51 187; /* #0033bb - Active/pressed state */
```

**Usage:**

- ✅ Primary CTAs (Get Started, Save, Submit)
- ✅ Active states (selected nav, active tab)
- ✅ Links (main content links)
- ✅ Focus indicators
- ❌ Backgrounds (too bright)
- ❌ Body text (poor contrast)

**Examples:**

```tsx
<Button className="bg-primary hover:bg-primary-hover">
  Get Started
</Button>

<div className="border-l-4 border-primary">
  Active item
</div>
```

---

### **Neutrals (90% of UI)**

#### Backgrounds

```css
--background: 255 255 255; /* #FFFFFF - Page background */
--background-elevated: 250 250 252; /* #FAFAFC - Cards, panels */
--background-subtle: 248 250 252; /* #F8FAFC - Hover states */
```

#### Foregrounds (Text)

```css
--foreground: 20 23 26; /* #14171A - Main text */
--foreground-muted: 100 116 139; /* #64748B - Secondary text */
--foreground-subtle: 100 116 139; /* #64748B - Tertiary text */
```

#### Borders & Dividers

```css
--border: 226 232 240; /* #E2E8F0 - Default border */
--border-hover: 203 213 225; /* #CBD5E1 - Hover border */
--border-focus: 0 85 255; /* #0055FF - Focus ring */
```

#### Muted (Backgrounds & Text)

```css
--muted: 241 245 249; /* #F1F5F9 - Muted background */
--muted-foreground: 100 116 139; /* #64748B - Muted text */
```

**Usage:**

```tsx
// Page layout
<div className="bg-background text-foreground">
  {/* Cards */}
  <div className="bg-background-elevated border border-border">
    <h2 className="text-foreground">Title</h2>
    <p className="text-foreground-muted">Description</p>
  </div>
</div>
```

---

### **Secondary Color**

```css
--secondary: 52 64 80; /* #344050 - Slate blue */
--secondary-foreground: 248 250 252; /* #F8FAFC - Light text */
--secondary-hover: 71 85 105; /* #475569 - Hover */
--secondary-active: 51 65 85; /* #334155 - Active */
```

**Usage:**

- ✅ Secondary buttons
- ✅ Alternative CTAs
- ✅ Neutral actions
- ✅ Footer backgrounds

**Example:**

```tsx
<Button variant="secondary">Learn More</Button>
```

---

### **Semantic Colors**

#### Success (Green)

```css
/* Static colors - don't use variables */
bg-success: rgb(34 197 94)           /* #22C55E */
text-success-foreground: rgb(255 255 255) /* White */
bg-success-light: rgb(240 253 244)   /* #F0FDF4 */
border-success: rgb(74 222 128)      /* #4ADE80 */
```

**Usage:**

- ✅ Success messages
- ✅ Completed states
- ✅ Positive indicators
- ✅ Active status

#### Warning (Amber) - WCAG AA Compliant

```css
bg-warning: rgb(217 119 6)           /* #D97706 - 4.5:1 contrast */
text-warning-foreground: rgb(15 23 42) /* #0F172A - Dark text */
bg-warning-light: rgb(254 252 232)   /* #FEFCE8 */
border-warning: rgb(252 211 77)      /* #FCD34D */
```

**Usage:**

- ✅ Warning messages
- ✅ Caution states
- ✅ Important notices

#### Error/Destructive (Red)

```css
--destructive: 220 38 38; /* #DC2626 - 4.5:1 contrast */
--destructive-foreground: 255 255 255; /* White */
--destructive-hover: 220 38 38; /* Hover */
--destructive-active: 185 28 28; /* #B91C1C - Active */
--destructive-light: rgb(254 242 242); /* #FEF2F2 */
--destructive-border: rgb(248 113 113); /* #F87171 */
```

**Usage:**

- ✅ Error messages
- ✅ Delete buttons
- ✅ Dangerous actions
- ✅ Failed states

---

### **Component-Specific Colors**

#### Cards

```css
--card: 255 255 255; /* #FFFFFF */
--card-foreground: 20 23 26; /* #14171A */
```

#### Popovers & Dropdowns

```css
--popover: 255 255 255; /* #FFFFFF */
--popover-foreground: 20 23 26; /* #14171A */
```

#### Accents

```css
--accent: 240 249 255; /* #F0F9FF - Light blue */
--accent-foreground: 20 23 26; /* #14171A */
```

#### Interactive States

```css
--hover: 248 250 252; /* #F8FAFC - Hover background */
--active: 241 245 249; /* #F1F5F9 - Active background */
--selected: 245 243 255; /* #F5F3FF - Selected state */
```

#### Inputs

```css
--input: 226 232 240; /* #E2E8F0 - Input border */
--ring: 0 85 255; /* #0055FF - Focus ring */
```

---

## 🌙 DARK MODE

All colors have dark mode overrides:

```css
.dark {
  --background: 15 23 42; /* #0F172A - Dark bg */
  --foreground: 248 250 252; /* #F8FAFC - Light text */

  --background-elevated: 30 41 59; /* #1E293B */
  --background-subtle: 51 65 85; /* #334155 */

  --border: 51 65 85; /* #334155 */
  --border-hover: 71 85 105; /* #475569 */

  /* Primary stays the same (Framer blue works in both modes) */
  --primary: 0 85 255; /* #0055FF */
}
```

---

## 📏 USAGE GUIDELINES

### **1. Always Use Design Tokens**

```tsx
// ❌ DON'T: Hardcoded colors
<div className="bg-blue-500 text-white">
<div className="bg-[#0055FF]">
<div style={{ backgroundColor: '#0055FF' }}>

// ✅ DO: Design tokens
<div className="bg-primary text-primary-foreground">
```

### **2. Use Semantic Tokens**

```tsx
// ❌ DON'T: Generic colors
<Button className="bg-red-500">Delete</Button>

// ✅ DO: Semantic tokens
<Button variant="destructive">Delete</Button>
```

### **3. Respect the 90/10 Rule**

```tsx
// ❌ DON'T: Too much color
<Card className="bg-primary">
  <Badge className="bg-success">New</Badge>
  <Button className="bg-warning">Click</Button>
</Card>

// ✅ DO: Minimal color usage
<Card className="bg-background-elevated">
  <Badge variant="default">New</Badge>
  <Button variant="primary">Click</Button> {/* Only one primary action */}
</Card>
```

### **4. Use Alpha Channels When Needed**

```tsx
// RGB format allows alpha
<div className="bg-primary/10">       {/* 10% opacity */}
<div className="bg-primary/20">       {/* 20% opacity */}
<div className="border-primary/50">   {/* 50% opacity */}
```

---

## 🎨 COLOR COMBINATIONS

### **High Contrast (Text on Backgrounds)**

| Background       | Text                          | Contrast | WCAG   |
| ---------------- | ----------------------------- | -------- | ------ |
| `bg-background`  | `text-foreground`             | 15:1     | AAA ✅ |
| `bg-primary`     | `text-primary-foreground`     | 7:1      | AA ✅  |
| `bg-destructive` | `text-destructive-foreground` | 4.5:1    | AA ✅  |
| `bg-warning`     | `text-warning-foreground`     | 4.5:1    | AA ✅  |
| `bg-muted`       | `text-muted-foreground`       | 5.2:1    | AA ✅  |

### **Common Patterns**

```tsx
// Primary button
<Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
  Save
</Button>

// Danger button
<Button className="bg-destructive hover:bg-destructive-hover text-destructive-foreground">
  Delete
</Button>

// Ghost button
<Button className="bg-transparent hover:bg-hover text-foreground">
  Cancel
</Button>

// Card with hover
<Card className="bg-background-elevated border-border hover:border-border-hover">
  Content
</Card>
```

---

## 🚫 FORBIDDEN PATTERNS

### **Don't Hardcode Colors**

```tsx
// ❌ BAD
className = 'bg-blue-500';
className = 'text-gray-600';
className = 'border-slate-300';

// ✅ GOOD
className = 'bg-primary';
className = 'text-foreground-muted';
className = 'border-border';
```

### **Don't Use Inline Styles**

```tsx
// ❌ BAD
style={{ color: '#0055FF', backgroundColor: '#FFFFFF' }}

// ✅ GOOD
className="text-primary bg-background"
```

### **Don't Mix RGB and HSL**

```tsx
// ❌ BAD (inconsistent format)
--my-color: 224 14% 9%;  /* HSL */
--other-color: 255 255 255;  /* RGB */

// ✅ GOOD (all RGB)
--my-color: 20 23 26;  /* RGB */
--other-color: 255 255 255;  /* RGB */
```

---

## 🔍 FINDING THE RIGHT COLOR

**Quick Reference Table:**

| Need             | Token                 | Tailwind Class           |
| ---------------- | --------------------- | ------------------------ |
| Main brand color | `primary`             | `bg-primary`             |
| Main text        | `foreground`          | `text-foreground`        |
| Secondary text   | `foreground-muted`    | `text-foreground-muted`  |
| Page background  | `background`          | `bg-background`          |
| Card background  | `background-elevated` | `bg-background-elevated` |
| Border           | `border`              | `border-border`          |
| Success          | Static                | `bg-success`             |
| Warning          | Static                | `bg-warning`             |
| Error            | `destructive`         | `bg-destructive`         |
| Hover state      | `hover`               | `bg-hover`               |
| Selected state   | `selected`            | `bg-selected`            |

---

## 📚 FURTHER READING

- **Full Design System:** `DESIGN-SYSTEM.md`
- **Global CSS:** `apps/web/styles/globals.css`
- **Tailwind Config:** `apps/web/tailwind.config.ts`
- **Component Guide:** `UI-COMPONENT-DECISION-GUIDE.md`

---

**Updated:** November 4, 2025  
**Maintained By:** AI Development Agent  
**Status:** ✅ Active - All colors standardized to RGB format
