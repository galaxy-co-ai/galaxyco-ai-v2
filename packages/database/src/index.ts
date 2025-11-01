/**
 * @galaxyco/database
 *
 * Multi-tenant database package with Drizzle ORM
 */

export * from './client';
export * from './schema';

// Re-export specific tables for convenience
export {
  users,
  workspaces,
  workspaceMembers,
  agents,
  agentTemplates,
  agentPacks,
  agentExecutions,
  agentSchedules,
  workspaceApiKeys,
  // Galaxy Studio tables
  galaxyGrids,
  gridNodes,
  gridEdges,
  gridVersions,
  gridExecutions,
  executionSteps,
  gridTemplates,
} from './schema';

// Re-export types
export type {
  userRoleEnum,
  agentTypeEnum,
  agentStatusEnum,
  executionStatusEnum,
  subscriptionTierEnum,
} from './schema';
