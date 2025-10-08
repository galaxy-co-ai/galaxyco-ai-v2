## Product North Star Statement&#x20;

### North Star (One‑Liner)

**Make multi‑agent AI useful in minutes.** A new user answers a few questions and instantly gets a personalized dashboard with a Starter Pack of agents that *deliver measurable outcomes on Day 1* — and improve each week.

### Expanded North Star

GalaxyCo.ai combines **StackAI’s enterprise polish**, **OpenSea’s card‑driven discovery**, **OpenAI Agent Builder’s simplicity**, and **Sider’s human knowledge UI** to deliver real work. We turn onboarding into a short conversation, auto‑compose an **agent Pack** around the user’s role and pain points, and let those agents collaborate to achieve outcomes (emails sent, tickets resolved, reports generated, docs organized). Users start simple, then expand via a **gamified marketplace** and a **dual‑mode builder** (visual + DSL) — approachable for everyone, powerful for experts. The vibe is **enterprise‑grade polish** with **tasteful play**.

### Primary North Star Metric (NSM)

**Weekly Successful Agent Outcomes (WSAO) per Active Workspace.**

- **Definition**: Count of agent‑completed actions that create end‑user value *and* receive an implicit/explicit success signal.
- **Examples**: follow‑up email sent, meeting scheduled, support ticket resolved, report generated, document summarized & filed, CRM task created.
- **Success signal**: user approval, downstream state change, KPI delta, or validated result.

### Why this NSM

- Measures **real value**, not prompts.
- Rewards reliable agents, good defaults, and frictionless setup.
- Scales with Packs and marketplace.

### Guardrail & Leading Metrics

Activation, TTFV, Pack engagement, marketplace adoption, quality (success rate, approvals, rollback rate, time saved), cost to serve (\$/outcome, tokens/outcome), reliability/speed (p95 latency, tool failures), retention (D7/D30 WSAO trend).

### V1 Targets

Activation ≥ 70%; onboarding ≤ 90s; **TTFV ≤ 10 min**; WSAO/workspace Week 1 ≥ 3 and Week 4 ≥ 8; success rate ≥ 85%; p95 outcome ≤ 12s.

### Day‑1 Moments of Value

Working dashboard (no blanks), Starter Pack installed, one outcome achievable with sample data, clear Next Best Actions, explainability with citations.

### Experience Tenets (non‑negotiable)

Personalization by default · Multi‑agent native (Packs) · Dual‑mode builder (visual + DSL) · Community transparency (KPIs/ratings) · Playful, not childish.

### Out‑of‑Scope (V1)

No mandatory integrations before value; no heavy 3D/mascots; no complex billing during onboarding.

### Instrumentation Requirements

Emit onboarding/marketplace/agent outcome events; payloads include outcome type, agent id, pack id, latency, tokens, tool calls, success signal, cost. Ship **WSAO dashboard**.

### Scope

**MVP**: onboarding, personalized dashboard, 5 Starter Packs, marketplace browse/install, visual builder basics, knowledge ingestion with citations, WSAO instrumentation.\
**V1**: DSL + sync, test bench & traces, more connectors, pack KPIs, trending marketplace, guardrails & redaction.\
**V2**: auto‑tuning, pack evolution recommendations, creator analytics/monetization.

### Acceptance (V1)

≥70% new signups load a personalized dashboard + Pack in ≤90s; ≥60% trigger one successful outcome in ≤10 min; median WSAO ≥ 3 by Week 1 and trending up; success rate ≥ 85%; p95 ≤ 12s; North Star dashboard live.
