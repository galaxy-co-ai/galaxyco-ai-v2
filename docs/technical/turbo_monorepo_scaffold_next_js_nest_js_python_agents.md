# Turbo Monorepo Scaffold — Next.js / NestJS / Python Agents (Patched)

A **copy‑ready scaffold** you can paste into the repo. This patch adds **release scripts**, **tsconfig refs**, **ESLint config**, and a **rollback script** to line up with CI/CD and Warp Workflows.

---

## 1) Prereqs

- Node 20+, **pnpm** 9+, **turbo** 2+
- Docker, Python 3.11+
- AWS account (later: ECR/ECS), Stripe test keys, Clerk test keys

---

## 2) Repo Layout

```
.
├─ apps/
│  ├─ web/                # Next.js 14 (App Router)
│  └─ api/                # NestJS API (REST + WS)
├─ services/
│  └─ agents/             # Python agents (LangGraph)
├─ packages/
│  ├─ ui/                 # shared React components
│  ├─ config/             # tsconfig, eslint presets
│  └─ types/              # shared types
├─ infra/                 # terraform (see Terraform Starters)
├─ scripts/
│  └─ rollback.sh         # rollback helper (see below)
├─ turbo.json
├─ package.json
├─ tsconfig.base.json
└─ pnpm-workspace.yaml
```

---

## 3) Workspace Files

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

### Root `package.json`

```json
{
  "name": "galaxyco-monorepo",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "release:dry-run": "pnpm build",
    "release:prod": "echo 'Deploy handled by CI'",
    "release:rollback": "bash scripts/rollback.sh"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "eslint": "^9.0.0",
    "typescript": "^5.5.0"
  }
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": { "cache": false, "persistent": true },
    "build": { "outputs": ["dist/**", ".next/**"] },
    "lint": {},
    "typecheck": {},
    "test": {}
  }
}
```

### `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {}
  }
}
```

### Root ESLint preset `packages/config/eslint-base.cjs`

```js
module.exports = {
  root: true,
  env: { node: true, es2022: true, browser: true },
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
```

---

## 4) apps/web (Next.js)

### `apps/web/package.json`

```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "socket.io-client": "^4.7.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "eslint": "^9.0.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22"
  }
}
```

### `apps/web/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["node"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Minimal page `apps/web/app/page.tsx`

```tsx
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">GalaxyCo.ai</h1>
      <p className="mt-2">Make multi-agent AI useful in minutes.</p>
    </main>
  );
}
```

---

## 5) apps/api (NestJS)

### `apps/api/package.json`

```json
{
  "name": "api",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc -p tsconfig.build.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "typescript": "^5.5.0",
    "ts-node": "^10.9.2",
    "eslint": "^9.0.0"
  }
}
```

### `apps/api/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist" },
  "include": ["src"]
}
```

### `apps/api/tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```

### Nest minimal app

`apps/api/src/main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
```

`apps/api/src/app.module.ts`

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

@Module({ controllers: [AppController] })
export class AppModule {}
```

`apps/api/src/app.controller.ts`

```ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/health")
  health() {
    return { ok: true };
  }
}
```

---

## 6) services/agents (Python)

### `services/agents/pyproject.toml`

```toml
[project]
name = "agents"
version = "0.1.0"
dependencies = [
  "fastapi>=0.112",
  "uvicorn>=0.30",
  "pydantic>=2.7",
  "httpx>=0.27",
  "langgraph>=0.1.0",
  "langchain>=0.2.0"
]
```

### `services/agents/app.py`

```py
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}

# TODO: LangGraph runner and sample specialist
```

**Local run**

```bash
uvicorn app:app --reload --port 5001
```

---

## 7) Shared packages

### `packages/types/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `packages/ui/src/Button.tsx`

```tsx
import * as React from "react";
export const Button = (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="px-3 py-2 rounded-md shadow-sm" {...p} />
);
```

---

## 8) Env examples

### `apps/web/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### `apps/api/.env`

```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/galaxyco
```

---

## 9) Rollback helper

### `scripts/rollback.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
if [ -z "${1:-}" ]; then
  echo "usage: rollback.sh <tag>" && exit 1
fi
TAG="$1"
echo "Rolling back services to $TAG (manual ECS update handled in CI)"
```

`chmod +x scripts/rollback.sh`

---

## 10) Next Steps

- Wire **socket.io** to stream traces to web
- Add **PAA right rail** in web; `/health` proxy
- Add first **Specialist** in Python and a **plan→dispatch→execute** demo endpoint
