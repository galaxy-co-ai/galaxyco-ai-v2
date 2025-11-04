import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
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
    // Try auth() first, fallback to currentUser() if needed
    let userId: string | null = null;
    let orgId: string | null = null;

    try {
      const authResult = await auth();
      userId = authResult.userId;
      orgId = authResult.orgId || null;
    } catch (authError) {
      console.error('[OAUTH_CALLBACK] auth() failed, trying currentUser():', authError);
      // Fallback to currentUser()
      const user = await currentUser();
      if (user) {
        userId = user.id;
        orgId = (user.publicMetadata?.orgId as string | undefined) || null;
      }
    }

    if (!userId || !orgId) {
      console.error('[OAUTH_CALLBACK] No userId or orgId found', { userId, orgId });
      return NextResponse.redirect(new URL('/sign-in?error=unauthorized', request.url));
    }

    console.log('[OAUTH_CALLBACK] Authenticated user', { userId, orgId });

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('[OAUTH_CALLBACK] Query params', {
      hasCode: !!code,
      hasState: !!state,
      error,
    });

    // Handle user denial
    if (error) {
      console.error('[OAUTH_CALLBACK] User denied access:', error);
      return NextResponse.redirect(
        new URL(`/settings/integrations?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    if (!code || !state) {
      console.error('[OAUTH_CALLBACK] Missing code or state', { code: !!code, state: !!state });
      return NextResponse.redirect(
        new URL('/settings/integrations?error=missing_parameters', request.url),
      );
    }

    // Decode state parameter
    let stateData: { workspaceId?: string; integrationType?: string };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      console.log('[OAUTH_CALLBACK] Decoded state', {
        workspaceId: stateData.workspaceId,
        integrationType: stateData.integrationType,
      });
    } catch (stateError) {
      console.error('[OAUTH_CALLBACK] Failed to decode state', stateError);
      return NextResponse.redirect(
        new URL('/settings/integrations?error=invalid_state', request.url),
      );
    }

    const { workspaceId, integrationType } = stateData;

    if (!workspaceId || !integrationType) {
      console.error('[OAUTH_CALLBACK] Invalid state data', { workspaceId, integrationType });
      return NextResponse.redirect(
        new URL('/settings/integrations?error=invalid_state', request.url),
      );
    }

    // Verify workspace ID matches org ID
    if (workspaceId !== orgId) {
      console.error('[OAUTH_CALLBACK] Workspace mismatch', { workspaceId, orgId });
      return NextResponse.redirect(
        new URL('/settings/integrations?error=workspace_mismatch', request.url),
      );
    }

    // Exchange code for tokens
    console.log('[OAUTH_CALLBACK] Exchanging code for tokens...');
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
      console.error('[OAUTH_CALLBACK] Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
      });
      return NextResponse.redirect(
        new URL('/settings/integrations?error=token_exchange_failed', request.url),
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, scope, id_token } = tokens;
    console.log('[OAUTH_CALLBACK] Tokens received', {
      hasAccessToken: !!access_token,
      hasRefreshToken: !!refresh_token,
      expiresIn: expires_in,
    });

    // Get user info from Google
    console.log('[OAUTH_CALLBACK] Fetching user info from Google...');
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      console.error('[OAUTH_CALLBACK] Failed to get user info', {
        status: userInfoResponse.status,
        statusText: userInfoResponse.statusText,
      });
      return NextResponse.redirect(
        new URL('/settings/integrations?error=user_info_failed', request.url),
      );
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture, id: googleId } = userInfo;
    console.log('[OAUTH_CALLBACK] User info received', { email, name, googleId });

    const integrationName = integrationType === 'gmail' ? 'Gmail' : 'Google Calendar';

    // Check if integration already exists
    console.log('[OAUTH_CALLBACK] Checking for existing integration...', {
      workspaceId,
      userId,
      provider: 'google',
      type: integrationType,
    });
    const existingIntegration = await db.query.integrations.findFirst({
      where: and(
        eq(integrations.workspaceId, workspaceId),
        eq(integrations.userId, userId),
        eq(integrations.provider, 'google'),
        eq(integrations.type, integrationType),
      ),
    });

    console.log('[OAUTH_CALLBACK] Existing integration check', {
      found: !!existingIntegration,
      integrationId: existingIntegration?.id,
    });

    // Encrypt tokens
    console.log('[OAUTH_CALLBACK] Encrypting tokens...');
    let encryptedTokens;
    try {
      encryptedTokens = encryptTokens({
        access_token,
        refresh_token,
        id_token,
      });
      console.log('[OAUTH_CALLBACK] Tokens encrypted successfully');
    } catch (encryptError) {
      console.error('[OAUTH_CALLBACK] Failed to encrypt tokens', encryptError);
      throw new Error(
        'Failed to encrypt tokens: ' +
          (encryptError instanceof Error ? encryptError.message : 'Unknown error'),
      );
    }
    const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : undefined;

    if (existingIntegration) {
      // Update existing integration
      console.log('[OAUTH_CALLBACK] Updating existing integration...', {
        integrationId: existingIntegration.id,
      });
      try {
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
        console.log('[OAUTH_CALLBACK] Integration updated successfully');

        // Update or create OAuth tokens
        const existingToken = await db.query.oauthTokens.findFirst({
          where: eq(oauthTokens.integrationId, existingIntegration.id),
        });

        if (existingToken) {
          console.log('[OAUTH_CALLBACK] Updating existing OAuth token...');
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
          console.log('[OAUTH_CALLBACK] OAuth token updated successfully');
        } else {
          console.log('[OAUTH_CALLBACK] Creating new OAuth token...');
          await db.insert(oauthTokens).values({
            integrationId: existingIntegration.id,
            accessToken: encryptedTokens.accessToken,
            refreshToken: encryptedTokens.refreshToken,
            idToken: encryptedTokens.idToken,
            expiresAt,
            scope,
          });
          console.log('[OAUTH_CALLBACK] OAuth token created successfully');
        }
      } catch (dbError) {
        console.error('[OAUTH_CALLBACK] Database error updating integration', {
          error: dbError instanceof Error ? dbError.message : 'Unknown error',
          stack: dbError instanceof Error ? dbError.stack : undefined,
        });
        throw dbError;
      }
    } else {
      // Create new integration
      console.log('[OAUTH_CALLBACK] Creating new integration...');
      try {
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

        console.log('[OAUTH_CALLBACK] Integration created successfully', {
          integrationId: newIntegration.id,
        });

        // Store OAuth tokens
        console.log('[OAUTH_CALLBACK] Storing OAuth tokens...');
        await db.insert(oauthTokens).values({
          integrationId: newIntegration.id,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          idToken: encryptedTokens.idToken,
          expiresAt,
          scope,
        });
        console.log('[OAUTH_CALLBACK] OAuth tokens stored successfully');
      } catch (dbError) {
        console.error('[OAUTH_CALLBACK] Database error creating integration', {
          error: dbError instanceof Error ? dbError.message : 'Unknown error',
          stack: dbError instanceof Error ? dbError.stack : undefined,
        });
        throw dbError;
      }
    }

    // Redirect to integrations page with success message
    console.log('[OAUTH_CALLBACK] ✅ Success! Redirecting to integrations page');
    return NextResponse.redirect(
      new URL(`/settings/integrations?success=${integrationType}_connected`, request.url),
    );
  } catch (error) {
    console.error('[OAUTH_CALLBACK] ❌ Fatal error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.redirect(
      new URL('/settings/integrations?error=internal_error', request.url),
    );
  }
}
