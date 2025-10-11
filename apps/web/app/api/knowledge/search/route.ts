import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { generateEmbedding, findMostSimilar } from "@/lib/embeddings";

/**
 * Semantic Search API
 *
 * POST - Search knowledge base using semantic similarity (vector search)
 */

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
    const { query, topK = 10, collectionId, minSimilarity = 0.7 } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 4. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // 5. Fetch all items with embeddings
    const conditions = [
      eq(knowledgeItems.workspaceId, workspaceId),
      eq(knowledgeItems.status, "ready"),
      isNotNull(knowledgeItems.embeddings),
    ];

    if (collectionId) {
      conditions.push(eq(knowledgeItems.collectionId, collectionId));
    }

    const items = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        content: knowledgeItems.content,
        summary: knowledgeItems.summary,
        sourceUrl: knowledgeItems.sourceUrl,
        fileName: knowledgeItems.fileName,
        tags: knowledgeItems.tags,
        embeddings: knowledgeItems.embeddings,
        createdAt: knowledgeItems.createdAt,
      })
      .from(knowledgeItems)
      .where(and(...conditions));

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items with embeddings found. Generate embeddings first.",
        results: [],
        query,
      });
    }

    // 6. Calculate similarities and find most similar
    const itemsWithEmbeddings = items.map((item) => ({
      ...item,
      embedding: item.embeddings as number[],
    }));

    const similarItems = findMostSimilar(
      queryEmbedding,
      itemsWithEmbeddings,
      topK,
    );

    // 7. Filter by minimum similarity threshold
    const filteredResults = similarItems.filter(
      (item) => item.similarity >= minSimilarity,
    );

    // 8. Format results (remove embedding field, truncate content)
    const results = filteredResults.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      summary:
        item.summary ||
        (item.content ? item.content.substring(0, 200) + "..." : null),
      sourceUrl: item.sourceUrl,
      fileName: item.fileName,
      tags: item.tags,
      similarity: Math.round(item.similarity * 100) / 100, // Round to 2 decimals
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      success: true,
      query,
      results,
      total: results.length,
      searched: items.length,
    });
  } catch (error: any) {
    console.error("Error in semantic search:", error);
    return NextResponse.json(
      { error: "Search failed", details: error.message },
      { status: 500 },
    );
  }
}
