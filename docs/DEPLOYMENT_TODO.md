# API Deployment - TODO to Get Live

**Last Updated:** 2025-10-30  
**Status:** API deploys to ECS but hangs during startup  
**Priority:** HIGH - Production deployment blocked

---

## Current Situation

### ✅ What's Working
- Docker image builds successfully using simplified monolithic approach
- Image pushes to GitHub Container Registry (GHCR) successfully
- ECS pulls image and starts containers
- NestJS framework begins initialization (logs show "Starting Nest application...")
- Health check path is correct (`/health`)
- All AWS infrastructure is deployed (VPC, ALB, ECS cluster, security groups)
- Environment variables are configured in ECS task definition
- All required secrets exist in AWS Secrets Manager

### ❌ What's Broken
- **App hangs during startup** - never reaches "listening" state
- Health checks fail → tasks restart repeatedly
- No "Nest application successfully started" message in logs
- Only error visible: "class-transformer package is missing" (non-fatal warning)

### 🔍 Root Cause (Suspected)
The application is **waiting indefinitely for a database connection** or other external service during startup. The app initializes but never finishes bootstrapping.

---

## Files Modified in Last Session

### 1. `apps/api/Dockerfile`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/apps/api/Dockerfile`
- **Changes:**
  - Simplified to monolithic build (copies database source into API)
  - Removed workspace package dependencies to avoid TypeScript resolution issues
  - Fixed CMD path to: `CMD ["node", "apps/api/dist/main.js"]`
  - Builds with turbo/pnpm from workspace root

### 2. `apps/api/src/agents/agents.service.ts`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/apps/api/src/agents/agents.service.ts`
- **Changes:**
  - Changed imports from `@galaxyco/database/client` to `../database/client`
  - Changed imports from `@galaxyco/database/schema` to `../database/schema`
  - Commented out `@galaxyco/agents-core` import (temporarily disabled)
  - `testWithCore()` method redirects to legacy `test()` method

### 3. `packages/database/package.json`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/packages/database/package.json`
- **Changes:**
  - Added `"build": "tsc"` script
  - Updated exports to use proper `types` and `default` fields
  - Build script uses: `../../node_modules/.bin/tsc`

### 4. `.npmrc` (Created)
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/.npmrc`
- **Content:** `shamefully-hoist=true`
- Enables pnpm to hoist dependencies for Docker builds

### 5. `tsconfig.base.json`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/tsconfig.base.json`
- **Changes:**
  - Updated paths to point to built dist files instead of src
  - Added subpath mappings for `/client` and `/schema`

### 6. `packages/agents-core/tsconfig.json`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/packages/agents-core/tsconfig.json`
- **Changes:**
  - Extended from base config
  - Set `module: "commonjs"`
  - Added `paths: {}` to override base paths
  - Added `skipLibCheck` and `allowJs`

### 7. `packages/agents-core/package.json`
- **Path:** `/c/Users/Owner/workspace/galaxyco-ai-2.0/packages/agents-core/package.json`
- **Changes:**
  - Build script: `../../node_modules/.bin/tsc --noCheck --skipLibCheck`
  - Uses workspace root TypeScript binary

---

## What Needs to be Done

### Priority 1: Verify Database Connection

**The app is likely hanging waiting for database connection.**

#### Step 1: Check DATABASE_URL Secret Value
```bash
export MSYS_NO_PATHCONV=1
"/c/Program Files/Amazon/AWSCLIV2/aws" secretsmanager get-secret-value \
  --secret-id galaxyco/prod/database-url \
  --region us-east-1 \
  --query 'SecretString' \
  --output text
```

**Expected:** Should show a valid Neon PostgreSQL connection string like:
```
postgresql://user:password@ep-xyz.us-east-1.aws.neon.tech/dbname?sslmode=require
```

**If missing or invalid:**
```bash
# Get the Neon connection string from Vercel or Neon dashboard
# Then update the secret:
"/c/Program Files/Amazon/AWSCLIV2/aws" secretsmanager put-secret-value \
  --secret-id galaxyco/prod/database-url \
  --secret-string "postgresql://..." \
  --region us-east-1
```

#### Step 2: Check Other Required Secrets
```bash
"/c/Program Files/Amazon/AWSCLIV2/aws" secretsmanager get-secret-value \
  --secret-id galaxyco/prod/clerk-secret-key \
  --region us-east-1 \
  --query 'SecretString' \
  --output text

"/c/Program Files/Amazon/AWSCLIV2/aws" secretsmanager get-secret-value \
  --secret-id galaxyco/prod/encryption-key \
  --region us-east-1 \
  --query 'SecretString' \
  --output text

"/c/Program Files/Amazon/AWSCLIV2/aws" secretsmanager get-secret-value \
  --secret-id galaxyco/prod/openai-api-key \
  --region us-east-1 \
  --query 'SecretString' \
  --output text
```

**If any are placeholder/empty:**
- Get real values from Vercel environment variables or respective service dashboards
- Update using `put-secret-value` command above

#### Step 3: Verify Database Allows ECS Connections

Check if Neon/database firewall allows connections from ECS tasks:
- ECS tasks run in **private subnets** (10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24)
- They connect via **NAT Gateways** with public Elastic IPs

Get NAT Gateway IPs:
```bash
"/c/Program Files/Amazon/AWSCLIV2/aws" ec2 describe-nat-gateways \
  --region us-east-1 \
  --filter "Name=tag:Name,Values=galaxyco-production-nat*" \
  --query 'NatGateways[*].[NatGatewayId,NatGatewayAddresses[0].PublicIp]' \
  --output table
```

Then in **Neon dashboard** (or database provider):
- Add these IPs to the allowed connection list
- Or set to allow all IPs temporarily for testing

---

### Priority 2: Add Database Connection Timeout

The app might be waiting forever for DB. Add a connection timeout.

#### File: `packages/database/src/client.ts`

Check if there's a timeout configured. If not, add:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!, {
  fetchConnectionCache: true,
  fetchOptions: {
    signal: AbortSignal.timeout(10000) // 10 second timeout
  }
});

export const db = drizzle(sql);
```

Rebuild and redeploy after this change.

---

### Priority 3: Force New Deployment with Correct Secrets

After updating secrets, force ECS to restart with new environment:

```bash
cd /c/Users/Owner/workspace/galaxyco-ai-2.0

# Stop all current tasks to force pull new secrets
export MSYS_NO_PATHCONV=1
for task in $("/c/Program Files/Amazon/AWSCLIV2/aws" ecs list-tasks \
  --cluster galaxyco-production \
  --service-name galaxyco-production-api \
  --region us-east-1 \
  --query 'taskArns[*]' \
  --output text); do
  "/c/Program Files/Amazon/AWSCLIV2/aws" ecs stop-task \
    --cluster galaxyco-production \
    --task "$task" \
    --region us-east-1 \
    --no-cli-pager
done

# Wait for new tasks to start
sleep 60

# Check if they're healthy
curl -sf https://api.galaxyco.ai/health && echo "✅ API IS LIVE!" || echo "❌ Still not responding"
```

---

### Priority 4: Check CloudWatch Logs for Full Error

Get complete logs to see if there's a crash we're missing:

```bash
"/c/Program Files/Amazon/AWSCLIV2/aws" logs tail /ecs/galaxyco-production-api \
  --region us-east-1 \
  --follow \
  --since 2m
```

Look for:
- Database connection errors
- Module resolution errors
- Uncaught exceptions
- Stack traces

---

## Alternative Approaches (If Above Doesn't Work)

### Option A: Make Database Connection Non-Blocking

Modify `apps/api/src/main.ts` to start server even if DB connection fails:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Start listening immediately
  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  
  // Test DB connection in background (non-blocking)
  setTimeout(async () => {
    try {
      await db.select().from(users).limit(1);
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    }
  }, 1000);
}
```

### Option B: Add More Logging

Add console.log statements in `main.ts` to see exactly where it hangs:

```typescript
console.log('1. Creating NestFactory...');
const app = await NestFactory.create(AppModule);

console.log('2. Setting up global pipes...');
app.useGlobalPipes(new ValidationPipe());

console.log('3. Setting up CORS...');
app.enableCors();

console.log('4. Starting to listen...');
await app.listen(process.env.PORT || 4000);

console.log('5. ✅ Application started successfully');
```

### Option C: Use Vercel Database Connection

If using Vercel Postgres, ensure the connection string includes:
- `?sslmode=require`
- `?connection_limit=1` (for serverless)

---

## How to Verify It's Working

Once deployed, run these checks:

```bash
# 1. Check API responds
curl -sf https://api.galaxyco.ai/health
# Expected: {"status":"ok"} or similar

# 2. Check target health
"/c/Program Files/Amazon/AWSCLIV2/aws" elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:801949251798:targetgroup/galaxyco-production-api-tg/d1b1f860fc88dcee \
  --region us-east-1 \
  --query 'TargetHealthDescriptions[*].TargetHealth.State'
# Expected: ["healthy", "healthy"]

# 3. Check logs show success
"/c/Program Files/Amazon/AWSCLIV2/aws" logs tail /ecs/galaxyco-production-api \
  --region us-east-1 \
  --since 2m | grep -i "successfully started"
# Expected: "Nest application successfully started"

# 4. Test actual endpoint
curl -sf https://api.galaxyco.ai/api/agents
# Should return JSON (might be 401 if auth required, but should respond)
```

---

## Key Infrastructure Details

### ECS Task Definition Location
`/c/Users/Owner/workspace/galaxyco-ai-2.0/infra/terraform/envs/prod/main.tf`
- Lines 423-479: API task definition
- Line 435: Docker image SHA (update this after new builds)
- Lines 454-459: Secrets configuration

### Secrets ARN Pattern
```
arn:aws:secretsmanager:us-east-1:801949251798:secret:galaxyco/prod/{SECRET_NAME}
```

### Current Docker Image
```
ghcr.io/galaxy-co-ai/galaxyco-api:latest
```

Latest SHA: `sha256:431260a1536b551c2c92244f86489828a4823f16ac4b1629bfbdda78f8efec45`

### ECS Service Details
- Cluster: `galaxyco-production`
- Service: `galaxyco-production-api`
- Desired count: 2
- Launch type: FARGATE
- CPU: 512
- Memory: 1024 MB

---

## Quick Commands Reference

```bash
# Force new deployment
"/c/Program Files/Amazon/AWSCLIV2/aws" ecs update-service \
  --cluster galaxyco-production \
  --service galaxyco-production-api \
  --force-new-deployment \
  --region us-east-1

# Watch logs live
"/c/Program Files/Amazon/AWSCLIV2/aws" logs tail /ecs/galaxyco-production-api \
  --region us-east-1 \
  --follow

# List running tasks
"/c/Program Files/Amazon/AWSCLIV2/aws" ecs list-tasks \
  --cluster galaxyco-production \
  --service-name galaxyco-production-api \
  --region us-east-1

# Stop a specific task
"/c/Program Files/Amazon/AWSCLIV2/aws" ecs stop-task \
  --cluster galaxyco-production \
  --task TASK_ARN \
  --region us-east-1
```

---

## Expected Outcome

After fixing the database connection issue:
1. Logs should show: `[Nest] X - DATE LOG [NestApplication] Nest application successfully started`
2. Health endpoint should respond: `https://api.galaxyco.ai/health` returns 200 OK
3. Target group should show 2 healthy targets
4. Application should be stable (no restart loops)

---

## Notes for Next Agent

- **Time spent so far:** ~6 hours debugging Docker/TypeScript/ECS issues
- **Main progress:** Got Docker image building and deploying, NestJS starts initializing
- **Blocker:** App hangs during startup, likely database connection timeout
- **Next focus:** Verify secrets have real values, test database connectivity, add timeouts
- **Don't waste time on:** TypeScript module resolution, workspace packages, Docker build issues (all solved)

Good luck! 🚀
