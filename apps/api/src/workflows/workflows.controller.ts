import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutorService } from './workflow-executor.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { WorkspaceId } from '../decorators/workspace.decorator';

@Controller('workflows')
@UseGuards(AuthGuard)
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly executorService: WorkflowExecutorService,
  ) {}

  @Get(':id')
  async getWorkflow(@Param('id') id: string, @WorkspaceId() workspaceId: string) {
    return this.workflowsService.getWorkflow(id, workspaceId);
  }

  @Get()
  async listWorkflows(
    @WorkspaceId() workspaceId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.workflowsService.listWorkflows(workspaceId, {
      status,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Post(':id/execute')
  async executeWorkflow(
    @Param('id') id: string,
    @WorkspaceId() workspaceId: string,
    @User() userId: string,
    @Body() body: { input?: Record<string, any> },
  ) {
    return this.executorService.executeWorkflow(
      id,
      { workspaceId, userId, variables: {} },
      body.input || {},
    );
  }

  @Post(':id/validate')
  async validateWorkflow(@Param('id') id: string, @WorkspaceId() workspaceId: string) {
    return this.workflowsService.validateWorkflow(id, workspaceId);
  }

  @Get(':id/analytics')
  async getAnalytics(@Param('id') id: string, @WorkspaceId() workspaceId: string) {
    return this.workflowsService.getWorkflowAnalytics(id, workspaceId);
  }
}
