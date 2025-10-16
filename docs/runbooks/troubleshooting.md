# Troubleshooting Runbook

Quick reference for common issues and their solutions.

## 🚨 Emergency: Server Won't Start

### Symptoms

- `pnpm dev` fails or exits immediately
- Port already in use errors
- Module not found errors

### Solution Steps

1. **Check if port is in use**:

   ```bash
   netstat -ano | grep ":3000"
   # Kill process if needed (Windows):
   # taskkill /PID [PID_NUMBER] /F
   ```

2. **Clear any lock files**:

   ```bash
   rm -rf .next node_modules/.cache
   ```

3. **Reinstall dependencies**:

   ```bash
   pnpm install
   ```

4. **Run health check**:
   ```bash
   ./scripts/health-check.sh
   ```

---

## 🗄️ Database Issues

### Issue: "User not found" during onboarding

**Root Cause**: Clerk webhook hasn't created user yet

**Solution**: Code now has fallback - refresh and try again

### Issue: "Duplicate key violation"

**Root Cause**: Previous failed attempt left orphaned data

**Solution**: Run cleanup script

```bash
# Edit slug in script first
node scripts/cleanup-workspace.mjs
```

**Prevention**: See incident report: `docs/incidents/2025-01-10-onboarding-duplicate-workspace-slug.md`

### Issue: Can't connect to database

1. **Check DATABASE_URL**:

   ```bash
   grep DATABASE_URL apps/web/.env.local
   ```

2. **Test connection**:

   ```bash
   cd packages/database
   npx drizzle-kit studio
   # Should open at http://localhost:4983
   ```

3. **Check Neon status**: Visit [Neon Console](https://console.neon.tech)

---

## 🔐 Authentication Issues

### Issue: Clerk redirects fail

1. Check environment variables:

   ```bash
   grep CLERK apps/web/.env.local
   ```

2. Verify keys match Clerk dashboard

3. Check Clerk webhook is set up (if using)

---

## 📦 Build/TypeScript Errors

### Issue: TypeScript compilation fails

1. **Run type check**:

   ```bash
   cd apps/web
   pnpm typecheck
   ```

2. **Clear and rebuild**:

   ```bash
   rm -rf .next
   pnpm build
   ```

3. **Check for circular dependencies**:
   Look for import cycles in error messages

---

## 🎨 UI/CSS Issues

### Issue: Styles not applying

1. **Check Tailwind config**: Verify file paths in `tailwind.config.js`

2. **Restart dev server**: Tailwind watches files, sometimes needs restart

3. **Check for CSS conflicts**: Use browser DevTools

---

## 🚀 Deployment Issues

### Issue: Vercel build fails

1. **Check build logs** in Vercel dashboard

2. **Test build locally**:

   ```bash
   cd apps/web
   pnpm build
   ```

3. **Verify environment variables** are set in Vercel

### Issue: Database migrations not applied

1. **Run migrations**:

   ```bash
   cd packages/database
   npx drizzle-kit push
   ```

2. **Verify in Drizzle Studio**:
   ```bash
   npx drizzle-kit studio
   ```

---

## 🔧 Development Environment

### Issue: MCP servers not working

1. **Check configuration**: `~/.config/Code/User/mcp.json` (or Windows equivalent)

2. **Restart VS Code/Windsurf**

3. **Check logs** in AI assistant

### Issue: Scripts not executable

```bash
chmod +x scripts/*.sh
```

---

## 📊 Debugging Steps (General)

When something breaks, follow this order:

1. ✅ **Check the logs first**
   - Backend: `tail -100 /tmp/nextjs-dev.log`
   - Frontend: Browser console (F12)

2. ✅ **Run health check**

   ```bash
   ./scripts/health-check.sh
   ```

3. ✅ **Search incidents**

   ```bash
   grep -r "your error message" docs/incidents/
   ```

4. ✅ **Check recent changes**

   ```bash
   git log --oneline -10
   git diff HEAD~1
   ```

5. ✅ **Restart everything**
   - Kill dev server
   - Clear caches (`.next`, `node_modules/.cache`)
   - Restart dev server

---

## 🆘 Still Stuck?

1. **Document the issue** while it's fresh (for future you)
2. **Create an incident report** using template: `docs/incidents/TEMPLATE.md`
3. **Search similar issues** in GitHub issues/Stack Overflow
4. **Ask for help** with specific error messages and logs

---

**Remember**: Every problem you solve makes the next one easier! 🚀
