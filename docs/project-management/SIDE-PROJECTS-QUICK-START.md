# 🎯 Quick Start Guide - Side Projects System

**Created:** November 3, 2025  
**For:** Dalton (GalaxyCo.ai Owner)

---

## ✅ SYSTEM READY

Your side projects system is now set up and ready to use!

**Location:** `C:\Users\Owner\workspace\Side_Projects\`

**Structure:**

```
Side_Projects\
├── active\      # Your 2-4 current projects
├── archive\     # Completed/paused projects
└── templates\   # Starter templates
```

---

## 🚀 Create Your First Side Project

### Option 1: Automated (RECOMMENDED)

```powershell
# Navigate to workspace
cd C:\Users\Owner\workspace

# Create new project
.\scripts\new-side-project.ps1 -name "ai-resume-builder" -description "AI-powered resume builder with templates"

# Will create: Side_Projects\active\2025-11-ai-resume-builder\
```

### Option 2: Manual

```powershell
# Navigate to active projects
cd C:\Users\Owner\workspace\Side_Projects\active

# Create project (use YYYY-MM prefix)
mkdir 2025-11-ai-resume-builder
cd 2025-11-ai-resume-builder

# Initialize structure
mkdir .cursor, src, tests, docs
git init

# Open in Cursor
cursor .
```

---

## 🔄 Switch Between Projects

### Quick Switch (Use the script!)

```powershell
# Switch to GalaxyCo (main project)
.\scripts\switch-project.ps1 galaxyco

# Switch to side project
.\scripts\switch-project.ps1 2025-11-ai-resume-builder

# List all projects
.\scripts\switch-project.ps1 -list
```

### Manual Switch

```powershell
# Open new Cursor window for side project
cd C:\Users\Owner\workspace\Side_Projects\active\2025-11-project-name
cursor .
```

---

## 📝 Naming Convention (STRICT)

**Format:** `YYYY-MM-project-name`

✅ **GOOD:**

- `2025-11-ai-resume-builder`
- `2025-11-crypto-tracker`
- `2025-12-saas-starter-kit`
- `2025-11-notion-clone`

❌ **BAD:**

- `my-project` (missing date)
- `2025_11_project` (wrong separator)
- `2025-11-My Project` (spaces, uppercase)
- `project` (too vague, no date)

---

## 🗃️ Archive a Project

When complete or paused:

```powershell
# Move to archive
cd C:\Users\Owner\workspace\Side_Projects
mv active\2025-10-old-project archive\

# Add archive note
echo "# ARCHIVED: Completed November 2025" > archive\2025-10-old-project\ARCHIVED.md
```

---

## 📊 Track Your Projects

### Status Labels (Use in README.md)

- 🟢 **Active** - Working on regularly (2-4 max)
- 🟡 **Paused** - Temporarily on hold
- ✅ **Complete** - Shipped, done
- 🔴 **Abandoned** - Not continuing

### Update README Status

```markdown
**Status:** 🟢 Active
```

---

## 🎨 Create Templates (Future)

As you build projects, save reusable starters:

```powershell
# Copy working project as template
cd C:\Users\Owner\workspace\Side_Projects
cp -r active\2025-11-nextjs-app templates\nextjs-template

# Remove project-specific files
cd templates\nextjs-template
rm -r .git, .env, dist, node_modules
```

---

## 🔗 Universal Context (Shared Learnings)

All projects reference universal patterns:

**Location:** `C:\Users\Owner\workspace\devops-hq\.cursor\`

**Files:**

- `master-context.md` - Your preferences, AI philosophy
- `universal-patterns.md` - Cross-project learnings

**In your side project `.cursor/rules.md`:**

```markdown
## Universal Standards

**Location:** C:\Users\Owner\workspace\devops-hq\.cursor\master-context.md
**Apply:** All universal patterns and preferences
```

---

## 💡 Daily Workflow

### Morning: Pick Projects for Today

```powershell
# List active projects
.\scripts\switch-project.ps1 -list

# Pick 1-2 to work on today
.\scripts\switch-project.ps1 2025-11-project-1
```

### During Day: Switch as Needed

```powershell
# Switch to main project
.\scripts\switch-project.ps1 galaxyco

# Switch to side project
.\scripts\switch-project.ps1 2025-11-project-2

# Each opens in separate Cursor window = complete isolation
```

### Evening: Update Status

- Update README status in each project
- Commit progress
- Plan tomorrow's focus

---

## 🛠️ Scripts Available

### 1. `switch-project.ps1` - Switch between projects

```powershell
.\scripts\switch-project.ps1 <project-name>
.\scripts\switch-project.ps1 -list
```

### 2. `new-side-project.ps1` - Create new project

```powershell
.\scripts\new-side-project.ps1 -name "project-name" -description "What it does"
```

---

## ✅ Checklist Before Creating Project

- [ ] Name is lowercase
- [ ] Name uses hyphens (not underscores/spaces)
- [ ] Name is descriptive (clear what it is)
- [ ] No special characters
- [ ] Date prefix will be auto-added (YYYY-MM)
- [ ] Max 50 characters total

---

## 🎯 Rules to Live By

1. **Max 2-4 active projects** - If at 4, archive one before starting new
2. **Always use naming convention** - YYYY-MM-project-name (no exceptions)
3. **Separate Cursor windows** - Each project = new window = isolation
4. **Update README status** - Keep status emoji current
5. **Archive liberally** - If paused > 2 weeks, move to archive
6. **Share learnings** - Add patterns to universal-patterns.md

---

## 📚 Full Documentation

**Comprehensive Guide:** `docs/project-management/SIDE-PROJECTS-STRUCTURE.md`

**Read this for:**

- Detailed naming rules
- Template creation guide
- Archive procedures
- Best practices

---

## 🚀 You're Ready!

Your side projects system is ready. Start building! 🎯

**Next Steps:**

1. Create your first side project
2. Set up .cursor/ config
3. Start coding
4. Update README status regularly
5. Archive when complete/paused

**Questions?** See full docs or ask Cursor AI Agents Director! 🟡
