import { NextRequest, NextResponse } from "next/server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { enrichLead } from "@/src/trigger/lead-intel-agent";

/**
 * Test Lead Enrichment API Endpoint (No Authentication Required)
 * POST /api/test-lead-enrichment
 * 
 * Simplified endpoint for testing the Lead Intel Agent without Clerk authentication
 * Used by the /test-enrichment UI page for demonstration purposes
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { companyDomain, companyName, contactName } = body;

    // Validate required fields
    if (!companyDomain) {
      return NextResponse.json(
        { 
          success: false,
          error: "companyDomain is required",
          example: "hubspot.com"
        },
        { status: 400 }
      );
    }

    // Validate domain format (basic check)
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(companyDomain)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid domain format. Use format: example.com",
          example: "salesforce.com"
        },
        { status: 400 }
      );
    }

    console.log("🧪 [TEST] Triggering lead enrichment job", {
      companyDomain,
      companyName,
      timestamp: new Date().toISOString(),
    });

    // Trigger the enrichment job with test workspace/user IDs
    const handle = await tasks.trigger<typeof enrichLead>(
      "enrich-lead",
      {
        companyDomain,
        companyName: companyName || companyDomain,
        contactName: contactName || "Test Contact",
        workspaceId: "test_workspace_123", // Test workspace ID
        userId: "test_user_456", // Test user ID
      }
    );

    console.log("✅ [TEST] Lead enrichment job triggered", {
      taskId: handle.id,
      companyDomain,
      timestamp: new Date().toISOString(),
    });

    // Return job handle for client to track progress
    return NextResponse.json(
      {
        success: true,
        taskId: handle.id,
        status: "triggered",
        message: "Test lead enrichment job started successfully",
        data: {
          companyDomain,
          companyName: companyName || companyDomain,
          contactName: contactName || "Test Contact",
        },
        metadata: {
          estimatedDuration: "10-30 seconds",
          environment: "test",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 202 } // Accepted - processing started
    );

  } catch (error) {
    console.error("❌ [TEST] Lead enrichment API error:", error);

    // Handle specific Trigger.dev errors
    if (error instanceof Error) {
      if (error.message.includes("Invalid API key") || error.message.includes("OPENAI_API_KEY")) {
        return NextResponse.json(
          { 
            success: false,
            error: "OpenAI API key not configured in Trigger.dev",
            troubleshooting: "Check https://cloud.trigger.dev/projects/v3/proj_kztbsnnuypnyibmslcvd/environment-variables"
          },
          { status: 503 }
        );
      }

      if (error.message.includes("GOOGLE_CUSTOM_SEARCH")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Google Custom Search API not configured (enrichment will work with limited data)",
            warning: "News search will be skipped but website scraping and AI analysis will continue"
          },
          { status: 206 } // Partial Content - will work with limited features
        );
      }

      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Rate limit exceeded - please wait a few minutes before trying again" 
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to start lead enrichment",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        troubleshooting: "Check Trigger.dev environment variables and API keys"
      },
      { status: 500 }
    );
  }
}

/**
 * GET method to retrieve job status (simplified for testing)
 * GET /api/test-lead-enrichment?taskId=<id>
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { 
          success: false,
          error: "taskId parameter is required",
          example: "/api/test-lead-enrichment?taskId=run_123abc"
        },
        { status: 400 }
      );
    }

    console.log("🔍 [TEST] Retrieving task status", { taskId });

    // Get task status from Trigger.dev
    const run = await runs.retrieve(taskId);

    console.log("📊 [TEST] Task status retrieved", {
      taskId: run.id,
      status: run.status,
      isCompleted: run.isCompleted,
        isSuccessful: run.isSuccess,
    });

    return NextResponse.json({
      success: true,
      task: {
        id: run.id,
        status: run.status,
        isCompleted: run.isCompleted,
        isSuccessful: run.isSuccess,
        output: run.output,
        createdAt: run.createdAt,
        updatedAt: run.updatedAt,
        finishedAt: run.finishedAt,
      },
      metadata: {
        environment: "test",
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error("❌ [TEST] Failed to retrieve task status:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to retrieve job status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}