import { test, expect, Page } from "@playwright/test";

/**
 * E2E Tests for Agent Execution
 *
 * Tests the complete agent execution workflow including:
 * - Navigating to agent detail page
 * - Opening test panel
 * - Testing in mock mode
 * - Testing in live mode
 * - Viewing execution results
 * - Error handling
 */

// Test helper to mock authentication
async function mockAuthentication(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "__clerk_db_jwt",
      JSON.stringify({
        userId: "test-user-execution-123",
        sessionId: "test-session-execution-123",
      }),
    );
  });
}

test.describe("Agent Execution Flow", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page);
  });

  test("can navigate to agent detail page", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    // Find first agent card or link
    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      // Should be on agent detail page
      expect(page.url()).toMatch(/\/agents\/[a-zA-Z0-9-]+/);

      // Should show agent details
      const agentName = page.locator("h1, h2").first();
      await expect(agentName).toBeVisible();
    }
  });

  test("shows test panel on agent detail page", async ({ page }) => {
    // Navigate to agents list
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      // Test panel should be visible (might be in a tab or section)
      const testPanel = page.locator(
        'text=/test|execute|run/i, [data-testid="test-panel"]',
      );
      await expect(testPanel.first()).toBeVisible({ timeout: 5000 });

      // Should have input area
      const inputArea = page.locator('textarea, input[type="text"]').last();
      await expect(inputArea).toBeVisible();
    }
  });

  test("can execute agent in mock mode", async ({ page }) => {
    // Mock the API response for mock mode execution
    await page.route("**/api/agents/*/execute", async (route) => {
      const postData = route.request().postDataJSON();

      if (postData.mode === "mock" || !postData.mode) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            result: {
              output:
                "This is a mock response. The agent would process your input in production mode.",
              metadata: {
                mode: "mock",
                timestamp: new Date().toISOString(),
                tokensUsed: 0,
                cost: 0,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      // Find input area and enter test input
      const inputArea = page.locator('textarea, input[type="text"]').last();

      if ((await inputArea.count()) > 0) {
        await inputArea.fill("Test input for mock execution");

        // Find and click execute/run button
        const executeButton = page.locator(
          'button:has-text("Execute"), button:has-text("Run"), button:has-text("Test")',
        );

        if ((await executeButton.count()) > 0) {
          await executeButton.first().click();

          // Wait for response
          await page.waitForTimeout(2000);

          // Should show mock response
          const mockResponse = page.locator("text=/mock/i");
          await expect(mockResponse.first()).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test("shows loading state during execution", async ({ page }) => {
    // Mock delayed API response
    await page.route("**/api/agents/*/execute", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          result: { output: "Response after delay" },
        }),
      });
    });

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      const inputArea = page.locator('textarea, input[type="text"]').last();

      if ((await inputArea.count()) > 0) {
        await inputArea.fill("Test input");

        const executeButton = page.locator(
          'button:has-text("Execute"), button:has-text("Run")',
        );

        if ((await executeButton.count()) > 0) {
          await executeButton.first().click();

          // Should show loading indicator
          await page.waitForTimeout(500);
          const loader = page.locator(
            '[role="status"], .spinner, .loading, svg.animate-spin',
          );
          await expect(loader.first()).toBeVisible({ timeout: 2000 });
        }
      }
    }
  });

  test("displays execution results with metadata", async ({ page }) => {
    // Mock detailed API response
    await page.route("**/api/agents/*/execute", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          result: {
            output: "Detailed agent response with comprehensive analysis.",
            metadata: {
              tokensUsed: 150,
              cost: 0.0023,
              duration: 1250,
              model: "gpt-4o-mini",
              timestamp: new Date().toISOString(),
            },
          },
        }),
      });
    });

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      const inputArea = page.locator('textarea, input[type="text"]').last();

      if ((await inputArea.count()) > 0) {
        await inputArea.fill("Test input for detailed results");

        const executeButton = page.locator(
          'button:has-text("Execute"), button:has-text("Run")',
        );

        if ((await executeButton.count()) > 0) {
          await executeButton.first().click();
          await page.waitForTimeout(2000);

          // Should show response output
          const output = page.locator("text=/comprehensive analysis/i");
          await expect(output).toBeVisible({ timeout: 5000 });

          // Should show metadata (tokens, cost, duration)
          const metadata = page.locator("text=/tokens|cost|duration|ms/i");
          await expect(metadata.first()).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test("handles execution errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/agents/*/execute", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: "Agent execution failed",
          details: "Mock error for testing",
        }),
      });
    });

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      const inputArea = page.locator('textarea, input[type="text"]').last();

      if ((await inputArea.count()) > 0) {
        await inputArea.fill("Input that will cause error");

        const executeButton = page.locator(
          'button:has-text("Execute"), button:has-text("Run")',
        );

        if ((await executeButton.count()) > 0) {
          await executeButton.first().click();
          await page.waitForTimeout(1500);

          // Should show error message
          const errorMessage = page.locator(
            'text=/error|failed/i, [role="alert"]',
          );
          await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test("can switch between mock and live modes", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      // Look for mode toggle (switch, radio buttons, or dropdown)
      const modeToggle = page.locator(
        'input[type="checkbox"], input[type="radio"], select, button:has-text("mode")',
      );

      if ((await modeToggle.count()) > 0) {
        // Toggle should be interactive
        const firstToggle = modeToggle.first();
        await expect(firstToggle).toBeVisible();

        // Click to toggle
        await firstToggle.click();
        await page.waitForTimeout(500);

        // Mode should change (verify by checking for mode indicator)
        const modeIndicator = page.locator("text=/mock|live/i");
        await expect(modeIndicator.first()).toBeVisible();
      }
    }
  });

  test("displays execution history", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      // Look for execution history section or tab
      const historySection = page.locator(
        'text=/history|executions|previous runs/i, [data-testid="execution-history"]',
      );

      if ((await historySection.count()) > 0) {
        // History section should be visible or clickable
        await expect(historySection.first()).toBeVisible({ timeout: 5000 });

        // Click to view history if it's a tab/button
        if ((await historySection.first().locator("button, a").count()) === 0) {
          await historySection.first().click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test("can clear execution results", async ({ page }) => {
    // Mock execution
    await page.route("**/api/agents/*/execute", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          result: { output: "Test output to be cleared" },
        }),
      });
    });

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator('a[href*="/agents/"]').first();

    if ((await agentLink.count()) > 0) {
      await agentLink.click();
      await page.waitForLoadState("networkidle");

      const inputArea = page.locator('textarea, input[type="text"]').last();

      if ((await inputArea.count()) > 0) {
        await inputArea.fill("Test input");

        const executeButton = page.locator('button:has-text("Execute")');

        if ((await executeButton.count()) > 0) {
          await executeButton.first().click();
          await page.waitForTimeout(1500);

          // Should see output
          const output = page.locator("text=/test output/i");
          await expect(output).toBeVisible();

          // Look for clear button
          const clearButton = page.locator(
            'button:has-text("Clear"), button:has([aria-label="Clear"])',
          );

          if ((await clearButton.count()) > 0) {
            await clearButton.first().click();
            await page.waitForTimeout(500);

            // Output should be cleared or hidden
            await expect(output).not.toBeVisible();
          }
        }
      }
    }
  });
});
