/**
 * Server Actions for Workflow Templates
 *
 * Manages workflow templates for the marketplace/library
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { gridTemplates, users } from '@galaxyco/database/schema';
import { eq, and, desc, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url().optional(),
  previewData: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z
      .object({
        x: z.number(),
        y: z.number(),
        zoom: z.number(),
      })
      .optional(),
  }),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedTime: z.number().min(1).optional(), // in minutes
});

const UpdateTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url().optional(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedTime: z.number().min(1).optional(),
  featured: z.boolean().optional(),
});

const SearchTemplatesSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
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
    console.error('[Template Action Error]', error);

    if (error.message.includes('unique constraint')) {
      return 'A template with that name already exists';
    }
    if (error.message.includes('not found')) {
      return 'Template not found';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create a new workflow template
 */
export async function createTemplate(data: z.infer<typeof CreateTemplateSchema>) {
  try {
    const validated = CreateTemplateSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to create templates' };
    }

    const [template] = await db
      .insert(gridTemplates)
      .values({
        name: validated.name,
        description: validated.description || '',
        category: validated.category,
        tags: validated.tags || [],
        thumbnailUrl: validated.thumbnailUrl || null,
        previewData: validated.previewData,
        complexity: validated.complexity || 'beginner',
        estimatedTime: validated.estimatedTime || null,
        authorId: clerkUserId,
        uses: 0,
        rating: null,
        featured: false,
      })
      .returning();

    revalidatePath('/library/templates');

    return {
      success: true,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        createdAt: template.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Update a workflow template
 */
export async function updateTemplate(data: z.infer<typeof UpdateTemplateSchema>) {
  try {
    const validated = UpdateTemplateSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to update templates' };
    }

    // Check ownership
    const [existing] = await db
      .select()
      .from(gridTemplates)
      .where(eq(gridTemplates.id, validated.id));

    if (!existing) {
      return { success: false, error: 'Template not found' };
    }

    if (existing.authorId !== clerkUserId) {
      return { success: false, error: 'You can only update your own templates' };
    }

    const [template] = await db
      .update(gridTemplates)
      .set({
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.category && { category: validated.category }),
        ...(validated.tags && { tags: validated.tags }),
        ...(validated.thumbnailUrl !== undefined && { thumbnailUrl: validated.thumbnailUrl }),
        ...(validated.complexity && { complexity: validated.complexity }),
        ...(validated.estimatedTime !== undefined && { estimatedTime: validated.estimatedTime }),
        ...(validated.featured !== undefined && { featured: validated.featured }),
        updatedAt: new Date(),
      })
      .where(eq(gridTemplates.id, validated.id))
      .returning();

    revalidatePath('/library/templates');
    revalidatePath(`/library/templates/${validated.id}`);

    return {
      success: true,
      template,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Delete a workflow template
 */
export async function deleteTemplate(templateId: string) {
  try {
    z.string().uuid().parse(templateId);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to delete templates' };
    }

    // Check ownership
    const [existing] = await db
      .select()
      .from(gridTemplates)
      .where(eq(gridTemplates.id, templateId));

    if (!existing) {
      return { success: false, error: 'Template not found' };
    }

    if (existing.authorId !== clerkUserId) {
      return { success: false, error: 'You can only delete your own templates' };
    }

    await db.delete(gridTemplates).where(eq(gridTemplates.id, templateId));

    revalidatePath('/library/templates');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Search workflow templates
 */
export async function searchTemplates(params: z.infer<typeof SearchTemplatesSchema>) {
  try {
    const validated = SearchTemplatesSchema.parse(params);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to search templates' };
    }

    // Build query
    let query = db.select().from(gridTemplates).orderBy(desc(gridTemplates.uses));

    const conditions: any[] = [];

    if (validated.category) {
      conditions.push(eq(gridTemplates.category, validated.category));
    }

    if (validated.complexity) {
      conditions.push(eq(gridTemplates.complexity, validated.complexity));
    }

    if (validated.featured !== undefined) {
      conditions.push(eq(gridTemplates.featured, validated.featured));
    }

    if (validated.query) {
      const nameCondition = like(gridTemplates.name, `%${validated.query}%`);
      const descCondition = like(gridTemplates.description, `%${validated.query}%`);
      if (nameCondition && descCondition) {
        conditions.push(or(nameCondition, descCondition));
      }
    }

    let templates;
    if (conditions.length > 0) {
      templates = await db
        .select()
        .from(gridTemplates)
        .where(and(...conditions))
        .orderBy(desc(gridTemplates.uses))
        .limit(validated.limit || 50)
        .offset(validated.offset || 0);
    } else {
      templates = await db
        .select()
        .from(gridTemplates)
        .orderBy(desc(gridTemplates.uses))
        .limit(validated.limit || 50)
        .offset(validated.offset || 0);
    }

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
 * Increment template usage count
 */
export async function incrementTemplateUses(templateId: string) {
  try {
    z.string().uuid().parse(templateId);

    const [template] = await db
      .select()
      .from(gridTemplates)
      .where(eq(gridTemplates.id, templateId));

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    await db
      .update(gridTemplates)
      .set({
        uses: (template.uses || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(gridTemplates.id, templateId));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
