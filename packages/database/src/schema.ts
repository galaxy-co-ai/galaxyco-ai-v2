/**
 * GalaxyCo.ai Database Schema
 *
 * MULTI-TENANT SECURITY RULE (4kR94Z3XhqK4C54vwDDwnq):
 * =====================================================
 * ALL queries MUST include tenant_id filter in WHERE clauses
 * NEVER expose data across tenant boundaries
 * Use row-level security policies where applicable
 * Validate tenant_id matches authenticated user's tenant
 * Log any cross-tenant data access attempts as security incidents
 *
 * This schema implements strict multi-tenancy with:
 * - tenant_id on every table
 * - Workspace-based tenant isolation
 * - Role-based access control (RBAC)
 * - Audit timestamps on all records
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);
export const agentTypeEnum = pgEnum("agent_type", [
  "scope",
  "call",
  "email",
  "note",
  "task",
  "roadmap",
  "content",
  "custom",
  "browser",
  "cross-app",
  "knowledge",
  "sales",
  "trending",
  "research",
  "meeting",
  "code",
  "data",
  "security",
]);
export const knowledgeItemTypeEnum = pgEnum("knowledge_item_type", [
  "document",
  "url",
  "image",
  "text",
]);
export const knowledgeItemStatusEnum = pgEnum("knowledge_item_status", [
  "processing",
  "ready",
  "failed",
]);
export const agentStatusEnum = pgEnum("agent_status", [
  "draft",
  "active",
  "paused",
  "archived",
]);
export const executionStatusEnum = pgEnum("execution_status", [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);
export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "starter",
  "professional",
  "enterprise",
]);

// CRM & Business enums
export const customerStatusEnum = pgEnum("customer_status", [
  "lead",
  "active",
  "inactive",
  "churned",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
  "cancelled",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "active",
  "paused",
  "completed",
]);
export const prospectStageEnum = pgEnum("prospect_stage", [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

// Communication enums
export const inboxChannelEnum = pgEnum("inbox_channel", [
  "email",
  "chat",
  "notification",
  "comment",
  "mention",
]);
export const inboxStatusEnum = pgEnum("inbox_status", [
  "unread",
  "read",
  "archived",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "success",
  "warning",
  "error",
  "mention",
  "assignment",
  "reminder",
  "system",
]);

// Job status enum for exports/imports
export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

// ============================================================================
// WORKSPACES (Tenant Boundary)
// ============================================================================

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),

    // Clerk organization ID for auth integration
    clerkOrganizationId: text("clerk_organization_id").unique(),

    // Subscription & billing
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .notNull()
      .default("free"),
    subscriptionStatus: text("subscription_status").notNull().default("active"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),

    // Settings & configuration
    settings: jsonb("settings")
      .$type<{
        branding?: { logo?: string; primaryColor?: string };
        features?: { ai_provider?: string; max_agents?: number };
        notifications?: { email?: boolean; slack?: boolean };
      }>()
      .default({}),

    // Encrypted API keys for AI providers
    encryptedApiKeys: jsonb("encrypted_api_keys")
      .$type<{
        openai?: string; // AES-256-GCM encrypted
        anthropic?: string; // AES-256-GCM encrypted
        google?: string; // AES-256-GCM encrypted
      }>()
      .default({}),

    // Metadata
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("workspace_slug_idx").on(table.slug),
    clerkOrgIdx: index("workspace_clerk_org_idx").on(table.clerkOrganizationId),
  }),
);

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Clerk user ID for auth integration
    clerkUserId: text("clerk_user_id").notNull().unique(),

    // Profile
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    avatarUrl: text("avatar_url"),

    // Preferences
    preferences: jsonb("preferences")
      .$type<{
        theme?: "light" | "dark" | "auto";
        notifications?: { email?: boolean; push?: boolean };
        language?: string;
      }>()
      .default({}),

    // Metadata
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    clerkUserIdx: uniqueIndex("user_clerk_user_idx").on(table.clerkUserId),
    emailIdx: index("user_email_idx").on(table.email),
  }),
);

// ============================================================================
// WORKSPACE MEMBERS (User <-> Workspace with RBAC)
// ============================================================================

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // RBAC
    role: userRoleEnum("role").notNull().default("member"),

    // Permissions (fine-grained control)
    permissions: jsonb("permissions")
      .$type<{
        agents?: {
          create?: boolean;
          edit?: boolean;
          delete?: boolean;
          execute?: boolean;
        };
        packs?: { install?: boolean; uninstall?: boolean };
        billing?: { view?: boolean; manage?: boolean };
        members?: { invite?: boolean; remove?: boolean; changeRole?: boolean };
      }>()
      .default({}),

    // Metadata
    invitedBy: uuid("invited_by").references(() => users.id),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    workspaceUserIdx: uniqueIndex("workspace_member_unique_idx").on(
      table.workspaceId,
      table.userId,
    ),
    tenantIdx: index("workspace_member_tenant_idx").on(table.workspaceId),
  }),
);

// ============================================================================
// AGENTS
// ============================================================================

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key - REQUIRED FOR ALL QUERIES
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    name: text("name").notNull(),
    description: text("description"),
    type: agentTypeEnum("type").notNull(),
    status: agentStatusEnum("status").notNull().default("draft"),

    // Configuration
    config: jsonb("config")
      .$type<{
        aiProvider?: "openai" | "anthropic" | "google" | "custom";
        model?: string;
        temperature?: number;
        maxTokens?: number;
        systemPrompt?: string;
        tools?: string[];
        triggers?: { type: string; config: any }[];
        knowledgeBase?: {
          enabled: boolean;
          scope?: "all" | "collections";
          collectionIds?: string[];
          maxResults?: number;
        };
      }>()
      .notNull()
      .default({}),

    // Source (marketplace pack or custom)
    sourcePackId: uuid("source_pack_id"),
    isCustom: boolean("is_custom").notNull().default(true),

    // Ownership & permissions
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    isPublic: boolean("is_public").notNull().default(false),

    // Metadata
    version: text("version").notNull().default("1.0.0"),
    executionCount: integer("execution_count").notNull().default(0),
    lastExecutedAt: timestamp("last_executed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("agent_tenant_idx").on(table.workspaceId),
    statusIdx: index("agent_status_idx").on(table.status),
    typeIdx: index("agent_type_idx").on(table.type),
    createdByIdx: index("agent_created_by_idx").on(table.createdBy),
  }),
);

// ============================================================================
// AGENT TEMPLATES (Individual Marketplace Templates)
// ============================================================================

export const agentTemplates = pgTable(
  "agent_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Template info
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    shortDescription: text("short_description").notNull(), // For cards
    category: text("category").notNull(),
    type: agentTypeEnum("type").notNull(),

    // Visual
    iconUrl: text("icon_url"),
    coverImageUrl: text("cover_image_url"),
    badgeText: text("badge_text"), // 'Trending', 'New', 'Popular', etc

    // Configuration template
    config: jsonb("config")
      .$type<{
        aiProvider?: "openai" | "anthropic" | "custom";
        model?: string;
        temperature?: number;
        maxTokens?: number;
        systemPrompt?: string;
        tools?: string[];
        inputs?: { name: string; type: string; required?: boolean }[];
        outputs?: { name: string; type: string }[];
        triggers?: { type: string; config: any }[];
        defaults?: Record<string, any>;
      }>()
      .notNull()
      .default({}),

    // KPIs and metrics
    kpis: jsonb("kpis")
      .$type<{
        successRate?: number; // 0-100
        avgTimeSaved?: string; // "2 hours/claim"
        accuracy?: number; // 0-100
        avgDuration?: string; // "45 seconds"
      }>()
      .default({}),

    // Marketplace metadata
    authorId: uuid("author_id").references(() => users.id),
    authorName: text("author_name").default("GalaxyCo Team"),
    tags: text("tags").array().default([]),

    // Stats
    installCount: integer("install_count").notNull().default(0),
    rating: integer("rating").default(0), // 0-500 (5.00 stars * 100)
    reviewCount: integer("review_count").notNull().default(0),

    // Trending metrics (for ranking)
    installs24h: integer("installs_24h").notNull().default(0),
    installs7d: integer("installs_7d").notNull().default(0),
    installs30d: integer("installs_30d").notNull().default(0),
    trendingScore: integer("trending_score").notNull().default(0),

    // Publishing
    isPublished: boolean("is_published").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("agent_template_slug_idx").on(table.slug),
    categoryIdx: index("agent_template_category_idx").on(table.category),
    publishedIdx: index("agent_template_published_idx").on(table.isPublished),
    featuredIdx: index("agent_template_featured_idx").on(table.isFeatured),
    trendingIdx: index("agent_template_trending_idx").on(table.trendingScore),
  }),
);

// ============================================================================
// AGENT PACKS (Marketplace Templates)
// ============================================================================

export const agentPacks = pgTable(
  "agent_packs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Pack info
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    category: text("category").notNull(),

    // Content
    agentTemplates: jsonb("agent_templates")
      .$type<
        Array<{
          name: string;
          type: string;
          config: any;
        }>
      >()
      .notNull()
      .default([]),

    // Marketplace metadata
    authorId: uuid("author_id").references(() => users.id),
    authorName: text("author_name"),
    iconUrl: text("icon_url"),
    coverImageUrl: text("cover_image_url"),
    tags: text("tags").array().default([]),

    // Pricing
    pricingType: text("pricing_type").notNull().default("free"), // 'free' | 'one-time' | 'subscription'
    price: integer("price").default(0), // in cents

    // Stats
    installCount: integer("install_count").notNull().default(0),
    rating: integer("rating").default(0), // 0-500 (5.00 stars * 100)
    reviewCount: integer("review_count").notNull().default(0),

    // Publishing
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("agent_pack_slug_idx").on(table.slug),
    categoryIdx: index("agent_pack_category_idx").on(table.category),
    publishedIdx: index("agent_pack_published_idx").on(table.isPublished),
  }),
);

// ============================================================================
// WORKSPACE API KEYS (Encrypted Storage)
// ============================================================================

export const workspaceApiKeys = pgTable(
  "workspace_api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Provider info
    provider: text("provider").notNull(), // 'openai', 'anthropic', etc
    name: text("name").notNull(), // User-friendly name

    // Encrypted key (AES-256-GCM)
    encryptedKey: text("encrypted_key").notNull(),
    iv: text("iv").notNull(), // Initialization vector
    authTag: text("auth_tag").notNull(), // Authentication tag

    // Metadata
    isActive: boolean("is_active").notNull().default(true),
    lastUsedAt: timestamp("last_used_at"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantProviderIdx: uniqueIndex("api_key_tenant_provider_idx").on(
      table.workspaceId,
      table.provider,
    ),
  }),
);

// ============================================================================
// AGENT LOGS (Performance & Monitoring)
// ============================================================================

export const agentLogs = pgTable(
  "agent_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key - REQUIRED FOR ALL QUERIES
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Agent execution context
    agentId: text("agent_id").notNull(), // Can reference templates too
    tenantId: text("tenant_id").notNull(), // Redundant with workspaceId but required for logging compatibility
    userId: text("user_id").notNull(),

    // Execution data (summarized for performance)
    inputSummary: text("input_summary").notNull(),
    outputSummary: text("output_summary").notNull(),
    duration: integer("duration").notNull(), // milliseconds
    success: boolean("success").notNull(),

    // AI Provider context
    provider: text("provider"), // 'openai', 'anthropic', 'google'
    model: text("model"), // 'gpt-4', 'claude-3-sonnet', etc

    // Error information
    error: text("error"), // Error message if failed
    metadata: text("metadata"), // Additional context as JSON string

    // Timestamp
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    // Performance indexes
    tenantTimestampIdx: index("agent_log_tenant_timestamp_idx").on(
      table.workspaceId,
      table.timestamp,
    ),
    agentTimestampIdx: index("agent_log_agent_timestamp_idx").on(
      table.agentId,
      table.timestamp,
    ),
    successIdx: index("agent_log_success_idx").on(table.success),
    providerIdx: index("agent_log_provider_idx").on(table.provider),
  }),
);

// ============================================================================
// AGENT EXECUTIONS (Audit Trail)
// ============================================================================

export const agentExecutions = pgTable(
  "agent_executions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key - REQUIRED FOR ALL QUERIES
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Execution context
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    triggeredBy: uuid("triggered_by")
      .notNull()
      .references(() => users.id),

    // Execution data
    status: executionStatusEnum("status").notNull().default("pending"),
    input: jsonb("input").$type<Record<string, any>>(),
    output: jsonb("output").$type<Record<string, any>>(),
    error: jsonb("error").$type<{
      message: string;
      code?: string;
      stack?: string;
    }>(),

    // Performance metrics
    durationMs: integer("duration_ms"),
    tokensUsed: integer("tokens_used"),
    cost: integer("cost"), // in cents

    // Timestamps
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("execution_tenant_idx").on(table.workspaceId),
    agentIdx: index("execution_agent_idx").on(table.agentId),
    statusIdx: index("execution_status_idx").on(table.status),
    triggeredByIdx: index("execution_triggered_by_idx").on(table.triggeredBy),
    createdAtIdx: index("execution_created_at_idx").on(table.createdAt),
  }),
);

// ============================================================================
// AGENT SCHEDULES (Trigger Configuration)
// ============================================================================

export const agentSchedules = pgTable(
  "agent_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),

    // Schedule configuration
    triggerType: text("trigger_type").notNull(), // 'manual' | 'scheduled' | 'webhook'
    cron: text("cron"), // Cron expression for scheduled type
    timezone: text("timezone").default("America/Chicago"),
    webhookUrl: text("webhook_url"), // For webhook type
    webhookSecret: text("webhook_secret"), // Secret for webhook authentication

    // State
    enabled: boolean("enabled").notNull().default(true),
    nextRunAt: timestamp("next_run_at"),
    lastRunAt: timestamp("last_run_at"),
    lastRunStatus: text("last_run_status"), // 'success' | 'failed'

    // Metadata
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("schedule_tenant_idx").on(table.workspaceId),
    agentIdx: uniqueIndex("schedule_agent_idx").on(table.agentId),
    nextRunIdx: index("schedule_next_run_idx").on(table.nextRunAt),
  }),
);

// ============================================================================
// KNOWLEDGE BASE (Wisebase-like Document Management)
// ============================================================================

export const knowledgeCollections = pgTable(
  "knowledge_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Collection info
    name: text("name").notNull(),
    description: text("description"),
    color: text("color"), // For UI organization
    icon: text("icon"), // Emoji or icon name

    // Metadata
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    itemCount: integer("item_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("knowledge_collection_tenant_idx").on(table.workspaceId),
  }),
);

export const knowledgeTags = pgTable(
  "knowledge_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Tag info
    name: text("name").notNull(),
    color: text("color"),

    // Metadata
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantNameIdx: uniqueIndex("knowledge_tag_tenant_name_idx").on(
      table.workspaceId,
      table.name,
    ),
  }),
);

export const knowledgeItems = pgTable(
  "knowledge_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key - REQUIRED FOR ALL QUERIES
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Item info
    title: text("title").notNull(),
    type: knowledgeItemTypeEnum("type").notNull(),
    status: knowledgeItemStatusEnum("status").notNull().default("processing"),

    // Source
    sourceUrl: text("source_url"), // For URLs and uploaded files
    fileName: text("file_name"), // Original filename for uploads
    fileSize: integer("file_size"), // In bytes
    mimeType: text("mime_type"),

    // Processed content
    content: text("content"), // Extracted/parsed text content
    summary: text("summary"), // AI-generated summary
    metadata: jsonb("metadata")
      .$type<{
        author?: string;
        publishDate?: string;
        wordCount?: number;
        language?: string;
        extractedAt?: string;
        ocrConfidence?: number; // For images
        dimensions?: { width: number; height: number }; // For images
      }>()
      .default({}),

    // Embeddings for RAG
    embeddings: jsonb("embeddings").$type<number[]>(), // Vector embeddings
    embeddingsModel: text("embeddings_model"), // 'text-embedding-3-small', etc

    // Organization
    collectionId: uuid("collection_id").references(
      () => knowledgeCollections.id,
      { onDelete: "set null" },
    ),
    tags: text("tags").array().default([]),

    // User actions
    isFavorite: boolean("is_favorite").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),

    // Processing info
    processingError: text("processing_error"),
    processedAt: timestamp("processed_at"),

    // Metadata
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("knowledge_item_tenant_idx").on(table.workspaceId),
    statusIdx: index("knowledge_item_status_idx").on(table.status),
    collectionIdx: index("knowledge_item_collection_idx").on(
      table.collectionId,
    ),
    typeIdx: index("knowledge_item_type_idx").on(table.type),
    createdByIdx: index("knowledge_item_created_by_idx").on(table.createdBy),
    favoriteIdx: index("knowledge_item_favorite_idx").on(table.isFavorite),
    createdAtIdx: index("knowledge_item_created_at_idx").on(table.createdAt),
  }),
);

// Knowledge item tags (many-to-many)
export const knowledgeItemTags = pgTable(
  "knowledge_item_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => knowledgeItems.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => knowledgeTags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    itemTagIdx: uniqueIndex("knowledge_item_tag_idx").on(
      table.itemId,
      table.tagId,
    ),
  }),
);

// ============================================================================
// RELATIONS
// ============================================================================

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  agents: many(agents),
  executions: many(agentExecutions),
  schedules: many(agentSchedules),
  agentLogs: many(agentLogs),
  knowledgeCollections: many(knowledgeCollections),
  knowledgeItems: many(knowledgeItems),
  knowledgeTags: many(knowledgeTags),
  aiConversations: many(aiConversations),
  aiUserPreferences: many(aiUserPreferences),
}));

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMembers: many(workspaceMembers),
  workspaceMemberships: many(workspaceMembers),
  createdAgents: many(agents),
  triggeredExecutions: many(agentExecutions),
  createdKnowledgeCollections: many(knowledgeCollections),
  createdKnowledgeItems: many(knowledgeItems),
  aiConversations: many(aiConversations),
  aiPreferences: many(aiUserPreferences),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  }),
);

export const agentsRelations = relations(agents, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [agents.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [agents.createdBy],
    references: [users.id],
  }),
  executions: many(agentExecutions),
  schedule: one(agentSchedules),
}));

export const agentExecutionsRelations = relations(
  agentExecutions,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [agentExecutions.workspaceId],
      references: [workspaces.id],
    }),
    agent: one(agents, {
      fields: [agentExecutions.agentId],
      references: [agents.id],
    }),
    triggeredByUser: one(users, {
      fields: [agentExecutions.triggeredBy],
      references: [users.id],
    }),
  }),
);

export const agentSchedulesRelations = relations(agentSchedules, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [agentSchedules.workspaceId],
    references: [workspaces.id],
  }),
  agent: one(agents, {
    fields: [agentSchedules.agentId],
    references: [agents.id],
  }),
}));

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [agentLogs.workspaceId],
    references: [workspaces.id],
  }),
}));

export const knowledgeCollectionsRelations = relations(
  knowledgeCollections,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [knowledgeCollections.workspaceId],
      references: [workspaces.id],
    }),
    creator: one(users, {
      fields: [knowledgeCollections.createdBy],
      references: [users.id],
    }),
    items: many(knowledgeItems),
  }),
);

export const knowledgeTagsRelations = relations(
  knowledgeTags,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [knowledgeTags.workspaceId],
      references: [workspaces.id],
    }),
    itemTags: many(knowledgeItemTags),
  }),
);

export const knowledgeItemsRelations = relations(
  knowledgeItems,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [knowledgeItems.workspaceId],
      references: [workspaces.id],
    }),
    creator: one(users, {
      fields: [knowledgeItems.createdBy],
      references: [users.id],
    }),
    collection: one(knowledgeCollections, {
      fields: [knowledgeItems.collectionId],
      references: [knowledgeCollections.id],
    }),
    itemTags: many(knowledgeItemTags),
  }),
);

export const knowledgeItemTagsRelations = relations(
  knowledgeItemTags,
  ({ one }) => ({
    item: one(knowledgeItems, {
      fields: [knowledgeItemTags.itemId],
      references: [knowledgeItems.id],
    }),
    tag: one(knowledgeTags, {
      fields: [knowledgeItemTags.tagId],
      references: [knowledgeTags.id],
    }),
  }),
);

// ============================================================================
// AI ASSISTANT - CONVERSATIONS
// ============================================================================

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Conversation info
    title: text("title").notNull(), // Auto-generated from first message

    // Context - what was the user doing when they started this conversation?
    context: jsonb("context")
      .$type<{
        page?: string; // '/agents', '/prospects/123', etc
        selectedItems?: {
          agentId?: string;
          prospectId?: string;
          workflowId?: string;
        };
        documentIds?: string[]; // Related documents
        timestamp?: string;
      }>()
      .default({}),

    // Organization
    tags: text("tags").array().default([]),
    isPinned: boolean("is_pinned").notNull().default(false),

    // Metadata
    messageCount: integer("message_count").notNull().default(0),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantUserIdx: index("ai_conversation_tenant_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
    userIdx: index("ai_conversation_user_idx").on(table.userId),
    lastMessageIdx: index("ai_conversation_last_message_idx").on(
      table.lastMessageAt,
    ),
  }),
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Conversation reference
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),

    // Message content
    role: text("role").notNull(), // 'user' | 'assistant' | 'system'
    content: text("content").notNull(),

    // Metadata - for RAG, function calls, etc
    metadata: jsonb("metadata")
      .$type<{
        sources?: Array<{
          type: "document" | "knowledge_item" | "agent" | "prospect";
          id: string;
          title: string;
          relevanceScore?: number;
        }>;
        model?: string; // 'gpt-4', 'claude-3-5-sonnet', etc
        tokensUsed?: number;
        durationMs?: number;
        functionCalls?: Array<{
          name: string;
          args: any;
          result: any;
        }>;
      }>()
      .default({}),

    // Metadata
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    conversationIdx: index("ai_message_conversation_idx").on(
      table.conversationId,
    ),
    createdAtIdx: index("ai_message_created_at_idx").on(table.createdAt),
  }),
);

// ============================================================================
// AI ASSISTANT - USER PREFERENCES
// ============================================================================

export const aiUserPreferences = pgTable(
  "ai_user_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Learned preferences
    communicationStyle: text("communication_style").default("balanced"), // 'concise' | 'detailed' | 'balanced'
    topicsOfInterest: text("topics_of_interest").array().default([]),
    frequentQuestions: text("frequent_questions").array().default([]),

    // Corrections - learn from user feedback
    corrections: jsonb("corrections")
      .$type<
        Array<{
          wrong: string;
          correct: string;
          timestamp: string;
        }>
      >()
      .default([]),

    // Settings
    defaultModel: text("default_model").default("gpt-4"), // 'gpt-4', 'claude-3-5-sonnet', etc
    enableRag: boolean("enable_rag").notNull().default(true),
    enableProactiveInsights: boolean("enable_proactive_insights")
      .notNull()
      .default(true),

    // Metadata
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantUserIdx: uniqueIndex("ai_user_preferences_tenant_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
  }),
);

// ============================================================================
// RELATIONS FOR AI CONVERSATIONS
// ============================================================================

export const aiConversationsRelations = relations(
  aiConversations,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [aiConversations.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [aiConversations.userId],
      references: [users.id],
    }),
    messages: many(aiMessages),
  }),
);

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

export const aiUserPreferencesRelations = relations(
  aiUserPreferences,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [aiUserPreferences.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [aiUserPreferences.userId],
      references: [users.id],
    }),
  }),
);

// ============================================================================
// CRM - CUSTOMERS
// ============================================================================

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    website: text("website"),

    // Address
    address: jsonb("address")
      .$type<{
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
      }>()
      .default({}),

    // Business details
    status: customerStatusEnum("status").notNull().default("lead"),
    industry: text("industry"),
    size: text("size"), // 'small', 'medium', 'large', 'enterprise'
    revenue: integer("revenue"), // Annual revenue in cents

    // Relationships
    assignedTo: uuid("assigned_to").references(() => users.id),

    // Metadata
    tags: text("tags").array().default([]),
    customFields: jsonb("custom_fields")
      .$type<Record<string, any>>()
      .default({}),
    notes: text("notes"),

    // Timestamps
    lastContactedAt: timestamp("last_contacted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("customer_tenant_idx").on(table.workspaceId),
    statusIdx: index("customer_status_idx").on(table.status),
    assignedToIdx: index("customer_assigned_to_idx").on(table.assignedTo),
    emailIdx: index("customer_email_idx").on(table.email),
  }),
);

// ============================================================================
// CRM - PROJECTS
// ============================================================================

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    name: text("name").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("planning"),

    // Relationships
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    managerId: uuid("manager_id").references(() => users.id),

    // Project details
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    budget: integer("budget"), // In cents
    actualCost: integer("actual_cost"), // In cents

    // Progress
    progress: integer("progress").default(0), // 0-100
    completedTasks: integer("completed_tasks").default(0),
    totalTasks: integer("total_tasks").default(0),

    // Metadata
    tags: text("tags").array().default([]),
    customFields: jsonb("custom_fields")
      .$type<Record<string, any>>()
      .default({}),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("project_tenant_idx").on(table.workspaceId),
    statusIdx: index("project_status_idx").on(table.status),
    customerIdx: index("project_customer_idx").on(table.customerId),
    managerIdx: index("project_manager_idx").on(table.managerId),
  }),
);

// ============================================================================
// CRM - PROSPECTS
// ============================================================================

export const prospects = pgTable(
  "prospects",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    title: text("title"),
    linkedinUrl: text("linkedin_url"),

    // Pipeline
    stage: prospectStageEnum("stage").notNull().default("new"),
    score: integer("score").default(0), // Lead scoring 0-100
    estimatedValue: integer("estimated_value"), // In cents

    // Relationships
    assignedTo: uuid("assigned_to").references(() => users.id),
    source: text("source"), // 'website', 'referral', 'campaign', etc

    // Engagement
    lastContactedAt: timestamp("last_contacted_at"),
    nextFollowUpAt: timestamp("next_follow_up_at"),
    interactionCount: integer("interaction_count").default(0),

    // Metadata
    tags: text("tags").array().default([]),
    notes: text("notes"),
    customFields: jsonb("custom_fields")
      .$type<Record<string, any>>()
      .default({}),

    // Conversion
    convertedToCustomer: boolean("converted_to_customer").default(false),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("prospect_tenant_idx").on(table.workspaceId),
    stageIdx: index("prospect_stage_idx").on(table.stage),
    assignedToIdx: index("prospect_assigned_to_idx").on(table.assignedTo),
    emailIdx: index("prospect_email_idx").on(table.email),
  }),
);

// ============================================================================
// CRM - CONTACTS
// ============================================================================

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").notNull(),
    phone: text("phone"),
    title: text("title"),
    company: text("company"),

    // Social
    linkedinUrl: text("linkedin_url"),
    twitterUrl: text("twitter_url"),

    // Relationships
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    assignedTo: uuid("assigned_to").references(() => users.id),

    // Metadata
    tags: text("tags").array().default([]),
    notes: text("notes"),
    customFields: jsonb("custom_fields")
      .$type<Record<string, any>>()
      .default({}),

    // Engagement
    lastContactedAt: timestamp("last_contacted_at"),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("contact_tenant_idx").on(table.workspaceId),
    emailIdx: index("contact_email_idx").on(table.email),
    customerIdx: index("contact_customer_idx").on(table.customerId),
    assignedToIdx: index("contact_assigned_to_idx").on(table.assignedTo),
  }),
);

// ============================================================================
// CRM - TASKS
// ============================================================================

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),

    // Relationships
    assignedTo: uuid("assigned_to").references(() => users.id),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),

    // Scheduling
    dueDate: timestamp("due_date"),
    startDate: timestamp("start_date"),
    completedAt: timestamp("completed_at"),

    // Metadata
    tags: text("tags").array().default([]),
    attachments: jsonb("attachments")
      .$type<Array<{ name: string; url: string; size: number }>>()
      .default([]),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("task_tenant_idx").on(table.workspaceId),
    statusIdx: index("task_status_idx").on(table.status),
    priorityIdx: index("task_priority_idx").on(table.priority),
    assignedToIdx: index("task_assigned_to_idx").on(table.assignedTo),
    projectIdx: index("task_project_idx").on(table.projectId),
    dueDateIdx: index("task_due_date_idx").on(table.dueDate),
  }),
);

// ============================================================================
// CRM - CALENDAR EVENTS
// ============================================================================

export const calendarEvents = pgTable(
  "calendar_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Event info
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    meetingUrl: text("meeting_url"),

    // Timing
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    timezone: text("timezone").default("America/Chicago"),
    isAllDay: boolean("is_all_day").default(false),

    // Recurrence
    isRecurring: boolean("is_recurring").default(false),
    recurrenceRule: text("recurrence_rule"), // RRULE format

    // Relationships
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    attendees: jsonb("attendees")
      .$type<
        Array<{ userId?: string; email: string; name: string; status: string }>
      >()
      .default([]),

    // Links
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),

    // Metadata
    tags: text("tags").array().default([]),
    reminders: jsonb("reminders")
      .$type<Array<{ minutes: number; sent: boolean }>>()
      .default([]),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("calendar_event_tenant_idx").on(table.workspaceId),
    startTimeIdx: index("calendar_event_start_time_idx").on(table.startTime),
    createdByIdx: index("calendar_event_created_by_idx").on(table.createdBy),
  }),
);

// ============================================================================
// BUSINESS - INVOICES
// ============================================================================

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Basic info
    invoiceNumber: text("invoice_number").notNull(),
    status: invoiceStatusEnum("status").notNull().default("draft"),

    // Relationships
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),

    // Financial details
    subtotal: integer("subtotal").notNull(), // In cents
    tax: integer("tax").default(0), // In cents
    total: integer("total").notNull(), // In cents
    amountPaid: integer("amount_paid").default(0), // In cents
    currency: text("currency").notNull().default("USD"),

    // Line items
    items: jsonb("items")
      .$type<
        Array<{
          description: string;
          quantity: number;
          unitPrice: number;
          total: number;
        }>
      >()
      .notNull()
      .default([]),

    // Dates
    issueDate: timestamp("issue_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    paidAt: timestamp("paid_at"),

    // Metadata
    notes: text("notes"),
    terms: text("terms"),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("invoice_tenant_idx").on(table.workspaceId),
    statusIdx: index("invoice_status_idx").on(table.status),
    customerIdx: index("invoice_customer_idx").on(table.customerId),
    invoiceNumberIdx: uniqueIndex("invoice_number_idx").on(
      table.workspaceId,
      table.invoiceNumber,
    ),
  }),
);

// ============================================================================
// BUSINESS - CAMPAIGNS
// ============================================================================

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Campaign info
    name: text("name").notNull(),
    description: text("description"),
    status: campaignStatusEnum("status").notNull().default("draft"),
    type: text("type").notNull(), // 'email', 'social', 'ads', 'content'

    // Targeting
    segmentId: uuid("segment_id").references(() => segments.id, {
      onDelete: "set null",
    }),
    targetAudience: jsonb("target_audience")
      .$type<{
        count?: number;
        criteria?: Record<string, any>;
      }>()
      .default({}),

    // Schedule
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    scheduledFor: timestamp("scheduled_for"),

    // Content
    content: jsonb("content")
      .$type<{
        subject?: string;
        body?: string;
        images?: string[];
        links?: Array<{ url: string; label: string }>;
      }>()
      .default({}),

    // Performance
    sentCount: integer("sent_count").default(0),
    openCount: integer("open_count").default(0),
    clickCount: integer("click_count").default(0),
    conversionCount: integer("conversion_count").default(0),

    // Budget
    budget: integer("budget"), // In cents
    spent: integer("spent").default(0), // In cents

    // Relationships
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    // Metadata
    tags: text("tags").array().default([]),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("campaign_tenant_idx").on(table.workspaceId),
    statusIdx: index("campaign_status_idx").on(table.status),
    typeIdx: index("campaign_type_idx").on(table.type),
  }),
);

// ============================================================================
// BUSINESS - SEGMENTS
// ============================================================================

export const segments = pgTable(
  "segments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Segment info
    name: text("name").notNull(),
    description: text("description"),

    // Criteria (filter rules)
    criteria: jsonb("criteria")
      .$type<{
        rules: Array<{
          field: string;
          operator: string;
          value: any;
        }>;
        logic?: "and" | "or";
      }>()
      .notNull()
      .default({ rules: [] }),

    // Stats
    memberCount: integer("member_count").default(0),
    lastCalculatedAt: timestamp("last_calculated_at"),

    // Metadata
    isActive: boolean("is_active").default(true),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("segment_tenant_idx").on(table.workspaceId),
    activeIdx: index("segment_active_idx").on(table.isActive),
  }),
);

// ============================================================================
// BUSINESS - EXPORTS
// ============================================================================

export const exports = pgTable(
  "exports",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Export info
    name: text("name").notNull(),
    resourceType: text("resource_type").notNull(), // 'customers', 'contacts', etc
    format: text("format").notNull().default("csv"), // 'csv', 'json', 'xlsx'
    status: jobStatusEnum("status").notNull().default("pending"),

    // Configuration
    filters: jsonb("filters").$type<Record<string, any>>().default({}),
    columns: text("columns").array(), // Specific columns to export

    // Results
    fileUrl: text("file_url"),
    fileSize: integer("file_size"), // In bytes
    recordCount: integer("record_count"),

    // Error handling
    error: text("error"),

    // Relationships
    requestedBy: uuid("requested_by")
      .notNull()
      .references(() => users.id),

    // Timestamps
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    expiresAt: timestamp("expires_at"), // Auto-delete after expiry
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("export_tenant_idx").on(table.workspaceId),
    statusIdx: index("export_status_idx").on(table.status),
    requestedByIdx: index("export_requested_by_idx").on(table.requestedBy),
  }),
);

// ============================================================================
// BUSINESS - IMPORTS
// ============================================================================

export const imports = pgTable(
  "imports",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Import info
    name: text("name").notNull(),
    resourceType: text("resource_type").notNull(), // 'customers', 'contacts', etc
    status: jobStatusEnum("status").notNull().default("pending"),

    // File info
    fileName: text("file_name").notNull(),
    fileSize: integer("file_size"), // In bytes
    fileUrl: text("file_url"),

    // Mapping
    columnMapping: jsonb("column_mapping")
      .$type<Record<string, string>>()
      .default({}),

    // Results
    totalRows: integer("total_rows"),
    successfulRows: integer("successful_rows").default(0),
    failedRows: integer("failed_rows").default(0),
    errors: jsonb("errors")
      .$type<Array<{ row: number; error: string }>>()
      .default([]),

    // Error handling
    error: text("error"),

    // Relationships
    requestedBy: uuid("requested_by")
      .notNull()
      .references(() => users.id),

    // Timestamps
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("import_tenant_idx").on(table.workspaceId),
    statusIdx: index("import_status_idx").on(table.status),
    requestedByIdx: index("import_requested_by_idx").on(table.requestedBy),
  }),
);

// ============================================================================
// COMMUNICATION - INBOX MESSAGES
// ============================================================================

export const inboxMessages = pgTable(
  "inbox_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Message info
    channel: inboxChannelEnum("channel").notNull(),
    subject: text("subject"),
    body: text("body").notNull(),
    status: inboxStatusEnum("status").notNull().default("unread"),

    // Sender/Receiver
    senderId: uuid("sender_id").references(() => users.id),
    senderEmail: text("sender_email"),
    senderName: text("sender_name"),
    recipientIds: jsonb("recipient_ids").$type<string[]>().default([]),

    // Thread
    threadId: text("thread_id"), // For grouping related messages
    replyToId: text("reply_to_id"), // Self-reference to parent message

    // Metadata
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    attachments: jsonb("attachments")
      .$type<Array<{ name: string; url: string; size: number }>>()
      .default([]),

    // Timestamps
    readAt: timestamp("read_at"),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("inbox_message_tenant_idx").on(table.workspaceId),
    statusIdx: index("inbox_message_status_idx").on(table.status),
    threadIdx: index("inbox_message_thread_idx").on(table.threadId),
  }),
);

// ============================================================================
// COMMUNICATION - EMAIL THREADS
// ============================================================================

export const emailThreads = pgTable(
  "email_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Thread info
    subject: text("subject").notNull(),
    snippet: text("snippet"), // First few lines
    messageCount: integer("message_count").default(0),

    // Participants
    participants: jsonb("participants")
      .$type<Array<{ email: string; name?: string }>>()
      .default([]),

    // Status
    isStarred: boolean("is_starred").default(false),
    isRead: boolean("is_read").default(false),
    folder: text("folder").default("inbox"), // 'inbox', 'sent', 'drafts', 'trash'

    // Labels
    labels: text("labels").array().default([]),

    // Timestamps
    lastMessageAt: timestamp("last_message_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("email_thread_tenant_idx").on(table.workspaceId),
    folderIdx: index("email_thread_folder_idx").on(table.folder),
    lastMessageIdx: index("email_thread_last_message_idx").on(
      table.lastMessageAt,
    ),
  }),
);

// ============================================================================
// COMMUNICATION - CHAT MESSAGES
// ============================================================================

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Message info
    content: text("content").notNull(),
    type: text("type").default("text"), // 'text', 'image', 'file', 'system'

    // Sender/Receiver
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    recipientId: uuid("recipient_id").references(() => users.id),
    groupId: text("group_id"), // For group chats

    // Thread
    replyToId: text("reply_to_id"), // Self-reference to parent message

    // Metadata
    attachments: jsonb("attachments")
      .$type<Array<{ type: string; url: string; filename?: string }>>()
      .default([]),
    reactions: jsonb("reactions")
      .$type<Record<string, string[]>>() // emoji -> userIds[]
      .default({}),

    // Edit history
    isEdited: boolean("is_edited").default(false),
    editedAt: timestamp("edited_at"),

    // Status
    isDeleted: boolean("is_deleted").default(false),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("chat_message_tenant_idx").on(table.workspaceId),
    senderIdx: index("chat_message_sender_idx").on(table.senderId),
    recipientIdx: index("chat_message_recipient_idx").on(table.recipientId),
    groupIdx: index("chat_message_group_idx").on(table.groupId),
    createdAtIdx: index("chat_message_created_at_idx").on(table.createdAt),
  }),
);

// ============================================================================
// COMMUNICATION - NOTIFICATIONS
// ============================================================================

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Notification info
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),

    // Action
    actionUrl: text("action_url"),
    actionLabel: text("action_label"),

    // Metadata
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

    // Status
    isRead: boolean("is_read").default(false),
    isDismissed: boolean("is_dismissed").default(false),

    // Timestamps
    readAt: timestamp("read_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantUserIdx: index("notification_tenant_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
    userIdx: index("notification_user_idx").on(table.userId),
    typeIdx: index("notification_type_idx").on(table.type),
    isReadIdx: index("notification_is_read_idx").on(table.isRead),
  }),
);

// ============================================================================
// DEVELOPER - WEBHOOKS
// ============================================================================

export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Webhook info
    name: text("name").notNull(),
    url: text("url").notNull(),
    events: text("events").array().notNull(), // Array of event types
    secret: text("secret").notNull(), // HMAC secret (encrypted in DB)

    // Status
    isActive: boolean("is_active").default(true),

    // Stats
    lastTriggeredAt: timestamp("last_triggered_at"),
    successCount: integer("success_count").default(0),
    failureCount: integer("failure_count").default(0),

    // Metadata
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

    // Relationships
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("webhook_tenant_idx").on(table.workspaceId),
    activeIdx: index("webhook_active_idx").on(table.isActive),
  }),
);

// ============================================================================
// DEVELOPER - WEBHOOK DELIVERIES
// ============================================================================

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relationships
    webhookId: uuid("webhook_id")
      .notNull()
      .references(() => webhooks.id, { onDelete: "cascade" }),

    // Delivery info
    event: text("event").notNull(),
    payload: jsonb("payload").$type<Record<string, any>>().notNull(),

    // Response
    status: integer("status"), // HTTP status code
    responseBody: text("response_body"),
    responseTime: integer("response_time"), // Milliseconds

    // Retry
    attempt: integer("attempt").default(1),
    maxAttempts: integer("max_attempts").default(3),
    nextRetryAt: timestamp("next_retry_at"),

    // Error
    error: text("error"),

    // Timestamps
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    webhookIdx: index("webhook_delivery_webhook_idx").on(table.webhookId),
    eventIdx: index("webhook_delivery_event_idx").on(table.event),
    createdAtIdx: index("webhook_delivery_created_at_idx").on(table.createdAt),
  }),
);

// ============================================================================
// DEVELOPER - AUDIT LOGS
// ============================================================================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Multi-tenant key
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    // Actor
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    userEmail: text("user_email"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    // Action
    action: text("action").notNull(), // 'create', 'update', 'delete', etc
    resourceType: text("resource_type").notNull(), // 'customer', 'agent', etc
    resourceId: text("resource_id"),

    // Details
    changes: jsonb("changes")
      .$type<{
        before?: Record<string, any>;
        after?: Record<string, any>;
      }>()
      .default({}),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),

    // Timestamp
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("audit_log_tenant_idx").on(table.workspaceId),
    userIdx: index("audit_log_user_idx").on(table.userId),
    actionIdx: index("audit_log_action_idx").on(table.action),
    resourceIdx: index("audit_log_resource_idx").on(
      table.resourceType,
      table.resourceId,
    ),
    createdAtIdx: index("audit_log_created_at_idx").on(table.createdAt),
  }),
);

// ============================================================================
// SYSTEM SETTINGS (Admin Configuration)
// ============================================================================

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Settings (stored as JSONB for flexibility)
  settings: jsonb("settings")
    .$type<{
      maintenanceMode?: boolean;
      allowSignups?: boolean;
      maxWorkspacesPerUser?: number;
      featureFlags?: {
        aiAgents?: boolean;
        knowledgeBase?: boolean;
        customPacks?: boolean;
      };
      rateLimit?: {
        requestsPerMinute?: number;
        burstSize?: number;
      };
    }>()
    .notNull()
    .default({}),

  // Audit
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// TYPES
// ============================================================================

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type AgentTemplate = typeof agentTemplates.$inferSelect;
export type NewAgentTemplate = typeof agentTemplates.$inferInsert;

export type AgentPack = typeof agentPacks.$inferSelect;
export type NewAgentPack = typeof agentPacks.$inferInsert;

export type AgentExecution = typeof agentExecutions.$inferSelect;
export type NewAgentExecution = typeof agentExecutions.$inferInsert;

export type AgentSchedule = typeof agentSchedules.$inferSelect;
export type NewAgentSchedule = typeof agentSchedules.$inferInsert;

export type AgentLog = typeof agentLogs.$inferSelect;
export type NewAgentLog = typeof agentLogs.$inferInsert;

export type KnowledgeCollection = typeof knowledgeCollections.$inferSelect;
export type NewKnowledgeCollection = typeof knowledgeCollections.$inferInsert;

export type KnowledgeTag = typeof knowledgeTags.$inferSelect;
export type NewKnowledgeTag = typeof knowledgeTags.$inferInsert;

export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type NewKnowledgeItem = typeof knowledgeItems.$inferInsert;

export type KnowledgeItemTag = typeof knowledgeItemTags.$inferSelect;
export type NewKnowledgeItemTag = typeof knowledgeItemTags.$inferInsert;

export type AiConversation = typeof aiConversations.$inferSelect;
export type NewAiConversation = typeof aiConversations.$inferInsert;

export type AiMessage = typeof aiMessages.$inferSelect;
export type NewAiMessage = typeof aiMessages.$inferInsert;

export type AiUserPreferences = typeof aiUserPreferences.$inferSelect;
export type NewAiUserPreferences = typeof aiUserPreferences.$inferInsert;

// CRM Types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Prospect = typeof prospects.$inferSelect;
export type NewProspect = typeof prospects.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;

// Business Types
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Segment = typeof segments.$inferSelect;
export type NewSegment = typeof segments.$inferInsert;

export type Export = typeof exports.$inferSelect;
export type NewExport = typeof exports.$inferInsert;

export type Import = typeof imports.$inferSelect;
export type NewImport = typeof imports.$inferInsert;

// Communication Types
export type InboxMessage = typeof inboxMessages.$inferSelect;
export type NewInboxMessage = typeof inboxMessages.$inferInsert;

export type EmailThread = typeof emailThreads.$inferSelect;
export type NewEmailThread = typeof emailThreads.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// Developer Types
export type Webhook = typeof webhooks.$inferSelect;
export type NewWebhook = typeof webhooks.$inferInsert;

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// Admin Types
export type SystemSettings = typeof systemSettings.$inferSelect;
export type NewSystemSettings = typeof systemSettings.$inferInsert;
