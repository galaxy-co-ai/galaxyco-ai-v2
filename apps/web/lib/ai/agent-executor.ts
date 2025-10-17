/**
 * Agent Executor with Tool Support
 *
 * Handles agent execution with function/tool calling for OpenAI models.
 * Supports the knowledge base search tool and other function tools.
 */

import OpenAI from "openai";
import { logger } from "@/lib/utils/logger";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { createKnowledgeSearchTool } from "../../../../packages/agents-core/src/tools/knowledge-search";
import type {
  Tool,
  ExecutionContext,
} from "../../../../packages/agents-core/src/types";

export interface AgentExecutionOptions {
  agentId: string;
  workspaceId: string;
  userId: string;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  enableKnowledgeBase?: boolean;
  knowledgeBaseConfig?: {
    collectionIds?: string[];
    maxResults?: number;
  };
}

export interface AgentExecutionInput {
  messages: ChatCompletionMessageParam[];
}

export interface AgentExecutionResult {
  success: boolean;
  content: string;
  toolCalls?: Array<{
    toolName: string;
    arguments: any;
    result: any;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  latencyMs: number;
  model: string;
}

/**
 * Execute an agent with tool calling support
 */
export async function executeAgentWithTools(
  options: AgentExecutionOptions,
  input: AgentExecutionInput,
  apiKey: string,
): Promise<AgentExecutionResult> {
  const startTime = Date.now();

  // Initialize OpenAI client
  const openai = new OpenAI({ apiKey });

  // Build execution context
  const context: ExecutionContext = {
    executionId: `exec_${Date.now()}`,
    workspaceId: options.workspaceId,
    userId: options.userId,
    startTime: new Date(),
    messages: [],
    toolCalls: [],
    iterations: 0,
    metadata: {},
  };

  // Prepare tools array
  const availableTools: Tool[] = [...(options.tools || [])];

  // Add knowledge base tool if enabled
  if (options.enableKnowledgeBase) {
    const knowledgeSearchTool = createKnowledgeSearchTool();
    availableTools.push(knowledgeSearchTool);
  }

  // Convert tools to OpenAI format
  const openAITools: ChatCompletionTool[] = availableTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.definition.function.name,
      description: tool.definition.function.description,
      parameters: tool.definition.function.parameters,
    },
  }));

  // Prepare messages
  const messages: ChatCompletionMessageParam[] = [];

  // Add system message if provided
  if (options.systemPrompt) {
    messages.push({
      role: "system",
      content: options.systemPrompt,
    });
  }

  // Add user messages
  messages.push(...input.messages);

  // Track tool calls
  const toolCallHistory: Array<{
    toolName: string;
    arguments: any;
    result: any;
  }> = [];

  // Execute with tool calling loop (max 5 iterations to prevent infinite loops)
  let currentMessages = [...messages];
  let finalResponse: string = "";
  let totalUsage = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };

  for (let iteration = 0; iteration < 5; iteration++) {
    try {
      // Call OpenAI with tools
      const completion = await openai.chat.completions.create({
        model: options.model,
        messages: currentMessages,
        tools: openAITools.length > 0 ? openAITools : undefined,
        tool_choice: openAITools.length > 0 ? "auto" : undefined,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      });

      const response = completion.choices[0];
      const usage = completion.usage;

      // Track usage
      if (usage) {
        totalUsage.promptTokens += usage.prompt_tokens;
        totalUsage.completionTokens += usage.completion_tokens;
        totalUsage.totalTokens += usage.total_tokens;
      }

      // Add assistant message to history
      currentMessages.push(response.message);

      // Check if there are tool calls
      if (
        response.message.tool_calls &&
        response.message.tool_calls.length > 0
      ) {
        // Execute each tool call
        for (const toolCall of response.message.tool_calls) {
          if (toolCall.type !== "function" || !toolCall.function) continue;
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          // Find the tool
          const tool = availableTools.find(
            (t) => t.definition.function.name === toolName,
          );

          if (!tool) {
            logger.error(`Tool not found: ${toolName}`);
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({
                error: `Tool '${toolName}' not found`,
              }),
            });
            continue;
          }

          // Execute the tool
          try {
            logger.info(`[Agent Executor] Executing tool: ${toolName}`, {
              toolArgs,
            });
            const toolResult = await tool.execute(toolArgs, context);

            // Track tool call
            toolCallHistory.push({
              toolName,
              arguments: toolArgs,
              result: toolResult,
            });

            // Add tool result to messages
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            });
          } catch (error: any) {
            logger.error(`[Agent Executor] Tool execution error`, error);
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({
                error: error.message,
                success: false,
              }),
            });
          }
        }

        // Continue loop to let agent process tool results
        continue;
      }

      // No more tool calls, we have the final response
      if (response.message.content) {
        finalResponse = response.message.content;
        break;
      }

      // No content and no tool calls - something went wrong
      logger.warn("[Agent Executor] No content or tool calls in response");
      break;
    } catch (error: any) {
      logger.error("[Agent Executor] OpenAI API error", error);
      throw new Error(`Agent execution failed: ${error.message}`);
    }
  }

  const latencyMs = Date.now() - startTime;

  // Calculate cost (approximate, based on gpt-4-turbo pricing)
  // $0.01 per 1K prompt tokens, $0.03 per 1K completion tokens
  const cost =
    (totalUsage.promptTokens / 1000) * 0.01 +
    (totalUsage.completionTokens / 1000) * 0.03;

  return {
    success: true,
    content: finalResponse,
    toolCalls: toolCallHistory,
    usage: totalUsage,
    cost,
    latencyMs,
    model: options.model,
  };
}

/**
 * Helper to format tool execution results for display
 */
export function formatToolCalls(
  toolCalls: Array<{
    toolName: string;
    arguments: any;
    result: any;
  }>,
): string {
  if (!toolCalls || toolCalls.length === 0) {
    return "No tools were used in this execution.";
  }

  return toolCalls
    .map((call, index) => {
      return `Tool ${index + 1}: ${call.toolName}\nArguments: ${JSON.stringify(call.arguments, null, 2)}\nResult: ${JSON.stringify(call.result, null, 2)}`;
    })
    .join("\n\n---\n\n");
}
