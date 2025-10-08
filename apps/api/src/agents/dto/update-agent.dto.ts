import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @IsEnum(['draft', 'active', 'paused', 'archived'], {
    message: 'Status must be one of: draft, active, paused, archived',
  })
  @IsOptional()
  status?: 'draft' | 'active' | 'paused' | 'archived';
}
