/**
 * GalaxyCo.ai Mock Data Fixtures
 * Mock data for development and testing
 * October 15, 2025
 */

import type {
  User,
  Workspace,
  Agent,
  Workflow,
  Email,
  Prospect,
  Notification,
  DashboardStat,
  ResearchInsight,
  Integration,
} from './types';

// Current timestamp for mock data
const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

// Mock User
export const mockUser: User = {
  id: 'user_1',
  email: 'demo@galaxyco.ai',
  firstName: 'Demo',
  lastName: 'User',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces',
  role: 'admin',
  workspaceId: 'workspace_1',
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      workflow: true,
      agents: true,
    },
    timezone: 'America/New_York',
    language: 'en',
  },
  createdAt: lastWeek,
  updatedAt: now,
};

// Mock Workspace
export const mockWorkspace: Workspace = {
  id: 'workspace_1',
  name: 'GalaxyCo Demo',
  slug: 'galaxyco-demo',
  plan: 'pro',
  settings: {
    allowedDomains: ['galaxyco.ai'],
    maxAgents: 10,
    maxWorkflows: 50,
    retentionDays: 90,
  },
  createdAt: lastWeek,
  updatedAt: now,
};

// Mock Agents
export const mockAgents: Agent[] = [
  {
    id: 'agent_1',
    workspaceId: 'workspace_1',
    type: 'research',
    name: 'Research Agent',
    description: 'Finds comprehensive prospect intelligence using multiple data sources',
    status: 'running',
    config: {
      enabled: true,
      schedule: { type: 'interval', interval: 60 },
      maxRetries: 3,
      timeout: 300,
      research: {
        sources: ['linkedin', 'company-website', 'news', 'social-media'],
        searchDepth: 'deep',
        confidenceThreshold: 0.8,
        languages: ['en'],
        excludeTerms: ['spam', 'promotional'],
      },
    },
    metrics: {
      totalRuns: 1247,
      successfulRuns: 1189,
      failedRuns: 58,
      averageRuntime: 45.2,
      performance: {
        successRate: 95.3,
        averageLatency: 1250,
        throughput: 42,
        errorRate: 4.7,
      },
    },
    lastRunAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    nextRunAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
    createdAt: lastWeek,
    updatedAt: now,
    createdBy: 'user_1',
  },
  {
    id: 'agent_2',
    workspaceId: 'workspace_1',
    type: 'email',
    name: 'Email Agent',
    description: 'Crafts personalized outreach emails with research insights',
    status: 'idle',
    config: {
      enabled: true,
      schedule: { type: 'manual' },
      maxRetries: 2,
      timeout: 120,
      email: {
        templates: [],
        tone: 'professional',
        maxEmailsPerDay: 50,
        waitBetweenEmails: 2,
        trackOpens: true,
        trackClicks: true,
      },
    },
    metrics: {
      totalRuns: 892,
      successfulRuns: 834,
      failedRuns: 58,
      averageRuntime: 23.1,
      performance: {
        successRate: 93.5,
        averageLatency: 850,
        throughput: 28,
        errorRate: 6.5,
      },
    },
    lastRunAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: lastWeek,
    updatedAt: now,
    createdBy: 'user_1',
  },
  {
    id: 'agent_3',
    workspaceId: 'workspace_1',
    type: 'crm',
    name: 'CRM Sync Agent',
    description: 'Syncs prospect data with your CRM system automatically',
    status: 'paused',
    config: {
      enabled: false,
      schedule: { type: 'interval', interval: 120 },
      maxRetries: 3,
      timeout: 180,
      crm: {
        crmProvider: 'hubspot',
        syncDirection: 'bidirectional',
        fieldMappings: {
          firstName: 'firstname',
          lastName: 'lastname',
          email: 'email',
          company: 'company',
        },
        autoSync: true,
        syncInterval: 60,
      },
    },
    metrics: {
      totalRuns: 456,
      successfulRuns: 423,
      failedRuns: 33,
      averageRuntime: 67.8,
      performance: {
        successRate: 92.8,
        averageLatency: 2100,
        throughput: 15,
        errorRate: 7.2,
      },
    },
    lastRunAt: yesterday,
    createdAt: lastWeek,
    updatedAt: now,
    createdBy: 'user_1',
  },
];

// Mock Workflows
export const mockWorkflows: Workflow[] = [
  {
    id: 'workflow_1',
    workspaceId: 'workspace_1',
    name: 'Lead Qualification Pipeline',
    description: 'End-to-end prospect research, email outreach, and CRM sync',
    status: 'active',
    steps: [
      {
        id: 'step_1',
        type: 'research',
        name: 'Research Prospect',
        config: { timeout: 300 },
        position: { x: 100, y: 100 },
        nextSteps: ['step_2'],
        previousSteps: [],
      },
      {
        id: 'step_2',
        type: 'email',
        name: 'Send Outreach Email',
        config: { timeout: 120 },
        position: { x: 300, y: 100 },
        nextSteps: ['step_3'],
        previousSteps: ['step_1'],
      },
      {
        id: 'step_3',
        type: 'crm',
        name: 'Update CRM',
        config: { timeout: 60 },
        position: { x: 500, y: 100 },
        nextSteps: [],
        previousSteps: ['step_2'],
      },
    ],
    variables: {
      targetIndustry: 'technology',
      companySize: '51-200',
    },
    metrics: {
      totalExecutions: 234,
      successfulExecutions: 198,
      failedExecutions: 36,
      averageExecutionTime: 512.3,
      lastExecutedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    createdAt: lastWeek,
    updatedAt: now,
    createdBy: 'user_1',
  },
];

// Mock Prospects
export const mockProspects: Prospect[] = [
  {
    id: 'prospect_1',
    workspaceId: 'workspace_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techstartup.com',
    company: 'TechStartup Inc',
    title: 'VP of Engineering',
    phone: '+1-555-0123',
    linkedinUrl: 'https://linkedin.com/in/sarahchen-eng',
    status: 'enriched',
    enrichmentStatus: 'completed',
    enrichmentData: {
      personalInfo: {
        fullName: 'Sarah Chen',
        firstName: 'Sarah',
        lastName: 'Chen',
        title: 'VP of Engineering',
        email: 'sarah.chen@techstartup.com',
        location: 'San Francisco, CA',
        bio: 'VP of Engineering at TechStartup Inc. Building scalable systems for the future.',
        education: [
          {
            institution: 'Stanford University',
            degree: 'MS',
            field: 'Computer Science',
            startYear: 2015,
            endYear: 2017,
          },
        ],
        experience: [
          {
            company: 'TechStartup Inc',
            title: 'VP of Engineering',
            startDate: '2022-01',
            description: 'Leading engineering team of 25+ developers',
          },
          {
            company: 'Google',
            title: 'Senior Software Engineer',
            startDate: '2017-06',
            endDate: '2021-12',
            description: 'Backend systems for Gmail and Google Drive',
          },
        ],
      },
      companyInfo: {
        name: 'TechStartup Inc',
        domain: 'techstartup.com',
        industry: 'Software',
        size: '51-200',
        revenue: '$10M-$50M',
        founded: 2019,
        location: 'San Francisco, CA',
        description: 'AI-powered business intelligence platform',
        technologies: ['React', 'Python', 'PostgreSQL', 'AWS'],
      },
      socialProfiles: [
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/sarahchen-eng',
          followers: 1250,
          verified: true,
        },
        {
          platform: 'Twitter',
          url: 'https://twitter.com/sarahchen_eng',
          username: '@sarahchen_eng',
          followers: 890,
        },
      ],
      newsAndEvents: [
        {
          title: 'TechStartup Inc Raises $15M Series A',
          url: 'https://techcrunch.com/techstartup-series-a',
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'TechCrunch',
          sentiment: 'positive',
        },
      ],
      confidenceScore: 92,
      sources: ['LinkedIn', 'Company Website', 'Crunchbase'],
      enrichedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    tags: ['high-priority', 'enterprise'],
    customFields: {
      leadScore: 85,
      industry: 'technology',
    },
    createdAt: yesterday,
    updatedAt: now,
    createdBy: 'user_1',
  },
  {
    id: 'prospect_2',
    workspaceId: 'workspace_1',
    name: 'Marcus Rodriguez',
    email: 'marcus@growthcorp.io',
    company: 'GrowthCorp',
    title: 'Head of Sales',
    status: 'email_sent',
    enrichmentStatus: 'completed',
    tags: ['warm-lead'],
    customFields: {},
    lastContactedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: yesterday,
    updatedAt: now,
    createdBy: 'user_1',
  },
  {
    id: 'prospect_3',
    workspaceId: 'workspace_1',
    name: 'Lisa Wang',
    email: 'lisa.wang@innovatetech.co',
    company: 'InnovateTech',
    title: 'CTO',
    status: 'replied',
    enrichmentStatus: 'completed',
    tags: ['replied', 'hot-lead'],
    customFields: {
      leadScore: 95,
    },
    lastContactedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: lastWeek,
    updatedAt: now,
    createdBy: 'user_1',
  },
];

// Mock Emails
export const mockEmails: Email[] = [
  {
    id: 'email_1',
    workspaceId: 'workspace_1',
    prospectId: 'prospect_1',
    prospect: mockProspects[0],
    agentId: 'agent_2',
    agent: mockAgents[1],
    subject: "AI-Powered Solutions for TechStartup's Engineering Team",
    body: "Hi Sarah,\n\nI noticed TechStartup's recent Series A funding - congratulations! Your background in scalable systems at Google caught my attention.\n\nGiven your experience building backend systems for Gmail and Google Drive, I thought you might be interested in how other VP-level engineering leaders are leveraging AI to accelerate development cycles.\n\nWould you be open to a brief 15-minute conversation about how companies like yours are implementing AI-powered development tools?\n\nBest regards,\nDemo User",
    status: 'pending_review',
    confidenceScore: 88,
    researchInsights: [
      {
        id: 'insight_1',
        type: 'company_news',
        title: 'Recent Series A Funding',
        content:
          'TechStartup Inc raised $15M in Series A funding to expand their engineering team and accelerate product development.',
        source: 'TechCrunch',
        sourceUrl: 'https://techcrunch.com/techstartup-series-a',
        confidenceScore: 95,
        relevanceScore: 92,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'insight_2',
        type: 'person_news',
        title: 'Leadership Experience at Google',
        content:
          'Sarah Chen spent 4+ years at Google working on backend systems for high-scale products like Gmail and Google Drive.',
        source: 'LinkedIn',
        confidenceScore: 98,
        relevanceScore: 88,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ],
    attachments: [],
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: now,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notification_1',
    workspaceId: 'workspace_1',
    userId: 'user_1',
    type: 'email_reply',
    priority: 'high',
    title: 'New Reply from Lisa Wang',
    message: 'Lisa Wang replied to your outreach email about AI solutions',
    metadata: {
      prospectId: 'prospect_3',
      emailId: 'email_3',
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notification_2',
    workspaceId: 'workspace_1',
    userId: 'user_1',
    type: 'agent_success',
    priority: 'normal',
    title: 'Research Agent Completed',
    message: 'Research Agent successfully enriched 5 new prospects',
    metadata: {
      agentId: 'agent_1',
      prospectsEnriched: 5,
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notification_3',
    workspaceId: 'workspace_1',
    userId: 'user_1',
    type: 'workflow_complete',
    priority: 'normal',
    title: 'Lead Qualification Pipeline Finished',
    message: 'Successfully processed 12 prospects through the qualification pipeline',
    metadata: {
      workflowId: 'workflow_1',
      prospectsProcessed: 12,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStat[] = [
  {
    title: 'Active Agents',
    value: '3',
    change: 0,
    icon: 'bot',
    color: 'blue',
    unit: 'agents',
  },
  {
    title: 'Prospects Enriched',
    value: '247',
    change: 12.5,
    changeType: 'increase',
    icon: 'users',
    color: 'green',
    unit: 'this month',
    target: 300,
  },
  {
    title: 'Emails Sent',
    value: '89',
    change: -3.2,
    changeType: 'decrease',
    icon: 'mail',
    color: 'orange',
    unit: 'this week',
    target: 100,
  },
  {
    title: 'Reply Rate',
    value: '23.5%',
    change: 5.8,
    changeType: 'increase',
    icon: 'trending-up',
    color: 'purple',
    unit: 'average',
    trend: [
      { x: 'Mon', y: 18.2 },
      { x: 'Tue', y: 21.1 },
      { x: 'Wed', y: 25.3 },
      { x: 'Thu', y: 22.7 },
      { x: 'Fri', y: 23.5 },
    ],
  },
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: 'integration_1',
    workspaceId: 'workspace_1',
    type: 'crm',
    name: 'HubSpot CRM',
    status: 'connected',
    config: {
      syncInterval: 60,
      fieldMappings: {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        company: 'company',
      },
    },
    credentials: {
      type: 'oauth',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      scopes: ['contacts', 'deals', 'companies'],
    },
    lastSyncAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    createdAt: lastWeek,
    updatedAt: now,
  },
  {
    id: 'integration_2',
    workspaceId: 'workspace_1',
    type: 'email',
    name: 'Gmail',
    status: 'connected',
    config: {},
    credentials: {
      type: 'oauth',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      scopes: ['gmail.send', 'gmail.readonly'],
    },
    lastSyncAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: lastWeek,
    updatedAt: now,
  },
  {
    id: 'integration_3',
    workspaceId: 'workspace_1',
    type: 'linkedin',
    name: 'LinkedIn',
    status: 'error',
    config: {},
    credentials: {
      type: 'oauth',
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // expired
      scopes: ['profile', 'connections'],
    },
    createdAt: lastWeek,
    updatedAt: now,
  },
];

// Helper functions for generating additional mock data
export const generateMockProspects = (count: number): Prospect[] => {
  const companies = [
    'TechCorp',
    'InnovateX',
    'ScaleUp',
    'GrowthFlow',
    'DataDriven',
    'CloudFirst',
    'AILabs',
    'FutureWork',
    'SmartBiz',
    'NextGen',
  ];

  const titles = [
    'CEO',
    'CTO',
    'VP Engineering',
    'Head of Sales',
    'Director of Marketing',
    'VP Product',
    'Chief Data Officer',
    'Head of Growth',
    'VP Operations',
  ];

  const statuses: Prospect['status'][] = [
    'new',
    'enriched',
    'email_sent',
    'replied',
    'qualified',
    'lost',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `prospect_${i + 4}`,
    workspaceId: 'workspace_1',
    name: `Person ${i + 4}`,
    email: `person${i + 4}@${companies[i % companies.length].toLowerCase()}.com`,
    company: companies[i % companies.length],
    title: titles[i % titles.length],
    status: statuses[i % statuses.length],
    enrichmentStatus: Math.random() > 0.2 ? 'completed' : ('pending' as any),
    tags: [],
    customFields: {},
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
    createdBy: 'user_1',
  }));
};

// Export all fixtures
export const fixtures = {
  user: mockUser,
  workspace: mockWorkspace,
  agents: mockAgents,
  workflows: mockWorkflows,
  prospects: mockProspects,
  emails: mockEmails,
  notifications: mockNotifications,
  dashboardStats: mockDashboardStats,
  integrations: mockIntegrations,
};

export default fixtures;
