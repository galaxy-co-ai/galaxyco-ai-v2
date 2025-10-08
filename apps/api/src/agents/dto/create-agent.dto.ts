import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @MinLength(3, { message: 'Agent name must be at least 3 characters' })
  @MaxLength(50, { message: 'Agent name must not exceed 50 characters' })
  name!: string;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description!: string;

  @IsEnum(['scope', 'call', 'email', 'note', 'task', 'roadmap', 'content', 'custom'], {
    message: 'Invalid agent type',
  })
  type!: 'scope' | 'call' | 'email' | 'note' | 'task' | 'roadmap' | 'content' | 'custom';

  @IsEnum(['webhook', 'schedule', 'manual', 'event'], {
    message: 'Trigger must be one of: webhook, schedule, manual, event',
  })
  trigger!: 'webhook' | 'schedule' | 'manual' | 'event';

  @IsEnum(['openai', 'anthropic', 'custom'], {
    message: 'AI provider must be one of: openai, anthropic, custom',
  })
  @IsOptional()
  aiProvider?: 'openai' | 'anthropic' | 'custom';

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @MinLength(20, { message: 'System prompt must be at least 20 characters' })
  @MaxLength(2000, { message: 'System prompt must not exceed 2000 characters' })
  @IsOptional()
  systemPrompt?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Min(1)
  @Max(128000)
  @IsOptional()
  maxTokens?: number;

  @IsObject()
  @IsOptional()
  inputs?: Record<string, any>;

  @IsObject()
  @IsOptional()
  outputs?: Record<string, any>;

  @IsObject()
  @IsOptional()
  settings?: {
    timeout?: number;
    maxRetries?: number;
    rateLimit?: {
      requestsPerMinute?: number;
      requestsPerHour?: number;
    };
  };

  @IsOptional()
  @IsString()
  sourcePackId?: string;
}
