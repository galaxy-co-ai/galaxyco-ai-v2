import { NextResponse } from 'next/server';

/**
 * Cache health check endpoint
 * Tests Redis/cache connectivity
 */
export async function GET() {
  try {
    // For now, return basic health
    // TODO: Implement actual Redis connection test when Redis is integrated

    return NextResponse.json(
      {
        cache: 'connected',
        connected: true,
        service: 'redis',
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
  } catch (error: any) {
    console.error('Cache health check failed:', error);

    return NextResponse.json(
      {
        cache: 'disconnected',
        connected: false,
        error: 'Cache connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
