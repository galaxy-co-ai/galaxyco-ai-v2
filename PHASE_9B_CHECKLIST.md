# Phase 9B Checklist - Live Execution & UI

**Branch**: `phase-9/live-execution`  
**Goal**: Connect UI to live AI execution

---

## Pre-Flight

- [ ] Create new branch from `phase-9/live-mode-core`

---

## 1. Update Agent Test API to Use Live Execution

- [ ] Update `apps/api/agents/:id/test` endpoint
- [ ] Decrypt API key from workspace
- [ ] Create AI provider instance
- [ ] Execute with retry logic
- [ ] Track execution
- [ ] Return real results

**Commit**: `feat(api): connect agent test endpoint to live AI execution`

---

## 2. Update Test Panel for Live Mode

- [ ] Update `TestPanel.tsx` to call live API
- [ ] Show real usage metrics (tokens, cost, latency)
- [ ] Display model used
- [ ] Handle errors gracefully
- [ ] Show retry attempts

**Commit**: `feat(ui): update test panel for live AI execution`

---

## 3. API Key Management UI Component

- [ ] Create `components/settings/ApiKeyManager.tsx`
- [ ] Provider selector (OpenAI/Anthropic)
- [ ] API key input (secure)
- [ ] Test connection button
- [ ] Show configured providers
- [ ] Delete key with confirmation

**Commit**: `feat(ui): add API key management component`

---

## 4. Settings Page with API Keys

- [ ] Create or update settings page
- [ ] Add ApiKeyManager component
- [ ] Route to `/settings` or `/dashboard/settings`

**Commit**: `feat(ui): add settings page with API key management`

---

## 5. Verification & Testing

- [ ] Test OpenAI key addition
- [ ] Test Anthropic key addition
- [ ] Test agent execution with real AI
- [ ] Verify metrics displayed
- [ ] Test error handling
- [ ] Verify execution tracking in DB

---

## 6. Push & Handoff

- [ ] Stage all changes: `git add -A`
- [ ] Push: `git push origin phase-9/live-execution`
- [ ] Create handoff doc

---

**Current Item**: None (starting)
