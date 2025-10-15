-- Migration: 20251012_add_tenant_rls_policies
-- Author: AI Assistant
-- Date: 2025-10-12
-- Purpose: Enable Row-Level Security (RLS) policies for multi-tenant isolation
-- Rollback plan: DISABLE RLS and DROP policies for each table
-- 
-- CRITICAL SECURITY UPDATE: Prevents cross-tenant data access at database level
-- This migration enforces tenant isolation using PostgreSQL's Row-Level Security

-- BEGIN MIGRATION

-- Enable Row-Level Security on all tenant-scoped tables
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE installed_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_collections ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
-- These policies automatically filter all queries to only show data from the current tenant

-- workspace_members: Users can only see members from their workspace
CREATE POLICY tenant_isolation_policy ON workspace_members
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- agents: Users can only see agents from their workspace
CREATE POLICY tenant_isolation_policy ON agents
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- installed_packs: Users can only see packs installed in their workspace
CREATE POLICY tenant_isolation_policy ON installed_packs
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- workflows: Users can only see workflows from their workspace
CREATE POLICY tenant_isolation_policy ON workflows
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- executions: Users can only see executions from their workspace
CREATE POLICY tenant_isolation_policy ON executions
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- knowledge_items: Users can only see knowledge items from their workspace
CREATE POLICY tenant_isolation_policy ON knowledge_items
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- knowledge_collections: Users can only see collections from their workspace
CREATE POLICY tenant_isolation_policy ON knowledge_collections
  FOR ALL
  USING (workspace_id = current_setting('app.current_tenant_id', true)::uuid);

-- Create a function to set tenant context for connections
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_uuid uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get current tenant context
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- END MIGRATION

-- Verification queries:
-- SELECT current_setting('app.current_tenant_id', true); -- Should return tenant ID or NULL
-- SELECT * FROM pg_policies WHERE tablename IN ('agents', 'workflows', 'executions');
-- 
-- Test RLS by setting a tenant context:
-- SELECT set_tenant_context('test-tenant-uuid');
-- SELECT * FROM agents; -- Should only show agents for that tenant