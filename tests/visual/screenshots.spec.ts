import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests
 *
 * Captures screenshots of all pages at different viewports and compares
 * them to baseline images to detect unintended UI changes.
 *
 * To update baselines: npx playwright test --update-snapshots
 */

const pages = [
  { path: "/", name: "homepage" },
  { path: "/sign-in", name: "sign-in" },
  { path: "/sign-up", name: "sign-up" },
  { path: "/marketplace", name: "marketplace" },
  // Protected pages will redirect, but we can still capture the redirect
  { path: "/dashboard", name: "dashboard-redirect" },
  { path: "/agents", name: "agents-redirect" },
  { path: "/settings", name: "settings-redirect" },
];

test.describe("Visual Regression - Full Page Screenshots", () => {
  for (const { path, name } of pages) {
    test(`${name} - ${test.info().project.name}`, async ({ page }) => {
      await page.goto(path);

      // Wait for page to be stable
      await page.waitForLoadState("networkidle");

      // Wait a bit for any animations to complete
      await page.waitForTimeout(500);

      // Take full page screenshot
      await expect(page).toHaveScreenshot(
        `${name}-{TestInfo.project.name}.png`,
        {
          fullPage: true,
          animations: "disabled",
        },
      );
    });
  }
});

test.describe("Visual Regression - Above the Fold", () => {
  for (const { path, name } of pages) {
    test(`${name} - above fold - ${test.info().project.name}`, async ({
      page,
    }) => {
      await page.goto(path);

      // Wait for page to be stable
      await page.waitForLoadState("networkidle");

      // Wait for animations
      await page.waitForTimeout(500);

      // Take viewport screenshot (above the fold)
      await expect(page).toHaveScreenshot(
        `${name}-above-fold-{TestInfo.project.name}.png`,
        {
          fullPage: false,
          animations: "disabled",
        },
      );
    });
  }
});

test.describe("Visual Regression - Key Components", () => {
  test("homepage hero section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find and screenshot hero section (adjust selector as needed)
    const hero = page.locator("main").first();
    if (await hero.isVisible()) {
      await expect(hero).toHaveScreenshot("homepage-hero-section.png", {
        animations: "disabled",
      });
    }
  });

  test("navigation bar", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find navigation (adjust selector as needed)
    const nav = page.locator("nav").first();
    if (await nav.isVisible()) {
      await expect(nav).toHaveScreenshot("navigation-bar.png", {
        animations: "disabled",
      });
    }
  });
});

test.describe("Visual Regression - Responsive Design", () => {
  const responsivePages = [
    { path: "/", name: "homepage" },
    { path: "/marketplace", name: "marketplace" },
  ];

  for (const { path, name } of responsivePages) {
    test(`${name} - responsive breakpoints`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // The viewport is already set by Playwright config based on project
      // Just capture the screenshot
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(
        `${name}-responsive-{TestInfo.project.name}.png`,
        {
          fullPage: true,
          animations: "disabled",
        },
      );
    });
  }
});
