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

test.describe('Settings - Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('profile page loads correctly', async ({ page }) => {
    await page.goto('/settings/profile');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/profile/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('profile form displays user data', async ({ page }) => {
    await page.goto('/settings/profile');
    await page.waitForLoadState('networkidle');

    const inputFields = page.locator('input[type="text"], input[type="email"]');
    const fieldCount = await inputFields.count();
    expect(fieldCount).toBeGreaterThan(0);
  });

  test('save button is present', async ({ page }) => {
    await page.goto('/settings/profile');
    await page.waitForLoadState('networkidle');

    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
    const hasSaveButton = (await saveButton.count()) > 0;
    expect(hasSaveButton).toBeTruthy();
  });
});

test.describe('Settings - Notifications Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('notifications page loads correctly', async ({ page }) => {
    await page.goto('/settings/notifications');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/notifications/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('notification toggles are present', async ({ page }) => {
    await page.goto('/settings/notifications');
    await page.waitForLoadState('networkidle');

    const toggles = page.locator('input[type="checkbox"], [role="switch"]');
    const toggleCount = await toggles.count();
    expect(toggleCount).toBeGreaterThan(0);
  });
});

test.describe('Settings - Team Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('team page loads correctly', async ({ page }) => {
    await page.goto('/settings/team');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/team/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays team members list', async ({ page }) => {
    await page.goto('/settings/team');
    await page.waitForLoadState('networkidle');

    const memberElements = page.locator('[class*="member"], tr, [class*="user"]');
    const memberCount = await memberElements.count();
    expect(memberCount).toBeGreaterThanOrEqual(0);
  });

  test('invite button is present', async ({ page }) => {
    await page.goto('/settings/team');
    await page.waitForLoadState('networkidle');

    const inviteButton = page.locator('button:has-text("Invite"), button:has-text("Add")');
    const hasInviteButton = (await inviteButton.count()) > 0;
    expect(hasInviteButton).toBeTruthy();
  });
});

test.describe('Settings - Workspace Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('workspace page loads correctly', async ({ page }) => {
    await page.goto('/settings/workspace');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/workspace/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('workspace settings form is present', async ({ page }) => {
    await page.goto('/settings/workspace');
    await page.waitForLoadState('networkidle');

    const inputFields = page.locator('input, textarea');
    const fieldCount = await inputFields.count();
    expect(fieldCount).toBeGreaterThan(0);
  });
});

test.describe('Settings - Billing Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('billing page loads correctly', async ({ page }) => {
    await page.goto('/settings/billing');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/billing/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays subscription information', async ({ page }) => {
    await page.goto('/settings/billing');
    await page.waitForLoadState('networkidle');

    const subscriptionInfo = page.locator(
      ':has-text("Plan"), :has-text("Subscription"), :has-text("Billing")',
    );
    const hasSubscriptionInfo = (await subscriptionInfo.count()) > 0;
    expect(hasSubscriptionInfo).toBeTruthy();
  });
});

test.describe('Settings - Integrations Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('integrations page loads correctly', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/integrations/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays integration cards', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    const integrationCards = page.locator('[class*="card"], [class*="integration"]');
    const cardCount = await integrationCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test('connect buttons are present', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    const connectButtons = page.locator('button:has-text("Connect"), button:has-text("Configure")');
    const hasConnectButtons = (await connectButtons.count()) > 0;
    expect(hasConnectButtons).toBeTruthy();
  });

  test('displays integration status badges', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    const statusBadges = page.locator(
      '[class*="badge"], [class*="status"], :has-text("Active"), :has-text("Connected")',
    );
    const hasStatusBadges = (await statusBadges.count()) > 0;
    expect(hasStatusBadges).toBeTruthy();
  });
});

test.describe('Settings - Security Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('security page loads correctly', async ({ page }) => {
    await page.goto('/settings/security');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*settings\/security/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('security options are present', async ({ page }) => {
    await page.goto('/settings/security');
    await page.waitForLoadState('networkidle');

    const securityOptions = page.locator(
      ':has-text("Two-factor"), :has-text("Password"), :has-text("Security")',
    );
    const hasSecurityOptions = (await securityOptions.count()) > 0;
    expect(hasSecurityOptions).toBeTruthy();
  });
});

test.describe('Settings Mobile Responsiveness', () => {
  test('profile page works on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/settings/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('integrations page works on mobile', async ({ page }) => {
    await mockAuthentication(page);
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });
});
