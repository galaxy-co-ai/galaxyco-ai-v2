/**
 * Quick authentication test - Verifies we can login to app.galaxyco.ai
 * Run with: node scripts/test-auth.mjs
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const email = 'dalton@galaxyco.ai';
const password = process.env.GALAXYCO_TEST_PASSWORD || 'EnergyFX3_!';
const authFile = 'tests/.auth/user.json';

console.log('🔐 Testing authentication to app.galaxyco.ai');
console.log('📧 Email:', email);
console.log('🌐 Starting browser...');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

try {
  // Navigate to sign-in
  console.log('🌐 Navigating to sign-in page...');
  await page.goto('https://app.galaxyco.ai/sign-in', { timeout: 30000 });

  // Wait for Clerk form
  console.log('⏳ Waiting for sign-in form...');
  await page.waitForSelector('input[name="identifier"]', { timeout: 15000 });

  // Fill email
  console.log('📧 Entering email...');
  await page.fill('input[name="identifier"]', email);
  await page.click('button[type="submit"]');

  // Wait for password field
  console.log('⏳ Waiting for password field...');
  await page.waitForSelector('input[name="password"]', { timeout: 15000 });

  // Fill password
  console.log('🔑 Entering password...');
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for redirect
  console.log('⏳ Waiting for authentication...');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Success!
  console.log('✅ AUTHENTICATION SUCCESSFUL!');
  console.log('📸 Taking screenshot of dashboard...');
  await page.screenshot({
    path: 'tests/screenshots/dashboard-authenticated.png',
    fullPage: true,
  });

  // Save auth state
  console.log('💾 Saving authentication state...');
  const dir = dirname(authFile);
  mkdirSync(dir, { recursive: true });

  const storageState = await context.storageState();
  writeFileSync(authFile, JSON.stringify(storageState, null, 2));

  console.log('✅ Auth state saved to:', authFile);
  console.log('🎯 I can now browse your app autonomously!');
  console.log('🚀 Autonomous UI review system: OPERATIONAL');
} catch (error) {
  console.error('❌ Authentication failed:', error.message);
  await page.screenshot({ path: 'tests/screenshots/auth-error.png', fullPage: true });
  throw error;
} finally {
  await browser.close();
}
