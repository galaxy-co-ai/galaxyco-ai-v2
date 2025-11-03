# AI-Powered Test Generation System

**Autonomous test generation for GalaxyCo components**

---

## 🎯 Overview

This system uses AI to automatically generate high-quality tests from components, Server Actions, and database queries. Tests are behavior-driven, comprehensive, and follow GalaxyCo standards.

---

## 🤖 Test Generation Commands

### 1. AI Generate Component Tests

**Command:** `ai-generate-tests`

**What it does:**
1. Analyzes component code
2. Identifies user interactions
3. Generates behavior-based tests
4. Includes accessibility tests
5. Creates mock data
6. Adds edge cases

**Prompt Template:**
```
Analyze this component and generate comprehensive tests:

File: {filePath}
Component: {componentName}

Generate Vitest tests that:
1. Test user behavior, not implementation
2. Include accessibility tests (WCAG AA)
3. Test loading states
4. Test error states
5. Test success flows
6. Mock all external dependencies
7. Achieve 80%+ coverage

Follow GalaxyCo testing standards from .cursor/rules/testing-standards.md
```

---

## 📋 Test Templates

### Component Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

import { ComponentName } from './component-name';

// Mock dependencies
vi.mock('@/lib/actions/action-name', () => ({
  actionName: vi.fn(),
}));

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render successfully with valid props', () => {
      render(<ComponentName data={mockData} />);
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByText('Expected text')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(<ComponentName data={mockData} isLoading={true} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render error state', () => {
      const error = 'Something went wrong';
      render(<ComponentName data={mockData} error={error} />);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(error)).toBeInTheDocument();
    });

    it('should render empty state', () => {
      render(<ComponentName data={[]} />);
      
      expect(screen.getByText(/no items/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      
      render(<ComponentName onAction={mockHandler} />);
      
      const button = screen.getByRole('button', { name: /action/i });
      await user.click(button);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();
      
      render(<ComponentName onSubmit={mockSubmit} />);
      
      const input = screen.getByRole('textbox', { name: /name/i });
      await user.type(input, 'Test Value');
      
      const submit = screen.getByRole('button', { name: /submit/i });
      await user.click(submit);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Value',
          })
        );
      });
    });

    it('should show loading state during async operation', async () => {
      const user = userEvent.setup();
      const slowAction = vi.fn(() => new Promise(resolve => 
        setTimeout(resolve, 100)
      ));
      
      render(<ComponentName onAction={slowAction} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Should show loading
      expect(button).toBeDisabled();
      expect(screen.getByText(/loading|processing/i)).toBeInTheDocument();
      
      // Should complete
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      render(<ComponentName data={null} />);
      
      expect(screen.getByText(/no items|empty/i)).toBeInTheDocument();
    });

    it('should handle undefined props gracefully', () => {
      render(<ComponentName />);
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      render(<ComponentName title={longText} />);
      
      // Should truncate or handle gracefully
      expect(screen.getByText(/a{1,}/)).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      const specialText = '<script>alert("xss")</script>';
      render(<ComponentName title={specialText} />);
      
      // Should escape HTML
      expect(screen.queryByRole('script')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ComponentName data={mockData} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      render(<ComponentName data={mockData} />);
      
      expect(screen.getByLabelText(/label text/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      
      render(<ComponentName onAction={mockHandler} />);
      
      // Tab to button
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();
      
      render(<ComponentName />);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      // Focus indicator should be visible (check computed styles)
      expect(button).toHaveFocus();
      const styles = window.getComputedStyle(button);
      expect(styles.outline).not.toBe('none');
    });
  });

  describe('Integration', () => {
    it('should integrate with Server Action', async () => {
      const user = userEvent.setup();
      const mockAction = vi.mocked(actionName);
      mockAction.mockResolvedValue({ success: true, data: { id: '123' } });
      
      render(<ComponentName />);
      
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled();
      });
    });

    it('should handle Server Action errors', async () => {
      const user = userEvent.setup();
      const mockAction = vi.mocked(actionName);
      mockAction.mockResolvedValue({ 
        success: false, 
        error: 'Operation failed' 
      });
      
      render(<ComponentName />);
      
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText('Operation failed')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should render large lists efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }));
      
      const { container } = render(<ComponentName data={largeData} />);
      
      // Should render without errors
      expect(container).toBeInTheDocument();
    });

    it('should not re-render unnecessarily', async () => {
      const renderSpy = vi.fn();
      
      function TestWrapper({ data }: any) {
        renderSpy();
        return <ComponentName data={data} />;
      }
      
      const { rerender } = render(<TestWrapper data={mockData} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same data
      rerender(<TestWrapper data={mockData} />);
      
      // Should use memoization
      expect(renderSpy).toHaveBeenCalledTimes(2); // Will depend on memoization
    });
  });
});

// Mock data factory
const mockData = {
  id: 'test-id',
  name: 'Test Name',
  description: 'Test Description',
  status: 'active',
  createdAt: new Date('2025-01-01'),
};
```

---

## 🔴 TDD Workflow Automation

### Red-Green-Refactor Cycle

**File:** `scripts/tdd-workflow.mjs`

```javascript
#!/usr/bin/env node

import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * TDD Workflow Automation
 * Guides through Red-Green-Refactor cycle
 */

async function tddWorkflow() {
  console.log(chalk.blue.bold('\n🔴 TDD Workflow: Red-Green-Refactor\n'));

  // Step 1: RED - Write failing test
  console.log(chalk.red.bold('STEP 1: RED - Write Failing Test'));
  
  const { testFile } = await inquirer.prompt([
    {
      type: 'input',
      name: 'testFile',
      message: 'Enter test file path:',
      default: 'apps/web/__tests__/component/my-component.test.tsx',
    },
  ]);

  console.log(chalk.yellow('\n📝 Write your failing test now...'));
  console.log(chalk.gray('Press Enter when ready to run tests'));
  await inquirer.prompt([{ type: 'confirm', name: 'ready', message: 'Ready?' }]);

  // Run tests (should fail)
  console.log(chalk.red('\n🔴 Running tests (should fail)...\n'));
  await runTests(testFile);

  // Step 2: GREEN - Make test pass
  console.log(chalk.green.bold('\nSTEP 2: GREEN - Make Test Pass'));
  console.log(chalk.yellow('💻 Implement the code to make tests pass...'));
  console.log(chalk.gray('Press Enter when ready to run tests'));
  await inquirer.prompt([{ type: 'confirm', name: 'ready', message: 'Ready?' }]);

  // Run tests (should pass)
  console.log(chalk.green('\n🟢 Running tests (should pass)...\n'));
  await runTests(testFile);

  // Step 3: REFACTOR - Improve code
  console.log(chalk.blue.bold('\nSTEP 3: BLUE - Refactor'));
  const { shouldRefactor } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldRefactor',
      message: 'Do you want to refactor?',
      default: true,
    },
  ]);

  if (shouldRefactor) {
    console.log(chalk.yellow('♻️  Refactor code while keeping tests green...'));
    console.log(chalk.gray('Press Enter when ready to verify tests'));
    await inquirer.prompt([{ type: 'confirm', name: 'ready', message: 'Ready?' }]);

    // Run tests (should still pass)
    console.log(chalk.green('\n🟢 Running tests (should still pass)...\n'));
    await runTests(testFile);
  }

  // Complete
  console.log(chalk.green.bold('\n✅ TDD Cycle Complete!\n'));

  // Ask if want to continue
  const { continue: shouldContinue } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Start another TDD cycle?',
      default: false,
    },
  ]);

  if (shouldContinue) {
    await tddWorkflow();
  }
}

function runTests(testFile) {
  return new Promise((resolve) => {
    const test = spawn('pnpm', ['test:run', testFile], {
      stdio: 'inherit',
      shell: true,
    });

    test.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('\n✅ Tests passed!'));
      } else {
        console.log(chalk.red('\n❌ Tests failed!'));
      }
      resolve();
    });
  });
}

// Run
tddWorkflow().catch(console.error);
```

---

## 📸 Visual Regression Testing

### Playwright Visual Testing Setup

**File:** `apps/web/__tests__/visual/visual-regression.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Dashboard page visual regression', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('dashboard-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Agents list visual regression', async ({ page }) => {
    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('agents-list.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Agent card component', async ({ page }) => {
    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');
    
    // Screenshot specific component
    const agentCard = page.locator('[data-testid="agent-card"]').first();
    await expect(agentCard).toHaveScreenshot('agent-card.png');
  });

  test('Form validation states', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/new');
    
    // Empty state
    await expect(page).toHaveScreenshot('form-empty.png');
    
    // Filled state
    await page.fill('[name="name"]', 'Test Agent');
    await expect(page).toHaveScreenshot('form-filled.png');
    
    // Error state
    await page.fill('[name="name"]', '');
    await page.click('[type="submit"]');
    await expect(page).toHaveScreenshot('form-error.png');
  });

  test('Dark mode visual regression', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500); // Wait for theme transition
    
    await expect(page).toHaveScreenshot('dashboard-dark.png', {
      fullPage: true,
    });
  });

  test('Mobile responsive visual regression', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
    });
  });

  test('Loading states visual regression', async ({ page }) => {
    // Intercept API to delay response
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto('http://localhost:3000/agents');
    
    // Capture loading state
    await expect(page).toHaveScreenshot('agents-loading.png');
  });
});
```

### Visual Testing Configuration

**File:** `playwright.config.visual.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/__tests__/visual',
  
  // Visual regression settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Allow small differences
      threshold: 0.2, // 20% tolerance
    },
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail fast on CI
  forbidOnly: !!process.env.CI,
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report/visual' }],
    ['junit', { outputFile: 'test-results/visual.xml' }],
  ],
  
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Test against multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server
  webServer: {
    command: 'cd apps/web && pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## 🤖 AI Test Generation Workflow

### How to Generate Tests Automatically

1. **Select component/action file**
2. **Open Cursor Agent**
3. **Prompt:**

```
Generate comprehensive tests for this file using the AI test generation template from .cursor/workflows/ai-test-generation.md

Requirements:
- Behavior-driven tests
- Accessibility tests (WCAG AA)
- Edge cases
- Mock all dependencies
- 80%+ coverage
- Follow testing-standards.md patterns

File: [current file]
```

4. **AI generates complete test file**
5. **Review and adjust**
6. **Run tests:** `pnpm test:run`

---

## 📊 Test Coverage Monitoring

### Automated Coverage Reports

**Script:** `scripts/test-coverage.sh`

```bash
#!/bin/bash

echo "📊 Running test coverage analysis..."

# Run tests with coverage
cd apps/web
pnpm test:coverage

# Check coverage thresholds
MIN_COVERAGE=80

COVERAGE=$(grep -oP 'All files.*?\|\s+\K[0-9.]+' coverage/coverage-summary.json | head -1)

if (( $(echo "$COVERAGE < $MIN_COVERAGE" | bc -l) )); then
  echo "❌ Coverage $COVERAGE% is below threshold $MIN_COVERAGE%"
  exit 1
else
  echo "✅ Coverage $COVERAGE% meets threshold $MIN_COVERAGE%"
fi
```

---

## ✅ Quality Gates

### Pre-Test Checklist

Before deploying, ensure:
- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] No accessibility violations
- [ ] Visual regression tests pass
- [ ] Performance tests pass
- [ ] Security tests pass

---

**🎯 AI-Powered Testing enables autonomous quality assurance!**

