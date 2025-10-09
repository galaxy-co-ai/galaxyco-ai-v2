import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { agents, workspaces } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';
import { AIGatewayService } from '@/lib/ai-gateway';
import type { AIGatewayRequest } from '@/lib/ai-gateway';
import { decryptApiKey } from '@/lib/crypto';
import { retryWithBackoff } from '@/lib/retry';
import {
  startExecution,
  completeExecution,
  failExecution,
} from '@/lib/execution-tracker';
import type { AIProviderType } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/agents/[id]/execute
 * Execute an agent with live AI
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
    const { inputs, mode = 'live' } = body;

    if (!inputs) {
      return NextResponse.json(
        { error: 'Inputs are required' },
        { status: 400 }
      );
    }

    // Get agent with workspace info
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, params.id),
      with: {
        workspace: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, agent.workspaceId),
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Check if API key exists for the agent's AI provider
    const aiProvider = agent.config.aiProvider as AIProviderType;
    const encryptedKeys = workspace.encryptedApiKeys || {};
    
    // Type guard to ensure aiProvider is a valid key
    if (aiProvider !== 'openai' && aiProvider !== 'anthropic' && aiProvider !== 'google') {
      return NextResponse.json(
        { 
          error: `Unsupported AI provider: ${aiProvider}`,
          message: `Only OpenAI, Anthropic, and Google are currently supported`,
        },
        { status: 400 }
      );
    }
    
    if (!encryptedKeys[aiProvider]) {
      return NextResponse.json(
        { 
          error: `${aiProvider} API key not configured`,
          message: `Please add your ${aiProvider} API key in settings`,
        },
        { status: 400 }
      );
    }

    // Get user ID for execution tracking
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkUserId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Start execution tracking
    const executionId = await startExecution({
      agentId: agent.id,
      workspaceId: agent.workspaceId,
      userId: userRecord.id,
      input: inputs,
      triggerType: 'manual',
    });

    try {
      // Decrypt API key and set as environment variable for AI Gateway
      const apiKey = decryptApiKey(encryptedKeys[aiProvider]!);
      
      // Temporarily set the API key for this request
      const envKey = 
        aiProvider === 'openai' 
          ? 'OPENAI_API_KEY' 
          : aiProvider === 'anthropic'
          ? 'ANTHROPIC_API_KEY'
          : aiProvider === 'google'
          ? 'GOOGLE_GENERATIVE_AI_API_KEY'
          : '';
      const originalKey = process.env[envKey];
      process.env[envKey] = apiKey;

      // Build messages from system prompt and inputs
      const messages = [
        {
          role: 'system' as const,
          content: agent.config.systemPrompt || 'You are a helpful AI assistant.',
        },
        {
          role: 'user' as const,
          content: JSON.stringify(inputs),
        },
      ];

      // Prepare AI Gateway request
      const gatewayRequest: AIGatewayRequest = {
        tenantId: agent.workspaceId,
        userId: userRecord.id,
        agentId: agent.id,
        model: agent.config.model || 'gpt-3.5-turbo',
        messages,
        temperature: agent.config.temperature ?? 0.7,
        maxTokens: agent.config.maxTokens,
      };

      // Execute with retry logic using AI Gateway
      const result = await retryWithBackoff(
        () => AIGatewayService.generateText(gatewayRequest),
        {
          maxAttempts: 3,
          baseDelayMs: 1000,
          maxDelayMs: 10000,
          onRetry: (attempt, error) => {
            console.log(`Retry attempt ${attempt} for agent ${agent.id}:`, error.message);
          },
        }
      );
      
      // Restore original API key
      if (originalKey) {
        process.env[envKey] = originalKey;
      } else {
        delete process.env[envKey];
      }

      // Parse output if it's JSON
      let output: Record<string, any>;
      try {
        output = JSON.parse(result.content);
      } catch {
        output = { result: result.content };
      }

      // Complete execution tracking
      await completeExecution({
        executionId,
        result,
        output,
      });

      return NextResponse.json({
        success: true,
        output,
        metrics: {
          tokens: result.usage.totalTokens,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          cost: result.cost,
          latencyMs: result.latencyMs,
          model: result.model,
        },
        executionId,
      });
    } catch (error: any) {
      // Fail execution tracking
      await failExecution({
        executionId,
        error,
      });

      console.error('Agent execution error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Execution failed',
          executionId,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Agent execute API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}
