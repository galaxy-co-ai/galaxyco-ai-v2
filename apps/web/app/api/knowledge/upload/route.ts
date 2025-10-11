import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";
import { uploadFileToBlob, generateUniqueFilename } from "@/lib/storage";
import {
  extractTextFromPDF,
  extractTextFromPlainText,
  scrapeURL,
  generateSimpleSummary,
} from "@/lib/document-processor";
import {
  generateEmbedding,
  prepareTextForEmbedding,
  EMBEDDING_MODEL,
} from "@/lib/embeddings";

/**
 * Knowledge Base Upload API
 *
 * Handles file uploads, URL scraping, and text submissions for the knowledge base.
 * Supports: PDFs, Word docs, images, URLs, and plain text.
 *
 * Security:
 * - Multi-tenant isolation via workspaceId
 * - Clerk authentication required
 * - File size limits enforced
 * - MIME type validation
 */

/**
 * Generate embeddings for a knowledge item in the background
 * This function is fire-and-forget - it logs errors but doesn't block the response
 */
async function generateEmbeddingsInBackground(
  itemId: string,
  title: string,
  content: string | null,
): Promise<void> {
  // Run in background without blocking
  setImmediate(async () => {
    try {
      // Prepare text from title and content
      const text = prepareTextForEmbedding(title, content);

      if (!text || text.trim().length === 0) {
        console.warn(
          `[Embeddings] Item ${itemId} has no content for embedding generation`,
        );
        return;
      }

      // Generate embedding
      const embedding = await generateEmbedding(text);

      // Update item with embedding
      await db
        .update(knowledgeItems)
        .set({
          embeddings: embedding as any, // Cast to any for JSONB
          embeddingsModel: EMBEDDING_MODEL,
        })
        .where(eq(knowledgeItems.id, itemId));

      console.log(
        `[Embeddings] Successfully generated embeddings for item ${itemId}`,
      );
    } catch (error: any) {
      console.error(
        `[Embeddings] Error generating embeddings for item ${itemId}:`,
        error,
      );
    }
  });
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get workspace ID from query params or headers
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    // 3. Parse request body (could be FormData for files or JSON for URLs/text)
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      return await handleFileUpload(request, userId, workspaceId);
    } else if (contentType.includes("application/json")) {
      // Handle URL or text submission
      return await handleJsonSubmission(request, userId, workspaceId);
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Knowledge upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * Handle file upload (PDF, Word, Image, etc.)
 */
async function handleFileUpload(
  request: NextRequest,
  userId: string,
  workspaceId: string,
): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 },
    );
  }

  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  // Determine knowledge item type
  let itemType: "document" | "image";
  if (file.type.startsWith("image/")) {
    itemType = "image";
  } else {
    itemType = "document";
  }

  // Get file buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Upload to Vercel Blob storage
    const uniqueFilename = generateUniqueFilename(file.name);
    const { url: blobUrl } = await uploadFileToBlob(buffer, uniqueFilename, {
      contentType: file.type,
    });

    // Extract text content based on file type
    let extractedText = "";
    let title = file.name;

    if (file.type === "application/pdf") {
      const pdfData = await extractTextFromPDF(buffer);
      extractedText = pdfData.text;
      title = file.name.replace(".pdf", "");
    } else if (file.type.startsWith("text/")) {
      extractedText = await extractTextFromPlainText(buffer);
    }

    // Create knowledge item with processed content
    const [knowledgeItem] = await db
      .insert(knowledgeItems)
      .values({
        workspaceId,
        createdBy: userId,
        title,
        type: itemType,
        status: extractedText ? "ready" : "processing",
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        sourceUrl: blobUrl,
        content: extractedText.substring(0, 50000) || null, // Limit to 50k chars
        processedAt: extractedText ? new Date() : null,
        metadata: {
          wordCount: extractedText.split(/\s+/).length,
          extractedAt: new Date().toISOString(),
        },
      })
      .returning();

    // Generate embeddings in background (fire-and-forget)
    if (extractedText) {
      generateEmbeddingsInBackground(
        knowledgeItem.id,
        knowledgeItem.title,
        knowledgeItem.content,
      );
    }

    return NextResponse.json({
      success: true,
      item: knowledgeItem,
      message: "File uploaded and processed successfully. Embeddings generation started.",
    });
  } catch (uploadError: any) {
    console.error("File upload error:", uploadError);
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }
}

/**
 * Handle JSON submission (URL or plain text)
 */
async function handleJsonSubmission(
  request: NextRequest,
  userId: string,
  workspaceId: string,
): Promise<NextResponse> {
  const body = await request.json();
  const { type, url, text, title } = body;

  if (type === "url") {
    // Validate URL
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url); // Validate URL format
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Scrape URL and extract content
    try {
      const scrapedData = await scrapeURL(url);

      // Create knowledge item with scraped content
      const [knowledgeItem] = await db
        .insert(knowledgeItems)
        .values({
          workspaceId,
          createdBy: userId,
          title: scrapedData.title || title || url,
          type: "url",
          status: "ready",
          sourceUrl: url,
          content: scrapedData.text,
          processedAt: new Date(),
          metadata: {
            author: scrapedData.author,
            publishDate: scrapedData.publishDate,
          },
        })
        .returning();

      // Generate embeddings in background (fire-and-forget)
      generateEmbeddingsInBackground(
        knowledgeItem.id,
        knowledgeItem.title,
        knowledgeItem.content,
      );

      return NextResponse.json({
        success: true,
        item: knowledgeItem,
        message: "URL content fetched and processed successfully. Embeddings generation started.",
      });
    } catch (scrapeError: any) {
      console.error("URL scrape error:", scrapeError);
      return NextResponse.json(
        { error: `Failed to fetch URL: ${scrapeError.message}` },
        { status: 500 },
      );
    }
  } else if (type === "text") {
    // Handle plain text submission
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const [knowledgeItem] = await db
      .insert(knowledgeItems)
      .values({
        workspaceId,
        createdBy: userId,
        title: title || "Untitled Note",
        type: "text",
        status: "ready", // Text is ready immediately
        content: text,
        processedAt: new Date(),
        metadata: {
          wordCount: text.split(/\s+/).length,
        },
      })
      .returning();

    // Generate embeddings in background (fire-and-forget)
    generateEmbeddingsInBackground(
      knowledgeItem.id,
      knowledgeItem.title,
      knowledgeItem.content,
    );

    return NextResponse.json({
      success: true,
      item: knowledgeItem,
      message: "Text saved successfully. Embeddings generation started.",
    });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}
