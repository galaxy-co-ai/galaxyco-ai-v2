import { NextResponse } from 'next/server';
import { getVectorClient } from '@/lib/vector';

/**
 * Vector database health check
 * Tests Upstash Vector connectivity
 */
export async function GET() {
  try {
    const configured = !!(process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN);

    if (!configured) {
      return NextResponse.json(
        {
          upstashVector: {
            connected: false,
            status: 'not_configured',
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
          },
        },
      );
    }

    // Test actual connectivity
    const vectorClient = getVectorClient();
    const info = await vectorClient.info();

    return NextResponse.json(
      {
        upstashVector: {
          connected: true,
          status: 'connected',
          dimension: info.dimension,
          vectorCount: info.vectorCount,
          metric: info.similarityFunction,
        },
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
    console.error('Vector DB health check failed:', error);

    return NextResponse.json(
      {
        upstashVector: {
          connected: false,
          status: 'error',
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
