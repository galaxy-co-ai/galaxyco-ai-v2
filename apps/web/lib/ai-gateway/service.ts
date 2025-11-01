import { generateText, streamText } from 'ai';
import {
  getModelInstance,
  getProviderFromModel,
  calculateCost,
  DEFAULT_SETTINGS,
  isModelSupported,
} from './config';
import type {
  AIGatewayRequest,
  AIGatewayResponse,
  AIGatewayStreamResponse,
  AIGatewayLog,
} from './types';
import { logger } from '@/lib/utils/logger';

/**
 * AI Gateway Service
 * Central service for all AI provider calls with logging, error handling, and monitoring
 */
export class AIGatewayService {
  /**
   * Execute a text generation request
   */
  static async generateText(request: AIGatewayRequest): Promise<AIGatewayResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Validate model
      if (!isModelSupported(request.model)) {
        throw new Error(`Unsupported model: ${request.model}`);
      }

      // Get provider and model instance
      const provider = getProviderFromModel(request.model);
      const modelInstance = getModelInstance(request.model);

      // Prepare messages
      const messages = request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Execute AI call
      const result = await generateText({
        model: modelInstance,
        messages,
        temperature: request.temperature ?? DEFAULT_SETTINGS.temperature,
        maxOutputTokens: request.maxTokens ?? DEFAULT_SETTINGS.maxTokens,
        topP: request.topP ?? DEFAULT_SETTINGS.topP,
      });

      const latencyMs = Date.now() - startTime;

      // Calculate cost
      const promptTokens = (result.usage as any).promptTokens || 0;
      const completionTokens = (result.usage as any).completionTokens || 0;
      const cost = calculateCost(request.model, promptTokens, completionTokens);

      // Prepare response
      const response: AIGatewayResponse = {
        requestId,
        content: result.text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: result.usage.totalTokens || promptTokens + completionTokens,
        },
        latencyMs,
        cost,
        model: request.model,
        provider,
        finishReason: result.finishReason,
        timestamp: new Date().toISOString(),
      };

      // Log the request
      await this.logRequest({
        requestId,
        tenantId: request.tenantId,
        userId: request.userId,
        agentId: request.agentId,
        model: request.model,
        provider,
        promptTokens,
        completionTokens,
        totalTokens: result.usage.totalTokens || promptTokens + completionTokens,
        latencyMs,
        cost,
        success: true,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      // Log error
      await this.logRequest({
        requestId,
        tenantId: request.tenantId,
        userId: request.userId,
        agentId: request.agentId,
        model: request.model,
        provider: getProviderFromModel(request.model),
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs,
        cost: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw new Error(`AI Gateway Error: ${error.message}`);
    }
  }

  /**
   * Execute a streaming text generation request
   */
  static async generateTextStream(request: AIGatewayRequest): Promise<AIGatewayStreamResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Validate model
      if (!isModelSupported(request.model)) {
        throw new Error(`Unsupported model: ${request.model}`);
      }

      // Get provider and model instance
      const provider = getProviderFromModel(request.model);
      const modelInstance = getModelInstance(request.model);

      // Prepare messages
      const messages = request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Execute streaming AI call
      const result = await streamText({
        model: modelInstance,
        messages,
        temperature: request.temperature ?? DEFAULT_SETTINGS.temperature,
        maxOutputTokens: request.maxTokens ?? DEFAULT_SETTINGS.maxTokens,
        topP: request.topP ?? DEFAULT_SETTINGS.topP,
      });

      return {
        requestId,
        stream: result.textStream,
        provider,
        model: request.model,
        onFinish: async (finalResult) => {
          const latencyMs = Date.now() - startTime;
          const promptTokens = (finalResult.usage as any).promptTokens || 0;
          const completionTokens = (finalResult.usage as any).completionTokens || 0;
          const totalTokens = finalResult.usage.totalTokens || promptTokens + completionTokens;
          const cost = calculateCost(request.model, promptTokens, completionTokens);

          // Log the completed stream
          await this.logRequest({
            requestId,
            tenantId: request.tenantId,
            userId: request.userId,
            agentId: request.agentId,
            model: request.model,
            provider,
            promptTokens,
            completionTokens,
            totalTokens,
            latencyMs,
            cost,
            success: true,
            timestamp: new Date().toISOString(),
          });
        },
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      // Log error
      await this.logRequest({
        requestId,
        tenantId: request.tenantId,
        userId: request.userId,
        agentId: request.agentId,
        model: request.model,
        provider: getProviderFromModel(request.model),
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs,
        cost: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw new Error(`AI Gateway Stream Error: ${error.message}`);
    }
  }

  /**
   * Log AI request to database or monitoring service
   */
  private static async logRequest(log: AIGatewayLog): Promise<void> {
    try {
      // TODO: Store in database (ai_gateway_logs table)
      // For now, log to console in development
      if (process.env.NODE_ENV === 'development') {
        logger.info('AI Gateway request completed', {
          requestId: log.requestId,
          tenantId: log.tenantId,
          userId: log.userId,
          agentId: log.agentId,
          model: log.model,
          provider: log.provider,
          latencyMs: log.latencyMs,
          cost: `$${log.cost.toFixed(6)}`,
          tokens: log.totalTokens,
          success: log.success,
          error: log.error,
        });
      }

      // In production, you could send to external monitoring
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to monitoring service (e.g., Sentry, DataDog)
        // await sendToMonitoring(log);
      }
    } catch (error) {
      // Don't fail the request if logging fails
      logger.error('AI Gateway failed to log request', {
        error: error instanceof Error ? error.message : String(error),
        requestId: log.requestId,
      });
    }
  }

  /**
   * Generate unique request ID
   */
  private static generateRequestId(): string {
    return `aigw_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Validate API keys for all providers
   */
  static async validateProviders(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};

    // Test OpenAI
    try {
      const openaiKey = process.env.OPENAI_API_KEY;
      results.openai = !!openaiKey && openaiKey.length > 0;
    } catch {
      results.openai = false;
    }

    // Test Anthropic
    try {
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      results.anthropic = !!anthropicKey && anthropicKey.length > 0;
    } catch {
      results.anthropic = false;
    }

    // Test Google
    try {
      const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      results.google = !!googleKey && googleKey.length > 0;
    } catch {
      results.google = false;
    }

    return results;
  }
}
