/**
 * Undo/Redo Manager for AI Actions
 *
 * Allows users to undo destructive or undesired AI actions.
 * Maintains action history and enables rollback.
 */

'use client';

import type { ToolResult } from './tools/types';

export interface UndoableAction {
  id: string;
  toolName: string;
  params: any;
  result: ToolResult;
  timestamp: Date;
  canUndo: boolean;
  undoFn?: () => Promise<void>;
}

class UndoManager {
  private history: UndoableAction[] = [];
  private maxHistorySize = 50;

  /**
   * Record an action that can be undone
   */
  recordAction(action: UndoableAction) {
    this.history.unshift(action);

    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Get recent actions
   */
  getHistory(limit = 10): UndoableAction[] {
    return this.history.slice(0, limit);
  }

  /**
   * Undo an action by ID
   */
  async undoAction(actionId: string): Promise<{ success: boolean; message: string }> {
    const action = this.history.find((a) => a.id === actionId);

    if (!action) {
      return { success: false, message: 'Action not found in history' };
    }

    if (!action.canUndo) {
      return { success: false, message: 'This action cannot be undone' };
    }

    if (!action.undoFn) {
      return { success: false, message: 'Undo function not available' };
    }

    try {
      await action.undoFn();
      
      // Mark as undone
      action.canUndo = false;
      
      return { success: true, message: `Successfully undid: ${action.toolName}` };
    } catch (error: any) {
      return { success: false, message: `Failed to undo: ${error.message}` };
    }
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Check if action can be undone
   */
  canUndoAction(actionId: string): boolean {
    const action = this.history.find((a) => a.id === actionId);
    return !!(action && action.canUndo && action.undoFn);
  }
}

// Export singleton
export const undoManager = new UndoManager();

/**
 * Create undo function for common actions
 */
export function createUndoFunctions() {
  return {
    /**
     * Undo agent creation (delete the agent)
     */
    undoCreateAgent: async (agentId: string) => {
      // Would call delete agent action
      await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
    },

    /**
     * Undo knowledge item upload (delete the item)
     */
    undoUploadDocument: async (itemId: string) => {
      // Would call delete knowledge item
      await fetch(`/api/knowledge/${itemId}`, { method: 'DELETE' });
    },

    /**
     * Undo integration connection (disconnect)
     */
    undoConnectIntegration: async (integrationId: string) => {
      // Would call disconnect integration
      await fetch(`/api/integrations/${integrationId}/disconnect`, { method: 'POST' });
    },
  };
}

