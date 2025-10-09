import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database/client';
import { agentTemplates } from '@galaxyco/database/schema';
import { eq, desc, asc, and, sql, like, or } from 'drizzle-orm';

/**
 * GET /api/marketplace/templates
 * 
 * Query params:
 * - category: Filter by category
 * - sort: popular | trending | newest | rating (default: popular)
 * - search: Search in name/description
 * - featured: true | false
 * - limit: Number of results (default: 20)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sort') || 'popular';
    const search = searchParams.get('search');
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build WHERE conditions
    const conditions = [];
    
    // Only published templates
    conditions.push(eq(agentTemplates.isPublished, true));
    
    // Category filter
    if (category && category !== 'All') {
      conditions.push(eq(agentTemplates.category, category));
    }
    
    // Featured filter
    if (featuredOnly) {
      conditions.push(eq(agentTemplates.isFeatured, true));
    }
    
    // Search filter
    if (search && search.trim()) {
      conditions.push(
        or(
          like(agentTemplates.name, `%${search}%`),
          like(agentTemplates.description, `%${search}%`),
          like(agentTemplates.shortDescription, `%${search}%`)
        )!
      );
    }

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'trending':
        orderBy = desc(agentTemplates.trendingScore);
        break;
      case 'newest':
        orderBy = desc(agentTemplates.publishedAt);
        break;
      case 'rating':
        orderBy = desc(agentTemplates.rating);
        break;
      case 'popular':
      default:
        orderBy = desc(agentTemplates.installCount);
        break;
    }

    // Execute query
    const templates = await db
      .select({
        id: agentTemplates.id,
        name: agentTemplates.name,
        slug: agentTemplates.slug,
        shortDescription: agentTemplates.shortDescription,
        category: agentTemplates.category,
        type: agentTemplates.type,
        iconUrl: agentTemplates.iconUrl,
        badgeText: agentTemplates.badgeText,
        kpis: agentTemplates.kpis,
        tags: agentTemplates.tags,
        installCount: agentTemplates.installCount,
        rating: agentTemplates.rating,
        reviewCount: agentTemplates.reviewCount,
        installs24h: agentTemplates.installs24h,
        isFeatured: agentTemplates.isFeatured,
      })
      .from(agentTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Transform rating from 0-500 to 0-5 for client
    const transformedTemplates = templates.map((template) => ({
      ...template,
      rating: template.rating ? template.rating / 100 : 0,
    }));

    return NextResponse.json({
      templates: transformedTemplates,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
