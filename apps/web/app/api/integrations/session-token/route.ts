/**
 * Session Token API Endpoint
 * Generates Nango session tokens for OAuth flows
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { nangoServer } from '@/lib/integrations/nango-server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { allowedIntegrations } = body;

    // Validate allowed integrations
    if (allowedIntegrations && !Array.isArray(allowedIntegrations)) {
      return NextResponse.json({ error: 'allowedIntegrations must be an array' }, { status: 400 });
    }

    // Create session token via Nango
    const session = await nangoServer.createConnectSession({
      end_user: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        display_name: user.fullName || user.username || 'User',
        // Optional: Add organization context
        // tags: { organizationId: user.organizationId }
      },
      allowed_integrations: allowedIntegrations || ['gmail', 'slack', 'hubspot', 'google-calendar'],
    });

    return NextResponse.json({
      sessionToken: session.data.token,
    });
  } catch (error) {
    console.error('Failed to create session token:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create session token',
      },
      { status: 500 },
    );
  }
}
