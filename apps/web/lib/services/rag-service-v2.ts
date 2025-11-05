/**
 * RAG Service V2 - Enhanced with Upstash Vector
 *
 * Dual-storage architecture:
 * - Upstash Vector: Fast semantic search (10-100x faster)
 * - PostgreSQL: Source of truth for data integrity
 *
 * Features:
 * - HNSW-based nearest neighbor search
 * - Multi-tenant isolation (workspaceId filtering)
 * - Graceful fallback to PostgreSQL if Upstash fails
 * - Automatic sync between stores
 */

import { OpenAIEmbeddings } from '@langchain/openai';
import { db } from '@galaxyco/database';
import { knowledgeItems, type KnowledgeItem } from '@galaxyco/database/schema';
import { and, eq, desc, sql, inArray } from 'drizzle-orm';
import { getVectorClient } from '@/lib/vector';
import type { Index } from '@upstash/vector';

export interface SearchParams {
  query: string;
  workspaceId: string;
  userId?: string;
  limit?: number;
  threshold?: number; // Minimum similarity score
  filters?: {
    collectionIds?: string[];
    types?: string[];
    tags?: string[];
  };
}

export interface SearchResult {
  item: KnowledgeItem;
  relevanceScore: number;
  snippet: string;
}

export interface RAGContext {
  sources: SearchResult[];
  summary: string;
}

export interface KnowledgeItemInput {
  workspaceId: string;
  createdBy: string; // Required - user who created it
  collectionId?: string | null;
  type: 'document' | 'url' | 'image' | 'text'; // Match database enum
  title: string;
  content: string;
  sourceUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  metadata?: Record<string, any>;
  tags?: string[];
  status?: 'processing' | 'ready' | 'failed'; // Match database enum (no 'pending')
}

export class RAGServiceV2 {
  private embeddings: OpenAIEmbeddings;
  private vectorClient: Index | null = null;
  private useVectorDB: boolean = true;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });

    // Initialize Upstash Vector client
    try {
      this.vectorClient = getVectorClient();
    } catch (error) {
      console.error('Failed to initialize Upstash Vector, falling back to PostgreSQL:', error);
      this.useVectorDB = false;
    }
  }

  /**
   * Search for relevant documents using vector similarity
   * Uses Upstash Vector for speed, falls back to PostgreSQL if needed
   */
  async searchDocuments(params: SearchParams): Promise<SearchResult[]> {
    const { query, workspaceId, limit = 10, threshold = 0.7, filters = {} } = params;

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateQueryEmbedding(query);

      // Try Upstash Vector first (FAST)
      if (this.useVectorDB && this.vectorClient) {
        return await this.searchWithUpstash(queryEmbedding, {
          workspaceId,
          limit,
          threshold,
          filters,
        });
      }

      // Fallback to PostgreSQL (SLOWER but reliable)
      return await this.searchWithPostgreSQL(queryEmbedding, params);
    } catch (error) {
      console.error('Vector search failed, falling back to PostgreSQL:', error);

      // Always have a fallback
      const queryEmbedding = await this.generateQueryEmbedding(query);
      return await this.searchWithPostgreSQL(queryEmbedding, params);
    }
  }

  /**
   * Search using Upstash Vector (FAST)
   */
  private async searchWithUpstash(
    queryEmbedding: number[],
    options: {
      workspaceId: string;
      limit: number;
      threshold: number;
      filters: SearchParams['filters'];
    },
  ): Promise<SearchResult[]> {
    if (!this.vectorClient) {
      throw new Error('Vector client not initialized');
    }

    const { workspaceId, limit, threshold, filters } = options;

    // 1. Query Upstash Vector for nearest neighbors
    const vectorResults = await this.vectorClient.query({
      vector: queryEmbedding,
      topK: limit * 3, // Fetch extra to allow for filtering
      includeMetadata: true,
      includeVectors: false,
    });

    // 2. Filter by workspaceId and other criteria (multi-tenant isolation)
    const filteredResults = vectorResults.filter((result) => {
      const metadata = result.metadata as Record<string, any>;

      // CRITICAL: Always filter by workspace for security
      if (metadata.workspaceId !== workspaceId) return false;

      // Apply additional filters
      if (filters?.collectionIds?.length) {
        if (!filters.collectionIds.includes(metadata.collectionId)) return false;
      }
      if (filters?.types?.length) {
        if (!filters.types.includes(metadata.type)) return false;
      }

      // Filter by threshold
      return result.score >= threshold;
    });

    // 3. Fetch full items from PostgreSQL (source of truth)
    const itemIds = filteredResults.map((r) => String(r.id)); // Ensure string type
    if (itemIds.length === 0) return [];

    const items = await db
      .select()
      .from(knowledgeItems)
      .where(
        and(
          inArray(knowledgeItems.id, itemIds),
          eq(knowledgeItems.workspaceId, workspaceId), // Double-check security
        ),
      );

    // 4. Combine vector scores with PostgreSQL data
    const results = items
      .map((item) => {
        const vectorResult = filteredResults.find((r) => r.id === item.id);
        if (!vectorResult) return null;

        return {
          item,
          relevanceScore: vectorResult.score,
          snippet: this.extractSnippet(item.content || '', ''), // Will implement
        };
      })
      .filter((r): r is SearchResult => r !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, options.limit);

    return results;
  }

  /**
   * Search using PostgreSQL (FALLBACK)
   * Slower but always available
   */
  private async searchWithPostgreSQL(
    queryEmbedding: number[],
    params: SearchParams,
  ): Promise<SearchResult[]> {
    const { workspaceId, limit = 10, threshold = 0.7, filters = {} } = params;

    // Build filters
    const conditions = [
      eq(knowledgeItems.workspaceId, workspaceId),
      eq(knowledgeItems.status, 'ready'),
    ];

    if (filters.collectionIds?.length) {
      conditions.push(inArray(knowledgeItems.collectionId, filters.collectionIds));
    }

    if (filters.types?.length) {
      conditions.push(inArray(knowledgeItems.type, filters.types as any));
    }

    // Query database
    const items = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .limit(limit * 2); // Fetch more to filter by score

    // Calculate similarity scores in-memory
    const results = items
      .map((item) => {
        if (!item.embeddings || !Array.isArray(item.embeddings)) {
          return null;
        }

        const score = this.cosineSimilarity(queryEmbedding, item.embeddings as number[]);
        return {
          item,
          relevanceScore: score,
          snippet: this.extractSnippet(item.content || '', params.query),
        };
      })
      .filter((r): r is SearchResult => r !== null && r.relevanceScore >= threshold)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return results;
  }

  /**
   * Store a knowledge item in both PostgreSQL and Upstash Vector
   */
  async storeKnowledgeItem(input: KnowledgeItemInput): Promise<string> {
    try {
      // 1. Generate embedding
      const embedding = await this.embeddings.embedQuery(input.content);

      // 2. Store in PostgreSQL (source of truth)
      const [dbItem] = await db
        .insert(knowledgeItems)
        .values({
          workspaceId: input.workspaceId,
          createdBy: input.createdBy,
          collectionId: input.collectionId || null,
          type: input.type,
          title: input.title,
          content: input.content,
          sourceUrl: input.sourceUrl || null,
          fileName: input.fileName || null,
          fileSize: input.fileSize || null,
          mimeType: input.mimeType || null,
          metadata: input.metadata || {},
          tags: input.tags || [],
          embeddings: embedding, // Store as backup
          status: input.status || 'ready',
        })
        .returning();

      // 3. Store in Upstash Vector (for fast search)
      if (this.useVectorDB && this.vectorClient) {
        await this.vectorClient.upsert({
          id: dbItem.id,
          vector: embedding,
          metadata: {
            workspaceId: dbItem.workspaceId,
            collectionId: dbItem.collectionId,
            type: dbItem.type,
            title: dbItem.title,
            status: dbItem.status,
          },
        });
      }

      return dbItem.id;
    } catch (error) {
      console.error('Failed to store knowledge item:', error);
      throw new Error('Failed to store knowledge item');
    }
  }

  /**
   * Update a knowledge item in both stores
   */
  async updateKnowledgeItem(itemId: string, updates: Partial<KnowledgeItemInput>): Promise<void> {
    try {
      // 1. Update PostgreSQL
      const [updated] = await db
        .update(knowledgeItems)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(knowledgeItems.id, itemId))
        .returning();

      // 2. If content changed, regenerate embedding and update Upstash
      if (updates.content && this.useVectorDB && this.vectorClient) {
        const embedding = await this.embeddings.embedQuery(updates.content);

        await this.vectorClient.upsert({
          id: itemId,
          vector: embedding,
          metadata: {
            workspaceId: updated.workspaceId,
            collectionId: updated.collectionId,
            type: updated.type,
            title: updated.title || updates.title,
            status: updated.status,
          },
        });
      }
    } catch (error) {
      console.error('Failed to update knowledge item:', error);
      throw new Error('Failed to update knowledge item');
    }
  }

  /**
   * Delete from both PostgreSQL and Upstash Vector
   */
  async deleteKnowledgeItem(itemId: string): Promise<void> {
    try {
      // 1. Delete from PostgreSQL
      await db.delete(knowledgeItems).where(eq(knowledgeItems.id, itemId));

      // 2. Delete from Upstash Vector
      if (this.useVectorDB && this.vectorClient) {
        await this.vectorClient.delete(itemId);
      }
    } catch (error) {
      console.error('Failed to delete knowledge item:', error);
      throw new Error('Failed to delete knowledge item');
    }
  }

  /**
   * Get RAG context for a conversation
   */
  async getRAGContext(query: string, workspaceId: string, limit = 5): Promise<RAGContext> {
    const sources = await this.searchDocuments({
      query,
      workspaceId,
      limit,
      threshold: 0.6,
    });

    // Generate summary of sources
    const summary = sources.map((s) => `${s.item.title}: ${s.snippet}`).join('\n\n');

    return {
      sources,
      summary,
    };
  }

  /**
   * Generate query embedding
   */
  private async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      return await this.embeddings.embedQuery(query);
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Extract relevant snippet from content
   */
  private extractSnippet(content: string, query: string, maxLength = 200): string {
    if (!content) return '';

    // If no query, return first portion
    if (!query) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }

    // Find query terms in content (simple approach)
    const queryTerms = query.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();

    // Find best matching position
    let bestPosition = 0;
    let bestScore = 0;

    for (let i = 0; i < content.length - maxLength; i++) {
      const window = contentLower.substring(i, i + maxLength);
      const score = queryTerms.filter((term) => window.includes(term)).length;

      if (score > bestScore) {
        bestScore = score;
        bestPosition = i;
      }
    }

    // Extract snippet
    const snippet = content.substring(bestPosition, bestPosition + maxLength);
    const prefix = bestPosition > 0 ? '...' : '';
    const suffix = bestPosition + maxLength < content.length ? '...' : '';

    return prefix + snippet + suffix;
  }
}

// Export singleton instance
let ragServiceInstance: RAGServiceV2 | null = null;

export function getRAGService(): RAGServiceV2 {
  if (!ragServiceInstance) {
    ragServiceInstance = new RAGServiceV2();
  }
  return ragServiceInstance;
}
