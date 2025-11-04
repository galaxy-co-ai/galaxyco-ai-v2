# 🧪 Testing Quick Reference Guide

**Last Updated:** November 2, 2025  
**For:** Developers and Quality & Testing Agent

---

## 🚀 Quick Start

### Run All Tests

```bash
# From project root
pnpm test              # Unit tests
pnpm test:smoke        # Smoke tests
pnpm e2e              # E2E tests
pnpm test:integration # Integration tests
```

### Run Specific Test Files

```bash
# Unit tests
pnpm test apps/web/tests/integration/agents-api.test.ts

# E2E tests
pnpm e2e tests/e2e/dashboard.spec.ts

# Integration tests
pnpm test:integration apps/web/tests/integration/server-actions.test.ts
```

---

## 📁 Test File Locations

### E2E Tests (Playwright)

```
tests/e2e/
  ├── dashboard.spec.ts
  ├── agent-creation.spec.ts
  ├── agent-execution.spec.ts
  ├── analytics-agents.spec.ts
  ├── crm-pages.spec.ts
  ├── settings-pages.spec.ts
  ├── onboarding-flow.spec.ts
  ├── document-upload.spec.ts
  └── admin-library-pages.spec.ts
```

### Integration Tests (Vitest)

```
apps/web/tests/integration/
  ├── api.test.ts                 # AI workflow routes
  ├── agents-api.test.ts          # Agent API routes (NEW)
  ├── server-actions.test.ts      # Server actions (NEW)
  └── tenant-isolation.spec.ts    # Database isolation
```

### Unit Tests (Vitest)

```
apps/web/tests/unit/
apps/web/tests/component/
apps/web/components/ui/__tests__/
packages/agents-core/tests/
```

### Smoke Tests (Playwright)

```
tests/smoke/
  ├── critical-paths.spec.ts     # Fixed!
  └── production.spec.ts
```

### Accessibility Tests (Playwright)

```
tests/accessibility/
  └── wcag-compliance.spec.ts
```

---

## 🛠️ Test Utilities

### Using Test Helpers

```typescript
import {
  createTestUser,
  createTestWorkspace,
  createTestAgent,
  cleanupTestData,
  authenticatedFetch,
} from '@/tests/utils/test-helpers';

// Create test data
const user = await createTestUser();
const workspace = await createTestWorkspace(user.id);
const agent = await createTestAgent(workspace.id, user.id);

// Cleanup
await cleanupTestData({
  userIds: [user.id],
  workspaceIds: [workspace.id],
  agentIds: [agent.id],
});

// Make authenticated request
const response = await authenticatedFetch('/api/agents', {
  method: 'POST',
  workspaceId: workspace.id,
  body: JSON.stringify({ name: 'Test Agent' }),
});
```

---

## 📝 Writing New Tests

### API Route Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { authenticatedFetch, createTestUser, createTestWorkspace } from '../utils/test-helpers';

describe('API Route - /api/feature', () => {
  it('should require authentication', async () => {
    const response = await fetch('/api/feature');
    expect(response.status).toBe(401);
  });

  it('should work with authentication', async () => {
    const user = await createTestUser();
    const workspace = await createTestWorkspace(user.id);

    const response = await authenticatedFetch('/api/feature', {
      workspaceId: workspace.id,
    });

    expect(response.status).toBe(200);
  });
});
```

### Server Action Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as actions from '@/lib/actions/feature-actions';

// Mock fetch
global.fetch = vi.fn();

describe('Server Actions - Feature Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle success', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await actions.someAction();
    expect(result.success).toBe(true);
  });
});
```

---

## 🎯 Testing Patterns

### Authentication Testing

- Always test unauthenticated access (should return 401)
- Test authenticated access with valid workspace
- Test cross-workspace access (should return 403)

### Error Handling Testing

- Test validation errors (400)
- Test authorization errors (403)
- Test not found errors (404)
- Test server errors (500)

### Data Testing

- Test CRUD operations
- Test data validation
- Test data transformation
- Test edge cases (empty data, large data, etc.)

---

## 📊 Coverage Goals

### Current Coverage: ~15%

- E2E Tests: ✅ Good
- Unit Tests (UI): ✅ Good
- Unit Tests (Business): ❌ 0%
- API Routes: ❌ <5%
- Server Actions: ❌ 0%

### Target Coverage: 80%+

- Focus on API routes first (highest impact)
- Then server actions
- Then business logic

---

## 🐛 Common Issues

### Issue: Tests failing due to auth

**Solution:** Use `authenticatedFetch` helper or mock Clerk auth

### Issue: Tests failing due to database state

**Solution:** Use `createTestUser`, `createTestWorkspace` helpers and cleanup after tests

### Issue: Tests timing out

**Solution:** Increase timeout in test config or use `wait()` helper

### Issue: CORS errors in tests

**Solution:** Already filtered in smoke tests, shouldn't affect other tests

---

## 📚 Resources

- **Test Audit Report:** `.cursor/agents/state/quality-testing/TESTING-AUDIT-REPORT.md`
- **Improvement Plan:** `.cursor/agents/state/quality-testing/TEST-IMPROVEMENT-PLAN.md`
- **Test Utilities:** `apps/web/tests/utils/test-helpers.ts`

---

**Questions?** Check the test audit report or improvement plan for detailed information.
