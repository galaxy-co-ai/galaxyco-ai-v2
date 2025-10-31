import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '@galaxyco/database/client';
import { agents } from '@galaxyco/database/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { TestAgentDto, TestResult, PythonServiceResponse } from './dto/test-agent.dto';
import { randomUUID } from 'crypto';
// import { AgentExecutionService } from "@galaxyco/agents-core";

@Injectable()
export class AgentsService {
  /**
   * Create a new agent
   * Multi-tenant: Automatically scoped to workspaceId
   */
  async create(createAgentDto: CreateAgentDto, userId: string, workspaceId: string) {
    const agent = await db
      .insert(agents)
      .values({
        id: randomUUID(),
        workspaceId,
        name: createAgentDto.name,
        description: createAgentDto.description,
        type: createAgentDto.type,
        status: 'draft', // Always start as draft
        config: {
          aiProvider: createAgentDto.aiProvider,
          model: createAgentDto.model,
          temperature: createAgentDto.temperature || 0.7,
          maxTokens: createAgentDto.maxTokens,
          systemPrompt: createAgentDto.systemPrompt,
        },
        createdBy: userId,
        sourcePackId: createAgentDto.sourcePackId || null,
        isCustom: !createAgentDto.sourcePackId,
      })
      .returning();

    return agent[0];
  }

  /**
   * List agents with filters
   * Multi-tenant: Only returns agents for workspaceId
   */
  async findAll(
    workspaceId: string,
    filters?: {
      status?: 'draft' | 'active' | 'paused' | 'archived';
      search?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    // Apply filters
    const conditions = [eq(agents.workspaceId, workspaceId)];

    if (filters?.status) {
      conditions.push(eq(agents.status, filters.status));
    }

    if (filters?.search) {
      conditions.push(like(agents.name, `%${filters.search}%`));
    }

    let baseQuery = db
      .select()
      .from(agents)
      .where(and(...conditions))
      .orderBy(desc(agents.createdAt));

    // Pagination - build the query with limit and offset
    const results = await (filters?.limit
      ? filters?.offset
        ? baseQuery.limit(filters.limit).offset(filters.offset)
        : baseQuery.limit(filters.limit)
      : baseQuery);

    return {
      agents: results,
      total: results.length,
      limit: filters?.limit || results.length,
      offset: filters?.offset || 0,
    };
  }

  /**
   * Get single agent by ID
   * Multi-tenant: Validates workspace access
   */
  async findOne(id: string, workspaceId: string) {
    const agent = await db
      .select()
      .from(agents)
      .where(and(eq(agents.id, id), eq(agents.workspaceId, workspaceId)))
      .limit(1);

    if (!agent || agent.length === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return agent[0];
  }

  /**
   * Update agent
   * Multi-tenant: Validates workspace access before updating
   */
  async update(id: string, updateAgentDto: UpdateAgentDto, workspaceId: string) {
    // First verify the agent belongs to this workspace
    await this.findOne(id, workspaceId);

    const updated = await db
      .update(agents)
      .set({
        ...(updateAgentDto.name && { name: updateAgentDto.name }),
        ...(updateAgentDto.description && {
          description: updateAgentDto.description,
        }),
        ...(updateAgentDto.status && { status: updateAgentDto.status }),
        ...(updateAgentDto.type && { type: updateAgentDto.type }),
        config: {
          ...(updateAgentDto.aiProvider && {
            aiProvider: updateAgentDto.aiProvider,
          }),
          ...(updateAgentDto.model && { model: updateAgentDto.model }),
          ...(updateAgentDto.temperature !== undefined && {
            temperature: updateAgentDto.temperature,
          }),
          ...(updateAgentDto.maxTokens && {
            maxTokens: updateAgentDto.maxTokens,
          }),
          ...(updateAgentDto.systemPrompt && {
            systemPrompt: updateAgentDto.systemPrompt,
          }),
        },
        updatedAt: new Date(),
      })
      .where(and(eq(agents.id, id), eq(agents.workspaceId, workspaceId)))
      .returning();

    return updated[0];
  }

  /**
   * Soft delete agent (set status to archived)
   * Multi-tenant: Validates workspace access
   */
  async remove(id: string, workspaceId: string) {
    // Verify ownership
    await this.findOne(id, workspaceId);

    await db
      .update(agents)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(and(eq(agents.id, id), eq(agents.workspaceId, workspaceId)));

    return { success: true, message: 'Agent archived successfully' };
  }

  /**
   * Test agent execution using NEW agents-core system
   * This is the OpenAI-aligned execution path
   * TODO: Re-enable once agents-core is properly built
   */
  async testWithCore(id: string, testDto: TestAgentDto, workspaceId: string): Promise<TestResult> {
    // Temporarily disabled - using legacy test() method instead
    return this.test(id, testDto, workspaceId);
  }

  /**
   * Test agent execution (LEGACY)
   * Supports both mock mode (fixtures) and live mode (Python service)
   *
   * NOTE: This will be deprecated in favor of testWithCore()
   */
  async test(id: string, testDto: TestAgentDto, workspaceId: string): Promise<TestResult> {
    // Verify agent exists and belongs to workspace
    const agent = await this.findOne(id, workspaceId);

    const startTime = Date.now();

    // Mock execution (deterministic fixtures)
    if (testDto.mode === 'mock' || !testDto.mode) {
      const mockOutput = this.getMockOutput(agent.type, testDto.inputs);
      const durationMs = Date.now() - startTime + Math.random() * 500; // Simulate latency

      return {
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        inputs: testDto.inputs,
        outputs: mockOutput,
        success: true,
        metrics: {
          durationMs: Math.round(durationMs),
          tokensUsed: Math.floor(Math.random() * 500) + 100,
          costUsd: 0.0023, // Mock cost
        },
      };
    }

    // Live execution - call Python agent service
    return this.executeLive(agent, testDto, workspaceId);
  }

  /**
   * Execute agent via Python service (live mode)
   * Calls FastAPI service at services/agents
   */
  private async executeLive(
    agent: any,
    testDto: TestAgentDto,
    workspaceId: string,
  ): Promise<TestResult> {
    const pythonServiceUrl = process.env.PYTHON_AGENTS_URL || 'http://localhost:5001';

    try {
      const response = await fetch(`${pythonServiceUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.id,
          workspace_id: workspaceId,
          user_id: 'system', // TODO: Get from context
          agent_type: agent.type,
          inputs: testDto.inputs,
          config: agent.config,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Python service error (${response.status}): ${error}`);
      }

      const result = (await response.json()) as PythonServiceResponse;

      return {
        id: result.execution_id,
        timestamp: new Date().toISOString(),
        inputs: testDto.inputs,
        outputs: result.outputs,
        success: result.success,
        error: result.error,
        metrics: {
          durationMs: result.metrics.duration_ms,
          tokensUsed: result.metrics.tokens_used || 0,
          costUsd: result.metrics.cost_usd || 0,
          model: result.metrics.model,
        },
      };
    } catch (error: any) {
      // Return error response
      return {
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        inputs: testDto.inputs,
        outputs: {},
        success: false,
        error: error?.message || 'Failed to execute agent',
        metrics: {
          durationMs: 0,
          tokensUsed: 0,
          costUsd: 0,
        },
      };
    }
  }

  /**
   * Generate mock output based on agent type
   * Phase 8: Deterministic fixtures for testing
   */
  private getMockOutput(agentType: string, inputs: Record<string, any>): Record<string, any> {
    const mockOutputs: Record<string, Record<string, any>> = {
      scope: {
        summary: 'Analyzed email thread and extracted 3 action items',
        actionItems: [
          'Follow up with John about Q4 budget proposal',
          'Schedule team meeting for next week',
          'Review and approve design mockups',
        ],
        priority: 'high',
        sentiment: 'neutral',
      },
      email: {
        subject: 'Re: ' + (inputs.subject || 'Your inquiry'),
        body: 'Thank you for reaching out. Based on your request, here is a personalized response...',
        sentiment: 'positive',
        suggested_action: 'send',
      },
      call: {
        transcript_summary: 'Customer expressed interest in enterprise plan',
        key_points: [
          'Needs multi-tenant support',
          'Budget approved for Q1',
          'Decision maker: Sarah (CTO)',
        ],
        next_steps: ['Send pricing proposal', 'Schedule demo'],
      },
      note: {
        note_summary: 'Meeting notes processed and categorized',
        tags: ['product', 'roadmap', 'q1-planning'],
        related_docs: ['PRD-2024-001', 'RFC-Backend-Auth'],
      },
      task: {
        task_created: true,
        task_id: 'TASK-' + Math.floor(Math.random() * 10000),
        assignee: 'auto-detected',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      roadmap: {
        feature_analysis: 'Analyzed request and mapped to existing roadmap',
        priority_score: 8.5,
        estimated_effort: '3-5 days',
        dependencies: ['API authentication', 'UI component library'],
      },
      content: {
        content_generated: true,
        word_count: 450,
        readability_score: 8.2,
        seo_optimized: true,
      },
      custom: {
        result: 'Custom agent executed successfully',
        processed_inputs: Object.keys(inputs).length,
        status: 'completed',
      },
    };

    return (
      mockOutputs[agentType] || {
        result: 'Mock execution completed',
        inputs_received: inputs,
        status: 'success',
      }
    );
  }
}
