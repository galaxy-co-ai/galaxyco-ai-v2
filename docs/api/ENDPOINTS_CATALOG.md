# GalaxyCo.ai 2.0 - API Endpoints Catalog

**Last Updated**: January 19, 2025  
**Total Endpoints**: 80+  
**Authentication**: Clerk session required for all endpoints

---

## Overview

This catalog documents all available API endpoints in the GalaxyCo.ai platform. All endpoints follow RESTful conventions and require proper authentication and workspace access.

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

### Authentication

All endpoints require authentication via Clerk session cookie or Bearer token.

---

## AI Agents

### Agent Management

| Method   | Endpoint                    | Description                             |
| -------- | --------------------------- | --------------------------------------- |
| `GET`    | `/api/agents`               | List all agents (paginated, filterable) |
| `POST`   | `/api/agents`               | Create new agent                        |
| `GET`    | `/api/agents/[id]`          | Get agent by ID                         |
| `PATCH`  | `/api/agents/[id]`          | Update agent configuration              |
| `DELETE` | `/api/agents/[id]`          | Delete agent                            |
| `POST`   | `/api/agents/[id]/activate` | Activate agent                          |
| `POST`   | `/api/agents/test-run`      | Test agent configuration                |

### Agent Executions

| Method | Endpoint                                    | Description                  |
| ------ | ------------------------------------------- | ---------------------------- |
| `GET`  | `/api/agents/[id]/executions`               | List agent execution history |
| `POST` | `/api/agents/[id]/executions`               | Execute agent manually       |
| `GET`  | `/api/agents/[id]/executions/[executionId]` | Get execution details        |

---

## AI Assistant

### Conversations

| Method   | Endpoint                     | Description                    |
| -------- | ---------------------------- | ------------------------------ |
| `GET`    | `/api/ai/conversations`      | List user conversations        |
| `POST`   | `/api/ai/conversations`      | Create new conversation        |
| `GET`    | `/api/ai/conversations/[id]` | Get conversation with messages |
| `DELETE` | `/api/ai/conversations/[id]` | Delete conversation            |

### Chat & AI Features

| Method | Endpoint                    | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| `POST` | `/api/ai/chat`              | Send chat message (streaming)         |
| `POST` | `/api/ai/enhance-prompt`    | Enhance agent prompts with AI         |
| `POST` | `/api/ai/generate-variants` | Generate agent configuration variants |
| `POST` | `/api/ai/iterate-workflow`  | AI-powered workflow improvements      |

---

## CRM System

### Customers

| Method   | Endpoint              | Description                            |
| -------- | --------------------- | -------------------------------------- |
| `GET`    | `/api/customers`      | List customers (paginated, filterable) |
| `POST`   | `/api/customers`      | Create new customer                    |
| `GET`    | `/api/customers/[id]` | Get customer details                   |
| `PATCH`  | `/api/customers/[id]` | Update customer                        |
| `DELETE` | `/api/customers/[id]` | Delete customer                        |

### Contacts

| Method   | Endpoint             | Description                           |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/api/contacts`      | List contacts (paginated, filterable) |
| `POST`   | `/api/contacts`      | Create new contact                    |
| `GET`    | `/api/contacts/[id]` | Get contact details                   |
| `PATCH`  | `/api/contacts/[id]` | Update contact                        |
| `DELETE` | `/api/contacts/[id]` | Delete contact                        |

### Projects

| Method   | Endpoint             | Description         |
| -------- | -------------------- | ------------------- |
| `GET`    | `/api/projects`      | List projects       |
| `POST`   | `/api/projects`      | Create new project  |
| `GET`    | `/api/projects/[id]` | Get project details |
| `PATCH`  | `/api/projects/[id]` | Update project      |
| `DELETE` | `/api/projects/[id]` | Delete project      |

### Prospects

| Method   | Endpoint              | Description                     |
| -------- | --------------------- | ------------------------------- |
| `GET`    | `/api/prospects`      | List prospects (sales pipeline) |
| `POST`   | `/api/prospects`      | Create new prospect             |
| `GET`    | `/api/prospects/[id]` | Get prospect details            |
| `PATCH`  | `/api/prospects/[id]` | Update prospect                 |
| `DELETE` | `/api/prospects/[id]` | Delete prospect                 |

### Segments

| Method   | Endpoint             | Description                   |
| -------- | -------------------- | ----------------------------- |
| `GET`    | `/api/segments`      | List customer segments        |
| `POST`   | `/api/segments`      | Create new segment            |
| `GET`    | `/api/segments/[id]` | Get segment with member count |
| `PATCH`  | `/api/segments/[id]` | Update segment criteria       |
| `DELETE` | `/api/segments/[id]` | Delete segment                |

---

## Work Management

### Tasks

| Method   | Endpoint          | Description                                 |
| -------- | ----------------- | ------------------------------------------- |
| `GET`    | `/api/tasks`      | List tasks (filterable by status, assignee) |
| `POST`   | `/api/tasks`      | Create new task                             |
| `GET`    | `/api/tasks/[id]` | Get task details                            |
| `PATCH`  | `/api/tasks/[id]` | Update task                                 |
| `DELETE` | `/api/tasks/[id]` | Delete task                                 |

### Calendar

| Method   | Endpoint             | Description          |
| -------- | -------------------- | -------------------- |
| `GET`    | `/api/calendar`      | List calendar events |
| `POST`   | `/api/calendar`      | Create new event     |
| `GET`    | `/api/calendar/[id]` | Get event details    |
| `PATCH`  | `/api/calendar/[id]` | Update event         |
| `DELETE` | `/api/calendar/[id]` | Delete event         |

### Inbox

| Method   | Endpoint          | Description           |
| -------- | ----------------- | --------------------- |
| `GET`    | `/api/inbox`      | List inbox messages   |
| `POST`   | `/api/inbox`      | Create new message    |
| `GET`    | `/api/inbox/[id]` | Get message details   |
| `PATCH`  | `/api/inbox/[id]` | Mark as read/archived |
| `DELETE` | `/api/inbox/[id]` | Delete message        |

### Notifications

| Method   | Endpoint                  | Description             |
| -------- | ------------------------- | ----------------------- |
| `GET`    | `/api/notifications`      | List user notifications |
| `POST`   | `/api/notifications`      | Create notification     |
| `PATCH`  | `/api/notifications/[id]` | Mark as read/dismissed  |
| `DELETE` | `/api/notifications/[id]` | Delete notification     |

---

## Business Operations

### Invoices

| Method   | Endpoint             | Description                          |
| -------- | -------------------- | ------------------------------------ |
| `GET`    | `/api/invoices`      | List invoices (filterable by status) |
| `POST`   | `/api/invoices`      | Create new invoice                   |
| `GET`    | `/api/invoices/[id]` | Get invoice details                  |
| `PATCH`  | `/api/invoices/[id]` | Update invoice                       |
| `DELETE` | `/api/invoices/[id]` | Delete invoice                       |

### Campaigns

| Method   | Endpoint              | Description              |
| -------- | --------------------- | ------------------------ |
| `GET`    | `/api/campaigns`      | List marketing campaigns |
| `POST`   | `/api/campaigns`      | Create new campaign      |
| `GET`    | `/api/campaigns/[id]` | Get campaign details     |
| `PATCH`  | `/api/campaigns/[id]` | Update campaign          |
| `DELETE` | `/api/campaigns/[id]` | Delete campaign          |

### Email Threads

| Method   | Endpoint           | Description                  |
| -------- | ------------------ | ---------------------------- |
| `GET`    | `/api/emails`      | List email threads           |
| `POST`   | `/api/emails`      | Create email thread          |
| `GET`    | `/api/emails/[id]` | Get email thread             |
| `PATCH`  | `/api/emails/[id]` | Update thread (star, folder) |
| `DELETE` | `/api/emails/[id]` | Delete thread                |

---

## Knowledge Management

### Documents

| Method   | Endpoint                | Description              |
| -------- | ----------------------- | ------------------------ |
| `GET`    | `/api/documents`        | List documents           |
| `POST`   | `/api/documents`        | Create/upload document   |
| `GET`    | `/api/documents/[id]`   | Get document details     |
| `PATCH`  | `/api/documents/[id]`   | Update document metadata |
| `DELETE` | `/api/documents/[id]`   | Delete document          |
| `POST`   | `/api/documents/upload` | Upload file and process  |

### Templates

| Method   | Endpoint              | Description                   |
| -------- | --------------------- | ----------------------------- |
| `GET`    | `/api/templates`      | List workflow/agent templates |
| `POST`   | `/api/templates`      | Create new template           |
| `GET`    | `/api/templates/[id]` | Get template details          |
| `PATCH`  | `/api/templates/[id]` | Update template               |
| `DELETE` | `/api/templates/[id]` | Delete template               |

### Resources

| Method   | Endpoint              | Description              |
| -------- | --------------------- | ------------------------ |
| `GET`    | `/api/resources`      | List knowledge resources |
| `POST`   | `/api/resources`      | Create new resource      |
| `GET`    | `/api/resources/[id]` | Get resource details     |
| `PATCH`  | `/api/resources/[id]` | Update resource          |
| `DELETE` | `/api/resources/[id]` | Delete resource          |

---

## Data Management

### Exports

| Method   | Endpoint            | Description                |
| -------- | ------------------- | -------------------------- |
| `GET`    | `/api/exports`      | List export jobs           |
| `POST`   | `/api/exports`      | Create new export          |
| `GET`    | `/api/exports/[id]` | Get export status/download |
| `DELETE` | `/api/exports/[id]` | Delete export              |

### Imports

| Method   | Endpoint            | Description       |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/imports`      | List import jobs  |
| `POST`   | `/api/imports`      | Create new import |
| `GET`    | `/api/imports/[id]` | Get import status |
| `DELETE` | `/api/imports/[id]` | Delete import     |

### Audit Logs

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| `GET`  | `/api/audit-log` | List workspace activity logs |

---

## Analytics

### Dashboard Analytics

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| `GET`  | `/api/analytics/sales`      | Sales metrics and revenue data      |
| `GET`  | `/api/analytics/marketing`  | Campaign and prospect analytics     |
| `GET`  | `/api/analytics/outreach`   | Task and contact analytics          |
| `GET`  | `/api/analytics/time-usage` | Time tracking and productivity      |
| `GET`  | `/api/analytics/usage`      | Agent usage and performance metrics |

---

## Settings & Configuration

### User Settings

| Method  | Endpoint                    | Description              |
| ------- | --------------------------- | ------------------------ |
| `GET`   | `/api/users/me`             | Get current user profile |
| `PATCH` | `/api/users/me`             | Update user profile      |
| `GET`   | `/api/users/me/preferences` | Get user preferences     |
| `PATCH` | `/api/users/me/preferences` | Update user preferences  |

### Workspace Settings

| Method  | Endpoint                           | Description               |
| ------- | ---------------------------------- | ------------------------- |
| `GET`   | `/api/workspaces/current`          | Get current workspace     |
| `PATCH` | `/api/workspaces/current`          | Update workspace settings |
| `GET`   | `/api/workspaces/current/members`  | List workspace members    |
| `POST`  | `/api/workspaces/current/members`  | Invite new member         |
| `GET`   | `/api/workspaces/current/security` | Get security settings     |
| `PATCH` | `/api/workspaces/current/security` | Update security settings  |

### Billing & Integrations

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| `GET`  | `/api/billing`      | Get billing information (stub)     |
| `GET`  | `/api/integrations` | List available integrations (stub) |

---

## Admin Routes (System Admin Only)

### Admin Analytics

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| `GET`  | `/api/admin/analytics` | System-wide analytics |

### Admin User Management

| Method   | Endpoint                | Description                |
| -------- | ----------------------- | -------------------------- |
| `GET`    | `/api/admin/users`      | List all users (paginated) |
| `GET`    | `/api/admin/users/[id]` | Get user details           |
| `PATCH`  | `/api/admin/users/[id]` | Update user                |
| `DELETE` | `/api/admin/users/[id]` | Delete user                |

### Admin Workspace Management

| Method   | Endpoint                     | Description                     |
| -------- | ---------------------------- | ------------------------------- |
| `GET`    | `/api/admin/workspaces`      | List all workspaces (paginated) |
| `GET`    | `/api/admin/workspaces/[id]` | Get workspace details           |
| `PATCH`  | `/api/admin/workspaces/[id]` | Update workspace                |
| `DELETE` | `/api/admin/workspaces/[id]` | Delete workspace                |

### Admin System

| Method  | Endpoint               | Description            |
| ------- | ---------------------- | ---------------------- |
| `GET`   | `/api/admin/settings`  | Get system settings    |
| `PATCH` | `/api/admin/settings`  | Update system settings |
| `GET`   | `/api/admin/audit-log` | System audit log       |

---

## Developer Tools

### Webhooks

| Method   | Endpoint             | Description               |
| -------- | -------------------- | ------------------------- |
| `GET`    | `/api/webhooks`      | List webhook integrations |
| `POST`   | `/api/webhooks`      | Create new webhook        |
| `GET`    | `/api/webhooks/[id]` | Get webhook details       |
| `PATCH`  | `/api/webhooks/[id]` | Update webhook            |
| `DELETE` | `/api/webhooks/[id]` | Delete webhook            |

### API Testing

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| `POST` | `/api/playground` | API testing playground |

---

## System & Health

### System Status

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| `GET`  | `/api/health` | Health check endpoint |

### Chat Integration

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| `GET`  | `/api/chat`      | List chat conversations |
| `POST` | `/api/chat`      | Create new chat         |
| `GET`  | `/api/chat/[id]` | Get chat details        |

---

## Request/Response Patterns

### Standard List Response

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Example Item",
      "workspace_id": "workspace-uuid",
      "created_at": "2025-01-19T12:00:00Z",
      "updated_at": "2025-01-19T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Standard Single Resource Response

```json
{
  "data": {
    "id": "uuid",
    "name": "Example Item",
    "workspace_id": "workspace-uuid",
    "created_at": "2025-01-19T12:00:00Z",
    "updated_at": "2025-01-19T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": {
    "field_name": {
      "_errors": ["Field is required"]
    }
  }
}
```

---

## Query Parameters

### Common Pagination Parameters

- `limit` (number): Items per page (max: 100, default: 20)
- `offset` (number): Items to skip (default: 0)

### Common Filter Parameters

- `workspaceId` (uuid): Workspace filter (required for most endpoints)
- `status` (string): Filter by status
- `search` (string): Full-text search
- `sort` (string): Sort field (default: created_at)
- `order` (string): Sort order - asc|desc (default: desc)

### Date Range Filters

- `created_at[gte]` (ISO date): Created after date
- `created_at[lte]` (ISO date): Created before date
- `updated_at[gte]` (ISO date): Updated after date
- `updated_at[lte]` (ISO date): Updated before date

---

## Authentication Examples

### Cookie-based (Web App)

```bash
curl -X GET 'http://localhost:3000/api/agents' \
  -H 'Cookie: connect.sid=session_token_here'
```

### Bearer Token (API Clients)

```bash
curl -X GET 'http://localhost:3000/api/agents' \
  -H 'Authorization: Bearer your_token_here'
```

---

## Error Status Codes

| Code | Meaning               | Use Case                 |
| ---- | --------------------- | ------------------------ |
| 200  | OK                    | Successful GET, PATCH    |
| 201  | Created               | Successful POST          |
| 204  | No Content            | Successful DELETE        |
| 400  | Bad Request           | Validation error         |
| 401  | Unauthorized          | Missing/invalid auth     |
| 403  | Forbidden             | Insufficient permissions |
| 404  | Not Found             | Resource doesn't exist   |
| 409  | Conflict              | Duplicate resource       |
| 422  | Unprocessable Entity  | Business logic error     |
| 500  | Internal Server Error | Unexpected error         |

---

## Rate Limiting

Current rate limits (future implementation):

- **Authenticated Users**: 1000 requests/hour
- **AI API Calls**: 100 requests/hour per workspace
- **File Uploads**: 10 files/minute

---

**Maintained by**: GalaxyCo.ai Engineering Team  
**API Version**: 1.0  
**OpenAPI Spec**: Coming soon
