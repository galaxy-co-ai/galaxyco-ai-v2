/**
 * Integration Configuration
 * Defines all available integrations and their capabilities
 */

export type IntegrationType = 'gmail' | 'slack' | 'hubspot' | 'google-calendar';

export type IntegrationAction =
  | 'send_email'
  | 'receive_email'
  | 'post_message'
  | 'read_channels'
  | 'create_contact'
  | 'update_contact'
  | 'create_deal'
  | 'update_deal'
  | 'create_event'
  | 'list_events';

export interface IntegrationConfig {
  id: IntegrationType;
  name: string;
  description: string;
  category: 'communication' | 'crm' | 'productivity';
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  requiredScopes: string[];
  actions: {
    id: IntegrationAction;
    name: string;
    description: string;
    inputs: IntegrationActionInput[];
    outputs: string[];
  }[];
}

export interface IntegrationActionInput {
  id: string;
  name: string;
  type: 'string' | 'email' | 'number' | 'boolean' | 'select' | 'array';
  required: boolean;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  default?: any;
}

/**
 * All available integrations
 */
export const INTEGRATIONS: Record<IntegrationType, IntegrationConfig> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send and receive emails via Gmail',
    category: 'communication',
    icon: 'Mail',
    color: 'red',
    requiredScopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
    actions: [
      {
        id: 'send_email',
        name: 'Send Email',
        description: 'Send an email via Gmail',
        inputs: [
          {
            id: 'to',
            name: 'To',
            type: 'email',
            required: true,
            description: 'Recipient email address',
            placeholder: 'recipient@example.com',
          },
          {
            id: 'subject',
            name: 'Subject',
            type: 'string',
            required: true,
            description: 'Email subject line',
            placeholder: 'Your subject here',
          },
          {
            id: 'body',
            name: 'Body',
            type: 'string',
            required: true,
            description: 'Email body content',
            placeholder: 'Your message here',
          },
          {
            id: 'cc',
            name: 'CC',
            type: 'string',
            required: false,
            description: 'CC recipients (comma-separated)',
          },
          {
            id: 'bcc',
            name: 'BCC',
            type: 'string',
            required: false,
            description: 'BCC recipients (comma-separated)',
          },
        ],
        outputs: ['messageId', 'timestamp'],
      },
      {
        id: 'receive_email',
        name: 'Receive Emails',
        description: 'Get recent emails from Gmail',
        inputs: [
          {
            id: 'query',
            name: 'Search Query',
            type: 'string',
            required: false,
            description: 'Gmail search query (e.g., "is:unread")',
            placeholder: 'is:unread',
          },
          {
            id: 'maxResults',
            name: 'Max Results',
            type: 'number',
            required: false,
            description: 'Maximum number of emails to retrieve',
            default: 10,
          },
        ],
        outputs: ['emails', 'count'],
      },
    ],
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and interact with Slack',
    category: 'communication',
    icon: 'MessageCircle',
    color: 'purple',
    requiredScopes: ['chat:write', 'channels:read', 'channels:history', 'users:read'],
    actions: [
      {
        id: 'post_message',
        name: 'Post Message',
        description: 'Send a message to a Slack channel',
        inputs: [
          {
            id: 'channel',
            name: 'Channel',
            type: 'string',
            required: true,
            description: 'Channel ID or name',
            placeholder: '#general',
          },
          {
            id: 'text',
            name: 'Message',
            type: 'string',
            required: true,
            description: 'Message text',
            placeholder: 'Your message here',
          },
          {
            id: 'thread_ts',
            name: 'Thread ID',
            type: 'string',
            required: false,
            description: 'Reply to a specific thread',
          },
        ],
        outputs: ['messageId', 'timestamp', 'channel'],
      },
      {
        id: 'read_channels',
        name: 'Read Channels',
        description: 'Get list of Slack channels',
        inputs: [
          {
            id: 'types',
            name: 'Channel Types',
            type: 'select',
            required: false,
            description: 'Types of channels to retrieve',
            options: [
              { label: 'Public Channels', value: 'public_channel' },
              { label: 'Private Channels', value: 'private_channel' },
              { label: 'Direct Messages', value: 'im' },
            ],
            default: 'public_channel',
          },
        ],
        outputs: ['channels', 'count'],
      },
    ],
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Manage contacts and deals in HubSpot CRM',
    category: 'crm',
    icon: 'Users',
    color: 'orange',
    requiredScopes: ['crm.objects.contacts.write', 'crm.objects.deals.write'],
    actions: [
      {
        id: 'create_contact',
        name: 'Create Contact',
        description: 'Create a new contact in HubSpot',
        inputs: [
          {
            id: 'email',
            name: 'Email',
            type: 'email',
            required: true,
            description: 'Contact email address',
            placeholder: 'contact@example.com',
          },
          {
            id: 'firstname',
            name: 'First Name',
            type: 'string',
            required: false,
            description: 'Contact first name',
          },
          {
            id: 'lastname',
            name: 'Last Name',
            type: 'string',
            required: false,
            description: 'Contact last name',
          },
          {
            id: 'company',
            name: 'Company',
            type: 'string',
            required: false,
            description: 'Company name',
          },
          {
            id: 'phone',
            name: 'Phone',
            type: 'string',
            required: false,
            description: 'Phone number',
          },
        ],
        outputs: ['contactId', 'createdAt'],
      },
      {
        id: 'update_contact',
        name: 'Update Contact',
        description: 'Update an existing contact in HubSpot',
        inputs: [
          {
            id: 'contactId',
            name: 'Contact ID',
            type: 'string',
            required: true,
            description: 'HubSpot contact ID',
          },
          {
            id: 'properties',
            name: 'Properties',
            type: 'string',
            required: true,
            description: 'JSON object of properties to update',
          },
        ],
        outputs: ['contactId', 'updatedAt'],
      },
      {
        id: 'create_deal',
        name: 'Create Deal',
        description: 'Create a new deal in HubSpot',
        inputs: [
          {
            id: 'dealname',
            name: 'Deal Name',
            type: 'string',
            required: true,
            description: 'Name of the deal',
          },
          {
            id: 'amount',
            name: 'Amount',
            type: 'number',
            required: false,
            description: 'Deal amount',
          },
          {
            id: 'dealstage',
            name: 'Deal Stage',
            type: 'string',
            required: false,
            description: 'Pipeline stage',
          },
        ],
        outputs: ['dealId', 'createdAt'],
      },
      {
        id: 'update_deal',
        name: 'Update Deal',
        description: 'Update an existing deal in HubSpot',
        inputs: [
          {
            id: 'dealId',
            name: 'Deal ID',
            type: 'string',
            required: true,
            description: 'HubSpot deal ID',
          },
          {
            id: 'properties',
            name: 'Properties',
            type: 'string',
            required: true,
            description: 'JSON object of properties to update',
          },
        ],
        outputs: ['dealId', 'updatedAt'],
      },
    ],
  },
  'google-calendar': {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Create and manage calendar events',
    category: 'productivity',
    icon: 'Calendar',
    color: 'blue',
    requiredScopes: ['https://www.googleapis.com/auth/calendar'],
    actions: [
      {
        id: 'create_event',
        name: 'Create Event',
        description: 'Create a new calendar event',
        inputs: [
          {
            id: 'summary',
            name: 'Event Title',
            type: 'string',
            required: true,
            description: 'Event title/summary',
          },
          {
            id: 'start',
            name: 'Start Time',
            type: 'string',
            required: true,
            description: 'Start time (ISO 8601 format)',
          },
          {
            id: 'end',
            name: 'End Time',
            type: 'string',
            required: true,
            description: 'End time (ISO 8601 format)',
          },
          {
            id: 'description',
            name: 'Description',
            type: 'string',
            required: false,
            description: 'Event description',
          },
          {
            id: 'attendees',
            name: 'Attendees',
            type: 'string',
            required: false,
            description: 'Comma-separated list of email addresses',
          },
        ],
        outputs: ['eventId', 'link'],
      },
      {
        id: 'list_events',
        name: 'List Events',
        description: 'Get upcoming calendar events',
        inputs: [
          {
            id: 'maxResults',
            name: 'Max Results',
            type: 'number',
            required: false,
            description: 'Maximum number of events to retrieve',
            default: 10,
          },
        ],
        outputs: ['events', 'count'],
      },
    ],
  },
};

/**
 * Get integration configuration by ID
 */
export function getIntegration(id: IntegrationType): IntegrationConfig | undefined {
  return INTEGRATIONS[id];
}

/**
 * Get all integrations for a category
 */
export function getIntegrationsByCategory(
  category: IntegrationConfig['category'],
): IntegrationConfig[] {
  return Object.values(INTEGRATIONS).filter((integration) => integration.category === category);
}

/**
 * Get all available integrations
 */
export function getAllIntegrations(): IntegrationConfig[] {
  return Object.values(INTEGRATIONS);
}
