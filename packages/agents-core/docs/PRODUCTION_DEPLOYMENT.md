# GalaxyCo.ai Production Deployment Guide

**Version:** 1.0  
**Last Updated:** October 11, 2024  
**Platform:** Vercel (galaxyco-ai-platform)

---

## 🎯 Pre-Deployment Checklist

### 1. Code Quality

- [ ] All tests passing (60+ tests expected)
  ```bash
  cd packages/agents-core
  pnpm test
  ```
- [ ] TypeScript compilation successful
  ```bash
  pnpm typecheck
  ```
- [ ] Linting passes with no errors
  ```bash
  pnpm lint
  ```
- [ ] No console.log or debug statements in code
- [ ] All TODOs addressed or documented

### 2. Security

- [ ] All 4 guardrails enabled on production agents
- [ ] Environment variables set (no hardcoded secrets)
- [ ] Multi-tenant isolation verified (Rule 4kR94Z3XhqK4C54vwDDwnq)
- [ ] Database queries use `withTenant()` helper
- [ ] Input validation on all API endpoints
- [ ] Rate limiting configured
- [ ] CORS settings reviewed
- [ ] API keys rotated (if needed)

### 3. Database

- [ ] Migrations applied to staging
  ```bash
  pnpm db:migrate
  ```
- [ ] Migration rollback tested
- [ ] Backup verified (last 24 hours)
- [ ] Indexes optimized for production queries
- [ ] Row-level security policies active

### 4. Monitoring

- [ ] Sentry configured for error tracking
- [ ] Vercel analytics enabled
- [ ] Custom metrics configured (agent execution times, costs)
- [ ] Alert thresholds set
  - Guardrail failures > 10/hour
  - Error rate > 5%
  - Response time > 5s (p95)
  - Cost > $50/day

### 5. Performance

- [ ] Load testing completed (100 concurrent users)
- [ ] Database query performance verified (< 100ms)
- [ ] Agent execution tested with real workloads
- [ ] CDN caching configured (static assets)
- [ ] Image optimization enabled

---

## 🚀 Deployment Steps

### Step 1: Staging Deployment

**Purpose:** Validate changes in production-like environment

```bash
# 1. Ensure you're on the correct branch
git checkout feature/openai-architecture

# 2. Merge latest from main (if needed)
git pull origin main
git merge main

# 3. Push to staging branch
git push origin feature/openai-architecture:staging

# 4. Wait for Vercel deployment
# Visit: https://vercel.com/galaxyco-ai/galaxyco-ai-platform/deployments
```

**Staging URL:** `https://galaxyco-ai-20-staging.vercel.app`

**Smoke Tests on Staging:**

1. **Health Check**

   ```bash
   curl https://galaxyco-ai-20-staging.vercel.app/api/health
   # Expected: {"status": "ok", "version": "..."}
   ```

2. **Agent Execution**
   - Create test agent via UI
   - Execute with sample input
   - Verify guardrails active
   - Check Sentry for errors

3. **Database Connectivity**
   - Test agent creation
   - Verify multi-tenant isolation
   - Check execution logs

4. **Cost Tracking**
   - Run agent with high token usage
   - Verify cost limits enforced
   - Check metadata accuracy

**Hold Period:** Minimum 2 hours on staging before production

---

### Step 2: Production Deployment

**⚠️ Production Deployment Rules (Rule 3dAXL7TvCdKH5jA9lAD3Ij):**

- **Never deploy on Fridays after 2pm**
- **Never deploy before major holidays**
- **Always have rollback plan ready**

**Deployment Process:**

```bash
# 1. Create deployment notification
# Post in Discord #deployments channel:
# "🚀 Deploying agents-core v1.x to production
#  - Guardrail integration
#  - 60+ new tests
#  - Multi-tenant security
#  ETA: 10 minutes"

# 2. Merge to main
git checkout main
git merge feature/openai-architecture

# 3. Tag the release
git tag -a v1.0.0 -m "Production-ready agent platform with guardrails"
git push origin v1.0.0

# 4. Deploy to production
git push origin main

# 5. Monitor deployment in Vercel
# Visit: https://vercel.com/galaxyco-ai/galaxyco-ai-platform/deployments
```

**Production URL:** `https://galaxyco-ai-20.vercel.app`

---

### Step 3: Post-Deployment Validation

**Immediate Checks (First 5 minutes):**

1. **Health Endpoint**

   ```bash
   curl https://galaxyco-ai-20.vercel.app/api/health
   ```

2. **Sentry Dashboard**
   - Check for new errors
   - Verify error rate < 1%
   - Review recent events

3. **Database Connectivity**
   - Test agent creation
   - Verify executions working
   - Check query performance

4. **Guardrails Active**
   - Test prompt injection (should block)
   - Verify cost limits enforced
   - Check output redaction working

**Extended Monitoring (First Hour):**

- Response times (p50, p95, p99)
- Error rates by endpoint
- Agent execution success rate
- Database query performance
- Cost per execution

**Success Criteria:**

- ✅ Error rate < 2%
- ✅ p95 response time < 3s
- ✅ Agent execution success rate > 95%
- ✅ No critical Sentry alerts
- ✅ Database queries < 100ms

---

## 🔄 Rollback Procedures

### When to Rollback

Immediate rollback if:

- Error rate > 10%
- Critical functionality broken
- Data integrity issues
- Security vulnerability discovered
- p95 response time > 10s

### Quick Rollback (Vercel)

```bash
# 1. Go to Vercel dashboard
# 2. Find previous successful deployment
# 3. Click "Promote to Production"
# 4. Confirm rollback

# OR via CLI:
vercel rollback
```

### Full Rollback (Git)

```bash
# 1. Revert the merge commit
git revert <merge-commit-hash>

# 2. Push revert
git push origin main

# 3. Verify deployment triggered
# Check Vercel dashboard

# 4. Notify team
# Post in Discord #deployments
```

### Database Rollback

**⚠️ CAUTION: Only if migrations applied**

```bash
# 1. Identify last safe migration
pnpm db:migration:list

# 2. Rollback to specific migration
pnpm db:migration:rollback --to <migration-id>

# 3. Verify schema state
pnpm db:migration:status
```

---

## 📊 Monitoring & Alerts

### Sentry Configuration

```typescript
// apps/api/src/main.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  beforeSend(event) {
    // Redact sensitive data
    if (event.request?.data) {
      event.request.data = '[REDACTED]';
    }
    return event;
  },
});
```

### Custom Metrics

**Agent Execution Metrics:**

```typescript
// Track execution time
metrics.timing('agent.execution.duration', durationMs, {
  agentType: agent.type,
  success: result.success,
});

// Track cost
metrics.gauge('agent.execution.cost', result.metadata.costUsd, {
  model: agent.model,
});

// Track guardrail failures
metrics.increment('guardrail.failure', {
  guardrail: guardrailName,
  workspaceId: context.workspaceId,
});
```

### Alert Configuration

**Critical Alerts (PagerDuty):**

| Metric        | Threshold             | Action                      |
| ------------- | --------------------- | --------------------------- |
| Error Rate    | > 10% for 5 min       | Page on-call                |
| Response Time | p95 > 10s for 5 min   | Page on-call                |
| Database      | Connection errors > 5 | Page on-call                |
| Cost          | > $100/hour           | Page on-call + auto-disable |

**Warning Alerts (Slack):**

| Metric             | Threshold           | Action                 |
| ------------------ | ------------------- | ---------------------- |
| Guardrail Failures | > 20/hour           | Notify #security       |
| Cost Limits Hit    | > 10/hour           | Notify #engineering    |
| Agent Failures     | > 10% for workspace | Notify workspace admin |

---

## 🔐 Environment Variables

### Required Variables

```bash
# Production .env
NODE_ENV=production
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-prod-...
CLERK_SECRET_KEY=sk_live_...

# Monitoring
SENTRY_DSN=https://...
VERCEL_ANALYTICS_ID=...

# Security
CORS_ORIGIN=https://galaxyco-ai-20.vercel.app
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

### Setting Environment Variables (Vercel)

```bash
# Via CLI
vercel env add OPENAI_API_KEY production

# Or via dashboard:
# 1. Go to project settings
# 2. Navigate to "Environment Variables"
# 3. Add/update variables
# 4. Redeploy to apply changes
```

**Rule: Never print environment variable values** (Rule 7Em0KwTXJn2kF4HEBRvjO2)

---

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_agents_workspace ON agents(workspace_id);
CREATE INDEX idx_executions_agent ON agent_executions(agent_id);
CREATE INDEX idx_executions_created ON agent_executions(created_at DESC);

-- Enable query plan caching
ALTER SYSTEM SET plan_cache_mode = 'force_generic_plan';
```

### Caching Strategy

```typescript
// Cache agent configurations (5 min TTL)
const agent = await cache.get(
  `agent:${agentId}`,
  async () => {
    return await db.query.agents.findFirst({ where: eq(agents.id, agentId) });
  },
  { ttl: 300 },
);

// Cache tool definitions (1 hour TTL)
const tools = await cache.get(
  'tools:all',
  async () => {
    return await loadAllTools();
  },
  { ttl: 3600 },
);
```

### Rate Limiting

```typescript
// Apply rate limits by workspace
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute per workspace
    keyGenerator: (req) => req.auth.workspaceId,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: 60,
      });
    },
  }),
);
```

---

## 🧪 Testing in Production

### Canary Deployment

**Strategy:** Roll out to 10% of traffic first

```typescript
// Feature flag for new guardrail logic
if (featureFlags.isEnabled('enhanced-guardrails', workspaceId)) {
  // Use new guardrail implementation
} else {
  // Use existing implementation
}
```

### A/B Testing

Test different guardrail configurations:

```typescript
const guardrailConfig = abTest('guardrail-strictness', workspaceId, {
  control: { mode: 'moderate' },
  variant: { mode: 'strict' },
});
```

### Shadow Mode

Test new features without impacting users:

```typescript
// Run new guardrail in shadow mode (don't block, just log)
const shadowResult = await newGuardrail.check(input);
if (!shadowResult.passed) {
  logger.info('Shadow guardrail would have blocked', {
    guardrail: 'input-safety-v2',
    reason: shadowResult.reason,
  });
}
```

---

## 📋 Maintenance Windows

### Scheduled Maintenance

**Best Times:**

- Sundays 2-4 AM UTC (lowest traffic)
- Announce 48 hours in advance

**Process:**

1. **Pre-maintenance (T-24h)**
   - Post maintenance notice on status page
   - Email affected customers
   - Prepare rollback plan

2. **During Maintenance**
   - Enable maintenance mode
   - Apply changes
   - Run smoke tests
   - Disable maintenance mode

3. **Post-Maintenance**
   - Monitor for 2 hours
   - Update status page
   - Post completion notice

---

## 🆘 Emergency Procedures

### Critical Bug in Production

1. **Immediate Action**
   - Assess severity (P0 = data loss, P1 = major feature broken)
   - Page on-call engineer
   - Post in #incidents channel

2. **Mitigation**
   - Quick fix + hotfix deployment, OR
   - Rollback to previous version, OR
   - Feature flag disable

3. **Communication**
   - Update status page
   - Notify affected customers
   - Post incident report (within 24h)

### Data Breach Response

1. **Contain** - Disable affected systems
2. **Assess** - Determine scope of breach
3. **Notify** - Legal team, affected users
4. **Remediate** - Fix vulnerability
5. **Document** - Post-mortem report

---

## 📝 Deployment Checklist (Copy-Paste)

```
## Pre-Deployment
- [ ] All tests passing (60+ tests)
- [ ] Staging deployment successful
- [ ] Smoke tests passed on staging
- [ ] 2+ hour soak time on staging
- [ ] Sentry reviewed (no new errors)
- [ ] Database migrations applied
- [ ] Team notified in #deployments

## Deployment
- [ ] Created git tag (v1.x.x)
- [ ] Merged to main
- [ ] Vercel deployment triggered
- [ ] Deployment successful in Vercel dashboard

## Post-Deployment
- [ ] Health check passed
- [ ] Sentry dashboard reviewed (no errors)
- [ ] Agent execution tested
- [ ] Guardrails verified active
- [ ] Performance metrics normal
- [ ] Team notified of completion

## Rollback Ready
- [ ] Previous deployment ID noted
- [ ] Rollback procedure reviewed
- [ ] Database rollback plan ready (if needed)
```

---

## 📞 Support Contacts

**On-Call Engineer:** PagerDuty rotation  
**DevOps Lead:** @devops-lead (Discord)  
**Security Team:** security@galaxyco.ai  
**Status Page:** https://status.galaxyco.ai

---

**Last Updated:** October 11, 2024  
**Next Review:** November 11, 2024  
**Maintained By:** GalaxyCo.ai Platform Team
