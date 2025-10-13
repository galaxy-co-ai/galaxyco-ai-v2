import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { agentTemplates } from "@galaxyco/database/schema";
import { eq, and, desc, like, or, count } from "drizzle-orm";

/**
 * Marketplace API Route
 * 
 * GET: List published agent templates with search, filtering, and pagination
 * 
 * This endpoint serves the marketplace page with public agent templates
 * No workspace validation needed since marketplace templates are public
 */

/**
 * GET /api/marketplace
 * List published agent templates with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user (optional for marketplace - could be public)
    const { userId: clerkUserId } = await auth();
    
    // Marketplace can be viewed by unauthenticated users, but we track for analytics
    console.log(`Marketplace accessed by user: ${clerkUserId || 'anonymous'}`);

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "trending"; // trending, popular, newest, rating
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 3. Build query conditions
    const conditions = [
      eq(agentTemplates.isPublished, true), // Only show published templates
    ];

    // Filter by category
    if (category && category !== "all") {
      conditions.push(eq(agentTemplates.category, category));
    }

    // Filter by featured
    if (featured) {
      conditions.push(eq(agentTemplates.isFeatured, true));
    }

    // Search in name, description, or tags
    if (search) {
      conditions.push(
        or(
          like(agentTemplates.name, `%${search}%`),
          like(agentTemplates.description, `%${search}%`),
          like(agentTemplates.shortDescription, `%${search}%`)
          // TODO: Add tag search when we implement array search
        )!
      );
    }

    // 4. Determine ordering
    let orderBy;
    switch (sortBy) {
      case "popular":
        orderBy = desc(agentTemplates.installCount);
        break;
      case "newest":
        orderBy = desc(agentTemplates.publishedAt);
        break;
      case "rating":
        orderBy = desc(agentTemplates.rating);
        break;
      case "trending":
      default:
        orderBy = desc(agentTemplates.trendingScore);
        break;
    }

    // 5. Query templates
    const templates = await db
      .select({
        id: agentTemplates.id,
        name: agentTemplates.name,
        slug: agentTemplates.slug,
        description: agentTemplates.description,
        shortDescription: agentTemplates.shortDescription,
        category: agentTemplates.category,
        type: agentTemplates.type,
        iconUrl: agentTemplates.iconUrl,
        coverImageUrl: agentTemplates.coverImageUrl,
        badgeText: agentTemplates.badgeText,
        kpis: agentTemplates.kpis,
        authorName: agentTemplates.authorName,
        tags: agentTemplates.tags,
        installCount: agentTemplates.installCount,
        rating: agentTemplates.rating,
        reviewCount: agentTemplates.reviewCount,
        isFeatured: agentTemplates.isFeatured,
        publishedAt: agentTemplates.publishedAt,
        // Don't expose config in list view for performance
      })
      .from(agentTemplates)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // 6. Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(agentTemplates)
      .where(and(...conditions));

    const totalCount = countResult[0]?.count || 0;

    // 7. Get category statistics
    const categoryStats = await db
      .select({
        category: agentTemplates.category,
        count: count(),
      })
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true))
      .groupBy(agentTemplates.category);

    // 8. Get featured templates if not filtered
    const featuredTemplates = search || category || featured ? [] : await db
      .select({
        id: agentTemplates.id,
        name: agentTemplates.name,
        slug: agentTemplates.slug,
        shortDescription: agentTemplates.shortDescription,
        iconUrl: agentTemplates.iconUrl,
        badgeText: agentTemplates.badgeText,
        kpis: agentTemplates.kpis,
        installCount: agentTemplates.installCount,
        rating: agentTemplates.rating,
        reviewCount: agentTemplates.reviewCount,
      })
      .from(agentTemplates)
      .where(and(
        eq(agentTemplates.isPublished, true),
        eq(agentTemplates.isFeatured, true)
      ))
      .orderBy(desc(agentTemplates.trendingScore))
      .limit(6);

    return NextResponse.json({
      templates,
      featured: featuredTemplates,
      categories: categoryStats,
      total: totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + templates.length < totalCount,
      },
      metadata: {
        searchQuery: search,
        category,
        sortBy,
        totalCategories: categoryStats.length,
      },
    });
  } catch (error: any) {
    console.error("Marketplace API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace data", details: error.message },
      { status: 500 }
    );
  }
}