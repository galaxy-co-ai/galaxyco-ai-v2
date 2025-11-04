import { NextResponse } from 'next/server';

/**
 * Vector database health check
 * Tests Pinecone connectivity
 */
export async function GET() {
  try {
    const pineconeConfigured = !!(process.env.PINECONE_API_KEY && process.env.PINECONE_ENVIRONMENT);

    return NextResponse.json(
      {
        pinecone: {
          connected: pineconeConfigured,
          status: pineconeConfigured ? 'configured' : 'not_configured',
          environment: process.env.PINECONE_ENVIRONMENT || 'not_set',
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
        error: 'Vector database health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
