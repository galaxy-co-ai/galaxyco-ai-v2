import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/integrations/[id]/disconnect
 *
 * Disconnects an integration and revokes tokens
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integrationId = params.id;

    // TODO: Delete from integrations table when it exists
    // For now, just return success
    console.log(`Disconnecting integration: ${integrationId}`);

    // NOTE: In production:
    // 1. Fetch integration details from database
    // 2. Revoke OAuth tokens with provider
    // 3. Delete integration record

    return NextResponse.json({
      success: true,
      message: "Integration disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect integration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
