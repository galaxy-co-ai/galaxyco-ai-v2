import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Production Smoke Tests', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/health`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('timestamp');
  });

  test('homepage loads successfully', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check for essential elements
    await expect(page).toHaveTitle(/GalaxyCo/);
    
    // Verify no console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors).toHaveLength(0);
  });

  test('auth flow is accessible', async ({ page }) => {
    await page.goto(`${baseUrl}/sign-in`);
    
    // Wait for Clerk to load
    await page.waitForLoadState('networkidle');
    
    // Check if sign-in form is present
    const signInForm = page.locator('[data-testid=\"sign-in-form\"], .cl-signIn-start, .cl-rootBox');
    await expect(signInForm).toBeVisible({ timeout: 10000 });
  });

  test('database connection works', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/health/db`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('database', 'connected');
  });

  test('essential API routes respond', async ({ request }) => {
    // Test public API routes
    const publicRoutes = [
      '/api/health',
      '/api/health/db'
    ];
    
    for (const route of publicRoutes) {
      const response = await request.get(`${baseUrl}${route}`);
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('static assets load correctly', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check that favicon loads
    const favicon = await page.locator('link[rel*=\"icon\"]');
    if (await favicon.count() > 0) {
      const href = await favicon.getAttribute('href');
      if (href) {
        const response = await page.request.get(href.startsWith('http') ? href : `${baseUrl}${href}`);
        expect(response.status()).toBeLessThan(400);
      }
    }
  });

  test('performance baseline', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});