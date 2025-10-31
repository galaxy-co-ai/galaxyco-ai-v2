import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { galaxyGrids, gridNodes, gridEdges } from "@galaxyco/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/studio/grids
 * Fetches all grids for a workspace
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    const grids = await db
      .select()
      .from(galaxyGrids)
      .where(eq(galaxyGrids.workspaceId, workspaceId))
      .orderBy(desc(galaxyGrids.updatedAt));

    logger.info("Fetched grids", {
      workspaceId,
      userId,
      count: grids.length,
    });

    return NextResponse.json({
      grids,
      count: grids.length,
    });
  } catch (error) {
    logger.error("Failed to fetch grids", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: "Failed to fetch grids",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/studio/grids
 * Creates a new grid
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, name, description } = body;

    if (!workspaceId || !name) {
      return NextResponse.json(
        { error: "Workspace ID and name are required" },
        { status: 400 },
      );
    }

    const gridId = nanoid();
    const [newGrid] = await db
      .insert(galaxyGrids)
      .values({
        id: gridId,
        workspaceId,
        name,
        description: description || null,
        status: "draft",
        version: 1,
        isTemplate: false,
        thumbnailUrl: null,
        tags: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        createdBy: userId,
      })
      .returning();

    logger.info("Created new grid", {
      gridId,
      workspaceId,
      userId,
    });

    return NextResponse.json({
      grid: newGrid,
      message: "Grid created successfully",
    });
  } catch (error) {
    logger.error("Failed to create grid", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: "Failed to create grid",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
