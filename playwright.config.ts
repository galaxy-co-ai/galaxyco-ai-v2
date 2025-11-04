import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration for GalaxyCo.ai
 *
 * This configuration supports:
 * - Multiple viewports (mobile, tablet, desktop)
 * - Visual regression testing
 * - Accessibility testing
 * - Smoke tests for critical paths
 */
export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot on failure (also for visual regression)
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Visual regression testing configuration
  expect: {
    // To use: expect(page).toHaveScreenshot()
    toHaveScreenshot: {
      // Allow 20% pixel difference for visual tests
      threshold: 0.2,
      // Strict mode - requires exact match
      mode: 'strict',
    },
  },

  // Configure projects for major browsers and viewports
  projects: [
    // Desktop Chrome
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },

    // Desktop Large
    {
      name: 'Desktop Large',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Tablet
    {
      name: 'Tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },

    // Mobile (iPhone 12)
    {
      name: 'Mobile',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 },
      },
    },

    // Mobile Large (iPhone 12 Pro Max)
    {
      name: 'Mobile Large',
      use: {
        ...devices['iPhone 12 Pro Max'],
        viewport: { width: 414, height: 896 },
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
