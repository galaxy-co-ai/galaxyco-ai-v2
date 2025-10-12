import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Simple database connectivity test
    await db.execute(sql`SELECT 1`);
    
    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      },
      { status: 500 }
    );
  }
}