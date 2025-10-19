# GalaxyCo.ai 2.0 - System Architecture

**Version**: 2.0  
**Last Updated**: January 19, 2025  
**Status**: Production

---

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Monorepo Structure](#monorepo-structure)
4. [Multi-Tenant Architecture](#multi-tenant-architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Data Flow](#data-flow)
7. [API Design](#api-design)
8. [Database Design](#database-design)
9. [AI Agent System](#ai-agent-system)
10. [Security Architecture](#security-architecture)
11. [Deployment Architecture](#deployment-architecture)

---

## Overview

GalaxyCo.ai is a multi-tenant enterprise automation platform built as a TypeScript monorepo. The system enables organizations to create, manage, and execute AI agents with comprehensive workspace isolation, role-based access control, and integrations with multiple LLM providers.

### Core Principles

1. **Multi-Tenant by Design** - Complete workspace isolation at the database level
2. **Type Safety** - TypeScript across frontend and backend with Zod validation
3. **API-First** - RESTful APIs with consistent patterns and error handling
4. **Real-Time Capable** - WebSocket support for live updates
5. **Scalable** - Horizontal scaling with stateless services
6. **Observable** - Comprehensive logging, monitoring, and audit trails

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Mobile App  │  │  API Clients │         │
│  │  (Next.js)   │  │   (Future)   │  │   (SDK)      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │   │
│  │  │   Pages  │  │ API Routes│  │Server    │  │ Server │ │   │
│  │  │  (RSC)   │  │ (REST)    │  │Components│  │Actions │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               NestJS API Server (Optional)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │Controllers│  │ Services │  │ Modules  │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Pinecone  │  │    Redis     │         │
│  │  (Neon)      │  │  (Vector DB) │  │   (Cache)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Clerk  │  │  OpenAI  │  │Anthropic │  │  Vercel  │        │
│  │ (Auth) │  │  (LLM)   │  │  (LLM)   │  │  (Blob)  │        │
│  └────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

### Turborepo Workspaces

```typescript
// package.json (root)
{
  "name": "galaxyco-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### Workspace Packages

#### Apps

- **`apps/web`** - Next.js 14 web application (main user interface)
- **`apps/api`** - NestJS API server (optional, currently minimal use)

#### Packages

- **`packages/database`** - Drizzle ORM schema, migrations, and database client
- **`packages/agents-core`** - Shared agent logic, types, and processors

### Dependency Graph

```
apps/web  ─┬─> packages/database
           └─> packages/agents-core

apps/api  ─┬─> packages/database
           └─> packages/agents-core

packages/agents-core ─> packages/database
```

### Build System

- **Package Manager**: pnpm (faster, efficient disk usage)
- **Build Tool**: Turborepo (parallel builds, remote caching)
- **Type Checking**: TypeScript 5.5 (strict mode)
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier 3.3

---

## Multi-Tenant Architecture

### Workspace Isolation

Every data record belongs to exactly one workspace. This is enforced at:

1. **Database Level** - `workspace_id` column on every table with indexes
2. **API Level** - Middleware validates workspace membership
3. **UI Level** - Workspace context provider filters all data

### Security Rule (Critical)

```typescript
/**
 * MULTI-TENANT SECURITY RULE (4kR94Z3XhqK4C54vwDDwnq)
 * =====================================================
 * ALL queries MUST include workspace_id filter in WHERE clauses
 * NEVER expose data across workspace boundaries
 * Use row-level security policies where applicable
 * Validate workspace_id matches authenticated user's workspace
 * Log any cross-workspace data access attempts as security incidents
 */

// ✅ CORRECT
const agents = await db
  .select()
  .from(schema.agents)
  .where(eq(schema.agents.workspaceId, currentWorkspace.id));

// ❌ WRONG - Missing workspace filter
const agents = await db.select().from(schema.agents);
```

### Role-Based Access Control (RBAC)

#### Roles

| Role             | Permissions                                                |
| ---------------- | ---------------------------------------------------------- |
| **owner**        | Full control (CRUD all resources, manage members, billing) |
| **admin**        | Manage resources, view audit logs, manage agents           |
| **member**       | Read/write own resources, read shared resources            |
| **viewer**       | Read-only access to workspace resources                    |
| **system_admin** | Cross-workspace admin (audit logs, system settings)        |

#### Workspace Membership

```typescript
// Database schema
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: userRoleEnum("role").notNull().default("member"),
  permissions: jsonb("permissions")
    .$type<{
      agents?: { create?: boolean; edit?: boolean; delete?: boolean };
      billing?: { view?: boolean; manage?: boolean };
    }>()
    .default({}),
});
```

---

## Authentication & Authorization

### Clerk Integration

1. **User Signs In** → Clerk handles OAuth/email authentication
2. **Clerk Webhook** → Syncs user data to our database
3. **Session Management** → Clerk manages JWT tokens
4. **API Protection** → Middleware validates Clerk session

### Auth Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Sign In
     ▼
┌─────────────────┐
│  Clerk (OAuth)  │
│  - Google       │
│  - Email/Pass   │
└────┬────────────┘
     │ 2. JWT Token
     ▼
┌─────────────────┐     3. Webhook         ┌──────────┐
│   Web App       │──────────────────────>│ Database │
│  (Next.js)      │<───────────────────────│  (Sync)  │
└────┬────────────┘     4. User Created    └──────────┘
     │ 5. API Request (with session cookie)
     ▼
┌─────────────────┐
│  API Middleware │
│  - Validate JWT │
│  - Load User    │
│  - Check RBAC   │
└────┬────────────┘
     │ 6. Authorized Request
     ▼
┌─────────────────┐
│  API Handlers   │
└─────────────────┘
```

### Middleware Stack

```typescript
// apps/web/middleware.ts
export default clerkMiddleware((auth, request) => {
  // 1. Clerk authentication
  const { userId } = auth();
  if (!userId && !isPublicRoute(request.url)) {
    return redirectToSignIn();
  }

  // 2. Workspace context
  const workspaceId = getWorkspaceFromRequest(request);

  // 3. Permission check
  if (requiresAdmin(request.url)) {
    const hasPermission = await checkWorkspaceAdmin(userId, workspaceId);
    if (!hasPermission) return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.next();
});
```

---

## Data Flow

### Read Operations

```
User Action (UI)
    │
    ▼
React Component
    │
    ▼
SWR Hook (data fetching)
    │
    ▼
API Route (/api/agents)
    │
    ▼
Auth Middleware (validate session)
    │
    ▼
Workspace Validation
    │
    ▼
Database Query (with workspace_id filter)
    │
    ▼
Drizzle ORM
    │
    ▼
PostgreSQL (Neon)
    │
    ▼
JSON Response { data, pagination }
    │
    ▼
SWR Cache
    │
    ▼
React Component (render)
```

### Write Operations

```
User Action (Form Submit)
    │
    ▼
React Hook Form (validation)
    │
    ▼
Zod Schema Validation (client)
    │
    ▼
API Route (/api/agents POST)
    │
    ▼
Auth Middleware
    │
    ▼
Zod Schema Validation (server)
    │
    ▼
RBAC Permission Check
    │
    ▼
Database Insert (with workspace_id)
    │
    ▼
Drizzle ORM
    │
    ▼
PostgreSQL
    │
    ▼
Audit Log Entry
    │
    ▼
SWR Mutate (invalidate cache)
    │
    ▼
UI Update (optimistic or refetch)
```

---

## API Design

### RESTful Conventions

```
GET    /api/agents              # List all agents
POST   /api/agents              # Create new agent
GET    /api/agents/:id          # Get agent by ID
PATCH  /api/agents/:id          # Update agent
DELETE /api/agents/:id          # Delete agent

GET    /api/agents/:id/executions    # Sub-resources
POST   /api/agents/:id/activate      # Actions
```

### Request/Response Format

**Success Response:**

```json
{
  "data": {
    /* resource or array */
  },
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Response:**

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": {
    /* field-level errors */
  }
}
```

### Pagination

All list endpoints use offset-based pagination:

```
GET /api/agents?limit=20&offset=40
```

See [API Design Specification](api/API_DESIGN_SPECIFICATION.md) for complete details.

---

## Database Design

### Schema Overview

- **40+ tables** with complete multi-tenant support
- **Drizzle ORM** for type-safe queries
- **PostgreSQL** (Neon serverless)
- **Migrations** managed with Drizzle Kit

### Core Tables

#### Workspaces (Tenant Boundary)

```typescript
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  settings: jsonb("settings"),
  encryptedApiKeys: jsonb("encrypted_api_keys"), // AES-256-GCM encrypted
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

#### Users

```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

#### Workspace Members (Junction Table with RBAC)

```typescript
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: userRoleEnum("role").notNull().default("member"),
  permissions: jsonb("permissions"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});
```

See [Database Schema](database/SCHEMA.md) for complete documentation.

---

## AI Agent System

### Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Agent Engine                      │
│  ┌────────────────────────────────────────────┐    │
│  │           Agent Configuration               │    │
│  │  - AI Provider (OpenAI/Anthropic/Google)   │    │
│  │  - Model (GPT-4, Claude-3, etc.)           │    │
│  │  - Temperature, Max Tokens                 │    │
│  │  - System Prompt                           │    │
│  │  - Tools & Functions                       │    │
│  │  - Knowledge Base Scope                    │    │
│  └────────────────────────────────────────────┘    │
│                        │                             │
│                        ▼                             │
│  ┌────────────────────────────────────────────┐    │
│  │          Execution Pipeline                 │    │
│  │  1. Input Validation (Zod)                 │    │
│  │  2. Context Loading (RAG)                  │    │
│  │  3. LLM API Call                           │    │
│  │  4. Tool Execution                         │    │
│  │  5. Output Processing                      │    │
│  │  6. Logging & Metrics                      │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Agent Execution Flow

1. **Trigger** - Manual, scheduled (cron), or webhook
2. **Input Validation** - Zod schema validation
3. **Context Retrieval** - RAG with Pinecone vector search
4. **LLM Call** - OpenAI/Anthropic API with retry logic
5. **Tool Execution** - Execute functions/integrations
6. **Output Processing** - Format and validate response
7. **Audit Logging** - Record execution details
8. **Metrics** - Track duration, tokens, cost

---

## Security Architecture

### Encryption

- **API Keys** - AES-256-GCM encryption with IV and auth tag
- **Secrets** - Environment variables, never committed
- **Passwords** - Handled by Clerk (bcrypt)
- **HTTPS** - TLS 1.3 for all traffic

### Audit Logging

Every sensitive operation is logged:

```typescript
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey(),
  workspaceId: uuid("workspace_id").notNull(),
  userId: uuid("user_id"),
  action: text("action").notNull(), // 'create', 'update', 'delete'
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  changes: jsonb("changes"), // before/after diff
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### Rate Limiting

- Per-user rate limits on API endpoints
- Per-workspace LLM token usage tracking
- Subscription tier enforcement

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────────┐
│              Vercel Edge Network             │
│  ┌────────────────────────────────────┐    │
│  │       Next.js App (SSR/Static)     │    │
│  │  - CDN caching for static assets   │    │
│  │  - Edge functions for API routes   │    │
│  │  - Automatic HTTPS                  │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│               Neon PostgreSQL                │
│  - Serverless Postgres                       │
│  - Auto-scaling compute                      │
│  - Point-in-time recovery                    │
│  - Read replicas (future)                    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│            External Services                 │
│  - Clerk (auth)                              │
│  - Pinecone (vector DB)                      │
│  - OpenAI/Anthropic (LLMs)                  │
│  - Sentry (error tracking)                   │
│  - Vercel Blob (file storage)                │
└─────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
Code Push (GitHub)
    │
    ▼
GitHub Actions
    │
    ├─> Type Check (TypeScript)
    ├─> Lint (ESLint)
    ├─> Format Check (Prettier)
    ├─> Unit Tests (Vitest)
    ├─> Build (Next.js)
    │
    ▼
Vercel Deploy
    │
    ├─> Preview (PR branches)
    └─> Production (main branch)
```

---

## Performance Considerations

### Caching Strategy

1. **Client-Side** - SWR with stale-while-revalidate
2. **CDN** - Static assets cached at edge (Vercel)
3. **Database** - Connection pooling (Neon)
4. **API** - Response caching for expensive queries (future)

### Database Optimization

- Indexes on all foreign keys and frequently queried columns
- Composite indexes for multi-column queries
- JSONB columns for flexible metadata (with GIN indexes where needed)
- Soft deletes for audit trail preservation

### Scalability

- **Horizontal Scaling** - Stateless API design
- **Database** - Neon auto-scaling compute
- **CDN** - Global edge network (Vercel)
- **Async Processing** - Background jobs for heavy operations (future)

---

## Monitoring & Observability

### Logging

- **Application Logs** - Structured JSON logs
- **Audit Logs** - Database table for compliance
- **Error Tracking** - Sentry for exceptions
- **Performance** - Vercel Analytics

### Metrics

- API response times
- Database query performance
- LLM API latency
- Error rates
- User activity

---

## Future Enhancements

### Planned Improvements

1. **WebSocket Support** - Real-time agent execution updates
2. **Background Jobs** - Queue system for long-running tasks
3. **Read Replicas** - Database scaling for read-heavy workloads
4. **API Rate Limiting** - Per-user/workspace limits
5. **OpenAPI Docs** - Auto-generated API documentation
6. **E2E Testing** - Playwright test suite
7. **Performance Monitoring** - APM integration (Datadog)

---

**Last Updated**: January 19, 2025  
**Maintained by**: GalaxyCo.ai Engineering Team
