/**
 * Core Types for GalaxyCo.ai Agent System
 * Following OpenAI Agents SDK patterns
 */

import { z } from "zod";

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface UserMessage extends Message {
  role: "user";
}

export interface AssistantMessage extends Message {
  role: "assistant";
  tool_calls?: ToolCall[];
}

export interface SystemMessage extends Message {
  role: "system";
}

export interface ToolMessage extends Message {
  role: "tool";
  tool_call_id: string;
}

// ============================================================================
// TOOL TYPES
// ============================================================================

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export interface Tool {
  definition: ToolDefinition;
  execute: (args: any, context?: ExecutionContext) => Promise<any>;
}

export type ToolCategory = "data" | "action" | "orchestration";

export interface ToolMetadata {
  category: ToolCategory;
  riskLevel: "low" | "medium" | "high";
  requiresApproval: boolean;
  version: string;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface AgentConfig {
  name: string;
  instructions: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  guardrails?: Guardrail[];
}

export interface Agent {
  name: string;
  instructions: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  tools: Tool[];
  guardrails: Guardrail[];

  // Enable agent-as-tool pattern
  asTool(toolName?: string, description?: string): Tool;
}

// ============================================================================
// RUNNER TYPES
// ============================================================================

export interface RunOptions {
  maxIterations?: number;
  timeout?: number;
  context?: Record<string, any>;
  workspaceId?: string;
  userId?: string;
}

export interface RunResult {
  success: boolean;
  messages: Message[];
  finalOutput?: any;
  error?: string;
  metadata: {
    executionId: string;
    startTime: Date;
    endTime: Date;
    durationMs: number;
    iterations: number;
    tokensUsed: number;
    costUsd: number;
    model: string;
  };
}

// ============================================================================
// GUARDRAIL TYPES
// ============================================================================

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  action?: "block" | "redact" | "warn"; // What action to take if failed
  redactedContent?: string; // If action is redact, the redacted version
}

export interface Guardrail {
  name: string;
  description: string;
  type: "input" | "output" | "tool" | "cost";
  enabled?: boolean; // Allow disabling guardrails

  check(input: any, context?: Record<string, any>): Promise<GuardrailResult>;
}

export interface GuardrailConfig {
  input?: {
    relevance?: { enabled: boolean; threshold: number };
    safety?: { enabled: boolean; mode: "strict" | "moderate" };
    pii?: { enabled: boolean; action: "block" | "redact" };
  };
  output?: {
    validation?: { schema?: z.ZodSchema };
    maxLength?: number;
  };
  tools?: {
    requireApproval?: string[];
    riskThreshold?: "low" | "medium" | "high";
  };
}

// ============================================================================
// HANDOFF TYPES
// ============================================================================

export interface HandoffResult {
  toAgent: string;
  context: Record<string, any>;
  reason?: string;
}

export interface Handoff {
  targetAgent: Agent;
  condition?: (context: Record<string, any>) => boolean;
  transferContext?: (context: Record<string, any>) => Record<string, any>;
}

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

export interface ExecutionContext {
  executionId: string;
  workspaceId: string; // Required for multi-tenant safety
  userId: string; // Required for audit trail
  startTime: Date;
  messages: Message[];
  toolCalls: ToolCall[];
  iterations: number;
  metadata: Record<string, any>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message);
    this.name = "AgentError";
  }
}

export class GuardrailError extends AgentError {
  constructor(message: string, details?: any) {
    super(message, "GUARDRAIL_FAILED", details);
    this.name = "GuardrailError";
  }
}

export class ToolExecutionError extends AgentError {
  constructor(
    message: string,
    public toolName: string,
    details?: any,
  ) {
    super(message, "TOOL_EXECUTION_FAILED", details);
    this.name = "ToolExecutionError";
  }
}

export class MaxIterationsError extends AgentError {
  constructor(iterations: number) {
    super(
      `Agent exceeded maximum iterations: ${iterations}`,
      "MAX_ITERATIONS_EXCEEDED",
      { iterations },
    );
    this.name = "MaxIterationsError";
  }
}
