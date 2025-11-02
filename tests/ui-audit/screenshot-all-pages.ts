import { test } from '@playwright/test';

/**
 * Automated UI screenshot script
 * Captures all pages for UI audit and consistency analysis
 */

// Use saved auth state
test.use({ storageState: 'tests/.auth/user.json' });

const pages = [
  // Core Dashboard
  { path: '/dashboard', name: 'dashboard' },
  { path: '/agents', name: 'agents-list' },
  { path: '/agents/new', name: 'agents-new' },
  { path: '/workflows', name: 'workflows' },

  // CRM
  { path: '/crm/contacts', name: 'crm-contacts' },
  { path: '/crm/prospects', name: 'crm-prospects' },
  { path: '/crm/projects', name: 'crm-projects' },

  // Analytics
  { path: '/analytics', name: 'analytics-overview' },
  { path: '/analytics/usage', name: 'analytics-usage' },

  // Settings
  { path: '/settings', name: 'settings-overview' },
  { path: '/settings/profile', name: 'settings-profile' },
  { path: '/settings/team', name: 'settings-team' },
  { path: '/settings/workspace', name: 'settings-workspace' },

  // Business
  { path: '/business/campaigns', name: 'business-campaigns' },
  { path: '/business/emails', name: 'business-emails' },

  // Documents
  { path: '/library', name: 'library-overview' },
  { path: '/library/documents', name: 'library-documents' },

  // Admin
  { path: '/admin', name: 'admin-overview' },
  { path: '/admin/users', name: 'admin-users' },
  { path: '/admin/analytics', name: 'admin-analytics' },
];

test.describe('UI Audit - Screenshot All Pages', () => {
  for (const pageInfo of pages) {
    test(`capture ${pageInfo.name}`, async ({ page }) => {
      await page.goto(`https://app.galaxyco.ai${pageInfo.path}`);

      // Wait for page to be stable
      await page.waitForLoadState('networkidle');

      // Take full-page screenshot
      await page.screenshot({
        path: `tests/screenshots/audit/${pageInfo.name}.png`,
        fullPage: true,
      });

      // Take viewport screenshot (above-fold)
      await page.screenshot({
        path: `tests/screenshots/audit/${pageInfo.name}-viewport.png`,
        fullPage: false,
      });

      console.log(`✅ Captured ${pageInfo.name}`);
    });
  }
});

test('analyze UI consistency', async ({ page }) => {
  // This test will analyze all screenshots and generate report
  console.log('📊 UI Audit Complete - Review screenshots in tests/screenshots/audit/');
});
