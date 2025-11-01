import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/sign-in', name: 'sign-in' },
  { path: '/sign-up', name: 'sign-up' },
  { path: '/marketplace', name: 'marketplace' },
];

test.describe('Visual Regression', () => {
  for (const { path, name } of pages) {
    test(`${name} screenshot`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
