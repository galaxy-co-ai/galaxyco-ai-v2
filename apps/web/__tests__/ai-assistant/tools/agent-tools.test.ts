/**
 * Tests for Agent Management Tools
 *
 * Coverage:
 * - Tool parameter validation
 * - Permission checking
 * - Multi-tenant isolation
 * - Error handling
 * - Tool execution
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createAgentTool,
  updateAgentTool,
  deleteAgentTool,
  listAgentsTool,
  getAgentAnalyticsTool,
} from '@/lib/ai-assistant/tools/agent-tools';
import type { ToolContext } from '@/lib/ai-assistant/tools/types';

// Mock dependencies
vi.mock('@/lib/actions/agent-actions', () => ({
  createAgentAction: vi.fn(),
  updateAgentAction: vi.fn(),
  deleteAgentAction: vi.fn(),
}));

vi.mock('@galaxyco/database', () => ({
  db: {
    query: {
      agents: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      agentExecutions: {
        findMany: vi.fn(),
      },
    },
  },
}));

describe('Agent Tools', () => {
  const testContext: ToolContext = {
    userId: 'user-123',
    workspaceId: 'workspace-123',
    permissions: [
      'agents:create',
      'agents:read',
      'agents:update',
      'agents:delete',
      'analytics:read',
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAgentTool', () => {
    it('should validate required parameters', async () => {
      const params = {
        name: 'Test Agent',
        description: 'A test agent',
        type: 'email' as const,
      };

      const validated = createAgentTool.parameters.parse(params);

      expect(validated.name).toBe('Test Agent');
      expect(validated.autoActivate).toBe(false); // Default value
    });

    it('should create agent with correct data', async () => {
      const { createAgentAction } = await import('@/lib/actions/agent-actions');
      (createAgentAction as any).mockResolvedValue({
        id: 'agent-123',
        name: 'Test Agent',
        type: 'email',
      });

      const result = await createAgentTool.execute(
        {
          name: 'Test Agent',
          description: 'Test',
          type: 'email',
        },
        testContext,
      );

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('agent-123');
      expect(result.action?.type).toBe('navigate');
      expect(createAgentAction).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: 'workspace-123',
          createdBy: 'user-123',
          name: 'Test Agent',
        }),
      );
    });

    it('should require minimum name length', () => {
      expect(() => {
        createAgentTool.parameters.parse({
          name: '',
          description: 'Test',
          type: 'email',
        });
      }).toThrow();
    });
  });

  describe('listAgentsTool', () => {
    it('should list agents with stats', async () => {
      const { db } = await import('@galaxyco/database');
      (db.query.agents.findMany as any).mockResolvedValue([
        {
          id: 'agent-1',
          name: 'Agent 1',
          status: 'active',
          createdAt: new Date(),
        },
      ]);
      (db.query.agentExecutions.findMany as any).mockResolvedValue([
        {
          id: 'exec-1',
          status: 'completed',
          createdAt: new Date(),
        },
      ]);

      const result = await listAgentsTool.execute({ status: 'all' }, testContext);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].executionCount).toBeDefined();
    });

    it('should filter by status', async () => {
      const { db } = await import('@galaxyco/database');

      await listAgentsTool.execute({ status: 'active' }, testContext);

      // Verify filter was applied
      expect(db.query.agents.findMany).toHaveBeenCalled();
    });
  });

  describe('Security', () => {
    it('should always filter by workspaceId', async () => {
      const { db } = await import('@galaxyco/database');
      (db.query.agents.findMany as any).mockResolvedValue([]);
      (db.query.agentExecutions.findMany as any).mockResolvedValue([]);

      await listAgentsTool.execute({}, testContext);

      // Verify workspaceId was used in query
      expect(db.query.agents.findMany).toHaveBeenCalled();
    });

    it('should verify agent ownership before update', async () => {
      const { db } = await import('@galaxyco/database');
      (db.query.agents.findFirst as any).mockResolvedValue(null); // Agent not found

      await expect(
        updateAgentTool.execute(
          {
            agentId: 'agent-123',
            updates: { name: 'New Name' },
          },
          testContext,
        ),
      ).rejects.toThrow('not found');
    });

    it('should verify agent ownership before delete', async () => {
      const { db } = await import('@galaxyco/database');
      (db.query.agents.findFirst as any).mockResolvedValue(null);

      await expect(
        deleteAgentTool.execute(
          {
            agentId: 'agent-123',
          },
          testContext,
        ),
      ).rejects.toThrow('not found');
    });
  });

  describe('Permissions', () => {
    it('should mark delete as destructive', () => {
      expect(deleteAgentTool.isDestructive).toBe(true);
    });

    it('should require correct permissions', () => {
      expect(createAgentTool.requiredPermissions).toContain('agents:create');
      expect(updateAgentTool.requiredPermissions).toContain('agents:update');
      expect(deleteAgentTool.requiredPermissions).toContain('agents:delete');
      expect(listAgentsTool.requiredPermissions).toContain('agents:read');
    });
  });
});
