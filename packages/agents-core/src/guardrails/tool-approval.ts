/**
 * Tool Approval Guardrail
 * Requires approval for high-risk tool operations
 */

import type { Guardrail, GuardrailResult, Tool } from "../types";

export interface ToolApprovalConfig {
  requireApproval?: string[]; // Tool names requiring approval
  approvalCallback?: (toolName: string, args: any) => Promise<boolean>;
  autoApproveIfCallback?: boolean;
}

export function createToolApprovalGuardrail(
  config: ToolApprovalConfig = {},
): Guardrail {
  const {
    requireApproval = [],
    approvalCallback,
    autoApproveIfCallback = false,
  } = config;

  return {
    name: "tool-approval",
    description: "Requires approval for high-risk tool operations",
    type: "tool",
    enabled: true,

    async check(input: any): Promise<GuardrailResult> {
      const { tool, args } = input as { tool: Tool; args: any };
      const toolName = tool.definition.function.name;

      // Check if this tool requires approval
      if (!requireApproval.includes(toolName)) {
        return { passed: true };
      }

      // If no callback provided, block by default
      if (!approvalCallback) {
        return {
          passed: false,
          action: "block",
          reason: `Tool '${toolName}' requires approval but no callback provided`,
          metadata: { toolName, args },
        };
      }

      // Call approval callback
      try {
        const approved = await approvalCallback(toolName, args);

        if (!approved) {
          return {
            passed: false,
            action: "block",
            reason: `Tool '${toolName}' approval denied`,
            metadata: { toolName, args },
          };
        }

        return { passed: true, metadata: { approved: true, toolName } };
      } catch (error: any) {
        return {
          passed: false,
          action: "block",
          reason: `Tool approval callback failed: ${error.message}`,
          metadata: { toolName, error: error.message },
        };
      }
    },
  };
}
