/**
 * AI Gateway Type Definitions
 */

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGatewayRequest {
  // Identification
  tenantId: string;
  userId?: string;
  agentId?: string;

  // Model configuration
  model: string;
  messages: Message[];

  // Optional parameters
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;

  // Metadata
  metadata?: Record<string, any>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIGatewayResponse {
  requestId: string;
  content: string;
  usage: TokenUsage;
  latencyMs: number;
  cost: number; // in USD
  model: string;
  provider: string;
  finishReason?: string;
  timestamp: string;
}

export interface AIGatewayStreamResponse {
  requestId: string;
  stream: ReadableStream<string>;
  provider: string;
  model: string;
  onFinish: (result: any) => Promise<void>;
}

export interface AIGatewayLog {
  requestId: string;
  tenantId: string;
  userId?: string;
  agentId?: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  cost: number;
  success: boolean;
  error?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ProviderStatus {
  provider: string;
  available: boolean;
  lastChecked: string;
  error?: string;
}

export interface GatewayMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalCost: number;
  totalTokens: number;
  averageLatencyMs: number;
  requestsByProvider: Record<string, number>;
  requestsByModel: Record<string, number>;
}
