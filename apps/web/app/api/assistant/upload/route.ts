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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Process all files
    const uploadedFiles = [];
    const errors: string[] = [];
    
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
        continue;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type (${file.type})`);
        continue;
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

      uploadedFiles.push({
        id: fileId,
        name: file.name,
        url: blob.url,
        type: file.type,
        size: file.size,
        extractedText,
        metadata,
      });
    }

    // Return results - include both successes and errors
    return NextResponse.json({
      success: uploadedFiles.length > 0,
      files: uploadedFiles,
      count: uploadedFiles.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

