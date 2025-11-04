/**
 * Server Actions for Workflows
 *
 * Next.js 15 best practice: Use Server Actions instead of API routes for mutations
 * These are type-safe, server-side functions that can be called from Client Components
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { galaxyGrids } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const WorkflowStatusSchema = z.enum(['draft', 'published', 'archived']);

const CreateWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(255),
  description: z.string().max(1000).optional(),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    })
    .optional(),
  status: WorkflowStatusSchema.optional(),
  isTemplate: z.boolean().optional(),
  templateCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const UpdateWorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    })
    .optional(),
  status: WorkflowStatusSchema.optional(),
  tags: z.array(z.string()).optional(),
});

const DeleteWorkflowSchema = z.object({
  id: z.string().uuid(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the current user's workspace ID
 *
 * CRITICAL: Always use this to enforce multi-tenant isolation
 */
async function getCurrentWorkspace(): Promise<{ userId: string; workspaceId: string } | null> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  // Get user's workspace (in a real app, this would come from workspace context)
  // For now, we'll use a default workspace ID pattern
  // TODO: Implement proper workspace resolution from Clerk organization
  const workspaceId = `ws_${clerkUserId}`;

  return {
    userId: clerkUserId,
    workspaceId,
  };
}

/**
 * Format error for user display
 * Never expose technical details to users
 */
function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    // Log technical error for debugging
    console.error('[Workflow Action Error]', error);

    // Return user-friendly message
    if (error.message.includes('unique constraint')) {
      return 'A workflow with that name already exists';
    }
    if (error.message.includes('not found')) {
      return 'Workflow not found';
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
 * Create a new workflow
 *
 * @returns { success: boolean, workflow?: Workflow, error?: string }
 */
export async function createWorkflow(data: z.infer<typeof CreateWorkflowSchema>) {
  try {
    // 1. Validate input
    const validated = CreateWorkflowSchema.parse(data);

    // 2. Check authentication & get workspace
    const auth = await getCurrentWorkspace();
    if (!auth) {
      return { success: false, error: 'You must be signed in to create workflows' };
    }

    // 3. Insert into database with workspace_id (multi-tenant isolation)
    const [workflow] = await db
      .insert(galaxyGrids)
      .values({
        workspaceId: auth.workspaceId,
        name: validated.name,
        description: validated.description || '',
        viewport: validated.viewport || { x: 0, y: 0, zoom: 1 },
        status: validated.status || 'draft',
        isTemplate: validated.isTemplate || false,
        templateCategory: validated.templateCategory,
        tags: validated.tags || [],
        createdBy: auth.userId,
        isPublic: false,
        version: 1,
      })
      .returning();

    // 4. Revalidate workflows page cache
    revalidatePath('/workflows');

    return {
      success: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        status: workflow.status,
        createdAt: workflow.createdAt,
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
 * Update an existing workflow
 *
 * @returns { success: boolean, workflow?: Workflow, error?: string }
 */
export async function updateWorkflow(data: z.infer<typeof UpdateWorkflowSchema>) {
  try {
    // 1. Validate input
    const validated = UpdateWorkflowSchema.parse(data);

    // 2. Check authentication & get workspace
    const auth = await getCurrentWorkspace();
    if (!auth) {
      return { success: false, error: 'You must be signed in to update workflows' };
    }

    // 3. Update in database (with workspace_id filtering for security)
    const [workflow] = await db
      .update(galaxyGrids)
      .set({
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.viewport && { viewport: validated.viewport }),
        ...(validated.status && { status: validated.status }),
        ...(validated.tags && { tags: validated.tags }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(galaxyGrids.id, validated.id),
          eq(galaxyGrids.workspaceId, auth.workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (!workflow) {
      return {
        success: false,
        error: "Workflow not found or you don't have permission to update it",
      };
    }

    // 4. Revalidate caches
    revalidatePath('/workflows');
    revalidatePath(`/workflows/${validated.id}`);

    return {
      success: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        status: workflow.status,
        updatedAt: workflow.updatedAt,
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
 * Delete a workflow
 *
 * @returns { success: boolean, error?: string }
 */
export async function deleteWorkflow(data: z.infer<typeof DeleteWorkflowSchema>) {
  try {
    // 1. Validate input
    const validated = DeleteWorkflowSchema.parse(data);

    // 2. Check authentication & get workspace
    const auth = await getCurrentWorkspace();
    if (!auth) {
      return { success: false, error: 'You must be signed in to delete workflows' };
    }

    // 3. Delete from database (with workspace_id filtering for security)
    const result = await db
      .delete(galaxyGrids)
      .where(
        and(
          eq(galaxyGrids.id, validated.id),
          eq(galaxyGrids.workspaceId, auth.workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: "Workflow not found or you don't have permission to delete it",
      };
    }

    // 4. Revalidate caches
    revalidatePath('/workflows');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Publish a workflow (change from draft to published)
 *
 * @returns { success: boolean, error?: string }
 */
export async function publishWorkflow(workflowId: string) {
  try {
    // Validate UUID
    z.string().uuid().parse(workflowId);

    const auth = await getCurrentWorkspace();
    if (!auth) {
      return { success: false, error: 'You must be signed in to publish workflows' };
    }

    const [workflow] = await db
      .update(galaxyGrids)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(galaxyGrids.id, workflowId),
          eq(galaxyGrids.workspaceId, auth.workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (!workflow) {
      return {
        success: false,
        error: "Workflow not found or you don't have permission to publish it",
      };
    }

    revalidatePath('/workflows');
    revalidatePath(`/workflows/${workflowId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Archive a workflow (soft delete)
 *
 * @returns { success: boolean, error?: string }
 */
export async function archiveWorkflow(workflowId: string) {
  try {
    z.string().uuid().parse(workflowId);

    const auth = await getCurrentWorkspace();
    if (!auth) {
      return { success: false, error: 'You must be signed in to archive workflows' };
    }

    const [workflow] = await db
      .update(galaxyGrids)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(galaxyGrids.id, workflowId),
          eq(galaxyGrids.workspaceId, auth.workspaceId), // CRITICAL: Multi-tenant isolation
        ),
      )
      .returning();

    if (!workflow) {
      return {
        success: false,
        error: "Workflow not found or you don't have permission to archive it",
      };
    }

    revalidatePath('/workflows');
    revalidatePath(`/workflows/${workflowId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
