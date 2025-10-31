import { IsObject, IsEnum, IsOptional } from 'class-validator';

export class TestAgentDto {
  @IsObject()
  inputs!: Record<string, any>;

  @IsEnum(['mock', 'live'], {
    message: 'Mode must be either "mock" or "live"',
  })
  @IsOptional()
  mode?: 'mock' | 'live';
}

export interface TestResult {
  id: string;
  timestamp: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  success: boolean;
  error?: string;
  metrics: {
    durationMs: number;
    tokensUsed: number;
    costUsd: number;
    model?: string;
  };
}

// Python service response type
export interface PythonServiceResponse {
  execution_id: string;
  success: boolean;
  outputs: Record<string, any>;
  error?: string;
  metrics: {
    duration_ms: number;
    tokens_used?: number;
    cost_usd?: number;
    model?: string;
  };
}
