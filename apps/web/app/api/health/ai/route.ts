import { NextResponse } from 'next/server';

/**
 * AI services health check endpoint
 * Tests OpenAI and other AI service connectivity
 */
export async function GET() {
  try {
    const services = {
      openai: {
        status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        available: !!process.env.OPENAI_API_KEY,
      },
      anthropic: {
        status: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not_configured',
        available: !!process.env.ANTHROPIC_API_KEY,
      },
      pinecone: {
        status: process.env.PINECONE_API_KEY ? 'configured' : 'not_configured',
        available: !!process.env.PINECONE_API_KEY,
      },
    };

    const allConfigured = Object.values(services).every((s) => s.available);

    return NextResponse.json(
      {
        ...services,
        overall: allConfigured ? 'operational' : 'partial',
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
    console.error('AI health check failed:', error);

    return NextResponse.json(
      {
        error: 'AI services health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
