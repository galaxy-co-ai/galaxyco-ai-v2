# GalaxyCo.ai — Feature Roadmap (3.5)

## Purpose

Define **what ships when** so design, engineering, and GTM can execute with shared expectations and clear acceptance gates. Grounded in our North Star (WSAO), PAA for every user, multi‑agent Packs, guided onboarding ≤90s, and enterprise polish with tasteful play.

---

## Guiding Constraints

* **North Star**: Weekly Successful Agent Outcomes (WSAO) per active workspace.
* **TTFV**: First successful outcome ≤ 10 minutes from signup (sim data allowed).
* **Onboarding**: 6‑step flow ≤ 90 seconds.
* **Performance**: p95 outcome latency ≤ 12s (V1), retrieval p95 < 500ms.
* **Trust**: KPIs + citations visible; approvals for destructive scopes.

---

## MVP (Foundations to Prove Value)

**Goal**: New users get a working dashboard and a Starter Pack that can deliver **one successful outcome** using sample data.

**Scope**

* **Onboarding (6 steps)** with persona, industry, pain points, tools, sensitivity, summary.
* **Personalized Dashboard** with Today Panel, KPI Snapshot, Agent Activity, Knowledge Coverage, Integrations, Quick Create.
* **PAA (Personal AI Assistant)** provisioned at signup; suggests next best actions; weekly review stub.
* **Starter Packs (≥5)**: Founder Ops, Sales Ops, Support Excellence, Docs & Knowledge, Finance Ops.
* **Agent & Pack Cards (v1)**: title, purpose, attributes, KPIs placeholders, integrations, best pairings; Add to Pack / Preview.
* **Marketplace (browse + install)**: filters (persona, industry), trending list, search (basic), install with **Sim Mode** if unauthenticated.
* **Knowledge (v1)**: Sources tiles, ingestion, citations attached to answers.
* **Builder (visual basics)**: nodes for Input/LLM/Tool/Output; simple run; history stub.
* **Integrations (core)**: Gmail, Slack, HubSpot/Salesforce, Notion, Google Drive (auth + retries).
* **Instrumentation**: WSAO events; first dashboards for WSAO, success rate, p95 latency.
* **Governance (basics)**: RBAC roles, version stamp, audit trail stub.

**Acceptance**

* ≥ 60% of new workspaces complete onboarding and achieve one outcome in ≤10 min.
* Dashboard never blank; example data present until tools connect.
* Citations visible; Pack installed by default; PAA visible with at least one suggestion.

---

## V1 (Reliability, Depth, and Trust)

**Goal**: Production‑ready experience for SMB/departmental buyers; dual‑mode building; measurable pack efficacy.

**Scope**

* **Builder (dual‑mode)**: DSL editor with schema validation; bidirectional sync with visual; **Test Bench** and **Traces** (tokens, latency, tool calls); rollback.
* **PAA (watchtower + self‑healing)**: monitors failures/latency, retries, proposes fixes; weekly D+7 review; approval queue.
* **Marketplace (quality)**: verified creators, ratings & reviews, robust filters/sorts, dependency checks.
* **Pack KPIs**: weekly outcomes, success rate, time saved; goals and progress.
* **Knowledge (coverage & confidence)**: Coverage View, confidence score, gap detection; PAA suggests coverage tasks.
* **Integrations**: broaden connector set; simulation fixtures required.
* **Governance**: approvals for destructive scopes; audit logs; redaction modes; exportable traces.
* **Performance**: p95 outcome ≤ 12s; retrieval p95 < 500ms; action p95 ≤ 2s.

**Acceptance**

* **WSAO** median per active workspace ≥ 3 by Week 1; trend up by Week 4.
* DSL/Visual edits stay in sync; Test Bench runs golden flows; rollbacks work.
* Verified creator flow live; marketplace install success rate ≥ 95%.

---

## V2 (Intelligence, Scale, and Ecosystem)

**Goal**: Autonomous improvement, enterprise readiness at scale, creator economy.

**Scope**

* **Auto‑tuning**: agents learn from outcomes; PAA proposes/auto‑applies safe parameter updates.
* **Pack evolution**: recommendations to add/remove/reorder agents; cohort suggestions from marketplace trends.
* **Multi‑LLM routing**: cost/latency/quality‑aware; per‑step model policies.
* **Creator analytics & monetization**: installs, outcomes generated, rev share; enterprise verification tiers.
* **Enterprise**: SSO (SAML/OIDC), SCIM, data residency controls, on‑prem packaging.
* **Experiments**: A/B of workflows; outcome uplift reporting.
* **Admin console**: org‑level budgets, approvals, guardrails.

**Acceptance**

* Demonstrated outcome uplift from auto‑tuning in ≥2 core Packs.
* Creator monetization pilot with verified partners.
* Enterprise pilots live with SSO/SCIM and residency controls.

---

## Sequencing & Milestones (Textual)

* **M0 (Week 0–2)**: Onboarding scaffold, dashboard shell, card components, WSAO events.
* **M1 (Week 3–5)**: Starter Packs, marketplace browse/install, Sim Mode, core integrations, citations.
* **M2 (Week 6–8)**: PAA basics, visual builder basics, performance passes, MVP ship.
* **M3 (Week 9–12)**: DSL editor + sync, Test Bench & Traces, verified creators, governance, V1 ship.
* **M4+ (Post‑V1)**: auto‑tuning, multi‑LLM, creator analytics, enterprise features → V2 pilots.

---

## Dependencies

* Cards before marketplace; marketplace before creator verification.
* Sources & citations before Knowledge Coverage/Confidence.
* Instrumentation before KPIs/WSAO dashboards.
* Policy Engine before approvals and destructive actions.

---

## Risks & Mitigations

* **No‑code ceiling** → dual‑mode builder with DSL and escape hatches.
* **Marketplace noise** → verification tiers, KPI‑weighted ranking, telemetry requirements.
* **Agent fatigue (me‑too Packs)** → focus on **personalization quality** and **PAA coaching**.
* **Integration fragility** → retries, circuit breakers, Sim Mode, golden flow CI.

---

## Non‑Goals (for V1)

* NFT/crypto mechanics; heavy 3D; mandatory integrations before value.

---

## Success Checklist (Gate to Ship Each Stage)

**MVP**

* [ ] Guided onboarding ≤90s, dashboard never blank
* [ ] Starter Packs (≥5) installed by default; at least one outcome via Sim Mode
* [ ] PAA present with suggestions; citations visible
* [ ] WSAO events live; basic dashboards in place

**V1**

* [ ] DSL + Visual sync; Test Bench & Traces; rollbacks
* [ ] Verified creators; ratings/reviews; robust marketplace filters
* [ ] Pack KPIs live; Coverage View + confidence score; PAA coverage tasks
* [ ] Governance: approvals, audit, redaction; performance budgets met

**V2**

* [ ] Auto‑tuning & Pack evolution suggest/apply safe changes
* [ ] Multi‑LLM routing; A/B experiments; creator analytics
* [ ] Enterprise SSO/SCIM/residency; admin console; monetization pilot
