# Master Playbook & Build Handoff — GalaxyCo.ai V1

## 1) What this is

Single, copy‑ready brief that stitches our foundation into a build plan Warp can execute immediately. Keep this pinned next to the repo and share with contractors.

---

## 2) Canonical vision (one page)

- **Promise**: _Make multi‑agent AI useful in minutes._
- **How**: ≤90s onboarding → personalized **Dashboard** → **Starter Pack** installed → **PAA** watches, self‑heals, and coaches → marketplace **Packs/Agents** to expand → dual‑mode **Builder** (Visual ↔ DSL) → **citations & KPIs** everywhere.
- **Inspiration set**: StackAI (polish) · OpenSea (card marketplace) · OpenAI Agent Builder (friendly building) · Sider (human knowledge UI).

---

## 3) What we’ve finished (source of truth)

- 1.1 Company Vision Document
- 1.2 Product North Star Statement
- 1.3 Design Inspiration & UX Principles
- 1.4 User Onboarding Flow (Complete Spec V1)
- 1.5 Differentiation Blueprint
- 2.1 Personas
- 2.2 JTBD / Pain Maps
- 2.3 Positioning & Messaging (Revised)
- 3.1 Product Pillars (updated intro)
- 3.2 Multi‑Agent Orchestration Model (PAA by default)
- 3.3 Knowledge & Explainability Model
- 3.4 Extensibility Model (Hybrid)
- 3.5 Feature Roadmap (MVP→V1→V2)
- 4.2 Wireframes / Screen Specs
- 5.1 Community Strategy
- 5.2 Marketplace Policy & Quality
- 5.3 GTM Plan
- 5.4 Pricing & Business Model
- 6.1 Security & Compliance Charter
- 6.3 Internal Dev Workflow (Warp)

> If any title above differs in canvas, treat this list as the canonical set.

---

## 4) Tech stack (executive summary)

- **Web**: Next.js + React + TS + Tailwind + shadcn/ui (Vercel)
- **API**: NestJS (Auth/RBAC, Packs/Agents, Approvals, Marketplace, Billing)
- **Agents**: Python workers (LangGraph), Blackboard state, citations preserved
- **DB**: Postgres (+ pgvector); **Cache/Queue**: Redis; **Blob**: S3
- **Orchestration**: BullMQ (MVP) → Temporal Cloud (V1)
- **Observability**: OpenTelemetry → Datadog/Grafana; Sentry for errors; Langfuse/Helicone for LLM traces
- **Auth**: Clerk → WorkOS (SSO/SCIM V1)
- **Billing**: Stripe (tiers + WSAO credits)

---

## 5) MVP cut (ship gate)

- Onboarding ≤90s; **Starter Pack + PAA** auto‑installed; dashboard never blank
- Marketplace browse/install; demo runs in **Sim Mode**
- Builder Visual basics; DSL stub + round‑trip sync plan
- Knowledge ingestion with citations; Coverage view basics
- Approvals & audit trail; redaction modes
- WSAO instrumentation; Monitoring & Traces page

---

## 6) Work Breakdown (build order)

1. **Foundations**
   - Repo scaffold (Turbo monorepo), CI, envs, auth, RBAC, basic billing stubs
   - Event schema (`plan_*`, `outcome_*`, `trace_*`, `paa_*`)
2. **Onboarding + Dashboard**
   - 6‑step intake (role, pains, outcomes, tools, sensitivity, summary)
   - Personalized dashboard with Today/PAA/KPI/Activity/Knowledge/Integrations
3. **Packs + PAA**
   - Starter Pack auto‑composition rules; agent toggles and priorities
   - PAA watchtower + Weekly Review; approvals workflow
4. **Marketplace**
   - Card grid (filters/sorts), detail page (demo preview, KPIs, changelog, reviews)
   - Install flow with Sim Mode; verification badges
5. **Builder**
   - Visual nodes (Input/Tool/Decision/Knowledge/LLM/Output), properties panel, Test Bench
   - DSL schema + live preview (V1 milestone)
6. **Knowledge**
   - Sources tiles (Drive/URLs/PDFs), sync and status
   - Coverage view; citations inline for answers and traces
7. **Monitoring & Traces**
   - Outcome list → trace timeline; p95, success %, cost; retry/rollback hooks
8. **Governance & Security**
   - Approvals queue; redaction; audit; versioning/rollback; data export
9. **Pricing & Entitlements**
   - Free Sim Mode; Pro/Team/Business; WSAO meters and budget bars; bundles

---

## 7) Sprint 0 (week 1–2) — concrete tasks

- **Infra & CI**: repos, Vercel app, AWS accounts, Postgres/Redis/S3, Secrets manager, GitHub Actions
- **Auth/RBAC**: Clerk wiring; roles: owner/admin/builder/user/viewer; seeded test users
- **Events**: define JSON schema; emit from API and workers; wire Datadog dashboards
- **Onboarding**: static flow with Sim Mode preview; Starter Pack install stub
- **PAA v0**: right‑rail suggestions; log issues; no auto‑apply
- **Marketplace v0**: grid + filters; install stub; badges static
- **Builder v0**: Visual canvas with 4 node types; run dummy fixture; show trace JSON
- **Knowledge v0**: upload file → parse → store chunks with source spans → basic retrieval + citations
- **Observability**: OTel traces; Sentry; WSAO dashboard shell

---

## 8) Sprint 1–2 (week 3–6) — V1 features

- **DSL + round‑trip**; Test Bench with token/latency
- **Approvals live**; redaction modes; audit exports
- **Pack KPIs**; PAA Weekly Review apply‑changes flow
- **Verified creators**; QS ranking (success, usage, freshness, perf, trust, explainability, safety)
- **Monitoring**: retry/rollback; error taxonomy surfacing in UI
- **Billing**: subscription gates + WSAO credit overage; budget notifications

---

## 9) Acceptance criteria (V1 recap)

- ≥70% signups get Pack + PAA in ≤90s; ≥60% achieve one WSAO in ≤10 min
- Median WSAO/week ≥ 3 by Week 1; success rate ≥ 85%; p95 outcome ≤ 12s
- Citations visible on all answers; traces link outcomes → steps → tools → sources
- Approvals enforced for destructive scopes; rollback works
- Marketplace ranking by QS; reviews restricted to installed users

---

## 10) Warp handoff (what to create in Drive today)

- **/Onboarding**: `<repo>-kickoff.md` with architecture, commands, release plan
- **/Workflows**: `dev:start`, `test:unit`, `lint:fix`, `typecheck`, `e2e`, `release:dry-run`, `release:prod`, `rollback`
- **/Prompts**: commit/PR templates, changelog‑from‑diffs, bugfix playbook
- **/Rules/Global**: coding standards, security tenets, UX writing
- **/Rules/Project/<repo>**: WARP.md with PR checklist, module conventions

**Note**: In the **Internal Dev Workflow (Warp)** doc, update the Daily Loop step to read: “Attach context with `@` to reference Drive objects.”

---

## 11) Open decisions (please mark)

- Primary model provider for MVP (OpenAI vs Anthropic)
- Hosting region(s) for data residency path (future V2)
- Initial connector set for Starter Packs (pick 3 for MVP)
- Langfuse vs Helicone for LLM trace/costs

---

## 12) Risk register (top 5)

- **Setup friction** → Sim Mode defaults everywhere; PAA concierge
- **Me‑too noise in marketplace** → strict listing gates; QS ranking; staff Collections
- **Latency/cost drift** → budgets per outcome; model routing; observability gates
- **Trust gap** → KPIs on cards; citations; Test Bench in Builder
- **Governance blockers** → approvals, audit, redaction shipped in V1; SOC2 plan underway

---

## 13) Next click

- Approve this handoff → I’ll generate the **Turbo monorepo**, **Terraform starters**, and the **Warp Drive kit** (Kickoff Notebook + 10 core Workflows + Rules + Prompts).
