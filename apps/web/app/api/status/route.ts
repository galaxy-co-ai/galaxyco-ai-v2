import { NextRequest, NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { sql } from 'drizzle-orm';

/**
 * GET /api/status
 * System status endpoint - health check for all services
 *
 * This endpoint is PUBLIC (no auth required) for status page
 */
export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();

    // Check database connection
    let databaseStatus = 'operational';
    let databaseLatency = 0;

    try {
      const dbStartTime = Date.now();
      await db.execute(sql`SELECT 1 as health_check`);
      databaseLatency = Date.now() - dbStartTime;
    } catch (error) {
      console.error('[Database Health Check Failed]', error);
      databaseStatus = 'degraded';
      databaseLatency = -1;
    }

    // TODO: Check other services
    // - Pinecone (vector search)
    // - OpenAI (AI provider)
    // - Clerk (authentication)
    // - Vercel Blob (file storage)

    const totalLatency = Date.now() - startTime;

    const status = {
      status: databaseStatus === 'operational' ? 'operational' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: databaseStatus,
          latency: databaseLatency,
          provider: 'Neon Postgres',
        },
        api: {
          status: 'operational',
          latency: totalLatency,
        },
        authentication: {
          status: 'operational', // TODO: Check Clerk
          provider: 'Clerk',
        },
        vectorSearch: {
          status: 'operational', // TODO: Check Pinecone
          provider: 'Pinecone',
        },
        aiProvider: {
          status: 'operational', // TODO: Check OpenAI
          provider: 'OpenAI',
        },
        storage: {
          status: 'operational', // TODO: Check Vercel Blob
          provider: 'Vercel Blob',
        },
      },
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      environment: process.env.NODE_ENV || 'production',
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('[Status API Error]', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Status check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
