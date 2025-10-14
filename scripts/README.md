# GalaxyCo.ai Development Scripts

Organized collection of scripts to streamline development, testing, deployment, and maintenance workflows.

---

## 📂 Directory Structure

```
scripts/
├── 🧪 testing/          # Quality assurance and testing scripts
├── 🔐 security/         # Security, secrets, and key management
├── 🗄️  database/         # Database operations and management
├── 📊 monitoring/       # Monitoring, logging, and observability
├── 🛠️  utilities/        # General utility and cleanup scripts
├── 🚀 deployment/       # Deployment and CI/CD scripts
├── 🔧 maintenance/      # Maintenance and upkeep scripts
└── ⚙️  setup/            # Initial setup and configuration
```

---

## 🧪 Testing Scripts

**Location**: `scripts/testing/`

### Health Check
```bash
./scripts/testing/health-check.sh
```
**What it does:**
- Checks Node.js and pnpm versions
- Verifies environment variables are set (masked)
- Validates TypeScript compilation
- Confirms dependencies installed
- Checks database configuration

**When to use:** Before starting development or troubleshooting issues

### Smoke Test
```bash
./scripts/testing/smoke-test.sh
```
**What it does:**
- Runs basic smoke tests on critical features
- Verifies core functionality works
- Quick validation after deployments

### Accessibility Check
```bash
./scripts/testing/accessibility-check.sh
```
**What it does:**
- Scans application for accessibility issues
- Checks WCAG compliance
- Reports a11y violations

### UI Audit
```bash
./scripts/testing/ui-audit.sh
```
**What it does:**
- Analyzes UI for consistency issues
- Checks responsive design
- Validates component usage

### Visual Regression
```bash
./scripts/testing/visual-regression.sh
```
**What it does:**
- Takes screenshots of key pages
- Compares against baseline images
- Detects unexpected UI changes

---

## 🔐 Security Scripts

**Location**: `scripts/security/`

### API Key Recovery
```bash
./scripts/security/api-key-recovery.sh
```
**What it does:**
- Handles API key rotation and recovery
- Manages compromised key cleanup
- Updates keys across environments

### Clean Git History
```bash
./scripts/security/clean-git-history.sh
```
**What it does:**
- Scans git history for exposed secrets
- Removes sensitive data from history
- Rewrites commits to clean repository

**⚠️ Warning:** Rewrites git history - use with caution!

### Setup Password Manager
```bash
./scripts/security/setup-password-manager.sh
```
**What it does:**
- Configures secure password management
- Sets up 1Password CLI integration
- Initializes secret storage

### Generate Encryption Key
```bash
node ./scripts/security/generate-encryption-key.js
```
**What it does:**
- Generates secure encryption keys
- Creates cryptographically strong keys
- Outputs key in required format

---

## 🗄️ Database Scripts

**Location**: `scripts/database/`

### Open Drizzle Studio
```bash
./scripts/database/open-drizzle-studio.sh
```
**What it does:**
- Starts Drizzle Studio at http://localhost:4983
- Provides visual interface to Postgres database
- Shows tables, relationships, and data
- Allows data inspection and editing

**When to use:** Need to see database contents or verify data

### Seed Database
```bash
ts-node ./scripts/database/seed-database.ts
```
**What it does:**
- Populates database with test data
- Creates sample workspaces, agents, users
- Useful for development and testing

**When to use:** Fresh database setup or testing scenarios

---

## 📊 Monitoring Scripts

**Location**: `scripts/monitoring/`

### Sentry Errors
```bash
./scripts/monitoring/sentry-errors.sh
```
**What it does:**
- Fetches recent errors from Sentry
- Displays error trends and patterns
- Helps identify production issues

### Test Sentry
```bash
node ./scripts/monitoring/test-sentry.js
```
**What it does:**
- Sends test error to Sentry
- Verifies Sentry integration works
- Validates error tracking pipeline

### Monitor Deployment
```bash
./scripts/monitoring/monitor-deployment.sh
```
**What it does:**
- Monitors deployment progress
- Tracks build and deploy status
- Alerts on deployment failures

---

## 🛠️ Utility Scripts

**Location**: `scripts/utilities/`

### Cleanup Workspace
```bash
node ./scripts/utilities/cleanup-workspace.mjs
```
**What it does:**
- Removes node_modules, build artifacts
- Cleans Turbo cache
- Frees up disk space

**When to use:** Fresh install or resolving dependency issues

### Quick Cleanup
```bash
./scripts/utilities/quick-cleanup.sh
```
**What it does:**
- Fast cleanup of temporary files
- Removes logs and cache files
- Lighter version of full workspace cleanup

---

## 🚀 Deployment Scripts

**Location**: `scripts/deployment/`

See `scripts/deployment/README.md` for deployment-specific documentation.

---

## 🔧 Maintenance Scripts

**Location**: `scripts/maintenance/`

See `scripts/maintenance/README.md` for maintenance-specific documentation.

---

## ⚙️ Setup Scripts

**Location**: `scripts/setup/`

See `scripts/setup/README.md` for setup-specific documentation.

---

## 🚦 Quick Start Guide

### First Time Setup
1. Make scripts executable:
   ```bash
   chmod +x scripts/**/*.sh
   ```

2. Run health check:
   ```bash
   ./scripts/testing/health-check.sh
   ```

3. If all checks pass, start development:
   ```bash
   pnpm dev
   ```

### Daily Development Workflow
1. **Morning:** Run health check
   ```bash
   ./scripts/testing/health-check.sh
   ```

2. **Development:** Start dev server + database viewer
   ```bash
   # Terminal 1
   pnpm dev
   
   # Terminal 2
   ./scripts/database/open-drizzle-studio.sh
   ```

3. **Before Commit:** Run tests
   ```bash
   pnpm typecheck && pnpm lint
   ```

---

## 🔍 Finding Scripts

### By Purpose
- **Testing/QA:** → `scripts/testing/`
- **Security/Secrets:** → `scripts/security/`
- **Database:** → `scripts/database/`
- **Monitoring:** → `scripts/monitoring/`
- **Utilities:** → `scripts/utilities/`
- **Deployment:** → `scripts/deployment/`
- **Maintenance:** → `scripts/maintenance/`
- **Setup:** → `scripts/setup/`

### By Frequency of Use
**Daily:**
- `testing/health-check.sh`
- `database/open-drizzle-studio.sh`

**Weekly:**
- `testing/smoke-test.sh`
- `utilities/quick-cleanup.sh`

**As Needed:**
- `security/*` - When managing secrets
- `monitoring/*` - When investigating issues
- `utilities/cleanup-workspace.mjs` - When troubleshooting builds

---

## 🛠️ Troubleshooting

### Script Permission Errors
```bash
chmod +x scripts/**/*.sh
```

### TypeScript Errors
```bash
cd apps/web
pnpm typecheck
```

### Missing Environment Variables
1. Copy example: `cp apps/web/.env.example apps/web/.env.local`
2. Fill in required values
3. Run health check again

### Database Connection Issues
1. Verify `DATABASE_URL` in `.env.local`
2. Check Neon dashboard for database status
3. Run: `./scripts/database/open-drizzle-studio.sh`

---

## ➕ Adding New Scripts

When creating new scripts:

1. **Choose correct directory** based on purpose
2. **Follow naming convention:** `kebab-case.sh` or `.js`/`.ts`
3. **Make executable:** `chmod +x scripts/category/your-script.sh`
4. **Add documentation** to this README
5. **Include error handling** (see existing scripts as templates)
6. **Add help text** with `--help` flag

### Script Template (Bash)
```bash
#!/bin/bash
# Description: What this script does
# Usage: ./scripts/category/script-name.sh [options]

set -e  # Exit on error

# Your script logic here
```

### Script Template (Node.js)
```javascript
#!/usr/bin/env node
// Description: What this script does
// Usage: node ./scripts/category/script-name.js [options]

process.on('unhandledRejection', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Your script logic here
```

---

## 📋 Script Maintenance

### Regular Updates
- Review scripts quarterly for relevance
- Update documentation when scripts change
- Test scripts after dependency upgrades
- Archive unused scripts to `scripts/archive/`

### Deprecation Process
1. Mark script as deprecated in README
2. Add deprecation warning to script itself
3. Wait 1 month before removing
4. Move to `scripts/archive/` with date

---

**Last Updated:** October 14, 2025  
**Maintained By:** Development Team  
**Questions?** See `docs/reference/DEV_COMMAND_CENTER.md`
