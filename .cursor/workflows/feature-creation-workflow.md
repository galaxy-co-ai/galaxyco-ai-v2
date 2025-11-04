# Feature Creation Workflow

**Cursor Composer Workflow for creating complete features in GalaxyCo**

---

## 📋 Workflow Overview

This workflow guides you through creating a complete, production-ready feature with all necessary files:

- Database schema and migrations
- Server Actions with validation
- React components (Server and Client)
- Comprehensive tests
- Documentation

---

## 🎯 Steps

### Step 1: Feature Planning

**Ask the user:**

1. What is the feature name?
2. What does it do?
3. What data needs to be stored?
4. What are the main user interactions?

**Create a plan document:**

```markdown
# Feature: [Name]

## Overview

[Description]

## Database Schema

- Tables needed
- Columns and types
- Relationships
- Indexes

## Server Actions

- Action 1: [Purpose]
- Action 2: [Purpose]

## Components

- Component 1: [Purpose] (Server/Client)
- Component 2: [Purpose] (Server/Client)

## Routes

- /[route-path] - [Description]

## Security Considerations

- orgId filtering: Yes
- Auth required: Yes
- Input validation: Zod schemas
```

---

### Step 2: Database Schema

**Files to create:**

1. `packages/database/src/schema/[feature-name].ts`

**Pattern:**

```typescript
import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

export const [tableName] = pgTable('[table_name]', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: text('org_id').notNull(), // MANDATORY for multi-tenant

  // Feature-specific fields
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('draft'),
  metadata: jsonb('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const [tableName]Relations = relations([tableName], ({ one }) => ({
  organization: one(organizations, {
    fields: [[tableName].orgId],
    references: [organizations.id],
  }),
}));
```

**Generate migration:**

```bash
cd packages/database && pnpm db:generate
```

---

### Step 3: Database Queries

**Files to create:**

1. `apps/web/lib/queries/get-[feature].ts`
2. `apps/web/lib/queries/get-[feature]-by-id.ts`

**Pattern:**

```typescript
'use server';

import { db } from '@/lib/db';
import { [tableName] } from '@packages/database/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * Get all [feature] items for the current organization
 *
 * @security Multi-tenant: Filtered by orgId
 * @returns Array of [feature] items
 */
export async function get[Feature]() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  try {
    const items = await db
      .select()
      .from([tableName])
      .where(eq([tableName].orgId, orgId)) // MANDATORY orgId filter
      .orderBy([tableName].createdAt);

    return items;
  } catch (error) {
    console.error('Error fetching [feature]:', error);
    throw new Error('Failed to fetch [feature]');
  }
}

/**
 * Get a specific [feature] item by ID
 *
 * @param id - The item ID
 * @security Multi-tenant: Filtered by orgId
 * @returns The [feature] item or null
 */
export async function get[Feature]ById(id: string) {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  try {
    const [item] = await db
      .select()
      .from([tableName])
      .where(
        and(
          eq([tableName].id, id),
          eq([tableName].orgId, orgId) // MANDATORY orgId filter
        )
      )
      .limit(1);

    return item || null;
  } catch (error) {
    console.error('Error fetching [feature] by ID:', error);
    throw new Error('Failed to fetch [feature]');
  }
}
```

---

### Step 4: Server Actions

**Files to create:**

1. `apps/web/lib/actions/create-[feature].ts`
2. `apps/web/lib/actions/update-[feature].ts`
3. `apps/web/lib/actions/delete-[feature].ts`

**Pattern:**

```typescript
'use server';

import { db } from '@/lib/db';
import { [tableName] } from '@packages/database/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Input validation schema
const create[Feature]Schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  metadata: z.record(z.any()).optional(),
});

type Create[Feature]Input = z.infer<typeof create[Feature]Schema>;

/**
 * Create a new [feature] item
 *
 * @param input - The [feature] data
 * @security Multi-tenant: Uses orgId from auth
 * @returns Success/error result
 */
export async function create[Feature](input: Create[Feature]Input) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: 'You must be logged in to create [feature]',
    };
  }

  try {
    // Validate input
    const validated = create[Feature]Schema.parse(input);

    // Create in database
    const [created] = await db
      .insert([tableName])
      .values({
        ...validated,
        orgId, // MANDATORY: Set orgId from auth
      })
      .returning();

    // Revalidate cache
    revalidatePath('/[feature-path]');

    return {
      success: true,
      data: created,
    };
  } catch (error) {
    console.error('Error creating [feature]:', error);

    // User-friendly error message
    return {
      success: false,
      error: error instanceof z.ZodError
        ? 'Invalid input. Please check your data.'
        : 'Failed to create [feature]. Please try again.',
    };
  }
}
```

---

### Step 5: React Components

**Files to create:**

1. `apps/web/components/galaxy/[feature]/[feature]-list.tsx` (Server Component)
2. `apps/web/components/galaxy/[feature]/[feature]-card.tsx` (Client Component)
3. `apps/web/components/galaxy/[feature]/[feature]-form.tsx` (Client Component)

**Server Component Pattern:**

```typescript
// ✅ Server Component (no 'use client')
import { Suspense } from 'react';
import { get[Feature] } from '@/lib/queries/get-[feature]';
import { [Feature]Card } from './[feature]-card';
import { Skeleton } from '@/components/ui/skeleton';

export async function [Feature]List() {
  const items = await get[Feature]();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No [feature] items yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Suspense key={item.id} fallback={<Skeleton className="h-32" />}>
          <[Feature]Card item={item} />
        </Suspense>
      ))}
    </div>
  );
}
```

**Client Component Pattern:**

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface [Feature]CardProps {
  item: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

export function [Feature]Card({ item }: [Feature]CardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await delete[Feature](item.id);

      if (result.success) {
        toast.success('[Feature] deleted successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete [feature]');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge>{item.status}</Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

---

### Step 6: Form Component

**File:** `apps/web/components/galaxy/[feature]/[feature]-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { create[Feature] } from '@/lib/actions/create-[feature]';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function [Feature]Form() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const result = await create[Feature](values);

      if (result.success) {
        toast.success('[Feature] created successfully');
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to create [feature]');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your [feature]
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create [Feature]'}
        </Button>
      </form>
    </Form>
  );
}
```

---

### Step 7: Page Route

**File:** `apps/web/app/(dashboard)/[feature]/page.tsx`

```typescript
import { Suspense } from 'react';
import { [Feature]List } from '@/components/galaxy/[feature]/[feature]-list';
import { [Feature]Form } from '@/components/galaxy/[feature]/[feature]-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function [Feature]Page() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">[Feature]</h1>
          <p className="text-muted-foreground">
            Manage your [feature] items
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New [Feature]
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <[Feature]List />
      </Suspense>
    </div>
  );
}
```

---

### Step 8: Tests

**Files to create:**

1. `apps/web/__tests__/actions/create-[feature].test.ts`
2. `apps/web/__tests__/component/[feature]-card.test.tsx`

**Server Action Test:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create[Feature] } from '@/lib/actions/create-[feature]';

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ orgId: 'test-org-id' })),
}));

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: 'test-id', name: 'Test' }]),
      })),
    })),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('create[Feature]', () => {
  it('should create [feature] successfully', async () => {
    const result = await create[Feature]({
      name: 'Test [Feature]',
      description: 'Test description',
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should validate input', async () => {
    const result = await create[Feature]({
      name: '', // Invalid: empty name
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should require authentication', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ orgId: null });

    const result = await create[Feature]({
      name: 'Test [Feature]',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('logged in');
  });
});
```

---

### Step 9: Documentation

**File:** `docs/features/[feature].md`

````markdown
# [Feature] Feature

## Overview

[Description of what this feature does]

## Architecture

### Database Schema

- Table: `[table_name]`
- Key fields: id, orgId, name, description, status
- Indexes: orgId for multi-tenant queries

### Server Actions

- `create[Feature]` - Create new item
- `update[Feature]` - Update existing item
- `delete[Feature]` - Delete item

### Components

- `[Feature]List` - Server Component displaying all items
- `[Feature]Card` - Client Component for individual items
- `[Feature]Form` - Client Component for creating items

## Security

### Multi-Tenant Isolation

✅ All queries filter by orgId
✅ Server Actions verify orgId from auth
✅ No cross-organization data leakage

### Input Validation

✅ Zod schemas validate all inputs
✅ Type-safe database queries
✅ User-friendly error messages

## Usage

### Creating a [Feature]

```typescript
import { create[Feature] } from '@/lib/actions/create-[feature]';

const result = await create[Feature]({
  name: 'My [Feature]',
  description: 'Description here',
});
```
````

### Querying [Feature]

```typescript
import { get[Feature] } from '@/lib/queries/get-[feature]';

const items = await get[Feature](); // Filtered by orgId
```

## Testing

- Unit tests: `__tests__/actions/[feature].test.ts`
- Component tests: `__tests__/component/[feature].test.tsx`
- Coverage: 85%

## Related Features

- [Related feature 1]
- [Related feature 2]

```

---

## ✅ Checklist

Before marking feature complete, verify:

- [ ] Database schema created with orgId field
- [ ] Migration generated and applied
- [ ] Queries filter by orgId (multi-tenant)
- [ ] Server Actions use Zod validation
- [ ] Server Actions have try-catch error handling
- [ ] User-friendly error messages (no technical details)
- [ ] Server Components used where possible
- [ ] Client Components only when needed
- [ ] Loading states for all async operations
- [ ] Form validation with React Hook Form + Zod
- [ ] Toast notifications for success/error
- [ ] Accessibility attributes (aria-labels)
- [ ] Tests written (80%+ coverage)
- [ ] Documentation created
- [ ] Type safety (no `any` types)
- [ ] Visual feedback for all actions
- [ ] Mobile responsive

---

## 🚀 Completion

Once all steps are complete:
1. Run all tests: `pnpm test:run`
2. Run type checking: `turbo run typecheck`
3. Run linting: `turbo run lint`
4. Create preview deployment
5. Manual testing on preview
6. Create PR with feature documentation

**Congratulations! Feature is production-ready! 🎉**

```
