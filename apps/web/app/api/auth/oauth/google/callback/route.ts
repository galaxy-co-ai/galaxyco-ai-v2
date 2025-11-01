import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database/client';
import { integrations, oauthTokens } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { encryptTokens } from '@/lib/encryption';

// Force dynamic rendering for OAuth callback
export const dynamic = 'force-dynamic';

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
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.redirect(new URL('/sign-in?error=unauthorized', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle user denial
    if (error) {
      return NextResponse.redirect(
        new URL(`/settings/integrations?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=missing_parameters', request.url),
      );
    }

    // Decode state parameter
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { workspaceId, integrationType } = stateData;

    if (!workspaceId || !integrationType) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=invalid_state', request.url),
      );
    }

    // Verify workspace ID matches org ID
    if (workspaceId !== orgId) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=workspace_mismatch', request.url),
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/oauth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/settings/integrations?error=token_exchange_failed', request.url),
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, scope, id_token } = tokens;

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=user_info_failed', request.url),
      );
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture, id: googleId } = userInfo;

    const integrationName = integrationType === 'gmail' ? 'Gmail' : 'Google Calendar';

    // Check if integration already exists
    const existingIntegration = await db.query.integrations.findFirst({
      where: and(
        eq(integrations.workspaceId, workspaceId),
        eq(integrations.userId, userId),
        eq(integrations.provider, 'google'),
        eq(integrations.type, integrationType),
      ),
    });

    // Encrypt tokens
    const encryptedTokens = encryptTokens({
      access_token,
      refresh_token,
      id_token,
    });
    const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : undefined;

    if (existingIntegration) {
      // Update existing integration
      await db
        .update(integrations)
        .set({
          status: 'active',
          email,
          displayName: name,
          profileImage: picture,
          providerAccountId: googleId,
          scopes: scope?.split(' ') || [],
          lastSyncAt: new Date(),
          updatedAt: new Date(),
          lastError: null,
          lastErrorAt: null,
        })
        .where(eq(integrations.id, existingIntegration.id));

      // Update or create OAuth tokens
      const existingToken = await db.query.oauthTokens.findFirst({
        where: eq(oauthTokens.integrationId, existingIntegration.id),
      });

      if (existingToken) {
        await db
          .update(oauthTokens)
          .set({
            accessToken: encryptedTokens.accessToken,
            refreshToken: encryptedTokens.refreshToken || existingToken.refreshToken,
            idToken: encryptedTokens.idToken,
            expiresAt,
            scope,
            updatedAt: new Date(),
          })
          .where(eq(oauthTokens.id, existingToken.id));
      } else {
        await db.insert(oauthTokens).values({
          integrationId: existingIntegration.id,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          idToken: encryptedTokens.idToken,
          expiresAt,
          scope,
        });
      }
    } else {
      // Create new integration
      const [newIntegration] = await db
        .insert(integrations)
        .values({
          workspaceId,
          userId,
          provider: 'google',
          type: integrationType,
          name: integrationName,
          status: 'active',
          providerAccountId: googleId,
          email,
          displayName: name,
          profileImage: picture,
          scopes: scope?.split(' ') || [],
          lastSyncAt: new Date(),
        })
        .returning();

      // Store OAuth tokens
      await db.insert(oauthTokens).values({
        integrationId: newIntegration.id,
        accessToken: encryptedTokens.accessToken,
        refreshToken: encryptedTokens.refreshToken,
        idToken: encryptedTokens.idToken,
        expiresAt,
        scope,
      });
    }

    // Redirect to integrations page with success message
    return NextResponse.redirect(
      new URL(`/settings/integrations?success=${integrationType}_connected`, request.url),
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/settings/integrations?error=internal_error', request.url),
    );
  }
}
