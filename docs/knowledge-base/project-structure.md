# Project Structure

Understanding the GalaxyCo.ai codebase organization

## 📁 Overview

GalaxyCo.ai is a **monorepo** using **Turborepo** to manage multiple packages:

```
galaxyco-ai-2.0/
├── apps/                 # Applications
│   └── web/             # Next.js web application
├── packages/            # Shared packages
│   ├── database/        # Database schemas & client
│   ├── ui/              # Shared UI components (future)
│   └── config/          # Shared configs (future)
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── turbo.json          # Turborepo configuration
```

---

## 🌐 Apps

### `apps/web` - Next.js Application

The main web application built with **Next.js 14 App Router**.

```
apps/web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Auth-related pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── agents/           # Agent-specific components
│   │   └── ...
│   ├── lib/                   # Utility functions
│   │   ├── utils.ts          # General utilities
│   │   └── ...
│   └── middleware.ts          # Next.js middleware (auth)
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json
```

#### Key Directories

**`src/app/`** - Next.js App Router

- Each folder can be a route
- `page.tsx` = page component
- `layout.tsx` = shared layout
- `loading.tsx` = loading state
- `error.tsx` = error boundary
- `route.ts` = API endpoint

**`src/components/`** - React Components

- `ui/` - Base components from shadcn/ui
- Feature-specific folders (agents, workflows, etc.)
- Reusable components

**`src/lib/`** - Utility Functions

- Business logic
- API clients
- Type definitions
- Helper functions

---

## 📦 Packages

### `packages/database` - Database Layer

Centralized database schemas and client using **Drizzle ORM**.

```
packages/database/
├── src/
│   ├── schema/              # Database schemas
│   │   ├── index.ts        # Export all schemas
│   │   ├── users.ts        # User tables
│   │   ├── workspaces.ts   # Workspace tables
│   │   └── agents.ts       # Agent tables
│   ├── db.ts               # Database client
│   └── index.ts            # Package exports
├── drizzle/
│   └── migrations/         # Database migrations
├── drizzle.config.ts       # Drizzle configuration
└── package.json
```

#### Using the Database Package

```typescript
// Import in apps/web
import { db } from '@galaxyco/database';
import { workspaces, agents } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

// Query
const workspace = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
```

---

## 🛠️ Configuration Files

### Root Level

| File                  | Purpose                        |
| --------------------- | ------------------------------ |
| `turbo.json`          | Turborepo task pipeline config |
| `pnpm-workspace.yaml` | pnpm workspace definition      |
| `package.json`        | Root package & scripts         |
| `.gitignore`          | Git ignore rules               |

### App Level (`apps/web/`)

| File                 | Purpose                       |
| -------------------- | ----------------------------- |
| `next.config.js`     | Next.js configuration         |
| `tailwind.config.js` | Tailwind CSS config           |
| `tsconfig.json`      | TypeScript config             |
| `.env.local`         | Local environment variables   |
| `.env.example`       | Environment variable template |

### Package Level (`packages/database/`)

| File                | Purpose              |
| ------------------- | -------------------- |
| `drizzle.config.ts` | Drizzle ORM config   |
| `tsconfig.json`     | TypeScript config    |
| `package.json`      | Package dependencies |

---

## 🔄 How It All Works Together

### 1. Development Workflow

```bash
# Start everything (from root)
pnpm dev

# Turborepo runs:
# - apps/web: next dev
# - packages/database: watch mode (if configured)
```

### 2. Build Process

```bash
# Build all packages (from root)
pnpm build

# Turborepo:
# 1. Builds packages/database
# 2. Builds apps/web (which depends on database)
```

### 3. Dependency Graph

```
apps/web
  └── depends on → packages/database
```

When you import `@galaxyco/database` in `apps/web`, Turborepo ensures the database package is built first.

---

## 📂 Common Patterns

### Adding a New Page

```bash
# Create new route in apps/web/src/app/
mkdir -p apps/web/src/app/my-feature
touch apps/web/src/app/my-feature/page.tsx

# File: apps/web/src/app/my-feature/page.tsx
export default function MyFeaturePage() {
  return <div>My Feature</div>;
}
```

### Adding a New Component

```bash
# Create component in apps/web/src/components/
mkdir -p apps/web/src/components/my-feature
touch apps/web/src/components/my-feature/my-component.tsx

# Use in page
import { MyComponent } from "@/components/my-feature/my-component";
```

### Adding a New Database Table

```bash
# 1. Create schema file
touch packages/database/src/schema/my-table.ts

# 2. Define schema
export const myTable = pgTable("my_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

# 3. Export from schema/index.ts
export * from "./my-table";

# 4. Generate migration
cd packages/database
npm run db:migration:create -- add_my_table

# 5. Apply migration
npm run db:migrate
```

---

## 🎯 Best Practices

### File Organization

**DO** ✅

- Keep related files together (co-location)
- Use feature folders (`components/agents/`, `app/agents/`)
- Put shared utilities in `lib/`
- Keep components small and focused

**DON'T** ❌

- Create deeply nested folders (max 3-4 levels)
- Mix business logic into components
- Put everything in one giant file

### Imports

```typescript
// Use path aliases
import { db } from '@galaxyco/database';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// NOT relative paths from deep nesting
// ❌ import { db } from "../../../../../packages/database";
```

### Component Structure

```
Feature/
├── index.tsx           # Main component
├── feature-header.tsx  # Sub-component
├── feature-list.tsx    # Sub-component
├── types.ts           # Type definitions
└── utils.ts           # Feature-specific utils
```

---

## 🔍 Finding Things

### "Where does X live?"

| What                | Where                                   |
| ------------------- | --------------------------------------- |
| Pages/Routes        | `apps/web/src/app/`                     |
| API Endpoints       | `apps/web/src/app/api/`                 |
| React Components    | `apps/web/src/components/`              |
| Database Schemas    | `packages/database/src/schema/`         |
| Database Migrations | `packages/database/drizzle/migrations/` |
| Utilities           | `apps/web/src/lib/`                     |
| Types               | Usually co-located with components      |
| Styles              | Tailwind classes (no CSS files)         |
| Environment Vars    | `apps/web/.env.local`                   |
| Scripts             | `scripts/`                              |
| Documentation       | `docs/`                                 |

### Search Strategies

```bash
# Find all files with "agent" in name
find . -name "*agent*"

# Search file contents for "workspace"
grep -r "workspace" apps/web/src

# Find database schema definitions
grep -r "pgTable" packages/database/src/schema
```

---

## 📚 Additional Resources

- **Next.js App Router**: [Next.js Docs](https://nextjs.org/docs/app)
- **Drizzle ORM**: [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- **Turborepo**: [Turborepo Docs](https://turbo.build/repo/docs)
- **Tailwind CSS**: [Tailwind Docs](https://tailwindcss.com/docs)

---

## 🆘 Common Questions

**Q: Why is it a monorepo?**
A: Easier to share code (database schemas, types, utils) between apps without publishing packages.

**Q: What is Turborepo?**
A: Build system that caches builds and runs tasks in parallel for better performance.

**Q: Where do I put shared code?**
A: In `packages/` if used by multiple apps, or `apps/web/src/lib/` if only used by web app.

**Q: How do I add a new package?**
A: Create folder in `packages/`, add `package.json`, reference it in `apps/web/package.json`.

---

**Remember**: When in doubt, check similar existing features! 🗂️
