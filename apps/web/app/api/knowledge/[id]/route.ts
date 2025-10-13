import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  knowledgeItems, 
  knowledgeCollections,
  users, 
  workspaceMembers 
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Knowledge Item API Route
 * 
 * GET: Get single knowledge item details
 * PUT: Update knowledge item
 * DELETE: Delete/soft delete knowledge item
 */

/**
 * GET /api/knowledge/[id]
 * Get single knowledge item with details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access knowledge item ${params.id} in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Get knowledge item with collection info
    const item = await db
      .select({
        id: knowledgeItems.id,
        workspaceId: knowledgeItems.workspaceId,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        status: knowledgeItems.status,
        content: knowledgeItems.content,
        sourceUrl: knowledgeItems.sourceUrl,
        fileName: knowledgeItems.fileName,
        fileSize: knowledgeItems.fileSize,
        mimeType: knowledgeItems.mimeType,
        summary: knowledgeItems.summary,
        metadata: knowledgeItems.metadata,
        isArchived: knowledgeItems.isArchived,
        isFavorite: knowledgeItems.isFavorite,
        createdAt: knowledgeItems.createdAt,
        updatedAt: knowledgeItems.updatedAt,
        collectionId: knowledgeItems.collectionId,
        collectionName: knowledgeCollections.name,
      })
      .from(knowledgeItems)
      .leftJoin(
        knowledgeCollections,
        eq(knowledgeItems.collectionId, knowledgeCollections.id)
      )
      .where(
        and(
          eq(knowledgeItems.id, params.id),
          eq(knowledgeItems.workspaceId, requestedWorkspaceId)
        )
      )
      .limit(1);

    if (!item.length) {
      return NextResponse.json(
        { error: "Knowledge item not found" },
        { status: 404 }
      );
    }

    const result = item[0];
    return NextResponse.json({
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Knowledge item fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge item", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/knowledge/[id]
 * Update knowledge item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to update knowledge item ${params.id} in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Verify knowledge item exists and belongs to workspace
    const existingItem = await db.query.knowledgeItems.findFirst({
      where: and(
        eq(knowledgeItems.id, params.id),
        eq(knowledgeItems.workspaceId, requestedWorkspaceId)
      ),
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Knowledge item not found" },
        { status: 404 }
      );
    }

    // 6. Parse and validate request body
    const body = await request.json();
    const {
      title,
      type,
      status,
      content,
      summary,
      collectionId,
      sourceUrl,
      fileName,
      fileSize,
      mimeType,
      metadata,
      isArchived,
      isFavorite,
    } = body;

    // Validation
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (type !== undefined && !type?.trim()) {
      return NextResponse.json(
        { error: "Type cannot be empty" },
        { status: 400 }
      );
    }

    // 7. Validate collection if provided
    if (collectionId && collectionId !== existingItem.collectionId) {
      const collection = await db.query.knowledgeCollections.findFirst({
        where: and(
          eq(knowledgeCollections.id, collectionId),
          eq(knowledgeCollections.workspaceId, requestedWorkspaceId)
        ),
      });

      if (!collection) {
        return NextResponse.json(
          { error: "Collection not found or access denied" },
          { status: 404 }
        );
      }
    }

    // 8. Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (type !== undefined) updateData.type = type.trim() as "document" | "url" | "image" | "text";
    if (status !== undefined) updateData.status = status as "processing" | "ready" | "failed";
    if (content !== undefined) updateData.content = content?.trim() || null;
    if (summary !== undefined) updateData.summary = summary?.trim() || null;
    if (collectionId !== undefined) updateData.collectionId = collectionId || null;
    if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl || null;
    if (fileName !== undefined) updateData.fileName = fileName || null;
    if (fileSize !== undefined) updateData.fileSize = fileSize || null;
    if (mimeType !== undefined) updateData.mimeType = mimeType || null;
    if (metadata !== undefined) updateData.metadata = metadata || {};
    if (isArchived !== undefined) updateData.isArchived = isArchived;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;

    // 9. Update knowledge item
    const [updatedItem] = await db
      .update(knowledgeItems)
      .set(updateData)
      .where(
        and(
          eq(knowledgeItems.id, params.id),
          eq(knowledgeItems.workspaceId, requestedWorkspaceId)
        )
      )
      .returning();

    // 10. Return updated item with collection info
    const itemWithCollection = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        status: knowledgeItems.status,
        content: knowledgeItems.content,
        sourceUrl: knowledgeItems.sourceUrl,
        fileName: knowledgeItems.fileName,
        fileSize: knowledgeItems.fileSize,
        mimeType: knowledgeItems.mimeType,
        summary: knowledgeItems.summary,
        metadata: knowledgeItems.metadata,
        isArchived: knowledgeItems.isArchived,
        isFavorite: knowledgeItems.isFavorite,
        createdAt: knowledgeItems.createdAt,
        updatedAt: knowledgeItems.updatedAt,
        collectionId: knowledgeItems.collectionId,
        collectionName: knowledgeCollections.name,
      })
      .from(knowledgeItems)
      .leftJoin(
        knowledgeCollections,
        eq(knowledgeItems.collectionId, knowledgeCollections.id)
      )
      .where(eq(knowledgeItems.id, params.id))
      .limit(1);

    const result = itemWithCollection[0];
    return NextResponse.json({
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Knowledge item update error:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge item", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/knowledge/[id]
 * Delete/soft delete knowledge item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to delete knowledge item ${params.id} in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Verify knowledge item exists and belongs to workspace
    const existingItem = await db.query.knowledgeItems.findFirst({
      where: and(
        eq(knowledgeItems.id, params.id),
        eq(knowledgeItems.workspaceId, requestedWorkspaceId)
      ),
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Knowledge item not found" },
        { status: 404 }
      );
    }

    // 6. Check if this is a hard delete or soft delete
    const searchParams = request.nextUrl.searchParams;
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      // Hard delete - actually remove from database
      await db
        .delete(knowledgeItems)
        .where(
          and(
            eq(knowledgeItems.id, params.id),
            eq(knowledgeItems.workspaceId, requestedWorkspaceId)
          )
        );

      return NextResponse.json({ 
        message: "Knowledge item permanently deleted",
        id: params.id 
      });
    } else {
      // Soft delete - mark as archived
      const [updatedItem] = await db
        .update(knowledgeItems)
        .set({ 
          isArchived: true,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(knowledgeItems.id, params.id),
            eq(knowledgeItems.workspaceId, requestedWorkspaceId)
          )
        )
        .returning();

      return NextResponse.json({ 
        message: "Knowledge item archived",
        id: params.id,
        isArchived: true
      });
    }
  } catch (error: any) {
    console.error("Knowledge item delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge item", details: error.message },
      { status: 500 }
    );
  }
}