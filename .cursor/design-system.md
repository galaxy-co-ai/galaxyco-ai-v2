# UI Audit System

**Autonomous UI review and screenshot system for GalaxyCo**

---

## 🎯 Purpose

This system allows AI to autonomously:

- Browse the GalaxyCo app (even behind auth)
- Take screenshots of all pages
- Analyze UI consistency
- Identify issues
- Propose and implement fixes

---

## 📋 Setup (One-Time)

### 1. Create Test User in Clerk

```
Email: ai-agent@galaxyco.ai
Password: [Store in Doppler as AI_AGENT_PASSWORD]
Organization: Create test org or use existing
```

### 2. Run Auth Setup

```bash
# This saves auth state for reuse
pnpm playwright test tests/ui-audit/auth.setup.ts
```

Auth state saved to: `tests/.auth/user.json`

### 3. Install Playwright if needed

```bash
pnpm add -D @playwright/test
pnpm playwright install
```

---

## 🚀 Usage

### Screenshot All Pages

```bash
# Captures every page in the app
pnpm playwright test tests/ui-audit/screenshot-all-pages.ts

# Screenshots saved to: tests/screenshots/audit/
```

### Analyze UI

After screenshots are captured:

1. AI reviews all screenshots
2. AI documents inconsistencies
3. AI proposes fixes
4. AI implements fixes
5. AI re-tests

---

## 📊 What Gets Captured

**Full-page screenshots:**

- Complete page from top to bottom
- Shows all content

**Viewport screenshots:**

- Above-the-fold content
- What users see first

**Both formats help identify:**

- Layout issues
- Alignment problems
- Color inconsistencies
- Typography problems
- Spacing issues
- Component variations

---

## 🔄 Workflow

```bash
# 1. Capture current state
pnpm playwright test tests/ui-audit/screenshot-all-pages.ts

# 2. AI analyzes screenshots
# (automated - AI reviews all images)

# 3. AI implements fixes
# (AI updates components with new design system)

# 4. Capture new state
pnpm playwright test tests/ui-audit/screenshot-all-pages.ts

# 5. Compare before/after
# (AI shows you improvements)

# 6. Deploy to staging
pnpm vercel deploy
```

---

## 📁 File Structure

```
tests/
├── ui-audit/
│   ├── README.md                    (this file)
│   ├── auth.setup.ts                (authenticate once)
│   ├── screenshot-all-pages.ts      (capture all pages)
│   └── analyze-consistency.ts       (find issues)
├── .auth/
│   └── user.json                    (saved auth state)
└── screenshots/
    ├── audit/
    │   ├── before/                  (original state)
    │   └── after/                   (after fixes)
    └── regression/                  (ongoing monitoring)
```

---

## ✅ Benefits

**For AI:**

- ✅ Can see actual UI (not just code)
- ✅ Can iterate autonomously
- ✅ Can catch visual regressions
- ✅ Can verify fixes work

**For You:**

- ✅ Zero manual screenshot work
- ✅ Comprehensive UI audit
- ✅ Before/after comparisons
- ✅ Faster iteration cycles
- ✅ Higher quality output

---

## 🎯 Next Steps

1. **You:** Create test user `ai-agent@galaxyco.ai` in Clerk (1 min)
2. **You:** Set password in environment variable
3. **AI:** Run auth setup
4. **AI:** Capture all screenshots
5. **AI:** Analyze and create report
6. **AI:** Implement fixes
7. **AI:** Show you before/after

**Result:** Professional, consistent UI across entire site

---

**This system removes all friction from UI iteration!**
