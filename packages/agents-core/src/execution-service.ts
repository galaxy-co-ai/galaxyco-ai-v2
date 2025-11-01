/**
 * Agent Execution Service
 *
 * High-level service for executing agents with database integration.
 * This bridges the gap between database models and the core Agent/Runner system.
 */

import { Agent } from './agent';
import { Runner } from './runner';
import { createTool } from './tools';
import { getToolsForAgentType } from './tools/index';
import type { Message, RunResult, Tool } from './types';

/**
 * Database agent record structure (from your schema)
 */
export interface DbAgent {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  config: {
    aiProvider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    tools?: string[];
  };
  createdBy: string;
  isCustom: boolean;
}

/**
 * Execution request
 */
export interface ExecutionRequest {
  agentId: string;
  workspaceId: string;
  userId?: string;
  inputs: Record<string, any>;
  mode?: 'live' | 'mock';
}

/**
 * Execution result (compatible with your current API)
 */
export interface ExecutionResult {
  id: string;
  timestamp: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  success: boolean;
  error?: string;
  metrics: {
    durationMs: number;
    tokensUsed: number;
    costUsd: number;
    model?: string;
  };
}

/**
 * Agent Execution Service
 * Orchestrates agent execution using the new core system
 */
export class AgentExecutionService {
  /**
   * Convert database agent to core Agent instance
   */
  static dbAgentToCoreAgent(dbAgent: DbAgent, tools: Tool[] = []): Agent {
    const instructions = this.generateInstructions(dbAgent);

    return new Agent({
      name: dbAgent.name,
      instructions,
      model: dbAgent.config.model || 'gpt-4o-mini',
      temperature: dbAgent.config.temperature ?? 0.7,
      maxTokens: dbAgent.config.maxTokens,
      tools,
    });
  }

  /**
   * Generate instructions based on agent type and config
   */
  private static generateInstructions(dbAgent: DbAgent): string {
    // Use systemPrompt if provided
    if (dbAgent.config.systemPrompt) {
      return dbAgent.config.systemPrompt;
    }

    // Generate default instructions based on type
    const typeInstructions: Record<string, string> = {
      scope: `You are a Scope Agent specialized in analyzing requirements and extracting key information.
Your tasks:
- Analyze email threads and documents
- Extract action items and priorities
- Identify key stakeholders
- Summarize complex information
- Flag important deadlines

Be thorough, accurate, and highlight critical details.`,

      email: `You are an Email Agent specialized in drafting professional communications.
Your tasks:
- Draft clear and professional emails
- Maintain appropriate tone and style
- Ensure proper email etiquette
- Personalize content based on context
- Flag sensitive topics

Be professional, concise, and empathetic.`,

      call: `You are a Call Agent specialized in analyzing conversations and calls.
Your tasks:
- Transcribe and summarize call content
- Extract key discussion points
- Identify action items and decisions
- Note follow-up requirements
- Capture important quotes

Be accurate and capture the essential information.`,

      note: `You are a Note Agent specialized in processing and organizing notes.
Your tasks:
- Process and categorize notes
- Extract key insights
- Link related information
- Generate summaries
- Tag relevant topics

Be organized and thorough.`,

      task: `You are a Task Agent specialized in task management.
Your tasks:
- Create well-defined tasks
- Set appropriate priorities
- Identify dependencies
- Assign to right people
- Track progress

Be clear and actionable.`,

      roadmap: `You are a Roadmap Agent specialized in product planning.
Your tasks:
- Analyze feature requests
- Assess priorities and dependencies
- Estimate effort and timeline
- Map to product strategy
- Identify risks

Be strategic and data-driven.`,

      content: `You are a Content Agent specialized in content creation.
Your tasks:
- Generate high-quality content
- Maintain consistent tone
- Optimize for SEO
- Ensure readability
- Follow brand guidelines

Be creative and engaging.`,

      custom: `You are a versatile AI agent. Follow the instructions provided and complete tasks accurately.`,
    };

    return (
      typeInstructions[dbAgent.type] ||
      `You are a ${dbAgent.name}. ${dbAgent.description || 'Help users with their tasks.'}`
    );
  }

  /**
   * Execute agent with inputs
   */
  static async execute(
    dbAgent: DbAgent,
    request: ExecutionRequest,
    additionalTools: Tool[] = [],
  ): Promise<ExecutionResult> {
    try {
      // Get default tools for this agent type
      const defaultTools = getToolsForAgentType(dbAgent.type);
      const allTools = [...defaultTools, ...additionalTools];

      // Convert to core Agent
      const agent = this.dbAgentToCoreAgent(dbAgent, allTools);

      // Prepare input message
      const inputMessage = this.prepareInputMessage(dbAgent.type, request.inputs);

      // Execute using Runner
      const result: RunResult = await Runner.run(agent, [{ role: 'user', content: inputMessage }], {
        workspaceId: request.workspaceId,
        userId: request.userId,
        maxIterations: 10,
        timeout: 60000,
      });

      // Convert to execution result format
      return {
        id: result.metadata.executionId,
        timestamp: result.metadata.startTime.toISOString(),
        inputs: request.inputs,
        outputs: this.parseOutput(dbAgent.type, result.finalOutput || ''),
        success: result.success,
        error: result.error,
        metrics: {
          durationMs: result.metadata.durationMs,
          tokensUsed: result.metadata.tokensUsed,
          costUsd: result.metadata.costUsd,
          model: result.metadata.model,
        },
      };
    } catch (error: any) {
      return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        inputs: request.inputs,
        outputs: {},
        success: false,
        error: error.message || 'Execution failed',
        metrics: {
          durationMs: 0,
          tokensUsed: 0,
          costUsd: 0,
        },
      };
    }
  }

  /**
   * Prepare input message based on agent type
   */
  private static prepareInputMessage(agentType: string, inputs: Record<string, any>): string {
    // Convert structured inputs to natural language prompt
    const parts: string[] = [];

    for (const [key, value] of Object.entries(inputs)) {
      if (value) {
        parts.push(`${key}: ${JSON.stringify(value)}`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Parse agent output into structured format
   */
  private static parseOutput(agentType: string, output: string): Record<string, any> {
    // Try to parse as JSON first
    try {
      return JSON.parse(output);
    } catch {
      // Return as-is with type-specific structure
      return {
        result: output,
        type: agentType,
      };
    }
  }

  /**
   * Create default tools for agent types
   */
  static createDefaultTools(agentType: string): Tool[] {
    const tools: Tool[] = [];

    // Type-specific tools can be added here
    // For now, return empty array - tools will be added in Week 2

    return tools;
  }
}
