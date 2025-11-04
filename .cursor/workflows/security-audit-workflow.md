# Security Audit Workflow

**Comprehensive security audit workflow for GalaxyCo features**

---

## 🎯 Objective

Identify and fix security vulnerabilities in GalaxyCo codebase, with special focus on multi-tenant isolation and input validation.

---

## 🔒 Security Checklist

### Critical Security Requirements

1. **Multi-Tenant Isolation (MANDATORY)**
   - [ ] Every database query filters by orgId
   - [ ] Server Actions verify orgId from auth
   - [ ] No cross-organization data leakage possible

2. **Input Validation**
   - [ ] All user input validated with Zod schemas
   - [ ] No direct database queries with unvalidated input
   - [ ] File uploads have type and size validation

3. **Authentication & Authorization**
   - [ ] Protected routes use auth middleware
   - [ ] Server Actions check authentication
   - [ ] Proper role-based access control

4. **Error Handling**
   - [ ] No technical errors exposed to users
   - [ ] All errors logged securely
   - [ ] Try-catch blocks around all async operations

5. **Data Exposure**
   - [ ] No sensitive data in client-side code
   - [ ] API keys in environment variables
   - [ ] No console.log in production code

---

## 📋 Audit Steps

### Step 1: Database Query Audit

**Find all database queries:**

```bash
# Search for database queries
rg "db\.(select|insert|update|delete)" --type typescript
```

**Check each query for:**

```typescript
// ❌ SECURITY VIOLATION: Missing orgId filter
await db.select().from(agents);

// ✅ CORRECT: orgId filtering
await db.select().from(agents).where(eq(agents.orgId, orgId));
```

**Common violations:**

- Missing orgId in WHERE clause
- Using raw SQL without parameterization
- Not verifying orgId from auth

**Fix template:**

```typescript
// Before (INSECURE)
export async function getAgents() {
  return await db.select().from(agents);
}

// After (SECURE)
export async function getAgents() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  return await db.select().from(agents).where(eq(agents.orgId, orgId)); // MANDATORY orgId filter
}
```

---

### Step 2: Server Action Audit

**Find all Server Actions:**

```bash
# Search for 'use server' directives
rg "^'use server'" --type typescript
```

**Check each action for:**

1. **Zod Validation**

```typescript
// ❌ VIOLATION: No input validation
export async function createAgent(data: any) {
  await db.insert(agents).values(data);
}

// ✅ CORRECT: Zod validation
const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function createAgent(input: unknown) {
  const validated = createAgentSchema.parse(input); // Validates
  // ... rest of logic
}
```

2. **Auth Check**

```typescript
// ❌ VIOLATION: No auth check
export async function createAgent(data: CreateAgentInput) {
  await db.insert(agents).values(data);
}

// ✅ CORRECT: Auth verification
export async function createAgent(data: CreateAgentInput) {
  const { orgId } = await auth();

  if (!orgId) {
    return { success: false, error: 'Unauthorized' };
  }

  await db.insert(agents).values({
    ...data,
    orgId, // Set from auth, not from user input
  });
}
```

3. **Error Handling**

```typescript
// ❌ VIOLATION: Technical error exposed
export async function createAgent(data: CreateAgentInput) {
  const result = await db.insert(agents).values(data);
  return result; // Might throw database error to user
}

// ✅ CORRECT: User-friendly errors
export async function createAgent(data: CreateAgentInput) {
  try {
    const result = await db.insert(agents).values(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating agent:', error); // Log technical details
    return {
      success: false,
      error: 'Failed to create agent. Please try again.', // User-friendly message
    };
  }
}
```

---

### Step 3: Component Security Audit

**Find all Client Components:**

```bash
# Search for 'use client' directives
rg "^'use client'" --type typescript
```

**Check for:**

1. **Sensitive Data Exposure**

```typescript
// ❌ VIOLATION: Exposing sensitive data
'use client';

export function UserProfile() {
  const [user, setUser] = useState({
    email: 'user@example.com',
    apiKey: 'sk-1234567890', // ❌ API key in client!
  });

  return <div>{user.apiKey}</div>; // ❌ Displaying API key!
}

// ✅ CORRECT: No sensitive data
'use client';

export function UserProfile() {
  const [user, setUser] = useState({
    email: 'user@example.com',
    // API key fetched server-side only
  });

  return <div>{user.email}</div>;
}
```

2. **Console Logs**

```typescript
// ❌ VIOLATION: Console logs in production
'use client';

export function DataDisplay({ data }: Props) {
  console.log('User data:', data); // ❌ Exposes data in browser console

  return <div>{data.name}</div>;
}

// ✅ CORRECT: No console logs
'use client';

export function DataDisplay({ data }: Props) {
  return <div>{data.name}</div>;
}
```

---

### Step 4: Environment Variables Audit

**Check for hardcoded secrets:**

```bash
# Search for potential hardcoded secrets
rg "(api_key|apiKey|secret|password|token)" --type typescript -i
```

**Violations to look for:**

```typescript
// ❌ VIOLATION: Hardcoded API key
const OPENAI_API_KEY = 'sk-1234567890';

// ❌ VIOLATION: Hardcoded database URL
const DATABASE_URL = 'postgres://user:pass@localhost:5432/db';

// ✅ CORRECT: Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
```

**Check `.env.example` exists:**

```bash
# Verify .env.example has all required variables
cat .env.example
```

---

### Step 5: Authentication Routes Audit

**Check protected routes:**

```bash
# Find all route files
find apps/web/app -name "page.tsx"
```

**Verify each route has auth:**

```typescript
// ❌ VIOLATION: No auth check
export default async function DashboardPage() {
  const agents = await getAgents(); // What if user not logged in?
  return <div>{/* ... */}</div>;
}

// ✅ CORRECT: Auth verification
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const agents = await getAgents();
  return <div>{/* ... */}</div>;
}
```

---

### Step 6: File Upload Security

**Check file upload endpoints:**

```bash
# Search for file upload handlers
rg "(formData|FileReader|upload)" --type typescript
```

**Verify:**

1. File type validation
2. File size limits
3. Virus scanning (if applicable)
4. Secure storage

```typescript
// ❌ VIOLATION: No validation
export async function uploadFile(file: File) {
  await saveFile(file); // No checks!
}

// ✅ CORRECT: Validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadFile(file: File) {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Invalid file type' };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File too large (max 5MB)' };
  }

  // Proceed with upload
  await saveFile(file);
}
```

---

### Step 7: XSS Prevention

**Check for dangerous patterns:**

```bash
# Search for dangerouslySetInnerHTML
rg "dangerouslySetInnerHTML" --type typescript
```

```typescript
// ❌ VIOLATION: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECT: Sanitized HTML
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitized }} />

// ✅ BETTER: Avoid HTML injection entirely
<div>{userInput}</div>
```

---

## 🛠️ Automated Security Checks

### Run Security Audit Script

Create `scripts/security-audit.sh`:

```bash
#!/bin/bash

echo "🔒 Running GalaxyCo Security Audit..."
echo ""

# Check 1: Find queries without orgId filtering
echo "Checking for missing orgId filters..."
rg "db\.(select|query)" --type typescript | \
  grep -v "orgId" | \
  wc -l

# Check 2: Find 'use server' without auth check
echo "Checking Server Actions for auth..."
rg -A 10 "^'use server'" --type typescript | \
  grep -c "await auth()"

# Check 3: Find console.log in production code
echo "Checking for console.log..."
rg "console\.log" apps/web --type typescript | \
  grep -v "__tests__" | \
  wc -l

# Check 4: Find hardcoded secrets
echo "Checking for hardcoded secrets..."
rg "(sk-|postgres://|mysql://)" --type typescript | \
  grep -v ".env" | \
  grep -v "example" | \
  wc -l

# Check 5: Find missing try-catch
echo "Checking for missing error handling..."
rg "async function" --type typescript | \
  wc -l

echo ""
echo "✅ Security audit complete"
```

### Run the audit:

```bash
chmod +x scripts/security-audit.sh
./scripts/security-audit.sh
```

---

## 📊 Security Report Template

After audit, create report:

````markdown
# Security Audit Report

**Date:** [Date]
**Audited By:** [Name]
**Scope:** [Files/Features audited]

## Summary

- **Critical Issues:** X
- **High Priority:** X
- **Medium Priority:** X
- **Low Priority:** X

## Critical Issues

### 1. Missing orgId Filter in [Function]

**File:** `apps/web/lib/queries/get-agents.ts`
**Line:** 10
**Risk:** Cross-organization data leakage
**Fix:**

```typescript
// Add orgId filter
.where(eq(agents.orgId, orgId))
```
````

### 2. Unvalidated Input in [Action]

**File:** `apps/web/lib/actions/create-agent.ts`
**Line:** 5
**Risk:** SQL injection, invalid data
**Fix:**

```typescript
// Add Zod validation
const validated = createAgentSchema.parse(input);
```

## Recommendations

1. Implement automated security checks in CI/CD
2. Add pre-commit hooks for security rules
3. Regular security audits (monthly)
4. Team training on security patterns

## Next Steps

- [ ] Fix all critical issues
- [ ] Fix high priority issues
- [ ] Schedule follow-up audit
- [ ] Update security documentation

```

---

## ✅ Security Sign-Off Checklist

Before deploying to production:

- [ ] All database queries filter by orgId
- [ ] All Server Actions validate input with Zod
- [ ] All Server Actions check authentication
- [ ] No technical errors exposed to users
- [ ] No console.log in production code
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] File uploads validated
- [ ] Protected routes require auth
- [ ] XSS prevention implemented
- [ ] CSRF tokens used (if applicable)
- [ ] Rate limiting configured
- [ ] Security audit report created
- [ ] All critical issues fixed

---

## 🚨 Emergency Response

If security vulnerability found in production:

1. **Assess severity** - Critical, High, Medium, Low
2. **Immediate mitigation** - Hotfix or feature flag
3. **Deploy fix** - Emergency deployment process
4. **Notify affected users** - If data breach
5. **Post-mortem** - Document and prevent recurrence

---

## 📚 Security Resources

- Database rules: `.cursor/rules/database-rules.md`
- API conventions: `.cursor/rules/api-conventions.md`
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Clerk security: https://clerk.com/docs/security

---

**Remember: Security is not optional. Every query, every action, every input must be secured.**

```
