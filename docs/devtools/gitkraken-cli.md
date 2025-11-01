# GitKraken CLI (gk) — Project Setup & Usage

Last updated: 2025-11-01

This repo is configured to use GitKraken CLI for AI-augmented git workflows, multi-repo work items, and an MCP server for AI assistants.

## Installation

Already installed on contributor machines via manual binary install.

Verify:

```
gk version
```

## Authentication

Use GitKraken token via secure login (do not paste tokens in plaintext):

```
gk auth login
```

If needed, set a session-only env var and run (replace {{GITKRAKEN_TOKEN}} at runtime):

```
GITKRAKEN_TOKEN={{GITKRAKEN_TOKEN}} gk auth login
```

## Work Items (recommended flow)

```
# Start a work item (creates and checks out a branch)
gk work start "<short-feature-title>"

# Add current repo (monorepo root)
gk work add .

# Commit with AI
git add -A
gk ai commit --add-description --force

# Push & create PR (AI description)
gk work push
gk work pr create

# End work item when merged
gk work end
```

## AI Commands

- `gk ai commit` — Generate Conventional Commit messages with optional description
- `gk ai pr create` — Generate PR title/description
- `gk ai changelog <range>` — Summarize changes between refs
- `gk ai resolve` — Assist with merge conflict resolution

## MCP Server

We installed the GitKraken MCP server for Cursor. This exposes safe git/GitHub/Jira tools to AI assistants.

```
# Install for Cursor
gk mcp install cursor

# Start on-demand (read-only mode available)
gk mcp
# or
gk mcp --readonly
```

## Project Conventions

- Conventional Commits enforced by commitlint. Allowed scopes: `api, web, db, infra, scope-agent, call-agent, email-agent, note-agent, task-agent, roadmap-agent, content-agent`.
- Prefer `gk ai commit --add-description` to capture context.
- Non-production branches may auto-push after checks.

## Troubleshooting

- If commit fails on commitlint, amend:

```
git commit --amend -m "type(scope): message"
```

- If `gk` not found, ensure it is on PATH and run `gk version`.
