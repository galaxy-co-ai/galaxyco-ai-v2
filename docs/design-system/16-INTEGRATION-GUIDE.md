# Integration Guide

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Purpose:** Complete setup guide for all dependencies  
**Status:** Ready to Execute

---

## Quick Start (5 Minutes)

### 1. Create Vite Project

```bash
npm create vite@latest galaxyco-design-system -- --template react-ts
cd galaxyco-design-system
npm install
```

---

### 2. Install Core Dependencies

```bash
# Styling
npm install -D tailwindcss postcss autoprefixer
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge

# UI Components (Radix UI)
npm install @radix-ui/react-accordion \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-label \
  @radix-ui/react-popover \
  @radix-ui/react-progress \
  @radix-ui/react-radio-group \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slider \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip

# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query

# Routing
npm install wouter

# Charts (Optional)
npm install @tremor/react
```

---

### 3. Initialize Tailwind

```bash
npx tailwindcss init -p
```

Replace `tailwind.config.js` with the config from `14-TAILWIND-CONFIG-PRODUCTION.md`.

---

### 4. Create Globals CSS

Create `src/styles/globals.css` with the CSS variables from `14-TAILWIND-CONFIG-PRODUCTION.md`.

---

### 5. Update main.tsx

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### 6. Create Utility Function

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### 7. Test Setup

```bash
npm run dev
```

Open `http://localhost:5173` - you should see a working app!

---

## Radix UI Integration

### Modal Component Example

```typescript
// src/components/organisms/Modal/Modal.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
            'w-full rounded-lg border border-border bg-card p-6 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <Dialog.Title className="text-lg font-semibold">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Body */}
          {children}

          {/* Close Button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

---

### Dropdown Menu Example

```typescript
// src/components/molecules/DropdownMenu/DropdownMenu.tsx
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDivider?: boolean;
  isDestructive?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenu = ({ trigger, items, align = 'end' }: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          {items.map(item =>
            item.isDivider ? (
              <DropdownMenuPrimitive.Separator
                key={item.id}
                className="my-1 h-px bg-border"
              />
            ) : (
              <DropdownMenuPrimitive.Item
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                  'transition-colors focus:bg-accent focus:text-accent-foreground',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  item.isDestructive && 'text-destructive focus:text-destructive'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuPrimitive.Item>
            )
          )}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
```

---

## Framer Motion Integration

### App Setup

```typescript
// src/App.tsx
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        {/* Your app routes */}
      </LazyMotion>
    </QueryClientProvider>
  );
}

export default App;
```

---

### Page Transition Component

```typescript
// src/components/layout/PageTransition.tsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
```

---

## Wouter (Routing) Integration

### Router Setup

```typescript
// src/App.tsx
import { Route, Switch } from 'wouter';
import { Dashboard } from '@/app/(dashboard)/page';
import { Agents } from '@/app/(dashboard)/agents/page';
import { Login } from '@/app/(auth)/login/page';
import { NotFound } from '@/app/error/404';

function App() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/:id" component={AgentDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

---

### Link Component

```typescript
// src/components/atoms/Link/Link.tsx
import { Link as WouterLink } from 'wouter';
import { cn } from '@/lib/utils';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Link = ({ href, children, className }: LinkProps) => {
  return (
    <WouterLink
      href={href}
      className={cn(
        'text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    >
      {children}
    </WouterLink>
  );
};
```

---

## React Hook Form + Zod Integration

### Form Example

```typescript
// src/components/organisms/LoginForm/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/atoms';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = ({ onSubmit }: { onSubmit: (data: LoginFormData) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} isFullWidth>
        Log in
      </Button>
    </form>
  );
};
```

---

## TanStack Query Integration

### Setup

```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

---

### Data Fetching Example

```typescript
// src/hooks/useAgents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAgents, createAgent } from '@/lib/api';

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};
```

---

## Zustand Store Example

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
```

---

## Font Setup

### Download Fonts

1. **Inter:** https://rsms.me/inter/
2. **JetBrains Mono:** https://www.jetbrains.com/lp/mono/

Place in `public/fonts/`:

- `inter-var.woff2`
- `jetbrains-mono.woff2`

---

### Font Loading (Already in globals.css)

See `14-TAILWIND-CONFIG-PRODUCTION.md` for complete font setup.

---

## Environment Variables

### .env.local

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

### Usage

```typescript
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};
```

---

## Build & Deploy

### Build Command

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

---

## Storybook Setup (Optional)

```bash
npx storybook@latest init
```

### Button Story Example

```typescript
// src/components/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    isLoading: true,
  },
};
```

---

## Troubleshooting

### TypeScript Errors

**Issue:** Module not found  
**Fix:** Check `tsconfig.json` paths and restart TS server

**Issue:** Type errors with Radix  
**Fix:** `npm install --save-dev @types/react @types/react-dom`

---

### Tailwind Not Working

**Issue:** Styles not applying  
**Fix:** Verify `content` paths in `tailwind.config.js`

**Issue:** Dark mode not working  
**Fix:** Add `class` to `<html>` tag

---

### Vite Build Errors

**Issue:** Build fails  
**Fix:** Clear cache: `rm -rf node_modules/.vite && npm run build`

---

## Complete Checklist

- [ ] Vite project created
- [ ] All dependencies installed
- [ ] Tailwind configured
- [ ] Globals CSS added
- [ ] Utils created
- [ ] Fonts loaded
- [ ] Radix components integrated
- [ ] Framer Motion setup
- [ ] Routing configured (Wouter)
- [ ] Forms setup (React Hook Form + Zod)
- [ ] Data fetching setup (TanStack Query)
- [ ] State management setup (Zustand)
- [ ] Environment variables configured
- [ ] Dev server runs (`npm run dev`)
- [ ] Build succeeds (`npm run build`)

---

**Status:** Complete ✅  
**Ready to build!** 🚀
