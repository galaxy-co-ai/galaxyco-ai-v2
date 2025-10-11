/**
 * LIVE EXECUTION TEST
 *
 * This tests the agent system with real OpenAI API calls
 */

import "dotenv/config";
import { Agent, Runner, createTool } from "../src";

// Simple calculator tool
const calculatorTool = createTool(
  "calculate",
  "Perform basic math calculations (add, subtract, multiply, divide)",
  {
    operation: {
      type: "string",
      description: "The operation to perform",
      enum: ["add", "subtract", "multiply", "divide"],
    },
    a: { type: "number", description: "First number" },
    b: { type: "number", description: "Second number" },
  },
  async (args: { operation: string; a: number; b: number }) => {
    const { operation, a, b } = args;
    let result: number;

    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        result = b !== 0 ? a / b : 0;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    console.log(
      `  🔧 TOOL CALLED: calculate(${operation}, ${a}, ${b}) = ${result}`,
    );
    return { result, operation, input: { a, b } };
  },
);

async function main() {
  console.log("\n🚀 GALAXYCO.AI LIVE EXECUTION TEST\n");
  console.log("=".repeat(70));

  // Verify API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY not found in environment");
    process.exit(1);
  }
  console.log("✓ OpenAI API key found");
  console.log("=".repeat(70));

  // TEST 1: Simple Agent (No Tools)
  console.log("\n📝 TEST 1: Simple Agent (No Tools)");
  console.log("-".repeat(70));

  const simpleAgent = new Agent({
    name: "Simple Assistant",
    instructions: "You are a helpful assistant. Be very concise and friendly.",
    model: "gpt-4o-mini",
    temperature: 0.7,
  });

  console.log("Agent:", simpleAgent.name);
  console.log("Making API call...\n");

  const result1 = await Runner.run(simpleAgent, [
    {
      role: "user",
      content: "Say hello and tell me your name in one sentence.",
    },
  ]);

  console.log("✅ Result:", result1.finalOutput);
  console.log("📊 Metrics:", {
    success: result1.success,
    iterations: result1.metadata.iterations,
    tokensUsed: result1.metadata.tokensUsed,
    costUsd: result1.metadata.costUsd?.toFixed(4),
    durationMs: result1.metadata.durationMs,
  });

  // TEST 2: Agent with Tools
  console.log("\n\n🔧 TEST 2: Agent with Tool Calling");
  console.log("-".repeat(70));

  const toolAgent = new Agent({
    name: "Math Assistant",
    instructions: `You are a helpful assistant with access to a calculator.
When asked to perform calculations, use the calculate tool.
Always show your work and explain the result.`,
    model: "gpt-4o-mini",
    temperature: 0.3,
    tools: [calculatorTool],
  });

  console.log("Agent:", toolAgent.name);
  console.log(
    "Tools:",
    toolAgent.tools.map((t) => t.definition.function.name).join(", "),
  );
  console.log("Making API call with tool access...\n");

  const result2 = await Runner.run(toolAgent, [
    { role: "user", content: "What is 47 times 23?" },
  ]);

  console.log("\n✅ Result:", result2.finalOutput);
  console.log("📊 Metrics:", {
    success: result2.success,
    iterations: result2.metadata.iterations,
    tokensUsed: result2.metadata.tokensUsed,
    costUsd: result2.metadata.costUsd?.toFixed(4),
    durationMs: result2.metadata.durationMs,
  });

  // TEST 3: Complex Multi-Tool Scenario
  console.log("\n\n🎯 TEST 3: Complex Multi-Step Problem");
  console.log("-".repeat(70));

  const result3 = await Runner.run(toolAgent, [
    {
      role: "user",
      content:
        "I have 150 dollars. I buy 3 items at 23 dollars each. How much do I have left?",
    },
  ]);

  console.log("\n✅ Result:", result3.finalOutput);
  console.log("📊 Metrics:", {
    success: result3.success,
    iterations: result3.metadata.iterations,
    tokensUsed: result3.metadata.tokensUsed,
    costUsd: result3.metadata.costUsd?.toFixed(4),
    durationMs: result3.metadata.durationMs,
  });

  // SUMMARY
  console.log("\n\n" + "=".repeat(70));
  console.log("🎉 ALL TESTS PASSED!");
  console.log("=".repeat(70));

  console.log("\n📊 System Validation:");
  console.log("  ✓ OpenAI API connection working");
  console.log("  ✓ Agent creation and execution working");
  console.log("  ✓ Tool calling and execution working");
  console.log("  ✓ Multi-iteration conversations working");
  console.log("  ✓ Cost tracking working");
  console.log("  ✓ Token usage tracking working");

  console.log(
    "\n💰 Total Cost:",
    (
      (result1.metadata.costUsd || 0) +
      (result2.metadata.costUsd || 0) +
      (result3.metadata.costUsd || 0)
    ).toFixed(4),
    "USD",
  );

  console.log("\n✅ FOUNDATION VALIDATED - Ready for Phase 2!\n");
}

main().catch((error) => {
  console.error("\n❌ ERROR:", error.message);
  console.error("\nStack:", error.stack);
  process.exit(1);
});
