/**
 * Pre-built Workflow Templates
 * Ready-to-use workflow templates for common use cases
 */

import type { CreateTemplateRequest } from './types';

export const PREBUILT_TEMPLATES: CreateTemplateRequest[] = [
  // ============================================================================
  // SALES TEMPLATES
  // ============================================================================
  {
    name: 'New Lead Welcome Email',
    description: 'Automatically send a welcome email to new leads and create them in your CRM',
    category: 'sales',
    tags: ['email', 'crm', 'leads', 'automation'],
    complexity: 'beginner',
    estimatedTime: 2,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Lead Received' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Create Contact in CRM',
            integration: 'hubspot',
            config: {
              action: 'create_contact',
              contactData: {
                firstName: '{{lead.firstName}}',
                lastName: '{{lead.lastName}}',
                email: '{{lead.email}}',
                company: '{{lead.company}}',
              },
            },
          },
        },
        {
          id: '3',
          type: 'integration',
          position: { x: 250, y: 200 },
          data: {
            label: 'Send Welcome Email',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{lead.email}}',
              subject: 'Welcome to {{company.name}}!',
              body: `Hi {{lead.firstName}},\n\nThanks for your interest in {{company.name}}!\n\nI'll reach out shortly to discuss how we can help.\n\nBest regards,\n{{user.name}}`,
            },
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Notify Sales Team',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#sales',
              text: '🎯 New lead: {{lead.firstName}} {{lead.lastName}} from {{lead.company}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'High-Value Deal Alert',
    description: 'Notify team when a high-value deal is created in CRM',
    category: 'sales',
    tags: ['crm', 'slack', 'deals', 'notifications'],
    complexity: 'beginner',
    estimatedTime: 1,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Deal Created' },
        },
        {
          id: '2',
          type: 'condition',
          position: { x: 250, y: 100 },
          data: {
            label: 'Deal Value > $10,000?',
            config: {
              condition: 'deal.value > 10000',
            },
          },
        },
        {
          id: '3',
          type: 'integration',
          position: { x: 100, y: 200 },
          data: {
            label: 'Alert #sales-vip',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#sales-vip',
              text: '🔥 High-value deal: ${{deal.value}} - {{deal.title}}',
            },
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 400, y: 200 },
          data: {
            label: 'Alert #sales-general',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#sales',
              text: 'New deal: ${{deal.value}} - {{deal.title}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 300 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
        { id: 'e2-4', source: '2', target: '4', label: 'No' },
        { id: 'e3-5', source: '3', target: '5' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // MARKETING TEMPLATES
  // ============================================================================
  {
    name: 'Daily Email Digest',
    description: 'Send a daily digest of unread emails to Slack',
    category: 'marketing',
    tags: ['email', 'slack', 'digest', 'automation'],
    complexity: 'beginner',
    estimatedTime: 1,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Every Day 9AM' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Fetch Unread Emails',
            integration: 'gmail',
            config: {
              action: 'receive',
              maxResults: 20,
              query: 'is:unread',
            },
          },
        },
        {
          id: '3',
          type: 'action',
          position: { x: 250, y: 200 },
          data: {
            label: 'Create Summary',
            description: 'Summarize emails with AI',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Post to Slack',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#team-digest',
              text: '📧 Daily Email Digest ({{messages.count}} unread)\n\n{{summary}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Social Media Mention Alert',
    description: 'Get notified when your company is mentioned online',
    category: 'marketing',
    tags: ['monitoring', 'slack', 'alerts'],
    complexity: 'intermediate',
    estimatedTime: 3,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Every Hour' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Search Mentions',
            description: 'Search for company mentions',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: {
            label: 'New Mentions Found?',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Alert Marketing Team',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#marketing',
              text: '🔔 New mention: {{mention.text}} - {{mention.source}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-5', source: '3', target: '5', label: 'No' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // SUPPORT TEMPLATES
  // ============================================================================
  {
    name: 'Support Ticket Triage',
    description: 'Automatically triage and route support tickets',
    category: 'support',
    tags: ['support', 'email', 'slack', 'automation'],
    complexity: 'intermediate',
    estimatedTime: 3,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Support Email' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Analyze Priority',
            description: 'AI determines urgency',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'Urgent?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 100, y: 300 },
          data: {
            label: 'Alert #support-urgent',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#support-urgent',
              text: '🚨 URGENT: {{ticket.subject}} from {{ticket.email}}',
            },
          },
        },
        {
          id: '5',
          type: 'integration',
          position: { x: 400, y: 300 },
          data: {
            label: 'Post to #support',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#support',
              text: '🎫 New ticket: {{ticket.subject}}',
            },
          },
        },
        {
          id: '6',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-5', source: '3', target: '5', label: 'No' },
        { id: 'e4-6', source: '4', target: '6' },
        { id: 'e5-6', source: '5', target: '6' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Customer Feedback Collection',
    description: 'Collect and route customer feedback from emails',
    category: 'support',
    tags: ['feedback', 'email', 'slack'],
    complexity: 'beginner',
    estimatedTime: 2,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Feedback Email Received' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Extract Sentiment',
            description: 'AI analyzes sentiment (positive/negative)',
          },
        },
        {
          id: '3',
          type: 'integration',
          position: { x: 250, y: 200 },
          data: {
            label: 'Post to #feedback',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#feedback',
              text: '{{sentiment}} feedback from {{customer.name}}: {{feedback.text}}',
            },
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Send Thank You',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{customer.email}}',
              subject: 'Thanks for your feedback!',
              body: 'Hi {{customer.name}},\n\nThank you for taking the time to share your feedback. We truly appreciate it!\n\nBest regards,\nThe Team',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // OPERATIONS TEMPLATES
  // ============================================================================
  {
    name: 'Daily Standup Reminder',
    description: 'Send daily standup reminders to team channels',
    category: 'operations',
    tags: ['slack', 'team', 'standup', 'schedule'],
    complexity: 'beginner',
    estimatedTime: 1,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Mon-Fri 9:00 AM' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Send Standup Reminder',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#team',
              text: '👋 Good morning! Time for daily standup.\n\n• What did you work on yesterday?\n• What are you working on today?\n• Any blockers?',
            },
          },
        },
        {
          id: '3',
          type: 'end',
          position: { x: 250, y: 200 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Meeting Summary Distribution',
    description: 'Send meeting notes to relevant channels after meetings',
    category: 'operations',
    tags: ['slack', 'meetings', 'notes'],
    complexity: 'beginner',
    estimatedTime: 2,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Meeting Ended' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Generate Summary',
            description: 'AI creates meeting summary',
          },
        },
        {
          id: '3',
          type: 'integration',
          position: { x: 250, y: 200 },
          data: {
            label: 'Post Summary',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '{{meeting.channel}}',
              text: '📝 Meeting Summary: {{meeting.title}}\n\n{{summary}}\n\nAction Items:\n{{actionItems}}',
            },
          },
        },
        {
          id: '4',
          type: 'end',
          position: { x: 250, y: 300 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Weekly Team Report',
    description: 'Generate and distribute weekly team performance report',
    category: 'operations',
    tags: ['reporting', 'slack', 'analytics'],
    complexity: 'intermediate',
    estimatedTime: 3,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Every Friday 5PM' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Gather Metrics',
            description: 'Collect week performance data',
          },
        },
        {
          id: '3',
          type: 'action',
          position: { x: 250, y: 200 },
          data: {
            label: 'Generate Report',
            description: 'AI creates formatted report',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Share Report',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#team-updates',
              text: '📊 Weekly Team Report\n\n{{report}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // HR TEMPLATES
  // ============================================================================
  {
    name: 'New Employee Onboarding',
    description: 'Automate new employee welcome and setup tasks',
    category: 'hr',
    tags: ['onboarding', 'email', 'slack', 'automation'],
    complexity: 'intermediate',
    estimatedTime: 5,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Employee Added' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Send Welcome Email',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{employee.email}}',
              subject: 'Welcome to {{company.name}}!',
              body: 'Welcome {{employee.firstName}}! We are excited to have you on the team.',
            },
          },
        },
        {
          id: '3',
          type: 'integration',
          position: { x: 250, y: 200 },
          data: {
            label: 'Announce in #team',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#team',
              text: '👋 Please welcome {{employee.firstName}} {{employee.lastName}} to the team! They will be joining as {{employee.role}}.',
            },
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Send HR Checklist',
            integration: 'gmail',
            config: {
              action: 'send',
              to: 'hr@company.com',
              subject: 'Onboarding Checklist: {{employee.name}}',
              body: 'New employee onboarding initiated for {{employee.name}}.\n\nPlease complete:\n- Equipment setup\n- Account creation\n- First day schedule',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Birthday Wishes Automation',
    description: 'Send birthday wishes to team members automatically',
    category: 'hr',
    tags: ['team', 'slack', 'celebration'],
    complexity: 'beginner',
    estimatedTime: 1,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Daily 9AM' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Check Birthdays Today',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'Any Birthdays?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Send Birthday Wishes',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#team',
              text: '🎉 Happy Birthday {{employee.name}}! 🎂 Wishing you an amazing day!',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-5', source: '3', target: '5', label: 'No' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // FINANCE TEMPLATES
  // ============================================================================
  {
    name: 'Invoice Payment Reminder',
    description: 'Send automated payment reminders for overdue invoices',
    category: 'finance',
    tags: ['invoices', 'email', 'payments'],
    complexity: 'intermediate',
    estimatedTime: 3,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Daily 10AM' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Find Overdue Invoices',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'Any Overdue?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Send Payment Reminder',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{invoice.customerEmail}}',
              subject: 'Payment Reminder: Invoice #{{invoice.number}}',
              body: 'Hi {{invoice.customerName}},\n\nThis is a friendly reminder that invoice #{{invoice.number}} for ${{invoice.amount}} is now overdue.\n\nPlease process payment at your earliest convenience.\n\nThank you!',
            },
          },
        },
        {
          id: '5',
          type: 'integration',
          position: { x: 250, y: 400 },
          data: {
            label: 'Log in #finance',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '#finance',
              text: '💰 Payment reminder sent: Invoice #{{invoice.number}} - ${{invoice.amount}}',
            },
          },
        },
        {
          id: '6',
          type: 'end',
          position: { x: 250, y: 500 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-6', source: '3', target: '6', label: 'No' },
        { id: 'e4-5', source: '4', target: '5' },
        { id: 'e5-6', source: '5', target: '6' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Monthly Report Generation',
    description: 'Automatically generate and email monthly financial reports',
    category: 'finance',
    tags: ['reporting', 'email', 'analytics'],
    complexity: 'advanced',
    estimatedTime: 5,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: 1st of Month' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Gather Financial Data',
          },
        },
        {
          id: '3',
          type: 'action',
          position: { x: 250, y: 200 },
          data: {
            label: 'Generate Report',
            description: 'AI creates comprehensive report',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Email to Leadership',
            integration: 'gmail',
            config: {
              action: 'send',
              to: 'leadership@company.com',
              subject: 'Monthly Financial Report - {{month}} {{year}}',
              body: '{{report}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  // ============================================================================
  // CROSS-FUNCTIONAL TEMPLATES
  // ============================================================================
  {
    name: 'Lead Qualification Pipeline',
    description: 'Qualify leads, score them, and route to appropriate sales rep',
    category: 'sales',
    tags: ['leads', 'crm', 'email', 'slack', 'qualification'],
    complexity: 'advanced',
    estimatedTime: 5,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Lead Form Submitted' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'AI Lead Scoring',
            description: 'Score lead 0-100 based on criteria',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'Score > 70?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 100, y: 300 },
          data: {
            label: 'Create High-Priority Contact',
            integration: 'hubspot',
            config: {
              action: 'create_contact',
              contactData: {
                firstName: '{{lead.firstName}}',
                lastName: '{{lead.lastName}}',
                email: '{{lead.email}}',
              },
            },
          },
        },
        {
          id: '5',
          type: 'integration',
          position: { x: 400, y: 300 },
          data: {
            label: 'Create Standard Contact',
            integration: 'hubspot',
            config: {
              action: 'create_contact',
              contactData: {
                firstName: '{{lead.firstName}}',
                lastName: '{{lead.lastName}}',
                email: '{{lead.email}}',
              },
            },
          },
        },
        {
          id: '6',
          type: 'integration',
          position: { x: 100, y: 400 },
          data: {
            label: 'Alert Sales VP',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '@sales-vp',
              text: '🔥 Hot lead: {{lead.name}} (Score: {{score}}/100)',
            },
          },
        },
        {
          id: '7',
          type: 'integration',
          position: { x: 400, y: 400 },
          data: {
            label: 'Add to Nurture List',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{lead.email}}',
              subject: 'Thanks for your interest!',
              body: 'Hi {{lead.firstName}}, thanks for reaching out...',
            },
          },
        },
        {
          id: '8',
          type: 'end',
          position: { x: 250, y: 500 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-5', source: '3', target: '5', label: 'No' },
        { id: 'e4-6', source: '4', target: '6' },
        { id: 'e5-7', source: '5', target: '7' },
        { id: 'e6-8', source: '6', target: '8' },
        { id: 'e7-8', source: '7', target: '8' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Email Campaign Follow-up',
    description: 'Automatically follow up with leads who open campaign emails',
    category: 'marketing',
    tags: ['email', 'campaign', 'follow-up', 'automation'],
    complexity: 'intermediate',
    estimatedTime: 3,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Email Opened' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Check Engagement Score',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'Highly Engaged?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 100, y: 300 },
          data: {
            label: 'Send Personalized Follow-up',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{lead.email}}',
              subject: 'Following up on {{campaign.name}}',
              body: 'Hi {{lead.firstName}}, I noticed you opened our email about {{campaign.topic}}...',
            },
          },
        },
        {
          id: '5',
          type: 'integration',
          position: { x: 400, y: 300 },
          data: {
            label: 'Add to Nurture Campaign',
          },
        },
        {
          id: '6',
          type: 'integration',
          position: { x: 100, y: 400 },
          data: {
            label: 'Notify Sales Rep',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '@{{lead.salesRep}}',
              text: '🔥 {{lead.name}} is highly engaged with {{campaign.name}}!',
            },
          },
        },
        {
          id: '7',
          type: 'end',
          position: { x: 250, y: 500 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-5', source: '3', target: '5', label: 'No' },
        { id: 'e4-6', source: '4', target: '6' },
        { id: 'e5-7', source: '5', target: '7' },
        { id: 'e6-7', source: '6', target: '7' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Customer Onboarding Sequence',
    description: 'Multi-step email sequence for new customer onboarding',
    category: 'sales',
    tags: ['onboarding', 'email', 'sequence', 'customers'],
    complexity: 'intermediate',
    estimatedTime: 4,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'New Customer Signed' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Welcome Email (Day 1)',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{customer.email}}',
              subject: 'Welcome to {{product.name}}!',
              body: 'Welcome! Here is how to get started...',
            },
          },
        },
        {
          id: '3',
          type: 'action',
          position: { x: 250, y: 200 },
          data: {
            label: 'Wait 3 Days',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Tips Email (Day 4)',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{customer.email}}',
              subject: 'Pro tips for {{product.name}}',
              body: 'Here are some tips to get the most out of {{product.name}}...',
            },
          },
        },
        {
          id: '5',
          type: 'action',
          position: { x: 250, y: 400 },
          data: {
            label: 'Wait 4 Days',
          },
        },
        {
          id: '6',
          type: 'integration',
          position: { x: 250, y: 500 },
          data: {
            label: 'Check-in Email (Day 8)',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{customer.email}}',
              subject: 'How is {{product.name}} working for you?',
              body: 'Hi {{customer.firstName}}, just checking in...',
            },
          },
        },
        {
          id: '7',
          type: 'end',
          position: { x: 250, y: 600 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
        { id: 'e5-6', source: '5', target: '6' },
        { id: 'e6-7', source: '6', target: '7' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Slack Channel Digest',
    description: 'Daily summary of important Slack channel messages',
    category: 'operations',
    tags: ['slack', 'email', 'digest', 'summary'],
    complexity: 'beginner',
    estimatedTime: 2,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Every Day 6PM' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Read Channel Messages',
            integration: 'slack',
            config: {
              action: 'read_messages',
              channel: '#important',
              limit: 50,
            },
          },
        },
        {
          id: '3',
          type: 'action',
          position: { x: 250, y: 200 },
          data: {
            label: 'AI Summarize',
            description: 'Create concise summary of key points',
          },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Email Summary',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{user.email}}',
              subject: 'Daily Digest: #important channel',
              body: '{{summary}}',
            },
          },
        },
        {
          id: '5',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Customer Churn Prevention',
    description: 'Identify at-risk customers and trigger retention workflows',
    category: 'sales',
    tags: ['retention', 'email', 'crm', 'analytics'],
    complexity: 'advanced',
    estimatedTime: 6,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Schedule: Daily' },
        },
        {
          id: '2',
          type: 'action',
          position: { x: 250, y: 100 },
          data: {
            label: 'Analyze Customer Activity',
            description: 'AI predicts churn risk',
          },
        },
        {
          id: '3',
          type: 'condition',
          position: { x: 250, y: 200 },
          data: { label: 'High Churn Risk?' },
        },
        {
          id: '4',
          type: 'integration',
          position: { x: 250, y: 300 },
          data: {
            label: 'Alert Account Manager',
            integration: 'slack',
            config: {
              action: 'send_message',
              channel: '@{{customer.accountManager}}',
              text: '⚠️ {{customer.name}} showing churn signals. Consider reaching out.',
            },
          },
        },
        {
          id: '5',
          type: 'integration',
          position: { x: 250, y: 400 },
          data: {
            label: 'Send Check-in Email',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{customer.email}}',
              subject: 'How can we help you get more value?',
              body: 'Hi {{customer.name}}, I noticed you have not been using {{product.name}} recently...',
            },
          },
        },
        {
          id: '6',
          type: 'end',
          position: { x: 250, y: 500 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
        { id: 'e3-6', source: '3', target: '6', label: 'No' },
        { id: 'e4-5', source: '4', target: '5' },
        { id: 'e5-6', source: '5', target: '6' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },

  {
    name: 'Simple Email Autoresponder',
    description: 'Auto-reply to emails with a custom message',
    category: 'support',
    tags: ['email', 'automation', 'simple'],
    complexity: 'beginner',
    estimatedTime: 1,
    previewData: {
      nodes: [
        {
          id: '1',
          type: 'start',
          position: { x: 250, y: 0 },
          data: { label: 'Email Received' },
        },
        {
          id: '2',
          type: 'integration',
          position: { x: 250, y: 100 },
          data: {
            label: 'Send Auto-Reply',
            integration: 'gmail',
            config: {
              action: 'send',
              to: '{{email.from}}',
              subject: 'Re: {{email.subject}}',
              body: 'Thank you for your email. We have received your message and will respond within 24 hours.',
            },
          },
        },
        {
          id: '3',
          type: 'end',
          position: { x: 250, y: 200 },
          data: { label: 'Complete' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },
];
