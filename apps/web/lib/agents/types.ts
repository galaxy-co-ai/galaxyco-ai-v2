/**
 * Agent Builder Types
 * Complete type definitions for the Agents Builder system
 */

import type { Agent, AgentSchedule, AgentExecution } from '@galaxyco/database';

// ============================================================================
// Workflow Types (For Builder)
// ============================================================================

export type WorkflowNodeType = 'start' | 'action' | 'condition' | 'end';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description?: string;
  integration?: string;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// ============================================================================
// Agent Types (Extended from DB)
// ============================================================================

export type AgentStatus = 'draft' | 'active' | 'paused' | 'archived';
export type AgentVariant = 'minimal' | 'basic' | 'advanced';
export type TriggerType = 'manual' | 'scheduled' | 'webhook';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Agent with computed metrics and relations
export interface AgentWithSchedule extends Agent {
  schedule?: AgentSchedule | null;
  lastExecution?: AgentExecution | null;
  metrics?: {
    successRate: number; // 0-100
    avgDuration: number; // milliseconds
    totalRuns: number;
    lastRunAt: Date | null;
  };
}

// Agent with full relations for detail view
export interface AgentWithRelations extends AgentWithSchedule {
  executions?: AgentExecution[];
  recentExecutions?: AgentExecution[]; // Last 5
}

// ============================================================================
// Input Types (For Creating/Updating)
// ============================================================================

export interface CreateAgentInput {
  name: string;
  description: string;
  workflow: WorkflowNode[];
  edges: WorkflowEdge[];
  variantType: AgentVariant;
  originalPrompt: string;
  enhancedPrompt?: string;
  integrations: string[];
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  status?: AgentStatus;
  workflow?: WorkflowNode[];
  edges?: WorkflowEdge[];
  integrations?: string[];
}

export interface ScheduleConfigInput {
  triggerType: TriggerType;
  cron?: string;
  timezone?: string;
  webhookUrl?: string;
  enabled?: boolean;
}

// ============================================================================
// Execution Types
// ============================================================================

export interface ExecutionStepLog {
  id: string;
  nodeId: string;
  step: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  details?: string;
  error?: string;
}

export interface ExecutionOutputItem {
  id: string;
  type: 'ai-result' | 'notification' | 'data' | 'document';
  title?: string;
  content: any;
  timestamp: Date;
}

// ============================================================================
// List/Filter Types
// ============================================================================

export interface AgentFilters {
  status?: AgentStatus[];
  integrations?: string[];
  search?: string;
}

export interface ExecutionFilters {
  status?: ExecutionStatus[];
  triggerType?: TriggerType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface AgentListState {
  agents: AgentWithSchedule[];
  filters: AgentFilters;
  isLoading: boolean;
  error: string | null;
}

export interface AgentDetailState {
  agent: AgentWithRelations | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ListAgentsResponse {
  agents: AgentWithSchedule[];
  total: number;
}

export interface GetAgentResponse {
  agent: AgentWithRelations;
}

export interface CreateAgentResponse {
  agent: Agent;
  success: boolean;
}

export interface ActivateAgentResponse {
  agent: Agent;
  schedule: AgentSchedule;
  success: boolean;
}

// ============================================================================
// Form State Types
// ============================================================================

export interface DeployModalState {
  isOpen: boolean;
  agentId: string | null;
  agentName: string;
  triggerType: TriggerType;
  scheduleConfig: Partial<ScheduleConfigInput>;
  isDeploying: boolean;
}

// ============================================================================
// Metric Types
// ============================================================================

export interface AgentMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRuns: number;
  successRate: number;
  avgDuration: number;
  costToday: number; // in cents
  tokensUsed: number;
}

export interface ExecutionMetrics {
  total: number;
  successful: number;
  failed: number;
  avgDuration: number;
  totalCost: number; // in cents
  totalTokens: number;
}

// ============================================================================
// Preset Types
// ============================================================================

export interface SchedulePreset {
  label: string;
  value: string;
  cron?: string;
  description?: string;
}

export const SCHEDULE_PRESETS: SchedulePreset[] = [
  {
    label: 'Every hour',
    value: 'hourly',
    cron: '0 * * * *',
    description: 'Runs at the top of every hour',
  },
  {
    label: 'Every 6 hours',
    value: '6hours',
    cron: '0 */6 * * *',
    description: 'Runs 4 times daily',
  },
  {
    label: 'Daily at 9 AM',
    value: 'daily-9am',
    cron: '0 9 * * *',
    description: 'Runs once daily',
  },
  {
    label: 'Weekdays at 9 AM',
    value: 'weekdays-9am',
    cron: '0 9 * * 1-5',
    description: 'Runs Mon-Fri',
  },
  {
    label: 'Weekly on Monday',
    value: 'weekly-mon',
    cron: '0 9 * * 1',
    description: 'Runs every Monday',
  },
  {
    label: 'Custom',
    value: 'custom',
    description: 'Define your own cron expression',
  },
];

export const TIMEZONE_OPTIONS = [
  'America/Chicago',
  'America/New_York',
  'America/Los_Angeles',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
];

// ============================================================================
// Helper Types
// ============================================================================

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'status' | 'createdAt' | 'lastExecutedAt' | 'executionCount';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
