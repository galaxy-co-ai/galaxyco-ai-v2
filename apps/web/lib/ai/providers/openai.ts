import OpenAI from 'openai';
import type { AIProvider, ExecuteParams, ExecuteResult } from '../types';

// OpenAI pricing per 1M tokens (as of Jan 2025)
const PRICING = {
  'gpt-4': { input: 30, output: 60 },
  'gpt-4-turbo': { input: 10, output: 30 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
};

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI';
  readonly supportedModels = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async execute(params: ExecuteParams): Promise<ExecuteResult> {
    const startTime = Date.now();

    try {
      const completion = await this.client.chat.completions.create({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 1.0,
        max_tokens: params.maxTokens,
        stream: false,
      });

      const latencyMs = Date.now() - startTime;

      const usage = {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      };

      const cost = this.calculateCost(params.model, usage.promptTokens, usage.completionTokens);

      return {
        content: completion.choices[0]?.message?.content || '',
        usage,
        latencyMs,
        cost,
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
      };
    } catch (error: any) {
      throw new Error(`OpenAI execution failed: ${error.message}`);
    }
  }

  async validateConfig(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  estimateCost(params: ExecuteParams): number {
    // Rough estimate: assume 1000 prompt tokens, 500 completion tokens
    const estimatedPromptTokens = 1000;
    const estimatedCompletionTokens = params.maxTokens || 500;
    return this.calculateCost(params.model, estimatedPromptTokens, estimatedCompletionTokens);
  }

  private calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const pricing = PRICING[model as keyof typeof PRICING] || PRICING['gpt-4-turbo'];

    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
  }
}
