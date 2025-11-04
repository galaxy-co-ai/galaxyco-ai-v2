/**
 * Integration Reconnect Token API
 *
 * POST /api/integrations/reconnect-token
 * Generate OAuth URL for reconnecting an integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Authentication required - get both userId and orgId
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body = await req.json();
    const { integrationType } = body;

    if (!integrationType) {
      return NextResponse.json({ error: 'integrationType is required' }, { status: 400 });
    }

    // Generate state token with workspace and user info
    const state = Buffer.from(
      JSON.stringify({
        workspaceId: orgId,
        userId,
        integrationType,
        timestamp: Date.now(),
      }),
    ).toString('base64');

    // Build OAuth URL based on integration type
    let authUrl = '';

    switch (integrationType) {
      case 'gmail':
      case 'google-calendar':
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google/callback`;

        const scopes =
          integrationType === 'gmail'
            ? 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            : 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

        authUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${googleClientId}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent(scopes)}` +
          `&state=${state}` +
          `&access_type=offline` +
          `&prompt=consent`;
        break;

      case 'slack':
        const slackClientId = process.env.SLACK_CLIENT_ID;
        const slackRedirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/slack/callback`;

        authUrl =
          `https://slack.com/oauth/v2/authorize?` +
          `client_id=${slackClientId}` +
          `&redirect_uri=${encodeURIComponent(slackRedirectUri)}` +
          `&scope=${encodeURIComponent('chat:write,channels:read,users:read')}` +
          `&state=${state}`;
        break;

      case 'hubspot':
        const hubspotClientId = process.env.HUBSPOT_CLIENT_ID;
        const hubspotRedirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/hubspot/callback`;

        authUrl =
          `https://app.hubspot.com/oauth/authorize?` +
          `client_id=${hubspotClientId}` +
          `&redirect_uri=${encodeURIComponent(hubspotRedirectUri)}` +
          `&scope=${encodeURIComponent('contacts')}` +
          `&state=${state}`;
        break;

      default:
        return NextResponse.json(
          { error: `Integration type "${integrationType}" not supported` },
          { status: 400 },
        );
    }

    return NextResponse.json({
      authUrl,
      state,
    });
  } catch (error) {
    console.error('[Reconnect Token Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to generate reconnect token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
