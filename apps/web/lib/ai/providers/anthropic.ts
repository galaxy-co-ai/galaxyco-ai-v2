import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, ExecuteParams, ExecuteResult, Message } from '../types';

// Anthropic pricing per 1M tokens (as of Jan 2025)
const PRICING = {
  'claude-3-opus': { input: 15, output: 75 },
  'claude-3-sonnet': { input: 3, output: 15 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
};

export class AnthropicProvider implements AIProvider {
  readonly name = 'Anthropic';
  readonly supportedModels = ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'];
  
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  
  async execute(params: ExecuteParams): Promise<ExecuteResult> {
    const startTime = Date.now();
    
    try {
      // Anthropic requires system message separate from messages array
      const systemMessage = params.messages.find(m => m.role === 'system')?.content || '';
      const messages = params.messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      
      const response = await this.client.messages.create({
        model: params.model,
        system: systemMessage,
        messages,
        temperature: params.temperature ?? 1.0,
        max_tokens: params.maxTokens || 1024,
      });
      
      const latencyMs = Date.now() - startTime;
      
      const usage = {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      };
      
      const cost = this.calculateCost(params.model, usage.promptTokens, usage.completionTokens);
      
      const content = response.content[0]?.type === 'text' 
        ? response.content[0].text 
        : '';
      
      return {
        content,
        usage,
        latencyMs,
        cost,
        model: response.model,
        finishReason: response.stop_reason || undefined,
      };
    } catch (error: any) {
      throw new Error(`Anthropic execution failed: ${error.message}`);
    }
  }
  
  async validateConfig(): Promise<boolean> {
    try {
      // Make a minimal request to validate the API key
      await this.client.messages.create({
        model: 'claude-3-haiku',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
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
    const pricing = PRICING[model as keyof typeof PRICING] || PRICING['claude-3-sonnet'];
    
    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;
    
    return inputCost + outputCost;
  }
}
