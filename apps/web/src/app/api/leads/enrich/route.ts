import { NextRequest, NextResponse } from "next/server";
import { enrichLeadCore } from "@/trigger/lead-intel-agent";
import { auth } from "@clerk/nextjs";

/**
 * POST /api/leads/enrich
 * 
 * Enriches a lead with company intelligence
 * 
 * Body:
 * {
 *   "companyDomain": "stripe.com",
 *   "companyName": "Stripe" (optional),
 *   "contactName": "John Doe" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const { userId, orgId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "No organization found - Please select an organization" },
        { status: 403 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body - Must be valid JSON" },
        { status: 400 }
      );
    }

    const { companyDomain, companyName, contactName } = body;

    if (!companyDomain || typeof companyDomain !== "string") {
      return NextResponse.json(
        {
          error: "Missing required field: companyDomain",
          example: { companyDomain: "example.com" },
        },
        { status: 400 }
      );
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(companyDomain)) {
      return NextResponse.json(
        {
          error: "Invalid domain format",
          provided: companyDomain,
          expected: "example.com (without http:// or paths)",
        },
        { status: 400 }
      );
    }

    // 3. Run enrichment
    console.log(`[API] Enriching lead: ${companyDomain} for user ${userId}`);

    const result = await enrichLeadCore({
      companyDomain: companyDomain.toLowerCase().trim(),
      companyName: companyName || undefined,
      contactName: contactName || undefined,
      workspaceId: orgId,
      userId: userId,
    });

    // 4. Return result
    if (result.success && "enrichedLead" in result) {
      return NextResponse.json(
        {
          success: true,
          data: result.enrichedLead,
          metadata: result.metadata,
        },
        { status: 200 }
      );
    } else {
      // Enrichment failed but didn't throw
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Enrichment failed",
          metadata: result.metadata,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Unexpected error
    console.error("[API] Lead enrichment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads/enrich
 * 
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/leads/enrich",
    method: "POST",
    description: "Enriches a lead with company intelligence",
    authentication: "Required (Clerk session)",
    rateLimit: "100 requests per minute per user",
    requestBody: {
      companyDomain: {
        type: "string",
        required: true,
        description: "Company domain (e.g., 'stripe.com')",
        example: "stripe.com",
      },
      companyName: {
        type: "string",
        required: false,
        description: "Company name (optional, will be detected if not provided)",
        example: "Stripe",
      },
      contactName: {
        type: "string",
        required: false,
        description: "Contact person name (optional)",
        example: "John Doe",
      },
    },
    responseSuccess: {
      success: true,
      data: {
        leadId: "string",
        companyName: "string",
        industry: "string",
        icpFitScore: "number (0-100)",
        confidenceLevel: "high | medium | low",
        techStack: "string[]",
        recentNews: "NewsItem[]",
        painPointsInferred: "string[]",
        buyingSignals: "string[]",
        outreachAngle: "string",
        keyInsights: "string[]",
      },
      metadata: {
        duration: "number (milliseconds)",
        dataCompleteness: "number (0-100)",
      },
    },
    responseError: {
      success: false,
      error: "string",
      message: "string (optional)",
    },
    exampleRequest: `curl -X POST https://app.galaxyco.ai/api/leads/enrich \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"companyDomain": "stripe.com"}'`,
  });
}
