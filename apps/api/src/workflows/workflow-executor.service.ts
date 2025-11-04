import { Injectable } from '@nestjs/common';
import { db } from '@galaxyco/database';
import { gridExecutions, executionSteps, gridNodes } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

interface ExecutionContext {
  workspaceId: string;
  userId: string;
  variables: Record<string, any>;
}

@Injectable()
export class WorkflowExecutorService {
  /**
   * Execute a workflow
   *
   * This is the heavy processing that should NOT happen in Next.js
   */
  async executeWorkflow(
    workflowId: string,
    context: ExecutionContext,
    input: Record<string, any>,
  ): Promise<{ executionId: string; status: string; output: any }> {
    // Create execution record
    const [execution] = await db
      .insert(gridExecutions)
      .values({
        workspaceId: context.workspaceId,
        gridId: workflowId,
        status: 'running',
        triggerType: 'manual',
        triggerData: { userId: context.userId },
        input,
        startedAt: new Date(),
      })
      .returning();

    try {
      // Get workflow nodes
      const nodes = await db.select().from(gridNodes).where(eq(gridNodes.gridId, workflowId));

      // Execute nodes in order
      const output = await this.executeNodes(execution.id, nodes, input, context);

      // Mark execution complete
      await db
        .update(gridExecutions)
        .set({
          status: 'completed',
          output,
          completedAt: new Date(),
          durationMs: Date.now() - new Date(execution.startedAt!).getTime(),
        })
        .where(eq(gridExecutions.id, execution.id));

      return {
        executionId: execution.id,
        status: 'completed',
        output,
      };
    } catch (error) {
      // Mark execution failed
      await db
        .update(gridExecutions)
        .set({
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
          durationMs: Date.now() - new Date(execution.startedAt!).getTime(),
        })
        .where(eq(gridExecutions.id, execution.id));

      throw error;
    }
  }

  /**
   * Execute workflow nodes
   */
  private async executeNodes(
    executionId: string,
    nodes: any[],
    input: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    const results: Record<string, any> = {};
    let stepIndex = 0;

    // Find start node
    const startNode = nodes.find((n) => n.nodeType === 'trigger');
    if (!startNode) {
      throw new Error('No trigger node found');
    }

    // Execute nodes (simplified - would need proper graph traversal)
    for (const node of nodes) {
      const stepStartTime = Date.now();

      try {
        // Create execution step record
        await db.insert(executionSteps).values({
          executionId,
          nodeId: node.id,
          stepIndex: stepIndex++,
          status: 'running',
          inputData: input,
          startedAt: new Date(),
        });

        // Execute node (stub - real implementation would call integrations)
        const output = await this.executeNode(node, input, context);

        // Update step as completed
        await db
          .update(executionSteps)
          .set({
            status: 'success',
            outputData: output,
            completedAt: new Date(),
            durationMs: Date.now() - stepStartTime,
          })
          .where(
            and(eq(executionSteps.executionId, executionId), eq(executionSteps.nodeId, node.id)),
          );

        results[node.id] = output;
      } catch (error) {
        // Update step as failed
        await db
          .update(executionSteps)
          .set({
            status: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            completedAt: new Date(),
            durationMs: Date.now() - stepStartTime,
          })
          .where(
            and(eq(executionSteps.executionId, executionId), eq(executionSteps.nodeId, node.id)),
          );

        throw error;
      }
    }

    return results;
  }

  /**
   * Execute individual node
   */
  private async executeNode(
    node: any,
    input: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    // Node execution logic based on type
    switch (node.nodeType) {
      case 'trigger':
        return input;

      case 'action':
        // Execute action based on node.config
        return { result: 'action executed' };

      case 'condition':
        // Evaluate condition based on node.config
        return { passed: true };

      case 'ai':
        // Call AI provider based on node.config
        return { response: 'AI response' };

      case 'webhook':
        // Call webhook based on node.config
        return { status: 'sent' };

      case 'integration':
        // Call integration based on node.config
        return { data: 'integration result' };

      default:
        return { result: 'default' };
    }
  }

  /**
   * Stop a running workflow
   */
  async stopExecution(executionId: string, workspaceId: string): Promise<void> {
    await db
      .update(gridExecutions)
      .set({
        status: 'cancelled',
        completedAt: new Date(),
      })
      .where(and(eq(gridExecutions.id, executionId), eq(gridExecutions.workspaceId, workspaceId)));
  }
}
