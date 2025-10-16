# GalaxyCo.ai Testing Checklist (Step 17)

**Last Updated:** 2025-10-15  
**Status:** Ready for Testing

## End-to-End Testing Plan

### 1. Document Upload & Processing Flow

#### Upload Test

- [ ] Navigate to `/collections` page
- [ ] Click "Upload Document" button
- [ ] Drag and drop a PDF file
- [ ] Verify progress bar shows 0-100%
- [ ] Verify success message with auto-categorization display
- [ ] Upload multiple files simultaneously (batch test)
- [ ] Try uploading unsupported file type (verify error handling)

#### Processing Verification

```bash
# Check Trigger.dev job status
pnpm --filter web trigger:dev

# Verify document in database
psql $DATABASE_URL -c "SELECT id, title, processing_status FROM documents ORDER BY created_at DESC LIMIT 5;"

# Check document chunks were created
psql $DATABASE_URL -c "SELECT COUNT(*) FROM document_chunks WHERE document_id = '<your-doc-id>';"
```

#### Search Functionality

- [ ] After document processes, go to chat
- [ ] Ask a question related to uploaded document content
- [ ] Verify AI response includes relevant context from document
- [ ] Check response metadata for document sources

---

### 2. Chat Conversation Persistence

#### Create Conversation

- [ ] Open AI Assistant chat panel (click chat widget)
- [ ] Send first message: "What can you help me with?"
- [ ] Verify message appears in chat
- [ ] Refresh page
- [ ] Verify conversation persists

#### Conversation History

- [ ] Send 3-5 messages in conversation
- [ ] Close chat panel
- [ ] Reopen chat panel
- [ ] Verify all messages load correctly
- [ ] Check conversation appears in history (future: sidebar)

#### Title Generation

```bash
# Verify conversation title was auto-generated
psql $DATABASE_URL -c "SELECT id, title, message_count FROM ai_conversations ORDER BY created_at DESC LIMIT 5;"
```

---

### 3. Collections UI Functionality

#### Grid/List Views

- [ ] Verify grid view displays document cards correctly
- [ ] Click list view icon
- [ ] Verify list view shows documents in rows
- [ ] Switch back to grid view
- [ ] Verify smooth transition

#### Search & Filtering

- [ ] Type in search box
- [ ] Verify documents filter in real-time
- [ ] Click category filter (e.g., "Company Info")
- [ ] Verify only matching category documents show
- [ ] Click "All" filter
- [ ] Verify all documents appear again

#### Document Display

- [ ] Verify each document shows:
  - Title
  - Category icon and name
  - File size
  - Upload date
- [ ] Hover over document card
- [ ] Verify hover effects work

---

### 4. Mobile Responsiveness

#### Device Testing

- [ ] Open Chrome DevTools (F12)
- [ ] Select mobile device emulator (375px width)
- [ ] Test collections page on mobile
- [ ] Verify bottom navigation appears
- [ ] Verify "Collections" button works in bottom nav
- [ ] Test upload modal on mobile
- [ ] Verify touch targets are at least 44px
- [ ] Test chat panel on mobile

#### Breakpoints

- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (desktop)
- [ ] Verify layouts adapt appropriately

---

### 5. Accessibility Audit

#### Keyboard Navigation

- [ ] Tab through collections page
- [ ] Verify focus visible on all interactive elements
- [ ] Press Enter/Space on upload button
- [ ] Navigate upload modal with keyboard only
- [ ] Verify Escape key closes modal

#### Screen Reader Testing

```bash
# Install accessibility checker
pnpm --filter web add -D @axe-core/cli

# Run accessibility scan
pnpm --filter web exec axe http://localhost:3000/collections
```

#### Accessibility Checklist

- [ ] All images have alt text
- [ ] All inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Semantic HTML used throughout
- [ ] ARIA labels present where needed

---

### 6. API Integration Testing

#### Test All Endpoints

```bash
# Set auth token (get from Clerk dashboard or browser)
export AUTH_TOKEN="your-clerk-jwt-token"

# Test conversation creation
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"message": "Hello, AI!"}'

# Test conversation list
curl http://localhost:3000/api/conversations \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Test document list
curl http://localhost:3000/api/documents \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Test document upload
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "file=@test.pdf"
```

---

### 7. Error Handling

#### Network Errors

- [ ] Disconnect network
- [ ] Try uploading document
- [ ] Verify error message displays
- [ ] Reconnect network
- [ ] Verify retry works

#### Invalid Data

- [ ] Try uploading 0-byte file
- [ ] Try uploading very large file (>50MB)
- [ ] Send empty chat message
- [ ] Verify appropriate error messages

---

### 8. Performance Testing

#### Load Times

- [ ] Measure collections page initial load (target: <2s)
- [ ] Measure chat message send/receive (target: <3s)
- [ ] Measure document upload start time (target: <500ms)

#### Browser Console

- [ ] Check for JavaScript errors
- [ ] Check for unhandled promise rejections
- [ ] Verify no memory leaks (use Performance tab)

---

## Testing Commands

### Start Development Servers

```bash
# Terminal 1: Web app
cd /c/Users/Owner/workspace/galaxyco-ai-2.0
pnpm --filter web dev

# Terminal 2: Trigger.dev (for background jobs)
pnpm --filter web trigger:dev

# Terminal 3: Database migrations (if needed)
pnpm --filter database db:push
```

### Run Type Checks

```bash
pnpm --filter web run typecheck
```

### Run Linter

```bash
pnpm --filter web run lint
```

### Check Build

```bash
pnpm --filter web build
```

---

## Test Data Setup

### Create Test Documents

```bash
# Create sample PDFs for testing
mkdir -p /c/Users/Owner/workspace/galaxyco-ai-2.0/test-data

# Use online tools or LibreOffice to create:
# 1. company-info.pdf (500 words about a fictional company)
# 2. case-study.pdf (800 words about a project)
# 3. services.pdf (600 words about services offered)
# 4. team-bio.pdf (400 words about team members)
# 5. logo.png (brand asset image)
```

### Seed Test Conversations

```sql
-- Run in psql to create test data
INSERT INTO ai_conversations (id, user_id, workspace_id, title, message_count)
VALUES
  ('test-conv-1', 'user_123', 'workspace_123', 'Test Conversation 1', 5),
  ('test-conv-2', 'user_123', 'workspace_123', 'Test Conversation 2', 3);

INSERT INTO ai_messages (id, conversation_id, role, content)
VALUES
  ('msg-1', 'test-conv-1', 'user', 'Hello, can you help me?'),
  ('msg-2', 'test-conv-1', 'assistant', 'Of course! What do you need help with?');
```

---

## Sign-Off Criteria

All tests must pass before considering step 17 complete:

- [ ] Document upload → processing → search flow works end-to-end
- [ ] Chat conversations persist across page reloads
- [ ] Collections UI functions correctly (grid/list, search, filters)
- [ ] Mobile responsive design works at all breakpoints
- [ ] Accessibility audit passes with no major issues
- [ ] All API endpoints respond correctly
- [ ] Error handling works gracefully
- [ ] Performance meets targets
- [ ] TypeScript compiles with no errors
- [ ] Linter passes with no errors (warnings acceptable)

---

## Known Issues to Fix

Document any issues found during testing:

1. [Issue Description]
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: ...
   - **Expected**: ...
   - **Actual**: ...
   - **Fix Required**: Yes/No

---

## Next Steps After Testing

Once all tests pass:

1. Create production deployment checklist
2. Set up CI/CD pipeline with tests
3. Configure monitoring and error tracking
4. Plan user acceptance testing (UAT)
5. Prepare documentation for users
6. Schedule production deployment

---

## Contact & Resources

- **Dev Server**: http://localhost:3000
- **Trigger.dev Dashboard**: https://cloud.trigger.dev
- **Database**: Access via `psql $DATABASE_URL`
- **API Docs**: `/api/docs` (future)
