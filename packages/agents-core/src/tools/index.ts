/**
 * Tool Index
 *
 * Central registry and export for all available tools.
 * Tools are categorized by their function and purpose.
 */

// Import database tools (only implemented category so far)
export * from "./database-tools";
// Knowledge search tool for RAG
export * from "./knowledge-search";
// TODO: Uncomment as tools are implemented
// export * from "./communication-tools";
// export * from "./task-tools";
// export * from "./analysis-tools";

// Import tool creation functions
import { createDatabaseTools } from "./database-tools";
import { createKnowledgeSearchTool } from "./knowledge-search";
import type { Tool } from "../types";

/**
 * Tool categories for organization
 */
export enum ToolCategory {
  DATABASE = "database",
  COMMUNICATION = "communication",
  TASK = "task",
  ANALYSIS = "analysis",
  KNOWLEDGE = "knowledge",
}

/**
 * Get all available tools
 */
export function getAllTools(): Tool[] {
  return [
    ...createDatabaseTools(),
    createKnowledgeSearchTool(),
    // TODO: Add more tool categories as they're implemented
  ];
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  switch (category) {
    case ToolCategory.DATABASE:
      return createDatabaseTools();
    case ToolCategory.KNOWLEDGE:
      return [createKnowledgeSearchTool()];
    // TODO: Implement other categories
    default:
      return [];
  }
}

/**
 * Get tools appropriate for a specific agent type
 * Currently returns database tools for all types until more tools are implemented
 */
export function getToolsForAgentType(agentType: string): Tool[] {
  // For now, all agent types get database tools
  // TODO: Add specialized tool sets per agent type
  return createDatabaseTools();
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

  // Knowledge Tools
  searchKnowledgeBase: "Search the knowledge base using semantic search (RAG)",
};
