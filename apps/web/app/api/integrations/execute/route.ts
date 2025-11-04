/**
 * Execute Integration Action API Endpoint
 * Executes a specific integration action (used by workflows)
 */

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  executeIntegrationAction,
  validateIntegrationParameters,
} from '@/lib/integrations/integration-executor';
import type { IntegrationType, IntegrationAction } from '@/lib/integrations/integration-config';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      integrationId,
      action,
      parameters,
    }: {
      integrationId: IntegrationType;
      action: IntegrationAction;
      parameters: Record<string, any>;
    } = body;

    // Validate inputs
    if (!integrationId) {
      return NextResponse.json({ error: 'integrationId is required' }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    if (!parameters) {
      return NextResponse.json({ error: 'parameters is required' }, { status: 400 });
    }

    // Validate parameters
    const validation = validateIntegrationParameters(integrationId, action, parameters);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          validationErrors: validation.errors,
        },
        { status: 400 },
      );
    }

    // Execute the integration action
    const result = await executeIntegrationAction({
      integrationId,
      action,
      connectionId: userId, // Use userId as connectionId
      parameters,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    console.error('Integration execution failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Execution failed',
      },
      { status: 500 },
    );
  }
}
