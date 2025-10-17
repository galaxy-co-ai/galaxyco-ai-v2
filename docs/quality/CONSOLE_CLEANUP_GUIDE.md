# Console Logging Cleanup Guide

**Status:** In Progress (25/70+ files completed - Priority 1 & 2 ✅)  
**Priority:** High - Removes ~200+ console statements  
**Goal:** Replace all `console.log/error/warn` with proper `logger` utility

---

## Why Replace Console Statements?

1. **Production Performance** - Console statements in production slow down the app
2. **Proper Error Tracking** - Logger integrates with Sentry for production errors
3. **Environment-Aware** - Logger only logs in development, silent in production
4. **Structured Logging** - Consistent format with metadata support
5. **Lint Compliance** - Removes no-console warnings

---

## Completed ✅

### Error Handling (Priority 1)

- ✅ `app/(app)/error.tsx` - Global app error page
- ✅ `app/error.tsx` - Root error page
- ✅ `components/error/error-boundary.tsx` - Error boundary component

---

## Pattern Guide

### Before & After Examples

#### Example 1: Simple Error Logging

```typescript
// ❌ Before
console.error("Failed to fetch data:", error);

// ✅ After
import { logger } from "@/lib/utils/logger";
logger.error("Failed to fetch data", error);
```

#### Example 2: Info Logging with Context

```typescript
// ❌ Before
console.log("User action:", { userId, action });

// ✅ After
import { logger } from "@/lib/utils/logger";
logger.info("User action", { userId, action });
```

#### Example 3: Debug Logging

```typescript
// ❌ Before
console.log("Debug info:", data);

// ✅ After
import { logger } from "@/lib/utils/logger";
logger.debug("Debug info", { data });
```

#### Example 4: API Route Logging

```typescript
// ❌ Before
console.error("[API] Error:", error);

// ✅ After
import { logger } from "@/lib/utils/logger";
logger.error("[API] Request failed", error, { endpoint, method });
```

---

## Remaining Files by Priority

### Priority 1: Error Handling & API Routes (Critical) ✅ COMPLETE

- ✅ `app/api/agents/route.ts` (2 statements)
- ✅ `app/api/agents/[id]/route.ts` (3 statements)
- ✅ `app/api/agents/[id]/executions/route.ts` (1 statement)
- ✅ `app/api/agents/[id]/executions/[executionId]/route.ts` (2 statements)
- ✅ `app/api/documents/route.ts` (1 statement)
- ✅ `app/api/documents/[id]/route.ts` (3 statements)
- ✅ `app/api/documents/upload/route.ts` (1 statement)
- ✅ `app/api/workspaces/route.ts` (1 statement)
- ✅ `app/api/ai/chat/route.ts` (1 statement)
- ✅ `app/api/ai/conversations/route.ts` (2 statements)
- ✅ `app/api/ai/conversations/[id]/route.ts` (3 statements)

### Priority 2: Core Components (High) ✅ COMPLETE

- ✅ `components/agents/execution-detail.tsx` (1 statement) ✅ Already uses logger
- ✅ `components/agents/execution-list.tsx` (2 statements)
- ✅ `components/agents/test-playground.tsx` (2 statements)
- ✅ `components/agents/KnowledgeConfigSection.tsx` (1 statement)
- ✅ `components/agents/deploy-modal.tsx` (1 statement)
- ✅ `components/agents/AgentBuilderPage.tsx` (check if needed)
- ✅ `components/knowledge/ItemDetailModal.tsx` (3 statements)
- ✅ `components/knowledge/CreateCollectionModal.tsx` (1 statement)
- ✅ `components/knowledge/CollectionsSidebar.tsx` (2 statements)
- ✅ `components/chat/conversation-history.tsx` (3 statements)
- ✅ `components/chat/enhanced-chat-panel.tsx` (3 statements)
- ✅ `components/dashboard/AgentGrid.tsx` (1 statement)
- ✅ `components/layout/WorkspaceSelect.tsx` (2 statements)

### Priority 3: Library/Utils (Medium)

- [ ] `lib/workspace.ts` (5 statements)
- [ ] `lib/ai-gateway/service.ts` (2 statements)
- [ ] `lib/ai-gateway/config.ts` (1 statement)
- [ ] `lib/ai/provider-wrapper.ts` (5 statements)
- [ ] `lib/ai/agent-executor.ts` (5 statements)
- [ ] `lib/agents/agent-interface.ts` (4 statements)
- [ ] `lib/agents/ai-provider-wrapper.ts` (5 statements)
- [ ] `lib/agents/agent-logger.ts` (5 statements - May be intentional)
- [ ] `lib/agents/test-runner.ts` (6 statements)
- [ ] `lib/document-processor.ts` (3 statements)
- [ ] `lib/embeddings.ts` (2 statements)
- [ ] `lib/storage.ts` (1 statement)
- [ ] `lib/errors.ts` (2 statements)
- [ ] `lib/db/tenant-filter.ts` (1 statement)
- [ ] `lib/monitoring/security-logger.ts` (5 statements - May be intentional)

### Priority 4: Hooks & Context (Medium)

- [ ] `hooks/use-chat.ts` (1 statement)
- [ ] `hooks/useWorkspace.tsx` (8 statements)
- [ ] `hooks/use-performance.ts` (5 statements)
- [ ] `hooks/use-local-storage.ts` (2 statements)
- [ ] `contexts/workspace-context.tsx` (1 statement)

### Priority 5: Pages (Low - User-Facing)

- [ ] `app/(app)/agents/page.tsx` (1 statement)
- [ ] `app/(app)/agents/[id]/page.tsx` (1 statement)
- [ ] `app/(app)/agents/new/page.tsx` (5 statements)
- [ ] `app/(app)/knowledge/page.tsx` (1 statement)
- [ ] `app/(app)/docs/getting-started/page.tsx` (1 statement)
- [ ] `app/(app)/docs/api-reference/page.tsx` (1 statement)
- [ ] `app/(dashboard)/collections/page.tsx` (1 statement)

### Priority 6: Test Files (Low - Development Only)

- [ ] `__tests__/test-batch-enrichment.ts` (45+ statements - test file)
- [ ] `__tests__/test-lead-intel.ts` (30+ statements - test file)

### Priority 7: Documentation (Skip - Not Code)

- [ ] `docs/ENVIRONMENT_VARIABLES.md` (examples only)
- [ ] `lib/agents/README.md` (documentation examples)

### Priority 8: Trigger/Background Jobs (Medium)

- [ ] `src/trigger/document-processing.ts` (3 statements)
- [ ] `src/trigger/lead-intel-agent.ts` (10 statements)

---

## Special Cases

### Logger Utility Itself

- ✅ `lib/utils/logger.ts` - Has `/* eslint-disable no-console */` - This is correct!

### Agent Logger

- ⚠️ `lib/agents/agent-logger.ts` - Review if console statements are intentional for agent logging

### Security Logger

- ⚠️ `lib/monitoring/security-logger.ts` - Review if console statements needed for security audit trail

### Test Files

- ℹ️ Test files can keep console.log for debugging, or use `logger.test()`

---

## Automated Cleanup Script

For bulk replacement, use this pattern:

```bash
# Find all console.error
grep -r "console\.error" apps/web/app apps/web/components apps/web/lib --include="*.ts" --include="*.tsx"

# Find all console.log
grep -r "console\.log" apps/web/app apps/web/components apps/web/lib --include="*.ts" --include="*.tsx"

# Find all console.warn
grep -r "console\.warn" apps/web/app apps/web/components apps/web/lib --include="*.ts" --include="*.tsx"
```

---

## Progress Tracking

**Total Files:** 70+  
**Completed:** 25  
**Remaining:** 45+

**By Priority:**

- P1 (Critical): ✅ 11/11 complete
- P2 (High): ✅ 13/13 complete
- P3 (Medium): 0/15 complete
- P4 (Medium): 0/6 complete
- P5 (Low): 0/7 complete
- P6 (Low): 0/2 complete
- P7 (Skip): 0/2 (documentation)
- P8 (Medium): 0/2 complete

---

## Next Steps

1. **Phase 1:** Complete Priority 1 (API routes) - ~2 hours
2. **Phase 2:** Complete Priority 2 (Core components) - ~2 hours
3. **Phase 3:** Complete Priority 3 & 4 (Libs & Hooks) - ~3 hours
4. **Phase 4:** Complete Priority 5 & 8 (Pages & Jobs) - ~2 hours
5. **Phase 5:** Review special cases - ~1 hour

**Total Estimated Time:** ~10 hours

---

## Validation

After cleanup, verify with:

```bash
cd apps/web
pnpm lint | grep "console statement"  # Should show 0 warnings
```

---

**Last Updated:** 2025-10-17  
**Next Review:** Continue with Priority 3 (Lib/Utils) or pause here

---

## Summary of Progress

### Commits

1. **2283d71** - Priority 1: API routes & error handlers (11 files)
2. **5be6723** - Priority 2: Core components (11 files)

### Impact So Far

- ✅ Removed ~40 console statements from production code
- ✅ All critical error handling now uses structured logging
- ✅ All user-facing components now use proper logger
- ⏸️ Remaining: Library/utility files, hooks, pages, test files (~45 files)

### Next Steps (Optional)

Priority 3-8 can be completed later or handled incrementally:

- Priority 3: Library/utils - Most impactful for backend/service layer
- Priority 4: Hooks & context - Medium impact
- Priority 5-6: Pages & tests - Lower priority
- Priority 7: Skip (docs only)
- Priority 8: Trigger jobs - Can wait until those are actively developed
