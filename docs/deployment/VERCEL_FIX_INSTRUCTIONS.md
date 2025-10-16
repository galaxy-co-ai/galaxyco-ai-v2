# Vercel Deployment Fix - 404 API Routes

## Issue

API routes (including `/api/onboarding/complete`) return 404 on production despite existing in the codebase and building successfully locally.

## Root Cause

Vercel project's **Root Directory** setting is not configured to build from `apps/web` in the monorepo structure.

## Fix Steps

### Method 1: Update Vercel Dashboard Settings (Recommended)

1. Navigate to: https://vercel.com/daltons-projects-7f1e31bb/galaxyco-ai-2.0/settings/general
2. Scroll down to **Build & Development Settings**
3. Click **Edit** next to Root Directory
4. Set **Root Directory** to: `apps/web`
5. **Framework Preset** should be: `Next.js`
6. **Build Command**: leave default or set to `pnpm run build`
7. **Output Directory**: leave default `.next`
8. Click **Save**
9. Go to **Deployments** tab and click **Redeploy** on the latest successful deployment

### Method 2: Using Vercel CLI (Alternative)

```bash
vercel --prod --cwd apps/web
```

## Verification

After deployment completes, test the API route:

```bash
curl -X POST https://galaxyco-ai-20.vercel.app/api/onboarding/complete \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Expected response: Either `401 Unauthorized` (if not authenticated) or a valid JSON response.
Should NOT return 404.

## Files Verified

✅ `/apps/web/app/api/onboarding/complete/route.ts` exists
✅ Route builds successfully locally
✅ Route has `export const dynamic = 'force-dynamic';` configured
✅ Local build output shows route in the build manifest

## Related Commits

- `3e73187` - Reverted incorrect rootDirectory in vercel.json
- `3786625` - Attempted fix via vercel.json (did not work)
- `dbf3597` - Set correct output directory

## Status

**Action Required**: Update Vercel dashboard settings per Method 1 above.
