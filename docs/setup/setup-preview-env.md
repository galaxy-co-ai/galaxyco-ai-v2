# Setup Preview Environment Variables

## Essential Variables for Preview Environment

Run these commands **ONE BY ONE** and paste the actual values when prompted:

```bash
# 1. Clerk Publishable Key (starts with pk_test_)
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

# 2. Clerk Secret Key (starts with sk_test_)
vercel env add CLERK_SECRET_KEY preview

# 3. Database URL (from Neon dashboard)
vercel env add DATABASE_URL preview

# 4. API URL (your Vercel deployment domain)
vercel env add NEXT_PUBLIC_API_URL preview
```

## Where to Find These Values

### Clerk Keys

1. Go to https://dashboard.clerk.com
2. Select your project
3. Go to "API Keys"
4. Copy the keys for your **Test** environment

### Database URL

1. Go to https://console.neon.tech
2. Select your project
3. Copy the connection string (starts with `postgresql://`)

### API URL

Use: `https://galaxyco-ai-20.vercel.app`

---

## Verify After Setting

```bash
# List all Preview environment variables
vercel env ls

# Should show ONLY these 4 variables for Preview
```

## Trigger Redeploy

```bash
# After setting all variables, redeploy
git commit --allow-empty -m "chore: trigger redeploy after env setup"
git push origin temp-phase9
```
