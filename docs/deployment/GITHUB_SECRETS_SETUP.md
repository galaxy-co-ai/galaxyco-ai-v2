# GitHub Secrets Setup Guide

**Last Updated:** 2025-10-17  
**Status:** Ready for configuration

---

## Overview

This document contains all required GitHub Secrets and Environment Variables for CI/CD workflows.

**Repository:** `galaxyco-ai-2.0`  
**Workflows:** CI/CD Pipeline, Security Scanning, Deploy

---

## 🔐 Repository Secrets (Settings → Secrets → Actions)

These secrets are available to **all workflows** and **all environments**.

```bash
# Core Infrastructure
DATABASE_URL=<YOUR_NEON_DATABASE_URL>
TEST_DATABASE_URL=<YOUR_TEST_DATABASE_URL>

# Authentication
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>

# Encryption
ENCRYPTION_KEY=<YOUR_32_BYTE_HEX_ENCRYPTION_KEY>

# AI Services
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
ANTHROPIC_API_KEY=<YOUR_ANTHROPIC_API_KEY>
GOOGLE_GENERATIVE_AI_API_KEY=<YOUR_GOOGLE_GENERATIVE_AI_API_KEY>

# Vector Database
PINECONE_API_KEY=<YOUR_PINECONE_API_KEY>
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=docs

# File Storage
BLOB_READ_WRITE_TOKEN=<YOUR_VERCEL_BLOB_TOKEN>

# Background Jobs
TRIGGER_SECRET_KEY=<YOUR_TRIGGER_SECRET_KEY>

# Integrations
GOOGLE_CUSTOM_SEARCH_API_KEY=<YOUR_GOOGLE_CUSTOM_SEARCH_API_KEY>
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=<YOUR_GOOGLE_CUSTOM_SEARCH_ENGINE_ID>

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=<YOUR_SENTRY_DSN>

# Vercel Deployment
VERCEL_TOKEN=<GET_FROM_VERCEL_DASHBOARD>
VERCEL_ORG_ID=<GET_FROM_VERCEL_DASHBOARD>
VERCEL_PROJECT_ID=<GET_FROM_VERCEL_DASHBOARD>

# Build Cache (Optional)
TURBO_TOKEN=<GET_FROM_VERCEL_TURBOREPO>

# Notifications (Optional)
DISCORD_WEBHOOK_URL=<YOUR_DISCORD_WEBHOOK_URL>

# Staging URL for smoke tests
STAGING_URL=https://staging.galaxyco.ai
```

**⚠️ IMPORTANT:** Actual secret values are stored locally in `docs/deployment/SECRETS_ACTUAL_VALUES.txt` (gitignored). Copy values from there to GitHub Secrets manually.

---

## 🌍 Environment-Specific Secrets

### Production Environment (`production`)

**Settings → Environments → production → Add Secret**

- **Reviewer Required:** Yes (recommended)
- **Wait Timer:** 5 minutes (optional)
- **Deployment Branches:** `main` only

**Variables:**

```bash
NEXT_PUBLIC_ENV=production
DATABASE_URL=<PRODUCTION_DATABASE_URL>  # Use production Neon DB
CLERK_SECRET_KEY=<PRODUCTION_CLERK_KEY>  # Use production Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<PRODUCTION_CLERK_PUBLISHABLE>
VERCEL_ENV=production
```

### Staging Environment (`staging`)

**Settings → Environments → staging → Add Secret**

**Variables:**

```bash
NEXT_PUBLIC_ENV=staging
DATABASE_URL=<STAGING_DATABASE_URL>  # Can use same as dev for now
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
VERCEL_ENV=staging
```

---

## 📋 Setup Checklist

### Step 1: Add Repository Secrets

1. Go to GitHub repository: `https://github.com/[YOUR_ORG]/galaxyco-ai-2.0`
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Copy values from `docs/deployment/SECRETS_ACTUAL_VALUES.txt`
5. Add each secret from the list above
6. ✅ Verify all secrets are added

### Step 2: Configure Environments

1. Go to **Settings → Environments**
2. Click **New environment** → Name: `production`
3. Enable **Required reviewers** (add yourself)
4. Set **Deployment branches** to `main` only
5. Add production-specific secrets
6. Repeat for `staging` environment

### Step 3: Get Vercel Credentials

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
cd apps/web
vercel link

# Get token from: https://vercel.com/account/tokens
# Get ORG_ID and PROJECT_ID from: vercel project ls
```

### Step 4: Test Workflows

```bash
# Create test branch
git checkout -b test/ci-cd-setup

# Make small change to trigger CI
echo "# CI/CD Test" >> README.md
git add README.md
git commit -m "test(infra): trigger ci/cd workflows"
git push -u origin test/ci-cd-setup

# Open PR on GitHub to trigger CI
```

---

## 🔄 Secret Rotation Schedule

**Recommended rotation schedule:**

| Secret Type        | Rotation Frequency | Priority |
| ------------------ | ------------------ | -------- |
| Database passwords | Every 90 days      | High     |
| AI API keys        | Every 180 days     | Medium   |
| Encryption keys    | Never (backup)     | Critical |
| Webhook tokens     | Every 180 days     | Low      |
| Vercel tokens      | Yearly             | Medium   |

**⚠️ Note:** We have 0 users currently, so rotation is not urgent. Plan rotation after first production users.

---

## 🚨 Security Notes

1. **Never commit secrets to git** - All secrets are in `.env.local` and `SECRETS_ACTUAL_VALUES.txt` (both gitignored)
2. **Use test keys in staging** - Already configured with test Clerk keys
3. **Rotate after leak** - If any secret is exposed, rotate immediately
4. **Limit access** - Only admins should have access to repository secrets
5. **Monitor usage** - Review GitHub Actions logs for unauthorized access

---

## 📚 References

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Next Steps:** Add secrets to GitHub → Test CI workflows → Deploy to staging
