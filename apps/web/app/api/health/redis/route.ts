import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

/**
 * Redis health check endpoint
 * Tests Upstash Redis connectivity for caching and rate limiting
 */
export async function GET() {
  try {
    const configured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

    if (!configured) {
      return NextResponse.json(
        {
          redis: {
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

    // Test actual connectivity with a simple SET/GET
    const redis = getRedisClient();
    const testKey = 'health:check';
    const testValue = Date.now().toString();
    const startTime = Date.now();

    await redis.set(testKey, testValue, { ex: 10 }); // Expire in 10 seconds
    const retrievedValue = await redis.get(testKey);

    const latency = Date.now() - startTime;

    if (retrievedValue !== testValue) {
      throw new Error('Redis GET/SET verification failed');
    }

    return NextResponse.json(
      {
        redis: {
          connected: true,
          status: 'connected',
          latency: `${latency}ms`,
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
    console.error('Redis health check failed:', error);

    return NextResponse.json(
      {
        redis: {
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
