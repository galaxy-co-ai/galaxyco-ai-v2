# GalaxyCo.ai — Community Strategy (5.1)

## Purpose

Build a durable ecosystem around **Agents**, **Packs**, and **Extensions** that accelerates product quality, drives discovery, and reduces support load. Community is a **product surface**, not just a channel. Anchored inspirations: **StackAI** (enterprise polish), **OpenSea** (card marketplace), **OpenAI Agent Builder** (friendly building), **Sider** (human knowledge UI).

---

## Principles

- **Outcome-first**: Celebrate outcomes (WSAO), not vanity activity.
- **Transparency**: KPIs on cards, citations, changelogs, and verification tiers.
- **Safety-by-default**: Approvals, RBAC, redaction; zero tolerance for data abuse.
- **Low-friction creation**: Templates, Sim Mode, test fixtures, and a Creator Console.
- **Community + Product loop**: Every contribution improves recommendations and defaults.

---

## Community Segments

- **Creators**: Individuals/teams publishing Agents, Packs, and Extensions.
- **Practitioners**: Users installing Packs to get work done (Sales, Support, Ops, Finance, PM).
- **Partners**: Tool vendors contributing Connectors/Actions; service firms building Packs.

---

## Contribution Types (V1)

- **Agents** and **Packs** (primary)
- **Templates**: onboarding flows, DSL snippets, test fixtures
- **Knowledge Blueprints**: starter coverage sets (with IP-safe public docs)
- **Tutorials/Playbooks**: short, cited guides mapped to persona JTBD

> V2 adds monetized listings and deep creator analytics.

---

## Programs

### 1) **Launch Founders (Cohort 001)**

- Invite 15–30 early creators across our six personas.
- Deliverables: 2 Packs each + fixtures + Sim Mode demo.
- Benefits: Verified badge on day-one, spotlight, direct PM/Design office hours.

### 2) **Creator Labs** (monthly)

- 2–3 week sprints on a theme (e.g., Support Excellence).
- Provide dataset stubs, prompts, and acceptance tests.
- Outcome: 10+ new/updated listings that pass QS thresholds.

### 3) **Showcase & Reviews** (bi‑weekly)

- Live demo of top‑performing Packs; publish write‑ups with KPIs and traces.
- Encourage practitioners to leave lightweight reviews after successful outcomes.

### 4) **Quests & Badges**

- Time‑boxed tasks (e.g., “Add citations to your Pack,” “Ship a coverage gap fix”).
- Badges: **Verified**, **Staff Pick**, **Trending**, **Recently Updated**, **Reliability 95%+**.

### 5) **Office Hours** (weekly)

- 60‑minute open session with PM/Design/Eng. Prioritize creators in review queues.

---

## Creator Experience (V1)

- **Creator Console**: submissions, telemetry (success %, p95, $/outcome), QS breakdown, reviews, changelog editor.
- **Submission Checklist**: metadata, capabilities, safety scopes, Sim Mode demo, telemetry wiring, changelog.
- **CI Aids**: validity checks for manifests/DSL; fixtures generator; golden flow tests.
- **Growth Loops**: built‑in share card; “Install from trace”; PAA prompts satisfied users to review.

---

## Discovery & Social Proof

- **Collections**: themed staff-curated sets (Founder Ops Starter, Support Excellence, Sales Velocity).
- **Spotlights**: homepage row for Trending and Recently Updated.
- **Reviews**: restricted to installed users; tagged by persona; surfaced on detail pages.
- **Changelogs**: prominent; recency affects ranking.

---

## Governance & Safety (aligned with 5.2)

- **Verification tiers**: Community → Verified → Enterprise (security attestations).
- **Enforcement ladder**: Notice → Demotion → Quarantine → Removal → Account action.
- **Policy**: IP, privacy, TOS‑respectful data collection; zero scraping against tool TOS.
- **Moderation**: report tools; SLA: 48h review; instant quarantine for severe violations.

---

## PAA in the Community Loop

- **Recommend**: higher‑QS Packs that fit persona/tools/coverage gaps.
- **Coach creators**: alert on failing QS components (e.g., success rate or latency) and suggest fixes.
- **Prompt reviews**: after outcome success/uninstall; keep prompts short and contextual.
- **Quality ops**: flag underperformers in a workspace; propose safer alternatives.

---

## Education & Content

- **Academy track**: Quickstarts by persona (Founder Ops, Sales Ops, etc.) with copy‑paste DSL and fixtures.
- **Playbooks**: “From zero to weekly report,” “Triage tickets with citations,” each mapped to JTBD.
- **Templates**: Onboarding question sets, Pack shells, approval policy presets.

---

## Events Calendar (first 90 days)

- **Week 0**: Publish contributor guide + Creator Console.
- **Week 1–2**: Launch Founders (Cohort 001) onboarding + office hours.
- **Week 3**: First Showcase; open Creator Labs theme #1 (Support Excellence).
- **Week 5**: Release Staff Picks #1; announce badge criteria.
- **Week 6–8**: Labs #2 (Sales Velocity); expand Verified creators.
- **Week 9–12**: Labs #3 (Ops Automation); publish QS leaderboard by category.

---

## Metrics & Targets (V1)

- **Supply**: 50+ public listings; ≥ 20 Verified; ≥ 5 Enterprise‑ready by end of Q1.
- **Quality**: median QS ≥ 70; preview success ≥ 99%; success rate median ≥ 80%.
- **Demand**: ≥ 500 installs; ≥ 40% active usage at D7; ≥ 25% review rate after outcomes.
- **Loop health**: ≥ 60% of installs originate from Collections/Spotlights/PAA suggestions.

---

## Resourcing & Ops

- **Community PM/Lead** (0.5 FTE in MVP, 1.0 post‑launch) + moderation rotation.
- **Creator support queue** integrated into issue tracker; SLA published by tier.
- **Templates & fixtures** maintained by Product; versioned with the platform.

---

## Risks & Mitigations

- **Low‑quality flood** → strict listing gates; QS‑weighted ranking; PAA flags.
- **Creator fatigue** → Labs themes, badges, spotlights, simple submission UX.
- **Support overhead** → Sim Mode demos reduce repro steps; office hours bundle answers.
- **Fragmentation** → Collections + staff picks + QS unify discovery.

---

## V1 Acceptance Criteria

- Community hub live with contributor guide, Creator Console, and report tools.
- Listing gates enforced (telemetry, Sim Mode demo, changelog, scopes).
- Verification tiers and badges visible in marketplace; Collections/Spotlights operational.
- At least **50** listings live, **20+ Verified**, **500+ installs**, **D7 active ≥ 40%**.
- PAA recommending listings and prompting reviews based on outcomes.

---

## Non‑Goals (V1)

- Monetary payouts, revenue share, or ad placements (reserved for V2 Creator Program).
- Public API for external storefronts; off‑platform distribution.
- Deep forum/community moderation platform build (use a lightweight hub first; expand later).
