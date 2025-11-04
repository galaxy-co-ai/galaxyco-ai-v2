import { NextResponse } from 'next/server';

/**
 * Authentication service health check
 * Tests Clerk connectivity
 */
export async function GET() {
  try {
    const clerkConfigured = !!(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
    );

    return NextResponse.json(
      {
        service: 'Clerk',
        connected: clerkConfigured,
        status: clerkConfigured ? 'operational' : 'not_configured',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    );
  } catch (error: any) {
    console.error('Auth health check failed:', error);

    return NextResponse.json(
      {
        service: 'Clerk',
        connected: false,
        error: 'Authentication health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
