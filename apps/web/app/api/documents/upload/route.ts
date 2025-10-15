import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/services/user-session';
import { documentProcessor } from '@/lib/services/document-processor';
import { db } from '@galaxyco/database';
import { knowledgeItems } from '@galaxyco/database/schema';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'text/plain',
  'text/csv',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

/**
 * POST /api/documents/upload
 * Upload and process a document
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const { userId, workspaceId } = session;

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const collectionId = formData.get('collectionId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported` },
        { status: 400 }
      );
    }

    // Create knowledge item record first (status: processing)
    const itemId = nanoid();
    await db.insert(knowledgeItems).values({
      id: itemId,
      workspaceId,
      createdBy: userId,
      title: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      status: 'processing',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    // Process document in the background (could be moved to Trigger.dev)
    // For now, we'll process it synchronously
    try {
      const processed = await documentProcessor.processDocument({
        file,
        userId,
        workspaceId,
        collectionId: collectionId || undefined,
      });

      // Update knowledge item with processed data
      await db
        .update(knowledgeItems)
        .set({
          status: 'ready',
          sourceUrl: processed.storageUrl,
          content: processed.content,
          summary: processed.summary,
          tags: processed.tags,
          embeddings: processed.embeddings.flat() as any, // Flatten to single array
          embeddingsModel: 'text-embedding-3-small',
          metadata: processed.metadata,
          processedAt: new Date(),
        })
        .where(eq(knowledgeItems.id, itemId));

      return NextResponse.json(
        {
          success: true,
          document: {
            id: itemId,
            title: file.name,
            summary: processed.summary,
            tags: processed.tags,
            status: 'ready',
          },
        },
        { status: 201 }
      );
    } catch (processError) {
      // Update status to failed
      await db
        .update(knowledgeItems)
        .set({
          status: 'failed',
          processingError: processError instanceof Error ? processError.message : 'Unknown error',
        })
        .where(eq(knowledgeItems.id, itemId));

      throw processError;
    }
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Import eq for database query
import { eq } from 'drizzle-orm';
