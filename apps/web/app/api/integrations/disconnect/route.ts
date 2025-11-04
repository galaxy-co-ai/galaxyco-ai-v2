/**
 * Disconnect Integration API Endpoint
 * Removes a user's connection to an integration
 */

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { deleteNangoConnection } from '@/lib/integrations/nango-server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { integrationId } = body;

    if (!integrationId) {
      return NextResponse.json({ error: 'integrationId is required' }, { status: 400 });
    }

    // Delete connection
    const result = await deleteNangoConnection(integrationId, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Integration disconnected successfully',
    });
  } catch (error) {
    console.error('Failed to disconnect integration:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to disconnect',
      },
      { status: 500 },
    );
  }
}
