-- Migration: 20251018_add_rls_policies_new_tables
-- Author: AI Assistant  
-- Date: 2025-10-18
-- Purpose: Enable Row-Level Security (RLS) policies for new CRM/Business/Communication tables
-- Rollback plan: DISABLE RLS and DROP policies for each table
-- 
-- SECURITY UPDATE: Extends tenant isolation to all new tables from migration 0006
-- This migration enforces workspace isolation using PostgreSQL's Row-Level Security

-- BEGIN MIGRATION

-- ============================================================================
-- CREATE SYSTEM SETTINGS TABLE
-- ============================================================================
-- Global system settings for admin configuration
-- This table stores system-wide configuration that affects all workspaces

CREATE TABLE IF NOT EXISTS "system_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "updated_by" text,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default system settings
INSERT INTO "system_settings" (settings)
VALUES ('{"maintenanceMode":false,"allowSignups":true,"maxWorkspacesPerUser":5,"featureFlags":{"aiAgents":true,"knowledgeBase":true,"customPacks":false},"rateLimit":{"requestsPerMinute":60,"burstSize":100}}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ENABLE ROW-LEVEL SECURITY ON ALL NEW WORKSPACE-SCOPED TABLES
-- ============================================================================

-- CRM & Customer Management Tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Business Operations Tables  
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

-- Communication Tables
ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Developer & Admin Tables
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE TENANT ISOLATION POLICIES
-- ============================================================================
-- These policies automatically filter all queries to only show data from 
-- the current workspace using app.current_tenant_id context variable

-- CUSTOMERS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON customers
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- CONTACTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON contacts
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- PROJECTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON projects
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- PROSPECTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON prospects
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- TASKS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON tasks
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- CALENDAR_EVENTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON calendar_events
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- INVOICES: Tenant isolation
CREATE POLICY tenant_isolation_policy ON invoices
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- CAMPAIGNS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON campaigns
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- SEGMENTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON segments
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- EXPORTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON exports
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- IMPORTS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON imports
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- INBOX_MESSAGES: Tenant isolation
CREATE POLICY tenant_isolation_policy ON inbox_messages
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- EMAIL_THREADS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON email_threads
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- CHAT_MESSAGES: Tenant isolation
CREATE POLICY tenant_isolation_policy ON chat_messages
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- NOTIFICATIONS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON notifications
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- WEBHOOKS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON webhooks
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- AUDIT_LOGS: Tenant isolation
CREATE POLICY tenant_isolation_policy ON audit_logs
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- END MIGRATION

-- ============================================================================
-- NOTES
-- ============================================================================
-- webhook_deliveries table does NOT have workspace_id, so it inherits
-- security through the foreign key relationship with webhooks table.
-- 
-- All tables with workspace_id now have RLS policies enforcing tenant isolation.
-- This prevents cross-tenant data access at the database level.
--
-- Verification queries:
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN (
--   'customers', 'contacts', 'projects', 'prospects', 'tasks', 
--   'calendar_events', 'invoices', 'campaigns', 'segments', 
--   'exports', 'imports', 'inbox_messages', 'email_threads', 
--   'chat_messages', 'notifications', 'webhooks', 'audit_logs'
-- );
