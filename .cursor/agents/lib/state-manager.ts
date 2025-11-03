/**
 * Agent State Manager
 * Handles saving, loading, and managing agent state across sessions
 */

import fs from 'fs/promises';
import path from 'path';
import {
  AgentState,
  AgentId,
  Checkpoint,
  validateAgentState,
  createEmptyAgentState,
  type Task,
  type FileChange,
  type Decision,
  type Knowledge,
} from '../schemas/agent-state.schema';

export class AgentStateManager {
  private agentId: AgentId;
  private agentName: string;
  private stateDir: string;
  private currentState: AgentState | null = null;
  private sessionStartTime: Date;

  constructor(agentId: AgentId, agentName: string) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.stateDir = path.join(process.cwd(), '.cursor/agents/state', agentId);
    this.sessionStartTime = new Date();
  }

  /**
   * Initialize agent state (load existing or create new)
   */
  async initialize(): Promise<AgentState> {
    try {
      await fs.mkdir(this.stateDir, { recursive: true });

      // Try to load latest state
      const latestState = await this.loadLatestState();

      if (latestState) {
        console.log(`✅ Loaded existing state for ${this.agentName}`);
        console.log(`   Session ${latestState.sessionNumber} continuing...`);
        this.currentState = latestState;
        return latestState;
      }

      // Create new state
      const sessionId = this.generateSessionId();
      this.currentState = createEmptyAgentState(this.agentId, this.agentName, sessionId);

      console.log(`🆕 Created new state for ${this.agentName}`);
      await this.save();

      return this.currentState;
    } catch (error) {
      console.error(`Failed to initialize state for ${this.agentName}:`, error);
      throw error;
    }
  }

  /**
   * Get current state
   */
  getState(): AgentState {
    if (!this.currentState) {
      throw new Error('State not initialized. Call initialize() first.');
    }
    return this.currentState;
  }

  /**
   * Update state (partial update)
   */
  updateState(updates: Partial<AgentState>): void {
    if (!this.currentState) {
      throw new Error('State not initialized');
    }

    this.currentState = {
      ...this.currentState,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Add task
   */
  addTask(task: Task): void {
    const state = this.getState();

    switch (task.status) {
      case 'in_progress':
        state.inProgressTasks.push(task);
        state.metrics.tasksInProgress++;
        break;
      case 'blocked':
        state.blockedTasks.push(task);
        state.metrics.tasksBlocked++;
        break;
      case 'completed':
        state.completedTasks.push(task);
        state.metrics.tasksCompleted++;
        break;
      default:
        state.pendingTasks.push(task);
    }

    this.updateState({ ...state });
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, newStatus: Task['status']): void {
    const state = this.getState();
    let task: Task | undefined;

    // Find and remove task from current list
    const lists = [
      state.pendingTasks,
      state.inProgressTasks,
      state.blockedTasks,
      state.completedTasks,
    ];

    for (const list of lists) {
      const index = list.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        [task] = list.splice(index, 1);
        break;
      }
    }

    if (!task) {
      console.warn(`Task ${taskId} not found`);
      return;
    }

    // Update task
    task.status = newStatus;
    if (newStatus === 'completed') {
      task.completedAt = new Date().toISOString();
    }

    // Add to new list
    this.addTask(task);
  }

  /**
   * Record file change
   */
  recordFileChange(change: FileChange): void {
    const state = this.getState();
    state.filesModified.push(change);
    state.metrics.filesModified++;
    state.metrics.linesAdded += change.linesAdded;
    state.metrics.linesDeleted += change.linesDeleted;
    this.updateState({ ...state });
  }

  /**
   * Record decision
   */
  recordDecision(decision: Decision): void {
    const state = this.getState();
    state.decisionsMade.push(decision);
    state.metrics.decisionsMade++;
    this.updateState({ ...state });
  }

  /**
   * Add knowledge
   */
  addKnowledge(knowledge: Knowledge): void {
    const state = this.getState();
    state.knowledgeLearned.push(knowledge);
    state.metrics.knowledgeItems++;
    this.updateState({ ...state });
  }

  /**
   * Set current objective
   */
  setObjective(objective: string): void {
    const state = this.getState();
    state.currentObjective = objective;
    if (!state.activeObjectives.includes(objective)) {
      state.activeObjectives.push(objective);
    }
    this.updateState({ ...state });
  }

  /**
   * Add next step
   */
  addNextStep(step: string): void {
    const state = this.getState();
    state.nextSteps.push(step);
    this.updateState({ ...state });
  }

  /**
   * Update metrics (for session duration, tokens, etc.)
   */
  updateMetrics(updates: Partial<AgentState['metrics']>): void {
    const state = this.getState();
    state.metrics = {
      ...state.metrics,
      ...updates,
    };
    this.updateState({ ...state });
  }

  /**
   * Save current state to file
   */
  async save(): Promise<void> {
    if (!this.currentState) {
      throw new Error('No state to save');
    }

    const filename = `state-${this.currentState.sessionId}.json`;
    const filepath = path.join(this.stateDir, filename);

    try {
      await fs.writeFile(filepath, JSON.stringify(this.currentState, null, 2), 'utf-8');
      console.log(`💾 State saved: ${filename}`);
    } catch (error) {
      console.error(`Failed to save state:`, error);
      throw error;
    }
  }

  /**
   * Save checkpoint (periodic save with additional metadata)
   */
  async saveCheckpoint(reason: string): Promise<Checkpoint> {
    const state = this.getState();
    const sessionDuration = Math.floor(
      (new Date().getTime() - this.sessionStartTime.getTime()) / 60000,
    );

    this.updateMetrics({ sessionDuration });

    const checkpoint: Checkpoint = {
      id: `checkpoint-${Date.now()}`,
      sessionId: state.sessionId,
      timestamp: new Date().toISOString(),
      reason,
      state: { ...state },
      metrics: { ...state.metrics },
      tokensUsedSinceLastCheckpoint: 0, // Would be calculated based on actual token usage
    };

    const filename = `checkpoint-${checkpoint.id}.json`;
    const filepath = path.join(this.stateDir, filename);

    await fs.writeFile(filepath, JSON.stringify(checkpoint, null, 2), 'utf-8');
    await this.save(); // Also save latest state

    console.log(`📌 Checkpoint saved: ${reason}`);
    return checkpoint;
  }

  /**
   * Load latest state from file
   */
  private async loadLatestState(): Promise<AgentState | null> {
    try {
      const files = await fs.readdir(this.stateDir);
      const stateFiles = files.filter((f) => f.startsWith('state-') && f.endsWith('.json'));

      if (stateFiles.length === 0) {
        return null;
      }

      // Get most recent state file
      const latestFile = stateFiles.sort().reverse()[0];
      const filepath = path.join(this.stateDir, latestFile);
      const content = await fs.readFile(filepath, 'utf-8');
      const data = JSON.parse(content);

      return validateAgentState(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Load state from specific session
   */
  async loadSession(sessionId: string): Promise<AgentState> {
    const filename = `state-${sessionId}.json`;
    const filepath = path.join(this.stateDir, filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const data = JSON.parse(content);
      this.currentState = validateAgentState(data);
      return this.currentState;
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<
    Array<{ sessionId: string; sessionNumber: number; timestamp: string }>
  > {
    try {
      const files = await fs.readdir(this.stateDir);
      const stateFiles = files.filter((f) => f.startsWith('state-') && f.endsWith('.json'));

      const sessions = await Promise.all(
        stateFiles.map(async (file) => {
          const filepath = path.join(this.stateDir, file);
          const content = await fs.readFile(filepath, 'utf-8');
          const state = JSON.parse(content) as AgentState;
          return {
            sessionId: state.sessionId,
            sessionNumber: state.sessionNumber,
            timestamp: state.timestamp,
          };
        }),
      );

      return sessions.sort((a, b) => b.sessionNumber - a.sessionNumber);
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${this.agentId}-${timestamp}-${random}`;
  }

  /**
   * Clean old sessions (keep last N)
   */
  async cleanOldSessions(keep: number = 5): Promise<void> {
    const sessions = await this.listSessions();

    if (sessions.length <= keep) {
      return;
    }

    const toDelete = sessions.slice(keep);

    for (const session of toDelete) {
      const filename = `state-${session.sessionId}.json`;
      const filepath = path.join(this.stateDir, filename);
      try {
        await fs.unlink(filepath);
        console.log(`🗑️  Deleted old session: ${session.sessionId}`);
      } catch (error) {
        console.warn(`Could not delete session ${session.sessionId}:`, error);
      }
    }
  }
}

/**
 * Factory function to create state manager
 */
export function createStateManager(agentId: AgentId, agentName: string): AgentStateManager {
  return new AgentStateManager(agentId, agentName);
}
