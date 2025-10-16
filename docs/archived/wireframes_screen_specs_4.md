# GalaxyCo.ai — Wireframes / Screen Specs (4.2)

## Scope & Principles

- Covers **app screens** required for MVP → V1. Marketing site is out of scope.
- Inspirations to emulate **only**: **StackAI** (enterprise polish), **OpenSea** (card marketplace), **OpenAI Agent Builder** (friendly building), **Sider** (human knowledge UI).
- **Packs by default**, **PAA present on Day‑1**, **dual‑mode builder**, **citations for answers**, **KPIs on cards**.
- Avoid tables in copy. Use clear bullets and canonical CTAs for Gamma.

---

## Global Layout & Navigation

- **Top Bar**: workspace switcher, global search, notifications, user menu.
- **Left Nav**: Dashboard, Packs, Agents, Marketplace, Builder, Knowledge, Integrations, Monitoring, Approvals, Settings.
- **Right Rail (contextual)**: **PAA Panel** with suggestions, issues, and next best actions.
- **Breadcrumbs**: visible on detail views (Pack / Agent / Builder / Knowledge doc).
- **Command Menu** (⌘K / Ctrl‑K): quick nav, “Add to Pack,” “Open Builder,” “Connect tool.”

---

## Design Tokens & Grid (reference for comps)

- **Grid**: 12‑column; 24px gutters; max content width 1280–1440px.
- **Spacing**: 4, 8, 12, 16, 24, 32, 48.
- **Corners & Elevation**: radius 16px (cards), shadows subtle; hover elevation +1.
- **Type Scale**: Display, H1, H2, H3, Body, Caption; line‑height ≥ 1.4.
- **Motion**: 150–200ms ease; micro‑interactions only (no cartoonish effects).
- **States**: loading skeletons, optimistic spinners, empty placeholders with action.

---

## Component Patterns (reused across screens)

- **Card**
  - Header: title, icon, status chip.
  - Body: 2–3 key facts or KPIs.
  - Footer CTAs: primary, secondary.
- **Agent Card**
  - Title, purpose, attributes, **KPIs** (success %, time saved, last updated), integrations, best pairings.
  - CTAs: **Add to Pack**, **Preview with sample data**.
- **Pack Card**
  - Persona/industry, included agents, weekly goals, **Pack KPIs**.
  - CTAs: **Install Pack**, **Customize**.
- **Filter Bar**
  - Facets: Persona, Industry, KPI, Integration, Popular/New; sort: Trending/Highest Rated/Most Installed/Newest.
- **Stat Blocks**
  - Compact KPI tiles for counts and rates (WSAO, success %, latency, cost).
- **Forms**
  - Inline validation; helper text; destructive actions require confirmation.
- **Modals/Drawers**
  - Approvals, connection flows, run previews, weekly review.
- **Toasts**
  - Success/Warning/Error; link to trace on failure.
- **Empty States**
  - Clear value statement + primary action + link to docs or sample run.

---

## Screens

### 1) Auth / Signup

**Purpose**: get users into the workspace fast.
**Layout**: centered card; SSO buttons; email/pass; legal links.
**Primary actions**: Continue with Google/Microsoft; Create account.
**States**: loading, error, SSO consent.
**Copy**: “Create my workspace.”
**Telemetry**: `auth_start`, `auth_success`, `auth_error`.
**Acceptance**: SSO and email both work; error messaging clear.

---

### 2) Onboarding (6 Steps)

**Purpose**: ≤90s intake; compose Starter Pack.
**Entry**: post‑signup or from Settings → Re‑run onboarding.
**Layout**: progress steps with back/next; right preview panel shows **Pack preview** updating live.
**Steps**

1. **Role & Industry**: role picker; industry overlays.
2. **Top Pains**: 3 selectable chips; optional free‑text.
3. **Preferred Outcomes**: pick 1–2 Day‑1 outcomes.
4. **Tools**: connect or **Sim Mode**; show integration cards.
5. **Sensitivity**: redaction toggle; approval defaults.
6. **Summary**: show proposed **Starter Pack** agents, KPIs, and Next Best Actions.
   **Primary actions**: Next / Back / **Create my workspace**.
   **States**: loading, validation errors, “skip connection” → Sim Mode badge.
   **Copy**: “We’ll install a Starter Pack you can edit anytime.”
   **Telemetry**: `onboarding_step_*`, `starter_pack_installed`.
   **Acceptance**: creates dashboard, installs Pack + **PAA**.

---

### 3) Dashboard (Home)

**Purpose**: zero‑blank state; see progress and act quickly.
**Layout**

- **Today Panel**: next actions; approvals; **PAA suggestions**.
- **KPI Snapshot**: WSAO, success %, p95 latency, cost.
- **Agent Activity**: recent outcomes with status and links to traces.
- **Knowledge Coverage**: % coverage, gaps list, **Fix gap** CTA.
- **Integrations**: connected vs. suggested; connect buttons.
  **Primary actions**: Approve, Add to Pack, Connect tool, Open Builder, Explore Marketplace.
  **States**: Sim Mode badges when tools aren’t connected.
  **Telemetry**: `dashboard_first_load`, clicks per widget.
  **Acceptance**: never blank; at least one example outcome runnable.

---

### 4) PAA Panel & Weekly Review

**Purpose**: always‑on assistant.
**Layout**: right rail panel with tabs: Suggestions, Issues, Reviews.
**Weekly Review Modal**: outcomes summary, bottlenecks, proposed changes (add/remove/reorder agents), coverage tasks.
**Primary actions**: Apply all, Approve changes, Dismiss.
**Telemetry**: `paa_suggestion`, `paa_review_accepted`.
**Acceptance**: visible on Dashboard; can apply safe changes subject to approvals.

---

### 5) Marketplace — Browse

**Purpose**: discover agents & Packs.
**Layout**: filter bar; **card grid** (OpenSea‑style) with KPIs, ratings, verified badges.
**Card**: title, purpose, KPIs, best pairings, updated timestamp.
**Primary actions**: Install Pack, Add to Pack, Preview.
**States**: empty (no matches), loading skeletons, error.
**Telemetry**: `marketplace_view`, `marketplace_filter`, `install_click`.
**Acceptance**: filters + sort usable; verified badges visible; trending section.

---

### 6) Marketplace — Detail (Agent / Pack)

**Purpose**: evaluate and install.
**Layout**: hero with title and purpose; tabs for Overview, KPIs, Changelog, Reviews.
**Demo**: **Preview with sample data** button; show output + citations.
**Primary actions**: Install Pack / Add to Pack; View in Builder.
**Telemetry**: `preview_run`, `install_success`, `install_failure`.
**Acceptance**: demo run works in Sim Mode; KPIs visible.

---

### 7) Pack View

**Purpose**: manage team of agents.
**Layout**: header with persona/industry; goals; **Pack KPIs**.
**List**: agents with toggles, priority drag, health status.
**Panel**: right drawer to edit agent settings.
**Primary actions**: Add agent, Set weekly goals, Reorder, Remove.
**Telemetry**: `pack_agent_toggled`, `pack_goal_set`.
**Acceptance**: reorder works; goals persist; KPIs update over time.

---

### 8) Agent Detail

**Purpose**: inspect and test a single agent.
**Layout**: summary, tools, knowledge refs, policies, KPIs.
**Test Bench**: run with fixtures; see trace and citations.
**Primary actions**: Add to Pack, Open in Builder, Run test.
**Telemetry**: `agent_run`, `agent_added_to_pack`.
**Acceptance**: trace and citations visible; errors categorized.

---

### 9) Builder — Visual

**Purpose**: assemble/edit flows with nodes.
**Layout**: canvas with pan/zoom, minimap; left node palette; right properties; bottom **Test Bench**.
**Nodes**: Input, Tool, Decision, Knowledge, LLM, Output.
**Interactions**: drag, connect, snap, inline node test.
**Primary actions**: Run, Save version, Rollback, Switch to DSL.
**Telemetry**: `builder_visual_edit`, `builder_run`, `builder_save`.
**Acceptance**: visual ↔ DSL stays in sync; run shows step latencies and token usage.

---

### 10) Builder — DSL

**Purpose**: precise control and review.
**Layout**: code editor with schema validation, lint hints; right live preview of graph.
**Features**: history with diffs; rollback; typeahead for actions/tools/agents.
**Primary actions**: Run, Save, Switch to Visual.
**Telemetry**: `builder_dsl_edit`, `builder_dsl_error`.
**Acceptance**: schema errors surfaced; history records; sync round‑trip intact.

---

### 11) Knowledge — Sources

**Purpose**: connect and monitor sources.
**Layout**: **tile grid** per source with icon, last sync, status, items indexed.
**Actions**: Connect, Re‑sync, Troubleshoot, Permissions.
**Primary actions**: Connect source, Upload file.
**Telemetry**: `source_connected`, `index_started`, `index_error`.
**Acceptance**: incremental sync, error surfacing, retries.

---

### 12) Knowledge — Coverage

**Purpose**: understand “what we know.”
**Layout**: topic list with coverage %, freshness; **Gaps** section with quick fixes.
**Primary actions**: Fix gap (connect, upload, request doc), Open PAA task.
**Telemetry**: `coverage_viewed`, `gap_fix_started`.
**Acceptance**: citations and coverage link back to sources.

---

### 13) Integrations

**Purpose**: authenticate and verify connectors.
**Layout**: list of connectors with status; connection drawer with auth scopes and sample outputs.
**Primary actions**: Connect, Test, Simulate.
**Telemetry**: `connector_connected`, `connector_tested`.
**Acceptance**: retries, backoff, and Sim Mode available.

---

### 14) Monitoring & Traces

**Purpose**: see reliability/cost/perf; debug failures.
**Layout**: top KPIs; outcome list; detail view with step timeline, tokens, latency, tool errors; **citations panel**.
**Primary actions**: Open trace, Retry, Create issue, Rollback.
**Telemetry**: `trace_opened`, `retry_clicked`, `rollback`.
**Acceptance**: p95 metrics visible; link from outcome → trace.

---

### 15) Approvals Queue

**Purpose**: gate destructive/bulk actions.
**Layout**: list with scope, requestor (agent), preview of change, risk signals.
**Primary actions**: Approve, Deny, Ask PAA.
**Telemetry**: `approval_granted`, `approval_denied`.
**Acceptance**: approvals block execution unless enabled as Auto‑Approve.

---

### 16) Settings

**Purpose**: workspace and governance.
**Sections**: Profile, Billing (light), Roles & Permissions, Policies (redaction/approval), Data residency.
**Primary actions**: Invite user, Set role, Toggle redaction, Export audit log.
**Telemetry**: `role_changed`, `policy_updated`.
**Acceptance**: RBAC enforced; audit exports work.

---

### 17) Error & Empty Pages

**Purpose**: graceful failures.
**Layouts**: 404, 500, Rate‑limit; each with retry/back and link to status page.
**Acceptance**: never dead ends; PAA suggests next step.

---

### 18) Responsive Behavior

**Mobile**: bottom tab bar; simplified cards; drawer modals.
**Tablet/Desktop**: full left nav; right PAA rail visible ≥ 1280px.
**Performance**: lazy‑load heavy sections; maintain 60fps on interactions.

---

## Accessibility & Performance Budgets

- **A11y**: color contrast AA; focus states visible; keyboard navigation; aria labels for dynamic regions; reduced motion respect.
- **Perf budgets**: initial dashboard ≤ 2.5s TTI on mid‑tier laptop; marketplace grid LCP ≤ 1.8s; builder canvas interactions ≤ 16ms per frame.

---

## Copy Tokens (canonical CTAs)

- **Primary**: Create my workspace · Install Pack · Add to Pack · Preview with sample data · Connect tool · Open Builder · Approve
- **Secondary**: Customize · Reorder · Fix gap · View trace · Rollback · Ask PAA

---

## Telemetry Events (global)

- `ui_view:*` per route; `cta_click:*` per CTA id; `error:*` with code; `perf:*` for LCP/TTI; `a11y:*` for violations in QA.

---

## Edge Cases & States

- **Sim Mode** clearly labeled everywhere sample data is used; disable destructive actions.
- **Rate limits** show countdown and retry plan; PAA opens issue if persistent.
- **Permission errors** prompt role owner; show request access CTA.

---

## V1 Acceptance Checklist (Screens)

- Dashboard never blank; Starter Pack + PAA installed on first load.
- Marketplace filters/sort; Agent/Pack cards render KPIs; detail previews run in Sim Mode.
- Builder visual ↔ DSL sync; Test Bench + traces visible; rollback works.
- Knowledge Sources & Coverage views implemented; citations on answers everywhere.
- Integrations connect with retries; Approvals queue blocks destructive scopes.
- Monitoring & Traces show p95 latency, success %, cost; link from outcomes.
- Settings enforce RBAC; audit export available; redaction toggle functional.
