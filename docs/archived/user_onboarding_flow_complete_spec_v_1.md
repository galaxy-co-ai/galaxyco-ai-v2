# GalaxyCo.ai — User Onboarding Flow — Complete Spec (V1)

## Purpose

Define the **exact onboarding experience** from signup to first useful dashboard. This is an implementation spec for Warp and designers. Follow it **as written**.

---

## Principles

- **Speed**: Useful personalized dashboard in ≤90 seconds.
- **Clarity**: No jargon. Minimal choices. Defaults do the heavy lifting.
- **Personalization**: Output = persona, pain points, tools, sensitivity → used to auto‑compose dashboard + Starter Pack.
- **Transparency**: Show what was selected and why.
- **Expandability**: Easy toggles, add/remove agents, explore marketplace.

---

## Glossary

- **Agent**: A single-purpose AI worker.
- **Pack**: Curated set of agents optimized for a persona/pain‑point cluster.
- **Persona**: Role + industry.

---

## Step‑by‑Step Flow

### Step 1 — Welcome

- **Message**: “Welcome to GalaxyCo.ai — your AI‑powered team of agents.”
- **Subtext**: “Answer a few quick questions so we can create your personalized dashboard.”
- **CTA**: **Get started** (single primary button). No secondary.

### Step 2 — Role & Industry

- **Role (single‑select)**: Founder, Sales, Operations, Support, Finance, Product, Other.
- **Industry (select + search)**: Common list + freeform search.

### Step 3 — Pain Points

- **Prompt**: “What slows you down the most?”
- **Input**: Short NL text (2–3 lines max).
- **Chips (multi‑select)**: Lead follow‑up, Reporting, Customer tickets, Knowledge management, Content creation, Meeting notes, Other.

### Step 4 — Tool Stack

- **Prompt**: “Which tools do you use?”
- **Toggles**: Gmail, Slack, HubSpot, Salesforce, Notion, Google Drive, Dropbox, Sheets, Docs, Calendar, Other.
- **Note**: **Skip auth** here; connections can be added later.

### Step 5 — Data Sensitivity

- **Question**: “Do you handle sensitive or regulated data?”
- **Options**: Yes / No.
- **Effect**: If **Yes**, set compliance defaults (stricter logging, redaction on, on‑prem suggestion if applicable).

### Step 6 — Summary

- **Headline**: “Your workspace is ready.”
- **Copy**: “Based on your answers, we recommend the **[Starter Pack Name]**.”
- **Preview list**: 3–5 agents with one‑sentence descriptions.
- **CTA**: **Create my workspace** (primary). Secondary: **Edit choices** (optional link).

---

## Output Data Contract (Onboarding Payload)

**Object: `onboarding_profile`**

- `persona.role`: one of [founder, sales, ops, support, finance, product, other]
- `persona.industry`: string
- `pain_points.free_text`: string ≤ 280 chars
- `pain_points.tags`: array[string]
- `tools.selected`: array[string] (ids)
- `sensitivity.flag`: boolean
- `starter_pack.recommended_id`: string (derived)
- `timestamp`: ISO8601

Persist to user profile; use to seed dashboard + Starter Pack.

---

## Personalization Rules (Derivation)

- **Starter Pack** (examples):
  - **Founder Ops** → role=Founder OR tags include Reporting/Docs; tools: Gmail/Drive/Notion.
  - **Sales Ops** → role=Sales OR tags include Lead follow‑up/Reporting; tools: Gmail/HubSpot/Salesforce.
  - **Support Excellence** → role=Support OR tags include Customer tickets/CSAT; tools: Slack/Zendesk.
  - **Docs & Knowledge** → tags include Knowledge management/Docs chaos; tools: Drive/Notion.
  - **Finance Ops** → role=Finance OR tags include Reporting/Close.
- **Dashboard Widgets (pick 4–6)** based on role+tags:
  - Today Panel, KPI Snapshot (role‑specific), Agent Activity Feed, Knowledge Coverage, Integrations Status, Quick Create.

---

## First Dashboard Load (Post‑Onboarding)

- **Must show**: personalized widgets, installed Starter Pack, and **Next Best Actions** (3):
  1. Toggle agents in your Pack
  2. Explore Marketplace
  3. Connect your tools
- **No blank states**: use example data until real data is connected.

---

## Agent Card Requirements

- Title + one‑sentence purpose
- Attributes: strengths, limitations, data needs
- KPIs: success rate, avg time saved, usage volume
- Integrations list
- Best pairings (agents/packs)
- CTAs: **Add to Pack** (primary), **Preview** (secondary)
- States: default, installed, disabled, error
- Ratings & reviews: star + count + last updated

---

## Edge Cases & Fallbacks

- **User skips all tools** → show example data; surface “Connect tools” as a top action.
- **No clear pack match** → default to Docs & Knowledge, with a prompt to refine pain points.
- **Poor connectivity/slow API** → skeleton loaders; allow completing onboarding offline; hydrate later.
- **Back navigation** → changes persist between steps.

---

## Copy & Tone

- Voice: **clear, confident, friendly**.
- Use direct verbs: “Create my workspace”, “Add to Pack”, “Connect tools”.
- Avoid jargon: do not use “wizard,” “deploy,” “instantiate.”

---

## Tracking & Analytics (Event Names)

- `onboarding_started`
- `onboarding_role_industry_submitted`
- `onboarding_pain_points_submitted`
- `onboarding_tools_selected`
- `onboarding_sensitivity_set`
- `onboarding_summary_confirmed`
- `dashboard_first_load`
- `starter_pack_installed`

Each event includes `user_id`, `timestamp`, and structured payload (where applicable).

---

## Accessibility & Performance

- FCP < 1.5s (mid devices).
- Interactions < 100ms for common actions.
- Keyboard‑navigable, visible focus states, screen‑reader labels.

---

## Security & Privacy

- If `sensitivity.flag = true`: default PII redaction ON, stricter logs, disable external share by default.
- Provide persistent “Data usage” link from onboarding summary.

---

## Non‑Goals (V1)

- Do not require payments.
- Do not require integrations before showing value.
- Do not ship a blank dashboard.

---

## V1 Acceptance Checklist

- [ ] **Six‑step flow implemented**: Welcome → Role & Industry → Pain Points → Tool Stack → Data Sensitivity → Summary.
- [ ] **Onboarding payload persisted** with fields: `persona.role`, `persona.industry`, `pain_points.free_text`, `pain_points.tags`, `tools.selected`, `sensitivity.flag`, `starter_pack.recommended_id`, `timestamp`.
- [ ] **Starter Pack auto‑selected** per rules and **installed by default** at first dashboard load.
- [ ] **Personalized dashboard renders instantly** with widgets picked by persona (Today Panel, KPI Snapshot, Agent Activity, Knowledge Coverage, Integrations, Quick Create). Example data until real data connected.
- [ ] **Next Best Actions visible**: Toggle agents; Explore Marketplace; Connect tools.
- [ ] **Agent cards meet spec** (purpose, attributes, KPIs, integrations, best pairings, Add to Pack/Preview CTAs, states, ratings & last updated).
- [ ] **Marketplace accessible** within one click; filter/sort/search working; install flow simulates with sample data if integrations missing.
- [ ] **Builder accessible** from nav; dual‑mode toggle visible; edits sync between Visual and DSL; Test Bench works for a sample flow.
- [ ] **Knowledge UI** shows Sources, Coverage, and Citations; ingestion progress and errors surfaced.
- [ ] **Edge cases handled** (no tools, no pack match, poor connectivity, back nav persistence).
- [ ] **Analytics events** emitted with correct payloads (list above).
- [ ] **Accessibility** meets WCAG AA; **Performance** budgets met.
- [ ] **Security defaults** applied when sensitivity=true (redaction/logging/sharing controls).
