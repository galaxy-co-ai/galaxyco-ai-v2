# Environment Variables Guide

Complete reference for environment variables in GalaxyCo.ai

## 📋 Overview

Environment variables store sensitive configuration and API keys. They are:

- **Never committed** to version control (in `.gitignore`)
- **Different per environment** (local dev, staging, production)
- **Managed separately** in each deployment environment

---

## 🔧 Local Development Setup

### Creating `.env.local`

```bash
cd apps/web
cp .env.example .env.local
# Edit .env.local with your actual values
```

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Optional: AI Provider Keys (for agents)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

---

## 🔐 Clerk Configuration

### Where to Find Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to "API Keys"
4. Copy keys to `.env.local`

### Publishable Key

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_abc123..."
```

- **Prefix**: `NEXT_PUBLIC_` makes it available in browser
- **Type**: Test key for development, Live key for production
- **Used for**: Frontend authentication UI

### Secret Key

```bash
CLERK_SECRET_KEY="sk_test_xyz789..."
```

- **Type**: Server-side only (NEVER expose in frontend)
- **Used for**: API routes, middleware, backend operations

### Webhook Secret

```bash
CLERK_WEBHOOK_SECRET="whsec_abc123..."
```

- **Used for**: Verifying webhook signatures from Clerk
- **Find in**: Clerk Dashboard > Webhooks > Endpoint

---

## 🗄️ Database Configuration

### Neon PostgreSQL

```bash
DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
```

**Where to find**:

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click "Connection Details"
4. Copy "Connection string"

**Connection pooling** (for serverless):

```bash
# Use pooled connection for Vercel
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require&pooler=true"
```

---

## 🤖 AI Provider Keys

### OpenAI

```bash
OPENAI_API_KEY="sk-proj-..."
```

**Where to find**:

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys
3. Create new key or copy existing

### Anthropic (Claude)

```bash
ANTHROPIC_API_KEY="sk-ant-..."
```

**Where to find**:

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Navigate to API Keys
3. Create new key

---

## 🚀 Production (Vercel) Setup

### Adding Variables via Dashboard

1. Go to [Vercel Project Settings](https://vercel.com/galaxyco-ai/galaxyco-ai-platform/settings/environment-variables)
2. Click "Add New"
3. Enter Key, Value, and select environments:
   - **Production**: Live site
   - **Preview**: PR deployments
   - **Development**: Local with `vercel dev`

### Adding Variables via CLI

```bash
# Add variable to production
vercel env add VARIABLE_NAME production

# Add to all environments
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull .env.local
```

### Important Notes

⚠️ **Changing env vars doesn't trigger redeploy** - you must manually redeploy:

```bash
vercel --prod
```

⚠️ **Build-time vs Runtime**:

- Variables prefixed with `NEXT_PUBLIC_` are included at build time
- Other variables are available at runtime only

---

## 🧪 Testing & Development

### Multiple Environments

You can create different `.env` files for different purposes:

```bash
.env.local          # Local development (gitignored)
.env.development    # Development defaults
.env.test           # Testing environment
.env.production     # Production (usually managed by Vercel)
```

Load specific env file:

```bash
# Using dotenv-cli
npm install -g dotenv-cli
dotenv -e .env.test -- npm run test
```

---

## 🔍 Debugging Environment Variables

### Check if Variable is Set

```typescript
// In API route or server component
console.log('Database URL exists:', !!process.env.DATABASE_URL);

// NEVER log actual values:
// ❌ console.log(process.env.DATABASE_URL)
```

### Common Issues

**Issue**: "Environment variable not found"

**Solutions**:

1. Check variable name spelling matches exactly
2. Restart dev server after changing `.env.local`
3. Verify variable is in correct file (`.env.local` for local dev)
4. For `NEXT_PUBLIC_` vars, rebuild the app

**Issue**: Variable works locally but not in Vercel

**Solutions**:

1. Check variable is added in Vercel dashboard
2. Redeploy after adding variable
3. Verify correct environment (Production vs Preview)

---

## 🛡️ Security Best Practices

### DO ✅

- Use `.env.local` for local secrets (gitignored)
- Add secrets to Vercel environment variables
- Use `NEXT_PUBLIC_` prefix only when necessary for client-side
- Rotate keys regularly
- Use different keys for development vs production

### DON'T ❌

- Commit `.env.local` to git
- Log sensitive values to console
- Expose server-side keys to client
- Share production keys in team chat
- Use production keys in development

---

## 📝 Environment Variable Checklist

When setting up a new environment:

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required variables
- [ ] Test database connection
- [ ] Verify Clerk authentication works
- [ ] Test AI provider keys (if using)
- [ ] Add same variables to Vercel
- [ ] Verify production deployment works
- [ ] Document any new variables in this file

---

## 📚 Reference: All Variables

### Core Application

| Variable                            | Required    | Environments | Description                  |
| ----------------------------------- | ----------- | ------------ | ---------------------------- |
| `DATABASE_URL`                      | ✅ Yes      | All          | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Yes      | All          | Clerk public key             |
| `CLERK_SECRET_KEY`                  | ✅ Yes      | All          | Clerk secret key             |
| `CLERK_WEBHOOK_SECRET`              | ⚠️ Optional | All          | Clerk webhook verification   |

### AI Providers

| Variable            | Required    | Environments | Description               |
| ------------------- | ----------- | ------------ | ------------------------- |
| `OPENAI_API_KEY`    | ⚠️ Optional | All          | OpenAI API access         |
| `ANTHROPIC_API_KEY` | ⚠️ Optional | All          | Anthropic (Claude) access |

### Analytics & Monitoring (Future)

| Variable              | Required    | Environments | Description     |
| --------------------- | ----------- | ------------ | --------------- |
| `SENTRY_DSN`          | ⚠️ Optional | Production   | Error tracking  |
| `VERCEL_ANALYTICS_ID` | ⚠️ Optional | Production   | Usage analytics |

---

## 🆘 Need Help?

1. Check if variable is in `.env.local` and `.env.example`
2. Verify variable exists in Vercel dashboard
3. Search this file for the specific variable
4. Check troubleshooting runbook: `docs/runbooks/troubleshooting.md`

---

**Remember**: Treat environment variables like passwords! 🔒
