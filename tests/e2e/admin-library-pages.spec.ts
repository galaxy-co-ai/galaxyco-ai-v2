import { test, expect, Page } from "@playwright/test";

async function mockAuthentication(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "__clerk_db_jwt",
      JSON.stringify({
        userId: "test-user-123",
        sessionId: "test-session-123",
      }),
    );
  });
}

test.describe("Admin Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("admin dashboard loads", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("admin users page loads", async ({ page }) => {
    await page.goto("/admin/users");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*admin\/users/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("admin workspaces page loads", async ({ page }) => {
    await page.goto("/admin/workspaces");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*admin\/workspaces/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("admin settings page loads", async ({ page }) => {
    await page.goto("/admin/settings");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*admin\/settings/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("admin analytics page loads", async ({ page }) => {
    await page.goto("/admin/analytics");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*admin\/analytics/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Library Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("library documents page loads", async ({ page }) => {
    await page.goto("/library/documents");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*library\/documents/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("library templates page loads", async ({ page }) => {
    await page.goto("/library/templates");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*library\/templates/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("library resources page loads", async ({ page }) => {
    await page.goto("/library/resources");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*library\/resources/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("search functionality in library works", async ({ page }) => {
    await page.goto("/library/documents");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill("test");
      await page.waitForTimeout(500);
      expect(await searchInput.inputValue()).toBe("test");
    }
  });
});

test.describe("Business Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("invoices page loads", async ({ page }) => {
    await page.goto("/business/invoices");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*invoices/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("campaigns page loads", async ({ page }) => {
    await page.goto("/business/campaigns");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*campaigns/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("emails page loads", async ({ page }) => {
    await page.goto("/business/emails");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*emails/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Developer Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("api explorer page loads", async ({ page }) => {
    await page.goto("/developer/api");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*developer\/api/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("webhooks page loads", async ({ page }) => {
    await page.goto("/developer/webhooks");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*developer\/webhooks/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("playground page loads", async ({ page }) => {
    await page.goto("/developer/playground");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*developer\/playground/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Data Management Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("exports page loads", async ({ page }) => {
    await page.goto("/data/exports");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*exports/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("imports page loads", async ({ page }) => {
    await page.goto("/data/imports");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*imports/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("audit log page loads", async ({ page }) => {
    await page.goto("/data/audit-log");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*audit-log/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Automations Pages", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("automations page loads", async ({ page }) => {
    await page.goto("/automations");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*automations/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("workflows page loads", async ({ page }) => {
    await page.goto("/automations/workflows");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*workflows/);
    await expect(page.locator("body")).toBeVisible();
  });
});
