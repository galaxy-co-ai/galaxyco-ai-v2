/**
 * Slack Authorization Endpoint
 * Initiates Slack OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSlackAuthUrl } from '@/lib/integrations/slack/oauth';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspaceId from query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId') || '';

    // Generate state token for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        userId,
        workspaceId,
        timestamp: Date.now(),
      }),
    ).toString('base64');

    // Generate Slack OAuth URL
    const authUrl = getSlackAuthUrl(state);

    return NextResponse.json({
      authUrl,
    });
  } catch (error) {
    console.error('Error generating Slack auth URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate authorization URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
