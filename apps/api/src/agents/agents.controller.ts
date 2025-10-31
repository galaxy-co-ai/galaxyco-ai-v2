import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import type { AuthenticatedUser } from '../decorators/user.decorator';
import { WorkspaceId } from '../decorators/workspace.decorator';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { TestAgentDto } from './dto/test-agent.dto';

@Controller('agents')
@UseGuards(AuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}
  // AgentsService is used in all methods below

  /**
   * Create a new agent
   * POST /agents
   */
  @Post()
  async create(
    @Body(ValidationPipe) createAgentDto: CreateAgentDto,
    @User() user: AuthenticatedUser,
    @WorkspaceId() workspaceId: string,
  ) {
    return this.agentsService.create(createAgentDto, user.id, workspaceId);
  }

  /**
   * List all agents with optional filters
   * GET /agents?status=active&search=email&limit=10&offset=0
   */
  @Get()
  async findAll(
    @WorkspaceId() workspaceId: string,
    @Query('status') status?: 'draft' | 'active' | 'paused' | 'archived',
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.agentsService.findAll(workspaceId, {
      status,
      search,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  /**
   * Get single agent by ID
   * GET /agents/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @WorkspaceId() workspaceId: string) {
    return this.agentsService.findOne(id, workspaceId);
  }

  /**
   * Update an agent
   * PUT /agents/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAgentDto: UpdateAgentDto,
    @WorkspaceId() workspaceId: string,
  ) {
    return this.agentsService.update(id, updateAgentDto, workspaceId);
  }

  /**
   * Delete (archive) an agent
   * DELETE /agents/:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @WorkspaceId() workspaceId: string) {
    return this.agentsService.remove(id, workspaceId);
  }

  /**
   * Test agent execution
   * POST /agents/:id/test
   */
  @Post(':id/test')
  async test(
    @Param('id') id: string,
    @Body(ValidationPipe) testDto: TestAgentDto,
    @WorkspaceId() workspaceId: string,
  ) {
    return this.agentsService.test(id, testDto, workspaceId);
  }

  /**
   * Health check (unprotected for monitoring)
   */
  @Get('_health')
  async health() {
    return {
      status: 'ok',
      service: 'agents-controller',
      timestamp: new Date().toISOString(),
    };
  }
}
