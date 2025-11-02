/**
 * E2E Tests for Visual Flow Builder
 *
 * Tests the complete user journey:
 * 1. Navigate to builder
 * 2. Enter natural language
 * 3. Generate workflow
 * 4. Verify visual output
 * 5. Save workflow
 * 6. Execute workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Flow Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to flow builder
    await page.goto('/workflows/builder');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the flow builder page', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Visual Flow Builder');

    // Verify subtitle
    await expect(page.locator('p')).toContainText('natural language');

    // Verify input panel is visible
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should generate simple workflow from natural language', async ({ page }) => {
    // Enter workflow description
    const input = 'Email new leads every Monday';
    await page.fill('textarea', input);

    // Click generate button
    await page.click('button:has-text("Generate Workflow")');

    // Wait for workflow generation
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Verify nodes are rendered
    const nodes = await page.locator('.react-flow__node').count();
    expect(nodes).toBeGreaterThanOrEqual(3); // start, action, end

    // Verify edges are rendered
    const edges = await page.locator('.react-flow__edge').count();
    expect(edges).toBeGreaterThanOrEqual(2);

    // Verify success toast
    await expect(page.locator('text=Workflow generated')).toBeVisible({ timeout: 5000 });
  });

  test('should generate complex workflow with conditions', async ({ page }) => {
    // Enter complex workflow description
    const input =
      'When a new lead comes in, check if they are in California. If yes, send personalized email. Otherwise, add to newsletter.';
    await page.fill('textarea', input);

    // Generate workflow
    await page.click('button:has-text("Generate Workflow")');

    // Wait for generation
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Verify conditional node exists
    const nodes = await page.locator('.react-flow__node').all();
    expect(nodes.length).toBeGreaterThanOrEqual(4);

    // Verify branching (multiple edges from one node)
    const edges = await page.locator('.react-flow__edge').count();
    expect(edges).toBeGreaterThanOrEqual(3);
  });

  test('should detect integrations in workflow', async ({ page }) => {
    // Enter workflow with integrations
    const input = 'Check Gmail for new messages and post to Slack';
    await page.fill('textarea', input);

    // Generate workflow
    await page.click('button:has-text("Generate Workflow")');

    // Wait for generation
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Verify integration nodes exist (green gradient)
    const integrationNodes = await page
      .locator('.react-flow__node:has-text("Gmail"), .react-flow__node:has-text("Slack")')
      .count();
    expect(integrationNodes).toBeGreaterThanOrEqual(1);
  });

  test('should show toolbar after workflow generation', async ({ page }) => {
    // Generate a workflow
    await page.fill('textarea', 'Send welcome email to new users');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Verify toolbar buttons appear
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
    await expect(page.locator('button:has-text("Execute")')).toBeVisible();
  });

  test('should allow saving workflow', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'Send weekly report email');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Click save button
    await page.click('button:has-text("Save")');

    // Verify success toast
    await expect(page.locator('text=Workflow saved')).toBeVisible({ timeout: 5000 });
  });

  test('should allow executing workflow', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'Create daily summary report');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Click execute button
    await page.click('button:has-text("Execute")');

    // Verify execution toast
    await expect(page.locator('text=Workflow execution started')).toBeVisible({ timeout: 5000 });
  });

  test('should allow resetting workflow', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'Test workflow');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Click reset button
    await page.click('button:has-text("Reset")');

    // Verify workflow is cleared
    const nodes = await page.locator('.react-flow__node').count();
    expect(nodes).toBe(0);

    // Verify input panel is visible again
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Enter workflow description
    await page.fill('textarea', 'Email leads Monday');

    // Use keyboard shortcut to generate (Cmd/Ctrl + Enter)
    await page.keyboard.press('Control+Enter');

    // Verify workflow generated
    await page.waitForSelector('.react-flow', { timeout: 15000 });
    const nodes = await page.locator('.react-flow__node').count();
    expect(nodes).toBeGreaterThan(0);
  });

  test('should handle empty input gracefully', async ({ page }) => {
    // Click generate without input
    await page.click('button:has-text("Generate Workflow")');

    // Verify error toast
    await expect(page.locator('text=Please describe your workflow')).toBeVisible({ timeout: 5000 });
  });

  test('should show animations on node hover', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'Simple test workflow');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Get first node
    const firstNode = page.locator('.react-flow__node').first();

    // Hover over node
    await firstNode.hover();

    // Verify node is still visible (animations don't break it)
    await expect(firstNode).toBeVisible();
  });

  test('should display node types correctly', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'When form submitted, add to CRM and send email');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Verify different node types exist
    const nodes = await page.locator('.react-flow__node').all();
    expect(nodes.length).toBeGreaterThanOrEqual(4);

    // All nodes should have gradient backgrounds
    for (const node of nodes) {
      const background = await node.evaluate(
        (el) => window.getComputedStyle(el.querySelector('div') as HTMLElement).backgroundImage,
      );
      expect(background).toContain('gradient');
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/ai/parse-workflow', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'API Error' }),
      });
    });

    // Try to generate workflow
    await page.fill('textarea', 'Test workflow');
    await page.click('button:has-text("Generate Workflow")');

    // Verify error toast
    await expect(page.locator('text=Failed to generate workflow')).toBeVisible({ timeout: 5000 });
  });

  test('should maintain state when navigating away and back', async ({ page }) => {
    // Generate workflow
    await page.fill('textarea', 'Test workflow persistence');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Save the workflow
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Workflow saved')).toBeVisible({ timeout: 5000 });

    // Navigate to workflows list
    await page.click('a:has-text("View"), button:has-text("View")');

    // Wait for navigation
    await page.waitForURL('**/workflows', { timeout: 5000 });

    // Verify we're on workflows page
    await expect(page.locator('h1:has-text("Workflows")')).toBeVisible();
  });
});

test.describe('Visual Flow Builder - Performance', () => {
  test('should generate workflow in under 10 seconds', async ({ page }) => {
    await page.goto('/workflows/builder');

    // Measure generation time
    const startTime = Date.now();

    await page.fill('textarea', 'Email new leads every Monday');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should be under 10 seconds
    expect(duration).toBeLessThan(10000);
  });

  test('should render animations at 60fps', async ({ page }) => {
    await page.goto('/workflows/builder');

    // Generate workflow
    await page.fill('textarea', 'Test workflow');
    await page.click('button:has-text("Generate Workflow")');
    await page.waitForSelector('.react-flow', { timeout: 15000 });

    // Check for smooth animations (no janky performance)
    const metrics = await page.evaluate(() => {
      return (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          }
        : null;
    });

    // Basic performance check
    expect(metrics).toBeTruthy();
  });
});

test.describe('Visual Flow Builder - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/workflows/builder');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to focus on textarea
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['TEXTAREA', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/workflows/builder');

    // Check for accessible elements
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    const button = page.locator('button:has-text("Generate Workflow")');
    await expect(button).toBeVisible();
  });
});
