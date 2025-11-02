/**
 * GalaxyCo.ai AI Assistant Chat API
 * Streaming GPT-4 responses with conversation context
 * November 2, 2025
 */

import { auth } from '@clerk/nextjs/server';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { enrichContext } from '@/lib/ai/context-enrichment';
import { z } from 'zod';
import { db, agents, galaxyGrids, users, workspaceMembers } from '@galaxyco/database';
import { eq, and } from 'drizzle-orm';

const BASE_SYSTEM_PROMPT = `You are GalaxyCo.ai's AI Assistant, a helpful AI that assists users with their AI agent platform.

Your capabilities:
- Help users create and configure AI agents
- Assist with workflow automation
- Answer questions about the platform
- Analyze metrics and provide insights
- Search through user data
- Provide contextual help based on what the user is viewing

Always be helpful, concise, and action-oriented.`;

/**
 * Build contextual system prompt based on user's current page
 */
function buildContextualPrompt(context?: any): string {
  let prompt = BASE_SYSTEM_PROMPT;

  // Add context awareness if available
  if (context) {
    prompt += '\n\n**CURRENT CONTEXT:**';

    // Page information
    if (context.page) {
      prompt += `\n- User is currently on: ${context.page}`;

      // Add page-specific guidance
      if (context.page.includes('/agents')) {
        prompt += '\n- Focus on agent-related assistance, configuration, and optimization';
      } else if (context.page.includes('/workflows') || context.page.includes('/studio')) {
        prompt += '\n- Focus on workflow creation, automation, and visual builder assistance';
      } else if (context.page.includes('/crm')) {
        prompt += '\n- Focus on CRM operations, customer management, and sales assistance';
      } else if (context.page.includes('/dashboard')) {
        prompt += '\n- Focus on metrics, insights, and platform overview';
      }
    }

    // Resource details (enriched)
    if (context.resources) {
      const resources = context.resources;

      if (resources.agent) {
        const agent = resources.agent;
        prompt += `\n\n**CURRENT AGENT:**`;
        prompt += `\n- Name: ${agent.name}`;
        prompt += `\n- Type: ${agent.type}`;
        prompt += `\n- Status: ${agent.status}`;
        if (agent.description) {
          prompt += `\n- Description: ${agent.description}`;
        }
        if (agent.executionCount !== undefined) {
          prompt += `\n- Executions: ${agent.executionCount}`;
        }
        prompt +=
          '\n- You can help with: analyzing performance, suggesting improvements, modifying configuration';
      }

      if (resources.workflow) {
        const workflow = resources.workflow;
        prompt += `\n\n**CURRENT WORKFLOW:**`;
        prompt += `\n- Name: ${workflow.name}`;
        prompt += `\n- Status: ${workflow.status}`;
        if (workflow.description) {
          prompt += `\n- Description: ${workflow.description}`;
        }
        if (workflow.nodeCount !== undefined) {
          prompt += `\n- Nodes: ${workflow.nodeCount}`;
        }
        prompt += '\n- You can help with: adding nodes, optimizing flow, debugging issues';
      }

      if (resources.customer) {
        const customer = resources.customer;
        prompt += `\n\n**CURRENT CUSTOMER:**`;
        prompt += `\n- Name: ${customer.name}`;
        prompt += `\n- Status: ${customer.status}`;
        if (customer.company) {
          prompt += `\n- Company: ${customer.company}`;
        }
        if (customer.email) {
          prompt += `\n- Email: ${customer.email}`;
        }
        prompt += '\n- You can help with: customer insights, engagement strategies, next actions';
      }

      if (resources.prospect) {
        const prospect = resources.prospect;
        prompt += `\n\n**CURRENT PROSPECT:**`;
        prompt += `\n- Name: ${prospect.name}`;
        prompt += `\n- Stage: ${prospect.stage}`;
        if (prospect.score !== undefined) {
          prompt += `\n- Lead Score: ${prospect.score}/100`;
        }
        if (prospect.company) {
          prompt += `\n- Company: ${prospect.company}`;
        }
        prompt += '\n- You can help with: conversion strategy, outreach planning, qualification';
      }

      if (resources.project) {
        const project = resources.project;
        prompt += `\n\n**CURRENT PROJECT:**`;
        prompt += `\n- Name: ${project.name}`;
        prompt += `\n- Status: ${project.status}`;
        if (project.progress !== undefined) {
          prompt += `\n- Progress: ${project.progress}%`;
        }
        prompt += '\n- You can help with: task management, timeline optimization, status updates';
      }
    }

    prompt +=
      '\n\n**Use this context to provide highly relevant, specific assistance. Reference the current page and items naturally in your responses.**';
  }

  return prompt;
}

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { messages, conversationId, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Enrich context with actual resource data
    const enrichedContext = context ? await enrichContext(context, userId) : undefined;
    
    // Log context for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Chat API] Context received:', {
        raw: context,
        enriched: enrichedContext,
        userId,
      });
    }

    // Get user from database for tool execution
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
      with: {
        workspaceMembers: {
          where: eq(workspaceMembers.isActive, true),
          limit: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's active workspace
    const workspaceId = user.workspaceMembers?.[0]?.workspaceId || null;
    if (!workspaceId) {
      return NextResponse.json({ error: 'No active workspace found' }, { status: 400 });
    }

    // Build contextual system prompt
    const contextualPrompt = buildContextualPrompt(enrichedContext);

    // Define schemas for tool parameters
    const createAgentSchema = z.object({
      name: z.string().describe('Name of the agent (e.g., "Email Lead Scorer")'),
      description: z.string().describe('What the agent does'),
      type: z
        .enum(['sales', 'custom', 'email', 'research', 'code', 'data'])
        .describe('Type of agent'),
    });

    const createWorkflowSchema = z.object({
      name: z.string().describe('Name of the workflow (e.g., "Lead Nurture Campaign")'),
      description: z.string().describe('What the workflow does'),
      steps: z
        .array(z.string())
        .describe(
          'List of steps in plain language (e.g., ["Check for new leads", "Send welcome email", "Add to CRM"])',
        ),
    });

    const searchDataSchema = z.object({
      query: z.string().describe('Search query'),
      filters: z
        .object({
          type: z.enum(['agents', 'workflows', 'documents', 'all']).optional(),
        })
        .optional(),
    });

    const analyzeMetricsSchema = z.object({
      metric: z
        .string()
        .describe('Metric to analyze (e.g., "agent performance", "conversion rate", "revenue")'),
      timeframe: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
    });

    // Define AI tools
    const aiTools = {
      create_agent: tool({
        description:
          'Create a new AI agent based on user requirements. Use this when user asks to "create an agent", "build an agent", or describes agent functionality.',
        parameters: createAgentSchema,
        // @ts-expect-error - AI SDK tool type inference issue
        execute: async (params: z.infer<typeof createAgentSchema>) => {
          const { name, description, type } = params;
          
          // Log tool execution
          console.log('[Chat API] Tool: create_agent', { name, description, type, workspaceId });
          
          // Create agent in database
          const newAgent = await db
            .insert(agents)
            .values({
              workspaceId,
              name,
              description,
              type: type as
                | 'sales'
                | 'custom'
                | 'email'
                | 'research'
                | 'code'
                | 'data'
                | 'scope'
                | 'call'
                | 'note'
                | 'task'
                | 'roadmap'
                | 'content'
                | 'browser'
                | 'cross-app'
                | 'knowledge'
                | 'trending'
                | 'meeting'
                | 'security',
              status: 'draft',
              createdBy: user.id,
              config: {
                aiProvider: 'openai',
                model: 'gpt-4-turbo',
                temperature: 0.7,
              },
            })
            .returning();

          const result = {
            success: true,
            agent: {
              id: newAgent[0].id,
              name: newAgent[0].name,
              type: newAgent[0].type,
              status: newAgent[0].status,
            },
            message: `Successfully created agent: ${newAgent[0].name}`,
            previewUrl: `/agents/${newAgent[0].id}`,
          };
          
          console.log('[Chat API] Tool result: create_agent', result);
          return result;
        },
      }),

      create_workflow: tool({
        description:
          'Create a visual workflow in the Grid canvas. Use when user asks to "create a workflow", "build automation", or describes a multi-step process.',
        parameters: createWorkflowSchema,
        // @ts-expect-error - AI SDK tool type inference issue
        execute: async (params: z.infer<typeof createWorkflowSchema>) => {
          const { name, description, steps } = params;
          
          // Log tool execution
          console.log('[Chat API] Tool: create_workflow', { name, description, steps, workspaceId });
          
          // Convert steps to nodes and edges
          const nodes = steps.map((step, i) => ({
            id: `node-${i}`,
            type: 'action',
            label: step,
            position: { x: i * 250, y: 100 },
            config: {},
          }));

          const edges = steps.slice(0, -1).map((_, i) => ({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            type: 'default',
          }));

          // Create workflow in database
          const newWorkflow = await db
            .insert(galaxyGrids)
            .values({
              workspaceId,
              name,
              description,
              status: 'draft',
              createdBy: user.id,
              viewport: { x: 0, y: 0, zoom: 1 },
            })
            .returning();

          const result = {
            success: true,
            workflow: {
              id: newWorkflow[0].id,
              name: newWorkflow[0].name,
              status: newWorkflow[0].status,
              nodeCount: nodes.length,
            },
            nodes,
            edges,
            message: `Successfully created workflow: ${newWorkflow[0].name}`,
            previewUrl: `/studio/lab/${newWorkflow[0].id}`,
          };
          
          console.log('[Chat API] Tool result: create_workflow', result);
          return result;
        },
      }),

      search_data: tool({
        description:
          'Search across agents, workflows, and knowledge base. Use when user asks to "find", "search", or "look for" something.',
        parameters: searchDataSchema,
        // @ts-expect-error - AI SDK tool type inference issue
        execute: async (params: z.infer<typeof searchDataSchema>) => {
          const { query, filters } = params;
          // Mock search for now (implement real search later)
          return {
            success: true,
            results: [
              {
                type: 'agent',
                id: 'example-1',
                title: `Agent matching: ${query}`,
                snippet: 'This is a placeholder result...',
                relevance: 0.95,
              },
            ],
            message: `Found results for: ${query}`,
          };
        },
      }),

      analyze_metrics: tool({
        description:
          'Analyze business metrics and provide insights. Use when user asks about "performance", "metrics", "analytics", or "how is X doing".',
        parameters: analyzeMetricsSchema,
        // @ts-expect-error - AI SDK tool type inference issue
        execute: async (params: z.infer<typeof analyzeMetricsSchema>) => {
          const { metric, timeframe } = params;
          // Mock analytics (implement real analytics later)
          return {
            success: true,
            metric,
            timeframe,
            value: 1234,
            change: '+15%',
            insights: [
              'Trending upward over the selected period',
              'Peak performance on Wednesdays',
              'Opportunity to optimize conversion rate',
            ],
            message: `Analyzed ${metric} over ${timeframe}`,
          };
        },
      }),
    };

    // Create streaming completion with tools
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: [
        {
          role: 'system',
          content: contextualPrompt,
        },
        ...messages,
      ],
      tools: aiTools,
      temperature: 0.7,
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);

    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
