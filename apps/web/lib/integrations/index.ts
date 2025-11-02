/**
 * Integrations Index
 * Central export for all integrations
 */

// Gmail integration
export * as Gmail from './gmail';

// Integration registry
export const AVAILABLE_INTEGRATIONS = ['gmail', 'slack', 'hubspot', 'pipedrive'] as const;

export type IntegrationType = (typeof AVAILABLE_INTEGRATIONS)[number];

export interface IntegrationMetadata {
  type: IntegrationType;
  name: string;
  description: string;
  icon: string;
  category: 'email' | 'messaging' | 'crm' | 'calendar' | 'storage';
  requiresOAuth: boolean;
  capabilities: string[];
}

export const INTEGRATION_METADATA: Record<IntegrationType, IntegrationMetadata> = {
  gmail: {
    type: 'gmail',
    name: 'Gmail',
    description: 'Send and receive emails via Gmail',
    icon: 'mail',
    category: 'email',
    requiresOAuth: true,
    capabilities: ['send_email', 'receive_email', 'search_email'],
  },
  slack: {
    type: 'slack',
    name: 'Slack',
    description: 'Send messages and interact with Slack channels',
    icon: 'message-square',
    category: 'messaging',
    requiresOAuth: true,
    capabilities: ['send_message', 'read_messages', 'create_channel'],
  },
  hubspot: {
    type: 'hubspot',
    name: 'HubSpot',
    description: 'Manage contacts and deals in HubSpot CRM',
    icon: 'users',
    category: 'crm',
    requiresOAuth: true,
    capabilities: ['create_contact', 'update_contact', 'create_deal', 'get_contact'],
  },
  pipedrive: {
    type: 'pipedrive',
    name: 'Pipedrive',
    description: 'Manage deals and contacts in Pipedrive CRM',
    icon: 'trending-up',
    category: 'crm',
    requiresOAuth: true,
    capabilities: ['create_deal', 'update_deal', 'create_person', 'get_person'],
  },
};
