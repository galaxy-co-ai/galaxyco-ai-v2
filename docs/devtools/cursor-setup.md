# Cursor 2.0 Setup & Integration

Last updated: 2025-11-01

This guide configures Cursor 2.0 for optimal productivity with the GalaxyCo.ai 2.0 monorepo.

## GitKraken MCP Server Integration

**Status:** ✅ Installed

The GitKraken MCP server is installed and configured for Cursor. It provides AI-powered git operations, GitHub API access, and issue tracking.

### MCP Configuration

Cursor MCP config location:

```
%APPDATA%\Cursor\User\mcp.json
```

Installed via:

```bash
gk mcp install cursor
```

Configuration:

```json
{
  "args": ["mcp", "--host=cursor"],
  "command": "C:\\Users\\Owner\\AppData\\Local\\GitKrakenCLI\\gk.exe",
  "type": "stdio"
}
```

### Available MCP Tools

When MCP server is running, Cursor has access to:

- **Git operations**: commit, push, pull, branch, merge, status
- **GitHub API**: PRs, issues, comments, reviews
- **GitKraken AI**: Commit generation, PR descriptions, conflict resolution
- **Jira integration**: Issue tracking and updates (if configured)

## Cursor Workspace Settings

Recommended `.vscode/settings.json` for this monorepo:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },
  "eslint.workingDirectories": [{ "pattern": "apps/*" }, { "pattern": "packages/*" }],
  "files.exclude": {
    "**/.turbo": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/.turbo": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/pnpm-lock.yaml": true
  }
}
```

## Cursor AI Rules

Add to `.cursorrules` in project root for Cursor AI context:

```markdown
# GalaxyCo.ai 2.0 Monorepo

## Architecture

- Next.js 14 (App Router) frontend in `apps/web`
- NestJS backend API in `apps/api`
- Python FastAPI agents in `services/agents-backend`
- Shared packages in `packages/`
- pnpm workspace with Turborepo

## Coding Standards

- TypeScript strict mode, no `any` types
- React 18 functional components only
- Tailwind utilities only (no inline styles)
- Zod validation for all user inputs
- Conventional Commits (enforced by commitlint)

## Commit Scopes

api, web, db, infra, scope-agent, call-agent, email-agent, note-agent, task-agent, roadmap-agent, content-agent

## GitKraken CLI

Use `gk ai commit` for AI-generated commits.
Use `gk work` commands for feature branches.

## Testing

Run `pnpm run test` before committing.
E2E tests in `tests/e2e` use Playwright.
```

## Cursor Composer Pro Tips

### 1. Multi-File Refactoring

Use Composer mode to:

- "Refactor the auth flow across all components in apps/web/components/auth/"
- "Update all agent types to match the new schema in packages/database/schema/agents.ts"

### 2. Monorepo Navigation

Ask Cursor to:

- "Show me where the user authentication logic is implemented"
- "Find all usages of the TaskAgent interface"

### 3. With GitKraken MCP

- "Check the status of the current PR"
- "Generate a commit message for my staged changes"
- "Create a new branch for the user profile feature"

## Performance Optimization

For faster Cursor indexing in this large monorepo:

1. Exclude build artifacts in settings (see above)
2. Enable workspace TypeScript for intellisense
3. Use Cursor's "Index Workspace" command after pulling updates

## Debugging

### TypeScript Errors in Cursor

If Cursor shows TS errors that don't appear in terminal:

```bash
pnpm run type-check
```

Then restart Cursor TS server: Cmd+Shift+P → "TypeScript: Restart TS Server"

### MCP Server Not Working

Check if GitKraken MCP is running:

```bash
gk mcp
```

Reinstall if needed:

```bash
gk mcp uninstall cursor
gk mcp install cursor
```

## Recommended Cursor Extensions

- **Prettier** (default formatter)
- **ESLint** (linting)
- **Tailwind CSS IntelliSense** (class autocomplete)
- **GitLens** (enhanced git blame and history)
- **Error Lens** (inline error display)

## Shortcuts

| Action           | Shortcut    |
| ---------------- | ----------- |
| Cursor Chat      | Cmd+K       |
| Composer Mode    | Cmd+Shift+K |
| Quick Fix        | Cmd+.       |
| Go to Definition | F12         |
| Find References  | Shift+F12   |
| Format Document  | Shift+Alt+F |
| Terminal         | Ctrl+`      |

## Next Steps

1. Install recommended extensions
2. Verify MCP server with `gk mcp` command
3. Create `.cursorrules` file in project root
4. Test AI commit generation: make a change, stage it, run `gk ai commit`
