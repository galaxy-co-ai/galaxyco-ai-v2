ALTER TYPE "public"."agent_type" ADD VALUE 'browser';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'cross-app';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'knowledge';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'sales';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'trending';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'research';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'meeting';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'code';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'data';--> statement-breakpoint
ALTER TYPE "public"."agent_type" ADD VALUE 'security';--> statement-breakpoint
CREATE TABLE "agent_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"category" text NOT NULL,
	"type" "agent_type" NOT NULL,
	"icon_url" text,
	"cover_image_url" text,
	"badge_text" text,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"kpis" jsonb DEFAULT '{}'::jsonb,
	"author_id" uuid,
	"author_name" text DEFAULT 'GalaxyCo Team',
	"tags" text[] DEFAULT '{}',
	"install_count" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0,
	"review_count" integer DEFAULT 0 NOT NULL,
	"installs_24h" integer DEFAULT 0 NOT NULL,
	"installs_7d" integer DEFAULT 0 NOT NULL,
	"installs_30d" integer DEFAULT 0 NOT NULL,
	"trending_score" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workspace_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"name" text NOT NULL,
	"encrypted_key" text NOT NULL,
	"iv" text NOT NULL,
	"auth_tag" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_used_at" timestamp,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_templates" ADD CONSTRAINT "agent_templates_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_api_keys" ADD CONSTRAINT "workspace_api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_api_keys" ADD CONSTRAINT "workspace_api_keys_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agent_template_slug_idx" ON "agent_templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "agent_template_category_idx" ON "agent_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "agent_template_published_idx" ON "agent_templates" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "agent_template_featured_idx" ON "agent_templates" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "agent_template_trending_idx" ON "agent_templates" USING btree ("trending_score");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_tenant_provider_idx" ON "workspace_api_keys" USING btree ("workspace_id","provider");