# API Key Recovery - Quick Summary

## ✅ Completed Steps

1. **Removed exposed files from GitHub**
   - Deleted `add-optional-env.sh`
   - Deleted `apps/web/.env.local.backup`
   - Enhanced `.gitignore` protection
   - Committed and pushed changes

## 🔄 What You Need to Do Now

### Step 1: Generate New API Keys (10 minutes)

#### OpenAI

1. Go to: **https://platform.openai.com/api-keys**
2. Click "Create new secret key"
3. Name: "GalaxyCo-Production-2025-10-12"
4. **COPY THE KEY IMMEDIATELY** (you won't see it again!)
5. Save in password manager

#### Anthropic

1. Go to: **https://console.anthropic.com/settings/keys**
2. Click "Create Key"
3. Name: "GalaxyCo-Production-2025-10-12"
4. **COPY THE KEY IMMEDIATELY**
5. Save in password manager

### Step 2: Update Local Environment (2 minutes)

Open your `.env.local` file:

```bash
code apps/web/.env.local
```

Replace the OLD keys with your NEW keys:

```env
# OpenAI API Key (NEW - Generated 2025-10-12)
OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE

# Anthropic API Key (NEW - Generated 2025-10-12)
ANTHROPIC_API_KEY=sk-ant-YOUR_NEW_KEY_HERE
```

**Save the file.** DO NOT commit this file!

### Step 3: Update Vercel (If Deployed)

If you're using Vercel for deployment:

1. Go to: https://vercel.com/YOUR_PROJECT/settings/environment-variables
2. Update `OPENAI_API_KEY` with your new key
3. Update `ANTHROPIC_API_KEY` with your new key
4. Redeploy your application

### Step 4: Test Everything (5 minutes)

```bash
# Start dev server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3000/api/agents/health?mode=quick
```

Expected response should show:

```json
{
  "status": "healthy",
  "ai_providers": {
    "openai": true,
    "anthropic": true
  }
}
```

## 📋 Quick Checklist

- [ ] Generated new OpenAI API key
- [ ] Generated new Anthropic API key
- [ ] Updated `apps/web/.env.local` with new keys
- [ ] Updated Vercel environment variables (if deployed)
- [ ] Tested local development
- [ ] Tested production (if deployed)
- [ ] Saved new keys in password manager

## ⚠️ Important Notes

1. **Old keys are INVALID** - Both providers auto-deactivated them
2. **Never commit `.env.local`** - It's already in `.gitignore`
3. **The exposed keys are removed from the main branch** - But remain in git history
4. **Optional:** Run `scripts/clean-git-history.sh` to remove from history permanently

## 📚 Full Documentation

For complete details, see: **`docs/incidents/API_KEY_EXPOSURE_RECOVERY.md`**

## 🔐 Prevention Tips

1. Always check `git status` before committing
2. Never create `.backup` files with sensitive data
3. Use environment variables exclusively
4. Enable GitHub secret scanning
5. Use pre-commit hooks to catch secrets

## ❓ Need Help?

- OpenAI Support: https://help.openai.com/
- Anthropic Support: support@anthropic.com
- Full recovery guide: `docs/incidents/API_KEY_EXPOSURE_RECOVERY.md`

---

**Status:** In Progress  
**Next Action:** Generate new API keys and update `.env.local`  
**Time Estimate:** 15-20 minutes total
