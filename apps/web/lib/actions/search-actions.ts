/**
 * Server Actions for Universal Search
 *
 * Search across all entities in the workspace
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import {
  agents,
  galaxyGrids,
  knowledgeItems,
  customers,
  contacts,
  prospects,
  projects,
  tasks,
  users,
} from '@galaxyco/database/schema';
import { eq, and, like, or, desc } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const UniversalSearchSchema = z.object({
  workspaceId: z.string().uuid(),
  query: z.string().min(1).max(255),
  types: z
    .array(
      z.enum([
        'agents',
        'workflows',
        'knowledge',
        'customers',
        'contacts',
        'prospects',
        'projects',
        'tasks',
      ]),
    )
    .optional(),
  limit: z.number().min(1).max(100).optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }
  return clerkUserId;
}

function formatError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid input';
  }

  if (error instanceof Error) {
    console.error('[Search Action Error]', error);
  }

  return 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// SEARCH ACTIONS
// ============================================================================

/**
 * Universal search across all entities
 */
export async function universalSearch(params: z.infer<typeof UniversalSearchSchema>) {
  try {
    const validated = UniversalSearchSchema.parse(params);
    const clerkUserId = await getCurrentUser();

    if (!clerkUserId) {
      return { success: false, error: 'You must be signed in to search' };
    }

    const searchQuery = validated.query;
    const typesToSearch = validated.types || [
      'agents',
      'workflows',
      'knowledge',
      'customers',
      'contacts',
      'prospects',
      'projects',
      'tasks',
    ];
    const limit = validated.limit || 10;

    const results: any = {
      agents: [],
      workflows: [],
      knowledge: [],
      customers: [],
      contacts: [],
      prospects: [],
      projects: [],
      tasks: [],
    };

    // Search agents
    if (typesToSearch.includes('agents')) {
      const agentResults = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.workspaceId, validated.workspaceId),
            or(like(agents.name, `%${searchQuery}%`), like(agents.description, `%${searchQuery}%`)),
          ),
        )
        .limit(limit);

      results.agents = agentResults.map((a) => ({
        id: a.id,
        type: 'agent' as const,
        title: a.name,
        description: a.description,
        url: `/agents/${a.id}`,
        metadata: { status: a.status, type: a.type },
      }));
    }

    // Search workflows
    if (typesToSearch.includes('workflows')) {
      const workflowResults = await db
        .select()
        .from(galaxyGrids)
        .where(
          and(
            eq(galaxyGrids.workspaceId, validated.workspaceId),
            or(
              like(galaxyGrids.name, `%${searchQuery}%`),
              like(galaxyGrids.description, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.workflows = workflowResults.map((w) => ({
        id: w.id,
        type: 'workflow' as const,
        title: w.name,
        description: w.description,
        url: `/workflows/${w.id}`,
        metadata: { status: w.status, version: w.version },
      }));
    }

    // Search knowledge items
    if (typesToSearch.includes('knowledge')) {
      const knowledgeResults = await db
        .select()
        .from(knowledgeItems)
        .where(
          and(
            eq(knowledgeItems.workspaceId, validated.workspaceId),
            or(
              like(knowledgeItems.title, `%${searchQuery}%`),
              like(knowledgeItems.content, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.knowledge = knowledgeResults.map((k) => ({
        id: k.id,
        type: 'knowledge' as const,
        title: k.title,
        description: k.summary,
        url: `/library/${k.id}`,
        metadata: { type: k.type, status: k.status },
      }));
    }

    // Search customers
    if (typesToSearch.includes('customers')) {
      const customerResults = await db
        .select()
        .from(customers)
        .where(
          and(
            eq(customers.workspaceId, validated.workspaceId),
            or(
              like(customers.name, `%${searchQuery}%`),
              like(customers.email, `%${searchQuery}%`),
              like(customers.company, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.customers = customerResults.map((c) => ({
        id: c.id,
        type: 'customer' as const,
        title: c.name,
        description: c.company || c.email,
        url: `/crm/customers/${c.id}`,
        metadata: { status: c.status },
      }));
    }

    // Search contacts
    if (typesToSearch.includes('contacts')) {
      const contactResults = await db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.workspaceId, validated.workspaceId),
            or(
              like(contacts.firstName, `%${searchQuery}%`),
              like(contacts.lastName, `%${searchQuery}%`),
              like(contacts.email, `%${searchQuery}%`),
              like(contacts.company, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.contacts = contactResults.map((c) => ({
        id: c.id,
        type: 'contact' as const,
        title: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email,
        description: c.company || c.email,
        url: `/crm/contacts/${c.id}`,
        metadata: { title: c.title },
      }));
    }

    // Search prospects
    if (typesToSearch.includes('prospects')) {
      const prospectResults = await db
        .select()
        .from(prospects)
        .where(
          and(
            eq(prospects.workspaceId, validated.workspaceId),
            or(
              like(prospects.name, `%${searchQuery}%`),
              like(prospects.email, `%${searchQuery}%`),
              like(prospects.company, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.prospects = prospectResults.map((p) => ({
        id: p.id,
        type: 'prospect' as const,
        title: p.name,
        description: p.company || p.email,
        url: `/crm/prospects/${p.id}`,
        metadata: { stage: p.stage, score: p.score },
      }));
    }

    // Search projects
    if (typesToSearch.includes('projects')) {
      const projectResults = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.workspaceId, validated.workspaceId),
            or(
              like(projects.name, `%${searchQuery}%`),
              like(projects.description, `%${searchQuery}%`),
            ),
          ),
        )
        .limit(limit);

      results.projects = projectResults.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.name,
        description: p.description,
        url: `/crm/projects/${p.id}`,
        metadata: { status: p.status, progress: p.progress },
      }));
    }

    // Search tasks
    if (typesToSearch.includes('tasks')) {
      const taskResults = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.workspaceId, validated.workspaceId),
            or(like(tasks.title, `%${searchQuery}%`), like(tasks.description, `%${searchQuery}%`)),
          ),
        )
        .limit(limit);

      results.tasks = taskResults.map((t) => ({
        id: t.id,
        type: 'task' as const,
        title: t.title,
        description: t.description,
        url: `/tasks/${t.id}`,
        metadata: { status: t.status, priority: t.priority },
      }));
    }

    // Combine and limit results
    const allResults = [
      ...results.agents,
      ...results.workflows,
      ...results.knowledge,
      ...results.customers,
      ...results.contacts,
      ...results.prospects,
      ...results.projects,
      ...results.tasks,
    ].slice(0, validated.limit || 50);

    return {
      success: true,
      results: allResults,
      total: allResults.length,
      byType: {
        agents: results.agents.length,
        workflows: results.workflows.length,
        knowledge: results.knowledge.length,
        customers: results.customers.length,
        contacts: results.contacts.length,
        prospects: results.prospects.length,
        projects: results.projects.length,
        tasks: results.tasks.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: formatError(error),
    };
  }
}
