# 🟢 Backend Systems Agent - Phase 1 Kickoff

**Agent:** Backend Systems  
**Phase:** Phase 1 - Critical Backend Fixes  
**Date:** November 3, 2025  
**Priority:** 🔴 CRITICAL - Production Blocker  
**Status:** 🟢 Ready to Execute  
**Estimated Duration:** 4-6 hours  
**Success Criteria:** Email sending works end-to-end

---

## 🎯 Mission Objective

**Fix critical backend issues preventing email sending from working end-to-end.**

**Current State:**

- ✅ Gmail OAuth flow completes successfully
- ❌ OAuth tokens not saved to database after callback
- ❌ Integration status API returns 401 (Clerk auth issue)
- ❌ Workflow execution returns 500 (no tokens in database)
- ❌ Email sending fails silently

**Target State:**

- ✅ OAuth callback saves tokens + integration to database
- ✅ Integration status API returns authenticated data
- ✅ Workflow execution retrieves tokens successfully
- ✅ Email arrives in recipient inbox
- ✅ 0 server errors in logs

---

## 📚 Context Files to Read First

**CRITICAL - Read these before starting:**

1. **`.cursor/STRATEGIC-COMPLETION-PLAN.md`** (Phase 1 section)
   - Contains detailed implementation code for OAuth callback
   - Step-by-step debugging approaches
   - Multiple fallback strategies

2. **`.cursor/PHASE-1-HANDOFF.md`**
   - Complete Phase 1 context from Director
   - Timeline and success criteria
   - Agent coordination details

3. **`.cursor/agents/state/quality-testing/SESSION-CHECKPOINT-FINAL-NOV-3.md`**
   - Quality Agent's findings on OAuth flow
   - Specific error patterns identified
   - Test results and observations

4. **`apps/web/app/api/auth/oauth/google/callback/route.ts`**
   - Current OAuth callback implementation
   - **TODO:** Inspect why tokens aren't being saved

5. **`packages/database/schema/`** (integrations, oauth_tokens tables)
   - Database schema reference
   - Table structure and relationships
   - Required fields for inserts

6. **`.cursor/context/backend-systems-context.md`**
   - Your role, scope, and patterns
   - Multi-tenant security requirements
   - Server Actions vs API routes guidance

---

## 🔧 Phase 1 Tasks (4 Critical Fixes)

### Task 1: OAuth Callback Data Persistence (2-3 hours)

**Priority:** 🔴 CRITICAL  
**Status:** 🟡 Not Started

**Problem:**

- OAuth flow completes successfully
- Tokens received from Google
- But tokens/integrations NOT saved to database
- Workflow execution fails because no tokens exist

**Investigation Steps:**

1. Read current OAuth callback implementation
2. Check database schema (integrations, oauth_tokens tables)
3. Verify migrations have run
4. Check for silent errors in callback handler
5. Add comprehensive error logging

**Implementation:**
The Strategic Completion Plan provides detailed code. Key points:

```typescript
// apps/web/app/api/auth/oauth/google/callback/route.ts

// 1. Exchange code for tokens
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/oauth/google/callback`,
    grant_type: 'authorization_code',
  }),
});

// 2. Get user info from Google
const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
});

// 3. Save integration to database
const [integration] = await db
  .insert(integrations)
  .values({
    userId: decodedState.userId,
    workspaceId: decodedState.workspaceId,
    provider: 'google',
    type: decodedState.integrationType, // 'gmail' or 'calendar'
    status: 'active',
    email: userInfo.email,
    displayName: userInfo.name,
    providerAccountId: userInfo.id,
  })
  .returning();

// 4. Save OAuth tokens (CRITICAL - currently missing!)
await db.insert(oauthTokens).values({
  integrationId: integration.id,
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
  expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
  scope: tokens.scope,
  tokenType: 'Bearer',
});
```

**Verification:**

```sql
-- After OAuth completes, run these queries:
SELECT * FROM integrations WHERE user_id = '[userId]' AND type = 'gmail';
SELECT * FROM oauth_tokens WHERE integration_id = '[integrationId]';

-- Should return rows with actual data
```

**Acceptance Criteria:**

- [ ] OAuth callback saves integration record to database
- [ ] OAuth callback saves oauth_tokens record to database
- [ ] Database queries confirm data exists after OAuth
- [ ] Error logging shows no failures
- [ ] Integration status reflects "connected" state

---

### Task 2: Clerk Auth in API Routes (1 hour)

**Priority:** 🔴 CRITICAL  
**Status:** 🟡 Not Started

**Problem:**

- `auth()` from Clerk returns `{userId: null, orgId: null}`
- Integration status API returns 401 Unauthorized
- Unable to retrieve authenticated user context

**Solutions to Try (in order):**

**Option 1: Use `currentUser()` instead of `auth()`**

```typescript
import { currentUser } from '@clerk/nextjs/server';

const user = await currentUser();
const userId = user?.id;
const orgId = user?.publicMetadata?.orgId || user?.organizationMemberships?.[0]?.organization.id;
```

**Option 2: Use headers-based auth**

```typescript
const userId = req.headers.get('x-clerk-user-id');
const orgId = req.headers.get('x-clerk-org-id');
```

**Option 3: Fix middleware matcher**
Check `middleware.ts` - may need to exclude API routes from Clerk middleware.

**Files to Fix:**

- `apps/web/app/api/integrations/status/route.ts` (or similar)
- Any API route that uses `auth()` and returns null

**Verification:**

- [ ] API route returns authenticated user data
- [ ] Integration status API returns 200 (not 401)
- [ ] User ID and workspace ID are correctly retrieved
- [ ] No `null` values in auth context

---

### Task 3: Workflow Execution Token Retrieval (1 hour)

**Priority:** 🔴 CRITICAL  
**Status:** 🟡 Not Started

**Problem:**

- Workflow execution returns 500 error
- Error: "No tokens found" or "Integration not found"
- Cannot retrieve OAuth tokens from database

**Root Cause (likely):**

- OAuth callback didn't save tokens (fixed in Task 1)
- Token retrieval query doesn't filter by workspaceId
- Token query uses wrong table/column names

**Investigation:**

1. Find workflow execution endpoint
2. Trace token retrieval logic
3. Verify query filters by workspaceId (multi-tenant security!)
4. Check token expiration handling
5. Add error logging

**Implementation Pattern:**

```typescript
// Retrieve tokens for workflow execution
const [integration] = await db
  .select()
  .from(integrations)
  .where(
    and(
      eq(integrations.userId, userId),
      eq(integrations.workspaceId, workspaceId), // CRITICAL - multi-tenant isolation
      eq(integrations.type, 'gmail'),
      eq(integrations.status, 'active'),
    ),
  );

if (!integration) {
  throw new Error('Integration not found');
}

const [oauthToken] = await db
  .select()
  .from(oauthTokens)
  .where(
    and(
      eq(oauthTokens.integrationId, integration.id),
      // Check token not expired
      gt(oauthTokens.expiresAt, new Date()),
    ),
  );

if (!oauthToken) {
  throw new Error('OAuth token not found or expired');
}

// Use token.accessToken for API calls
```

**Verification:**

- [ ] Workflow execution retrieves tokens successfully
- [ ] Token retrieval filters by workspaceId
- [ ] Error handling for missing/expired tokens
- [ ] Refresh token logic works (if tokens expired)

---

### Task 4: End-to-End Verification (1 hour)

**Priority:** 🔴 CRITICAL  
**Status:** 🟡 Not Started

**Objective:**
Verify complete email sending flow works end-to-end.

**Test Flow:**

1. [ ] Connect Gmail OAuth → Redirects to callback
2. [ ] Check database → Integration record exists
3. [ ] Check database → OAuth tokens record exists
4. [ ] Refresh integrations page → Status shows "Connected"
5. [ ] Integration status API → Returns `{connected: true, email: "..."}`
6. [ ] Create workflow with Gmail action
7. [ ] Execute workflow → Returns `{success: true}`
8. [ ] **Email arrives in dalton@galaxyco.ai inbox** 🎉

**Success Criteria:**

- [ ] All 8 steps pass
- [ ] Email arrives in recipient inbox
- [ ] 0 server errors in logs
- [ ] No console errors in browser

**Coordination with Quality Agent:**

- Quality Agent will perform manual QA
- You provide backend fixes
- Quality Agent verifies end-to-end flow

---

## 🏗️ Architecture Patterns to Follow

### Multi-Tenant Security (CRITICAL)

**ALWAYS filter by workspaceId:**

```typescript
// ✅ CORRECT
const result = await db
  .select()
  .from(table)
  .where(
    and(
      eq(table.id, id),
      eq(table.workspaceId, workspaceId), // REQUIRED!
    ),
  );

// ❌ WRONG - Missing workspaceId filter
const result = await db.select().from(table).where(eq(table.id, id));
```

### Error Handling

**Every async function needs try-catch:**

```typescript
export async function handler() {
  try {
    // ... implementation
  } catch (error) {
    logger.error('[ERROR_CONTEXT]', {
      error: error.message,
      stack: error.stack,
      userId,
      workspaceId,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
```

### User-Friendly Errors

**Never expose technical errors:**

```typescript
// ❌ WRONG
return NextResponse.json({ error: error.message }, { status: 500 });

// ✅ CORRECT
logger.error('Technical error:', error);
return NextResponse.json(
  { error: 'Could not save integration. Please try again.' },
  { status: 500 },
);
```

### Zod Validation

**Always validate external input:**

```typescript
const schema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

const validated = schema.parse({ code, state });
```

---

## 📊 Success Metrics

### Code Quality

- [ ] 0 linting errors
- [ ] 0 type errors
- [ ] 100% multi-tenant isolation (workspaceId filters)
- [ ] 100% error handling (try-catch on all async functions)
- [ ] 100% Zod validation (all external input)

### Functionality

- [ ] OAuth callback saves data to database
- [ ] Integration status API returns authenticated data
- [ ] Workflow execution retrieves tokens
- [ ] Email sends successfully
- [ ] End-to-end flow verified

### Security

- [ ] All queries filter by workspaceId
- [ ] No SQL injection vulnerabilities
- [ ] OAuth tokens stored securely
- [ ] User-friendly error messages (no technical leaks)

---

## 🔄 Coordination with Other Agents

### Quality & Testing Agent 🟣

**Handoff Points:**

- After Task 1-3 complete → Quality Agent verifies end-to-end flow
- Quality Agent reports any remaining issues
- You fix any backend issues found

**Communication:**

- Update handoff file after each task
- Notify Quality Agent when ready for verification

### Frontend Architect Agent 🔵

**Not needed for Phase 1**, but:

- After Phase 1 complete → Frontend can verify integration status UI
- Frontend can test workflow execution UI

---

## 📝 Files to Create/Modify

### Likely Files to Modify

1. `apps/web/app/api/auth/oauth/google/callback/route.ts` - Fix token persistence
2. `apps/web/app/api/integrations/status/route.ts` - Fix Clerk auth
3. `apps/web/app/api/workflows/[id]/execute/route.ts` - Fix token retrieval
4. Any workflow execution endpoints - Verify token retrieval

### Files to Create (if needed)

1. `apps/web/lib/utils/oauth-callback.ts` - Shared OAuth callback logic
2. `apps/web/lib/utils/token-retrieval.ts` - Shared token retrieval logic
3. Tests for OAuth callback (if time permits)

---

## 🚨 Known Issues & Blockers

### Current Blockers

- ❌ OAuth tokens not saved → **YOU ARE FIXING THIS**
- ❌ Clerk auth returns null → **YOU ARE FIXING THIS**
- ❌ Workflow execution fails → **YOU ARE FIXING THIS**

### No Blockers Identified

- ✅ Database schema exists and correct
- ✅ Migrations have run
- ✅ OAuth flow completes (just doesn't save)
- ✅ Google OAuth credentials configured

---

## ✅ Completion Checklist

### Pre-Execution

- [ ] Read all context files listed above
- [ ] Review Strategic Completion Plan Phase 1 section
- [ ] Inspect current OAuth callback implementation
- [ ] Check database schema (integrations, oauth_tokens tables)
- [ ] Verify environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

### Task 1: OAuth Callback

- [ ] Inspect current callback implementation
- [ ] Add database inserts for integration + tokens
- [ ] Add comprehensive error logging
- [ ] Test OAuth flow → Verify database has data
- [ ] Document any issues found

### Task 2: Clerk Auth

- [ ] Try `currentUser()` approach
- [ ] Try headers-based auth (if needed)
- [ ] Fix middleware matcher (if needed)
- [ ] Test integration status API → Returns 200
- [ ] Verify authenticated user data

### Task 3: Workflow Execution

- [ ] Find workflow execution endpoint
- [ ] Fix token retrieval query
- [ ] Add workspaceId filtering (multi-tenant security)
- [ ] Add error logging
- [ ] Test workflow execution → Retrieves tokens

### Task 4: End-to-End Verification

- [ ] Test complete flow manually
- [ ] Verify email arrives in inbox
- [ ] Check server logs for errors
- [ ] Document any remaining issues
- [ ] Hand off to Quality Agent for QA

### Post-Execution

- [ ] Run linting → 0 errors
- [ ] Run TypeScript check → 0 errors
- [ ] Update handoff file with results
- [ ] Notify Quality Agent for verification
- [ ] Document learnings and patterns

---

## 🎯 Expected Outcomes

### Immediate Value

- ✅ Email sending works end-to-end
- ✅ Integration status shows "Connected"
- ✅ Workflow execution succeeds
- ✅ Platform is 100% functional (not just 85%)

### Strategic Value

- ✅ Production blocker removed
- ✅ Foundation for Phase 2 (Marketplace UI)
- ✅ User trust (integrations work reliably)
- ✅ Launch readiness achieved

---

## 💡 Debugging Tips

### If OAuth Callback Fails

1. Check error logs in callback handler
2. Verify Google OAuth credentials in `.env`
3. Check redirect URI matches Google Console
4. Verify database connection works
5. Check for silent errors (try-catch may be swallowing)

### If Clerk Auth Returns Null

1. Try `currentUser()` instead of `auth()`
2. Check middleware matcher excludes API routes
3. Verify Clerk environment variables set
4. Check request headers for Clerk tokens
5. Try headers-based auth as fallback

### If Token Retrieval Fails

1. Verify tokens exist in database (run SQL query)
2. Check token expiration (may need refresh)
3. Verify workspaceId filtering (multi-tenant)
4. Check integration status = 'active'
5. Add detailed error logging

---

## 🚀 Timeline

**Estimated Duration:** 4-6 hours

**Suggested Order:**

1. **Task 1 (2-3h)** - OAuth Callback (most critical)
2. **Task 2 (1h)** - Clerk Auth (blocks other tasks)
3. **Task 3 (1h)** - Workflow Execution (depends on Tasks 1-2)
4. **Task 4 (1h)** - End-to-End Verification (final check)

**Milestones:**

- Hour 1-3: OAuth callback fixed, tokens saved
- Hour 4: Clerk auth fixed, APIs return authenticated data
- Hour 5: Workflow execution fixed, tokens retrieved
- Hour 6: End-to-end verified, email sends successfully

---

## 📋 Post-Phase 1: Sidemail Integration (Phase 2)

**Status:** 🔵 Planned - Waiting for Sidemail account credentials

**Note:** Sidemail integration has been researched and planned. Once account credentials are available, Backend Systems Agent will implement Sidemail as the primary email platform.

**Why Sidemail:**

- Complete email platform (transactional + marketing + automation)
- All-in-one pricing ($14-19/month vs multiple services)
- No-code email editor (perfect for non-technical users)
- Email automation sequences (onboarding, conversion, churn prevention)
- Unlimited contacts (no per-subscriber fees)
- API-first design (easy integration)

**Integration Plan:**

1. Add Sidemail API client (`apps/web/lib/integrations/sidemail/`)
2. Create Server Actions for transactional emails
3. Sync GalaxyCo users to Sidemail contacts (via API)
4. Replace Gmail OAuth for system emails (keep Gmail for user-initiated only)
5. Add email automation sequences (onboarding, trial-to-paid)

**Files to Create (when credentials available):**

- `apps/web/lib/integrations/sidemail/api.ts` - Sidemail API client
- `apps/web/lib/integrations/sidemail/actions.ts` - Server Actions
- `apps/web/lib/integrations/sidemail/automation.ts` - Email sequences
- `apps/web/lib/integrations/sidemail/contact-sync.ts` - User sync to Sidemail

**Environment Variables Needed:**

- `SIDEMAIL_API_KEY` - API key from Sidemail dashboard
- `SIDEMAIL_PROJECT_ID` - Project ID (if applicable)

**Ready to implement:** ✅ Yes, once credentials provided

---

## 📋 Handoff Protocol

### After Completion

Create handoff file: `.cursor/agents/state/backend-systems/phase-1-complete.md`

**Include:**

- Summary of fixes implemented
- Files modified/created
- Verification results
- Any remaining issues
- Next steps for Quality Agent

### For Quality Agent

**What to Test:**

1. OAuth flow completes → Database has data
2. Integration status API → Returns connected: true
3. Workflow execution → Returns success: true
4. Email arrives in inbox

**Files to Reference:**

- OAuth callback: `apps/web/app/api/auth/oauth/google/callback/route.ts`
- Integration status: `apps/web/app/api/integrations/status/route.ts`
- Workflow execution: Workflow execution endpoints

---

## 🎯 Final Notes

**This is a CRITICAL production blocker.**

The platform is 85% complete, but email sending is broken due to these 4 issues. Once fixed, we achieve 100% functionality and can proceed to Phase 2 (Marketplace UI).

**You have:**

- ✅ Detailed implementation code from Strategic Plan
- ✅ Clear success criteria
- ✅ Support from Quality Agent for verification
- ✅ All context files available

**Your mission:** Fix these 4 issues, verify end-to-end, hand off to Quality Agent.

**Ready to execute!** 🚀

---

**Kickoff Created:** November 3, 2025  
**Status:** 🟢 Ready for Execution  
**Agent:** Backend Systems  
**Phase:** Phase 1 - Critical Backend Fixes
