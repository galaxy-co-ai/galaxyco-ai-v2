import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { workspaces } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { encryptApiKey, decryptApiKey } from '@/lib/crypto';
import { createProvider } from '@/lib/ai/factory';
import type { AIProviderType } from '@/lib/ai/types';

/**
 * GET /api/workspaces/[id]/api-keys
 * List configured API key providers (not the keys themselves)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, params.id),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Return which providers have keys configured (not the keys)
    const encryptedKeys = workspace.encryptedApiKeys || {};
    const configuredProviders = {
      openai: !!encryptedKeys.openai,
      anthropic: !!encryptedKeys.anthropic,
    };

    return NextResponse.json({ providers: configuredProviders });
  } catch (error: any) {
    console.error('API key list error:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workspaces/[id]/api-keys
 * Add or update an API key for a provider
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

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, params.id),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Encrypt the API key
    const encrypted = encryptApiKey(apiKey);

    // Update workspace with encrypted key
    const currentKeys = workspace.encryptedApiKeys || {};
    const updatedKeys = {
      ...currentKeys,
      [provider]: encrypted,
    };

    await db
      .update(workspaces)
      .set({ 
        encryptedApiKeys: updatedKeys,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, params.id));

    return NextResponse.json({ 
      success: true,
      provider,
      message: `${provider} API key saved successfully`,
    });
  } catch (error: any) {
    console.error('API key save error:', error);
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workspaces/[id]/api-keys
 * Remove an API key for a provider
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider query parameter is required' },
        { status: 400 }
      );
    }
    
    // Type guard to ensure provider is valid
    if (provider !== 'openai' && provider !== 'anthropic') {
      return NextResponse.json(
        { error: 'Invalid provider. Only "openai" and "anthropic" are supported.' },
        { status: 400 }
      );
    }

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, params.id),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Remove the key from encrypted keys
    const currentKeys = workspace.encryptedApiKeys || {};
    const { [provider]: removed, ...remainingKeys } = currentKeys;

    await db
      .update(workspaces)
      .set({ 
        encryptedApiKeys: remainingKeys,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, params.id));

    return NextResponse.json({ 
      success: true,
      provider,
      message: `${provider} API key removed successfully`,
    });
  } catch (error: any) {
    console.error('API key delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
