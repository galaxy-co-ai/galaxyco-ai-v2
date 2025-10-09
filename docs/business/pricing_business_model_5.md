# GalaxyCo.ai — Pricing & Business Model (5.4)

## Purpose
Define how we monetize **Packs**, **Agents**, and **workspaces** without slowing adoption. Align pricing to our North Star (**WSAO**), keep PLG‑friendly, and preserve enterprise trust (governance by default). Inspirations (non‑deviating): **StackAI** (polish), **OpenSea** (marketplace dynamics), **OpenAI Agent Builder** (friendly creation), **Sider** (human knowledge UI).

---

## Principles
- **Value‑metered**: Charge on *outcomes* (WSAO credits), not on prompts or vague compute.
- **Try fast**: **Sim Mode** delivers proof before integrations; generous free evaluation.
- **Simple first**: Few, memorable tiers; opinionated defaults.
- **Fair & safe**: Guardrails, approvals, and RBAC included; no paywall for basic safety.
- **Creator‑forward** (V2): Clear revenue share; quality signals drive visibility and payout.

---

## Core Value Metric
**WSAO (Weekly Successful Agent Outcomes)** = counted when an agent action creates end‑user value and passes a success signal (approval, state change, KPI delta, or validated result).  
We bill **monthly** using a **WSAO credit** pool (1 WSAO credit per successful outcome). Test Bench runs and pure previews do **not** consume credits.

---

## Packaging Overview (proposed)
- **Free — Sim Mode** (forever)
- **Pro — Individual**
- **Team — Small Teams**
- **Business — Departments**
- **Enterprise — Org & Regulated**

> Prices are **launch placeholders** for modeling and A/B tests; we’ll tune post‑beta.

---

## Tiers & Inclusions (copy‑ready)

### Free — Sim Mode ($0)
- 1 workspace · 1 user
- **1 Starter Pack** installed by default
- **Sim Mode only** (no external writes); demo runs unlimited within anti‑abuse limits
- **PAA** present (suggestions, weekly review stub)
- Knowledge: connect sources in read‑only; citations visible
- Builder: Visual + DSL preview; Test Bench allowed; **no live writes**
- Governance: RBAC basic, approvals UI visible (disabled), audit preview
- Traces retention: 7 days (sim)
- Support: community hub

**Intent**: prove value in minutes; reduce setup anxiety.

---

### Pro — Individual ($39/user/month)
- Everything in Free **+ live actions** (writes allowed with approvals)
- 3 active **Packs** per workspace
- **2,000 WSAO credits / month** included
- **3 connectors** (Gmail/Slack/HubSpot/Salesforce/Notion/Drive)
- Builder: Visual + DSL with sync; 30‑day trace retention
- Knowledge Coverage view; confidence score
- Approvals for destructive scopes; audit log export (30 days)
- Email support

**Overage**: $25 per additional **1,000 WSAO** credits  
**Add‑ons**: Extra connectors ($10/mo each)

---

### Team — Small Teams ($199/workspace/month, up to 5 users)
- Everything in Pro, plus:
- **Unlimited Packs**; **10,000 WSAO credits / month** included
- **10 connectors**; priority runs for Pack goals
- **Pack KPIs** (goals, progress); Weekly PAA Review with suggested changes
- Test Bench & Traces: 90‑day retention; rollback
- Monitoring dashboard (WSAO, success %, p95 latency, cost)
- Role‑based Approvals; redaction modes
- Standard support (48h SLA)

**Overage**: $20 per additional **1,000 WSAO** credits  
**Add‑ons**: Extra users ($20/user/mo), Extra connectors ($10/mo)

---

### Business — Departments ($799/workspace/month, includes 25 users)
- Everything in Team, plus:
- **50,000 WSAO credits / month** included
- **SSO (SAML/OIDC)** *(V2 timing)*; data residency tags; advanced audit
- **Policy Engine** templates; Approvals automation; scheduled workflows
- Creator verification fast‑track for internal listings
- Support: priority (24h SLA) + technical onboarding

**Overage**: $18 per additional **1,000 WSAO** credits  
**Add‑ons**: Additional 25‑user pack ($300/mo), HIPAA mode (see Compliance add‑on)

---

### Enterprise — Org & Regulated (Custom)
- Everything in Business, plus:
- **SSO + SCIM**; private networking; on‑prem/isolated deployment options
- Unlimited workspaces; custom data retention; DPA and security reviews
- Dedicated CSM; solution engineering; custom SLAs
- Volume pricing for WSAO credits

**Add‑ons**: **Compliance Pack** (HIPAA/GxP), bespoke connectors, on‑prem support

---

## Credit Rules & Fair‑Use
- A **WSAO credit** burns only on **`outcome_success`** events (as defined in 3.2 Orchestration Model). Failures or retries do not bill.
- **Destructive actions** always require approval unless policy enables Auto‑Approve.
- **Sim Mode** never bills credits.
- Rate limits and per‑outcome token caps prevent runaway spend; PAA warns on budget risk.

---

## Overage & Bundles
- Overage billed at the tier’s rate (see above), aggregated monthly.
- **Outcome Bundles** available: 10k ($180), 50k ($800), 200k ($2,800). Bundles roll over for 90 days.
- Annual discount: **‑20%** on subscriptions; bundles unaffected.

---

## Add‑Ons (cross‑tier)
- **Advanced Connectors** (ERP/warehouse): $50/mo each
- **Compliance Pack** (HIPAA/GxP modes): $300/mo per workspace
- **Creator Tools Pro**: deep analytics for listings + A/B harness ($99/mo)

---

## Marketplace Economics (V2)
- **Paid listings** opt‑in for creators.
- **Revenue share** (starter model): **80% creator / 20% GalaxyCo** after fees.
- **Payouts** monthly with a $50 threshold; clawbacks for fraud.
- **Quality kicker**: +5% bonus pool prorated by Quality Score (QS) and verified tier.
- Enterprise catalogs may negotiate private rates; same QS rules apply for ranking.

---

## Billing Architecture
- Meter on `outcome_success` events with attached: workspace_id, pack_id, agent_id, latency, tokens, \$cost, approval flag.
- Token and egress costs tracked for gross margin; **target GM ≥ 75%** on average across tiers.
- Hard/soft budgets per workspace; PAA notifies on 80% and 100% thresholds; soft‑stop offers bundles.

---

## Trials & Promotions
- **Pro 14‑day trial** with live actions; converts to Free Sim Mode if not paid.
- **Startup program**: 50% off Team for 12 months (eligibility: < $2M ARR, < 25 employees).
- **Creator grants**: free Team while actively publishing and maintaining ≥2 Verified listings.

---

## Legal & Compliance Notes
- **DPA** and data residency statements published; on‑prem option gated to Enterprise.
- Refund policy: pro‑rata for downtime beyond SLA on paid tiers.
- No storage of customer secrets outside KMS; audit exports available by tier.

---

## KPIs to Monitor
- Free→Pro conversion; Pro→Team expansion; WSAO/\$ by tier; overage mix.
- CAC:LTV; churn by persona; install velocity from Collections/PAA suggestions.
- Creator supply: net new listings, Verified %, QS median, paid adoption of listings.

---

## Risks & Mitigations
- **Outcome under‑counting** → strict event contracts; QA harness; reconciliation jobs.
- **Credit confusion** → in‑product meters, budget bars, PAA alerts; sample cost previews.
- **Creator misalignment** → QS‑weighted payouts, verification tiers, enforcement ladder.
- **Enterprise blockers** → early pilots; publish security posture; prioritize SSO/SCIM.

---

## V1 Acceptance Criteria (Pricing readiness)
- Tiers live in UI with clear inclusions and meters; budget bars visible.
- Billing meters on `outcome_success`; Sim Mode never bills; approvals always enforced.
- Overage and bundles purchasable in‑app; invoices web‑delivered.
- Free Sim Mode + Pro trial enabled; downgrade path safe to Free.
- Marketplace revenue share **not** launched (flagged for V2); creator incentives documented.

