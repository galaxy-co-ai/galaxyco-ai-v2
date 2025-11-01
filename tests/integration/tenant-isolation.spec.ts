import { test, expect, describe } from '@playwright/test';
import { db } from '@galaxyco/database';
import { workspaces, users, workspaceMembers, agents } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import {
  getCurrentTenantContext,
  withTenantFilter,
  validateTenantAccess,
} from '../../apps/web/lib/db/tenant-filter';

describe('Tenant Isolation Security Tests', () => {
  let tenant1Id: string;
  let tenant2Id: string;
  let user1Id: string;
  let user2Id: string;
  let agent1Id: string;
  let agent2Id: string;

  test.beforeAll(async () => {
    // Create test workspaces (tenants)
    const [workspace1] = await db
      .insert(workspaces)
      .values({
        name: 'Test Workspace 1',
        slug: 'test-workspace-1',
      })
      .returning({ id: workspaces.id });

    const [workspace2] = await db
      .insert(workspaces)
      .values({
        name: 'Test Workspace 2',
        slug: 'test-workspace-2',
      })
      .returning({ id: workspaces.id });

    tenant1Id = workspace1.id;
    tenant2Id = workspace2.id;

    // Create test users
    const [user1] = await db
      .insert(users)
      .values({
        clerkUserId: 'test-clerk-user-1',
        email: 'user1@test.com',
        firstName: 'Test',
        lastName: 'User1',
      })
      .returning({ id: users.id });

    const [user2] = await db
      .insert(users)
      .values({
        clerkUserId: 'test-clerk-user-2',
        email: 'user2@test.com',
        firstName: 'Test',
        lastName: 'User2',
      })
      .returning({ id: users.id });

    user1Id = user1.id;
    user2Id = user2.id;

    // Create workspace memberships
    await db.insert(workspaceMembers).values([
      {
        workspaceId: tenant1Id,
        userId: user1Id,
        role: 'owner',
      },
      {
        workspaceId: tenant2Id,
        userId: user2Id,
        role: 'owner',
      },
    ]);

    // Create test agents in different tenants
    const [agent1] = await db
      .insert(agents)
      .values({
        workspaceId: tenant1Id,
        name: 'Test Agent 1',
        description: 'Agent for tenant 1',
        type: 'custom',
        config: {},
        createdBy: user1Id,
      })
      .returning({ id: agents.id });

    const [agent2] = await db
      .insert(agents)
      .values({
        workspaceId: tenant2Id,
        name: 'Test Agent 2',
        description: 'Agent for tenant 2',
        type: 'custom',
        config: {},
        createdBy: user2Id,
      })
      .returning({ id: agents.id });

    agent1Id = agent1.id;
    agent2Id = agent2.id;
  });

  test.afterAll(async () => {
    // Cleanup test data
    await db.delete(agents).where(eq(agents.id, agent1Id));
    await db.delete(agents).where(eq(agents.id, agent2Id));
    await db.delete(workspaceMembers).where(eq(workspaceMembers.userId, user1Id));
    await db.delete(workspaceMembers).where(eq(workspaceMembers.userId, user2Id));
    await db.delete(users).where(eq(users.id, user1Id));
    await db.delete(users).where(eq(users.id, user2Id));
    await db.delete(workspaces).where(eq(workspaces.id, tenant1Id));
    await db.delete(workspaces).where(eq(workspaces.id, tenant2Id));
  });

  test('withTenantFilter should create proper filter condition', async () => {
    const filter = withTenantFilter(tenant1Id, agents.workspaceId);
    expect(filter).toBeDefined();

    // Test that the filter works
    const results = await db.select().from(agents).where(filter);

    expect(results).toHaveLength(1);
    expect(results[0].workspaceId).toBe(tenant1Id);
  });

  test('validateTenantAccess should allow same tenant access', () => {
    expect(() => {
      validateTenantAccess(tenant1Id, tenant1Id);
    }).not.toThrow();
  });

  test('validateTenantAccess should block cross-tenant access', () => {
    expect(() => {
      validateTenantAccess(tenant1Id, tenant2Id);
    }).toThrow('Cross-tenant access denied');
  });

  test('tenant-filtered queries should only return tenant data', async () => {
    // Query with tenant1 filter
    const tenant1Agents = await db
      .select()
      .from(agents)
      .where(withTenantFilter(tenant1Id, agents.workspaceId));

    expect(tenant1Agents).toHaveLength(1);
    expect(tenant1Agents[0].workspaceId).toBe(tenant1Id);
    expect(tenant1Agents[0].name).toBe('Test Agent 1');

    // Query with tenant2 filter
    const tenant2Agents = await db
      .select()
      .from(agents)
      .where(withTenantFilter(tenant2Id, agents.workspaceId));

    expect(tenant2Agents).toHaveLength(1);
    expect(tenant2Agents[0].workspaceId).toBe(tenant2Id);
    expect(tenant2Agents[0].name).toBe('Test Agent 2');
  });

  test('queries without tenant filter should see all data', async () => {
    // This test verifies the baseline - without filters, all data is visible
    const allAgents = await db.select().from(agents);
    expect(allAgents.length).toBeGreaterThanOrEqual(2);

    const tenantIds = allAgents.map((agent) => agent.workspaceId);
    expect(tenantIds).toContain(tenant1Id);
    expect(tenantIds).toContain(tenant2Id);
  });

  test('combined filters should work correctly', async () => {
    const combinedFilter = and(
      withTenantFilter(tenant1Id, agents.workspaceId),
      eq(agents.type, 'custom'),
    );

    const results = await db.select().from(agents).where(combinedFilter);

    expect(results).toHaveLength(1);
    expect(results[0].workspaceId).toBe(tenant1Id);
    expect(results[0].type).toBe('custom');
  });

  test('cross-tenant resource access should be blocked', async () => {
    // Try to access tenant2 agent with tenant1 context
    const attemptedAccess = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, agent2Id), withTenantFilter(tenant1Id, agents.workspaceId)));

    expect(attemptedAccess).toHaveLength(0);
  });

  test('workspace membership isolation', async () => {
    // User1 should only see their workspace membership
    const user1Memberships = await db
      .select()
      .from(workspaceMembers)
      .where(withTenantFilter(tenant1Id, workspaceMembers.workspaceId));

    expect(user1Memberships).toHaveLength(1);
    expect(user1Memberships[0].workspaceId).toBe(tenant1Id);
    expect(user1Memberships[0].userId).toBe(user1Id);

    // User2 should only see their workspace membership
    const user2Memberships = await db
      .select()
      .from(workspaceMembers)
      .where(withTenantFilter(tenant2Id, workspaceMembers.workspaceId));

    expect(user2Memberships).toHaveLength(1);
    expect(user2Memberships[0].workspaceId).toBe(tenant2Id);
    expect(user2Memberships[0].userId).toBe(user2Id);
  });
});

describe('Row-Level Security Policy Tests', () => {
  test('RLS policies should be enabled on tenant-scoped tables', async () => {
    const rlsTables = await db.execute(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE tablename IN ('agents', 'workspace_members', 'workflows', 'executions', 'knowledge_items')
      AND schemaname = 'public'
    `);

    for (const table of rlsTables.rows) {
      expect(table.rowsecurity).toBe(true);
    }
  });

  test('tenant isolation policies should exist', async () => {
    const policies = await db.execute(`
      SELECT tablename, policyname 
      FROM pg_policies 
      WHERE policyname = 'tenant_isolation_policy'
    `);

    const expectedTables = [
      'agents',
      'workspace_members',
      'workflows',
      'executions',
      'knowledge_items',
    ];
    const policyTables = policies.rows.map((row) => row.tablename);

    for (const tableName of expectedTables) {
      expect(policyTables).toContain(tableName);
    }
  });

  test('tenant context functions should exist', async () => {
    // Test set_tenant_context function
    const setResult = await db.execute(`SELECT set_tenant_context('test-tenant-123'::uuid)`);
    expect(setResult).toBeDefined();

    // Test get_current_tenant_id function
    const getResult = await db.execute(`SELECT get_current_tenant_id()`);
    expect(getResult).toBeDefined();
    expect(getResult.rows[0].get_current_tenant_id).toBe('test-tenant-123');
  });
});
