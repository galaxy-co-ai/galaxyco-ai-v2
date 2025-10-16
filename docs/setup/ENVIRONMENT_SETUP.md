# 🔧 Environment Setup Guide - GalaxyCo.ai

**Last Updated:** October 9, 2025  
**For Project:** GalaxyCo.ai v2.0

This document provides complete instructions for setting up environment variables for local development, staging, and production environments.

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#-quick-start-5-minutes)
2. [Required Variables](#-required-variables)
3. [Optional Variables](#-optional-variables)
4. [Local Development Setup](#-local-development-setup)
5. [Vercel Production Setup](#-vercel-production-setup)
6. [Security Best Practices](#-security-best-practices)
7. [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start (5 minutes)

Get up and running with local development:

```bash
# 1. Copy the example file
cd apps/web
cp .env.example .env.local

# 2. Generate encryption key
cd ../..
pnpm run generate-encryption-key

# 3. Edit .env.local and fill in:
#    - DATABASE_URL (from Neon)
#    - CLERK_SECRET_KEY (from Clerk)
#    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk)
#    - ENCRYPTION_KEY (from step 2)

# 4. Start development server
pnpm dev
```

✅ **Done!** Your app should now be running at `http://localhost:3000`

---

## 🔑 Required Variables

These variables **MUST** be set for the application to function:

### `DATABASE_URL`

**What it is:** PostgreSQL connection string for your database  
**Where to get it:** [Neon Console](https://console.neon.tech) → Dashboard → Connection Details  
**Format:** `postgresql://user:password@hostname.neon.tech/database?sslmode=require`

**Example:**

```bash
DATABASE_URL=postgresql://neondb_owner:abc123@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**How to get:**

1. Log in to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Go to Dashboard
4. Copy the "Connection string" under "Connection Details"

---

### `CLERK_SECRET_KEY`

**What it is:** Server-side authentication key (KEEP SECRET!)  
**Where to get it:** [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Secret Key

**Example:**

```bash
CLERK_SECRET_KEY=sk_test_abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

**How to get:**

1. Log in to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your application
3. Go to "API Keys" in sidebar
4. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

**Important:** Use `sk_test_` keys for development/preview, `sk_live_` for production only

---

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

**What it is:** Client-side authentication key (safe to expose)  
**Where to get it:** [Clerk Dashboard](https://dashboard.clerk.com) → API Keys → Publishable Key

**Example:**

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWNjdXJhdGUtZ2hvc3QtNTEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

**How to get:**

1. Same dashboard as above
2. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)

---

### `ENCRYPTION_KEY`

**What it is:** 32-byte hex string for encrypting sensitive data (API keys) in database  
**How to generate:** Run `pnpm run generate-encryption-key`

**Example:**

```bash
ENCRYPTION_KEY=a1b2c3d4e5f67890abcdef1234567890a1b2c3d4e5f67890abcdef1234567890
```

**Security Notes:**

- ⚠️ **CRITICAL**: Keep this secret! Anyone with this key can decrypt your stored API keys
- Use **different keys** for development vs production
- If compromised, rotate immediately and re-encrypt all data
- Store in password manager or Vercel dashboard only

---

## 🎯 Optional Variables

These variables enable additional features but aren't required for basic functionality:

### `OPENAI_API_KEY` (Recommended)

**What it is:** API key for OpenAI GPT models  
**Where to get it:** [OpenAI Platform](https://platform.openai.com/api-keys)  
**Required for:** AI agent execution features

**Example:**

```bash
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234
```

---

### `REDIS_URL` (Recommended for Production)

**What it is:** Redis connection string for caching and rate limiting  
**Where to get it:** [Upstash Console](https://console.upstash.com) → Database → Redis Connect

**Example:**

```bash
REDIS_URL=redis://default:password123@hostname.upstash.io:6379
```

---

### `CLERK_WEBHOOK_SECRET` (For User Sync)

**What it is:** Secret for verifying Clerk webhook signatures  
**Where to get it:** [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks → Signing Secret

**Example:**

```bash
CLERK_WEBHOOK_SECRET=whsec_abcd1234efgh5678ijkl9012mnop3456
```

---

### `NEXT_PUBLIC_ENV` (Display Only)

**What it is:** Environment indicator shown on homepage  
**Options:** `development`, `staging`, `production`

**Example:**

```bash
NEXT_PUBLIC_ENV=development
```

---

## 💻 Local Development Setup

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd galaxyco-ai-2.0
pnpm install
```

### Step 2: Create Environment File

```bash
cd apps/web
cp .env.example .env.local
```

### Step 3: Generate Encryption Key

```bash
# From project root
pnpm run generate-encryption-key
```

This will output a secure 64-character hex string. Copy it for the next step.

### Step 4: Fill in Required Variables

Edit `apps/web/.env.local`:

```bash
# Required
DATABASE_URL=postgresql://user:password@hostname.neon.tech/database?sslmode=require
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
ENCRYPTION_KEY=YOUR_GENERATED_KEY_HERE

# Optional (recommended)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
REDIS_URL=redis://default:password@hostname.upstash.io:6379
```

### Step 5: Start Development Server

```bash
# From project root
pnpm dev
```

### Step 6: Verify Setup

1. Visit `http://localhost:3000`
2. You should see the homepage load without errors
3. Try signing up/signing in
4. Check the console for any environment variable errors

---

## 🚀 Vercel Production Setup

### Prerequisites

- Vercel project created and connected to GitHub
- Production database on Neon
- Production Clerk application (with `sk_live_` keys)

### Step 1: Navigate to Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (e.g., `galaxyco-ai-2.0`)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Variables

Add each variable below, selecting appropriate environments:

| Variable Name                       | Value Source                                 | Environments                                           |
| ----------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                      | Production Neon connection string            | Production, Preview, Development                       |
| `CLERK_SECRET_KEY`                  | Production Clerk secret (`sk_live_...`)      | Production<br>Test key (`sk_test_...`) for Preview/Dev |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Production Clerk publishable (`pk_live_...`) | Production<br>Test key (`pk_test_...`) for Preview/Dev |
| `ENCRYPTION_KEY`                    | **NEW key** (different from dev!)            | Production, Preview, Development                       |
| `OPENAI_API_KEY`                    | OpenAI API key                               | Production, Preview, Development                       |
| `REDIS_URL`                         | Production Redis URL                         | Production, Preview, Development                       |

### Step 3: Environment-Specific Configuration

#### Production Environment

- Use `sk_live_` and `pk_live_` Clerk keys
- Use **production database** (separate from dev)
- Generate a **unique encryption key** (different from dev!)

#### Preview Environment

- Use `sk_test_` and `pk_test_` Clerk keys (or separate preview keys)
- Can use same database as dev OR separate staging database
- Use **separate encryption key** from production

#### Development Environment

- Not typically used (for `vercel env pull` command)
- Mirror your local `.env.local` structure

### Step 4: Trigger Deployment

After adding variables:

1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. OR push a new commit to trigger auto-deployment

### Step 5: Verify Production

1. Visit your production URL (e.g., `https://galaxyco-ai-20.vercel.app`)
2. Test authentication
3. Test database connectivity
4. Check Vercel logs for any environment errors

---

## 🔒 Security Best Practices

### ✅ DO

- **Use different secrets** for production vs development
- **Generate unique encryption keys** for each environment
- **Store secrets** in password manager (1Password, LastPass, etc.)
- **Rotate keys regularly** (every 90 days recommended)
- **Use environment-specific databases** (prod vs dev)
- **Audit environment variables** quarterly
- **Use Vercel's encrypted storage** for production secrets
- **Set up alerts** for suspicious API usage

### ❌ DON'T

- **Never commit** `.env.local` or `.env` files to Git
- **Never share** secrets in Slack, email, or docs
- **Never use production keys** in development
- **Never expose** secret keys in client-side code
- **Never hardcode** secrets in source code
- **Never push** secrets to public repositories
- **Never reuse** the same encryption key across environments

### 🚨 If Secrets Are Compromised

1. **Immediately rotate** all affected keys:
   - Generate new Clerk keys in dashboard
   - Generate new database password
   - Generate new encryption key
   - Generate new OpenAI API key

2. **Re-encrypt data** if encryption key was compromised:
   - Run migration script to re-encrypt all stored API keys
   - Update all production environment variables

3. **Audit logs** for unauthorized access:
   - Check Clerk auth logs
   - Check database access logs
   - Check OpenAI usage logs
   - Check Vercel deployment logs

4. **Notify team** and document incident

---

## 🔧 Troubleshooting

### Error: "ENCRYPTION_KEY environment variable is required"

**Cause:** Missing or invalid `ENCRYPTION_KEY` in environment

**Solution:**

```bash
# Generate a new key
pnpm run generate-encryption-key

# Add to apps/web/.env.local
ENCRYPTION_KEY=<generated-key>
```

---

### Error: "DATABASE_URL environment variable is not set"

**Cause:** Missing database connection string

**Solution:**

1. Get connection string from [console.neon.tech](https://console.neon.tech)
2. Add to `apps/web/.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/db?sslmode=require
```

---

### Error: "Clerk secret key invalid"

**Cause:** Wrong Clerk key or mismatched environment

**Solution:**

1. Verify you're using the correct key type:
   - Development/Preview: `sk_test_...`
   - Production: `sk_live_...`
2. Get fresh keys from [dashboard.clerk.com](https://dashboard.clerk.com)
3. Ensure publishable key matches secret key

---

### Error: "Error verifying webhook"

**Cause:** Missing or incorrect `CLERK_WEBHOOK_SECRET`

**Solution:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Create webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Copy the **Signing Secret**
4. Add to environment:

```bash
CLERK_WEBHOOK_SECRET=whsec_<your-secret>
```

---

### Build fails on Vercel with "DATABASE_URL not found"

**Cause:** Environment variable not set for build environment

**Solution:**

1. Go to Vercel → Settings → Environment Variables
2. Ensure `DATABASE_URL` is checked for **all environments** (especially Preview)
3. Redeploy

---

### App works locally but fails in production

**Checklist:**

- [ ] All required variables set in Vercel dashboard
- [ ] Correct environment selected (Production/Preview/Development)
- [ ] Using production keys (`sk_live_`, `pk_live_`) in production
- [ ] Database URL is accessible from Vercel (check Neon IP allowlist)
- [ ] Encryption key is 64 hex characters
- [ ] No typos in variable names (case-sensitive!)

---

## 📞 Need Help?

### Quick Links

- **Clerk Support:** [clerk.com/support](https://clerk.com/support)
- **Neon Support:** [neon.tech/docs](https://neon.tech/docs)
- **Vercel Support:** [vercel.com/docs](https://vercel.com/docs)
- **OpenAI Support:** [help.openai.com](https://help.openai.com)

### Common Issues

Check `ENVIRONMENT_VARIABLES_REFERENCE.md` for a quick reference table of all variables.

---

**🎉 Setup Complete!**

Your environment should now be configured correctly. If you encounter any issues not covered here, please update this document for future developers.
