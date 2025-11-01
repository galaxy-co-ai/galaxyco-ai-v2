import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations/microsoft/connect
 *
 * Initiates Microsoft OAuth 2.0 flow for Outlook or Calendar
 *
 * Query params:
 * - type: string ("outlook" | "calendar")
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const integrationType = searchParams.get('type');

    if (!integrationType || !['outlook', 'calendar'].includes(integrationType)) {
      return NextResponse.json({ error: 'Invalid integration type' }, { status: 400 });
    }

    // Define scopes based on integration type
    const scopes =
      integrationType === 'outlook'
        ? [
            'https://graph.microsoft.com/Mail.Read',
            'https://graph.microsoft.com/Mail.Send',
            'https://graph.microsoft.com/User.Read',
            'offline_access', // For refresh token
          ]
        : [
            'https://graph.microsoft.com/Calendars.Read',
            'https://graph.microsoft.com/Calendars.ReadWrite',
            'https://graph.microsoft.com/User.Read',
            'offline_access',
          ];

    // Create state parameter with workspace and integration type
    const state = Buffer.from(
      JSON.stringify({
        workspaceId: orgId,
        integrationType,
        timestamp: Date.now(),
      }),
    ).toString('base64');

    // Build Microsoft OAuth URL
    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    authUrl.searchParams.set('client_id', process.env.MICROSOFT_CLIENT_ID || '');
    authUrl.searchParams.set(
      'redirect_uri',
      `${process.env.NEXTAUTH_URL}/api/auth/oauth/microsoft/callback`,
    );
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('prompt', 'consent'); // Always show consent screen
    authUrl.searchParams.set('response_mode', 'query');

    // Redirect to Microsoft OAuth
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Microsoft OAuth initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
