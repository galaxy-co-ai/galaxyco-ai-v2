-- ============================================================================
-- Galaxy Studio Template Seeds
-- ============================================================================
-- This file seeds the grid_templates table with starter workflow templates
-- for the Discover marketplace.
--
-- Templates include:
-- 1. Customer Support Bot
-- 2. Lead Scoring System
-- 3. Email Campaign Automation
-- 4. Data Enrichment Pipeline
-- 5. Content Generation Workflow
-- 6. Meeting Summary Generator
-- 7. Slack Alert System
-- 8. Invoice Processing Automation
-- 9. Social Media Scheduler
-- 10. Customer Onboarding Sequence
-- 11. Bug Triage Automation
-- 12. Sales Follow-up Flow
-- ============================================================================

-- Note: Replace 'YOUR_USER_ID' with an actual user ID from your system
-- In production, this should be a system/admin user ID

-- 1. Customer Support Bot
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_customer_support_bot',
  'AI Customer Support Bot',
  'Automatically respond to customer inquiries using AI, escalate complex issues to human agents, and log all interactions for analysis.',
  'customer-support',
  ARRAY['ai', 'customer-service', 'automation', 'chatbot'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "New Support Ticket", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "ai", "label": "Analyze Inquiry", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "condition", "label": "Can AI Handle?", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "ai", "label": "Generate Response", "position": {"x": 700, "y": 50}},
      {"id": "n5", "type": "notification", "label": "Escalate to Human", "position": {"x": 700, "y": 150}},
      {"id": "n6", "type": "database", "label": "Log Interaction", "position": {"x": 900, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "conditional", "label": "Yes"},
      {"id": "e4", "source": "n3", "target": "n5", "type": "conditional", "label": "No"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "default"},
      {"id": "e6", "source": "n5", "target": "n6", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.8}
  }'::jsonb,
  'beginner',
  15,
  0,
  4.8,
  true,
  'YOUR_USER_ID'
);

-- 2. Lead Scoring System
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_lead_scoring',
  'Lead Scoring System',
  'Automatically score and qualify leads based on engagement data, company size, and behavioral signals. Route hot leads to sales team immediately.',
  'sales',
  ARRAY['sales', 'lead-gen', 'scoring', 'automation'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "New Lead", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "api", "label": "Enrich Data", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "transform", "label": "Calculate Score", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Score > 70?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "notification", "label": "Alert Sales Team", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "database", "label": "Add to Nurture", "position": {"x": 900, "y": 150}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Hot"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "Warm"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.8}
  }'::jsonb,
  'intermediate',
  20,
  0,
  4.6,
  true,
  'YOUR_USER_ID'
);

-- 3. Email Campaign Automation
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_email_campaign',
  'Email Campaign Automation',
  'Send personalized email campaigns, track opens and clicks, and automatically follow up based on engagement. Includes A/B testing support.',
  'marketing',
  ARRAY['email', 'marketing', 'campaigns', 'automation'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Schedule Trigger", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "database", "label": "Load Recipients", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "loop", "label": "For Each Contact", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "ai", "label": "Personalize Email", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "email", "label": "Send Email", "position": {"x": 900, "y": 100}},
      {"id": "n6", "type": "delay", "label": "Wait 3 Days", "position": {"x": 1100, "y": 100}},
      {"id": "n7", "type": "condition", "label": "Opened?", "position": {"x": 1300, "y": 100}},
      {"id": "n8", "type": "notification", "label": "Send Follow-up", "position": {"x": 1500, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "loop"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "default"},
      {"id": "e5", "source": "n5", "target": "n6", "type": "default"},
      {"id": "e6", "source": "n6", "target": "n7", "type": "default"},
      {"id": "e7", "source": "n7", "target": "n8", "type": "conditional", "label": "No"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.6}
  }'::jsonb,
  'advanced',
  30,
  0,
  4.9,
  true,
  'YOUR_USER_ID'
);

-- 4. Data Enrichment Pipeline
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_data_enrichment',
  'Data Enrichment Pipeline',
  'Automatically enrich contact data with company information, social profiles, and firmographics from multiple data sources.',
  'data-processing',
  ARRAY['data', 'enrichment', 'api', 'integration'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "New Contact", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "api", "label": "Clearbit Lookup", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "api", "label": "LinkedIn Lookup", "position": {"x": 300, "y": 200}},
      {"id": "n4", "type": "merge", "label": "Merge Data", "position": {"x": 500, "y": 150}},
      {"id": "n5", "type": "transform", "label": "Clean & Format", "position": {"x": 700, "y": 150}},
      {"id": "n6", "type": "database", "label": "Update Record", "position": {"x": 900, "y": 150}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n1", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n2", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e5", "source": "n4", "target": "n5", "type": "default"},
      {"id": "e6", "source": "n5", "target": "n6", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.8}
  }'::jsonb,
  'intermediate',
  25,
  0,
  4.7,
  false,
  'YOUR_USER_ID'
);

-- 5. Content Generation Workflow
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_content_generation',
  'AI Content Generator',
  'Generate blog posts, social media content, and marketing copy using AI. Includes SEO optimization and plagiarism checking.',
  'marketing',
  ARRAY['ai', 'content', 'writing', 'seo'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Content Request", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "ai", "label": "Generate Outline", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "ai", "label": "Write Content", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "ai", "label": "SEO Optimize", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "api", "label": "Check Plagiarism", "position": {"x": 900, "y": 100}},
      {"id": "n6", "type": "notification", "label": "Send for Review", "position": {"x": 1100, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "default"},
      {"id": "e5", "source": "n5", "target": "n6", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'beginner',
  15,
  0,
  4.5,
  false,
  'YOUR_USER_ID'
);

-- 6. Meeting Summary Generator
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_meeting_summary',
  'Meeting Summary Generator',
  'Automatically transcribe meetings, generate summaries with action items, and distribute to attendees. Integrates with Zoom, Google Meet, and Teams.',
  'automation',
  ARRAY['meetings', 'ai', 'transcription', 'productivity'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Meeting Ended", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "api", "label": "Get Recording", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "ai", "label": "Transcribe Audio", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "ai", "label": "Generate Summary", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "ai", "label": "Extract Action Items", "position": {"x": 900, "y": 100}},
      {"id": "n6", "type": "email", "label": "Send to Attendees", "position": {"x": 1100, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "default"},
      {"id": "e5", "source": "n5", "target": "n6", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'intermediate',
  20,
  0,
  4.8,
  true,
  'YOUR_USER_ID'
);

-- 7. Slack Alert System
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_slack_alerts',
  'Intelligent Slack Alert System',
  'Monitor critical metrics and send smart alerts to Slack channels. Includes anomaly detection and intelligent routing.',
  'automation',
  ARRAY['slack', 'alerts', 'monitoring', 'notifications'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Schedule Check", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "database", "label": "Query Metrics", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "ai", "label": "Detect Anomalies", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Issue Found?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "notification", "label": "Send to Slack", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "database", "label": "Log Normal", "position": {"x": 900, "y": 150}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Yes"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "No"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.8}
  }'::jsonb,
  'beginner',
  10,
  0,
  4.6,
  false,
  'YOUR_USER_ID'
);

-- 8. Invoice Processing Automation
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_invoice_processing',
  'Invoice Processing Automation',
  'Extract data from invoice PDFs using OCR, validate amounts, route for approvals, and sync with accounting software.',
  'automation',
  ARRAY['invoices', 'ocr', 'accounting', 'approval'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Invoice Received", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "ai", "label": "Extract Data (OCR)", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "transform", "label": "Validate Data", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Amount > $1000?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "notification", "label": "Request Approval", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "api", "label": "Sync to QuickBooks", "position": {"x": 900, "y": 150}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Yes"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "No"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.8}
  }'::jsonb,
  'advanced',
  35,
  0,
  4.7,
  false,
  'YOUR_USER_ID'
);

-- 9. Social Media Scheduler
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_social_scheduler',
  'Social Media Scheduler',
  'Schedule and post content across Twitter, LinkedIn, and Facebook. Includes AI-powered caption generation and optimal timing.',
  'marketing',
  ARRAY['social-media', 'scheduling', 'ai', 'content'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Schedule Time", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "database", "label": "Get Content Queue", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "ai", "label": "Generate Captions", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "api", "label": "Post to Twitter", "position": {"x": 700, "y": 50}},
      {"id": "n5", "type": "api", "label": "Post to LinkedIn", "position": {"x": 700, "y": 100}},
      {"id": "n6", "type": "api", "label": "Post to Facebook", "position": {"x": 700, "y": 150}},
      {"id": "n7", "type": "database", "label": "Track Analytics", "position": {"x": 900, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n3", "target": "n5", "type": "default"},
      {"id": "e5", "source": "n3", "target": "n6", "type": "default"},
      {"id": "e6", "source": "n4", "target": "n7", "type": "default"},
      {"id": "e7", "source": "n5", "target": "n7", "type": "default"},
      {"id": "e8", "source": "n6", "target": "n7", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'intermediate',
  20,
  0,
  4.4,
  false,
  'YOUR_USER_ID'
);

-- 10. Customer Onboarding Sequence
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_customer_onboarding',
  'Customer Onboarding Sequence',
  'Automated multi-step onboarding flow with welcome emails, tutorial scheduling, and progress tracking. Personalizes based on user role.',
  'customer-support',
  ARRAY['onboarding', 'email', 'automation', 'customer-success'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "New Signup", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "email", "label": "Send Welcome Email", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "delay", "label": "Wait 1 Day", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Completed Profile?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "email", "label": "Tutorial Email", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "notification", "label": "Reminder Email", "position": {"x": 900, "y": 150}},
      {"id": "n7", "type": "database", "label": "Update Progress", "position": {"x": 1100, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Yes"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "No"},
      {"id": "e6", "source": "n5", "target": "n7", "type": "default"},
      {"id": "e7", "source": "n6", "target": "n7", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'beginner',
  15,
  0,
  4.9,
  true,
  'YOUR_USER_ID'
);

-- 11. Bug Triage Automation
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_bug_triage',
  'Bug Triage Automation',
  'Automatically categorize, prioritize, and assign bug reports using AI. Detects duplicates and suggests similar issues.',
  'automation',
  ARRAY['bugs', 'ai', 'development', 'triage'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "New Bug Report", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "ai", "label": "Categorize Issue", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "ai", "label": "Detect Duplicates", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Is Duplicate?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "database", "label": "Mark as Duplicate", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "ai", "label": "Assign Priority", "position": {"x": 900, "y": 150}},
      {"id": "n7", "type": "notification", "label": "Notify Team", "position": {"x": 1100, "y": 150}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Yes"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "No"},
      {"id": "e6", "source": "n6", "target": "n7", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'intermediate',
  20,
  0,
  4.5,
  false,
  'YOUR_USER_ID'
);

-- 12. Sales Follow-up Flow
INSERT INTO grid_templates (
  id,
  name,
  description,
  category,
  tags,
  thumbnail_url,
  preview_data,
  complexity,
  estimated_time,
  uses,
  rating,
  featured,
  author_id
) VALUES (
  'tpl_sales_followup',
  'Sales Follow-up Flow',
  'Automated follow-up sequence after demos or sales calls. Tracks engagement and adjusts cadence based on prospect behavior.',
  'sales',
  ARRAY['sales', 'follow-up', 'email', 'automation'],
  NULL,
  '{
    "nodes": [
      {"id": "n1", "type": "trigger", "label": "Demo Completed", "position": {"x": 100, "y": 100}},
      {"id": "n2", "type": "email", "label": "Thank You Email", "position": {"x": 300, "y": 100}},
      {"id": "n3", "type": "delay", "label": "Wait 2 Days", "position": {"x": 500, "y": 100}},
      {"id": "n4", "type": "condition", "label": "Opened Email?", "position": {"x": 700, "y": 100}},
      {"id": "n5", "type": "email", "label": "Share Case Study", "position": {"x": 900, "y": 50}},
      {"id": "n6", "type": "notification", "label": "Alert Sales Rep", "position": {"x": 900, "y": 150}},
      {"id": "n7", "type": "database", "label": "Update CRM", "position": {"x": 1100, "y": 100}}
    ],
    "edges": [
      {"id": "e1", "source": "n1", "target": "n2", "type": "default"},
      {"id": "e2", "source": "n2", "target": "n3", "type": "default"},
      {"id": "e3", "source": "n3", "target": "n4", "type": "default"},
      {"id": "e4", "source": "n4", "target": "n5", "type": "conditional", "label": "Yes"},
      {"id": "e5", "source": "n4", "target": "n6", "type": "conditional", "label": "No"},
      {"id": "e6", "source": "n5", "target": "n7", "type": "default"},
      {"id": "e7", "source": "n6", "target": "n7", "type": "default"}
    ],
    "viewport": {"x": 0, "y": 0, "zoom": 0.7}
  }'::jsonb,
  'beginner',
  12,
  0,
  4.7,
  false,
  'YOUR_USER_ID'
);

-- Note: Remember to replace 'YOUR_USER_ID' with an actual user ID before running this migration
