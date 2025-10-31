import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';
import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['scope', 'call', 'email', 'note', 'task', 'roadmap', 'content', 'custom'])
  type?: 'scope' | 'call' | 'email' | 'note' | 'task' | 'roadmap' | 'content' | 'custom';

  @IsOptional()
  @IsEnum(['openai', 'anthropic', 'custom'])
  aiProvider?: 'openai' | 'anthropic' | 'custom';

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  maxTokens?: number;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsEnum(['draft', 'active', 'paused', 'archived'], {
    message: 'Status must be one of: draft, active, paused, archived',
  })
  @IsOptional()
  status?: 'draft' | 'active' | 'paused' | 'archived';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
