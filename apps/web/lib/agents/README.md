# Agent Infrastructure - Standardized Implementation

## Overview

This directory contains the standardized agent infrastructure for GalaxyCo.ai, implementing the requirements from rule `OyCoQzeTnn2qmcEcvGl6v7`:

1. ✅ Every agent follows the standard interface: id, name, trigger, inputs, aiProvider, process, output
2. ✅ All AI provider calls are wrapped in error handling with fallback logic
3. ✅ Agent logs include: timestamp, tenant_id, user_id, input summary, output summary, duration_ms
4. ✅ Never hard-code AI provider keys—always use environment variables
5. ✅ Test agents with mock data before connecting real integrations

## Architecture

```
lib/agents/
├── agent-interface.ts        # Base agent class and standard interface
├── ai-provider-wrapper.ts     # AI provider wrapper with error handling
├── agent-logger.ts            # Centralized logging and metrics
├── test-runner.ts             # Testing utilities
├── index.ts                   # Main exports
├── examples/
│   └── email-agent.ts         # Example implementation
└── README.md                  # This file
```

## Components

### 1. BaseAgent (agent-interface.ts)

The abstract base class that all agents must extend. Provides:
- Standard interface enforcement
- Input validation
- AI provider initialization with fallback
- Automatic logging
- Built-in testing capabilities

### 2. AIProviderWrapper (ai-provider-wrapper.ts)

Handles all AI provider interactions with:
- Automatic retries with exponential backoff
- Fallback provider logic
- Timeout management
- Request/response logging
- Performance monitoring

### 3. AgentLogger (agent-logger.ts)

Centralized logging system providing:
- Structured execution logs
- Performance metrics tracking
- Success/failure rates
- Sentry integration for errors
- Database persistence

### 4. AgentRegistry (agent-interface.ts)

Global registry for all agents with:
- Agent registration and discovery
- Bulk testing capabilities
- Agent lookup by ID

## Creating a New Agent

### Step 1: Create the Agent Class

```typescript
import { 
  BaseAgent, 
  AgentTrigger, 
  AgentInput, 
  AgentOutput, 
  AgentExecutionContext, 
  AgentExecutionResult 
} from '../agent-interface';

export class MyAgent extends BaseAgent {
  // Required properties
  public readonly id = 'my-agent-v1';
  public readonly name = 'My Custom Agent';
  public readonly description = 'What this agent does';
  public readonly version = '1.0.0';

  // Define triggers
  public readonly triggers: AgentTrigger[] = [
    {
      type: 'manual',
      config: {},
    },
  ];

  // Define inputs
  public readonly inputs: AgentInput[] = [
    {
      name: 'inputField',
      type: 'text',
      required: true,
      description: 'Description of the input',
    },
  ];

  // Define outputs
  public readonly outputs: AgentOutput[] = [
    {
      name: 'outputField',
      type: 'text',
      description: 'Description of the output',
    },
  ];

  // AI provider configuration
  public readonly aiProvider = {
    primary: 'openai' as const,
    fallback: 'anthropic' as const,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
  };

  // Main processing logic
  public async process(
    inputs: Record<string, any>,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult> {
    try {
      // Your agent logic here
      const result = await this.sendAIRequest(
        [
          { role: 'system', content: 'Your system prompt' },
          { role: 'user', content: inputs.inputField },
        ],
        context
      );

      return {
        success: true,
        data: {
          outputField: result.content,
        },
        metadata: {
          provider: result.model.includes('gpt') ? 'openai' : 'anthropic',
          model: result.model,
          tokensUsed: result.usage?.totalTokens,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Processing failed',
          code: 'PROCESSING_ERROR',
        },
      };
    }
  }
}
```

### Step 2: Register the Agent

```typescript
import { AgentRegistry } from '../agent-interface';
AgentRegistry.register(MyAgent);
```

### Step 3: Test the Agent

```typescript
const agent = new MyAgent();
const testResult = await agent.test();

console.log('Test passed:', testResult.success);
console.log('Issues:', testResult.issues);
```

## Testing

### Local Testing

Run the test runner to validate all agents:

```typescript
import { runAgentTests } from './test-runner';

const results = await runAgentTests();
console.log(`${results.passedTests}/${results.totalAgents} agents passed`);
```

### API Testing

Use the health check endpoint:

```bash
# Quick health check
GET /api/agents/health?mode=quick

# Full test suite
GET /api/agents/health?mode=full

# Test specific agent
POST /api/agents/health
{
  "action": "test_specific_agent",
  "agentId": "my-agent-v1"
}

# Get markdown report
GET /api/agents/health?mode=full&format=markdown
```

## Environment Variables

Required environment variables for AI providers:

```env
# OpenAI (Primary)
OPENAI_API_KEY=your_openai_key_here

# Anthropic (Fallback)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Google (Optional)
GOOGLE_AI_KEY=your_google_key_here

# Database (for logging)
DATABASE_URL=your_database_url_here
```

## Database Migration

The agent logging system requires the `agent_logs` table. Apply the migration:

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate
```

## Best Practices

### 1. Input Validation

Always define comprehensive input validation:

```typescript
{
  name: 'email',
  type: 'text',
  required: true,
  description: 'Email address',
  validation: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  },
}
```

### 2. Error Handling

Wrap all operations in try-catch blocks and return structured errors:

```typescript
try {
  // Operation
} catch (error) {
  return {
    success: false,
    data: {},
    error: {
      message: error instanceof Error ? error.message : 'Operation failed',
      code: 'OPERATION_ERROR',
    },
  };
}
```

### 3. Logging

Use structured logging with context:

```typescript
console.info('[AGENT] Starting operation', {
  agent_id: this.id,
  tenant_id: context.tenantId,
  user_id: context.userId,
});
```

### 4. Testing

Always test with mock data before production:

```typescript
const testResult = await agent.test({
  inputField: 'test value',
});

if (!testResult.success) {
  console.error('Agent test failed:', testResult.issues);
}
```

### 5. Monitoring

Check agent performance metrics regularly:

```typescript
import { getAgentMetrics } from './agent-logger';

const metrics = await getAgentMetrics('my-agent-v1', tenantId, 'day');
console.log('Success rate:', metrics.successRate);
console.log('Average duration:', metrics.averageDuration);
```

## Troubleshooting

### Issue: Agent not found in registry

**Solution:** Ensure the agent is registered by importing it:
```typescript
import './examples/my-agent'; // This auto-registers the agent
```

### Issue: AI provider errors

**Solution:** Check environment variables and provider status:
```typescript
const healthCheck = await quickHealthCheck();
console.log('Provider status:', healthCheck.issues);
```

### Issue: Database logging failures

**Solution:** Verify database connection and run migrations:
```bash
# Check database connection
npx drizzle-kit check

# Apply migrations
npx drizzle-kit migrate
```

### Issue: Slow agent execution

**Solution:** Review agent metrics and optimize:
```typescript
const metrics = await getAgentMetrics(agentId, tenantId, 'day');
if (metrics.averageDuration > 30000) {
  console.warn('Agent is slow, consider optimization');
}
```

## Migration Guide

### Migrating Existing Agents

1. **Extend BaseAgent instead of custom class**
   ```typescript
   // Before
   class MyAgent { ... }
   
   // After
   class MyAgent extends BaseAgent { ... }
   ```

2. **Add required properties**
   ```typescript
   public readonly id = 'my-agent-v1';
   public readonly name = 'My Agent';
   public readonly description = '...';
   public readonly version = '1.0.0';
   public readonly triggers = [...];
   public readonly inputs = [...];
   public readonly outputs = [...];
   public readonly aiProvider = { ... };
   ```

3. **Implement process() method**
   ```typescript
   public async process(
     inputs: Record<string, any>,
     context: AgentExecutionContext
   ): Promise<AgentExecutionResult> {
     // Your existing logic here
   }
   ```

4. **Update AI calls to use sendAIRequest()**
   ```typescript
   // Before
   const response = await openai.chat.completions.create({...});
   
   // After
   const response = await this.sendAIRequest(messages, context);
   ```

5. **Register the agent**
   ```typescript
   import { AgentRegistry } from '../agent-interface';
   AgentRegistry.register(MyAgent);
   ```

## Performance Considerations

### Caching

The AI wrapper supports response caching:
- Reduces API costs
- Improves response time
- Configurable cache duration

### Batching

For multiple agents, use batch execution:
```typescript
const testResults = await AgentRegistry.testAll();
```

### Monitoring

Set up Sentry integration for real-time monitoring:
- Automatic error tracking
- Performance metrics
- Slow execution alerts

## Security

### API Keys

- Never commit API keys to version control
- Use environment variables exclusively
- Rotate keys regularly
- Monitor key usage

### Tenant Isolation

- All agents enforce tenant_id filtering
- Logs include tenant context
- No cross-tenant data access

### Input Sanitization

- Validate all inputs
- Sanitize user-provided data
- Limit input sizes
- Prevent injection attacks

## Future Enhancements

- [ ] Agent versioning and deployment
- [ ] A/B testing framework
- [ ] Agent marketplace integration
- [ ] Real-time performance dashboard
- [ ] Advanced caching strategies
- [ ] Multi-model ensemble support

## Support

For questions or issues:
1. Check this README
2. Review example implementations in `examples/`
3. Run the health check endpoint
4. Check agent logs and metrics
5. Contact the platform team

## Contributing

When adding new agents:
1. Follow the standard interface
2. Include comprehensive tests
3. Document inputs/outputs
4. Add usage examples
5. Update this README

## License

Internal use only - GalaxyCo.ai Platform