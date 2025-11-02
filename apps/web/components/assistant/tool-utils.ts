/**
 * GalaxyCo.ai Tool Utilities
 * Helper functions for tool execution and display
 * November 2, 2025
 */

/**
 * Get display name for tool
 */
export function getToolDisplayName(tool: string): string {
  const toolNames: Record<string, string> = {
    create_agent: 'Agent Created',
    create_workflow: 'Workflow Created',
    search_data: 'Search Results',
    analyze_metrics: 'Metrics Analysis',
  };

  return toolNames[tool] || tool;
}

/**
 * Parse tool result from message metadata
 */
export function parseToolResult(message: any): any {
  // Check if message has tool invocations
  if (!message.toolInvocations || message.toolInvocations.length === 0) {
    return null;
  }

  // Get the first completed tool invocation
  const toolInvocation = message.toolInvocations.find(
    (inv: any) => inv.state === 'result'
  );

  if (!toolInvocation) {
    return null;
  }

  return {
    tool: toolInvocation.toolName,
    result: toolInvocation.result,
  };
}


