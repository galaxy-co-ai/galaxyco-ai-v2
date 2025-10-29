-- Migration: Create ai_message_feedback table
-- Date: 2025-10-29
-- Purpose: Store user feedback (thumbs up/down) on AI assistant messages
-- Rollback: DROP TABLE ai_message_feedback;

CREATE TABLE IF NOT EXISTS ai_message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES ai_messages(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative')),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Ensure one feedback per user per message
  CONSTRAINT ai_message_feedback_message_user_unique UNIQUE (message_id, user_id)
);

-- Indexes for performance
CREATE INDEX ai_message_feedback_message_idx ON ai_message_feedback(message_id);
CREATE INDEX ai_message_feedback_workspace_idx ON ai_message_feedback(workspace_id);
CREATE INDEX ai_message_feedback_user_idx ON ai_message_feedback(user_id);
CREATE INDEX ai_message_feedback_type_idx ON ai_message_feedback(feedback_type);
CREATE INDEX ai_message_feedback_created_at_idx ON ai_message_feedback(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE ai_message_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see feedback for their own workspace
CREATE POLICY ai_message_feedback_tenant_isolation ON ai_message_feedback
  FOR ALL
  USING (workspace_id = current_setting('app.current_workspace_id')::UUID);

-- Policy: Users can only insert/update their own feedback
CREATE POLICY ai_message_feedback_user_isolation ON ai_message_feedback
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

COMMENT ON TABLE ai_message_feedback IS 'Stores user feedback (positive/negative) on AI assistant messages for quality improvement and analytics';
COMMENT ON COLUMN ai_message_feedback.feedback_type IS 'Type of feedback: positive (thumbs up) or negative (thumbs down)';
COMMENT ON COLUMN ai_message_feedback.comment IS 'Optional text comment explaining the feedback';
