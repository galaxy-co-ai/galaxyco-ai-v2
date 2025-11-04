import { NextResponse } from 'next/server';

<<<<<<< Updated upstream
=======
/**
 * Main health check endpoint
 * Returns overall system health status
 */
export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '2.0.0',
      environment: process.env.NODE_ENV || 'production',
      services: {
        database: 'unknown',
        cache: 'unknown',
        ai: 'unknown',
      },
    };

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 },
    );
  }
}

>>>>>>> Stashed changes
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime?.() || 0,
  });
}
