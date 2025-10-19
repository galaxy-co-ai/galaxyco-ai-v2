# Week 1 Completion Handoff Instructions

**Date**: 2025-10-19  
**Current Progress**: 12/20 pages complete (60%)  
**Remaining Work**: 8 pages to convert  
**Estimated Time**: 2-3 hours

---

## 🎯 Mission

Complete the Week 1 API Integration phase by converting the final 8 pages from mock data to real API endpoints. All infrastructure is ready. Just execute the proven conversion pattern.

## 📊 Current State

**Completed Pages (12/20)**:

1. ✅ Dashboard
2. ✅ Analytics Overview
3. ✅ Analytics Sales
4. ✅ Analytics Marketing
5. ✅ Analytics Outreach
6. ✅ Analytics Time Usage
7. ✅ Analytics Usage
8. ✅ CRM Customers
9. ✅ CRM Contacts
10. ✅ CRM Projects
11. ✅ CRM Prospects
12. ✅ Tasks

**Remaining Pages (8/20)**:

- **Work Items** (3 pages):
  - [ ] Calendar
  - [ ] Inbox
  - [ ] Notifications
- **Business** (3 pages):
  - [ ] Invoices
  - [ ] Campaigns
  - [ ] Emails
- **Automation** (2 pages):
  - [✅] Agents (already done)
  - [❌] Workflows (OUT OF SCOPE - no database table exists)

## 🗂️ Database Schemas

All API endpoints are verified and functional. Here are the exact schemas for each remaining page:

### 1. Calendar Events (`/api/calendar`)

**Table**: `calendarEvents` (line 1491 in schema.ts)

```typescript
interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  location: string | null;
  meetingUrl: string | null;
  startTime: string; // timestamp
  endTime: string; // timestamp
  timezone: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule: string | null;
  createdBy: string;
  attendees: any; // jsonb
  customerId: string | null;
  projectId: string | null;
  tags: string[] | null;
  reminders: any; // jsonb
  createdAt: string;
  updatedAt: string;
}
```

### 2. Inbox Messages (`/api/inbox`)

**Table**: `inboxMessages` (line 1859 in schema.ts)

```typescript
interface InboxMessage {
  id: string;
  workspaceId: string;
  channel: "email" | "sms" | "web" | "api" | "form";
  subject: string;
  body: string;
  status: "unread" | "read" | "archived" | "spam" | "flagged";
  senderId: string | null;
  senderEmail: string | null;
  senderName: string | null;
  recipientIds: any; // jsonb
  threadId: string | null;
  replyToId: string | null;
  metadata: any; // jsonb
  attachments: any; // jsonb
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}
```

### 3. Notifications (`/api/notifications`)

**Table**: `notifications` (line 2008 in schema.ts)

```typescript
interface Notification {
  id: string;
  workspaceId: string;
  userId: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "task_assigned"
    | "task_completed"
    | "project_update"
    | "customer_update"
    | "invoice_paid"
    | "mention"
    | "system";
  title: string;
  message: string;
  actionUrl: string | null;
  actionLabel: string | null;
  metadata: any; // jsonb
  isRead: boolean;
  isDismissed: boolean;
  readAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}
```

### 4. Invoices (`/api/invoices`)

**Table**: `invoices` (line 1556 in schema.ts)

```typescript
interface Invoice {
  id: string;
  workspaceId: string;
  invoiceNumber: string;
  status: "draft" | "pending" | "sent" | "paid" | "overdue" | "cancelled";
  customerId: string;
  projectId: string | null;
  subtotal: number; // cents
  tax: number; // cents
  total: number; // cents
  amountPaid: number; // cents
  currency: string;
  items: any; // jsonb
  issueDate: string;
  dueDate: string;
  paidAt: string | null;
  notes: string | null;
  terms: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**Important**: All monetary values are stored in **cents**. Display with `(value / 100).toFixed(2)`.

### 5. Campaigns (`/api/campaigns`)

**Table**: `campaigns` (line 1626 in schema.ts)

```typescript
interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status:
    | "draft"
    | "scheduled"
    | "active"
    | "paused"
    | "completed"
    | "archived";
  type: "email" | "social" | "ads" | "content";
  segmentId: string | null;
  targetAudience: any; // jsonb
  startDate: string | null;
  endDate: string | null;
  scheduledFor: string | null;
  content: any; // jsonb
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  budget: number | null; // cents
  spent: number | null; // cents
  createdBy: string;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}
```

### 6. Email Threads (`/api/emails`)

**Table**: `emailThreads` (line 1907 in schema.ts)

```typescript
interface EmailThread {
  id: string;
  workspaceId: string;
  subject: string;
  snippet: string;
  messageCount: number;
  participants: any; // jsonb
  isStarred: boolean;
  isRead: boolean;
  folder: "inbox" | "sent" | "drafts" | "trash";
  labels: string[] | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🔧 Conversion Pattern

This is the proven pattern used for all previous pages. Follow it exactly:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
// ... keep all existing UI imports from original page

interface DataType {
  // Copy schema from above exactly
  id: string;
  workspaceId: string;
  // ... other fields
  createdAt: string;
  updatedAt: string;
}

export default function PageName() {
  const { currentWorkspace } = useWorkspace();
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // ... keep any other existing state variables

  useEffect(() => {
    async function fetchData() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/endpoint?workspaceId=${currentWorkspace.id}&limit=100`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    // Keep existing UI structure 100% unchanged
    // Replace mock data array with 'data' state
    // Add conditional rendering for optional fields
  );
}
```

## 📝 Step-by-Step Workflow

### Step 1: Setup

```bash
cd ~/workspace/galaxyco-ai-2.0
git pull origin main
pnpm install
```

### Step 2: Convert Calendar Page

1. Read current page: `apps/web/app/(app)/calendar/page.tsx`
2. Create backup (already created: `page-old-backup.tsx`)
3. Apply conversion pattern using schema above
4. Key points:
   - Use `/api/calendar` endpoint
   - Handle time zones with `new Date(startTime).toLocaleString()`
   - Conditional rendering for `location`, `meetingUrl`
   - Show attendees count from jsonb field
5. Save and test: `pnpm dev` → navigate to `/calendar`

### Step 3: Convert Inbox Page

1. Read current page: `apps/web/app/(app)/inbox/page.tsx`
2. Backup already created
3. Apply conversion pattern
4. Key points:
   - Use `/api/inbox` endpoint
   - Status badge colors: unread (blue), read (gray), flagged (yellow)
   - Conditional rendering for `senderName`, `senderEmail`
   - Filter by status if needed
5. Save and test

### Step 4: Convert Notifications Page

1. Read current page: `apps/web/app/(app)/notifications/page.tsx`
2. Backup already created
3. Apply conversion pattern
4. Key points:
   - Use `/api/notifications` endpoint
   - Filter unread: `data.filter(n => !n.isRead)`
   - Type-based icons (info, success, warning, error)
   - Conditional `actionUrl` button
5. Save and test

### Step 5: Convert Invoices Page

1. Read current page: `apps/web/app/(app)/invoices/page.tsx`
2. Backup already created
3. Apply conversion pattern
4. Key points:
   - Use `/api/invoices` endpoint
   - **CRITICAL**: Display amounts in dollars: `(total / 100).toFixed(2)`
   - Status colors: paid (green), overdue (red), pending (yellow), draft (gray)
   - Format dates: `new Date(dueDate).toLocaleDateString()`
5. Save and test

### Step 6: Convert Campaigns Page

1. Read current page: `apps/web/app/(app)/campaigns/page.tsx`
2. Backup already created
3. Apply conversion pattern
4. Key points:
   - Use `/api/campaigns` endpoint
   - Display budget/spent in dollars: `(budget / 100).toFixed(2)`
   - Calculate metrics: `(openCount / sentCount * 100).toFixed(1)%`
   - Type badges: email, social, ads, content
5. Save and test

### Step 7: Convert Emails Page

1. Read current page: `apps/web/app/(app)/emails/page.tsx`
2. Backup already created
3. Apply conversion pattern
4. Key points:
   - Use `/api/emails` endpoint
   - Show participants from jsonb
   - Format `lastMessageAt` as relative time
   - Conditional star icon if `isStarred`
5. Save and test

### Step 8: Document Workflows as Out of Scope

1. Verify: Workflows page already uses real API (`/api/workflows`)
2. Note: Table does not exist in database, but page should work
3. Add note to documentation that Workflows requires migration

## ✅ Quality Gates

Run before committing:

```bash
pnpm typecheck  # Must show 0 errors
pnpm lint       # 0 errors, 1 warning acceptable in api/agents.controller.ts
pnpm build      # Must succeed
```

## 📦 Commit Strategy

Batch commits for efficiency:

```bash
# Commit work items
git add apps/web/app/(app)/calendar/page.tsx apps/web/app/(app)/inbox/page.tsx apps/web/app/(app)/notifications/page.tsx
git commit -m "feat(web): connect work items pages to real apis (calendar, inbox, notifications)"

# Commit business pages
git add apps/web/app/(app)/invoices/page.tsx apps/web/app/(app)/campaigns/page.tsx apps/web/app/(app)/emails/page.tsx
git commit -m "feat(web): connect business pages to real apis (invoices, campaigns, emails)"

# Update documentation
git add docs/sprints/MASTER_CHECKLIST_IA_REFACTOR.md docs/status/CURRENT_SESSION.md
git commit -m "docs: complete week 1 api integration (19/20 pages, workflows out of scope)"

git push origin main
```

## 📄 Documentation Updates

Update these files when complete:

### `docs/status/CURRENT_SESSION.md`

```markdown
## Phase 1: Week 1 - Core Pages API Integration

**Status**: ✅ COMPLETE  
**Progress**: 19/20 pages complete (95%)  
**Last Updated**: [TIMESTAMP]

### Completed This Session

- [x] Calendar page connected to real API
- [x] Inbox page connected to real API
- [x] Notifications page connected to real API
- [x] Invoices page connected to real API
- [x] Campaigns page connected to real API
- [x] Emails page connected to real API
- [x] All quality gates passed
- [x] Documentation updated

### Workflows Status

**OUT OF SCOPE**: Workflows page requires `workflows` table migration. Currently not in database schema. This will be addressed in Week 2 or Week 3.

### Week 1 Summary

✅ 19/20 pages converted from mock to real data  
✅ All API endpoints functional  
✅ TypeScript: 0 errors  
✅ ESLint: 0 errors (1 acceptable warning)  
✅ Build: Success  
❌ Workflows: Requires database migration

**Next Phase**: Week 2 - Advanced Features & Relationships
```

### `docs/sprints/MASTER_CHECKLIST_IA_REFACTOR.md`

Mark items 4.2-4.7 as complete:

- [x] 4.2 Calendar page
- [x] 4.3 Inbox page
- [x] 4.4 Notifications page
- [x] 5.1 Invoices page
- [x] 5.2 Campaigns page
- [x] 5.3 Emails page
- [❌] 6.2 Workflows (out of scope)

Update status line:

```
Current Status: Phase 1 Week 1 - 95% Complete (19/20 pages)
```

## 🎯 Success Criteria

Week 1 is complete when:

- [x] 19/20 pages fetching real data from APIs
- [x] Zero mock data in these 19 pages
- [x] Loading states on all pages
- [x] Error handling with toast
- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors (1 warning acceptable)
- [x] Build: Success
- [x] All changes committed & pushed
- [x] Documentation updated
- [x] Workflows documented as out of scope

## 🚨 Common Pitfalls

1. **Enum Mismatches**: Database uses `in_progress` but UI may use `in-progress`
   - Solution: Map on display or in API response

2. **Monetary Values**: Always stored in cents
   - Solution: `(value / 100).toFixed(2)` for display

3. **Optional Fields**: Many fields are nullable
   - Solution: Use `field || 'Default'` or conditional rendering

4. **Workspace Context**: Must check `currentWorkspace?.id` before fetching
   - Solution: Early return in useEffect if undefined

5. **JSONB Fields**: Participants, metadata, attendees are objects
   - Solution: Type as `any` and handle carefully in display

## 📊 Progress Tracking

Use this checklist as you work:

- [ ] Step 1: Setup complete
- [ ] Step 2: Calendar page converted
- [ ] Step 3: Inbox page converted
- [ ] Step 4: Notifications page converted
- [ ] Step 5: Invoices page converted
- [ ] Step 6: Campaigns page converted
- [ ] Step 7: Emails page converted
- [ ] Step 8: Workflows documented
- [ ] Quality gates passed
- [ ] Changes committed
- [ ] Documentation updated
- [ ] Changes pushed to main

## 🎉 Final Verification

Before considering Week 1 complete:

1. Start dev server: `pnpm dev`
2. Navigate to each converted page
3. Verify data loads from API
4. Check loading states work
5. Test error handling (disconnect internet)
6. Confirm no TypeScript errors in IDE
7. Run full build: `pnpm build`
8. Review git log: `git log --oneline -10`

---

## 📞 Need Help?

If you encounter issues:

1. **API not returning data**: Check `currentWorkspace?.id` is defined
2. **TypeScript errors**: Verify interface matches schema exactly
3. **Build fails**: Run `pnpm typecheck` to isolate errors
4. **Mock data still showing**: Ensure you removed mock array and using `data` state
5. **Page crashes**: Check for optional field access without conditional rendering

All APIs are tested and working. All schemas are correct. Just follow the pattern.

---

**You've got this! 🚀**

The pattern is proven. The APIs are ready. Just execute systematically and Week 1 will be complete.
