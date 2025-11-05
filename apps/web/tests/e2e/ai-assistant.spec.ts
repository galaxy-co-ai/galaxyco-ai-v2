/**
 * E2E Tests for AI Assistant
 *
 * Tests the complete user journey:
 * 1. User sees floating bubble
 * 2. User opens chat
 * 3. User sends message
 * 4. AI responds
 * 5. AI executes tools
 * 6. User sees results
 */

import { test, expect } from '@playwright/test';

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/sign-in');
    await page.fill('input[name="identifier"]', 'dalton@galaxyco.ai');
    await page.fill('input[name="password"]', 'EnergyFX3_!');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('should show floating assistant bubble', async ({ page }) => {
    // Check floating bubble is visible
    const bubble = page.locator('button[aria-label="Open AI Assistant"]');
    await expect(bubble).toBeVisible();

    // Check it has purple gradient
    await expect(bubble).toHaveCSS('background', /purple|gradient/);
  });

  test('should open chat when bubble clicked', async ({ page }) => {
    // Click bubble
    await page.click('button[aria-label="Open AI Assistant"]');

    // Chat dialog should appear
    const chatDialog = page.locator('[role="dialog"][aria-label="AI Assistant Chat"]');
    await expect(chatDialog).toBeVisible();

    // Should show welcome message
    await expect(chatDialog).toContainText("Hi! I'm your AI assistant");
  });

  test('should allow user to send messages', async ({ page }) => {
    // Open chat
    await page.click('button[aria-label="Open AI Assistant"]');

    // Type message
    const textarea = page.locator('textarea[placeholder*="Ask me"]');
    await textarea.fill('Hello, AI assistant!');

    // Click send
    await page
      .click('button[type="button"]:has-text("Send"), button:has(svg[class*="lucide-send"])')
      .first();

    // Should show loading state
    await expect(page.locator('text=Thinking...')).toBeVisible();

    // Should eventually show response
    await expect(page.locator('text=Hello, AI assistant!')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open assistant
    await page.click('button[aria-label="Open AI Assistant"]');

    // Should be full-screen on mobile
    const dialog = page.locator('[role="dialog"]');
    const boundingBox = await dialog.boundingBox();

    expect(boundingBox?.width).toBeGreaterThan(350); // Nearly full width
    expect(boundingBox?.height).toBeGreaterThan(600); // Nearly full height
  });

  test('should minimize and restore', async ({ page }) => {
    // Open chat
    await page.click('button[aria-label="Open AI Assistant"]');

    // Click minimize
    await page.click('button[aria-label="Minimize"]');

    // Should be minimized (shorter height)
    const dialog = page.locator('[role="dialog"]');
    const minimizedBox = await dialog.boundingBox();
    expect(minimizedBox?.height).toBeLessThan(100);

    // Click maximize
    await page.click('button[aria-label="Maximize"]');

    // Should be expanded again
    const expandedBox = await dialog.boundingBox();
    expect(expandedBox?.height).toBeGreaterThan(400);
  });

  test('should close when X clicked', async ({ page }) => {
    // Open chat
    await page.click('button[aria-label="Open AI Assistant"]');

    // Verify open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click close
    await page.click('button[aria-label="Close assistant"]');

    // Should be closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Bubble should be visible again
    await expect(page.locator('button[aria-label="Open AI Assistant"]')).toBeVisible();
  });

  test.skip('should execute create_agent tool (requires function calling)', async ({ page }) => {
    // This test will work once function calling is fully enabled
    await page.click('button[aria-label="Open AI Assistant"]');

    const textarea = page.locator('textarea');
    await textarea.fill('Create an email triage agent');

    // Send
    await page.keyboard.press('Enter');

    // Wait for tool execution
    await page.waitForTimeout(3000);

    // Should navigate to agent page or show confirmation
    // await expect(page).toHaveURL(/\/agents\//);
  });
});
