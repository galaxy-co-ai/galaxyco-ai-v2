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
 * Handles Vercel AI SDK tool invocation format
 */
export function parseToolResult(message: any): any {
  // Vercel AI SDK formats tool calls in toolInvocations array
  if (message.toolInvocations && message.toolInvocations.length > 0) {
    // Get the first completed tool invocation
    const toolInvocation = message.toolInvocations.find(
      (inv: any) => inv.state === 'result' || inv.state === 'call',
    );

    if (toolInvocation && toolInvocation.state === 'result') {
      // Parse the result - it might be a string or object
      let result = toolInvocation.result;
      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch {
          // If parsing fails, keep as string
        }
      }

      return {
        tool: toolInvocation.toolName,
        result: result,
      };
    }

    // If tool is still being called, return pending state
    if (toolInvocation && toolInvocation.state === 'call') {
      return {
        tool: toolInvocation.toolName,
        result: null,
        pending: true,
      };
    }
  }

  // Fallback: Check for tool call in message content (legacy format)
  if (message.role === 'assistant' && message.content) {
    // Try to extract tool result from message content
    const toolMatch = message.content.match(/```json\n({[^}]+"tool"[^}]+})\n```/);
    if (toolMatch) {
      try {
        const parsed = JSON.parse(toolMatch[1]);
        if (parsed.tool && parsed.result) {
          return parsed;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  return null;
}


