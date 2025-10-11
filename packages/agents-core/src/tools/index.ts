/**
 * Tool Index
 *
 * Central registry and export for all available tools.
 * Tools are categorized by their function and purpose.
 */

// Import all tool categories
export * from "./database-tools";
export * from "./communication-tools";
export * from "./task-tools";
export * from "./analysis-tools";

// Import tool creation functions
import { createDatabaseTools } from "./database-tools";
import { createCommunicationTools } from "./communication-tools";
import { createTaskTools } from "./task-tools";
import { createAnalysisTools } from "./analysis-tools";
import type { Tool } from "../types";

/**
 * Tool categories for organization
 */
export enum ToolCategory {
  DATABASE = "database",
  COMMUNICATION = "communication",
  TASK = "task",
  ANALYSIS = "analysis",
}

/**
 * Get all available tools
 */
export function getAllTools(): Tool[] {
  return [
    ...createDatabaseTools(),
    ...createCommunicationTools(),
    ...createTaskTools(),
    ...createAnalysisTools(),
  ];
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  switch (category) {
    case ToolCategory.DATABASE:
      return createDatabaseTools();
    case ToolCategory.COMMUNICATION:
      return createCommunicationTools();
    case ToolCategory.TASK:
      return createTaskTools();
    case ToolCategory.ANALYSIS:
      return createAnalysisTools();
    default:
      return [];
  }
}

/**
 * Get tools appropriate for a specific agent type
 */
export function getToolsForAgentType(agentType: string): Tool[] {
  const toolMap: Record<string, Tool[]> = {
    scope: [...createAnalysisTools(), ...createTaskTools()],
    email: [...createCommunicationTools(), ...createAnalysisTools()],
    call: [
      ...createAnalysisTools(),
      ...createTaskTools(),
      ...createCommunicationTools().filter(
        (t) => t.definition.function.name === "create_notification",
      ),
    ],
    note: [...createAnalysisTools(), ...createDatabaseTools()],
    task: [...createTaskTools(), ...createCommunicationTools()],
    roadmap: [
      ...createTaskTools(),
      ...createAnalysisTools(),
      ...createDatabaseTools(),
    ],
    content: [
      ...createAnalysisTools(),
      ...createCommunicationTools().filter(
        (t) => t.definition.function.name === "draft_email",
      ),
    ],
    custom: getAllTools(),
  };

  return toolMap[agentType] || [];
}

/**
 * Tool descriptions for documentation
 */
export const TOOL_DESCRIPTIONS = {
  // Database Tools
  search_agents: "Search for agents in the workspace",
  get_agent: "Get detailed agent information",
  get_workspace_stats: "Get workspace statistics",

  // Communication Tools
  draft_email: "Draft an email without sending",
  send_email: "Send an email via configured service",
  send_slack_message: "Send a Slack message",
  create_notification: "Create in-app notification",

  // Task Tools
  create_task: "Create a new task/ticket",
  update_task: "Update existing task",
  search_tasks: "Search for tasks",
  create_milestone: "Create project milestone",

  // Analysis Tools
  analyze_text: "Analyze text for insights",
  generate_content: "Generate various content types",
  extract_data: "Extract data from sources",
  compare_documents: "Compare multiple documents",
  generate_report: "Generate comprehensive reports",
};
