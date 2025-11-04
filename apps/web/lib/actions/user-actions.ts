/**
 * Server Actions for User Profile & Preferences
 *
 * Next.js 15 best practice: Use Server Actions instead of API routes for mutations
 */

'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users, aiUserPreferences } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

const UpdatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .optional(),
  language: z.string().optional(),
});

const UpdateAIPreferencesSchema = z.object({
  communicationStyle: z.enum(['concise', 'detailed', 'balanced']).optional(),
  defaultModel: z.string().optional(),
  enableRag: z.boolean().optional(),
  enableProactiveInsights: z.boolean().optional(),
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
    console.error('[User Action Error]', error);

    if (error.message.includes('not found')) {
      return 'User not found';
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
 * Get current user profile
 */
export async function getCurrentUserProfile() {
  try {
    const clerkUserId = await getCurrentUser();
    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get user from database
    const [dbUser] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    // Get Clerk user for up-to-date info
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    // Combine data
    const profile = {
      id: dbUser?.id || '',
      email: clerkUser.emailAddresses[0]?.emailAddress || dbUser?.email || '',
      firstName: clerkUser.firstName || dbUser?.firstName || '',
      lastName: clerkUser.lastName || dbUser?.lastName || '',
      avatarUrl: clerkUser.imageUrl || dbUser?.avatarUrl || '',
      preferences: dbUser?.preferences || {},
      createdAt: dbUser?.createdAt || new Date(),
      lastLoginAt: dbUser?.lastLoginAt || null,
    };

    return { success: true, profile };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: z.infer<typeof UpdateProfileSchema>) {
  try {
    const validated = UpdateProfileSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in' };
    }

    // Update in Clerk (source of truth for profile data)
    const client = await clerkClient();
    await client.users.updateUser(clerkUserId, {
      ...(validated.firstName && { firstName: validated.firstName }),
      ...(validated.lastName && { lastName: validated.lastName }),
    });

    // Update in database
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(validated.firstName && { firstName: validated.firstName }),
        ...(validated.lastName && { lastName: validated.lastName }),
        ...(validated.avatarUrl && { avatarUrl: validated.avatarUrl }),
        updatedAt: new Date(),
      })
      .where(eq(users.clerkUserId, clerkUserId))
      .returning();

    revalidatePath('/settings/profile');

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(data: z.infer<typeof UpdatePreferencesSchema>) {
  try {
    const validated = UpdatePreferencesSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get current preferences
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    const currentPreferences = (user?.preferences as any) || {};

    // Merge preferences
    const newPreferences = {
      ...currentPreferences,
      ...(validated.theme && { theme: validated.theme }),
      ...(validated.notifications && {
        notifications: {
          ...(currentPreferences.notifications || {}),
          ...validated.notifications,
        },
      }),
      ...(validated.language && { language: validated.language }),
    };

    // Update in database
    const [updatedUser] = await db
      .update(users)
      .set({
        preferences: newPreferences,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkUserId, clerkUserId))
      .returning();

    revalidatePath('/settings/preferences');

    return {
      success: true,
      preferences: updatedUser.preferences,
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Update AI assistant preferences
 */
export async function updateAIPreferences(
  workspaceId: string,
  data: z.infer<typeof UpdateAIPreferencesSchema>,
) {
  try {
    const validated = UpdateAIPreferencesSchema.parse(data);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get user ID from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if preferences exist
    const [existing] = await db
      .select()
      .from(aiUserPreferences)
      .where(eq(aiUserPreferences.userId, user.id));

    if (existing) {
      // Update existing preferences
      const [updated] = await db
        .update(aiUserPreferences)
        .set({
          ...(validated.communicationStyle && { communicationStyle: validated.communicationStyle }),
          ...(validated.defaultModel && { defaultModel: validated.defaultModel }),
          ...(validated.enableRag !== undefined && { enableRag: validated.enableRag }),
          ...(validated.enableProactiveInsights !== undefined && {
            enableProactiveInsights: validated.enableProactiveInsights,
          }),
          updatedAt: new Date(),
        })
        .where(eq(aiUserPreferences.id, existing.id))
        .returning();

      return {
        success: true,
        preferences: updated,
      };
    } else {
      // Create new preferences
      const [created] = await db
        .insert(aiUserPreferences)
        .values({
          workspaceId,
          userId: user.id,
          communicationStyle: validated.communicationStyle || 'balanced',
          defaultModel: validated.defaultModel || 'gpt-4',
          enableRag: validated.enableRag ?? true,
          enableProactiveInsights: validated.enableProactiveInsights ?? true,
        })
        .returning();

      return {
        success: true,
        preferences: created,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}

/**
 * Get AI assistant preferences
 */
export async function getAIPreferences(workspaceId: string) {
  try {
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in' };
    }

    // Get user ID from database
    const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId));

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Get preferences
    const [preferences] = await db
      .select()
      .from(aiUserPreferences)
      .where(eq(aiUserPreferences.userId, user.id));

    return {
      success: true,
      preferences: preferences || {
        communicationStyle: 'balanced',
        defaultModel: 'gpt-4',
        enableRag: true,
        enableProactiveInsights: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
