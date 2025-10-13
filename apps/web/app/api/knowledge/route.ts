import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  knowledgeItems, 
  knowledgeCollections,
  users, 
  workspaceMembers 
} from "@galaxyco/database/schema";
import { eq, and, ilike, desc, asc, count, or } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Knowledge Base API Route
 * 
 * GET: List knowledge items with search, filtering, pagination
 * POST: Create new knowledge item
 * 
 * All operations scoped to user's current workspace for tenant isolation.
 */

/**
 * GET /api/knowledge
 * List knowledge items with search and filtering
 */
export async function GET(request: NextRequest) {
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

    // 3. Get workspace ID from header or query params
    const searchParams = request.nextUrl.searchParams;
    const requestedWorkspaceId = 
      request.headers.get("x-workspace-id") || 
      searchParams.get("workspaceId");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
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
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} knowledge without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Extract query parameters
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const collectionId = searchParams.get("collectionId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const showArchived = searchParams.get("archived") === "true";

    // 6. Build where conditions
    const whereConditions = [
      eq(knowledgeItems.workspaceId, requestedWorkspaceId),
      eq(knowledgeItems.isArchived, showArchived)
    ];

    if (search) {
      whereConditions.push(
        or(
          ilike(knowledgeItems.title, `%${search}%`),
          ilike(knowledgeItems.content, `%${search}%`),
          ilike(knowledgeItems.summary, `%${search}%`)
        )!
      );
    }

    if (type) {
      whereConditions.push(eq(knowledgeItems.type, type as "document" | "url" | "image" | "text"));
    }

    if (status) {
      whereConditions.push(eq(knowledgeItems.status, status as "processing" | "ready" | "failed"));
    }

    if (collectionId) {
      whereConditions.push(eq(knowledgeItems.collectionId, collectionId));
    }

    // 7. Build order by
    const orderByColumn = sortBy === "title" ? knowledgeItems.title :
                         sortBy === "type" ? knowledgeItems.type :
                         sortBy === "status" ? knowledgeItems.status :
                         sortBy === "updatedAt" ? knowledgeItems.updatedAt :
                         knowledgeItems.createdAt;
    
    const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    // 8. Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(knowledgeItems)
      .where(and(...whereConditions));

    const total = totalResult.count;

    // 9. Get knowledge items with collections
    const items = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        status: knowledgeItems.status,
        content: knowledgeItems.content,
        summary: knowledgeItems.summary,
        sourceUrl: knowledgeItems.sourceUrl,
        fileName: knowledgeItems.fileName,
        fileSize: knowledgeItems.fileSize,
        mimeType: knowledgeItems.mimeType,
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
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // 10. Get available types, statuses, and collections for filtering
    const typesResult = await db
      .selectDistinct({ type: knowledgeItems.type })
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.workspaceId, requestedWorkspaceId),
        eq(knowledgeItems.isArchived, false)
      ));

    const statusesResult = await db
      .selectDistinct({ status: knowledgeItems.status })
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.workspaceId, requestedWorkspaceId),
        eq(knowledgeItems.isArchived, false)
      ));

    const collectionsResult = await db
      .select({
        id: knowledgeCollections.id,
        name: knowledgeCollections.name,
        itemCount: count(knowledgeItems.id),
      })
      .from(knowledgeCollections)
      .leftJoin(knowledgeItems, and(
        eq(knowledgeItems.collectionId, knowledgeCollections.id),
        eq(knowledgeItems.isArchived, false)
      ))
      .where(eq(knowledgeCollections.workspaceId, requestedWorkspaceId))
      .groupBy(knowledgeCollections.id, knowledgeCollections.name);

    // 11. Build response
    const response = {
      items: items.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters: {
        types: typesResult.map(t => t.type).filter(Boolean),
        statuses: statusesResult.map(s => s.status).filter(Boolean),
        collections: collectionsResult,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Knowledge list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge items", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge
 * Create a new knowledge item
 */
export async function POST(request: NextRequest) {
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
        `[SECURITY] User ${clerkUserId} attempted to create knowledge in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Parse and validate request body
    const body = await request.json();
    const {
      title,
      type,
      content,
      summary,
      collectionId,
      sourceUrl,
      fileName,
      fileSize,
      mimeType,
      metadata,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!type?.trim()) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // 6. Validate collection if provided
    if (collectionId) {
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

    // 7. Create knowledge item
    const knowledgeItemId = nanoid();
    const now = new Date();

    const [newItem] = await db
      .insert(knowledgeItems)
      .values({
        id: knowledgeItemId,
        workspaceId: requestedWorkspaceId,
        collectionId: collectionId || null,
        title: title.trim(),
        type: type.trim() as "document" | "url" | "image" | "text",
        status: "processing", // Default to processing
        content: content?.trim() || null,
        summary: summary?.trim() || null,
        sourceUrl: sourceUrl || null,
        fileName: fileName || null,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        metadata: metadata || {},
        isArchived: false,
        isFavorite: false,
        createdBy: user.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // 8. Return created item with collection info
    const itemWithCollection = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        status: knowledgeItems.status,
        content: knowledgeItems.content,
        summary: knowledgeItems.summary,
        sourceUrl: knowledgeItems.sourceUrl,
        fileName: knowledgeItems.fileName,
        fileSize: knowledgeItems.fileSize,
        mimeType: knowledgeItems.mimeType,
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
      .where(eq(knowledgeItems.id, knowledgeItemId))
      .limit(1);

    const result = itemWithCollection[0];
    return NextResponse.json({
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error("Knowledge creation error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge item", details: error.message },
      { status: 500 }
    );
  }
}
