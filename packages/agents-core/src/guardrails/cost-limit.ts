/**
 * Cost Limit Guardrail
 * Prevents runaway execution by enforcing token, cost, and iteration limits
 */

import type { Guardrail, GuardrailResult, ExecutionContext } from '../types';

export interface CostLimitConfig {
  maxTokens?: number;
  maxCostUsd?: number;
  maxIterations?: number;
  timeoutMs?: number;
}

export function createCostLimitGuardrail(config: CostLimitConfig = {}): Guardrail {
  const { maxTokens = 100000, maxCostUsd = 1.0, maxIterations = 10, timeoutMs = 60000 } = config;

  return {
    name: 'cost-limit',
    description: 'Enforces token, cost, and iteration limits',
    type: 'cost',
    enabled: true,

    async check(input: any, context?: Record<string, any>): Promise<GuardrailResult> {
      const ctx = context as ExecutionContext & {
        tokensUsed?: number;
        costUsd?: number;
      };

      // Check iterations
      if (ctx?.iterations && ctx.iterations > maxIterations) {
        return {
          passed: false,
          action: 'block',
          reason: `Exceeded maximum iterations (${maxIterations})`,
          metadata: { iterations: ctx.iterations, maxIterations },
        };
      }

      // Check tokens
      if (ctx?.tokensUsed && ctx.tokensUsed > maxTokens) {
        return {
          passed: false,
          action: 'block',
          reason: `Exceeded maximum tokens (${maxTokens})`,
          metadata: { tokensUsed: ctx.tokensUsed, maxTokens },
        };
      }

      // Check cost
      if (ctx?.costUsd && ctx.costUsd > maxCostUsd) {
        return {
          passed: false,
          action: 'block',
          reason: `Exceeded maximum cost ($${maxCostUsd})`,
          metadata: { costUsd: ctx.costUsd, maxCostUsd },
        };
      }

      // Check timeout
      if (ctx?.startTime) {
        const elapsed = Date.now() - ctx.startTime.getTime();
        if (elapsed >= timeoutMs) {
          return {
            passed: false,
            action: 'block',
            reason: `Execution timeout (${timeoutMs}ms)`,
            metadata: { elapsedMs: elapsed, timeoutMs },
          };
        }
      }

      return { passed: true };
    },
  };
}
