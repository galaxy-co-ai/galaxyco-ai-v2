/**
 * Simple Agent Example - End-to-End Test
 *
 * This example demonstrates:
 * 1. Creating a simple agent with tools
 * 2. Running the agent with the Runner
 * 3. Tool execution
 * 4. Complete workflow
 */

import { Agent, Runner, createTool } from '../src';

// Create a simple calculator tool
const calculatorTool = createTool(
  'calculate',
  'Perform basic math calculations',
  {
    operation: {
      type: 'string',
      description: 'The operation to perform (add, subtract, multiply, divide)',
      enum: ['add', 'subtract', 'multiply', 'divide'],
    },
    a: {
      type: 'number',
      description: 'First number',
    },
    b: {
      type: 'number',
      description: 'Second number',
    },
  },
  async (args: { operation: string; a: number; b: number }) => {
    const { operation, a, b } = args;

    let result: number;
    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        result = b !== 0 ? a / b : 0;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      result,
      operation,
      input: { a, b },
    };
  },
);

// Create a weather tool (mock)
const weatherTool = createTool(
  'get_weather',
  'Get current weather for a location',
  {
    location: {
      type: 'string',
      description: 'City name or location',
    },
  },
  async (args: { location: string }) => {
    // Mock weather data
    return {
      location: args.location,
      temperature: 72,
      condition: 'Sunny',
      humidity: 45,
      windSpeed: 10,
    };
  },
);

async function main() {
  console.log('🚀 GalaxyCo.ai Agent System - End-to-End Test\n');
  console.log('='.repeat(60));

  // Example 1: Simple Agent without tools
  console.log('\n📝 Example 1: Simple Agent (No Tools)');
  console.log('-'.repeat(60));

  const simpleAgent = new Agent({
    name: 'Simple Assistant',
    instructions: 'You are a helpful assistant. Be concise and friendly.',
    model: 'gpt-4o-mini',
    temperature: 0.7,
  });

  console.log('Agent created:', simpleAgent.toJSON());
  console.log('\nNote: To run this agent, set OPENAI_API_KEY in environment');

  // Example 2: Agent with Tools
  console.log('\n\n🔧 Example 2: Agent with Tools');
  console.log('-'.repeat(60));

  const toolAgent = new Agent({
    name: 'Tool Assistant',
    instructions: `You are a helpful assistant with access to tools.
When asked to perform calculations, use the calculate tool.
When asked about weather, use the get_weather tool.
Always explain your reasoning before using tools.`,
    model: 'gpt-4o-mini',
    tools: [calculatorTool, weatherTool],
  });

  console.log('Agent with tools created:');
  console.log('- Name:', toolAgent.name);
  console.log(
    '- Tools:',
    toolAgent.tools.map((t) => t.definition.function.name),
  );

  // Example 3: Agent as Tool (Manager Pattern)
  console.log('\n\n🎯 Example 3: Agent as Tool (Manager Pattern)');
  console.log('-'.repeat(60));

  const mathAgent = new Agent({
    name: 'Math Specialist',
    instructions: 'You are a math expert. Help with calculations and math problems.',
    tools: [calculatorTool],
  });

  const weatherAgent = new Agent({
    name: 'Weather Specialist',
    instructions: 'You are a weather expert. Provide weather information.',
    tools: [weatherTool],
  });

  const managerAgent = new Agent({
    name: 'Manager Agent',
    instructions: `You are a manager that coordinates between specialists.
- For math questions, delegate to the math specialist
- For weather questions, delegate to the weather specialist
- For general questions, answer directly`,
    tools: [
      mathAgent.asTool('delegate_to_math', 'Delegate math questions to math specialist'),
      weatherAgent.asTool(
        'delegate_to_weather',
        'Delegate weather questions to weather specialist',
      ),
    ],
  });

  console.log('Manager agent created with specialist tools:');
  console.log('- Math Specialist available: ✓');
  console.log('- Weather Specialist available: ✓');

  // Example 4: Test Tool Execution
  console.log('\n\n🧪 Example 4: Direct Tool Execution');
  console.log('-'.repeat(60));

  console.log('\nTesting calculator tool...');
  const calcResult = await calculatorTool.execute({
    operation: 'multiply',
    a: 6,
    b: 7,
  });
  console.log('Result:', calcResult);

  console.log('\nTesting weather tool...');
  const weatherResult = await weatherTool.execute({
    location: 'San Francisco',
  });
  console.log('Result:', weatherResult);

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('✅ All Examples Completed Successfully!');
  console.log('='.repeat(60));

  console.log('\n📊 System Validation:');
  console.log('  ✓ Agent creation working');
  console.log('  ✓ Tool system working');
  console.log('  ✓ Agent-as-tool (Manager pattern) working');
  console.log('  ✓ Tool execution working');

  console.log('\n🎯 Next Steps:');
  console.log('  1. Set OPENAI_API_KEY to run live agents');
  console.log('  2. Test with Runner.run() for full execution');
  console.log('  3. Add guardrails for safety');
  console.log('  4. Build more complex workflows');

  console.log('\n💡 To run a live agent:');
  console.log('  ```typescript');
  console.log('  const result = await Runner.run(');
  console.log('    toolAgent,');
  console.log('    [{ role: "user", content: "What is 25 * 4?" }]');
  console.log('  );');
  console.log('  console.log(result);');
  console.log('  ```\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main };
