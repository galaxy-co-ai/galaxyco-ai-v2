# Authentication Security Test Plan

**Date**: 2025-10-17  
**Project**: GalaxyCo.ai 2.0 Platform  
**Test Framework**: Playwright + Manual Testing  
**Scope**: End-to-end authentication and authorization flows

---

## 1. Manual Test Cases

### 1.1 User Login Flow

| Test ID  | Test Case           | Steps                                                                                 | Expected Result                                   | Status        |
| -------- | ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------- |
| AUTH-001 | Valid login         | 1. Navigate to `/sign-in`<br>2. Enter valid credentials<br>3. Click "Sign In"         | Redirect to `/dashboard`<br>Session cookie set    | ⬜ Not Tested |
| AUTH-002 | Invalid login       | 1. Navigate to `/sign-in`<br>2. Enter invalid credentials<br>3. Click "Sign In"       | Error message displayed<br>No redirect            | ⬜ Not Tested |
| AUTH-003 | Logout              | 1. Login as valid user<br>2. Click "Sign Out"                                         | Redirect to `/`<br>Session cookie cleared         | ⬜ Not Tested |
| AUTH-004 | Session persistence | 1. Login<br>2. Close browser<br>3. Reopen browser<br>4. Navigate to `/dashboard`      | User still logged in<br>No re-login required      | ⬜ Not Tested |
| AUTH-005 | Session expiration  | 1. Login<br>2. Wait for session timeout (30 days)<br>3. Try accessing protected route | Redirect to `/sign-in`<br>Session expired message | ⬜ Not Tested |

### 1.2 User Registration Flow

| Test ID | Test Case            | Steps                                                                                     | Expected Result                                                    | Status        |
| ------- | -------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------- |
| REG-001 | Valid registration   | 1. Navigate to `/sign-up`<br>2. Enter valid email, password<br>3. Click "Sign Up"         | User created<br>Redirect to `/dashboard`<br>Workspace auto-created | ⬜ Not Tested |
| REG-002 | Invalid email format | 1. Navigate to `/sign-up`<br>2. Enter invalid email (e.g., "user@")<br>3. Click "Sign Up" | Error message: "Invalid email format"                              | ⬜ Not Tested |
| REG-003 | Weak password        | 1. Navigate to `/sign-up`<br>2. Enter weak password (e.g., "123")<br>3. Click "Sign Up"   | Error message: "Password too weak"                                 | ⬜ Not Tested |
| REG-004 | Duplicate email      | 1. Register with email A<br>2. Try registering again with email A                         | Error message: "Email already exists"                              | ⬜ Not Tested |

### 1.3 Protected Routes

| Test ID   | Test Case                            | Steps                                                           | Expected Result         | Status        |
| --------- | ------------------------------------ | --------------------------------------------------------------- | ----------------------- | ------------- |
| ROUTE-001 | Access `/dashboard` unauthenticated  | 1. Open incognito browser<br>2. Navigate to `/dashboard`        | Redirect to `/sign-in`  | ⬜ Not Tested |
| ROUTE-002 | Access `/agents` unauthenticated     | 1. Open incognito browser<br>2. Navigate to `/agents`           | Redirect to `/sign-in`  | ⬜ Not Tested |
| ROUTE-003 | Access `/settings` unauthenticated   | 1. Open incognito browser<br>2. Navigate to `/settings/profile` | Redirect to `/sign-in`  | ⬜ Not Tested |
| ROUTE-004 | Access public `/marketplace`         | 1. Open incognito browser<br>2. Navigate to `/marketplace`      | Page loads successfully | ⬜ Not Tested |
| ROUTE-005 | Access `/api/agents` unauthenticated | 1. Use curl/Postman<br>2. GET `/api/agents?workspaceId=test`    | HTTP 401 Unauthorized   | ⬜ Not Tested |

### 1.4 Multi-Workspace Access Control

| Test ID    | Test Case                         | Steps                                                                          | Expected Result                | Status        |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------ | ------------- |
| TENANT-001 | Access own workspace              | 1. Login as User A (Workspace W1)<br>2. GET `/api/agents?workspaceId=W1`       | HTTP 200, agents list returned | ⬜ Not Tested |
| TENANT-002 | Cross-workspace access blocked    | 1. Login as User A (Workspace W1)<br>2. GET `/api/agents?workspaceId=W2`       | HTTP 403 Forbidden             | ⬜ Not Tested |
| TENANT-003 | Agent creation in own workspace   | 1. Login as User A (Workspace W1)<br>2. POST `/api/agents` with workspaceId=W1 | HTTP 200, agent created        | ⬜ Not Tested |
| TENANT-004 | Agent creation in other workspace | 1. Login as User A (Workspace W1)<br>2. POST `/api/agents` with workspaceId=W2 | HTTP 403 Forbidden             | ⬜ Not Tested |
| TENANT-005 | Document access isolation         | 1. Login as User A (Workspace W1)<br>2. GET `/api/documents?workspaceId=W2`    | HTTP 403 Forbidden             | ⬜ Not Tested |

### 1.5 Rate Limiting

| Test ID  | Test Case                 | Steps                                                       | Expected Result                                                                                    | Status        |
| -------- | ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------- |
| RATE-001 | Agent creation rate limit | 1. Login<br>2. POST `/api/agents` 101 times                 | First 100: HTTP 200<br>101st: HTTP 429                                                             | ⬜ Not Tested |
| RATE-002 | Chat rate limit           | 1. Login<br>2. POST `/api/ai/chat` 101 times                | First 100: HTTP 200<br>101st: HTTP 429                                                             | ⬜ Not Tested |
| RATE-003 | Rate limit headers        | 1. Login<br>2. POST `/api/agents`                           | Response headers include:<br>`X-RateLimit-Limit`<br>`X-RateLimit-Remaining`<br>`X-RateLimit-Reset` | ⬜ Not Tested |
| RATE-004 | Rate limit reset          | 1. Hit rate limit<br>2. Wait for reset time<br>3. Try again | Request succeeds after reset                                                                       | ⬜ Not Tested |

---

## 2. Automated Test Suite (Playwright)

### 2.1 Setup

```typescript
// tests/auth/setup.ts
import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Login
  await page.goto("/sign-in");
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("/dashboard");

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
```

### 2.2 Test Suite: Authentication Flows

```typescript
// tests/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth

  test("should redirect to sign-in when accessing protected route", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    await page.waitForURL("/dashboard");
    expect(page.url()).toContain("/dashboard");
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForSelector("text=Invalid credentials", { timeout: 5000 });
    const errorMessage = await page.textContent(".error-message");
    expect(errorMessage).toContain("Invalid");
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Logout
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL("/");

    // Try accessing protected route
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });
});
```

### 2.3 Test Suite: API Authorization

```typescript
// tests/api/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("API Authentication", () => {
  const baseURL = process.env.BASE_URL || "http://localhost:3000";

  test("should return 401 for unauthenticated API request", async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/api/agents`, {
      params: { workspaceId: "test-workspace" },
    });
    expect(response.status()).toBe(401);
  });

  test("should return 403 for cross-workspace access", async ({ request }) => {
    // Get auth token for User A
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: process.env.TEST_USER_A_EMAIL,
        password: process.env.TEST_USER_A_PASSWORD,
      },
    });
    const { token } = await loginResponse.json();

    // Try accessing Workspace B's data
    const response = await request.get(`${baseURL}/api/agents`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { workspaceId: process.env.TEST_WORKSPACE_B_ID },
    });
    expect(response.status()).toBe(403);
  });

  test("should allow access to own workspace", async ({ request }) => {
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: process.env.TEST_USER_A_EMAIL,
        password: process.env.TEST_USER_A_PASSWORD,
      },
    });
    const { token } = await loginResponse.json();

    const response = await request.get(`${baseURL}/api/agents`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { workspaceId: process.env.TEST_WORKSPACE_A_ID },
    });
    expect(response.status()).toBe(200);
  });
});
```

### 2.4 Test Suite: Rate Limiting

```typescript
// tests/api/rate-limit.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Rate Limiting", () => {
  const baseURL = process.env.BASE_URL || "http://localhost:3000";

  test("should enforce rate limits on agent creation", async ({ request }) => {
    // Login
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
    });
    const { token, workspaceId } = await loginResponse.json();

    // Make 101 requests
    const responses = [];
    for (let i = 0; i < 101; i++) {
      const response = await request.post(`${baseURL}/api/agents`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          workspaceId,
          name: `Test Agent ${i}`,
          description: "Test agent for rate limiting",
          workflow: [],
        },
      });
      responses.push(response);
    }

    // First 100 should succeed
    const successful = responses.slice(0, 100).every((r) => r.status() === 200);
    expect(successful).toBe(true);

    // 101st should fail with 429
    expect(responses[100].status()).toBe(429);

    // Check rate limit headers
    const headers = responses[100].headers();
    expect(headers["x-ratelimit-limit"]).toBeDefined();
    expect(headers["x-ratelimit-remaining"]).toBe("0");
    expect(headers["x-ratelimit-reset"]).toBeDefined();
  });

  test("should reset rate limit after time window", async ({ request }) => {
    // Hit rate limit
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
    });
    const { token, workspaceId } = await loginResponse.json();

    // Make requests until rate limited
    let rateLimitResponse;
    for (let i = 0; i < 101; i++) {
      rateLimitResponse = await request.post(`${baseURL}/api/agents`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          workspaceId,
          name: `Test Agent ${i}`,
          description: "Test",
          workflow: [],
        },
      });
      if (rateLimitResponse.status() === 429) break;
    }

    // Get reset time
    const resetHeader = rateLimitResponse!.headers()["x-ratelimit-reset"];
    const resetTime = parseInt(resetHeader) * 1000;
    const waitTime = resetTime - Date.now() + 1000; // Add 1 second buffer

    // Wait for reset
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Try again
    const newResponse = await request.post(`${baseURL}/api/agents`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        workspaceId,
        name: "Test Agent After Reset",
        description: "Test",
        workflow: [],
      },
    });

    expect(newResponse.status()).toBe(200);
  });
});
```

### 2.5 Test Suite: Session Management

```typescript
// tests/auth/session.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Session Management", () => {
  test("should persist session across page reloads", async ({ page }) => {
    // Login
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Reload page
    await page.reload();

    // Should still be on dashboard
    expect(page.url()).toContain("/dashboard");
  });

  test("should clear session on logout", async ({ page, context }) => {
    // Login
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    // Logout
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL("/");

    // Check cookies cleared
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name.includes("clerk"));
    expect(sessionCookie).toBeUndefined();
  });

  test("should handle concurrent sessions", async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Login on both contexts
    for (const page of [page1, page2]) {
      await page.goto("/sign-in");
      await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
      await page.fill(
        'input[name="password"]',
        process.env.TEST_USER_PASSWORD!,
      );
      await page.click('button[type="submit"]');
      await page.waitForURL("/dashboard");
    }

    // Both should be logged in
    expect(page1.url()).toContain("/dashboard");
    expect(page2.url()).toContain("/dashboard");

    // Logout on page1
    await page1.click('button:has-text("Sign Out")');
    await page1.waitForURL("/");

    // Page2 should still be logged in
    await page2.reload();
    expect(page2.url()).toContain("/dashboard");

    await context1.close();
    await context2.close();
  });
});
```

---

## 3. Test Environment Setup

### 3.1 Environment Variables

```bash
# .env.test
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=testuser@galaxyco.ai
TEST_USER_PASSWORD=Test123!@#
TEST_USER_A_EMAIL=usera@galaxyco.ai
TEST_USER_A_PASSWORD=UserA123!
TEST_USER_B_EMAIL=userb@galaxyco.ai
TEST_USER_B_PASSWORD=UserB123!
TEST_WORKSPACE_A_ID=workspace-a-uuid
TEST_WORKSPACE_B_ID=workspace-b-uuid
```

### 3.2 Test Data Setup Script

```typescript
// scripts/setup-test-data.ts
import { db } from "@galaxyco/database";
import { users, workspaces, workspaceMembers } from "@galaxyco/database/schema";
import { hash } from "bcrypt";

async function setupTestData() {
  // Create Test User A (Workspace A)
  const userA = await db
    .insert(users)
    .values({
      clerkUserId: "test_user_a",
      email: "usera@galaxyco.ai",
      name: "Test User A",
    })
    .returning();

  const workspaceA = await db
    .insert(workspaces)
    .values({
      name: "Workspace A",
      slug: "workspace-a",
    })
    .returning();

  await db.insert(workspaceMembers).values({
    userId: userA[0].id,
    workspaceId: workspaceA[0].id,
    role: "owner",
    isActive: true,
  });

  // Create Test User B (Workspace B)
  const userB = await db
    .insert(users)
    .values({
      clerkUserId: "test_user_b",
      email: "userb@galaxyco.ai",
      name: "Test User B",
    })
    .returning();

  const workspaceB = await db
    .insert(workspaces)
    .values({
      name: "Workspace B",
      slug: "workspace-b",
    })
    .returning();

  await db.insert(workspaceMembers).values({
    userId: userB[0].id,
    workspaceId: workspaceB[0].id,
    role: "owner",
    isActive: true,
  });

  console.log("Test data created successfully!");
  console.log(`Workspace A ID: ${workspaceA[0].id}`);
  console.log(`Workspace B ID: ${workspaceB[0].id}`);
}

setupTestData().catch(console.error);
```

---

## 4. Running Tests

### 4.1 Install Dependencies

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
pnpm exec playwright install
```

### 4.2 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4.3 Run Tests

```bash
# Run all tests
pnpm exec playwright test

# Run specific test file
pnpm exec playwright test tests/auth/login.spec.ts

# Run tests in headed mode (see browser)
pnpm exec playwright test --headed

# Run tests in debug mode
pnpm exec playwright test --debug

# View test report
pnpm exec playwright show-report
```

---

## 5. Test Reporting

### 5.1 Generate Report

```bash
# Run tests and generate HTML report
pnpm exec playwright test --reporter=html

# Open report
pnpm exec playwright show-report
```

### 5.2 CI/CD Integration

```yaml
# .github/workflows/auth-tests.yml
name: Authentication Tests

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Run Playwright tests
        run: pnpm exec playwright test
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 6. Test Metrics & KPIs

### 6.1 Target Metrics

| Metric              | Target     | Current         |
| ------------------- | ---------- | --------------- |
| Test Coverage       | >80%       | ⬜ Not measured |
| Test Pass Rate      | >95%       | ⬜ Not measured |
| Test Execution Time | <5 minutes | ⬜ Not measured |
| Flaky Test Rate     | <5%        | ⬜ Not measured |

### 6.2 Security Test Checklist

- [ ] All protected routes require authentication
- [ ] Cross-workspace access is blocked
- [ ] Rate limits are enforced
- [ ] Session management works correctly
- [ ] Input validation prevents injection
- [ ] Logout clears all session data
- [ ] Password requirements are enforced
- [ ] Failed login attempts are logged

---

## 7. Next Steps

1. **Implement test suite** using Playwright
2. **Set up CI/CD pipeline** for automated testing
3. **Create test data fixtures** for consistent testing
4. **Run manual test cases** and document results
5. **Monitor test metrics** and improve coverage
6. **Schedule regular security audits** (quarterly)

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-17  
**Owner**: Engineering Team
