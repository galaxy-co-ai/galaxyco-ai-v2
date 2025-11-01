import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/integrations/google/connect
 *
 * Initiates OAuth 2.0 flow for Google integrations (Gmail, Calendar)
 *
 * Body:
 * - workspaceId: string
 * - integrationType: "gmail" | "calendar"
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, integrationType } = body;

    if (!workspaceId || !integrationType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['gmail', 'calendar'].includes(integrationType)) {
      return NextResponse.json({ error: 'Invalid integration type' }, { status: 400 });
    }

    // Define scopes based on integration type
    const scopes =
      integrationType === 'gmail'
        ? [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ]
        : [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ];

    // Create state parameter with metadata
    const state = Buffer.from(
      JSON.stringify({
        workspaceId,
        integrationType,
        timestamp: Date.now(),
      }),
    ).toString('base64');

    // Build OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID || '');
    authUrl.searchParams.append(
      'redirect_uri',
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/google/callback`,
    );
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    return NextResponse.json({
      authUrl: authUrl.toString(),
    });
  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
