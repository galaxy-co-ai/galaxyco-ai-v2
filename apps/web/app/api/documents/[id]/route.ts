import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/services/user-session";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/documents/[id]
 * Get a specific document
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    const document = await db.query.knowledgeItems.findFirst({
      where: and(
        eq(knowledgeItems.id, id),
        eq(knowledgeItems.workspaceId, workspaceId),
      ),
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    logger.error("Get document error", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/documents/[id]
 * Update a document (title, tags, collection, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    const body = await req.json();
    const { title, tags, collectionId, isFavorite, isArchived } = body;

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title;
    if (tags !== undefined) updates.tags = tags;
    if (collectionId !== undefined) updates.collectionId = collectionId;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isArchived !== undefined) updates.isArchived = isArchived;

    await db
      .update(knowledgeItems)
      .set(updates)
      .where(
        and(
          eq(knowledgeItems.id, id),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Update document error", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/documents/[id]
 * Delete a document
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { workspaceId } = session;

    const { id } = await params;

    await db
      .delete(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.id, id),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Delete document error", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 },
    );
  }
}
