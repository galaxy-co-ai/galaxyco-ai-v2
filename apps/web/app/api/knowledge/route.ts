import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { eq, and, desc, like, or } from "drizzle-orm";

/**
 * Knowledge Base List API
 *
 * GET: List knowledge items for a workspace
 * Supports filtering, search, and pagination
 */

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get workspace ID from query params
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    // 3. Parse query parameters
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type"); // 'document' | 'url' | 'image' | 'text'
    const status = searchParams.get("status"); // 'processing' | 'ready' | 'failed'
    const favorites = searchParams.get("favorites") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 4. Build query conditions
    const conditions = [eq(knowledgeItems.workspaceId, workspaceId)];

    // Filter by type
    if (type) {
      conditions.push(eq(knowledgeItems.type, type as any));
    }

    // Filter by status
    if (status) {
      conditions.push(eq(knowledgeItems.status, status as any));
    }

    // Filter by favorites
    if (favorites) {
      conditions.push(eq(knowledgeItems.isFavorite, true));
    }

    // Search in title or content
    if (search) {
      conditions.push(
        or(
          like(knowledgeItems.title, `%${search}%`),
          like(knowledgeItems.content, `%${search}%`),
        )!,
      );
    }

    // 5. Query database
    const items = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(limit)
      .offset(offset);

    // 6. Get total count for pagination
    const countResult = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions));

    const totalCount = countResult.length;

    return NextResponse.json({
      items,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + items.length < totalCount,
      },
    });
  } catch (error: any) {
    console.error("Knowledge list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge items", details: error.message },
      { status: 500 },
    );
  }
}
