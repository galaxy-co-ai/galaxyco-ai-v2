/**
 * Guardrails - Production-ready safety layer for agent execution
 *
 * Provides essential security and cost controls:
 * - Input Safety: Prevents prompt injection and jailbreaks
 * - Output Validation: Detects and redacts secrets/PII
 * - Cost Limits: Prevents runaway execution
 * - Tool Approval: Requires confirmation for high-risk operations
 */

export { createInputSafetyGuardrail } from "./input-safety";
export { createOutputValidationGuardrail } from "./output-validation";
export { createCostLimitGuardrail } from "./cost-limit";
export { createToolApprovalGuardrail } from "./tool-approval";

export type { InputSafetyConfig } from "./input-safety";
export type { CostLimitConfig } from "./cost-limit";
export type { ToolApprovalConfig } from "./tool-approval";

// Export from index for convenience
export * from "./input-safety";
export * from "./output-validation";
export * from "./cost-limit";
export * from "./tool-approval";
