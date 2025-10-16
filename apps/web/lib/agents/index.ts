/**
 * Agent Infrastructure - Central Exports
 *
 * This file provides the main entry point for the agent infrastructure,
 * implementing the standardized interface per rule OyCoQzeTnn2qmcEcvGl6v7.
 */

// Core interfaces and base classes
export * from "./agent-interface";
export * from "./ai-provider-wrapper";
export * from "./agent-logger";

// Example agents
export * from "./examples/email-agent";

// Re-export commonly used types for convenience
export type {
  AIProvider,
  AIModel,
  AIRequest,
  AIResponse,
  ProviderConfig,
  AIProviderOptions,
} from "./ai-provider-wrapper";

export type {
  AgentTriggerType,
  AgentTrigger,
  AgentInput,
  AgentOutput,
  AgentExecutionContext,
  AgentExecutionResult,
} from "./agent-interface";

export type { AgentLog, AgentMetrics } from "./agent-logger";

// Utility functions
export {
  createAIProvider,
  getProviderConfigFromEnv,
  validateProviderConfig,
} from "./ai-provider-wrapper";

export {
  logAgentExecution,
  getAgentMetrics,
  getTenantAgentOverview,
  logAgentConfigChange,
} from "./agent-logger";

export { AgentRegistry } from "./agent-interface";

// Health check functions (stubs for now)
export async function quickHealthCheck() {
  return {
    healthy: true,
    agentCount: 0,
    issues: [],
  };
}

export async function runAgentTests() {
  return {
    totalAgents: 0,
    passedTests: 0,
    failedTests: 0,
    summary: {
      overallSuccess: true,
    },
    results: [],
  };
}

export function generateTestReport(testResults: any) {
  return `# Agent Test Report\n\nNo tests were run.\n`;
}
