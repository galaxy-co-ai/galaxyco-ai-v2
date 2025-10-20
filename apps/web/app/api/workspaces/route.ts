import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { workspaceMembers, users, workspaces } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/workspaces
 * List all workspaces for the authenticated user
 */
export async function GET() {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. First find the user by clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Fetch user's workspaces through memberships
    const memberships = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, user.id),
      with: {
        workspace: true,
      },
    });

    // 4. Transform to workspace format expected by frontend
    const workspaces = memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
    }));

    return NextResponse.json(workspaces);
  } catch (error) {
    logger.error("[API] List workspaces error", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace and link the user as owner
 */
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, userEmail, userFirstName, userLastName } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // 1. Create or update user
    let user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId,
          email: userEmail || "user@example.com",
          firstName: userFirstName || "User",
          lastName: userLastName || "",
        })
        .returning();
      user = newUser;
    }

    // 2. Check if workspace with this slug exists
    const existingWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });

    if (existingWorkspace) {
      return NextResponse.json(
        { error: "A workspace with this name already exists" },
        { status: 400 },
      );
    }

    // 3. Create workspace
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name: name.trim(),
        slug,
        subscriptionTier: "professional",
        subscriptionStatus: "active",
        settings: {
          branding: {
            primaryColor: "#6366f1",
          },
        },
      })
      .returning();

    // 4. Link user to workspace as owner
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: user.id,
      role: "owner",
    });

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
    });
  } catch (error) {
    logger.error("[API] Create workspace error", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
}
