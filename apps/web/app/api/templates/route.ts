import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/templates
 * List available templates (stub for now - returns mock data)
 *
 * Query params:
 * - workspaceId: optional
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock templates for now - can be replaced with database query later
    const mockTemplates = [
      {
        id: "1",
        name: "Lead Enrichment Workflow",
        description:
          "Automatically enrich leads with data from multiple sources and score them",
        category: "workflow",
        type: "Sales",
        difficulty: "Beginner",
        rating: 4.8,
        downloads: 1250,
        author: "GalaxyCo Team",
        tags: ["Sales", "CRM", "Automation"],
      },
      {
        id: "2",
        name: "Customer Support Automation",
        description:
          "Route and respond to support tickets automatically using AI",
        category: "workflow",
        type: "Support",
        difficulty: "Intermediate",
        rating: 4.9,
        downloads: 2100,
        author: "GalaxyCo Team",
        tags: ["Support", "AI", "Automation"],
      },
      {
        id: "3",
        name: "Custom Agent Integration",
        description:
          "TypeScript template for building custom agent integrations",
        category: "code",
        type: "Development",
        difficulty: "Advanced",
        rating: 4.7,
        downloads: 850,
        author: "Community",
        tags: ["TypeScript", "SDK", "Integration"],
      },
    ];

    return NextResponse.json({
      templates: mockTemplates,
      total: mockTemplates.length,
    });
  } catch (error) {
    logger.error("List templates error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}
