import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import {
  knowledgeItems,
  users,
  workspaceMembers,
} from "@galaxyco/database/schema";
import { and, eq, desc, like } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/documents
 * List user's documents with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user and workspace
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 },
      );
    }

    const workspaceId = membership.workspaceId;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const collectionId = searchParams.get("collectionId");
    const type = searchParams.get("type");
    const tags = searchParams.get("tags")?.split(",");
    const query = searchParams.get("query");

    // For now, return simple query results (semantic search can be added later)
    // if (query) {
    //   // Add text search capability here if needed
    // }

    // Otherwise, regular list query
    const conditions = [eq(knowledgeItems.workspaceId, workspaceId)];

    if (collectionId) {
      conditions.push(eq(knowledgeItems.collectionId, collectionId));
    }

    if (type) {
      conditions.push(eq(knowledgeItems.type, type as any));
    }

    if (tags && tags.length > 0) {
      // Check if any of the tags match
      conditions.push(
        // This is a simple approach - for production, use proper array overlap query
        like(knowledgeItems.tags, `%${tags[0]}%`),
      );
    }

    const documents = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(limit);

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}
