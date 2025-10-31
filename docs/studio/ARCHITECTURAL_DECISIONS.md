# AI Studio System - Architectural Decisions

**Document Version:** 1.0  
**Last Updated:** October 31, 2025  
**Status:** FINAL - Ready for Implementation

---

## Executive Summary

This document captures all critical architectural decisions made for the GalaxyCo AI Studio system - a comprehensive 3-page replacement for the current Agents page that will transform the platform into a visual-first, AI-powered workflow builder.

## 🎯 System Overview

**Goal:** Replace `/agents` page with a sophisticated 3-page system:

1. **Discover** - Template marketplace
2. **AI Lab** - Visual canvas builder (Design → Simulate → Test)
3. **LiveStream** - Real-time operations monitoring

**Key Innovation:** Floating AI Assistant that can perform ANY user action through natural language, enabling users of ALL technical levels to build complex automations.

---

## 📊 Critical Decisions

### Decision #1: Routing Strategy

**Decision:** Create new `/studio/*` routes alongside existing `/agents` route

**Rationale:**

- Allows gradual migration without breaking existing functionality
- `/agents` becomes "Legacy" while `/studio` is marked "New"
- Users can transition at their own pace
- Easy rollback if issues arise

**Routes:**

```
/studio/discover  → Template marketplace
/studio/lab       → Visual workflow builder
/studio/livestream → Real-time monitoring
/agents           → Legacy agent management (kept for backward compatibility)
```

**Impact:**

- Zero breaking changes
- Parallel systems during transition
- Data shared via same database tables (agents table used by both)

---

### Decision #2: Technology Stack

**Frontend Canvas Technology:**

- **React Flow** (@xyflow/react@12.8.6) - Already installed ✅
- **PixiJS** (v8.6.6) - For GPU-accelerated edge rendering
- **elkjs** (v0.9.3) - For intelligent auto-layout (runs in Web Worker)

**Why PixiJS over Three.js:**

- Simpler 2D rendering (our edges are 2D)
- Better performance for 2D graphics
- Smaller bundle size
- Easier integration with React Flow

**Why elkjs over Dagre:**

- Superior layout quality
- Better handling of complex graphs
- More layout algorithms available
- Active maintenance

**State Management:**

- **Zustand** (already installed) - Canvas state, UI state
- **XState** (v5.18.2) - Node lifecycle state machines
- **TanStack Query** (v5.59.16) - Server state, data fetching

**Why XState:**

- Perfect for node execution lifecycles (idle → pending → running → success/error)
- Visual state machine debugging
- Deterministic state transitions
- Built-in undo/redo capabilities

**Real-time Communication:**

- **Server-Sent Events (SSE)** over WebSockets

**Why SSE over WebSockets:**

- Simpler implementation
- Unidirectional (server → client) perfect for telemetry
- Auto-reconnection built-in
- Works with existing HTTP infrastructure
- No additional port configuration
- Better for read-heavy scenarios (LiveStream monitoring)

---

### Decision #3: Database Schema

**Decision:** Create new tables alongside existing `agents` table

**New Tables:**

```sql
- galaxy_grids         → Visual workflow definitions
- grid_nodes           → Individual nodes in workflows
- grid_edges           → Connections between nodes
- grid_versions        → Version control snapshots
- grid_executions      → Runtime execution telemetry
- execution_steps      → Individual node execution records
- grid_templates       → Marketplace templates
```

**Relationships:**

- `grid_nodes.agent_id` → `agents.id` (nodes can link to existing agents)
- Reuses workspace_id for multi-tenancy
- Maintains backward compatibility

**Why New Tables:**

- Clean separation of concerns
- Visual workflows are different from single agents
- Easier to version control
- Better performance (focused indexes)
- Flexibility for future features

---

### Decision #4: AI Assistant Architecture

**Decision:** Centralized Actions Registry with OpenAI GPT-4 interpreter

**Actions Registry Pattern:**

```typescript
interface Action {
  id: string; // 'canvas.create-node'
  name: string; // 'Create Node'
  description: string; // For AI interpretation
  inputSchema: z.ZodSchema; // Validation
  execute: (input, context) => Promise<Result>;
  undoable?: boolean;
  undo?: (result) => Promise<void>;
}
```

**AI Flow:**

```
User: "Create an AI node that summarizes customer feedback"
   ↓
OpenAI GPT-4 (with Actions Registry context)
   ↓
Returns: {
  action: {
    id: 'canvas.create-node',
    input: { type: 'ai', label: 'Customer Feedback Summarizer', config: {...} }
  }
}
   ↓
Review Card (user confirmation)
   ↓
Execute via Actions Registry
```

**Why This Approach:**

- Extensible (add new actions without changing AI logic)
- Testable (each action can be unit tested)
- Secure (validation via Zod schemas)
- Undoable (built-in undo support)
- Auditable (all actions logged)

**AI Provider:** OpenAI GPT-4 Turbo via existing AI Gateway service

---

### Decision #5: Performance Strategy

**Target:** 200+ nodes @ 60fps

**Techniques:**

1. **PixiJS for edges** (WebGL rendering, not DOM)
2. **React Flow for nodes** (DOM with virtualization)
3. **elkjs in Web Worker** (off main thread)
4. **Memoized selectors** (Zustand shallow equality)
5. **Debounced updates** (auto-save, viewport changes)
6. **Edge animation capping** (max 30 animated edges at once)

**Performance Budget:**

- Initial load: < 2s on 3G
- Canvas render: 16.6ms per frame (60fps)
- Action execution: < 500ms
- Auto-save debounce: 2 seconds

---

### Decision #6: Version Control System

**Decision:** Git-like versioning with snapshots

**Features:**

- Every publish creates a new version
- Full grid snapshot stored (nodes + edges + config)
- Diff viewer shows changes between versions
- One-click restore to any version
- Auto-save creates drafts (not versions)

**Why Snapshots over Deltas:**

- Simpler implementation
- Faster restore (no need to replay deltas)
- Easier debugging (complete state at any point)
- JSONB in Postgres is efficient for storage

---

### Decision #7: Multi-tenancy & Security

**Security Model:**

- All tables have `workspace_id` column
- Row-Level Security (RLS) policies in Postgres
- Actions Registry checks permissions
- Audit log for all AI Assistant actions

**Permission Levels:**

```typescript
- canvas:view    → View grids
- canvas:edit    → Edit grids
- grid:publish   → Publish to production
- grid:delete    → Delete grids
- templates:create → Create marketplace templates
```

---

### Decision #8: Template System

**Decision:** Curated marketplace with featured templates

**Template Structure:**

```typescript
{
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  gridSnapshot: { nodes, edges, config };
  useCount: number;
  rating: number;
  isFeatured: boolean;
}
```

**Categories:**

- Customer Success
- Sales & Marketing
- Support & Service
- Data Processing
- Integrations
- Custom Workflows

**Installation:**

- Creates a copy of the template
- Links to original via `parent_grid_id`
- Increments `useCount` on template
- User owns the copy (can modify freely)

---

### Decision #9: UI/UX Design System

**Visual Style:**

- **Glass morphism** throughout (backdrop-blur, semi-transparent cards)
- **Purple-to-blue gradient** primary colors
- **Isometric 3D** node visualization
- **Smooth animations** (framer-motion)
- **Dark mode first** with light mode support

**Node Visual Language:**

```
Trigger nodes  → Green gradient
AI nodes       → Purple gradient
Action nodes   → Blue gradient
Condition nodes→ Amber gradient
Error nodes    → Red gradient
```

**Edge Visual Language:**

```
Width (1-6px)  → Throughput (messages/sec)
Color          → Health (green → amber → red by error rate)
Style          → dashed = queued, dotted = retrying
Animation      → Speed maps to data flow rate
```

---

### Decision #10: Deployment Strategy

**Phased Rollout:**

**Phase 1 (Sprint 1, Week 1):**

- Database migrations
- Discover page + Templates API
- Basic canvas foundation

**Phase 2 (Sprint 2, Weeks 2-3):**

- Full canvas with PixiJS edges
- Simulation mode with timeline
- Version control

**Phase 3 (Sprint 3, Weeks 3-4):**

- LiveStream with SSE
- AI Assistant with Actions Registry
- Full integration & polish

**Launch Strategy:**

- Soft launch to Beta users first
- Collect feedback for 1 week
- Fix critical issues
- Full launch with announcement
- Keep `/agents` as legacy for 3 months
- Gradual migration messaging

---

## 📐 Technical Specifications

### Node Types (20+ Supported):

```
Triggers:      Schedule, Webhook, Email, Form Submit, Database Change
Actions:       HTTP Request, Database Query, Email Send, File Upload
AI:            GPT-4, Claude, Gemini, Custom LLM
Conditions:    If/Else, Switch, Try/Catch
Loops:         For Each, While, Until
Data:          Transform, Filter, Map, Reduce
Integrations:  Slack, Discord, Stripe, Shopify, etc.
Storage:       Save to DB, Save to File, Cache
Human:         Approval Gate, Manual Input
```

### Actions Registry (30+ Actions):

**Canvas Actions:**

- create-node, delete-node, move-node, duplicate-node
- connect-nodes, disconnect-nodes
- auto-layout, zoom-to-fit, select-all

**Node Actions:**

- configure-ai, configure-webhook, configure-condition
- update-label, update-description, update-config

**Grid Actions:**

- create-grid, delete-grid, publish-grid, archive-grid
- import-grid, export-grid, duplicate-grid

---

## 🔒 Security Considerations

**Secrets Management:**

- API keys encrypted at rest (AES-256-GCM)
- Never sent to client
- Scoped per workspace
- Audit trail for access

**AI Assistant Safety:**

- All actions require user confirmation (Review Card)
- Destructive actions flagged as "high risk"
- Rate limiting (10 actions/minute)
- Audit log with full context

**Multi-tenancy:**

- Strict workspace_id filtering
- RLS policies in Postgres
- No cross-tenant data exposure
- Logged as security incidents

---

## 📊 Success Metrics

**Performance:**

- Canvas FPS: ≥ 60
- Time to First Render: < 2s
- Action Latency: < 500ms
- Template Load Time: < 1s

**User Engagement:**

- Template Installation Rate: > 40%
- AI Assistant Usage: > 60% of users
- Average Workflow Complexity: 8+ nodes
- Workflow Publish Rate: > 30%

**Quality:**

- Error Rate: < 1%
- Uptime: > 99.9%
- User Satisfaction: > 4.5/5
- Time to Create First Workflow: < 5 minutes

---

## 🔄 Future Enhancements (V2)

**Not in MVP, but planned:**

- Collaborative editing (multiplayer canvas)
- Workflow marketplace (users publish templates)
- Advanced scheduling (cron expressions, delays)
- Workflow analytics (execution insights, bottlenecks)
- Visual debugging (step-through execution)
- Import from Zapier/Make.com
- Mobile app (view-only)
- Workflow templates AI generator

---

## 📚 References

**Documentation:**

- Galaxy Grids Master Doc: `C:\Users\Owner\OneDrive\Desktop\galaxy_grids_canvas_master_doc_build_spec_v_1.md`
- Project WARP.md: `/c/Users/Owner/workspace/galaxyco-ai-2.0/WARP.md`
- Database Schema: `packages/database/src/schema.ts`

**Inspiration:**

- Make.com (visual automation)
- n8n (workflow builder)
- Retool Workflows (enterprise automation)
- Zapier (ease of use)
- StackAI (AI-first design)

---

**Approved By:** Autonomous AI Decision (User granted full execution authority)  
**Implementation Start:** October 31, 2025  
**Target Completion:** November 28, 2025 (4 weeks)

---

## 🎉 Why This Will Succeed

1. **User Empowerment**: Anyone can build complex workflows with AI assistance
2. **Visual Clarity**: See entire automation landscape at a glance
3. **Production Ready**: Built-in testing, versioning, monitoring
4. **Fast Iteration**: Template marketplace enables rapid deployment
5. **Quality First**: 60fps performance, comprehensive testing, error boundaries
6. **Future Proof**: Extensible architecture, room for advanced features

This is not just an upgrade—it's a complete transformation of how users interact with AI automation. 🚀
