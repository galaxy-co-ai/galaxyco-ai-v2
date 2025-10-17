/**
 * Agent Test Runner
 *
 * Utility for testing agents in development to ensure they follow
 * the standardized interface and work correctly with mock data.
 */

import { AgentRegistry, BaseAgent } from "./agent-interface";
import { logger } from "@/lib/utils/logger";

export interface TestResults {
  totalAgents: number;
  passedTests: number;
  failedTests: number;
  results: Array<{
    agentId: string;
    agentName: string;
    success: boolean;
    issues: string[];
    executionTime: number;
    testData?: any;
  }>;
  summary: {
    overallSuccess: boolean;
    criticalIssues: string[];
    warnings: string[];
  };
}

/**
 * Run comprehensive tests on all registered agents
 */
export async function runAgentTests(): Promise<TestResults> {
  const startTime = Date.now();
  logger.info("[AGENT TEST RUNNER] Starting comprehensive agent testing...");

  const agentList = AgentRegistry.list();
  const results: TestResults["results"] = [];
  const criticalIssues: string[] = [];
  const warnings: string[] = [];

  for (const agentInfo of agentList) {
    const testStartTime = Date.now();

    try {
      logger.info(`[AGENT TEST] Testing agent: ${agentInfo.id}`);

      const AgentClass = AgentRegistry.get(agentInfo.id);
      if (!AgentClass) {
        criticalIssues.push(`Agent ${agentInfo.id} not found in registry`);
        continue;
      }

      const agent = new AgentClass();
      const testResult = await agent.test();
      const executionTime = Date.now() - testStartTime;

      // Categorize issues
      const agentIssues = testResult.issues;
      const hasCriticalIssues = agentIssues.some(
        (issue) =>
          issue.includes("failed") ||
          issue.includes("error") ||
          issue.includes("required"),
      );

      if (hasCriticalIssues) {
        agentIssues.forEach((issue) => {
          if (issue.includes("failed") || issue.includes("error")) {
            criticalIssues.push(`${agentInfo.id}: ${issue}`);
          }
        });
      } else if (agentIssues.length > 0) {
        agentIssues.forEach((issue) => {
          warnings.push(`${agentInfo.id}: ${issue}`);
        });
      }

      results.push({
        agentId: agentInfo.id,
        agentName: agentInfo.name,
        success: testResult.success,
        issues: agentIssues,
        executionTime,
        testData: testResult.success
          ? {
              inputKeys: Object.keys(testResult.results.data),
              hasOutput: Object.keys(testResult.results.data).length > 0,
            }
          : undefined,
      });

      logger.info(
        `[AGENT TEST] ${agentInfo.id} completed in ${executionTime}ms: ${testResult.success ? "PASS" : "FAIL"}`,
      );
      if (agentIssues.length > 0) {
        logger.warn(`[AGENT TEST] ${agentInfo.id} issues`, { agentIssues });
      }
    } catch (error) {
      const executionTime = Date.now() - testStartTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      criticalIssues.push(
        `${agentInfo.id}: Test execution failed - ${errorMessage}`,
      );

      results.push({
        agentId: agentInfo.id,
        agentName: agentInfo.name,
        success: false,
        issues: [`Test execution failed: ${errorMessage}`],
        executionTime,
      });

      logger.error(`[AGENT TEST] ${agentInfo.id} failed with error`, error);
    }
  }

  const totalTime = Date.now() - startTime;
  const passedTests = results.filter((r) => r.success).length;
  const failedTests = results.length - passedTests;
  const overallSuccess = failedTests === 0 && criticalIssues.length === 0;

  const testResults: TestResults = {
    totalAgents: results.length,
    passedTests,
    failedTests,
    results,
    summary: {
      overallSuccess,
      criticalIssues,
      warnings,
    },
  };

  // Log summary
  logger.info(`[AGENT TEST RUNNER] Testing completed in ${totalTime}ms`);
  logger.info(
    `[AGENT TEST RUNNER] Results: ${passedTests}/${results.length} agents passed`,
  );

  if (criticalIssues.length > 0) {
    logger.error(`[AGENT TEST RUNNER] Critical issues found`, {
      criticalIssues,
    });
  }

  if (warnings.length > 0) {
    logger.warn(`[AGENT TEST RUNNER] Warnings`, { warnings });
  }

  if (overallSuccess) {
    logger.info("[AGENT TEST RUNNER] ✅ All agents are working correctly!");
  } else {
    logger.error(
      "[AGENT TEST RUNNER] ❌ Some agents have issues that need attention",
    );
  }

  return testResults;
}

/**
 * Test a specific agent by ID
 */
export async function testSpecificAgent(agentId: string): Promise<{
  success: boolean;
  results?: any;
  issues: string[];
  executionTime: number;
}> {
  const startTime = Date.now();

  try {
    logger.info(`[AGENT TEST] Testing specific agent: ${agentId}`);

    const AgentClass = AgentRegistry.get(agentId);
    if (!AgentClass) {
      return {
        success: false,
        issues: [`Agent ${agentId} not found in registry`],
        executionTime: Date.now() - startTime,
      };
    }

    const agent = new AgentClass();
    const testResult = await agent.test();
    const executionTime = Date.now() - startTime;

    logger.info(
      `[AGENT TEST] ${agentId} completed in ${executionTime}ms: ${testResult.success ? "PASS" : "FAIL"}`,
    );

    return {
      success: testResult.success,
      results: testResult.results,
      issues: testResult.issues,
      executionTime,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const executionTime = Date.now() - startTime;

    logger.error(`[AGENT TEST] ${agentId} failed with error`, error);

    return {
      success: false,
      issues: [`Test execution failed: ${errorMessage}`],
      executionTime,
    };
  }
}

/**
 * Generate test report in markdown format
 */
export function generateTestReport(results: TestResults): string {
  const timestamp = new Date().toISOString();

  let report = `# Agent Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Total Agents:** ${results.totalAgents}\n`;
  report += `**Passed:** ${results.passedTests}\n`;
  report += `**Failed:** ${results.failedTests}\n`;
  report += `**Overall Status:** ${results.summary.overallSuccess ? "✅ PASS" : "❌ FAIL"}\n\n`;

  if (results.summary.criticalIssues.length > 0) {
    report += `## 🔥 Critical Issues\n\n`;
    results.summary.criticalIssues.forEach((issue) => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }

  if (results.summary.warnings.length > 0) {
    report += `## ⚠️ Warnings\n\n`;
    results.summary.warnings.forEach((warning) => {
      report += `- ${warning}\n`;
    });
    report += `\n`;
  }

  report += `## 📋 Detailed Results\n\n`;

  results.results.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    report += `### ${status} ${result.agentName} (\`${result.agentId}\`)\n\n`;
    report += `**Execution Time:** ${result.executionTime}ms\n`;

    if (result.issues.length > 0) {
      report += `**Issues:**\n`;
      result.issues.forEach((issue) => {
        report += `- ${issue}\n`;
      });
    }

    if (result.testData) {
      report += `**Test Data:** Generated ${result.testData.inputKeys.length} outputs\n`;
    }

    report += `\n`;
  });

  return report;
}

/**
 * Quick health check for agent infrastructure
 */
export async function quickHealthCheck(): Promise<{
  healthy: boolean;
  agentCount: number;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check agent registry
    const agents = AgentRegistry.list();
    const agentCount = agents.length;

    if (agentCount === 0) {
      issues.push("No agents registered in the registry");
    }

    // Check for duplicate agent IDs
    const agentIds = agents.map((a) => a.id);
    const uniqueIds = new Set(agentIds);
    if (agentIds.length !== uniqueIds.size) {
      issues.push("Duplicate agent IDs detected in registry");
    }

    // Basic environment check for AI providers
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (!hasOpenAI && !hasAnthropic) {
      issues.push("No AI provider API keys found in environment");
    }

    return {
      healthy: issues.length === 0,
      agentCount,
      issues,
    };
  } catch (error) {
    issues.push(
      `Health check failed: ${error instanceof Error ? error.message : String(error)}`,
    );

    return {
      healthy: false,
      agentCount: 0,
      issues,
    };
  }
}
