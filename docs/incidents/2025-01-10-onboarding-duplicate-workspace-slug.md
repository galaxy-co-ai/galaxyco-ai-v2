# Onboarding Failed: Duplicate Workspace Slug Constraint

**Date**: 2025-01-10  
**Duration**: ~2 days (intermittent debugging)  
**Severity**: 🟠 High  
**Category**: 🗄️ Database

---

## Summary

User unable to complete onboarding flow. Clicking "Create My Workspace" resulted in "Failed to complete onboarding" error. Root cause was a duplicate key violation on the `workspaces_slug_unique` constraint from a previous incomplete onboarding attempt.

---

## Impact

- **User Impact**: Could not access the application dashboard, blocked from using the product
- **Developer Impact**: 2 days of intermittent debugging, tried multiple approaches
- **Business Impact**: Delayed progress on core features, frustration with development process

---

## Timeline

| Time | Event |
|------|-------|
| Day 1 | Problem first noticed - "User not found" error |
| Day 1 | Fixed user creation race condition |
| Day 1 | Server kept stopping, "Failed to fetch" errors |
| Day 2 | Server running but still getting "Failed to complete onboarding" |
| Day 2 | **Checked server logs** - found duplicate key violation |
| Day 2 | Created cleanup script, deleted duplicate workspace |
| Day 2 | ✅ **Verified resolution** - onboarding successful |

---

## Root Cause

### What Happened
Previous onboarding attempt partially succeeded:
1. User record was created in database
2. Workspace record was created with slug `dalton-s-founder-ops-workspace`
3. Page failed to redirect or user refreshed/closed browser
4. Subsequent attempts tried to create workspace with same slug
5. Database rejected insert due to unique constraint violation

### Why It Happened
1. **No duplicate detection**: Code didn't check if workspace slug already existed
2. **No cleanup on failure**: Failed onboarding didn't rollback database changes
3. **Poor error messages**: Generic "Failed to complete onboarding" didn't indicate the specific issue
4. **Logs not checked first**: Spent time fixing wrong things before checking actual error logs

### Where It Happened
- **File(s)**: `apps/web/app/api/onboarding/complete/route.ts`
- **Function(s)**: `POST()` handler, workspace insert
- **Line(s)**: L40-57 (workspace insertion)
- **Component**: Backend API + Database

---

## Error Messages

```
DrizzleQueryError: Failed query: insert into "workspaces" (...) values (...)
params: Dalton's Founder Ops Workspace,dalton-s-founder-ops-workspace,{...}

cause: NeonDbError: duplicate key value violates unique constraint "workspaces_slug_unique"
  severity: 'ERROR',
  code: '23505',
  constraint: 'workspaces_slug_unique'
```

### Key Indicators
- Error code: `23505` (Postgres unique violation)
- Stack trace highlights: `duplicate key value violates unique constraint`
- Log patterns: `grep "DrizzleQueryError\|23505\|workspaces_slug_unique"`

---

## Investigation Process

### What We Tried (That Didn't Work)
1. **Fixed "User not found" error** - Added user creation fallback (was helpful but not the main issue)
2. **Restarted dev server multiple times** - Server kept stopping due to process issues
3. **Checked browser/network** - Assumed frontend or connectivity issue
4. **Tried incognito mode** - Thought it might be a session issue

### What We Tried (That Worked)
**Checked the server logs** (`tail -100 /tmp/nextjs-dev.log`) and found the actual database error

### Key Insight
**Always check the server logs first** when getting generic error messages. The frontend only said "Failed to complete onboarding" but the backend logs had the exact error: duplicate key constraint violation.

---

## Solution

### Immediate Fix

Created cleanup script to delete duplicate workspace:

```javascript
// scripts/cleanup-workspace.mjs
const sql = neon(process.env.DATABASE_URL);

// Delete workspace_members first (foreign key constraint)
await sql`
  DELETE FROM workspace_members 
  WHERE workspace_id IN (
    SELECT id FROM workspaces 
    WHERE slug = 'dalton-s-founder-ops-workspace'
  )
`;

// Delete workspace
await sql`
  DELETE FROM workspaces 
  WHERE slug = 'dalton-s-founder-ops-workspace'
`;
```

### Why This Worked
Removed the duplicate workspace record that was blocking new onboarding attempts. Once removed, the unique constraint allowed the new workspace to be created.

---

## Prevention

### Short Term (Implemented Today)
- [x] Created `scripts/cleanup-workspace.mjs` to clear duplicate workspaces
- [x] Documented incident in incident learning system
- [ ] Add better error messages to onboarding endpoint

### Medium Term (This Week)
- [ ] Add duplicate slug detection before insert
- [ ] Implement transaction rollback on onboarding failure
- [ ] Add "Check server logs" step to debugging runbook
- [ ] Create health check for orphaned workspaces

### Long Term (This Month)
- [ ] Implement idempotent onboarding (can retry safely)
- [ ] Add workspace slug regeneration if duplicate found
- [ ] Set up error monitoring (Sentry) to catch DB errors in real-time
- [ ] Create database cleanup job for failed onboarding attempts

---

## Automation Created

### Cleanup Script
**Location**: `scripts/cleanup-workspace.mjs`  
**Purpose**: Manually delete duplicate/orphaned workspaces

```bash
#!/usr/bin/env node
# Deletes workspace by slug to clear duplicates
# Usage: Edit slug in script, then run: node scripts/cleanup-workspace.mjs
```

### Future: Diagnostic Script
**Location**: `scripts/diagnose-workspace-duplicates.sh` (to be created)  
**Purpose**: Check for orphaned workspaces before they cause issues

```bash
#!/usr/bin/env bash
# Lists workspaces without members (potential orphans)
# Usage: ./scripts/diagnose-workspace-duplicates.sh
```

### Health Check Addition
To add to `scripts/health-check.sh`:
- [ ] Check for workspaces without members (orphans)
- [ ] Alert if duplicate slugs somehow exist
- [ ] Warn if workspace created but onboarding not complete

---

## Related Issues

- Related to: Clerk webhook race condition (user not created before onboarding)
- Could lead to: Similar issues with other unique constraints

---

## Learnings

### Technical Lessons
1. **Postgres unique constraints are strict** - No automatic handling of duplicates
2. **Drizzle ORM errors are detailed** - Include constraint names and error codes
3. **Partial transactions can leave orphaned data** - Need proper rollback handling
4. **Clerk webhooks can race with onboarding** - User creation needs fallback

### Process Lessons
1. **Check logs immediately** - Don't spend 2 days guessing, check actual errors first
2. **Error messages should be specific** - "Failed to complete onboarding" hides the real issue
3. **Failed operations need cleanup** - Don't leave partial data in database
4. **Document while it's fresh** - Incident details fade from memory quickly

### Questions Raised
- [ ] Should we use database transactions for onboarding?
- [ ] Can we make workspace creation idempotent?
- [ ] Should we add a cleanup cron job?
- [ ] How do we prevent other unique constraint issues?

---

## Action Items

- [ ] Update onboarding endpoint to check for duplicate slugs
- [ ] Add transaction wrapping to onboarding flow
- [ ] Improve error message to show specific DB errors
- [ ] Create automated test for duplicate workspace scenario
- [ ] Add Sentry error tracking for database errors
- [ ] Create runbook: "How to debug failed onboarding"
- [ ] Add to health-check.sh: detect orphaned workspaces

---

## References

- **Error Logs**: `/tmp/nextjs-dev.log` lines showing DrizzleQueryError
- **Fix Script**: `scripts/cleanup-workspace.mjs`
- **API Route**: `apps/web/app/api/onboarding/complete/route.ts`
- **Database Schema**: `packages/database/src/schema.ts` (workspaces table)

---

## Follow-Up

**Review Date**: 2025-01-17 (1 week)  
**Reviewed**: [ ] Yes / [ ] No  
**Recurred**: [ ] Yes / [ ] No  
**Notes**: Check if duplicate workspace issues have occurred again

---

**Documented by**: AI Assistant (Claude)  
**Reviewed by**: Dalton  
**Last Updated**: 2025-01-10
