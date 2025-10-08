-- Migration: 0000_quick_serpent_society
-- Created: 2025-10-08
-- Description: Initial GalaxyCo.ai 2.0 database schema with multi-tenant support
--
-- ROLLBACK INSTRUCTIONS:
-- To rollback this migration, run the following in order:
-- 1. DROP TABLE IF EXISTS agent_executions CASCADE;
-- 2. DROP TABLE IF EXISTS agents CASCADE;
-- 3. DROP TABLE IF EXISTS workspace_members CASCADE;
-- 4. DROP TABLE IF EXISTS agent_packs CASCADE;
-- 5. DROP TABLE IF EXISTS workspaces CASCADE;
-- 6. DROP TABLE IF EXISTS users CASCADE;
-- 7. DROP TYPE IF EXISTS execution_status CASCADE;
-- 8. DROP TYPE IF EXISTS agent_status CASCADE;
-- 9. DROP TYPE IF EXISTS agent_type CASCADE;
-- 10. DROP TYPE IF EXISTS subscription_tier CASCADE;
-- 11. DROP TYPE IF EXISTS user_role CASCADE;
--
-- SECURITY NOTE (Rule 4kR94Z3XhqK4C54vwDDwnq):
-- All tenant-scoped tables include workspace_id column with indexes for performance.
-- Row-level security (RLS) should be enabled in production.

CREATE TYPE "public"."agent_status" AS ENUM('draft', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."agent_type" AS ENUM('scope', 'call', 'email', 'note', 'task', 'roadmap', 'content', 'custom');--> statement-breakpoint
CREATE TYPE "public"."execution_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'starter', 'professional', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'member', 'viewer');--> statement-breakpoint
CREATE TABLE "agent_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"triggered_by" uuid NOT NULL,
	"status" "execution_status" DEFAULT 'pending' NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"error" jsonb,
	"duration_ms" integer,
	"tokens_used" integer,
	"cost" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"agent_templates" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_id" uuid,
	"author_name" text,
	"icon_url" text,
	"cover_image_url" text,
	"tags" text[] DEFAULT '{}',
	"pricing_type" text DEFAULT 'free' NOT NULL,
	"price" integer DEFAULT 0,
	"install_count" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0,
	"review_count" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_packs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "agent_type" NOT NULL,
	"status" "agent_status" DEFAULT 'draft' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_pack_id" uuid,
	"is_custom" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"version" text DEFAULT '1.0.0' NOT NULL,
	"execution_count" integer DEFAULT 0 NOT NULL,
	"last_executed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"invited_by" uuid,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"clerk_organization_id" text,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"subscription_status" text DEFAULT 'active' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug"),
	CONSTRAINT "workspaces_clerk_organization_id_unique" UNIQUE("clerk_organization_id")
);
--> statement-breakpoint
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_executions" ADD CONSTRAINT "agent_executions_triggered_by_users_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_packs" ADD CONSTRAINT "agent_packs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_tenant_idx" ON "agent_executions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "execution_agent_idx" ON "agent_executions" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "execution_status_idx" ON "agent_executions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "execution_triggered_by_idx" ON "agent_executions" USING btree ("triggered_by");--> statement-breakpoint
CREATE INDEX "execution_created_at_idx" ON "agent_executions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "agent_pack_slug_idx" ON "agent_packs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "agent_pack_category_idx" ON "agent_packs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "agent_pack_published_idx" ON "agent_packs" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "agent_tenant_idx" ON "agents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "agent_status_idx" ON "agents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "agent_type_idx" ON "agents" USING btree ("type");--> statement-breakpoint
CREATE INDEX "agent_created_by_idx" ON "agents" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "user_clerk_user_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_member_unique_idx" ON "workspace_members" USING btree ("workspace_id","user_id");--> statement-breakpoint
CREATE INDEX "workspace_member_tenant_idx" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_slug_idx" ON "workspaces" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "workspace_clerk_org_idx" ON "workspaces" USING btree ("clerk_organization_id");