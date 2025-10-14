import { NextRequest, NextResponse } from "next/server";
import { enrichLead } from "@/trigger/lead-intel-agent";

export async function POST(request: NextRequest) {
  try {
    const { companyDomain, companyName } = await request.json();

    if (!companyDomain) {
      return NextResponse.json(
        { error: "companyDomain is required" },
        { status: 400 }
      );
    }

    console.log("🚀 Triggering lead enrichment for:", companyDomain);

    // In a real app, you'd trigger this via Trigger.dev's API
    // For testing, we'll call it directly
    const result = await enrichLead.run({
      companyDomain,
      companyName,
      workspaceId: "test-workspace",
      userId: "test-user",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Test enrichment failed:", error);
    return NextResponse.json(
      {
        error: "Enrichment failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}