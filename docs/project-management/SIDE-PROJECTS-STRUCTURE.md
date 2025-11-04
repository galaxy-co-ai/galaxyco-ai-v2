# 🗂️ Side Projects Structure & Naming Conventions

**Last Updated:** November 3, 2025  
**Status:** ✅ Active Standard

---

## 📁 Directory Structure

```
C:\Users\Owner\workspace\
├── galaxyco-ai-2.0\              # Main project (production)
├── devops-hq\                    # Universal context/patterns (shared)
├── Side_Projects\                # Container for all side projects
│   ├── active\                   # Currently active projects (2-4 at a time)
│   │   ├── 2025-11-project-name\
│   │   ├── 2025-11-another-project\
│   │   └── 2025-12-new-idea\
│   ├── archive\                  # Completed/paused projects
│   │   ├── 2025-10-old-project\
│   │   └── 2025-09-experiment\
│   └── templates\                # Project starter templates
│       ├── nextjs-template\
│       ├── node-api-template\
│       └── python-ml-template\
```

---

## 📝 Naming Conventions

### Side Project Names (STRICT RULES)

**Format:** `YYYY-MM-project-name`

**Rules:**

1. **Date Prefix:** `YYYY-MM` (year-month when started)
2. **Separator:** Single hyphen `-`
3. **Project Name:** Lowercase, kebab-case, descriptive
4. **No Spaces:** NEVER use spaces
5. **No Special Characters:** Only letters, numbers, hyphens
6. **Max Length:** 50 characters total

**Examples (GOOD):**

```
✅ 2025-11-ai-resume-builder
✅ 2025-11-crypto-tracker
✅ 2025-12-saas-starter-kit
✅ 2025-11-notion-clone
```

**Examples (BAD):**

```
❌ my-project              # Missing date prefix
❌ 2025_11_project         # Wrong separator (underscore)
❌ 2025-11-My Project      # Contains spaces, uppercase
❌ 2025-11-project!!!      # Special characters
❌ project                 # No date, too vague
```

### File/Folder Sub-Naming

**Within each project:**

```
2025-11-project-name\
├── .cursor\                      # Cursor AI config
│   ├── context.md               # Project overview
│   ├── rules.md                 # Project-specific rules
│   └── mcp.json                 # MCP servers (optional)
├── docs\                        # Documentation
├── src\                         # Source code
├── tests\                       # Tests
├── README.md                    # Quick start guide
├── package.json                 # Dependencies
└── .env.example                 # Environment template
```

---

## 🎯 Workflow: Starting a New Side Project

### Step 1: Create Project Structure

```bash
# Navigate to Side_Projects
cd C:\Users\Owner\workspace\Side_Projects\active

# Create new project with date prefix
mkdir 2025-11-your-project-name
cd 2025-11-your-project-name

# Initialize git
git init

# Create .cursor directory
mkdir .cursor
```

### Step 2: Set Up Minimal Cursor Config

Create `.cursor/context.md`:

```markdown
# [Project Name]

**Started:** November 2025  
**Status:** Active Development  
**Type:** [Web App / API / Tool / Experiment]

## What is this?

[One paragraph description]

## Tech Stack

- [List technologies]

## Goals

1. [Primary goal]
2. [Secondary goal]

## Status

- [ ] Initial setup
- [ ] Core feature 1
- [ ] Core feature 2
- [ ] Production ready
```

Create `.cursor/rules.md`:

```markdown
# [Project Name] - Cursor Rules

## Universal Standards

**Location:** C:\Users\Owner\workspace\devops-hq\.cursor\master-context.md
**Apply:** All universal patterns and preferences

## Project-Specific Rules

### Tech Stack

[Your specific tech stack rules]

### Code Style

[Any project-specific style preferences]

### Testing

[Testing requirements]

### Deployment

[Where/how to deploy]
```

### Step 3: Create README.md

```markdown
# [Project Name]

**Started:** [Date]  
**Status:** [Active/Paused/Complete]

## Quick Start

\`\`\`bash

# Install dependencies

pnpm install

# Run development

pnpm dev

# Run tests

pnpm test
\`\`\`

## What is this?

[Brief description]

## Why?

[Motivation for building this]

## Tech Stack

[List technologies]
```

### Step 4: Open in NEW Cursor Window

```bash
# Open in new Cursor window (from terminal)
cursor .

# Or: File → New Window → Open Folder
```

---

## 🔄 Daily Workflow (Switching Between Projects)

### Quick Switch Script (PowerShell)

Create `C:\Users\Owner\workspace\scripts\switch-project.ps1`:

```powershell
# Quick project switcher
param(
    [string]$project
)

$basePath = "C:\Users\Owner\workspace\Side_Projects\active"
$projectPath = Join-Path $basePath $project

if (Test-Path $projectPath) {
    Write-Host "Opening $project..." -ForegroundColor Green
    cursor $projectPath
} else {
    Write-Host "Project not found: $project" -ForegroundColor Red
    Write-Host "`nAvailable projects:" -ForegroundColor Yellow
    Get-ChildItem $basePath -Directory | ForEach-Object { Write-Host "  - $($_.Name)" }
}
```

**Usage:**

```bash
# Switch to side project
.\scripts\switch-project.ps1 2025-11-ai-resume-builder

# List all active projects
ls C:\Users\Owner\workspace\Side_Projects\active
```

---

## 📊 Project Status Tracking

### Active Projects Limit: 2-4 MAX

**When you hit 4 active projects:**

1. Complete or pause one before starting new one
2. Move completed/paused to `archive/`
3. Keep `active/` lean and focused

### Status Labels

Add to top of each project's README:

```markdown
**Status:** 🟢 Active | 🟡 Paused | ✅ Complete | 🔴 Abandoned
```

- 🟢 **Active:** Working on this regularly (2-4 projects)
- 🟡 **Paused:** Temporarily on hold, will return
- ✅ **Complete:** Shipped, in production, done
- 🔴 **Abandoned:** Not continuing, archived for reference

---

## 🗃️ Archiving Projects

### When to Archive

- Project completed (move to archive)
- Project paused > 2 weeks (move to archive)
- Need space for new project (move oldest to archive)

### How to Archive

```bash
# Move from active to archive
cd C:\Users\Owner\workspace\Side_Projects
mv active/2025-10-old-project archive/

# Add ARCHIVED note to README
echo "# ARCHIVED: [Reason]" > archive/2025-10-old-project/ARCHIVED.md
```

---

## 🎨 Project Templates

### Create Reusable Templates

**Purpose:** Speed up new project setup

**Location:** `Side_Projects/templates/`

**Example Templates:**

1. **nextjs-template** - Next.js 15 + TypeScript + Tailwind
2. **node-api-template** - Node.js API + Express + TypeScript
3. **python-ml-template** - Python + ML libraries + Jupyter
4. **chrome-extension-template** - Chrome extension starter

**Create from template:**

```bash
# Copy template
cp -r Side_Projects/templates/nextjs-template Side_Projects/active/2025-11-new-project

# Initialize
cd Side_Projects/active/2025-11-new-project
pnpm install
```

---

## 🔗 Shared Resources

### devops-hq (Universal Context)

**Location:** `C:\Users\Owner\workspace\devops-hq\.cursor\`

**Contains (UNIVERSAL ONLY - No Project-Specific Content):**

- `master-context.md` - Partnership protocol (how YOU and AI work together)
- `universal-patterns.md` - Cross-project learnings that benefit ALL projects
- `CONTRIBUTION-CHECKLIST.md` - Guidelines for what belongs here
- `DEVOPS-HQ-USAGE-GUIDELINES.md` - Complete usage guide

**Rules:**

- ✅ Only add patterns that apply to ALL projects
- ✅ Only add workflows reusable across projects
- ❌ NEVER add project-specific business logic
- ❌ NEVER add GalaxyCo-specific features/endpoints
- ❌ NEVER add session notes or progress updates

**Update After Every Project:**

- Found a great **universal** pattern? Add to universal-patterns.md
- Discovered a gotcha that applies **everywhere**? Document it
- Built something **reusable**? Add to templates/

**Before Adding:** Always check `devops-hq/.cursor/CONTRIBUTION-CHECKLIST.md`

---

## 📋 Quick Reference Card

### Starting New Project

```bash
cd C:\Users\Owner\workspace\Side_Projects\active
mkdir 2025-MM-project-name
cd 2025-MM-project-name
git init
mkdir .cursor src tests docs
# Create .cursor/context.md and .cursor/rules.md
cursor .
```

### Switching Projects

```bash
# GalaxyCo (main)
cd C:\Users\Owner\workspace\galaxyco-ai-2.0
cursor .

# Side project
cd C:\Users\Owner\workspace\Side_Projects\active/2025-11-project-name
cursor .
```

### Archiving Project

```bash
mv Side_Projects/active/PROJECT Side_Projects/archive/
echo "ARCHIVED: [reason]" > Side_Projects/archive/PROJECT/ARCHIVED.md
```

### Listing Active Projects

```bash
ls C:\Users\Owner\workspace\Side_Projects\active
```

---

## ✅ Naming Convention Checklist

Before creating ANY new project, verify:

- [ ] Date prefix in YYYY-MM format
- [ ] All lowercase
- [ ] Hyphens only (no underscores or spaces)
- [ ] Descriptive name (clear what it is)
- [ ] No special characters
- [ ] Max 50 characters total

**Template:** `2025-MM-descriptive-project-name`

---

## 🎯 Benefits of This System

1. **Chronological Organization:** Easy to see when projects started
2. **Clean Separation:** Side projects never interfere with GalaxyCo
3. **Scalable:** Can handle 50+ side projects over time
4. **Consistent:** Same structure across all projects
5. **Easy Switching:** Open in new Cursor window, full isolation
6. **Shared Learnings:** Universal patterns benefit all projects
7. **Archive Ready:** Easy to pause/complete/archive projects

---

**This is your standard. Follow it religiously.** 🎯
