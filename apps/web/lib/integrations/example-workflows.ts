/**
 * Example Integration Workflows
 * Ready-to-use workflow examples demonstrating integration capabilities
 */

import type { IntegrationType, IntegrationAction } from './integration-config';

export interface WorkflowExample {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'support' | 'productivity';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  integrations: IntegrationType[];
  steps: Array<{
    id: string;
    type: 'trigger' | 'integration' | 'condition' | 'ai';
    integration?: IntegrationType;
    action?: IntegrationAction;
    description: string;
    parameters?: Record<string, any>;
  }>;
}

export const WORKFLOW_EXAMPLES: WorkflowExample[] = [
  {
    id: 'lead-capture',
    name: 'Auto Lead Capture',
    description: 'Automatically capture leads from Gmail and add them to HubSpot',
    category: 'sales',
    difficulty: 'beginner',
    estimatedTime: '2 minutes',
    integrations: ['gmail', 'hubspot', 'slack'],
    steps: [
      {
        id: 'trigger',
        type: 'trigger',
        description: 'New email arrives in Gmail',
        integration: 'gmail',
        action: 'receive_email',
        parameters: {
          query: 'is:unread label:leads',
          maxResults: 1,
        },
      },
      {
        id: 'extract',
        type: 'ai',
        description: 'Extract contact information with AI',
      },
      {
        id: 'create-contact',
        type: 'integration',
        integration: 'hubspot',
        action: 'create_contact',
        description: 'Create contact in HubSpot',
        parameters: {
          email: '{{email}}',
          firstname: '{{firstname}}',
          lastname: '{{lastname}}',
          company: '{{company}}',
        },
      },
      {
        id: 'notify',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Notify sales team',
        parameters: {
          channel: '#sales',
          text: '🎯 New lead captured: {{firstname}} {{lastname}} from {{company}}',
        },
      },
    ],
  },
  {
    id: 'welcome-email',
    name: 'New Customer Welcome',
    description: 'Send personalized welcome emails to new HubSpot contacts',
    category: 'marketing',
    difficulty: 'beginner',
    estimatedTime: '3 minutes',
    integrations: ['hubspot', 'gmail'],
    steps: [
      {
        id: 'trigger',
        type: 'trigger',
        description: 'New contact created in HubSpot',
      },
      {
        id: 'generate',
        type: 'ai',
        description: 'Generate personalized welcome email with AI',
      },
      {
        id: 'send',
        type: 'integration',
        integration: 'gmail',
        action: 'send_email',
        description: 'Send welcome email',
        parameters: {
          to: '{{contact.email}}',
          subject: 'Welcome to {{company.name}}!',
          body: '{{ai_generated_email}}',
        },
      },
    ],
  },
  {
    id: 'urgent-email-alert',
    name: 'Urgent Email Alerts',
    description: 'Get Slack notifications for urgent emails',
    category: 'productivity',
    difficulty: 'beginner',
    estimatedTime: '1 minute',
    integrations: ['gmail', 'slack'],
    steps: [
      {
        id: 'trigger',
        type: 'trigger',
        description: 'Check for urgent emails',
        integration: 'gmail',
        action: 'receive_email',
        parameters: {
          query: 'is:unread (label:urgent OR subject:urgent)',
          maxResults: 5,
        },
      },
      {
        id: 'check',
        type: 'condition',
        description: 'If urgent emails found',
      },
      {
        id: 'notify',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Send Slack alert',
        parameters: {
          channel: '#alerts',
          text: '🚨 Urgent email from {{sender}}: {{subject}}',
        },
      },
    ],
  },
  {
    id: 'deal-won-celebration',
    name: 'Deal Won Celebration',
    description: 'Celebrate closed deals with team via Slack',
    category: 'sales',
    difficulty: 'intermediate',
    estimatedTime: '4 minutes',
    integrations: ['hubspot', 'slack', 'gmail'],
    steps: [
      {
        id: 'trigger',
        type: 'trigger',
        description: 'Deal status changes to "Closed Won" in HubSpot',
      },
      {
        id: 'celebrate',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Post celebration message',
        parameters: {
          channel: '#wins',
          text: '🎉 Deal closed! {{deal.name}} - ${{deal.amount}} - Way to go team!',
        },
      },
      {
        id: 'thank-you',
        type: 'integration',
        integration: 'gmail',
        action: 'send_email',
        description: 'Send thank you email to customer',
        parameters: {
          to: '{{contact.email}}',
          subject: 'Thank you for choosing us!',
          body: '{{ai_generated_thank_you}}',
        },
      },
    ],
  },
  {
    id: 'lead-enrichment',
    name: 'Smart Lead Enrichment',
    description: 'Enrich new leads with AI analysis and update CRM',
    category: 'sales',
    difficulty: 'advanced',
    estimatedTime: '5 minutes',
    integrations: ['gmail', 'hubspot', 'slack'],
    steps: [
      {
        id: 'receive',
        type: 'integration',
        integration: 'gmail',
        action: 'receive_email',
        description: 'Get new lead emails',
        parameters: {
          query: 'is:unread label:leads',
        },
      },
      {
        id: 'analyze',
        type: 'ai',
        description: 'Analyze email content and extract insights',
      },
      {
        id: 'create-contact',
        type: 'integration',
        integration: 'hubspot',
        action: 'create_contact',
        description: 'Create enriched contact',
        parameters: {
          email: '{{email}}',
          firstname: '{{ai_extracted.firstname}}',
          lastname: '{{ai_extracted.lastname}}',
          company: '{{ai_extracted.company}}',
        },
      },
      {
        id: 'score',
        type: 'ai',
        description: 'Calculate lead score (0-100)',
      },
      {
        id: 'check-score',
        type: 'condition',
        description: 'If lead score > 70',
      },
      {
        id: 'create-deal',
        type: 'integration',
        integration: 'hubspot',
        action: 'create_deal',
        description: 'Create high-priority deal',
        parameters: {
          dealname: '{{company}} - Hot Lead',
          amount: 0,
          dealstage: 'qualifiedtobuy',
        },
      },
      {
        id: 'alert-team',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Alert sales team',
        parameters: {
          channel: '#hot-leads',
          text: '🔥 Hot lead (score: {{score}}): {{firstname}} {{lastname}} from {{company}}',
        },
      },
    ],
  },
  {
    id: 'customer-support',
    name: 'Smart Support Routing',
    description: 'Route support emails to appropriate Slack channels',
    category: 'support',
    difficulty: 'intermediate',
    estimatedTime: '3 minutes',
    integrations: ['gmail', 'slack'],
    steps: [
      {
        id: 'receive',
        type: 'integration',
        integration: 'gmail',
        action: 'receive_email',
        description: 'Get support emails',
        parameters: {
          query: 'is:unread label:support',
        },
      },
      {
        id: 'analyze',
        type: 'ai',
        description: 'Classify support request (bug, feature, question)',
      },
      {
        id: 'route',
        type: 'condition',
        description: 'Route based on classification',
      },
      {
        id: 'notify-bugs',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Post bug reports to #bugs',
        parameters: {
          channel: '#bugs',
          text: '🐛 Bug report from {{sender}}: {{summary}}',
        },
      },
      {
        id: 'notify-features',
        type: 'integration',
        integration: 'slack',
        action: 'post_message',
        description: 'Post feature requests to #features',
        parameters: {
          channel: '#feature-requests',
          text: '💡 Feature request from {{sender}}: {{summary}}',
        },
      },
    ],
  },
];

/**
 * Get workflow examples by category
 */
export function getWorkflowExamplesByCategory(
  category: WorkflowExample['category'],
): WorkflowExample[] {
  return WORKFLOW_EXAMPLES.filter((workflow) => workflow.category === category);
}

/**
 * Get workflow examples using a specific integration
 */
export function getWorkflowExamplesByIntegration(
  integrationId: IntegrationType,
): WorkflowExample[] {
  return WORKFLOW_EXAMPLES.filter((workflow) => workflow.integrations.includes(integrationId));
}

/**
 * Get workflow example by ID
 */
export function getWorkflowExample(id: string): WorkflowExample | undefined {
  return WORKFLOW_EXAMPLES.find((workflow) => workflow.id === id);
}
