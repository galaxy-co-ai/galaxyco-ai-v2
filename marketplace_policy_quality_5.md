# GalaxyCo.ai — Marketplace Policy & Quality (5.2)

## Purpose
Establish clear rules for listing, reviewing, ranking, and enforcing quality of **Agents** and **Packs** in the GalaxyCo.ai Marketplace. Ensure trust via transparent KPIs, verification tiers, safe execution, and fair discovery. Aligns with inspirations: **StackAI** (enterprise polish), **OpenSea** (card discovery), **OpenAI Agent Builder** (friendly building), **Sider** (human knowledge UI).

---

## Marketplace Objects Covered
- **Agents** — single‑purpose workers.
- **Packs** — curated multi‑agent teams.
- **Extensions** — Connectors/Actions/Transforms surfaced as capabilities (listed separately in Extensibility Model).

---

## Listing Requirements (V1)
To publish an Agent or Pack, creators must provide:
- **Canonical metadata**: title, purpose, description, icon, categories, persona/industry tags.
- **Capabilities**: inputs/outputs, required tools/connectors, knowledge dependencies.
- **Safety & policy**: declared scopes, redaction needs, approval requirements for destructive operations.
- **Performance evidence**: sample run in **Sim Mode** with expected artifacts; trace included.
- **Quality telemetry**: success rate, p95 latency, $/outcome (if applicable), last update timestamp.
- **Changelog**: version history with meaningful notes.
- **Support**: contact link or issue tracker; response window.
- **Compliance**: IP ownership representation; no data exfiltration; no scraping against TOS; privacy posture.

> **Minimum gate**: Listing without telemetry, changelog, or Sim Mode demo is **rejected**.

---

## Verification Tiers
- **Community**: default for new creators. Must meet listing requirements. Badge: none.
- **Verified**: review by GalaxyCo team; code/sandbox checks for Actions/Transforms; telemetry above thresholds; responsive maintainer. Badge: **Verified**.
- **Enterprise**: additional security attestations (SOC2 mapping), support SLAs, signed data‑processing terms. Badge: **Enterprise Verified**.

**Upgrade path**: Community → Verified after **7 days** of clean telemetry; Verified → Enterprise upon passing security review and support SLO agreement.

---

## Quality Signals & Score (used for ranking)
We compute a **Quality Score (QS)** in \[0..100] for each listing. Default weights below; modulate per category as data accrues.

- **Success** (35): recent success rate (weighted to last 30 days) and failure types.
- **Usage** (20): installs, active workspaces, weekly outcomes per workspace.
- **Freshness** (10): last update recency; changelog cadence.
- **Performance** (10): p95 outcome latency; token cost; tool error rate.
- **Trust** (10): verification tier; reviews sentiment; creator responsiveness.
- **Explainability** (10): citation coverage; confidence score availability.
- **Safety** (5): policy violations, approval hygiene, redaction usage.

**Formula (initial)**:  
`QS = 0.35*success + 0.20*usage + 0.10*fresh + 0.10*perf + 0.10*trust + 0.10*explain + 0.05*safety`  
Each sub‑score normalized to 0–100 using cohort percentiles; decayed by recency (half‑life 21 days).

---

## Ranking & Discovery Rules
- **Default sort**: **Trending** = hybrid of QS, install velocity, and recency.
- **Other sorts**: Highest Rated, Most Installed, Newest.
- **Filters**: Persona, Industry, KPI target, Integrations, Popular/New, Verification.
- **Collections**: GalaxyCo staff‑curated sets (e.g., “Founder Ops Starter,” “Support Excellence”).
- **Badges on cards**: Verified/Enterprise, Trending, Recently Updated, Staff Pick.
- **De‑duplication**: variants of near‑identical packs are collapsed; pick top QS.

---

## Reviews & Ratings
- **Star rating + short review** restricted to **installed users** only.
- **Fraud prevention**: one review per workspace per version; cooldown window; anomaly detection for shilling/brigading.
- **Surfacing**: reviews shown with persona tags and recent outcomes context.
- **Moderation**: reports triaged within 48h; abusive content removed per policy.

---

## Creator Responsibilities
- Keep **changelogs** accurate; note breaking changes clearly (SemVer).
- Maintain **simulation fixtures** so preview runs always work.
- Respond to issues within the advertised support window.
- Respect **data scopes** and avoid scraping/TOS violations.
- Honor IP ownership; remove infringing content on notice.

---

## Safety & Governance
- **Policy Engine** enforces approvals for destructive/bulk actions by default.
- **RBAC** respected: listings cannot exceed workspace permissions at runtime.
- **Redaction modes** propagated through Actions; secrets never logged.
- **Auditability**: every install/run logs trace ids; changes tracked.
- **Security scanning** for Python Actions/Transforms prior to verification.

---

## PAA Integration (Quality Ops)
- **Recommendation logic** leverages QS, persona fit, tools connected, and coverage gaps.
- **Watchtower**: PAA flags underperforming listings installed in a workspace (e.g., success < threshold) and proposes higher‑QS alternatives.
- **Review prompts**: after successful outcomes or uninstall, PAA asks for light feedback to improve ranking quality.

---

## Enforcement Ladder (violations & low quality)
1) **Notice**: creator informed; grace period to fix (7 days typical).
2) **Demotion**: listing rank suppressed; badge removed.
3) **Quarantine**: new installs blocked; existing installs warned.
4) **Removal**: listing unpublished; workspace admins notified; migration suggestions provided.
5) **Account action**: creator suspension for repeated or severe violations.

**Instant quarantine/removal** for: malware, data exfiltration, IP violations with evidence, or repeated policy evasion.

---

## Telemetry & Thresholds (initial)
- **Required events**: install_success/failure, preview_run, outcome_success/failure with signals, latency, tokens, cost, tool errors, approvals.
- **Default thresholds** (subject to category tuning):
  - Success rate ≥ **70%** over last 200 runs or 30 days.
  - p95 outcome latency ≤ **12s**.
  - Preview (Sim Mode) success ≥ **99%**.
  - Changelog cadence: ≥ **1 update / 45 days** (or explicit “stable”).
  - Support response SLA: **3 business days** (Verified), **1 business day** (Enterprise).

Listings falling below thresholds receive a PAA/creator alert and enter the **Notice** stage.

---

## Content & IP Policy (summary)
- Must own or have rights to all assets and prompts; no third‑party copyrighted text or logos without permission.
- No embedding of private or regulated data in listing artifacts.
- Public web data must respect robots/TOS; cite sources where appropriate.
- We honor **DMCA‑style** takedowns and will remove infringing content upon valid notice.

---

## Data & Privacy
- Explain data handling in plain language: scopes, retention, redaction.
- No hidden data collection; no external egress beyond declared allowlist.
- For Enterprise listings, support **data residency** tags and DPA on request.

---

## Operational Processes
- **Submission review**: automated checks (schema, telemetry presence, sandbox, security scan) → human review for Verified/Enterprise.
- **Incident response**: security/quality incidents tracked; creator must acknowledge within SLA; status page updates for quarantines.
- **Deprecations**: 90‑day deprecation window with auto‑migration or alternatives; PAA notifies affected workspaces.

---

## UI Requirements (cards & detail pages)
- Cards show: purpose, attributes, **KPIs** (success %, time saved, last updated), integrations, best pairings, badges.
- Detail pages include: demo preview with **citations**, KPIs with time window selector, changelog, reviews, creator profile, permissions.
- Clear **Sim Mode** label on all demo runs.

---

## Acceptance Criteria (V1)
- Listings cannot publish without telemetry, changelog, Sim Mode demo, and policy scopes declared.
- Verification tiers live with badges; Enterprise flow available by request.
- Ranking uses QS with documented weights; filters/sorts operational; badges rendered on cards.
- Reviews restricted to installed users; moderation tools active; fraud signals monitored.
- PAA recommends listings based on QS/persona/coverage gaps and flags underperformers.
- Enforcement ladder implemented through at least **Demotion**; Quarantine path documented.

---

## Non‑Goals (V1)
- Monetization and payouts; global cross‑workspace leaderboards; creator ads; public APIs for external storefronts. (Consider in V2 with Creator Program.)

