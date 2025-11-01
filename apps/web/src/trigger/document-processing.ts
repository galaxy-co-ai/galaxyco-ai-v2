import { db } from '@galaxyco/database';
import { knowledgeItems, knowledgeCollections } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { DocumentProcessor } from '../lib/services/document-processor';
import { logger } from '@/lib/utils/logger';

interface DocumentProcessingPayload {
  documentId: string;
  workspaceId: string;
  userId: string;
}

export async function documentProcessingJob(payload: DocumentProcessingPayload) {
  const { documentId, workspaceId, userId } = payload;
  logger.info('Starting document processing', {
    documentId,
    workspaceId,
    userId,
  });

  try {
    // Update status to processing
    await db
      .update(knowledgeItems)
      .set({ status: 'processing', updatedAt: new Date() })
      .where(eq(knowledgeItems.id, documentId));

    // Get document details
    const document = await db.query.knowledgeItems.findFirst({
      where: eq(knowledgeItems.id, documentId),
    });
    if (!document) throw new Error(`Document not found: ${documentId}`);
    if (!document.sourceUrl) throw new Error('Document source URL not found');

    // Download and process the document
    const response = await fetch(document.sourceUrl);
    if (!response.ok) throw new Error(`Failed to download document: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const file = new File([buffer], document.title, {
      type:
        (document as any).mimeType ??
        (document.type === 'document' ? 'application/pdf' : 'text/plain'),
    });

    const processor = new DocumentProcessor();
    const processedData = await processor.processDocument(file, {
      generateSummary: true,
      generateEmbeddings: true,
      extractKeywords: true,
    });

    // Update document with processed data
    await db
      .update(knowledgeItems)
      .set({
        content: processedData.content,
        summary: processedData.summary,
        embeddings: processedData.embeddings as any,
        metadata: {
          ...(document.metadata as any),
          wordCount: processedData.wordCount,
          language: processedData.language,
          keywords: processedData.keywords,
          processingDuration: processedData.processingTime,
          aiModel: processedData.model,
        } as any,
        status: 'ready',
        updatedAt: new Date(),
      })
      .where(eq(knowledgeItems.id, documentId));

    logger.info('Document processing completed successfully', {
      documentId,
      wordCount: processedData.wordCount,
      summaryLength: processedData.summary?.length || 0,
      keywordsCount: processedData.keywords?.length || 0,
    });

    return {
      success: true,
      documentId,
      wordCount: processedData.wordCount,
      summaryGenerated: !!processedData.summary,
      embeddingsGenerated: !!processedData.embeddings,
      keywords: processedData.keywords || [],
    };
  } catch (error) {
    logger.error('Document processing failed', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Update status to failed
    await db
      .update(knowledgeItems)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(knowledgeItems.id, documentId));

    throw error;
  }
}

export async function embeddingUpdateJob(payload: { documentId: string; content: string }) {
  const { documentId, content } = payload;
  logger.info('Updating document embeddings', { documentId });

  try {
    const processor = new DocumentProcessor();
    const embeddings = await processor.generateEmbeddings(content);

    await db
      .update(knowledgeItems)
      .set({ embeddings: embeddings as any, updatedAt: new Date() })
      .where(eq(knowledgeItems.id, documentId));

    logger.info('Embeddings updated successfully', { documentId });

    return { success: true, documentId, embeddingsLength: embeddings.length };
  } catch (error) {
    logger.error('Embedding update failed', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function documentCategorizationJob(payload: {
  documentId: string;
  workspaceId: string;
}) {
  const { documentId, workspaceId } = payload;
  logger.info('Auto-categorizing document', { documentId });

  try {
    // Get document details
    const document = await db.query.knowledgeItems.findFirst({
      where: eq(knowledgeItems.id, documentId),
    });
    if (!document) throw new Error(`Document not found: ${documentId}`);

    if (!document.content && !document.summary) {
      logger.info('No content available for categorization', { documentId });
      return { success: false, reason: 'No content available' } as const;
    }

    // Get existing collections for this workspace
    const collections = await db.query.knowledgeCollections.findMany({
      where: eq(knowledgeCollections.workspaceId, workspaceId),
    });

    // Use AI to suggest category/collection
    const processor = new DocumentProcessor();
    const contentForAnalysis = document.summary || document.content!.substring(0, 1000);
    const suggestions = await processor.suggestCategories(contentForAnalysis, {
      existingCollections: (collections as Array<{ name: string }>).map((c) => c.name),
      documentTitle: document.title,
      documentType: document.type,
    });

    // Update document with suggestions
    const currentMetadata = (document.metadata as any) || {};
    await db
      .update(knowledgeItems)
      .set({
        tags: [...(document.tags || []), ...suggestions.suggestedTags],
        metadata: {
          ...currentMetadata,
          aiSuggestions: {
            categories: suggestions.suggestedCategories,
            confidence: suggestions.confidence,
            generatedAt: new Date().toISOString(),
          },
        } as any,
        updatedAt: new Date(),
      })
      .where(eq(knowledgeItems.id, documentId));

    logger.info('Document categorization completed', {
      documentId,
      suggestedCategories: suggestions.suggestedCategories,
      suggestedTags: suggestions.suggestedTags,
      confidence: suggestions.confidence,
    });

    return { success: true, documentId, suggestions } as const;
  } catch (error) {
    console.error('Document categorization failed', {
      documentId,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    } as const;
  }
}
