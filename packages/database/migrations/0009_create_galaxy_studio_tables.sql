-- =============================================================================
-- GALAXY STUDIO - VISUAL WORKFLOW BUILDER
-- =============================================================================
-- Migration: 0009_create_galaxy_studio_tables
-- Description: Creates all tables for Galaxy Studio visual workflow builder
-- Date: 2025-10-31
-- =============================================================================

-- Create Galaxy Studio enums
CREATE TYPE "grid_status" AS ENUM ('draft', 'published', 'archived');

CREATE TYPE "grid_node_type" AS ENUM (
  'trigger',
  'action',
  'condition',
  'loop',
  'ai',
  'webhook',
  'delay',
  'transform',
  'filter',
  'aggregate',
  'branch',
  'merge',
  'api',
  'database',
  'email',
  'notification',
  'integration',
  'custom'
);

CREATE TYPE "grid_node_status" AS ENUM (
  'idle',
  'pending',
  'running',
  'success',
  'error',
  'skipped'
);

CREATE TYPE "grid_edge_type" AS ENUM (
  'default',
  'conditional',
  'loop',
  'error'
);

CREATE TYPE "grid_execution_status" AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled'
);

-- =============================================================================
-- TABLE: galaxy_grids
-- =============================================================================

CREATE TABLE "galaxy_grids" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant key - REQUIRED FOR ALL QUERIES
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  
  -- Basic info
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail_url" TEXT,
  
  -- Layout (stores React Flow viewport state)
  "viewport" JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "zoom": 1}',
  
  -- Status
  "status" "grid_status" NOT NULL DEFAULT 'draft',
  
  -- Template metadata (if this grid is used as a template)
  "is_template" BOOLEAN DEFAULT false,
  "template_category" TEXT,
  "tags" TEXT[] DEFAULT '{}',
  
  -- Ownership
  "created_by" UUID NOT NULL REFERENCES "users"("id"),
  "is_public" BOOLEAN NOT NULL DEFAULT false,
  
  -- Version control
  "version" INTEGER NOT NULL DEFAULT 1,
  "parent_grid_id" UUID REFERENCES "galaxy_grids"("id"),
  
  -- Publish metadata
  "published_at" TIMESTAMPTZ,
  
  -- Additional metadata
  "metadata" JSONB DEFAULT '{}',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "galaxy_grid_tenant_idx" ON "galaxy_grids"("workspace_id");
CREATE INDEX "galaxy_grid_status_idx" ON "galaxy_grids"("status");
CREATE INDEX "galaxy_grid_created_by_idx" ON "galaxy_grids"("created_by");
CREATE INDEX "galaxy_grid_template_idx" ON "galaxy_grids"("is_template", "template_category");
CREATE INDEX "galaxy_grid_published_idx" ON "galaxy_grids"("published_at");

-- =============================================================================
-- TABLE: grid_nodes
-- =============================================================================

CREATE TABLE "grid_nodes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parent grid reference
  "grid_id" UUID NOT NULL REFERENCES "galaxy_grids"("id") ON DELETE CASCADE,
  
  -- Node info
  "node_type" "grid_node_type" NOT NULL,
  "label" TEXT NOT NULL,
  
  -- Position on canvas (React Flow format)
  "position" JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
  
  -- Dimensions (optional, for custom sizing)
  "width" INTEGER,
  "height" INTEGER,
  
  -- Node configuration (type-specific settings)
  "config" JSONB NOT NULL DEFAULT '{}',
  
  -- Link to existing agent (optional)
  "agent_id" UUID REFERENCES "agents"("id"),
  
  -- Runtime status (for simulation/execution)
  "status" "grid_node_status" DEFAULT 'idle',
  
  -- Style overrides
  "style" JSONB DEFAULT '{}',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "grid_node_grid_idx" ON "grid_nodes"("grid_id");
CREATE INDEX "grid_node_type_idx" ON "grid_nodes"("node_type");
CREATE INDEX "grid_node_agent_idx" ON "grid_nodes"("agent_id");
CREATE INDEX "grid_node_status_idx" ON "grid_nodes"("status");

-- =============================================================================
-- TABLE: grid_edges
-- =============================================================================

CREATE TABLE "grid_edges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parent grid reference
  "grid_id" UUID NOT NULL REFERENCES "galaxy_grids"("id") ON DELETE CASCADE,
  
  -- Connection points
  "source_node_id" UUID NOT NULL REFERENCES "grid_nodes"("id") ON DELETE CASCADE,
  "target_node_id" UUID NOT NULL REFERENCES "grid_nodes"("id") ON DELETE CASCADE,
  
  -- Handle names (for multiple inputs/outputs)
  "source_handle" TEXT DEFAULT 'output',
  "target_handle" TEXT DEFAULT 'input',
  
  -- Edge type
  "edge_type" "grid_edge_type" NOT NULL DEFAULT 'default',
  
  -- Conditional edge configuration
  "condition" JSONB DEFAULT '{}',
  
  -- Display
  "label" TEXT,
  "animated" BOOLEAN DEFAULT false,
  
  -- Style overrides
  "style" JSONB DEFAULT '{}',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "grid_edge_grid_idx" ON "grid_edges"("grid_id");
CREATE INDEX "grid_edge_source_idx" ON "grid_edges"("source_node_id");
CREATE INDEX "grid_edge_target_idx" ON "grid_edges"("target_node_id");
CREATE INDEX "grid_edge_type_idx" ON "grid_edges"("edge_type");

-- =============================================================================
-- TABLE: grid_versions
-- =============================================================================

CREATE TABLE "grid_versions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parent grid reference
  "grid_id" UUID NOT NULL REFERENCES "galaxy_grids"("id") ON DELETE CASCADE,
  
  -- Version number
  "version" INTEGER NOT NULL,
  
  -- Complete snapshot of grid state at this version
  "snapshot" JSONB NOT NULL,
  
  -- Change description
  "changes_summary" TEXT,
  
  -- Author
  "created_by" UUID NOT NULL REFERENCES "users"("id"),
  
  -- Timestamp
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX "grid_version_grid_version_idx" ON "grid_versions"("grid_id", "version");
CREATE INDEX "grid_version_created_by_idx" ON "grid_versions"("created_by");
CREATE INDEX "grid_version_created_at_idx" ON "grid_versions"("created_at");

-- =============================================================================
-- TABLE: grid_executions
-- =============================================================================

CREATE TABLE "grid_executions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenant key - REQUIRED FOR ALL QUERIES
  "workspace_id" UUID NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  
  -- Parent grid reference
  "grid_id" UUID NOT NULL REFERENCES "galaxy_grids"("id") ON DELETE CASCADE,
  
  -- Execution status
  "status" "grid_execution_status" NOT NULL DEFAULT 'pending',
  
  -- Trigger info
  "trigger_type" TEXT NOT NULL, -- 'manual', 'scheduled', 'webhook', 'event'
  "trigger_data" JSONB DEFAULT '{}',
  
  -- Input/Output
  "input" JSONB DEFAULT '{}',
  "output" JSONB DEFAULT '{}',
  
  -- Performance metrics
  "started_at" TIMESTAMPTZ,
  "completed_at" TIMESTAMPTZ,
  "duration_ms" INTEGER,
  
  -- Error handling
  "error_message" TEXT,
  "error_stack" TEXT,
  
  -- Additional metadata
  "metadata" JSONB DEFAULT '{}',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "grid_execution_tenant_idx" ON "grid_executions"("workspace_id");
CREATE INDEX "grid_execution_grid_idx" ON "grid_executions"("grid_id");
CREATE INDEX "grid_execution_status_idx" ON "grid_executions"("status");
CREATE INDEX "grid_execution_started_at_idx" ON "grid_executions"("started_at");
CREATE INDEX "grid_execution_created_at_idx" ON "grid_executions"("created_at");

-- =============================================================================
-- TABLE: execution_steps
-- =============================================================================

CREATE TABLE "execution_steps" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parent execution reference
  "execution_id" UUID NOT NULL REFERENCES "grid_executions"("id") ON DELETE CASCADE,
  
  -- Node reference
  "node_id" UUID NOT NULL REFERENCES "grid_nodes"("id"),
  
  -- Execution order
  "step_index" INTEGER NOT NULL,
  
  -- Status
  "status" "grid_node_status" NOT NULL DEFAULT 'pending',
  
  -- Input/Output for this step
  "input_data" JSONB DEFAULT '{}',
  "output_data" JSONB DEFAULT '{}',
  
  -- Performance
  "started_at" TIMESTAMPTZ,
  "completed_at" TIMESTAMPTZ,
  "duration_ms" INTEGER,
  
  -- Error handling
  "error_message" TEXT,
  "error_stack" TEXT,
  
  -- Logs (array of log messages)
  "logs" TEXT[] DEFAULT '{}',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "execution_step_execution_step_idx" ON "execution_steps"("execution_id", "step_index");
CREATE INDEX "execution_step_node_idx" ON "execution_steps"("node_id");
CREATE INDEX "execution_step_status_idx" ON "execution_steps"("status");

-- =============================================================================
-- TABLE: grid_templates
-- =============================================================================

CREATE TABLE "grid_templates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template info
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "short_description" TEXT NOT NULL,
  
  -- Category & organization
  "category" TEXT NOT NULL,
  "tags" TEXT[] DEFAULT '{}',
  
  -- Visual
  "thumbnail_url" TEXT,
  "cover_image_url" TEXT,
  "badge_text" TEXT, -- 'New', 'Popular', 'Trending'
  
  -- Template snapshot (complete grid definition)
  "grid_snapshot" JSONB NOT NULL,
  
  -- Marketplace stats
  "use_count" INTEGER NOT NULL DEFAULT 0,
  "rating" INTEGER DEFAULT 0, -- 0-500 (5.00 * 100)
  "review_count" INTEGER DEFAULT 0,
  
  -- Publishing
  "is_featured" BOOLEAN DEFAULT false,
  "is_published" BOOLEAN DEFAULT true,
  
  -- Author
  "created_by" UUID REFERENCES "users"("id"),
  "author_name" TEXT DEFAULT 'GalaxyCo Team',
  
  -- Timestamps
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX "grid_template_category_idx" ON "grid_templates"("category");
CREATE INDEX "grid_template_featured_idx" ON "grid_templates"("is_featured");
CREATE INDEX "grid_template_published_idx" ON "grid_templates"("is_published");
CREATE INDEX "grid_template_use_count_idx" ON "grid_templates"("use_count");

-- =============================================================================
-- UPDATE TIMESTAMP TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_galaxy_grids_updated_at
  BEFORE UPDATE ON "galaxy_grids"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grid_nodes_updated_at
  BEFORE UPDATE ON "grid_nodes"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grid_templates_updated_at
  BEFORE UPDATE ON "grid_templates"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all Galaxy Studio tables
ALTER TABLE "galaxy_grids" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grid_nodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grid_edges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grid_versions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grid_executions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "execution_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grid_templates" ENABLE ROW LEVEL SECURITY;

-- RLS Policy for galaxy_grids (tenant isolation)
CREATE POLICY "galaxy_grids_tenant_isolation_policy" ON "galaxy_grids"
  USING ("workspace_id" = current_setting('app.current_workspace_id', TRUE)::UUID);

-- RLS Policy for grid_executions (tenant isolation)
CREATE POLICY "grid_executions_tenant_isolation_policy" ON "grid_executions"
  USING ("workspace_id" = current_setting('app.current_workspace_id', TRUE)::UUID);

-- Note: grid_nodes, grid_edges, grid_versions, execution_steps inherit RLS through their parent references
-- Note: grid_templates are global (marketplace) and don't need tenant isolation

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE "galaxy_grids" IS 'Visual workflow definitions for Galaxy Studio';
COMMENT ON TABLE "grid_nodes" IS 'Individual nodes in visual workflows';
COMMENT ON TABLE "grid_edges" IS 'Connections between nodes in workflows';
COMMENT ON TABLE "grid_versions" IS 'Version control snapshots of grids';
COMMENT ON TABLE "grid_executions" IS 'Runtime execution telemetry for workflows';
COMMENT ON TABLE "execution_steps" IS 'Individual node executions within a grid run';
COMMENT ON TABLE "grid_templates" IS 'Marketplace templates for Discover page';

COMMENT ON COLUMN "galaxy_grids"."workspace_id" IS 'Multi-tenant isolation key - REQUIRED for all queries';
COMMENT ON COLUMN "galaxy_grids"."viewport" IS 'React Flow viewport state (x, y, zoom)';
COMMENT ON COLUMN "grid_nodes"."config" IS 'Type-specific configuration (AI provider, webhook URL, etc.)';
COMMENT ON COLUMN "grid_edges"."condition" IS 'Conditional logic for conditional edges';
COMMENT ON COLUMN "grid_versions"."snapshot" IS 'Complete grid state including all nodes and edges';
COMMENT ON COLUMN "grid_executions"."trigger_type" IS 'How the execution was triggered: manual, scheduled, webhook, or event';
COMMENT ON COLUMN "execution_steps"."logs" IS 'Array of log messages generated during step execution';
COMMENT ON COLUMN "grid_templates"."grid_snapshot" IS 'Complete grid definition ready to be cloned';

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
