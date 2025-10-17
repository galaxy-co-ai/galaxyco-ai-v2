"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db, workspaces, workspaceMembers, users } from "@galaxyco/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  generateSlug,
  validateWorkspaceName,
  validateSlug,
} from "../workspace-utils";
import { logger } from "@/lib/utils/logger";

/**
 * Create a new workspace for the authenticated user
 */
export async function createWorkspace(formData: FormData) {
  // 1. Verify user is authenticated
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return {
      success: false,
      error: "You must be signed in to create a workspace",
    };
  }

  // 2. Get or create user in database
  let user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  // If user doesn't exist (webhook didn't fire yet), create them now
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Unable to fetch user information" };
    }

    const [newUser] = await db
      .insert(users)
      .values({
        clerkUserId: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || null,
        lastName: clerkUser.lastName || null,
        avatarUrl: clerkUser.imageUrl || null,
        lastLoginAt: new Date(),
      })
      .returning();

    user = newUser;
  }

  // 3. Validate workspace name
  const name = formData.get("name") as string;
  const nameValidation = validateWorkspaceName(name);
  if (!nameValidation.valid) {
    return { success: false, error: nameValidation.error };
  }

  // 4. Generate and validate slug
  const slug = generateSlug(name);
  const slugValidation = validateSlug(slug);
  if (!slugValidation.valid) {
    return { success: false, error: slugValidation.error };
  }

  // 5. Check if slug is already taken
  const existingWorkspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });

  if (!user) {
    return { success: false, error: "User not found in database" };
  }

  if (existingWorkspace) {
    // Add a random suffix to make it unique
    const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    return await createWorkspaceWithSlug(name, uniqueSlug, user.id);
  }

  return await createWorkspaceWithSlug(name, slug, user.id);
}

/**
 * Helper function to create workspace with a specific slug
 */
async function createWorkspaceWithSlug(
  name: string,
  slug: string,
  userId: string,
) {
  try {
    // Create workspace
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name,
        slug,
        clerkOrganizationId: null, // For personal workspaces
        subscriptionTier: "free",
        subscriptionStatus: "active",
        isActive: true,
      })
      .returning();

    // Add user as workspace owner
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: userId,
      role: "owner",
      isActive: true,
      permissions: {
        agents: { create: true, edit: true, delete: true, execute: true },
        packs: { install: true, uninstall: true },
        billing: { view: true, manage: true },
        members: { invite: true, remove: true, changeRole: true },
      },
    });

    logger.info("Workspace created successfully", {
      workspaceName: workspace.name,
      workspaceSlug: workspace.slug,
      workspaceId: workspace.id,
    });

    // Revalidate and redirect
    revalidatePath("/dashboard");
    redirect(`/dashboard?workspace=${workspace.id}`);
  } catch (error) {
    logger.error("Failed to create workspace", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      error: "Failed to create workspace. Please try again.",
    };
  }
}

/**
 * Get all workspaces for the authenticated user
 */
export async function getUserWorkspaces() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return [];
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
    with: {
      workspaceMembers: {
        with: {
          workspace: true,
        },
        where: eq(workspaceMembers.isActive, true),
      },
    },
  });

  if (!user) {
    return [];
  }

  return user.workspaceMembers.map((member) => ({
    id: member.workspace.id,
    name: member.workspace.name,
    slug: member.workspace.slug,
    role: member.role,
    joinedAt: member.joinedAt,
  }));
}
