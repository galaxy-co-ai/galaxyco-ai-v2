/**
 * AI Provider Wrapper
 *
 * Standardized interface for all AI providers with:
 * - Error handling and retries
 * - Fallback provider logic
 * - Request/response logging
 * - Performance monitoring
 * - Token usage tracking
 */

import * as Sentry from "@sentry/nextjs";
import { logAgentExecution } from "./agent-logger";
import { logger } from "@/lib/utils/logger";

export type AIProvider = "openai" | "anthropic" | "google" | "custom";
export type AIModel =
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "claude-3-sonnet"
  | "claude-3-haiku"
  | "claude-3-opus"
  | "gemini-pro"
  | "gemini-ultra"
  | string; // Allow custom model names

export interface AIRequest {
  model: AIModel;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: any[];
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  toolCalls?: any[];
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface AIProviderOptions {
  agentId: string;
  tenantId: string;
  userId: string;
  primary: {
    provider: AIProvider;
    config: ProviderConfig;
  };
  fallback?: {
    provider: AIProvider;
    config: ProviderConfig;
  };
}

/**
 * Centralized AI Provider Wrapper
 *
 * This class handles all AI provider interactions with built-in:
 * - Error handling and retries
 * - Fallback to secondary providers
 * - Performance monitoring
 * - Usage tracking and logging
 */
export class AIProviderWrapper {
  private options: AIProviderOptions;
  private requestCount = 0;

  constructor(options: AIProviderOptions) {
    this.options = options;
  }

  /**
   * Send a request to the AI provider with full error handling
   */
  async sendRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = `${this.options.agentId}-${++this.requestCount}-${Date.now()}`;

    let lastError: Error | null = null;
    let response: AIResponse | null = null;

    // Try primary provider
    try {
      logger.info("[AI PROVIDER] Attempting primary provider", {
        request_id: requestId,
        agent_id: this.options.agentId,
        provider: this.options.primary.provider,
        model: request.model,
      });

      response = await this.callProvider(
        this.options.primary.provider,
        this.options.primary.config,
        request,
      );

      const duration = Date.now() - startTime;

      // Log successful execution
      await this.logExecution({
        success: true,
        duration,
        provider: this.options.primary.provider,
        model: request.model,
        input: { model: request.model, messages: request.messages },
        output: { content: response.content, usage: response.usage },
      });

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      logger.warn(
        "[AI PROVIDER] Primary provider failed, attempting fallback",
        {
          request_id: requestId,
          primary_provider: this.options.primary.provider,
          error: lastError.message,
          fallback_available: !!this.options.fallback,
        },
      );

      // Try fallback provider if available
      if (this.options.fallback) {
        try {
          response = await this.callProvider(
            this.options.fallback.provider,
            this.options.fallback.config,
            request,
          );

          const duration = Date.now() - startTime;

          // Log fallback success
          await this.logExecution({
            success: true,
            duration,
            provider: this.options.fallback.provider,
            model: request.model,
            input: { model: request.model, messages: request.messages },
            output: { content: response.content, usage: response.usage },
            metadata: {
              fallback_used: true,
              primary_error: lastError.message,
            },
          });

          return response;
        } catch (fallbackError) {
          lastError =
            fallbackError instanceof Error
              ? fallbackError
              : new Error(String(fallbackError));

          logger.error("[AI PROVIDER] Both providers failed", fallbackError, {
            request_id: requestId,
            primary_error:
              error instanceof Error ? error.message : String(error),
            fallback_error: lastError.message,
          });
        }
      }

      // Both providers failed - log and throw
      const duration = Date.now() - startTime;

      await this.logExecution({
        success: false,
        duration,
        provider: this.options.primary.provider,
        model: request.model,
        input: { model: request.model, messages: request.messages },
        output: {},
        error: lastError.message,
        metadata: {
          fallback_attempted: !!this.options.fallback,
          fallback_available: !!this.options.fallback,
        },
      });

      // Send error to Sentry for monitoring
      Sentry.withScope((scope) => {
        scope.setTag("ai.provider.failed", true);
        scope.setTag("ai.primary.provider", this.options.primary.provider);
        scope.setTag("ai.fallback.provider", this.options.fallback?.provider);
        scope.setContext("ai.request", {
          agentId: this.options.agentId,
          model: request.model,
          hasMessages: request.messages.length > 0,
          temperature: request.temperature,
        });

        Sentry.captureException(lastError);
      });

      throw new Error(`AI Provider request failed: ${lastError.message}`);
    }
  }

  /**
   * Call specific AI provider
   */
  private async callProvider(
    provider: AIProvider,
    config: ProviderConfig,
    request: AIRequest,
  ): Promise<AIResponse> {
    const timeout = config.timeout || 30000; // 30 second default
    const maxRetries = config.maxRetries || 2;
    const retryDelay = config.retryDelay || 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response: AIResponse;

        switch (provider) {
          case "openai":
            response = await this.callOpenAI(
              config,
              request,
              controller.signal,
            );
            break;
          case "anthropic":
            response = await this.callAnthropic(
              config,
              request,
              controller.signal,
            );
            break;
          case "google":
            response = await this.callGoogle(
              config,
              request,
              controller.signal,
            );
            break;
          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        logger.warn("[AI PROVIDER] Request attempt failed", {
          provider,
          attempt,
          max_retries: maxRetries,
          error: errorMessage,
          will_retry: attempt < maxRetries,
        });

        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
      }
    }

    throw new Error("Maximum retries exceeded");
  }

  /**
   * OpenAI API integration
   */
  private async callOpenAI(
    config: ProviderConfig,
    request: AIRequest,
    signal: AbortSignal,
  ): Promise<AIResponse> {
    const url = config.baseUrl || "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens,
        stream: false, // For simplicity, we'll handle streaming separately
        tools: request.tools,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0]?.message?.content || "",
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      finishReason: data.choices[0]?.finish_reason,
      toolCalls: data.choices[0]?.message?.tool_calls,
    };
  }

  /**
   * Anthropic Claude API integration
   */
  private async callAnthropic(
    config: ProviderConfig,
    request: AIRequest,
    signal: AbortSignal,
  ): Promise<AIResponse> {
    const url = config.baseUrl || "https://api.anthropic.com/v1/messages";

    // Convert OpenAI format to Anthropic format
    const systemMessage = request.messages.find((m) => m.role === "system");
    const messages = request.messages.filter((m) => m.role !== "system");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: request.model,
        system: systemMessage?.content,
        messages: messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return {
      content: data.content[0]?.text || "",
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens:
              (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
          }
        : undefined,
      finishReason: data.stop_reason,
    };
  }

  /**
   * Google Gemini API integration
   */
  private async callGoogle(
    config: ProviderConfig,
    request: AIRequest,
    signal: AbortSignal,
  ): Promise<AIResponse> {
    // Simplified Google implementation - you can expand this
    throw new Error("Google Gemini integration not yet implemented");
  }

  /**
   * Log execution to the centralized logger
   */
  private async logExecution(data: {
    success: boolean;
    duration: number;
    provider: string;
    model: string;
    input: Record<string, any>;
    output: Record<string, any>;
    error?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      await logAgentExecution({
        agentId: this.options.agentId,
        tenantId: this.options.tenantId,
        userId: this.options.userId,
        input: data.input,
        output: data.output,
        duration: data.duration,
        success: data.success,
        provider: data.provider,
        model: data.model,
        error: data.error,
        metadata: data.metadata,
      });
    } catch (logError) {
      console.error("[AI PROVIDER] Failed to log execution:", logError);
      // Don't throw - logging failure shouldn't break the agent
    }
  }
}

/**
 * Factory function to create AI provider wrapper
 */
export function createAIProvider(
  options: AIProviderOptions,
): AIProviderWrapper {
  return new AIProviderWrapper(options);
}

/**
 * Helper to get provider configuration from environment variables
 */
export function getProviderConfigFromEnv(
  provider: AIProvider,
): ProviderConfig | null {
  switch (provider) {
    case "openai":
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) return null;
      return {
        apiKey: openaiKey,
        baseUrl: process.env.OPENAI_BASE_URL,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
      };

    case "anthropic":
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) return null;
      return {
        apiKey: anthropicKey,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
      };

    case "google":
      const googleKey = process.env.GOOGLE_AI_KEY;
      if (!googleKey) return null;
      return {
        apiKey: googleKey,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
      };

    default:
      return null;
  }
}

/**
 * Helper to validate provider configuration
 */
export function validateProviderConfig(
  provider: AIProvider,
  config: ProviderConfig,
): boolean {
  if (!config.apiKey) {
    console.error(`[AI PROVIDER] Missing API key for ${provider}`);
    return false;
  }

  return true;
}
