# CI/CD Guide - GalaxyCo.ai 2.0

**Last Updated**: 2025-10-17  
**Status**: ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflows](#workflows)
3. [GitHub Secrets](#github-secrets)
4. [Branch Strategy](#branch-strategy)
5. [Deployment Process](#deployment-process)
6. [Security Scanning](#security-scanning)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

Our CI/CD pipeline automates testing, security scanning, and deployment for the GalaxyCo.ai 2.0 platform.

### 🎯 Goals

- ✅ Automated quality checks on every PR
- ✅ Continuous security scanning
- ✅ Safe, predictable deployments
- ✅ Zero-downtime production releases
- ✅ Quick rollback capabilities

### 🏗️ Architecture

```
Pull Request → CI Workflow → Security Scan → Review → Merge
                                                        ↓
Main Branch → Pre-Deploy Checks → Staging → Production
                                            ↑           ↑
                                     Auto Deploy  Manual Approval
```

---

## Workflows

We have **3 main workflows**:

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main`, `staging`, `develop`
- Pull requests to `main`, `develop`

**Jobs:**

1. **Health Check**
   - TypeScript typecheck
   - ESLint
   - Prettier format check
   - Build verification

2. **Test Suite**
   - Unit tests
   - Integration tests

3. **Security Check**
   - Trivy vulnerability scanner
   - Upload results to GitHub Security tab

4. **Commit Convention Check**
   - Validates commit messages (Conventional Commits)
   - Only runs on PRs

5. **Smoke Tests** (main branch only)
   - Playwright E2E tests
   - Tests against staging environment

6. **Deploy** (main branch only)
   - Automatic deployment to production
   - Vercel deployment
   - Discord notifications

### 2. Security Scanning Workflow (`.github/workflows/security.yml`)

**Triggers:**

- Push to `main`, `staging`, `develop`
- Pull requests
- Daily at 2 AM UTC (scheduled)

**Jobs:**

1. **npm Audit**
   - Checks for known vulnerabilities
   - Fails on critical/high severity issues
   - Generates audit report

2. **Dependency Review**
   - GitHub native dependency scanning
   - Checks for license compliance
   - Comments on PRs

3. **CodeQL Analysis**
   - Static code analysis
   - JavaScript/TypeScript security patterns
   - Uploads to GitHub Security tab

4. **Secret Scanning**
   - TruffleHog for exposed secrets
   - Custom checks for API keys
   - Blocks PRs with exposed secrets

5. **OWASP Dependency Check**
   - Comprehensive dependency analysis
   - CVE database checks
   - Generates HTML reports

6. **License Compliance**
   - Checks for incompatible licenses
   - Blocks GPL/AGPL licenses

### 3. Deployment Workflow (`.github/workflows/deploy.yml`)

**Triggers:**

- Push to `main` (production)
- Push to `staging` (staging)
- Manual workflow dispatch

**Jobs:**

1. **Setup** - Determine deployment environment
2. **Pre-Deploy Checks** - Health checks before deployment
3. **Deploy Staging** - Automatic staging deployment
4. **Deploy Production** - Manual approval required
5. **Post-Deploy Monitoring** - Health monitoring for 2 minutes
6. **Notify** - Deployment status notifications

---

## GitHub Secrets

Required secrets in GitHub repository settings (`Settings → Secrets and variables → Actions`):

### Required Secrets

| Secret Name                         | Description                  | Where to Get                |
| ----------------------------------- | ---------------------------- | --------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string | Neon/Supabase dashboard     |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key             | Clerk dashboard             |
| `CLERK_SECRET_KEY`                  | Clerk secret key             | Clerk dashboard             |
| `VERCEL_TOKEN`                      | Vercel deployment token      | Vercel → Settings → Tokens  |
| `VERCEL_ORG_ID`                     | Vercel organization ID       | Vercel → Settings → General |
| `VERCEL_PROJECT_ID`                 | Vercel project ID            | Vercel → Project Settings   |

### Optional Secrets

| Secret Name           | Description                       | Required For       |
| --------------------- | --------------------------------- | ------------------ |
| `TURBO_TOKEN`         | Vercel Turbo cache token          | Faster builds      |
| `TEST_DATABASE_URL`   | Test database connection          | Integration tests  |
| `STAGING_URL`         | Staging environment URL           | Smoke tests        |
| `DISCORD_WEBHOOK_URL` | Discord webhook for notifications | Team notifications |

### How to Add Secrets

1. Go to GitHub repository
2. Navigate to `Settings → Secrets and variables → Actions`
3. Click `New repository secret`
4. Enter name and value
5. Click `Add secret`

---

## Branch Strategy

### Main Branches

```
main     → Production (galaxyco.ai)
staging  → Staging (staging.galaxyco.ai)
develop  → Development (local/preview)
```

### Feature Branches

```
feature/[name]  → New features
fix/[name]      → Bug fixes
hotfix/[name]   → Critical production fixes
refactor/[name] → Code refactoring
docs/[name]     → Documentation updates
```

### Branch Protection Rules

**Main Branch:**

- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ No force pushes
- ✅ No deletions

**Staging Branch:**

- ✅ Require status checks to pass
- ✅ Allow force pushes (for testing)

---

## Deployment Process

### Staging Deployment

**Automatic on push to `staging` branch**

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat(web): add new feature"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create PR to staging
# → CI runs automatically
# → Security scans run
# → Review and merge

# 5. After merge to staging
# → Automatic deployment to staging.galaxyco.ai
# → Smoke tests run
# → Ready for testing
```

### Production Deployment

**Requires manual approval**

```bash
# 1. Create PR from staging to main
# → CI runs full test suite
# → Security scans run
# → Code review required

# 2. Merge PR to main
# → Pre-deployment checks run
# → Deployment time restrictions apply
#    - No Friday after 2pm
#    - No weekends
#    - Business hours only

# 3. Manual approval required in GitHub
# → Go to Actions tab
# → Click on deployment workflow
# → Click "Review deployments"
# → Approve deployment

# 4. Production deployment starts
# → Deploy to galaxyco.ai
# → Smoke tests run
# → Health monitoring (2 minutes)
# → Automatic release tagging
# → Notifications sent
```

### Manual Deployment

**Use workflow dispatch for emergency deployments**

1. Go to GitHub `Actions` tab
2. Select `Deploy` workflow
3. Click `Run workflow`
4. Choose environment (staging/production)
5. Click `Run workflow`

---

## Security Scanning

### Daily Security Scans

Runs every day at 2 AM UTC:

- npm audit for new vulnerabilities
- CodeQL analysis for code patterns
- OWASP dependency checks
- License compliance checks

### Pull Request Scans

On every PR:

- Dependency review
- Secret scanning
- Code quality checks

### Security Reports

**Where to find reports:**

1. GitHub `Security` tab
2. `Actions` tab → Workflow run → Artifacts
3. Dependabot alerts (if enabled)

**Report Types:**

- npm audit report (JSON)
- CodeQL SARIF results
- OWASP dependency check (HTML)
- Trivy scan results

---

## Troubleshooting

### Common Issues

#### 1. Build Fails - TypeScript Errors

```bash
# Run locally to debug
pnpm turbo typecheck

# Fix errors and commit
git add .
git commit -m "fix(web): resolve TypeScript errors"
```

#### 2. Build Fails - Missing Environment Variables

**Error:** `Error: Missing environment variable`

**Solution:**

1. Check `.env.example` for required variables
2. Add missing secrets to GitHub repository settings
3. Re-run the workflow

#### 3. Deployment Time Restriction

**Error:** `No production deployments on Friday after 2pm`

**Solution:**

- Deploy earlier in the week
- Use staging environment for testing
- Wait until Monday for production deployment
- For emergencies, use manual workflow dispatch (requires approval)

#### 4. Security Scan Fails - High Severity Vulnerability

**Error:** `Critical or high severity vulnerabilities found`

**Solution:**

```bash
# Check audit report
pnpm audit

# Fix vulnerabilities
pnpm audit fix

# Or update specific package
pnpm update [package-name]

# Commit and push
git add pnpm-lock.yaml
git commit -m "fix(deps): update vulnerable dependencies"
```

#### 5. Smoke Tests Fail

**Error:** `Health check failed`

**Solution:**

1. Check application logs in Vercel
2. Verify environment variables are set
3. Check database connectivity
4. Review Sentry for runtime errors

### Debug Mode

Enable debug logging in workflows:

```yaml
# Add to workflow file
env:
  DEBUG: "*"
  ACTIONS_STEP_DEBUG: true
```

### Re-running Failed Workflows

1. Go to `Actions` tab
2. Click on failed workflow
3. Click `Re-run all jobs`
4. Or `Re-run failed jobs` to save time

---

## Best Practices

### 1. Commit Messages

Use Conventional Commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Scopes:**

- `web`: Web app
- `api`: API server
- `db`: Database
- `infra`: Infrastructure
- Agent names (e.g., `call-agent`, `email-agent`)

**Examples:**

```bash
feat(web): add user profile page
fix(api): resolve authentication issue
docs: update CI/CD guide
refactor(db): optimize query performance
```

### 2. Pull Requests

- Use the PR template
- Fill out all relevant sections
- Link related issues
- Add screenshots for UI changes
- Request review from team members
- Respond to review comments

### 3. Testing Before PR

```bash
# Run all checks locally
pnpm turbo typecheck
pnpm turbo lint
pnpm turbo build

# Fix formatting
pnpm prettier --write .

# Run tests (if available)
pnpm turbo test
```

### 4. Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Run security scans locally: `pnpm audit`
- Review dependency updates carefully
- Keep dependencies up to date

### 5. Deployment Strategy

**Staging First:**

1. Always deploy to staging first
2. Test thoroughly in staging
3. Monitor for 24 hours
4. Then promote to production

**Feature Flags:**

- Use feature flags for large changes
- Enable gradually for users
- Quick rollback if issues arise

**Database Migrations:**

- Test migrations in staging
- Have rollback plan ready
- Run migrations during low-traffic hours
- Monitor application health

---

## Monitoring & Alerts

### Application Health

**Endpoints:**

- Production: `https://galaxyco.ai/api/health`
- Staging: `https://staging.galaxyco.ai/api/health`

**Monitoring Tools:**

- Sentry for error tracking
- Vercel Analytics for performance
- GitHub Actions for CI/CD status

### Alert Channels

- GitHub Actions notifications
- Discord webhooks (if configured)
- Sentry alerts for critical errors
- Email notifications for failed deployments

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---

## Quick Reference

### Useful Commands

```bash
# Check CI locally
pnpm turbo typecheck lint build

# Run security audit
pnpm audit

# Fix security issues
pnpm audit fix

# Update dependencies
pnpm update --latest

# Deploy to staging (after merge)
git push origin staging

# Deploy to production (after merge to main)
# → Requires manual approval in GitHub Actions
```

### Workflow URLs

- CI/CD Status: `https://github.com/[org]/[repo]/actions`
- Security Alerts: `https://github.com/[org]/[repo]/security`
- Deployments: `https://github.com/[org]/[repo]/deployments`

---

**For questions or issues, contact the DevOps team or create an issue in GitHub.**

**Last Updated**: 2025-10-17  
**Maintained By**: Engineering Team  
**Review Schedule**: Quarterly
