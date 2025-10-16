# GalaxyCo.ai — Tech Stack Blueprint (End‑to‑End)

## 0) Non‑Negotiables & Constraints

- **No Supabase.**
- **Notion and Linear are not required** anywhere; treat them as optional connectors only.
- Must deliver our signed vision: **Packs by default**, **Personal AI Assistant (PAA)**, **guided onboarding ≤90s**, **Sim Mode**, **visual ↔ DSL builder**, **citations & KPIs on cards**, **governance by default**.
- Time‑to‑Value: first **WSAO in ≤10 min** without integrations.

---

## 1) System Architecture (at a glance)

- **Client**: Next.js (App Router) + React 18 + TypeScript + Tailwind + shadcn/ui; server actions where useful.
- **API Gateway (TypeScript)**: NestJS (REST + WebSocket) for auth, RBAC, billing, approvals, marketplace, and Pack/Agent CRUD.
- **Orchestration & Agents (Python)**: LangGraph‑based micro‑services for Planner/Router/Specialists/Critic with a shared **Blackboard** state.
- **Eventing**: Postgres outbox + **Redis streams** initially → upgrade to **Temporal Cloud** for long‑running, reliable workflows.
- **Data**: Postgres (OLTP + **pgvector**), Redis (cache/queues), S3 (artifacts), ClickHouse or PostHog Cloud (product analytics).
- **Retrieval**: ingestion + chunking + embeddings → citations on every answer.
- **Observability**: OpenTelemetry → Datadog (or Grafana/Loki/Tempo) + Sentry for errors.

```
[Next.js Web] ⇄ [NestJS API] ⇄ [Postgres/Redis/S3]
                         ⇣        ⇡
                  [Python Agent Workers (LangGraph)]
                         ⇣
                 [Temporal Cloud (V1+)]
```

Why polyglot? **TS** is ideal for product APIs/real‑time UX; **Python** is best for LLM tooling, evals, and data.

---

## 2) Frontend (UI/UX)

- **Framework**: Next.js 14+ (App Router) with Static + SSR mix; Vercel deploys.
- **UI Kit**: Tailwind + shadcn/ui; Framer Motion for subtle micro‑interactions (no cartoonish effects).
- **State**: React Query (server cache) + lightweight local state (Zustand). Avoid Redux unless necessary.
- **Graph**: Use REST + WebSocket first; add tRPC for internal dev ergonomics if we keep the API in TS.
- **Rich surfaces**: Builder canvas with React Flow; Marketplace grid with virtualized lists; Traces view with timeline.

---

## 3) Backend (Gateway, Domain, Realtime)

- **Gateway**: NestJS modules — Auth, Users, Workspaces, Packs, Agents, Knowledge, Marketplace, Billing, Approvals, Traces.
- **Realtime**: WebSocket channels (Socket.IO) for builder runs, trace streaming, and PAA suggestions.
- **Approvals**: middleware + policy engine; destructive scopes require explicit approval unless policy enables Auto‑Approve.
- **Billing**: Stripe (subscriptions + WSAO credit bundles); metering on `outcome_success` events.
- **Search**: Postgres FTS for MVP; add OpenSearch/Typesense only if needed for Marketplace scale.

---

## 4) Orchestration & Agents (Python)

- **Framework**: LangGraph (stateful graphs) + Pydantic schemas for plans, steps, artifacts.
- **Roles**: Planner, Router, Specialists, Critic, PAA (watchtower/coach/concierge/guard).
- **Blackboard**: persisted plan/state in Postgres JSONB; artifacts in S3 with citation manifests.
- **Self‑Healing**: retries/backoff, alternate models/tools, narrower queries; PAA escalates with repro traces.
- **Routing**: model/tool choice via a provider‑agnostic layer.
- **Eval**: RAGAS or bespoke evals; regression gates in CI.
- **Upgrade path**: Adopt **Temporal Cloud** for robust, resumable flows (timeouts, cron, compensation) once V1 nears.

---

## 5) Knowledge & Retrieval (RAG)

- **Parsing**: unstructured.io (local) for PDFs/HTML/Office; backups with textract.
- **Chunking**: semantic + structural (headings, tables); store **source spans** for citations.
- **Embeddings**: `text-embedding-3-large` or equivalent; store vectors in **pgvector**.
- **Retrieval**: hybrid (BM25 + vector); **coverage view** computed per source; freshness scoring.
- **Citations**: persist URL/file + byte offsets; render inline in UI and traces.

---

## 6) Model Providers & Tools

- **LLM abstraction**: support OpenAI + Anthropic at minimum; late‑bind via environment config.
- **Tooling**: official APIs (Gmail, Slack, HubSpot/Salesforce, Google Drive, OneDrive, Dropbox, Jira/GitHub Issues). **Notion is optional** and not required.
- **Safety**: output moderation + allowlist egress for Actions; schema‑validated tool outputs.

---

## 7) Data Stores

- **Primary DB**: **Postgres** (Neon or AWS RDS). Use **pgvector** for embeddings.
- **Cache/Queues**: **Redis** (Upstash for MVP → ElastiCache later).
- **Blob**: **S3** for artifacts (traces, fixtures, demo outputs).
- **Analytics**: **PostHog Cloud** for product; warehouse to **ClickHouse** or BigQuery when needed.

---

## 8) Observability & Quality

- **Tracing/metrics**: OpenTelemetry SDKs; ship to **Datadog** or Grafana stack.
- **Errors**: **Sentry** (web + server + Python workers).
- **LLM tracing/costs**: Langfuse or Helicone (pick one) for prompts, versions, and spend.
- **Dashboards**: WSAO, success %, p95 latency, $/outcome, tool failure taxonomy.

---

## 9) Security & Compliance (stack choices)

- **Auth**: **Clerk** (MVP→Team) → **WorkOS** for SAML/SCIM in Business/Enterprise.
- **Secrets**: AWS Secrets Manager + KMS; no secrets in code or Warp Drive.
- **PII Redaction**: field‑level redaction at ingestion + pre‑LLM call; configurable per workspace.
- **Audit**: append‑only events; export by tier.

---

## 10) DevOps & Infra

- **Hosting**: Vercel (web) + AWS (API/workers). ECS Fargate for Python workers; Lambda acceptable for small tasks.
- **CI/CD**: GitHub Actions; build, test, lint, typecheck, Docker, deploy.
- **IaC**: Terraform (or SST if you prefer TS‑infra). Separate stacks: core, data, app.
- **Feature flags**: GrowthBook (OSS/Cloud) to ramp features.
- **Queues/cron**: Redis (BullMQ) for MVP; migrate recurring/long‑running to Temporal Cloud in V1.
- **CDN & assets**: Vercel CDN + S3/CloudFront for heavy downloads.

---

## 11) Product Analytics & SEO

- **Events**: RudderStack/Segment → PostHog; map `onboarding_*`, `marketplace_*`, `outcome_*`, `trace_*`, `paa_*`.
- **A/B**: GrowthBook experiments.
- **SEO**: Next.js metadata; server‑rendered marketplace detail pages.

---

## 12) Payments & Plans

- **Stripe Billing**: subscription tiers + **WSAO credit** bundles; budget notifications at 80%/100%.
- **Entitlements**: check per request; gate destructive actions.

---

## 13) Internal Workflow (Warp)

- **Warp Drive**: Workflows (build/test/release), Notebooks (runbooks), Prompts (PRs, changelogs), Rules (`WARP.md`).
- **Agents**: enable “Drive as context”; store repo‑kickoff Notebooks and incident runbooks; no secrets.

---

## 14) Optional Alternatives (No Notion/No Linear)

- **Docs & knowledge**: Google Drive + Markdown in repo + Warp Notebooks; later add Dropbox/OneDrive.
- **Issues/PM**: GitHub Issues/Projects; Jira only if a partner demands it; **Linear not required**.
- **Chat & tickets**: Slack + HelpScout/Intercom for support; connect via Actions when needed.

---

## 15) MVP → V1 → V2 (stack evolution)

- **MVP**
  - Next.js on Vercel; NestJS API on AWS; Python workers on Fargate.
  - Postgres (Neon) + pgvector; Redis (Upstash); S3; PostHog; Sentry; Datadog light.
  - OpenAI primary; Anthropic optional; unstructured.io; citations live; **Sim Mode**.
- **V1**
  - **Temporal Cloud** for orchestration; DSL builder + test bench; verified creators; approvals/redaction; SSO via WorkOS.
  - Observability hardened; pack KPIs; marketplace ranking (Quality Score).
- **V2**
  - Data residency; private networking; enterprise catalogs; paid marketplace; auto‑tuning packs; on‑prem path on EKS if required.

---

## 16) Buy vs Build Calls (opinionated)

- **Buy now**: Vercel, Stripe, Clerk, PostHog, Sentry, Datadog (or Grafana Cloud), Temporal Cloud.
- **Build**: Pack/Agent models, DSL + visual builder, PAA, Marketplace ranking/quality, Policy Engine, Knowledge coverage/citations.

---

## 17) Concrete Service List (shopping checklist)

- **Web**: Vercel
- **API**: AWS (ECS Fargate or Lambda) + Route53 + ALB
- **Workers**: AWS ECS Fargate (Python)
- **DB**: Neon or AWS RDS Postgres (+ pgvector)
- **Cache/Queue**: Upstash Redis → ElastiCache later
- **Storage**: S3 (+ CloudFront)
- **Orchestration**: Temporal Cloud (V1), BullMQ in MVP
- **LLM**: OpenAI + Anthropic (provider toggle)
- **Parsing**: unstructured.io
- **Auth**: Clerk → WorkOS (SSO/SCIM)
- **Payments**: Stripe
- **Analytics**: PostHog (+ RudderStack/Segment optional)
- **Observability**: Sentry + Datadog (APM, logs) or Grafana stack
- **Email/SMS**: Resend + Twilio (optional)

---

## 18) Immediate Next Steps (actionable)

- Approve this blueprint (or mark any substitutions).
- I’ll generate:
  - **Repo scaffold** (Turbo monorepo: `apps/web` Next.js, `apps/api` NestJS, `services/agents` Python).
  - **IaC starter** (Terraform modules for Vercel envs, RDS/Neon, S3, Redis, ECS service).
  - **Warp Drive kit**: Kickoff Notebook + 10 core Workflows + Rules + Prompts.

---

## FAQ

- **Do we need Notion or Linear?** No. Use Google Drive + Markdown + Warp Notebooks for docs, and GitHub Issues/Projects for PM. Notion/Linear can be supported later as **optional connectors** only.
- **Why not GraphQL?** REST + WebSocket is simpler to start and plays nicely with polyglot services. Add GraphQL if external consumers demand it.
- **Why pgvector over Pinecone?** Fewer moving parts, strong locality with OLTP data, simpler ops. We can externalize later if retrieval scale demands it.
- **Can we swap Clerk?** Yes — Auth0 is a drop‑in replacement. For enterprise SSO we standardize on WorkOS.
