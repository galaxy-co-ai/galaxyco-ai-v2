import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { knowledgeItems, users, workspaceMembers } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

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
  'text/x-markdown',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  
  // Check by extension for files with missing/incorrect MIME types
  const fileName = file.name.toLowerCase();
  return fileName.endsWith('.md') || 
         fileName.endsWith('.txt') ||
         fileName.endsWith('.csv') ||
         fileName.endsWith('.json');
}

/**
 * POST /api/documents/upload
 * Upload and process a document
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get user and workspace
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    });

    if (!membership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const userId = user.id;
    const workspaceId = membership.workspaceId;

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
    if (!isAllowedFile(file)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported. Supported: PDF, Word, Excel, Text, Markdown, Images` },
        { status: 400 }
      );
    }

    // For demo: create a simple knowledge item record
    const itemId = crypto.randomUUID();
    
    // Read file content for text files
    let content = '';
    let summary = '';
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      content = await file.text();
      summary = content.slice(0, 200) + (content.length > 200 ? '...' : '');
    } else {
      summary = `Uploaded ${file.type} file: ${file.name}`;
    }

    const [newItem] = await db.insert(knowledgeItems).values({
      id: itemId,
      workspaceId,
      createdBy: userId,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      type: file.type.startsWith('image/') ? 'image' : 'document',
      status: 'ready',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      content,
      summary,
      tags: [],
      metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
      processedAt: new Date(),
    }).returning();

    return NextResponse.json(
      {
        success: true,
        document: {
          id: itemId,
          title: newItem.title,
          summary,
          tags: [],
          status: 'ready',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

