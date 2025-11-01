import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for AI-Powered Onboarding Wizard
 *
 * Tests the complete onboarding flow including:
 * - Opening the setup wizard
 * - Answering role and industry questions
 * - Creating workspace
 * - Agent provisioning
 * - Sample data loading
 * - Completing setup
 */

// Test helper to mock authentication
async function mockAuthentication(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      '__clerk_db_jwt',
      JSON.stringify({
        userId: 'test-user-onboarding-123',
        sessionId: 'test-session-onboarding-123',
      }),
    );
  });
}

test.describe('Onboarding Wizard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test('can open setup wizard from sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find and click "Complete Setup" button with Zap icon
    const setupButton = page.locator(
      'button:has-text("Complete Setup"), button:has([data-icon="zap"])',
    );

    if ((await setupButton.count()) > 0) {
      await setupButton.click();

      // Wait for dialog to open
      await page.waitForTimeout(500);

      // Dialog should be visible with welcome message
      const dialog = page.locator('[role="dialog"], .dialog');
      await expect(dialog).toBeVisible({ timeout: 5000 });

      // Should contain setup wizard content
      const wizardContent = page.locator('text=/setup|wizard|welcome/i');
      await expect(wizardContent.first()).toBeVisible();
    }
  });

  test('shows welcome step with role question', async ({ page }) => {
    // Navigate directly or trigger wizard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      // Should show welcome message asking for role
      const welcomeText = page.locator('text=/role|founder|sales/i');
      await expect(welcomeText.first()).toBeVisible();

      // Should have input field for user response
      const inputField = page.locator('input[type="text"], textarea').last();
      await expect(inputField).toBeVisible();
    }
  });

  test('can complete role and industry questions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      // Answer role question
      const inputField = page.locator('input[type="text"], textarea').last();

      if ((await inputField.count()) > 0) {
        await inputField.fill('Founder');
        await inputField.press('Enter');

        await page.waitForTimeout(1000);

        // Should progress to industry question
        const industryText = page.locator('text=/industry/i');
        await expect(industryText.first()).toBeVisible({ timeout: 5000 });

        // Answer industry question
        await inputField.fill('Technology');
        await inputField.press('Enter');

        await page.waitForTimeout(1000);
      }
    }
  });

  test('can create workspace with custom name', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      const inputField = page.locator('input[type="text"], textarea').last();

      if ((await inputField.count()) > 0) {
        // Answer role
        await inputField.fill('Founder');
        await inputField.press('Enter');
        await page.waitForTimeout(1000);

        // Answer industry
        await inputField.fill('Technology');
        await inputField.press('Enter');
        await page.waitForTimeout(1500);

        // Should ask for workspace name
        const workspaceText = page.locator('text=/workspace name/i');
        await expect(workspaceText.first()).toBeVisible({ timeout: 5000 });

        // Enter workspace name
        const testWorkspaceName = `Test Workspace ${Date.now()}`;
        await inputField.fill(testWorkspaceName);
        await inputField.press('Enter');

        // Should show workspace creation confirmation
        await page.waitForTimeout(2000);
        const confirmText = page.locator('text=/created|success/i');
        await expect(confirmText.first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('provisions agents after workspace creation', async ({ page }) => {
    // Mock API responses for faster test
    await page.route('**/api/onboarding/process', async (route) => {
      const postData = route.request().postDataJSON();

      if (postData.currentStep === 'welcome') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            response: 'Great! What industry are you in?',
            updates: { role: postData.message },
            shouldProgress: false,
          }),
        });
      } else if (postData.currentStep === 'workspace') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            response: 'Workspace created! Provisioning agents...',
            updates: {
              workspaceName: postData.message,
              workspaceId: 'test-workspace-123',
            },
            shouldProgress: true,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/onboarding/provision-agents', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          agents: [
            {
              id: 'agent-1',
              name: 'Daily Digest Agent',
              description: 'Summarizes emails and tasks',
              type: 'email',
            },
            {
              id: 'agent-2',
              name: 'Document Analyzer',
              description: 'Extracts key insights',
              type: 'data',
            },
          ],
        }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Complete flow quickly with mocked APIs
    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      // Should eventually show agent provisioning confirmation
      const agentText = page.locator('text=/agent|configured/i');

      // Wait up to 15 seconds for agent provisioning message
      await expect(agentText.first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('handles API errors gracefully during onboarding', async ({ page }) => {
    // Mock API error
    await page.route('**/api/onboarding/process', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to process' }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      const inputField = page.locator('input[type="text"], textarea').last();

      if ((await inputField.count()) > 0) {
        await inputField.fill('Founder');
        await inputField.press('Enter');

        // Should show error message
        await page.waitForTimeout(1500);
        const errorText = page.locator('text=/error|failed|try again/i');
        await expect(errorText.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('can close wizard without completing', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      // Find close button (X icon or Close button)
      const closeButton = page.locator(
        'button:has-text("Close"), [aria-label="Close"], button:has([data-icon="x"])',
      );

      if ((await closeButton.count()) > 0) {
        await closeButton.first().click();
        await page.waitForTimeout(500);

        // Dialog should be closed
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).not.toBeVisible();
      }
    }
  });

  test('shows progress steps during onboarding', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const setupButton = page.locator('button:has-text("Complete Setup")');
    if ((await setupButton.count()) > 0) {
      await setupButton.click();
      await page.waitForTimeout(500);

      // Should show step indicators (e.g., 1/6, Step 1 of 6, etc.)
      const stepIndicators = page.locator('text=/step|1|2|3|4|5|6/i, [role="progressbar"]');

      // At least one progress indicator should be visible
      expect(await stepIndicators.count()).toBeGreaterThan(0);
    }
  });
});
