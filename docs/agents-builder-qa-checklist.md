# Agents Builder QA Checklist - Phases 1 & 2

**Purpose:** Verify all functionality in Phases 1 & 2 works flawlessly before proceeding to Phase 3 (TestPlayground).

## Pre-Flight Checks

- [ ] All code committed and pushed to main
- [ ] TypeScript passes for apps/web (`cd apps/web && pnpm typecheck`)
- [ ] No console errors on page load

## Setup

```bash
# Start dev server
pnpm dev

# Verify app loads
# - Navigate to http://localhost:3000
# - Sign in/create account
# - Navigate to /agents
```

---

## Phase 1: Prompt → Variants (Critical Path)

### 1. Template Selection
- [ ] Templates display in grid (6 cards visible)
- [ ] Hover shows card elevation effect
- [ ] Click template → prompt textarea auto-fills
- [ ] Toast confirms: "Template 'X' loaded"
- [ ] **Mobile (375px):** Templates scroll horizontally or stack vertically

### 2. Prompt Input
- [ ] Textarea expands as you type (min 4 rows, max 10 rows)
- [ ] Character count shows bottom-right when typing
- [ ] "Enhance Prompt" button:
  - Disabled when prompt <10 chars
  - Enabled when ≥10 chars
  - Shows spinner during enhancement (1-3 seconds)
  - Enhanced version displays in blue panel below
  - "Use Enhanced" replaces original
  - "Keep Original" dismisses panel
- [ ] "Generate Agents" button:
  - Disabled when prompt <10 chars
  - Enabled when ≥10 chars
  - Triggers progress modal

### 3. Progress Modal (ProgressStream)
- [ ] Modal appears overlay with 4 steps
- [ ] Steps update: pending → active → complete
- [ ] Progress bar fills 0% → 100%
- [ ] Takes 2-4 seconds total
- [ ] Modal auto-closes when complete

### 4. Variant Grid
- [ ] 3 cards display (Basic, Advanced, Minimal)
- [ ] Each card shows:
  - Badge with type + stars (⭐)
  - Description
  - Metadata (steps, integrations, setup time)
  - Mini workflow preview (first 3 steps)
  - "Select This Version" button
- [ ] Hover on card → lift effect
- [ ] Click "Select" → card highlights, toast confirms
- [ ] **Desktop:** 3 columns side-by-side
- [ ] **Mobile:** Stack vertically or swipeable

### 5. Error Handling (Phase 1)
- [ ] Prompt <10 chars → buttons stay disabled
- [ ] API failure → toast with error message
- [ ] Empty variants response → error toast
- [ ] Network timeout → retry or error message

---

## Phase 2: Iteration → Workflow Refinement (Critical Path)

### 6. Iteration View Load
- [ ] After variant selection → redirects to iteration step
- [ ] Page shows heading: "Refine Your Agent"
- [ ] **Desktop:** Split layout (workflow left, chat right)
- [ ] **Mobile:** Stacked layout (workflow top, chat bottom)

### 7. Workflow Visualizer (React Flow)
- [ ] Workflow diagram renders with nodes connected
- [ ] Nodes color-coded:
  - Start: Purple gradient
  - Action: White/neutral
  - End: Green
- [ ] Controls visible (zoom in, zoom out, fit view)
- [ ] MiniMap visible (desktop only)
- [ ] Can drag to pan canvas
- [ ] Can zoom with controls or pinch (mobile)
- [ ] **Compact view (mobile):** Shows list with numbered steps

### 8. Iteration Chat
- [ ] Empty state shows instructions when no messages
- [ ] Textarea auto-expands (1-4 lines)
- [ ] Send button:
  - Disabled when empty
  - Enabled when text entered
  - Shows spinner while sending
- [ ] Enter key submits (Shift+Enter for new line)
- [ ] Message appears immediately (user bubble, right-aligned)
- [ ] AI response arrives after 1-3 seconds (assistant bubble, left-aligned)
- [ ] Response shows "✓ Workflow updated" indicator
- [ ] Suggested action chips display after message
- [ ] Click chip → fills textarea

### 9. Live Workflow Updates
- [ ] Send message: "Add Slack notification"
- [ ] AI responds with explanation
- [ ] **Workflow diagram updates in real-time** (new node appears)
- [ ] Node fades in with animation
- [ ] Edge connects new node
- [ ] Send another message: "Add error handling"
- [ ] Workflow updates again with new step
- [ ] Previous nodes remain (additive, not replaced)

### 10. Navigation Controls
- [ ] "← Choose Different Variant" button returns to variant grid
- [ ] "Continue to Test →" button (placeholder for Phase 3)

### 11. Error Handling (Phase 2)
- [ ] Empty message → send button disabled
- [ ] API failure → error toast + system message in chat
- [ ] Invalid workflow response → error handling
- [ ] ErrorBoundary catches React Flow crashes → "Something went wrong" UI

---

## Cross-Cutting Concerns

### 12. Accessibility
- [ ] Tab key navigates through forms
- [ ] Enter key submits forms
- [ ] All inputs have labels (visible or aria-label)
- [ ] Focus indicators visible (blue ring)
- [ ] Screen reader announces changes
- [ ] Color contrast ≥4.5:1 (use DevTools)

### 13. Mobile Responsiveness (Test at 375px width)
- [ ] Template cards stack or scroll
- [ ] Prompt textarea full-width
- [ ] Enhance/Generate buttons stack on small screens
- [ ] Variant grid stacks vertically
- [ ] Iteration view: workflow and chat stack (not side-by-side)
- [ ] Workflow shows compact list view (not canvas)
- [ ] Chat input and suggested chips wrap properly

### 14. State Persistence (Zustand)
- [ ] Fill in prompt, refresh page → prompt persists
- [ ] Generate variants, refresh → variants persist
- [ ] Select variant, refresh → selected variant persists
- [ ] Send chat message, refresh → workflow updates persist
- [ ] Open DevTools → Application → Local Storage → `agent-builder-storage`

### 15. Edge Cases
- [ ] Very long prompt (500+ chars) → handles gracefully
- [ ] Special characters in prompt (`<script>`, emoji) → sanitized
- [ ] Rapid clicking "Generate" → debounced or loading state prevents duplicates
- [ ] Browser back button → navigates correctly
- [ ] Multiple iterations (5-10 messages) → chat scrolls, workflow updates

### 16. Dark Mode
- [ ] Toggle dark mode (system or manual)
- [ ] All components render correctly
- [ ] Text is readable
- [ ] Borders and shadows visible
- [ ] Workflow nodes have dark variants

### 17. Performance
- [ ] No console errors or warnings
- [ ] Page loads <2 seconds
- [ ] Variant generation <5 seconds
- [ ] Workflow iteration <3 seconds
- [ ] Smooth animations (60fps)

---

## Known Issues / Limitations (Document Only)

- IntegrationsSuggester panel not yet implemented (Phase 2 optional feature)
- TestPlayground not yet implemented (Phase 3)
- No backend persistence (Zustand only, localStorage)
- Mock integrations (no real OAuth)

---

## Sign-Off

**Tested by:** ___________________  
**Date:** ___________________  
**Environment:** Dev (localhost:3000)  
**Browser(s):** Chrome / Firefox / Safari  

**All critical paths passed:** ☐ Yes ☐ No  
**Ready for Phase 3:** ☐ Yes ☐ No  

**Notes / Issues Found:**
_______________________________________________________
_______________________________________________________
_______________________________________________________
