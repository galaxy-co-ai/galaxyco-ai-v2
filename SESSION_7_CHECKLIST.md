# Session 7 Checklist - Technical Debt Fixes

**Branch**: `pre-phase-9/technical-debt-fixes`  
**Goal**: Fix all critical blockers for Phase 9

---

## Pre-Flight

- [ ] Create new branch from `phase-8/agent-builder-ui`
- [ ] Verify current TypeScript error count: `cd apps/web && pnpm typecheck 2>&1 | grep "error TS" | wc -l`

---

## 1. Fix TypeScript Path Resolution

### 1.1 Database Package Exports
- [ ] Add `exports` field to `packages/database/package.json`
- [ ] Update `packages/database/src/index.ts` with proper exports
- [ ] Test import: `import { agents } from '@galaxyco/database'`

### 1.2 Web App Path Config
- [ ] Update `apps/web/tsconfig.json` with database paths
- [ ] Run typecheck: `cd apps/web && pnpm typecheck 2>&1 | head -20`
- [ ] Verify error count dropped

### 1.3 Fix Remaining Imports
- [ ] Fix all `@/` path imports in affected files
- [ ] Run full typecheck: `cd apps/web && pnpm typecheck`
- [ ] Verify 0 errors

**Commit**: `fix(typescript): resolve path resolution errors`

---

## 2. Fix Implicit Any Types

- [ ] Fix `apps/web/app/agents/page.tsx:232` - add type to `agent` param
- [ ] Fix `components/agents/AdvancedSettings.tsx` - add event types
- [ ] Fix `components/agents/BasicInfoForm.tsx` - add event types
- [ ] Fix `components/agents/ConfigurationForm.tsx` - add event types
- [ ] Run typecheck: `cd apps/web && pnpm typecheck`
- [ ] Verify 0 errors

**Commit**: `fix(typescript): add explicit types to remove implicit any`

---

## 3. Integrate Clerk Authentication

### 3.1 Create Auth Hook
- [ ] Create `apps/web/hooks/use-workspace-auth.ts`
- [ ] Implement `useWorkspaceAuth()` hook with `getAuthHeaders()`

### 3.2 Update Agent Actions
- [ ] Update `apps/web/lib/actions/agent-actions.ts`
- [ ] Replace hardcoded token with Clerk token
- [ ] Make functions use auth hook

### 3.3 Update Components
- [ ] Update `AgentBuilderPage` to use auth hook
- [ ] Update `TestPanel` to use auth hook
- [ ] Update agents list page to use auth hook

**Commit**: `feat(auth): integrate Clerk authentication with workspace context`

---

## 4. Fix Dashboard Progress Tracking

- [ ] Create `apps/web/lib/actions/workspace-stats.ts`
- [ ] Add `getWorkspaceStats()` function with DB query
- [ ] Update `ProgressTracker.tsx` to use real stats
- [ ] Remove TODO comments

**Commit**: `fix(dashboard): connect progress tracker to real data`

---

## 5. Verification

- [ ] Run full typecheck: `cd apps/web && pnpm typecheck`
- [ ] Verify 0 TypeScript errors
- [ ] Run dev server: `cd apps/web && pnpm dev`
- [ ] Test agent builder loads without errors
- [ ] Check browser console for errors

---

## 6. Merge & Handoff

- [ ] Stage all changes: `git add -A`
- [ ] Review changes: `git status`
- [ ] Create final commit if needed
- [ ] Push branch: `git push origin pre-phase-9/technical-debt-fixes`
- [ ] Update session handoff doc

---

**Target**: Complete all items  
**Current Item**: None (starting)
