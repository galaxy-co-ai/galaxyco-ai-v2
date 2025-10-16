# Starter Pack Specs (V1) — PRDs (5)

> Purpose: Ship **Day‑0 value**. Each Pack below is copy‑ready for Builder, Marketplace, and Onboarding auto‑install. Every Pack must achieve ≥1 **WSAO** in **Sim Mode** (no integrations) and upgrade seamlessly once connectors are added.

---

## Global Rules (apply to all Packs)

- **PAA present by default** and subscribed to the Pack’s events (watchtower/coach/guard/concierge).
- **Success signals (WSAO)**: user approval, downstream state change, KPI delta, or validated result.
- **KPIs on Card**: `weekly_outcomes`, `success_rate`, `time_saved_total`, `p95_latency`, `last_updated`.
- **Guardrails**: destructive actions require approval (Send email, Create external doc/share, Bulk update, Delete). Auto‑Approve can be enabled per scope.
- **Traces**: each outcome records step graph, tools called, token/latency, **citations** to sources.
- **Sim Mode**: ships with fixtures; replaces live calls with deterministic stubs.
- **Empty States**: never blank — show sample run CTA and clear “what to do next”.

---

## Pack 1 — Founder Ops

**Persona & Pains**\
Startup founder / small‑team owner. Pains: scattered follow‑ups, investor updates, ad‑hoc metrics, context switching.

**Top Outcomes (V1)**

1. **Investor update draft** (WSAO when saved to Drive & approved)
2. **Prospect follow‑ups sent** (batched, personalized)
3. **Weekly metrics snapshot** (email/Slack-ready)

**Agents & Roles**

- **Inbox Scanner** (Gmail/threads → leads/tasks)
- **CRM Enricher** (enrich contact/company, dedupe)
- **Writer — Updates** (compose investor summary w/ charts)
- **Scheduler** (find slots; propose/schedule)
- **Report Synthesizer** (pull metrics; assemble brief)
- **PAA** (watchtower/coach/guard)

**Connectors**

- Required: _none for Sim Mode_
- Optional (live): Gmail, Google Calendar, HubSpot/Salesforce, Google Drive/Sheets, Slack

**Sim Mode Fixtures**\
`/fixtures/founder_ops/{threads.json,crm.json,metrics.csv}`

**Flow (happy path)**\
`plan → scan inbox → enrich leads → draft updates → schedule follow‑ups → synthesize metrics → summarize & commit`

**Success Signals (WSAO)**

- Update doc created + approved
- Follow‑ups sent ≥ N
- Metrics brief generated & delivered

**KPIs on Card**\
`weekly_outcomes, followups_sent, time_saved_total, success_rate, p95_latency, last_updated`

**Guardrails**

- `send_emails` requires approval unless Auto‑Approve per domain
- `share_docs` requires approval if external audience detected

**Traces (must include)**\
`{plan_id, steps[], tools[], citations[], latency_ms, tokens, cost_usd}`

**Empty State Copy**\
“Let’s ship progress in 10 minutes. Run a **Sample Update** or connect Gmail/CRM to use your real data.”

**Uninstall & Recovery**\
Disable agents, archive generated docs to `/Archive/FounderOps`, remove schedules.

**Acceptance Tests**

- Sample update renders with citations
- Batch follow‑up preview shows ≥5 emails; approval gate works
- Metrics brief compiles from `metrics.csv`

**Analytics Events**\
`pack_installed`, `sample_run`, `emails_previewed`, `emails_sent`, `doc_created`, `schedule_created`, `paa_suggestion_applied`

---

## Pack 2 — Sales Ops

**Persona & Pains**\
SDR/AE manager. Pains: lead routing, stale follow‑ups, CRM hygiene, inconsistent notes.

**Top Outcomes (V1)**

1. **Daily lead queue** (prioritized list + next action)
2. **Follow‑up batch sent**
3. **Pipeline hygiene sweep** (missing fields/tasks created)

**Agents & Roles**

- **Lead Router** (score/route leads)
- **Sequencer Writer** (personalized follow‑ups)
- **CRM Cleaner** (dedupe/fill gaps)
- **Meeting Scheduler** (slots + invites)
- **Deal Reporter** (roll‑up by stage)
- **PAA**

**Connectors**

- Optional: HubSpot/Salesforce, Gmail, Google Calendar, Slack

**Sim Mode Fixtures**\
`/fixtures/sales_ops/{leads.json,accounts.json,threads.json}`

**Flow**\
`plan → score/route → draft sequenced emails → schedule → hygiene tasks → summarize`

**Success Signals (WSAO)**

- Queue created & acknowledged
- Batch emails sent
- CRM tasks created ≥ N

**Guardrails**

- `bulk_email_send` and `crm_bulk_update` require approval

**Acceptance Tests**

- Lead queue shows priorities + reasons
- Email drafts include evidence (citations from CRM/email)
- Hygiene tasks list has idempotent merge notes

**Analytics**\
`queue_created`, `emails_sent`, `crm_task_created`, `meeting_scheduled`

---

## Pack 3 — Support Excellence

**Persona & Pains**\
Support lead/manager. Pains: triage, SLA risk, duplicates, slow answers, weak deflection.

**Top Outcomes (V1)**

1. **Ticket triage with priorities**
2. **Answer drafts with citations**
3. **Weekly support report** (SLA, backlog, top intents)

**Agents & Roles**

- **Triage** (intent/SLA scoring; dup detection)
- **Answer Drafter** (grounded responses w/ macros & citations)
- **Escalation Router** (owner selection)
- **Knowledge Updater** (suggest KB changes)
- **PAA**

**Connectors**

- Optional: Zendesk/HelpScout/Intercom, Slack, Drive/Notion (KB optional)

**Sim Mode Fixtures**\
`/fixtures/support/{tickets.json,kb.json}`

**Flow**\
`plan → classify → draft → route/escalate → update KB → summarize`

**Success Signals (WSAO)**

- Draft approved & sent
- Ticket closed/updated
- KB patch PR created

**Guardrails**

- `send_customer_reply` requires approval in V1
- `kb_write` gated by role

**Acceptance Tests**

- Draft includes ≥2 citations
- Triage labels map to priority rubric
- Weekly report compiles from fixtures

**Analytics**\
`triage_done`, `draft_created`, `reply_sent`, `kb_patch_created`, `weekly_report`

---

## Pack 4 — Docs & Knowledge

**Persona & Pains**\
Ops/PM/Enablement. Pains: scattered docs, unknown “source of truth”, stale content.

**Top Outcomes (V1)**

1. **Knowledge ingestion & collections**
2. **Q&A with citations**
3. **Gap analysis** (what’s missing/stale)

**Agents & Roles**

- **Ingestor** (parse/index files/URLs)
- **Tagger** (collections, owners, freshness)
- **Summarizer** (page/section briefs)
- **Q&A** (grounded answers with citations)
- **Gap Hunter** (coverage/gaps report)
- **PAA**

**Connectors**

- Optional: Google Drive, URLs, Notion (optional), GitHub wikis

**Sim Mode Fixtures**\
`/fixtures/knowledge/{docs.zip,links.json}`

**Flow**\
`plan → ingest → tag → summarize → answer → gaps report`

**Success Signals (WSAO)**

- Collection created
- Q&A answer delivered with citations
- Gaps report sent to owner

**Guardrails**

- `external_share` requires approval; PII redaction on by default

**Acceptance Tests**

- Answers show 2–3 citations with byte‑range/source
- Gaps report lists stale docs with owners

**Analytics**\
`knowledge_ingested`, `collection_created`, `qa_answered`, `gaps_report_sent`

---

## Pack 5 — Finance Ops

**Persona & Pains**\
Ops/finance owner. Pains: invoice chaos, spend drift, manual categorization, late reminders.

**Top Outcomes (V1)**

1. **Weekly spend report** (per vendor/category)
2. **Anomaly detection** (flag spikes/missing invoices)
3. **Invoice reminder batch**

**Agents & Roles**

- **Ledger Sync** (pull txns)
- **Categorizer** (ML‑assisted labels)
- **Anomaly Detector** (z‑score/seasonality)
- **Invoice Chaser** (polite reminders)
- **Dashboard Publisher** (shareable brief)
- **PAA**

**Connectors**

- Optional: QuickBooks/Xero, Stripe, Gmail, Drive/Sheets, Slack

**Sim Mode Fixtures**\
`/fixtures/finance/{txns.csv,invoices.csv}`

**Flow**\
`plan → sync/categorize → detect anomalies → draft reminders → publish dashboard`

**Success Signals (WSAO)**

- Report delivered
- Anomaly triage created
- Reminder emails sent

**Guardrails**

- `send_emails` gated; `publish_dashboard` external share requires approval

**Acceptance Tests**

- Report groups by vendor/category with trendline
- Anomaly list includes rationale
- Reminder drafts include invoice refs

**Analytics**\
`report_sent`, `anomaly_flagged`, `reminder_sent`

---

## Example DSL Skeleton (Pack‑local)

```dsl
pack "Founder Ops" {
  goals: ["weekly_update", "followups", "metrics_brief"]
  agents: [inbox_scanner, crm_enricher, writer_updates, scheduler, report_synth]
  success: ["doc_created", "emails_sent>=5", "brief_delivered"]

  flow {
    step scan -> inbox_scanner.search(label:"followup")
    step enrich -> crm_enricher.lookup(scan.results)
    step draft -> writer_updates.compose(enrich.contacts, metrics:fixtures.metrics)
    step send -> scheduler.propose_and_send(draft) requires approve("send_emails")
    step brief -> report_synth.generate(metrics:fixtures.metrics)
  }
}
```

---

## V1 Definition of Done (for all five)

- Pass **Acceptance Tests** in Sim Mode
- KPIs render on card; traces include citations
- Guardrails enforced; approvals function
- PAA Weekly Review summarizes outcomes and proposes next best actions
- Marketplace detail page: demo preview, KPIs, changelog, required/optional connectors, best pairings
