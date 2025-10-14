# Production Deployment Checklist

This document outlines the required steps and checks before deploying to production.

## 🚨 Deployment Restrictions

- **⛔ Never deploy on Fridays after 2pm** (Rule enforced in CI/CD)
- **⛔ Never deploy before major holidays** 
- **⛔ Require approval from 2 team members minimum**
- **⛔ No deployments without passing smoke tests**

## 📋 Pre-Deploy Checklist (Required)

### Code Quality
- [ ] All CI/CD health checks pass (TypeScript, ESLint, Prettier)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] Code formatted with Prettier (`pnpm prettier --check .`)
- [ ] All unit tests pass (`pnpm test`)
- [ ] All integration tests pass (`pnpm test:integration`)

### Security
- [ ] Security scan passed (Trivy in CI)
- [ ] No exposed secrets in code
- [ ] Multi-tenancy checks pass
- [ ] No cross-tenant data access in new code
- [ ] Sensitive data properly encrypted

### Database
- [ ] Database migrations tested on dev environment
- [ ] Database migrations applied to staging successfully
- [ ] Migrations include rollback plan in comments
- [ ] No dangerous operations (DROP, TRUNCATE, DELETE FROM) without approval
- [ ] Migration verified with test queries

### Testing
- [ ] All smoke tests pass on staging (`pnpm test:smoke`)
- [ ] Critical user flows verified manually
- [ ] Agent execution tested in staging
- [ ] Authentication flows tested
- [ ] API endpoints returning expected responses

### Monitoring
- [ ] Sentry shows no new errors in staging (last 24h)
- [ ] Agent performance metrics acceptable:
  - Success rate > 95%
  - Average duration < 30 seconds
- [ ] Database connection health verified
- [ ] Redis connection health verified

### Documentation
- [ ] Rollback plan documented in PR description
- [ ] CHANGELOG.md updated
- [ ] Breaking changes documented
- [ ] Team notified in Discord #deployments

## 🚀 Deployment Process

### 1. Pre-Deployment (15 minutes before)
```bash
# Verify all checks pass
pnpm health-check

# Run smoke tests on staging
pnpm test:smoke

# Verify no unresolved Sentry errors
# Check: https://sentry.io/organizations/galaxyco/issues/

# Notify team
# Post in Discord #deployments
```

### 2. Deployment Execution
```bash
# Deploy via CI/CD (automatic on merge to main)
git push origin main

# OR manual deploy
cd apps/web
vercel --prod
```

### 3. Post-Deployment Verification (First 30 minutes)

#### Immediate Checks (First 5 minutes)
- [ ] Production health endpoint responds: `curl https://galaxyco-ai-20.vercel.app/api/health`
- [ ] Database health check passes: `curl https://galaxyco-ai-20.vercel.app/api/health/db`
- [ ] Homepage loads successfully
- [ ] Authentication works (test sign-in)

#### Extended Monitoring (Next 25 minutes)
- [ ] Monitor Sentry for new errors (0 critical errors acceptable)
- [ ] Check agent execution success rate (should match staging)
- [ ] Verify key user flows:
  - Sign up new user
  - Create new agent
  - Execute agent
  - View results
- [ ] Check Discord for user reports
- [ ] Monitor CloudWatch/Vercel logs for errors

#### Performance Checks
- [ ] Page load times < 5 seconds
- [ ] API response times < 2 seconds
- [ ] No memory leaks (check Vercel metrics)
- [ ] Database query performance acceptable

### 4. Extended Monitoring (Next 2 hours)
- [ ] Continue monitoring Sentry
- [ ] Check agent execution logs
- [ ] Verify no spike in error rates
- [ ] Monitor user feedback in Discord

## 🔄 Rollback Procedures

### When to Rollback
- Critical errors in production (5xx errors)
- Agent execution failures > 5%
- Database connection issues
- Authentication failures
- Cross-tenant data access detected

### Rollback Steps (Emergency)

#### Quick Rollback (Vercel)
```bash
# Get previous deployment
vercel ls --prod

# Promote previous deployment
vercel promote <deployment-url> --prod

# Notify team
# Post in Discord #deployments: "🔄 Production rolled back"
```

#### Full Rollback (Database + Code)
```bash
# 1. Rollback code
vercel promote <previous-deployment> --prod

# 2. Rollback database migration (if needed)
psql $DATABASE_URL -f packages/database/migrations/rollback_XXXX.sql

# 3. Verify rollback
curl https://galaxyco-ai-20.vercel.app/api/health

# 4. Document incident
# Create file: docs/incidents/YYYYMMDD_rollback_reason.md
```

### Post-Rollback
- [ ] Document what went wrong
- [ ] Create hotfix PR
- [ ] Test hotfix in staging
- [ ] Schedule new deployment

## 📊 Monitoring & Alerts

### Sentry Monitoring
- **Location**: https://sentry.io/organizations/galaxyco/
- **What to monitor**:
  - Error count (should be < 10/hour)
  - Error types (no security incidents)
  - Affected users (< 1% of total)

### Vercel Metrics
- **Location**: https://vercel.com/galaxyco-ai/dashboard
- **What to monitor**:
  - Build status
  - Deployment time
  - Function invocations
  - Edge network performance

### Database Metrics
- **Location**: Neon Dashboard
- **What to monitor**:
  - Connection count
  - Query performance
  - Storage usage
  - Replication lag

## 📝 Deployment Log Template

Create a new entry in `DEPLOYMENT_LOG.md`:

```markdown
## Deployment YYYY-MM-DD HH:MM

**Deployed by**: [Name]  
**PR**: #[number]  
**Commit**: [hash]

### Changes
- [List main changes]

### Pre-Deploy Checks
- ✅ All tests passed
- ✅ Smoke tests passed on staging
- ✅ No Sentry errors
- ✅ Team notified

### Post-Deploy Verification
- ✅ Health checks pass
- ✅ Auth works
- ✅ No errors in first 30 minutes
- ✅ Performance metrics normal

### Issues
- None / [List any issues]

### Rollback
- N/A / [If rolled back, explain why]
```

## 🎯 Success Criteria

A deployment is considered successful when:
- ✅ All pre-deploy checks pass
- ✅ No critical errors in first 2 hours
- ✅ Agent success rate > 95%
- ✅ Page load times < 5 seconds
- ✅ No user-reported issues
- ✅ No rollback required

## 🆘 Emergency Contacts

- **On-call engineer**: [Contact info]
- **Database admin**: [Contact info]
- **Discord**: #engineering, #incidents

---

**Last updated**: October 12, 2025  
**Next review**: After each major incident