# File Structure Conventions

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Build Tool:** Vite  
**Router:** Wouter  
**Status:** Ready for Implementation

---

## Complete Project Structure

```
galaxyco-ai-design-system/
├── public/
│   ├── fonts/
│   │   ├── inter-var.woff2
│   │   └── jetbrains-mono.woff2
│   └── favicon.ico
│
├── src/
│   ├── app/                      # Pages (Wouter routes)
│   │   ├── (auth)/              # Auth layout group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/         # Dashboard layout group
│   │   │   ├── layout.tsx       # Sidebar + header
│   │   │   ├── page.tsx         # /dashboard
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx     # /agents
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── prospects/
│   │   │   ├── emails/
│   │   │   └── settings/
│   │   │
│   │   └── error/
│   │       ├── 404.tsx
│   │       └── 500.tsx
│   │
│   ├── components/              # UI Components
│   │   ├── atoms/               # Atomic components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── molecules/           # Composite components
│   │   │   ├── SearchBar/
│   │   │   ├── Pagination/
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/           # Complex components
│   │   │   ├── DataTable/
│   │   │   ├── Sidebar/
│   │   │   ├── Modal/
│   │   │   └── index.ts
│   │   │
│   │   ├── templates/           # Page templates
│   │   │   ├── DashboardTemplate/
│   │   │   ├── ListTemplate/
│   │   │   └── index.ts
│   │   │
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── BottomNav.tsx
│   │
│   ├── lib/                     # Utilities
│   │   ├── utils.ts             # cn() function
│   │   ├── api.ts               # API client
│   │   ├── constants.ts         # Constants
│   │   └── validators.ts        # Zod schemas
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useQuery.ts
│   │   ├── useMutation.ts
│   │   └── index.ts
│   │
│   ├── store/                   # Zustand stores
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── types/                   # TypeScript types
│   │   ├── agent.ts
│   │   ├── prospect.ts
│   │   ├── email.ts
│   │   └── index.ts
│   │
│   ├── config/                  # Configuration
│   │   ├── routes.ts
│   │   ├── nav.ts
│   │   └── env.ts
│   │
│   ├── assets/                  # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── vite-env.d.ts
│
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .storybook/                  # Storybook config
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## Naming Conventions

### Files

- **Components:** PascalCase (e.g., `Button.tsx`, `DataTable.tsx`)
- **Utilities:** camelCase (e.g., `utils.ts`, `formatDate.ts`)
- **Types:** PascalCase (e.g., `Agent.ts`, `ApiResponse.ts`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Pages:** `page.tsx` (Wouter convention)
- **Layouts:** `layout.tsx`
- **Tests:** `*.test.tsx` or `*.spec.tsx`

### Folders

- **Feature folders:** kebab-case (e.g., `agent-management/`)
- **Component folders:** PascalCase (e.g., `Button/`, `DataTable/`)

### Variables & Functions

```typescript
// Variables: camelCase
const userEmail = "user@example.com";
const isLoading = true;

// Functions: camelCase
function fetchAgents() {}
const handleClick = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;

// Types/Interfaces: PascalCase
interface User {}
type Agent = {};
```

---

## Component Structure

### Standard Component Pattern

```typescript
// Button.types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { ButtonProps } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          isLoading && 'btn-loading',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});

// index.ts (barrel export)
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

---

## Import Path Aliases

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/store/*": ["src/store/*"]
    }
  }
}
```

### Usage

```typescript
// ✅ Good
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";

// ❌ Bad
import { Button } from "../../../components/atoms/Button";
import { cn } from "../../lib/utils";
```

---

## Barrel Exports

### Component Barrel Export Pattern

```typescript
// src/components/atoms/index.ts
export { Button } from "./Button";
export { Input } from "./Input";
export { Badge } from "./Badge";
export { Avatar } from "./Avatar";
// ... etc

export type { ButtonProps } from "./Button";
export type { InputProps } from "./Input";
// ... etc
```

### Usage

```typescript
import { Button, Input, Badge } from "@/components/atoms";
```

---

## Environment Variables

### .env.example

```bash
# API
VITE_API_BASE_URL=https://api.galaxyco.ai
VITE_API_KEY=your-api-key-here

# Auth (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_BETA_FEATURES=false

# External Services
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Usage

```typescript
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
};
```

---

## Code Organization Rules

### 1. Colocation

Keep related files together:

```
Button/
├── Button.tsx        # Component
├── Button.types.ts   # Types
├── Button.test.tsx   # Tests
├── Button.stories.tsx # Storybook
└── index.ts          # Barrel export
```

### 2. Feature-Based Organization (Optional)

For large apps, organize by feature:

```
src/features/
├── agents/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── api.ts
├── prospects/
└── emails/
```

### 3. No Deep Nesting

Max 3-4 levels deep. If deeper, refactor.

---

## Git Conventions

### Branch Naming

```bash
feature/button-component
fix/login-redirect
chore/update-deps
docs/readme-update
```

### Commit Messages

```bash
feat: add Button component with variants
fix: resolve login redirect issue
chore: update dependencies
docs: improve README setup instructions
```

---

## Code Style

### Prettier Config (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

### ESLint Config (.eslintrc.js)

```javascript
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off", // Not needed with Vite
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
```

---

## Build Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Documentation Standards

### Component Documentation

````typescript
/**
 * A button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({ ... }) => { ... };
````

### README per Feature

````markdown
# Feature Name

## Overview

Brief description.

## Components

- `ComponentA` - Description
- `ComponentB` - Description

## Usage

\```tsx
import { ComponentA } from './ComponentA';

<ComponentA prop="value" />
\```

## API

### ComponentA Props

| Prop | Type   | Default   | Description      |
| ---- | ------ | --------- | ---------------- |
| prop | string | 'default' | Prop description |
````

---

**Status:** Complete ✅  
**Next:** Tailwind production config
