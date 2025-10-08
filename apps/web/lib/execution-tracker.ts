import { db } from '@galaxyco/database';
import { agentExecutions, agents } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import type { ExecuteResult } from './ai/types';

export interface StartExecutionParams {
  agentId: string;
  workspaceId: string;
  userId: string;
  input: Record<string, any>;
  triggerType: 'manual' | 'webhook' | 'schedule' | 'event';
}

export interface CompleteExecutionParams {
  executionId: string;
  result: ExecuteResult;
  output: Record<string, any>;
}

export interface FailExecutionParams {
  executionId: string;
  error: Error;
}

/**
 * Start tracking an agent execution
 * Returns the execution ID
 */
export async function startExecution(params: StartExecutionParams): Promise<string> {
  const [execution] = await db
    .insert(agentExecutions)
    .values({
      workspaceId: params.workspaceId,
      agentId: params.agentId,
      triggeredBy: params.userId,
      input: params.input,
      status: 'running',
      startedAt: new Date(),
    })
    .returning({ id: agentExecutions.id });

  return execution.id;
}

/**
 * Mark execution as completed with results
 */
export async function completeExecution(params: CompleteExecutionParams): Promise<void> {
  const completedAt = new Date();

  await db
    .update(agentExecutions)
    .set({
      status: 'completed',
      output: params.output,
      durationMs: params.result.latencyMs,
      tokensUsed: params.result.usage.totalTokens,
      cost: Math.round(params.result.cost * 100), // Convert to cents
      completedAt,
    })
    .where(eq(agentExecutions.id, params.executionId));

  // Update agent's last executed timestamp and increment counter
  const execution = await db.query.agentExecutions.findFirst({
    where: eq(agentExecutions.id, params.executionId),
  });

  if (execution) {
    await db
      .update(agents)
      .set({
        lastExecutedAt: completedAt,
        executionCount: execution.agentId ? undefined : 0, // TODO: Increment properly
        updatedAt: new Date(),
      })
      .where(eq(agents.id, execution.agentId));
  }
}

/**
 * Mark execution as failed
 */
export async function failExecution(params: FailExecutionParams): Promise<void> {
  await db
    .update(agentExecutions)
    .set({
      status: 'failed',
      error: {
        message: params.error.message,
        code: params.error.name,
        stack: params.error.stack,
      },
      completedAt: new Date(),
    })
    .where(eq(agentExecutions.id, params.executionId));
}

/**
 * Get execution by ID
 */
export async function getExecution(executionId: string) {
  return await db.query.agentExecutions.findFirst({
    where: eq(agentExecutions.id, executionId),
  });
}

/**
 * List executions for an agent
 */
export async function listAgentExecutions(
  agentId: string,
  limit: number = 50
) {
  return await db.query.agentExecutions.findMany({
    where: eq(agentExecutions.agentId, agentId),
    orderBy: (executions, { desc }) => [desc(executions.createdAt)],
    limit,
  });
}

/**
 * Get execution statistics for an agent
 */
export async function getAgentStats(agentId: string) {
  const executions = await db.query.agentExecutions.findMany({
    where: eq(agentExecutions.agentId, agentId),
  });

  const total = executions.length;
  const completed = executions.filter(e => e.status === 'completed').length;
  const failed = executions.filter(e => e.status === 'failed').length;
  const totalTokens = executions.reduce((sum, e) => sum + (e.tokensUsed || 0), 0);
  const totalCost = executions.reduce((sum, e) => sum + (e.cost || 0), 0) / 100; // Convert cents to dollars
  const avgDuration = executions.length > 0
    ? executions.reduce((sum, e) => sum + (e.durationMs || 0), 0) / executions.length
    : 0;

  return {
    total,
    completed,
    failed,
    successRate: total > 0 ? (completed / total) * 100 : 0,
    totalTokens,
    totalCost,
    avgDuration: Math.round(avgDuration),
  };
}
