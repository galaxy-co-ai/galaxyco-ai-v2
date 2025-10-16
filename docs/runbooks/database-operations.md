# Database Operations Runbook

Safe and efficient database management for GalaxyCo.ai

## 🗄️ Daily Operations

### Opening Drizzle Studio

```bash
# Quick access
./scripts/db-studio.sh

# Or manually:
cd packages/database
npx drizzle-kit studio
# Opens at http://localhost:4983
```

### Checking Database Health

```bash
# Connection test
cd packages/database
node -e "require('./src/db').db.execute('SELECT 1')"

# Check table counts
# Use Drizzle Studio or Neon console
```

---

## 🔧 Schema Management

### Creating a New Table

1. **Define schema** in `packages/database/src/schema/`:

   ```typescript
   // Example: packages/database/src/schema/new-feature.ts
   import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

   export const myNewTable = pgTable("my_new_table", {
     id: uuid("id").primaryKey().defaultRandom(),
     name: text("name").notNull(),
     createdAt: timestamp("created_at").defaultNow().notNull(),
   });
   ```

2. **Export from index**:

   ```typescript
   // packages/database/src/schema/index.ts
   export * from "./new-feature";
   ```

3. **Generate migration**:

   ```bash
   cd packages/database
   npm run db:migration:create -- add_my_new_table
   ```

4. **Review and apply**:

   ```bash
   # Review SQL in drizzle/migrations/
   npm run db:migrate

   # Verify in Drizzle Studio
   npm run db:studio
   ```

### Modifying Existing Table

⚠️ **IMPORTANT**: Never modify existing migrations!

```bash
# 1. Edit schema file
# 2. Generate new migration
npm run db:migration:create -- modify_table_name

# 3. Review generated SQL
# 4. Apply migration
npm run db:migrate
```

---

## 🔍 Querying Data

### Using Drizzle Studio

1. Open Drizzle Studio: `./scripts/db-studio.sh`
2. Navigate to table in left sidebar
3. Use GUI to browse/filter data
4. **Read-only recommended** - use code for modifications

### Using Drizzle ORM in Code

```typescript
// Example query
import { db } from "@galaxyco/database";
import { workspaces } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

// Select
const workspace = await db
  .select()
  .from(workspaces)
  .where(eq(workspaces.slug, "my-workspace"))
  .limit(1);

// Insert
await db.insert(workspaces).values({
  name: "New Workspace",
  slug: "new-workspace",
  createdById: userId,
});

// Update
await db
  .update(workspaces)
  .set({ name: "Updated Name" })
  .where(eq(workspaces.id, workspaceId));

// Delete
await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
```

### Using Raw SQL (When Necessary)

```typescript
import { db } from "@galaxyco/database";

// For complex queries Drizzle can't express
const result = await db.execute(sql`
  SELECT w.*, COUNT(a.id) as agent_count
  FROM workspaces w
  LEFT JOIN agents a ON a.workspace_id = w.id
  GROUP BY w.id
`);
```

---

## 🚨 Emergency Procedures

### Restore Production Snapshot

1. **Go to Neon Console**: [https://console.neon.tech](https://console.neon.tech)
2. Navigate to your database
3. Go to "Backups" section
4. Select backup timestamp
5. Click "Restore"
6. Choose target branch/database
7. Confirm restoration

### Clean Up Orphaned Data

**Example**: Removing workspace and related data

```typescript
// scripts/cleanup-workspace.mjs
import { db } from "@galaxyco/database";
import { workspaces, workspaceMembers } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

const WORKSPACE_SLUG = "workspace-to-delete";

// Delete workspace members first (foreign key dependency)
await db
  .delete(workspaceMembers)
  .where(
    eq(
      workspaceMembers.workspaceId,
      db
        .select({ id: workspaces.id })
        .from(workspaces)
        .where(eq(workspaces.slug, WORKSPACE_SLUG)),
    ),
  );

// Then delete workspace
await db.delete(workspaces).where(eq(workspaces.slug, WORKSPACE_SLUG));

console.log(`✅ Cleaned up workspace: ${WORKSPACE_SLUG}`);
```

Run with:

```bash
node scripts/cleanup-workspace.mjs
```

### Emergency Data Export

```bash
# Export entire database to SQL
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Export specific table
pg_dump $DATABASE_URL -t table_name > table_backup.sql

# Export as CSV
psql $DATABASE_URL -c "COPY table_name TO STDOUT CSV HEADER" > export.csv
```

---

## 🔒 Security & Access Control

### Row-Level Security (RLS)

⚠️ **CRITICAL**: Always filter by `tenant_id` or `workspace_id`

```typescript
// ❌ BAD - No tenant isolation
const agents = await db.select().from(agents);

// ✅ GOOD - Filtered by workspace
const agents = await db
  .select()
  .from(agents)
  .where(eq(agents.workspaceId, userWorkspaceId));
```

### Safe Query Patterns

```typescript
// Always validate user has access before querying
async function getWorkspace(workspaceId: string, userId: string) {
  // First check user is member
  const membership = await db
    .select()
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
      ),
    )
    .limit(1);

  if (!membership.length) {
    throw new Error("Access denied");
  }

  // Then fetch workspace
  return db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
}
```

---

## 📊 Performance Optimization

### Index Management

```sql
-- Create index for frequently queried columns
CREATE INDEX idx_agents_workspace_id ON agents(workspace_id);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as times_used
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Query Performance Analysis

```sql
-- Enable query timing
SET timing on;

-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM agents WHERE workspace_id = 'xxx';

-- Find slow queries (in Neon console)
```

### Connection Pooling

Already configured via Neon's connection pooler. Monitor in Neon console.

---

## 🧪 Testing Database Changes

### Test Data Setup

```typescript
// scripts/seed-test-data.ts
import { db } from "@galaxyco/database";

async function seedTestData() {
  // Create test workspace
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: "Test Workspace",
      slug: "test-workspace",
      createdById: "test-user-id",
    })
    .returning();

  // Create test agents
  await db.insert(agents).values([
    {
      name: "Test Agent 1",
      workspaceId: workspace.id,
      // ... other fields
    },
  ]);

  console.log("✅ Test data seeded");
}

seedTestData();
```

### Testing Migrations

```bash
# 1. Create test branch in Neon
# 2. Apply migration to test branch
DATABASE_URL="test-branch-url" npm run db:migrate

# 3. Verify schema
# 4. Test queries against test data
# 5. Apply to production
```

---

## 📝 Common Patterns

### Soft Deletes

```typescript
// Add deletedAt column to schema
deletedAt: (timestamp("deleted_at"),
  // Soft delete
  await db
    .update(table)
    .set({ deletedAt: new Date() })
    .where(eq(table.id, id)));

// Query excluding deleted
const active = await db.select().from(table).where(isNull(table.deletedAt));
```

### Audit Trails

```typescript
// Add audit columns
createdAt: timestamp("created_at").defaultNow().notNull(),
updatedAt: timestamp("updated_at").defaultNow().notNull(),
createdById: text("created_by_id").references(() => users.id),
updatedById: text("updated_by_id").references(() => users.id),

// Automatically update on change
await db
  .update(table)
  .set({
    ...changes,
    updatedAt: new Date(),
    updatedById: currentUserId
  });
```

### Pagination

```typescript
async function getPaginatedAgents(
  workspaceId: string,
  page = 1,
  pageSize = 20,
) {
  const offset = (page - 1) * pageSize;

  const agents = await db
    .select()
    .from(agents)
    .where(eq(agents.workspaceId, workspaceId))
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(agents.createdAt));

  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(agents)
    .where(eq(agents.workspaceId, workspaceId));

  return {
    agents,
    total: Number(count),
    page,
    pageSize,
    totalPages: Math.ceil(Number(count) / pageSize),
  };
}
```

---

## 🆘 Troubleshooting

### Issue: "relation does not exist"

**Cause**: Migration not applied

**Solution**:

```bash
cd packages/database
npm run db:migrate
```

### Issue: "duplicate key value violates unique constraint"

**Cause**: Trying to insert duplicate unique value

**Solution**:

1. Check for existing record first
2. Use `INSERT ... ON CONFLICT` if needed
3. Clean up duplicate data (see cleanup scripts)

### Issue: "Connection pool exhausted"

**Cause**: Too many concurrent connections

**Solution**:

1. Check for connection leaks in code
2. Increase connection pool size in Neon
3. Use connection pooling properly

### Issue: Slow queries

**Cause**: Missing indexes or inefficient query

**Solution**:

1. Run `EXPLAIN ANALYZE` on query
2. Add indexes on frequently filtered columns
3. Optimize query structure

---

**Remember**: Always test database changes in development first! 🔒
