# 🎯 TODO for Next Agent - Phase 3 Remaining Tasks

**Last Updated**: October 29, 2025 22:29 UTC  
**Session**: Task completion and UI fixes  
**Completed This Session**: 4/6 tasks (67%)  
**Remaining**: 2 tasks (~2-4 hours)

---

## ✅ What Was Completed This Session

### Phase 1 Skipped Items (100% Complete)

- ✅ **Task 1.2**: Fix Metadata Warnings
  - Added metadataBase to root layout
  - Commit: `36c6357`
- ✅ **Task 1.3**: Add Sentry Instrumentation
  - Created `apps/web/instrumentation.ts`
  - Created `apps/web/app/global-error.tsx`
  - Enabled instrumentationHook in next.config.js
  - Commit: `f6fb1ef`

### Phase 3 Tasks (50% Complete)

- ✅ **Task 3.2**: Document Detail View
  - Created `/collections/[id]` dynamic route (411 lines)
  - Full metadata display, status badges, content preview
  - Integrated with collections page (documents are clickable)
  - Commit: `b493388`
- ✅ **Task 3.4**: Document Deletion Confirmation
  - Created `apps/web/components/documents/delete-dialog.tsx`
  - Reusable dialog component with proper UI
  - Integrated with document detail page
  - Commit: `b2aa732`

### Bonus Fix

- ✅ **Chat Widget Button**: Fixed to use purple brand color
  - Changed from Tailwind blue to CSS var primary (purple)
  - Commit: `a64fda8`

**All commits pushed to main** ✅

---

## 🚫 BLOCKED: Task 3.3 - AI Feedback UI

**Status**: Cannot complete without user decision on database approach

### The Problem

The TODO specifies storing feedback in an `ai_message_feedback` table, but this table **does not exist** in the database schema (`packages/database/src/schema.ts`).

### Current State

- ✅ Chat message component exists: `apps/web/components/chat/chat-message.tsx`
- ✅ AI messages table exists: `aiMessages` (lines 1079-1122 in schema.ts)
- ❌ No feedback table exists
- ❌ No feedback field in existing tables

### Options for Next Agent

**WAIT for user decision on which approach to take:**

#### Option A: Create New Table (Recommended for Production)

Create a database migration for `ai_message_feedback` table:

```sql
-- packages/database/migrations/YYYYMMDD_create_ai_message_feedback.sql
CREATE TABLE ai_message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative')),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  CONSTRAINT ai_message_feedback_message_user_unique UNIQUE (message_id, user_id)
);

CREATE INDEX ai_message_feedback_message_idx ON ai_message_feedback(message_id);
CREATE INDEX ai_message_feedback_workspace_idx ON ai_message_feedback(workspace_id);
CREATE INDEX ai_message_feedback_user_idx ON ai_message_feedback(user_id);
```

Then add to schema.ts:

```typescript
export const aiMessageFeedback = pgTable(
  "ai_message_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => aiMessages.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedbackType: text("feedback_type").notNull(), // 'positive' | 'negative'
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    messageUserIdx: uniqueIndex("ai_message_feedback_message_user_idx").on(
      table.messageId,
      table.userId,
    ),
    messageIdx: index("ai_message_feedback_message_idx").on(table.messageId),
    workspaceIdx: index("ai_message_feedback_workspace_idx").on(
      table.workspaceId,
    ),
    userIdx: index("ai_message_feedback_user_idx").on(table.userId),
  }),
);
```

**Pros**:

- Proper relational design
- Easy to query and analyze
- Scalable for analytics

**Cons**:

- Requires migration
- More setup time

#### Option B: Store in Existing Metadata (Quick Solution)

Extend the `aiMessages.metadata` field to include feedback:

```typescript
// In chat-message.tsx
const handleFeedback = async (type: "positive" | "negative") => {
  await fetch(`/api/ai/messages/${message.id}/feedback`, {
    method: "PATCH",
    body: JSON.stringify({ feedbackType: type }),
  });
};

// In /api/ai/messages/[id]/feedback/route.ts
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { feedbackType } = await req.json();

  await db
    .update(aiMessages)
    .set({
      metadata: sql`metadata || jsonb_build_object('feedback', ${feedbackType})`,
    })
    .where(eq(aiMessages.id, params.id));
}
```

**Pros**:

- No migration needed
- Quick to implement
- Works immediately

**Cons**:

- Harder to query for analytics
- Not normalized
- Limited to one feedback per message

#### Option C: Skip for Now

Defer this task until database architecture review is complete.

### Files That Need Changes (Once Approach is Decided)

**If Option A (New Table):**

1. Create migration file
2. Update `packages/database/src/schema.ts` - add table definition
3. Run migration: `pnpm db:migrate`
4. Create `apps/web/app/api/ai/feedback/route.ts` - POST endpoint
5. Update `apps/web/components/chat/chat-message.tsx` - add thumbs up/down buttons
6. Add state management for feedback selection

**If Option B (Metadata):**

1. Create `apps/web/app/api/ai/messages/[id]/feedback/route.ts` - PATCH endpoint
2. Update `apps/web/components/chat/chat-message.tsx` - add thumbs up/down buttons
3. Add state management for feedback selection

### Implementation Details (Once Decided)

**UI Component Changes** (`apps/web/components/chat/chat-message.tsx`):

```typescript
// Add to component
const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleFeedback = async (type: 'positive' | 'negative') => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  try {
    const res = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: message.id,
        feedbackType: type,
      }),
    });

    if (!res.ok) throw new Error('Failed to submit feedback');

    setFeedback(type);
    toast.success('Thank you for your feedback!');
  } catch (err) {
    toast.error('Failed to submit feedback');
  } finally {
    setIsSubmitting(false);
  }
};

// Add to JSX (only for assistant messages)
{message.role === 'assistant' && (
  <div className="mt-2 flex gap-1">
    <button
      onClick={() => handleFeedback('positive')}
      disabled={isSubmitting}
      className={cn(
        "p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
        feedback === 'positive' && "bg-green-100 text-green-600 dark:bg-green-900/20"
      )}
      title="Helpful"
    >
      <ThumbsUp className="h-4 w-4" />
    </button>
    <button
      onClick={() => handleFeedback('negative')}
      disabled={isSubmitting}
      className={cn(
        "p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
        feedback === 'negative' && "bg-red-100 text-red-600 dark:bg-red-900/20"
      )}
      title="Not helpful"
    >
      <ThumbsDown className="h-4 w-4" />
    </button>
  </div>
)}
```

**Imports needed**:

```typescript
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
```

---

## ⏳ Task 3.5: Bulk Document Operations

**Estimated Time**: 2-3 hours  
**Priority**: Medium  
**Complexity**: High

### What Needs to Be Built

Add bulk operations to the collections page for managing multiple documents at once.

### Requirements from TODO_REMAINING_TASKS.md

1. **Checkbox Selection System**
   - Add checkbox to each document card (both grid and list views)
   - "Select All" checkbox in header
   - Selection counter ("5 selected")
2. **Bulk Action Toolbar**
   - Shows when items are selected
   - Sticky at top when scrolled
   - Actions: Delete, Move to Category, Add Tags
3. **Bulk Operations**
   - Bulk delete with confirmation
   - Bulk move to category (dropdown selector)
   - Bulk tag addition (tag input)
   - Progress indicator during operations
4. **UI/UX Requirements**
   - Mobile responsive
   - Success/error toast for each action
   - Visual feedback (loading states)
   - Preserve selection state during operations

### Files to Modify

**Main File**: `apps/web/app/(dashboard)/collections/page.tsx`

### Implementation Guide

#### Step 1: Add State Management

```typescript
// Add to component state
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [isProcessing, setIsProcessing] = useState(false);

// Selection helpers
const toggleSelection = (id: string) => {
  const newSelected = new Set(selectedIds);
  if (newSelected.has(id)) {
    newSelected.delete(id);
  } else {
    newSelected.add(id);
  }
  setSelectedIds(newSelected);
};

const selectAll = () => {
  setSelectedIds(new Set(filteredDocuments.map((d) => d.id)));
};

const deselectAll = () => {
  setSelectedIds(new Set());
};

const toggleSelectAll = () => {
  if (selectedIds.size === filteredDocuments.length) {
    deselectAll();
  } else {
    selectAll();
  }
};
```

#### Step 2: Add Bulk Actions Toolbar

Insert after the search/filter section:

```typescript
{selectedIds.size > 0 && (
  <div className="sticky top-0 z-10 mt-4 flex items-center justify-between rounded-lg border bg-primary/10 p-4">
    <div className="flex items-center gap-4">
      <span className="font-medium text-primary">
        {selectedIds.size} selected
      </span>
      <button
        onClick={deselectAll}
        className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        Clear selection
      </button>
    </div>
    <div className="flex gap-2">
      <button
        onClick={handleBulkDelete}
        disabled={isProcessing}
        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete {selectedIds.size}
      </button>
      {/* Add more bulk actions here */}
    </div>
  </div>
)}
```

#### Step 3: Add Checkboxes to Document Cards

**Grid View** (around line 237):

```typescript
<div className="relative">
  <input
    type="checkbox"
    checked={selectedIds.has(doc.id)}
    onChange={(e) => {
      e.stopPropagation();
      toggleSelection(doc.id);
    }}
    className="absolute left-2 top-2 h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary z-10"
  />
  <div
    onClick={() => router.push(`/collections/${doc.id}`)}
    className={cn(
      "group flex cursor-pointer flex-col rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-900",
      selectedIds.has(doc.id) && "ring-2 ring-primary"
    )}
  >
    {/* existing card content */}
  </div>
</div>
```

**List View** (around line 262):

```typescript
<div className="flex items-center gap-4">
  <input
    type="checkbox"
    checked={selectedIds.has(doc.id)}
    onChange={(e) => {
      e.stopPropagation();
      toggleSelection(doc.id);
    }}
    className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary"
  />
  <div
    onClick={() => router.push(`/collections/${doc.id}`)}
    className={cn(
      "flex flex-1 cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-900",
      selectedIds.has(doc.id) && "ring-2 ring-primary"
    )}
  >
    {/* existing list content */}
  </div>
</div>
```

#### Step 4: Implement Bulk Delete

```typescript
const handleBulkDelete = async () => {
  if (
    !confirm(`Delete ${selectedIds.size} documents? This cannot be undone.`)
  ) {
    return;
  }

  setIsProcessing(true);
  let successCount = 0;
  let failCount = 0;

  try {
    // Process deletions sequentially (or in batches)
    for (const id of Array.from(selectedIds)) {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
      }
    }

    // Show results
    if (successCount > 0) {
      toast.success(
        `Deleted ${successCount} document${successCount > 1 ? "s" : ""}`,
      );
    }
    if (failCount > 0) {
      toast.error(
        `Failed to delete ${failCount} document${failCount > 1 ? "s" : ""}`,
      );
    }

    // Clear selection and reload
    setSelectedIds(new Set());
    loadCollections();
  } catch (err) {
    logger.error("Bulk delete error", err);
    toast.error("Failed to delete documents");
  } finally {
    setIsProcessing(false);
  }
};
```

#### Step 5: Add Select All Checkbox

In the header section (around line 123):

```typescript
<div className="flex items-center gap-3">
  <input
    type="checkbox"
    checked={filteredDocuments.length > 0 && selectedIds.size === filteredDocuments.length}
    onChange={toggleSelectAll}
    className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary"
  />
  <div>
    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
      Collections
    </h1>
    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
      {selectedIds.size > 0
        ? `${selectedIds.size} selected`
        : 'Organize your knowledge and documents'}
    </p>
  </div>
</div>
```

### Optional Enhancements (If Time Permits)

1. **Bulk Move to Category**
   - Add dropdown selector for categories
   - PATCH multiple documents with new category
2. **Bulk Tag Addition**
   - Add tag input field
   - PATCH multiple documents to add tags
3. **Progress Indicator**
   - Show progress bar during bulk operations
   - "Processing 3/10 documents..."
4. **Keyboard Shortcuts**
   - Cmd/Ctrl + A for select all
   - Delete key for bulk delete

### Testing Checklist

- [ ] Select individual documents works
- [ ] Select all works
- [ ] Deselect all works
- [ ] Bulk delete works with progress
- [ ] Checkboxes visible in both grid and list views
- [ ] Selection persists when switching views
- [ ] Mobile responsive (checkboxes usable on touch)
- [ ] Toast notifications show for success/error
- [ ] Loading states prevent duplicate actions
- [ ] Selection clears after bulk operations

### API Endpoints (All Exist)

- `DELETE /api/documents/[id]` - Already exists ✅
- `PATCH /api/documents/[id]` - Already exists ✅ (for bulk updates)

No new API endpoints needed!

---

## 📝 Final Notes for Next Agent

### Project Context

- **Branch**: main
- **All previous commits pushed**: Yes ✅
- **Quality gates**: All passing (typecheck, lint, prettier)
- **Database**: Postgres with Drizzle ORM
- **Multi-tenancy**: Always include `workspaceId` in queries

### Key Patterns to Follow

1. **Imports**: Use lucide-react for icons
2. **Styling**: Tailwind + design system CSS variables
3. **State**: React hooks (useState, useEffect)
4. **Toasts**: Use `toast` from "sonner"
5. **Logging**: Use `logger` from "@/lib/utils/logger"
6. **Commit format**: `type(scope): message` (conventional commits)

### Quality Checklist Before Committing

```bash
# Must pass all of these:
pnpm typecheck
pnpm lint
pnpm prettier --write <files>

# Commit will auto-run these via husky
```

### Database Schema Reference

- Location: `packages/database/src/schema.ts`
- Documents table: `knowledgeItems` (lines 777-850)
- Messages table: `aiMessages` (lines 1079-1122)
- Always filter by `workspaceId` for multi-tenancy

### Contact Points

- If database migration needed: **Ask user first**
- If design decisions needed: **Ask user first**
- If breaking changes: **Ask user first**

---

## 🎯 Success Criteria

**Task 3.3 (AI Feedback)**: Complete when:

- [ ] User decides on database approach
- [ ] Thumbs up/down buttons visible on AI messages
- [ ] Feedback submits successfully
- [ ] Visual feedback shows selection state
- [ ] Feedback stored in database
- [ ] All quality gates pass

**Task 3.5 (Bulk Operations)**: Complete when:

- [ ] Checkboxes on all document cards
- [ ] Select all/deselect all works
- [ ] Bulk delete works with confirmation
- [ ] Selection state management works
- [ ] Mobile responsive
- [ ] All quality gates pass
- [ ] Commit follows format: `feat(web): add bulk document operations with progress tracking`

---

**Good luck! The codebase is in excellent shape. You have everything you need.** 🚀
