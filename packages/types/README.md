# @galaxyco/types

Shared TypeScript type definitions and interfaces for GalaxyCo.ai v2.0.

## Purpose

Provides common TypeScript types, interfaces, and utility types shared across all apps and packages in the monorepo.

## Installation

Already included via workspace protocol:

```json
{
  "dependencies": {
    "@galaxyco/types": "workspace:*"
  }
}
```

## Key Exports

### Core Types

- **`Agent`** - Agent entity type
- **`Workspace`** - Workspace/tenant type
- **`User`** - User profile type
- **`Execution`** - Agent execution type

### Utility Types

- **`Result<T>`** - Success/error result type
- **`Maybe<T>`** - Nullable type wrapper
- **`AsyncResult<T>`** - Async result type

### Enums

- **`AgentStatus`** - Agent status states
- **`ExecutionStatus`** - Execution states
- **`UserRole`** - User permission roles

## Usage

```typescript
import type { Agent, Result, AgentStatus } from '@galaxyco/types';

const agent: Agent = {
  id: 'agent_123',
  name: 'My Agent',
  status: AgentStatus.Active,
  // ...
};

function processAgent(agent: Agent): Result<string> {
  // Type-safe processing
}
```

## Best Practices

1. **Import with `type` keyword**:

   ```typescript
   import type { Agent } from '@galaxyco/types'; // ✅ Good
   import { Agent } from '@galaxyco/types'; // ❌ Runtime import
   ```

2. **Use utility types for consistency**:
   ```typescript
   function getData(): Result<Agent[]> { ... }  // ✅ Consistent
   function getData(): Agent[] | Error { ... }   // ❌ Inconsistent
   ```

## Development

```bash
pnpm typecheck  # Validate types
```

---

**Version**: 0.1.0  
**Maintained By**: GalaxyCo.ai Team
