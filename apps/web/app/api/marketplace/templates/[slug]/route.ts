import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database/client';
import { agentTemplates } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/marketplace/templates/[slug]
 * 
 * Returns full template details including config, description, etc.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Template slug is required' },
        { status: 400 }
      );
    }

    // Fetch template by slug
    const [template] = await db
      .select()
      .from(agentTemplates)
      .where(
        and(
          eq(agentTemplates.slug, slug),
          eq(agentTemplates.isPublished, true)
        )
      )
      .limit(1);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Transform rating from 0-500 to 0-5 for client
    const transformedTemplate = {
      ...template,
      rating: template.rating ? template.rating / 100 : 0,
    };

    // Get similar templates (same category, excluding current)
    const similarTemplates = await db
      .select({
        id: agentTemplates.id,
        name: agentTemplates.name,
        slug: agentTemplates.slug,
        shortDescription: agentTemplates.shortDescription,
        category: agentTemplates.category,
        iconUrl: agentTemplates.iconUrl,
        rating: agentTemplates.rating,
        installCount: agentTemplates.installCount,
      })
      .from(agentTemplates)
      .where(
        and(
          eq(agentTemplates.category, template.category),
          eq(agentTemplates.isPublished, true)
        )
      )
      .limit(4);

    // Exclude current template and transform ratings
    const filteredSimilar = similarTemplates
      .filter(t => t.slug !== slug)
      .slice(0, 3)
      .map(t => ({
        ...t,
        rating: t.rating ? t.rating / 100 : 0,
      }));

    return NextResponse.json({
      template: transformedTemplate,
      similarTemplates: filteredSimilar,
    });
  } catch (error) {
    console.error('Error fetching template details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template details' },
      { status: 500 }
    );
  }
}
