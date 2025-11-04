import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AgentsModule } from './agents/agents.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [AgentsModule, WorkflowsModule, AnalyticsModule],
  controllers: [AppController],
})
export class AppModule {}
