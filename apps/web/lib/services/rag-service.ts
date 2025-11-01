/**
 * RAG (Retrieval Augmented Generation) Service
 *
 * Handles semantic search over user documents and knowledge base using
 * vector embeddings and similarity search.
 */

import { OpenAIEmbeddings } from '@langchain/openai';
import { db } from '@galaxyco/database';
import { knowledgeItems, type KnowledgeItem, aiConversations } from '@galaxyco/database/schema';
import { and, eq, desc, sql, inArray } from 'drizzle-orm';

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

export class RAGService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });
  }

  /**
   * Search for relevant documents using vector similarity
   */
  async searchDocuments(params: SearchParams): Promise<SearchResult[]> {
    const { query, workspaceId, limit = 10, threshold = 0.7, filters = {} } = params;

    // Generate embedding for the query
    const queryEmbedding = await this.generateQueryEmbedding(query);

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

    // Query database with vector similarity
    // Note: This is a simplified version. In production, you'd use pgvector
    // or a dedicated vector database like Pinecone
    const items = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .limit(limit * 2); // Fetch more to filter by score

    // Calculate similarity scores and filter
    const results = items
      .map((item) => {
        const score = this.cosineSimilarity(queryEmbedding, item.embeddings as unknown as number[]);
        return {
          item,
          relevanceScore: score,
          snippet: this.extractSnippet(item.content || '', query),
        };
      })
      .filter((result) => result.relevanceScore >= threshold)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return results;
  }

  /**
   * Get RAG context for a conversation
   */
  async getRAGContext(
    query: string,
    workspaceId: string,
    conversationId?: string,
  ): Promise<RAGContext> {
    // Search relevant documents
    const searchResults = await this.searchDocuments({
      query,
      workspaceId,
      limit: 5,
      threshold: 0.6,
    });

    // If we have a conversation, also consider previous messages
    let conversationContext = '';
    if (conversationId) {
      // Get last few messages from conversation for context
      const conversation = await db.query.aiConversations.findFirst({
        where: and(
          eq(aiConversations.id, conversationId),
          eq(aiConversations.workspaceId, workspaceId),
        ),
        with: {
          messages: {
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
            limit: 5,
          },
        },
      });

      if (conversation) {
        conversationContext = conversation.messages
          .reverse()
          .map((m) => `${m.role}: ${m.content}`)
          .join('\n');
      }
    }

    // Build context summary
    const summary = await this.buildContextSummary(searchResults, conversationContext);

    return {
      sources: searchResults,
      summary,
    };
  }

  /**
   * Generate embedding for a query
   */
  private async generateQueryEmbedding(query: string): Promise<number[]> {
    const [embedding] = await this.embeddings.embedDocuments([query]);
    return embedding;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || vec1.length !== vec2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Extract a relevant snippet from content
   */
  private extractSnippet(content: string, query: string): string {
    const queryWords = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/);

    // Find the most relevant sentence
    let bestSentence = '';
    let bestScore = 0;

    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;

      for (const word of queryWords) {
        if (sentenceLower.includes(word)) {
          score++;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence.trim();
      }
    }

    // Return the best sentence or first 200 chars
    if (bestSentence) {
      return bestSentence.length > 200 ? bestSentence.slice(0, 197) + '...' : bestSentence;
    }

    return content.slice(0, 200) + (content.length > 200 ? '...' : '');
  }

  /**
   * Build a context summary from search results
   */
  private async buildContextSummary(
    searchResults: SearchResult[],
    conversationContext: string,
  ): Promise<string> {
    if (searchResults.length === 0) {
      return '';
    }

    const sourceSummaries = searchResults
      .map((result, index) => {
        return `Source ${index + 1} (${result.item.title}, relevance: ${Math.round(
          result.relevanceScore * 100,
        )}%): ${result.snippet}`;
      })
      .join('\n\n');

    let summary = `Based on ${searchResults.length} relevant documents:\n\n${sourceSummaries}`;

    if (conversationContext) {
      summary = `Previous conversation context:\n${conversationContext}\n\n${summary}`;
    }

    return summary;
  }

  /**
   * Find similar documents to a given document
   */
  async findSimilarDocuments(
    documentId: string,
    workspaceId: string,
    limit: number = 5,
  ): Promise<KnowledgeItem[]> {
    // Get the document
    const document = await db.query.knowledgeItems.findFirst({
      where: and(eq(knowledgeItems.id, documentId), eq(knowledgeItems.workspaceId, workspaceId)),
    });

    if (!document || !document.embeddings) {
      return [];
    }

    // Find similar documents
    const allDocs = await db
      .select()
      .from(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.workspaceId, workspaceId),
          eq(knowledgeItems.status, 'ready'),
          sql`${knowledgeItems.id} != ${documentId}`,
        ),
      )
      .limit(limit * 3);

    // Calculate similarities and sort
    const similarities = allDocs
      .map((doc) => ({
        doc,
        score: this.cosineSimilarity(
          document.embeddings as unknown as number[],
          doc.embeddings as unknown as number[],
        ),
      }))
      .filter((item) => item.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.doc);

    return similarities;
  }

  /**
   * Update embeddings for a document
   */
  async updateDocumentEmbeddings(
    documentId: string,
    content: string,
    workspaceId: string,
  ): Promise<void> {
    const embeddings = await this.embeddings.embedDocuments([content]);

    await db
      .update(knowledgeItems)
      .set({
        embeddings: embeddings[0] as any,
        embeddingsModel: 'text-embedding-3-small',
        updatedAt: new Date(),
      })
      .where(and(eq(knowledgeItems.id, documentId), eq(knowledgeItems.workspaceId, workspaceId)));
  }
}

// Export singleton instance
export const ragService = new RAGService();
