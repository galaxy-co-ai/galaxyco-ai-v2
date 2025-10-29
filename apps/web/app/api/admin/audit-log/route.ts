import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database";
import { eq, desc } from "drizzle-orm";
import { users, workspaces, workspaceMembers } from "@galaxyco/database/schema";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Helper to check if user is system admin
async function checkSystemAdmin(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      workspaceMembers: {
        limit: 1,
      },
    },
  });
  // Check if user has admin or owner role in any workspace
  // In a real system, you'd have a dedicated system admin flag
  return (
    user?.workspaceMembers?.some(
      (m) => m.role === "admin" || m.role === "owner",
    ) || false
  );
}

/**
 * GET /api/admin/audit-log
 * Fetch recent platform activity for admin dashboard
 * Query params: limit (default 10)
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await checkSystemAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // For now, generate synthetic activity from recent user logins and workspace creation
    // In the future, this should pull from a dedicated audit_log table
    const recentUsers = await db.query.users.findMany({
      orderBy: desc(users.lastLoginAt),
      limit: Math.ceil(limit / 2),
      with: {
        workspaceMembers: {
          with: {
            workspace: true,
          },
          limit: 1,
        },
      },
    });

    const recentWorkspaces = await db.query.workspaces.findMany({
      orderBy: desc(workspaces.createdAt),
      limit: Math.ceil(limit / 2),
      with: {
        members: {
          with: {
            user: true,
          },
          limit: 1,
        },
      },
    });

    const activities = [
      ...recentUsers
        .filter((u) => u.lastLoginAt)
        .map((u) => ({
          id: `user-login-${u.id}`,
          userId: u.id,
          userEmail: u.email,
          action: "User login",
          workspaceId: u.workspaceMembers[0]?.workspaceId || null,
          workspaceName: u.workspaceMembers[0]?.workspace?.name || null,
          createdAt: u.lastLoginAt!,
        })),
      ...recentWorkspaces.map((w) => ({
        id: `workspace-created-${w.id}`,
        userId: w.members[0]?.user?.id || "system",
        userEmail: w.members[0]?.user?.email || "system@galaxyco.ai",
        action: "Created workspace",
        workspaceId: w.id,
        workspaceName: w.name,
        createdAt: w.createdAt,
      })),
    ];

    // Sort by createdAt desc and limit
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json({
      activities: limitedActivities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Error fetching audit log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
