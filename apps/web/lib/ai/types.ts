export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ExecuteParams {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ExecuteResult {
  content: string;
  usage: TokenUsage;
  latencyMs: number;
  cost: number; // in USD
  model: string;
  finishReason?: string;
}

export interface AIProvider {
  readonly name: string;
  readonly supportedModels: string[];

  /**
   * Execute an AI completion
   */
  execute(params: ExecuteParams): Promise<ExecuteResult>;

  /**
   * Validate configuration
   */
  validateConfig(): Promise<boolean>;

  /**
   * Estimate cost for a request (in USD)
   */
  estimateCost(params: ExecuteParams): number;
}

export type AIProviderType = 'openai' | 'anthropic' | 'google' | 'custom';
