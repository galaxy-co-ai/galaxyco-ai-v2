# Deployment Runbook

Safe deployment procedures for GalaxyCo.ai

## 🎯 Pre-Deployment Checklist

Before deploying to production, **always** complete this checklist:

- [ ] All tests pass locally
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Database migrations tested and documented
- [ ] Environment variables verified in Vercel
- [ ] No console errors in staging environment
- [ ] Feature flags set appropriately
- [ ] Rollback plan documented
- [ ] Team notified in Discord #deployments

**NEVER deploy:**
- On Fridays after 2pm
- Before major holidays
- If you're not available for 2 hours post-deployment

---

## 🚀 Standard Deployment Flow

### 1. Prepare Branch

```bash
# Ensure you're on a clean branch
git status

# Pull latest main
git checkout main
git pull origin main

# Create feature branch (if not done)
git checkout -b feat/your-feature

# Commit your changes using conventional commits
git add .
git commit -m "feat(scope): your feature description"
```

### 2. Push and Create PR

```bash
# Push to GitHub
git push origin feat/your-feature

# Open PR in GitHub
# Add description, screenshots, testing notes
```

### 3. Vercel Preview Deploy

- Vercel automatically creates preview deploy from PR
- Check preview URL in PR comments
- Test all changed functionality in preview
- Check for console errors (F12)

### 4. Merge to Main

```bash
# After PR approval, merge via GitHub UI
# Or merge locally:
git checkout main
git merge feat/your-feature
git push origin main
```

### 5. Production Deploy

- Vercel automatically deploys main branch
- Monitor deploy progress in [Vercel Dashboard](https://vercel.com/galaxyco-ai/galaxyco-ai-platform)
- Check production URL after deploy completes

### 6. Post-Deploy Verification

```bash
# Check production is live
curl -I https://galaxyco-ai.vercel.app

# Monitor logs in Vercel dashboard
# Test critical user flows:
# - Sign up / Sign in
# - Create workspace
# - Agent creation
```

---

## 🗄️ Database Migrations

### Creating a Migration

```bash
cd packages/database

# Create migration
npm run db:migration:create -- migration_name

# Review generated SQL in drizzle/migrations/
# Edit if needed

# Test in dev
npm run db:migrate
```

### Applying to Production

1. **Test locally first**:
   ```bash
   # Apply to local DB
   npm run db:migrate
   
   # Verify in Drizzle Studio
   npm run db:studio
   ```

2. **Document the migration**:
   - What tables/columns changed?
   - Any data transformations?
   - Rollback plan if needed?

3. **Apply to production**:
   - Migrations run automatically on Vercel deploy
   - Monitor logs during deploy

4. **Verify**:
   - Check Neon console for new schema
   - Test affected features in production

### Rolling Back a Migration

```bash
# If migration fails, you need to manually rollback:
# 1. Connect to Neon database
# 2. Run rollback SQL (keep these in migration comments!)
# 3. Redeploy previous version
```

---

## 🔐 Environment Variables

### Adding New Env Var

1. **Add to `.env.example`** (without values):
   ```
   NEW_API_KEY=
   ```

2. **Add to Vercel**:
   ```bash
   # Option 1: Via Vercel Dashboard
   # Settings > Environment Variables
   
   # Option 2: Via CLI
   vercel env add NEW_API_KEY
   ```

3. **Update documentation**:
   - Add to `docs/knowledge-base/environment-variables.md`

### Updating Env Var

1. Update in Vercel dashboard
2. Trigger new deploy (Vercel doesn't auto-redeploy on env change)
3. Verify new value is being used

---

## 🚨 Emergency Rollback

If production is broken and you need to rollback immediately:

### Option 1: Vercel Dashboard (Fastest)

1. Go to [Vercel Deployments](https://vercel.com/galaxyco-ai/galaxyco-ai-platform/deployments)
2. Find last working deployment
3. Click "..." menu → "Promote to Production"

### Option 2: Git Revert

```bash
# Find the bad commit
git log --oneline

# Revert it
git revert <commit-hash>

# Push (triggers new deploy)
git push origin main
```

### Option 3: Redeploy Previous

```bash
# Reset to previous commit
git reset --hard HEAD~1

# Force push (triggers deploy)
git push -f origin main
```

---

## 📊 Monitoring Post-Deploy

### Things to Monitor

1. **Vercel Dashboard**:
   - Build logs
   - Function logs
   - Performance metrics

2. **Neon Dashboard**:
   - Query performance
   - Connection pool

3. **User Reports**:
   - Discord #support channel
   - Email notifications

4. **Browser Console**:
   - Test critical flows yourself
   - Check for JS errors

### Success Criteria

Deploy is successful when:
- ✅ Build completed without errors
- ✅ No TypeScript errors in logs
- ✅ Critical user flows work (sign up, create workspace, run agent)
- ✅ No spike in error logs
- ✅ Database queries performing normally
- ✅ No user reports of issues after 30 minutes

---

## 🔍 Common Deploy Issues

### Issue: Build fails on Vercel but works locally

**Cause**: Environment differences

**Solution**:
1. Check Node version matches (check `package.json` engine field)
2. Verify all env vars are set in Vercel
3. Check build logs for specific error

### Issue: Database connection fails in production

**Cause**: Wrong DATABASE_URL or IP whitelist

**Solution**:
1. Verify DATABASE_URL in Vercel env vars
2. Check Neon IP whitelist allows Vercel IPs
3. Test connection in Vercel function logs

### Issue: Clerk auth fails in production

**Cause**: Wrong domain or redirect URLs

**Solution**:
1. Check Clerk dashboard domain settings
2. Verify NEXT_PUBLIC_CLERK_* env vars
3. Check allowed redirect URLs in Clerk

---

## 📝 Deployment Checklist Template

Copy this for each major deploy:

```markdown
## Deploy: [Feature Name] - [Date]

### Pre-Deploy
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Staging verified
- [ ] Team notified

### Deploy Steps
- [ ] PR merged to main
- [ ] Vercel build succeeded
- [ ] Production tested

### Post-Deploy
- [ ] Critical flows verified
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Users notified (if needed)

### Rollback Plan
If issues occur: [describe rollback steps]
```

---

**Remember**: Slow is smooth, smooth is fast. Don't rush deploys! 🚀
