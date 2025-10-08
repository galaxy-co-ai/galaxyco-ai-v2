import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createProvider } from '@/lib/ai/factory';
import type { AIProviderType } from '@/lib/ai/types';

/**
 * POST /api/workspaces/[id]/api-keys/test
 * Test an API key by making a minimal request to the provider
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, apiKey } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Provider and apiKey are required' },
        { status: 400 }
      );
    }

    if (!['openai', 'anthropic'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be openai or anthropic' },
        { status: 400 }
      );
    }

    // Create provider instance and test connection
    const aiProvider = createProvider(provider as AIProviderType, apiKey);
    
    const isValid = await aiProvider.validateConfig();

    if (isValid) {
      return NextResponse.json({ 
        success: true,
        valid: true,
        provider,
        message: `${provider} API key is valid`,
      });
    } else {
      return NextResponse.json({ 
        success: false,
        valid: false,
        provider,
        message: `${provider} API key is invalid`,
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API key test error:', error);
    
    // Provide user-friendly error messages
    let message = 'Failed to test API key';
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      message = 'API key is invalid or expired';
    } else if (error.message.includes('rate limit')) {
      message = 'Rate limit exceeded. Please try again later.';
    }
    
    return NextResponse.json(
      { 
        success: false,
        valid: false,
        error: message,
        details: error.message,
      },
      { status: 400 }
    );
  }
}
