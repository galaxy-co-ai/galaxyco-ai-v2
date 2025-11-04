/**
 * RAG (Retrieval-Augmented Generation) Service
 * Provides workspace context to the AI assistant
 */

import { db, agents, customers, galaxyGrids } from '@galaxyco/database';
import { eq, desc, count } from 'drizzle-orm';

export interface RAGContext {
  recentAgents: Array<{
    id: string;
    name: string;
    description: string | null;
    type: string;
    status: string;
  }>;
  recentCustomers: Array<{
    id: string;
    name: string;
    email: string | null;
    company: string | null;
  }>;
  recentWorkflows: Array<{
    id: string;
    name: string;
    description: string | null;
    status: string;
  }>;
  workspaceStats: {
    totalAgents: number;
    totalCustomers: number;
    totalWorkflows: number;
  };
}

/**
 * Get workspace context for RAG
 * This provides the AI with relevant workspace data to answer questions
 */
export async function getWorkspaceContext(
  workspaceId: string,
  userQuery?: string,
): Promise<RAGContext> {
  try {
    // Fetch recent agents
    const recentAgents = await db
      .select({
        id: agents.id,
        name: agents.name,
        description: agents.description,
        type: agents.type,
        status: agents.status,
      })
      .from(agents)
      .where(eq(agents.workspaceId, workspaceId))
      .orderBy(desc(agents.createdAt))
      .limit(5);

    // Fetch recent customers
    const recentCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        company: customers.company,
      })
      .from(customers)
      .where(eq(customers.workspaceId, workspaceId))
      .orderBy(desc(customers.createdAt))
      .limit(5);

    // Fetch recent workflows
    const recentWorkflows = await db
      .select({
        id: galaxyGrids.id,
        name: galaxyGrids.name,
        description: galaxyGrids.description,
        status: galaxyGrids.status,
      })
      .from(galaxyGrids)
      .where(eq(galaxyGrids.workspaceId, workspaceId))
      .orderBy(desc(galaxyGrids.createdAt))
      .limit(5);

    // Get counts for stats
    const agentCountResult = await db
      .select({ count: count() })
      .from(agents)
      .where(eq(agents.workspaceId, workspaceId));
    const agentCount = agentCountResult[0];

    const customerCountResult = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.workspaceId, workspaceId));
    const customerCount = customerCountResult[0];

    const workflowCountResult = await db
      .select({ count: count() })
      .from(galaxyGrids)
      .where(eq(galaxyGrids.workspaceId, workspaceId));
    const workflowCount = workflowCountResult[0];

    return {
      recentAgents,
      recentCustomers,
      recentWorkflows,
      workspaceStats: {
        totalAgents: Number(agentCount?.count || 0),
        totalCustomers: Number(customerCount?.count || 0),
        totalWorkflows: Number(workflowCount?.count || 0),
      },
    };
  } catch (error) {
    console.error('RAG context error:', error);
    return {
      recentAgents: [],
      recentCustomers: [],
      recentWorkflows: [],
      workspaceStats: {
        totalAgents: 0,
        totalCustomers: 0,
        totalWorkflows: 0,
      },
    };
  }
}

/**
 * Generate enhanced system prompt with RAG context
 */
export function generateSystemPromptWithContext(
  basePrompt: string,
  context: RAGContext,
  userName: string,
): string {
  let enhancedPrompt = basePrompt;

  // Add workspace overview
  enhancedPrompt += `\n\n**Workspace Overview:**`;
  enhancedPrompt += `\n- Total Agents: ${context.workspaceStats.totalAgents}`;
  enhancedPrompt += `\n- Total Customers: ${context.workspaceStats.totalCustomers}`;
  enhancedPrompt += `\n- Total Workflows: ${context.workspaceStats.totalWorkflows}`;

  // Add recent agents context
  if (context.recentAgents.length > 0) {
    enhancedPrompt += `\n\n**Recent Agents:**`;
    context.recentAgents.forEach((agent) => {
      enhancedPrompt += `\n- **${agent.name}** (${agent.type}): ${agent.description || 'No description'} - Status: ${agent.status}`;
    });
  }

  // Add recent customers context
  if (context.recentCustomers.length > 0) {
    enhancedPrompt += `\n\n**Recent Customers:**`;
    context.recentCustomers.forEach((customer) => {
      enhancedPrompt += `\n- ${customer.name} (${customer.email})${customer.company ? ` - ${customer.company}` : ''}`;
    });
  }

  // Add recent workflows context
  if (context.recentWorkflows.length > 0) {
    enhancedPrompt += `\n\n**Recent Workflows:**`;
    context.recentWorkflows.forEach((workflow) => {
      enhancedPrompt += `\n- **${workflow.name}**: ${workflow.description || 'No description'} - Status: ${workflow.status}`;
    });
  }

  enhancedPrompt += `\n\n**Use this context to provide specific, relevant assistance to ${userName}. Reference their actual data when helpful.**`;

  return enhancedPrompt;
}
