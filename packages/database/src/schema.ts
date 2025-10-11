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
  knowledgeCollections: many(knowledgeCollections),
  knowledgeItems: many(knowledgeItems),
  knowledgeTags: many(knowledgeTags),
}));

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMembers: many(workspaceMembers),
  workspaceMemberships: many(workspaceMembers),
  createdAgents: many(agents),
  triggeredExecutions: many(agentExecutions),
  createdKnowledgeCollections: many(knowledgeCollections),
  createdKnowledgeItems: many(knowledgeItems),
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

export type KnowledgeCollection = typeof knowledgeCollections.$inferSelect;
export type NewKnowledgeCollection = typeof knowledgeCollections.$inferInsert;

export type KnowledgeTag = typeof knowledgeTags.$inferSelect;
export type NewKnowledgeTag = typeof knowledgeTags.$inferInsert;

export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type NewKnowledgeItem = typeof knowledgeItems.$inferInsert;

export type KnowledgeItemTag = typeof knowledgeItemTags.$inferSelect;
export type NewKnowledgeItemTag = typeof knowledgeItemTags.$inferInsert;
