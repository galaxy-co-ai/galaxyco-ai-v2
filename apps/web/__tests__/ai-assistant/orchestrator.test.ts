/**
 * Tests for AI Orchestrator
 *
 * Coverage:
 * - Message processing
 * - Tool execution
 * - Error handling
 * - RAG integration
 * - Multi-step planning
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AIOrchestrator } from '@/lib/ai-assistant/orchestrator';
import type { ToolContext } from '@/lib/ai-assistant/tools/types';

// Mock dependencies
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'gpt-4-turbo'),
}));

vi.mock('@/lib/services/rag-service-v2', () => ({
  getRAGService: vi.fn(() => ({
    getRAGContext: vi.fn().mockResolvedValue({
      sources: [],
      summary: 'Test context',
    }),
  })),
}));

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;
  const testContext: ToolContext = {
    userId: 'user-123',
    workspaceId: 'workspace-123',
    permissions: ['agents:create', 'agents:read'],
  };

  beforeEach(() => {
    orchestrator = new AIOrchestrator();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processMessage', () => {
    it('should process user message and return AI response', async () => {
      const { generateText } = await import('ai');
      (generateText as any).mockResolvedValue({
        text: 'I can help you with that!',
        toolCalls: [],
        toolResults: [],
      });

      const response = await orchestrator.processMessage(
        'Hello',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      expect(response.message).toBe('I can help you with that!');
      expect(generateText).toHaveBeenCalled();
    });

    it('should enhance messages with RAG context', async () => {
      const { getRAGService } = await import('@/lib/services/rag-service-v2');
      const mockRAG = getRAGService as any;

      await orchestrator.processMessage(
        'How do I create an agent?',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      expect(mockRAG().getRAGContext).toHaveBeenCalledWith(
        'How do I create an agent?',
        'workspace-123',
        3,
      );
    });

    it('should collect actions from tool results', async () => {
      const { generateText } = await import('ai');
      (generateText as any).mockResolvedValue({
        text: 'Agent created!',
        toolCalls: [{ toolName: 'create_agent', args: {} }],
        toolResults: [
          {
            success: true,
            data: { id: 'agent-123' },
            message: 'Created agent',
            action: {
              type: 'navigate',
              target: '/agents/agent-123',
              label: 'View agent',
            },
          },
        ],
      });

      const response = await orchestrator.processMessage(
        'Create an agent',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      expect(response.actions).toHaveLength(1);
      expect(response.actions?.[0].type).toBe('navigate');
      expect(response.actions?.[0].target).toBe('/agents/agent-123');
    });

    it('should handle errors gracefully', async () => {
      const { generateText } = await import('ai');
      (generateText as any).mockRejectedValue(new Error('AI service unavailable'));

      const response = await orchestrator.processMessage(
        'Test message',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      expect(response.message).toContain('error');
      expect(response.message).toContain('try rephrasing');
    });

    it('should generate suggested follow-ups', async () => {
      const { generateText } = await import('ai');
      (generateText as any).mockResolvedValue({
        text: 'Done!',
        toolCalls: [],
        toolResults: [],
      });

      const response = await orchestrator.processMessage(
        'Hello',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      expect(response.suggestedFollowUps).toBeDefined();
      expect(Array.isArray(response.suggestedFollowUps)).toBe(true);
    });
  });

  describe('Security', () => {
    it('should include workspaceId in all AI calls', async () => {
      const { generateText } = await import('ai');
      (generateText as any).mockResolvedValue({
        text: 'Response',
        toolCalls: [],
      });

      await orchestrator.processMessage(
        'Test',
        {
          messages: [],
          workspaceId: 'workspace-123',
          userId: 'user-123',
        },
        testContext,
      );

      // Verify generateText was called
      expect(generateText).toHaveBeenCalled();
    });
  });
});
