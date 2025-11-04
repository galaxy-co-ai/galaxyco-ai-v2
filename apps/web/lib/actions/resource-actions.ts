/**
 * Server Actions for Resource Library
 *
 * Manages knowledge items (documents, links, resources)
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { knowledgeItems, users } from '@galaxyco/database/schema';
import { eq, and, desc, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const CreateResourceSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(255),
  type: z.enum(['document', 'url', 'image', 'text']),
  sourceUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  collectionId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

const UpdateResourceSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  summary: z.string().optional(),
  collectionId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

const SearchResourcesSchema = z.object({
  workspaceId: z.string().uuid(),
  query: z.string().optional(),
  type: z.enum(['document', 'url', 'image', 'text']).optional(),
  collectionId: z.string().uuid().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
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
    console.error('[Resource Action Error]', error);

    if (error.message.includes('unique constraint')) {
      return 'A resource with that title already exists';
    }
    if (error.message.includes('not found')) {
      return 'Resource not found';
    }
    if (error.message.includes('permission')) {
      return "You don't have permission to perform this action";
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create a new resource
 */
export async function createResource(data: z.infer<typeof CreateResourceSchema>) {
  try {
    const validated = CreateResourceSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to create resources' };
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const [resource] = await db
      .insert(knowledgeItems)
      .values({
        workspaceId: validated.workspaceId,
        title: validated.title,
        type: validated.type,
        sourceUrl: validated.sourceUrl || null,
        fileName: validated.fileName || null,
        fileSize: validated.fileSize || null,
        mimeType: validated.mimeType || null,
        content: validated.content || null,
        summary: validated.summary || null,
        status: 'ready',
        collectionId: validated.collectionId || null,
        tags: validated.tags || [],
        metadata: validated.metadata || {},
        createdBy: user.id,
        isFavorite: false,
        isArchived: false,
      })
      .returning();

    revalidatePath('/library/resources');

    return {
      success: true,
      resource: {
        id: resource.id,
        title: resource.title,
        type: resource.type,
        createdAt: resource.createdAt,
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
 * Update a resource
 */
export async function updateResource(data: z.infer<typeof UpdateResourceSchema>) {
  try {
    const validated = UpdateResourceSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to update resources' };
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const [resource] = await db
      .update(knowledgeItems)
      .set({
        ...(validated.title && { title: validated.title }),
        ...(validated.summary !== undefined && { summary: validated.summary }),
        ...(validated.collectionId !== undefined && { collectionId: validated.collectionId }),
        ...(validated.tags && { tags: validated.tags }),
        ...(validated.isFavorite !== undefined && { isFavorite: validated.isFavorite }),
        ...(validated.isArchived !== undefined && { isArchived: validated.isArchived }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(knowledgeItems.id, validated.id),
          eq(knowledgeItems.workspaceId, validated.workspaceId), // Multi-tenant isolation
        ),
      )
      .returning();

    if (!resource) {
      return {
        success: false,
        error: "Resource not found or you don't have permission to update it",
      };
    }

    revalidatePath('/library/resources');
    revalidatePath(`/library/resources/${validated.id}`);

    return {
      success: true,
      resource,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Delete a resource
 */
export async function deleteResource(resourceId: string, workspaceId: string) {
  try {
    z.string().uuid().parse(resourceId);
    z.string().uuid().parse(workspaceId);

    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to delete resources' };
    }

    const result = await db
      .delete(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.id, resourceId),
          eq(knowledgeItems.workspaceId, workspaceId), // Multi-tenant isolation
        ),
      )
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: "Resource not found or you don't have permission to delete it",
      };
    }

    revalidatePath('/library/resources');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Search resources
 */
export async function searchResources(params: z.infer<typeof SearchResourcesSchema>) {
  try {
    const validated = SearchResourcesSchema.parse(params);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to search resources' };
    }

    // Build query with multi-tenant isolation
    const conditions = [eq(knowledgeItems.workspaceId, validated.workspaceId)];

    if (validated.type) {
      conditions.push(eq(knowledgeItems.type, validated.type));
    }

    if (validated.collectionId) {
      conditions.push(eq(knowledgeItems.collectionId, validated.collectionId));
    }

    if (validated.isFavorite !== undefined) {
      conditions.push(eq(knowledgeItems.isFavorite, validated.isFavorite));
    }

    if (validated.isArchived !== undefined) {
      conditions.push(eq(knowledgeItems.isArchived, validated.isArchived));
    }

    if (validated.query) {
      conditions.push(
        or(
          like(knowledgeItems.title, `%${validated.query}%`)!,
          like(knowledgeItems.content, `%${validated.query}%`)!,
        )!,
      );
    }

    const resources = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(validated.limit || 50)
      .offset(validated.offset || 0);

    const totalResources = await db
      .select()
      .from(knowledgeItems)
      .where(and(...conditions));

    return {
      success: true,
      resources,
      total: totalResources.length,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
