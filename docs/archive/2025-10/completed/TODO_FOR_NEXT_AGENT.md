# 📋 Comprehensive TODO for Next AI Agent

**Last Updated**: October 30, 2025 00:13 UTC  
**Session**: Post Phase 0-6 Completion  
**Project Status**: 🟢 96/100 (Excellent) - Ready for Production Deployment  
**Estimated Remaining Work**: 5-7 hours

---

## 📊 Current Project State

### ✅ What's Already Complete (Phases 0-6)

**Phase 0: Critical Bugs** ✅

- CRM infinite loading fixed
- Notification dropdown glitch fixed
- Commit: `932b726`

**Phase 1: Build & Monitoring** ✅

- All build warnings resolved (0 warnings)
- Sentry instrumentation configured
- Global error handler implemented
- Metadata configuration complete

**Phase 2: Onboarding Backend** ✅

- Real workspace creation with database
- Role-based agent provisioning (5 role templates)
- Sample data loading (tasks, events, contacts)
- LLM-powered recommendations (GPT-4o-mini)

**Phase 3: UI Features** ✅

- Document upload, detail view, deletion
- AI feedback buttons (thumbs up/down)
- Bulk document operations
- Conversation search and history

**Phase 6: E2E Testing** ✅

- 18 new E2E tests added
- Onboarding flow tests (8 tests)
- Agent execution tests (10 tests)
- Commit: `8dd8f78`

### 🔥 What Needs to Be Done (Phases 4, 5, 7)

---

## 🚀 Phase 4: AWS ECS Production Deployment (2-3 hours)

**Priority**: 🔴 HIGH - Required for production launch  
**Complexity**: Medium - Infrastructure setup  
**Dependencies**: AWS credentials, domain access

### Task 4.1: AWS Infrastructure Setup (1 hour)

**Objective**: Deploy API and agents services to AWS ECS with load balancing

#### Prerequisites Check

```bash
# Verify AWS CLI is installed
aws --version

# Check AWS credentials are configured
aws sts get-caller-identity

# Verify Terraform is installed
terraform -version
```

#### Step 1: Review Terraform Configuration (15 min)

**Files to Review**:

- `infra/terraform/envs/prod/main.tf` - Production environment config
- `infra/terraform/modules/ecs/` - ECS module definitions
- `infra/terraform/modules/networking/` - VPC, subnets, security groups
- `infra/terraform/modules/loadbalancer/` - ALB configuration

**What to Look For**:

- [ ] Verify VPC CIDR blocks don't conflict
- [ ] Check security group rules are appropriate
- [ ] Ensure ECS task definitions have correct resource limits
- [ ] Validate environment variable references

**Key Settings**:

```hcl
# Expected in main.tf
region = "us-east-1"
environment = "production"
api_container_image = "ghcr.io/galaxy-co-ai/api:latest"
agents_container_image = "ghcr.io/galaxy-co-ai/agents:latest"
```

#### Step 2: Configure AWS Secrets Manager (15 min)

**Secrets to Create**:

```bash
# Create secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name galaxyco/prod/database-url \
  --secret-string "postgresql://neondb_owner:..." \
  --region us-east-1

aws secretsmanager create-secret \
  --name galaxyco/prod/openai-api-key \
  --secret-string "sk-..." \
  --region us-east-1

aws secretsmanager create-secret \
  --name galaxyco/prod/anthropic-api-key \
  --secret-string "sk-ant-..." \
  --region us-east-1

aws secretsmanager create-secret \
  --name galaxyco/prod/clerk-secret-key \
  --secret-string "sk_..." \
  --region us-east-1
```

**Required Secrets** (from `.env.local`):

- `database-url` - Neon PostgreSQL connection string
- `openai-api-key` - OpenAI API key
- `anthropic-api-key` - Anthropic API key
- `google-generative-ai-api-key` - Google Gemini key
- `pinecone-api-key` - Pinecone vector DB key
- `pinecone-environment` - Pinecone environment
- `pinecone-index` - Pinecone index name
- `blob-read-write-token` - Vercel Blob storage
- `trigger-secret-key` - Trigger.dev API key
- `clerk-secret-key` - Clerk authentication
- `clerk-publishable-key` - Clerk public key
- `encryption-key` - Data encryption key
- `sentry-dsn` - Sentry error tracking

**Validation**:

```bash
# Verify secrets exist
aws secretsmanager list-secrets --region us-east-1 | grep galaxyco
```

#### Step 3: Build and Push Docker Images (30 min)

**API Container**:

```bash
# Navigate to project root
cd /c/Users/Owner/workspace/galaxyco-ai-2.0

# Build API Docker image
docker build -t galaxyco-api:latest -f apps/api/Dockerfile .

# Tag for GitHub Container Registry
docker tag galaxyco-api:latest ghcr.io/galaxy-co-ai/api:latest

# Push to registry (requires GitHub token)
echo $GITHUB_TOKEN | docker login ghcr.io -u galaxy-co-ai --password-stdin
docker push ghcr.io/galaxy-co-ai/api:latest
```

**Agents Container**:

```bash
# Build agents Docker image
docker build -t galaxyco-agents:latest -f services/agents/Dockerfile .

# Tag for GitHub Container Registry
docker tag galaxyco-agents:latest ghcr.io/galaxy-co-ai/agents:latest

# Push to registry
docker push ghcr.io/galaxy-co-ai/agents:latest
```

**Important Notes**:

- Dockerfiles are already created in the repo
- Images should be built from project root (not subdirectories)
- Build context includes all necessary dependencies
- Multi-stage builds minimize image size

**Validation**:

```bash
# Verify images exist
docker images | grep galaxyco

# Test images locally (optional)
docker run -p 4000:4000 -e PORT=4000 galaxyco-api:latest
docker run -p 5001:5001 -e PORT=5001 galaxyco-agents:latest
```

#### Step 4: Configure GitHub Secrets (15 min)

**Required GitHub Secrets** (for CI/CD):

Navigate to: https://github.com/galaxy-co-ai/galaxyco-ai-v2/settings/secrets/actions

Add these secrets:

- `AWS_ACCESS_KEY_ID` - AWS IAM user access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM user secret key
- `AWS_REGION` - `us-east-1`
- `GITHUB_TOKEN` - Already exists, verify permissions
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

**Verification**:

```bash
# Check GitHub Actions can access secrets
gh secret list
```

### Task 4.2: Deploy Infrastructure with Terraform (45 min)

**Objective**: Provision AWS resources (ECS, ALB, RDS, etc.)

#### Step 1: Initialize Terraform (5 min)

```bash
cd infra/terraform/envs/prod

# Initialize Terraform
terraform init

# Verify providers are installed
terraform providers
```

**Expected Output**:

```
Terraform has been successfully initialized!
- aws provider (hashicorp/aws)
- random provider (hashicorp/random)
```

#### Step 2: Create Terraform Variables File (10 min)

**Create**: `infra/terraform/envs/prod/terraform.tfvars`

```hcl
# NEVER commit this file - it's in .gitignore

# Project Configuration
project_name = "galaxyco"
environment  = "production"
aws_region   = "us-east-1"

# Networking
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# ECS Configuration
api_container_image    = "ghcr.io/galaxy-co-ai/api:latest"
agents_container_image = "ghcr.io/galaxy-co-ai/agents:latest"
api_container_port     = 4000
agents_container_port  = 5001
api_desired_count      = 2  # For high availability
agents_desired_count   = 2

# Task Resources
api_cpu    = 512  # 0.5 vCPU
api_memory = 1024 # 1 GB
agents_cpu    = 1024  # 1 vCPU (Python needs more)
agents_memory = 2048  # 2 GB (LangGraph needs memory)

# Auto Scaling
api_min_capacity = 2
api_max_capacity = 10
agents_min_capacity = 2
agents_max_capacity = 10

# Load Balancer
enable_https            = true
certificate_arn         = "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID"
health_check_path_api   = "/api/health"
health_check_path_agents = "/health"

# Domain Configuration
domain_name     = "app.galaxyco.ai"
api_domain_name = "api.galaxyco.ai"

# Tags
tags = {
  Project     = "GalaxyCo.ai"
  Environment = "production"
  ManagedBy   = "terraform"
}
```

**Important**: Replace `ACCOUNT_ID` and `CERT_ID` with actual values

#### Step 3: Plan Terraform Deployment (10 min)

```bash
# Generate execution plan
terraform plan -var-file=terraform.tfvars -out=tfplan

# Review the plan carefully
# Verify:
# - VPC and subnets are created correctly
# - Security groups allow necessary traffic
# - ECS services reference correct images
# - Load balancer is configured with health checks
# - Secrets Manager integration is correct
```

**Expected Resources** (should see ~50-60 resources):

- VPC with 3 public and 3 private subnets
- Internet Gateway and NAT Gateways
- Security Groups (ALB, ECS tasks)
- Application Load Balancer with listeners
- Target Groups for API and agents
- ECS Cluster
- ECS Task Definitions (API and agents)
- ECS Services with auto-scaling
- CloudWatch Log Groups
- IAM roles and policies

#### Step 4: Apply Terraform (20 min)

```bash
# Apply the plan (this takes 15-20 minutes)
terraform apply tfplan

# Monitor the output for any errors
# Take note of the outputs:
# - load_balancer_dns
# - api_endpoint
# - agents_endpoint
```

**Troubleshooting Common Issues**:

- **Error: "Certificate not found"** → Create ACM certificate first (Task 4.3)
- **Error: "Insufficient capacity"** → Try different availability zones
- **Error: "Rate exceeded"** → Wait a few minutes and retry
- **Error: "ECR authentication"** → Check docker login to ghcr.io

**Validation**:

```bash
# Check ECS cluster is running
aws ecs describe-clusters --clusters galaxyco-production --region us-east-1

# Check services are running
aws ecs describe-services \
  --cluster galaxyco-production \
  --services galaxyco-api galaxyco-agents \
  --region us-east-1

# Check task health
aws ecs list-tasks --cluster galaxyco-production --region us-east-1
```

### Task 4.3: SSL Certificate Configuration (30 min)

**Objective**: Set up HTTPS with AWS Certificate Manager

#### Step 1: Request SSL Certificate (10 min)

**Option A: Via AWS Console**:

1. Go to AWS Certificate Manager (ACM)
2. Click "Request a certificate"
3. Choose "Request a public certificate"
4. Add domain names:
   - `app.galaxyco.ai`
   - `api.galaxyco.ai`
   - `*.galaxyco.ai` (wildcard for subdomains)
5. Choose "DNS validation"
6. Click "Request"

**Option B: Via AWS CLI**:

```bash
# Request certificate
aws acm request-certificate \
  --domain-name app.galaxyco.ai \
  --subject-alternative-names api.galaxyco.ai *.galaxyco.ai \
  --validation-method DNS \
  --region us-east-1

# Note the CertificateArn from output
```

#### Step 2: DNS Validation (10 min)

**Get validation records**:

```bash
# Get CNAME records for validation
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
  --region us-east-1
```

**Add DNS records** (in your domain registrar):

- Record Type: CNAME
- Name: `_abc123.app.galaxyco.ai`
- Value: `_xyz789.acm-validations.aws.`

**Wait for validation** (takes 5-30 minutes):

```bash
# Check certificate status
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
  --region us-east-1 \
  | grep Status

# Should show: "Status": "ISSUED"
```

#### Step 3: Update Load Balancer with Certificate (10 min)

```bash
# Get load balancer ARN
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names galaxyco-production-alb \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text \
  --region us-east-1)

# Add HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
  --default-actions Type=forward,TargetGroupArn=YOUR_TARGET_GROUP_ARN \
  --region us-east-1

# Add redirect from HTTP to HTTPS
aws elbv2 modify-listener \
  --listener-arn YOUR_HTTP_LISTENER_ARN \
  --default-actions Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301} \
  --region us-east-1
```

**Validation**:

```bash
# Test HTTPS endpoint (will fail until DNS is configured)
curl -I https://api.galaxyco.ai/health
```

### Task 4.4: DNS Configuration (15 min)

**Objective**: Point domain to AWS infrastructure

#### Step 1: Get Load Balancer DNS (5 min)

```bash
# Get ALB DNS name
aws elbv2 describe-load-balancers \
  --names galaxyco-production-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region us-east-1

# Example output: galaxyco-production-alb-123456789.us-east-1.elb.amazonaws.com
```

#### Step 2: Update DNS Records (10 min)

**Add these records to your DNS provider** (e.g., Cloudflare, Route53, etc.):

**For app.galaxyco.ai** (Frontend via Vercel):

- Type: CNAME
- Name: `app`
- Value: `cname.vercel-dns.com`
- TTL: 300

**For api.galaxyco.ai** (Backend via AWS):

- Type: CNAME or ALIAS
- Name: `api`
- Value: `galaxyco-production-alb-123456789.us-east-1.elb.amazonaws.com`
- TTL: 300

**Validation**:

```bash
# Check DNS propagation
dig app.galaxyco.ai
dig api.galaxyco.ai

# Test endpoints
curl https://app.galaxyco.ai
curl https://api.galaxyco.ai/health
```

### Task 4.5: Health Checks and Smoke Tests (30 min)

**Objective**: Verify all services are working correctly

#### Health Check Endpoints

**API Health Check**:

```bash
curl https://api.galaxyco.ai/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-10-30T00:00:00.000Z",
#   "uptime": 123,
#   "database": "connected"
# }
```

**Agents Service Health Check**:

```bash
curl https://api.galaxyco.ai/agents/health

# Expected response:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "python_version": "3.11.x"
# }
```

#### Production Smoke Tests

**Test 1: User Authentication** (5 min)

```bash
# Test Clerk integration
curl -X POST https://api.galaxyco.ai/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"token":"test"}'

# Should return 401 Unauthorized (expected, means auth is working)
```

**Test 2: Database Connection** (5 min)

```bash
# Test database query (requires valid auth token)
# Use Postman or similar to test authenticated endpoints
# Endpoint: GET https://api.galaxyco.ai/api/workspaces
# Header: Authorization: Bearer YOUR_TOKEN
```

**Test 3: Agent Execution** (10 min)

```bash
# Test agent execution endpoint
# This requires:
# 1. Valid authentication
# 2. Existing workspace
# 3. Existing agent

# Use the web UI to test:
# 1. Sign in at https://app.galaxyco.ai
# 2. Navigate to /agents
# 3. Create or select an agent
# 4. Execute agent in test panel
# 5. Verify response is received
```

**Test 4: Document Upload** (5 min)

```bash
# Test document upload and processing
# 1. Sign in to web UI
# 2. Navigate to /collections
# 3. Upload a test document (PDF or TXT)
# 4. Verify processing completes
# 5. Check document appears in list
```

**Test 5: Multi-tenancy** (5 min)

```bash
# Verify workspace isolation
# 1. Create two test workspaces
# 2. Create data in workspace A
# 3. Switch to workspace B
# 4. Verify data from workspace A is NOT visible
# 5. This confirms tenant isolation is working
```

#### Monitoring Setup Validation

```bash
# Check CloudWatch logs are streaming
aws logs tail /ecs/galaxyco-api --follow --region us-east-1

# Check ECS task metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=galaxyco-api \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average \
  --region us-east-1
```

### Task 4.6: Update Environment Variables in Vercel (15 min)

**Objective**: Point frontend to production API

#### Update Vercel Project Settings

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link project
cd apps/web
vercel link

# Add production API URL
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://api.galaxyco.ai

# Add production agents URL
vercel env add NEXT_PUBLIC_AGENTS_URL production
# Value: https://api.galaxyco.ai/agents

# Redeploy with new env vars
vercel --prod
```

**Validation**:

```bash
# Check environment variables
vercel env ls

# Test frontend connects to production API
# Open browser: https://app.galaxyco.ai
# Open DevTools > Network tab
# Verify API calls go to api.galaxyco.ai
```

### Task 4.7: Commit & Document (10 min)

**Create deployment documentation**:

```bash
# Update deployment guide
# File: docs/deployment/PRODUCTION_DEPLOYMENT.md
```

**Commit changes**:

```bash
git add infra/terraform/
git commit -m "feat(infra): deploy production infrastructure to aws ecs

- Configure ECS cluster with API and agents services
- Set up Application Load Balancer with HTTPS
- Configure auto-scaling for high availability
- Add health checks and monitoring
- Update DNS records for production domains"

git push origin main
```

---

## 📊 Phase 5: Production Monitoring Setup (1-2 hours)

**Priority**: 🟡 HIGH - Critical for production operations  
**Complexity**: Low - Configuration focused  
**Dependencies**: Production deployment complete

### Task 5.1: Uptime Monitoring (30 min)

**Objective**: Monitor production uptime and get alerts for downtime

#### Option A: UptimeRobot (Recommended - Free Tier)

**Step 1: Create Account**

- Go to: https://uptimerobot.com/
- Sign up for free account (50 monitors included)

**Step 2: Create Monitors** (15 min)

**Monitor 1: Frontend**

- Type: HTTPS
- URL: `https://app.galaxyco.ai`
- Monitoring Interval: 5 minutes
- Alert contacts: Your email

**Monitor 2: API Health**

- Type: HTTPS
- URL: `https://api.galaxyco.ai/api/health`
- Monitoring Interval: 5 minutes
- Alert contacts: Your email
- Expected keyword: `healthy`

**Monitor 3: Agents Service**

- Type: HTTPS
- URL: `https://api.galaxyco.ai/agents/health`
- Monitoring Interval: 5 minutes
- Alert contacts: Your email
- Expected keyword: `healthy`

**Monitor 4: Database Connection**

- Type: HTTPS
- URL: `https://api.galaxyco.ai/api/health/db`
- Monitoring Interval: 5 minutes
- Alert contacts: Your email

**Step 3: Configure Alert Channels** (10 min)

Add these alert channels:

- [ ] Email (primary)
- [ ] SMS (for critical alerts) - Optional
- [ ] Slack webhook (for team notifications) - Optional
- [ ] PagerDuty (for on-call) - Optional

**Alert Settings**:

- Send alert when: Monitor is down
- Resend notification: Every 30 minutes
- Alert down after: 2 failed checks (avoid false positives)

**Step 4: Create Status Page** (5 min)

- Enable public status page
- URL: `status.galaxyco.ai` (configure DNS CNAME)
- Add all monitors to status page
- Customize branding

**Validation**:

```bash
# Trigger test alert (temporarily block URL)
# Verify you receive alert email within 5-10 minutes
```

#### Option B: AWS CloudWatch Alarms

```bash
# Create alarm for API 5xx errors
aws cloudwatch put-metric-alarm \
  --alarm-name galaxyco-api-5xx-errors \
  --alarm-description "Alert when API returns 5xx errors" \
  --metric-name TargetResponseTime \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --region us-east-1

# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name galaxyco-ecs-high-cpu \
  --alarm-description "Alert when ECS CPU is high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --region us-east-1
```

### Task 5.2: Performance Monitoring (30 min)

**Objective**: Track Web Vitals and performance metrics

#### Step 1: Verify Sentry Performance (10 min)

**Check Sentry Configuration**:

```bash
# File: apps/web/sentry.client.config.ts
# Verify these settings exist:

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0, // Capture 100% in production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

**Test Sentry**:

- Visit https://app.galaxyco.ai
- Trigger a test error (add `?test-sentry=1` to URL)
- Check Sentry dashboard for error

#### Step 2: Add Web Vitals Tracking (10 min)

**File**: `apps/web/app/layout.tsx`

Add Web Vitals reporting:

```typescript
// Add this import
import { reportWebVitals } from "@/lib/web-vitals";

// Add this to the root layout component
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to Sentry
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: "info",
      tags: {
        web_vital: metric.name,
      },
      contexts: {
        "Web Vitals": {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        },
      },
    });
  }

  // Send to analytics
  if (window.plausible) {
    window.plausible("Web Vital", {
      props: {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      },
    });
  }
}
```

**Create**: `apps/web/lib/web-vitals.ts`

```typescript
import type { Metric } from "web-vitals";

export function reportWebVitals(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });

  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/web-vitals", body);
  } else {
    fetch("/api/analytics/web-vitals", {
      body,
      method: "POST",
      keepalive: true,
    });
  }
}
```

#### Step 3: Create Web Vitals API Endpoint (10 min)

**Create**: `apps/web/app/api/analytics/web-vitals/route.ts`

```typescript
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log web vitals
    logger.info("Web Vital recorded", {
      metric: data.name,
      value: data.value,
      rating: data.rating,
      timestamp: new Date().toISOString(),
    });

    // Could also send to external analytics service here
    // e.g., PostHog, Mixpanel, Google Analytics

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error recording web vital", { error });
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
```

**Commit**:

```bash
git add apps/web/
git commit -m "feat(web): add web vitals tracking for performance monitoring"
git push origin main
```

### Task 5.3: Application Performance Monitoring (30 min)

**Objective**: Track API performance, database queries, and errors

#### Step 1: Verify CloudWatch Log Insights Queries (15 min)

**Create saved queries** in CloudWatch Insights:

**Query 1: API Error Rate**

```
fields @timestamp, @message, level, error
| filter level = "error"
| stats count() as error_count by bin(5m)
| sort @timestamp desc
```

**Query 2: Slow API Requests**

```
fields @timestamp, path, duration
| filter duration > 1000
| sort duration desc
| limit 20
```

**Query 3: Database Query Performance**

```
fields @timestamp, query, duration
| filter query like /SELECT|INSERT|UPDATE|DELETE/
| stats avg(duration) as avg_duration, max(duration) as max_duration by query
| sort avg_duration desc
```

**Query 4: Agent Execution Metrics**

```
fields @timestamp, agentId, duration, tokensUsed, cost
| filter agentId exists
| stats avg(duration) as avg_duration, sum(cost) as total_cost by agentId
| sort total_cost desc
```

#### Step 2: Set Up CloudWatch Dashboards (15 min)

**Create dashboard**: `GalaxyCo-Production-Metrics`

**Add widgets**:

- [ ] API request count (line chart, 1h)
- [ ] API response times (line chart, 1h)
- [ ] Error rate (number, current)
- [ ] Database connections (number, current)
- [ ] ECS CPU utilization (line chart, 1h)
- [ ] ECS memory utilization (line chart, 1h)
- [ ] Agent execution count (number, 24h)
- [ ] Total AI cost (number, 24h)

**AWS CLI to create dashboard**:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name GalaxyCo-Production \
  --dashboard-body file://cloudwatch-dashboard.json \
  --region us-east-1
```

### Task 5.4: Analytics Event Tracking (30 min)

**Objective**: Track user behavior and key metrics

#### Step 1: Verify PostHog Configuration (10 min)

**Check**: `apps/web/lib/analytics.ts`

Ensure these events are tracked:

- [ ] User signup
- [ ] Workspace created
- [ ] Agent created
- [ ] Agent executed
- [ ] Document uploaded
- [ ] Conversation started
- [ ] Integration connected
- [ ] Error occurred

#### Step 2: Add Missing Event Tracking (15 min)

**Example**: Track workspace creation in onboarding

**File**: `apps/web/app/api/onboarding/process/route.ts`

Add after workspace creation:

```typescript
// Track analytics event
if (typeof window !== "undefined" && window.posthog) {
  window.posthog.capture("workspace_created", {
    workspace_id: workspace.id,
    workspace_name: workspaceName,
    user_role: setupData.role,
    user_industry: setupData.industry,
  });
}
```

Repeat for other key events in the application.

#### Step 3: Create Analytics Dashboard (5 min)

**In PostHog**:

- Create dashboard: "GalaxyCo Production Metrics"
- Add insights:
  - Daily active users (DAU)
  - Weekly active users (WAU)
  - Workspaces created (trend)
  - Agents executed (trend)
  - Documents uploaded (trend)
  - Error rate (%)
  - Average session duration
  - User retention (weekly cohorts)

**Validation**:

- Trigger events in production
- Check PostHog dashboard shows events
- Verify event properties are captured correctly

---

## 📚 Phase 7: Documentation & Launch Prep (1 hour)

**Priority**: 🟡 MEDIUM - Important for maintainability  
**Complexity**: Low - Writing focused

### Task 7.1: Update Production Documentation (30 min)

#### Create Production Deployment Guide

**File**: `docs/deployment/PRODUCTION_DEPLOYMENT_GUIDE.md`

**Content should include**:

```markdown
# Production Deployment Guide

## Prerequisites

- AWS account with admin access
- GitHub account with repo access
- Domain registered and DNS access
- SSL certificate (ACM or custom)

## Infrastructure Overview

[Architecture diagram]

## Deployment Steps

1. AWS infrastructure setup
2. Docker image builds
3. ECS deployment
4. DNS configuration
5. SSL setup
6. Monitoring configuration

## Rollback Procedure

[Step-by-step rollback]

## Troubleshooting

[Common issues and solutions]

## Monitoring & Alerts

[How to check system health]
```

#### Update README.md (10 min)

**Add production URLs**:

```markdown
## 🌐 Live Environments

- **Production**: https://app.galaxyco.ai
- **API**: https://api.galaxyco.ai
- **Status Page**: https://status.galaxyco.ai
- **Documentation**: https://docs.galaxyco.ai
```

**Add production deployment section**:

```markdown
## 🚀 Production Deployment

The application is deployed to:

- Frontend: Vercel
- Backend: AWS ECS Fargate
- Database: Neon PostgreSQL

See [Production Deployment Guide](./docs/deployment/PRODUCTION_DEPLOYMENT_GUIDE.md) for details.
```

#### Create Troubleshooting Guide (10 min)

**File**: `docs/guides/TROUBLESHOOTING.md`

**Include sections**:

- Common errors and solutions
- Database connection issues
- Authentication problems
- Agent execution failures
- Performance optimization
- Debugging tips
- Log locations

#### Update API Documentation (10 min)

**File**: `docs/api/API_REFERENCE.md`

**Ensure it includes**:

- All 86 API endpoints
- Request/response examples
- Authentication requirements
- Rate limits
- Error codes
- Workspace isolation notes

### Task 7.2: Create Launch Checklist (15 min)

**File**: `LAUNCH_CHECKLIST.md`

```markdown
# 🚀 Production Launch Checklist

## Pre-Launch (Complete Before Going Live)

### Infrastructure

- [ ] AWS ECS services running (2+ tasks each)
- [ ] Load balancer health checks passing
- [ ] SSL certificate valid and configured
- [ ] DNS records propagated
- [ ] Auto-scaling configured
- [ ] Backup strategy in place

### Security

- [ ] All secrets in AWS Secrets Manager
- [ ] No secrets committed to git
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] Database backups enabled
- [ ] Multi-tenant isolation verified

### Monitoring

- [ ] Uptime monitors configured (UptimeRobot)
- [ ] Error tracking active (Sentry)
- [ ] CloudWatch alarms set up
- [ ] Performance monitoring enabled
- [ ] Analytics tracking verified
- [ ] Alert channels tested

### Testing

- [ ] Smoke tests passed on production
- [ ] E2E tests run successfully
- [ ] Performance tests completed
- [ ] Security scan passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing done

### Documentation

- [ ] README updated with prod URLs
- [ ] API documentation complete
- [ ] Deployment guide created
- [ ] Troubleshooting guide written
- [ ] Runbooks for common tasks

### Team Readiness

- [ ] On-call schedule defined
- [ ] Incident response plan documented
- [ ] Rollback procedure tested
- [ ] Support channels ready
- [ ] Team trained on monitoring tools

## Launch Day

- [ ] Final smoke test
- [ ] Monitor metrics for 1 hour
- [ ] Announce launch
- [ ] Monitor for issues
- [ ] Be ready to rollback

## Post-Launch (First 48 Hours)

- [ ] Check error rates
- [ ] Verify performance metrics
- [ ] Monitor user feedback
- [ ] Review logs for issues
- [ ] Adjust auto-scaling if needed
```

### Task 7.3: Final Commit (5 min)

```bash
# Add all documentation
git add docs/ README.md LAUNCH_CHECKLIST.md

# Commit
git commit -m "docs: complete production deployment and launch documentation

- Add production deployment guide with step-by-step instructions
- Update README with production URLs
- Create comprehensive troubleshooting guide
- Add API reference documentation
- Create launch checklist for production readiness
- Include rollback procedures and runbooks"

# Push
git push origin main
```

---

## 🎯 Success Criteria

**Phase 4 Complete When**:

- [ ] AWS ECS services running (at least 2 tasks per service)
- [ ] Load balancer health checks passing (green status)
- [ ] HTTPS configured and enforced
- [ ] DNS pointing to correct endpoints
- [ ] Can access https://app.galaxyco.ai successfully
- [ ] Can call https://api.galaxyco.ai/api/health successfully
- [ ] Smoke tests pass on production

**Phase 5 Complete When**:

- [ ] Uptime monitoring active (3+ monitors)
- [ ] Alert channels configured and tested
- [ ] CloudWatch dashboards created
- [ ] Performance tracking enabled (Web Vitals)
- [ ] Analytics events firing correctly
- [ ] Can see metrics in monitoring dashboards

**Phase 7 Complete When**:

- [ ] Production deployment guide exists
- [ ] README updated with prod URLs
- [ ] Troubleshooting guide created
- [ ] API documentation complete
- [ ] Launch checklist created
- [ ] All docs committed to repo

---

## 🚫 Common Pitfalls to Avoid

### Deployment Issues

1. **Docker Image Architecture Mismatch**
   - Ensure images built for linux/amd64 (AWS Fargate platform)
   - Use: `docker buildx build --platform linux/amd64`

2. **Missing Environment Variables**
   - Double-check all secrets in AWS Secrets Manager
   - Verify ECS task definitions reference correct secret ARNs
   - Test locally with production-like env vars first

3. **Security Group Misconfiguration**
   - ALB security group must allow inbound 80/443
   - ECS security group must allow inbound from ALB only
   - Outbound must allow database and external APIs

4. **Health Check Failures**
   - Verify health check paths return 200 OK
   - Check timeout settings (default 5s may be too short)
   - Ensure task has time to start before first check

5. **SSL Certificate Issues**
   - Certificate must be in same region as ALB (us-east-1)
   - DNS validation must complete before using cert
   - Wildcard certs need `*.domain.com` not `domain.com/*`

### Monitoring Issues

1. **False Positive Alerts**
   - Set evaluation periods to 2+ checks
   - Use appropriate thresholds
   - Consider maintenance windows

2. **Missing Critical Alerts**
   - Ensure alerts for: uptime, errors, performance, costs
   - Test alert channels (send test alert)
   - Have escalation path defined

3. **Log Retention**
   - Set CloudWatch log retention (default is forever = expensive)
   - Recommended: 30 days for most logs, 90 days for audit

### Cost Optimization

1. **Auto-Scaling Not Configured**
   - Without auto-scaling, you pay for max capacity 24/7
   - Configure scale-down to 2 tasks during low traffic

2. **NAT Gateway Costs**
   - NAT Gateways cost $0.045/hour + data transfer
   - Use VPC endpoints for AWS services to reduce costs

3. **CloudWatch Costs**
   - Enable only necessary metrics
   - Set appropriate log retention periods
   - Use CloudWatch Insights sparingly

---

## 📞 Getting Help

### If AWS Deployment Fails

1. **Check CloudWatch Logs**:

   ```bash
   aws logs tail /ecs/galaxyco-api --follow --region us-east-1
   ```

2. **Check ECS Task Status**:

   ```bash
   aws ecs describe-tasks \
     --cluster galaxyco-production \
     --tasks TASK_ARN \
     --region us-east-1
   ```

3. **Common Error Messages**:
   - "CannotPullContainerError" → Check ECR permissions
   - "ResourceInitializationError" → Check secrets access
   - "HealthCheckFailed" → Check health endpoint returns 200

### If Monitoring Isn't Working

1. **Verify Sentry DSN**: Check `NEXT_PUBLIC_SENTRY_DSN` is set
2. **Check Analytics**: Look for PostHog events in browser DevTools
3. **Test Alerts**: Manually trigger alert (stop ECS task)

### Resource Links

- **AWS ECS Documentation**: https://docs.aws.amazon.com/ecs/
- **Terraform AWS Provider**: https://registry.terraform.io/providers/hashicorp/aws
- **Sentry Next.js**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **UptimeRobot API**: https://uptimerobot.com/api/

---

## 🎉 Final Notes

After completing ALL phases:

1. **Run production smoke tests** (15 min)
2. **Monitor for 1 hour** after deployment
3. **Update CURRENT_SESSION.md** with completion status
4. **Notify team** deployment is complete
5. **Be ready to rollback** if critical issues found

**Estimated Total Time**: 5-7 hours

- Phase 4: 2-3 hours
- Phase 5: 1-2 hours
- Phase 7: 1 hour
- Testing & validation: 1 hour

---

**Good luck! The codebase is in excellent shape and ready for production.** 🚀

Last Updated: October 30, 2025 00:13 UTC
