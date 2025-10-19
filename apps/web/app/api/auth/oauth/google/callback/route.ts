import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/auth/oauth/google/callback
 *
 * OAuth 2.0 callback handler for Google integrations (Gmail, Calendar)
 *
 * Query params:
 * - code: string (OAuth authorization code from Google)
 * - state: string (contains workspaceId, integrationType, etc.)
 * - error: string (optional, if user denied access)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(
        new URL("/sign-in?error=unauthorized", request.url),
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle user denial
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/settings/integrations?error=${encodeURIComponent(error)}`,
          request.url,
        ),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/settings/integrations?error=missing_parameters", request.url),
      );
    }

    // Decode state parameter
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const { workspaceId, integrationType } = stateData;

    if (!workspaceId || !integrationType) {
      return NextResponse.redirect(
        new URL("/settings/integrations?error=invalid_state", request.url),
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL(
          "/settings/integrations?error=token_exchange_failed",
          request.url,
        ),
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, scope } = tokens;

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL("/settings/integrations?error=user_info_failed", request.url),
      );
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture } = userInfo;

    // TODO: Store tokens securely in database when integrations table is added
    // For now, log success (in production, tokens would be encrypted and stored)
    console.log(`OAuth successful for ${integrationType}:`, {
      email,
      name,
      scopes: scope,
      expiresIn: expires_in,
    });

    // NOTE: In production, tokens should be:
    // 1. Encrypted using AES-256-GCM
    // 2. Stored in integrations table
    // 3. Refreshed before expiry

    // Redirect to integrations page with success message
    return NextResponse.redirect(
      new URL(
        `/settings/integrations?success=${integrationType}_connected`,
        request.url,
      ),
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/settings/integrations?error=internal_error", request.url),
    );
  }
}
