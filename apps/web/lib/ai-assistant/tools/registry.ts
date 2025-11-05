/**
 * Tool Registry
 *
 * Central registry of all tools available to the AI Assistant.
 * Tools are organized by category and can be looked up by name.
 */

import { type ToolRegistry, type Tool, type ToolContext, ToolError } from './types';

// Import all tool modules
import {
  createAgentTool,
  updateAgentTool,
  deleteAgentTool,
  listAgentsTool,
  getAgentAnalyticsTool,
} from './agent-tools';

// Workflow tools commented out until workflows table is created
// import {
//   createWorkflowTool,
//   listWorkflowsTool,
// } from './workflow-tools';

/**
 * All available tools
 */
export const TOOLS: ToolRegistry = {
  // Agent Management
  create_agent: createAgentTool,
  update_agent: updateAgentTool,
  delete_agent: deleteAgentTool,
  list_agents: listAgentsTool,
  get_agent_analytics: getAgentAnalyticsTool,

  // Workflow Management - Commented out until workflows table is created
  // create_workflow: createWorkflowTool,
  // list_workflows: listWorkflowsTool,

  // More tools will be added here as we build them:
  // - Integration tools (connect_gmail, connect_slack, etc.)
  // - Knowledge tools (upload_document, search_knowledge, etc.)
  // - CRM tools (create_contact, update_contact, etc.)
  // - Analytics tools (get_dashboard_stats, export_data, etc.)
  // - System tools (update_settings, invite_user, etc.)
};

/**
 * Get tool by name
 */
export function getTool(name: string): Tool | undefined {
  return TOOLS[name];
}

/**
 * Get all tools
 */
export function getAllTools(): Tool[] {
  return Object.values(TOOLS);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter((tool) => tool.category === category);
}

/**
 * Check if user has permission to use tool
 */
export function checkToolPermissions(
  tool: Tool,
  context: ToolContext,
): { allowed: boolean; missingPermissions: string[] } {
  if (!tool.requiredPermissions || tool.requiredPermissions.length === 0) {
    return { allowed: true, missingPermissions: [] };
  }

  const missingPermissions = tool.requiredPermissions.filter(
    (permission) => !context.permissions.includes(permission),
  );

  return {
    allowed: missingPermissions.length === 0,
    missingPermissions,
  };
}

/**
 * Execute a tool with permission checking and error handling
 */
export async function executeTool(toolName: string, params: any, context: ToolContext) {
  const tool = getTool(toolName);

  if (!tool) {
    throw new ToolError(`Tool "${toolName}" not found`, 'NOT_FOUND');
  }

  // Check permissions
  const permissionCheck = checkToolPermissions(tool, context);
  if (!permissionCheck.allowed) {
    throw new ToolError(
      `Permission denied. Missing: ${permissionCheck.missingPermissions.join(', ')}`,
      'PERMISSION_DENIED',
    );
  }

  // Validate parameters
  try {
    const validatedParams = tool.parameters.parse(params);

    // Execute tool
    return await tool.execute(validatedParams, context);
  } catch (error: any) {
    if (error instanceof ToolError) {
      throw error;
    }

    // Validation error
    if (error.name === 'ZodError') {
      throw new ToolError(`Invalid parameters: ${error.message}`, 'VALIDATION_ERROR');
    }

    // Unknown error
    throw new ToolError(`Tool execution failed: ${error.message}`, 'EXECUTION_ERROR');
  }
}

/**
 * Get tool definitions for AI (OpenAI function calling format)
 */
export function getToolDefinitionsForAI(): any[] {
  return getAllTools().map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.parameters),
    },
  }));
}

/**
 * Convert Zod schema to JSON Schema (simplified)
 * For full implementation, use @sch

ema-utils/json-schema
 */
function zodToJsonSchema(schema: any): any {
  // Simplified version - in production, use a proper converter
  return {
    type: 'object',
    properties: {},
    required: [],
  };
}
