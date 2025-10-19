import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/workflows
 * List all workflows for the current workspace
 *
 * Query params:
 * - workspaceId: string (required)
 * - status?: 'active' | 'draft' | 'paused' | 'archived'
 * - limit?: number
 * - offset?: number
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 },
      );
    }

    // TODO: Replace with real DB query once workflows table exists
    // For now, return stub data with proper structure
    const stubWorkflows = [
      {
        id: "workflow_1",
        workspaceId,
        name: "Lead Qualification Pipeline",
        description:
          "End-to-end prospect research, email outreach, and CRM sync",
        status: "active",
        steps: [
          {
            id: "step_1",
            type: "research",
            name: "Research Prospect",
            config: { sources: ["linkedin", "company-website", "news"] },
          },
          {
            id: "step_2",
            type: "email",
            name: "Send Outreach Email",
            config: { template: "cold-outreach", delay: 0 },
          },
          {
            id: "step_3",
            type: "crm",
            name: "Sync to CRM",
            config: { crmProvider: "hubspot", action: "create-or-update" },
          },
        ],
        metrics: {
          totalExecutions: 156,
          successfulExecutions: 142,
          failedExecutions: 14,
          lastExecutedAt: new Date(
            Date.now() - 2 * 60 * 60 * 1000,
          ).toISOString(),
        },
        createdBy: clerkUserId,
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "workflow_2",
        workspaceId,
        name: "Customer Onboarding",
        description:
          "Automated customer onboarding workflow with welcome emails and setup tasks",
        status: "active",
        steps: [
          {
            id: "step_1",
            type: "email",
            name: "Send Welcome Email",
            config: { template: "welcome", delay: 0 },
          },
          {
            id: "step_2",
            type: "task",
            name: "Create Onboarding Tasks",
            config: { tasks: ["setup-account", "configure-settings"] },
          },
          {
            id: "step_3",
            type: "notification",
            name: "Notify Team",
            config: { channels: ["slack", "email"] },
          },
        ],
        metrics: {
          totalExecutions: 89,
          successfulExecutions: 84,
          failedExecutions: 5,
          lastExecutedAt: new Date(
            Date.now() - 5 * 60 * 60 * 1000,
          ).toISOString(),
        },
        createdBy: clerkUserId,
        createdAt: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "workflow_3",
        workspaceId,
        name: "Monthly Report Generation",
        description:
          "Generate and distribute monthly analytics reports to stakeholders",
        status: "draft",
        steps: [
          {
            id: "step_1",
            type: "data",
            name: "Aggregate Data",
            config: {
              timeRange: "30d",
              metrics: ["revenue", "users", "engagement"],
            },
          },
          {
            id: "step_2",
            type: "report",
            name: "Generate Report",
            config: { format: "pdf", template: "monthly-summary" },
          },
          {
            id: "step_3",
            type: "email",
            name: "Distribute Report",
            config: { recipients: ["stakeholders"], attachReport: true },
          },
        ],
        metrics: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          lastExecutedAt: null,
        },
        createdBy: clerkUserId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Filter by status if provided
    let workflows = stubWorkflows;
    if (status) {
      workflows = workflows.filter((w) => w.status === status);
    }

    // Apply pagination
    const paginatedWorkflows = workflows.slice(offset, offset + limit);

    return NextResponse.json({
      workflows: paginatedWorkflows,
      total: workflows.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Workflows API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch workflows",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
 *
 * NOTE: Stub implementation - will need workflows table in database
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, name, description, steps } = body;

    if (!workspaceId || !name || !steps) {
      return NextResponse.json(
        { error: "workspaceId, name, and steps are required" },
        { status: 400 },
      );
    }

    // TODO: Insert into database once workflows table exists
    const newWorkflow = {
      id: `workflow_${Date.now()}`,
      workspaceId,
      name,
      description: description || "",
      status: "draft",
      steps,
      metrics: {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        lastExecutedAt: null,
      },
      createdBy: clerkUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      workflow: newWorkflow,
    });
  } catch (error) {
    console.error("Create workflow error:", error);
    return NextResponse.json(
      {
        error: "Failed to create workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
