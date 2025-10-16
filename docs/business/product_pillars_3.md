# GalaxyCo.ai — Product Pillars (3.1)

## Purpose

Define the canonical system pillars of GalaxyCo.ai so design, engineering, and GTM execute the same model. Vision is anchored in StackAI (polish), OpenSea (cards/marketplace), OpenAI Agent Builder (friendly creation), and Sider (human knowledge UI). WSAO is the North Star; Packs and the Personal AI Assistant (PAA) are first‑class.

---

## Pillar Overview

1. **Agents** — single‑purpose AI workers with clear inputs, tools, knowledge, and KPIs.
2. **Packs** — curated, multi‑agent teams personalized from onboarding; the primary unit users manage.
3. **Marketplace** — discovery, rating, and installation of Agents and Packs.
4. **Builder (Dual‑Mode)** — Visual node editor + DSL editor with bidirectional sync and a test bench.
5. **Knowledge** — human‑friendly sources, coverage, citations, and explainability.
6. **Integrations & Tools** — connectors, auth, limits, retries, and simulation with sample data.
7. **Monitoring & Observability** — outcomes, traces, costs, latency, errors; WSAO dashboard.
8. **Governance & Compliance** — RBAC, versioning, audit, guardrails/redaction, on‑prem option.

---

## Pillar 1 — Agents

**Definition**: A narrowly focused AI capability that takes inputs, uses tools/knowledge, and produces outcomes with measurable KPIs.

**Object shape (minimum fields)**

```
agent {
  id, name, version, description,
  inputs[], outputs[],
  tools[], knowledge_refs[],
  policy { guardrails, redaction, rate_limits },
  kpis { success_rate, time_saved_avg, usage_count, last_updated },
  meta { creator_id, verified, changelog }
}
```

**UX requirements**

- Card shows title, purpose, attributes, KPIs, integrations, best pairings.
- CTAs: Add to Pack (primary), Preview with sample data (secondary).

**V1 acceptance**

- Agents execute reliably with traces, error surfaces, and success signals.
- KPIs computed and rendered on cards.

---

## Pillar 2 — Packs (Multi‑Agent Native)

**Definition**: A first‑class object representing a team of agents optimized for a persona/pain‑point cluster. Packs are the default install from onboarding.

**Object shape (minimum fields)**

```
pack {
  id, name, persona, description,
  agents[] { agent_id, enabled, priority },
  goals[] { metric, target },
  kpis { weekly_outcomes, success_rate, time_saved_total },
  synergy_tags[],
  recommendations { best_pairings[], marketplace_links[] }
}
```

**Rules**

- Auto‑composed from onboarding inputs; installs with sensible defaults.
- Users can toggle agents, reorder priorities, and set weekly goals.

**V1 acceptance**

- At least five Starter Packs ship (Founder Ops, Sales Ops, Support Excellence, Docs & Knowledge, Finance Ops).
- Each Pack achieves at least one outcome using sample data without integrations.

---

## Pillar 3 — Marketplace

**Definition**: The discovery surface for Agents and Packs with ratings, KPIs, and verified creators.

**Requirements**

- Filters: Persona, Industry, KPI, Integration, Popular, New.
- Sort: Trending, Highest Rated, Most Installed, Newest.
- Detail view: description, demo run, KPIs, changelog, dependencies, creator profile.
- Install flow: confirm required integrations; simulate with sample data if missing.

**V1 acceptance**

- Trending list and verified creator badges operational.
- Search is fuzzy and supports synonyms.

---

## Pillar 4 — Builder (Dual‑Mode)

**Definition**: A create/edit environment where users assemble or modify Agents and Packs via Visual nodes or a textual DSL.

**Visual mode**

- Nodes: Input, Tool, Decision, Knowledge, LLM, Output.
- Pan/zoom, minimap, snap‑to‑grid, inline node test.

**DSL mode**

- Schema‑validated editor with instant preview and linting.
- Bidirectional sync with Visual mode.

**Test bench**

- Run with fixtures; capture traces, tokens, latency, tool errors.

**Example DSL skeleton**

```
agent "Lead Follower" {
  inputs: [email_thread]
  tools: [gmail.search, hubspot.create_task]
  knowledge: [sales_playbook]
  policy: { guardrails: standard }
  flow {
    step retrieve_context -> knowledge.query(email_thread)
    step plan -> llm.plan(goals: ["follow_up", "schedule"], constraints: policy)
    if plan.requires_task -> hubspot.create_task(plan.details)
    output summary
  }
}
```

**V1 acceptance**

- Visual and DSL edits remain in sync; history with diffs and rollback.
- Test bench runs a sample flow; traces visible.

---

## Pillar 5 — Knowledge

**Definition**: Make what agents know **visible and approachable** with sources, coverage, and citations.

**Requirements**

- Sources view: tiles for Drive/Notion/URLs/PDFs with status and last sync.
- Coverage view: plain‑language “what’s indexed,” top topics, gaps.
- Explainability: every answer can show citations and “why used.”
- Ingestion: drag‑drop, progress, large file handling.

**V1 acceptance**

- Citations work end‑to‑end; coverage and gaps displayed.

---

## Pillar 6 — Integrations & Tools

**Definition**: Connectors that enable agents to act in external systems.

**Requirements**

- OAuth and API‑key auth flows; saved securely.
- Retries with backoff; rate‑limit handling; circuit breakers.
- Simulation with sample data when not connected.

**V1 acceptance**

- Core set online (Gmail, Slack, HubSpot/Salesforce, Notion, Google Drive).
- Error states and recovery surfaced in UI and traces.

---

## Pillar 7 — Monitoring & Observability

**Definition**: Measure outcomes, reliability, speed, and cost across Agents and Packs.

**Requirements**

- Event taxonomy: onboarding, installs, toggles, outcomes (success/failure), costs, latency, tool calls.
- Dashboards: **WSAO per workspace**, success rate, p95 latency, \$/outcome.
- Tracing: step‑level visibility through tools and knowledge.

**V1 acceptance**

- North Star dashboard live; weekly WSAO job running; alerts on error/latency thresholds.

---

## Pillar 8 — Governance & Compliance

**Definition**: Ship enterprise‑ready controls without UX drag.

**Requirements**

- RBAC roles for workspace, Packs, knowledge edits.
- Versioning, approvals, audit logs; rollback.
- Guardrails and redaction modes; on‑prem deployment path.

**V1 acceptance**

- RBAC enforced; audit trail visible; rollback works; redaction toggle available.

---

## Cross‑Cutting Non‑Goals (V1)

- No NFT/crypto mechanics; marketplace is work‑centric.
- No heavy 3D or cartoon mascots; keep playful but professional.
- No mandatory integrations before value is shown.

---

## V1 Scope Summary (Ship Gate)

- Guided onboarding ≤90s → personalized dashboard + Starter Pack installed.
- Five Starter Packs; Packs toggleable and outcome‑capable with sample data.
- Marketplace with cards, filters, search, verified badges, and install flow.
- Builder with Visual + DSL, bidirectional sync, and test bench.
- Knowledge with sources, coverage, and citations.
- Integrations (core set) with retries and simulation.
- Monitoring with WSAO dashboard, traces, and budgets.
- Governance with RBAC, audit, rollback, and redaction.

---

## Sequencing Notes

- MVP: onboarding, personalized dashboard, 5 Packs, marketplace browse+install, visual builder basics, knowledge ingestion with citations, WSAO instrumentation.
- V1: DSL + sync, test bench, more connectors, verified creators, pack KPIs, governance layers.
- V2: auto‑tuning agents, pack evolution suggestions, creator analytics, monetized marketplace.
