# GalaxyCo.ai 2.0 - Secrets & Environment Variables Checklist

**Purpose**: This document tracks all secrets and configuration needed for the project.

---

## 🔐 SECRETS NEEDED

### 1. AWS Setup

- [ ] **AWS Account ID**: `____________` (12 digits)
- [ ] **AWS Region**: `us-east-1` (or your choice)
- [ ] **AWS Access Key ID**: `AKIA____________` (for Terraform user)
- [ ] **AWS Secret Access Key**: `________________________`
- [ ] **AWS Role ARN** (for GitHub Actions OIDC): `arn:aws:iam::____________:role/GitHubActionsRole`

**Where to use**:

- Terraform local execution
- GitHub Actions (secrets)
- AWS Secrets Manager

---

### 2. Database (Neon or RDS)

**Option A: Neon (Recommended for MVP)** ✅

- [ ] **Neon Account**: Created at https://neon.tech
- [ ] **Neon Project Name**: `galaxyco-ai`
- [ ] **Database Name**: `galaxyco`
- [ ] **Connection String**:

  ```
  postgres://[user]:[password]@[host]/[database]?sslmode=require
  ```

  - Full string: `________________________________`

**Option B: AWS RDS** (Provisioned via Terraform)

- [ ] Will be created in Phase 3
- [ ] Connection string will be in AWS Secrets Manager

**Where to use**:

- `apps/api/.env` → `DATABASE_URL`
- `services/agents/.env` → `DATABASE_URL`
- Vercel environment variables
- AWS Secrets Manager (production)

---

### 3. Redis (Upstash or ElastiCache)

**Option A: Upstash (Recommended for MVP)** ✅

- [ ] **Upstash Account**: Created at https://upstash.com
- [ ] **Database Name**: `galaxyco-redis`
- [ ] **Connection String**:

  ```
  redis://default:[password]@[host]:[port]
  ```

  - Full string: `________________________________`

**Option B: AWS ElastiCache** (Provisioned via Terraform)

- [ ] Will be created in Phase 3
- [ ] Endpoint will be in AWS Secrets Manager

**Where to use**:

- `apps/api/.env` → `REDIS_URL`
- Vercel environment variables
- AWS Secrets Manager (production)

---

### 4. Vercel

- [ ] **Vercel Account**: Created at https://vercel.com
- [ ] **Vercel Org ID**: `team_____________` or `user_____________`
- [ ] **Vercel Project ID**: `prj_____________`
- [ ] **Vercel Token** (for CI/CD): `________________` (Keep secure!)
- [ ] **Vercel Project Name**: `galaxyco-ai-platform`

**Where to use**:

- GitHub Actions secrets → `VERCEL_TOKEN`
- GitHub Actions variables → `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

### 5. Clerk (Authentication)

- [ ] **Clerk Account**: Created at https://clerk.com
- [ ] **Application Name**: `GalaxyCo.ai`
- [ ] **Clerk Publishable Key**: `pk_test_____________` or `pk_live_____________`
  - Value: `________________________________`
- [ ] **Clerk Secret Key**: `sk_test_____________` or `sk_live_____________`
  - Value: `________________________________`
- [ ] **Clerk Webhook Secret**: `whsec_____________`
  - Value: `________________________________`

**Where to use**:

- `apps/web/.env` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `apps/api/.env` → `CLERK_SECRET_KEY`
- Vercel environment variables

**Configure**:

- [ ] Add redirect URLs:
  - `http://localhost:3000`
  - `https://[your-vercel-domain].vercel.app`
  - `https://app.galaxyco.ai` (production)

---

### 6. Stripe (Payments & Billing)

- [ ] **Stripe Account**: Created at https://stripe.com (test mode first)
- [ ] **Stripe Publishable Key** (test): `pk_test_____________`
  - Value: `________________________________`
- [ ] **Stripe Secret Key** (test): `sk_test_____________`
  - Value: `________________________________`
- [ ] **Stripe Webhook Secret**: `whsec_____________`
  - Value: `________________________________`

**Products & Prices to Create**:

- [ ] **Free Plan** → Price ID: `price_____________`
- [ ] **Pro Plan** ($29/month) → Price ID: `price_____________`
- [ ] **Team Plan** ($99/month) → Price ID: `price_____________`
- [ ] **Business Plan** (custom) → Price ID: `price_____________`
- [ ] **Credit Pack - 20 credits** ($10) → Price ID: `price_____________`
- [ ] **Credit Pack - 100 credits** ($40) → Price ID: `price_____________`

**Where to use**:

- `apps/api/.env` → `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `apps/web/.env` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Server config file → Price IDs

---

### 7. OpenAI (LLM Provider - Primary)

- [ ] **OpenAI Account**: Created at https://platform.openai.com
- [ ] **API Key**: `sk-proj-____________` or `sk-____________`
  - Value: `________________________________`
- [ ] **Organization ID** (optional): `org-____________`
  - Value: `________________________________`

**Set Spending Limits**:

- [ ] Monthly limit: $\_\_\_\_ (recommended: $100-200 for MVP)

**Where to use**:

- `services/agents/.env` → `OPENAI_API_KEY`
- AWS Secrets Manager (production)

---

### 8. Anthropic (LLM Provider - Optional)

- [ ] **Anthropic Account**: Created at https://console.anthropic.com
- [ ] **API Key**: `sk-ant-____________`
  - Value: `________________________________`

**Where to use**:

- `services/agents/.env` → `ANTHROPIC_API_KEY`
- AWS Secrets Manager (production)

---

### 9. Sentry (Error Tracking - Optional but Recommended)

- [ ] **Sentry Account**: Created at https://sentry.io (free tier)
- [ ] **Organization Slug**: `________________`
- [ ] **Project Slug**: `galaxyco-api` and `galaxyco-web`
- [ ] **DSN (API)**: `https://____________@sentry.io/____________`
  - Value: `________________________________`
- [ ] **DSN (Web)**: `https://____________@sentry.io/____________`
  - Value: `________________________________`
- [ ] **Auth Token** (for CI/CD): `________________`
  - Value: `________________________________`

**Where to use**:

- `apps/api/.env` → `SENTRY_DSN`
- `apps/web/.env` → `NEXT_PUBLIC_SENTRY_DSN`
- GitHub Actions secrets → `SENTRY_AUTH_TOKEN`

---

### 10. PostHog (Analytics - Optional)

- [ ] **PostHog Account**: Created at https://posthog.com (free tier)
- [ ] **Project API Key**: `phc_____________`
  - Value: `________________________________`
- [ ] **Project ID**: `________________`
- [ ] **Host**: `https://app.posthog.com` or `https://eu.posthog.com`

**Where to use**:

- `apps/web/.env` → `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

---

### 11. Datadog (Observability - Optional for V1)

- [ ] **Datadog Account**: Created at https://www.datadoghq.com
- [ ] **API Key**: `________________`
  - Value: `________________________________`
- [ ] **App Key**: `________________`
  - Value: `________________________________`
- [ ] **Site**: `datadoghq.com` or `datadoghq.eu`

**Where to use**:

- `apps/api/.env` → `DATADOG_API_KEY`
- GitHub Actions secrets → `DATADOG_API_KEY`

---

### 12. S3 Bucket (Artifacts)

- [ ] **Bucket Name**: `galaxyco-artifacts` (must be globally unique)
  - Try: `galaxyco-artifacts-[random-suffix]`
  - Final name: `________________________________`
- [ ] **Region**: Same as AWS Region above

**Where to use**:

- `apps/api/.env` → `S3_BUCKET_NAME`, `S3_REGION`
- Will be created via Terraform in Phase 3

---

### 13. GitHub

- [ ] **GitHub Repository**: Created at https://github.com
  - Full URL: `https://github.com/[username]/galaxyco-ai-2.0`
- [ ] **Personal Access Token** (for packages, optional): `ghp_____________`
  - Value: `________________________________`

**Where to use**:

- Git remote origin
- GitHub Actions (automatic)

---

### 14. ECR Repository Names

Will be created via Terraform, but document here:

- [ ] **API Image Repository**: `[aws-account-id].dkr.ecr.[region].amazonaws.com/galaxyco-api`
- [ ] **Agents Image Repository**: `[aws-account-id].dkr.ecr.[region].amazonaws.com/galaxyco-agents`

---

### 15. ECS Service Names

Will be created via Terraform, but document here:

- [ ] **Cluster Name**: `galaxyco-cluster`
- [ ] **API Service (Staging)**: `api-staging`
- [ ] **API Service (Production)**: `api-prod`
- [ ] **Agents Service (Staging)**: `agents-staging`
- [ ] **Agents Service (Production)**: `agents-prod`

---

## 📋 PRIORITY ORDER (What to Set Up First)

### Immediate (Phase 1 - Required for Local Development)

1. ✅ **Neon Database** - Can start immediately, free tier available
2. ✅ **Upstash Redis** - Can start immediately, free tier available
3. ✅ **OpenAI API Key** - Required for agent execution
4. ✅ **Clerk** - Required for authentication

### Soon (Phase 1-2 - Before First Deploy)

5. **Vercel Account** - For web deployment
6. **AWS Account** - For infrastructure
7. **GitHub Repository** - For code hosting and CI/CD
8. **Stripe (Test Mode)** - For billing flows

### Later (Phase 3+ - As Needed)

9. **Sentry** - When ready to track errors
10. **PostHog** - When ready for analytics
11. **Anthropic** - If using Claude models
12. **Datadog** - When scaling observability

---

## 🔒 SECRETS MANAGEMENT STRATEGY

### Local Development

- Use `.env.local` files (never commit!)
- Keep a secure backup (password manager, encrypted file)

### Staging/Production

- **Vercel**: Use Vercel dashboard → Settings → Environment Variables
- **AWS**: Use AWS Secrets Manager for API/Agents services
- **GitHub Actions**: Use repository secrets

### Security Best Practices

- ✅ Never commit secrets to git
- ✅ Rotate keys every 90 days
- ✅ Use test keys for development
- ✅ Set spending limits on paid services
- ✅ Enable 2FA on all accounts

---

## 📝 NEXT STEPS

1. **Create accounts** in priority order above
2. **Document values** in this file (local copy only, DO NOT COMMIT)
3. **Create `.env.example`** files for each service (commit these)
4. **Add real values** to `.env.local` files (DO NOT COMMIT)
5. **Add to GitHub Actions** when ready for CI/CD
6. **Add to Vercel** when ready for deployment
7. **Add to AWS Secrets Manager** for production

---

## ✅ TRACKING

Mark items complete as you create accounts and obtain credentials:

**Phase 1 Checklist**:

- [ ] Neon database created + connection string obtained
- [ ] Upstash Redis created + connection string obtained
- [ ] Clerk app created + keys obtained
- [ ] OpenAI account created + API key obtained + spending limit set
- [ ] Vercel account created + project created + token generated
- [ ] GitHub repo created
- [ ] Stripe account created (test mode) + products/prices created
- [ ] AWS account ready + IAM user created

**Ready for Development**:

- [ ] All `.env.example` files created
- [ ] All `.env.local` files populated with real values
- [ ] Can run `pnpm dev` locally
- [ ] Services can connect to Neon and Upstash

**Ready for Deployment**:

- [ ] GitHub Actions secrets configured
- [ ] Vercel environment variables configured
- [ ] AWS Secrets Manager configured
- [ ] Terraform state backend ready
