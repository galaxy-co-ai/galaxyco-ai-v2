# WSAO Metering & Billing Spec — Stripe + Entitlements (Patched)

> Delta focus: add **Price ID placeholders + Entitlements matrix**, **refund edge cases**, **ledger constraints**, and small clarifications. Complements CI/CD & API contracts.

---

## 1) Plans & Price IDs (placeholders)

```
PlanTable {
  plan: 'free'|'pro'|'team'|'business',
  stripe_price_recurring: string,   # e.g., price_1Px... (USD monthly)
  wsao_included: number,            # included monthly credits
  overage_per_wsao_usd: number,     # $ billed per billable WSAO above included
  seats_included?: number,
  seat_overage_usd?: number
}
```

> Fill the real `price_...` IDs after creating Products/Prices in Stripe. Keep one currency (USD) for V1.

---

## 2) Entitlements Matrix (per plan)

```
Entitlements {
  packs_installable_max, agents_per_pack_max, marketplace_access: 'all'|'verified',
  sim_mode: 'unlimited'|'limited', traces: 'basic'|'full', approvals: 'basic'|'advanced',
  connectors_allowed: string[], knowledge_collections_max, paa_enabled: boolean
}
```

Suggested defaults:

- **free**: wsao_included=30, overage_per_wsao=0.20, marketplace_access='verified', sim_mode='unlimited'
- **pro**: wsao_included=200, overage=0.12, marketplace_access='all', traces='full'
- **team**: wsao_included=1,000, overage=0.10, connectors=['gmail','drive','slack','hubspot','zendesk']
- **business**: custom pricing, SSO/SCIM, advanced approvals, on‑prem path

---

## 3) Billing Lifecycle (recap + clarifications)

1. **Accrual**: each `outcome_success` increments **billable WSAO** if `sim_mode=false` and scope is not excluded by policy.
2. **Budget checks**: on `budget.warn|hit` events UI shows bar/alerts; PAA proposes top‑ups or Sim Mode.
3. **Export**: nightly job upserts `usage_daily` into Stripe (idempotency key = `{workspace}:{date}`) when overage applies.
4. **Invoice**: Stripe calculates charges; webhooks sync invoice state to ledger.

**Excluded from billing**: failed outcomes, Sim Mode, test fixtures, deleted/rolled‑back outcomes (refunded), internal staff runs.

---

## 4) Refund & Edge Cases (new)

- **Duplicate outcomes**: detect by `(plan_id, inputs_hash)` within 10 minutes → collapse to one WSAO.
- **Partial batch refunds**: if a batch step produces N outcomes and user rolls back subset S≤N within 15 minutes, create **negative ledger entries** for each outcome reversed; keep Stripe export idempotent by adjusting next `usage_daily` upload (do not attempt to reverse a closed invoice).
- **Delinquency grace**: 7 days. During grace: allow reads, convert billable runs to **Sim Mode**; show banner in UI.
- **Workspace deletion**: freeze ledger, cancel subscriptions, export final `usage_daily` as 0, disable agents.

---

## 5) Ledger & Constraints (new)

### Tables

```
credit_ledger(
  id ulid pk,
  workspace_id ulid,
  event_ts timestamptz,
  delta integer,              -- positive for add, negative for consume/refund
  reason enum('wsao','pack_purchase','manual','refund'),
  outcome_id ulid null,
  idempotency_key text unique,
  constraint ck_balance_nonnegative check (true) -- enforced via app-side tx before commit
)

usage_events(
  id ulid pk,
  workspace_id ulid,
  day date,
  wsao_billable integer default 0,
  wsao_nonbillable integer default 0,
  unique(workspace_id, day)
)
```

**Constraints & rules**

- `credit_ledger.idempotency_key` required for every mutation; format up to you
- Foreign key to `outcome(id)` when reason='wsao' or 'refund'
- Balance is derived: `sum(delta)`; enforce non‑negative **business rule** in service layer

---

## 6) Webhooks (clarified)

- `checkout.session.completed` → add credits for pack purchase; write ledger(+), attach session id in `idempotency_key`
- `invoice.payment_succeeded` → mark invoice as paid; no credit mutations
- `customer.subscription.updated|deleted` → adjust entitlements (plan changes)

---

## 7) UI Hooks (unchanged + copy)

- **Budget bar** with thresholds at **80%** and **100%**; CTA to top‑up or enable overage; PAA proposes optimizations when >80%.
- **Ledger view**: table of credit mutations; filter by reason; link to outcome traces.

---

## 8) Jobs & Tests (amended)

- **Job**: `billing_export_daily` (02:00 UTC) — recompute `usage_daily`, push to Stripe, log results
- **Golden tests**: overage toggle on/off; duplicate collapse; partial batch refund; delinquent grace; idempotency replay

---

## 9) Acceptance Criteria (V1)

- Price IDs configured and stored server‑side; entitlements read by API and PAA.
- Ledger constraints enforced; duplicate collapse and partial batch refund validated.
- Budget bar + alerts displayed; `budget.warn` and `budget.hit` events emitted.
- Stripe webhooks idempotent, verified, and reconciled against ledger.
