# Phase 8: Agent Builder UI — Detailed Plan

**Status**: 🟡 Ready to Start  
**Estimated Time**: 6-8 hours  
**Dependencies**: ✅ Phase 7 Complete (Onboarding + Starter Packs)  
**Priority**: 🔥 Critical Path — Core Product Feature

---

## 🎯 Vision & Goals

### What We're Building
A **visual agent creation interface** that makes building custom AI agents as easy as using ChatGPT, with the power and flexibility developers need.

### Success Criteria
- [ ] User can create an agent in <5 minutes without reading docs
- [ ] Pre-built templates reduce time-to-first-agent to <60 seconds
- [ ] Test mode allows validation before going live
- [ ] All agents follow the standard schema (from `packages/database/schema.ts`)
- [ ] Zero code required for basic agents

### Design Inspiration
- **OpenAI Playground**: Clean, focused, progressive disclosure
- **StackAI**: Professional polish, clear information hierarchy
- **Retool**: Powerful but approachable configuration

---

## 📋 Feature Breakdown

### 1. Agent Builder Page (`/agents/new`)
**Estimated**: 2 hours

#### Layout
```
┌─────────────────────────────────────────┐
│  ← Back to Agents    [Test] [Save Draft]│
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Basic Info ──────────────────────┐ │
│  │  Name: [________________]         │ │
│  │  Icon: [🤖]  Description: [____]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─ Configuration ──────────────────┐  │
│  │  Trigger:   [Webhook ▾]          │  │
│  │  AI Model:  [GPT-4 ▾]            │  │
│  │  System Prompt: [____________]   │  │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─ Input/Output Schema ────────────┐  │
│  │  Define what your agent needs    │  │
│  │  and produces                    │  │
│  └───────────────────────────────────┘ │
│                                         │
│  [Cancel]  [Save Draft]  [Publish] ──► │
└─────────────────────────────────────────┘
```

#### Components to Build
- `AgentBuilderPage.tsx` - Main container
- `BasicInfoForm.tsx` - Name, icon, description
- `ConfigurationForm.tsx` - Trigger, AI provider, model, prompt
- `SchemaBuilder.tsx` - Input/output JSON schema editor
- `AdvancedSettings.tsx` - Timeout, retries, rate limits

#### Form State Management
```typescript
interface AgentBuilderState {
  basicInfo: {
    name: string;
    icon: string;
    description: string;
    tags: string[];
  };
  configuration: {
    trigger: 'webhook' | 'schedule' | 'manual';
    aiProvider: 'openai' | 'anthropic' | 'custom';
    model: string;
    systemPrompt: string;
    temperature: number;
  };
  schema: {
    inputs: JsonSchema;
    outputs: JsonSchema;
  };
  advanced: {
    timeout: number;
    maxRetries: number;
    rateLimit?: RateLimit;
  };
}
```

#### Validation Rules
- Name: 3-50 characters, required
- Description: 10-500 characters, required
- System Prompt: 20-2000 characters, required
- Icon: Single emoji or URL
- Model: Must be valid for selected provider

---

### 2. Template Library
**Estimated**: 1.5 hours

#### Template Selector Modal
```
┌─────────────────────────────────────────┐
│  Start from a Template                  │
├─────────────────────────────────────────┤
│  Search: [________________] [x]         │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │📧 Email  │  │📄 Doc    │  │🎫 Ticket││
│  │Analyzer  │  │Summarizer│  │Triage   ││
│  │          │  │          │  │         ││
│  │"Parse &  │  │"Extract  │  │"Auto-   ││
│  │ classify"│  │ key..."  │  │classify"││
│  └──────────┘  └──────────┘  └────────┘│
│                                         │
│  [Start from Scratch]                   │
└─────────────────────────────────────────┘
```

#### Template Structure
```typescript
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'content' | 'support' | 'sales' | 'ops';
  prefilledConfig: Partial<AgentBuilderState>;
  sampleInputs: Record<string, any>;
  expectedOutputs: Record<string, any>;
}
```

#### Templates to Include (from Starter Packs)
1. **Email Analyzer** (Founder Ops)
   - Parse emails, extract action items
   - Pre-filled prompt for inbox scanning
   
2. **Document Summarizer** (Docs & Knowledge)
   - Extract key points from long docs
   - Output: summary, key points, questions
   
3. **Ticket Triage** (Support Excellence)
   - Classify & prioritize support tickets
   - Pre-filled: priority rubric, categories
   
4. **Lead Enrichment** (Sales Ops)
   - Research company/contact info
   - Pre-filled: data sources, format
   
5. **Follow-up Writer** (Sales Ops)
   - Personalized outreach emails
   - Pre-filled: tone, structure

#### Components
- `TemplateLibrary.tsx` - Grid view with search/filter
- `TemplateCard.tsx` - Individual template preview
- `TemplatePreview.tsx` - Detailed view before selection
- Template constants in `lib/constants/agent-templates.ts`

---

### 3. Test Mode
**Estimated**: 1.5 hours

#### Test Panel (Right Sidebar)
```
┌─────────────────────────────────┐
│  🧪 Test Your Agent             │
├─────────────────────────────────┤
│  Input:                         │
│  ┌─────────────────────────────┐│
│  │ {                           ││
│  │   "email": "...",           ││
│  │   "subject": "..."          ││
│  │ }                           ││
│  └─────────────────────────────┘│
│                                 │
│  [Run Test] ──────────────────► │
│                                 │
│  Status: ✅ Success (1.2s)      │
│                                 │
│  Output:                        │
│  ┌─────────────────────────────┐│
│  │ {                           ││
│  │   "priority": "high",       ││
│  │   "category": "bug"         ││
│  │ }                           ││
│  └─────────────────────────────┘│
│                                 │
│  📊 Token Usage: 450 tokens     │
│  💰 Cost: $0.0023               │
└─────────────────────────────────┘
```

#### Features
- **Mock Mode**: Use deterministic fixtures (no AI calls)
- **Live Mode**: Real AI provider calls (shows cost preview)
- **History**: Last 5 test runs preserved
- **Export**: Download test results as JSON
- **Performance**: Show latency breakdown

#### Components
- `TestPanel.tsx` - Right sidebar container
- `TestInput.tsx` - JSON editor for inputs
- `TestOutput.tsx` - Formatted result display
- `TestHistory.tsx` - Previous run list
- `TestMetrics.tsx` - Performance & cost display

#### Implementation
```typescript
interface TestResult {
  id: string;
  timestamp: Date;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  success: boolean;
  error?: string;
  metrics: {
    durationMs: number;
    tokensUsed: number;
    costUsd: number;
  };
}
```

---

### 4. Agent List Page (`/agents`)
**Estimated**: 1 hour

#### Layout
```
┌─────────────────────────────────────────┐
│  Your Agents               [+ New Agent]│
├─────────────────────────────────────────┤
│  [Active] [Draft] [Paused] [All]        │
│  Search: [___________] 🔍               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🤖 Email Analyzer       [•Active]│  │
│  │ Parse emails & extract actions   │  │
│  │ ──────────────────────────────── │  │
│  │ 156 runs  •  98% success  •  3.2s│  │
│  │ Last run: 2m ago                 │  │
│  │ [View] [Edit] [Pause] [•••]     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 📄 Doc Summarizer      [•Active] │  │
│  │ Extract key points from docs     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [Load More...]                         │
└─────────────────────────────────────────┘
```

#### Features
- Filter by status (Active, Draft, Paused)
- Search by name/description
- Sort by: Recent, Most Used, Success Rate
- Bulk actions: Pause/Resume/Delete multiple
- Quick stats on each card

#### Components
- `AgentListPage.tsx` - Main container
- `AgentListFilters.tsx` - Status tabs + search
- `AgentListItem.tsx` - Individual agent card
- `AgentListEmpty.tsx` - Empty state with CTA

---

### 5. API Endpoints
**Estimated**: 1.5 hours

#### NestJS Controller: `agents.controller.ts`

```typescript
@Controller('agents')
@UseGuards(AuthGuard)
export class AgentsController {
  @Post()
  async create(@User() userId: string, @Workspace() workspaceId: string, @Body() data: CreateAgentDto) {
    // Validate schema
    // Create agent record
    // Return created agent
  }

  @Get()
  async list(@User() userId: string, @Workspace() workspaceId: string, @Query() filters: AgentFiltersDto) {
    // Multi-tenant query with workspace filter
    // Return paginated list
  }

  @Get(':id')
  async get(@Param('id') id: string, @Workspace() workspaceId: string) {
    // Validate workspace access
    // Return agent details
  }

  @Put(':id')
  async update(@Param('id') id: string, @Workspace() workspaceId: string, @Body() data: UpdateAgentDto) {
    // Validate ownership
    // Update agent
    // Return updated agent
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Workspace() workspaceId: string) {
    // Soft delete
    // Return success
  }

  @Post(':id/test')
  async test(@Param('id') id: string, @Workspace() workspaceId: string, @Body() testData: TestAgentDto) {
    // Run agent with test inputs
    // Return result + metrics
  }
}
```

#### DTOs (Data Transfer Objects)
```typescript
class CreateAgentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @IsEnum(['webhook', 'schedule', 'manual'])
  trigger: string;

  @IsEnum(['openai', 'anthropic'])
  aiProvider: string;

  @IsString()
  model: string;

  @IsString()
  @MinLength(20)
  systemPrompt: string;

  @IsObject()
  inputs: JsonSchema;

  @IsObject()
  outputs: JsonSchema;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
```

---

### 6. Database Integration
**Estimated**: 30 minutes

#### Schema (Already Exists!)
```typescript
// From packages/database/src/schema.ts
export const agents = pgTable('agents', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  description: text('description'),
  trigger: text('trigger', { enum: ['webhook', 'schedule', 'manual', 'event'] }).notNull(),
  aiProvider: text('ai_provider', { enum: ['openai', 'anthropic', 'custom'] }),
  model: text('model'),
  systemPrompt: text('system_prompt'),
  inputs: jsonb('inputs').$type<JsonSchema>(),
  outputs: jsonb('outputs').$type<JsonSchema>(),
  settings: jsonb('settings'),
  isActive: boolean('is_active').default(true),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### Queries to Implement
- **Create**: Insert new agent with workspace isolation
- **List**: Get all agents for workspace with filters
- **Get**: Retrieve single agent by ID + workspace
- **Update**: Modify agent (validate ownership)
- **Delete**: Soft delete (set `is_active = false`)
- **Stats**: Aggregate run counts, success rates

---

## 🗂️ File Structure

```
apps/web/
├── app/
│   ├── agents/
│   │   ├── page.tsx              # List view
│   │   ├── new/
│   │   │   └── page.tsx          # Builder
│   │   └── [id]/
│   │       ├── page.tsx          # Detail view
│   │       └── edit/
│   │           └── page.tsx      # Edit existing
│   └── api/
│       └── agents/
│           ├── route.ts          # POST /api/agents (create)
│           └── [id]/
│               └── route.ts      # GET/PUT/DELETE
├── components/
│   └── agents/
│       ├── AgentBuilderPage.tsx
│       ├── BasicInfoForm.tsx
│       ├── ConfigurationForm.tsx
│       ├── SchemaBuilder.tsx
│       ├── TestPanel.tsx
│       ├── TemplateLibrary.tsx
│       ├── TemplateCard.tsx
│       ├── AgentListItem.tsx
│       └── AgentCard.tsx         # Already exists!
├── lib/
│   ├── constants/
│   │   └── agent-templates.ts
│   └── actions/
│       └── agent-actions.ts
└── hooks/
    └── use-agent-builder.ts

apps/api/
└── src/
    ├── agents/
    │   ├── agents.controller.ts
    │   ├── agents.service.ts
    │   ├── agents.module.ts
    │   └── dto/
    │       ├── create-agent.dto.ts
    │       ├── update-agent.dto.ts
    │       └── test-agent.dto.ts
    └── guards/
        └── auth.guard.ts         # Already exists!
```

---

## 📝 Step-by-Step Implementation Plan

### Step 1: Database & API Foundation (1 hour)
- [ ] Create DTOs in `apps/api/src/agents/dto/`
- [ ] Implement `AgentsService` with CRUD operations
- [ ] Build `AgentsController` with all endpoints
- [ ] Test with Postman/Thunder Client
- [ ] Verify multi-tenant isolation works

### Step 2: Agent Templates (1 hour)
- [ ] Create `agent-templates.ts` with 5 templates
- [ ] Build `TemplateLibrary.tsx` component
- [ ] Build `TemplateCard.tsx` component
- [ ] Add "Start from Template" flow
- [ ] Test template application to builder

### Step 3: Builder UI - Basic (1.5 hours)
- [ ] Create `AgentBuilderPage.tsx` layout
- [ ] Build `BasicInfoForm.tsx` (name, icon, description)
- [ ] Build `ConfigurationForm.tsx` (trigger, model, prompt)
- [ ] Add form validation
- [ ] Wire up to API (save draft)

### Step 4: Builder UI - Advanced (1 hour)
- [ ] Build `SchemaBuilder.tsx` (JSON schema editor)
- [ ] Add advanced settings panel
- [ ] Implement autosave (debounced)
- [ ] Add "Publish" flow with confirmation

### Step 5: Test Mode (1.5 hours)
- [ ] Build `TestPanel.tsx` sidebar
- [ ] Implement mock mode with fixtures
- [ ] Implement live mode (calls Python agent service)
- [ ] Add test history
- [ ] Display metrics (tokens, cost, latency)

### Step 6: Agent List Page (1 hour)
- [ ] Create `AgentListPage.tsx`
- [ ] Build filters (status, search, sort)
- [ ] Implement pagination
- [ ] Add bulk actions
- [ ] Wire up to API

### Step 7: Polish & Testing (1 hour)
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement success toasts
- [ ] Add keyboard shortcuts (Cmd+S to save)
- [ ] End-to-end test: Create → Test → Publish
- [ ] Verify workspace isolation

---

## 🎨 UI/UX Details

### Color Coding
- **Draft**: Gray (`colors.neutral[500]`)
- **Active**: Green (`colors.success.DEFAULT`)
- **Paused**: Yellow (`colors.warning.DEFAULT`)
- **Error**: Red (`colors.error.DEFAULT`)

### Animations
- Form transitions: 200ms ease
- Card hover: 120ms ease-out
- Test run: Pulse effect during execution
- Success state: Confetti animation (optional)

### Loading States
- **Save Draft**: "Saving..." with spinner
- **Publish**: "Publishing..." with progress bar
- **Test**: "Running test..." with animated dots
- **Delete**: "Deleting..." with fade out

### Error Handling
- Form validation errors: Inline below fields
- API errors: Toast notification (top-right)
- Network errors: Retry button + explanation
- Schema errors: JSON syntax highlighting

---

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] User can create a new agent from scratch
- [ ] User can create agent from template (<60s)
- [ ] User can test agent before publishing
- [ ] User can save drafts and resume later
- [ ] User can edit existing agents
- [ ] User can pause/resume agents
- [ ] User can delete agents (soft delete)
- [ ] Multi-tenant isolation enforced everywhere

### Performance Requirements
- [ ] Builder page loads in <1s
- [ ] Template selection applies in <200ms
- [ ] Save/update operations complete in <500ms
- [ ] Test mode (mock) returns in <100ms
- [ ] Test mode (live) returns in <5s (with streaming)

### Security Requirements
- [ ] All API endpoints require authentication
- [ ] Workspace ID validated on every request
- [ ] Users can only access their workspace's agents
- [ ] System prompts sanitized (no injection)
- [ ] Test mode rate-limited (10 tests/minute)

---

## 🚀 Success Metrics (Track These!)

### Product Metrics
- **Time to First Agent**: Target <5 minutes
- **Template Usage Rate**: Target >60% use templates
- **Test Before Publish**: Target >80% test before publishing
- **Agent Activation Rate**: Target >70% drafts → active

### Technical Metrics
- **API Response Time**: p95 <500ms
- **Error Rate**: <1% failed requests
- **Test Success Rate**: >95% tests execute successfully
- **Database Query Time**: p95 <100ms

---

## 🐛 Known Risks & Mitigation

### Risk 1: JSON Schema Builder Complexity
**Impact**: High  
**Mitigation**: Start with simple text input; add visual builder in Phase 9

### Risk 2: Test Mode Cost
**Impact**: Medium  
**Mitigation**: Default to mock mode; require explicit opt-in for live tests with cost warning

### Risk 3: Form State Management
**Impact**: Medium  
**Mitigation**: Use React Hook Form + Zod for validation; debounce autosave

### Risk 4: Multi-Step Builder Abandonment
**Impact**: Low  
**Mitigation**: Autosave drafts; show progress indicator; allow "save & continue later"

---

## 📚 References

- **Database Schema**: `packages/database/src/schema.ts`
- **Design System**: `apps/web/lib/constants/design-system.ts`
- **Starter Packs**: `apps/web/lib/constants/onboarding.ts`
- **Agent Specs**: `starter_pack_specs_v_1_prds_5.md`
- **UI Components**: `apps/web/components/ui/`

---

## 🔄 Post-Phase 8 Roadmap

**Phase 9**: Agent Execution Engine (Python service integration)  
**Phase 10**: Personal AI Assistant (PAA) for contextual help  
**Phase 11**: Marketplace (discover & install community agents)  
**Phase 12**: Analytics Dashboard (agent performance metrics)

---

**Ready to build? Let's ship this! 🚀**
