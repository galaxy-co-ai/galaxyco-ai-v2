import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import {
  knowledgeItems,
  users,
  workspaceMembers,
} from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";
import {
  fileUploadSchema,
  formatValidationError,
  safeValidateRequest,
} from "@/lib/validation";
import { ZodError } from "zod";

export const runtime = "nodejs";

/**
 * POST /api/documents/upload
 * Upload and process a document
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized document upload attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user and workspace
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      logger.warn("Document upload by non-existent user", { clerkUserId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    });

    if (!membership) {
      logger.warn("Document upload without workspace", { userId: user.id });
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 },
      );
    }

    const userId = user.id;
    const workspaceId = membership.workspaceId;

    // 3. Parse and validate form data
    const formData = await req.formData();
    const file = formData.get("file");
    const collectionId = formData.get("collectionId");

    // Validate using Zod schema
    const validationResult = safeValidateRequest(fileUploadSchema, {
      file,
      collectionId: collectionId || undefined,
    });

    if (!validationResult.success) {
      const formattedError = formatValidationError(validationResult.error);
      logger.warn("Document upload validation failed", {
        userId,
        workspaceId,
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, { status: 400 });
    }

    const { file: validatedFile, collectionId: validatedCollectionId } =
      validationResult.data;

    // 4. Process file
    const itemId = crypto.randomUUID();

    // Read file content for text files
    let content = "";
    let summary = "";
    if (
      validatedFile.type.startsWith("text/") ||
      validatedFile.name.endsWith(".md") ||
      validatedFile.name.endsWith(".txt")
    ) {
      content = await validatedFile.text();
      summary = content.slice(0, 200) + (content.length > 200 ? "..." : "");
    } else {
      summary = `Uploaded ${validatedFile.type} file: ${validatedFile.name}`;
    }

    // 5. Create knowledge item
    const [newItem] = await db
      .insert(knowledgeItems)
      .values({
        id: itemId,
        workspaceId,
        createdBy: userId,
        title: validatedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
        type: validatedFile.type.startsWith("image/") ? "image" : "document",
        status: "ready",
        fileName: validatedFile.name,
        fileSize: validatedFile.size,
        mimeType: validatedFile.type,
        content,
        summary,
        tags: [],
        collectionId: validatedCollectionId || null,
        metadata: {},
        processedAt: new Date(),
      })
      .returning();

    logger.info("Document uploaded successfully", {
      userId,
      workspaceId,
      documentId: itemId,
      fileName: validatedFile.name,
      fileSize: validatedFile.size,
      mimeType: validatedFile.type,
    });

    return NextResponse.json(
      {
        success: true,
        document: {
          id: itemId,
          title: newItem.title,
          summary,
          tags: [],
          status: "ready",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    // Handle Zod validation errors specifically
    if (error instanceof ZodError) {
      const formattedError = formatValidationError(error);
      logger.warn("Document upload validation error", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, { status: 400 });
    }

    // Handle other errors
    logger.error("Document upload error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to upload document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
