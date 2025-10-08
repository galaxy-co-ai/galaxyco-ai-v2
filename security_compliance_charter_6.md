# GalaxyCo.ai — Security & Compliance Charter (6.1)

## Purpose
Protect customer data, earn enterprise trust, and meet regulatory obligations **without slowing product velocity**. This charter defines our security model, privacy posture, governance controls, and the compliance roadmap that underpins Packs, Agents, the Marketplace, and the Builder.

---

## Scope
- **In scope**: application services, data pipelines, knowledge ingestion, Actions/Connectors, sandboxed code execution, telemetry, logs, backups, and support tooling.
- **Out of scope (V1)**: on‑prem deployments (planned V2), formal HIPAA BAAs (V2), custom data residency per tenant (pilot in V2).

---

## Data Classification & Handling
**Classes**
- **Public** (marketing docs, help center)
- **Internal** (non‑prod config, runbooks)
- **Customer‑Confidential** (workspace content, metadata, prompts, outcomes)
- **Sensitive** (PII/PHI/financial when present via sources/connectors)

**Policies**
- Default to **least privilege**; access logged and reviewed quarterly.
- **Customer data is never used to train foundation models** (no cross‑tenant training). Optional per‑workspace fine‑tuning is **opt‑in** with explicit controls.
- **Redaction**: PII/PHI masking available at source, in transit to models, and in traces.
- **Data minimization**: limit scope sent to LLMs; send **only what an agent needs**.

---

## Identity, Access, & Authentication
- **RBAC**: workspace owner, admin, builder, user, viewer; least privilege defaults.
- **MFA**: encouraged for all; required for admins.
- **SSO (SAML/OIDC)**: **V2**; **SCIM** provisioning **V2**.
- **API access**: PATs scoped + expiring; IP allowlists available for Enterprise.

---

## Encryption & Key Management
- **At rest**: AES‑256 (cloud provider KMS‑managed keys), envelope encryption for secrets.
- **In transit**: TLS 1.2+ everywhere (HSTS enabled). Mutual TLS for select Enterprise egress.
- **Secrets**: stored in managed secrets vault; never logged; rotated at least quarterly or upon exposure.

---

## Infrastructure & Network Security
- **Environment isolation**: dev/stage/prod separated; no prod data in non‑prod.
- **Baseline hardening**: CIS‑aligned images; minimal AMIs/containers; read‑only filesystems where feasible.
- **Network**: VPC segmentation; security groups deny‑by‑default; WAF + rate limiting.
- **Egress**: **allowlist only** from Action sandboxes; DNS egress monitoring.
- **Backups**: encrypted, automated, tested monthly; **RPO ≤ 24h**, **RTO ≤ 4h**.

---

## Application‑Level Controls
- **Approvals**: destructive/bulk Actions require approval unless Auto‑Approve policy enabled.
- **Redaction Modes**: strip/mask PII/PHI in prompts, outputs, traces.
- **Versioning**: Agents/Packs/versioned configs with rollback.
- **Audit Trail**: immutable event log with actor, scope, before/after diffs, and trace links.

---

## LLM & Model Governance
- **Provider policy**: choose providers that contractually **do not train** on our API traffic; document subprocessors.
- **Prompt Security**: injection‑aware templates; content sanitization; response schema validation.
- **Output Filters**: policy checks for data exfiltration and unsafe actions.
- **Routing**: model choices constrained by policy (e.g., PHI only to configured provider/region).
- **Eval & Red Teaming**: RAG‑eval and safety eval suites run pre‑release; regression gates in CI.

---

## Logging, Telemetry, & Monitoring
- **PII scrubbing**: structured logs filter tokens, secrets, PII markers.
- **Observability**: traces for each outcome with step latencies, tokens, tool errors; dashboards for p95 latency, success %, cost.
- **Alerts**: rate limit spikes, unusual egress, auth failures, error budgets.

---

## Vulnerability Management & SDLC
- **SCA/SAST/DAST**: automated in CI; critical vulns blocked from deploy.
- **Dependency policy**: pin + renovate bots; SBOM generated per release.
- **Code review**: required; security checks in PR template; protected main branch.
- **Secrets scanning**: pre‑commit + CI; immediate revoke on hit.
- **Penetration tests**: annual third‑party; remediation tracked.

---

## Third‑Party & Subprocessors
- Maintain public list of subprocessors; DPAs in place.
- **Vendor risk**: security questionnaire + SOC2/ISO evidence; high‑risk vendors get annual review.

---

## Privacy, Compliance & Legal
- **SOC 2 Type I** target: **pre‑V1**; **Type II**: **within 6–9 months post‑V1**.
- **GDPR/CCPA**: DPA available; data subject rights (access, delete, export) within 30 days.
- **HIPAA**: best‑effort controls now; **BAA available in V2** with Compliance Pack.
- **Data Residency**: regional hosting options **V2**; residency tags on listings.
- **Retention**: default 90 days for traces (configurable by tier); customer deletion honored within 30 days.

---

## Incident Response (CIRP)
- **Detect** → triage (sev rubric) → contain → eradicate → recover → post‑mortem within 10 business days.
- Customer notification for incidents that involve data exposure **within 72 hours** of confirmation.
- Tabletop exercises **twice annually**.

---

## Business Continuity & DR
- DR runbook tested at least **annually**; cross‑region backups; infra‑as‑code for reproducible environments.
- Single‑region outage plan with degraded Sim Mode for demos if live actions are impacted.

---

## Customer Rights & Requests
- **Export**: workspace data export (JSON/NDJSON + files) on request or via UI by tier.
- **Deletion**: hard delete including backups on rolling schedule ≤ 30 days (document process).
- **Access**: admin views audit and access logs by date/actor.

---

## Sandbox Execution Policy (Actions/Transforms)
- Ephemeral containers; memory/CPU/time budgets; filesystem read‑only; **no subprocesses**; **egress allowlist**; deterministic clock where feasible.
- Mandatory **simulation handlers** for demo/preview without live data.

---

## Employee & Device Security
- Background checks where permitted; security training on hire + annually.
- Device controls: disk encryption, screen lock, EDR, patch SLAs; no prod data on local devices.
- Production access via SSO + MFA + just‑in‑time credentials; recorded bastion sessions.

---

## Documentation & Evidence (for sales/security reviews)
- Security whitepaper, data‑flow diagrams, subprocessor list, SOC/ISO letters, penetration test letter, uptime SLA, DPA, incident response summary, retention policy.

---

## V1 Acceptance Criteria
- RBAC, approvals, audit trail, and redaction modes live and enforced.
- Traces with p95 latency, success %, cost; logs with PII scrubbing.
- Secrets in KMS; key rotation runbook; backup/restore tested.
- Vendor/subprocessor registry and DPAs published; public security page live.
- CIRP documented and exercised; customer incident comms template ready.
- SOC 2 Type I audit plan signed; evidence collection underway.

---

## Roadmap (Post‑V1)
- SOC 2 Type II; SSO/SCIM; regional hosting; BAA/HIPAA Compliance Pack; pen test cadence; customer‑facing audit exports; private networking & on‑prem options for Enterprise.
