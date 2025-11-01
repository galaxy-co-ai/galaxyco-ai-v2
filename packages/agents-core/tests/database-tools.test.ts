/**
 * Database Tools Test Suite
 * Tests multi-tenant database tools with mock data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSearchAgentsTool,
  createGetAgentTool,
  createGetWorkspaceStatsTool,
} from '../src/tools/database-tools';
import type { ExecutionContext } from '../src/types';

// Mock the database module - must be at top level before any imports
vi.mock('@galaxyco/database', async () => {
  const actual = await vi.importActual<any>('drizzle-orm');
  return {
    db: { query: {} },
    withTenant: vi.fn(),
    agents: {},
    agentExecutions: {},
    workspaceMembers: {},
    like: actual.like || vi.fn((field, pattern) => ({ field, pattern })),
    or: actual.or || vi.fn((...conditions) => ({ or: conditions })),
    eq: actual.eq || vi.fn((field, value) => ({ field, value })),
    and: actual.and || vi.fn((...conditions) => ({ and: conditions })),
  };
});

// ============================================================================
// MOCK DATA SETUP (Phase 2.1)
// ============================================================================

const mockAgentsData = {
  'workspace-1': [
    {
      id: 'agent-1-1',
      name: 'Email Assistant',
      type: 'email',
      status: 'active',
      description: 'Handles email communications',
      config: { model: 'gpt-4o-mini' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'agent-1-2',
      name: 'Data Analyzer',
      type: 'content',
      status: 'active',
      description: 'Analyzes data and generates reports',
      config: { model: 'gpt-4o' },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'agent-1-3',
      name: 'Task Manager',
      type: 'task',
      status: 'inactive',
      description: 'Manages tasks and projects',
      config: { model: 'gpt-4o-mini' },
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ],
  'workspace-2': [
    {
      id: 'agent-2-1',
      name: 'Sales Bot',
      type: 'call',
      status: 'active',
      description: 'Handles sales calls',
      config: { model: 'gpt-4o' },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: 'agent-2-2',
      name: 'Support Agent',
      type: 'email',
      status: 'active',
      description: 'Customer support via email',
      config: { model: 'gpt-4o-mini' },
      createdAt: new Date('2024-02-02'),
      updatedAt: new Date('2024-02-02'),
    },
  ],
  'workspace-3': [], // Empty workspace for edge case testing
};

const mockExecutionsData = {
  'workspace-1': [
    { id: 'exec-1-1', agentId: 'agent-1-1', status: 'success', duration: 1200 },
    { id: 'exec-1-2', agentId: 'agent-1-1', status: 'success', duration: 1500 },
    { id: 'exec-1-3', agentId: 'agent-1-2', status: 'failed', duration: 800 },
    { id: 'exec-1-4', agentId: 'agent-1-2', status: 'success', duration: 2000 },
  ],
  'workspace-2': [
    { id: 'exec-2-1', agentId: 'agent-2-1', status: 'success', duration: 3000 },
    { id: 'exec-2-2', agentId: 'agent-2-2', status: 'failed', duration: 500 },
  ],
  'workspace-3': [], // No executions
};

// Helper to create mock database query functions
function createMockDb(workspaceId: string) {
  return {
    query: {
      agents: {
        findMany: vi.fn(async (options?: any) => {
          const agents = mockAgentsData[workspaceId] || [];

          if (options?.where) {
            // Simple mock filtering for testing
            return agents.filter((agent) => {
              const queryStr = JSON.stringify(options.where).toLowerCase();
              return (
                queryStr.includes(agent.name.toLowerCase()) ||
                queryStr.includes(agent.description.toLowerCase())
              );
            });
          }

          if (options?.limit) {
            return agents.slice(0, options.limit);
          }

          return agents;
        }),
        findFirst: vi.fn(async (options?: any) => {
          const agents = mockAgentsData[workspaceId] || [];

          if (options?.where) {
            return agents.find((agent) => {
              const condition = JSON.stringify(options.where);
              return condition.includes(agent.id);
            });
          }

          return agents[0];
        }),
      },
      agentExecutions: {
        findMany: vi.fn(async () => {
          return mockExecutionsData[workspaceId] || [];
        }),
      },
    },
  };
}

// ============================================================================
// SEARCH_AGENTS TOOL TESTS (Phase 2.2)
// ============================================================================

describe('search_agents Tool', () => {
  let searchAgentsTool: any;

  beforeEach(() => {
    vi.clearAllMocks();
    searchAgentsTool = createSearchAgentsTool();

    // Setup withTenant mock
    const { withTenant } = require('@galaxyco/database');
    withTenant.mockImplementation((db, workspaceId) => createMockDb(workspaceId));
  });

  it('should search for agents in workspace-1', async () => {
    const context: ExecutionContext = {
      executionId: 'test-1',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await searchAgentsTool.execute({ query: 'email', limit: 10 }, context);

    expect(result.success).toBe(true);
    expect(result.agents).toHaveLength(1);
    expect(result.agents[0].name).toBe('Email Assistant');
    expect(result.count).toBe(1);
  });

  it('should prevent cross-tenant access (workspace isolation)', async () => {
    const context: ExecutionContext = {
      executionId: 'test-2',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    // Search for "Sales Bot" which exists only in workspace-2
    const result = await searchAgentsTool.execute({ query: 'Sales Bot', limit: 10 }, context);

    expect(result.success).toBe(true);
    expect(result.agents).toHaveLength(0); // Should not find workspace-2's agent
    expect(result.count).toBe(0);
  });

  it('should handle empty workspace gracefully', async () => {
    const context: ExecutionContext = {
      executionId: 'test-3',
      workspaceId: 'workspace-3',
      userId: 'user-3',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await searchAgentsTool.execute({ query: 'any', limit: 10 }, context);

    expect(result.success).toBe(true);
    expect(result.agents).toHaveLength(0);
    expect(result.count).toBe(0);
  });

  it('should search by description', async () => {
    const context: ExecutionContext = {
      executionId: 'test-4',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await searchAgentsTool.execute({ query: 'data', limit: 10 }, context);

    expect(result.success).toBe(true);
    expect(result.agents).toHaveLength(1);
    expect(result.agents[0].name).toBe('Data Analyzer');
  });

  it('should require workspace context', async () => {
    const contextWithoutWorkspace = {
      executionId: 'test-5',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    } as any;

    const result = await searchAgentsTool.execute({ query: 'email' }, contextWithoutWorkspace);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Workspace context required');
  });
});

// ============================================================================
// GET_AGENT TOOL TESTS (Phase 2.3)
// ============================================================================

describe('get_agent Tool', () => {
  let getAgentTool: any;

  beforeEach(() => {
    vi.clearAllMocks();
    getAgentTool = createGetAgentTool();

    const { withTenant } = require('@galaxyco/database');
    withTenant.mockImplementation((db, workspaceId) => createMockDb(workspaceId));
  });

  it('should get agent by ID in correct workspace', async () => {
    const context: ExecutionContext = {
      executionId: 'test-1',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getAgentTool.execute({ agentId: 'agent-1-2' }, context);

    expect(result.success).toBe(true);
    expect(result.agent.id).toBe('agent-1-2');
    expect(result.agent.name).toBe('Data Analyzer');
    expect(result.agent.type).toBe('content');
  });

  it('should fail to access agent from different workspace (tenant isolation)', async () => {
    const context: ExecutionContext = {
      executionId: 'test-2',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    // Try to access agent-2-1 which belongs to workspace-2
    const result = await getAgentTool.execute({ agentId: 'agent-2-1' }, context);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found in workspace');
  });

  it('should handle non-existent agent ID', async () => {
    const context: ExecutionContext = {
      executionId: 'test-3',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getAgentTool.execute({ agentId: 'non-existent-id' }, context);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });

  it('should handle malformed agent ID gracefully', async () => {
    const context: ExecutionContext = {
      executionId: 'test-4',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getAgentTool.execute({ agentId: '!!!invalid-id!!!' }, context);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });
});

// ============================================================================
// GET_WORKSPACE_STATS TOOL TESTS
// ============================================================================

describe('get_workspace_stats Tool', () => {
  let getWorkspaceStatsTool: any;

  beforeEach(() => {
    vi.clearAllMocks();
    getWorkspaceStatsTool = createGetWorkspaceStatsTool();

    const { withTenant } = require('@galaxyco/database');
    withTenant.mockImplementation((db, workspaceId) => createMockDb(workspaceId));
  });

  it('should get stats for workspace with executions', async () => {
    const context: ExecutionContext = {
      executionId: 'test-1',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getWorkspaceStatsTool.execute({}, context);

    expect(result.success).toBe(true);
    expect(result.stats.totalAgents).toBe(3);
    expect(result.stats.activeAgents).toBe(2);
    expect(result.stats.totalExecutions).toBe(4);
    expect(result.stats.workspaceId).toBe('workspace-1');
  });

  it('should handle empty workspace (no agents or executions)', async () => {
    const context: ExecutionContext = {
      executionId: 'test-2',
      workspaceId: 'workspace-3',
      userId: 'user-3',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getWorkspaceStatsTool.execute({}, context);

    expect(result.success).toBe(true);
    expect(result.stats.totalAgents).toBe(0);
    expect(result.stats.activeAgents).toBe(0);
    expect(result.stats.totalExecutions).toBe(0);
  });

  it('should count only active agents correctly', async () => {
    const context: ExecutionContext = {
      executionId: 'test-3',
      workspaceId: 'workspace-2',
      userId: 'user-2',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const result = await getWorkspaceStatsTool.execute({}, context);

    expect(result.success).toBe(true);
    expect(result.stats.totalAgents).toBe(2);
    expect(result.stats.activeAgents).toBe(2); // Both are active
    expect(result.stats.totalExecutions).toBe(2);
  });

  it('should require workspace context', async () => {
    const contextWithoutWorkspace = {
      executionId: 'test-4',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    } as any;

    const result = await getWorkspaceStatsTool.execute({}, contextWithoutWorkspace);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Workspace context required');
  });
});

// ============================================================================
// MULTI-TENANT SECURITY TESTS
// ============================================================================

describe('Multi-Tenant Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { withTenant } = require('@galaxyco/database');
    withTenant.mockImplementation((db, workspaceId) => createMockDb(workspaceId));
  });

  it('should enforce tenant isolation across all tools', async () => {
    const searchTool = createSearchAgentsTool();
    const getTool = createGetAgentTool();
    const statsTool = createGetWorkspaceStatsTool();

    // Create contexts for different workspaces
    const context1: ExecutionContext = {
      executionId: 'test-1',
      workspaceId: 'workspace-1',
      userId: 'user-1',
      startTime: new Date(),
      messages: [],
      toolCalls: [],
      iterations: 0,
      metadata: {},
    };

    const context2: ExecutionContext = {
      ...context1,
      workspaceId: 'workspace-2',
      userId: 'user-2',
    };

    // Workspace 1 should only see its own data
    const search1 = await searchTool.execute({ query: '' }, context1);
    expect(search1.agents.every((a: any) => a.id.startsWith('agent-1-'))).toBe(true);

    // Workspace 2 should only see its own data
    const search2 = await searchTool.execute({ query: '' }, context2);
    expect(search2.agents.every((a: any) => a.id.startsWith('agent-2-'))).toBe(true);

    // Cross-tenant agent access should fail
    const crossAccess1 = await getTool.execute({ agentId: 'agent-2-1' }, context1);
    expect(crossAccess1.success).toBe(false);

    const crossAccess2 = await getTool.execute({ agentId: 'agent-1-1' }, context2);
    expect(crossAccess2.success).toBe(false);

    // Stats should be isolated
    const stats1 = await statsTool.execute({}, context1);
    const stats2 = await statsTool.execute({}, context2);

    expect(stats1.stats.totalAgents).toBe(3);
    expect(stats2.stats.totalAgents).toBe(2);
  });
});
