/**
 * Agent Execution Logger
 *
 * Provides structured logging for all agent executions with:
 * - Performance metrics tracking
 * - Success/failure rates
 * - Tenant-scoped logging
 * - Database persistence
 * - Monitoring integration
 */

import { db } from "@galaxyco/database";
import { agentLogs } from "@galaxyco/database/schema";
import { and, eq, gte, desc } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";

export interface AgentLog {
  agentId: string;
  tenantId: string;
  userId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  duration: number;
  success: boolean;
  provider?: string;
  model?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageDuration: number;
  lastExecution?: Date;
  commonErrors?: string[];
}

/**
 * Summarize input/output for logging (truncate large objects)
 */
function summarizeData(data: any): string {
  try {
    const str = JSON.stringify(data);
    if (str.length > 500) {
      return str.substring(0, 497) + "...";
    }
    return str;
  } catch (error) {
    return "[Non-serializable data]";
  }
}

/**
 * Log agent execution with structured data
 */
export async function logAgentExecution(log: AgentLog): Promise<void> {
  const timestamp = new Date();

  const logEntry = {
    agentId: log.agentId,
    tenantId: log.tenantId,
    workspaceId: log.tenantId, // Use tenantId as workspaceId for compatibility
    userId: log.userId,
    inputSummary: summarizeData(log.input),
    outputSummary: summarizeData(log.output),
    duration: log.duration,
    success: log.success,
    provider: log.provider || "unknown",
    model: log.model || "unknown",
    error: log.error || null,
    metadata: log.metadata ? JSON.stringify(log.metadata) : null,
    timestamp,
  };

  try {
    // Store in database for analytics
    await db.insert(agentLogs).values(logEntry);

    // Structured console logging
    const logLevel = log.success ? "info" : "error";
    const logMessage = `[AGENT ${log.success ? "SUCCESS" : "FAILED"}]`;

    console[logLevel](logMessage, {
      agent_id: log.agentId,
      tenant_id: log.tenantId,
      user_id: log.userId,
      duration_ms: log.duration,
      success: log.success,
      provider: log.provider,
      model: log.model,
      error: log.error,
      timestamp: timestamp.toISOString(),
    });

    // Send performance metrics to Sentry
    if (log.success) {
      Sentry.addBreadcrumb({
        message: `Agent execution completed successfully`,
        category: "agent.execution",
        level: "info",
        data: {
          agentId: log.agentId,
          duration: log.duration,
          provider: log.provider,
        },
      });
    } else {
      // Log failures to Sentry for monitoring
      Sentry.withScope((scope) => {
        scope.setTag("agent.execution.failed", true);
        scope.setTag("agent.id", log.agentId);
        scope.setTag("agent.provider", log.provider || "unknown");
        scope.setContext("agent.execution", {
          agentId: log.agentId,
          tenantId: log.tenantId,
          userId: log.userId,
          duration: log.duration,
          provider: log.provider,
          model: log.model,
        });

        Sentry.captureException(
          new Error(log.error || "Agent execution failed"),
        );
      });
    }

    // Performance monitoring - alert on slow executions
    if (log.duration > 30000) {
      // 30 seconds
      console.warn("[AGENT PERFORMANCE] Slow execution detected", {
        agent_id: log.agentId,
        duration_ms: log.duration,
        provider: log.provider,
        threshold_exceeded: true,
      });

      Sentry.captureMessage(
        `Slow agent execution: ${log.agentId} took ${log.duration}ms`,
        "warning",
      );
    }
  } catch (error) {
    console.error("[AGENT LOGGER] Failed to log execution:", error);

    // Fallback: at least log to console if DB fails
    console[log.success ? "info" : "error"]("[AGENT FALLBACK LOG]", {
      agent_id: log.agentId,
      success: log.success,
      duration_ms: log.duration,
      error: log.error,
      db_error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get agent performance metrics
 */
export async function getAgentMetrics(
  agentId: string,
  tenantId: string,
  timeframe: "hour" | "day" | "week" | "month" = "day",
): Promise<AgentMetrics> {
  try {
    const timeframeMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    };

    const since = new Date(Date.now() - timeframeMs[timeframe]);

    // Get execution stats from database
    const executions = await db
      .select()
      .from(agentLogs)
      .where(
        and(
          eq(agentLogs.agentId, agentId),
          eq(agentLogs.tenantId, tenantId),
          gte(agentLogs.timestamp, since),
        ),
      )
      .orderBy(desc(agentLogs.timestamp));

    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter((e) => e.success).length;
    const failedExecutions = totalExecutions - successfulExecutions;
    const successRate =
      totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
    const averageDuration =
      totalExecutions > 0
        ? executions.reduce((sum, e) => sum + e.duration, 0) / totalExecutions
        : 0;

    // Get common error patterns
    const errors = executions
      .filter((e) => !e.success && e.error)
      .map((e) => e.error)
      .filter((error): error is string => error !== null);

    const errorCounts = errors.reduce(
      (acc, error) => {
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const commonErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([error]) => error);

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate,
      averageDuration,
      lastExecution: executions[0]?.timestamp,
      commonErrors: commonErrors.length > 0 ? commonErrors : undefined,
    };
  } catch (error) {
    console.error("[AGENT METRICS] Failed to get metrics:", error);
    throw new Error("Failed to retrieve agent metrics");
  }
}

/**
 * Get tenant-wide agent performance overview
 */
export async function getTenantAgentOverview(
  tenantId: string,
  timeframe: "day" | "week" | "month" = "day",
): Promise<Record<string, AgentMetrics>> {
  try {
    const timeframeMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    };

    const since = new Date(Date.now() - timeframeMs[timeframe]);

    // Get all executions for tenant
    const executions = await db
      .select()
      .from(agentLogs)
      .where(
        and(eq(agentLogs.tenantId, tenantId), gte(agentLogs.timestamp, since)),
      );

    // Group by agent ID
    const agentGroups = executions.reduce(
      (acc, execution) => {
        if (!acc[execution.agentId]) {
          acc[execution.agentId] = [];
        }
        acc[execution.agentId].push(execution);
        return acc;
      },
      {} as Record<string, typeof executions>,
    );

    // Calculate metrics for each agent
    const overview: Record<string, AgentMetrics> = {};

    for (const [agentId, agentExecutions] of Object.entries(agentGroups)) {
      const totalExecutions = agentExecutions.length;
      const successfulExecutions = agentExecutions.filter(
        (e) => e.success,
      ).length;
      const failedExecutions = totalExecutions - successfulExecutions;
      const successRate = (successfulExecutions / totalExecutions) * 100;
      const averageDuration =
        agentExecutions.reduce((sum, e) => sum + e.duration, 0) /
        totalExecutions;

      overview[agentId] = {
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        successRate,
        averageDuration,
        lastExecution: new Date(
          Math.max(...agentExecutions.map((e) => e.timestamp.getTime())),
        ),
      };
    }

    return overview;
  } catch (error) {
    console.error("[TENANT OVERVIEW] Failed to get overview:", error);
    throw new Error("Failed to retrieve tenant agent overview");
  }
}

/**
 * Log agent configuration changes
 */
export async function logAgentConfigChange(
  agentId: string,
  tenantId: string,
  userId: string,
  changes: Record<string, { old: any; new: any }>,
): Promise<void> {
  try {
    console.info("[AGENT CONFIG] Configuration updated", {
      agent_id: agentId,
      tenant_id: tenantId,
      user_id: userId,
      changes: Object.keys(changes),
      timestamp: new Date().toISOString(),
    });

    Sentry.addBreadcrumb({
      message: `Agent configuration updated`,
      category: "agent.config",
      level: "info",
      data: {
        agentId,
        changedFields: Object.keys(changes),
      },
    });
  } catch (error) {
    console.error("[AGENT CONFIG LOG] Failed to log config change:", error);
  }
}
