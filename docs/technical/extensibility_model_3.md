# GalaxyCo.ai — Extensibility Model (3.4)

## Purpose

Define how GalaxyCo.ai can be extended safely and predictably without forcing users to be developers. Extensions power Agents and Packs with new tools, data, and behaviors while preserving **security, governance, and performance**.

This model supports inspirations you approved: **StackAI** (polish/governance), **OpenAI Agent Builder** (simplicity), **OpenSea** (marketplace), **Sider** (human knowledge UI). The **Personal AI Assistant (PAA)** participates by suggesting/installing extensions, simulating changes, and opening issues when extensions fail.

---

## Extension Types

1. **Connectors** — Integrations to third‑party systems (e.g., Gmail, HubSpot, Notion, Drive). Provide auth, schemas, and actions.
2. **Actions** — Fine‑grained operations used by Agents (e.g., `hubspot.create_task`, `gmail.send`). Implemented via REST/gRPC manifests **or** safe Python snippets.
3. **Webhooks / Triggers** — Event sources that start flows (e.g., inbound email, new ticket). Debounced and policy‑gated.
4. **Transforms** — Deterministic data shaping steps (cleaning, mapping, enrichment) to reduce LLM cost and error.

> V1 scope: **Connectors, Actions, Transforms**; light Triggers (webhooks, schedules). UI components/embeddables are **out of scope** for V1.

---

## Architecture

- **Extension Registry**: Workspace‑scoped catalog of installed extensions with versions, permissions, and health.
- **Secret Store**: Per‑workspace vault (KMS‑backed); secrets never appear in plaintext logs; auto‑redaction in traces.
- **Policy Engine**: Enforces scopes (read/write/delete), data classes, rate limits, approval gates.
- **Sandbox Runners**: Isolated execution for Actions/Transforms with CPU/mem/time budgets and an egress allowlist.
- **Simulation Layer**: Sample‑data stubs for Actions when a connector isn’t authenticated yet.
- **Observability**: Step‑level traces, metrics (latency, error rate), cost, and retries; attached to WSAO.

---

## Connector Spec (Manifest)

**Manifest (YAML/JSON)**

```
connector: hubspot
version: 1.2.0
auth:
  type: oauth2
  scopes: [contacts.write, engagements.write]
actions:
  - id: create_task
    method: POST
    path: /crm/v3/objects/tasks
    request_schema: { subject: string, due_at: string?, owner_id: string? }
    response_schema: { id: string, link: string }
    errors: [401, 403, 404, 429, 5xx]
rate_limits:
  rpm: 120
retry: { strategy: exponential, max_attempts: 3 }
permissions:
  required: [write.tasks]
```

**Requirements**

- OAuth/API‑key support with token refresh; per‑workspace token isolation.
- Scopes map to **Policy Engine** permissions.
- Backoff/retry and 429 handling as first‑class behaviors.
- Health checks; status surfaced in UI.

---

## Action Spec (Manifest or Python)

**Manifest‑based Action**

```
action: gmail.send
inputs: { to: string[], subject: string, body: string }
outputs: { message_id: string, deliverability: string }
policy: { approval: required_for: [bulk_send], pii_classes: [email] }
```

**Python Action (sandboxed)**

```
# api: v1
# perms: [drive.read]
# timeout_ms: 5000
# egress: ["https://www.googleapis.com"]

def run(inputs, ctx):
    # inputs: {file_id: str}
    # ctx: {secrets: {}, http: fetch, log: logger}
    r = ctx.http.get(f"https://www.googleapis.com/drive/v3/files/{inputs['file_id']}")
    if r.status != 200:
        raise ActionError("drive_api_failed", r.status)
    return {"title": r.json()["name"]}
```

**Sandbox rules (V1)**

- Time limit **≤ 10s**, memory cap **≤ 256MB** per Action.
- Egress allowlist; no filesystem writes; no subprocesses; deterministic clock where possible.
- Secrets injected at runtime; never serialized to logs or outputs.

---

## Transforms

- **Deterministic**, cacheable operations: normalize dates, map fields, redact PII, schema validation.
- Declared via small manifests or Python with the same sandbox rules.

---

## Permissions & Approvals

- **Scopes**: `read`, `write`, `delete`, narrowed by resource (e.g., `crm.tasks.write`).
- **Approvals**: Destructive or bulk operations (`delete`, `send_bulk`) require **Approve** unless the user enables **Auto‑Approve** for that scope.
- **PAA** can queue approval requests with context and recommended action.

---

## Simulation & Sample Data

- Every Action must include a **simulation handler** returning realistic sample output for demos and onboarding.
- If a required connector is unauthenticated, Agents/Packs run in **Sim Mode** (clearly labeled) using sample data.

---

## Error Taxonomy & Handling

- **Categories**: `auth_error`, `rate_limit`, `quota`, `not_found`, `validation`, `tool_error`, `transient`, `policy_block`.
- **Handlers**: retries (exp backoff), circuit breakers, fallbacks (alternate endpoint/model), or **PAA escalation**.
- Errors carry `error_code`, `status`, `attempts`, `last_endpoint` for traceability.

---

## Versioning & Compatibility

- **SemVer**: MAJOR breaks behavior/fields; MINOR adds fields; PATCH fixes.
- **Deprecation policy**: 90‑day window with PAA advisories; auto‑migrate when safe.
- **Pinned versions** per workspace; rollback available.

---

## Publishing & Marketplace

- Creators submit Connectors/Actions with manifests, tests, and telemetry.
- **Verification levels**: community, verified (reviewed), enterprise (security attestations).
- Cards show: capabilities, KPIs, recency, error rate, required scopes.
- PAA recommends marketplace extensions based on gaps and usage.

---

## Testing & CI

- **Contract tests** for manifests; **sandbox tests** for Python; **simulation fixtures** must pass.
- **Golden flows** for top Packs to catch regressions (run in CI and nightly).
- Required coverage: happy path, rate‑limit, auth error, 5xx retry.

---

## Observability

- Emit per‑Action metrics: latency (p50/p95), error rate, retry count, cost (tokens/$ if LLM), saturation.
- Logs scrub secrets; link to traces and WSAO attribution.

---

## Security & Privacy

- Secrets in KMS; rotation supported; access via short‑lived tokens.
- RBAC enforced per Action/Connector; approvals logged with actor and scope.
- Redaction modes propagate through Actions and Transforms.

---

## Performance Budgets (V1)

- Action p95 latency **≤ 2s** (network bounded); Transform p95 **≤ 300ms**.
- Connector health SLO: **99.5%** success over rolling 7 days.

---

## V1 Acceptance Criteria

- Installable Connectors for **Gmail, Slack, HubSpot/Salesforce, Notion, Google Drive** with manifests, retries, and health.
- Action sandbox with allowlist egress, CPU/mem/time caps, and secret redaction; Python + manifest paths both supported.
- Simulation layer working; Packs can complete at least **one outcome** using sample data only.
- Policy Engine approvals active for destructive scopes; audit trail present.
- Observability: per‑Action metrics and traces visible; errors categorized.
- Versioning and rollback functional; PAA recommends updates/deprecations.

---

## Non‑Goals (V1)

- Arbitrary long‑running compute; external package installation at runtime; UI component extensions; unmanaged egress; custom kernels.
