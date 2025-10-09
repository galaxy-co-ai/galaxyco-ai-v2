import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database/client';
import { agentTemplates } from '@galaxyco/database/schema';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/marketplace/categories
 * 
 * Returns list of categories with template counts
 */
export async function GET() {
  try {
    // Get category counts
    const categories = await db
      .select({
        category: agentTemplates.category,
        count: sql<number>`count(*)`,
      })
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true))
      .groupBy(agentTemplates.category);

    // Get total count
    const [{ total }] = await db
      .select({
        total: sql<number>`count(*)`,
      })
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true));

    // Sort by count descending
    const sortedCategories = categories.sort((a, b) => b.count - a.count);

    // Add "All" category at the beginning
    const allCategories = [
      { category: 'All', count: total },
      ...sortedCategories,
    ];

    return NextResponse.json({
      categories: allCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
