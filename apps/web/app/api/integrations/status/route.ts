/**
 * Integration Status API
 *
 * GET /api/integrations/status
 * Check if an integration is connected for the current user/workspace
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { integrations } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Authentication required - get both userId and orgId from Clerk
    // Try auth() first, fallback to currentUser() if needed
    let userId: string | null = null;
    let orgId: string | null = null;

    try {
      const authResult = await auth();
      userId = authResult.userId;
      orgId = authResult.orgId || null;
    } catch (authError) {
      console.error('[INTEGRATION_STATUS] auth() failed, trying currentUser():', authError);
      // Fallback to currentUser()
      const user = await currentUser();
      if (user) {
        userId = user.id;
        orgId = (user.publicMetadata?.orgId as string | undefined) || null;
      }
    }

    if (!userId || !orgId) {
      console.error('[INTEGRATION_STATUS] No userId or orgId found', { userId, orgId });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[INTEGRATION_STATUS] Authenticated user', { userId, orgId });

    // Get query params
    const { searchParams } = new URL(req.url);
    const integrationId = searchParams.get('integrationId');

    if (!integrationId) {
      return NextResponse.json({ error: 'integrationId is required' }, { status: 400 });
    }

    // Query for integration using orgId as workspaceId
    const integration = await db.query.integrations.findFirst({
      where: and(
        eq(integrations.workspaceId, orgId),
        eq(integrations.userId, userId),
        eq(integrations.type, integrationId as any),
        eq(integrations.status, 'active'),
      ),
    });

    if (!integration) {
      return NextResponse.json({
        connected: false,
        integrationId,
      });
    }

    // Return connection status
    return NextResponse.json({
      connected: true,
      integrationId,
      email: integration.email,
      displayName: integration.displayName,
      provider: integration.provider,
      status: integration.status,
    });
  } catch (error) {
    console.error('[Integration Status Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to check integration status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
