/**
 * Galaxy Studio TypeScript Type Definitions
 *
 * These types mirror the database schema and extend it with
 * runtime-specific properties needed by the UI components.
 */

import type {
  GridStatus,
  GridNodeType,
  GridNodeStatus,
  GridEdgeType,
  GridExecutionStatus,
} from '@galaxyco/database';

// Re-export for use in other files
export type { GridNodeType, GridNodeStatus };

// ============================================================================
// Template Types
// ============================================================================

export interface GridTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  preview_data: TemplatePreviewData;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: number | null; // in minutes
  uses: number;
  rating: number | null; // 0-5
  featured: boolean;
  author_id: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface TemplatePreviewData {
  nodes: TemplateNode[];
  edges: TemplateEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface TemplateNode {
  id: string;
  type: GridNodeType;
  label: string;
  position: { x: number; y: number };
  config?: Record<string, unknown>;
}

export interface TemplateEdge {
  id: string;
  source: string;
  target: string;
  type: GridEdgeType;
  label?: string;
}

// ============================================================================
// Grid Types
// ============================================================================

export interface GalaxyGrid {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  status: GridStatus;
  version: number;
  is_template: boolean;
  thumbnail_url: string | null;
  tags: string[];
  viewport: Viewport;
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// ============================================================================
// Node Types
// ============================================================================

export interface GridNode {
  id: string;
  grid_id: string;
  type: GridNodeType;
  label: string;
  description: string | null;
  position: { x: number; y: number };
  config: NodeConfig;
  agent_id: string | null;
  status: GridNodeStatus;
  created_at: string;
  updated_at: string;
}

// Node-type-specific configuration
// Aligned with database schema: trigger, action, condition, loop, ai, webhook,
// delay, transform, filter, aggregate, branch, merge, api, database, email,
// notification, integration, custom
export type NodeConfig =
  | TriggerNodeConfig
  | ActionNodeConfig
  | ConditionNodeConfig
  | LoopNodeConfig
  | AiNodeConfig
  | WebhookNodeConfig
  | ApiNodeConfig
  | DatabaseNodeConfig
  | TransformNodeConfig
  | FilterNodeConfig
  | AggregateNodeConfig
  | BranchNodeConfig
  | MergeNodeConfig
  | DelayNodeConfig
  | EmailNodeConfig
  | NotificationNodeConfig
  | IntegrationNodeConfig
  | CustomNodeConfig;

export interface BaseNodeConfig {
  type: GridNodeType;
}

export interface TriggerNodeConfig extends BaseNodeConfig {
  type: 'trigger';
  triggerType: 'manual' | 'webhook' | 'schedule' | 'event';
  schedule?: string; // cron expression
  webhookUrl?: string;
}

export interface ActionNodeConfig extends BaseNodeConfig {
  type: 'action';
  actionType: string;
  parameters: Record<string, unknown>;
}

export interface ConditionNodeConfig extends BaseNodeConfig {
  type: 'condition';
  expression: string; // e.g., "{{input.value}} > 100"
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'custom';
}

export interface LoopNodeConfig extends BaseNodeConfig {
  type: 'loop';
  loopType: 'for_each' | 'while' | 'until';
  iterableExpression: string; // e.g., "{{input.items}}"
  maxIterations?: number;
}

export interface AiNodeConfig extends BaseNodeConfig {
  type: 'ai';
  provider: 'openai' | 'anthropic' | 'cohere' | 'custom';
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface WebhookNodeConfig extends BaseNodeConfig {
  type: 'webhook';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ApiNodeConfig extends BaseNodeConfig {
  type: 'api';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
}

export interface DatabaseNodeConfig extends BaseNodeConfig {
  type: 'database';
  operation: 'query' | 'insert' | 'update' | 'delete';
  query: string;
  parameters?: Record<string, unknown>;
}

export interface TransformNodeConfig extends BaseNodeConfig {
  type: 'transform';
  transformation: string; // JavaScript expression
  outputSchema?: Record<string, unknown>;
}

export interface FilterNodeConfig extends BaseNodeConfig {
  type: 'filter';
  predicate: string; // JavaScript expression returning boolean
}

export interface MergeNodeConfig extends BaseNodeConfig {
  type: 'merge';
  mergeStrategy: 'first' | 'all' | 'race';
}

export interface AggregateNodeConfig extends BaseNodeConfig {
  type: 'aggregate';
  aggregationType: 'sum' | 'count' | 'average' | 'min' | 'max';
  field: string;
}

export interface BranchNodeConfig extends BaseNodeConfig {
  type: 'branch';
  branches: Array<{
    condition: string;
    label: string;
  }>;
}

export interface DelayNodeConfig extends BaseNodeConfig {
  type: 'delay';
  duration: number; // in milliseconds
}

export interface EmailNodeConfig extends BaseNodeConfig {
  type: 'email';
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
}

export interface NotificationNodeConfig extends BaseNodeConfig {
  type: 'notification';
  channel: 'email' | 'sms' | 'slack' | 'webhook';
  recipient: string;
  message: string;
}

export interface IntegrationNodeConfig extends BaseNodeConfig {
  type: 'integration';
  integrationId: string;
  action: string;
  parameters: Record<string, unknown>;
}

export interface CustomNodeConfig extends BaseNodeConfig {
  type: 'custom';
  code: string; // JavaScript/TypeScript code
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
}

// ============================================================================
// Edge Types
// ============================================================================

export interface GridEdge {
  id: string;
  grid_id: string;
  source_node_id: string;
  target_node_id: string;
  source_handle: string | null;
  target_handle: string | null;
  type: GridEdgeType;
  label: string | null;
  condition: string | null; // for conditional edges
  animated: boolean;
  created_at: string;
}

// ============================================================================
// Execution Types
// ============================================================================

export interface GridExecution {
  id: string;
  grid_id: string;
  workspace_id: string;
  status: GridExecutionStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  trigger_data: Record<string, unknown> | null;
  error_message: string | null;
  created_by: string;
}

export interface ExecutionStep {
  id: string;
  execution_id: string;
  node_id: string;
  node_label: string;
  status: GridNodeStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  error_message: string | null;
  retry_count: number;
}

// ============================================================================
// Version Control Types
// ============================================================================

export interface GridVersion {
  id: string;
  grid_id: string;
  version: number;
  snapshot_data: GridSnapshot;
  created_by: string;
  created_at: string;
  notes: string | null;
}

export interface GridSnapshot {
  grid: Partial<GalaxyGrid>;
  nodes: GridNode[];
  edges: GridEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    createdAt: string;
  };
}

// ============================================================================
// UI-Specific Types
// ============================================================================

export interface CanvasNode extends GridNode {
  // React Flow specific properties
  selected?: boolean;
  dragging?: boolean;
  zIndex?: number;
}

export interface CanvasEdge extends GridEdge {
  // React Flow specific properties
  selected?: boolean;
}

export interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: Viewport;
}

export interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}
