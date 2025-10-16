# Phase 9A Checklist - Core Infrastructure

**Branch**: `phase-9/live-mode-core`  
**Goal**: Build foundation for live AI execution

---

## Pre-Flight

- [ ] Create new branch from `pre-phase-9/technical-debt-fixes`
- [ ] Install AI provider SDKs: `cd apps/web && pnpm add openai @anthropic-ai/sdk`

---

## 1. Database Schema for API Keys & Executions

### 1.1 Add API Keys Column to Workspaces

- [ ] Create migration file: `packages/database/migrations/20250108_add_api_keys.sql`
- [ ] Add `encrypted_api_keys` JSONB column to workspaces table
- [ ] Run migration: `cd packages/database && pnpm db:push`

### 1.2 Add Agent Executions Table

- [ ] Update `packages/database/src/schema.ts` - already exists, verify fields
- [ ] Ensure indexes exist (workspace_id, agent_id, status, created_at)

**Commit**: `feat(database): add api keys and execution tracking schema`

---

## 2. Encryption Utilities

- [ ] Create `apps/web/lib/crypto.ts`
- [ ] Implement `encryptApiKey(key: string): string`
- [ ] Implement `decryptApiKey(encrypted: string): string`
- [ ] Use Node crypto with AES-256-GCM

**Commit**: `feat(crypto): add API key encryption utilities`

---

## 3. AI Provider Service Layer

### 3.1 Base Types

- [ ] Create `apps/web/lib/ai/types.ts`
- [ ] Define `AIProvider` interface
- [ ] Define `ExecuteParams` and `ExecuteResult` types
- [ ] Define `Message` type

### 3.2 OpenAI Provider

- [ ] Create `apps/web/lib/ai/providers/openai.ts`
- [ ] Implement `OpenAIProvider` class
- [ ] Add `execute()` method with token counting
- [ ] Add `estimateCost()` method

### 3.3 Anthropic Provider

- [ ] Create `apps/web/lib/ai/providers/anthropic.ts`
- [ ] Implement `AnthropicProvider` class
- [ ] Add `execute()` method with token counting
- [ ] Add `estimateCost()` method

### 3.4 Provider Factory

- [ ] Create `apps/web/lib/ai/factory.ts`
- [ ] Implement `createProvider(type, apiKey)`
- [ ] Add provider validation

**Commit**: `feat(ai): add AI provider service layer with OpenAI and Anthropic`

---

## 4. API Key Management API Routes

### 4.1 Add API Key Endpoint

- [ ] Create `apps/web/app/api/workspaces/[id]/api-keys/route.ts`
- [ ] POST: Add encrypted API key
- [ ] GET: List available providers (not keys)
- [ ] DELETE: Remove API key

### 4.2 Test Connection Endpoint

- [ ] Add POST `/api/workspaces/[id]/api-keys/test`
- [ ] Validate key by making test call to provider

**Commit**: `feat(api): add API key management endpoints`

---

## 5. API Key Management UI

- [ ] Create `apps/web/components/settings/ApiKeyManager.tsx`
- [ ] Add key form (provider select + key input)
- [ ] Show last 4 chars only after save
- [ ] Add test connection button
- [ ] Add delete button with confirmation

**Commit**: `feat(ui): add API key management interface`

---

## 6. Error Retry Logic

- [ ] Create `apps/web/lib/retry.ts`
- [ ] Implement `retryWithBackoff<T>()` function
- [ ] Add exponential backoff calculation
- [ ] Add error categorization (retryable vs non-retryable)

**Commit**: `feat(ai): add retry logic with exponential backoff`

---

## 7. Execution Tracking Service

- [ ] Create `apps/web/lib/execution-tracker.ts`
- [ ] Implement `startExecution()` - creates record
- [ ] Implement `completeExecution()` - updates with results
- [ ] Implement `failExecution()` - marks as failed

**Commit**: `feat(execution): add execution tracking service`

---

## 8. Verification

- [ ] Test API key encryption/decryption
- [ ] Test OpenAI provider with real key
- [ ] Test Anthropic provider with real key
- [ ] Test retry logic with mock failures
- [ ] Test execution tracking flow

---

## 9. Push & Handoff

- [ ] Stage all changes: `git add -A`
- [ ] Final commit if needed
- [ ] Push: `git push origin phase-9/live-mode-core`
- [ ] Create handoff doc

---

**Current Item**: None (starting)
