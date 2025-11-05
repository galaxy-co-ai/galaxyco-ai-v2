/**
 * Knowledge Base Management Tools
 *
 * Tools for managing documents, notes, and knowledge items.
 * These tools allow the AI Assistant to:
 * - Upload documents to knowledge base
 * - Search knowledge semantically
 * - List knowledge items
 * - Delete knowledge items
 */

import { z } from 'zod';
import { type Tool, Permission, ToolError } from './types';
import { getRAGService } from '@/lib/services/rag-service-v2';
import { db } from '@galaxyco/database';
import { knowledgeItems } from '@galaxyco/database/schema';
import { eq, and, desc, ilike, or } from 'drizzle-orm';

/**
 * Upload Document Tool
 * Adds a new document to the knowledge base
 */
export const uploadDocumentTool: Tool = {
  name: 'upload_document',
  description: `Upload a document or text to the knowledge base for semantic search.
Examples:
- "Upload this document to my knowledge base"
- "Add this information to my KB"
- "Store this for future reference"`,
  category: 'knowledge',
  requiredPermissions: [Permission.KNOWLEDGE_CREATE],
  parameters: z.object({
    title: z.string().describe('Document title'),
    content: z.string().describe('Document content or text'),
    type: z.enum(['document', 'url', 'image', 'text']).default('text').describe('Type of content'),
    sourceUrl: z.string().optional().describe('Source URL if applicable'),
    tags: z.array(z.string()).optional().describe('Tags for organization'),
  }),

  async execute(params, context) {
    try {
      const ragService = getRAGService();

      const itemId = await ragService.storeKnowledgeItem({
        workspaceId: context.workspaceId,
        createdBy: context.userId,
        type: params.type,
        title: params.title,
        content: params.content,
        sourceUrl: params.sourceUrl || null,
        tags: params.tags,
        status: 'ready',
      });

      return {
        success: true,
        data: { id: itemId, title: params.title },
        message: `✅ Uploaded "${params.title}" to knowledge base`,
        action: {
          type: 'create',
          target: `knowledge-${itemId}`,
          label: 'Document uploaded',
        },
      };
    } catch (error: any) {
      throw new ToolError(`Failed to upload document: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Search Knowledge Tool
 * Searches knowledge base semantically
 */
export const searchKnowledgeTool: Tool = {
  name: 'search_knowledge',
  description: `Search the knowledge base for relevant information.
Examples:
- "Search my knowledge base for agent documentation"
- "Find information about email automation"
- "What do I have about CRM integration?"`,
  category: 'knowledge',
  requiredPermissions: [Permission.KNOWLEDGE_READ],
  parameters: z.object({
    query: z.string().describe('Search query in natural language'),
    limit: z.number().default(5).describe('Maximum results to return'),
    threshold: z.number().default(0.7).describe('Minimum relevance score (0-1)'),
  }),

  async execute(params, context) {
    try {
      const ragService = getRAGService();

      const results = await ragService.searchDocuments({
        query: params.query,
        workspaceId: context.workspaceId,
        limit: params.limit,
        threshold: params.threshold,
      });

      return {
        success: true,
        data: results.map((r) => ({
          id: r.item.id,
          title: r.item.title,
          snippet: r.snippet,
          relevanceScore: r.relevanceScore,
        })),
        message:
          results.length > 0
            ? `Found ${results.length} relevant document(s)`
            : 'No relevant documents found',
      };
    } catch (error: any) {
      throw new ToolError(`Failed to search knowledge: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * List Knowledge Items Tool
 * Lists all knowledge base items
 */
export const listKnowledgeItemsTool: Tool = {
  name: 'list_knowledge_items',
  description: `List all documents and knowledge items.
Examples:
- "Show me all my knowledge base items"
- "List my documents"
- "What's in my knowledge base?"`,
  category: 'knowledge',
  requiredPermissions: [Permission.KNOWLEDGE_READ],
  parameters: z.object({
    type: z
      .enum(['all', 'document', 'url', 'image', 'text'])
      .default('all')
      .describe('Filter by type'),
    limit: z.number().default(20).describe('Maximum items to return'),
    search: z.string().optional().describe('Search term (text match, not semantic)'),
  }),

  async execute(params, context) {
    try {
      const conditions = [
        eq(knowledgeItems.workspaceId, context.workspaceId),
        eq(knowledgeItems.status, 'ready'),
      ];

      if (params.type !== 'all') {
        conditions.push(eq(knowledgeItems.type, params.type));
      }

      if (params.search) {
        conditions.push(
          or(
            ilike(knowledgeItems.title, `%${params.search}%`),
            ilike(knowledgeItems.content, `%${params.search}%`),
          )!,
        );
      }

      const items = await db.query.knowledgeItems.findMany({
        where: and(...conditions),
        orderBy: [desc(knowledgeItems.createdAt)],
        limit: params.limit,
      });

      return {
        success: true,
        data: items.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          createdAt: item.createdAt,
        })),
        message: `Found ${items.length} knowledge item(s)`,
      };
    } catch (error: any) {
      throw new ToolError(`Failed to list knowledge items: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};

/**
 * Delete Knowledge Item Tool
 * Removes an item from knowledge base
 */
export const deleteKnowledgeItemTool: Tool = {
  name: 'delete_knowledge_item',
  description: `Delete a document from the knowledge base.
Examples:
- "Delete the test document"
- "Remove item from my knowledge base"
- "Get rid of that old documentation"`,
  category: 'knowledge',
  requiredPermissions: [Permission.KNOWLEDGE_DELETE],
  isDestructive: true,
  parameters: z.object({
    itemId: z.string().describe('ID of knowledge item to delete'),
  }),

  async execute(params, context) {
    try {
      // Verify item belongs to workspace
      const item = await db.query.knowledgeItems.findFirst({
        where: and(
          eq(knowledgeItems.id, params.itemId),
          eq(knowledgeItems.workspaceId, context.workspaceId),
        ),
      });

      if (!item) {
        throw new ToolError('Knowledge item not found or access denied', 'NOT_FOUND');
      }

      // Delete via RAG service (deletes from both PostgreSQL and Upstash)
      const ragService = getRAGService();
      await ragService.deleteKnowledgeItem(params.itemId);

      return {
        success: true,
        message: `✅ Deleted "${item.title}" from knowledge base`,
        action: {
          type: 'delete',
          target: `knowledge-${params.itemId}`,
          label: 'Knowledge item deleted',
        },
      };
    } catch (error: any) {
      if (error instanceof ToolError) throw error;
      throw new ToolError(`Failed to delete knowledge item: ${error.message}`, 'EXECUTION_ERROR');
    }
  },
};
