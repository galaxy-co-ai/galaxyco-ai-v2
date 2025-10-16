CREATE TABLE "agent_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"trigger_type" text NOT NULL,
	"cron" text,
	"timezone" text DEFAULT 'America/Chicago',
	"webhook_url" text,
	"webhook_secret" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"next_run_at" timestamp,
	"last_run_at" timestamp,
	"last_run_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_schedules" ADD CONSTRAINT "agent_schedules_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_schedules" ADD CONSTRAINT "agent_schedules_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedule_tenant_idx" ON "agent_schedules" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_agent_idx" ON "agent_schedules" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "schedule_next_run_idx" ON "agent_schedules" USING btree ("next_run_at");