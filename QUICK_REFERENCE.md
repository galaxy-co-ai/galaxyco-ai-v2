---
title: Quick Navigation Reference
type: reference-card
status: active
last_updated: 2025-01-12
---

# 🚀 GalaxyCo.ai Quick Navigation Reference

## Essential Paths

```
README.md                                    # Project overview
docs/README.md                               # Documentation hub
docs/guides/development-setup.md             # Get started
docs/technical/architecture/README.md        # System architecture
docs/status/README.md                        # Current status
docs/reference/README.md                     # Quick lookups
```

## By Role

### Developer
```
docs/guides/development-setup.md
docs/technical/architecture/README.md
docs/technical/api/README.md
docs/technical/database/README.md
```

### Product Manager
```
docs/business/product-strategy.md
docs/business/roadmap.md
docs/status/README.md
docs/status/sprints/
```

### DevOps
```
docs/runbooks/deployment.md
docs/runbooks/monitoring.md
docs/runbooks/incident-response.md
```

## By Task

### Setup
```bash
# Read these in order:
1. README.md
2. docs/guides/development-setup.md
3. docs/reference/environment-variables.md
```

### Build Feature
```bash
1. docs/status/README.md                 # Check current status
2. docs/technical/architecture/README.md # Understand system
3. docs/guides/creating-agents.md        # Build
4. docs/technical/api/README.md          # Integrate
```

### Fix Bug
```bash
1. docs/status/live-issues.md            # Known issues
2. docs/guides/troubleshooting.md        # Common fixes
3. docs/incidents/                       # Similar issues
```

### Deploy
```bash
1. docs/guides/deployment.md             # Overview
2. docs/runbooks/deployment.md           # Step-by-step
3. docs/reference/environment-variables.md # Check config
```

## Quick Searches

```bash
# Find by filename
find docs/ -name "*keyword*"

# Find by content
grep -r "search term" docs/

# Recent updates (last 7 days)
find docs/ -name "*.md" -mtime -7

# List category
ls docs/guides/
ls docs/technical/
ls docs/status/
```

## Documentation Categories

```
docs/
├── guides/           # How-to instructions
├── technical/        # Architecture & APIs
├── runbooks/         # Operations
├── business/         # Strategy
├── status/           # Current state
├── reference/        # Quick lookups
├── incidents/        # Issue reports
├── security/         # Security docs
└── archive/          # Historical
```

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run type-check             # TypeScript check

# Database
npm run db:push                # Push schema
npm run db:migrate             # Run migrations
npm run db:studio              # Open Drizzle Studio

# Testing
npm run test                   # Run tests
npm run lint                   # Lint code
```

## Important Links

- **Live Platform**: https://galaxyco-ai-20.vercel.app/
- **Marketing Site**: https://www.galaxyco.ai/
- **Vercel Project**: galaxyco-ai-platform

## Environment

```bash
Home:    /c/Users/Owner
Project: /c/Users/Owner/workspace/galaxyco-ai-2.0
Shell:   bash 5.2.37
```

## Need Help?

```
1. Check docs/README.md for navigation
2. Search docs/ folder for keywords
3. Ask AI assistant in Warp
4. Review docs/guides/troubleshooting.md
```

---

**Print this**: Keep handy for quick reference  
**Bookmark**: `PROJECT_ORGANIZATION_GUIDE.md` for details

---
*Updated: 2025-01-12*
