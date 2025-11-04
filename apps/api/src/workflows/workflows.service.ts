import { Injectable } from '@nestjs/common';
import { db } from '@galaxyco/database';
import { galaxyGrids, gridExecutions } from '@galaxyco/database/schema';
import { eq, and, desc } from 'drizzle-orm';

interface ListWorkflowsOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class WorkflowsService {
  /**
   * Get a single workflow by ID
   */
  async getWorkflow(id: string, workspaceId: string) {
    const [workflow] = await db
      .select()
      .from(galaxyGrids)
      .where(and(eq(galaxyGrids.id, id), eq(galaxyGrids.workspaceId, workspaceId)))
      .limit(1);

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return workflow;
  }

  /**
   * List workflows for a workspace with optional filters
   */
  async listWorkflows(workspaceId: string, options: ListWorkflowsOptions = {}) {
    const { status, limit = 50, offset = 0 } = options;

    let query = db
      .select()
      .from(galaxyGrids)
      .where(eq(galaxyGrids.workspaceId, workspaceId))
      .orderBy(desc(galaxyGrids.updatedAt))
      .limit(limit)
      .offset(offset);

    // Apply status filter if provided
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      query = db
        .select()
        .from(galaxyGrids)
        .where(
          and(
            eq(galaxyGrids.workspaceId, workspaceId),
            eq(galaxyGrids.status, status as 'draft' | 'published' | 'archived'),
          ),
        )
        .orderBy(desc(galaxyGrids.updatedAt))
        .limit(limit)
        .offset(offset);
    }

    const workflows = await query;

    // Get total count
    const totalCountQuery = db
      .select()
      .from(galaxyGrids)
      .where(eq(galaxyGrids.workspaceId, workspaceId));

    const totalWorkflows = await totalCountQuery;
    const total = totalWorkflows.length;

    return {
      workflows,
      total,
      limit,
      offset,
    };
  }

  /**
   * Validate a workflow structure
   */
  async validateWorkflow(id: string, workspaceId: string) {
    const workflow = await this.getWorkflow(id, workspaceId);

    // Basic validation checks
    const errors: string[] = [];

    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push('Workflow name is required');
    }

    if (!workflow.viewport) {
      errors.push('Workflow viewport is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get analytics for a specific workflow
   */
  async getWorkflowAnalytics(id: string, workspaceId: string) {
    // Verify workflow exists and belongs to workspace
    await this.getWorkflow(id, workspaceId);

    // Get execution stats
    const executions = await db
      .select()
      .from(gridExecutions)
      .where(and(eq(gridExecutions.gridId, id), eq(gridExecutions.workspaceId, workspaceId)));

    const total = executions.length;
    const completed = executions.filter((e) => e.status === 'completed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const running = executions.filter((e) => e.status === 'running').length;

    const avgDuration =
      executions
        .filter((e) => e.durationMs)
        .reduce((sum, e) => sum + (e.durationMs || 0), 0) /
      executions.filter((e) => e.durationMs).length || 0;

    return {
      workflowId: id,
      executions: {
        total,
        completed,
        failed,
        running,
        successRate: total > 0 ? (completed / total) * 100 : 0,
      },
      performance: {
        avgDurationMs: Math.round(avgDuration),
      },
    };
  }
}

