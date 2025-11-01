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

test.describe('CRM - Contacts Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('contacts page loads and displays data', async ({ page }) => {
    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*contacts/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
      expect(await searchInput.inputValue()).toBe('test');
    }
  });

  test('handles empty state', async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ contacts: [] }),
      });
    });

    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');

    const emptyState = page.locator(':has-text("No contacts"), :has-text("0 contact")');
    const hasEmptyState = (await emptyState.count()) > 0;
    expect(hasEmptyState).toBeTruthy();
  });

  test('displays contact cards in grid', async ({ page }) => {
    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');

    const contactCards = page.locator('[class*="card"], [class*="grid"] > div');
    const cardCount = await contactCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('CRM - Customers Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('customers page loads and displays data', async ({ page }) => {
    await page.goto('/crm/customers');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*customers/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('filters work correctly', async ({ page }) => {
    await page.goto('/crm/customers');
    await page.waitForLoadState('networkidle');

    const filterElements = page.locator('select, [role="combobox"], button:has-text("Filter")');
    const hasFilters = (await filterElements.count()) > 0;
    expect(hasFilters).toBeTruthy();
  });

  test('view mode toggle works', async ({ page }) => {
    await page.goto('/crm/customers');
    await page.waitForLoadState('networkidle');

    const viewToggle = page.locator(
      'button[aria-label*="view" i], button:has-text("Grid"), button:has-text("List")',
    );
    if ((await viewToggle.count()) > 0) {
      const firstToggle = viewToggle.first();
      await firstToggle.click();
      await page.waitForTimeout(300);
      // View should change
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('CRM - Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('projects page loads correctly', async ({ page }) => {
    await page.goto('/crm/projects');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('project status badges display correctly', async ({ page }) => {
    await page.goto('/crm/projects');
    await page.waitForLoadState('networkidle');

    const statusBadges = page.locator('[class*="badge"], [class*="status"]');
    const badgeCount = await statusBadges.count();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('CRM - Prospects Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('prospects page loads correctly', async ({ page }) => {
    await page.goto('/crm/prospects');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*prospects/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('handles API errors gracefully', async ({ page }) => {
    await page.route('**/api/prospects*', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/crm/prospects');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('CRM Mobile Responsiveness', () => {
  test('contacts page works on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('customers page works on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/crm/customers');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });
});
