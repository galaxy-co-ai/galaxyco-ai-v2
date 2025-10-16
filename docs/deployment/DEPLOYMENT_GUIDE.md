# GalaxyCo.ai Platform - Production Deployment Guide

## 🚀 Phase 9B: Production Deployment to Vercel

This guide provides step-by-step instructions for deploying the GalaxyCo.ai platform to Vercel.

---

## Prerequisites

- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Vercel account logged in: `vercel login`
- [ ] GitHub repository connected to Vercel account
- [ ] Database migrations applied to production database
- [ ] Environment variables verified and ready

---

## Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   apps/web      │────────▶│  Vercel Project │
│   Next.js App   │         │  "web"          │
└─────────────────┘         └─────────────────┘
                                     │
                                     │ NEXT_PUBLIC_API_URL
                                     ▼
┌─────────────────┐         ┌─────────────────┐
│   apps/api      │────────▶│  Vercel Project │
│   Express API   │         │  "api"          │
└─────────────────┘         └─────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │   Neon   │    │  Upstash │    │  Clerk   │
              │ Postgres │    │  Redis   │    │   Auth   │
              └──────────┘    └──────────┘    └──────────┘
```

---

## Step 1: Pre-Deployment Checklist

### 1.1 Run Health Checks

```bash
# From workspace root
cd c:/Users/Owner/workspace/galaxyco-ai-2.0

# Run all health checks
npm run typecheck
npm run lint
npm run build

# Verify no errors
```

**Expected Result:** All commands should complete with **zero errors**.

### 1.2 Verify Environment Files

```bash
# Check API environment file exists
cat apps/api/.env.vercel

# Check Web environment file exists
cat apps/web/.env.vercel
```

---

## Step 2: Deploy API to Vercel

### 2.1 Create Vercel Project for API

```bash
cd apps/api

# Initialize Vercel project (first time only)
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: galaxyco-ai-v2-api
# - Directory: ./
# - Override settings? No
```

### 2.2 Configure Environment Variables

**Option A: Via Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Select project: `galaxyco-ai-v2-api`
3. Go to: Settings → Environment Variables
4. Click: "Add New" → "Paste .env"
5. Copy entire contents of `apps/api/.env.vercel`
6. Paste and save

**Option B: Via CLI** (Faster)

```bash
# From apps/api directory
vercel env pull .env.production

# Edit .env.production with values from .env.vercel
# Then push to Vercel:
vercel env add JWT_SECRET production < <(echo "prod-secret-gAlAxyC0-aI-vErc3l-pr0dUct10n-k3y-2025-s3cUr3")
vercel env add DATABASE_URL production < <(echo "postgresql://neondb_owner:npg_GDhkUvK3HZL5@ep-square-tooth-aemnkoa9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
# ... repeat for each variable
```

### 2.3 Deploy API

```bash
# Deploy to production
vercel --prod

# Verify deployment
curl https://galaxyco-ai-v2-api.vercel.app/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 2.4 Note API URL

**Important:** Copy the production API URL from Vercel dashboard:

```
https://galaxyco-ai-v2-api.vercel.app
```

You'll need this for the web app deployment.

---

## Step 3: Deploy Web App to Vercel

### 3.1 Update Web Environment Variables

Before deploying, update the API URL in `apps/web/.env.vercel`:

```bash
# Edit apps/web/.env.vercel
# Change NEXT_PUBLIC_API_URL to your actual API URL from Step 2.4
NEXT_PUBLIC_API_URL=https://galaxyco-ai-v2-api.vercel.app
```

### 3.2 Create Vercel Project for Web

```bash
cd ../web

# Initialize Vercel project (first time only)
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: galaxyco-ai-platform
# - Directory: ./
# - Override settings? No
```

### 3.3 Configure Environment Variables

**Via Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select project: `galaxyco-ai-platform`
3. Go to: Settings → Environment Variables
4. Click: "Add New" → "Paste .env"
5. Copy entire contents of `apps/web/.env.vercel`
6. Paste and save

### 3.4 Deploy Web App

```bash
# Deploy to production
vercel --prod

# Verify deployment
curl https://galaxyco-ai-platform.vercel.app
```

**Expected Result:** HTML response from Next.js app

---

## Step 4: Update CORS Configuration

### 4.1 Update API CORS Settings

After deploying the web app, update the API's CORS configuration:

1. Go to Vercel dashboard: `galaxyco-ai-v2-api`
2. Settings → Environment Variables
3. Find: `CORS_ORIGIN`
4. Update to: `https://galaxyco-ai-platform.vercel.app`
5. Redeploy API: `vercel --prod` (from apps/api)

---

## Step 5: Verify Production Deployment

### 5.1 Test Authentication Flow

1. Visit: https://galaxyco-ai-platform.vercel.app
2. Click "Sign In"
3. Complete Clerk authentication
4. Verify redirect to dashboard

### 5.2 Test API Connection

Open browser console on the web app:

```javascript
fetch("https://galaxyco-ai-v2-api.vercel.app/api/workspaces", {
  headers: {
    Authorization: "Bearer <your-jwt-token>",
  },
})
  .then((r) => r.json())
  .then(console.log);
```

**Expected:** List of workspaces

### 5.3 Test Agent Creation

1. Go to: Dashboard → Agents
2. Click: "Create Agent"
3. Fill form and submit
4. Verify agent appears in list

### 5.4 Test Multi-Tenancy

1. Create a second user account
2. Create a workspace
3. Verify you cannot see first user's workspaces/agents

---

## Step 6: Post-Deployment Configuration

### 6.1 Configure Clerk Production Settings

1. Go to: https://dashboard.clerk.com
2. Switch to Production instance
3. Update allowed origins:
   - `https://galaxyco-ai-platform.vercel.app`
   - `https://galaxyco-ai-v2-api.vercel.app`
4. Generate production webhook secret
5. Update `CLERK_WEBHOOK_SECRET` in Vercel API project

### 6.2 Set Up Custom Domain (Optional)

**For Web App:**

```bash
# From apps/web
vercel domains add app.galaxyco.ai
```

**For API:**

```bash
# From apps/api
vercel domains add api.galaxyco.ai
```

Update CORS and API URLs accordingly.

---

## Step 7: Monitoring & Observability

### 7.1 Enable Vercel Analytics

1. Go to each project in Vercel dashboard
2. Click "Analytics" tab
3. Enable Web Analytics (free tier)

### 7.2 Set Up Error Tracking (Optional)

**Sentry Integration:**

1. Create account at: https://sentry.io
2. Add environment variables:
   ```
   SENTRY_DSN=https://xxx@sentry.io/xxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   ```
3. Redeploy both projects

### 7.3 Monitor Database

1. Go to: https://console.neon.tech
2. Check "Monitoring" tab for:
   - Connection count
   - Query performance
   - Storage usage

---

## Step 8: Backup & Rollback Plan

### 8.1 Create Production Alias

```bash
# From apps/api
vercel alias set galaxyco-ai-v2-api.vercel.app galaxyco-ai-v2-api-stable.vercel.app

# From apps/web
vercel alias set galaxyco-ai-platform.vercel.app galaxyco-ai-platform-stable.vercel.app
```

### 8.2 Rollback Procedure

If issues occur:

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback <deployment-url>

# Or promote specific deployment to production
vercel promote <deployment-url> --prod
```

---

## Common Issues & Solutions

### Issue: API Returns 500 on All Requests

**Solution:**

1. Check Vercel logs: `vercel logs galaxyco-ai-v2-api --prod`
2. Verify DATABASE_URL is set correctly
3. Ensure JWT_SECRET is set
4. Check CORS_ORIGIN includes web app URL

### Issue: Web App Shows "Network Error"

**Solution:**

1. Verify NEXT_PUBLIC_API_URL is correct
2. Check browser console for CORS errors
3. Ensure API is deployed and healthy
4. Test API URL directly in browser

### Issue: Authentication Redirects Fail

**Solution:**

1. Check Clerk dashboard allowed origins
2. Verify CLERK_SECRET_KEY matches production key
3. Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is correct
4. Check redirect URLs in Clerk settings

### Issue: Database Connection Timeout

**Solution:**

1. Verify Neon database is active (not paused)
2. Check connection string includes `?sslmode=require`
3. Use pooled connection URL for serverless
4. Increase connection timeout in Drizzle config

---

## Security Checklist

- [ ] JWT_SECRET is a strong, unique production secret
- [ ] All API keys are environment variables (not hardcoded)
- [ ] CORS_ORIGIN is restricted to production domains only
- [ ] Database credentials are not exposed in client code
- [ ] Rate limiting is enabled
- [ ] Clerk webhooks are secured with webhook secret
- [ ] All NEXT*PUBLIC*\* variables contain no secrets

---

## Performance Optimization

### Enable Edge Functions (Optional)

For API routes that don't need Node.js runtime:

```javascript
// apps/api/src/routes/health.ts
export const config = {
  runtime: "edge",
};
```

### Enable ISR for Public Pages

```javascript
// apps/web/pages/marketplace.tsx
export async function getStaticProps() {
  return {
    props: {
      /* data */
    },
    revalidate: 60, // Rebuild every 60 seconds
  };
}
```

---

## Next Steps After Deployment

1. **Phase 10:** Marketplace launch with 5 initial templates
2. **Phase 11:** Usage analytics dashboard
3. **Phase 12:** Stripe billing integration
4. **Phase 13:** Team collaboration features

---

## Support & Contact

- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues
- **Discord:** #galaxyco-ai-platform

---

## Deployment Metrics

Track these KPIs after deployment:

- Time to First Byte (TTFB): < 200ms
- API Response Time: < 500ms
- Build Time: < 5 minutes
- Cold Start Time: < 2 seconds
- Error Rate: < 1%
- Uptime: > 99.9%

---

**Deployment completed!** 🎉

Your GalaxyCo.ai platform is now live in production.
