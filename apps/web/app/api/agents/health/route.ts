/**
 * Agent Health Check API Endpoint
 * 
 * Provides a health check endpoint for the agent infrastructure
 * to validate that all components are working correctly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTenantFilter } from '@/lib/tenant-filter';
import { 
  quickHealthCheck, 
  runAgentTests, 
  generateTestReport, 
  AgentRegistry 
} from '@/lib/agents';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get tenant context
    const tenantContext = await getTenantFilter();
    if (!tenantContext.tenantId) {
      return NextResponse.json(
        { error: 'No tenant context found' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode') || 'quick';
    const format = searchParams.get('format') || 'json';

    if (mode === 'quick') {
      // Quick health check
      const healthCheck = await quickHealthCheck();
      const registeredAgents = AgentRegistry.list();

      const response = {
        status: healthCheck.healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        infrastructure: {
          agent_count: healthCheck.agentCount,
          registry_status: registeredAgents.length > 0 ? 'operational' : 'empty',
          ai_providers: {
            openai: !!process.env.OPENAI_API_KEY,
            anthropic: !!process.env.ANTHROPIC_API_KEY,
            google: !!process.env.GOOGLE_AI_KEY,
          },
        },
        registered_agents: registeredAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          description: agent.description,
        })),
        issues: healthCheck.issues,
      };

      return NextResponse.json(response);

    } else if (mode === 'full') {
      // Comprehensive testing
      console.info('[AGENT API] Running full agent tests...');
      
      const testResults = await runAgentTests();
      
      if (format === 'markdown') {
        const report = generateTestReport(testResults);
        return new NextResponse(report, {
          headers: {
            'Content-Type': 'text/markdown',
            'Content-Disposition': `attachment; filename="agent-test-report-${Date.now()}.md"`,
          },
        });
      }

      const response = {
        status: testResults.summary.overallSuccess ? 'all_tests_passed' : 'tests_failed',
        timestamp: new Date().toISOString(),
        results: {
          total_agents: testResults.totalAgents,
          passed_tests: testResults.passedTests,
          failed_tests: testResults.failedTests,
          overall_success: testResults.summary.overallSuccess,
        },
        summary: testResults.summary,
        detailed_results: testResults.results,
      };

      return NextResponse.json(response);

    } else {
      return NextResponse.json(
        { error: 'Invalid mode. Use "quick" or "full"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[AGENT API] Health check failed:', error);
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Health check failed',
        code: 'HEALTH_CHECK_ERROR',
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, agentId } = body;

    if (action === 'test_specific_agent' && agentId) {
      const { testSpecificAgent } = await import('@/lib/agents/test-runner');
      
      console.info(`[AGENT API] Testing specific agent: ${agentId}`);
      
      const testResult = await testSpecificAgent(agentId);
      
      const response = {
        status: testResult.success ? 'passed' : 'failed',
        timestamp: new Date().toISOString(),
        agent_id: agentId,
        execution_time: testResult.executionTime,
        issues: testResult.issues,
        results: testResult.results,
      };

      return NextResponse.json(response);

    } else if (action === 'register_agent' && body.agentClass) {
      // This would be used to dynamically register agents
      // For security reasons, this should be very restricted in production
      
      return NextResponse.json(
        { error: 'Dynamic agent registration not implemented' },
        { status: 501 }
      );

    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing parameters' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[AGENT API] POST operation failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : 'Operation failed',
          code: 'AGENT_OPERATION_ERROR',
        },
      },
      { status: 500 }
    );
  }
}