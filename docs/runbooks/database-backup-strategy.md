# Database Backup & Branching Strategy

Protection against data loss and safe testing environment.

## 🎯 Overview

Neon PostgreSQL provides:

- **Automatic backups** - Point-in-time recovery
- **Database branching** - Instant database copies for testing
- **Zero-downtime migrations** - Safe schema changes

## 📊 Backup Strategy

### Automatic Backups (Already Enabled)

Neon automatically backs up your database:

- **Frequency**: Continuous (WAL archiving)
- **Retention**: 7 days (free tier) or 30 days (paid)
- **Recovery**: Point-in-time to any second within retention

**Access**: [Neon Console](https://console.neon.tech) → Your Project → Backups

### Manual Snapshot

For extra protection before major changes:

```bash
# Create a Neon branch (instant snapshot)
# Do this via Neon Console:
# 1. Go to https://console.neon.tech
# 2. Select your project
# 3. Click "Branches" in sidebar
# 4. Click "Create Branch"
# 5. Name it: "backup-YYYY-MM-DD" or "pre-migration-X"
```

## 🌳 Database Branching

### What is Branching?

Think of it like git branches, but for your database:

- **Instant creation** - No data copying
- **Isolated testing** - Changes don't affect production
- **Merge or discard** - Keep changes or throw away

### When to Use Branches

✅ **DO use branches for**:

- Testing database migrations
- Experimenting with schema changes
- Testing data transformations
- Debugging production issues
- Performance testing

❌ **DON'T use branches for**:

- Production data (use main branch)
- Long-term storage (they have limits)
- Sharing between team members (use staging)

### Creating a Branch

#### Via Neon Console (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project: `GalaxyCo.ai`
3. Click **"Branches"** in left sidebar
4. Click **"Create Branch"**
5. Configure:
   - **Name**: `test-migration` or `debug-issue-123`
   - **Parent**: `main` (or current branch)
   - **Point in time**: Latest (or specific timestamp)
6. Click **"Create Branch"**

#### Via Neon CLI (Advanced)

```bash
# Install Neon CLI
npm install -g neonctl

# Login
neonctl auth

# Create branch
neonctl branches create --project-id YOUR_PROJECT_ID --name test-migration

# Get connection string
neonctl connection-string --project-id YOUR_PROJECT_ID --branch test-migration
```

### Using a Branch

```bash
# Copy the branch connection string from Neon Console
# Example: postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/dbname

# Use it locally
export DATABASE_URL="postgresql://branch-connection-string"
pnpm dev

# Or create .env.branch file
echo 'DATABASE_URL="postgresql://branch-connection-string"' > apps/web/.env.branch

# Use it
dotenv -e apps/web/.env.branch -- pnpm dev
```

### Testing Migrations on Branch

```bash
# 1. Create branch in Neon Console
# 2. Update DATABASE_URL to branch
export DATABASE_URL="postgresql://branch-url"

# 3. Run migration
cd packages/database
npm run db:migrate

# 4. Verify changes
npm run db:studio

# 5. Test application
cd ../..
pnpm dev

# 6. If successful, apply to main database
# 7. If failed, delete branch and fix migration
```

### Deleting a Branch

When done testing:

1. Go to Neon Console → Branches
2. Find your test branch
3. Click "..." menu → Delete
4. Confirm deletion

**Cost savings**: Branches consume compute time, delete when not needed

## 🔄 Point-in-Time Recovery

### Restoring to Previous State

If you accidentally deleted data or broke something:

1. **Identify the time** before the problem occurred
2. Go to **Neon Console → Backups**
3. Click **"Restore"**
4. Select **timestamp** before the issue
5. Choose:
   - **New branch** (safe, test first)
   - **Replace current** (destructive, be careful!)
6. **Verify** data is correct
7. **Update** production if using new branch

### Example: Undo Accidental Deletion

```bash
# Oh no! Accidentally deleted all workspaces
# Last good state: 2025-01-10 14:30:00

# 1. Go to Neon Console
# 2. Create branch from timestamp: 2025-01-10 14:30:00
# 3. Name it: "recovery-2025-01-10"
# 4. Get connection string
# 5. Verify data is intact:
export DATABASE_URL="recovery-branch-url"
npm run db:studio  # Check data is there

# 6. If correct, promote this branch to main
#    Or copy data back to main branch
```

## 🧪 Testing Strategy

### Before Major Changes

```bash
# 1. Create backup branch
# Name: "pre-migration-add-agents-table"

# 2. Test migration on branch
DATABASE_URL="branch-url" npm run db:migrate

# 3. Run tests on branch
DATABASE_URL="branch-url" pnpm test

# 4. If successful, apply to main
DATABASE_URL="production-url" npm run db:migrate

# 5. Delete test branch
```

### Rollback Plan

Every migration should have a rollback documented:

```sql
-- Migration: Add agents table
-- Rollback: Drop agents table

-- Up
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

-- Down (Rollback)
DROP TABLE agents;
```

## 📝 Backup Checklist

### Before Major Changes

- [ ] Create Neon branch: `backup-YYYY-MM-DD`
- [ ] Document what you're changing
- [ ] Test changes on branch first
- [ ] Have rollback plan ready
- [ ] Notify team (if applicable)

### After Major Changes

- [ ] Verify changes worked
- [ ] Monitor for errors (30 minutes)
- [ ] Delete test branches
- [ ] Update documentation
- [ ] Document any issues

## 🚨 Emergency Recovery

### Production Database Corrupted

```bash
# 1. STOP - Don't make more changes
# 2. Identify last known good state
# 3. Create recovery branch from that timestamp
# 4. Verify recovery branch has correct data
# 5. Promote recovery branch to production
# 6. Update all DATABASE_URLs
# 7. Redeploy applications
# 8. Monitor for issues
```

### Accidental Data Deletion

```bash
# 1. Find deletion timestamp
# 2. Create branch from BEFORE deletion
# 3. Extract deleted data:
psql $RECOVERY_BRANCH_URL -c "COPY deleted_table TO STDOUT CSV" > recovery.csv

# 4. Import back to production:
psql $PRODUCTION_URL -c "COPY deleted_table FROM STDIN CSV" < recovery.csv

# 5. Verify data restored
# 6. Delete recovery branch
```

## 🔒 Security Best Practices

### DO ✅

- Create branches before risky operations
- Test migrations on branches first
- Keep backups for 30 days (upgrade Neon if needed)
- Document rollback procedures
- Delete unused branches

### DON'T ❌

- Test directly on production database
- Skip testing migrations
- Keep sensitive data in long-lived branches
- Share branch connection strings in public channels
- Forget to delete test branches

## 📊 Monitoring

### What to Watch

1. **Neon Console → Monitoring**:
   - Database size
   - Connection count
   - Query performance

2. **After Migrations**:
   - Error logs in Vercel
   - Application performance
   - User-reported issues

3. **Before Running Out of Space**:
   - Set up alerts in Neon Console
   - Monitor database size weekly

## 💰 Cost Management

### Branch Costs

Branches consume:

- **Storage**: Shared with main (no extra cost for data)
- **Compute**: Separate compute time (billed)

**Best practice**: Delete branches after use

### Backup Retention

- **Free tier**: 7 days
- **Pro tier**: 30 days
- **Enterprise**: Custom

**Recommendation**: Upgrade to Pro for critical production apps

## 🛠️ Scripts

### Quick Branch Creation Script

```bash
#!/bin/bash
# scripts/create-db-branch.sh

BRANCH_NAME="test-$(date +%Y%m%d-%H%M%S)"

echo "Creating database branch: $BRANCH_NAME"
echo ""
echo "1. Go to: https://console.neon.tech"
echo "2. Click 'Branches' → 'Create Branch'"
echo "3. Name: $BRANCH_NAME"
echo "4. Click 'Create'"
echo ""
echo "Then copy connection string to .env.branch"
```

## 🔗 Related Documentation

- Database Operations: `docs/runbooks/database-operations.md`
- Troubleshooting: `docs/runbooks/troubleshooting.md`
- Neon Documentation: [https://neon.tech/docs](https://neon.tech/docs)

---

**Remember**: Backups are useless if you don't test restoring them! 🔒
