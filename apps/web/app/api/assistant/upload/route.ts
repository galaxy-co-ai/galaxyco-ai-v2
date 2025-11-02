/**
 * GalaxyCo.ai File Upload API
 * Handles file uploads for AI assistant (PDFs, CSVs, images, docs)
 * November 2, 2025
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'text/csv',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'image/png',
  'image/jpeg',
  'image/webp',
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob storage
    const fileId = nanoid();
    const filename = `${userId}/${fileId}-${file.name}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    // Extract text content based on file type
    let extractedText = '';
    let metadata: Record<string, any> = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    // For text files, extract content immediately
    if (file.type.startsWith('text/')) {
      extractedText = await file.text();
      metadata.wordCount = extractedText.split(/\s+/).length;
    }

    // For PDFs, images, etc., we'd need additional processing
    // (implement later with appropriate libraries)
    if (file.type === 'application/pdf') {
      metadata.requiresProcessing = true;
      metadata.processingStatus = 'pending';
    }

    return NextResponse.json({
      success: true,
      file: {
        id: fileId,
        name: file.name,
        url: blob.url,
        type: file.type,
        size: file.size,
        extractedText,
        metadata,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

