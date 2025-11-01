# Logging Standards - GalaxyCo.ai 2.0

**Last Updated:** 2025-10-18  
**Status:** Production-Ready  
**Logger Version:** 1.0

---

## 📋 Executive Summary

Structured logging is critical for debugging, monitoring, and maintaining production systems. This document defines GalaxyCo.ai's logging standards, best practices, and implementation guidelines.

### Current Logging Infrastructure

- **Logger Utility:** Custom TypeScript logger (`apps/web/lib/utils/logger.ts`)
- **Error Tracking:** Sentry integration
- **Environment-Aware:** Different behavior for dev/test/prod
- **Structured:** JSON-compatible log context
- **Zero Production Noise:** Silent in production except errors

---

## 🎯 Logging Principles

### 1. **Structured Over Unstructured**

✅ **Good:**

```typescript
logger.info('User created agent', {
  userId: 'user_123',
  workspaceId: 'workspace_456',
  agentId: 'agent_789',
  agentName: 'Lead Generator',
});
```

❌ **Bad:**

```typescript
console.log('User user_123 created agent agent_789 named Lead Generator');
```

**Why:** Structured logs are parseable, searchable, and aggregatable.

### 2. **Context-Rich Logging**

Always include relevant context:

- **User ID** - Who performed the action
- **Workspace ID** - Which tenant (multi-tenancy)
- **Resource ID** - Which resource was affected
- **Timestamp** - When it happened (automatic)
- **Duration** - How long it took (for operations)

### 3. **Environment-Aware**

Different environments have different needs:

| Environment     | Behavior                    |
| --------------- | --------------------------- |
| **Development** | All logs visible in console |
| **Test**        | Silent (no console noise)   |
| **Production**  | Only errors sent to Sentry  |

### 4. **Security-Conscious**

**NEVER log:**

- ❌ API keys or secrets
- ❌ Passwords or tokens
- ❌ Credit card numbers
- ❌ Personal identifiable information (PII) without masking
- ❌ Full JWT tokens

**DO log:**

- ✅ User IDs (internal UUIDs)
- ✅ Workspace IDs
- ✅ Resource IDs
- ✅ Masked email (u\*\*\*@example.com)
- ✅ Action types and results

---

## 🔧 Logger Utility

### Implementation

Location: `apps/web/lib/utils/logger.ts`

**Features:**

- **Environment-aware** - Different behavior per environment
- **Type-safe** - Full TypeScript support
- **Singleton** - Single instance across app
- **Sentry integration** - Auto-send errors to Sentry
- **Structured context** - JSON-compatible metadata

### API Reference

#### `logger.debug(message, context?)`

**Use For:** Verbose debugging information

**Behavior:**

- ✅ Logged in development
- ❌ Silent in test
- ❌ Silent in production

**Example:**

```typescript
logger.debug('Parsing workflow configuration', {
  workflowId: 'wf_123',
  steps: 5,
  triggers: ['manual', 'scheduled'],
});
```

#### `logger.info(message, context?)`

**Use For:** General informational messages about application state

**Behavior:**

- ✅ Logged in development
- ❌ Silent in test
- ❌ Silent in production

**Example:**

```typescript
logger.info('Agent executed successfully', {
  agentId: 'agent_123',
  workspaceId: 'ws_456',
  duration: 1234,
  success: true,
});
```

#### `logger.warn(message, context?)`

**Use For:** Unexpected situations that don't prevent operation

**Behavior:**

- ✅ Logged in development
- ❌ Silent in test
- 🔶 Could send to monitoring (future)

**Example:**

```typescript
logger.warn('API rate limit approaching', {
  userId: 'user_123',
  remaining: 10,
  limit: 100,
  resetAt: new Date(),
});
```

#### `logger.error(message, error?, context?)`

**Use For:** Errors that need attention

**Behavior:**

- ✅ Logged in development
- ❌ Silent in test
- ✅ **Sent to Sentry in production**

**Example:**

```typescript
try {
  await executeAgent(agentId);
} catch (error) {
  logger.error('Agent execution failed', error, {
    agentId,
    workspaceId,
    userId,
  });
  throw error;
}
```

#### `logger.test(message, context?)`

**Use For:** Test-specific logging

**Behavior:**

- ❌ Silent in development
- ✅ Logged in test
- ❌ Silent in production

**Example:**

```typescript
logger.test('Mock API response configured', {
  endpoint: '/api/agents',
  status: 200,
  responseTime: 50,
});
```

---

## 📊 Log Levels

### When to Use Each Level

```
DEBUG → INFO → WARN → ERROR
   ↓      ↓      ↓       ↓
Verbose | Normal | Alert | Critical
```

### DEBUG

**Purpose:** Detailed technical information for debugging

**When to use:**

- Tracing function entry/exit
- Logging variable values during development
- Debugging complex algorithms
- Understanding control flow

**Examples:**

```typescript
logger.debug('Entering user authentication flow', {
  method: 'email',
  provider: 'clerk',
});

logger.debug('Parsed configuration', {
  config: parsedConfig,
  source: 'environment',
});
```

### INFO

**Purpose:** Normal application events and state changes

**When to use:**

- User actions (created, updated, deleted)
- System state changes (started, stopped)
- Successful operations completion
- Integration interactions

**Examples:**

```typescript
logger.info('User signed in', {
  userId: 'user_123',
  method: 'email',
  timestamp: new Date(),
});

logger.info('Database migration completed', {
  version: '0042',
  duration: 1234,
  tablesAffected: 3,
});
```

### WARN

**Purpose:** Unexpected situations that don't prevent operation

**When to use:**

- Deprecated feature usage
- Rate limits approaching
- Fallback to default values
- Recoverable errors
- Performance degradation

**Examples:**

```typescript
logger.warn('Using deprecated API endpoint', {
  endpoint: '/api/v1/agents',
  replacement: '/api/v2/agents',
  deprecationDate: '2025-12-31',
});

logger.warn('Slow database query detected', {
  query: 'SELECT * FROM agents',
  duration: 5000,
  threshold: 1000,
});
```

### ERROR

**Purpose:** Errors requiring attention or intervention

**When to use:**

- Unhandled exceptions
- Failed operations
- External service failures
- Data integrity issues
- Authentication/authorization failures

**Examples:**

```typescript
logger.error('Failed to connect to database', error, {
  host: process.env.DATABASE_HOST,
  database: 'production',
  retries: 3,
});

logger.error('Payment processing failed', error, {
  userId: 'user_123',
  amount: 9900,
  currency: 'USD',
  provider: 'stripe',
});
```

---

## 🔍 Sentry Integration

### Current Setup

**Package:** `@sentry/nextjs`  
**Configuration:** `sentry.client.config.ts`, `sentry.server.config.ts`  
**Environment Variable:** `NEXT_PUBLIC_SENTRY_DSN`

### What Gets Sent to Sentry

**Automatic:**

- Unhandled exceptions
- Promise rejections
- React error boundaries
- API route errors (500s)
- Agent execution failures

**Manual:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  level: 'error',
  tags: {
    feature: 'agent-execution',
    workspaceId: 'ws_123',
  },
  extra: {
    agentId: 'agent_456',
    duration: 1234,
  },
});
```

### Sentry Context

Always set context for better debugging:

```typescript
Sentry.setUser({
  id: userId,
  workspace: workspaceId,
  email: maskedEmail, // user@example.com → u***@example.com
});

Sentry.setTag('feature', 'document-processing');
Sentry.setTag('environment', process.env.NODE_ENV);

Sentry.setContext('execution', {
  agentId,
  duration,
  success,
  retries,
});
```

### Performance Monitoring

Sentry tracks:

- API endpoint response times
- Database query performance
- External API call latency
- Page load times (Web Vitals)

**Thresholds:**

- 🟢 Good: <500ms
- 🟡 Warning: 500-1000ms
- 🔴 Alert: >1000ms

---

## 📝 Logging Patterns

### API Routes

```typescript
import { logger } from '@/lib/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();

    logger.debug('API request received', {
      endpoint: '/api/agents',
      method: 'POST',
      body: body,
    });

    // ... handle request ...

    const duration = Date.now() - startTime;

    logger.info('Agent created successfully', {
      agentId: newAgent.id,
      workspaceId: body.workspaceId,
      duration,
    });

    return NextResponse.json({ agent: newAgent });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Agent creation failed', error, {
      endpoint: '/api/agents',
      duration,
      body: req.body,
    });

    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
```

### Database Operations

```typescript
import { logger } from '@/lib/utils/logger';

async function createAgent(data: CreateAgentInput) {
  logger.debug('Creating agent in database', {
    workspaceId: data.workspaceId,
    agentName: data.name,
  });

  try {
    const [agent] = await db.insert(agents).values(data).returning();

    logger.info('Agent created in database', {
      agentId: agent.id,
      workspaceId: data.workspaceId,
    });

    return agent;
  } catch (error) {
    logger.error('Database insert failed', error, {
      table: 'agents',
      operation: 'insert',
      workspaceId: data.workspaceId,
    });
    throw error;
  }
}
```

### Background Jobs (Trigger.dev)

```typescript
import { logger } from '@/lib/utils/logger';
import { task } from '@trigger.dev/sdk/v3';

export const processDocument = task({
  id: 'process-document',
  run: async (payload: { documentId: string; workspaceId: string }) => {
    const startTime = Date.now();

    logger.info('🚀 Starting document processing', {
      documentId: payload.documentId,
      workspaceId: payload.workspaceId,
    });

    try {
      // ... process document ...

      const duration = Date.now() - startTime;

      logger.info('✅ Document processing complete', {
        documentId: payload.documentId,
        duration,
        chunks: result.chunks,
      });

      return { success: true, result };
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('❌ Document processing failed', error, {
        documentId: payload.documentId,
        workspaceId: payload.workspaceId,
        duration,
      });

      throw error;
    }
  },
});
```

### React Components

```typescript
import { logger } from "@/lib/utils/logger";

export function AgentCard({ agent }: AgentCardProps) {
  const handleDelete = async () => {
    logger.debug("User clicked delete agent", {
      agentId: agent.id,
      agentName: agent.name,
    });

    try {
      await deleteAgent(agent.id);

      logger.info("Agent deleted successfully", {
        agentId: agent.id,
      });

      toast.success("Agent deleted");
    } catch (error) {
      logger.error("Failed to delete agent", error, {
        agentId: agent.id,
      });

      toast.error("Failed to delete agent");
    }
  };

  return <Card>...</Card>;
}
```

---

## 🚨 Error Handling Best Practices

### 1. Always Log Before Throwing

```typescript
// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  logger.error('Risky operation failed', error, { context });
  throw error; // Re-throw so caller knows it failed
}

// ❌ Bad
try {
  await riskyOperation();
} catch (error) {
  throw error; // Error lost, no log
}
```

### 2. Include Stack Traces

```typescript
// ✅ Good
logger.error('Database connection failed', error, {
  host: dbHost,
  database: dbName,
});

// ❌ Bad
logger.error('Database connection failed', null, {
  message: error.message, // Lost stack trace
});
```

### 3. Log at the Right Level

```typescript
// ✅ Good
try {
  const user = await findUser(id);
  if (!user) {
    logger.warn('User not found', { userId: id }); // Warning, not error
    return null;
  }
} catch (error) {
  logger.error('Database query failed', error); // Actual error
  throw error;
}
```

### 4. Don't Log Twice for Same Error

```typescript
// ❌ Bad - error logged twice
async function saveAgent(agent: Agent) {
  try {
    return await db.insert(agents).values(agent);
  } catch (error) {
    logger.error('Insert failed', error); // First log
    throw error;
  }
}

async function createAgent(data: CreateAgentInput) {
  try {
    return await saveAgent(data);
  } catch (error) {
    logger.error('Agent creation failed', error); // Second log (duplicate!)
    throw error;
  }
}

// ✅ Good - error logged once
async function saveAgent(agent: Agent) {
  // Let error bubble up
  return await db.insert(agents).values(agent);
}

async function createAgent(data: CreateAgentInput) {
  try {
    return await saveAgent(data);
  } catch (error) {
    logger.error('Agent creation failed', error); // Single log
    throw error;
  }
}
```

---

## 📈 Monitoring & Alerting

### What to Monitor

**Critical Errors (Alert Immediately):**

- Database connection failures
- External API failures (OpenAI, Clerk, etc.)
- Payment processing errors
- Data corruption detected

**Warning Patterns (Alert if Sustained):**

- High error rates (>1% of requests)
- Slow response times (p95 >1000ms)
- Rate limit warnings
- Memory usage spikes

**Informational (Track Trends):**

- User signups
- Agent executions
- Document uploads
- API usage patterns

### Sentry Alerts

Configure alerts in Sentry dashboard:

1. **Error Spike** - >50 errors in 5 minutes
2. **New Issue** - First occurrence of new error
3. **Regression** - Previously resolved error reappears
4. **Slow Performance** - API endpoint >2000ms

---

## 🎯 Quick Reference

### Do's and Don'ts

| ✅ Do                         | ❌ Don't                    |
| ----------------------------- | --------------------------- |
| Use `logger` utility          | Use `console.log` directly  |
| Include structured context    | Log unstructured strings    |
| Log before throwing errors    | Swallow errors silently     |
| Mask PII (emails, etc.)       | Log raw secrets/passwords   |
| Use appropriate log levels    | Use only `error` or `debug` |
| Keep messages concise         | Write paragraphs in logs    |
| Include IDs (user, workspace) | Include full user objects   |

### Common Patterns

```typescript
// User action
logger.info('User performed action', { userId, action, resourceId });

// System event
logger.info('Service started', { port, environment, version });

// Performance tracking
const start = Date.now();
// ... operation ...
logger.info('Operation completed', { operation, duration: Date.now() - start });

// Error with recovery
logger.warn('Primary service failed, using fallback', { error, service });

// Critical error
logger.error('Critical service failure', error, {
  service,
  retries,
  fatal: true,
});
```

---

## 🔄 Migration Guide

### Replacing Console Statements

**Before:**

```typescript
console.log('Agent created:', agent.id);
console.error('Failed to save:', error);
console.warn('Deprecated feature used');
```

**After:**

```typescript
logger.info('Agent created', { agentId: agent.id });
logger.error('Failed to save agent', error, { agentId: agent.id });
logger.warn('Deprecated feature used', { feature: 'old-api' });
```

### Adding Context

**Before:**

```typescript
logger.info('User logged in');
```

**After:**

```typescript
logger.info('User logged in', {
  userId: user.id,
  method: 'email',
  timestamp: new Date(),
});
```

---

## 📚 Related Documentation

- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md)
- [Error Handling Guidelines](../development/ERROR_HANDLING.md)
- [Monitoring & Observability](./MONITORING.md)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## 🔄 Version History

- **v1.0** (2025-10-18): Initial logging standards documentation
- Created as part of Sprint 1 Quality Checklist completion

---

**Last Updated:** 2025-10-18  
**Maintained By:** Engineering Team  
**Review Frequency:** Quarterly or when logger utility is updated

---

**🎯 Remember: Good logging is the difference between debugging in minutes vs. hours. Log smart!**
