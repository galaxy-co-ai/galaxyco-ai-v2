import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { knowledgeItems } from "@galaxyco/database/schema";
import { eq, and, isNull } from "drizzle-orm";
import {
  generateEmbedding,
  prepareTextForEmbedding,
  EMBEDDING_MODEL,
} from "@/lib/embeddings";

/**
 * Embeddings Generation API
 *
 * POST - Generate embeddings for knowledge items that don't have them yet
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

    // 3. Optional: Get specific item ID or process all
    const body = await request.json().catch(() => ({}));
    const { itemId, batchSize = 10 } = body;

    // 4. Fetch items without embeddings
    let query = db
      .select()
      .from(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.workspaceId, workspaceId),
          eq(knowledgeItems.status, "ready"), // Only process ready items
          isNull(knowledgeItems.embeddings), // Only items without embeddings
        ),
      )
      .limit(batchSize);

    // If specific item requested
    if (itemId) {
      query = db
        .select()
        .from(knowledgeItems)
        .where(
          and(
            eq(knowledgeItems.id, itemId),
            eq(knowledgeItems.workspaceId, workspaceId),
          ),
        )
        .limit(1);
    }

    const items = await query;

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: itemId
          ? "Item not found or already has embeddings"
          : "No items need embeddings",
        processed: 0,
      });
    }

    // 5. Generate embeddings for each item
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        // Prepare text from title and content
        const text = prepareTextForEmbedding(item.title, item.content);

        if (!text || text.trim().length === 0) {
          console.warn(`Item ${item.id} has no content for embedding`);
          errorCount++;
          results.push({
            id: item.id,
            success: false,
            error: "No content available",
          });
          continue;
        }

        // Generate embedding
        const embedding = await generateEmbedding(text);

        // Update item with embedding
        await db
          .update(knowledgeItems)
          .set({
            embeddings: embedding as any, // Cast to any for JSONB
            embeddingsModel: EMBEDDING_MODEL,
          })
          .where(eq(knowledgeItems.id, item.id));

        successCount++;
        results.push({
          id: item.id,
          title: item.title,
          success: true,
        });
      } catch (error: any) {
        console.error(`Error processing item ${item.id}:`, error);
        errorCount++;
        results.push({
          id: item.id,
          title: item.title,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${items.length} items: ${successCount} successful, ${errorCount} failed`,
      processed: successCount,
      failed: errorCount,
      results,
    });
  } catch (error: any) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings", details: error.message },
      { status: 500 },
    );
  }
}
