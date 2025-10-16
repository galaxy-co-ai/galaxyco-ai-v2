# GalaxyCo.ai — JTBD & Pain Maps (2.2)

## Purpose

Define the **Jobs-to-Be-Done** (JTBD) and pain maps for our first six personas so we design onboarding, Packs, and KPIs around real outcomes. This doc is copy‑ready for Gamma and implementation‑ready for Warp.

---

## Framework (how to read this)

Each persona section contains:

- **Situation** → when the job arises
- **Jobs (Functional / Emotional / Social)**
- **Pains & Symptoms**
- **Current Workarounds** (status quo)
- **Desired Outcomes** (acceptance tests)
- **Agent / Pack Mapping** (what to install day‑1)
- **Onboarding Prompts** (questions the product asks)
- **KPIs & Success Signals** (what we measure)
- **PAA Coaching** (default automations & nudges)
- **Non‑Goals** (what we won’t try to solve in V1)

> JTBD pattern we use in copy and telemetry: **“When [situation], I want to [progress], so I can [outcome].”**

---

## Cross‑Persona JTBD (global patterns)

- **Reduce setup friction** → “When I start a new workspace, I want value in minutes, so I can trust this won’t become another tool to manage.”
- **Make reliable follow‑through** → “When work appears (email, ticket, task), I want the next best step proposed or done, so I can maintain momentum.”
- **See truth at a glance** → “When I open my dashboard, I want 3–5 metrics and recent actions, so I can decide what to do next.”
- **Explainability** → “When an agent acts, I want to see citations and why, so I can approve with confidence.”
- **Continuous improvement** → “When patterns emerge, I want suggested upgrades (agents, Packs, settings), so the system keeps getting better without me babysitting.”

---

## Persona — Founder (SMB/Startup)

**Situation**

- Constant context switching, pipeline pressure, ad‑hoc reporting, scattered docs.

**Jobs**

- _Functional_: keep follow‑ups and meetings flowing; get a weekly CEO snapshot; organize docs.
- _Emotional_: feel in control; reduce guilt of missed follow‑ups.
- _Social_: appear organized to investors/partners.

**Pains & Symptoms**

- Forgotten leads; inbox chaos; no single view of progress; last‑minute reporting.

**Current Workarounds**

- Manual labels; spreadsheets; weekend catch‑up.

**Desired Outcomes**

- Follow‑ups drafted and sent on time; weekly report auto‑generated; doc taxonomy proposed.

**Agent / Pack Mapping**

- **Pack**: Founder Ops → Inbox Scanner, Lead Follow‑up, Meeting Scheduler, Weekly CEO Report, Docs Organizer.

**Onboarding Prompts**

- “Which matters more this week: follow‑ups, meetings, or reporting?”
- “Where do your key docs live (Notion/Drive)?”

**KPIs & Success Signals**

- Emails sent, meetings booked, report delivered; user approval; time saved.

**PAA Coaching**

- Suggest CRM connection; recommend Lead Qualifier agent; schedule D+7 review.

**Non‑Goals**

- Deep fundraising CRM; cap table ops (post‑V1).

---

## Persona — Sales (AE / Sales Ops)

**Situation**

- Leads stagnate; CRM hygiene poor; slow responses.

**Jobs**

- _Functional_: draft/send follow‑ups; update CRM; schedule meetings; surface enablement.
- _Emotional_: confidence that nothing slips; momentum.
- _Social_: professionalism in communications.

**Pains & Symptoms**

- Manual logging; stale accounts; “I’ll get to it later.”

**Current Workarounds**

- Sequences in another tool; copy‑pasted snippets; end‑of‑day CRM dumps.

**Desired Outcomes**

- Next actions proposed; follow‑ups sent; CRM fields kept fresh.

**Agent / Pack Mapping**

- **Pack**: Sales Ops → Lead Follow‑up, CRM Enricher, Pipeline Updater, Meeting Scheduler, Battlecard Summarizer.

**Onboarding Prompts**

- “Which CRM do you use?”
- “What’s your follow‑up voice: brief, friendly, or formal?”

**KPIs & Success Signals**

- Emails sent, tasks created, fields updated, reply rate, bookings.

**PAA Coaching**

- Recommend Sequencer add‑on; warn on low reply trends; propose enablement gaps.

**Non‑Goals**

- Forecasting/quotas modeling (post‑V1).

---

## Persona — Operations (BizOps / RevOps)

**Situation**

- Recurring reports; brittle glue code; SLA risk.

**Jobs**

- _Functional_: pull data; reconcile; publish weekly ops report; route tasks; monitor SLA.
- _Emotional_: predictability; fewer break‑fixes.
- _Social_: trust from leadership.

**Pains & Symptoms**

- Manual exports; CSV drift; scripts fail silently.

**Current Workarounds**

- Notebooks; duct‑tape cron jobs; Slack pings.

**Desired Outcomes**

- Report shipped on time; anomalies flagged with context; runbooks drafted.

**Agent / Pack Mapping**

- **Pack**: Ops Automation → Data Puller, Reconciliation Checker, Weekly Ops Report, Task Router, SLA Monitor.

**Onboarding Prompts**

- “Where do your operational metrics live?”
- “Which SLA matters most (response, resolution, uptime)?”

**KPIs & Success Signals**

- Reports on time; anomalies caught; tasks routed; time saved.

**PAA Coaching**

- Suggest connecting warehouse; propose alert thresholds; track flaky connectors.

**Non‑Goals**

- Data modeling/ELT orchestration (post‑V1).

---

## Persona — Support (CS / CX)

**Situation**

- High ticket volume; repetitive replies; knowledge gaps.

**Jobs**

- _Functional_: triage; draft replies; maintain macros; update FAQ; monitor CSAT.
- _Emotional_: confidence that customers are helped quickly.
- _Social_: show responsiveness to leadership.

**Pains & Symptoms**

- Slow first responses; inconsistent answers; outdated FAQs.

**Current Workarounds**

- Manual macros; ad‑hoc triage; tribal knowledge.

**Desired Outcomes**

- Accurate triage; consistent replies; FAQ updates with citations.

**Agent / Pack Mapping**

- **Pack**: Support Excellence → Ticket Triage, Reply Drafter, Macro Generator, Knowledge Updater, CSAT Tracker.

**Onboarding Prompts**

- “Helpdesk platform?” “Common issues?”

**KPIs & Success Signals**

- FRT/RT down; macro coverage up; CSAT stable or rising.

**PAA Coaching**

- Identify FAQ gaps; propose Sentiment Watch; schedule macro reviews.

**Non‑Goals**

- Workforce mgmt/agent scheduling (post‑V1).

---

## Persona — Finance (Controller / Analyst)

**Situation**

- Month‑end close pressure; messy expense data; variance explainability.

**Jobs**

- _Functional_: reconcile; classify; generate close checklist; produce variance explanations.
- _Emotional_: confidence numbers are right.
- _Social_: credibility with auditors and execs.

**Pains & Symptoms**

- Manual reconciliations; misclassifications; late reports.

**Current Workarounds**

- Spreadsheets; manual review; email chases.

**Desired Outcomes**

- Faster close; fewer errors; standardized narratives.

**Agent / Pack Mapping**

- **Pack**: Finance Ops → Reconciliation Assistant, Expense Classifier, Close Checklist, Variance Explainer, Vendor Dedupe.

**Onboarding Prompts**

- “ERP/GL system?” “Materiality threshold?”

**KPIs & Success Signals**

- Close time; reconciliation errors; classification accuracy.

**PAA Coaching**

- Connect GL; set thresholds; suggest Invoice Extractor.

**Non‑Goals**

- Complex FP&A modeling (post‑V1).

---

## Persona — Product (PM)

**Situation**

- Dispersed feedback; PRD backlog; scattered release notes.

**Jobs**

- _Functional_: summarize feedback; draft PRDs; groom backlog; write release notes; plan experiments.
- _Emotional_: confidence in priorities and clarity of specs.
- _Social_: leadership alignment.

**Pains & Symptoms**

- Duplicate issues; slow PRDs; noisy feedback.

**Current Workarounds**

- Notion pages; manual grooming; ad‑hoc summaries.

**Desired Outcomes**

- Faster PRDs; deduped backlog; clear release notes.

**Agent / Pack Mapping**

- **Pack**: Product Builder → Feedback Summarizer, PRD Drafter, Backlog Groomer, Release Notes Writer, Experiment Planner.

**Onboarding Prompts**

- “Tracker (Jira/Linear)?” “PRD template style?”

**KPIs & Success Signals**

- PRD cycle time; duplicate rate; experiment velocity.

**PAA Coaching**

- Taxonomy suggestions; highlight gaps; propose Quotes Collector.

**Non‑Goals**

- Heavy analytics instrumentation (post‑V1).

---

## Telemetry (JTBD instrumentation)

For any agent outcome, attach JTBD context when available:

- `persona`, `industry_overlay`, `job_statement` (When/I want/So I can), `pain_tags[]`, `kpi_targets{}`.

This allows WSAO slices by persona/job and powers Pack evolution.

---

## V1 Acceptance Criteria

- Six persona maps implemented as prompts in onboarding and copy within marketplace cards.
- Onboarding dynamically chooses a **Starter Pack** based on persona + answers.
- PAA weekly review templates reference persona KPIs and Day‑1 tasks.
- JTBD fields present in analytics payloads and the North Star dashboard.

---

## Non‑Goals (V1)

- Exhaustive industry‑specific JTBD; we ship with overlays for 5 industries and iterate with marketplace creators.
