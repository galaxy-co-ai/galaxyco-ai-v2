# @galaxyco/database

Shared database package with Drizzle ORM, Postgres schema, and migration management for GalaxyCo.ai v2.0.

## Purpose

Provides centralized database schema, client configuration, and type-safe database access across all applications in the monorepo. Built on Drizzle ORM with Neon Postgres and pgvector support.

## Installation

### In Workspace

Already included via workspace protocol:

```json
{
  "dependencies": {
    "@galaxyco/database": "workspace:*"
  }
}
```

## Key Exports

### Database Client

- **`db`** - Drizzle database client instance
- **`sql`** - Raw SQL query builder

### Schema Tables

- **`workspaces`** - Workspace/tenant data
- **`users`** - User accounts and profiles
- **`agents`** - Agent configurations
- **`executions`** - Agent execution logs
- **`collections`** - Knowledge base collections
- **`documents`** - Document storage with embeddings
- **`apiKeys`** - API key management

### Types

- All schema types auto-generated from Drizzle
- TypeScript-first with full type safety

## Usage Examples

### Query Data

```typescript
import { db } from '@galaxyco/database';
import { agents, workspaces } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

// Find all agents in a workspace
const myAgents = await db
  .select()
  .from(agents)
  .where(eq(agents.workspaceId, 'workspace_123'));

// Join with workspace data
const agentsWith Workspace = await db
  .select()
  .from(agents)
  .leftJoin(workspaces, eq(agents.workspaceId, workspaces.id));
```

### Insert Data

```typescript
import { db } from "@galaxyco/database";
import { agents } from "@galaxyco/database/schema";

const newAgent = await db
  .insert(agents)
  .values({
    name: "My Agent",
    workspaceId: "workspace_123",
    model: "gpt-4o-mini",
    systemPrompt: "You are a helpful assistant",
    createdAt: new Date(),
  })
  .returning();
```

### Update Data

```typescript
import { db } from "@galaxyco/database";
import { agents } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

await db
  .update(agents)
  .set({ isActive: true })
  .where(eq(agents.id, "agent_123"));
```

### Transactions

```typescript
import { db } from '@galaxyco/database';

await db.transaction(async (tx) => {
  await tx.insert(workspaces).values({...});
  await tx.insert(users).values({...});
});
```

## Schema Overview

### Core Tables

- **workspaces** - Multi-tenant workspace isolation
- **users** - User authentication and profiles
- **agents** - AI agent configurations
- **executions** - Execution history and metrics
- **agent_logs** - Detailed execution logs
- **api_keys** - Secure API key storage
- **collections** - Knowledge base organization
- **documents** - Vector embeddings for RAG

### Relationships

```
workspaces
  ↓ has many
users, agents, collections
  ↓ has many
executions, documents
```

## Migrations

### Create Migration

```bash
cd packages/database
pnpm db:generate
```

### Run Migrations

```bash
pnpm db:migrate
```

### Reset Database (Development Only)

```bash
pnpm db:push  # Push schema directly without migration
```

### Open Drizzle Studio

```bash
pnpm db:studio  # Opens at http://localhost:4983
```

## Development Scripts

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly (dev only)
pnpm db:push

# Open visual database explorer
pnpm db:studio

# Validate migration files
pnpm db:check

# Type check the package
pnpm typecheck
```

## Database Configuration

### Connection

```typescript
// packages/database/src/client.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

### Environment Variable

```env
DATABASE_URL=postgresql://user:pass@host/database?sslmode=require
```

## Multi-Tenancy

**CRITICAL**: Always filter by `workspaceId` / `tenant_id`

### ✅ Correct Usage

```typescript
import { db } from "@galaxyco/database";
import { agents } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

// Always include workspace filter
const myAgents = await db
  .select()
  .from(agents)
  .where(eq(agents.workspaceId, currentWorkspaceId));
```

### ❌ NEVER Do This

```typescript
// Missing workspace filter - SECURITY ISSUE!
const allAgents = await db.select().from(agents);
```

## Type Safety

### Schema Types

```typescript
import type { Agent, Workspace, User } from "@galaxyco/database/schema";

// Fully typed
const agent: Agent = {
  id: "agent_123",
  workspaceId: "workspace_123",
  name: "My Agent",
  // ... TypeScript knows all fields
};
```

### Insert Types

```typescript
import type { NewAgent } from "@galaxyco/database/schema";

const newAgent: NewAgent = {
  workspaceId: "workspace_123",
  name: "My Agent",
  // ... only required fields needed
};
```

## Best Practices

### 1. Always Use Transactions for Multi-Step Operations

```typescript
await db.transaction(async (tx) => {
  const workspace = await tx.insert(workspaces).values({...}).returning();
  await tx.insert(users).values({ workspaceId: workspace.id });
});
```

### 2. Use Prepared Statements for Repeated Queries

```typescript
const getAgentsByWorkspace = db
  .select()
  .from(agents)
  .where(eq(agents.workspaceId, sql.placeholder("workspaceId")))
  .prepare();

// Reuse efficiently
const result1 = await getAgentsByWorkspace.execute({ workspaceId: "ws_1" });
const result2 = await getAgentsByWorkspace.execute({ workspaceId: "ws_2" });
```

### 3. Handle Errors Gracefully

```typescript
try {
  await db.insert(agents).values({...});
} catch (error) {
  if (error.code === '23505') {
    // Handle unique constraint violation
  }
  throw error;
}
```

### 4. Index Frequently Queried Fields

See `schema.ts` for index definitions on:

- `workspaceId` on all tables
- `userId` where applicable
- `createdAt` for time-based queries

## Package Structure

```
database/
├── src/
│   ├── index.ts       # Main exports
│   ├── client.ts      # Database client
│   ├── schema.ts      # Drizzle schema definitions
│   └── client-safe.ts # Safe client with error handling
├── drizzle/
│   └── migrations/    # Generated SQL migrations
├── drizzle.config.ts  # Drizzle Kit configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Drizzle ORM Resources

- [Drizzle Docs](https://orm.drizzle.team/)
- [Neon Postgres](https://neon.tech/)
- [Pgvector Extension](https://github.com/pgvector/pgvector)

## Troubleshooting

### Migration Errors

```bash
# Check migration status
pnpm db:check

# Regenerate if schema out of sync
pnpm db:generate
```

### Connection Issues

1. Verify `DATABASE_URL` in `.env.local`
2. Check Neon dashboard for database status
3. Test connection: `pnpm db:studio`

### Type Errors

```bash
# Rebuild after schema changes
pnpm build

# Or in watch mode
pnpm dev
```

## Related Packages

- `@galaxyco/types` - Shared TypeScript types
- `@galaxyco/agents-core` - Uses database for persistence
- `apps/web` - Main consumer of database
- `apps/api` - API layer for database access

---

**Version**: 0.1.0  
**Maintained By**: GalaxyCo.ai Team  
**License**: Private
