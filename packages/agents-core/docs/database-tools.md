# Database Tools

## Overview

Database tools enable agents to query workspace data using Drizzle ORM with enforced multi-tenant isolation. All queries automatically include workspace filtering to ensure data security and isolation.

## Security

**CRITICAL:** All database tools enforce multi-tenant security per rule `4kR94Z3XhqK4C54vwDDwnq`:

- ✅ All queries use `withTenant(db, workspaceId)` helper
- ✅ Workspace ID required in ExecutionContext
- ✅ No cross-tenant data access possible
- ✅ Automatic workspace filtering on all queries

## Available Tools

### search_agents

Search for agents in the current workspace by name, type, or description.

**Input:**

- `query` (string, required): Search term to match against agent name or description
- `limit` (number, optional): Maximum number of results (default: 10)

**Output:**

```json
{
  "success": true,
  "agents": [
    {
      "id": "uuid",
      "name": "Agent Name",
      "type": "email",
      "status": "active",
      "description": "Agent description"
    }
  ],
  "count": 1,
  "query": "search term"
}
```

**Example Usage:**

```typescript
const tools = createDatabaseTools();
const agent = new Agent({
  name: "Search Assistant",
  instructions: "Help users find agents",
  tools,
});

const result = await Runner.run(
  agent,
  [{ role: "user", content: 'Find agents with "email" in the name' }],
  { workspaceId: "workspace-123", userId: "user-456" },
);
```

---

### get_agent

Get detailed information about a specific agent by ID.

**Input:**

- `agentId` (string, required): The UUID of the agent to retrieve

**Output:**

```json
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "Agent Name",
    "type": "email",
    "status": "active",
    "description": "Agent description",
    "config": { ... },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Agent {id} not found in workspace"
}
```

---

### get_workspace_stats

Get statistics about the current workspace including agent counts and execution metrics.

**Input:** None (uses workspace from ExecutionContext)

**Output:**

```json
{
  "success": true,
  "stats": {
    "totalAgents": 10,
    "activeAgents": 8,
    "totalExecutions": 150,
    "workspaceId": "workspace-123"
  }
}
```

---

## Implementation Details

### Multi-Tenant Safety

All tools receive an `ExecutionContext` parameter containing:

```typescript
interface ExecutionContext {
  workspaceId: string; // Required - enforces tenant isolation
  userId: string; // Required - for audit trail
  // ... other fields
}
```

The `withTenant()` helper automatically filters all queries:

```typescript
const tenantDb = withTenant(db, workspaceId);
const results = await tenantDb.query.agents.findMany(); // Automatically filtered
```

### Error Handling

All tools return a consistent response format:

```typescript
{
  success: boolean;
  error?: string;  // Present when success is false
  // ... tool-specific data
}
```

This allows agents to gracefully handle errors and provide useful feedback to users.

### Testing

Run the live database test:

```bash
cd packages/agents-core
pnpm exec tsx examples/database-test.ts
```

Replace `testWorkspaceId` in the test file with a real workspace ID to test with actual data.

---

## Adding New Database Tools

To add a new database tool:

1. **Create the tool function** in `src/tools/database-tools.ts`:

```typescript
export function createMyNewTool(): Tool {
  return createTool(
    "my_new_tool",
    "Description of what the tool does",
    {
      param1: { type: "string", description: "Parameter description" },
      param2: {
        type: "number",
        description: "Optional param",
        required: false,
      },
    },
    async (
      args: { param1: string; param2?: number },
      context?: ExecutionContext,
    ) => {
      if (!context?.workspaceId) {
        return { success: false, error: "Workspace context required" };
      }

      try {
        const tenantDb = withTenant(db, context.workspaceId);
        // Your query here using tenantDb

        return { success: true /* your data */ };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );
}
```

2. **Add to createDatabaseTools()** array

3. **Test** with real workspace data

4. **Document** in this file

---

## Performance Considerations

- Database queries are executed via Neon Postgres serverless
- Queries include workspace filtering at the database level
- Use `limit` parameters to control result set sizes
- Consider adding indexes on frequently queried columns

---

## Future Enhancements

Potential additions:

- [ ] Bulk operations (search multiple workspaces for admin)
- [ ] Agent execution history queries
- [ ] Agent performance metrics
- [ ] Workspace member queries
- [ ] Audit log access
