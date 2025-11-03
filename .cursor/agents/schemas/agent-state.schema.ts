/**
 * Agent State Schema Definitions
 * Zod schemas for agent state persistence and handoffs
 */

import { z } from 'zod';

// ============================================================================
// Core Agent Types
// ============================================================================

export const AgentIdSchema = z.enum([
  'frontend-architect',
  'backend-systems',
  'devops-infrastructure',
  'quality-testing',
  'ui-ux-design',
  'cursor-engineer',
]);

export type AgentId = z.infer<typeof AgentIdSchema>;

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'blocked', 'completed']);

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

// ============================================================================
// Task & File Change Schemas
// ============================================================================

export const TaskSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  progress: z.number().min(0).max(100),
  blockedBy: z.array(z.string()).optional(),
  estimatedTime: z.number().optional(), // minutes
  actualTime: z.number().optional(), // minutes
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const FileChangeSchema = z.object({
  path: z.string(),
  action: z.enum(['created', 'modified', 'deleted']),
  linesAdded: z.number().default(0),
  linesDeleted: z.number().default(0),
  timestamp: z.string().datetime(),
  reason: z.string().optional(),
});

export type FileChange = z.infer<typeof FileChangeSchema>;

// ============================================================================
// Decision & Knowledge Schemas
// ============================================================================

export const DecisionSchema = z.object({
  id: z.string(),
  description: z.string(),
  rationale: z.string(),
  alternatives: z.array(z.string()).default([]),
  impact: z.enum(['low', 'medium', 'high']),
  timestamp: z.string().datetime(),
});

export type Decision = z.infer<typeof DecisionSchema>;

export const KnowledgeSchema = z.object({
  id: z.string(),
  category: z.string(),
  insight: z.string(),
  source: z.string().optional(), // file, URL, etc.
  applicability: z.string().optional(), // when to apply this
  timestamp: z.string().datetime(),
});

export type Knowledge = z.infer<typeof KnowledgeSchema>;

// ============================================================================
// Agent Dependency & Notification Schemas
// ============================================================================

export const AgentDependencySchema = z.object({
  agentId: AgentIdSchema,
  taskId: z.string(),
  reason: z.string(),
  createdAt: z.string().datetime(),
  resolvedAt: z.string().datetime().optional(),
});

export type AgentDependency = z.infer<typeof AgentDependencySchema>;

export const AgentNotificationSchema = z.object({
  id: z.string(),
  from: AgentIdSchema,
  to: AgentIdSchema,
  type: z.string(),
  message: z.string(),
  context: z.record(z.unknown()).optional(),
  priority: PrioritySchema,
  read: z.boolean().default(false),
  timestamp: z.string().datetime(),
});

export type AgentNotification = z.infer<typeof AgentNotificationSchema>;

// ============================================================================
// Agent Metrics Schema
// ============================================================================

export const AgentMetricsSchema = z.object({
  tasksCompleted: z.number().default(0),
  tasksInProgress: z.number().default(0),
  tasksBlocked: z.number().default(0),
  averageTaskTime: z.number().default(0), // minutes
  successRate: z.number().min(0).max(100).default(100),
  filesModified: z.number().default(0),
  linesAdded: z.number().default(0),
  linesDeleted: z.number().default(0),
  decisionsMade: z.number().default(0),
  knowledgeItems: z.number().default(0),
  sessionDuration: z.number().default(0), // minutes
  tokensUsed: z.number().default(0),
});

export type AgentMetrics = z.infer<typeof AgentMetricsSchema>;

// ============================================================================
// Main Agent State Schema
// ============================================================================

export const AgentStateSchema = z.object({
  // Identity
  agentId: AgentIdSchema,
  agentName: z.string(),
  sessionId: z.string(),
  sessionNumber: z.number().int().positive(),
  timestamp: z.string().datetime(),
  status: z.enum(['active', 'waiting', 'blocked', 'idle']),

  // Current Work
  currentObjective: z.string().optional(),
  activeObjectives: z.array(z.string()).default([]),
  inProgressTasks: z.array(TaskSchema).default([]),
  pendingTasks: z.array(TaskSchema).default([]),
  blockedTasks: z.array(TaskSchema).default([]),
  completedTasks: z.array(TaskSchema).default([]),

  // Context
  filesModified: z.array(FileChangeSchema).default([]),
  decisionsMade: z.array(DecisionSchema).default([]),
  knowledgeLearned: z.array(KnowledgeSchema).default([]),
  branchName: z.string().optional(),
  lastCommitSha: z.string().optional(),

  // Coordination
  waitingOn: z.array(AgentDependencySchema).default([]),
  notificationsReceived: z.array(AgentNotificationSchema).default([]),
  notificationsSent: z.array(AgentNotificationSchema).default([]),

  // Metrics
  metrics: AgentMetricsSchema,

  // Next Steps
  nextSteps: z.array(z.string()).default([]),
  futureConsiderations: z.array(z.string()).default([]),

  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  previousSessionId: z.string().optional(),
  handoffReason: z.string().optional(),
});

export type AgentState = z.infer<typeof AgentStateSchema>;

// ============================================================================
// Checkpoint Schema (for periodic saves)
// ============================================================================

export const CheckpointSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  timestamp: z.string().datetime(),
  reason: z.string(),
  state: AgentStateSchema,
  metrics: AgentMetricsSchema,
  tokensUsedSinceLastCheckpoint: z.number().default(0),
});

export type Checkpoint = z.infer<typeof CheckpointSchema>;

// ============================================================================
// Handoff File Schema
// ============================================================================

export const HandoffFileSchema = z.object({
  version: z.string().default('1.0.0'),
  agentId: AgentIdSchema,
  agentName: z.string(),
  sessionNumber: z.number().int().positive(),
  timestamp: z.string().datetime(),
  status: z.enum(['active', 'completed', 'interrupted']),

  // Content sections
  currentMission: z.string(),
  activeWork: z.object({
    inProgress: z.array(
      z.object({
        task: z.string(),
        progress: z.number(),
      }),
    ),
    blocked: z.array(
      z.object({
        task: z.string(),
        blockedBy: z.string(),
      }),
    ),
  }),

  context: z.object({
    filesModified: z.array(z.object({ file: z.string(), changes: z.string() })),
    keyDecisions: z.array(z.object({ decision: z.string(), rationale: z.string() })),
    learnings: z.array(z.string()),
  }),

  coordination: z.object({
    waitingOn: z.array(z.object({ agent: z.string(), what: z.string() })),
    notificationsSent: z.array(z.object({ to: z.string(), message: z.string() })),
  }),

  nextSteps: z.array(z.string()),
  metrics: AgentMetricsSchema,

  // Full state reference
  fullStateFile: z.string().optional(),
});

export type HandoffFile = z.infer<typeof HandoffFileSchema>;

// ============================================================================
// Agent Configuration Schema
// ============================================================================

export const AgentConfigSchema = z.object({
  agentId: AgentIdSchema,
  agentName: z.string(),
  primaryColor: z.string(),
  scope: z.object({
    directories: z.array(z.string()),
    filePatterns: z.array(z.string()),
  }),
  expertise: z.array(z.string()),
  autoSaveConfig: z.object({
    tokenThreshold: z.number().default(900_000),
    timeInterval: z.number().default(30), // minutes
    enableEventBased: z.boolean().default(true),
  }),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

export function validateAgentState(data: unknown): AgentState {
  return AgentStateSchema.parse(data);
}

export function validateHandoff(data: unknown): HandoffFile {
  return HandoffFileSchema.parse(data);
}

export function createEmptyAgentState(
  agentId: AgentId,
  agentName: string,
  sessionId: string,
): AgentState {
  const now = new Date().toISOString();
  return {
    agentId,
    agentName,
    sessionId,
    sessionNumber: 1,
    timestamp: now,
    status: 'active',
    activeObjectives: [],
    inProgressTasks: [],
    pendingTasks: [],
    blockedTasks: [],
    completedTasks: [],
    filesModified: [],
    decisionsMade: [],
    knowledgeLearned: [],
    waitingOn: [],
    notificationsReceived: [],
    notificationsSent: [],
    metrics: {
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksBlocked: 0,
      averageTaskTime: 0,
      successRate: 100,
      filesModified: 0,
      linesAdded: 0,
      linesDeleted: 0,
      decisionsMade: 0,
      knowledgeItems: 0,
      sessionDuration: 0,
      tokensUsed: 0,
    },
    nextSteps: [],
    futureConsiderations: [],
    createdAt: now,
    updatedAt: now,
  };
}
