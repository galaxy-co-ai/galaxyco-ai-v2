# Warp Drive Kit — Kickoff Notebook, Workflows, Rules & Prompts (Patched)

This pack seeds your **Warp Drive** so Agents have context and the team has repeatable flows. **Place these files under **``** in the repo and mirror to Warp Drive.**

---

## 1) Kickoff Notebook (copy to `/Onboarding/galaxyco-ai-kickoff.md`)

### Title

**GalaxyCo.ai — galaxyco-ai Kickoff**

### Context

- Purpose: Shared starting point for devs/agents; links to workflows, prompts, rules
- Architecture: Next.js (web) · NestJS (api) · Python agents (LangGraph)
- Data: Postgres (+pgvector), Redis, S3

### Dev Environment

```
pnpm i
pnpm dev   # web + api
cd services/agents && uvicorn app:app --reload
```

### Commands

- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`

### Release

- Dry-run: `pnpm run release:dry-run`
- Prod: `pnpm run release:prod`
- Rollback: `pnpm run release:rollback --version <tag>`

### Observability

- Open traces dashboard → *link placeholder*
- Common errors & fixes → bullets

### Notes

- Attach context with `` when chatting with Agents (Notebook/Workflow/Rule/local file).
- No secrets in Drive.

---

## 2) Workflows (copy under `/Workflows/galaxyco-ai/…`)

*(YAML skeleton; adjust commands to your repo)*

### `dev-start.yaml`

```
name: dev:start
description: Start web and api in watch mode
command: pnpm dev
```

### `dev-web.yaml`

```
name: dev:web
description: Start Next.js app
command: pnpm --filter web dev
```

### `dev-api.yaml`

```
name: dev:api
description: Start NestJS API
command: pnpm --filter api dev
```

### `dev-agents.yaml`

```
name: dev:agents
description: Start Python agents service
command: uvicorn app:app --reload --port 5001
cwd: services/agents
```

### `test-unit.yaml`

```
name: test:unit
description: Run unit tests
command: pnpm test
```

### `lint-fix.yaml`

```
name: lint:fix
description: ESLint with autofix
command: pnpm lint --fix
```

### `typecheck.yaml`

```
name: typecheck
description: TypeScript project checks
command: pnpm typecheck
```

### `release-dry-run.yaml`

```
name: release:dry-run
description: Build and smoke test
command: pnpm build && echo "smoke tests here"
```

### `release-prod.yaml`

```
name: release:prod
description: Deploy web and API
command: echo "CI deploy script goes here"
```

### `rollback.yaml`

```
name: release:rollback
description: Roll back to a previous version
command: ./scripts/rollback.sh --version ${version}
arguments:
  - name: version
    description: Git tag or semver
```

---

## 3) Rules (copy to `/Rules/Global/…` and `/Rules/Project/galaxyco-ai/WARP.md`)

### `/Rules/Global/coding-standards.md`

- TypeScript strict mode; no `any` in public APIs.
- React: server components by default; suspense for data.
- Python: pydantic models for I/O; explicit timeouts on IO; retries with backoff.
- Logging: structured (json); include `request_id`, `user_id`, `workspace_id`.

### `/Rules/Global/security-tenets.md`

- No secrets in repo/Drive; use secrets manager.
- Approval required for destructive actions; audit every outcome.
- Least privilege RBAC; egress allowlists for agents.

### `/Rules/Global/ux-writing.md`

- Plain language; sentence case; avoid jargon.
- Show citations and KPIs; never overpromise.

### `/Rules/Project/galaxyco-ai/WARP.md`

- PR checklist: tests updated, telemetry added, docs touched, migration reviewed.
- API stability: breaking changes require migration notes.

---

## 4) Prompts (copy to `/Prompts/…`)

### `commit-message.yaml`

```
name: commit:message
description: Create a concise Conventional Commit message from staged diffs
prompt: |
  You are a senior engineer. Read the staged diff and produce a Conventional Commit:
  - type(scope): summary
  - one imperative line; no trailing period
  - include BREAKING CHANGE: section if needed
```

### `pr-description.yaml`

```
name: pr:description
description: Draft a PR description with risks and test plan
prompt: |
  Produce a PR description with:
  - Summary
  - Context/Problem
  - Solution
  - Screenshots/Traces
  - Risks & Rollback
  - Test Plan
```

### `changelog-from-diffs.yaml`

```
name: changelog:from-diffs
description: Append a changelog entry from git diffs
prompt: |
  Convert the diff summary into a user-facing changelog entry.
  Include: feature flags, migrations, and monitoring notes.
```

### `bugfix-playbook.yaml`

```
name: bugfix:playbook
description: Generate a step-by-step fix plan from an error log
prompt: |
  Given an error log or trace, propose a minimal fix plan with
  steps to reproduce, suspect modules, and validation commands.
```

---

## 5) Usage Notes

- Use `` to attach this Notebook/Workflows/Rules to Agent chats.
- Keep all YAML/MD under `/warp/` or the folders listed above and mirror them into the repo for versioning.
- Run **Session Sharing** during incidents; capture notes in this Notebook.

