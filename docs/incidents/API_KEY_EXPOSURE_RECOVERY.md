# API Key Exposure Recovery Guide

**Incident Date:** 2025-10-12  
**Severity:** HIGH  
**Status:** In Recovery

## What Happened

The GitHub repository was made public with exposed API keys in the following files:
- `add-optional-env.sh` - Contains OpenAI API key
- `apps/web/.env.local.backup` - Contains both OpenAI and Anthropic API keys

Both OpenAI and Anthropic have **automatically deactivated** these keys upon detection.

## Immediate Actions Taken

✅ Keys are already invalid (auto-rotated by providers)  
⏳ Need to remove from git history  
⏳ Need to generate new keys  
⏳ Need to update all environments

## Recovery Steps

### Phase 1: Clean Git Repository (15 minutes)

#### Step 1.1: Remove Exposed Files

```bash
cd /c/Users/Owner/workspace/galaxyco-ai-2.0

# Make recovery script executable
chmod +x scripts/api-key-recovery.sh

# Run the recovery script
bash scripts/api-key-recovery.sh
```

This will:
- Remove `add-optional-env.sh` from git
- Remove `apps/web/.env.local.backup` from git
- Update `.gitignore` with better protection
- Clean local sensitive files

#### Step 1.2: Commit and Push Changes

```bash
git add .gitignore
git commit -m "security: remove exposed API keys and enhance .gitignore"
git push origin main
```

### Phase 2: Clean Git History (OPTIONAL - 30 minutes)

⚠️ **WARNING:** This rewrites git history. If you're the only developer, proceed. If you have team members, coordinate first.

```bash
# Make script executable
chmod +x scripts/clean-git-history.sh

# Run the cleanup script
bash scripts/clean-git-history.sh

# Force push (DESTRUCTIVE!)
git push origin --force --all
git push origin --force --tags
```

**If you skip this step:** The old keys will remain in git history but are already invalid, so the risk is minimal.

### Phase 3: Generate New API Keys (10 minutes)

#### Step 3.1: OpenAI

1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: "GalaxyCo-Production-2025-10-12"
4. **Copy the key immediately** (you won't see it again!)
5. Save it in a password manager

#### Step 3.2: Anthropic

1. Go to: https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Name it: "GalaxyCo-Production-2025-10-12"
4. **Copy the key immediately**
5. Save it in a password manager

### Phase 4: Update Local Environment (5 minutes)

#### Step 4.1: Update `.env.local`

```bash
# Open your local environment file
code apps/web/.env.local

# Or use nano
nano apps/web/.env.local
```

Update with your NEW keys:

```env
# OpenAI API Key (NEW - Generated 2025-10-12)
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Anthropic API Key (NEW - Generated 2025-10-12)
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Other existing variables...
DATABASE_URL=your_database_url
CLERK_SECRET_KEY=your_clerk_key
# ... etc
```

**Save and close the file.**

#### Step 4.2: Verify `.env.local` is NOT Tracked

```bash
# This should show nothing (good!)
git status | grep .env.local

# If it shows up, remove it immediately
git rm --cached apps/web/.env.local
```

### Phase 5: Update Production Environment (10 minutes)

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/YOUR_USERNAME/galaxyco-ai-platform/settings/environment-variables
2. Find `OPENAI_API_KEY` → Click "Edit" → Paste new key → Save
3. Find `ANTHROPIC_API_KEY` → Click "Edit" → Paste new key → Save
4. **Redeploy** to apply changes:
   - Go to: Deployments tab
   - Click "..." on latest deployment → "Redeploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env rm OPENAI_API_KEY production
vercel env add OPENAI_API_KEY production
# Paste your new key when prompted

vercel env rm ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY production
# Paste your new key when prompted

# Redeploy
vercel --prod
```

### Phase 6: Test Everything (10 minutes)

#### Step 6.1: Test Local Development

```bash
cd /c/Users/Owner/workspace/galaxyco-ai-2.0

# Start the development server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3000/api/agents/health?mode=quick
```

Expected response:
```json
{
  "status": "healthy",
  "infrastructure": {
    "agent_count": 1,
    "ai_providers": {
      "openai": true,
      "anthropic": true
    }
  }
}
```

#### Step 6.2: Test Production

```bash
# Replace with your production URL
curl https://your-app.vercel.app/api/agents/health?mode=quick
```

#### Step 6.3: Test Agent Execution

```bash
# Test a simple agent
curl -X POST http://localhost:3000/api/agents/email-composer-v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "keyPoints": "Test email to verify API keys are working",
    "tone": "professional"
  }'
```

### Phase 7: Update Other Environments (If Applicable)

If you use other environments (staging, preview, etc.):

```bash
# Staging
vercel env rm OPENAI_API_KEY preview
vercel env add OPENAI_API_KEY preview
vercel env rm ANTHROPIC_API_KEY preview
vercel env add ANTHROPIC_API_KEY preview

# Development
vercel env rm OPENAI_API_KEY development
vercel env add OPENAI_API_KEY development
vercel env rm ANTHROPIC_API_KEY development
vercel env add ANTHROPIC_API_KEY development
```

## Post-Recovery Checklist

- [ ] Removed exposed files from git (`add-optional-env.sh`, `.env.local.backup`)
- [ ] Updated `.gitignore` with better protection
- [ ] Committed and pushed changes
- [ ] (Optional) Cleaned git history
- [ ] Generated new OpenAI API key
- [ ] Generated new Anthropic API key
- [ ] Updated local `.env.local`
- [ ] Updated Vercel production environment variables
- [ ] Tested local development
- [ ] Tested production deployment
- [ ] Updated staging/preview environments (if applicable)
- [ ] Documented new key generation dates
- [ ] Saved new keys in password manager

## Prevention Measures Going Forward

### 1. Never Commit These Files

```bash
# Always in .gitignore:
.env
.env.local
.env*.local
*.backup
**/add-optional-env*.sh
```

### 2. Use Environment Variable Checkers

Add to your pre-commit hook:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for potential API keys
if git diff --cached --name-only | xargs grep -E "sk-[a-zA-Z0-9]{32,}" 2>/dev/null; then
  echo "❌ Potential API key found in staged files!"
  echo "Please remove and use environment variables."
  exit 1
fi
```

### 3. Use Secret Scanning

Enable GitHub secret scanning:
1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/security_analysis
2. Enable "Secret scanning"
3. Enable "Push protection"

### 4. Use a Secret Manager

For production, consider:
- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Vercel Environment Variables** (already using)

### 5. Regular Key Rotation

Set a calendar reminder to rotate keys every 90 days:
- Next rotation: 2025-01-10
- Document in: `docs/security/key-rotation-schedule.md`

## Emergency Contacts

- **OpenAI Support:** https://help.openai.com/
- **Anthropic Support:** support@anthropic.com
- **Vercel Support:** https://vercel.com/support

## Incident Timeline

| Time | Action |
|------|--------|
| 2025-10-12 19:00 | Repository made public |
| 2025-10-12 19:05 | Keys auto-deactivated by providers |
| 2025-10-12 19:10 | Issue discovered |
| 2025-10-12 19:15 | Recovery scripts created |
| TBD | Git history cleaned |
| TBD | New keys generated |
| TBD | All environments updated |
| TBD | Testing completed |
| TBD | Incident closed |

## Lessons Learned

1. **Never use backup files** - They should be in `.gitignore`
2. **Never use shell scripts with keys** - Use environment variables only
3. **Always check git status** before committing
4. **Use pre-commit hooks** to catch sensitive data
5. **Enable push protection** on GitHub

## Related Documents

- [Security Best Practices](../security/best-practices.md)
- [Environment Setup Guide](../setup/ENVIRONMENT_SETUP.md)
- [Key Rotation Schedule](../security/key-rotation-schedule.md)

## Status Updates

**Update 1 (2025-10-12 19:15):**
- Recovery scripts created
- Waiting for user to execute Phase 1-7
- Old keys confirmed invalid

**Final Update:**
- [ ] All phases completed
- [ ] New keys working
- [ ] All tests passing
- [ ] Incident closed
