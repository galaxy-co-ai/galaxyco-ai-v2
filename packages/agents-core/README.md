# @galaxyco/agents-core

Core agent execution engine following OpenAI Agent SDK patterns for GalaxyCo.ai v2.0.

## Purpose

Provides the foundational agent execution framework for running AI-powered agents with built-in monitoring, guardrails, and tool integration. This package implements the core orchestration logic that powers all agents in the platform.

## Installation

### In Workspace Apps

Already included via workspace protocol in `package.json`:

```json
{
  "dependencies": {
    "@galaxyco/agents-core": "workspace:*"
  }
}
```

### Install Dependencies

```bash
cd packages/agents-core
pnpm install
```

## Key Exports

### Core Classes

- **`Agent`** - Base agent class with execution logic
- **`ExecutionService`** - Handles agent lifecycle and execution
- **`Runner`** - Runs agents with monitoring and error handling

### Tools & Utilities

- **`tools`** - Tool registry and management
- **`guardrails`** - Safety checks and validation
- **`monitoring`** - Execution monitoring and metrics

### Types

- **`AgentConfig`** - Agent configuration interface
- **`ExecutionContext`** - Execution state and context
- **`ToolDefinition`** - Tool schema and metadata

## Usage Examples

### Creating a Basic Agent

```typescript
import { Agent, ExecutionService } from '@galaxyco/agents-core';

const agent = new Agent({
  name: 'My Custom Agent',
  model: 'gpt-4o-mini',
  systemPrompt: 'You are a helpful assistant...',
  tools: [], // Optional tools
});

const service = new ExecutionService();
const result = await service.execute(agent, {
  input: 'Hello, world!',
  context: { userId: 'user_123' },
});

console.log(result.output);
```

### Using Tools

```typescript
import { Agent, tools } from '@galaxyco/agents-core';

const agent = new Agent({
  name: 'Agent with Tools',
  model: 'gpt-4o-mini',
  systemPrompt: 'You can search the web and analyze data.',
  tools: [tools.webSearch, tools.dataAnalysis],
});
```

### With Guardrails

```typescript
import { Agent, guardrails } from '@galaxyco/agents-core';

const agent = new Agent({
  name: 'Safe Agent',
  model: 'gpt-4o-mini',
  guardrails: [guardrails.contentFilter, guardrails.rateLimiter, guardrails.costLimiter],
});
```

## Architecture

### Execution Flow

```
Input → ExecutionService → Agent → Tools → Guardrails → Output
                ↓                                    ↓
         Monitoring                            Error Handling
```

### Key Components

1. **Agent**: Core execution unit
   - Manages LLM interactions
   - Handles tool calls
   - Applies guardrails

2. **ExecutionService**: Orchestrator
   - Manages agent lifecycle
   - Provides execution context
   - Tracks metrics

3. **Tools**: Extensible capabilities
   - Web search
   - Data analysis
   - API integrations
   - Custom tools

4. **Guardrails**: Safety layer
   - Content filtering
   - Rate limiting
   - Cost controls
   - Output validation

## Dependencies

### Production

- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Anthropic Claude client
- `zod` - Schema validation

### Development

- `typescript` - Type safety
- `vitest` - Testing framework
- `tsup` - Build tool

## Development

### Build

```bash
pnpm build        # Build for production
pnpm dev          # Watch mode for development
```

### Testing

```bash
pnpm test         # Run tests
pnpm test:watch   # Watch mode
```

### Type Checking

```bash
pnpm typecheck
```

## Package Structure

```
agents-core/
├── src/
│   ├── index.ts           # Main exports
│   ├── agent.ts           # Agent class
│   ├── execution-service.ts  # Execution orchestration
│   ├── runner.ts          # Runner implementation
│   ├── types.ts           # TypeScript types
│   ├── tools/             # Tool implementations
│   │   └── index.ts
│   ├── guardrails/        # Safety implementations
│   │   └── index.ts
│   └── monitoring/        # Monitoring utilities
│       └── index.ts
├── tests/                 # Test files
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Integration

### In Apps

```typescript
// apps/web/lib/agents/custom-agent.ts
import { Agent, ExecutionService } from '@galaxyco/agents-core';

export async function runCustomAgent(input: string) {
  const agent = new Agent({...});
  const service = new ExecutionService();
  return await service.execute(agent, { input });
}
```

### With Database

```typescript
import { Agent } from '@galaxyco/agents-core';
import { db } from '@galaxyco/database';

// Persist agent configurations
await db.agents.create({
  name: agent.name,
  config: agent.config,
});
```

## Best Practices

### 1. Always Use Guardrails

```typescript
// ✅ Good
const agent = new Agent({
  guardrails: [guardrails.contentFilter, guardrails.rateLimiter],
});

// ❌ Bad
const agent = new Agent({
  guardrails: [], // No safety checks!
});
```

### 2. Handle Errors Properly

```typescript
try {
  const result = await service.execute(agent, input);
} catch (error) {
  if (error instanceof AgentExecutionError) {
    // Handle agent-specific errors
  }
}
```

### 3. Use Monitoring

```typescript
import { monitor } from '@galaxyco/agents-core/monitoring';

const result = await monitor.track(() => service.execute(agent, input), {
  agentId: agent.id,
  userId: context.userId,
});
```

## Contributing

When modifying this package:

1. Run tests: `pnpm test`
2. Type check: `pnpm typecheck`
3. Update this README if adding new exports
4. Follow existing patterns for consistency

## Related Packages

- `@galaxyco/database` - Data persistence
- `@galaxyco/types` - Shared TypeScript types
- `apps/web` - Web application using agents
- `apps/api` - API server coordinating execution

---

**Version**: 0.1.0  
**Maintained By**: GalaxyCo.ai Team  
**License**: Private
