/**
 * Slack OAuth Callback Handler
 * Handles OAuth callback and stores credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { exchangeCodeForTokens, getWorkspaceInfo } from '@/lib/integrations/slack/oauth';
import { db } from '@galaxyco/database';
import { integrations, oauthTokens } from '@galaxyco/database';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/settings/integrations?error=${encodeURIComponent(error)}`, req.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=Invalid callback parameters', req.url),
      );
    }

    // Verify state token
    let stateData: { userId: string; workspaceId: string; timestamp: number };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=Invalid state token', req.url),
      );
    }

    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId || userId !== stateData.userId) {
      return NextResponse.redirect(
        new URL('/settings/integrations?error=Authentication mismatch', req.url),
      );
    }

    // Exchange code for tokens
    const credentials = await exchangeCodeForTokens(code);

    // Get workspace info
    const workspaceInfo = await getWorkspaceInfo(credentials.accessToken);

    // Store credentials in database
    const existingIntegration = await db.query.integrations.findFirst({
      where: (integrations, { and, eq }) =>
        and(
          eq(integrations.userId, userId),
          eq(integrations.workspaceId, stateData.workspaceId),
          eq(integrations.provider, 'slack'),
          eq(integrations.type, 'messaging'),
        ),
    });

    if (existingIntegration) {
      // Update existing integration
      await db
        .update(integrations)
        .set({
          status: 'active',
          displayName: credentials.teamName || workspaceInfo.team,
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, existingIntegration.id));

      // Update OAuth tokens
      await db
        .update(oauthTokens)
        .set({
          accessToken: credentials.accessToken,
          tokenType: credentials.tokenType,
          scope: credentials.scope,
          updatedAt: new Date(),
        })
        .where(eq(oauthTokens.integrationId, existingIntegration.id));
    } else {
      // Create new integration
      const integrationId = randomUUID();

      await db.insert(integrations).values({
        id: integrationId,
        userId,
        workspaceId: stateData.workspaceId,
        provider: 'slack',
        type: 'messaging',
        name: `Slack (${credentials.teamName || workspaceInfo.team})`,
        status: 'active',
        providerAccountId: credentials.teamId || workspaceInfo.team,
        displayName: credentials.teamName || workspaceInfo.team,
        scopes: credentials.scope.split(','),
        config: {
          botUserId: credentials.botUserId,
          appId: credentials.appId,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create OAuth tokens entry
      await db.insert(oauthTokens).values({
        id: randomUUID(),
        integrationId,
        accessToken: credentials.accessToken,
        tokenType: credentials.tokenType,
        scope: credentials.scope,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Redirect to integrations page with success message
    return NextResponse.redirect(
      new URL(
        `/settings/integrations?success=${encodeURIComponent('Slack connected successfully')}`,
        req.url,
      ),
    );
  } catch (error) {
    console.error('Error handling Slack OAuth callback:', error);
    return NextResponse.redirect(
      new URL(
        `/settings/integrations?error=${encodeURIComponent('Failed to connect Slack')}`,
        req.url,
      ),
    );
  }
}
