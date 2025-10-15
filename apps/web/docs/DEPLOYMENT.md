# 🚀 GalaxyCo.ai Deployment Guide

**Complete guide to deploy GalaxyCo.ai platform to production**

---

## 📋 Prerequisites

- [x] Node.js 20+
- [x] pnpm 9+
- [x] Git access to repository
- [x] Vercel account with CLI access
- [x] Neon (PostgreSQL) database
- [x] Clerk account for authentication

---

## 🔧 Environment Setup

### Required Environment Variables

Copy these to your Vercel project environment variables:

```bash
# Database (Required)
DATABASE_URL=postgresql://user:password@host.neon.tech/database

# Authentication (Required)
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here

# Data Encryption (Required)
ENCRYPTION_KEY=your_32_byte_hex_string_generated_securely_replace_this_value

# AI Providers (Recommended)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key_here

# Webhook Security (Recommended)
CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret_here

# Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=sntrys_your_sentry_auth_token_here

# Environment Indicator (Optional)
NEXT_PUBLIC_ENV=production
```

---

## 🌐 Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository to Vercel**
   ```bash
   # Visit https://vercel.com/new
   # Import your GitHub repository: galaxyco-ai-2.0
   # Select framework preset: Next.js
   ```

2. **Configure Project Settings**
   - **Project Name**: `galaxyco-ai-platform` 
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
   - **Node.js Version**: 20.x

3. **Set Environment Variables** (see Environment Setup section)

4. **Deploy**
   ```bash
   git push origin main  # Triggers automatic deployment
   ```

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🗄️ Database Setup

### Neon PostgreSQL

1. **Create Production Database**
   - Visit [Neon Console](https://console.neon.tech)
   - Create new database: `galaxyco-production`
   - Copy connection string

2. **Run Migrations**
   ```bash
   cd packages/database
   npm run migrate:production
   ```

3. **Verify Schema**
   ```bash
   npm run db:studio  # Check tables are created correctly
   ```

---

## 🔐 Authentication Setup

### Clerk Configuration

1. **Create Production Instance**
   - Visit [Clerk Dashboard](https://dashboard.clerk.com)
   - Create new application: "GalaxyCo.ai Production"
   - Select authentication methods:
     - [x] Email + Password
     - [x] Google OAuth
     - [x] GitHub OAuth (optional)

2. **Configure Webhooks**
   ```bash
   Webhook URL: https://your-domain.vercel.app/api/webhooks/clerk
   Events: user.created, user.updated, user.deleted
   ```

3. **Copy API Keys**
   - Secret Key → `CLERK_SECRET_KEY`
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Webhook Secret → `CLERK_WEBHOOK_SECRET`

---

## 🤖 AI Provider Setup

### OpenAI Configuration

1. **Get API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new secret key
   - Set usage limits for production

2. **Test Connection**
   ```bash
   curl -X POST /api/agents/health?mode=quick
   ```

### Anthropic Configuration (Optional)

1. **Get API Key**
   - Visit [Anthropic Console](https://console.anthropic.com/account/keys)
   - Create new API key
   - Set billing limits

---

## 🔍 Error Tracking Setup

### Sentry Configuration

1. **Create Project**
   - Visit [Sentry.io](https://sentry.io)
   - Create new project: "GalaxyCo.ai Web"
   - Framework: Next.js

2. **Configure DSN**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

3. **Source Maps Upload** (Optional)
   ```bash
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

---

## ✅ Post-Deployment Verification

### Critical Features Test

1. **Authentication**
   - [ ] Sign up with email
   - [ ] Sign in with email  
   - [ ] Sign in with Google
   - [ ] Sign out

2. **Dashboard**
   - [ ] Dashboard loads correctly
   - [ ] Stats display without errors
   - [ ] Navigation works

3. **API Routes**
   - [ ] `/api/health` returns 200
   - [ ] `/api/agents/health` returns 200
   - [ ] `/api/knowledge` handles auth correctly

4. **Database**
   - [ ] User data persists
   - [ ] Workspaces created correctly
   - [ ] API keys encrypted/stored

5. **AI Integration** 
   - [ ] Agent execution works
   - [ ] API keys validated
   - [ ] Error handling works

---

## 🚨 Monitoring & Alerts

### Health Checks

```bash
# Automated health check URLs
https://your-domain.vercel.app/api/health
https://your-domain.vercel.app/api/agents/health?mode=quick
```

### Performance Monitoring

- **Vercel Analytics**: Automatic with Pro plan
- **Core Web Vitals**: Monitor via Vercel dashboard
- **Error Rate**: Track via Sentry dashboard

### Alert Thresholds

- Response time > 5s
- Error rate > 5%
- Database connection failures
- Authentication failures > 10/hour

---

## 🔄 Rollback Plan

### Quick Rollback

```bash
# Via Vercel Dashboard
1. Go to Deployments tab
2. Select previous working deployment
3. Click "Promote to Production"
```

### Emergency Rollback

```bash
# Via Vercel CLI
vercel --prod --force  # Redeploy last commit
```

---

## 📊 Success Metrics

### Technical KPIs

- **Build Success Rate**: > 95%
- **Response Time P95**: < 2s
- **Error Rate**: < 1%
- **Uptime**: > 99.5%

### Feature KPIs

- **Authentication Success**: > 98%
- **Agent Execution Success**: > 90%
- **Dashboard Load Time**: < 3s
- **API Response Time**: < 500ms

---

## 🆘 Emergency Contacts

- **Platform Issues**: Vercel Support
- **Database Issues**: Neon Support  
- **Authentication Issues**: Clerk Support
- **AI Provider Issues**: OpenAI/Anthropic Support

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production)
- [Neon Production Guide](https://neon.tech/docs/guides/production-checklist)

---

*Last Updated: {{ current_time }}*
*Platform Version: 2.0.0*