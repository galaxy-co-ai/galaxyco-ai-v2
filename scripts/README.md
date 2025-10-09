# GalaxyCo.ai Development Scripts

Quick access scripts to streamline your development workflow.

## Available Scripts

### 🏥 Health Check
```bash
./scripts/health-check.sh
```
**What it does:**
- Checks Node.js and pnpm versions
- Verifies all required environment variables are set (without revealing values)
- Validates TypeScript compilation
- Confirms dependencies are installed
- Checks database configuration

**When to use:** Before starting development or when troubleshooting issues.

---

### 🗄️ Open Drizzle Studio
```bash
./scripts/open-drizzle-studio.sh
```
**What it does:**
- Starts Drizzle Studio at http://localhost:4983
- Provides visual interface to your Postgres database
- Shows all tables, relationships, and data
- Allows direct data inspection and editing

**When to use:** When you need to see what's in your database or verify data was created correctly.

---

## Quick Start Guide

### First Time Setup
1. Make scripts executable (if needed):
   ```bash
   chmod +x scripts/*.sh
   ```

2. Run health check to verify everything is configured:
   ```bash
   ./scripts/health-check.sh
   ```

3. If all checks pass, start development:
   ```bash
   pnpm dev
   ```

### Daily Development Workflow
1. Run health check:
   ```bash
   ./scripts/health-check.sh
   ```

2. Start dev server (in one terminal):
   ```bash
   pnpm dev
   ```

3. Open database viewer (in another terminal):
   ```bash
   ./scripts/open-drizzle-studio.sh
   ```

---

## Troubleshooting

### Script Permission Errors
If you get "Permission denied" errors:
```bash
chmod +x scripts/*.sh
```

### TypeScript Errors
If health check fails on TypeScript:
```bash
cd apps/web
pnpm typecheck
```
Fix any errors shown, then run health check again.

### Missing Environment Variables
If health check reports missing vars:
1. Open `apps/web/.env.local`
2. Add the missing variable(s)
3. Run health check again

---

## Adding New Scripts

When creating new scripts:
1. Add them to this `/scripts` directory
2. Make them executable: `chmod +x scripts/your-script.sh`
3. Document them in this README
4. Use the health-check script as a template for error handling

---

**Last Updated:** January 10, 2025
