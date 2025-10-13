import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  agents, 
  users, 
  workspaceMembers, 
  knowledgeItems,
  knowledgeCollections 
} from "@galaxyco/database/schema";
import { eq, and, count, desc, gte, sql } from "drizzle-orm";

/**
 * Dashboard Stats API Route
 * 
 * GET: Get workspace statistics for dashboard
 * 
 * Returns key metrics like agent counts, knowledge items, recent activity, etc.
 * All data is scoped to the user's current workspace for tenant isolation.
 */

interface DashboardStats {
  agents: {
    total: number;
    active: number;
    draft: number;
    paused: number;
  };
  knowledge: {
    totalItems: number;
    totalCollections: number;
    recentUploads: number; // Last 7 days
  };
  workspace: {
    memberCount: number;
    planType: string;
    storageUsed?: number;
  };
  recent: {
    recentAgents: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      createdAt: string;
    }>;
    recentKnowledge: Array<{
      id: string;
      title: string;
      type: string;
      createdAt: string;
    }>;
  };
}

/**
 * GET /api/dashboard/stats
 * Get comprehensive dashboard statistics
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

    // 3. Get workspace ID from query params or header
    const searchParams = request.nextUrl.searchParams;
    const requestedWorkspaceId = 
      request.headers.get("x-workspace-id") || 
      searchParams.get("workspaceId");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
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
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} stats without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Get agent statistics
    const agentStats = await db
      .select({
        status: agents.status,
        count: count(),
      })
      .from(agents)
      .where(eq(agents.workspaceId, requestedWorkspaceId))
      .groupBy(agents.status);

    const agentCounts = {
      total: 0,
      active: 0,
      draft: 0,
      paused: 0,
    };

    agentStats.forEach(stat => {
      agentCounts.total += stat.count;
      if (stat.status in agentCounts) {
        (agentCounts as any)[stat.status] = stat.count;
      }
    });

    // 6. Get knowledge statistics
    const knowledgeItemCount = await db
      .select({ count: count() })
      .from(knowledgeItems)
      .where(eq(knowledgeItems.workspaceId, requestedWorkspaceId));

    const knowledgeCollectionCount = await db
      .select({ count: count() })
      .from(knowledgeCollections)
      .where(eq(knowledgeCollections.workspaceId, requestedWorkspaceId));

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentKnowledgeCount = await db
      .select({ count: count() })
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.workspaceId, requestedWorkspaceId),
        gte(knowledgeItems.createdAt, sevenDaysAgo)
      ));

    // 7. Get workspace member count
    const memberCount = await db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.isActive, true)
      ));

    // 8. Get recent agents (last 5)
    const recentAgents = await db
      .select({
        id: agents.id,
        name: agents.name,
        type: agents.type,
        status: agents.status,
        createdAt: agents.createdAt,
      })
      .from(agents)
      .where(eq(agents.workspaceId, requestedWorkspaceId))
      .orderBy(desc(agents.createdAt))
      .limit(5);

    // 9. Get recent knowledge items (last 5)
    const recentKnowledge = await db
      .select({
        id: knowledgeItems.id,
        title: knowledgeItems.title,
        type: knowledgeItems.type,
        createdAt: knowledgeItems.createdAt,
      })
      .from(knowledgeItems)
      .where(eq(knowledgeItems.workspaceId, requestedWorkspaceId))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(5);

    // 10. Build response
    const stats: DashboardStats = {
      agents: agentCounts,
      knowledge: {
        totalItems: knowledgeItemCount[0]?.count || 0,
        totalCollections: knowledgeCollectionCount[0]?.count || 0,
        recentUploads: recentKnowledgeCount[0]?.count || 0,
      },
      workspace: {
        memberCount: memberCount[0]?.count || 0,
        planType: membership.workspace.subscriptionTier || 'free',
        // TODO: Calculate storage used from knowledge items
      },
      recent: {
        recentAgents: recentAgents.map(agent => ({
          ...agent,
          createdAt: agent.createdAt.toISOString(),
        })),
        recentKnowledge: recentKnowledge.map(item => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
      },
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: error.message },
      { status: 500 }
    );
  }
}