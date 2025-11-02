import { test as setup, expect } from '@playwright/test';

/**
 * Setup script to authenticate and save auth state for automated testing
 *
 * Uses shared credentials: dalton@galaxyco.ai
 * Password stored in: GALAXYCO_TEST_PASSWORD environment variable
 *
 * This runs once, saves auth state, then all tests can use it
 */

const authFile = 'tests/.auth/user.json';

setup('authenticate with shared account', async ({ page }) => {
  const email = 'dalton@galaxyco.ai';
  const password = process.env.GALAXYCO_TEST_PASSWORD || 'EnergyFX3_!';

  console.log('🔐 Authenticating as', email);
  console.log('🌐 Navigating to app.galaxyco.ai...');

  try {
    // Navigate to sign-in page
    await page.goto('https://app.galaxyco.ai/sign-in', { timeout: 30000 });
    console.log('✅ Page loaded');

    // Wait for Clerk sign-in form to load
    await page.waitForSelector('input[name="identifier"]', { timeout: 15000 });
    console.log('✅ Sign-in form ready');

    // Fill in email
    await page.fill('input[name="identifier"]', email);
    await page.click('button[type="submit"]');
    console.log('✅ Email submitted');

    // Wait for password field
    await page.waitForSelector('input[name="password"]', { timeout: 15000 });
    console.log('✅ Password field ready');

    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    console.log('✅ Password submitted');

    // Wait for successful authentication (redirects to dashboard)
    await page.waitForURL('**/dashboard', { timeout: 20000 });
    console.log('✅ Redirected to dashboard - authentication successful!');

    // Save authenticated state
    await page.context().storageState({ path: authFile });

    console.log('✅ Authentication state saved to', authFile);
    console.log('🎯 All future tests can now access authenticated app');
    console.log('🚀 Autonomous UI review system is now OPERATIONAL!');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    // Take screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/auth-error.png', fullPage: true });
    throw error;
  }
});
