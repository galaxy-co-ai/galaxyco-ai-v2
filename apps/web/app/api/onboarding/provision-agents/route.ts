import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { agents } from '@galaxyco/database/schema';
import { logger } from '@/lib/utils/logger';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setupData = await request.json();
    const { role, workspaceId } = setupData;

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    const roleLower = role?.toLowerCase() || '';

    // Determine agent configs based on role
    let agentConfigs: Array<{
      name: string;
      description: string;
      type: 'email' | 'research' | 'task' | 'data' | 'content' | 'sales' | 'custom';
      instructions: string;
    }> = [];

    if (roleLower.includes('founder') || roleLower.includes('ceo')) {
      agentConfigs = [
        {
          name: 'Daily Digest Agent',
          description: 'Summarizes emails, tasks, and priorities every morning',
          type: 'email',
          instructions:
            'You are a daily digest assistant. Summarize key information from emails, tasks, and calendar events into a concise morning briefing.',
        },
        {
          name: 'Document Analyzer',
          description: 'Extracts key insights from reports and contracts',
          type: 'data',
          instructions:
            'You are a document analysis expert. Extract key insights, action items, and important details from business documents.',
        },
        {
          name: 'Meeting Prep Assistant',
          description: 'Prepares briefs and talking points for meetings',
          type: 'research',
          instructions:
            'You are a meeting preparation assistant. Create comprehensive briefs with talking points, background information, and suggested discussion topics.',
        },
      ];
    } else if (roleLower.includes('sales') || roleLower.includes('business development')) {
      agentConfigs = [
        {
          name: 'Lead Enrichment Agent',
          description: 'Enriches lead data from emails and LinkedIn',
          type: 'research',
          instructions:
            'You are a lead enrichment specialist. Research and gather comprehensive information about leads from various sources.',
        },
        {
          name: 'Follow-up Writer',
          description: 'Drafts personalized follow-up emails',
          type: 'email',
          instructions:
            'You are a sales communication expert. Write personalized, engaging follow-up emails that maintain relationships and drive responses.',
        },
        {
          name: 'Pipeline Tracker',
          description: 'Monitors deals and alerts on stalled opportunities',
          type: 'sales',
          instructions:
            'You are a pipeline monitoring assistant. Track deal progress, identify stalled opportunities, and send proactive alerts.',
        },
      ];
    } else if (roleLower.includes('support') || roleLower.includes('customer success')) {
      agentConfigs = [
        {
          name: 'Ticket Triage Agent',
          description: 'Categorizes and prioritizes support tickets',
          type: 'task',
          instructions:
            'You are a ticket triage specialist. Categorize support tickets by urgency, topic, and complexity to ensure proper routing.',
        },
        {
          name: 'Response Drafter',
          description: 'Generates helpful responses using knowledge base',
          type: 'email',
          instructions:
            'You are a customer support expert. Generate helpful, empathetic responses using the knowledge base and best practices.',
        },
        {
          name: 'Sentiment Monitor',
          description: 'Flags urgent or frustrated interactions',
          type: 'data',
          instructions:
            'You are a sentiment analysis specialist. Monitor customer interactions and flag urgent or frustrated cases requiring immediate attention.',
        },
      ];
    } else if (roleLower.includes('operations') || roleLower.includes('manager')) {
      agentConfigs = [
        {
          name: 'Workflow Optimizer',
          description: 'Analyzes and suggests process improvements',
          type: 'data',
          instructions:
            'You are a workflow optimization expert. Analyze operational processes and suggest data-driven improvements.',
        },
        {
          name: 'Task Automator',
          description: 'Automates repetitive operational tasks',
          type: 'task',
          instructions:
            'You are a task automation specialist. Identify and automate repetitive operational tasks to improve efficiency.',
        },
        {
          name: 'Report Generator',
          description: 'Creates operational reports and dashboards',
          type: 'content',
          instructions:
            'You are a reporting expert. Generate comprehensive operational reports with actionable insights.',
        },
      ];
    } else {
      // Default agents
      agentConfigs = [
        {
          name: 'AI Assistant',
          description: 'General-purpose AI helper for various tasks',
          type: 'custom',
          instructions:
            'You are a versatile AI assistant. Help users with various tasks including answering questions, drafting content, and providing information.',
        },
        {
          name: 'Document Processor',
          description: 'Processes and organizes documents',
          type: 'content',
          instructions:
            'You are a document processing specialist. Extract, organize, and summarize information from documents efficiently.',
        },
        {
          name: 'Task Manager',
          description: 'Helps manage and prioritize tasks',
          type: 'task',
          instructions:
            'You are a task management assistant. Help organize, prioritize, and track tasks to improve productivity.',
        },
      ];
    }

    // Create agents in database
    const createdAgents = await db
      .insert(agents)
      .values(
        agentConfigs.map((config) => ({
          workspaceId,
          name: config.name,
          description: config.description,
          type: config.type,
          status: 'active' as const,
          config: {
            aiProvider: 'openai' as const,
            model: 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 2000,
            systemPrompt: config.instructions,
            tools: [],
          },
          createdBy: userId,
          isCustom: false,
        })),
      )
      .returning();

    logger.info('Provisioned agents during onboarding', {
      workspaceId,
      userId,
      agentCount: createdAgents.length,
    });

    return NextResponse.json({
      success: true,
      agents: createdAgents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        type: agent.type,
      })),
    });
  } catch (error) {
    logger.error('Error provisioning agents', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Failed to provision agents' }, { status: 500 });
  }
}
