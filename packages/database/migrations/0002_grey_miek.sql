CREATE TYPE "public"."knowledge_item_status" AS ENUM('processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."knowledge_item_type" AS ENUM('document', 'url', 'image', 'text');--> statement-breakpoint
CREATE TABLE "knowledge_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"icon" text,
	"created_by" uuid NOT NULL,
	"item_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_item_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "knowledge_item_type" NOT NULL,
	"status" "knowledge_item_status" DEFAULT 'processing' NOT NULL,
	"source_url" text,
	"file_name" text,
	"file_size" integer,
	"mime_type" text,
	"content" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"embeddings" jsonb,
	"embeddings_model" text,
	"collection_id" uuid,
	"tags" text[] DEFAULT '{}',
	"is_favorite" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"processing_error" text,
	"processed_at" timestamp,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_collections" ADD CONSTRAINT "knowledge_collections_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_collections" ADD CONSTRAINT "knowledge_collections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_item_tags" ADD CONSTRAINT "knowledge_item_tags_item_id_knowledge_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."knowledge_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_item_tags" ADD CONSTRAINT "knowledge_item_tags_tag_id_knowledge_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."knowledge_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_items" ADD CONSTRAINT "knowledge_items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_items" ADD CONSTRAINT "knowledge_items_collection_id_knowledge_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."knowledge_collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_items" ADD CONSTRAINT "knowledge_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_tags" ADD CONSTRAINT "knowledge_tags_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "knowledge_collection_tenant_idx" ON "knowledge_collections" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_item_tag_idx" ON "knowledge_item_tags" USING btree ("item_id","tag_id");--> statement-breakpoint
CREATE INDEX "knowledge_item_tenant_idx" ON "knowledge_items" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "knowledge_item_status_idx" ON "knowledge_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_item_collection_idx" ON "knowledge_items" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "knowledge_item_type_idx" ON "knowledge_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "knowledge_item_created_by_idx" ON "knowledge_items" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "knowledge_item_favorite_idx" ON "knowledge_items" USING btree ("is_favorite");--> statement-breakpoint
CREATE INDEX "knowledge_item_created_at_idx" ON "knowledge_items" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_tag_tenant_name_idx" ON "knowledge_tags" USING btree ("workspace_id","name");