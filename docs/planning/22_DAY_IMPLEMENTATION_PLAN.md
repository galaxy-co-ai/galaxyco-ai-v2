# GalaxyCo.ai - 22-Day Implementation Plan

**Last Updated**: January 10, 2025  
**Status**: Phase 1.1 - COMPLETE ✅  
**Current Day**: Day 3 (Phase 1.1 Complete, Ready for Phase 1.2)

---

## 🎯 Executive Summary

This document tracks the complete 22-day plan to build:

1. **AI Intelligence Foundation** (Days 1-10): LangGraph + Specialist Agents + PAA + Model Router
2. **Calm Dashboard** (Days 11-16): "Today" Focus View + PAA Integration + Calm Notifications
3. **Real-Time Polish** (Days 17-22): SSE Streaming + Gamification + Testing + Documentation

**Design Principles** (from research):

- Progressive disclosure over information overload
- Calm technology over notification spam
- Task-first over feature-first
- Outcomes over conversations
- Intelligence without clutter

---

## 📊 Progress Tracking

### Phase 1: AI Intelligence Foundation (Days 1-10)

#### ✅ Phase 1.1: LangGraph Orchestrator (Days 1-3) - **COMPLETE** ✅

**Files Created:**

- ✅ `services/agents/core/orchestrator.py` (696 lines, full implementation)
- ✅ `services/agents/core/__init__.py` (exports for clean imports)
- ✅ `services/agents/tests/test_orchestrator.py` (161 lines, comprehensive tests)
- ✅ `services/agents/paa/__init__.py` (placeholder for Phase 1.3)
- ✅ `services/agents/specialists/__init__.py` (placeholder for Phase 1.2)
- ✅ `services/agents/tests/__init__.py`
- ✅ `services/agents/requirements.txt` (updated with all dependencies)
- ⏳ `apps/web/app/api/agents/approve/[workflow_id]/route.ts` (deferred to Phase 2)

**Success Criteria:**

- [x] Graph executes PAA → Planner → Specialist → Critic → Summary workflow
- [x] State persists across steps with SQLite checkpointing
- [x] Can resume from checkpoint after failure
- [x] Human approval workflow blocks and resumes (infrastructure ready)
- [x] All imports working correctly
- [x] Dependencies installed (langgraph, langgraph-checkpoint-sqlite, langchain, openai, anthropic)

**Implementation Highlights:**

- Full async/await throughout for performance
- TypedDict state schema with comprehensive type hints
- 7 node functions: paa_intake, human_approval, planner, router, specialist, critic, paa_summarize
- 3 conditional routing functions for approval gates and retry logic
- Proper error handling with fallback responses
- Cost and latency tracking at each step
- Test suite with unit and integration tests

**Implementation Details:**

```typescript
// State Schema (Zod)
const AgentState = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  messages: z.array(z.custom<BaseMessage>()),
  currentStep: z.string(),
  outcomes: z.array(z.object({
    agentId: z.string(),
    result: z.any(),
    timestamp: z.date()
  })),
  metrics: z.object({
    totalCost: z.number(),
    totalLatency: z.number(),
    successCount: z.number()
  })
});

// Workflow Graph Structure
START
  → paa_intake (analyze request)
  → planner (break into subtasks)
  → router (select specialist)
  → specialist (execute with approval gate)
  → critic (evaluate result)
  → paa_summarize (generate user summary)
  → END
```

**Next Actions:**

1. Create directory structure: `services/agents/core/`
2. Install LangGraph: `cd services/agents && pip install langgraph`
3. Create `orchestrator.py` with StateGraph implementation
4. Set up SQLite checkpointer
5. Write unit tests

---

#### ⬜ Phase 1.2: Specialist Agents (Days 4-6) - **NOT STARTED**

**Files to Create:**

- `services/agents/specialists/lead_qualifier.py`
- `services/agents/specialists/email_composer.py`
- `services/agents/specialists/data_enricher.py`
- `services/agents/specialists/__init__.py`
- `services/agents/tests/test_specialists.py`

**Lead Qualifier Agent:**

```python
# OpenAI Function Schema (Strict Mode)
{
  "type": "function",
  "name": "qualify_lead",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "lead_score": {"type": "integer", "minimum": 0, "maximum": 100},
      "qualification_level": {
        "type": "string",
        "enum": ["hot", "warm", "cold", "unqualified"]
      },
      "next_action": {
        "type": "string",
        "enum": ["immediate_contact", "nurture_campaign", "disqualify"]
      },
      "reasoning": {"type": "string"}
    },
    "required": ["lead_score", "qualification_level", "next_action", "reasoning"],
    "additionalProperties": false
  }
}
```

**Success Criteria:**

- [ ] Each agent produces valid structured outputs
- [ ] Strict mode prevents schema violations
- [ ] Agents integrate with orchestrator
- [ ] Tool results flow through shared state

---

#### ⬜ Phase 1.3: PAA Background Service (Days 7-9) - **NOT STARTED**

**Files to Create:**

- `services/agents/paa/watchtower.py`
- `services/agents/paa/optimizer.py`
- `services/agents/paa/healer.py`
- `services/agents/tests/test_paa.py`

**Database Migrations Needed:**

```sql
-- Migration: 001_create_paa_suggestions.sql
CREATE TABLE paa_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact VARCHAR(20) CHECK (impact IN ('low', 'medium', 'high')),
  effort VARCHAR(20) CHECK (effort IN ('quick', 'moderate', 'complex')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dismissed_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE,
  auto_fixed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_paa_suggestions_workspace ON paa_suggestions(workspace_id);
CREATE INDEX idx_paa_suggestions_active ON paa_suggestions(workspace_id, dismissed_at, applied_at)
  WHERE dismissed_at IS NULL AND applied_at IS NULL;

-- Migration: 002_create_paa_activity_log.sql
CREATE TABLE paa_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_paa_activity_log_workspace ON paa_activity_log(workspace_id, created_at DESC);
```

**Success Criteria:**

- [ ] Watchtower detects issues every 5 minutes
- [ ] Optimizer generates AI-powered suggestions daily
- [ ] Healer auto-fixes known issues
- [ ] All activity logged to database

---

#### ⬜ Phase 1.4: Model Router (Days 9-10) - **NOT STARTED**

**Files to Create:**

- `apps/web/lib/ai-gateway/router.ts`
- `apps/web/lib/ai-gateway/router.test.ts`

**Model Selection Logic:**

```typescript
interface TaskCharacteristics {
  taskType: "analysis" | "generation" | "reasoning" | "classification";
  priority: "speed" | "quality" | "balance";
  complexity: "simple" | "moderate" | "complex";
  budget?: "low" | "moderate" | "high";
}

class IntelligentModelRouter {
  selectModel(chars: TaskCharacteristics): string {
    // Simple + Speed → gpt-4o-mini (fast, cheap)
    if (chars.complexity === "simple" && chars.priority === "speed") {
      return "gpt-4o-mini";
    }

    // Complex Reasoning → claude-3-5-sonnet (excellent reasoning)
    if (chars.complexity === "complex" && chars.taskType === "reasoning") {
      return "claude-3-5-sonnet-20241022";
    }

    // Creative Generation → claude (quality)
    if (chars.taskType === "generation") {
      return chars.budget === "low"
        ? "claude-3-5-haiku-20241022"
        : "claude-3-5-sonnet-20241022";
    }

    // Default: gpt-4o-mini (cost-effective)
    return "gpt-4o-mini";
  }

  getFallbackModel(primary: string): string {
    const fallbacks = {
      "gpt-4o": "claude-3-5-sonnet-20241022",
      "gpt-4o-mini": "claude-3-5-haiku-20241022",
      "claude-3-5-sonnet-20241022": "gpt-4o",
      "claude-3-5-haiku-20241022": "gpt-4o-mini",
    };
    return fallbacks[primary] || "gpt-4o-mini";
  }
}
```

**Success Criteria:**

- [ ] Router selects optimal model per task
- [ ] Automatic fallback on failures
- [ ] Cost optimized for simple tasks
- [ ] Model selection logged

---

### Phase 2: Calm Dashboard (Days 11-16)

#### ⬜ Phase 2.1: "Today" Focus View (Days 11-13) - **NOT STARTED**

**Files to Create:**

- `apps/web/app/dashboard/page.tsx` (replace existing)
- `apps/web/components/dashboard/ActionInbox.tsx`
- `apps/web/components/dashboard/MyWork.tsx`
- `apps/web/components/dashboard/Upcoming.tsx`
- `apps/web/components/dashboard/AssistantSuggestions.tsx`
- `apps/web/components/dashboard/ProgressStrip.tsx`
- `apps/web/components/dashboard/CommandPalette.tsx`

**Dashboard Layout:**

```tsx
// Single-column, keyboard-first layout
<div className="max-w-4xl mx-auto py-8 px-4 space-y-4 bg-neutral-50">
  {/* 5 Essential Cards */}
  <ActionInbox items={actionItems} />
  <MyWork tasks={prioritizedTasks} />
  <Upcoming items={upcomingItems} />
  <AssistantSuggestions suggestions={paaSuggestions} />
  <ProgressStrip metrics={progressMetrics} />

  {/* Command Palette (⌘K) */}
  <CommandPalette />
</div>
```

**Keyboard Shortcuts:**

- `A` = Do (complete immediately)
- `D` = Delegate (assign to someone)
- `S` = Schedule (defer to specific time)
- `W` = Watch (monitor without action)
- `⌘K` = Command palette

**Success Criteria:**

- [ ] Dashboard displays real AI outcomes
- [ ] All keyboard shortcuts functional
- [ ] Single column, clean layout
- [ ] Delightful empty states
- [ ] Loads in <2 seconds

---

#### ⬜ Phase 2.2: PAA Integration (Days 14-15) - **NOT STARTED**

**Files to Create:**

- `apps/web/app/api/paa/suggestions/[id]/apply/route.ts`
- `apps/web/app/api/paa/suggestions/[id]/dismiss/route.ts`
- `apps/web/components/dashboard/SuggestionCard.tsx`

**API Endpoints:**

```typescript
// POST /api/paa/suggestions/{id}/apply
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const suggestion = await db.query.paaSuggestions.findFirst({
    where: eq(paaSuggestions.id, id),
  });

  // Execute suggestion logic
  await executeSuggestion(suggestion);

  // Mark as applied
  await db
    .update(paaSuggestions)
    .set({ appliedAt: new Date() })
    .where(eq(paaSuggestions.id, id));

  return Response.json({ success: true });
}
```

**Success Criteria:**

- [ ] PAA suggestions visible with real data
- [ ] Apply button executes and confirms
- [ ] Dismiss button removes from view
- [ ] Empty state when workspace healthy

---

#### ⬜ Phase 2.3: Calm Notifications (Days 15-16) - **NOT STARTED**

**Files to Create:**

- `apps/web/lib/notifications/calm-notifications.ts`
- `apps/web/app/api/notifications/digest/route.ts`
- `apps/web/app/settings/notifications/page.tsx`

**Database Migrations:**

```sql
-- Migration: 003_create_notification_queue.sql
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  action_url TEXT,
  batch_window_minutes INTEGER NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notification_queue_scheduled ON notification_queue(scheduled_for)
  WHERE sent_at IS NULL;

-- Migration: 004_create_notification_badges.sql
CREATE TABLE user_notification_badges (
  user_id UUID NOT NULL REFERENCES users(id),
  badge_type VARCHAR(50) NOT NULL,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_type)
);
```

**Notification Levels:**

- **Ambient**: Badge count only (agent_completed, task_updated)
- **Batch**: Digest every 2 hours (mention, comment, review_requested)
- **Immediate**: Push now (approval_required, sla_breach, system_error)

**Success Criteria:**

- [ ] No toast spam
- [ ] Batch digests every 2 hours
- [ ] Immediate only for critical
- [ ] User preferences configurable
- [ ] Quiet hours respected

---

### Phase 3: Real-Time Polish (Days 17-22)

#### ⬜ Phase 3.1: SSE Outcomes Stream (Days 17-18) - **NOT STARTED**

**Files to Create:**

- `apps/web/app/api/outcomes/stream/route.ts`
- `apps/web/hooks/useAgentOutcomes.ts`
- `apps/web/components/dashboard/RecentOutcomes.tsx`

**SSE Implementation:**

```typescript
// Server-Sent Events endpoint
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Subscribe to workspace events
  const unsubscribe = eventBus.subscribe(workspaceId, (event) => {
    writer.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // Cleanup on disconnect
  req.signal.addEventListener("abort", () => {
    unsubscribe();
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

**Success Criteria:**

- [ ] Real-time updates as agents execute
- [ ] Live activity indicator pulses
- [ ] Resilient to network issues
- [ ] Graceful fallback to polling

---

#### ⬜ Phase 3.2: Gamification (Days 19-20) - **NOT STARTED**

**Database Migrations:**

```sql
-- Migration: 005_create_progress_metrics.sql
CREATE TABLE user_progress_metrics (
  user_id UUID NOT NULL REFERENCES users(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  metric_name VARCHAR(50) NOT NULL,
  value INTEGER NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (user_id, metric_name, date)
);

-- Migration: 006_create_milestones.sql
CREATE TABLE user_milestones_achieved (
  user_id UUID NOT NULL REFERENCES users(id),
  milestone_type VARCHAR(50) NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, milestone_type)
);
```

**Anti-Patterns to AVOID:**

- ❌ No fake urgency
- ❌ No guilt trips
- ❌ No social comparison
- ❌ No endless progression
- ❌ No nag notifications

**Success Criteria:**

- [ ] Metrics displayed accurately
- [ ] Milestones celebrate appropriately
- [ ] No dark patterns
- [ ] User can disable celebrations

---

#### ⬜ Phase 3.3: Testing & Docs (Days 21-22) - **NOT STARTED**

**Tests to Write:**

- Integration: End-to-end workflow tests
- Performance: Dashboard <2s, agent <10s latency
- Security: Multi-tenant isolation, SQL injection
- Edge cases: Empty data, large datasets, network failures

**Documentation to Create:**

- `docs/DEVELOPMENT.md`: Architecture, how to add agents
- `docs/DEPLOYMENT.md`: Pre-deployment checklist, rollback
- `docs/USER_GUIDE.md`: Dashboard walkthrough, shortcuts
- `docs/RUNBOOK.md`: Common issues, troubleshooting

**Final Deployment Checklist:**

- [ ] All smoke tests pass on staging
- [ ] Sentry error count <5 in 24h
- [ ] Database migrations applied
- [ ] Agent success rate ≥85%
- [ ] Dashboard load time <2s
- [ ] All keyboard shortcuts work
- [ ] SSE real-time updates functional
- [ ] PAA suggestions display correctly
- [ ] Calm notifications batch properly
- [ ] Documentation complete
- [ ] Rollback plan documented
- [ ] Team notified in Discord

---

## 🔥 Quick Reference

### Current Status

**Day**: 0 (Planning Complete)  
**Next Phase**: 1.1 - LangGraph Orchestrator  
**Blocked**: None  
**Notes**: Ready to begin execution

### Key Commands

```bash
# Start Python agent service
cd services/agents && uvicorn app:app --reload

# Install LangGraph
cd services/agents && pip install langgraph

# Run tests
cd services/agents && pytest

# Create database migration
npm run db:migration:create -- migration_name

# Run migrations
npm run db:migrate
```

### Important Files

- Todo List: This conversation + Warp todo system
- Implementation Plan: `docs/planning/22_DAY_IMPLEMENTATION_PLAN.md` (this file)
- Dashboard Research: Provided in user message (Calm Technology principles)
- AI Docs: `~/OneDrive/Desktop/Docs for Warp Drive Ai/`

---

## 📝 Session Handoff Template

When starting a new session, paste this:

```
I'm continuing the 22-Day GalaxyCo.ai Implementation Plan.

Current Status:
- Day: [X]
- Phase: [Phase X.X - Name]
- Last Completed: [Task]
- Currently Working On: [Task]
- Blocked: [None/Issues]

Please read:
1. docs/planning/22_DAY_IMPLEMENTATION_PLAN.md
2. docs/planning/SESSION_HANDOFF.md (if exists)
3. WARP.md (project rules)

Ready to continue.
```

---

**Last Updated By**: AI Agent (Claude 4.5 Sonnet)  
**Next Review**: After Phase 1.1 completion
