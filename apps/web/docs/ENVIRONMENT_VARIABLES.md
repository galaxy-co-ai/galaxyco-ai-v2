# 🔐 Environment Variables Guide

**Complete setup guide for all environment variables in GalaxyCo.ai platform**

---

## 📋 Quick Setup Checklist

- [ ] Copy `.env.example` to `.env.local` for development
- [ ] Generate encryption key using secure method (see guide below)
- [ ] Set up Neon PostgreSQL database
- [ ] Configure Clerk authentication
- [ ] Add AI provider API keys
- [ ] Configure webhooks and monitoring

---

## 🔴 REQUIRED Variables

### Database Connection

```bash
DATABASE_URL=postgresql://username:password@hostname.neon.tech/databasename?sslmode=require
```

**How to get:**
1. Visit [Neon Console](https://console.neon.tech)
2. Create project → Database
3. Go to Dashboard → Connection Details
4. Copy Pooled Connection string (recommended for serverless)

**Example:**
```bash
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### Authentication (Clerk)

```bash
# Server-side secret key (NEVER expose publicly)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Client-side publishable key (safe for frontend)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_1234567890abcdef1234567890abcdef12345678
```

**How to get:**
1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application or select existing
3. Go to Developers → API Keys
4. Copy both Secret Key and Publishable Key

**Development vs Production:**
- Development: `sk_test_...` and `pk_test_...`
- Production: `sk_live_...` and `pk_live_...`

---

### Data Encryption

```bash
# 32-byte hex string for encrypting API keys in database
ENCRYPTION_KEY=your_32_byte_hex_string_generated_securely_replace_this_value
```

**How to generate:**
```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 32

# Method 3: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

**⚠️ CRITICAL SECURITY NOTES:**
- Generate a NEW key for production (don't use example above)
- Never commit this key to version control
- Store securely - if lost, encrypted data becomes unrecoverable
- Use different keys for dev/staging/production

---

## 🟡 RECOMMENDED Variables

### AI Providers

```bash
# OpenAI API Key (for GPT models)
OPENAI_API_KEY=sk-proj-1234567890abcdef1234567890abcdef1234567890abcdef

# Anthropic API Key (for Claude models)  
ANTHROPIC_API_KEY=sk-ant-api03-1234567890abcdef1234567890abcdef1234567890abcdef-ABCDEF
```

**How to get OpenAI key:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name: "GalaxyCo.ai Production"
4. Set spending limits for safety

**How to get Anthropic key:**
1. Visit [Anthropic Console](https://console.anthropic.com/account/keys)
2. Click "Create Key"
3. Name: "GalaxyCo.ai Production"
4. Set usage limits

**Usage in app:**
- Required for AI agent execution
- Used by `/api/agents/*` endpoints
- Fallback logic: OpenAI primary, Anthropic secondary

---

### Webhook Security

```bash
# Clerk webhook signing secret
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**How to get:**
1. Clerk Dashboard → Webhooks
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy "Signing Secret"

**Purpose:**
- Validates webhook authenticity
- Syncs user data changes
- Maintains security

---

## 🟢 OPTIONAL Variables

### Error Tracking (Sentry)

```bash
# Public DSN (safe for frontend)
NEXT_PUBLIC_SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.us.sentry.io/1234567

# Auth token for source maps upload (optional)
SENTRY_AUTH_TOKEN=sntrys_your_auth_token_here
```

**How to get:**
1. Visit [Sentry.io](https://sentry.io)
2. Create project → Next.js
3. Copy DSN from project settings
4. Optional: Create auth token for source maps

---

### Performance & Analytics

```bash
# PostHog analytics key  
NEXT_PUBLIC_POSTHOG_KEY=phc_1234567890abcdef1234567890abcdef1234567890abcdef
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Vercel Analytics (automatic with Pro plan)
# No configuration needed
```

---

### Payments (Future)

```bash
# Stripe API keys (not yet implemented)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef1234567890abcdef1234567890abcdef

# Webhook endpoint secret
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

---

### Development & Debugging

```bash
# Environment indicator
NEXT_PUBLIC_ENV=development  # or 'staging' or 'production'

# Disable telemetry
NEXT_TELEMETRY_DISABLED=1

# Enable debug logging
DEBUG=galaxyco:*

# Database connection pool settings
DATABASE_CONNECTION_LIMIT=10
DATABASE_POOL_TIMEOUT=30000
```

---

## 🏗️ Environment-Specific Configurations

### Development (.env.local)

```bash
# Local development database
DATABASE_URL=postgresql://postgres:password@localhost:5432/galaxyco_dev

# Clerk test keys
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Local encryption key (different from production)
ENCRYPTION_KEY=local_dev_key_32bytes_hex_string_here

# Optional: Local AI keys for testing
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Development environment
NEXT_PUBLIC_ENV=development
```

### Staging (.env.staging)

```bash
# Staging database
DATABASE_URL=postgresql://user:pass@staging.neon.tech/galaxyco_staging

# Clerk test keys (or separate staging app)
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Staging encryption key (unique)
ENCRYPTION_KEY=staging_unique_32bytes_hex_string_here

# AI keys with limited usage
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Staging environment
NEXT_PUBLIC_ENV=staging
```

### Production (.env.production)

```bash
# Production database with connection pooling
DATABASE_URL=postgresql://user:pass@prod.neon.tech/galaxyco_prod?sslmode=require&pgbouncer=true

# Clerk production keys
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

# Production encryption key (unique & secure)
ENCRYPTION_KEY=production_unique_32bytes_hex_string_here

# Production AI keys with appropriate limits
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...

# Webhook secrets
CLERK_WEBHOOK_SECRET=whsec_...

# Error tracking
NEXT_PUBLIC_SENTRY_DSN=https://...

# Production environment
NEXT_PUBLIC_ENV=production
```

---

## 🔧 Platform-Specific Setup

### Vercel Environment Variables

1. **Go to Project Settings**
   - Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Set Variable Scope**
   - **Production**: Live site only
   - **Preview**: Preview deployments (staging)
   - **Development**: Local development (optional)

3. **Required Variables for Vercel:**
   - `DATABASE_URL` → Production
   - `CLERK_SECRET_KEY` → Production + Preview
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → Production + Preview
   - `ENCRYPTION_KEY` → Production + Preview
   - `OPENAI_API_KEY` → Production + Preview
   - `ANTHROPIC_API_KEY` → Production + Preview
   - `CLERK_WEBHOOK_SECRET` → Production
   - `NEXT_PUBLIC_SENTRY_DSN` → Production + Preview

### Local Development Setup

1. **Copy example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate encryption key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Add to .env.local:**
   ```bash
   ENCRYPTION_KEY=your_generated_key_here
   ```

4. **Add other required variables** (see Development section above)

---

## ⚠️ Security Best Practices

### DO's

- ✅ Use different encryption keys per environment
- ✅ Rotate API keys regularly (quarterly)
- ✅ Set spending limits on AI provider accounts
- ✅ Use environment-specific Clerk applications
- ✅ Enable webhook signature verification
- ✅ Store secrets in secure password manager
- ✅ Use production keys only in production

### DON'Ts

- ❌ Never commit `.env.local` or `.env.production` to Git
- ❌ Don't reuse encryption keys across environments
- ❌ Don't use test keys in production
- ❌ Don't share API keys in chat/email
- ❌ Don't disable webhook signature verification
- ❌ Don't use weak/predictable encryption keys
- ❌ Don't store secrets in code comments

---

## 🔍 Validation & Testing

### Environment Validation Script

Create `scripts/validate-env.js`:

```javascript
const requiredVars = [
  'DATABASE_URL',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'ENCRYPTION_KEY'
];

const missingVars = requiredVars.filter(name => !process.env[name]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(name => console.error(`   - ${name}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

### Test Database Connection

```bash
# Test database connectivity
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully');
    process.exit(0);
  }
});
"
```

### Test Clerk Authentication

```bash
# Test Clerk API keys
curl -H "Authorization: Bearer $CLERK_SECRET_KEY" \
     https://api.clerk.com/v1/users?limit=1
```

---

## 📚 References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk Environment Variables](https://clerk.com/docs/deployments/environment-variables)
- [Neon Connection Strings](https://neon.tech/docs/connect/connect-from-any-app)

---

*Last Updated: October 2024*
*Platform Version: 2.0.0*