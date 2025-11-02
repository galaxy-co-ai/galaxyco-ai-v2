/**
 * GalaxyCo.ai Context Enrichment
 * Fetches related resources to give AI full context
 * November 2, 2025
 */

import { db, agents, galaxyGrids, customers, prospects, projects } from '@galaxyco/database';
import { eq } from 'drizzle-orm';

export interface EnrichedContext {
  page: string;
  selectedItems?: {
    agentId?: string;
    workflowId?: string;
    gridId?: string;
    customerId?: string;
    prospectId?: string;
    projectId?: string;
  };
  resources?: {
    agent?: {
      id: string;
      name: string;
      type: string;
      status: string;
      description?: string;
      executionCount?: number;
    };
    workflow?: {
      id: string;
      name: string;
      status: string;
      description?: string;
      nodeCount?: number;
    };
    customer?: {
      id: string;
      name: string;
      status: string;
      company?: string;
      email?: string;
    };
    prospect?: {
      id: string;
      name: string;
      stage: string;
      score?: number;
      company?: string;
    };
    project?: {
      id: string;
      name: string;
      status: string;
      progress?: number;
    };
  };
  timestamp: string;
}

/**
 * Enrich page context with actual resource data from database
 */
export async function enrichContext(context: any, userId: string): Promise<EnrichedContext> {
  const enriched: EnrichedContext = {
    page: context.page,
    selectedItems: context.selectedItems,
    timestamp: context.timestamp,
    resources: {},
  };

  if (!context.selectedItems) {
    return enriched;
  }

  try {
    const items = context.selectedItems;

    // Log context enrichment start (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Context Enrichment] Starting enrichment for:', {
        page: context.page,
        selectedItems: items,
      });
    }

    // Fetch Agent details
    if (items.agentId) {
      const agent = await db.query.agents.findFirst({
        where: eq(agents.id, items.agentId),
        columns: {
          id: true,
          name: true,
          type: true,
          status: true,
          description: true,
          executionCount: true,
        },
      });

      if (agent) {
        enriched.resources!.agent = {
          id: agent.id,
          name: agent.name,
          type: agent.type,
          status: agent.status,
          description: agent.description || undefined,
          executionCount: agent.executionCount,
        };
      }
    }

    // Fetch Workflow/Grid details
    if (items.workflowId || items.gridId) {
      const gridId = items.workflowId || items.gridId;
      const grid = await db.query.galaxyGrids.findFirst({
        where: eq(galaxyGrids.id, gridId!),
        columns: {
          id: true,
          name: true,
          status: true,
          description: true,
        },
        with: {
          nodes: {
            columns: {
              id: true,
            },
          },
        },
      });

      if (grid) {
        enriched.resources!.workflow = {
          id: grid.id,
          name: grid.name,
          status: grid.status,
          description: grid.description || undefined,
          nodeCount: grid.nodes?.length || 0,
        };
      }
    }

    // Fetch Customer details
    if (items.customerId) {
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, items.customerId),
        columns: {
          id: true,
          name: true,
          status: true,
          company: true,
          email: true,
        },
      });

      if (customer) {
        enriched.resources!.customer = {
          id: customer.id,
          name: customer.name,
          status: customer.status,
          company: customer.company || undefined,
          email: customer.email || undefined,
        };
      }
    }

    // Fetch Prospect details
    if (items.prospectId) {
      const prospect = await db.query.prospects.findFirst({
        where: eq(prospects.id, items.prospectId),
        columns: {
          id: true,
          name: true,
          stage: true,
          score: true,
          company: true,
        },
      });

      if (prospect) {
        enriched.resources!.prospect = {
          id: prospect.id,
          name: prospect.name,
          stage: prospect.stage,
          score: prospect.score || undefined,
          company: prospect.company || undefined,
        };
      }
    }

    // Fetch Project details
    if (items.projectId) {
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, items.projectId),
        columns: {
          id: true,
          name: true,
          status: true,
          progress: true,
        },
      });

      if (project) {
        enriched.resources!.project = {
          id: project.id,
          name: project.name,
          status: project.status,
          progress: project.progress || undefined,
        };
      }
    }
  } catch (error) {
    console.error('[Context Enrichment] Error:', error);
    // Don't fail the whole request if enrichment fails
    // Just return basic context
  }

  // Log enrichment result (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Context Enrichment] Enriched context:', {
      page: enriched.page,
      hasResources: !!enriched.resources && Object.keys(enriched.resources).length > 0,
      resourceTypes: enriched.resources ? Object.keys(enriched.resources) : [],
    });
  }

  return enriched;
}
