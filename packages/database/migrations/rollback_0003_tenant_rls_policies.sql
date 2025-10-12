-- ROLLBACK Migration: 20251012_add_tenant_rls_policies
-- Author: AI Assistant
-- Date: 2025-10-12
-- Purpose: Rollback RLS policies if needed (EMERGENCY USE ONLY)
-- 
-- WARNING: This rollback removes tenant isolation security
-- Only use in emergency situations - document usage in incidents/

-- BEGIN ROLLBACK

-- Drop tenant isolation policies
DROP POLICY IF EXISTS tenant_isolation_policy ON workspace_members;
DROP POLICY IF EXISTS tenant_isolation_policy ON agents;
DROP POLICY IF EXISTS tenant_isolation_policy ON installed_packs;
DROP POLICY IF EXISTS tenant_isolation_policy ON workflows;
DROP POLICY IF EXISTS tenant_isolation_policy ON executions;
DROP POLICY IF EXISTS tenant_isolation_policy ON knowledge_items;
DROP POLICY IF EXISTS tenant_isolation_policy ON knowledge_collections;

-- Disable Row-Level Security on all tables
ALTER TABLE workspace_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE installed_packs DISABLE ROW LEVEL SECURITY;
ALTER TABLE workflows DISABLE ROW LEVEL SECURITY;
ALTER TABLE executions DISABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_collections DISABLE ROW LEVEL SECURITY;

-- Drop tenant context functions
DROP FUNCTION IF EXISTS set_tenant_context(uuid);
DROP FUNCTION IF EXISTS get_current_tenant_id();

-- END ROLLBACK

-- Post-rollback verification:
-- SELECT * FROM pg_policies; -- Should show no tenant_isolation_policy entries
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('agents', 'workflows', 'executions'); -- All should show FALSE