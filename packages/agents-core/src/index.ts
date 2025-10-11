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
  ToolCategory,
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
