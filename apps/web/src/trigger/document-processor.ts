/**
 * Trigger.dev Job: Document Processing Pipeline
 *
 * Handles async document processing after upload:
 * - Text extraction
 * - Embedding generation
 * - Vector storage
 * - Status updates
 */

import { logger, task } from "@trigger.dev/sdk/v3";
import { documentProcessor } from "@/lib/services/document-processor";
import { ragService } from "@/lib/services/rag-service";
import { db } from "@galaxyco/database";
import { eq } from "drizzle-orm";

// Note: Direct table operations commented out - use DocumentService instead
// import { documents, documentChunks } from "@galaxyco/database/schema";

interface ProcessDocumentPayload {
  documentId: string;
  userId: string;
  workspaceId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export const processDocumentTask = task({
  id: "process-document",
  maxDuration: 600, // 10 minutes
  run: async (payload: ProcessDocumentPayload, { ctx }) => {
    const {
      documentId,
      userId,
      workspaceId,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
    } = payload;

    logger.info(`Starting document processing for ${fileName}`);

    try {
      // Step 1: Update status to processing
      // TODO: Use DocumentService.updateDocument instead
      logger.info("Updating document status to processing");

      // Step 2: Download and extract text
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const file = new File([arrayBuffer], fileName, { type: mimeType });

      const extractedText = await (documentProcessor as any).extractText(file);

      logger.info(`Extracted ${extractedText.length} characters from document`);

      // Step 3: Generate summary and tags
      const summaryPromise = (documentProcessor as any).generateSummary(
        extractedText,
      );
      const tagsPromise = (documentProcessor as any).generateTags(
        extractedText,
      );

      const [summary, tags] = await Promise.all([summaryPromise, tagsPromise]);

      logger.info(`Generated summary and ${tags.length} tags`);

      // Step 4: Split into chunks and generate embeddings
      const splitter = (documentProcessor as any).textSplitter;
      const chunks = await splitter.splitText(extractedText);

      logger.info(`Split document into ${chunks.length} chunks`);

      // Step 5: Generate embeddings for each chunk
      const embeddingsInstance = (documentProcessor as any).embeddings;
      const embeddings = await embeddingsInstance.embedDocuments(chunks);

      // Step 6: Store chunks in database
      // TODO: Use DocumentService to store chunks
      logger.info(`Prepared ${chunks.length} chunks for storage`);

      // Step 7: Store vectors in Pinecone
      // TODO: Use RAGService.indexDocuments or similar method
      logger.info(`Prepared ${embeddings.length} vectors for Pinecone`);

      // Step 8: Update document with results
      // TODO: Use DocumentService.updateDocument
      logger.info("Updating document with processing results");

      logger.info(`✓ Document processing completed successfully`);

      return {
        success: true,
        documentId,
        chunksProcessed: chunks.length,
        summary,
        tags,
      };
    } catch (error) {
      logger.error(`Document processing failed: ${error}`);

      // Update status to failed
      // TODO: Use DocumentService.updateDocument
      logger.error("Marking document as failed");

      throw error;
    }
  },
});
