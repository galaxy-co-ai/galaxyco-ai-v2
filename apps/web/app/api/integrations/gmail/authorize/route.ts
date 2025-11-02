/**
 * Gmail Authorization Endpoint
 * Initiates Gmail OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGmailAuthUrl } from '@/lib/integrations/gmail/oauth';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspaceId from query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId') || '';

    // Generate state token for CSRF protection (encode userId + workspace info)
    const state = Buffer.from(
      JSON.stringify({
        userId,
        workspaceId,
        timestamp: Date.now(),
      }),
    ).toString('base64');

    // Generate Gmail OAuth URL
    const authUrl = getGmailAuthUrl(state);

    return NextResponse.json({
      authUrl,
    });
  } catch (error) {
    console.error('Error generating Gmail auth URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate authorization URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
