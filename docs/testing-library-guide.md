/\*\*

- Testing Library Quick Reference Guide
-
- For Frontend Architect Agent use
-
- Testing Library is already installed and configured in:
- - apps/web/tests/setup.ts
- - apps/web/vitest.config.ts
-
- This guide provides quick reference for common patterns.
  \*/

/\*\*

- BEST PRACTICES
-
- 1.  Query by accessible roles/labels (preferred)
- 2.  Use data-testid sparingly (last resort)
- 3.  Test user behavior, not implementation
- 4.  Use user-event for interactions
      \*/

/\*\*

- COMMON QUERIES
  \*/

// By role (PREFERRED)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('link', { name: /dashboard/i });

// By label (accessible)
screen.getByLabelText(/email address/i);
screen.getByLabelText(/password/i);

// By text content
screen.getByText(/welcome/i);
screen.getByText(/error/i);

// By placeholder
screen.getByPlaceholderText(/enter email/i);

// By testid (LAST RESORT)
screen.getByTestId('submit-button');

/\*\*

- USER INTERACTIONS
  \*/

import userEvent from '@testing-library/user-event';

// Click
await userEvent.click(screen.getByRole('button', { name: /submit/i }));

// Type
await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');

// Clear
await userEvent.clear(screen.getByLabelText(/email/i));

// Select options
await userEvent.selectOptions(screen.getByRole('combobox'), 'option-value');

// Upload file
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
await userEvent.upload(screen.getByLabelText(/upload/i), file);

/\*\*

- ASSERTIONS
  \*/

import '@testing-library/jest-dom';

// Visible
expect(screen.getByText(/success/i)).toBeVisible();

// In document
expect(screen.getByText(/error/i)).toBeInTheDocument();

// Not visible
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// Disabled
expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

// Enabled
expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

// Has value
expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com');

// Has class
expect(screen.getByRole('button')).toHaveClass('primary');

/\*\*

- ASYNC OPERATIONS
  \*/

import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

// Wait for element to appear
await waitFor(() => {
expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

// Find by query (returns null if not found)
const element = screen.queryByText(/error/i);
if (element) {
// Element exists
}

/\*\*

- TESTING PLAYGROUND EXTENSION
-
- Install Chrome extension: Testing Playground
-
- 1.  Right-click element in browser
- 2.  Select "Testing Playground"
- 3.  Get recommended query
-
- Example: Instead of getByTestId, use getByRole('button', { name: /submit/i })
  \*/

/\*\*

- COMMON PATTERNS
  \*/

// Form submission test
test('submits form with valid data', async () => {
const user = userEvent.setup();

await user.type(screen.getByLabelText(/email/i), 'test@example.com');
await user.type(screen.getByLabelText(/password/i), 'password123');
await user.click(screen.getByRole('button', { name: /submit/i }));

await waitFor(() => {
expect(screen.getByText(/success/i)).toBeInTheDocument();
});
});

// Error handling test
test('shows error on invalid input', async () => {
const user = userEvent.setup();

await user.type(screen.getByLabelText(/email/i), 'invalid-email');
await user.click(screen.getByRole('button', { name: /submit/i }));

expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});

// Component with state changes
test('toggles visibility', async () => {
const user = userEvent.setup();

expect(screen.queryByText(/hidden content/i)).not.toBeInTheDocument();

await user.click(screen.getByRole('button', { name: /toggle/i }));

expect(screen.getByText(/hidden content/i)).toBeInTheDocument();
});

/\*\*

- DEBUGGING
  \*/

// Print all accessible roles
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Log all queries
screen.logTestingPlaygroundURL();
