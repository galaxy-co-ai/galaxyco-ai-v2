/**
 * LIVE DATABASE TEST
 *
 * Tests database tools with real Neon Postgres queries
 */

import 'dotenv/config';
import { Agent, Runner, createDatabaseTools } from '../src';

async function main() {
  console.log('\n🗄️  GALAXYCO.AI DATABASE TOOLS TEST\n');
  console.log('='.repeat(70));

  // Verify environment
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in environment');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in environment');
    process.exit(1);
  }

  console.log('✓ Database URL configured');
  console.log('✓ OpenAI API key configured');
  console.log('='.repeat(70));

  // Get database tools
  const dbTools = createDatabaseTools();
  console.log(`\n✓ Loaded ${dbTools.length} database tools:`);
  dbTools.forEach((tool) => {
    console.log(`  - ${tool.definition.function.name}`);
  });

  // Create agent with database tools
  const agent = new Agent({
    name: 'Database Assistant',
    instructions: `You are a database assistant with access to workspace data.
You can search for agents, get agent details, and retrieve workspace statistics.
Always use the available tools to answer questions about the workspace.
Be specific and include all relevant information in your responses.`,
    model: 'gpt-4o-mini',
    temperature: 0.3,
    tools: dbTools,
  });

  console.log('\n✓ Agent created:', agent.name);
  console.log('  Model:', agent.model);
  console.log('  Tools:', agent.tools.length);

  // Test with a real workspace ID (you'll need to use one from your database)
  // For now, we'll use a test ID - replace with real one if needed
  const testWorkspaceId = 'test-workspace-123';
  const testUserId = 'test-user-123';

  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 1: Get Workspace Statistics');
  console.log('-'.repeat(70));

  try {
    const result1 = await Runner.run(
      agent,
      [{ role: 'user', content: 'What are the current workspace statistics?' }],
      {
        workspaceId: testWorkspaceId,
        userId: testUserId,
      },
    );

    if (result1.success) {
      console.log('\n✅ Result:', result1.finalOutput);
    } else {
      console.log('\n❌ FAILED:', result1.error);
    }
    console.log('\n📊 Metrics:', {
      success: result1.success,
      iterations: result1.metadata.iterations,
      tokensUsed: result1.metadata.tokensUsed,
      costUsd: result1.metadata.costUsd?.toFixed(4),
      durationMs: result1.metadata.durationMs,
    });
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }

  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 2: Search for Agents');
  console.log('-'.repeat(70));

  try {
    const result2 = await Runner.run(
      agent,
      [
        {
          role: 'user',
          content: 'Search for all agents with "email" in the name or description',
        },
      ],
      {
        workspaceId: testWorkspaceId,
        userId: testUserId,
      },
    );

    if (result2.success) {
      console.log('\n✅ Result:', result2.finalOutput);
    } else {
      console.log('\n❌ FAILED:', result2.error);
    }
    console.log('\n📊 Metrics:', {
      success: result2.success,
      iterations: result2.metadata.iterations,
      tokensUsed: result2.metadata.tokensUsed,
      costUsd: result2.metadata.costUsd?.toFixed(4),
      durationMs: result2.metadata.durationMs,
    });
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('\n\n' + '='.repeat(70));
  console.log('✅ DATABASE TOOLS TEST COMPLETE!');
  console.log('='.repeat(70));

  console.log('\n📝 Notes:');
  console.log('  - Tools are executing against real database');
  console.log('  - Workspace isolation is enforced via withTenant()');
  console.log('  - All queries include workspaceId filter');
  console.log("  - If no data found, that's expected for test workspace IDs");
  console.log('\n💡 To test with real data:');
  console.log('  - Replace testWorkspaceId with actual workspace ID from your database');
  console.log('  - Check your database for existing workspace IDs\n');
}

main().catch((error) => {
  console.error('\n❌ FATAL ERROR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});
