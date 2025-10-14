import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { enrichLead } from "@/src/trigger/lead-intel-agent";

/**
 * Lead Enrichment API Endpoint
 * POST /api/leads/enrich
 * 
 * Authenticates user, validates request, and triggers lead enrichment job
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { companyDomain, companyName, contactName, workspaceId } = body;

    // Validate required fields
    if (!companyDomain) {
      return NextResponse.json(
        { error: "companyDomain is required" },
        { status: 400 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    // Validate domain format (basic check)
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(companyDomain)) {
      return NextResponse.json(
        { error: "Invalid domain format. Use format: example.com" },
        { status: 400 }
      );
    }

    console.log("🚀 Triggering lead enrichment job", {
      companyDomain,
      workspaceId,
      userId,
    });

    // Trigger the enrichment job
    const handle = await tasks.trigger<typeof enrichLead>(
      "enrich-lead",
      {
        companyDomain,
        companyName,
        contactName,
        workspaceId,
        userId,
      }
    );

    console.log("✅ Lead enrichment job triggered", {
      taskId: handle.id,
      companyDomain,
    });

    // Return job handle for client to track progress
    return NextResponse.json(
      {
        success: true,
        taskId: handle.id,
        status: "triggered",
        message: "Lead enrichment job started successfully",
        companyDomain,
        estimatedDuration: "10-30 seconds",
      },
      { status: 202 } // Accepted - processing started
    );

  } catch (error) {
    console.error("❌ Lead enrichment API error:", error);

    // Handle specific Trigger.dev errors
    if (error instanceof Error) {
      if (error.message.includes("Invalid API key")) {
        return NextResponse.json(
          { error: "Service configuration error - please try again later" },
          { status: 503 }
        );
      }

      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable - please try again in a few minutes" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to start lead enrichment",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET method to retrieve job status
 * GET /api/leads/enrich?taskId=<id>
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId parameter is required" },
        { status: 400 }
      );
    }

    // Get task status from Trigger.dev
    const run = await runs.retrieve(taskId);

    return NextResponse.json({
      taskId: run.id,
      status: run.status,
      isCompleted: run.isCompleted,
      isSuccessful: run.isSuccess,
      output: run.output,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
    });

  } catch (error) {
    console.error("❌ Failed to retrieve task status:", error);
    return NextResponse.json(
      { error: "Failed to retrieve job status" },
      { status: 500 }
    );
  }
}