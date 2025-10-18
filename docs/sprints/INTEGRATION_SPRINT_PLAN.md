# 🔗 Integration Sprint Plan - GalaxyCo.ai 2.0

**Sprint Goal**: Connect all 97 pages to real API endpoints and database  
**Current Status**: 90% page completion (97/108) with mock data  
**Target Outcome**: Fully functional platform with real data flow  
**Estimated Duration**: 12-16 hours across multiple sessions  
**Priority**: HIGH - Critical for production readiness

---

## 📊 Current State Assessment

### What We Have

- ✅ 97 pages built with complete UI/UX
- ✅ 48 reusable components
- ✅ Design system 92% complete
- ✅ TypeScript strict mode across all files
- ✅ Database schema with 25+ tables
- ✅ API routes for core features (agents, workflows, documents)
- ✅ Authentication with Clerk
- ✅ Multi-tenant RLS policies

### What We Need

- ⏳ API routes for all resources (customers, projects, invoices, campaigns, etc.)
- ⏳ Data fetching hooks replacing mock data
- ⏳ Real-time loading states
- ⏳ Error handling with user feedback
- ⏳ Optimistic UI updates
- ⏳ Integration tests for all API flows
- ⏳ End-to-end data flow verification

---

## 🎯 Sprint Phases

### **Phase 1: API Routes Foundation** (3-4 hours)

**Goal**: Create/update API routes for all resources

**Resources to Cover**:

1. **Core CRM** (6 routes)
   - `/api/customers` - CRUD for customer management
   - `/api/projects` - Project lifecycle management
   - `/api/contacts` - Contact database operations
   - `/api/tasks` - Task management with assignments
   - `/api/calendar` - Calendar events and scheduling
   - `/api/prospects` - Lead pipeline management

2. **Business Operations** (5 routes)
   - `/api/invoices` - Invoice generation and tracking
   - `/api/campaigns` - Marketing campaign management
   - `/api/segments` - Customer segmentation
   - `/api/exports` - Data export operations
   - `/api/imports` - Bulk data imports

3. **Communication** (4 routes)
   - `/api/inbox` - Unified inbox messages
   - `/api/emails` - Email threading and management
   - `/api/chat` - Real-time chat messages
   - `/api/notifications` - System notifications

4. **Analytics** (6 routes)
   - `/api/analytics/sales` - Sales metrics aggregation
   - `/api/analytics/marketing` - Marketing performance
   - `/api/analytics/outreach` - Outreach effectiveness
   - `/api/analytics/time-usage` - Time tracking analytics
   - `/api/analytics/usage` - Platform usage stats
   - `/api/reports` - Custom report generation

5. **Developer Tools** (4 routes)
   - `/api/api-keys` - API key management
   - `/api/webhooks` - Webhook configuration
   - `/api/audit-log` - Activity logging
   - `/api/playground` - API testing sandbox

6. **Admin** (4 routes)
   - `/api/admin/users` - User management
   - `/api/admin/workspaces` - Workspace administration
   - `/api/admin/analytics` - Admin analytics
   - `/api/admin/settings` - System configuration

**Acceptance Criteria**:

- ✅ All routes follow RESTful conventions
- ✅ Proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ Request validation with Zod schemas
- ✅ Error handling with typed responses
- ✅ Multi-tenant isolation with RLS
- ✅ Rate limiting configured
- ✅ Logging with tenant_id and user_id

**Quality Gates**:

```bash
# API route health check
pnpm typecheck
pnpm lint
pnpm test:api  # API route tests
```

---

### **Phase 2: Database Schema Completion** (2-3 hours)

**Goal**: Ensure all necessary tables exist with proper relationships

**Tables to Verify/Create**:

**Existing Tables** (verify structure):

- ✅ agents
- ✅ workflows
- ✅ documents
- ✅ tenants
- ✅ users
- ✅ contacts
- ✅ tasks
- ✅ calendar_events

**New Tables Needed**:

1. `customers` - Customer records with metadata
2. `projects` - Project tracking with status
3. `prospects` - Lead pipeline management
4. `invoices` - Invoice generation and tracking
5. `campaigns` - Marketing campaigns
6. `segments` - Customer segmentation rules
7. `exports` - Export job tracking
8. `imports` - Import job tracking
9. `inbox_messages` - Unified inbox
10. `email_threads` - Email conversations
11. `chat_messages` - Real-time chat
12. `notifications` - System notifications
13. `api_keys` - API key management
14. `webhooks` - Webhook configurations
15. `webhook_deliveries` - Webhook delivery logs
16. `audit_logs` - Activity audit trail

**Migration Tasks**:

```bash
# Create migration files
pnpm db:migration:create add_crm_tables
pnpm db:migration:create add_business_tables
pnpm db:migration:create add_communication_tables
pnpm db:migration:create add_developer_tables

# Apply migrations
pnpm db:migrate

# Generate types
pnpm db:generate
```

**Schema Requirements**:

- ✅ All tables have `tenant_id` for multi-tenancy
- ✅ Timestamps: `created_at`, `updated_at`
- ✅ Soft deletes: `deleted_at` where appropriate
- ✅ Foreign keys with proper constraints
- ✅ Indexes on frequently queried columns
- ✅ RLS policies for tenant isolation

---

### **Phase 3: Data Fetching Layer** (3-4 hours)

**Goal**: Replace mock data with real API calls using React Server Components and hooks

**Pattern to Follow**:

```typescript
// Server Component (default in Next.js 14 app dir)
async function CustomersPage() {
  const customers = await getCustomers(); // Direct DB call or API
  return <CustomersList customers={customers} />;
}

// Client Component with hooks (when interactivity needed)
'use client';
function CustomersList({ customers: initial }) {
  const [customers, setCustomers] = useState(initial);
  // ... interactive logic
}
```

**Pages to Convert** (97 total):

**High Priority** (20 pages):

1. `/dashboard` - Dashboard metrics
2. `/agents` - Agent list with stats
3. `/workflows` - Workflow execution data
4. `/prospects` - Lead pipeline
5. `/contacts` - Contact database
6. `/tasks` - Task list with assignments
7. `/calendar` - Calendar events
8. `/customers` - Customer records
9. `/projects` - Project management
10. `/invoices` - Invoice tracking
11. `/campaigns` - Campaign performance
12. `/segments` - Segment analytics
13. `/analytics/*` - All analytics pages (6)
14. `/inbox` - Message threads
15. `/notifications` - Notification feed

**Medium Priority** (30 pages):

- All mobile pages (`/m/*`) - 12 pages
- All settings pages (`/settings/*`) - 7 pages
- Communication pages - 4 pages
- Admin pages - 5 pages
- Developer tools - 4 pages

**Low Priority** (47 pages):

- Documentation pages
- Help/support pages
- Static informational pages

**Utilities to Create**:

```typescript
// apps/web/lib/api/client.ts
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T>;

// apps/web/hooks/use-query.ts
export function useQuery<T>(key: string, fetcher: () => Promise<T>);

// apps/web/hooks/use-mutation.ts
export function useMutation<T>(mutationFn: (data: unknown) => Promise<T>);
```

---

### **Phase 4: Loading & Error States** (2 hours)

**Goal**: Implement proper async behavior with user feedback

**Components to Use**:

```typescript
// Use existing components
import { Spinner } from '@repo/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/hooks/use-toast';

// Pattern for loading
{isLoading && <Spinner />}

// Pattern for empty
{!data.length && <EmptyState title="No customers" />}

// Pattern for error
{error && toast.error(error.message)}
```

**States to Implement**:

1. **Loading States**
   - Initial page load
   - Pagination loading
   - Form submission
   - File uploads
   - Search queries

2. **Error States**
   - Network errors
   - Validation errors
   - Permission errors
   - Not found errors
   - Rate limit errors

3. **Empty States**
   - No data yet (new users)
   - Filtered results empty
   - Search no results
   - Archived/deleted items

**User Feedback**:

```typescript
// Success actions
toast.success("Customer created successfully");

// Error actions
toast.error("Failed to save changes");

// Info messages
toast.info("Changes saved locally, sync pending");
```

---

### **Phase 5: Optimistic Updates** (2 hours)

**Goal**: Instant UI feedback for better UX

**Pattern**:

```typescript
async function deleteCustomer(id: string) {
  // 1. Optimistic update
  setCustomers((prev) => prev.filter((c) => c.id !== id));

  // 2. API call
  try {
    await api.delete(`/customers/${id}`);
    toast.success("Customer deleted");
  } catch (error) {
    // 3. Rollback on error
    setCustomers((prev) => [...prev, deletedCustomer]);
    toast.error("Failed to delete customer");
  }
}
```

**Actions to Cover**:

- Create operations (add item to list immediately)
- Update operations (update item in list immediately)
- Delete operations (remove item from list immediately)
- Toggle operations (flip boolean immediately)
- Sort/filter operations (instant UI updates)

**Benefits**:

- ⚡ Instant perceived performance
- 🎯 Better user experience
- 🔄 Graceful error recovery
- ✅ Reduced loading spinners

---

### **Phase 6: Integration Testing** (2-3 hours)

**Goal**: Verify all integrations work end-to-end

**Test Coverage**:

1. **API Route Tests** (Vitest)

```typescript
// apps/api/tests/routes/customers.test.ts
describe("GET /api/customers", () => {
  it("returns customers for authenticated user", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });
});
```

2. **E2E Integration Tests** (Playwright)

```typescript
// apps/web/tests/e2e/customers.spec.ts
test("create customer flow", async ({ page }) => {
  await page.goto("/customers");
  await page.click('button:has-text("New Customer")');
  await page.fill('[name="name"]', "Acme Corp");
  await page.click('button:has-text("Save")');
  await expect(page.locator("text=Acme Corp")).toBeVisible();
});
```

3. **Database Integration Tests**

```typescript
// Verify data persists correctly
// Verify relationships work
// Verify RLS policies enforce isolation
```

**Test Scenarios**:

- ✅ Create, read, update, delete operations
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ File uploads
- ✅ Real-time updates
- ✅ Error handling
- ✅ Multi-tenant isolation
- ✅ Permission checks

**Quality Gates**:

```bash
pnpm test:integration  # API integration tests
pnpm test:e2e          # Playwright E2E tests
pnpm test:db           # Database tests
```

---

### **Phase 7: Verification & Polish** (1-2 hours)

**Goal**: Final verification that everything works together

**Verification Checklist**:

1. **Manual Testing**
   - [ ] Sign up new account
   - [ ] Create test data in all major sections
   - [ ] Navigate through all pages
   - [ ] Verify loading states appear/disappear
   - [ ] Trigger errors and verify handling
   - [ ] Test mobile responsive views
   - [ ] Test dark mode

2. **Performance Testing**
   - [ ] Run Lighthouse audits on key pages
   - [ ] Check bundle sizes (target: <200KB first load)
   - [ ] Verify API response times (<200ms p50)
   - [ ] Check database query performance

3. **Security Testing**
   - [ ] Verify RLS policies prevent cross-tenant access
   - [ ] Test API authentication
   - [ ] Validate input sanitization
   - [ ] Check CORS configuration

4. **Browser Testing**
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Mobile Safari
   - [ ] Mobile Chrome

**Final Health Checks**:

```bash
# Code quality
pnpm typecheck
pnpm lint
pnpm format:check

# Testing
pnpm test:run         # All tests
pnpm test:integration # Integration tests
pnpm test:e2e         # E2E tests

# Build
pnpm build

# Database
pnpm db:validate      # Check migrations
```

---

## 🚀 Execution Strategy

### Session-by-Session Breakdown

**Session 1** (3-4 hours): API Routes Foundation

- Create all API routes
- Add request validation
- Implement error handling
- Add tests for API routes

**Session 2** (2-3 hours): Database Schema

- Create migration files
- Apply migrations
- Verify relationships
- Add RLS policies

**Session 3** (3-4 hours): High Priority Pages

- Convert 20 high-priority pages
- Create data fetching utilities
- Implement loading states

**Session 4** (2-3 hours): Medium Priority Pages

- Convert 30 medium-priority pages
- Add error handling
- Implement optimistic updates

**Session 5** (2-3 hours): Integration Testing

- Write API route tests
- Write E2E integration tests
- Verify multi-tenant isolation

**Session 6** (1-2 hours): Verification & Polish

- Manual testing
- Performance audits
- Security checks
- Browser testing

---

## 📋 Success Criteria

### Definition of Done

- [ ] All 97 pages fetch real data from API
- [ ] Zero mock data in production code
- [ ] All API routes tested with >80% coverage
- [ ] E2E tests cover all critical user flows
- [ ] All loading states implemented
- [ ] All error states handled gracefully
- [ ] Optimistic updates for instant feedback
- [ ] Multi-tenant isolation verified
- [ ] Performance targets met (Lighthouse >90)
- [ ] Security audit passing
- [ ] All quality gates green

### Key Metrics

**Before Integration Sprint**:

- Pages: 97/108 (90%)
- Mock data: ~95% of pages
- API routes: ~15 routes
- Integration tests: 2 E2E flows

**After Integration Sprint**:

- Pages: 97/108 (90%) - maintained
- Real data: 100% of pages
- API routes: ~50 routes
- Integration tests: 20+ E2E flows
- Test coverage: >80%

---

## 🔧 Tools & Resources

### Required Tools

- Supabase CLI (database management)
- Postman/Thunder Client (API testing)
- Playwright (E2E testing)
- React DevTools (debugging)
- Network tab (API inspection)

### Documentation References

- `/docs/architecture/api-patterns.md` - API design patterns
- `/docs/architecture/database-schema.md` - Database structure
- `/docs/guides/testing.md` - Testing guidelines
- `/docs/guides/error-handling.md` - Error handling patterns

### Commands

```bash
# Database operations
pnpm db:migration:create <name>
pnpm db:migrate
pnpm db:generate
pnpm db:studio  # Visual database browser

# Testing
pnpm test:api           # API tests
pnpm test:integration   # Integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:ui       # E2E with UI

# Development
pnpm dev               # Start dev server
pnpm db:seed           # Seed test data
pnpm db:reset          # Reset database
```

---

## 🎯 Next Steps for AI Agent

**When starting this sprint**:

1. Read this plan thoroughly
2. Confirm current project state with user
3. Ask which phase to start with (recommend Phase 1)
4. Execute autonomously with quality gates
5. Commit after each phase completion
6. Update progress in CURRENT_SESSION.md
7. Report blockers immediately

**Autonomous execution pattern**:

```
Plan phase → Build → Test → Commit → Move to next
```

**Communication style**:

- Brief progress updates after each phase
- Only ask blocking questions
- Default to action over permission
- Show results, not checklists

---

**End of Integration Sprint Plan**

This plan will transform the UI-complete platform into a fully functional application with real data flow, proper error handling, and production-ready integrations.
