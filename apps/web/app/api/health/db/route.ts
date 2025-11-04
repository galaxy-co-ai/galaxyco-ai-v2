import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { sql } from 'drizzle-orm';

/**
 * Database health check endpoint
 * Tests database connectivity and query performance
 */
export async function GET() {
  try {
    const start = Date.now();

    // Simple connectivity test
    await db.execute(sql`SELECT 1`);

    const duration = Date.now() - start;

    return NextResponse.json(
      {
        database: 'connected',
        connected: true,
        responseTime: `${duration}ms`,
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
    console.error('Database health check failed:', error);

    return NextResponse.json(
      {
        database: 'disconnected',
        connected: false,
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
