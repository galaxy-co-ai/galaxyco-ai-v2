# AI Gateway Implementation Guide

## Overview

The AI Gateway provides a centralized, unified interface for all AI provider calls in GalaxyCo.ai. It includes:

- ✅ Unified API across OpenAI, Anthropic, and future providers
- ✅ Automatic cost tracking and token usage monitoring
- ✅ Comprehensive logging with tenant/user/agent tracking
- ✅ Built-in error handling and retry logic
- ✅ Performance metrics (latency, success rate)
- ✅ Security through environment variable management

## Architecture

```
┌─────────────────┐
│   Your Agent    │
└────────┬────────┘
         │
         v
┌─────────────────────────────────┐
│     AI Gateway Service          │
│                                 │
│  • Request validation           │
│  • Cost calculation             │
│  • Logging & monitoring         │
│  • Error handling               │
└────────┬───────────────────┬────┘
         │                   │
         v                   v
   ┌──────────┐        ┌──────────┐
   │  OpenAI  │        │ Anthropic│
   └──────────┘        └──────────┘
```

## Environment Variables

Add these to your `.env` file:

```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Configure logging level
NODE_ENV=development  # or 'production'
```

## Usage Examples

### Basic Text Generation

```typescript
import { AIGatewayService } from "@/lib/ai-gateway";

const response = await AIGatewayService.generateText({
  tenantId: "workspace_123",
  userId: "user_456",
  agentId: "agent_789",
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the weather like today?" },
  ],
  temperature: 0.7,
  maxTokens: 1000,
});

console.log(response.content);
console.log("Cost:", response.cost);
console.log("Tokens:", response.usage.totalTokens);
console.log("Latency:", response.latencyMs, "ms");
```

### Streaming Responses

```typescript
const streamResponse = await AIGatewayService.generateTextStream({
  tenantId: "workspace_123",
  model: "claude-3-5-sonnet-20241022",
  messages: [{ role: "user", content: "Write a story about AI" }],
});

// Stream the response
for await (const chunk of streamResponse.stream) {
  process.stdout.write(chunk);
}
```

## Response Format

```typescript
{
  requestId: 'aigw_1234567890_abc123',
  content: 'AI generated response...',
  usage: {
    promptTokens: 100,
    completionTokens: 200,
    totalTokens: 300
  },
  latencyMs: 1234,
  cost: 0.000456,  // in USD
  model: 'gpt-4o-mini',
  provider: 'openai',
  finishReason: 'stop',
  timestamp: '2025-01-09T18:00:00.000Z'
}
```

## Logging

All requests are automatically logged with:

- Request ID (for tracing)
- Tenant ID (for multi-tenant tracking)
- User ID (for user analytics)
- Agent ID (for agent performance metrics)
- Token usage and cost
- Latency and success/failure status

### Console Logs (Development)

```
[AI Gateway] {
  requestId: 'aigw_1234567890_abc123',
  tenantId: 'workspace_123',
  model: 'gpt-4o-mini',
  latencyMs: 1234,
  cost: '$0.000456',
  tokens: 300,
  success: true
}
```

## Cost Tracking

The gateway automatically calculates costs based on:

- Model-specific pricing (updated Jan 2025)
- Input tokens (prompt)
- Output tokens (completion)

Supported models and pricing:

| Model             | Input (per 1M tokens) | Output (per 1M tokens) |
| ----------------- | --------------------- | ---------------------- |
| gpt-4o            | $5.00                 | $15.00                 |
| gpt-4o-mini       | $0.15                 | $0.60                  |
| claude-3-5-sonnet | $3.00                 | $15.00                 |
| claude-3-5-haiku  | $0.80                 | $4.00                  |

## Error Handling

The gateway provides comprehensive error handling:

```typescript
try {
  const response = await AIGatewayService.generateText(request);
} catch (error) {
  // Error includes:
  // - Original error message
  // - Request ID for debugging
  // - Automatically logged to monitoring
  console.error("AI Gateway Error:", error.message);
}
```

## Monitoring & Metrics

### Built-in Logging

Every request is logged with:

- Timestamp
- Tenant/User/Agent IDs
- Model and provider
- Token usage and cost
- Latency and success status

### TODO: Database Storage

Next steps:

1. Create `ai_gateway_logs` table in database
2. Store all logs for historical analysis
3. Build dashboard for cost/usage analytics

### TODO: External Monitoring

Integrate with monitoring services:

- Sentry (error tracking)
- DataDog (metrics & APM)
- Custom webhooks

## Migration from Old System

### Before (Old Factory Pattern)

```typescript
import { createProvider } from '@/lib/ai/factory';

const provider = createProvider('openai', apiKey);
const result = await provider.execute({
  model: 'gpt-4',
  messages: [...],
});
```

### After (AI Gateway)

```typescript
import { AIGatewayService } from '@/lib/ai-gateway';

const result = await AIGatewayService.generateText({
  tenantId: workspaceId,
  userId: userId,
  agentId: agentId,
  model: 'gpt-4',
  messages: [...],
});
```

## Benefits

1. **Centralized Management**
   - Single interface for all providers
   - Consistent API across models
   - Easy to add new providers

2. **Cost Control**
   - Automatic cost calculation
   - Track spending per tenant/user/agent
   - Budget alerts (coming soon)

3. **Performance Monitoring**
   - Track latency per model
   - Identify slow requests
   - Optimize model selection

4. **Security**
   - API keys via environment variables
   - No hardcoded credentials
   - Tenant isolation

5. **Debugging**
   - Request IDs for tracing
   - Comprehensive logs
   - Error context

## Next Steps

1. ✅ Basic implementation complete
2. ⏳ Add database logging
3. ⏳ Build analytics dashboard
4. ⏳ Add rate limiting
5. ⏳ Add caching layer
6. ⏳ Add budget alerts
7. ⏳ Add more providers (Google, Cohere, etc.)

## Support

For issues or questions:

- Check logs in console (development)
- Look for Request ID in error messages
- Review this documentation

---

**Last Updated**: January 9, 2025
**Version**: 1.0.0
