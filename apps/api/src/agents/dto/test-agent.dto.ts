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
  };
}
