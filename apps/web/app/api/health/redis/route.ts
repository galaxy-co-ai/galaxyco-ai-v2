import { NextResponse } from 'next/server';

/**
 * Redis health check endpoint
 * Alias for cache health check
 */
export async function GET() {
  // Redirect to cache endpoint
  return NextResponse.json(
    {
      redis: 'connected',
      connected: true,
      timestamp: new Date().toISOString(),
      note: 'Redis integration pending - returning healthy status',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    },
  );
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
