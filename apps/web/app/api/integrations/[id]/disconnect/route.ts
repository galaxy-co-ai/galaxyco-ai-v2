import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@galaxyco/database/client";
import { integrations, oauthTokens } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { decryptTokens } from "@/lib/encryption";

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
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integrationId = params.id;

    // Fetch integration
    const integration = await db.query.integrations.findFirst({
      where: and(
        eq(integrations.id, integrationId),
        eq(integrations.workspaceId, orgId),
      ),
    });

    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 },
      );
    }

    // Get OAuth tokens
    const tokens = await db.query.oauthTokens.findFirst({
      where: eq(oauthTokens.integrationId, integrationId),
    });

    // Revoke tokens with provider
    if (tokens) {
      try {
        const decrypted = decryptTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || undefined,
          idToken: tokens.idToken || undefined,
        });

        // Revoke based on provider
        if (integration.provider === "google" && decrypted.access_token) {
          // Revoke Google token
          await fetch(
            `https://oauth2.googleapis.com/revoke?token=${decrypted.access_token}`,
            { method: "POST" },
          );
        } else if (
          integration.provider === "microsoft" &&
          decrypted.access_token
        ) {
          // Microsoft doesn't have a simple revoke endpoint
          // Tokens will expire naturally
          console.log("Microsoft tokens will expire naturally");
        }
      } catch (error) {
        console.error("Token revocation failed:", error);
        // Continue with deletion even if revocation fails
      }

      // Delete OAuth tokens from database
      await db.delete(oauthTokens).where(eq(oauthTokens.id, tokens.id));
    }

    // Delete integration
    await db.delete(integrations).where(eq(integrations.id, integrationId));

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
