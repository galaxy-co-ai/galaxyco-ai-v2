import { expect, test } from '@playwright/test';

/**
 * Visual Regression Tests for GalaxyCo.ai
 *
 * These tests capture screenshots and compare them against baseline images.
 * Run with: pnpm test:visual
 *
 * First run creates baseline images. Subsequent runs compare against baseline.
 * If visual changes detected, test fails and diff images are generated.
 */

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('Dashboard page visual regression', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Remove dynamic content that changes between runs
    await page.evaluate(() => {
      // Hide timestamps, user-specific content
      document.querySelectorAll('[data-testid="timestamp"]').forEach((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('Flow Builder visual regression', async ({ page }) => {
    await page.goto('/workflows/builder');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('flow-builder.png');
  });

  test('Marketplace page visual regression', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('marketplace.png');
  });

  test('Settings integrations page visual regression', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('settings-integrations.png');
  });

  test('Agent creation modal visual regression', async ({ page }) => {
    await page.goto('/agents');
    await page.waitForLoadState('networkidle');

    // Click create button to open modal
    const createButton = page.getByRole('button', { name: /create|new/i }).first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500); // Wait for modal animation

      await expect(page.locator('[role="dialog"]')).toHaveScreenshot('agent-create-modal.png');
    }
  });
});
