# Documentation Organization Plan

## Current State
- **154 markdown files** scattered across the project
- **17 files in root** directory (should only have README.md and WARP.md)
- Multiple duplicate/outdated completion summaries
- Unclear navigation and document relationships

## Proposed Structure

```
galaxyco-ai-2.0/
├── README.md                          # Main project overview
├── WARP.md                            # AI collaboration rules
│
├── docs/
│   ├── README.md                      # Documentation hub (NEW)
│   │
│   ├── 📘 guides/                     # User-facing guides (NEW)
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   ├── development-setup.md
│   │   ├── deployment-guide.md
│   │   └── testing-guide.md
│   │
│   ├── 🔧 technical/                  # Technical documentation
│   │   ├── README.md
│   │   ├── architecture/
│   │   ├── api/
│   │   ├── database/
│   │   └── agents/
│   │
│   ├── 📋 runbooks/                   # Operational procedures
│   │   ├── README.md
│   │   ├── deployment.md
│   │   ├── database-operations.md
│   │   ├── troubleshooting.md
│   │   └── monitoring.md
│   │
│   ├── 🚨 incidents/                  # Incident reports
│   │   ├── README.md
│   │   ├── TEMPLATE.md
│   │   └── [dated incidents]
│   │
│   ├── 🔐 security/                   # Security documentation
│   │   ├── README.md
│   │   ├── api-key-management.md
│   │   ├── password-vault.md
│   │   └── best-practices.md
│   │
│   ├── 💼 business/                   # Business documents
│   │   ├── README.md
│   │   ├── strategy/
│   │   ├── positioning/
│   │   └── marketplace/
│   │
│   ├── 📊 planning/                   # Project planning
│   │   ├── README.md
│   │   ├── roadmap.md
│   │   ├── sprints/
│   │   └── status/
│   │
│   ├── 🎯 status/                     # Current status (NEW)
│   │   ├── README.md
│   │   ├── current-sprint.md
│   │   ├── recent-changes.md
│   │   └── next-priorities.md
│   │
│   ├── 📦 archive/                    # Archived docs
│   │   ├── README.md
│   │   ├── 2025-10/                   # Monthly archives
│   │   ├── completed-phases/
│   │   └── legacy/
│   │
│   └── 🔍 reference/                  # Quick reference (NEW)
│       ├── README.md
│       ├── commands.md
│       ├── conventions.md
│       └── troubleshooting.md
│
└── scripts/                           # Utility scripts
    └── docs/
        ├── organize-docs.sh
        └── archive-old-docs.sh
```

## Organization Rules

### Root Directory
**KEEP:**
- `README.md` - Main project overview
- `WARP.md` - AI collaboration rules
- `package.json`, `tsconfig.json`, etc. - Config files

**MOVE TO docs/status/:**
- `TECH_STACK_IMPROVEMENTS.md`
- `IMPLEMENTATION_SUMMARY.md`
- `API_KEY_RECOVERY_SUMMARY.md`
- `PASSWORD_VAULT_SETUP_COMPLETE.md`

**MOVE TO docs/archive/2025-10/:**
- `COMPLETION_PLAN.md`
- `DEPLOYMENT_SUCCESS.md`
- `DEPLOYMENT_VALIDATION.md`
- `SESSION_RECAP.md`
- `SENTRY_ACTIVATED.md`
- `TESTING_NOW.md`
- `UI_TRANSFORMATION_COMPLETE.md`
- `UX_IMPROVEMENT_SUMMARY.md`
- `PRODUCTION_TESTING_GUIDE.md`

**CONSOLIDATE:**
- Multiple session handoffs → Single `docs/status/session-history.md`
- Multiple completion summaries → Single `docs/status/completed-milestones.md`

### Documentation Categories

#### 1. Guides (docs/guides/)
- **Purpose:** Step-by-step instructions for common tasks
- **Audience:** Developers, new team members
- **Content:** Getting started, setup, workflows

#### 2. Technical (docs/technical/)
- **Purpose:** Deep technical documentation
- **Audience:** Developers working on specific features
- **Content:** Architecture, API specs, database schema

#### 3. Runbooks (docs/runbooks/)
- **Purpose:** Operational procedures
- **Audience:** On-call engineers, ops team
- **Content:** Deployment, troubleshooting, incident response

#### 4. Status (docs/status/) **NEW**
- **Purpose:** Current project state
- **Audience:** Team members, stakeholders
- **Content:** Sprint status, recent changes, priorities

#### 5. Archive (docs/archive/)
- **Purpose:** Historical reference
- **Audience:** Anyone researching past decisions
- **Content:** Completed phases, old summaries, legacy docs

#### 6. Reference (docs/reference/) **NEW**
- **Purpose:** Quick lookup
- **Audience:** Everyone
- **Content:** Commands, conventions, quick troubleshooting

## File Naming Conventions

### Use Kebab-Case
- ✅ `getting-started.md`
- ✅ `api-key-management.md`
- ❌ `Getting_Started.md`
- ❌ `API_KEY_MANAGEMENT.md`

### Be Descriptive
- ✅ `deploy-to-production.md`
- ✅ `fix-database-connection-issues.md`
- ❌ `deploy.md`
- ❌ `fix.md`

### Date-Based for Time-Sensitive Docs
- ✅ `2025-10-12-api-key-incident.md`
- ✅ `2025-10-sprint-summary.md`

## Metadata Standards

Every document should start with:

```markdown
---
title: Document Title
category: guides | technical | runbooks | etc.
status: draft | review | active | archived
last_updated: 2025-10-12
author: [Your Name/AI]
related: [list of related doc filenames]
---

# Document Title

Brief description...
```

## Archive Strategy

### When to Archive
- Completed phases/sprints (after 1 week)
- Superseded documentation
- Old completion summaries (after 2 weeks)
- Outdated guides (when replaced)

### Archive Organization
```
docs/archive/
├── 2025-10/              # Current month
├── 2025-09/              # Previous months
├── completed-phases/     # Phase completion docs
└── legacy/               # Very old docs (pre-2025)
```

## Navigation Strategy

### 1. Master README (docs/README.md)
- Quick links to all major sections
- "Getting Started" for new users
- "Quick Reference" for common tasks

### 2. Category READMEs
- Each subdirectory has README.md
- Lists all docs in that category
- Links to related categories

### 3. Breadcrumbs
Every doc should have:
```markdown
📍 **Navigation:** [Home](../README.md) > [Guides](./README.md) > Getting Started
```

### 4. Cross-References
Use relative links:
```markdown
See also: [Deployment Guide](../runbooks/deployment.md)
```

## Implementation Steps

1. **Create new directory structure**
2. **Move root-level docs to appropriate locations**
3. **Create master README and category READMEs**
4. **Archive old/completed docs**
5. **Update all cross-references**
6. **Create quick-reference guides**
7. **Update WARP.md with new structure**

## Success Criteria

✅ Only README.md and WARP.md in root
✅ Clear category for every document
✅ Easy to find current status
✅ Easy to find how-to guides
✅ Old docs properly archived
✅ Consistent naming and formatting
✅ Working navigation and cross-references

## Benefits

- 🎯 **Find documents faster** - Clear categorization
- 🧹 **Reduced clutter** - Archive old content
- 📚 **Better onboarding** - Clear guides section
- 🔍 **Improved search** - Logical organization
- 🤝 **Team collaboration** - Shared conventions
- 🔄 **Easier maintenance** - Clear ownership

## Timeline

- **Phase 1:** Create structure (10 min)
- **Phase 2:** Move documents (20 min)
- **Phase 3:** Create navigation (15 min)
- **Phase 4:** Update references (15 min)

**Total:** ~1 hour for complete organization
