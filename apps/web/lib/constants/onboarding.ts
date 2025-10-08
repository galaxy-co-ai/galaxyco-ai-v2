/**
 * Onboarding Flow Constants
 * Based on: user_onboarding_flow_complete_spec_v_1.md
 */

export type Role = 'founder' | 'sales' | 'ops' | 'support' | 'finance' | 'product' | 'other';

export const ROLES: Array<{ value: Role; label: string; icon: string }> = [
  { value: 'founder', label: 'Founder', icon: '🚀' },
  { value: 'sales', label: 'Sales', icon: '📈' },
  { value: 'ops', label: 'Operations', icon: '⚙️' },
  { value: 'support', label: 'Support', icon: '💬' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'product', label: 'Product', icon: '🎯' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export const PAIN_POINTS = [
  { value: 'lead-followup', label: 'Lead follow-up', icon: '📧' },
  { value: 'reporting', label: 'Reporting', icon: '📊' },
  { value: 'customer-tickets', label: 'Customer tickets', icon: '🎫' },
  { value: 'knowledge-management', label: 'Knowledge management', icon: '📚' },
  { value: 'content-creation', label: 'Content creation', icon: '✍️' },
  { value: 'meeting-notes', label: 'Meeting notes', icon: '📝' },
  { value: 'docs-chaos', label: 'Document chaos', icon: '📄' },
  { value: 'other', label: 'Other', icon: '🔧' },
];

export const TOOLS = [
  { value: 'gmail', label: 'Gmail', icon: '📮' },
  { value: 'slack', label: 'Slack', icon: '💬' },
  { value: 'hubspot', label: 'HubSpot', icon: '🎯' },
  { value: 'salesforce', label: 'Salesforce', icon: '☁️' },
  { value: 'notion', label: 'Notion', icon: '📓' },
  { value: 'google-drive', label: 'Google Drive', icon: '📁' },
  { value: 'dropbox', label: 'Dropbox', icon: '📦' },
  { value: 'sheets', label: 'Google Sheets', icon: '📊' },
  { value: 'docs', label: 'Google Docs', icon: '📝' },
  { value: 'calendar', label: 'Calendar', icon: '📅' },
  { value: 'other', label: 'Other', icon: '🔗' },
];

export const COMMON_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Real Estate',
  'Marketing',
  'Legal',
  'Manufacturing',
  'Consulting',
  'Other',
];

export type StarterPackId = 
  | 'founder-ops' 
  | 'sales-ops' 
  | 'support-excellence' 
  | 'docs-knowledge' 
  | 'finance-ops';

export interface StarterPack {
  id: StarterPackId;
  name: string;
  description: string;
  icon: string;
  agents: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  widgets: string[];
}

export const STARTER_PACKS: Record<StarterPackId, StarterPack> = {
  'founder-ops': {
    id: 'founder-ops',
    name: 'Founder Ops',
    description: 'Essential agents for founders managing multiple priorities',
    icon: '🚀',
    agents: [
      {
        id: 'daily-digest',
        name: 'Daily Digest Agent',
        description: 'Summarizes emails, tasks, and priorities every morning',
      },
      {
        id: 'doc-analyzer',
        name: 'Document Analyzer',
        description: 'Extracts key insights from reports, contracts, and docs',
      },
      {
        id: 'meeting-prep',
        name: 'Meeting Prep Assistant',
        description: 'Prepares briefs and talking points for upcoming meetings',
      },
    ],
    widgets: ['today-panel', 'kpi-snapshot', 'agent-activity', 'quick-create'],
  },
  'sales-ops': {
    id: 'sales-ops',
    name: 'Sales Ops',
    description: 'Drive pipeline growth and automate follow-ups',
    icon: '📈',
    agents: [
      {
        id: 'lead-enrichment',
        name: 'Lead Enrichment Agent',
        description: 'Enriches lead data from emails and LinkedIn',
      },
      {
        id: 'followup-writer',
        name: 'Follow-up Writer',
        description: 'Drafts personalized follow-up emails based on context',
      },
      {
        id: 'pipeline-tracker',
        name: 'Pipeline Tracker',
        description: 'Monitors deals and alerts on stalled opportunities',
      },
    ],
    widgets: ['today-panel', 'kpi-snapshot', 'agent-activity', 'integrations-status'],
  },
  'support-excellence': {
    id: 'support-excellence',
    name: 'Support Excellence',
    description: 'Respond faster and resolve tickets efficiently',
    icon: '💬',
    agents: [
      {
        id: 'ticket-triage',
        name: 'Ticket Triage Agent',
        description: 'Categorizes and prioritizes incoming support tickets',
      },
      {
        id: 'response-drafter',
        name: 'Response Drafter',
        description: 'Generates helpful responses using your knowledge base',
      },
      {
        id: 'sentiment-monitor',
        name: 'Sentiment Monitor',
        description: 'Flags urgent or frustrated customer interactions',
      },
    ],
    widgets: ['today-panel', 'agent-activity', 'knowledge-coverage', 'quick-create'],
  },
  'docs-knowledge': {
    id: 'docs-knowledge',
    name: 'Docs & Knowledge',
    description: 'Organize chaos and make knowledge searchable',
    icon: '📚',
    agents: [
      {
        id: 'doc-ingestion',
        name: 'Document Ingestion Agent',
        description: 'Automatically indexes and tags uploaded documents',
      },
      {
        id: 'knowledge-qa',
        name: 'Knowledge Q&A Agent',
        description: 'Answers questions using your indexed knowledge base',
      },
      {
        id: 'content-summarizer',
        name: 'Content Summarizer',
        description: 'Creates summaries and highlights from long docs',
      },
    ],
    widgets: ['knowledge-coverage', 'agent-activity', 'quick-create', 'integrations-status'],
  },
  'finance-ops': {
    id: 'finance-ops',
    name: 'Finance Ops',
    description: 'Automate reporting and expense tracking',
    icon: '💰',
    agents: [
      {
        id: 'expense-categorizer',
        name: 'Expense Categorizer',
        description: 'Categorizes receipts and expenses automatically',
      },
      {
        id: 'report-generator',
        name: 'Report Generator',
        description: 'Creates financial reports from spreadsheets and data',
      },
      {
        id: 'invoice-tracker',
        name: 'Invoice Tracker',
        description: 'Monitors outstanding invoices and sends reminders',
      },
    ],
    widgets: ['kpi-snapshot', 'agent-activity', 'today-panel', 'quick-create'],
  },
};

/**
 * Derives the recommended starter pack based on onboarding answers
 */
export function deriveStarterPack(
  role: Role,
  painPoints: string[],
  tools: string[]
): StarterPackId {
  // Rule-based derivation per spec
  
  // Support role or customer ticket pain point
  if (role === 'support' || painPoints.includes('customer-tickets')) {
    return 'support-excellence';
  }
  
  // Sales role or lead follow-up pain point
  if (
    role === 'sales' || 
    painPoints.includes('lead-followup') ||
    tools.includes('hubspot') ||
    tools.includes('salesforce')
  ) {
    return 'sales-ops';
  }
  
  // Finance role
  if (role === 'finance' || painPoints.includes('reporting')) {
    return 'finance-ops';
  }
  
  // Knowledge management or docs chaos
  if (
    painPoints.includes('knowledge-management') ||
    painPoints.includes('docs-chaos') ||
    tools.includes('notion') ||
    tools.includes('google-drive')
  ) {
    return 'docs-knowledge';
  }
  
  // Default to Founder Ops for founders or fallback
  return 'founder-ops';
}

export interface OnboardingProfile {
  persona: {
    role: Role;
    industry: string;
  };
  painPoints: {
    freeText: string;
    tags: string[];
  };
  tools: {
    selected: string[];
  };
  sensitivity: {
    flag: boolean;
  };
  starterPack: {
    recommendedId: StarterPackId;
  };
  timestamp: string;
}
