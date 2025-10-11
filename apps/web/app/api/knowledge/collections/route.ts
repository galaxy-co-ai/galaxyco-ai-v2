import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import {
  knowledgeCollections,
  knowledgeItems,
} from "@galaxyco/database/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Knowledge Collections API
 *
 * GET - List all collections with item counts
 * POST - Create new collection
 */

export async function GET(request: NextRequest) {
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

    // 3. Fetch collections with item counts
    const collections = await db
      .select({
        id: knowledgeCollections.id,
        name: knowledgeCollections.name,
        description: knowledgeCollections.description,
        color: knowledgeCollections.color,
        createdAt: knowledgeCollections.createdAt,
        itemCount: sql<number>`count(${knowledgeItems.id})::int`,
      })
      .from(knowledgeCollections)
      .leftJoin(
        knowledgeItems,
        and(
          eq(knowledgeItems.collectionId, knowledgeCollections.id),
          eq(knowledgeItems.workspaceId, workspaceId),
        ),
      )
      .where(eq(knowledgeCollections.workspaceId, workspaceId))
      .groupBy(knowledgeCollections.id)
      .orderBy(knowledgeCollections.name);

    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 },
      );
    }

    // 4. Create collection
    const [collection] = await db
      .insert(knowledgeCollections)
      .values({
        workspaceId,
        createdBy: userId,
        name: name.trim(),
        description: description?.trim() || null,
        color: color || "#4d6fff", // Default to primary color
      })
      .returning();

    return NextResponse.json({
      success: true,
      collection,
      message: "Collection created successfully",
    });
  } catch (error: any) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection", details: error.message },
      { status: 500 },
    );
  }
}
