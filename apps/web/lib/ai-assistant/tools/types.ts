/**
 * Type definitions for AI Assistant Tools
 *
 * Tools are actions the AI can perform on behalf of users.
 * Each tool has:
 * - Name and description (for AI to understand when to use it)
 * - Zod schema for type-safe parameter validation
 * - Execute function that performs the action
 * - Permission requirements
 */

import { z } from 'zod';

/**
 * Context provided to every tool execution
 */
export interface ToolContext {
  userId: string;
  workspaceId: string;
  permissions: string[];
  sessionId?: string;
  organizationId?: string;
}

/**
 * Result of tool execution
 */
export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  action?: ToolAction; // For visual feedback
}

/**
 * Action to perform in UI (for visual feedback)
 */
export interface ToolAction {
  type: 'navigate' | 'highlight' | 'create' | 'update' | 'delete' | 'notify' | 'confirm';
  target?: string; // URL, element ID, resource ID
  label?: string; // Human-readable description
  data?: any;
}

/**
 * Tool definition
 */
export interface Tool<TParams = any, TResult = any> {
  name: string;
  description: string;
  category: ToolCategory;
  parameters: z.ZodSchema<TParams>;
  requiredPermissions?: string[];
  isDestructive?: boolean; // Requires confirmation
  execute: (params: TParams, context: ToolContext) => Promise<ToolResult<TResult>>;
}

/**
 * Tool categories for organization
 */
export type ToolCategory =
  | 'agents'
  | 'workflows'
  | 'integrations'
  | 'knowledge'
  | 'analytics'
  | 'crm'
  | 'communication'
  | 'system';

/**
 * Tool registry - all available tools
 */
export type ToolRegistry = Record<string, Tool>;

/**
 * Permission types
 */
export enum Permission {
  // Agent permissions
  AGENTS_CREATE = 'agents:create',
  AGENTS_READ = 'agents:read',
  AGENTS_UPDATE = 'agents:update',
  AGENTS_DELETE = 'agents:delete',
  AGENTS_EXECUTE = 'agents:execute',

  // Workflow permissions
  WORKFLOWS_CREATE = 'workflows:create',
  WORKFLOWS_READ = 'workflows:read',
  WORKFLOWS_UPDATE = 'workflows:update',
  WORKFLOWS_DELETE = 'workflows:delete',
  WORKFLOWS_EXECUTE = 'workflows:execute',

  // Integration permissions
  INTEGRATIONS_CONNECT = 'integrations:connect',
  INTEGRATIONS_DISCONNECT = 'integrations:disconnect',
  INTEGRATIONS_READ = 'integrations:read',

  // Knowledge permissions
  KNOWLEDGE_CREATE = 'knowledge:create',
  KNOWLEDGE_READ = 'knowledge:read',
  KNOWLEDGE_UPDATE = 'knowledge:update',
  KNOWLEDGE_DELETE = 'knowledge:delete',

  // Analytics permissions
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',

  // CRM permissions
  CRM_CONTACTS_CREATE = 'crm:contacts:create',
  CRM_CONTACTS_READ = 'crm:contacts:read',
  CRM_CONTACTS_UPDATE = 'crm:contacts:update',
  CRM_CONTACTS_DELETE = 'crm:contacts:delete',

  // System permissions
  SYSTEM_SETTINGS_UPDATE = 'system:settings:update',
  SYSTEM_USERS_MANAGE = 'system:users:manage',
  SYSTEM_BILLING_MANAGE = 'system:billing:manage',
}

/**
 * Error types for tool execution
 */
export class ToolError extends Error {
  constructor(
    message: string,
    public code:
      | 'PERMISSION_DENIED'
      | 'VALIDATION_ERROR'
      | 'EXECUTION_ERROR'
      | 'NOT_FOUND'
      | 'RATE_LIMIT'
      | 'DEPENDENCY_ERROR',
  ) {
    super(message);
    this.name = 'ToolError';
  }
}
