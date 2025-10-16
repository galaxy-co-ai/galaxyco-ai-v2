/**
 * Agent Interface & Base Class
 *
 * Standardized interface that all agents must implement per rule OyCoQzeTnn2qmcEcvGl6v7:
 * 1) Every agent must follow the standard interface: id, name, trigger, inputs, aiProvider, process, output
 * 2) All AI provider calls must be wrapped in error handling with fallback logic
 * 3) Agent logs must include: timestamp, tenant_id, user_id, input summary, output summary, duration_ms
 * 4) Never hard-code AI provider keys—always use environment variables
 * 5) Test agents with mock data before connecting real integrations
 */

import {
  AIProviderWrapper,
  AIProvider,
  createAIProvider,
  getProviderConfigFromEnv,
  validateProviderConfig,
} from "./ai-provider-wrapper";
import { logAgentExecution } from "./agent-logger";

export type AgentTriggerType =
  | "manual"
  | "schedule"
  | "webhook"
  | "event"
  | "email"
  | "knowledge_update"
  | "user_action";

export interface AgentTrigger {
  type: AgentTriggerType;
  config: {
    schedule?: string; // cron expression for scheduled triggers
    webhook_path?: string; // for webhook triggers
    event_type?: string; // for event-based triggers
    conditions?: Record<string, any>; // additional trigger conditions
  };
}

export interface AgentInput {
  name: string;
  type: "text" | "number" | "boolean" | "file" | "json" | "array";
  required: boolean;
  description: string;
  default?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: any[];
  };
}

export interface AgentOutput {
  name: string;
  type: "text" | "number" | "boolean" | "file" | "json" | "array";
  description: string;
}

export interface AgentExecutionContext {
  tenantId: string;
  userId: string;
  workspaceId: string;
  executionId: string;
  triggeredBy: "user" | "system" | "schedule" | "webhook";
  metadata?: Record<string, any>;
}

export interface AgentExecutionResult {
  success: boolean;
  data: Record<string, any>;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    tokensUsed?: number;
    duration?: number;
    provider?: string;
    model?: string;
    [key: string]: any;
  };
}

/**
 * Standardized Agent Interface
 *
 * All agents must implement this interface to ensure consistency
 * and proper integration with the platform.
 */
export abstract class BaseAgent {
  // Required standard interface properties
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract readonly version: string;
  public abstract readonly triggers: AgentTrigger[];
  public abstract readonly inputs: AgentInput[];
  public abstract readonly outputs: AgentOutput[];
  public abstract readonly aiProvider: {
    primary: AIProvider;
    fallback?: AIProvider;
    model: string;
    temperature?: number;
    maxTokens?: number;
  };

  // Internal state
  private aiWrapper?: AIProviderWrapper;
  private readonly requiredEnvVars: string[] = [];

  constructor() {
    // Environment validation will be done lazily when needed
    // This prevents issues during build-time when subclass properties aren't initialized yet
  }

  /**
   * Main agent execution method - must be implemented by each agent
   */
  public abstract process(
    inputs: Record<string, any>,
    context: AgentExecutionContext,
  ): Promise<AgentExecutionResult>;

  /**
   * Initialize AI provider with error handling and fallback logic
   */
  protected async initializeAI(
    context: AgentExecutionContext,
  ): Promise<AIProviderWrapper> {
    if (this.aiWrapper) {
      return this.aiWrapper;
    }

    // Validate environment now that subclass is fully initialized
    this.validateEnvironment();

    // Get primary provider config
    const primaryConfig = getProviderConfigFromEnv(this.aiProvider.primary);
    if (
      !primaryConfig ||
      !validateProviderConfig(this.aiProvider.primary, primaryConfig)
    ) {
      throw new Error(
        `Failed to configure primary AI provider: ${this.aiProvider.primary}`,
      );
    }

    // Get fallback provider config (optional)
    let fallbackConfig = null;
    if (this.aiProvider.fallback) {
      fallbackConfig = getProviderConfigFromEnv(this.aiProvider.fallback);
      if (
        !fallbackConfig ||
        !validateProviderConfig(this.aiProvider.fallback, fallbackConfig)
      ) {
        console.warn(
          `[AGENT ${this.id}] Fallback provider unavailable: ${this.aiProvider.fallback}`,
        );
        fallbackConfig = null;
      }
    }

    // Create AI wrapper
    this.aiWrapper = createAIProvider({
      agentId: this.id,
      tenantId: context.tenantId,
      userId: context.userId,
      primary: {
        provider: this.aiProvider.primary,
        config: primaryConfig,
      },
      fallback: fallbackConfig
        ? {
            provider: this.aiProvider.fallback!,
            config: fallbackConfig,
          }
        : undefined,
    });

    return this.aiWrapper;
  }

  /**
   * Validate all required inputs are present and valid
   */
  protected validateInputs(inputs: Record<string, any>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const input of this.inputs) {
      if (
        input.required &&
        (inputs[input.name] === undefined || inputs[input.name] === null)
      ) {
        errors.push(`Required input '${input.name}' is missing`);
        continue;
      }

      if (inputs[input.name] !== undefined) {
        const value = inputs[input.name];

        // Type validation
        switch (input.type) {
          case "text":
            if (typeof value !== "string") {
              errors.push(`Input '${input.name}' must be a string`);
            }
            break;
          case "number":
            if (typeof value !== "number") {
              errors.push(`Input '${input.name}' must be a number`);
            }
            break;
          case "boolean":
            if (typeof value !== "boolean") {
              errors.push(`Input '${input.name}' must be a boolean`);
            }
            break;
          case "array":
            if (!Array.isArray(value)) {
              errors.push(`Input '${input.name}' must be an array`);
            }
            break;
          case "json":
            if (typeof value !== "object") {
              errors.push(`Input '${input.name}' must be a valid JSON object`);
            }
            break;
        }

        // Additional validation rules
        if (input.validation) {
          const validation = input.validation;

          if (
            validation.min !== undefined &&
            typeof value === "number" &&
            value < validation.min
          ) {
            errors.push(
              `Input '${input.name}' must be at least ${validation.min}`,
            );
          }

          if (
            validation.max !== undefined &&
            typeof value === "number" &&
            value > validation.max
          ) {
            errors.push(
              `Input '${input.name}' must be at most ${validation.max}`,
            );
          }

          if (validation.pattern && typeof value === "string") {
            const regex = new RegExp(validation.pattern);
            if (!regex.test(value)) {
              errors.push(
                `Input '${input.name}' does not match required pattern`,
              );
            }
          }

          if (
            validation.allowedValues &&
            !validation.allowedValues.includes(value)
          ) {
            errors.push(
              `Input '${input.name}' must be one of: ${validation.allowedValues.join(", ")}`,
            );
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Execute agent with full logging and error handling
   */
  public async execute(
    inputs: Record<string, any>,
    context: AgentExecutionContext,
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    let result: AgentExecutionResult;

    try {
      console.info(`[AGENT ${this.id}] Starting execution`, {
        agent_id: this.id,
        tenant_id: context.tenantId,
        user_id: context.userId,
        execution_id: context.executionId,
        triggered_by: context.triggeredBy,
      });

      // Validate inputs
      const validation = this.validateInputs(inputs);
      if (!validation.valid) {
        throw new Error(
          `Input validation failed: ${validation.errors.join(", ")}`,
        );
      }

      // Execute the agent's core logic
      result = await this.process(inputs, context);

      const duration = Date.now() - startTime;
      result.metadata = {
        ...result.metadata,
        duration,
      };

      // Log successful execution
      await logAgentExecution({
        agentId: this.id,
        tenantId: context.tenantId,
        userId: context.userId,
        input: inputs,
        output: result.data,
        duration,
        success: true,
        provider: result.metadata?.provider,
        model: result.metadata?.model,
      });

      console.info(`[AGENT ${this.id}] Execution completed successfully`, {
        agent_id: this.id,
        execution_id: context.executionId,
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      result = {
        success: false,
        data: {},
        error: {
          message: errorMessage,
          code:
            error instanceof Error && "code" in error
              ? (error as any).code
              : "EXECUTION_ERROR",
        },
        metadata: {
          duration,
        },
      };

      // Log failed execution
      await logAgentExecution({
        agentId: this.id,
        tenantId: context.tenantId,
        userId: context.userId,
        input: inputs,
        output: {},
        duration,
        success: false,
        error: errorMessage,
      });

      console.error(`[AGENT ${this.id}] Execution failed`, {
        agent_id: this.id,
        execution_id: context.executionId,
        duration,
        error: errorMessage,
        success: false,
      });

      return result;
    }
  }

  /**
   * Test agent with mock data - required before production deployment
   */
  public async test(mockInputs?: Record<string, any>): Promise<{
    success: boolean;
    results: AgentExecutionResult;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Create test context
    const testContext: AgentExecutionContext = {
      tenantId: "test-tenant",
      userId: "test-user",
      workspaceId: "test-workspace",
      executionId: `test-${Date.now()}`,
      triggeredBy: "system",
      metadata: { isTest: true },
    };

    // Use provided mock inputs or generate defaults
    const testInputs = mockInputs || this.generateMockInputs();

    try {
      // Test input validation
      const validation = this.validateInputs(testInputs);
      if (!validation.valid) {
        issues.push(...validation.errors);
      }

      // Test AI provider initialization
      try {
        await this.initializeAI(testContext);
      } catch (error) {
        issues.push(
          `AI provider initialization failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      // Test execution
      const results = await this.execute(testInputs, testContext);

      // Check if outputs match expected schema
      for (const output of this.outputs) {
        if (results.success && !(output.name in results.data)) {
          issues.push(`Expected output '${output.name}' not found in results`);
        }
      }

      return {
        success: issues.length === 0,
        results,
        issues,
      };
    } catch (error) {
      issues.push(
        `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );

      return {
        success: false,
        results: {
          success: false,
          data: {},
          error: {
            message: error instanceof Error ? error.message : String(error),
            code: "TEST_FAILURE",
          },
        },
        issues,
      };
    }
  }

  /**
   * Generate mock inputs for testing
   */
  private generateMockInputs(): Record<string, any> {
    const mockInputs: Record<string, any> = {};

    for (const input of this.inputs) {
      if (input.default !== undefined) {
        mockInputs[input.name] = input.default;
        continue;
      }

      switch (input.type) {
        case "text":
          mockInputs[input.name] =
            input.validation?.allowedValues?.[0] || "test-value";
          break;
        case "number":
          mockInputs[input.name] = input.validation?.min || 1;
          break;
        case "boolean":
          mockInputs[input.name] = true;
          break;
        case "array":
          mockInputs[input.name] = ["test-item"];
          break;
        case "json":
          mockInputs[input.name] = { test: "data" };
          break;
        case "file":
          mockInputs[input.name] = "test-file.txt";
          break;
        default:
          mockInputs[input.name] = "test-value";
      }
    }

    return mockInputs;
  }

  /**
   * Validate environment variables required for this agent
   */
  private validateEnvironment(): void {
    const missingVars: string[] = [];

    // Check if aiProvider is defined (might not be during build-time instantiation)
    if (!this.aiProvider) {
      console.warn(
        `[AGENT ${this.id || "unknown"}] AI provider not defined, skipping environment validation`,
      );
      return;
    }

    // Check AI provider keys
    if (this.aiProvider.primary === "openai" && !process.env.OPENAI_API_KEY) {
      missingVars.push("OPENAI_API_KEY");
    }
    if (
      this.aiProvider.primary === "anthropic" &&
      !process.env.ANTHROPIC_API_KEY
    ) {
      missingVars.push("ANTHROPIC_API_KEY");
    }
    if (this.aiProvider.primary === "google" && !process.env.GOOGLE_AI_KEY) {
      missingVars.push("GOOGLE_AI_KEY");
    }

    // Check any additional required environment variables
    for (const envVar of this.requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      console.warn(
        `[AGENT ${this.id}] Missing environment variables:`,
        missingVars,
      );
    }
  }

  /**
   * Helper method to send AI requests with the standardized wrapper
   */
  protected async sendAIRequest(
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    context: AgentExecutionContext,
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    },
  ) {
    const aiWrapper = await this.initializeAI(context);

    return await aiWrapper.sendRequest({
      model: options?.model || this.aiProvider.model,
      messages,
      temperature: options?.temperature ?? this.aiProvider.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? this.aiProvider.maxTokens ?? 4096,
    });
  }
}

/**
 * Agent Registry - keeps track of all available agents
 */
export class AgentRegistry {
  private static agents = new Map<string, new () => BaseAgent>();

  static register(agentClass: new () => BaseAgent) {
    const instance = new agentClass();
    this.agents.set(instance.id, agentClass);
    console.info(`[AGENT REGISTRY] Registered agent: ${instance.id}`);
  }

  static get(agentId: string): (new () => BaseAgent) | undefined {
    return this.agents.get(agentId);
  }

  static list(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.agents.values()).map((AgentClass) => {
      const instance = new AgentClass();
      return {
        id: instance.id,
        name: instance.name,
        description: instance.description,
      };
    });
  }

  static async testAll(): Promise<
    Record<string, { success: boolean; issues: string[] }>
  > {
    const results: Record<string, { success: boolean; issues: string[] }> = {};

    for (const [agentId, AgentClass] of this.agents) {
      const instance = new AgentClass();
      const testResult = await instance.test();
      results[agentId] = {
        success: testResult.success,
        issues: testResult.issues,
      };
    }

    return results;
  }
}
