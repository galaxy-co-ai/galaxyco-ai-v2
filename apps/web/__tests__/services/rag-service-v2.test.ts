/**
 * Tests for RAGServiceV2
 *
 * Coverage:
 * - Upstash Vector search
 * - PostgreSQL fallback
 * - Store/Update/Delete operations
 * - Multi-tenant isolation
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RAGServiceV2 } from '@/lib/services/rag-service-v2';
import { db } from '@galaxyco/database';
import { knowledgeItems } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

// Mock dependencies
vi.mock('@/lib/vector', () => ({
  getVectorClient: vi.fn(() => ({
    query: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock('@langchain/openai', () => ({
  OpenAIEmbeddings: vi.fn().mockImplementation(() => ({
    embedQuery: vi.fn().mockResolvedValue(Array.from({ length: 1536 }, () => Math.random())),
  })),
}));

describe('RAGServiceV2', () => {
  let ragService: RAGServiceV2;
  const testWorkspaceId = 'workspace-123';
  const testEmbedding = Array.from({ length: 1536 }, () => Math.random());

  beforeEach(() => {
    ragService = new RAGServiceV2();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchDocuments', () => {
    it('should search using Upstash Vector and return results', async () => {
      // Mock Upstash response
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockResolvedValue([
        {
          id: 'item-1',
          score: 0.95,
          metadata: {
            workspaceId: testWorkspaceId,
            collectionId: 'collection-1',
            type: 'document',
            title: 'Test Document',
          },
        },
        {
          id: 'item-2',
          score: 0.85,
          metadata: {
            workspaceId: testWorkspaceId,
            collectionId: 'collection-1',
            type: 'note',
            title: 'Test Note',
          },
        },
      ]);

      // Mock database response
      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: testWorkspaceId,
              title: 'Test Document',
              content: 'This is a test document about AI',
              type: 'document',
              status: 'ready',
              embeddings: testEmbedding,
            },
            {
              id: 'item-2',
              workspaceId: testWorkspaceId,
              title: 'Test Note',
              content: 'This is a test note about machine learning',
              type: 'note',
              status: 'ready',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const results = await ragService.searchDocuments({
        query: 'AI and machine learning',
        workspaceId: testWorkspaceId,
        limit: 10,
        threshold: 0.7,
      });

      expect(results).toHaveLength(2);
      expect(results[0].relevanceScore).toBeGreaterThan(results[1].relevanceScore);
      expect(results[0].item.title).toBe('Test Document');
      expect(mockVectorClient.query).toHaveBeenCalled();

      mockDbSelect.mockRestore();
    });

    it('should filter results by workspaceId (multi-tenant isolation)', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockResolvedValue([
        {
          id: 'item-1',
          score: 0.95,
          metadata: {
            workspaceId: testWorkspaceId,
            type: 'document',
          },
        },
        {
          id: 'item-2',
          score: 0.9,
          metadata: {
            workspaceId: 'other-workspace', // Different workspace!
            type: 'document',
          },
        },
      ]);

      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: testWorkspaceId,
              title: 'Allowed Document',
              content: 'Test content',
              type: 'document',
              status: 'ready',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const results = await ragService.searchDocuments({
        query: 'test query',
        workspaceId: testWorkspaceId,
        limit: 10,
      });

      // Should only return item from correct workspace
      expect(results).toHaveLength(1);
      expect(results[0].item.workspaceId).toBe(testWorkspaceId);

      mockDbSelect.mockRestore();
    });

    it('should respect threshold parameter', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockResolvedValue([
        {
          id: 'item-1',
          score: 0.95,
          metadata: { workspaceId: testWorkspaceId },
        },
        {
          id: 'item-2',
          score: 0.65, // Below threshold
          metadata: { workspaceId: testWorkspaceId },
        },
      ]);

      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: testWorkspaceId,
              title: 'High Score',
              content: 'Content',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const results = await ragService.searchDocuments({
        query: 'test',
        workspaceId: testWorkspaceId,
        threshold: 0.7, // Should filter out item-2
      });

      expect(results).toHaveLength(1);
      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(0.7);

      mockDbSelect.mockRestore();
    });

    it('should fallback to PostgreSQL if Upstash fails', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockRejectedValue(new Error('Upstash connection failed'));

      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: testWorkspaceId,
              title: 'Fallback Document',
              content: 'Content',
              embeddings: testEmbedding,
              status: 'ready',
            },
          ]),
        }),
      } as any);

      // Should not throw, should fallback to PostgreSQL
      const results = await ragService.searchDocuments({
        query: 'test',
        workspaceId: testWorkspaceId,
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      mockDbSelect.mockRestore();
    });
  });

  describe('storeKnowledgeItem', () => {
    it('should store item in both PostgreSQL and Upstash', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      const mockDbInsert = vi.spyOn(db, 'insert').mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: 'new-item-id',
              workspaceId: testWorkspaceId,
              title: 'New Item',
              content: 'New content',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const itemId = await ragService.storeKnowledgeItem({
        workspaceId: testWorkspaceId,
        type: 'document',
        title: 'New Item',
        content: 'New content',
      });

      expect(itemId).toBe('new-item-id');
      expect(mockDbInsert).toHaveBeenCalled();
      expect(mockVectorClient.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'new-item-id',
          vector: expect.any(Array),
          metadata: expect.objectContaining({
            workspaceId: testWorkspaceId,
            title: 'New Item',
          }),
        }),
      );

      mockDbInsert.mockRestore();
    });
  });

  describe('deleteKnowledgeItem', () => {
    it('should delete from both PostgreSQL and Upstash', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      const mockDbDelete = vi.spyOn(db, 'delete').mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      await ragService.deleteKnowledgeItem('item-to-delete');

      expect(mockDbDelete).toHaveBeenCalled();
      expect(mockVectorClient.delete).toHaveBeenCalledWith('item-to-delete');

      mockDbDelete.mockRestore();
    });
  });

  describe('getRAGContext', () => {
    it('should return context with sources and summary', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockResolvedValue([
        {
          id: 'item-1',
          score: 0.95,
          metadata: {
            workspaceId: testWorkspaceId,
            title: 'AI Guide',
          },
        },
      ]);

      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: testWorkspaceId,
              title: 'AI Guide',
              content: 'Comprehensive guide to AI and machine learning',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const context = await ragService.getRAGContext('AI basics', testWorkspaceId);

      expect(context.sources).toHaveLength(1);
      expect(context.summary).toContain('AI Guide');
      expect(context.sources[0].relevanceScore).toBeGreaterThan(0);

      mockDbSelect.mockRestore();
    });
  });

  describe('Security & Multi-tenancy', () => {
    it('should never return items from other workspaces', async () => {
      const mockVectorClient = require('@/lib/vector').getVectorClient();
      mockVectorClient.query.mockResolvedValue([
        {
          id: 'item-1',
          score: 0.95,
          metadata: { workspaceId: 'workspace-A' },
        },
        {
          id: 'item-2',
          score: 0.9,
          metadata: { workspaceId: 'workspace-B' },
        },
        {
          id: 'item-3',
          score: 0.85,
          metadata: { workspaceId: 'workspace-A' },
        },
      ]);

      const mockDbSelect = vi.spyOn(db, 'select').mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'item-1',
              workspaceId: 'workspace-A',
              content: 'Content A1',
              embeddings: testEmbedding,
            },
            {
              id: 'item-3',
              workspaceId: 'workspace-A',
              content: 'Content A2',
              embeddings: testEmbedding,
            },
          ]),
        }),
      } as any);

      const results = await ragService.searchDocuments({
        query: 'test',
        workspaceId: 'workspace-A',
      });

      // Should ONLY return items from workspace-A
      expect(results.every((r) => r.item.workspaceId === 'workspace-A')).toBe(true);
      expect(results).toHaveLength(2);

      mockDbSelect.mockRestore();
    });
  });
});
