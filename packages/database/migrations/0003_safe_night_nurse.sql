CREATE TABLE "agent_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"agent_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"user_id" text NOT NULL,
	"input_summary" text NOT NULL,
	"output_summary" text NOT NULL,
	"duration" integer NOT NULL,
	"success" boolean NOT NULL,
	"provider" text,
	"model" text,
	"error" text,
	"metadata" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_logs" ADD CONSTRAINT "agent_logs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_log_tenant_timestamp_idx" ON "agent_logs" USING btree ("workspace_id","timestamp");--> statement-breakpoint
CREATE INDEX "agent_log_agent_timestamp_idx" ON "agent_logs" USING btree ("agent_id","timestamp");--> statement-breakpoint
CREATE INDEX "agent_log_success_idx" ON "agent_logs" USING btree ("success");--> statement-breakpoint
CREATE INDEX "agent_log_provider_idx" ON "agent_logs" USING btree ("provider");