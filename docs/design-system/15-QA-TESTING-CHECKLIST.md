# QA & Testing Checklist

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Testing Framework:** Vitest + Playwright + Testing Library  
**Status:** Ready for Implementation

---

## Testing Strategy

### Test Pyramid
```
      /\
     /E2E\         ← 10% (Critical user flows)
    /------\
   /Integration\   ← 30% (Component interactions)
  /------------\
 /  Unit Tests  \  ← 60% (Component logic)
/----------------\
```

---

## Unit Testing (Vitest + Testing Library)

### Setup (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
});
```

### Test Setup (src/tests/setup.ts)
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

### Component Test Template

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });
  
  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });
  
  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Submit form');
  });
});
```

---

### Hook Test Template

```typescript
// useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
  
  it('logs in user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

---

## Integration Testing

### Form Submission Test

```typescript
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm integration', () => {
  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('shows validation errors', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
```

---

## E2E Testing (Playwright)

### Playwright Config (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
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
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### E2E Test Template

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });
  
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

---

### Critical User Flow Test

```typescript
// tests/e2e/agent-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('creates new agent from template', async ({ page }) => {
    // Navigate to agents
    await page.click('text=Agents');
    await expect(page).toHaveURL('/agents');
    
    // Click "New Agent"
    await page.click('button:has-text("New Agent")');
    await expect(page).toHaveURL('/agents/new');
    
    // Select template
    await page.click('text=Sales Outreach');
    await page.click('button:has-text("Next")');
    
    // Configure agent
    await page.fill('input[name="name"]', 'My Sales Agent');
    await page.fill('textarea[name="description"]', 'Automates sales outreach');
    await page.click('button:has-text("Next")');
    
    // Test agent
    await page.fill('textarea[name="testInput"]', 'Test data');
    await page.click('button:has-text("Run Test")');
    await expect(page.locator('text=Test completed')).toBeVisible({ timeout: 10000 });
    
    // Deploy
    await page.click('button:has-text("Deploy")');
    await expect(page.locator('text=Agent deployed successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/agents\/\w+/);
  });
});
```

---

## Accessibility Testing

### axe-core Integration

```typescript
// tests/a11y/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('dashboard should not have accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('agent creation flow should be keyboard accessible', async ({ page }) => {
    await page.goto('/agents/new');
    
    // Navigate with Tab key
    await page.keyboard.press('Tab'); // Focus on first input
    await page.keyboard.type('Test Agent');
    await page.keyboard.press('Tab'); // Focus on description
    await page.keyboard.type('Test description');
    await page.keyboard.press('Tab'); // Focus on Next button
    await page.keyboard.press('Enter');
    
    // Verify navigation worked
    await expect(page.locator('text=Step 2')).toBeVisible();
  });
});
```

---

## Visual Regression Testing

### Playwright Visual Comparison

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('button variants match snapshots', async ({ page }) => {
    await page.goto('/storybook?path=/story/button--variants');
    
    await expect(page).toHaveScreenshot('button-variants.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
  
  test('dashboard layout matches snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      mask: [page.locator('.dynamic-content')], // Mask dynamic elements
    });
  });
});
```

---

## Manual QA Checklist

### Component QA (Per Component)

#### Visual
- [ ] All variants render correctly
- [ ] All sizes render correctly
- [ ] Dark mode works (colors, contrast)
- [ ] Hover states visible
- [ ] Focus states visible (keyboard nav)
- [ ] Active/pressed states visible
- [ ] Disabled states styled correctly
- [ ] Loading states clear

#### Functional
- [ ] Click handlers fire
- [ ] onChange handlers fire with correct values
- [ ] Form validation works
- [ ] Keyboard shortcuts work
- [ ] Disabled prop prevents interaction
- [ ] Loading state prevents interaction

#### Responsive
- [ ] Mobile sizes work (320px-768px)
- [ ] Tablet sizes work (768px-1024px)
- [ ] Desktop sizes work (1024px+)
- [ ] Touch targets ≥44px × 44px
- [ ] No horizontal overflow
- [ ] Text wraps appropriately

#### Accessibility
- [ ] Focus ring visible on keyboard nav
- [ ] Screen reader labels present
- [ ] ARIA attributes correct
- [ ] Color contrast passes WCAG AA (4.5:1)
- [ ] Interactive elements keyboard accessible
- [ ] Error messages announced

---

### Page QA (Per Page)

#### Layout
- [ ] Header/nav renders correctly
- [ ] Sidebar (if present) works
- [ ] Footer renders correctly
- [ ] Content area scrolls properly
- [ ] Sticky elements behave correctly

#### Loading States
- [ ] Skeleton loaders show
- [ ] Spinners positioned correctly
- [ ] Layout doesn't shift on load
- [ ] Images lazy load properly

#### Error States
- [ ] Error messages display clearly
- [ ] Error boundaries catch errors
- [ ] 404 page shows for invalid routes
- [ ] Network errors handled gracefully

#### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s
- [ ] No memory leaks (check DevTools)

---

## Performance Testing

### Web Vitals Monitoring

```typescript
// src/lib/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// In main.tsx
if (import.meta.env.PROD) {
  reportWebVitals();
}
```

### Lighthouse CI

```yaml
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## CI/CD Testing Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Build
        run: npm run build
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
```

---

## Testing Commands (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:a11y": "playwright test tests/a11y",
    "test:visual": "playwright test tests/visual"
  }
}
```

---

**Status:** Complete ✅  
**Next:** Integration guide (final artifact)
