# API Design Specification

**Version:** 1.0.0  
**Last Updated:** 2025-01-19  
**Status:** Active

## Overview

This document defines the API design standards and patterns for the GalaxyCo.ai platform. All API endpoints must adhere to these specifications to ensure consistency, security, and maintainability.

---

## Table of Contents

1. [General Principles](#general-principles)
2. [Authentication & Authorization](#authentication--authorization)
3. [Request/Response Format](#requestresponse-format)
4. [Pagination](#pagination)
5. [Filtering & Sorting](#filtering--sorting)
6. [Validation](#validation)
7. [Error Handling](#error-handling)
8. [API Versioning](#api-versioning)
9. [OpenAPI Schema](#openapi-schema)
10. [Code Examples](#code-examples)

---

## General Principles

### REST Conventions

- Use RESTful resource naming (plural nouns: `/api/agents`, `/api/workflows`)
- HTTP methods map to CRUD: `GET` (read), `POST` (create), `PATCH` (update), `DELETE` (delete)
- Use HTTP status codes correctly (see [Error Handling](#error-handling))

### URL Structure

```
/api/{resource}              # List all (GET), Create new (POST)
/api/{resource}/{id}         # Get (GET), Update (PATCH), Delete (DELETE)
/api/{resource}/{id}/{sub}   # Sub-resources (e.g., /api/agents/123/executions)
```

### Content Type

- All requests and responses use `application/json`
- Exceptions: file uploads may use `multipart/form-data`

---

## Authentication & Authorization

### Authentication

All API requests must include a valid session cookie or bearer token:

```http
Cookie: connect.sid=<session_token>
```

Or:

```http
Authorization: Bearer <access_token>
```

### Workspace Context

Every authenticated request operates within a workspace context:

1. **Workspace Scoping**: All data operations are scoped to `req.user.workspace_id`
2. **Role-Based Access Control (RBAC)**: Actions are authorized based on workspace membership role

#### Workspace Roles

| Role           | Permissions                                       |
| -------------- | ------------------------------------------------- |
| `owner`        | Full control (CRUD all resources, manage members) |
| `admin`        | Manage resources, view audit logs                 |
| `member`       | Read/write own resources, read shared resources   |
| `viewer`       | Read-only access                                  |
| `system_admin` | Cross-workspace admin (audit logs, admin pages)   |

### Authorization Middleware

```typescript
// Example: Require workspace admin or owner
export const requireWorkspaceAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.workspaceRole;
  if (role !== 'admin' && role !== 'owner') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin or owner role required',
    });
  }
  next();
};
```

### API Key Authentication (Future)

For programmatic access, support API keys:

```http
X-API-Key: <api_key>
```

---

## Request/Response Format

### Success Response Structure

```json
{
  "data": {
    /* single resource */
  },
  "meta": {
    /* optional metadata */
  }
}
```

Or for lists:

```json
{
  "data": [
    /* array of resources */
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Example: Get Agent by ID

**Request:**

```http
GET /api/agents/123
```

**Response (200 OK):**

```json
{
  "data": {
    "id": "123",
    "name": "Customer Support Bot",
    "workspace_id": "ws_abc",
    "model": "gpt-4",
    "status": "active",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-19T12:30:00Z"
  }
}
```

---

## Pagination

### Offset-Based Pagination (Current Standard)

All list endpoints support offset-based pagination via query parameters:

| Parameter | Type   | Default | Description                         |
| --------- | ------ | ------- | ----------------------------------- |
| `limit`   | number | 20      | Number of items per page (max: 100) |
| `offset`  | number | 0       | Number of items to skip             |

**Example Request:**

```http
GET /api/agents?limit=10&offset=20
```

**Example Response:**

```json
{
  "data": [
    /* 10 agents */
  ],
  "pagination": {
    "total": 142,
    "limit": 10,
    "offset": 20,
    "hasMore": true
  }
}
```

### Response Metadata

- `total`: Total count of items (for UI pagination controls)
- `limit`: Requested page size
- `offset`: Current offset
- `hasMore`: Boolean indicating if more pages exist

### Implementation Pattern

```typescript
router.get('/api/agents', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  const workspace_id = req.user.workspace_id;

  const [agents, total] = await Promise.all([
    db.agents.where('workspace_id', workspace_id).limit(limit).offset(offset),
    db.agents.where('workspace_id', workspace_id).count('id'),
  ]);

  res.json({
    data: agents,
    pagination: {
      total: total[0].count,
      limit,
      offset,
      hasMore: offset + limit < total[0].count,
    },
  });
});
```

### Future: Cursor-Based Pagination (Optional)

For high-performance needs (e.g., real-time feeds), consider cursor-based pagination:

```http
GET /api/agents?limit=20&cursor=eyJpZCI6MTIzfQ==
```

Response includes `nextCursor` and `prevCursor` for navigation.

---

## Filtering & Sorting

### Filtering

Support common filters via query parameters:

| Parameter    | Example                | Description                   |
| ------------ | ---------------------- | ----------------------------- |
| `status`     | `?status=active`       | Filter by status              |
| `search`     | `?search=bot`          | Full-text search (name, desc) |
| `created_at` | `?created_at[gte]=...` | Date range filters            |

**Multi-value filters:**

```http
GET /api/agents?status=active&status=pending
```

**Date range operators:**

- `gte`: Greater than or equal
- `lte`: Less than or equal
- `gt`: Greater than
- `lt`: Less than

### Sorting

Use `sort` and `order` parameters:

```http
GET /api/agents?sort=created_at&order=desc
```

- `sort`: Field name (default: `created_at`)
- `order`: `asc` or `desc` (default: `desc`)

### Implementation Example

```typescript
router.get('/api/agents', async (req, res) => {
  const { status, search, sort = 'created_at', order = 'desc' } = req.query;

  let query = db.agents.where('workspace_id', req.user.workspace_id);

  if (status) {
    query = query.whereIn('status', Array.isArray(status) ? status : [status]);
  }

  if (search) {
    query = query.where(function () {
      this.where('name', 'ilike', `%${search}%`).orWhere('description', 'ilike', `%${search}%`);
    });
  }

  query = query.orderBy(sort as string, order as 'asc' | 'desc');

  const agents = await query;
  res.json({ data: agents });
});
```

---

## Validation

### Request Validation

Use **Zod** schemas for type-safe validation:

```typescript
import { z } from 'zod';

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3']),
  temperature: z.number().min(0).max(2).default(0.7),
  systemPrompt: z.string().optional(),
});

router.post('/api/agents', async (req, res) => {
  const result = CreateAgentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: result.error.format(),
    });
  }

  // Create agent with validated data
  const agent = await db.agents.create({
    ...result.data,
    workspace_id: req.user.workspace_id,
  });

  res.status(201).json({ data: agent });
});
```

### Common Validation Rules

- **Required fields**: Use `.min(1)` for strings, no `.optional()` for required
- **String length**: `.min(1).max(255)` for names, `.max(5000)` for descriptions
- **Email**: `z.string().email()`
- **URL**: `z.string().url()`
- **Enum**: `z.enum(['value1', 'value2'])`
- **Numbers**: `.min()`, `.max()`, `.int()`, `.positive()`
- **Dates**: `z.string().datetime()` or `z.date()`

---

## Error Handling

### HTTP Status Codes

| Code | Meaning               | Use Case                                   |
| ---- | --------------------- | ------------------------------------------ |
| 200  | OK                    | Successful GET, PATCH                      |
| 201  | Created               | Successful POST                            |
| 204  | No Content            | Successful DELETE                          |
| 400  | Bad Request           | Validation error, malformed request        |
| 401  | Unauthorized          | Missing or invalid authentication          |
| 403  | Forbidden             | Authenticated but insufficient permissions |
| 404  | Not Found             | Resource does not exist                    |
| 409  | Conflict              | Duplicate resource, constraint violation   |
| 422  | Unprocessable Entity  | Business logic error (e.g., invalid state) |
| 500  | Internal Server Error | Unexpected server error                    |
| 503  | Service Unavailable   | Temporary downtime, maintenance            |

### Error Response Format

All errors return a consistent JSON structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    /* optional additional context */
  }
}
```

### Examples

**400 Bad Request (Validation Error):**

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": {
    "name": {
      "_errors": ["String must contain at least 1 character(s)"]
    },
    "model": {
      "_errors": ["Invalid enum value. Expected 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3'"]
    }
  }
}
```

**403 Forbidden:**

```json
{
  "error": "Forbidden",
  "message": "Admin role required to perform this action"
}
```

**404 Not Found:**

```json
{
  "error": "Not Found",
  "message": "Agent with ID '123' not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "details": {
    "request_id": "req_abc123"
  }
}
```

### Error Handling Middleware

```typescript
// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);

  // Log to monitoring service (Sentry, Datadog, etc.)
  logger.error({
    error: err.message,
    stack: err.stack,
    user_id: req.user?.id,
    workspace_id: req.user?.workspace_id,
    request_id: req.id,
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
    details: { request_id: req.id },
  });
});
```

---

## API Versioning

### Current Strategy: No Versioning (v1 Implicit)

All endpoints are currently under `/api/*` without explicit versioning. This is acceptable for initial development.

### Future Strategy: URL Path Versioning

When breaking changes are introduced, version via URL path:

```
/api/v1/agents
/api/v2/agents
```

**Deprecation Process:**

1. Announce deprecation with timeline (e.g., 6 months)
2. Add `X-API-Deprecated` header to old version responses
3. Update documentation and client SDKs
4. Remove old version after sunset period

---

## OpenAPI Schema

### Schema Generation

Generate OpenAPI 3.0 schemas from Zod definitions using `zod-to-openapi`:

```typescript
import { extendZodWithOpenApi } from 'zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const AgentSchema = z
  .object({
    id: z.string().openapi({ example: 'agent_123' }),
    name: z.string().min(1).max(100).openapi({ example: 'Customer Support Bot' }),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3']),
    status: z.enum(['active', 'inactive', 'draft']).default('draft'),
  })
  .openapi('Agent');
```

### OpenAPI Documentation

Host interactive API docs at `/api/docs` using Swagger UI or Redoc:

```typescript
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi-spec';

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
```

### Example OpenAPI Spec (Excerpt)

```yaml
openapi: 3.0.0
info:
  title: GalaxyCo.ai API
  version: 1.0.0
  description: Automation platform API

paths:
  /api/agents:
    get:
      summary: List agents
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Agent'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

components:
  schemas:
    Agent:
      type: object
      required:
        - id
        - name
        - workspace_id
      properties:
        id:
          type: string
        name:
          type: string
        model:
          type: string
          enum: [gpt-4, gpt-3.5-turbo, claude-3]
```

---

## Code Examples

### Complete CRUD Endpoint Example

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, requireWorkspaceAdmin } from '../middleware/auth';

const router = Router();

// Zod schemas
const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3']),
  temperature: z.number().min(0).max(2).default(0.7),
  systemPrompt: z.string().optional(),
});

const UpdateAgentSchema = CreateAgentSchema.partial();

// List agents (GET /api/agents)
router.get('/api/agents', requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { status, search, sort = 'created_at', order = 'desc' } = req.query;
    const workspace_id = req.user.workspace_id;

    let query = db.agents.where('workspace_id', workspace_id);

    if (status) {
      query = query.whereIn('status', Array.isArray(status) ? status : [status]);
    }

    if (search) {
      query = query.where(function () {
        this.where('name', 'ilike', `%${search}%`).orWhere('description', 'ilike', `%${search}%`);
      });
    }

    query = query.orderBy(sort as string, order as 'asc' | 'desc');

    const [agents, totalResult] = await Promise.all([
      query.limit(limit).offset(offset),
      db.agents.where('workspace_id', workspace_id).count('id'),
    ]);

    const total = parseInt(totalResult[0].count as string);

    res.json({
      data: agents,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get agent by ID (GET /api/agents/:id)
router.get('/api/agents/:id', requireAuth, async (req, res, next) => {
  try {
    const agent = await db.agents
      .where({ id: req.params.id, workspace_id: req.user.workspace_id })
      .first();

    if (!agent) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent with ID '${req.params.id}' not found`,
      });
    }

    res.json({ data: agent });
  } catch (error) {
    next(error);
  }
});

// Create agent (POST /api/agents)
router.post('/api/agents', requireAuth, async (req, res, next) => {
  try {
    const result = CreateAgentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: result.error.format(),
      });
    }

    const agent = await db.agents
      .insert({
        ...result.data,
        workspace_id: req.user.workspace_id,
        created_by: req.user.id,
        status: 'draft',
      })
      .returning('*');

    res.status(201).json({ data: agent[0] });
  } catch (error) {
    next(error);
  }
});

// Update agent (PATCH /api/agents/:id)
router.patch('/api/agents/:id', requireAuth, async (req, res, next) => {
  try {
    const result = UpdateAgentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: result.error.format(),
      });
    }

    const agent = await db.agents
      .where({ id: req.params.id, workspace_id: req.user.workspace_id })
      .update(result.data)
      .returning('*');

    if (!agent.length) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent with ID '${req.params.id}' not found`,
      });
    }

    res.json({ data: agent[0] });
  } catch (error) {
    next(error);
  }
});

// Delete agent (DELETE /api/agents/:id)
router.delete('/api/agents/:id', requireAuth, requireWorkspaceAdmin, async (req, res, next) => {
  try {
    const deleted = await db.agents
      .where({ id: req.params.id, workspace_id: req.user.workspace_id })
      .delete();

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent with ID '${req.params.id}' not found`,
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

## Summary Checklist

When implementing a new API endpoint, ensure:

- [ ] Uses RESTful conventions (`/api/{resource}`, HTTP methods)
- [ ] Includes authentication check (`requireAuth` middleware)
- [ ] Enforces workspace scoping (`workspace_id` filter)
- [ ] Validates request body with Zod schema
- [ ] Supports pagination for list endpoints (`limit`, `offset`)
- [ ] Supports filtering and sorting where applicable
- [ ] Returns consistent success/error response format
- [ ] Uses correct HTTP status codes
- [ ] Includes error handling and logging
- [ ] Documents endpoint in OpenAPI schema
- [ ] Writes unit and integration tests

---

## References

- [REST API Best Practices](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Zod Documentation](https://zod.dev/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**End of Document**
