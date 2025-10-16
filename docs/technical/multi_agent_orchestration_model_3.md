# GalaxyCo.ai — Multi‑Agent Orchestration Model (3.2)

## Purpose

Specify **how agents collaborate** to deliver outcomes, including roles, protocols, state, safety, and telemetry. This model **must** be used across Builder, Packs, and Marketplace. Incorporates the requirement that **each new user is assigned a Personal AI Assistant (PAA)** at signup to ensure no one is ever stuck.

---

## Core Roles & Topology

- **PAA — Personal AI Assistant (per user, always‑on)**\
  Concierge + overseer for the user’s workspace. Detects issues, suggests improvements, tunes Packs, and escalates when needed.
- **Planner**\
  Breaks goals into tasks; selects/creates Packs and agents; defines success criteria.
- **Specialists (Agents)**\
  Domain experts (e.g., lead follow‑up, report generation, ticket triage). Execute steps with tools/knowledge.
- **Critic/Evaluator**\
  Validates outputs against policies, KPIs, and user intent; may request revisions.
- **Router**\
  Chooses which agent handles a subtask; handles hand‑offs.
- **Tool Runner**\
  Executes API calls with retries/backoff; enforces rate limits and sandboxes.

**Topology**: Star around a **Blackboard** (shared state) and **Event Bus**. PAA and Planner coordinate; Specialists read/write to Blackboard; Critic subscribes to outputs; Router dispatches.

---

## Runtime Architecture

- **Conversation Bus**: streams user intents, system prompts, Pack instructions.
- **Blackboard State**: normalized JSON store for current plan, subtasks, artifacts, citations, and status per step.
- **Memory Store**: short‑term (session), Pack memory, and long‑term org memory; vectorized with aging/TTL.
- **Policy Engine**: guardrails, redaction, RBAC scopes, approval thresholds.
- **Event Bus**: emits structured events for traces, KPIs, costs, errors.

---

## Collaboration Protocols

1. **Intake**\
   Triggered by: user prompt, schedule, webhook, or PAA watch.
2. **Decompose & Plan** (Planner)
   - Create plan with steps, owners, tools, success signals, budgets (latency, cost).
   - Write plan to Blackboard; notify Router.
3. **Dispatch** (Router)
   - Assigns steps to Specialists; enforces data/tool scopes via Policy Engine.
4. **Execute** (Specialist + Tool Runner)
   - Retrieve context (Knowledge); call tools with retries and circuit breakers.
   - Write artifacts + citations to Blackboard.
5. **Evaluate** (Critic)
   - Validate outputs vs. success signals/KPIs; request fix‑ups; escalate if needed.
6. **Summarize & Commit** (PAA)
   - Record outcome; update KPIs; notify user with options (approve, schedule next, improve).

**Success Signals**: user approval, downstream state change (e.g., ticket closed), KPI delta, validation heuristics.

---

## PAA — Personal AI Assistant (Always‑On)

**Purpose**: Ensure progress, remove friction, and continuously improve the user’s Pack.

**Responsibilities**

- **Watchtower**: Monitor failures, latency spikes, drift; open issues with repro and suggested fixes.
- **Self‑Healing**: Retry with alternative tools/models; fall back to cached patterns; propose edits to agents or Pack settings.
- **Coach**: Suggest new agents/Packs from Marketplace based on usage and gaps; surface “Next best actions.”
- **Concierge**: During onboarding, helps connect tools and verify goals; later, runs weekly reviews.
- **Guard**: Enforce data scopes; require approval for destructive actions unless user enables auto‑approve.

**Boundaries**

- No destructive tool actions without explicit approval (unless **Auto‑Approve** is on for that scope).
- Cannot expand data scope without user consent.

---

## State & Memory Model

- **Session Memory**: conversation‑level context; cleared or compressed after completion.
- **Pack Memory**: accumulated preferences, prompts, and learned routines for a Pack.
- **Org Memory**: shared assets (playbooks, report templates) with RBAC.
- **Aging**: vector store with recency bias; automatic summarization to control cost.

---

## Safety, Policy & Governance

- **RBAC**: workspace, Pack, agent, and knowledge edit permissions.
- **Guardrails**: blocked tool operations, redaction (PII/PHI), model policies.
- **Approvals**: per‑scope thresholds; draft → approve → apply.
- **Auditability**: immutable trace with event IDs; diff history; rollback of Pack/agent versions.

---

## Performance & Cost Budgets

- **Latency**: p95 per outcome ≤ 12s V1; show real‑time step latencies in traces.
- **Cost**: max tokens/outcome and \$/outcome caps; dynamic model routing (fast/cheap vs. accurate/slow).
- **Concurrency**: queue with priorities per Pack; backpressure when tool limits hit.

---

## Error Handling & Self‑Healing

- **Taxonomy**: tool_error, rate_limit, model_error, knowledge_miss, policy_block.
- **Remediation**: exponential backoff, alternate model/tool, narrower query, human‑assist request.
- **Escalation**: PAA opens an issue with reproduction, context, and recommended fix or marketplace suggestion.

---

## Telemetry & Instrumentation

- Emit events: `plan_created`, `step_started`, `tool_called`, `step_failed`, `step_fixed`, `outcome_success`, `outcome_failure`, `paa_suggestion`, `pack_change`, `cost_update`.
- Update **WSAO** counter on `outcome_success`; attach: agent_id, pack_id, latency, tokens, \$cost, success_signal, citations hash.
- Traces show step graph with inputs/outputs (redacted as needed).

---

## V1 Acceptance Criteria

- PAA provisioned for every new user at signup; visible in Dashboard with status and suggestions.
- Orchestrator supports **plan → dispatch → execute → evaluate → summarize** loop across at least **3 Specialists**.
- Blackboard state, traces, and citations available for every outcome.
- Self‑healing handles at least **tool_error** and **rate_limit** without user intervention; logs remediation.
- Approvals enforced for destructive scopes; audit log + rollback functional.
- Performance budgets met (p95 ≤ 12s) and **WSAO** updates recorded.

---

## Non‑Goals (V1)

- Autonomous expansion of data scopes; complex human‑in‑the‑loop workflows beyond approve/deny; long‑running background jobs beyond scheduled tasks and retries.

---

## Example Orchestration (Pseudocode DSL)

```
plan "Weekly Sales Follow‑ups" {
  goals: ["send follow‑ups", "schedule calls"],
  success: ["emails_sent>=10", "meetings_scheduled>=3"],
  budget: { p95_latency: 12s, cost: "$2/outcome" }

  step harvest_threads -> specialist("inbox_scanner").run(gmail.search:{label:"followup"})
  step enrich -> specialist("crm_enricher").run(hubspot.lookup:{threads:harvest_threads})
  step compose -> specialist("writer").run(llm.generate:{style:"brief"}, knowledge:[sales_playbook])
  step send -> specialist("sender").run(gmail.send:{batch:true}) requires approve("send_emails")

  critic.validate(outputs:[send], signals:[deliverability, replies_pred])
  paa.summarize(kpis:[emails_sent, time_saved], suggestions:["add lead_qualifier agent"])
}
```

---

## Sequence (Textual)

1. User or schedule triggers intent → Planner drafts plan.
2. Router assigns steps; Specialists execute with Tool Runner.
3. Critic validates; on fail, remediation or escalate.
4. PAA summarizes, updates KPIs, proposes improvements.

---

## Default Pack + PAA Interplay

- Onboarding installs **Starter Pack** + **PAA**.
- PAA runs a **D+7 review**: reports outcomes, flags bottlenecks, proposes agent adds/removals from Marketplace, and can apply changes with approval.
