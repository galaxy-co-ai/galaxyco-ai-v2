import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../guards/auth.guard';
import { WorkspaceId } from '../decorators/workspace.decorator';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  async getSalesAnalytics(
    @Workspace() workspaceId: string,
    @Query('timeRange') timeRange: '7d' | '30d' | '90d' = '30d'
  ) {
    return this.analyticsService.getSalesAnalytics(workspaceId, timeRange);
  }

  @Get('agents')
  async getAgentAnalytics(
    @Workspace() workspaceId: string,
    @Query('timeRange') timeRange: '7d' | '30d' | '90d' = '30d'
  ) {
    return this.analyticsService.getAgentAnalytics(workspaceId, timeRange);
  }

  @Get('workflows')
  async getWorkflowAnalytics(
    @Workspace() workspaceId: string,
    @Query('timeRange') timeRange: '7d' | '30d' | '90d' = '30d'
  ) {
    return this.analyticsService.getWorkflowAnalytics(workspaceId, timeRange);
  }

  @Get('usage')
  async getUsageAnalytics(@Workspace() workspaceId: string) {
    return this.analyticsService.getUsageAnalytics(workspaceId);
  }
}

