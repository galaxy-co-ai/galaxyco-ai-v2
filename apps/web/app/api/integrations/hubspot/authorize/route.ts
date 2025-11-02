/**
 * HubSpot Authorization Endpoint
 * Initiates HubSpot OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getHubSpotAuthUrl } from '@/lib/integrations/crm/hubspot/oauth';

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

    // Generate HubSpot OAuth URL
    const authUrl = getHubSpotAuthUrl(state);

    return NextResponse.json({
      authUrl,
    });
  } catch (error) {
    console.error('Error generating HubSpot auth URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate authorization URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
