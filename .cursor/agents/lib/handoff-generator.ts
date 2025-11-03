/**
 * Handoff File Generator
 * Generates markdown handoff files from agent state
 */

import fs from 'fs/promises';
import path from 'path';
import { AgentState, AgentId, HandoffFile } from '../schemas/agent-state.schema';
import { AgentStateManager } from './state-manager';

export class HandoffGenerator {
  private stateManager: AgentStateManager;
  private templatesDir: string;

  constructor(stateManager: AgentStateManager) {
    this.stateManager = stateManager;
    this.templatesDir = path.join(process.cwd(), '.cursor/agents/templates');
  }

  /**
   * Generate handoff file from current state
   */
  async generateHandoff(reason: string = 'manual'): Promise<string> {
    const state = this.stateManager.getState();
    const handoff = this.buildHandoffContent(state, reason);
    const filename = `handoff-${state.sessionId}.md`;
    const filepath = path.join(this.stateManager['stateDir'], filename);

    await fs.writeFile(filepath, handoff, 'utf-8');
    console.log(`📝 Handoff file generated: ${filename}`);

    // Also save checkpoint
    await this.stateManager.saveCheckpoint(`handoff-generated-${reason}`);

    return filepath;
  }

  /**
   * Build handoff markdown content
   */
  private buildHandoffContent(state: AgentState, reason: string): string {
    const timestamp = new Date(state.timestamp).toLocaleString();
    const sessionDuration = Math.floor(
      (new Date().getTime() - new Date(state.createdAt).getTime()) / 60000,
    );

    return `# ${state.agentName} - Session Handoff
**Agent:** ${state.agentId}
**Session:** ${state.sessionNumber}
**Timestamp:** ${timestamp}
**Status:** ${state.status}
**Handoff Reason:** ${reason}
**Session Duration:** ${sessionDuration} minutes

---

## 🎯 Current Mission

${state.currentObjective || state.activeObjectives[0] || 'No active mission'}

### Active Objectives
${state.activeObjectives.map((obj) => `- ${obj}`).join('\n') || '- None'}

---

## 📋 Active Work

### In Progress (${state.inProgressTasks.length})
${
  state.inProgressTasks
    .map(
      (task) =>
        `- **${task.description}** (${task.progress}%)\n  - Priority: ${task.priority}\n  - Status: ${task.status}`,
    )
    .join('\n') || '- None'
}

### Blocked (${state.blockedTasks.length})
${
  state.blockedTasks
    .map((task) => {
      const blockedBy = task.blockedBy?.join(', ') || 'Unknown';
      return `- **${task.description}**\n  - Blocked by: ${blockedBy}`;
    })
    .join('\n') || '- None'
}

### Pending (${state.pendingTasks.length})
${
  state.pendingTasks
    .map((task) => `- **${task.description}** (${task.priority} priority)`)
    .join('\n') || '- None'
}

---

## 📂 Context

### Files Modified (${state.filesModified.length})
${
  state.filesModified
    .slice(-10)
    .map((file) => {
      const changes =
        file.linesAdded > 0 || file.linesDeleted > 0
          ? ` (+${file.linesAdded}, -${file.linesDeleted} lines)`
          : '';
      return `- **${file.path}**${changes}\n  - Action: ${file.action}\n  - Reason: ${file.reason || 'N/A'}`;
    })
    .join('\n') || '- None'
}

### Key Decisions Made (${state.decisionsMade.length})
${
  state.decisionsMade
    .slice(-5)
    .map((decision) => {
      return `- **${decision.description}**\n  - Rationale: ${decision.rationale}\n  - Impact: ${decision.impact}`;
    })
    .join('\n') || '- None'
}

### Learnings & Patterns (${state.knowledgeLearned.length})
${
  state.knowledgeLearned
    .slice(-5)
    .map((knowledge) => {
      return `- **${knowledge.category}**: ${knowledge.insight}\n  - ${knowledge.applicability || 'General pattern'}`;
    })
    .join('\n') || '- None'
}

---

## 🔄 Coordination

### Waiting On (${state.waitingOn.length})
${
  state.waitingOn
    .filter((dep) => !dep.resolvedAt)
    .map((dep) => `- **${dep.agentId}**: ${dep.reason}\n  - Task: ${dep.taskId}`)
    .join('\n') || '- None'
}

### Notifications Sent (${state.notificationsSent.length})
${
  state.notificationsSent
    .slice(-5)
    .map((notif) => `- To **${notif.to}**: ${notif.message}\n  - Type: ${notif.type}`)
    .join('\n') || '- None'
}

---

## 🎯 Next Steps

${state.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n') || '1. Review current objectives and continue work'}

### Future Considerations
${state.futureConsiderations.map((consideration) => `- ${consideration}`).join('\n') || '- None'}

---

## 📊 Metrics

- **Tasks Completed:** ${state.metrics.tasksCompleted}
- **Tasks In Progress:** ${state.metrics.tasksInProgress}
- **Tasks Blocked:** ${state.metrics.tasksBlocked}
- **Files Modified:** ${state.metrics.filesModified}
- **Lines Added:** ${state.metrics.linesAdded}
- **Lines Deleted:** ${state.metrics.linesDeleted}
- **Decisions Made:** ${state.metrics.decisionsMade}
- **Knowledge Items:** ${state.metrics.knowledgeItems}
- **Session Duration:** ${state.metrics.sessionDuration} minutes
- **Success Rate:** ${state.metrics.successRate}%

---

## 🔗 State Reference

- **Session ID:** ${state.sessionId}
- **Previous Session:** ${state.previousSessionId || 'N/A'}
- **Full State File:** \`state-${state.sessionId}.json\`
- **Branch:** ${state.branchName || 'main'}
- **Last Commit:** ${state.lastCommitSha?.substring(0, 7) || 'N/A'}

---

## 📝 Notes

${state.handoffReason || 'No additional notes'}

---

**Generated:** ${new Date().toISOString()}
**Version:** 1.0.0
`;
  }

  /**
   * Find latest handoff file for agent
   */
  async findLatestHandoff(): Promise<string | null> {
    const stateDir = this.stateManager['stateDir'];
    try {
      const files = await fs.readdir(stateDir);
      const handoffFiles = files.filter((f) => f.startsWith('handoff-') && f.endsWith('.md'));

      if (handoffFiles.length === 0) {
        return null;
      }

      // Get most recent
      const latestFile = handoffFiles.sort().reverse()[0];
      return path.join(stateDir, latestFile);
    } catch {
      return null;
    }
  }

  /**
   * Read handoff file content
   */
  async readHandoff(handoffPath: string): Promise<string> {
    return await fs.readFile(handoffPath, 'utf-8');
  }
}
