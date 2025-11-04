/**
 * Server Actions for Agent Marketplace
 *
 * Enables discovery and installation of agent templates
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { agentTemplates, agents, users } from '@galaxyco/database/schema';
import { eq, desc, like, or, and, gte } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const SearchMarketplaceSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.enum(['popular', 'newest', 'rating', 'trending']).optional(),
});

const InstallAgentSchema = z.object({
  templateId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  customName: z.string().optional(),
});

const RateAgentSchema = z.object({
  templateId: z.string().uuid(),
  rating: z.number().min(1).max(5),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }
  return clerkUserId;
}

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    console.error('[Marketplace Action Error]', error);

    if (error.message.includes('not found')) {
      return 'Template not found';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// MARKETPLACE ACTIONS
// ============================================================================

/**
 * Search marketplace for agent templates
 */
export async function searchMarketplace(params: z.infer<typeof SearchMarketplaceSchema>) {
  try {
    const validated = SearchMarketplaceSchema.parse(params);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to browse the marketplace' };
    }

    // Build query
    const conditions: any[] = [eq(agentTemplates.isPublished, true)];

    if (validated.category) {
      conditions.push(eq(agentTemplates.category, validated.category));
    }

    if (validated.featured !== undefined) {
      conditions.push(eq(agentTemplates.isFeatured, validated.featured));
    }

    if (validated.query) {
      conditions.push(
        or(
          like(agentTemplates.name, `%${validated.query}%`),
          like(agentTemplates.description, `%${validated.query}%`),
        ),
      );
    }

    // Determine sort order
    let orderBy: any;
    switch (validated.sortBy) {
      case 'popular':
        orderBy = desc(agentTemplates.installCount);
        break;
      case 'newest':
        orderBy = desc(agentTemplates.createdAt);
        break;
      case 'rating':
        orderBy = desc(agentTemplates.rating);
        break;
      case 'trending':
        orderBy = desc(agentTemplates.trendingScore);
        break;
      default:
        orderBy = desc(agentTemplates.trendingScore);
    }

    const templates = await db
      .select()
      .from(agentTemplates)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(validated.limit || 50)
      .offset(validated.offset || 0);

    return {
      success: true,
      templates,
      total: templates.length,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get marketplace categories
 */
export async function getMarketplaceCategories() {
  try {
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view categories' };
    }

    // Get unique categories from published templates
    const templates = await db
      .select()
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true));

    const categoryCounts = templates.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));

    return {
      success: true,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get featured agents
 */
export async function getFeaturedAgents() {
  try {
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view featured agents' };
    }

    const featured = await db
      .select()
      .from(agentTemplates)
      .where(and(eq(agentTemplates.isPublished, true), eq(agentTemplates.isFeatured, true)))
      .orderBy(desc(agentTemplates.trendingScore))
      .limit(10);

    return {
      success: true,
      templates: featured,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Install agent template to workspace
 */
export async function installAgentTemplate(data: z.infer<typeof InstallAgentSchema>) {
  try {
    const validated = InstallAgentSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to install agents' };
    }

    // Get template
    const [template] = await db
      .select()
      .from(agentTemplates)
      .where(eq(agentTemplates.id, validated.templateId));

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Create agent from template
    const [installedAgent] = await db
      .insert(agents)
      .values({
        workspaceId: validated.workspaceId,
        name: validated.customName || template.name,
        description: template.description,
        type: template.type,
        status: 'draft',
        config: template.config,
        sourcePackId: template.id,
        isCustom: false,
        createdBy: user.id,
        version: '1.0.0',
      })
      .returning();

    // Increment install count
    await db
      .update(agentTemplates)
      .set({
        installCount: (template.installCount || 0) + 1,
        installs24h: (template.installs24h || 0) + 1,
        installs7d: (template.installs7d || 0) + 1,
        installs30d: (template.installs30d || 0) + 1,
        trendingScore: calculateTrendingScore({
          installs24h: (template.installs24h || 0) + 1,
          installs7d: (template.installs7d || 0) + 1,
          rating: template.rating || 0,
        }),
      })
      .where(eq(agentTemplates.id, template.id));

    revalidatePath('/marketplace');
    revalidatePath('/agents');

    return {
      success: true,
      agent: installedAgent,
      message: `${template.name} installed successfully!`,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Rate an agent template
 */
export async function rateAgentTemplate(data: z.infer<typeof RateAgentSchema>) {
  try {
    const validated = RateAgentSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to rate agents' };
    }

    // Get template
    const [template] = await db
      .select()
      .from(agentTemplates)
      .where(eq(agentTemplates.id, validated.templateId));

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    // Calculate new average rating
    const currentRating = template.rating || 0;
    const currentReviewCount = template.reviewCount || 0;
    const newRating = Math.round(
      (currentRating * currentReviewCount + validated.rating * 100) / (currentReviewCount + 1),
    );

    // Update rating
    await db
      .update(agentTemplates)
      .set({
        rating: newRating,
        reviewCount: currentReviewCount + 1,
        trendingScore: calculateTrendingScore({
          installs24h: template.installs24h || 0,
          installs7d: template.installs7d || 0,
          rating: newRating,
        }),
      })
      .where(eq(agentTemplates.id, template.id));

    revalidatePath('/marketplace');

    return {
      success: true,
      newRating: newRating / 100, // Convert back to 0-5 scale
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Calculate trending score
 *
 * Algorithm: Weighted by recency + rating
 * - Last 24h installs: 10x weight
 * - Last 7d installs: 3x weight
 * - Rating: 1x weight
 */
function calculateTrendingScore(metrics: {
  installs24h: number;
  installs7d: number;
  rating: number;
}): number {
  return metrics.installs24h * 10 + metrics.installs7d * 3 + (metrics.rating / 100) * 100;
}

/**
 * Get trending agents
 */
export async function getTrendingAgents(limit: number = 10) {
  try {
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to view trending agents' };
    }

    const trending = await db
      .select()
      .from(agentTemplates)
      .where(eq(agentTemplates.isPublished, true))
      .orderBy(desc(agentTemplates.trendingScore))
      .limit(limit);

    return {
      success: true,
      templates: trending,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
