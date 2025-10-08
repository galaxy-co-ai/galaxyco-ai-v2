# Technical Debt Assessment & Phase 9 Forward Plan

**Date**: January 8, 2025  
**Current Status**: Phase 8 Complete (100%)  
**Branch**: `phase-8/agent-builder-ui`  
**Next Phase**: Phase 9 - Live Mode Integration

---

## 📋 Table of Contents

1. [Technical Debt Inventory](#technical-debt-inventory)
2. [Severity & Impact Analysis](#severity--impact-analysis)
3. [Phase 9 Overview](#phase-9-overview)
4. [Comprehensive Forward Plan](#comprehensive-forward-plan)
5. [Technical Debt Resolution Strategy](#technical-debt-resolution-strategy)
6. [Success Metrics & KPIs](#success-metrics--kpis)

---

## 🔍 Technical Debt Inventory

### Critical (Must Fix Before Phase 9)

#### 1. TypeScript Path Resolution Errors (49+ errors)
**Location**: `apps/web/**/*.tsx`, `apps/web/**/*.ts`  
**Issue**: Import paths not resolving correctly due to tsconfig path mapping issues
- ❌ Cannot find module `@/components/agents/*`
- ❌ Cannot find module `@/hooks/*`
- ❌ Cannot find module `@/lib/*`
- ❌ Cannot find module `@galaxyco/database/schema`

**Impact**: 
- Blocks type safety
- Makes refactoring dangerous
- Hides potential runtime errors
- Prevents automated testing setup

**Root Cause**:
- `tsconfig.json` paths not properly exported from packages
- Database package not exporting schema types correctly
- Missing `exports` field in package.json files

**Estimated Fix Time**: 1-2 hours

---

#### 2. Missing Authentication Integration
**Location**: `apps/web/lib/actions/agent-actions.ts:39`  
**Issue**: Hardcoded placeholder auth token
```typescript
const token = 'CLERK_TOKEN_HERE'; // TODO: Get from Clerk
```

**Impact**:
- All API calls will fail in production
- No actual tenant isolation
- Security vulnerability
- Can't test real-world scenarios

**Dependencies**:
- Clerk `useAuth()` hook integration
- Workspace context provider
- Token refresh logic

**Estimated Fix Time**: 2-3 hours

---

#### 3. Mock-Only Test Execution
**Location**: `apps/web/components/agents/TestPanel.tsx`, `services/agents/**`  
**Issue**: Test panel only returns mock data, no real AI execution

**Impact**:
- Cannot validate agent logic before production
- No way to test prompt quality
- Can't measure actual token usage
- Blocks Phase 9 completely

**Estimated Fix Time**: Entire Phase 9 (4-6 hours)

---

### High Priority (Should Fix During Phase 9)

#### 4. No Schema Validation for Input/Output
**Location**: Agent creation flow  
**Issue**: Agents don't have structured input/output schemas

**Impact**:
- Users don't know what data to send
- No validation at runtime
- Type safety breaks at agent boundaries
- Hard to build integrations

**Solution Needed**:
- JSON Schema editor component
- Schema validation middleware
- Type generation from schemas

**Estimated Fix Time**: 3-4 hours

---

#### 5. Incomplete Agent Tracking
**Location**: `apps/web/components/dashboard/ProgressTracker.tsx:146-147`  
**Issue**: Progress tracker has hardcoded false values
```typescript
const hasAgents = false; // TODO: Query actual agent count in Phase 8
const hasConnectedTools = false; // TODO: Query actual integrations in Phase 8
```

**Impact**:
- Misleading dashboard metrics
- Users can't track real progress
- Onboarding flow broken

**Estimated Fix Time**: 30 minutes

---

#### 6. Missing Database Exports
**Location**: `packages/database/src/schema.ts`  
**Issue**: Schema not properly exported with types

**Impact**:
- TypeScript errors across web app
- Can't import tables in API routes
- Blocks type-safe database queries

**Estimated Fix Time**: 30 minutes

---

### Medium Priority (Can Fix After Phase 9)

#### 7. No Error Retry Logic
**Location**: Agent execution flow  
**Issue**: No retry mechanism for failed AI API calls

**Impact**:
- Transient failures become permanent
- Poor user experience
- Wasted API credits on partial failures

**Solution**: Exponential backoff retry with max attempts

**Estimated Fix Time**: 2 hours

---

#### 8. No Rate Limiting Implementation
**Location**: Agent API endpoints  
**Issue**: Rate limit config exists but not enforced

**Impact**:
- Risk of API quota exhaustion
- Cost overruns
- Potential service abuse

**Solution**: Redis-based rate limiter per workspace

**Estimated Fix Time**: 2-3 hours

---

#### 9. No Agent Test History
**Location**: Test panel  
**Issue**: Test results not persisted

**Impact**:
- Can't compare test runs
- No debugging history
- Can't track prompt improvements

**Estimated Fix Time**: 2 hours

---

#### 10. TypeScript Implicit Any Types
**Location**: Multiple components  
**Issue**: 15+ implicit `any` type parameters

**Examples**:
- `app/agents/page.tsx:232` - `agent` parameter
- `components/agents/AdvancedSettings.tsx` - multiple event handlers
- `components/agents/BasicInfoForm.tsx` - tag handling

**Impact**:
- Loss of type safety
- Harder to refactor
- Potential runtime errors

**Estimated Fix Time**: 1 hour

---

### Low Priority (Nice to Have)

#### 11. Missing Unit Tests
**Location**: Entire codebase  
**Issue**: Zero test coverage

**Impact**: Hard to maintain confidence during refactoring

**Estimated Fix Time**: 10+ hours (separate initiative)

---

#### 12. No Performance Monitoring
**Location**: Agent execution  
**Issue**: No metrics collection for latency, errors, costs

**Estimated Fix Time**: 3-4 hours (Phase 10)

---

#### 13. Hardcoded Design System Values
**Location**: Some components still use inline styles instead of design system

**Impact**: Inconsistent UI, harder to maintain

**Estimated Fix Time**: 2 hours

---

## 📊 Severity & Impact Analysis

| Priority | Count | Total Fix Time | Blockers |
|----------|-------|---------------|----------|
| **Critical** | 3 | 7-11 hours | Phase 9 blocked |
| **High** | 6 | 9.5 hours | Features incomplete |
| **Medium** | 4 | 7 hours | User experience |
| **Low** | 3 | 15+ hours | Future work |
| **TOTAL** | 16 | 38.5+ hours | - |

### Critical Path Analysis

```
Phase 9 Cannot Start Until:
├── TypeScript errors fixed (1-2h)
├── Auth integration complete (2-3h)
└── Database exports fixed (0.5h)
Total: 3.5-5.5 hours of blocking work
```

---

## 🚀 Phase 9 Overview

### Goal
Transform the Agent Builder from mock-only mode to **production-ready live execution** with real AI provider integration.

### Scope
1. **AI Provider Integration**: Connect OpenAI, Anthropic, and custom providers
2. **API Key Management**: Secure storage and rotation
3. **Live Test Execution**: Real AI calls from test panel
4. **Usage Tracking**: Token counting, cost calculation
5. **Error Handling**: Retry logic, fallbacks, user-friendly errors
6. **Schema Validation**: Input/output schema enforcement

### Success Criteria
- ✅ Agent test panel executes real AI calls
- ✅ All AI providers (OpenAI, Anthropic) working
- ✅ API keys securely stored per workspace
- ✅ Token usage tracked and displayed
- ✅ Error retry logic with 3 attempts
- ✅ Input/output validated against schemas
- ✅ Zero critical technical debt remaining
- ✅ All TypeScript errors resolved

### Estimated Duration
**12-16 hours** (includes technical debt fixes)

---

## 📅 Comprehensive Forward Plan

### Timeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Pre-Phase 9: Technical Debt Resolution (4-6 hours)             │
├─────────────────────────────────────────────────────────────────┤
│  Phase 9A: Core Infrastructure (4-5 hours)                      │
├─────────────────────────────────────────────────────────────────┤
│  Phase 9B: AI Provider Integration (4-6 hours)                  │
├─────────────────────────────────────────────────────────────────┤
│  Phase 9C: Testing & Polish (2-3 hours)                         │
├─────────────────────────────────────────────────────────────────┤
│  Post-Phase 9: Remaining Debt (2-3 hours)                       │
└─────────────────────────────────────────────────────────────────┘

Total: 16-23 hours across 5 work sessions
```

---

## 🔧 Detailed Implementation Plan

---

### 🛠️ PRE-PHASE 9: Technical Debt Resolution (Session 7)

**Duration**: 4-6 hours  
**Branch**: `pre-phase-9/technical-debt-fixes`  
**Goal**: Eliminate all critical blockers before Phase 9

#### Step 1: Fix TypeScript Path Resolution (1.5-2h)

**Tasks**:
1. Update `packages/database/package.json` exports:
   ```json
   {
     "exports": {
       ".": "./src/index.ts",
       "./schema": "./src/schema.ts",
       "./client": "./src/client.ts"
     }
   }
   ```

2. Create `packages/database/src/types.ts`:
   ```typescript
   export * from './schema';
   export type { Database } from './client';
   ```

3. Update `apps/web/tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"],
         "@galaxyco/database": ["../../packages/database/src/index.ts"],
         "@galaxyco/database/*": ["../../packages/database/src/*"]
       }
     }
   }
   ```

4. Run `pnpm typecheck` and fix remaining errors

5. Update all imports to use correct paths

**Verification**:
```bash
cd apps/web && pnpm typecheck
# Should return 0 errors
```

**Commit**: `fix(typescript): resolve all path resolution errors`

---

#### Step 2: Integrate Clerk Authentication (2-3h)

**Tasks**:
1. Create `apps/web/hooks/use-workspace-auth.ts`:
   ```typescript
   export function useWorkspaceAuth() {
     const { userId, getToken } = useAuth();
     const { workspace } = useWorkspace();
     
     async function getAuthHeaders() {
       const token = await getToken();
       return {
         'Authorization': `Bearer ${token}`,
         'x-workspace-id': workspace.id,
       };
     }
     
     return { getAuthHeaders, userId, workspace };
   }
   ```

2. Update `apps/web/lib/actions/agent-actions.ts`:
   ```typescript
   // Remove hardcoded token
   // Add useWorkspaceAuth integration
   ```

3. Add workspace context to test panel:
   ```typescript
   const { getAuthHeaders } = useWorkspaceAuth();
   ```

4. Test auth flow end-to-end

**Verification**:
- [ ] Can create agent with real Clerk token
- [ ] Can list agents filtered by workspace
- [ ] API returns 401 without valid token

**Commit**: `feat(auth): integrate Clerk authentication with workspace context`

---

#### Step 3: Fix Database Schema Exports (30m)

**Tasks**:
1. Update `packages/database/src/index.ts`:
   ```typescript
   export * from './client';
   export * from './schema';
   
   // Re-export specific tables for convenience
   export {
     users,
     workspaces,
     workspaceMembers,
     agents,
     agentPacks,
     // ... all tables
   } from './schema';
   ```

2. Add type exports:
   ```typescript
   export type { User, Workspace, Agent } from './schema';
   ```

3. Test imports in web app

**Verification**:
```typescript
import { agents, type Agent } from '@galaxyco/database';
// Should have full type safety
```

**Commit**: `fix(database): add proper schema and type exports`

---

#### Step 4: Fix Dashboard Progress Tracking (30m)

**Tasks**:
1. Create database query hook:
   ```typescript
   export async function getWorkspaceStats(workspaceId: string) {
     const agentCount = await db
       .select({ count: sql`count(*)` })
       .from(agents)
       .where(eq(agents.workspaceId, workspaceId));
     
     return {
       agentCount: agentCount[0].count,
       // Add other stats
     };
   }
   ```

2. Update `ProgressTracker.tsx`:
   ```typescript
   const { data: stats } = useQuery(['workspace-stats', workspace.id], 
     () => getWorkspaceStats(workspace.id)
   );
   const hasAgents = stats.agentCount > 0;
   ```

**Verification**:
- [ ] Dashboard shows real agent count
- [ ] Progress tracker updates when agent created

**Commit**: `fix(dashboard): connect progress tracker to real data`

---

#### Step 5: Fix TypeScript Implicit Any Types (1h)

**Tasks**:
1. Enable strict mode in affected files
2. Add explicit types to all event handlers:
   ```typescript
   // Before: (e) => {}
   // After: (e: React.ChangeEvent<HTMLInputElement>) => {}
   ```

3. Add types to all function parameters
4. Run typecheck and verify

**Verification**:
```bash
pnpm typecheck --strict
# Should pass
```

**Commit**: `fix(typescript): add explicit types to remove implicit any`

---

#### Session 7 Deliverables

- ✅ All TypeScript errors resolved (0 errors)
- ✅ Clerk authentication integrated
- ✅ Database schema properly exported
- ✅ Dashboard tracking real data
- ✅ All implicit any types fixed
- ✅ Clean typecheck output
- ✅ Ready for Phase 9 development

**Session 7 Handoff Document**: `session_7_handoff.md`

---

### 🚀 PHASE 9A: Core Infrastructure (Session 8)

**Duration**: 4-5 hours  
**Branch**: `phase-9/live-mode-core`  
**Goal**: Build foundation for live AI execution

#### Step 1: API Key Management (1.5h)

**Tasks**:
1. Add API keys to workspace settings table:
   ```typescript
   // Migration: 20250108_add_api_keys.sql
   ALTER TABLE workspaces
   ADD COLUMN encrypted_api_keys JSONB DEFAULT '{}'::jsonb;
   ```

2. Create encryption utilities:
   ```typescript
   // lib/crypto.ts
   export function encryptApiKey(key: string): string;
   export function decryptApiKey(encrypted: string): string;
   ```

3. Build API key management UI:
   ```typescript
   // components/settings/ApiKeyManager.tsx
   // - Add/Edit/Delete API keys
   // - Show last 4 characters only
   // - Test connection button
   ```

4. Create API endpoint:
   ```typescript
   // app/api/workspaces/[id]/api-keys/route.ts
   POST /api/workspaces/:id/api-keys
   GET /api/workspaces/:id/api-keys
   DELETE /api/workspaces/:id/api-keys/:provider
   ```

**Security Requirements**:
- API keys encrypted at rest (AES-256)
- Keys never sent to client (only existence indicator)
- Keys stored per workspace (tenant-scoped)
- Audit log for key rotation

**Verification**:
- [ ] Can add OpenAI API key
- [ ] Can add Anthropic API key
- [ ] Keys encrypted in database
- [ ] Cannot view full key after creation
- [ ] Can test connection successfully

**Commit**: `feat(api-keys): add secure API key management with encryption`

---

#### Step 2: AI Provider Service Layer (1.5h)

**Tasks**:
1. Create base AI provider interface:
   ```typescript
   // services/ai/types.ts
   export interface AIProvider {
     name: string;
     execute(params: ExecuteParams): Promise<ExecuteResult>;
     validateConfig(config: ProviderConfig): boolean;
     estimateCost(params: ExecuteParams): number;
   }
   
   export interface ExecuteParams {
     model: string;
     messages: Message[];
     temperature: number;
     maxTokens: number;
     tools?: Tool[];
   }
   
   export interface ExecuteResult {
     content: string;
     usage: { promptTokens: number; completionTokens: number; totalTokens: number };
     latencyMs: number;
     cost: number;
     model: string;
   }
   ```

2. Create OpenAI provider:
   ```typescript
   // services/ai/providers/openai.ts
   export class OpenAIProvider implements AIProvider {
     private client: OpenAI;
     
     async execute(params: ExecuteParams): Promise<ExecuteResult> {
       // Implementation
     }
   }
   ```

3. Create Anthropic provider:
   ```typescript
   // services/ai/providers/anthropic.ts
   export class AnthropicProvider implements AIProvider {
     // Implementation
   }
   ```

4. Create provider factory:
   ```typescript
   // services/ai/factory.ts
   export function createProvider(
     type: 'openai' | 'anthropic',
     apiKey: string
   ): AIProvider {
     switch (type) {
       case 'openai': return new OpenAIProvider(apiKey);
       case 'anthropic': return new AnthropicProvider(apiKey);
     }
   }
   ```

**Verification**:
- [ ] Can create OpenAI provider instance
- [ ] Can create Anthropic provider instance
- [ ] Provider interface enforces consistency
- [ ] Cost estimation works

**Commit**: `feat(ai): create AI provider service layer with OpenAI and Anthropic`

---

#### Step 3: Usage Tracking Database (1h)

**Tasks**:
1. Create agent executions table:
   ```sql
   CREATE TABLE agent_executions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
     agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
     
     -- Execution metadata
     status execution_status NOT NULL DEFAULT 'pending',
     started_at TIMESTAMP NOT NULL DEFAULT NOW(),
     completed_at TIMESTAMP,
     duration_ms INTEGER,
     
     -- Input/output
     input JSONB NOT NULL,
     output JSONB,
     error JSONB,
     
     -- AI metrics
     model TEXT NOT NULL,
     ai_provider TEXT NOT NULL,
     prompt_tokens INTEGER,
     completion_tokens INTEGER,
     total_tokens INTEGER,
     estimated_cost NUMERIC(10, 6),
     
     -- Metadata
     triggered_by UUID REFERENCES users(id),
     trigger_type TEXT NOT NULL, -- 'manual', 'webhook', 'schedule'
     
     created_at TIMESTAMP NOT NULL DEFAULT NOW()
   );
   
   CREATE INDEX agent_execution_tenant_idx ON agent_executions(workspace_id);
   CREATE INDEX agent_execution_agent_idx ON agent_executions(agent_id);
   CREATE INDEX agent_execution_status_idx ON agent_executions(status);
   ```

2. Add Drizzle schema:
   ```typescript
   export const agentExecutions = pgTable('agent_executions', {
     // ... fields
   });
   ```

3. Create execution tracking service:
   ```typescript
   // services/executions/tracker.ts
   export async function startExecution(params): Promise<string>;
   export async function completeExecution(id, result): Promise<void>;
   export async function failExecution(id, error): Promise<void>;
   ```

**Verification**:
- [ ] Can create execution record
- [ ] Can update with completion data
- [ ] Tenant-scoped queries work
- [ ] Usage metrics calculated correctly

**Commit**: `feat(database): add agent execution tracking with usage metrics`

---

#### Step 4: Error Retry Logic (1h)

**Tasks**:
1. Create retry utility:
   ```typescript
   // lib/retry.ts
   export async function retryWithBackoff<T>(
     fn: () => Promise<T>,
     options: {
       maxAttempts: number;
       baseDelayMs: number;
       maxDelayMs: number;
       onRetry?: (attempt: number, error: Error) => void;
     }
   ): Promise<T> {
     // Exponential backoff implementation
   }
   ```

2. Add retry to provider execution:
   ```typescript
   async execute(params: ExecuteParams): Promise<ExecuteResult> {
     return retryWithBackoff(
       () => this.executeInternal(params),
       {
         maxAttempts: 3,
         baseDelayMs: 1000,
         maxDelayMs: 10000,
         onRetry: (attempt, error) => {
           console.log(`Retry attempt ${attempt}: ${error.message}`);
         }
       }
     );
   }
   ```

3. Add error categorization:
   ```typescript
   // lib/errors.ts
   export class RetryableError extends Error { }
   export class NonRetryableError extends Error { }
   export class RateLimitError extends RetryableError { }
   ```

**Verification**:
- [ ] Retries on transient failures
- [ ] Doesn't retry on auth errors
- [ ] Exponential backoff works
- [ ] Max attempts respected

**Commit**: `feat(ai): add retry logic with exponential backoff`

---

#### Session 8 Deliverables

- ✅ Secure API key management
- ✅ AI provider service layer (OpenAI + Anthropic)
- ✅ Usage tracking database
- ✅ Error retry logic
- ✅ Ready for live execution integration

**Session 8 Handoff Document**: `session_8_handoff.md`

---

### 🤖 PHASE 9B: Live AI Execution (Session 9)

**Duration**: 4-6 hours  
**Branch**: `phase-9/live-execution`  
**Goal**: Connect test panel and agent execution to real AI

#### Step 1: Agent Test API Endpoint (1.5h)

**Tasks**:
1. Update test endpoint:
   ```typescript
   // apps/api/src/agents/agents.controller.ts
   @Post(':id/test')
   async testAgent(
     @Param('id') agentId: string,
     @Body() payload: TestAgentDto,
     @Headers('x-workspace-id') workspaceId: string,
   ) {
     // 1. Fetch agent config
     // 2. Get workspace API key
     // 3. Create AI provider
     // 4. Execute with input
     // 5. Track execution
     // 6. Return result
   }
   ```

2. Add DTO validation:
   ```typescript
   export class TestAgentDto {
     @IsObject()
     inputs: Record<string, any>;
     
     @IsEnum(['mock', 'live'])
     @IsOptional()
     mode?: 'mock' | 'live' = 'live';
   }
   ```

3. Implement execution flow:
   ```typescript
   async function executeAgent(
     agent: Agent,
     inputs: any,
     workspace: Workspace
   ): Promise<ExecuteResult> {
     // Start execution tracking
     const executionId = await startExecution({ agent, inputs });
     
     try {
       // Get API key
       const apiKey = await getApiKey(workspace, agent.config.aiProvider);
       
       // Create provider
       const provider = createProvider(agent.config.aiProvider, apiKey);
       
       // Build messages from system prompt + inputs
       const messages = buildMessages(agent.config.systemPrompt, inputs);
       
       // Execute
       const result = await provider.execute({
         model: agent.config.model,
         messages,
         temperature: agent.config.temperature,
         maxTokens: agent.config.maxTokens,
       });
       
       // Track completion
       await completeExecution(executionId, result);
       
       return result;
     } catch (error) {
       await failExecution(executionId, error);
       throw error;
     }
   }
   ```

**Verification**:
- [ ] Test endpoint accepts inputs
- [ ] Validates agent exists
- [ ] Checks workspace has API key
- [ ] Executes real AI call
- [ ] Returns usage metrics
- [ ] Tracks execution in database

**Commit**: `feat(api): implement live agent test execution`

---

#### Step 2: Update Test Panel for Live Mode (2h)

**Tasks**:
1. Add mode toggle to test panel:
   ```typescript
   const [mode, setMode] = useState<'mock' | 'live'>('live');
   ```

2. Show API key requirement:
   ```typescript
   {!hasApiKey && mode === 'live' && (
     <Alert variant="warning">
       <AlertIcon>⚠️</AlertIcon>
       <AlertText>
         Live mode requires an API key. 
         <Link to="/settings/api-keys">Add API key →</Link>
       </AlertText>
     </Alert>
   )}
   ```

3. Update test execution:
   ```typescript
   async function runTest() {
     setIsRunning(true);
     setError(null);
     
     try {
       const startTime = Date.now();
       
       const result = await testAgent(
         agent.id,
         { inputs: JSON.parse(inputJson), mode },
         workspace.id
       );
       
       const duration = Date.now() - startTime;
       
       setResults({
         ...result,
         durationMs: duration,
       });
       
       toast.success(`Test completed in ${duration}ms`);
     } catch (error) {
       setError(error.message);
       toast.error(`Test failed: ${error.message}`);
     } finally {
       setIsRunning(false);
     }
   }
   ```

4. Show detailed metrics:
   ```typescript
   <MetricsDisplay>
     <Metric>
       <MetricLabel>Tokens</MetricLabel>
       <MetricValue>{results.usage.totalTokens}</MetricValue>
       <MetricDetail>
         {results.usage.promptTokens} prompt + 
         {results.usage.completionTokens} completion
       </MetricDetail>
     </Metric>
     
     <Metric>
       <MetricLabel>Cost</MetricLabel>
       <MetricValue>${results.cost.toFixed(4)}</MetricValue>
     </Metric>
     
     <Metric>
       <MetricLabel>Latency</MetricLabel>
       <MetricValue>{results.latencyMs}ms</MetricValue>
     </Metric>
     
     <Metric>
       <MetricLabel>Model</MetricLabel>
       <MetricValue>{results.model}</MetricValue>
     </Metric>
   </MetricsDisplay>
   ```

**Verification**:
- [ ] Can toggle mock/live mode
- [ ] Shows warning if no API key
- [ ] Executes real AI call
- [ ] Shows detailed metrics
- [ ] Error messages clear and actionable

**Commit**: `feat(web): update test panel for live execution with metrics`

---

#### Step 3: Input/Output Schema Validation (2h)

**Tasks**:
1. Add JSON Schema editor to agent builder:
   ```typescript
   // components/agents/SchemaEditor.tsx
   export function SchemaEditor({ 
     schema, 
     onChange,
     type: 'input' | 'output'
   }) {
     // Visual schema builder
     // - Add field (name, type, required, description)
     // - Nested objects
     // - Arrays
     // - Validation rules
   }
   ```

2. Add schemas to agent config:
   ```typescript
   export const agents = pgTable('agents', {
     // ...
     inputSchema: jsonb('input_schema').$type<JSONSchema>(),
     outputSchema: jsonb('output_schema').$type<JSONSchema>(),
   });
   ```

3. Add validation middleware:
   ```typescript
   // lib/validation.ts
   export function validateAgainstSchema(
     data: any,
     schema: JSONSchema
   ): { valid: boolean; errors: string[] } {
     // Use Ajv or Zod for validation
   }
   ```

4. Update test panel to validate:
   ```typescript
   async function runTest() {
     // Validate input
     const validation = validateAgainstSchema(
       JSON.parse(inputJson),
       agent.inputSchema
     );
     
     if (!validation.valid) {
       setError(`Input validation failed: ${validation.errors.join(', ')}`);
       return;
     }
     
     // Continue with execution...
   }
   ```

**Verification**:
- [ ] Can define input schema
- [ ] Can define output schema
- [ ] Input validated before execution
- [ ] Clear validation errors shown
- [ ] Schema enforced at runtime

**Commit**: `feat(agents): add input/output schema validation`

---

#### Step 4: Agent Execution from Dashboard (1h)

**Tasks**:
1. Add "Run Agent" button to agent cards
2. Show execution modal with input form
3. Execute agent and show results
4. Link to execution history

**Verification**:
- [ ] Can execute agent from dashboard
- [ ] Input form matches schema
- [ ] Results displayed clearly
- [ ] Execution saved to history

**Commit**: `feat(web): add agent execution from dashboard`

---

#### Session 9 Deliverables

- ✅ Live agent test execution
- ✅ Test panel connected to real AI
- ✅ Input/output schema validation
- ✅ Agent execution from dashboard
- ✅ Full usage tracking
- ✅ Clear error messages

**Session 9 Handoff Document**: `session_9_handoff.md`

---

### 🧪 PHASE 9C: Testing & Polish (Session 10)

**Duration**: 2-3 hours  
**Branch**: `phase-9/testing-polish`  
**Goal**: Comprehensive testing and production readiness

#### Step 1: End-to-End Testing (1h)

**Test Scenarios**:

1. **Happy Path**:
   - [ ] Create agent with OpenAI
   - [ ] Add API key
   - [ ] Test agent (live mode)
   - [ ] Verify metrics tracked
   - [ ] Execute from dashboard
   - [ ] Check execution history

2. **Error Handling**:
   - [ ] Test without API key → clear error
   - [ ] Test with invalid API key → auth error
   - [ ] Test with rate limit → retry logic
   - [ ] Test with network error → retry then fail
   - [ ] Test with invalid input → validation error

3. **Edge Cases**:
   - [ ] Very large input (>100KB)
   - [ ] Empty input
   - [ ] Special characters in input
   - [ ] Concurrent executions
   - [ ] Switching between providers

4. **Security**:
   - [ ] Cannot access other workspace's agents
   - [ ] Cannot see other workspace's API keys
   - [ ] API keys encrypted in database
   - [ ] Execution logs tenant-scoped

**Verification**:
- All scenarios pass
- No console errors
- Proper error messages
- Security boundaries enforced

---

#### Step 2: Performance Optimization (30m)

**Tasks**:
1. Add database indexes:
   ```sql
   CREATE INDEX agent_execution_created_at_idx 
   ON agent_executions(created_at DESC);
   
   CREATE INDEX agent_execution_workspace_created_idx 
   ON agent_executions(workspace_id, created_at DESC);
   ```

2. Add API response caching for agent list
3. Optimize test panel re-renders
4. Add loading skeletons

**Verification**:
- [ ] Agent list loads <500ms
- [ ] Test execution feels instant
- [ ] No UI jank during execution

---

#### Step 3: Documentation (1h)

**Tasks**:
1. Update README with Phase 9 features
2. Create API key setup guide
3. Document schema editor usage
4. Add troubleshooting guide
5. Update deployment checklist

**Deliverables**:
- `docs/PHASE_9_COMPLETE.md`
- `docs/API_KEY_SETUP.md`
- `docs/TROUBLESHOOTING.md`

---

#### Step 4: Production Checklist (30m)

**Before Deploy**:
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] No console warnings
- [ ] API keys encrypted
- [ ] Rate limiting enabled
- [ ] Error tracking configured (Sentry)
- [ ] Backup database
- [ ] Rollback plan documented
- [ ] Team notified in Discord

---

#### Session 10 Deliverables

- ✅ Comprehensive testing complete
- ✅ Performance optimized
- ✅ Documentation updated
- ✅ Production checklist verified
- ✅ Phase 9 complete!

**Session 10 Handoff Document**: `session_10_handoff.md`

---

### 🧹 POST-PHASE 9: Remaining Debt (Session 11)

**Duration**: 2-3 hours  
**Branch**: `post-phase-9/cleanup`  
**Goal**: Clean up remaining medium priority technical debt

#### Tasks

1. **Rate Limiting Implementation** (1h)
   - Add Redis rate limiter
   - Configure per-workspace limits
   - Show rate limit status in UI

2. **Test History Persistence** (1h)
   - Add test_executions table
   - Show history in test panel
   - Compare previous runs

3. **Design System Cleanup** (30m)
   - Remove hardcoded styles
   - Consolidate to design system
   - Document patterns

---

## 📊 Success Metrics & KPIs

### Phase 9 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| TypeScript Errors | 0 | `pnpm typecheck` |
| Test Pass Rate | 100% | Manual testing checklist |
| API Response Time | <500ms | Browser DevTools |
| Agent Execution Time | <5s | Usage metrics |
| Error Rate | <1% | Execution logs |
| User Satisfaction | 9/10 | Jason feedback |

### Technical Debt Reduction

| Category | Before | After Phase 9 | After Post-Phase 9 |
|----------|--------|---------------|---------------------|
| Critical | 3 | 0 | 0 |
| High | 6 | 2 | 1 |
| Medium | 4 | 4 | 1 |
| Low | 3 | 3 | 3 |
| **Total** | **16** | **9** | **5** |

### Development Velocity

| Phase | Planned Hours | Actual Hours | Variance |
|-------|--------------|--------------|----------|
| Phase 1-7 | - | - | - |
| Phase 8 | 6h | 6h | 0% |
| Pre-Phase 9 | 4-6h | TBD | TBD |
| Phase 9A | 4-5h | TBD | TBD |
| Phase 9B | 4-6h | TBD | TBD |
| Phase 9C | 2-3h | TBD | TBD |
| **Total Phase 9** | **14-20h** | **TBD** | **TBD** |

---

## 🎯 Next Session Starter

### Session 7 Opening Message

> "Ready to tackle technical debt! I see we have 3 critical blockers before Phase 9:
> 1. TypeScript path resolution errors (49+ errors)
> 2. Clerk authentication integration (hardcoded tokens)
> 3. Database schema export issues
> 
> I've created a comprehensive plan to fix all critical debt in 4-6 hours.
> Should we start with the TypeScript errors to unblock type safety?"

---

## 📋 Quick Reference Checklists

### Pre-Phase 9 Checklist
- [ ] TypeScript errors: 0
- [ ] Clerk auth integrated
- [ ] Database schemas exported
- [ ] Dashboard tracking real data
- [ ] No implicit any types
- [ ] Clean `pnpm typecheck` output

### Phase 9A Checklist
- [ ] API key management UI
- [ ] Keys encrypted in database
- [ ] OpenAI provider implemented
- [ ] Anthropic provider implemented
- [ ] Usage tracking database
- [ ] Retry logic with backoff

### Phase 9B Checklist
- [ ] Live test execution working
- [ ] Test panel shows metrics
- [ ] Schema editor implemented
- [ ] Input validation enforced
- [ ] Agent execution from dashboard

### Phase 9C Checklist
- [ ] All test scenarios pass
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Production checklist verified

---

## 🚦 Risk Mitigation

### Identified Risks

1. **API Key Security**
   - Risk: Keys leaked in logs/errors
   - Mitigation: Never log full keys, mask in errors
   
2. **Rate Limiting**
   - Risk: Quota exhaustion
   - Mitigation: Implement workspace-level limits
   
3. **Cost Overruns**
   - Risk: Unexpected AI API costs
   - Mitigation: Usage alerts, monthly caps
   
4. **Scope Creep**
   - Risk: Phase 9 expands beyond plan
   - Mitigation: Strict adherence to checklist

---

## 📖 Lessons Learned

### From Phase 8

**What Worked**:
- ✅ Structured session handoffs
- ✅ Incremental commits
- ✅ Comprehensive testing checklists
- ✅ Mock-first approach

**What to Improve**:
- ⚠️ Fix TypeScript issues earlier
- ⚠️ Don't defer critical auth integration
- ⚠️ Set up proper package exports from start
- ⚠️ Run typecheck more frequently

### For Phase 9

**Best Practices**:
1. Fix all critical debt BEFORE starting features
2. Test auth integration end-to-end immediately
3. Verify TypeScript after every major change
4. Keep sessions focused (single responsibility)
5. Update handoff docs after each session

---

## 🎉 Conclusion

Phase 9 represents the transformation from **prototype to production**. By addressing technical debt strategically—fixing critical blockers first, then integrating debt fixes into Phase 9 work, and saving low-priority items for post-Phase 9—we maintain momentum while improving code quality.

**Total Investment**: 16-23 hours across 5 sessions  
**Expected Outcome**: Production-ready agent platform with live AI execution  
**Technical Debt Reduction**: 68% (16 → 5 items)

The plan is aggressive but achievable, especially with the 70-hour weekly development schedule. Each session has clear deliverables and verification criteria, ensuring steady progress and easy handoffs.

**Let's ship this! 🚀**

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2025  
**Next Review**: After Session 7 completion
