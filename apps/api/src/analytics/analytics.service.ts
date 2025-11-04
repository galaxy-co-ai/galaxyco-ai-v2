import { Injectable } from '@nestjs/common';
import { db } from '@galaxyco/database';
import { agentExecutions, gridExecutions, customers, prospects } from '@galaxyco/database/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

@Injectable()
export class AnalyticsService {
  /**
   * Get sales analytics for workspace
   */
  async getSalesAnalytics(workspaceId: string, timeRange: '7d' | '30d' | '90d' = '30d') {
    const daysAgo = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get customer stats
    const allCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.workspaceId, workspaceId));

    const newCustomers = allCustomers.filter(
      (c) => new Date(c.createdAt).getTime() > startDate.getTime(),
    );

    const activeCustomers = allCustomers.filter((c) => c.status === 'active');

    // Get prospect stats
    const allProspects = await db
      .select()
      .from(prospects)
      .where(eq(prospects.workspaceId, workspaceId));

    const qualifiedProspects = allProspects.filter(
      (p) => p.stage === 'qualified' || p.stage === 'proposal',
    );

    return {
      customers: {
        total: allCustomers.length,
        new: newCustomers.length,
        active: activeCustomers.length,
        churnRate: 0, // TODO: Calculate actual churn
      },
      prospects: {
        total: allProspects.length,
        qualified: qualifiedProspects.length,
        conversionRate:
          allCustomers.length > 0 ? (allCustomers.length / allProspects.length) * 100 : 0,
      },
      revenue: {
        // TODO: Calculate from invoices
        total: 0,
        growth: 0,
      },
    };
  }

  /**
   * Get agent execution analytics
   */
  async getAgentAnalytics(workspaceId: string, timeRange: '7d' | '30d' | '90d' = '30d') {
    const daysAgo = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const executions = await db
      .select()
      .from(agentExecutions)
      .where(
        and(
          eq(agentExecutions.workspaceId, workspaceId),
          gte(agentExecutions.createdAt, startDate),
        ),
      );

    const total = executions.length;
    const completed = executions.filter((e) => e.status === 'completed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;

    const avgDuration =
      executions.filter((e) => e.durationMs).reduce((sum, e) => sum + (e.durationMs || 0), 0) /
        executions.filter((e) => e.durationMs).length || 0;

    const totalCost = executions.reduce((sum, e) => sum + (e.cost || 0), 0) / 100; // Convert cents to dollars

    return {
      executions: {
        total,
        completed,
        failed,
        successRate: total > 0 ? (completed / total) * 100 : 0,
      },
      performance: {
        avgDuration: Math.round(avgDuration),
        totalCost: Math.round(totalCost * 100) / 100,
      },
    };
  }

  /**
   * Get workflow execution analytics
   */
  async getWorkflowAnalytics(workspaceId: string, timeRange: '7d' | '30d' | '90d' = '30d') {
    const daysAgo = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const executions = await db
      .select()
      .from(gridExecutions)
      .where(
        and(eq(gridExecutions.workspaceId, workspaceId), gte(gridExecutions.createdAt, startDate)),
      );

    const total = executions.length;
    const completed = executions.filter((e) => e.status === 'completed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;

    return {
      total,
      completed,
      failed,
      successRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  /**
   * Get usage analytics
   */
  async getUsageAnalytics(workspaceId: string) {
    // Agent usage
    const agentExecutionsList = await db
      .select()
      .from(agentExecutions)
      .where(eq(agentExecutions.workspaceId, workspaceId));

    // Workflow usage
    const workflowExecutions = await db
      .select()
      .from(gridExecutions)
      .where(eq(gridExecutions.workspaceId, workspaceId));

    return {
      agents: {
        executions: agentExecutionsList.length,
        totalCost:
          agentExecutionsList.reduce((sum: number, e: any) => sum + (e.cost || 0), 0) / 100,
      },
      workflows: {
        executions: workflowExecutions.length,
      },
    };
  }
}
