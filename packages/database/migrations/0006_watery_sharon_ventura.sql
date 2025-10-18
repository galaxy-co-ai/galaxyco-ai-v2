CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('lead', 'active', 'inactive', 'churned');--> statement-breakpoint
CREATE TYPE "public"."inbox_channel" AS ENUM('email', 'chat', 'notification', 'comment', 'mention');--> statement-breakpoint
CREATE TYPE "public"."inbox_status" AS ENUM('unread', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'success', 'warning', 'error', 'mention', 'assignment', 'reminder', 'system');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."prospect_stage" AS ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in_progress', 'done', 'cancelled');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid,
	"user_email" text,
	"ip_address" text,
	"user_agent" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"changes" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"meeting_url" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"timezone" text DEFAULT 'America/Chicago',
	"is_all_day" boolean DEFAULT false,
	"is_recurring" boolean DEFAULT false,
	"recurrence_rule" text,
	"created_by" uuid NOT NULL,
	"attendees" jsonb DEFAULT '[]'::jsonb,
	"customer_id" uuid,
	"project_id" uuid,
	"tags" text[] DEFAULT '{}',
	"reminders" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"type" text NOT NULL,
	"segment_id" uuid,
	"target_audience" jsonb DEFAULT '{}'::jsonb,
	"start_date" timestamp,
	"end_date" timestamp,
	"scheduled_for" timestamp,
	"content" jsonb DEFAULT '{}'::jsonb,
	"sent_count" integer DEFAULT 0,
	"open_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"budget" integer,
	"spent" integer DEFAULT 0,
	"created_by" uuid NOT NULL,
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'text',
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid,
	"group_id" text,
	"reply_to_id" text,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"reactions" jsonb DEFAULT '{}'::jsonb,
	"is_edited" boolean DEFAULT false,
	"edited_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"phone" text,
	"title" text,
	"company" text,
	"linkedin_url" text,
	"twitter_url" text,
	"customer_id" uuid,
	"assigned_to" uuid,
	"tags" text[] DEFAULT '{}',
	"notes" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"last_contacted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"website" text,
	"address" jsonb DEFAULT '{}'::jsonb,
	"status" "customer_status" DEFAULT 'lead' NOT NULL,
	"industry" text,
	"size" text,
	"revenue" integer,
	"assigned_to" uuid,
	"tags" text[] DEFAULT '{}',
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"notes" text,
	"last_contacted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"snippet" text,
	"message_count" integer DEFAULT 0,
	"participants" jsonb DEFAULT '[]'::jsonb,
	"is_starred" boolean DEFAULT false,
	"is_read" boolean DEFAULT false,
	"folder" text DEFAULT 'inbox',
	"labels" text[] DEFAULT '{}',
	"last_message_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"resource_type" text NOT NULL,
	"format" text DEFAULT 'csv' NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"filters" jsonb DEFAULT '{}'::jsonb,
	"columns" text[],
	"file_url" text,
	"file_size" integer,
	"record_count" integer,
	"error" text,
	"requested_by" uuid NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"resource_type" text NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer,
	"file_url" text,
	"column_mapping" jsonb DEFAULT '{}'::jsonb,
	"total_rows" integer,
	"successful_rows" integer DEFAULT 0,
	"failed_rows" integer DEFAULT 0,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"error" text,
	"requested_by" uuid NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbox_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"channel" "inbox_channel" NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"status" "inbox_status" DEFAULT 'unread' NOT NULL,
	"sender_id" uuid,
	"sender_email" text,
	"sender_name" text,
	"recipient_ids" jsonb DEFAULT '[]'::jsonb,
	"thread_id" text,
	"reply_to_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"read_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"invoice_number" text NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"customer_id" uuid NOT NULL,
	"project_id" uuid,
	"subtotal" integer NOT NULL,
	"tax" integer DEFAULT 0,
	"total" integer NOT NULL,
	"amount_paid" integer DEFAULT 0,
	"currency" text DEFAULT 'USD' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"issue_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"paid_at" timestamp,
	"notes" text,
	"terms" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"action_url" text,
	"action_label" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_read" boolean DEFAULT false,
	"is_dismissed" boolean DEFAULT false,
	"read_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'planning' NOT NULL,
	"customer_id" uuid,
	"manager_id" uuid,
	"start_date" timestamp,
	"end_date" timestamp,
	"budget" integer,
	"actual_cost" integer,
	"progress" integer DEFAULT 0,
	"completed_tasks" integer DEFAULT 0,
	"total_tasks" integer DEFAULT 0,
	"tags" text[] DEFAULT '{}',
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"title" text,
	"linkedin_url" text,
	"stage" "prospect_stage" DEFAULT 'new' NOT NULL,
	"score" integer DEFAULT 0,
	"estimated_value" integer,
	"assigned_to" uuid,
	"source" text,
	"last_contacted_at" timestamp,
	"next_follow_up_at" timestamp,
	"interaction_count" integer DEFAULT 0,
	"tags" text[] DEFAULT '{}',
	"notes" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"converted_to_customer" boolean DEFAULT false,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"criteria" jsonb DEFAULT '{"rules":[]}'::jsonb NOT NULL,
	"member_count" integer DEFAULT 0,
	"last_calculated_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"assigned_to" uuid,
	"created_by" uuid NOT NULL,
	"project_id" uuid,
	"customer_id" uuid,
	"due_date" timestamp,
	"start_date" timestamp,
	"completed_at" timestamp,
	"tags" text[] DEFAULT '{}',
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webhook_id" uuid NOT NULL,
	"event" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" integer,
	"response_body" text,
	"response_time" integer,
	"attempt" integer DEFAULT 1,
	"max_attempts" integer DEFAULT 3,
	"next_retry_at" timestamp,
	"error" text,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"events" text[] NOT NULL,
	"secret" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_triggered_at" timestamp,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_segment_id_segments_id_fk" FOREIGN KEY ("segment_id") REFERENCES "public"."segments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_threads" ADD CONSTRAINT "email_threads_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "imports_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "imports_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox_messages" ADD CONSTRAINT "inbox_messages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox_messages" ADD CONSTRAINT "inbox_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhook_id_webhooks_id_fk" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_tenant_idx" ON "audit_logs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "calendar_event_tenant_idx" ON "calendar_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "calendar_event_start_time_idx" ON "calendar_events" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "calendar_event_created_by_idx" ON "calendar_events" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "campaign_tenant_idx" ON "campaigns" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "campaign_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaign_type_idx" ON "campaigns" USING btree ("type");--> statement-breakpoint
CREATE INDEX "chat_message_tenant_idx" ON "chat_messages" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "chat_message_sender_idx" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "chat_message_recipient_idx" ON "chat_messages" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "chat_message_group_idx" ON "chat_messages" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "chat_message_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_tenant_idx" ON "contacts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_customer_idx" ON "contacts" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "contact_assigned_to_idx" ON "contacts" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "customer_tenant_idx" ON "customers" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "customer_status_idx" ON "customers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customer_assigned_to_idx" ON "customers" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "customer_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_thread_tenant_idx" ON "email_threads" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "email_thread_folder_idx" ON "email_threads" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "email_thread_last_message_idx" ON "email_threads" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "export_tenant_idx" ON "exports" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "export_status_idx" ON "exports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "export_requested_by_idx" ON "exports" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "import_tenant_idx" ON "imports" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "import_status_idx" ON "imports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "import_requested_by_idx" ON "imports" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "inbox_message_tenant_idx" ON "inbox_messages" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "inbox_message_status_idx" ON "inbox_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inbox_message_thread_idx" ON "inbox_messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "invoice_tenant_idx" ON "invoices" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_customer_idx" ON "invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_number_idx" ON "invoices" USING btree ("workspace_id","invoice_number");--> statement-breakpoint
CREATE INDEX "notification_tenant_user_idx" ON "notifications" USING btree ("workspace_id","user_id");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "project_tenant_idx" ON "projects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "project_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_customer_idx" ON "projects" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "project_manager_idx" ON "projects" USING btree ("manager_id");--> statement-breakpoint
CREATE INDEX "prospect_tenant_idx" ON "prospects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "prospect_stage_idx" ON "prospects" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "prospect_assigned_to_idx" ON "prospects" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "prospect_email_idx" ON "prospects" USING btree ("email");--> statement-breakpoint
CREATE INDEX "segment_tenant_idx" ON "segments" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "segment_active_idx" ON "segments" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "task_tenant_idx" ON "tasks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "task_priority_idx" ON "tasks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "task_assigned_to_idx" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "task_project_idx" ON "tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "task_due_date_idx" ON "tasks" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "webhook_delivery_webhook_idx" ON "webhook_deliveries" USING btree ("webhook_id");--> statement-breakpoint
CREATE INDEX "webhook_delivery_event_idx" ON "webhook_deliveries" USING btree ("event");--> statement-breakpoint
CREATE INDEX "webhook_delivery_created_at_idx" ON "webhook_deliveries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "webhook_tenant_idx" ON "webhooks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "webhook_active_idx" ON "webhooks" USING btree ("is_active");