import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  workspaces, 
  workspaceMembers, 
  users 
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Workspace Settings API Route
 * 
 * GET: Get current workspace settings
 * PUT: Update workspace settings
 * 
 * Handles workspace configuration, branding, features, and subscription settings.
 * Only workspace owners and admins can modify workspace settings.
 */

/**
 * GET /api/settings/workspace
 * Get current workspace settings
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace and check permissions
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
      with: {
        workspace: {
          columns: {
            id: true,
            name: true,
            slug: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            settings: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} settings without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Return workspace settings (sensitive data like API keys excluded)
    const workspace = membership.workspace;
    return NextResponse.json({
      ...workspace,
      userRole: membership.role,
      userPermissions: membership.permissions,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Workspace settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace settings", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/workspace
 * Update workspace settings
 */
export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has admin/owner access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
      with: {
        workspace: true,
      },
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} settings without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // Check if user has permission to modify workspace settings
    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions to modify workspace settings" },
        { status: 403 }
      );
    }

    // 5. Parse and validate request body
    const body = await request.json();
    const {
      name,
      slug,
      settings,
    } = body;

    // Validate workspace name
    if (name !== undefined && (!name?.trim() || name.trim().length < 3)) {
      return NextResponse.json(
        { error: "Workspace name must be at least 3 characters long" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (slug !== undefined) {
      if (!slug?.trim()) {
        return NextResponse.json(
          { error: "Workspace slug is required" },
          { status: 400 }
        );
      }
      
      // Check slug format (alphanumeric and hyphens only)
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug.trim())) {
        return NextResponse.json(
          { error: "Workspace slug can only contain lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      // Check if slug is already taken by another workspace
      if (slug.trim() !== membership.workspace.slug) {
        const existingWorkspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.slug, slug.trim()),
        });

        if (existingWorkspace) {
          return NextResponse.json(
            { error: "Workspace slug is already taken" },
            { status: 409 }
          );
        }
      }
    }

    // Validate settings if provided
    if (settings && typeof settings !== 'object') {
      return NextResponse.json(
        { error: "Settings must be a valid object" },
        { status: 400 }
      );
    }

    // 6. Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (slug !== undefined) {
      updateData.slug = slug.trim().toLowerCase();
    }
    if (settings !== undefined) {
      // Merge with existing settings to avoid overwriting unrelated settings
      updateData.settings = {
        ...membership.workspace.settings,
        ...settings,
      };
    }

    // 7. Update workspace
    const [updatedWorkspace] = await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.id, requestedWorkspaceId))
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        subscriptionTier: workspaces.subscriptionTier,
        subscriptionStatus: workspaces.subscriptionStatus,
        settings: workspaces.settings,
        isActive: workspaces.isActive,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      });

    // 8. Return updated workspace
    return NextResponse.json({
      ...updatedWorkspace,
      userRole: membership.role,
      userPermissions: membership.permissions,
      createdAt: updatedWorkspace.createdAt.toISOString(),
      updatedAt: updatedWorkspace.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Workspace settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update workspace settings", details: error.message },
      { status: 500 }
    );
  }
}