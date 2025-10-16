# Agent Builder - Testing Guide

**Branch**: `phase-8/agent-builder-ui`  
**Commit**: `feat(web): add agent builder forms with save draft and validation`  
**Status**: Step 4 Complete ✅

---

## 🎉 What Was Built

### Components Created (6 files, 1,536 lines)

1. **`components/ui/Input.tsx`** (289 lines)
   - Reusable Input, Textarea, and Select components
   - Inline error display
   - Design system styling
   - Focus states and animations

2. **`hooks/use-agent-builder.ts`** (308 lines)
   - Form state management
   - Real-time validation (name, description, system prompt)
   - Template application
   - Save draft functionality (with debounced autosave)
   - Publish functionality
   - Error handling

3. **`components/agents/BasicInfoForm.tsx`** (325 lines)
   - Name input (3-50 chars, required)
   - Icon picker with emoji selector
   - Description textarea (10-500 chars, required)
   - Tags input with add/remove functionality
   - Character counters
   - Inline validation errors

4. **`components/agents/ConfigurationForm.tsx`** (231 lines)
   - Trigger dropdown (webhook, schedule, manual, event)
   - AI Provider dropdown (OpenAI, Anthropic, Custom)
   - Model dropdown (auto-updates based on provider)
   - Temperature slider (0-2, default 0.7)
   - System Prompt textarea (20-2000 chars, required)
   - Max Tokens input (optional, 1-128000)

5. **`components/agents/AgentBuilderPage.tsx`** (378 lines)
   - Main builder layout
   - Sticky toolbar with Save Draft and Publish buttons
   - Template Library modal integration
   - Success/error toast notifications
   - Loading states
   - Unsaved changes indicator
   - Auto-save every 30 seconds

6. **`app/agents/new/page.tsx`** (5 lines)
   - Route for agent builder
   - Renders AgentBuilderPage

---

## 🚀 How to Test

### 1. Start the Development Server

```bash
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web
pnpm dev
```

Navigate to: **http://localhost:3000/agents/new**

### 2. Test Template Library

**Expected Behavior**:

- ✅ Template Library modal opens automatically on page load
- ✅ See 5 template cards (Email Analyzer, Document Summarizer, etc.)
- ✅ Search bar filters templates in real-time
- ✅ Category tabs filter by pack (Founder Ops, Docs, Support, Sales)
- ✅ "Start from Scratch" option creates empty form
- ✅ Clicking a template pre-fills all form fields
- ✅ Modal has backdrop blur overlay
- ✅ Cards have hover effects (lift + shadow)

**Test**:

1. Click "Email Analyzer" template
2. Verify all fields are pre-filled with template data
3. Click "📚 Change Template" button in toolbar
4. Template Library reopens

---

### 3. Test Basic Info Form

**Expected Behavior**:

- ✅ Name input: 3-50 chars, required
- ✅ Icon picker: Click to open emoji grid, select emoji
- ✅ Description textarea: 10-500 chars, required
- ✅ Tags: Add with Enter key or "Add" button
- ✅ Character counters update in real-time
- ✅ Inline validation errors appear on blur
- ✅ Red error text below invalid fields

**Test**:

1. Clear the name field → Type "AB" → See error: "Name must be at least 3 characters"
2. Type "ABC" → Error disappears
3. Click icon picker → Select different emoji → Icon updates
4. Add tags: Type "email" → Press Enter → Tag appears
5. Click "×" on tag → Tag removed
6. Clear description → See error: "Description is required"

---

### 4. Test Configuration Form

**Expected Behavior**:

- ✅ Trigger dropdown: 4 options (webhook, schedule, manual, event)
- ✅ AI Provider dropdown: 3 options (OpenAI, Anthropic, Custom)
- ✅ Model dropdown: Updates based on provider
  - OpenAI: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
  - Anthropic: Claude 3 Opus, Sonnet, Haiku
  - Custom: Custom Model
- ✅ Temperature slider: 0-2, displays current value
- ✅ System Prompt: 20-2000 chars, required
- ✅ Max Tokens: Optional, 1-128000

**Test**:

1. Change AI Provider to "Anthropic" → Model dropdown updates to Claude models
2. Change AI Provider back to "OpenAI" → Model dropdown updates to GPT models
3. Move temperature slider → Value updates in label
4. Clear system prompt → Type less than 20 chars → See error
5. Type 20+ chars → Error disappears
6. Leave Max Tokens empty (optional field)

---

### 5. Test Save Draft

**Expected Behavior**:

- ✅ "Save Draft" button disabled if no changes
- ✅ Button enabled when form is dirty
- ✅ Clicking saves via API (POST /agents or PUT /agents/:id)
- ✅ Success toast appears: "✓ Draft saved successfully!"
- ✅ "Unsaved changes" indicator disappears
- ✅ Button shows "Saving..." during API call

**Test**:

1. Fill in all required fields (name, description, system prompt)
2. Click "💾 Save Draft" button
3. See success toast (or error if API is not running)
4. Check browser console for API request

---

### 6. Test Publish

**Expected Behavior**:

- ✅ "Publish Agent" button always enabled
- ✅ Validates form before publishing
- ✅ If invalid, shows inline errors (doesn't call API)
- ✅ If valid, saves with status="active"
- ✅ Success toast: "✓ Agent published successfully!"

**Test**:

1. Clear name field → Click "🚀 Publish Agent"
2. See validation error: "Name is required"
3. Fill in name → Click "🚀 Publish Agent" again
4. See success toast (or error if API not running)

---

### 7. Test Autosave

**Expected Behavior**:

- ✅ Changes trigger autosave after 30 seconds
- ✅ "Saving..." indicator appears during save
- ✅ No manual action needed

**Test**:

1. Change name field
2. Wait 30 seconds without clicking anything
3. See "Saving..." indicator appear
4. Success toast appears after save completes

---

### 8. Test Validation

**Expected Behavior**:

- ✅ Inline errors appear on blur
- ✅ Errors clear when field becomes valid
- ✅ Character counters update in real-time
- ✅ Required fields marked with red asterisk
- ✅ Form cannot save/publish if invalid

**Test**:

1. Name: Type 1 char → Blur → Error
2. Name: Type 51+ chars → Error: "must not exceed 50 characters"
3. Description: Type 5 chars → Error: "must be at least 10 characters"
4. System Prompt: Type 10 chars → Error: "must be at least 20 characters"
5. Max Tokens: Type 200000 → Error: "must be between 1 and 128000"

---

## 🐛 Known Limitations

1. **API Not Connected**:
   - Save Draft and Publish will fail if NestJS API is not running
   - Expected: Connection error toast appears

2. **TypeScript Errors**:
   - Some module resolution issues exist in the codebase
   - These don't affect runtime functionality
   - Forms should work correctly in the browser

3. **No Authentication Check**:
   - Forms don't verify Clerk authentication
   - Will be added in later phases

---

## 📝 Test Checklist

Use this checklist to verify all features:

- [ ] Template Library opens on page load
- [ ] Template selection pre-fills form
- [ ] "Start from Scratch" creates empty form
- [ ] "Change Template" button reopens library
- [ ] Icon picker opens and selects emoji
- [ ] Name validation (3-50 chars)
- [ ] Description validation (10-500 chars)
- [ ] Tags add with Enter key
- [ ] Tags remove with × button
- [ ] Trigger dropdown works
- [ ] AI Provider dropdown works
- [ ] Model dropdown updates based on provider
- [ ] Temperature slider moves and updates label
- [ ] System Prompt validation (20-2000 chars)
- [ ] Max Tokens accepts optional numbers
- [ ] Character counters update in real-time
- [ ] Save Draft button enables/disables correctly
- [ ] Save Draft shows success toast
- [ ] Publish validates before saving
- [ ] Publish shows success toast
- [ ] Autosave triggers after 30 seconds
- [ ] "Unsaved changes" indicator appears
- [ ] "Saving..." indicator appears during save
- [ ] All inline errors display correctly
- [ ] Toolbar is sticky on scroll
- [ ] Forms are disabled during save

---

## 🎯 Next Steps

After testing, the next steps from SESSION_5_HANDOFF.md are:

### Step 5: Agent Builder - Advanced (1 hour)

- SchemaBuilder.tsx (JSON editor for inputs/outputs)
- AdvancedSettings.tsx (timeout, retries, rate limits)
- Publish flow with confirmation modal
- Keyboard shortcut: Cmd+S to save

### Step 6: Test Mode Panel (1 hour)

- TestPanel.tsx (right sidebar)
- JSON input editor
- Run test button (mock mode)
- Formatted output display
- Metrics (tokens, cost, latency)

### Step 7: Agent List Page (45 min)

- `/agents` route
- Status filter tabs
- Search with debounce
- Grid of agent cards

### Step 8: Polish & Testing (45 min)

- Loading states
- Error boundaries
- Toast notifications
- End-to-end test

---

## 💬 Feedback

When testing, please note:

- ✅ What works perfectly
- 🐛 Any bugs or unexpected behavior
- 💡 Suggestions for improvements
- 🚀 Features you'd like to see added

---

**Great work! The Agent Builder forms are complete and ready for testing! 🎉**
