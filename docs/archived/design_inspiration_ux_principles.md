# GalaxyCo.ai — Design Inspiration & UX Principles

## Purpose & Scope

This document is a **non-ambiguous build spec** for Warp. It defines how GalaxyCo.ai should **look, feel, and behave** across onboarding, dashboard, marketplace, builder, and knowledge. Avoid interpreting or substituting alternatives. Follow the **MUST / SHOULD / DO NOT** guidance exactly.

---

## Design Targets (Inspiration → Directive)

- **StackAI → Enterprise polish**: MUST feel credible, clean, and production-grade at first glance.
- **OpenSea → Gamified marketplace**: MUST present agents and packs as **cards** with discoverability, rarity/popularity signals.
- **OpenAI Agent Builder → Simplicity**: MUST provide a guided, low-friction creation flow (natural language first), with sensible defaults.
- **Sider → Human-friendly knowledge UI**: MUST make knowledge bases feel approachable with **source tiles** and plain-language explanations (not “faceless databases”).
- **Fortnite (energy), tempered**: SHOULD use **subtle playful motion and color accents** without cartoonish extremes. **DO NOT** use juvenile illustrations or loud gradients.

---

## Global UX Principles

1. **Clarity over control** (MUST): Defaults solve 80% of cases. Advanced options are progressive-disclosed.
2. **Personalization from minute 1** (MUST): No blank states after onboarding. A working dashboard renders instantly.
3. **Consistency** (MUST): One spacing scale, one radius scale, one motion system.
4. **Transparency** (MUST): Show what agents know, why they acted, and KPIs.
5. **Speed** (MUST): Perceived interactions <150ms; primary views <1.5s; heavy loads show skeletons.
6. **Accessibility** (MUST): WCAG AA contrast; keyboard-first; focus states visible; motion-reduced mode.
7. **Tasteful Play** (SHOULD): Microinteractions that delight, never distract.

---

## Information Architecture & Navigation

Top-level nav (left sidebar): **Dashboard, Agents, Packs, Marketplace, Builder, Knowledge, Integrations, Monitoring, Settings**.

- **Dashboard**: Personalized home. KPIs, tasks, agent activity.
- **Agents/Packs**: Library + management.
- **Marketplace**: Discovery, filters, and install flows.
- **Builder**: Dual-mode visual & DSL editor.
- **Knowledge**: Sources, ingestion status, coverage.
- **Integrations**: Connectors and auth.
- **Monitoring**: Logs, metrics, alerts.

---

## Onboarding Flow (V1 — MUST implement)

**Goal**: From signup to a useful, personalized dashboard with a recommended Pack in **≤ 90 seconds**.

1. **Welcome**: Promise of outcome; privacy note.
2. **Role & Industry**: Quick selects for role (Founder, Sales, Ops, Support, Finance, Product, Other) and industry.
3. **Pain Points**: Natural language prompt (2–3 lines) with selectable chips (Lead follow-up, Reporting, Tickets, Docs chaos…).
4. **Tool Stack**: Toggle list of tools (Gmail, Slack, HubSpot, Notion, Google Drive). Auth optional.
5. **Data Sensitivity**: Yes/No for sensitive data → configures compliance.
6. **Summary**: Recommend Pack + tailored dashboard. CTA: **Create my workspace**.

**Acceptance Criteria**:

- Personalized dashboard generated instantly.
- Starter Pack installed.
- Three “Next best actions” surfaced.

---

## Personalized Dashboard Spec

- **Layout**: Two-column responsive grid; sticky right rail.
- **Widgets auto-selected based on persona**:
  - Today Panel: tasks, suggestions, recent activity.
  - KPI Snapshot: 3 role-specific metrics.
  - Agent Activity Feed.
  - Knowledge Coverage.
  - Integrations status.
  - Quick Create workflow input.
- **Empty states**: Always show sample data + CTA.

---

## Agent Card Spec

- MUST include: title, one-sentence purpose, attributes, KPIs, integrations, best pairings.
- MUST show: success rate, avg time saved, usage volume.
- CTAs: **Add to Pack** (primary), **Preview** (secondary demo).
- States: default, installed, disabled, error.
- Ratings & reviews: visible with star count + last updated.

---

## Pack Spec

- Definition: curated set of agents optimized for persona/pain-point cluster.
- Default starter packs: Founder Ops, Sales Ops, Support Excellence, Docs & Knowledge, Finance Ops.
- Controls: toggle agents, reorder, set weekly goals.
- Synergy tags: show shared data/flow.
- Outcomes: expected KPIs and weekly progress.

---

## Marketplace

- Filters: persona, industry, KPI, integration, popularity, new.
- Sort: trending, highest rated, most installed, newest.
- Search: fuzzy, supports synonyms.
- Detail page: description, demo, KPIs, changelog, dependencies.
- Install flow: confirm integrations; simulate with sample data.

---

## Builder (Dual-Mode)

- **Visual Mode**: node/edge flow builder with zoom, minimap, timeline.
- **DSL Mode**: text editor with schema validation + instant preview.
- **Mode toggle**: always visible; bidirectional sync.
- **Test Bench**: run with fixtures; traces, tokens, latency.
- **History**: versioning, diffs, rollback.

---

## Knowledge UI

- **Sources View**: tiles for each source, status, last sync.
- **Coverage View**: plain-language description of what’s indexed.
- **Explainability**: citations + “why used” for answers.
- **Ingestion UX**: drag-drop, progress bar, large file handling.

---

## Gamification & Community

- Profiles for publishers; verified badges.
- KPIs on cards; trending list.
- Collections: users save/share agents and packs.
- Report & review pipeline.

---

## Visual System

- Color: neutral base + 1 primary accent; no neon.
- Typography: modern sans (e.g., Inter); H1-H4 hierarchy.
- Corners & Elevation: medium radius, soft shadows.
- Motion: 120–200ms micro; 240–320ms transitions; reduced-motion mode.
- Icons: minimal line; no mascots.

---

## States & Feedback

- Skeleton loaders.
- Optimistic UI for installs.
- Errors: plain language + recovery.
- Empty: sample data + CTA.

---

## Accessibility & Performance

- FCP <1.5s mid devices.
- Interactivity <100ms.
- Keyboard operable; focus rings; screen reader labels.

---

## Copy & Tone

- Voice: clear, confident, friendly. No jargon.
- Examples: “Create my workspace”, “Add to Pack”, “Preview with sample data”.
- DO NOT: use “wizard”, “AI magic”, or jokey slang.

---

## Non-Goals

- DO NOT show blank dashboard.
- DO NOT require integrations before value.
- DO NOT use heavy 3D or cartoonish visuals.

---

## V1 Acceptance Checklist

- Guided onboarding flow.
- Starter Packs for 5 personas.
- Marketplace with filters, ratings, install flow.
- Builder supports visual + DSL with sync.
- Knowledge UI with sources, coverage, citations.
- Accessibility and performance budgets met.
