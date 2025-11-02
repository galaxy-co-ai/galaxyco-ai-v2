/**
 * Pipedrive Authorization Endpoint
 * Initiates Pipedrive OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPipedriveAuthUrl } from '@/lib/integrations/crm/pipedrive/oauth';

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

    // Generate Pipedrive OAuth URL
    const authUrl = getPipedriveAuthUrl(state);

    return NextResponse.json({
      authUrl,
    });
  } catch (error) {
    console.error('Error generating Pipedrive auth URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate authorization URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
