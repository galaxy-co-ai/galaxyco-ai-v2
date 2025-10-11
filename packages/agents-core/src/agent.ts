/**
 * Agent Class - Core agent implementation following OpenAI SDK patterns
 */

import { Agent as IAgent, AgentConfig, Tool, Guardrail } from "./types";

export class Agent implements IAgent {
  public readonly name: string;
  public readonly instructions: string;
  public readonly model: string;
  public readonly temperature: number;
  public readonly maxTokens?: number;
  public readonly tools: Tool[];
  public readonly guardrails: Guardrail[];

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.model = config.model || "gpt-4o-mini";
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens;
    this.tools = config.tools || [];
    this.guardrails = config.guardrails || [];

    // Validation
    this.validate();
  }

  /**
   * Validate agent configuration
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Agent name is required");
    }

    if (!this.instructions || this.instructions.trim().length === 0) {
      throw new Error("Agent instructions are required");
    }

    if (this.temperature < 0 || this.temperature > 2) {
      throw new Error("Temperature must be between 0 and 2");
    }

    if (this.maxTokens && this.maxTokens < 1) {
      throw new Error("maxTokens must be positive");
    }
  }

  /**
   * Convert agent to a tool (enables Manager pattern)
   * This allows agents to call other agents as tools
   */
  asTool(toolName?: string, description?: string): Tool {
    const name =
      toolName || `call_${this.name.toLowerCase().replace(/\s+/g, "_")}`;
    const desc = description || `Delegate task to ${this.name} agent`;

    return {
      definition: {
        type: "function",
        function: {
          name,
          description: desc,
          parameters: {
            type: "object",
            properties: {
              input: {
                type: "string",
                description: "The input message or task to send to the agent",
              },
              context: {
                type: "object",
                description: "Optional context to pass to the agent",
              },
            },
            required: ["input"],
          },
        },
      },
      execute: async (args: {
        input: string;
        context?: Record<string, any>;
      }) => {
        // Import Runner dynamically to avoid circular dependency
        const { Runner } = await import("./runner");

        const result = await Runner.run(
          this,
          [{ role: "user", content: args.input }],
          {
            context: args.context,
          },
        );

        return {
          success: result.success,
          output: result.finalOutput,
          error: result.error,
        };
      },
    };
  }

  /**
   * Create a deep copy of the agent with modified configuration
   */
  clone(overrides?: Partial<AgentConfig>): Agent {
    return new Agent({
      name: overrides?.name || this.name,
      instructions: overrides?.instructions || this.instructions,
      model: overrides?.model || this.model,
      temperature: overrides?.temperature ?? this.temperature,
      maxTokens: overrides?.maxTokens ?? this.maxTokens,
      tools: overrides?.tools || [...this.tools],
      guardrails: overrides?.guardrails || [...this.guardrails],
    });
  }

  /**
   * Add tools to the agent
   */
  withTools(...tools: Tool[]): Agent {
    return this.clone({
      tools: [...this.tools, ...tools],
    });
  }

  /**
   * Add guardrails to the agent
   */
  withGuardrails(...guardrails: Guardrail[]): Agent {
    return this.clone({
      guardrails: [...this.guardrails, ...guardrails],
    });
  }

  /**
   * Get agent summary for logging/debugging
   */
  toJSON() {
    return {
      name: this.name,
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
      toolCount: this.tools.length,
      guardrailCount: this.guardrails.length,
      instructions: this.instructions.substring(0, 100) + "...",
    };
  }
}
