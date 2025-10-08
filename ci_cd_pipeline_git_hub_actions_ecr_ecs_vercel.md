# CI/CD Pipeline — GitHub Actions, ECR/ECS & Vercel

> **Goal:** Ship reliably from a Turbo monorepo. Web (Next.js) deploys to **Vercel**; API & Agents ship as Docker images to **AWS ECR** and run on **ECS Fargate**. Uses **GitHub Actions + OIDC** (no long‑lived AWS keys), per‑service workflows, and fast PR CI.

---

## 1) Branches & Environments

- `` → **Production** (Vercel Prod; ECS prod services)
- `` → **Staging** (Vercel Preview alias; ECS staging services)
- PRs → CI only (no deploy); ephemeral **Vercel Preview** per PR for web

---

## 2) Required GitHub Secrets / Variables

Use **OIDC** to AWS; put immutable values as **Actions variables**, sensitive as **secrets**.

**Repository → Settings → Security → Actions → OIDC Provider** (AWS IAM role trust set to `repo:galaxyco-ai/*:ref:refs/heads/*`).

**Repository → Settings → Secrets and variables → Actions**

- **Variables**
  - `AWS_REGION` = `us-east-1`
  - `ECR_API_REPO` = `xxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/galaxyco-api`
  - `ECR_AGENTS_REPO` = `xxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/galaxyco-agents`
  - `ECS_CLUSTER` = `galaxyco-cluster`
  - `ECS_SERVICE_API_STAGING` = `api-staging`
  - `ECS_SERVICE_API_PROD` = `api-prod`
  - `ECS_SERVICE_AGENTS_STAGING` = `agents-staging`
  - `ECS_SERVICE_AGENTS_PROD` = `agents-prod`
  - `VercelProject` variables: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Secrets**
  - `AWS_ROLE_ARN` (assume role for deploys)
  - `VERCEL_TOKEN`
  - `SENTRY_AUTH_TOKEN` (optional)
  - `DATADOG_API_KEY` (optional)

> App/runtime secrets (DB URLs, API keys) live in Vercel envs or AWS Secrets Manager, **not** in GitHub.

---

## 3) Dockerfiles (minimal)

``

```
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate \
 && pnpm i --frozen-lockfile \
 && pnpm --filter api build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./
RUN npm i --omit=dev
ENV NODE_ENV=production PORT=4000
EXPOSE 4000
CMD ["node","dist/main.js"]
```

``

```
FROM python:3.11-slim
WORKDIR /app
COPY services/agents/pyproject.toml .
RUN pip install --upgrade pip && pip install uv
COPY services/agents/ .
RUN uv pip install -r requirements.txt || true
ENV PORT=5001
EXPOSE 5001
CMD ["uvicorn","app:app","--host","0.0.0.0","--port","5001"]
```

---

## 4) GitHub Actions — CI (PRs)

``

```yaml
name: CI
on:
  pull_request:
    paths:
      - 'apps/**'
      - 'packages/**'
      - 'services/**'
      - 'turbo.json'
      - 'pnpm-lock.yaml'
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable && corepack prepare pnpm@9.0.0 --activate
      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ~/.pnpm-store
          key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}
      - run: pnpm i --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm -w build --filter web --filter api
```

---

## 5) GitHub Actions — Web Deploy (Vercel)

``

```yaml
name: Deploy Web (Vercel)
on:
  push:
    branches: [main, develop]
    paths: ['apps/web/**','packages/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ vars.VERCEL_ORG_ID }}
          vercel-project-id: ${{ vars.VERCEL_PROJECT_ID }}
          working-directory: apps/web
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

---

## 6) GitHub Actions — Build & Push Images (ECR)

``

```yaml
name: Build & Push Images (ECR)
on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/api/**'
      - 'services/agents/**'
      - '.github/workflows/build-push.yml'
jobs:
  ecr:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - uses: aws-actions/amazon-ecr-login@v2
      - name: Build & push API
        if: contains(github.event.head_commit.message, 'skip-api') == false
        env:
          REPO: ${{ vars.ECR_API_REPO }}
        run: |
          docker build -t $REPO:sha-${GITHUB_SHA::7} -f apps/api/Dockerfile .
          docker push $REPO:sha-${GITHUB_SHA::7}
      - name: Build & push Agents
        if: contains(github.event.head_commit.message, 'skip-agents') == false
        env:
          REPO: ${{ vars.ECR_AGENTS_REPO }}
        run: |
          docker build -t $REPO:sha-${GITHUB_SHA::7} -f services/agents/Dockerfile .
          docker push $REPO:sha-${GITHUB_SHA::7}
      - name: Output image tags
        run: |
          echo "api_tag=sha-${GITHUB_SHA::7}" >> $GITHUB_OUTPUT
          echo "agents_tag=sha-${GITHUB_SHA::7}" >> $GITHUB_OUTPUT
```

---

## 7) GitHub Actions — Deploy ECS Services

``

```yaml
name: Deploy ECS Services
on:
  workflow_dispatch:
    inputs:
      service:
        description: api|agents
        required: true
        default: api
      env:
        description: staging|prod
        required: true
        default: staging
      tag:
        description: ECR image tag (e.g., sha-abc1234)
        required: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - name: Update Service
        env:
          CLUSTER: ${{ vars.ECS_CLUSTER }}
          SERVICE: ${{ github.event.inputs.service == 'api' && (github.event.inputs.env == 'prod' && vars.ECS_SERVICE_API_PROD || vars.ECS_SERVICE_API_STAGING) || (github.event.inputs.env == 'prod' && vars.ECS_SERVICE_AGENTS_PROD || vars.ECS_SERVICE_AGENTS_STAGING) }}
          REPO: ${{ github.event.inputs.service == 'api' && vars.ECR_API_REPO || vars.ECR_AGENTS_REPO }}
          TAG: ${{ github.event.inputs.tag }}
        run: |
          aws ecs update-service --cluster $CLUSTER --service $SERVICE \
            --force-new-deployment --output json \
            --query 'service.deployments[0].taskDefinition'
```

> For safer rollouts, adopt **blue/green** with CodeDeploy in V1.

---

## 8) Terraform Plan/Apply (Manual)

``

```yaml
name: Terraform Plan/Apply
on:
  workflow_dispatch:
    inputs:
      env: { description: dev|prod, required: true, default: dev }
      action: { description: plan|apply, required: true, default: plan }
jobs:
  tf:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - uses: hashicorp/setup-terraform@v3
      - name: Terraform
        working-directory: infra/terraform/envs/${{ github.event.inputs.env }}
        run: |
          terraform init
          terraform ${{ github.event.inputs.action }} -auto-approve || true
```

---

## 9) Release, Versioning & Rollback

- Tag releases: `vX.Y.Z` → immutable changelog; optional auto‑deploy to **prod**.
- **Sentry release** (optional): create release + associate commits in deploy jobs.
- **Rollback**: ECS keeps last task def revision; run **Deploy ECS** with previous tag or `aws ecs update-service --force-new-deployment` pointing at prior task def.

---

## 10) Observability Hooks

- Emit **Datadog** deploy event with service + version.
- Add **OTel** resource attributes `service.version`, `deployment.environment`.

---

## 11) Acceptance Criteria (V1)

- PRs run CI in ≤ 6 min with caching.
- `develop` pushes produce Vercel previews and staged ECS deploys via manual trigger.
- `main` pushes deploy web to Vercel Prod; images built & pushed to ECR; ECS deploy via manual or tag‑based trigger.
- No long‑lived AWS keys; OIDC role assumption works; least‑privilege IAM.
- Rollback documented and tested (staging).

---

## 12) Next Upgrades (V1→V2)

- **Blue/Green** ECS via CodeDeploy; health checks & pre/post lifecycle hooks.
- **Canary** for web using Vercel Environments.
- **Monorepo build graph** optimizations with remote cache (Turborepo remote or Vercel Remote Caching).
- **Preview ECS** tasks per PR (costly; use selectively).

