/**
 * Runner - Agent execution engine with loop control
 * Following OpenAI Agents SDK patterns
 */

import OpenAI from 'openai';
// Note: Sentry import will be available when running in Next.js context
// For standalone usage, this should be replaced with a generic error tracking solution
let Sentry: any;
try {
  Sentry = require('@sentry/nextjs');
} catch {
  // Fallback for environments without Sentry
  Sentry = {
    startTransaction: () => ({
      setStatus: () => {},
      setData: () => {},
      finish: () => {},
    }),
    getCurrentScope: () => ({ setSpan: () => {} }),
    captureException: console.error,
  };
}
import {
  Agent,
  Message,
  RunOptions,
  RunResult,
  ToolCall,
  GuardrailError,
  ToolExecutionError,
  MaxIterationsError,
  ExecutionContext,
} from './types';
import { randomUUID } from 'crypto';

export class Runner {
  /**
   * Execute an agent with the given messages
   * This is the main entry point for agent execution
   */
  static async run(
    agent: Agent,
    messages: Message[],
    options: RunOptions = {},
  ): Promise<RunResult> {
    const startTime = new Date();
    const executionId = randomUUID();

    // Validate required options for multi-tenant safety
    if (!options.workspaceId || !options.userId) {
      throw new Error(
        'workspaceId and userId are required for agent execution (multi-tenant safety)',
      );
    }

    // Default options
    const maxIterations = options.maxIterations || 10;
    const timeout = options.timeout || 60000; // 60 seconds

    // Execution context
    const context: ExecutionContext = {
      executionId,
      workspaceId: options.workspaceId,
      userId: options.userId,
      startTime,
      messages: [...messages],
      toolCalls: [],
      iterations: 0,
      metadata: options.context || {},
    };

    try {
      // Start Sentry transaction for agent execution
      const transaction = Sentry.startTransaction({
        op: 'agent.execution',
        name: `Agent: ${agent.name}`,
        data: {
          agentId: agent.id,
          agentName: agent.name,
          workspaceId: options.workspaceId,
          userId: options.userId,
          executionId,
        },
      });

      Sentry.getCurrentScope().setSpan(transaction);

      // Run guardrails on input
      await this.runInputGuardrails(agent, messages, context);

      // Execute the agent loop
      const result = await this.executeLoop(agent, context, maxIterations, timeout);

      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();

      // Finish transaction with success
      transaction.setStatus('ok');
      transaction.setData('iterations', context.iterations);
      transaction.setData('tokensUsed', result.tokensUsed);
      transaction.setData('costUsd', result.costUsd);
      transaction.finish();

      return {
        success: true,
        messages: context.messages,
        finalOutput: result.finalOutput,
        metadata: {
          executionId,
          startTime,
          endTime,
          durationMs,
          iterations: context.iterations,
          tokensUsed: result.tokensUsed,
          costUsd: result.costUsd,
          model: agent.model,
        },
      };
    } catch (error: any) {
      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();

      // Capture error in Sentry with context
      Sentry.captureException(error, {
        tags: {
          agent_id: agent.id,
          agent_name: agent.name,
          execution_id: executionId,
          workspace_id: options.workspaceId,
          error_type: error.constructor.name,
        },
        contexts: {
          agent: {
            id: agent.id,
            name: agent.name,
            model: agent.model,
            tools: agent.tools.map((t) => t.definition.function.name),
          },
          execution: {
            executionId,
            iterations: context.iterations,
            durationMs,
            workspaceId: options.workspaceId,
            userId: options.userId,
          },
        },
      });

      return {
        success: false,
        messages: context.messages,
        error: error.message || 'Unknown error',
        metadata: {
          executionId,
          startTime,
          endTime,
          durationMs,
          iterations: context.iterations,
          tokensUsed: 0,
          costUsd: 0,
          model: agent.model,
        },
      };
    }
  }

  /**
   * Main execution loop
   */
  private static async executeLoop(
    agent: Agent,
    context: ExecutionContext,
    maxIterations: number,
    timeout: number,
  ): Promise<{ finalOutput?: any; tokensUsed: number; costUsd: number }> {
    let totalTokens = 0;
    let totalCost = 0;

    // Add cost tracking to context metadata for guardrails
    context.metadata.tokensUsed = 0;
    context.metadata.costUsd = 0;

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build initial messages (system + user messages)
    const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: agent.instructions },
      ...context.messages.map(
        (msg) =>
          ({
            role: msg.role,
            content: msg.content,
          }) as OpenAI.Chat.ChatCompletionMessageParam,
      ),
    ];

    // Execute loop
    while (context.iterations < maxIterations) {
      context.iterations++;

      // Check cost limits BEFORE starting iteration (cost guardrails)
      await this.runCostGuardrails(agent, context);

      // Call LLM
      const completion = await openai.chat.completions.create({
        model: agent.model,
        messages: allMessages,
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
        tools: agent.tools.length > 0 ? agent.tools.map((tool) => tool.definition) : undefined,
      });

      const choice = completion.choices[0];
      const message = choice.message;

      // Track tokens and cost
      totalTokens += completion.usage?.total_tokens || 0;
      totalCost += this.estimateCost(
        agent.model,
        completion.usage?.prompt_tokens || 0,
        completion.usage?.completion_tokens || 0,
      );

      // Update context metadata with latest cost data for guardrails
      context.metadata.tokensUsed = totalTokens;
      context.metadata.costUsd = totalCost;

      // Add assistant message to context
      const assistantMessage: Message = {
        role: 'assistant',
        content: message.content || '',
        tool_calls: message.tool_calls?.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      };
      context.messages.push(assistantMessage);
      allMessages.push(message as OpenAI.Chat.ChatCompletionMessageParam);

      // Check for completion (no tool calls)
      if (!message.tool_calls || message.tool_calls.length === 0) {
        // Run output guardrails
        await this.runOutputGuardrails(agent, message.content || '', context);

        return {
          finalOutput: message.content,
          tokensUsed: totalTokens,
          costUsd: totalCost,
        };
      }

      // Execute tool calls
      for (const toolCall of message.tool_calls) {
        const tool = agent.tools.find((t) => t.definition.function.name === toolCall.function.name);

        if (!tool) {
          throw new ToolExecutionError(
            `Tool not found: ${toolCall.function.name}`,
            toolCall.function.name,
          );
        }

        try {
          // Start span for tool execution
          const span = Sentry.getCurrentScope()
            .getSpan()
            ?.startChild({
              op: 'tool.execution',
              description: `Tool: ${toolCall.function.name}`,
            });

          // Parse arguments
          const args = JSON.parse(toolCall.function.arguments);

          // Run tool guardrails
          await this.runToolGuardrails(agent, tool, args, context);

          // Execute tool with context (for database queries, etc.)
          const result = await tool.execute(args, context);

          // Finish span with success
          span?.setStatus('ok');
          span?.finish();

          // Add tool result to messages
          const toolMessage: Message = {
            role: 'tool',
            content: JSON.stringify(result),
            tool_call_id: toolCall.id,
          };
          context.messages.push(toolMessage);
          allMessages.push({
            role: 'tool',
            content: JSON.stringify(result),
            tool_call_id: toolCall.id,
          });

          context.toolCalls.push({
            id: toolCall.id,
            type: 'function',
            function: {
              name: toolCall.function.name,
              arguments: toolCall.function.arguments,
            },
          });
        } catch (error: any) {
          // Capture tool execution error
          Sentry.captureException(error, {
            tags: {
              tool_name: toolCall.function.name,
              agent_id: agent.id,
              execution_id: context.executionId,
            },
          });

          throw new ToolExecutionError(
            `Tool execution failed: ${error.message}`,
            toolCall.function.name,
            error,
          );
        }
      }
    }

    throw new MaxIterationsError(maxIterations);
  }

  /**
   * Run input guardrails
   */
  private static async runInputGuardrails(
    agent: Agent,
    messages: Message[],
    context: ExecutionContext,
  ): Promise<void> {
    const inputGuardrails = agent.guardrails.filter((g) => g.type === 'input');

    for (const guardrail of inputGuardrails) {
      const result = await guardrail.check(messages, context.metadata);
      if (!result.passed) {
        throw new GuardrailError(`Input guardrail failed: ${guardrail.name} - ${result.reason}`, {
          guardrail: guardrail.name,
          ...result.metadata,
        });
      }
    }
  }

  /**
   * Run output guardrails
   */
  private static async runOutputGuardrails(
    agent: Agent,
    output: string,
    context: ExecutionContext,
  ): Promise<void> {
    const outputGuardrails = agent.guardrails.filter((g) => g.type === 'output');

    for (const guardrail of outputGuardrails) {
      const result = await guardrail.check(output, context.metadata);
      if (!result.passed) {
        throw new GuardrailError(`Output guardrail failed: ${guardrail.name} - ${result.reason}`, {
          guardrail: guardrail.name,
          ...result.metadata,
        });
      }
    }
  }

  /**
   * Run tool guardrails
   */
  private static async runToolGuardrails(
    agent: Agent,
    tool: any,
    args: any,
    context: ExecutionContext,
  ): Promise<void> {
    const toolGuardrails = agent.guardrails.filter((g) => g.type === 'tool');

    for (const guardrail of toolGuardrails) {
      const result = await guardrail.check({ tool, args }, context.metadata);
      if (!result.passed) {
        throw new GuardrailError(`Tool guardrail failed: ${guardrail.name} - ${result.reason}`, {
          guardrail: guardrail.name,
          ...result.metadata,
        });
      }
    }
  }

  /**
   * Run cost guardrails (token limits, cost limits, iteration limits)
   */
  private static async runCostGuardrails(agent: Agent, context: ExecutionContext): Promise<void> {
    const costGuardrails = agent.guardrails.filter((g) => g.type === 'cost');

    for (const guardrail of costGuardrails) {
      const result = await guardrail.check(null, context as any);
      if (!result.passed) {
        throw new GuardrailError(`Cost guardrail failed: ${guardrail.name} - ${result.reason}`, {
          guardrail: guardrail.name,
          ...result.metadata,
        });
      }
    }
  }

  /**
   * Estimate cost based on model and token usage
   */
  private static estimateCost(
    model: string,
    promptTokens: number,
    completionTokens: number,
  ): number {
    // Pricing per 1M tokens (as of Oct 2024)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 2.5, output: 10 },
      'gpt-4o-mini': { input: 0.15, output: 0.6 },
      'gpt-4-turbo': { input: 10, output: 30 },
      'gpt-4': { input: 30, output: 60 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    };

    const modelPricing = pricing[model] || pricing['gpt-4o-mini'];

    const inputCost = (promptTokens / 1_000_000) * modelPricing.input;
    const outputCost = (completionTokens / 1_000_000) * modelPricing.output;

    return inputCost + outputCost;
  }
}
