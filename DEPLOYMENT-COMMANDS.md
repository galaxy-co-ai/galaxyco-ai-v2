# 🚀 GALAXYCO.AI DEPLOYMENT COMMANDS

## Quick Reference for Production Deployment

---

## 🔧 OPTION 1: Vercel CLI (Recommended)

### Deploy to Production

```bash
# Navigate to project root
cd C:\Users\Owner\workspace\galaxyco-ai-2.0

# Deploy to production
vercel --prod
```

**Expected Output:**

```
Vercel CLI 33.0.0
🔍  Inspect: https://vercel.com/...
✅  Production: https://galaxyco.ai [3s]
```

---

## 🔧 OPTION 2: Git Push (Auto-Deploy)

### Push to Main Branch

```bash
# Make sure you're on main branch
git checkout main

# Push to trigger deployment
git push origin main
```

**Expected:**

- Vercel detects push
- Starts build automatically
- Deploys to production
- URL: https://galaxyco.ai

---

## 🔧 OPTION 3: Vercel Dashboard (Manual)

### Via Web Interface

1. Go to https://vercel.com/dashboard
2. Select GalaxyCo project
3. Click "Deployments" tab
4. Click "Deploy" button
5. Select "main" branch
6. Click "Deploy"

**Expected:**

- Build starts
- Completes in 2-3 minutes
- Production URL updated

---

## ✅ VERIFY DEPLOYMENT

### Check Deployment Status

```bash
# List recent deployments
vercel ls

# Get deployment details
vercel inspect <deployment-url>
```

### Test Production URL

```bash
# Test homepage loads
curl https://galaxyco.ai

# Should return HTML (200 OK)
```

---

## 🧪 POST-DEPLOYMENT SMOKE TEST

### Quick Commands to Test

**Test 1: Homepage**

```bash
# Should return 200
curl -I https://galaxyco.ai
```

**Test 2: API Health (if exists)**

```bash
# Check if API responds
curl https://galaxyco.ai/api/health
```

**Test 3: Marketplace API**

```bash
# Check marketplace endpoint
curl "https://galaxyco.ai/api/marketplace?limit=5"
```

---

## 📊 MONITOR LOGS

### View Production Logs

```bash
# Real-time logs
vercel logs --prod

# Follow logs (continuous)
vercel logs --prod --follow
```

### View Specific Deployment Logs

```bash
# Get deployment ID first
vercel ls

# View logs for specific deployment
vercel logs <deployment-id>
```

---

## 🚨 ROLLBACK (If Needed)

### Instant Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <previous-deployment-url>
```

**Or via Dashboard:**

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Confirm

**Rollback Time:** < 1 minute ⚡

---

## 🔑 ENVIRONMENT VARIABLES

### Check Environment Variables

```bash
# List all env vars
vercel env ls

# Pull env vars to local
vercel env pull
```

### Add/Update Environment Variable

```bash
# Add new variable
vercel env add

# Remove variable
vercel env rm VARIABLE_NAME
```

**Note:** Changes require redeployment

---

## 📋 USEFUL COMMANDS

### Check Build Output

```bash
# See build logs
vercel logs <deployment-id> --since 10m
```

### Check Project Info

```bash
# Get project details
vercel inspect

# Check domains
vercel domains ls
```

### Force Redeploy

```bash
# Redeploy without code changes
vercel --force
```

---

## 🎯 DEPLOYMENT CHECKLIST

```bash
# Step 1: Ensure clean state
git status
git pull origin main

# Step 2: Run tests locally (optional)
pnpm test

# Step 3: Deploy
vercel --prod

# Step 4: Verify
curl -I https://galaxyco.ai

# Step 5: Monitor
vercel logs --prod --follow

# Step 6: If issues, rollback
vercel ls
vercel promote <previous-deployment>
```

---

## 🚀 ONE-COMMAND DEPLOYMENT

```bash
# Deploy to production and monitor logs
vercel --prod && vercel logs --prod --follow
```

---

## 📞 TROUBLESHOOTING

### Build Fails

```bash
# Check build logs
vercel logs <deployment-id>

# Look for:
# - TypeScript errors (web should compile)
# - Missing dependencies
# - Environment variable issues
```

### Deployment Slow

```bash
# Check deployment status
vercel inspect <deployment-url>

# Typical build time: 2-3 minutes
# If > 5 minutes, check logs
```

### Can't Access Production URL

```bash
# Check domain status
vercel domains ls

# Verify DNS propagation
nslookup galaxyco.ai

# Check deployment status
vercel ls
```

---

## 🎉 SUCCESS INDICATORS

**Deployment Successful If:**

- ✅ `vercel --prod` returns production URL
- ✅ `curl -I https://galaxyco.ai` returns 200
- ✅ Build time: 2-3 minutes
- ✅ No errors in build logs
- ✅ Homepage loads in browser

**Deployment Failed If:**

- ❌ Build fails with errors
- ❌ Deployment stuck (> 5 minutes)
- ❌ 404 or 500 errors
- ❌ Environment variables missing

---

## 📚 RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **CLI Reference:** https://vercel.com/docs/cli
- **Dashboard:** https://vercel.com/dashboard
- **Support:** https://vercel.com/support

---

**READY TO DEPLOY!** 🚀

**Recommended Command:**

```bash
vercel --prod
```

Then execute smoke tests from `LAUNCH-CHECKLIST-NOV-4.md`

---

**END OF DEPLOYMENT COMMANDS**
