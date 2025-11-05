# 📐 TYPOGRAPHY & SPACING GUIDE

## GalaxyCo.ai Design System Standards

**Last Updated:** November 4, 2025  
**Philosophy:** Linear-inspired clarity + generous spacing  
**Font:** Inter (system fallback: -apple-system, sans-serif)

---

## 📝 TYPOGRAPHY SYSTEM

### **Font Family**

```css
--font-sans: 'Inter', system-ui, '-apple-system', sans-serif;
--font-mono: 'JetBrains Mono', 'Menlo', 'Monaco', monospace;
```

**Usage:**

```tsx
// Sans-serif (default)
<p className="font-sans">Body text</p>

// Monospace (code, technical content)
<code className="font-mono">const x = 1;</code>
```

---

### **Type Scale**

| Size Class  | Font Size       | Line Height | Use Case                          |
| ----------- | --------------- | ----------- | --------------------------------- |
| `text-xs`   | 12px (0.75rem)  | 16px        | Labels, captions, timestamps      |
| `text-sm`   | 14px (0.875rem) | 20px        | Small body, table text, secondary |
| `text-base` | 16px (1rem)     | 24px        | **Body text (default)**           |
| `text-lg`   | 18px (1.125rem) | 28px        | Subheadings, emphasized text      |
| `text-xl`   | 20px (1.25rem)  | 28px        | Card titles, section headers      |
| `text-2xl`  | 24px (1.5rem)   | 32px        | Section titles, modal headers     |
| `text-3xl`  | 30px (1.875rem) | 36px        | Page titles, h1                   |
| `text-4xl`  | 36px (2.25rem)  | 40px        | Large headings, hero text         |
| `text-5xl`  | 48px (3rem)     | 1.1         | Section headings (marketing)      |
| `text-6xl`  | 60px (3.75rem)  | 1.1         | Large hero text                   |
| `text-7xl`  | 72px (4.5rem)   | 1.1         | Hero text (landing pages)         |
| `text-8xl`  | 96px (6rem)     | 1.05        | Massive hero (Framer style)       |
| `text-9xl`  | 128px (8rem)    | 1           | Ultra display (rare)              |

**Examples:**

```tsx
// Page title
<h1 className="text-3xl font-semibold">Dashboard</h1>

// Section title
<h2 className="text-2xl font-semibold">Recent Activity</h2>

// Card title
<h3 className="text-xl font-medium">Agent Status</h3>

// Body text
<p className="text-base">This is the default body text size.</p>

// Small text
<span className="text-sm text-foreground-muted">Last updated 2 hours ago</span>
```

---

### **Font Weights**

| Weight Class    | Value | Use Case                                  |
| --------------- | ----- | ----------------------------------------- |
| `font-normal`   | 400   | Body text (default)                       |
| `font-medium`   | 500   | Emphasized text, table headers            |
| `font-semibold` | 600   | **Buttons, section titles (most common)** |
| `font-bold`     | 700   | Headlines (use sparingly!)                |

**Guidelines:**

- ✅ Use `font-semibold` for most headings and buttons
- ✅ Use `font-medium` for emphasis in body text
- ✅ Use `font-bold` sparingly - only for major headlines
- ❌ Don't use `font-light` or `font-thin` (poor readability)

**Examples:**

```tsx
// Heading (semibold is standard)
<h2 className="text-2xl font-semibold">Section Title</h2>

// Button (semibold)
<Button className="font-semibold">Get Started</Button>

// Emphasized text (medium)
<p>This is <span className="font-medium">important</span> information.</p>

// Hero heading (bold - rare)
<h1 className="text-7xl font-bold">Welcome to GalaxyCo</h1>
```

---

### **Letter Spacing**

```css
/* Headings: Tight letter-spacing (Linear style) */
h1,
h2,
h3,
h4,
h5,
h6 {
  letter-spacing: -0.02em;
}

/* Body: Normal letter-spacing */
p,
span {
  letter-spacing: 0;
}
```

**Usage:**

```tsx
// Headings automatically have tight spacing
<h1>Tight spacing</h1>

// Override if needed
<h2 className="tracking-tight">Extra tight</h2>
<h2 className="tracking-normal">Normal spacing</h2>
```

**Available Classes:**

- `tracking-tighter` - Extra tight (-0.05em)
- `tracking-tight` - Tight (-0.025em) - **Headings default**
- `tracking-normal` - Normal (0em) - **Body default**
- `tracking-wide` - Wide (0.025em)
- `tracking-wider` - Extra wide (0.05em)

---

### **Line Height**

| Class             | Value | Use Case                           |
| ----------------- | ----- | ---------------------------------- |
| `leading-tight`   | 1.1   | Hero headlines, large display text |
| `leading-snug`    | 1.2   | Headings                           |
| `leading-normal`  | 1.5   | UI text (default)                  |
| `leading-relaxed` | 1.6   | Body copy, long-form content       |

**Examples:**

```tsx
// Hero text (tight)
<h1 className="text-8xl font-bold leading-tight">
  Big Hero Text
</h1>

// Body copy (relaxed)
<p className="text-base leading-relaxed">
  This is a longer paragraph that benefits from more line height for better readability.
</p>
```

---

## 📏 SPACING SYSTEM

### **Base Unit: 4px**

All spacing uses a 4px grid:

| Class                        | Value | Use Case                       |
| ---------------------------- | ----- | ------------------------------ |
| `space-1` / `p-1` / `m-1`    | 4px   | Tight spacing (badges, chips)  |
| `space-2` / `p-2` / `m-2`    | 8px   | Small gaps (icon + text)       |
| `space-3` / `p-3` / `m-3`    | 12px  | Medium-tight                   |
| `space-4` / `p-4` / `m-4`    | 16px  | **Base spacing (most common)** |
| `space-5` / `p-5` / `m-5`    | 20px  | Comfortable                    |
| `space-6` / `p-6` / `m-6`    | 24px  | **Card/section padding**       |
| `space-8` / `p-8` / `m-8`    | 32px  | Large section spacing          |
| `space-10` / `p-10` / `m-10` | 40px  | Very large                     |
| `space-12` / `p-12` / `m-12` | 48px  | Extra large                    |
| `space-16` / `p-16` / `m-16` | 64px  | Massive (hero sections)        |
| `space-20` / `p-20` / `m-20` | 80px  | XXL                            |
| `space-24` / `p-24` / `m-24` | 96px  | **Section spacing**            |

---

### **Usage Patterns**

#### **Sections (Vertical)**

```tsx
<section className="py-24">
  {' '}
  {/* 96px top/bottom */}
  <div className="space-y-16">
    {' '}
    {/* 64px between blocks */}
    <div>Block 1</div>
    <div>Block 2</div>
  </div>
</section>
```

#### **Cards**

```tsx
<Card className="p-6">
  {' '}
  {/* 24px all around */}
  <div className="space-y-4">
    {' '}
    {/* 16px between elements */}
    <h3>Title</h3>
    <p>Content</p>
    <Button>Action</Button>
  </div>
</Card>
```

#### **Elements**

```tsx
<div className="flex gap-4">  {/* 16px gap between flex items */}
  <Icon />
  <span>Text</span>
</div>

<div className="mb-6">  {/* 24px margin bottom */}
  Section content
</div>
```

---

### **Spacing Guidelines**

#### **Padding**

| Element | Padding                 | Example                          |
| ------- | ----------------------- | -------------------------------- |
| Button  | `px-4 py-2` (16px/8px)  | `<Button className="px-4 py-2">` |
| Card    | `p-6` (24px)            | `<Card className="p-6">`         |
| Modal   | `p-6` (24px)            | `<Dialog className="p-6">`       |
| Input   | `px-4 py-2` (16px/8px)  | `<Input className="px-4 py-2">`  |
| Section | `py-24` (96px vertical) | `<section className="py-24">`    |

#### **Margins**

| Element     | Margin         | Example                    |
| ----------- | -------------- | -------------------------- |
| Headings    | `mb-6` (24px)  | `<h2 className="mb-6">`    |
| Paragraphs  | `mb-4` (16px)  | `<p className="mb-4">`     |
| Sections    | `mb-16` (64px) | `<div className="mb-16">`  |
| Form fields | `mb-4` (16px)  | `<Input className="mb-4">` |

#### **Gaps**

| Layout        | Gap            | Example      |
| ------------- | -------------- | ------------ |
| Flex (tight)  | `gap-2` (8px)  | Icon + text  |
| Flex (normal) | `gap-4` (16px) | Button group |
| Grid (normal) | `gap-6` (24px) | Card grid    |
| Grid (wide)   | `gap-8` (32px) | Feature grid |

---

### **Spacing Examples**

#### **Page Layout**

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content with responsive padding */}
</div>
```

#### **Card Grid**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="p-6">Card 1</Card>
  <Card className="p-6">Card 2</Card>
  <Card className="p-6">Card 3</Card>
</div>
```

#### **Form**

```tsx
<form className="space-y-4">
  {' '}
  {/* 16px between fields */}
  <div>
    <Label className="mb-2">Name</Label>
    <Input className="w-full" />
  </div>
  <div>
    <Label className="mb-2">Email</Label>
    <Input className="w-full" />
  </div>
  <Button className="mt-6">Submit</Button>
</form>
```

---

## 🎨 COMMON PATTERNS

### **Pattern 1: Hero Section**

```tsx
<section className="py-32 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-6xl font-bold tracking-tight mb-6">Welcome to GalaxyCo</h1>
    <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-8">
      Make multi-agent AI useful in minutes
    </p>
    <div className="flex items-center justify-center gap-4">
      <Button size="lg">Get Started</Button>
      <Button size="lg" variant="outline">
        Learn More
      </Button>
    </div>
  </div>
</section>
```

### **Pattern 2: Dashboard Card**

```tsx
<Card className="p-6 hover:shadow-md transition-shadow">
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold">Active Agents</h3>
      <Badge variant="success">24</Badge>
    </div>
    <p className="text-sm text-foreground-muted">Running across 3 workflows</p>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        View All
      </Button>
      <Button size="sm">Create Agent</Button>
    </div>
  </div>
</Card>
```

### **Pattern 3: Article/Long-form Content**

```tsx
<article className="max-w-3xl mx-auto px-4 py-12">
  <h1 className="text-4xl font-bold mb-6">Article Title</h1>

  <div className="text-sm text-foreground-muted mb-8">Published on Nov 4, 2025 by Author Name</div>

  <div className="prose prose-lg">
    <p className="text-lg leading-relaxed mb-6">
      First paragraph with larger text and relaxed line height.
    </p>

    <p className="leading-relaxed mb-6">Regular paragraph text.</p>

    <h2 className="text-2xl font-semibold mb-4 mt-12">Section Heading</h2>

    <p className="leading-relaxed mb-6">More content...</p>
  </div>
</article>
```

### **Pattern 4: Data Table**

```tsx
<div className="rounded-lg border overflow-hidden">
  <table className="w-full">
    <thead className="bg-muted/30">
      <tr>
        <th className="text-left p-3 text-sm font-medium">Name</th>
        <th className="text-left p-3 text-sm font-medium">Status</th>
        <th className="text-left p-3 text-sm font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="p-3 text-sm">Agent 1</td>
        <td className="p-3">
          <Badge>Active</Badge>
        </td>
        <td className="p-3">
          <Button size="sm" variant="ghost">
            Edit
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 📱 RESPONSIVE TYPOGRAPHY

```tsx
// Mobile-first responsive sizing
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Responsive spacing
<section className="py-12 md:py-16 lg:py-24">
  Content
</section>

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">
  Content
</div>
```

---

## ❌ COMMON MISTAKES

### **Mistake 1: Inconsistent Spacing**

```tsx
// ❌ DON'T: Random spacing values
<div className="mb-7">
<div className="mt-11">
<div className="p-5 gap-7">

// ✅ DO: Use spacing scale
<div className="mb-6">  {/* 24px */}
<div className="mt-12"> {/* 48px */}
<div className="p-6 gap-6">  {/* 24px */}
```

### **Mistake 2: Too Many Font Sizes**

```tsx
// ❌ DON'T: Creating custom sizes
<p className="text-[17px]">
<p className="text-[19px]">

// ✅ DO: Use the scale
<p className="text-base">  {/* 16px */}
<p className="text-lg">    {/* 18px */}
```

### **Mistake 3: Overusing Bold**

```tsx
// ❌ DON'T: Everything bold
<h1 className="font-bold">Title</h1>
<h2 className="font-bold">Subtitle</h2>
<p className="font-bold">Paragraph</p>

// ✅ DO: Use semibold for headings, normal for body
<h1 className="font-semibold">Title</h1>
<h2 className="font-semibold">Subtitle</h2>
<p className="font-normal">Paragraph</p>
```

---

## 🎯 QUICK REFERENCE

### **Typography Hierarchy**

```
Hero (text-8xl, font-bold)
  ↓
Page Title (text-3xl, font-semibold)
  ↓
Section Title (text-2xl, font-semibold)
  ↓
Card Title (text-xl, font-medium)
  ↓
Body Text (text-base, font-normal) ← Default
  ↓
Small Text (text-sm, font-normal)
  ↓
Caption (text-xs, text-foreground-muted)
```

### **Spacing Hierarchy**

```
Section Margin (mb-24 = 96px)
  ↓
Block Margin (mb-16 = 64px)
  ↓
Element Margin (mb-6 = 24px)
  ↓
Small Margin (mb-4 = 16px) ← Most common
  ↓
Tight Margin (mb-2 = 8px)
```

---

## 📚 FURTHER READING

- **Design System:** `DESIGN-SYSTEM.md`
- **Colors:** `UI-COLOR-SYSTEM-REFERENCE.md`
- **Components:** `UI-COMPONENT-DECISION-GUIDE.md`
- **Tailwind Config:** `apps/web/tailwind.config.ts`

---

**Updated:** November 4, 2025  
**Maintained By:** AI Development Agent  
**Status:** ✅ Active - Follow these standards for all typography and spacing
