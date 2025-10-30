# 🚀 GalaxyCo.ai 2.0 - Deployment Execution Checklist

**Created**: 2025-10-30  
**Status**: Ready for Execution  
**Based On**: SESSION_HANDOFF_2025-10-30.md  
**Current State**: API deployed ✅ | Web deployed ✅ | Agents pending 🟡

---

## 📊 Current System Status

### ✅ What's Working
- **API Service**: Live at https://api.galaxyco.ai/health
  - 2/2 Fargate tasks healthy
  - Zero errors in logs
  - Health check returning 200 OK
- **Web App**: Deployed on Vercel
  - Preview: https://galaxyco-ai-20-git-deployment-ready-daltons-projects-7f1e31bb.vercel.app
  - Build: Passing with zero TypeScript errors
- **Database**: Neon PostgreSQL connected with 10s timeout
- **Infrastructure**: VPC, subnets, ALB, ECS cluster all operational

### 🟡 What's Pending
- Python Agents Service not deployed
- SSL certificate not configured (HTTP only)
- Web app may point to localhost (needs verification)
- CloudWatch alarms not configured
- Database migrations status unknown

---

## 🎯 Execution Plan Overview

**Total Estimated Time**: 3-4 hours  
**Priority Breakdown**:
- 🔥 **HIGH PRIORITY** (Must do): 1.5 hours
- 🟡 **MEDIUM PRIORITY** (Should do): 1.5 hours  
- 🟢 **LOW PRIORITY** (Nice to have): 1 hour

---

## 🔥 HIGH PRIORITY TASKS (Critical Path)

### ✅ TASK 1: Deploy Python Agents Service
**Estimated Time**: 45-60 minutes  
**Impact**: Complete platform functionality  
**Status**: Not started

#### Subtasks
- [ ] 1.1 Build Docker image locally for testing
  ```bash
  cd /c/Users/Owner/workspace/galaxyco-ai-2.0
  docker build -t ghcr.io/galaxy-co-ai/galaxyco-agents:latest -f services/agents/Dockerfile .
  ```
  - **Success Criteria**: Build completes without errors
  - **Output**: Docker image SHA256 hash

- [ ] 1.2 Test Docker image locally
  ```bash
  docker run -p 5001:5001 \
    -e OPENAI_API_KEY="$OPENAI_API_KEY" \
    -e ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
    -e DATABASE_URL="$DATABASE_URL" \
    ghcr.io/galaxy-co-ai/galaxyco-agents:latest
  ```
  - **Success Criteria**: Container starts without errors
  - **Verification**: `curl http://localhost:5001/health` returns 200 OK

- [ ] 1.3 Push image to GitHub Container Registry
  ```bash
  docker push ghcr.io/galaxy-co-ai/galaxyco-agents:latest
  ```
  - **Success Criteria**: Push completes successfully
  - **Output**: Full image SHA256 for Terraform

- [ ] 1.4 Update Terraform with image SHA
  - **File**: `infra/terraform/envs/prod/main.tf`
  - **Line**: 494 (agents task definition image)
  - **Action**: Replace `:latest` with `@sha256:<hash>`
  - **Verification**: Git diff shows only image SHA changed

- [ ] 1.5 Apply Terraform changes
  ```bash
  cd infra/terraform/envs/prod
  terraform plan -out=tfplan
  terraform apply tfplan
  ```
  - **Success Criteria**: Apply completes with agents service created
  - **Expected Changes**: 1-2 resources updated

- [ ] 1.6 Verify agents service health
  ```bash
  # Check service status (via AWS Console or CLI alternative)
  curl http://api.galaxyco.ai:5001/health
  ```
  - **Success Criteria**: 
    - 2/2 tasks running
    - Health endpoint returns 200 OK
    - No errors in CloudWatch logs `/ecs/galaxyco-production-agents`

**Completion Criteria**:
- ✅ Agents service shows ACTIVE status in ECS
- ✅ 2/2 targets healthy in ALB target group
- ✅ Health endpoint accessible and returning correct JSON
- ✅ CloudWatch logs show successful startup
- ✅ No container restarts

---

### ✅ TASK 2: Configure SSL Certificate for API
**Estimated Time**: 30 minutes  
**Impact**: Enable secure HTTPS connections  
**Status**: Listener disabled (count = 0)

#### Subtasks
- [ ] 2.1 Create ACM certificate for api.galaxyco.ai
  - **Method**: AWS Console → Certificate Manager → Request certificate
  - **Domain**: `api.galaxyco.ai`
  - **Validation**: DNS validation
  - **Success Criteria**: Certificate request created

- [ ] 2.2 Add DNS validation records
  - **DNS Provider**: (Check current DNS setup - likely Route53 or domain registrar)
  - **Action**: Add CNAME records provided by ACM
  - **Success Criteria**: Validation status shows "Success"
  - **Wait Time**: 5-30 minutes for propagation

- [ ] 2.3 Update Terraform HTTPS listener
  - **File**: `infra/terraform/envs/prod/main.tf`
  - **Line 380**: Change `count = 0` to `count = 1`
  - **Line 385**: Add certificate ARN from ACM
  - **Example**: `certificate_arn = "arn:aws:acm:us-east-1:801949251798:certificate/xxx"`

- [ ] 2.4 Apply Terraform changes
  ```bash
  cd infra/terraform/envs/prod
  terraform plan -out=tfplan
  terraform apply tfplan
  ```
  - **Expected Changes**: 1 resource created (HTTPS listener)

- [ ] 2.5 Verify HTTPS connection
  ```bash
  curl -v https://api.galaxyco.ai/health
  ```
  - **Success Criteria**:
    - TLS handshake succeeds
    - Certificate is valid
    - Returns 200 OK with correct JSON

- [ ] 2.6 Test HTTP → HTTPS redirect
  ```bash
  curl -v http://api.galaxyco.ai/health
  ```
  - **Success Criteria**: Returns 301 redirect to HTTPS

**Completion Criteria**:
- ✅ HTTPS listener active in ALB
- ✅ Valid SSL certificate installed
- ✅ HTTPS health check returns 200 OK
- ✅ HTTP redirects to HTTPS
- ✅ No SSL/TLS warnings in browser

---

### ✅ TASK 3: Integrate Web App with Production API
**Estimated Time**: 20 minutes  
**Impact**: Connect frontend to live backend  
**Status**: Unknown - needs verification

#### Subtasks
- [ ] 3.1 Check current API URL configuration
  - **File**: `apps/web/.env.local`
  - **Look for**: `NEXT_PUBLIC_API_URL`, `API_URL`, or hardcoded localhost
  - **Current State**: Document what's found

- [ ] 3.2 Update environment variable
  - **File**: `apps/web/.env.local`
  - **Add/Update**: `NEXT_PUBLIC_API_URL=https://api.galaxyco.ai`
  - **Verification**: Grep for any remaining localhost:4000 references
  ```bash
  cd apps/web
  grep -r "localhost:4000" --include="*.ts" --include="*.tsx"
  ```

- [ ] 3.3 Update Vercel environment variables
  - **Location**: Vercel Dashboard → Project Settings → Environment Variables
  - **Add**: `NEXT_PUBLIC_API_URL=https://api.galaxyco.ai`
  - **Environment**: Production, Preview, Development
  - **Success Criteria**: Variable saved in Vercel

- [ ] 3.4 Trigger Vercel redeployment
  ```bash
  git commit --allow-empty -m "chore(web): trigger redeploy with production API URL"
  git push origin main
  ```
  - **Success Criteria**: Vercel deployment triggered

- [ ] 3.5 Test agent execution from web app
  - **Action**: Open web app → Navigate to agent test panel
  - **Test**: Execute a simple agent (any type)
  - **Success Criteria**:
    - Request goes to production API
    - Agent executes successfully
    - Results display in UI

- [ ] 3.6 Verify CORS configuration
  - **Location**: `apps/api/src/main.ts` (likely)
  - **Check**: CORS allows Vercel preview and production domains
  - **Expected**:
    ```typescript
    origin: [
      'https://galaxyco.ai',
      'https://*.vercel.app',
      'http://localhost:3000'
    ]
    ```

**Completion Criteria**:
- ✅ Web app uses production API URL
- ✅ Agent execution works from UI
- ✅ No CORS errors in browser console
- ✅ Network tab shows requests to api.galaxyco.ai
- ✅ Multi-tenant workspace filtering works

---

## 🟡 MEDIUM PRIORITY TASKS (High Value)

### ✅ TASK 4: Database Schema Migrations
**Estimated Time**: 20 minutes  
**Impact**: Ensure production DB has latest schema  
**Status**: Unknown

#### Subtasks
- [ ] 4.1 Check if migrations exist
  ```bash
  ls -la packages/database/drizzle/
  # or
  ls -la packages/database/migrations/
  ```
  - **Success Criteria**: Found migration files or confirmed none exist

- [ ] 4.2 Review migration files (if any)
  - **Action**: Check SQL content for safety
  - **Look for**: Destructive operations (DROP, TRUNCATE)
  - **Decision**: Approve or require user review

- [ ] 4.3 Connect to production database securely
  - **Method**: Use connection string from AWS Secrets Manager
  - **Security**: Never log connection string
  - **Tool**: psql or Drizzle CLI

- [ ] 4.4 Check current schema state
  ```bash
  cd packages/database
  pnpm run db:check
  # or
  psql "$DATABASE_URL" -c "\dt"
  ```
  - **Success Criteria**: List current tables and their structure

- [ ] 4.5 Apply migrations (if needed)
  ```bash
  cd packages/database
  pnpm run db:migrate
  ```
  - **Success Criteria**: Migrations applied without errors
  - **Verification**: Tables created/updated as expected

- [ ] 4.6 Verify schema changes
  - **Action**: Check specific tables mentioned in migrations
  - **Success Criteria**: Schema matches expected structure

**Completion Criteria**:
- ✅ Migration status confirmed (none needed OR applied successfully)
- ✅ Production database schema is up to date
- ✅ All required tables exist
- ✅ No migration errors in logs

---

### ✅ TASK 5: Set Up CloudWatch Alarms
**Estimated Time**: 30 minutes  
**Impact**: Proactive monitoring and alerting  
**Status**: Basic logging exists, no alarms

#### Subtasks
- [ ] 5.1 Create alarm for API CPU utilization
  - **File**: Add to `infra/terraform/envs/prod/main.tf`
  - **Threshold**: > 80% for 5 minutes
  - **Action**: SNS notification (if topic exists)
  ```hcl
  resource "aws_cloudwatch_metric_alarm" "api_cpu_high" {
    alarm_name          = "galaxyco-production-api-cpu-high"
    comparison_operator = "GreaterThanThreshold"
    evaluation_periods  = 2
    metric_name         = "CPUUtilization"
    namespace           = "AWS/ECS"
    period              = 300
    statistic           = "Average"
    threshold           = 80
    dimensions = {
      ServiceName = aws_ecs_service.api.name
      ClusterName = aws_ecs_cluster.main.name
    }
  }
  ```

- [ ] 5.2 Create alarm for API memory utilization
  - **Threshold**: > 90%
  - **Similar structure to CPU alarm**

- [ ] 5.3 Create alarm for unhealthy targets
  - **Metric**: UnHealthyHostCount
  - **Threshold**: < 2 healthy targets
  - **Namespace**: AWS/ApplicationELB

- [ ] 5.4 Create alarm for 5xx error rate
  - **Metric**: HTTPCode_Target_5XX_Count
  - **Threshold**: > 5 errors per 5 minutes
  - **Namespace**: AWS/ApplicationELB

- [ ] 5.5 Create alarm for task restart count
  - **Method**: Custom CloudWatch Logs metric filter
  - **Pattern**: Container stopped/restarted events
  - **Threshold**: > 3 restarts in 10 minutes

- [ ] 5.6 Apply Terraform changes
  ```bash
  cd infra/terraform/envs/prod
  terraform plan -out=tfplan
  terraform apply tfplan
  ```
  - **Expected Changes**: 5+ alarms created

**Completion Criteria**:
- ✅ At least 4 critical alarms configured
- ✅ Alarms visible in CloudWatch console
- ✅ Test alarm triggers (optional, by forcing condition)
- ✅ SNS topic created for notifications (if needed)

---

### ✅ TASK 6: Run Load Testing
**Estimated Time**: 45 minutes  
**Impact**: Validate production readiness  
**Status**: Not done

#### Subtasks
- [ ] 6.1 Set up load testing tool
  ```bash
  # Option 1: k6
  choco install k6  # Windows
  # or download from https://k6.io/
  
  # Option 2: Apache Bench (simpler)
  # Usually pre-installed on Git Bash
  ```

- [ ] 6.2 Create test script for health endpoint
  - **File**: `tests/load/health-check.js` (k6) or bash script
  - **Test**: 100 requests/sec for 5 minutes
  - **Example k6 script**:
  ```javascript
  import http from 'k6/http';
  import { check, sleep } from 'k6';
  
  export const options = {
    vus: 50,
    duration: '5m',
  };
  
  export default function () {
    const res = http.get('https://api.galaxyco.ai/health');
    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(0.5);
  }
  ```

- [ ] 6.3 Run health endpoint load test
  ```bash
  k6 run tests/load/health-check.js
  ```
  - **Monitor**: CloudWatch metrics during test
  - **Success Criteria**: 
    - < 5% error rate
    - p95 latency < 500ms
    - CPU < 80%

- [ ] 6.4 Create test for agent execution
  - **Test**: 10 concurrent users executing agents
  - **Duration**: 3 minutes
  - **Success Criteria**: All executions complete successfully

- [ ] 6.5 Monitor system during tests
  - **Watch**: ECS metrics, ALB metrics, database connections
  - **Document**: CPU peak, memory peak, response times

- [ ] 6.6 Analyze results and adjust resources if needed
  - **Decision**: Does system need more CPU/memory?
  - **Action**: Update task definitions if bottlenecks found

**Completion Criteria**:
- ✅ Load tests completed for health endpoint
- ✅ Load tests completed for agent execution
- ✅ Results documented with metrics
- ✅ No critical performance issues found
- ✅ System handles expected production load

---

## 🟢 LOW PRIORITY TASKS (Nice to Have)

### ✅ TASK 7: Fix Pre-commit Hook (Windows)
**Estimated Time**: 15 minutes  
**Impact**: Enable automated quality checks  
**Status**: Currently bypassing with --no-verify

#### Subtasks
- [ ] 7.1 Identify failing hook
  ```bash
  git commit -m "test: trigger pre-commit hook"
  ```
  - **Document**: Which hook fails and why

- [ ] 7.2 Fix path issues in package.json scripts
  - **Files**: 
    - `packages/database/package.json`
    - `packages/agents-core/package.json`
  - **Issue**: Relative paths like `../../node_modules/.bin/`
  - **Solution**: Use `pnpm exec` or direct command names
  - **Example**: Change `../../node_modules/.bin/drizzle-kit` to `drizzle-kit`

- [ ] 7.3 Test hook on Windows
  ```bash
  git commit -m "test: pre-commit hook"
  ```
  - **Success Criteria**: Hook runs without path errors

- [ ] 7.4 Update documentation
  - **File**: `WARP.md` or `docs/guides/development-setup.md`
  - **Note**: Pre-commit hooks now work on Windows

**Completion Criteria**:
- ✅ Pre-commit hooks run without errors on Windows
- ✅ No need for --no-verify flag
- ✅ Team can use hooks consistently

---

### ✅ TASK 8: Add Neon IP Allowlist
**Estimated Time**: 10 minutes  
**Impact**: Database security best practice  
**Status**: Database may be publicly accessible

#### Subtasks
- [ ] 8.1 Get NAT Gateway IPs (note: AWS CLI may not work on Windows)
  - **Alternative**: Check AWS Console → VPC → NAT Gateways
  - **Action**: Note elastic IP addresses

- [ ] 8.2 Add IPs to Neon allowlist
  - **Location**: Neon Dashboard → Project Settings → IP Allow
  - **Action**: Add both NAT Gateway IPs from us-east-1a and us-east-1b
  - **Format**: One IP per line or CIDR notation

- [ ] 8.3 Test API still connects
  ```bash
  curl https://api.galaxyco.ai/health
  ```
  - **Success Criteria**: Still returns 200 OK

- [ ] 8.4 Test from local development
  - **Expected**: Should still work (add local IP if needed)
  - **Fallback**: Temporarily allow all for development

**Completion Criteria**:
- ✅ IP allowlist configured in Neon
- ✅ Production API can still connect
- ✅ Unauthorized IPs blocked

---

### ✅ TASK 9: Configure Custom Domain for Agents
**Estimated Time**: 15 minutes  
**Impact**: Clean API endpoints  
**Status**: Agents accessible via ALB port forwarding

#### Subtasks
- [ ] 9.1 Create Route53 record for agents subdomain
  - **Domain**: `agents.api.galaxyco.ai` or `agents.galaxyco.ai`
  - **Type**: A record (alias to ALB)
  - **Target**: Same ALB as API

- [ ] 9.2 Update ALB listener rules
  - **Rule**: Route `agents.galaxyco.ai/*` to agents target group
  - **Rule**: Route `api.galaxyco.ai/*` to API target group
  - **File**: `infra/terraform/envs/prod/main.tf`

- [ ] 9.3 Create ACM certificate for agents domain
  - **Add to existing certificate**: `api.galaxyco.ai`, `agents.galaxyco.ai`
  - **Or**: Use wildcard `*.galaxyco.ai`

- [ ] 9.4 Test agents endpoint
  ```bash
  curl https://agents.galaxyco.ai/health
  ```

**Completion Criteria**:
- ✅ Agents accessible via clean domain
- ✅ HTTPS working for agents subdomain
- ✅ Both API and agents routes work correctly

---

## 📝 Post-Deployment Verification

### System Health Checks
- [ ] API health endpoint returns 200 OK
- [ ] Agents health endpoint returns 200 OK
- [ ] Web app loads without errors
- [ ] Agent execution works from UI
- [ ] Database connections working
- [ ] SSL certificates valid
- [ ] CloudWatch logs showing no errors
- [ ] All ECS tasks healthy (4/4 total: 2 API + 2 agents)

### Monitoring Verification
- [ ] CloudWatch alarms created and active
- [ ] ECS Container Insights enabled
- [ ] ALB metrics visible in CloudWatch
- [ ] Logs properly tagged with tenant_id and user_id

### Security Verification
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Secrets in AWS Secrets Manager (not hardcoded)
- [ ] Environment variables not logged
- [ ] CORS configured properly
- [ ] Multi-tenant isolation working
- [ ] IP allowlist configured (if applicable)

---

## 🚨 Rollback Procedures

### If Agents Service Fails
```bash
# Stop the service
aws ecs update-service --cluster galaxyco-production --service galaxyco-production-agents --desired-count 0 --region us-east-1

# Or revert Terraform
cd infra/terraform/envs/prod
git revert HEAD
terraform apply
```

### If SSL Certificate Issues
```bash
# Disable HTTPS listener in Terraform
# Change count = 1 back to count = 0 in main.tf line 380
terraform apply
```

### If Web App Issues
- **Vercel**: Rollback to previous deployment via Vercel Dashboard
- **Or**: Revert git commit and push

### If Database Migration Issues
```bash
# Rollback migration
cd packages/database
pnpm run db:rollback
# Or manually apply rollback SQL from migration file
```

---

## 📊 Success Metrics

### Deployment Success Criteria (8/8 Required)
1. ✅ API service: 2/2 tasks healthy, health check passing
2. ✅ Agents service: 2/2 tasks healthy, health check passing
3. ✅ Web app: Builds and deploys successfully to Vercel
4. ✅ Database: Connections working, migrations applied
5. ✅ SSL/TLS: HTTPS working for both API domains
6. ✅ Integration: Web app successfully calls production API
7. ✅ Monitoring: CloudWatch alarms configured and active
8. ✅ Testing: Load tests completed with acceptable metrics

### Performance Targets
- **API Response Time**: p95 < 500ms
- **Agent Execution**: p95 < 3000ms
- **Error Rate**: < 0.1%
- **Availability**: > 99.9%
- **CPU Utilization**: < 70% average
- **Memory Utilization**: < 80% average

---

## 🔧 Troubleshooting Quick Reference

### Agents Service Won't Start
1. Check CloudWatch logs: `/ecs/galaxyco-production-agents`
2. Verify secrets in AWS Secrets Manager
3. Test Docker image locally first
4. Check security group allows traffic
5. Verify health check path is correct

### SSL Certificate Issues
1. Check ACM certificate status (Pending → Issued)
2. Verify DNS records for validation
3. Ensure ALB listener has correct certificate ARN
4. Check Route53 A record points to ALB

### Web App Can't Connect to API
1. Check CORS configuration in API
2. Verify environment variable in Vercel
3. Check browser console for errors
4. Test API endpoint directly with curl
5. Verify security group allows inbound traffic

### Database Connection Issues
1. Check Neon IP allowlist
2. Verify DATABASE_URL in Secrets Manager
3. Test connection string locally
4. Check security group rules
5. Verify connection timeout is set (10s)

---

## 📞 Handoff After Completion

### Update Documentation
- [ ] Update `SESSION_HANDOFF_2025-10-30.md` with completion status
- [ ] Create new session handoff document for next work
- [ ] Update `DEPLOYMENT_STATUS.md` with final state
- [ ] Archive this checklist to `docs/status/sessions/`

### Git Commits
- [ ] Commit Terraform changes with proper message
  ```bash
  git commit -m "feat(infra): deploy agents service and enable SSL"
  ```
- [ ] Commit web app changes (if any)
  ```bash
  git commit -m "feat(web): integrate with production API"
  ```
- [ ] Push all changes to main branch

### Notify Stakeholders
- [ ] User/team notified of completion
- [ ] Provide access URLs and credentials (if needed)
- [ ] Share performance metrics from load testing
- [ ] Document any issues or concerns

---

## ⏰ Estimated Timeline

### Best Case (Everything Works)
- **HIGH PRIORITY**: 1.5 hours
- **MEDIUM PRIORITY**: 1.5 hours
- **Total**: 3 hours

### Realistic Case (Minor Issues)
- **HIGH PRIORITY**: 2 hours
- **MEDIUM PRIORITY**: 2 hours
- **Total**: 4 hours

### Worst Case (Debugging Required)
- **HIGH PRIORITY**: 3 hours
- **MEDIUM PRIORITY**: 2 hours
- **Total**: 5 hours

---

## 🎯 Ready to Execute?

**Prerequisites Verified**:
- ✅ API service is live and healthy
- ✅ Vercel web app is building successfully
- ✅ Database connections working
- ✅ AWS credentials configured
- ✅ Docker installed locally
- ✅ Terraform initialized

**Next Step**: Begin with HIGH PRIORITY TASK 1 (Deploy Agents Service)

**Important**: Work through tasks sequentially within each priority level. Mark each subtask complete as you go. Document any issues or deviations in a new session handoff document.

---

**Last Updated**: 2025-10-30  
**Created By**: AI Agent (based on previous agent's handoff)  
**Ready for**: Autonomous execution with user approval
