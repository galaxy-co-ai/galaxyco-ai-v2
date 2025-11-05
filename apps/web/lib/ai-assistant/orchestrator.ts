/**
 * AI Assistant Orchestrator
 *
 * The brain of the AI Assistant. Handles:
 * - Natural language understanding
 * - Intent detection
 * - Tool selection and execution
 * - Multi-step planning
 * - Conversation context
 * - Error handling with graceful degradation
 *
 * Uses GPT-4 for reasoning and tool orchestration.
 */

import { AIGatewayService } from '@/lib/ai-gateway';
import { getRAGService } from '@/lib/services/rag-service-v2';
import { executeTool, getToolDefinitionsForAI, getAllTools } from './tools/registry';
import type { ToolContext, ToolResult, ToolAction } from './tools/types';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
}

export interface AssistantResponse {
  message: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  actions?: ToolAction[]; // For UI feedback
  suggestedFollowUps?: string[]; // Suggested next questions
}

export interface ConversationContext {
  messages: AssistantMessage[];
  workspaceId: string;
  userId: string;
}

export class AIOrchestrator {
  private ragService: ReturnType<typeof getRAGService>;

  constructor() {
    this.ragService = getRAGService();
  }

  /**
   * Call AI with tool support (wrapper for AI Gateway)
   */
  private async callAI(params: {
    messages: Array<{ role: string; content: string }>;
    tools?: any[];
    temperature?: number;
    workspaceId: string; // Required for AI Gateway
  }): Promise<any> {
    // For now, use simplified response without tool calling
    // In production, integrate with AI SDK for function calling
    const response = await AIGatewayService.generateText({
      model: 'gpt-4',
      tenantId: params.workspaceId, // Use workspace ID as tenant ID
      messages: params.messages as any,
      temperature: params.temperature || 0.7,
    });

    return {
      content: response.content,
      tool_calls: [], // TODO: Add tool calling support
    };
  }

  /**
   * Process a user message and orchestrate the appropriate response
   */
  async processMessage(
    userMessage: string,
    context: ConversationContext,
    toolContext: ToolContext,
  ): Promise<AssistantResponse> {
    try {
      // 1. Enhance user message with RAG context (knowledge base)
      const ragContext = await this.ragService.getRAGContext(userMessage, context.workspaceId, 3);

      // 2. Build conversation messages with system prompt
      const messages = [
        {
          role: 'system' as const,
          content: this.buildSystemPrompt(ragContext.summary),
        },
        ...context.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // 3. Call GPT-4 with tool definitions
      const response = await this.callAI({
        messages,
        tools: getToolDefinitionsForAI(),
        temperature: 0.7,
        workspaceId: context.workspaceId,
      });

      // 4. Handle tool calls if any
      const toolResults: ToolResult[] = [];
      const actions: ToolAction[] = [];

      if (response.tool_calls && response.tool_calls.length > 0) {
        // Execute each tool call
        for (const toolCall of response.tool_calls) {
          try {
            const result = await executeTool(
              toolCall.function.name,
              JSON.parse(toolCall.function.arguments),
              toolContext,
            );

            toolResults.push(result);

            // Collect actions for UI feedback
            if (result.action) {
              actions.push(result.action);
            }
          } catch (error: any) {
            // Handle tool execution errors gracefully
            toolResults.push({
              success: false,
              error: error.message,
              message: `Failed to execute ${toolCall.function.name}: ${error.message}`,
            });
          }
        }

        // 5. If tools were called, get final response with results
        const finalMessages = [
          ...messages,
          {
            role: 'assistant' as const,
            content: response.content || '',
            tool_calls: response.tool_calls,
          },
          ...toolResults.map((result, i) => ({
            role: 'tool' as const,
            tool_call_id: response.tool_calls![i].id,
            content: JSON.stringify(result),
          })),
        ];

        const finalResponse = await this.callAI({
          messages: finalMessages as any,
          temperature: 0.7,
          workspaceId: context.workspaceId,
        });

        return {
          message: finalResponse.content || '',
          toolCalls: response.tool_calls.map((tc: any) => ({
            id: tc.id,
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments),
          })),
          toolResults,
          actions,
          suggestedFollowUps: this.generateFollowUps(toolResults),
        };
      }

      // 6. No tools called, just return AI response
      return {
        message: response.content || '',
        suggestedFollowUps: this.generateFollowUps([]),
      };
    } catch (error: any) {
      console.error('Orchestrator error:', error);

      // Graceful degradation
      return {
        message: `I encountered an error: ${error.message}. Could you try rephrasing your request?`,
        toolResults: [],
      };
    }
  }

  /**
   * Build system prompt with platform knowledge
   */
  private buildSystemPrompt(ragContext: string): string {
    return `You are the GalaxyCo.ai Assistant - an AI that can control the entire platform.

CAPABILITIES:
You can perform ANY action a user can do on the platform:
- Create, update, and manage AI agents
- Build and configure workflows
- Connect integrations (Gmail, Slack, HubSpot, etc.)
- Manage contacts and CRM data
- Query analytics and generate reports
- Upload and search knowledge base
- Update settings and configurations

PERSONALITY:
- Helpful and proactive
- Clear and concise
- Always show what you're doing
- Explain actions in simple terms
- Suggest next steps

RULES:
1. ALWAYS use tools to actually DO things, don't just explain
2. Ask for clarification if request is ambiguous
3. Confirm destructive actions before executing
4. Multi-tenant: ALWAYS filter by workspaceId
5. Be conversational but professional

PLATFORM KNOWLEDGE:
${ragContext || 'No specific context available'}

When user asks you to do something:
1. Determine which tool(s) to use
2. Extract parameters from their message
3. Execute the tool(s)
4. Explain what you did in friendly language
5. Suggest related next steps

Remember: You can ACTUALLY DO THINGS, not just talk about them!`;
  }

  /**
   * Generate suggested follow-up questions based on what was just done
   */
  private generateFollowUps(toolResults: ToolResult[]): string[] {
    if (toolResults.length === 0) {
      return [
        'What would you like me to help you with?',
        'Need help creating an agent or workflow?',
        'Want to see your analytics?',
      ];
    }

    // Generate contextual follow-ups based on tool results
    const followUps: string[] = [];

    for (const result of toolResults) {
      if (result.success && result.data) {
        // Agent created
        if (result.data.type === 'agent') {
          followUps.push('Want me to activate this agent?');
          followUps.push('Should I create a workflow for this agent?');
        }

        // Workflow created
        if (result.data.type === 'workflow') {
          followUps.push('Ready to test this workflow?');
          followUps.push('Want to add more steps?');
        }
      }
    }

    return followUps.slice(0, 3); // Max 3 suggestions
  }

  /**
   * Handle multi-step planning for complex requests
   */
  async planMultiStep(
    request: string,
    context: ToolContext,
  ): Promise<{
    steps: Array<{ tool: string; params: any; description: string }>;
    estimatedDuration: number;
  }> {
    const response = await this.callAI({
      messages: [
        {
          role: 'system',
          content: `You are a planning assistant. Break down complex requests into sequential steps.
Each step should be a single tool call.
Available tools: ${getAllTools()
            .map((t) => t.name)
            .join(', ')}`,
        },
        {
          role: 'user',
          content: `Plan the steps needed for: "${request}"`,
        },
      ],
      temperature: 0.3, // Lower for more deterministic planning
      workspaceId: context.workspaceId,
    });

    // Parse plan from response
    // This is simplified - production would use structured output
    return {
      steps: [],
      estimatedDuration: 0,
    };
  }
}

// Export singleton instance
let orchestratorInstance: AIOrchestrator | null = null;

export function getOrchestrator(): AIOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIOrchestrator();
  }
  return orchestratorInstance;
}
