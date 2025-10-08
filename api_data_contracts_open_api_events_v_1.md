# API & Data Contracts (OpenAPI + Events) — V1 (Patched)

> Delta focus: **Billing/Usage endpoints**, **Approval.scope enum lock**, **Knowledge Sync** endpoints, and minor consistency fixes (ULIDs, pagination, error taxonomy). This extends the original V1 without breaking changes.

---

## 0) Conventions (unchanged)
- **IDs**: ULID strings (`ulid`)
- **Versioning**: `/v1/...`
- **Auth**: Bearer JWT; `X-Workspace-Id` header for multi-tenant scoping
- **Pagination**: `?limit=50&cursor=...` (opaque)
- **Errors**: `{ code, message, details?, request_id }` with codes from taxonomy: `validation_failed | unauthorized | forbidden | not_found | conflict | rate_limited | internal`
- **Idempotency**: `Idempotency-Key` header supported on writes; server stores 24h

---

## 1) Objects (selected)

### Workspace
```
Workspace { id: ulid, name: string, plan: 'free'|'pro'|'team'|'business', created_at, updated_at }
```

### Pack
```
Pack { id, name, version, persona, description, agents: AgentRef[], goals: Goal[], kpis: PackKpis, created_at, updated_at }
```

### Agent
```
Agent { id, name, version, description, inputs: Field[], outputs: Field[], tools: ToolRef[], policy: Policy, knowledge: KnowledgeRef[], kpis: AgentKpis, created_at, updated_at }
```

### Run / Outcome (unchanged excerpt)
```
Run { id, pack_id, agent_ids[], plan, status: 'pending'|'running'|'succeeded'|'failed'|'canceled', sim_mode: bool, started_at, completed_at }
Outcome { id, run_id, type, success: bool, success_signal?: SuccessSignal, citations?: Citation[], metrics?: OutcomeMetrics, created_at }
```

### Approval (enum locked)
```
Approval {
  id, run_id, scope: 'send_emails'|'crm_bulk_update'|'kb_write'|'external_share'|'publish_dashboard'|'file_delete',
  status: 'requested'|'approved'|'rejected'|'expired',
  requested_by, decided_by?, decided_at?,
  payload, created_at
}
```

---

## 2) Billing & Usage Endpoints (new)

### GET `/v1/billing/budget`
Return credit balance, WSAO counts this cycle, projected bill, dates.
```
200 {
  plan: 'free'|'pro'|'team'|'business',
  credits: { balance: number, allocated: number, consumed: number },
  usage: { wsao_cycle: number, wsao_today: number },
  projected_bill?: { amount: number, currency: 'usd' },
  period: { start: string, end: string }
}
```

### GET `/v1/billing/invoices?limit&cursor`
List invoices mirrored from Stripe.
```
200 { items: Invoice[], next_cursor? }
Invoice { id: string, status: 'draft'|'open'|'paid'|'uncollectible'|'void', amount_due: number, amount_paid: number, hosted_url: string, period: { start,end }, created_at }
```

### POST `/v1/billing/credit-packs/checkout`
Start a one‑time credit pack purchase.
```
Body { pack_id: 'credits_20'|'credits_100' }
201 { checkout_url: string, stripe_session_id: string }
```

### POST `/v1/billing/overage:toggle`
```
Body { enabled: boolean }
200 { overage_enabled: boolean }
```

### GET `/v1/usage/outcomes?day=YYYY-MM-DD`
```
200 { day: string, billable_wsao: number, non_billable: number }
```

---

## 3) Knowledge Sync Endpoints (new)

### POST `/v1/knowledge/sources:ingest`
Kick off ingestion for files/URLs provided; supports Sim fixtures when `sim_mode=true`.
```
Body { sources: SourceSpec[], sim_mode?: boolean }
SourceSpec = { kind: 'url'|'gdrive'|'notion'|'file', ref: string, label?: string }
202 { job_id: ulid }
```

### GET `/v1/knowledge/coverage`
Returns coverage and gaps by collection.
```
200 {
  collections: [
    { id, name, docs_indexed, tokens_indexed, last_sync, gaps: { stale: number, missing_owners: number, topics_missing: string[] } }
  ]
}
```

### POST `/v1/knowledge/qa`
Grounded Q&A with citations (Sim allowed).
```
Body { question: string, collections?: string[], sim_mode?: boolean }
200 { answer: string, citations: Citation[] }
```

---

## 4) Events (additions)

- `budget.warn` { workspace_id, pct }
- `budget.hit` { workspace_id }
- `billing.credit_added` { workspace_id, delta, source: 'pack_purchase'|'manual' }
- `knowledge.ingest_started|completed|failed` { job_id, counts }
- `qa.answered` { question, latency_ms, citations }

(Existing: `run.*`, `outcome.*`, `trace.step`, `approval.*`, `paa.*`)

---

## 5) Security Hooks
- All **billing** endpoints require `role>=admin`.
- Knowledge Q&A requires `scope:knowledge.read`; ingestion requires `scope:knowledge.write`.
- Redaction: citations scrub PII by default; byte‑ranges stored, not raw text excerpts.

---

## 6) Webhooks (unchanged + notes)
- Accept: `invoice.*`, `checkout.session.completed`, `customer.subscription.updated|deleted`.
- HMAC verification with `Stripe-Signature`; 300s tolerance; idempotent by `event_id`.

---

## 7) OpenAPI Snippet (YAML; fragment)
```yaml
openapi: 3.1.0
info: { title: GalaxyCo API, version: 1.0.0 }
servers: [{ url: https://api.galaxyco.ai/v1 }]
paths:
  /billing/budget:
    get:
      security: [{ bearerAuth: [] }]
      responses:
        '200': { description: OK, content: { application/json: { schema: { $ref: '#/components/schemas/Budget' } } } }
  /knowledge/sources:ingest:
    post:
      requestBody: { required: true, content: { application/json: { schema: { $ref: '#/components/schemas/IngestRequest' } } } }
      responses: { '202': { description: Accepted } }
components:
  securitySchemes: { bearerAuth: { type: http, scheme: bearer } }
```

---

## 8) Compatibility Notes
- **No breaking changes** to existing resources.
- Clients may safely call the new endpoints; Approval.scope now validates against the locked enum.
- Knowledge endpoints align with **Docs & Knowledge Pack** acceptance tests.

