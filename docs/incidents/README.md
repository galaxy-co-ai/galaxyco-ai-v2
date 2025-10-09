# Incident Learning System

This directory contains documented incidents, their resolutions, and preventive measures. Each incident helps us build organizational memory to avoid repeating mistakes.

## Purpose

- **Learn from problems** instead of forgetting them
- **Build searchable knowledge base** of solutions
- **Create preventive measures** automatically
- **Speed up debugging** in the future

## Structure

```
incidents/
├── README.md                          # This file
├── TEMPLATE.md                        # Template for new incidents
├── 2025-01-10-onboarding-duplicate-workspace.md
├── [YYYY-MM-DD-short-description].md
└── index.json                         # Searchable index
```

## How to Document an Incident

### 1. During the Incident
Focus on solving it first. Don't document while firefighting.

### 2. Immediately After Resolution
While it's fresh, create a new incident file:

```bash
# Copy the template
cp docs/incidents/TEMPLATE.md docs/incidents/$(date +%Y-%m-%d)-your-description.md

# Fill it out
# Then commit it
git add docs/incidents/
git commit -m "docs(incidents): add [incident description]"
```

### 3. Weekly Review
Every week, review recent incidents and:
- Extract patterns
- Update preventive measures
- Create automation to prevent recurrence

## Incident Categories

- **🐛 Bug** - Code defects
- **🗄️ Database** - Database issues, migrations, constraints
- **🔐 Auth** - Authentication/authorization issues
- **🚀 Deployment** - Deployment or environment issues
- **⚡ Performance** - Speed or resource problems
- **🔧 Configuration** - Setup or config issues
- **📦 Dependencies** - Package or version conflicts
- **🤔 UX** - User experience or workflow problems

## Severity Levels

- **🔴 Critical** - System down, can't work
- **🟠 High** - Major feature broken, significant blocker
- **🟡 Medium** - Workaround exists, not urgent
- **🟢 Low** - Minor annoyance, cosmetic

## Searching Incidents

```bash
# Search by keyword
grep -r "workspace" docs/incidents/

# Search by category
grep -r "Category: Database" docs/incidents/

# List all critical incidents
grep -r "Severity: 🔴 Critical" docs/incidents/
```

## Automation from Incidents

When we see the same incident twice:
1. Create a diagnostic script
2. Add to health-check.sh
3. Create a cleanup script if applicable
4. Update documentation

## Example Flow

**Incident occurs** → **Solve it** → **Document it** → **Create prevention** → **Never see it again**

---

**Remember**: Every incident is a learning opportunity. Document it well, and we'll never waste time on it again.
