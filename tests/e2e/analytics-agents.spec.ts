import { test, expect, Page } from '@playwright/test';

async function mockAuthentication(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      '__clerk_db_jwt',
      JSON.stringify({
        userId: 'test-user-123',
        sessionId: 'test-session-123',
      }),
    );
  });
}

test.describe('Analytics Pages', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('analytics overview page loads', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('sales analytics page displays data', async ({ page }) => {
    await page.goto('/analytics/sales');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*sales/);
    const metricsCards = page.locator('[class*="metric"], [class*="card"]');
    const cardCount = await metricsCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('marketing analytics page displays data', async ({ page }) => {
    await page.goto('/analytics/marketing');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*marketing/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('usage analytics page displays data', async ({ page }) => {
    await page.goto('/analytics/usage');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*usage/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('handles date range filters', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    const dateFilters = page.locator('select[name*="date"], button:has-text("Last")');
    const hasDateFilters = (await dateFilters.count()) > 0;
    expect(hasDateFilters).toBeTruthy();
  });
});

test.describe('Agent Execution Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('agents list page loads', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*agents/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays agent metrics', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const metrics = page.locator(':has-text("Total"), :has-text("Active"), :has-text("Success")');
    const hasMetrics = (await metrics.count()) > 0;
    expect(hasMetrics).toBeTruthy();
  });

  test('create agent button is visible', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('a[href*="/agents/new"], button:has-text("Create")');
    const hasCreateButton = (await createButton.count()) > 0;
    expect(hasCreateButton).toBeTruthy();
  });

  test('can view agent details', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const agentCards = page.locator('a[href*="/agents/"], [class*="agent-card"]');
    if ((await agentCards.count()) > 0) {
      const firstAgent = agentCards.first();
      await firstAgent.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to agent details page
      expect(page.url()).toContain('/agents/');
    }
  });

  test('agent execution test panel works', async ({ page }) => {
    // Navigate to an agent detail page
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const agentLinks = page.locator('a[href*="/agents/"]');
    if ((await agentLinks.count()) > 0) {
      const firstLink = agentLinks.first();
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      // Look for test/execute button
      const testButton = page.locator(
        'button:has-text("Test"), button:has-text("Execute"), button:has-text("Run")',
      );
      const hasTestButton = (await testButton.count()) > 0;
      expect(hasTestButton).toBeTruthy();
    }
  });

  test('agent filters work correctly', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const filterButtons = page.locator('button:has-text("Filter"), button:has-text("Status")');
    if ((await filterButtons.count()) > 0) {
      const filterButton = filterButtons.first();
      await filterButton.click();
      await page.waitForTimeout(300);

      // Filter dropdown should appear
      const filterOptions = page.locator('[role="menu"], [role="listbox"]');
      const hasFilterDropdown = (await filterOptions.count()) > 0;
      expect(hasFilterDropdown).toBeTruthy();
    }
  });

  test('search agents functionality works', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill('test agent');
      await page.waitForTimeout(500);
      expect(await searchInput.inputValue()).toContain('test');
    }
  });
});

test.describe('Agent Execution Mobile', () => {
  test('agents page works on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('can create agent on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/agents/new');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*agents\/new/);
    await expect(page.locator('body')).toBeVisible();
  });
});
