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

import {
  uploadDocumentTool,
  searchKnowledgeTool,
  listKnowledgeItemsTool,
  deleteKnowledgeItemTool,
} from './knowledge-tools';

import {
  connectIntegrationTool,
  listIntegrationsTool,
  disconnectIntegrationTool,
  checkIntegrationStatusTool,
} from './integration-tools';

import { getDashboardStatsTool, getUsageMetricsTool } from './analytics-tools';

/**
 * All available tools
 */
export const TOOLS: ToolRegistry = {
  // Agent Management (5 tools)
  create_agent: createAgentTool,
  update_agent: updateAgentTool,
  delete_agent: deleteAgentTool,
  list_agents: listAgentsTool,
  get_agent_analytics: getAgentAnalyticsTool,

  // Knowledge Base Management (4 tools)
  upload_document: uploadDocumentTool,
  search_knowledge: searchKnowledgeTool,
  list_knowledge_items: listKnowledgeItemsTool,
  delete_knowledge_item: deleteKnowledgeItemTool,

  // Integration Management (4 tools)
  connect_integration: connectIntegrationTool,
  list_integrations: listIntegrationsTool,
  disconnect_integration: disconnectIntegrationTool,
  check_integration_status: checkIntegrationStatusTool,

  // Analytics & Reporting (2 tools)
  get_dashboard_stats: getDashboardStatsTool,
  get_usage_metrics: getUsageMetricsTool,

  // Workflow Management - Commented out until workflows table is created
  // create_workflow: createWorkflowTool,
  // list_workflows: listWorkflowsTool,

  // Future tools to add:
  // - CRM tools (create_contact, search_contacts, update_contact, etc.)
  // - System tools (update_settings, invite_user, manage_billing, etc.)
  // - Communication tools (send_email, post_to_slack, etc.)
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
