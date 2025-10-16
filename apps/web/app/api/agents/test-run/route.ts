import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireSession } from "@/lib/services/user-session";
import type {
  TestPlaygroundInput,
  TestExecutionLog,
  TestAgentOutput,
  TestResult,
} from "@/lib/agents/test-types";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for test execution

/**
 * Test execution API endpoint
 * Simulates real agent execution with actual AI calls
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = (await req.json()) as TestPlaygroundInput & {
      agentName: string;
      workflowSteps: Array<{
        id: string;
        type: string;
        label: string;
        description?: string;
      }>;
    };

    const {
      agentName,
      workflowSteps,
      triggerType,
      sampleTriggerData,
      mockIntegrations = true,
    } = body;

    // Validate inputs
    if (!agentName || !workflowSteps || workflowSteps.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: agentName, workflowSteps" },
        { status: 400 },
      );
    }

    // Check AI API availability
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json(
        { error: "No AI API keys configured - cannot execute agent logic" },
        { status: 500 },
      );
    }

    // Initialize execution tracking
    const logs: TestExecutionLog[] = [];
    const outputs: TestAgentOutput[] = [];
    const startTime = Date.now();

    // Add initial trigger log
    logs.push({
      id: `log-0`,
      step: "trigger",
      status: "running",
      message: `Triggered by ${triggerType}`,
      timestamp: new Date(),
    });

    // Execute each workflow step
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      const stepStartTime = Date.now();
      const logId = `log-${i + 1}`;

      // Add step start log
      logs.push({
        id: logId,
        step: step.label,
        status: "running",
        message: `Executing: ${step.label}`,
        timestamp: new Date(),
      });

      try {
        // Simulate step execution based on type
        const stepResult = await executeStep(
          step,
          sampleTriggerData,
          mockIntegrations,
          openaiKey,
          anthropicKey,
        );

        const duration = Date.now() - stepStartTime;

        // Update log to completed
        logs[logs.length - 1] = {
          ...logs[logs.length - 1],
          status: "completed",
          message: `✓ ${step.label} completed`,
          duration,
          details: stepResult.details,
        };

        // Add output if step generated one
        if (stepResult.output) {
          outputs.push({
            id: `output-${i}`,
            type: stepResult.output.type as
              | "ai-result"
              | "notification"
              | "data",
            content: stepResult.output.content,
            timestamp: new Date(),
          });
        }

        // Small delay between steps for realism
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        const duration = Date.now() - stepStartTime;

        // Update log to failed
        logs[logs.length - 1] = {
          ...logs[logs.length - 1],
          status: "failed",
          message: `✗ ${step.label} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          duration,
          error: error instanceof Error ? error.message : "Unknown error",
        };

        // Stop execution on failure
        const result: TestResult = {
          success: false,
          logs,
          outputs,
          totalDuration: Date.now() - startTime,
          executedSteps: i + 1,
          totalSteps: workflowSteps.length,
          error:
            error instanceof Error ? error.message : "Test execution failed",
        };

        return NextResponse.json(result);
      }
    }

    // Mark trigger as completed
    logs[0] = {
      ...logs[0],
      status: "completed",
      duration: 50,
    };

    // Return successful result
    const result: TestResult = {
      success: true,
      logs,
      outputs,
      totalDuration: Date.now() - startTime,
      executedSteps: workflowSteps.length,
      totalSteps: workflowSteps.length,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Test execution API error:", error);
    return NextResponse.json(
      {
        error: "Test execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Execute a single workflow step
 */
async function executeStep(
  step: { id: string; type: string; label: string; description?: string },
  triggerData: Record<string, any>,
  mockIntegrations: boolean,
  openaiKey?: string,
  anthropicKey?: string,
) {
  const stepLower = step.label.toLowerCase();

  // AI/LLM steps - use real API calls
  if (
    stepLower.includes("analyze") ||
    stepLower.includes("generate") ||
    stepLower.includes("summarize") ||
    stepLower.includes("extract") ||
    stepLower.includes("classify")
  ) {
    return await executeAIStep(step, triggerData, openaiKey, anthropicKey);
  }

  // Integration steps - mock or real based on flag
  if (
    stepLower.includes("send email") ||
    stepLower.includes("calendar") ||
    stepLower.includes("slack") ||
    stepLower.includes("crm") ||
    stepLower.includes("database")
  ) {
    return await executeIntegrationStep(step, mockIntegrations);
  }

  // Data transformation steps
  if (
    stepLower.includes("format") ||
    stepLower.includes("transform") ||
    stepLower.includes("parse")
  ) {
    return executeDataStep(step);
  }

  // Default: simple execution
  return {
    details: `Step executed successfully`,
    output: null,
  };
}

/**
 * Execute AI/LLM step with real API calls
 */
async function executeAIStep(
  step: { label: string; description?: string },
  triggerData: Record<string, any>,
  openaiKey?: string,
  anthropicKey?: string,
) {
  const prompt = `Execute this agent step: "${step.label}"
Context: ${JSON.stringify(triggerData, null, 2)}
Provide a brief, realistic output for this step.`;

  if (openaiKey) {
    const openai = new OpenAI({ apiKey: openaiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are simulating an AI agent step. Provide concise, realistic outputs.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const result =
      completion.choices[0]?.message?.content || "AI processing completed";

    return {
      details: `AI model: gpt-4o-mini, tokens: ${completion.usage?.total_tokens || 0}`,
      output: {
        type: "ai-result",
        content: result,
      },
    };
  } else if (anthropicKey) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.content[0]?.text || "AI processing completed";

    return {
      details: `AI model: claude-3-5-haiku, tokens: ${data.usage?.input_tokens + data.usage?.output_tokens || 0}`,
      output: {
        type: "ai-result",
        content: result,
      },
    };
  }

  throw new Error("No AI API key available");
}

/**
 * Execute integration step (mocked or real)
 */
async function executeIntegrationStep(
  step: { label: string },
  mockIntegrations: boolean,
) {
  // Simulate API call delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500),
  );

  if (mockIntegrations) {
    // Mock response based on integration type
    const stepLower = step.label.toLowerCase();

    if (stepLower.includes("email")) {
      return {
        details: "Email sent (mocked)",
        output: {
          type: "notification",
          content: "Email sent successfully to recipient@example.com",
        },
      };
    }

    if (stepLower.includes("calendar")) {
      return {
        details: "Calendar event created (mocked)",
        output: {
          type: "notification",
          content: "Event created: Meeting on 2025-01-15 at 2:00 PM",
        },
      };
    }

    if (stepLower.includes("slack")) {
      return {
        details: "Slack message sent (mocked)",
        output: {
          type: "notification",
          content: "Message posted to #general channel",
        },
      };
    }

    if (stepLower.includes("crm") || stepLower.includes("hubspot")) {
      return {
        details: "CRM record updated (mocked)",
        output: {
          type: "data",
          content: "Contact record updated with new activity",
        },
      };
    }

    return {
      details: "Integration step executed (mocked)",
      output: null,
    };
  }

  // TODO: Real integration calls when mockIntegrations = false
  // This would use actual API keys from env (GOOGLE_CUSTOM_SEARCH_API_KEY, etc.)
  throw new Error("Real integration execution not yet implemented");
}

/**
 * Execute data transformation step
 */
function executeDataStep(step: { label: string }) {
  return {
    details: "Data transformation completed",
    output: {
      type: "data",
      content: "Data formatted and validated successfully",
    },
  };
}
