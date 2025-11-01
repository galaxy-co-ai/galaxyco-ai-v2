# GalaxyCo Monorepo Guide

## Architecture

- apps/web: Next.js frontend
- apps/api: NestJS backend
- packages/\*: shared UI, types, database, agents, etc.

## Common Commands

```bash
pnpm install
pnpm turbo run dev --parallel
pnpm turbo run lint
pnpm turbo run typecheck
pnpm turbo run test
pnpm turbo run build
```

## Naming Conventions

- Files: kebab-case (e.g., user-profile.tsx)
- Components: PascalCase (e.g., UserProfile)
- Utils: camelCase (e.g., formatUserName)
- Constants: UPPER_SNAKE_CASE (e.g., MAX_RETRY_COUNT)
- Types/Interfaces: PascalCase (e.g., UserData)

## Commit Guidelines

Follow Conventional Commits:

- feat(web): add user profile page
- fix(api): resolve authentication bug
- docs: update setup instructions
- chore(deps): upgrade dependencies

## Input Validation

- Use Zod for all API inputs
- Centralize types in packages/types
