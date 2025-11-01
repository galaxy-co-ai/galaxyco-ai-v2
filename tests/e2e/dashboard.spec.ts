import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Dashboard Page
 *
 * Tests dashboard data loading, metrics display, and agent status
 */

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

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('dashboard loads without errors', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays key metrics cards', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should have metric cards visible
    const metricsCards = page.locator('[class*="metric"], [class*="card"], [class*="stat"]');
    const cardCount = await metricsCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('shows active agents section', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for active agents section
    const activeAgentsSection = page.locator(
      ':has-text("Active Agents"), :has-text("active agent")',
    );
    const hasActiveAgentsSection = (await activeAgentsSection.count()) > 0;
    expect(hasActiveAgentsSection).toBeTruthy();
  });

  test('displays current time and date', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should show current time/date somewhere
    const timeElements = page.locator(':has-text("Time"), :has-text("Date")');
    const hasTimeDisplay = (await timeElements.count()) > 0;
    expect(hasTimeDisplay).toBeTruthy();
  });

  test('handles API errors gracefully', async ({ page }) => {
    await page.route('**/api/agents*', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should still render page without crashing
    await expect(page.locator('body')).toBeVisible();
  });

  test('shows loading state before data loads', async ({ page }) => {
    // Delay API response to catch loading state
    await page.route('**/api/agents*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/dashboard');

    // Should show loading indicator
    const loadingIndicator = page.locator(
      '[class*="spinner"], [class*="loading"], [role="status"]',
    );
    const hasLoadingState = (await loadingIndicator.count()) > 0;
    expect(hasLoadingState).toBeTruthy();
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find links to other sections
    const links = page.locator('a[href*="/agents"], a[href*="/analytics"]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to the linked page
      expect(page.url()).toContain(href || '');
    }
  });

  test('displays workspace context correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should show workspace name or indicator
    const workspaceElement = page.locator(':has-text("Workspace"), [class*="workspace"]');
    const hasWorkspaceContext = (await workspaceElement.count()) > 0;
    expect(hasWorkspaceContext).toBeTruthy();
  });
});

test.describe('Dashboard Responsiveness', () => {
  test('renders correctly on mobile viewport', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be visible and functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('renders correctly on tablet viewport', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });
});
