# Environment Variables Reference - GalaxyCo.ai

## 🔐 Required Environment Variables

### For ALL Environments (Development, Preview, Production)

| Variable Name                       | Description                    | Example Format                      | Where to Get It                    |
| ----------------------------------- | ------------------------------ | ----------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for auth      | `pk_test_...` or `pk_live_...`      | Clerk Dashboard → API Keys         |
| `CLERK_SECRET_KEY`                  | Clerk secret key (server-side) | `sk_test_...` or `sk_live_...`      | Clerk Dashboard → API Keys         |
| `DATABASE_URL`                      | PostgreSQL connection string   | `postgresql://user:pass@host/db`    | Neon Dashboard → Connection String |
| `NEXT_PUBLIC_API_URL`               | Your app's public URL          | `https://galaxyco-ai-20.vercel.app` | Your Vercel deployment URL         |

---

## 📋 Environment-Specific Values

### Development (Local)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
CLERK_SECRET_KEY=sk_test_XXXXX
DATABASE_URL=postgresql://XXXXX
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Preview (Vercel Preview Deployments)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX  # Use TEST keys
CLERK_SECRET_KEY=sk_test_XXXXX                    # Use TEST keys
DATABASE_URL=postgresql://XXXXX                   # Use DEV/STAGING database
NEXT_PUBLIC_API_URL=https://galaxyco-ai-20.vercel.app
NODE_ENV=production
```

### Production (Vercel Production)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_XXXXX  # Use LIVE keys
CLERK_SECRET_KEY=sk_live_XXXXX                    # Use LIVE keys
DATABASE_URL=postgresql://XXXXX                   # Use PRODUCTION database
NEXT_PUBLIC_API_URL=https://galaxyco-ai-20.vercel.app
NODE_ENV=production
```

---

## 🚫 Variables to DELETE (Not Needed)

These are in your Vercel project but NOT needed for the app to work:

- ❌ `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (Clerk auto-handles this)
- ❌ `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (Clerk auto-handles this)
- ❌ `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (Set in Clerk dashboard instead)
- ❌ `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (Set in Clerk dashboard instead)
- ❌ `ENABLE_AUTO_APPROVE` (Not used in code)
- ❌ `ENABLE_SIM_MODE` (Not used in code)
- ❌ `ENABLE_BUILDER` (Not used in code)
- ❌ `ENABLE_MARKETPLACE` (Not used in code)
- ❌ `RATE_LIMIT_WINDOW_MS` (Not implemented)
- ❌ `RATE_LIMIT_MAX` (Not implemented)
- ❌ `CORS_ORIGIN` (Not needed for Next.js)
- ❌ `JWT_EXPIRES_IN` (Using Clerk, not custom JWT)
- ❌ `JWT_SECRET` (Using Clerk, not custom JWT)
- ❌ `REDIS_URL` (Not using Redis)
- ❌ `NEXT_PUBLIC_ENABLE_SIM_MODE` (Not in use)
- ❌ `NEXT_PUBLIC_ENABLE_BUILDER` (Not in use)
- ❌ `NEXT_PUBLIC_ENABLE_MARKETPLACE` (Not in use)

---

## 🔍 How to Get Each Value

### 1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY & CLERK_SECRET_KEY

**Steps:**

1. Go to https://dashboard.clerk.com
2. Select your project (or create one)
3. Click "API Keys" in sidebar
4. Copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

**Important:**

- Use **Test** keys for Development/Preview
- Use **Live** keys for Production

---

### 2. DATABASE_URL

**Steps:**

1. Go to https://console.neon.tech
2. Select your project (or create one)
3. Go to "Dashboard" → "Connection Details"
4. Copy the **Connection string**
5. Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

**Important:**

- Use a separate database for Production vs Development/Preview
- Or use different database names on same server

---

### 3. NEXT_PUBLIC_API_URL

**For Development:**

```
http://localhost:3000
```

**For Preview & Production:**

```
https://galaxyco-ai-20.vercel.app
```

(Or your custom domain once set up)

---

## 📁 Where to Store Locally

Create this file: `apps/web/.env.local`

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
CLERK_SECRET_KEY=sk_test_XXXXX
DATABASE_URL=postgresql://XXXXX
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:** This file is in `.gitignore` - never commit it!

---

## ⚙️ How to Set in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/daltons-projects-7f1e31bb/galaxyco-ai-2.0
2. Settings → Environment Variables
3. Add each variable
4. Select which environments (Development/Preview/Production)
5. Click "Save"

### Method 2: Vercel CLI

```bash
# Add to Preview environment
echo "your-actual-value" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

# Add to Production environment
echo "your-actual-value" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# Add to Development environment
echo "your-actual-value" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
```

---

## ✅ Verification Checklist

After setting variables, verify:

- [ ] All 4 required variables set for **Preview**
- [ ] All 4 required variables set for **Production**
- [ ] Values are ACTUAL secrets, not `{{VARIABLE_NAME}}` placeholders
- [ ] Clerk keys match environment (test keys for preview, live keys for production)
- [ ] Database URL is valid and connection works
- [ ] API URL matches your deployment domain

**Test locally:**

```bash
cd apps/web
pnpm dev
# Visit http://localhost:3000 and test authentication
```

**Test on Vercel:**

```bash
# Trigger a new deployment
git commit --allow-empty -m "chore: test env vars"
git push origin temp-phase9
# Wait 2 minutes, then test the preview URL
```

---

## 🚨 Security Best Practices

1. **Never commit `.env.local` or `.env` files**
2. **Use different Clerk projects for test vs production**
3. **Use different databases for test vs production**
4. **Rotate keys if accidentally exposed**
5. **Use Vercel's encrypted storage** (they auto-encrypt)
6. **Review environment variables periodically** and remove unused ones

---

## 🔄 Quick Reset (If Things Are Broken)

If environment variables are messed up:

1. **Delete ALL Preview environment variables in Vercel dashboard**
2. **Add back ONLY the 4 required ones** (see table at top)
3. **Trigger redeploy:**
   ```bash
   git commit --allow-empty -m "chore: trigger redeploy"
   git push origin temp-phase9
   ```

---

## 📞 Need Help?

**Clerk Issues:**

- Docs: https://clerk.com/docs
- Dashboard: https://dashboard.clerk.com

**Neon Issues:**

- Docs: https://neon.tech/docs
- Dashboard: https://console.neon.tech

**Vercel Issues:**

- Docs: https://vercel.com/docs
- Dashboard: https://vercel.com/dashboard

---

**Last Updated:** Oct 9, 2025  
**For Project:** GalaxyCo.ai v2.0  
**Branch:** temp-phase9
