# GalaxyCo.ai 2.0 - Database Schema

**Last Updated**: January 19, 2025  
**Schema Version**: 2.0  
**ORM**: Drizzle ORM 0.44.6  
**Database**: PostgreSQL (Neon)

---

## Overview

The GalaxyCo.ai database is designed for **multi-tenant SaaS** with complete workspace isolation. Every table (except users/system settings) includes a `workspace_id` column to ensure data security.

### Key Principles:

1. **Multi-Tenant Security** - Workspace isolation at database level
2. **Type Safety** - Drizzle ORM with TypeScript schema definitions
3. **Audit Trails** - Complete activity logging for compliance
4. **Performance** - Proper indexes on all frequently queried columns
5. **Scalability** - Designed for horizontal scaling

---

## Schema Statistics

- **Total Tables**: 40+
- **Core Entities**: 15 main tables
- **Junction Tables**: 8 many-to-many relationships
- **Audit Tables**: 3 logging tables
- **Enums**: 15 PostgreSQL enums
- **Indexes**: 60+ for performance optimization

---

## Multi-Tenant Architecture

### Security Rule (Critical)

```sql
-- ALL queries MUST include workspace_id filter
-- NEVER query without workspace scoping

✅ CORRECT:
SELECT * FROM agents WHERE workspace_id = $1;

❌ WRONG:
SELECT * FROM agents; -- Exposes all tenant data!
```

### Workspace Isolation Pattern

```typescript
// Every tenant-scoped table follows this pattern:
export const tableName = pgTable('table_name', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  // ... other columns
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

---

## Core Tables

### 1. Workspaces (Tenant Boundary)

**Purpose**: Multi-tenant isolation root

```sql
workspaces:
- id (uuid, PK)
- name (text, NOT NULL)
- slug (text, UNIQUE)
- clerk_organization_id (text, UNIQUE)
- subscription_tier (enum: free|starter|professional|enterprise)
- settings (jsonb) -- UI preferences, feature flags
- encrypted_api_keys (jsonb) -- AES-256-GCM encrypted
- is_active (boolean, DEFAULT true)
- created_at, updated_at
```

### 2. Users

**Purpose**: User accounts linked to Clerk authentication

```sql
users:
- id (uuid, PK)
- clerk_user_id (text, UNIQUE, NOT NULL)
- email (text, NOT NULL)
- first_name, last_name (text)
- avatar_url (text)
- preferences (jsonb) -- theme, language, notifications
- last_login_at (timestamp)
- created_at, updated_at
```

### 3. Workspace Members (RBAC Junction)

**Purpose**: User-workspace relationships with role-based access control

```sql
workspace_members:
- id (uuid, PK)
- workspace_id (uuid, FK -> workspaces)
- user_id (uuid, FK -> users)
- role (enum: owner|admin|member|viewer|system_admin)
- permissions (jsonb) -- Fine-grained permissions
- invited_by (uuid, FK -> users)
- is_active (boolean)
- joined_at (timestamp)
- created_at, updated_at
```

---

## AI Agent System

### 4. Agents

**Purpose**: AI agent configurations and metadata

```sql
agents:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- description (text)
- type (enum: scope|call|email|note|task|roadmap|content|custom|...)
- status (enum: draft|active|paused|archived)
- config (jsonb) -- AI provider, model, temperature, system prompt, tools
- source_pack_id (uuid) -- Marketplace template reference
- is_custom (boolean, DEFAULT true)
- created_by (uuid, FK -> users)
- execution_count (integer, DEFAULT 0)
- last_executed_at (timestamp)
- created_at, updated_at
```

### 5. Agent Executions (Audit Trail)

**Purpose**: Track every agent execution for monitoring and billing

```sql
agent_executions:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- agent_id (uuid, FK -> agents)
- triggered_by (uuid, FK -> users)
- status (enum: pending|running|completed|failed|cancelled)
- input, output (jsonb) -- Request/response data
- error (jsonb) -- Error details if failed
- duration_ms (integer) -- Execution time
- tokens_used (integer) -- For billing
- cost (integer) -- In cents
- started_at, completed_at
- created_at
```

### 6. Agent Schedules

**Purpose**: Automation triggers (cron, webhook, manual)

```sql
agent_schedules:
- id (uuid, PK)
- workspace_id, agent_id (uuid, FK)
- trigger_type (text: manual|scheduled|webhook)
- cron (text) -- Cron expression
- timezone (text, DEFAULT 'America/Chicago')
- webhook_url, webhook_secret (text)
- enabled (boolean, DEFAULT true)
- next_run_at, last_run_at (timestamp)
- last_run_status (text)
- created_at, updated_at
```

---

## Knowledge Management

### 7. Knowledge Collections

**Purpose**: Organize documents and knowledge items

```sql
knowledge_collections:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- description, color, icon (text)
- created_by (uuid, FK -> users)
- item_count (integer, DEFAULT 0)
- created_at, updated_at
```

### 8. Knowledge Items

**Purpose**: Documents, URLs, text with vector embeddings

```sql
knowledge_items:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- title (text, NOT NULL)
- type (enum: document|url|image|text)
- status (enum: processing|ready|failed)
- source_url, file_name (text)
- file_size (integer) -- bytes
- content (text) -- Extracted text
- summary (text) -- AI-generated summary
- embeddings (jsonb) -- Vector embeddings for RAG
- embeddings_model (text)
- collection_id (uuid, FK -> knowledge_collections)
- tags (text[])
- is_favorite, is_archived (boolean)
- processing_error (text)
- processed_at (timestamp)
- created_by (uuid, FK -> users)
- created_at, updated_at
```

---

## CRM System

### 9. Customers

**Purpose**: Customer/company records

```sql
customers:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- email, phone, company, website (text)
- address (jsonb) -- street, city, state, zip, country
- status (enum: lead|active|inactive|churned)
- industry, size (text)
- revenue (integer) -- Annual revenue in cents
- assigned_to (uuid, FK -> users)
- tags (text[])
- custom_fields (jsonb)
- notes (text)
- last_contacted_at (timestamp)
- created_at, updated_at
```

### 10. Contacts

**Purpose**: Individual contact records

```sql
contacts:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- first_name, last_name (text)
- email (text, NOT NULL)
- phone, title, company (text)
- linkedin_url, twitter_url (text)
- customer_id (uuid, FK -> customers)
- assigned_to (uuid, FK -> users)
- tags (text[])
- notes (text)
- custom_fields (jsonb)
- last_contacted_at (timestamp)
- created_at, updated_at
```

### 11. Projects

**Purpose**: Customer projects and work tracking

```sql
projects:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- description (text)
- status (enum: planning|in_progress|on_hold|completed|cancelled)
- customer_id (uuid, FK -> customers)
- manager_id (uuid, FK -> users)
- start_date, end_date (timestamp)
- budget, actual_cost (integer) -- In cents
- progress (integer) -- 0-100
- completed_tasks, total_tasks (integer)
- tags (text[])
- custom_fields (jsonb)
- created_at, updated_at
```

### 12. Prospects

**Purpose**: Sales pipeline management

```sql
prospects:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- email, phone, company, title (text)
- linkedin_url (text)
- stage (enum: new|contacted|qualified|proposal|negotiation|won|lost)
- score (integer) -- Lead scoring 0-100
- estimated_value (integer) -- In cents
- assigned_to (uuid, FK -> users)
- source (text) -- website, referral, campaign
- last_contacted_at, next_follow_up_at (timestamp)
- interaction_count (integer)
- tags (text[])
- notes (text)
- custom_fields (jsonb)
- converted_to_customer (boolean)
- customer_id (uuid, FK -> customers)
- created_at, updated_at
```

---

## Business Operations

### 13. Tasks

**Purpose**: Task and work item management

```sql
tasks:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- title (text, NOT NULL)
- description (text)
- status (enum: todo|in_progress|done|cancelled)
- priority (enum: low|medium|high|urgent)
- assigned_to, created_by (uuid, FK -> users)
- project_id (uuid, FK -> projects)
- customer_id (uuid, FK -> customers)
- due_date, start_date, completed_at (timestamp)
- tags (text[])
- attachments (jsonb) -- Array of file metadata
- created_at, updated_at
```

### 14. Calendar Events

**Purpose**: Meeting and event scheduling

```sql
calendar_events:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- title (text, NOT NULL)
- description, location, meeting_url (text)
- start_time, end_time (timestamp)
- timezone (text, DEFAULT 'America/Chicago')
- is_all_day, is_recurring (boolean)
- recurrence_rule (text) -- RRULE format
- created_by (uuid, FK -> users)
- attendees (jsonb) -- Array of attendee objects
- customer_id (uuid, FK -> customers)
- project_id (uuid, FK -> projects)
- tags (text[])
- reminders (jsonb) -- Reminder settings
- created_at, updated_at
```

### 15. Invoices

**Purpose**: Invoice and billing management

```sql
invoices:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- invoice_number (text, NOT NULL)
- status (enum: draft|sent|paid|overdue|cancelled)
- customer_id (uuid, FK -> customers, NOT NULL)
- project_id (uuid, FK -> projects)
- subtotal, tax, total, amount_paid (integer) -- In cents
- currency (text, DEFAULT 'USD')
- items (jsonb) -- Line items array
- issue_date, due_date, paid_at (timestamp)
- notes, terms (text)
- created_at, updated_at
```

---

## Communication System

### 16. Email Threads

**Purpose**: Email conversation tracking

```sql
email_threads:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- subject (text, NOT NULL)
- snippet (text) -- Preview
- message_count (integer, DEFAULT 0)
- participants (jsonb) -- Array of email/name pairs
- is_starred, is_read (boolean)
- folder (text, DEFAULT 'inbox')
- labels (text[])
- last_message_at (timestamp)
- created_at, updated_at
```

### 17. Notifications

**Purpose**: User notifications and alerts

```sql
notifications:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- user_id (uuid, FK -> users)
- type (enum: info|success|warning|error|mention|assignment|reminder|system)
- title, message (text, NOT NULL)
- action_url, action_label (text)
- metadata (jsonb)
- is_read, is_dismissed (boolean, DEFAULT false)
- read_at, expires_at (timestamp)
- created_at
```

---

## Developer & Integration

### 18. Webhooks

**Purpose**: Webhook integrations for external services

```sql
webhooks:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- name (text, NOT NULL)
- url (text, NOT NULL)
- events (text[]) -- Array of event types
- secret (text, NOT NULL) -- HMAC secret
- is_active (boolean, DEFAULT true)
- last_triggered_at (timestamp)
- success_count, failure_count (integer, DEFAULT 0)
- metadata (jsonb)
- created_by (uuid, FK -> users)
- created_at, updated_at
```

### 19. Audit Logs

**Purpose**: Complete activity audit trail

```sql
audit_logs:
- id (uuid, PK)
- workspace_id (uuid, FK, NOT NULL)
- user_id (uuid, FK -> users)
- user_email (text)
- ip_address, user_agent (text)
- action (text, NOT NULL) -- create, update, delete, login
- resource_type (text, NOT NULL) -- customer, agent, etc.
- resource_id (text)
- changes (jsonb) -- before/after diff
- metadata (jsonb)
- created_at (timestamp, NOT NULL)
```

---

## Indexes & Performance

### Primary Indexes

Every table has:

- Primary key on `id` (UUID)
- Index on `workspace_id` (multi-tenant scoping)
- Index on `created_at` (time-based queries)

### Composite Indexes

```sql
-- Workspace + status for filtered queries
CREATE INDEX agent_workspace_status_idx ON agents(workspace_id, status);
CREATE INDEX customer_workspace_status_idx ON customers(workspace_id, status);

-- Workspace + user for user-scoped queries
CREATE INDEX task_workspace_assigned_idx ON tasks(workspace_id, assigned_to);
CREATE INDEX notification_workspace_user_idx ON notifications(workspace_id, user_id);

-- Time-based queries with workspace scoping
CREATE INDEX execution_workspace_created_idx ON agent_executions(workspace_id, created_at);
CREATE INDEX audit_workspace_created_idx ON audit_logs(workspace_id, created_at);
```

### JSONB Indexes (GIN)

```sql
-- For JSONB columns with frequent queries
CREATE INDEX agent_config_gin_idx ON agents USING GIN(config);
CREATE INDEX customer_custom_fields_gin_idx ON customers USING GIN(custom_fields);
```

---

## Enums

### User Roles

```sql
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
```

### Agent Types

```sql
CREATE TYPE agent_type AS ENUM (
  'scope', 'call', 'email', 'note', 'task', 'roadmap',
  'content', 'custom', 'browser', 'cross-app', 'knowledge',
  'sales', 'trending', 'research', 'meeting', 'code', 'data', 'security'
);
```

### Status Enums

```sql
CREATE TYPE agent_status AS ENUM ('draft', 'active', 'paused', 'archived');
CREATE TYPE execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE customer_status AS ENUM ('lead', 'active', 'inactive', 'churned');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
```

---

## Migrations

### Migration Strategy

- **Never modify existing migrations** - Always create new ones
- **Use Drizzle Kit** - Generate and manage migrations
- **Staging first** - Test all migrations in staging environment
- **Rollback plan** - Include rollback steps for destructive changes

### Common Migration Commands

```bash
# Generate migration from schema changes
pnpm -C packages/database db:generate

# Apply migrations to database
pnpm -C packages/database db:migrate

# Push schema directly (development only)
pnpm -C packages/database db:push

# Check migration status
pnpm -C packages/database db:check
```

### Migration Naming Convention

```
YYYY-MM-DD-HHMMSS_description.sql
2025-01-19-143000_add_agent_schedules_table.sql
```

---

## Security Considerations

### Data Encryption

- **API Keys**: AES-256-GCM encryption in `workspaces.encrypted_api_keys`
- **Secrets**: Environment variables, never stored in database
- **PII**: Minimal storage, encrypt sensitive fields

### Access Control

- **Row-Level Security**: Workspace isolation enforced at application level
- **Connection Pooling**: Neon handles connection management
- **SQL Injection**: Drizzle ORM provides parameterized queries

### Compliance

- **GDPR**: User data deletion via Clerk webhooks
- **Audit Trail**: Complete activity logging in `audit_logs`
- **Data Retention**: Configurable retention policies

---

## Backup & Recovery

### Neon Backups

- **Point-in-time Recovery**: 7 days retention
- **Automated Backups**: Daily snapshots
- **Cross-region**: Replicas for disaster recovery

### Application-Level

- **Export API**: CSV/JSON data exports
- **Import API**: Data restoration from exports
- **Workspace Cloning**: Duplicate workspace data

---

## Monitoring & Observability

### Query Performance

```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- Index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public';
```

### Connection Monitoring

- **Active Connections**: Monitor via Neon dashboard
- **Query Duration**: Track long-running queries
- **Error Rates**: Database error monitoring

---

**Maintained by**: GalaxyCo.ai Engineering Team  
**Schema Location**: `packages/database/src/schema.ts`  
**Migration Location**: `packages/database/migrations/`
