import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/billing
 * Get billing information
 *
 * NOTE: Stub implementation - would integrate with Stripe in production
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    // TODO: In production, this would:
    // 1. Fetch Stripe customer ID from workspace
    // 2. Query Stripe API for billing details
    // 3. Return subscription, invoices, payment methods

    // Stub data for now
    const billingData = {
      subscription: {
        id: 'sub_stub',
        status: 'active',
        plan: 'professional',
        price: 9900, // cents
        currency: 'usd',
        interval: 'month',
        currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      },
      paymentMethod: {
        id: 'pm_stub',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025,
        },
      },
      invoices: [
        {
          id: 'in_1',
          number: 'INV-2024-001',
          status: 'paid',
          amount: 9900,
          currency: 'usd',
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          invoicePdf: '#',
        },
        {
          id: 'in_2',
          number: 'INV-2024-002',
          status: 'paid',
          amount: 9900,
          currency: 'usd',
          created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          invoicePdf: '#',
        },
      ],
      usage: {
        agents: { current: 5, limit: 10 },
        workflows: { current: 12, limit: 50 },
        apiCalls: { current: 2453, limit: 10000 },
      },
    };

    return NextResponse.json(billingData);
  } catch (error) {
    console.error('Get billing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch billing information',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/billing
 * Update billing/subscription
 *
 * NOTE: Stub implementation - would integrate with Stripe in production
 */
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceId, action, data } = body;

    if (!workspaceId || !action) {
      return NextResponse.json({ error: 'workspaceId and action are required' }, { status: 400 });
    }

    // TODO: Handle Stripe actions:
    // - change_plan
    // - cancel_subscription
    // - update_payment_method
    // - download_invoice

    return NextResponse.json({
      success: true,
      message: `Billing action '${action}' would be processed (stub)`,
    });
  } catch (error) {
    console.error('Update billing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update billing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
