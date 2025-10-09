# GalaxyCo.ai — Internal Dev Workflow (Warp) (6.3)

## Purpose

Codify how we use **Warp** and **Warp Drive** to ship GalaxyCo.ai faster, safer, and more consistently — from repo bootstrap to release and incident response. This doc is executable as a checklist for founders, PMs, designers, and engineers.

> Inspirations we align to: **Warp Drive** (team knowledge, Workflows, Notebooks, Prompts, Env Vars), **Agents & Rules** (global/project), **MCP** (extensible tools/data). No opinionated backend vendor here (explicitly **no Supabase** requirement).

---

## Team Setup (one‑time)

1. **Create GalaxyCo Team** in Warp and invite all eng + design + ops.
2. **Enable “Warp Drive as Agent Context”** in Settings so Agents pull Drive objects automatically when relevant.
3. **Drive taxonomy** (create folders):
   - `/Onboarding` — Welcome Notebook, laptop setup, shell profile, OS hardening
   - `/Workflows` — parameterized commands (build, test, release, observability)
   - `/Prompts` — parameterized Agent prompts (codegen, refactor, runbook assistants)
   - `/Rules` — `Global/` (style, legal) and `Project/` subfolders
   - `/Env` — non‑secret environment variable sets per environment
   - `/Runbooks` — incident notebooks; DR, rollout/rollback, hotfix
   - `/Integrations` — MCP server configs, CLI helper docs
4. **Roles & permissions**
   - Owners: founders/infra; Admins: eng leads; Members: ICs; Viewers: contractors
   - Share by default at **team workspace** level; sensitive objects shared directly by email
5. **Admin policies**
   - Allow **direct link sharing** internally; disable public “anyone with link” by default
   - Require login + MFA for team membership; rotate access quarterly

---

## Project Bootstrap (per repo)

1. **Create Project Notebook** (`/Onboarding/<repo>-kickoff.md`)
   - Sections: Context, Goals, Architecture sketch, Dev env, Commands, Release, Observability
   - Include runnable code blocks for `pnpm install`, `make dev`, local DB start, migrations
2. **Seed Workflows** (`/Workflows/<repo>/...`)
   - `dev:start`, `test:unit`, `lint:fix`, `typecheck`, `e2e`, `db:migrate`, `db:reset`, `release:dry-run`, `release:prod`
   - Add **arguments** (env, service, version); add **descriptions**
3. **Project Rules** (`/Rules/Project/<repo>/WARP.md`)
   - Coding standards, commit format, review rubric, API design tenets, security posture
   - Agent guardrails (don’t touch infra dirs, don’t write to secrets, etc.)
4. **Env Vars** (`/Env/<repo>/*.env`)
   - Non‑secrets only (feature flags, endpoints)
   - Document how agents reference secrets via cloud KMS/secret manager (never store secrets in Drive)
5. **Prompts** (`/Prompts/<repo>/...`)
   - “Refactor Module”, “Write Test for Function”, “Generate Migration Plan”, “Changelog From Diffs”
6. **MCP Adapters (optional)**
   - Register MCP servers for GitHub/Jira/Linear/Datadog/Sentry/Notion as needed

---

## Daily Developer Loop

1. **Pick a task** → open Agent conversation in Warp.
2. **Attach context with **`` to reference Drive objects (Notebook/Workflow/Rule) and local files.
3. **Plan then act**
   - Ask Agent to propose a step plan; review diffs; approve step‑by‑step (no blind writes)
   - Use **Workflows** for repeatable steps; tweak arguments in Command Palette
4. **Run & iterate**
   - Use **Blocks** to ask “Explain error / propose fix”; retry with suggested command
   - Keep test coverage using `test:unit` / `e2e` workflows; persist flaky tests report to Notebook
5. **Commit & PR**
   - Use a **Prompt** for structured commit messages and PR descriptions
   - Run `lint:fix`, `typecheck` before pushing; add Notebook link in PR for reviewers

---

## Code Review & Change Management

- **Agent‑assisted review**: Ask Agent to summarize diffs, potential regressions, and security hotspots.
- **Rules enforced**: PR checklist auto‑generated from `WARP.md` (style, logging, telemetry, docs updated).
- **Change log**: Use Prompt “Changelog From Diffs” to append to `/Onboarding/<repo>-kickoff.md` or `CHANGELOG.md`.

---

## DevOps & Releases

1. **Pre‑flight**: `release:dry-run` workflow → build, tests, smoke, migration check
2. **Release**: `release:prod` workflow → tag, artifacts, deploy, post‑deploy checks
3. **Rollback**: `release:rollback` workflow with arguments (version, env); linked to DR Notebook
4. **Observability hookup**: Workflows for logs, traces, metrics dashboards; Notebook “How to read this dashboard”

---

## Incidents & Pairing

- **Session Sharing**: open a shared terminal during incidents or tricky onboarding; co‑edit live
- **Runbooks**: execute incident Notebooks step‑by‑step; capture findings inline
- **After-action**: Agent drafts post‑mortem from Blocks + Runbook notes; add to `/Runbooks` with lessons

---

## Knowledge Hygiene

- **Export/Import**: keep Workflows (YAML) and Notebooks (MD) versioned in repo under `/warp/`
- **Cleanup Fridays**: archive stale Workflows/Prompts; rotate env var sets; review Rules
- **Searchability**: name things verbosely; add descriptions and arguments to all Workflows

---

## Security & Privacy

- **No secrets in Drive**; only reference secrets via the official secret manager
- **Least privilege**: minimal team roles; direct share for sensitive objects
- **Link sharing**: off by default externally; audit shared objects monthly
- **Offline mode**: Drive objects may be read‑only; plan for local edits and later sync

---

## Metrics (internal)

- Lead time for changes; PR pickup time; CI pass rate; p95 local test runtime
- % changes using a Workflow; # Notebooks updated per week; onboarding TTFV for new hires

---

## V1 Acceptance Criteria (Workflow readiness)

- Team workspace live with taxonomy above; policies enforced; MFA enabled
- Each repo has: Kickoff Notebook, ≥8 core Workflows, Project Rules, Env set, Prompts
- Agents use Drive context by default; developers use `@` to attach context
- Releases run only through `release:*` workflows; rollback tested per service
- Incident Notebook exercised; shared session drill completed by each squad

---

## Non‑Goals (for now)

- Mandating a specific backend or database stack
- Replacing IDEs entirely; Warp complements editors with an agentic terminal
- Storing production secrets in Drive

---

## Appendix — Suggested Drive Structure (copy‑paste)

```
/Onboarding
  └── <repo>-kickoff.md
/Workflows
  ├── repo-a/
  │   ├── dev-start.yaml
  │   ├── test-unit.yaml
  │   ├── e2e.yaml
  │   ├── release-dry-run.yaml
  │   └── release-prod.yaml
  └── repo-b/...
/Prompts
  ├── code-refactor.yaml
  ├── write-test.yaml
  ├── changelog-from-diffs.yaml
  └── bugfix-playbook.yaml
/Rules
  ├── Global/
  │   ├── coding-standards.md
  │   ├── security-tenets.md
  │   └── ux-writing.md
  └── Project/
      └── <repo>/WARP.md
/Env
  ├── staging.env
  └── prod.env
/Runbooks
  ├── incident-<service>.md
  └── rollback-<service>.md
/Integrations
  └── mcp-servers.md
```

