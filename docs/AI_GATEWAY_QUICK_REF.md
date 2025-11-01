# AI Gateway - Quick Reference

## 🚀 Quick Start

```typescript
import { AIGatewayService } from '@/lib/ai-gateway';

// Simple text generation
const response = await AIGatewayService.generateText({
  tenantId: workspaceId,
  userId: userId,
  agentId: agentId,
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Hello!' },
  ],
});
```

## 📋 Supported Models

### OpenAI (use with `OPENAI_API_KEY`)

- `gpt-4o` - Latest, most capable ($5/$15 per 1M tokens)
- `gpt-4o-mini` - Fast & cheap ($0.15/$0.60 per 1M tokens) ⭐ Recommended
- `gpt-4-turbo` - Previous generation ($10/$30 per 1M tokens)
- `gpt-3.5-turbo` - Legacy fast model ($0.50/$1.50 per 1M tokens)

### Anthropic (use with `ANTHROPIC_API_KEY`)

- `claude-3-5-sonnet-20241022` - Best reasoning ($3/$15 per 1M tokens) ⭐ Recommended
- `claude-3-5-haiku-20241022` - Fast & cheap ($0.80/$4 per 1M tokens)
- `claude-3-opus-20240229` - Previous flagship ($15/$75 per 1M tokens)

## 💡 Common Patterns

### With Retry Logic

```typescript
import { retryWithBackoff } from '@/lib/retry';

const response = await retryWithBackoff(() => AIGatewayService.generateText(request), {
  maxAttempts: 3,
});
```

### Streaming Response

```typescript
const stream = await AIGatewayService.generateTextStream({
  tenantId: workspaceId,
  model: 'gpt-4o-mini',
  messages: [...],
});

for await (const chunk of stream.stream) {
  console.log(chunk);
}
```

### With Custom Settings

```typescript
const response = await AIGatewayService.generateText({
  tenantId: workspaceId,
  model: 'claude-3-5-sonnet-20241022',
  messages: [...],
  temperature: 0.3,    // More focused (0-2)
  maxTokens: 4000,     // Longer response
  topP: 0.9,           // Nucleus sampling
});
```

## 📊 Response Structure

```typescript
{
  requestId: 'aigw_1234567890_abc123',  // For debugging
  content: 'AI response text...',
  usage: {
    promptTokens: 100,
    completionTokens: 200,
    totalTokens: 300
  },
  latencyMs: 1234,      // Request duration
  cost: 0.000456,       // Cost in USD
  model: 'gpt-4o-mini',
  provider: 'openai',
  finishReason: 'stop',
  timestamp: '2025-01-09T18:00:00.000Z'
}
```

## 🔑 Environment Variables

```bash
# Required - Add to .env.local
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 📝 Logging

Development logs show in console:

```
[AI Gateway] {
  requestId: 'aigw_...',
  tenantId: 'workspace_123',
  model: 'gpt-4o-mini',
  latencyMs: 1234,
  cost: '$0.000456',
  tokens: 300,
  success: true
}
```

## 🎯 Model Selection Guide

**For general tasks**: `gpt-4o-mini`  
**For complex reasoning**: `claude-3-5-sonnet-20241022`  
**For speed & cost**: `claude-3-5-haiku-20241022`  
**For maximum capability**: `gpt-4o`

## ⚠️ Error Handling

```typescript
try {
  const response = await AIGatewayService.generateText(request);
} catch (error) {
  console.error('AI Gateway Error:', error.message);
  // Error is automatically logged with request ID
}
```

## 💰 Cost Examples (approximate)

| Task            | Model             | Tokens | Cost    |
| --------------- | ----------------- | ------ | ------- |
| Short chat      | gpt-4o-mini       | 300    | $0.0003 |
| Long analysis   | claude-3-5-sonnet | 5000   | $0.02   |
| Code generation | gpt-4o            | 2000   | $0.01   |

## 🔗 Related Files

- Full Guide: `docs/AI_GATEWAY_GUIDE.md`
- Implementation: `docs/AI_GATEWAY_IMPLEMENTATION.md`
- Source: `apps/web/lib/ai-gateway/`

---

**Need help?** Check the full guide or look for request IDs in error messages.
