import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Knowledge Item Detail API
 *
 * GET - Fetch single item with full content
 * PUT - Update item (title, tags, etc.)
 * DELETE - Delete item
 */

export async function GET(
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

    // 3. Fetch the item
    const itemId = params.id;
    const [item] = await db
      .select()
      .from(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.id, itemId),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      )
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item", details: error.message },
      { status: 500 },
    );
  }
}

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
    const { title, tags, isFavorite, isArchived } = body;

    // Build update object
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (tags !== undefined) updates.tags = tags;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isArchived !== undefined) updates.isArchived = isArchived;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // 4. Update the item
    const itemId = params.id;
    const [updatedItem] = await db
      .update(knowledgeItems)
      .set(updates)
      .where(
        and(
          eq(knowledgeItems.id, itemId),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      )
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item", details: error.message },
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

    // 3. Delete the item
    const itemId = params.id;
    const [deletedItem] = await db
      .delete(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.id, itemId),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      )
      .returning();

    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // TODO: Delete from storage (Vercel Blob) if it's a file

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 },
    );
  }
}
