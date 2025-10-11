import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import {
  knowledgeCollections,
  knowledgeItems,
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Collection Detail API
 *
 * PUT - Update collection
 * DELETE - Delete collection (sets items' collectionId to null)
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Authenticate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get workspace ID
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const { name, description, color } = body;

    // Build update object
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined)
      updates.description = description?.trim() || null;
    if (color !== undefined) updates.color = color;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // 4. Update collection
    const collectionId = params.id;
    const [updatedCollection] = await db
      .update(knowledgeCollections)
      .set(updates)
      .where(
        and(
          eq(knowledgeCollections.id, collectionId),
          eq(knowledgeCollections.workspaceId, workspaceId),
        ),
      )
      .returning();

    if (!updatedCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      collection: updatedCollection,
      message: "Collection updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Authenticate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get workspace ID
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    const collectionId = params.id;

    // 3. First, remove collection from all items
    await db
      .update(knowledgeItems)
      .set({ collectionId: null })
      .where(
        and(
          eq(knowledgeItems.collectionId, collectionId),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      );

    // 4. Delete the collection
    const [deletedCollection] = await db
      .delete(knowledgeCollections)
      .where(
        and(
          eq(knowledgeCollections.id, collectionId),
          eq(knowledgeCollections.workspaceId, workspaceId),
        ),
      )
      .returning();

    if (!deletedCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection", details: error.message },
      { status: 500 },
    );
  }
}
