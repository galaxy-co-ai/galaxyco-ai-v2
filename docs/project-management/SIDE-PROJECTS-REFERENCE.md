# 🗂️ SIDE PROJECTS - REFERENCE CARD

**Quick reference for daily use - Pin this to your monitor!**

---

## 📝 NAMING CONVENTION (MEMORIZE THIS)

```
Format: YYYY-MM-project-name
Example: 2025-11-ai-resume-builder
```

**Rules:**
- ✅ Lowercase only
- ✅ Hyphens only (no underscores/spaces)
- ✅ Date prefix auto-added by script
- ✅ Descriptive name
- ❌ NO spaces, NO uppercase, NO special chars

---

## 🚀 QUICK COMMANDS

### Create New Project
```powershell
.\scripts\new-side-project.ps1 -name "project-name"
```

### Switch Projects
```powershell
# Main project
.\scripts\switch-project.ps1 galaxyco

# Side project
.\scripts\switch-project.ps1 2025-11-project-name

# List all
.\scripts\switch-project.ps1 -list
```

### Archive Project
```powershell
mv Side_Projects\active\PROJECT Side_Projects\archive\
```

---

## 📊 PROJECT LIMITS

**Active Projects:** 2-4 MAX  
**Status Labels:** 🟢 Active | 🟡 Paused | ✅ Complete | 🔴 Abandoned

---

## 📁 DIRECTORY STRUCTURE

```
workspace\
├── galaxyco-ai-2.0\          # Main project
├── devops-hq\                # Universal context
└── Side_Projects\
    ├── active\               # 2-4 current projects
    ├── archive\              # Completed/paused
    └── templates\            # Starter templates
```

---

## 🔑 KEY FILES IN EACH PROJECT

```
2025-11-project-name\
├── .cursor\
│   ├── context.md           # Project overview
│   └── rules.md             # Reference universal + project rules
├── README.md                # Status + quick start
└── .gitignore               # Standard ignores
```

---

## ✅ DAILY WORKFLOW

1. **Morning:** List projects → Pick 1-2 for today
2. **During:** Switch between main + side projects
3. **Evening:** Update README status + commit

---

## 📚 FULL DOCS

- **Complete Guide:** `docs/project-management/SIDE-PROJECTS-STRUCTURE.md`
- **Quick Start:** `docs/project-management/SIDE-PROJECTS-QUICK-START.md`

---

**Consistent naming. Clean organization. Daily shipping.** 🎯

