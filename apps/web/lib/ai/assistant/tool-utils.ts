/**
 * Client-safe utilities for AI Assistant tools
 * This file can be imported in both server and client components
 */

/**
 * Get user-friendly tool name for display
 */
export function getToolDisplayName(toolName: string): string {
  const names: Record<string, string> = {
    createAgent: 'Create Agent',
    searchCustomers: 'Search Customers',
    analyzeWorkflow: 'Analyze Workflow',
    createWorkflow: 'Create Workflow',
    listAgents: 'List Agents',
    analyzeSales: 'Analyze Sales',
    getDocumentation: 'Get Documentation',
    searchKnowledge: 'Search Knowledge',
  };

  return names[toolName] || toolName;
}
