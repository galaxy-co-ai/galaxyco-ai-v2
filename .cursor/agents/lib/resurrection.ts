/**
 * Agent Resurrection Protocol
 * Handles loading agent state from handoff files
 */

import fs from 'fs/promises';
import path from 'path';
import { AgentState, AgentId, validateAgentState } from '../schemas/agent-state.schema';
import { AgentStateManager } from './state-manager';
import { HandoffGenerator } from './handoff-generator';

export class AgentResurrection {
  private agentId: AgentId;
  private stateManager: AgentStateManager;
  private handoffGenerator: HandoffGenerator;

  constructor(agentId: AgentId, agentName: string) {
    this.agentId = agentId;
    this.stateManager = new AgentStateManager(agentId, agentName);
    this.handoffGenerator = new HandoffGenerator(this.stateManager);
  }

  /**
   * Check for handoff and resurrect agent
   */
  async resurrect(): Promise<{ resumed: boolean; state?: AgentState; handoffPath?: string }> {
    const handoffPath = await this.handoffGenerator.findLatestHandoff();

    if (!handoffPath) {
      console.log('🆕 No handoff file found - Starting fresh session');
      const state = await this.stateManager.initialize();
      return { resumed: false, state };
    }

    console.log(`📂 Found handoff file: ${path.basename(handoffPath)}`);
    console.log('🔄 Resurrecting agent from previous session...');

    // Read handoff
    const handoffContent = await this.handoffGenerator.readHandoff(handoffPath);
    console.log('✅ Handoff file loaded');

    // Extract session ID from handoff filename
    const sessionId = this.extractSessionIdFromPath(handoffPath);

    // Load state
    const state = await this.stateManager.loadSession(sessionId);

    // Update session number
    const newSessionId = this.generateNewSessionId();
    this.stateManager.updateState({
      sessionId: newSessionId,
      sessionNumber: state.sessionNumber + 1,
      previousSessionId: sessionId,
      status: 'active',
      timestamp: new Date().toISOString(),
    });

    await this.stateManager.save();

    console.log(`✅ Resurrected from Session ${state.sessionNumber}`);
    console.log(`📊 Session ${state.sessionNumber + 1} started`);
    console.log(
      `🎯 Current Mission: ${state.currentObjective || state.activeObjectives[0] || 'N/A'}`,
    );

    return {
      resumed: true,
      state: this.stateManager.getState(),
      handoffPath,
    };
  }

  /**
   * Display resurrection summary
   */
  displayResurrectionSummary(state: AgentState, handoffPath: string): void {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🤖 ${state.agentName} - Session ${state.sessionNumber}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (state.currentObjective) {
      console.log(`\n🎯 Current Mission:`);
      console.log(`   ${state.currentObjective}`);
    }

    if (state.activeObjectives.length > 0) {
      console.log(`\n📋 Active Objectives:`);
      state.activeObjectives.forEach((obj) => console.log(`   - ${obj}`));
    }

    if (state.inProgressTasks.length > 0) {
      console.log(`\n🔨 In Progress (${state.inProgressTasks.length}):`);
      state.inProgressTasks.slice(0, 3).forEach((task) => {
        console.log(`   - ${task.description} (${task.progress}%)`);
      });
    }

    if (state.blockedTasks.length > 0) {
      console.log(`\n⚠️  Blocked (${state.blockedTasks.length}):`);
      state.blockedTasks.slice(0, 2).forEach((task) => {
        console.log(`   - ${task.description}`);
      });
    }

    if (state.filesModified.length > 0) {
      console.log(`\n📂 Files Modified: ${state.filesModified.length}`);
    }

    if (state.nextSteps.length > 0) {
      console.log(`\n🎯 Next Steps:`);
      state.nextSteps.slice(0, 3).forEach((step, i) => {
        console.log(`   ${i + 1}. ${step}`);
      });
    }

    console.log(`\n📊 Metrics:`);
    console.log(`   Tasks Completed: ${state.metrics.tasksCompleted}`);
    console.log(`   Files Modified: ${state.metrics.filesModified}`);
    console.log(`   Lines Added: ${state.metrics.linesAdded}`);
    console.log(`   Success Rate: ${state.metrics.successRate}%`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Agent ready! How can I help you continue?');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Extract session ID from handoff file path
   */
  private extractSessionIdFromPath(handoffPath: string): string {
    const filename = path.basename(handoffPath);
    // Format: handoff-{sessionId}.md
    const match = filename.match(/handoff-(.+)\.md/);
    return match ? match[1] : '';
  }

  /**
   * Generate new session ID
   */
  private generateNewSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${this.agentId}-${timestamp}-${random}`;
  }

  /**
   * Get current state manager
   */
  getStateManager(): AgentStateManager {
    return this.stateManager;
  }
}

/**
 * Factory function
 */
export function createResurrection(agentId: AgentId, agentName: string): AgentResurrection {
  return new AgentResurrection(agentId, agentName);
}
