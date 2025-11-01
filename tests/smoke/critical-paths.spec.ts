import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for Critical User Paths
 *
 * These tests validate that core functionality works without diving into details.
 * They should be fast and cover the happy path of key user flows.
 */

test.describe('Critical Pages Load', () => {
  test('homepage loads without errors', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify key elements exist
    await expect(page.locator('body')).toBeVisible();

    // No critical console errors
    expect(errors.filter((e) => !e.includes('DevTools'))).toHaveLength(0);
  });

  test('sign-in page is accessible', async ({ page }) => {
    await page.goto('/sign-in');

    // Verify page loaded
    await expect(page).toHaveURL(/.*sign-in/);

    // Check for sign-in form or Clerk component
    await page.waitForLoadState('networkidle');

    // Should have visible content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('sign-up page is accessible', async ({ page }) => {
    await page.goto('/sign-up');

    // Verify page loaded
    await expect(page).toHaveURL(/.*sign-up/);

    // Check for sign-up form or Clerk component
    await page.waitForLoadState('networkidle');

    // Should have visible content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Protected Pages', () => {
  test('dashboard redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await page.waitForURL(/.*sign-in/, { timeout: 10000 });
    expect(page.url()).toContain('sign-in');
  });

  test('agents page redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/agents');

    // Should redirect to sign-in
    await page.waitForURL(/.*sign-in/, { timeout: 10000 });
    expect(page.url()).toContain('sign-in');
  });

  test('marketplace loads without authentication', async ({ page }) => {
    const response = await page.goto('/marketplace');

    // Marketplace might be public
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('networkidle');
  });

  test('settings page redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/settings');

    // Should redirect to sign-in
    await page.waitForURL(/.*sign-in/, { timeout: 10000 });
    expect(page.url()).toContain('sign-in');
  });
});

test.describe('Navigation', () => {
  test('homepage has working navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for common navigation elements
    // Note: This is generic - adjust based on actual nav structure
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    // Should have some navigation links
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('No JavaScript Errors', () => {
  test('homepage loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // No page errors
    expect(errors).toHaveLength(0);
  });

  test('marketplace loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    // No page errors
    expect(errors).toHaveLength(0);
  });
});

test.describe('Performance Basics', () => {
  test('homepage loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load in under 5 seconds (generous for local dev)
    expect(loadTime).toBeLessThan(5000);
  });
});
