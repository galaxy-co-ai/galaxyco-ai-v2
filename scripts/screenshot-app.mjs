/**
 * Autonomous UI Screenshot Script
 * Uses saved auth state to capture all pages
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const authFile = 'tests/.auth/user.json';
const screenshotDir = 'tests/screenshots/audit/current';

// Ensure directory exists
mkdirSync(screenshotDir, { recursive: true });

console.log('🚀 Starting autonomous UI audit...');
console.log('🔐 Loading saved authentication...');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: authFile,
});
const page = await context.newPage();

const pages = [
  { path: '/dashboard', name: 'dashboard' },
  { path: '/agents', name: 'agents-list' },
  { path: '/agents/new', name: 'agents-new' },
  { path: '/workflows', name: 'workflows' },
  { path: '/crm/contacts', name: 'crm-contacts' },
  { path: '/crm/prospects', name: 'crm-prospects' },
  { path: '/analytics', name: 'analytics' },
  { path: '/settings', name: 'settings' },
  { path: '/business/campaigns', name: 'business-campaigns' },
  { path: '/library', name: 'library' },
];

console.log(`📸 Capturing ${pages.length} pages...\n`);

for (const pageInfo of pages) {
  try {
    console.log(`📸 ${pageInfo.name}...`);
    await page.goto(`https://app.galaxyco.ai${pageInfo.path}`, {
      waitUntil: 'load',
      timeout: 30000,
    });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${screenshotDir}/${pageInfo.name}.png`,
      fullPage: true,
    });

    console.log(`  ✅ Captured`);
  } catch (error) {
    console.log(`  ⚠️  Error: ${error.message}`);
  }
}

await browser.close();

console.log('\n✅ UI Audit Complete!');
console.log(`📁 Screenshots saved to: ${screenshotDir}`);
console.log('🎯 I can now analyze all pages autonomously!');
