# Wireframes: Forms, Auth & Utility Templates

**Templates covered:** 7-12  
**Pages:** 18 total

---

## Template 7: Form/Wizard Flow

**Used by:** `/onboarding`, `/packs/create`, `/reports/create`, `/support/tickets/new`, `/prospects/import` (8 pages)

### Desktop Layout (Multi-Step)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         MAIN CONTENT (centered)                          │
│                                                                          │
│ ┌─ Progress Stepper ────────────────────────────────────────────────────┐│
│ │ ●━━━━━━● ━━━━━━ ○ ━━━━━━ ○                                         ││
│ │ 1. Basics   2. Config   3. Review   4. Deploy                        ││
│ └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│ ┌─ Form Card ───────────────────────────────────────────────────────────┐│
│ │                                                                        ││
│ │   Basic Information                              Auto-saved 2min ago  ││
│ │   ───────────────────────────────────────────────────────────────── ││
│ │                                                                        ││
│ │   Agent Name *                                                         ││
│ │   ┌────────────────────────────────────────────────────────────────┐ ││
│ │   │ Sales Outreach Agent                                           │ ││
│ │   └────────────────────────────────────────────────────────────────┘ ││
│ │                                                                        ││
│ │   Description                                                          ││
│ │   ┌────────────────────────────────────────────────────────────────┐ ││
│ │   │ This agent automates...                                        │ ││
│ │   │                                                                │ ││
│ │   │                                                                │ ││
│ │   └────────────────────────────────────────────────────────────────┘ ││
│ │   0 / 500 characters                                                   ││
│ │                                                                        ││
│ │   Category *                                                           ││
│ │   ┌────────────────────────────────────────────────────────────────┐ ││
│ │   │ Sales & Marketing                                          ▼   │ ││
│ │   └────────────────────────────────────────────────────────────────┘ ││
│ │                                                                        ││
│ │   Tags                                                                 ││
│ │   ┌────────────────────────────────────────────────────────────────┐ ││
│ │   │ [sales] [automation] [email]  + Add tag                        │ ││
│ │   └────────────────────────────────────────────────────────────────┘ ││
│ │                                                                        ││
│ │   ┌─ Help Tip ───────────────────────────────────────────────────┐  ││
│ │   │ ℹ️ Pro Tip: Use descriptive names to help your team find    │  ││
│ │   │ agents quickly. You can always change this later.            │  ││
│ │   └──────────────────────────────────────────────────────────────┘  ││
│ │                                                                        ││
│ └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│ ┌─ Footer Actions ──────────────────────────────────────────────────────┐│
│ │                                    [Cancel]  [Back]  [Next: Config →]││
│ └──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Nav ────────────────┐│
│ │ [×] Create Agent     [⋯] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Progress ───────────────┐│
│ │ ●━━━● ━━ ○ ━━ ○         ││
│ │ Step 1 of 4              ││
│ │ [████████░░] 50%         ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Form ───────────────────┐│
│ │ Basic Information        ││
│ │ Auto-saved 2m ago        ││
│ │ ──────────────────────── ││
│ │                          ││
│ │ Agent Name *             ││
│ │ ┌──────────────────────┐││
│ │ │ Sales Agent          │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ Description              ││
│ │ ┌──────────────────────┐││
│ │ │ This agent...        │││
│ │ │                      │││
│ │ └──────────────────────┘││
│ │ 0 / 500 chars            ││
│ │                          ││
│ │ Category *               ││
│ │ ┌──────────────────────┐││
│ │ │ Sales & Marketing ▼  │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ Tags                     ││
│ │ [sales] [auto] + Add     ││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ ℹ️ Tip: Use clear    │││
│ │ │ names for easy search│││
│ │ └──────────────────────┘││
│ └──────────────────────────┘│
│                             │
│ ┌─ Actions ────────────────┐│
│ │ [Cancel] [Back] [Next →] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Progress Stepper

```jsx
<div className="flex items-center justify-center mb-12">
  {steps.map((step, index) => (
    <React.Fragment key={step.id}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
            index < currentStep
              ? 'bg-success text-success-foreground'
              : index === currentStep
                ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                : 'bg-background-subtle text-foreground-muted border-2 border-border',
          )}
        >
          {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
        </div>
        <span
          className={cn(
            'mt-2 text-xs font-medium',
            index <= currentStep ? 'text-foreground' : 'text-foreground-muted',
          )}
        >
          {step.label}
        </span>
      </div>
      {index < steps.length - 1 && (
        <div className={cn('h-0.5 w-24 mx-2', index < currentStep ? 'bg-success' : 'bg-border')} />
      )}
    </React.Fragment>
  ))}
</div>
```

**Measurements:**

- Step circle: `w-10 h-10` (40px)
- Active ring: `ring-4 ring-primary/20` (4px ring)
- Connector line: `h-0.5 w-24` (2px × 96px)
- Label: `text-xs` (12px)
- Step spacing: `mx-2` (8px)

---

#### 2. Form Container

```jsx
<div className="max-w-2xl mx-auto">
  <div className="bg-background-elevated border border-border rounded-lg p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-foreground">Basic Information</h2>
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <Check className="w-4 h-4 text-success" />
        <span>Auto-saved 2 minutes ago</span>
      </div>
    </div>

    <form onSubmit={handleNext} className="space-y-6">
      {/* Form fields */}
    </form>
  </div>
</div>
```

**Measurements:**

- Container max width: `max-w-2xl` (672px)
- Card padding: `p-8` (32px)
- Title: `text-2xl` (24px)
- Form spacing: `space-y-6` (24px)

---

#### 3. Form Input with Validation

```jsx
<div>
  <label htmlFor="agentName" className="block text-sm font-medium text-foreground mb-2">
    Agent Name <span className="text-destructive">*</span>
  </label>
  <input
    id="agentName"
    type="text"
    required
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className={cn(
      'w-full px-4 py-2.5 rounded-lg border bg-background-subtle transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
      'placeholder:text-foreground-subtle',
      errors.name ? 'border-destructive focus:ring-destructive' : 'border-border',
    )}
    placeholder="Enter agent name"
  />
  {errors.name && (
    <p className="mt-2 text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {errors.name}
    </p>
  )}
</div>
```

**Measurements:**

- Input padding: `px-4 py-2.5` (16px × 10px)
- Focus ring: `ring-2` (2px)
- Error text: `text-sm` (14px)
- Spacing: `mt-2` (8px) for error

---

#### 4. Textarea with Character Count

```jsx
<div>
  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
    Description
  </label>
  <textarea
    id="description"
    rows={4}
    maxLength={500}
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background-subtle
               focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
               placeholder:text-foreground-subtle resize-none"
    placeholder="Describe what this agent does..."
  />
  <div className="mt-2 text-xs text-foreground-muted text-right">
    {formData.description.length} / 500 characters
  </div>
</div>
```

**Measurements:**

- Rows: `rows={4}` (~80px height)
- Character count: `text-xs` (12px)
- Spacing: `mt-2` (8px)

---

#### 5. Tag Input

```jsx
<div>
  <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-background-subtle">
    {tags.map((tag) => (
      <span
        key={tag}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md
                   bg-primary/10 text-primary text-sm border border-primary/20"
      >
        {tag}
        <button onClick={() => removeTag(tag)} className="hover:text-primary-hover">
          <X className="w-3 h-3" />
        </button>
      </span>
    ))}
    <input
      type="text"
      placeholder="+ Add tag"
      onKeyDown={handleAddTag}
      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm
                 placeholder:text-foreground-subtle"
    />
  </div>
</div>
```

**Measurements:**

- Container padding: `p-3` (12px)
- Tag padding: `px-2 py-1` (8px × 4px)
- Gap: `gap-2` (8px)
- Icon: `w-3 h-3` (12px × 12px)

---

#### 6. Help Tip

```jsx
<div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
  <div>
    <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
    <p className="text-sm text-foreground-muted">
      Use descriptive names to help your team find agents quickly. You can always change this later.
    </p>
  </div>
</div>
```

**Measurements:**

- Padding: `p-4` (16px)
- Icon: `w-5 h-5` (20px × 20px)
- Gap: `gap-3` (12px)
- Text: `text-sm` (14px)

---

#### 7. Footer Actions

```jsx
<div className="flex items-center justify-between pt-6 border-t border-border">
  <button
    onClick={handleCancel}
    className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
  >
    Cancel
  </button>

  <div className="flex items-center gap-3">
    <button
      onClick={handleBack}
      disabled={currentStep === 0}
      className="px-4 py-2 text-sm border border-border rounded-lg
                 hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      ← Back
    </button>
    <button
      type="submit"
      className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg
                 hover:bg-primary-hover transition-colors font-medium flex items-center gap-2"
    >
      {isLastStep ? 'Complete' : `Next: ${nextStepName}`}
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>
```

**Measurements:**

- Border top: `border-t border-border`
- Button padding: `px-4 py-2` (16px × 8px) for secondary, `px-6 py-2` for primary
- Gap: `gap-3` (12px)
- Spacing: `pt-6` (24px)

---

## Template 8: Authentication

**Used by:** `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password` (5 pages)

### Desktop Layout (Centered Card)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                         ┌─ Auth Card ─────────────┐                     │
│                         │                          │                     │
│                         │    [Logo]                │                     │
│                         │                          │                     │
│                         │    Sign in to GalaxyCo   │                     │
│                         │    Welcome back! Please  │                     │
│                         │    enter your details    │                     │
│                         │                          │                     │
│                         │    Email address         │                     │
│                         │    ┌──────────────────┐ │                     │
│                         │    │ you@company.com  │ │                     │
│                         │    └──────────────────┘ │                     │
│                         │                          │                     │
│                         │    Password              │                     │
│                         │    ┌──────────────────┐ │                     │
│                         │    │ ••••••••••••••   │ │                     │
│                         │    └──────────────────┘ │                     │
│                         │                          │                     │
│                         │    ☐ Remember me         │                     │
│                         │    Forgot password? →    │                     │
│                         │                          │                     │
│                         │    ┌──────────────────┐ │                     │
│                         │    │   Sign in        │ │                     │
│                         │    └──────────────────┘ │                     │
│                         │                          │                     │
│                         │    ─── or continue with───│                   │
│                         │                          │                     │
│                         │    [G] [GitHub] [SSO]    │                     │
│                         │                          │                     │
│                         │    Don't have an account?│                     │
│                         │    Sign up →             │                     │
│                         │                          │                     │
│                         └──────────────────────────┘                     │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│                             │
│        [Logo]               │
│                             │
│    Sign in to GalaxyCo      │
│    Welcome back!            │
│                             │
│    Email address            │
│    ┌─────────────────────┐ │
│    │ you@company.com     │ │
│    └─────────────────────┘ │
│                             │
│    Password                 │
│    ┌─────────────────────┐ │
│    │ •••••••••••         │ │
│    └─────────────────────┘ │
│                             │
│    ☐ Remember me            │
│    Forgot password? →       │
│                             │
│    ┌─────────────────────┐ │
│    │   Sign in           │ │
│    └─────────────────────┘ │
│                             │
│    ─── or continue with ─── │
│                             │
│    [G] [GitHub] [SSO]       │
│                             │
│    Don't have an account?   │
│    Sign up →                │
│                             │
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Auth Container

```jsx
<div className="min-h-screen flex items-center justify-center p-4 bg-background">
  <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <Logo className="h-12 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to GalaxyCo</h1>
      <p className="text-sm text-foreground-muted">Welcome back! Please enter your details</p>
    </div>

    <div className="bg-background-elevated border border-border rounded-lg p-8">
      <form onSubmit={handleSubmit}>{/* Form fields */}</form>
    </div>
  </div>
</div>
```

**Measurements:**

- Max width: `max-w-md` (448px)
- Card padding: `p-8` (32px)
- Logo height: `h-12` (48px)
- Title: `text-2xl` (24px)
- Subtitle: `text-sm` (14px)

---

#### 2. Password Input with Toggle

```jsx
<div>
  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
    Password
  </label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? 'text' : 'password'}
      required
      className="w-full px-4 py-2.5 pr-12 rounded-lg border border-border bg-background-subtle
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted
                 hover:text-foreground transition-colors"
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
</div>
```

**Measurements:**

- Input padding: `px-4 py-2.5` (16px × 10px), `pr-12` (48px right for icon)
- Icon button: `right-3` (12px from right)
- Icon size: `w-5 h-5` (20px × 20px)

---

#### 3. Remember Me Checkbox

```jsx
<div className="flex items-center justify-between">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
    />
    <span className="text-sm text-foreground">Remember me</span>
  </label>

  <Link
    to="/forgot-password"
    className="text-sm text-primary hover:text-primary-hover transition-colors"
  >
    Forgot password?
  </Link>
</div>
```

**Measurements:**

- Checkbox: `w-4 h-4` (16px × 16px)
- Text: `text-sm` (14px)
- Gap: `gap-2` (8px)

---

#### 4. OAuth Buttons

```jsx
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-border" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="px-2 bg-background-elevated text-foreground-muted">
      or continue with
    </span>
  </div>
</div>

<div className="grid grid-cols-3 gap-3">
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg
                     hover:border-border-hover hover:bg-hover transition-colors">
    <GoogleIcon className="w-5 h-5" />
  </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg
                     hover:border-border-hover hover:bg-hover transition-colors">
    <GitHubIcon className="w-5 h-5" />
  </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg
                     hover:border-border-hover hover:bg-hover transition-colors">
    <span className="text-sm font-medium">SSO</span>
  </button>
</div>
```

**Measurements:**

- Divider: `border-t border-border`
- Divider text: `text-xs uppercase` (12px)
- Button padding: `px-4 py-2` (16px × 8px)
- Grid: `grid-cols-3 gap-3` (3 columns, 12px gap)
- Icon: `w-5 h-5` (20px × 20px)

---

#### 5. Footer Link

```jsx
<p className="mt-6 text-center text-sm text-foreground-muted">
  Don't have an account?{' '}
  <Link
    to="/signup"
    className="text-primary hover:text-primary-hover font-medium transition-colors"
  >
    Sign up
  </Link>
</p>
```

**Measurements:**

- Spacing: `mt-6` (24px)
- Text: `text-sm` (14px)
- Alignment: `text-center`

---

## Template 9: Error Pages

**Used by:** `/404`, `/500`, `/403`, `/maintenance`, `/error` (5 pages)

### Desktop & Mobile Layout (Same)

```
┌─────────────────────────────┐
│                             │
│                             │
│         [Icon/Emoji]        │
│            😕                │
│                             │
│          404                │
│      Page Not Found         │
│                             │
│   The page you're looking   │
│   for doesn't exist or has  │
│   been moved.               │
│                             │
│   ┌─────────────────────┐  │
│   │   Go to Dashboard   │  │
│   └─────────────────────┘  │
│                             │
│      Contact Support →      │
│                             │
└─────────────────────────────┘
```

### Component Breakdown

```jsx
<div className="min-h-screen flex items-center justify-center p-4 bg-background">
  <div className="max-w-md w-full text-center">
    <div className="text-6xl mb-6">😕</div>

    <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
    <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>

    <p className="text-foreground-muted mb-8 leading-relaxed">
      The page you're looking for doesn't exist or has been moved. Please check the URL or return to
      the dashboard.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Link
        to="/"
        className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg
                   hover:bg-primary-hover transition-colors font-medium"
      >
        Go to Dashboard
      </Link>
      <Link
        to="/support"
        className="w-full sm:w-auto px-6 py-3 text-primary hover:text-primary-hover
                   transition-colors font-medium flex items-center justify-center gap-2"
      >
        Contact Support
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</div>
```

**Measurements:**

- Icon: `text-6xl` (60px emoji)
- Error code: `text-6xl` (60px)
- Title: `text-2xl` (24px)
- Body: `text-base` (16px) with `leading-relaxed`
- Button: `px-6 py-3` (24px × 12px)
- Max width: `max-w-md` (448px)

**Error Variants:**

- **404:** "Page Not Found" + Go Home
- **500:** "Something Went Wrong" + Try Again
- **403:** "Access Denied" + Request Access
- **Maintenance:** "We'll Be Right Back" + Status Page
- **Generic Error:** "Oops!" + Report Bug

---

## Template 10: Search/Results

**Used by:** `/search`, `/help/search`, `/marketplace/categories/[category]` (3 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Search Bar ─────────────────────────┐│
│                                 │ │ ┌──────────────────────────────────┐││
│ • Dashboard                     │ │ │ 🔍 machine learning agents      │││
│ • Search                        │ │ └──────────────────────────────────┘││
│                                 │ │ 142 results found in 0.3s            ││
│                                 │ └──────────────────────────────────────┘│
│ ┌─ Filters ─────────────────┐  │                                          │
│ │ Refine Results            │  │ ┌─ Quick Filters ──────────────────────┐│
│ │                           │  │ │ [All] [Agents] [Workflows] [Docs]    ││
│ │ Content Type              │  │ └──────────────────────────────────────┘│
│ │ ☑ All                     │  │                                          │
│ │ ☐ Agents (42)             │  │ ┌─ Results ────────────────────────────┐│
│ │ ☐ Workflows (28)          │  │ │ AGENTS (42 results)                  ││
│ │ ☐ Documents (51)          │  │ │                                      ││
│ │ ☐ Templates (21)          │  │ │ ┌──────────────────────────────────┐││
│ │                           │  │ │ │ 🤖 ML Sales Agent                │││
│ │ Date Range                │  │ │ │ Uses machine learning to...      │││
│ │ ☐ Last 24 hours           │  │ │ │ Active • 1.2K runs               │││
│ │ ☐ Last week               │  │ │ └──────────────────────────────────┘││
│ │ ☑ Last month              │  │ │                                      ││
│ │ ☐ Last year               │  │ │ ┌──────────────────────────────────┐││
│ │                           │  │ │ │ 🤖 Smart Lead Scoring            │││
│ │ [Clear Filters]           │  │ │ │ Automated machine learning...    │││
│ └───────────────────────────┘  │ │ │ Paused • 856 runs                │││
│                                 │ │ └──────────────────────────────────┘││
│                                 │ │                                      ││
│                                 │ │ DOCUMENTS (51 results)               ││
│                                 │ │                                      ││
│                                 │ │ ┌──────────────────────────────────┐││
│                                 │ │ │ 📄 Machine Learning Guide        │││
│                                 │ │ │ ...machine learning models for   │││
│                                 │ │ │ sales automation and...          │││
│                                 │ │ │ Docs • Updated 2d ago            │││
│                                 │ │ └──────────────────────────────────┘││
│                                 │ │                                      ││
│                                 │ │ [Load More Results]                  ││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Bar ────────────────┐│
│ │ [←] Search         [⋯]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Search ─────────────────┐│
│ │ ┌─────────────────────┐ ││
│ │ │ 🔍 machine learning │ ││
│ │ └─────────────────────┘ ││
│ │ 142 results • 0.3s      ││
│ │ [Filters (3)] [Sort ▼]  ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Quick Filters ──────────┐│
│ │ [All] Agents Workflows → ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Results ────────────────┐│
│ │ AGENTS (42)              ││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ 🤖 ML Sales Agent    │││
│ │ │ Uses machine...      │││
│ │ │ Active • 1.2K runs   │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ 🤖 Smart Lead        │││
│ │ │ Automated ML...      │││
│ │ │ Paused • 856 runs    │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ DOCS (51)                ││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ 📄 ML Guide          │││
│ │ │ ...machine learning  │││
│ │ │ Docs • Updated 2d    │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ [Load More]              ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Search Header

```jsx
<div className="mb-6">
  <div className="relative mb-3">
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search everything..."
      className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-background-elevated
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 text-lg"
    />
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
  </div>
  <p className="text-sm text-foreground-muted">
    <span className="font-medium text-foreground">{resultCount} results</span> found in {searchTime}
    s
  </p>
</div>
```

**Measurements:**

- Input height: `py-3` (12px, ~48px total)
- Input text: `text-lg` (18px)
- Icon: `w-5 h-5` (20px × 20px)
- Icon position: `left-4` (16px)

---

#### 2. Result Card

```jsx
<Link
  to={result.href}
  className="block bg-background-elevated border border-border rounded-lg p-4 mb-3
             hover:border-primary hover:shadow-md transition-all duration-fast"
>
  <div className="flex items-start gap-3">
    <div className="text-2xl flex-shrink-0">{result.icon}</div>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-foreground mb-1 truncate">
        {highlightMatch(result.title, query)}
      </h3>
      <p className="text-sm text-foreground-muted mb-2 line-clamp-2">
        {highlightMatch(result.excerpt, query)}
      </p>
      <div className="flex items-center gap-2 text-xs text-foreground-muted">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full
                         bg-background-subtle border border-border"
        >
          {result.type}
        </span>
        <span>•</span>
        <span>{result.metadata}</span>
      </div>
    </div>
  </div>
</Link>
```

**Measurements:**

- Padding: `p-4` (16px)
- Icon: `text-2xl` (24px emoji)
- Title: `font-semibold` (600)
- Excerpt: `text-sm line-clamp-2` (14px, max 2 lines)
- Badge: `px-2 py-0.5` (8px × 2px)
- Gap: `gap-3` (12px)

---

## Template 11: Notification Center

**Used by:** `/notifications`, `/activity` (2 pages)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)                │ MAIN CONTENT (flex-1)                   │
│                                 │                                          │
│ [Logo]                          │ ┌─ Header ─────────────────────────────┐│
│                                 │ │ Notifications       [Mark all read] ││
│ • Dashboard                     │ └──────────────────────────────────────┘│
│ • Notifications                 │                                          │
│                                 │ ┌─ Tabs ───────────────────────────────┐│
│                                 │ │ [All (12)] [Unread (3)] [@Mentions (││
│                                 │ │ 1)]                                  ││
│                                 │ └──────────────────────────────────────┘│
│                                 │                                          │
│                                 │ ┌─ Timeline ───────────────────────────┐│
│                                 │ │ Today                                ││
│                                 │ │                                      ││
│                                 │ │ ┌────────────────────────────────┐  ││
│                                 │ │ │ ● New agent deployed           │  ││
│                                 │ │ │ Sales Agent is now live        │  ││
│                                 │ │ │ 2 minutes ago                  │  ││
│                                 │ │ └────────────────────────────────┘  ││
│                                 │ │                                      ││
│                                 │ │ ┌────────────────────────────────┐  ││
│                                 │ │ │   @mention from John           │  ││
│                                 │ │ │   Reviewed your workflow       │  ││
│                                 │ │ │   15 minutes ago               │  ││
│                                 │ │ └────────────────────────────────┘  ││
│                                 │ │                                      ││
│                                 │ │ Yesterday                            ││
│                                 │ │                                      ││
│                                 │ │ ┌────────────────────────────────┐  ││
│                                 │ │ │   Payment received             │  ││
│                                 │ │ │   $299 for Pro plan            │  ││
│                                 │ │ │   Yesterday at 3:24 PM         │  ││
│                                 │ │ └────────────────────────────────┘  ││
│                                 │ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│ ┌─ Top Bar ────────────────┐│
│ │ [←] Notifications [✓]   ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Tabs (Scroll) ──────────┐│
│ │ [All (12)] Unread @Me → ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Timeline ───────────────┐│
│ │ Today                    ││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ ● New agent deployed │││
│ │ │ Sales Agent is live  │││
│ │ │ 2 min ago            │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ @mention from John   │││
│ │ │ Reviewed workflow    │││
│ │ │ 15 min ago           │││
│ │ └──────────────────────┘││
│ │                          ││
│ │ Yesterday                ││
│ │                          ││
│ │ ┌──────────────────────┐││
│ │ │ Payment received     │││
│ │ │ $299 for Pro plan    │││
│ │ │ Yesterday at 3:24 PM │││
│ │ └──────────────────────┘││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Notification Item

```jsx
<div
  className={cn(
    'p-4 rounded-lg border transition-colors cursor-pointer',
    notification.read
      ? 'bg-background-elevated border-border hover:border-border-hover'
      : 'bg-primary/5 border-primary/20 hover:border-primary/30',
  )}
  onClick={() => handleNotificationClick(notification.id)}
>
  <div className="flex items-start gap-3">
    <div
      className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', !notification.read && 'bg-primary')}
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-foreground mb-1">{notification.title}</h4>
      <p className="text-sm text-foreground-muted mb-2">{notification.message}</p>
      <span className="text-xs text-foreground-subtle">{formatTime(notification.createdAt)}</span>
    </div>
    <button className="text-foreground-muted hover:text-foreground">
      <X className="w-4 h-4" />
    </button>
  </div>
</div>
```

**Measurements:**

- Padding: `p-4` (16px)
- Unread dot: `w-2 h-2` (8px × 8px)
- Title: `font-medium` (500)
- Message: `text-sm` (14px)
- Time: `text-xs` (12px)
- Close icon: `w-4 h-4` (16px × 16px)
- Gap: `gap-3` (12px)

---

## Template 12: Mobile Companion Views

**Used by:** `/m/dashboard`, `/m/agents`, `/m/notifications` (3 pages)

### Mobile Layout (Chat-First)

```
┌─────────────────────────────┐
│ ┌─ Top Bar ────────────────┐│
│ │ GalaxyCo AI      [menu] ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Chat Interface ─────────┐│
│ │                          ││
│ │ [User Bubble]            ││
│ │ Create a sales agent     ││
│ │ for email outreach       ││
│ │                    10:23 ││
│ │                          ││
│ │ [AI Bubble]              ││
│ │ I'll help you create     ││
│ │ a sales agent. What      ││
│ │ should it be called?     ││
│ │ 10:23                    ││
│ │                          ││
│ │ [Quick Replies]          ││
│ │ [Sales Agent]            ││
│ │ [Lead Gen Bot]           ││
│ │ [Custom Name]            ││
│ │                          ││
│ └──────────────────────────┘│
│                             │
│ ┌─ Input Area ─────────────┐│
│ │ ┌──────────────────────┐││
│ │ │ Type a message...   🎤│││
│ │ └──────────────────────┘││
│ └──────────────────────────┘│
│                             │
│ ┌─ Bottom Nav ─────────────┐│
│ │ [🏠] [📊] [➕] [🔔] [👤]││
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### Component Breakdown

#### 1. Chat Message

```jsx
<div className={cn(
  "flex gap-2 mb-4",
  isUser ? "flex-row-reverse" : "flex-row"
)}>
  {!isUser && (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      🤖
    </div>
  )}
  <div className={cn(
    "max-w-[75%] rounded-2xl px-4 py-2.5",
    isUser
      ? "bg-primary text-primary-foreground"
      : "bg-background-elevated border border-border"
  )}>
    <p className="text-sm leading-relaxed">{message.text}</p>
  </div>
</div>
<div className={cn(
  "text-xs text-foreground-subtle mb-2",
  isUser ? "text-right mr-10" : "text-left ml-10"
)}>
  {formatTime(message.timestamp)}
</div>
```

**Measurements:**

- Avatar: `w-8 h-8` (32px × 32px)
- Bubble padding: `px-4 py-2.5` (16px × 10px)
- Max width: `max-w-[75%]`
- Border radius: `rounded-2xl` (16px)
- Text: `text-sm` (14px)
- Time: `text-xs` (12px)

---

#### 2. Quick Reply Chips

```jsx
<div className="flex flex-wrap gap-2 mb-4">
  {quickReplies.map((reply) => (
    <button
      key={reply.id}
      onClick={() => handleQuickReply(reply.text)}
      className="px-4 py-2 rounded-full border border-border bg-background-elevated
                 hover:border-primary hover:bg-primary/5 transition-colors
                 text-sm font-medium"
    >
      {reply.text}
    </button>
  ))}
</div>
```

**Measurements:**

- Padding: `px-4 py-2` (16px × 8px)
- Border radius: `rounded-full`
- Text: `text-sm` (14px)
- Gap: `gap-2` (8px)

---

#### 3. Input with Voice

```jsx
<div className="sticky bottom-16 p-4 bg-background border-t border-border">
  <div className="relative flex items-center gap-2">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 px-4 py-3 pr-12 rounded-full border border-border bg-background-subtle
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
    <button
      className="absolute right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground
                       flex items-center justify-center hover:bg-primary-hover transition-colors"
    >
      <Mic className="w-5 h-5" />
    </button>
  </div>
</div>
```

**Measurements:**

- Input padding: `px-4 py-3` (16px × 12px)
- Border radius: `rounded-full`
- Voice button: `w-10 h-10` (40px × 40px)
- Icon: `w-5 h-5` (20px × 20px)

---

## Responsive Summary

### Template 7 (Forms/Wizards)

- **Desktop:** Centered card (672px), horizontal stepper
- **Tablet:** Centered card (full width), horizontal stepper
- **Mobile:** Full width, progress bar instead of stepper

### Template 8 (Auth)

- **Desktop:** Centered card (448px), no sidebar
- **Tablet:** Centered card (full width)
- **Mobile:** Full screen, no card border

### Template 9 (Errors)

- **All devices:** Centered content, same layout

### Template 10 (Search)

- **Desktop:** Sidebar filters + results grid
- **Tablet:** Collapsible filters + results list
- **Mobile:** Filter sheet + results list

### Template 11 (Notifications)

- **Desktop:** Sidebar + timeline (chronological)
- **Tablet:** Full width timeline
- **Mobile:** Full screen timeline + bottom nav

### Template 12 (Mobile Companion)

- **Mobile only:** Chat-first interface with bottom nav

---

## Next Steps

1. **Review all 12 templates**
2. **Move to Component Inventory document**
3. **Create Information Architecture map**
4. **Finalize Phase 1 before moving to Phase 2**

---

**Status:** Templates 7-12 complete ✅
**Phase 1:** ALL WIREFRAMES COMPLETE ✅
