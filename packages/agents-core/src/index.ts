/**
 * @galaxyco/agents-core
 * Core agent execution engine following OpenAI Agent SDK patterns
 */

// Core classes
export { Agent } from "./agent";
export { Runner } from "./runner";

// Tool system
export { createTool, functionTool, extractTool, ToolRegistry } from "./tools";

// Types
export type {
  // Messages
  Message,
  MessageRole,
  UserMessage,
  AssistantMessage,
  SystemMessage,
  ToolMessage,

  // Tools
  Tool,
  ToolCall,
  ToolDefinition,
  // ToolCategory exported separately from tools/index
  ToolMetadata,

  // Agent
  Agent as IAgent,
  AgentConfig,

  // Runner
  RunOptions,
  RunResult,

  // Guardrails
  Guardrail,
  GuardrailResult,
  GuardrailConfig,

  // Handoffs
  Handoff,
  HandoffResult,

  // Context
  ExecutionContext,
} from "./types";

// Errors
export {
  AgentError,
  GuardrailError,
  ToolExecutionError,
  MaxIterationsError,
} from "./types";

// Execution Service
export { AgentExecutionService } from "./execution-service";
export type {
  DbAgent,
  ExecutionRequest,
  ExecutionResult,
} from "./execution-service";

// Guardrails
export {
  createInputSafetyGuardrail,
  createOutputValidationGuardrail,
  createCostLimitGuardrail,
  createToolApprovalGuardrail,
} from "./guardrails";
export type {
  InputSafetyConfig,
  CostLimitConfig,
  ToolApprovalConfig,
} from "./guardrails";

// Tools (only database tools implemented so far)
export {
  getAllTools,
  getToolsByCategory,
  getToolsForAgentType,
  ToolCategory,
  TOOL_DESCRIPTIONS,
  // Database tools
  createDatabaseTools,
  createSearchAgentsTool,
  createGetAgentTool,
  createGetWorkspaceStatsTool,
  // TODO: Export other tool categories as they're implemented
} from "./tools/index";
