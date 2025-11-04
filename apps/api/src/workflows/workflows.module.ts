import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutorService } from './workflow-executor.service';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowExecutorService],
  exports: [WorkflowsService, WorkflowExecutorService],
})
export class WorkflowsModule {}

