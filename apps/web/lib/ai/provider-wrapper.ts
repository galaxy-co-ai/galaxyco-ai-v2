/**
 * AI Provider Wrapper with Fallback Logic
 *
 * Provides unified interface for AI providers with:
 * - Timeout handling
 * - Fallback provider support
 * - Error handling and retry logic
 * - Structured logging
 * - Security best practices (no hardcoded keys)
 */

import { getCurrentTenantContext } from '../db/tenant-filter';
import { logAgentExecution } from '../agents/agent-logger';
import { logger } from '@/lib/utils/logger';

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  fallbackProvider?: 'openai' | 'anthropic' | 'google';
  retryCount?: number;
  tenantId?: string;
  userId?: string;
  agentId?: string;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
  provider?: string;
  duration?: number;
  fallbackUsed?: boolean;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export interface ProviderConfig {
  name: 'openai' | 'anthropic' | 'google';
  apiKey: string;
  models: {
    default: string;
    fast: string;
    smart: string;
  };
  limits: {
    maxTokens: number;
    rateLimit: number;
  };
}

/**
 * Timeout wrapper for promises
 */
function timeout<T>(ms: number): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms),
  );
}

/**
 * Get provider configuration with API key
 */
function getProviderConfig(provider: string): ProviderConfig {
  const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  if (!apiKey) {
    throw new Error(
      `Missing API key for ${provider}. Set ${provider.toUpperCase()}_API_KEY environment variable.`,
    );
  }

  switch (provider) {
    case 'openai':
      return {
        name: 'openai',
        apiKey,
        models: {
          default: 'gpt-4o',
          fast: 'gpt-4o-mini',
          smart: 'gpt-4o',
        },
        limits: {
          maxTokens: 4096,
          rateLimit: 10000,
        },
      };

    case 'anthropic':
      return {
        name: 'anthropic',
        apiKey,
        models: {
          default: 'claude-3-5-sonnet-20241022',
          fast: 'claude-3-haiku-20240307',
          smart: 'claude-3-5-sonnet-20241022',
        },
        limits: {
          maxTokens: 4096,
          rateLimit: 5000,
        },
      };

    case 'google':
      return {
        name: 'google',
        apiKey,
        models: {
          default: 'gemini-1.5-pro',
          fast: 'gemini-1.5-flash',
          smart: 'gemini-1.5-pro',
        },
        limits: {
          maxTokens: 4096,
          rateLimit: 2000,
        },
      };

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Make API call to specific provider
 */
async function callProvider(
  config: ProviderConfig,
  prompt: string,
  options: AIOptions,
): Promise<string> {
  const model = options.model || config.models.default;
  const maxTokens = Math.min(options.maxTokens || 1000, config.limits.maxTokens);
  const temperature = options.temperature ?? 0.7;

  switch (config.name) {
    case 'openai': {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({ apiKey: config.apiKey });

      const response = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      });

      return response.choices[0]?.message?.content || '';
    }

    case 'anthropic': {
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: config.apiKey });

      const response = await client.messages.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      });

      return response.content[0]?.type === 'text' ? response.content[0].text : '';
    }

    case 'google': {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const client = new GoogleGenerativeAI(config.apiKey);
      const genModel = client.getGenerativeModel({ model });

      const response = await genModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      });

      return response.response.text();
    }

    default:
      throw new Error(`Provider implementation not found: ${config.name}`);
  }
}

/**
 * Main AI provider wrapper with fallback logic
 */
export async function callAIProvider(
  provider: string,
  prompt: string,
  options: AIOptions = {},
): Promise<AIResponse> {
  const startTime = Date.now();
  let tenantContext;

  try {
    // Get tenant context for logging
    if (!options.tenantId || !options.userId) {
      tenantContext = await getCurrentTenantContext();
    }

    const tenantId = options.tenantId || tenantContext?.tenantId;
    const userId = options.userId || tenantContext?.userId;

    const config = getProviderConfig(provider);
    const timeoutMs = options.timeout || 30000;
    const retryCount = options.retryCount || 1;

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        logger.info(`[AI PROVIDER] Attempt ${attempt}/${retryCount} with ${provider}`);

        const response = await Promise.race([
          callProvider(config, prompt, options),
          timeout<string>(timeoutMs),
        ]);

        const duration = Date.now() - startTime;

        // Log successful execution
        if (options.agentId && tenantId && userId) {
          await logAgentExecution({
            agentId: options.agentId,
            tenantId,
            userId,
            input: { prompt: prompt.substring(0, 100) + '...' },
            output: { response: response.substring(0, 100) + '...' },
            duration,
            success: true,
            provider,
            model: options.model || config.models.default,
          });
        }

        return {
          success: true,
          data: response,
          provider,
          duration,
          fallbackUsed: false,
          metadata: {
            model: options.model || config.models.default,
            tokens: response.length, // Rough estimate
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`[AI PROVIDER] Attempt ${attempt} failed`, {
          error: lastError.message,
        });

        // Wait before retry (exponential backoff)
        if (attempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // Primary provider failed, try fallback
    if (options.fallbackProvider) {
      logger.info(`[AI PROVIDER] Trying fallback provider: ${options.fallbackProvider}`);

      try {
        const fallbackResult = await callAIProvider(options.fallbackProvider, prompt, {
          ...options,
          fallbackProvider: undefined, // Prevent infinite recursion
          retryCount: 1, // Single attempt for fallback
        });

        return {
          ...fallbackResult,
          fallbackUsed: true,
        };
      } catch (fallbackError) {
        logger.error(`[AI PROVIDER] Fallback also failed`, fallbackError);
      }
    }

    // All attempts failed
    const duration = Date.now() - startTime;
    const errorMessage = lastError?.message || 'Unknown error occurred';

    // Log failed execution
    if (options.agentId && tenantId && userId) {
      await logAgentExecution({
        agentId: options.agentId,
        tenantId,
        userId,
        input: { prompt: prompt.substring(0, 100) + '...' },
        output: { error: errorMessage },
        duration,
        success: false,
        provider,
        model: options.model || 'unknown',
      });
    }

    return {
      success: false,
      error: errorMessage,
      provider,
      duration,
      fallbackUsed: !!options.fallbackProvider,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(`[AI PROVIDER] Critical error`, error);

    return {
      success: false,
      error: errorMessage,
      provider,
      duration,
      fallbackUsed: false,
    };
  }
}

/**
 * Convenience function for agent execution with standard options
 */
export async function callAIForAgent(
  agentId: string,
  prompt: string,
  provider: 'openai' | 'anthropic' | 'google' = 'openai',
  options: Partial<AIOptions> = {},
): Promise<AIResponse> {
  try {
    const context = await getCurrentTenantContext();

    return callAIProvider(provider, prompt, {
      ...options,
      agentId,
      tenantId: context.tenantId,
      userId: context.userId,
      fallbackProvider: provider === 'openai' ? 'anthropic' : 'openai',
    });
  } catch (error) {
    return {
      success: false,
      error: `Failed to get tenant context: ${error instanceof Error ? error.message : String(error)}`,
      provider,
      duration: 0,
      fallbackUsed: false,
    };
  }
}

/**
 * Get available providers and their status
 */
export function getProviderStatus(): Record<string, boolean> {
  const providers = ['openai', 'anthropic', 'google'];
  const status: Record<string, boolean> = {};

  for (const provider of providers) {
    const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
    status[provider] = !!apiKey;
  }

  return status;
}
