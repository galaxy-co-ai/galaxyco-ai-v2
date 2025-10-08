/**
 * Agent Templates
 * Pre-configured agents from starter packs for quick creation
 */

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'content' | 'support' | 'sales' | 'ops';
  type: 'scope' | 'call' | 'email' | 'note' | 'task' | 'roadmap' | 'content' | 'custom';
  prefilledConfig: {
    trigger: 'webhook' | 'schedule' | 'manual' | 'event';
    aiProvider: 'openai' | 'anthropic' | 'custom';
    model: string;
    temperature: number;
    systemPrompt: string;
    maxTokens?: number;
  };
  sampleInputs: Record<string, any>;
  expectedOutputs: Record<string, any>;
  tags: string[];
  sourcePackId?: string;
}

export const AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  'email-analyzer': {
    id: 'email-analyzer',
    name: 'Email Analyzer',
    description: 'Parse emails and extract action items, priorities, and key information',
    icon: '📧',
    category: 'communication',
    type: 'scope',
    prefilledConfig: {
      trigger: 'webhook',
      aiProvider: 'openai',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: `You are an expert email analyzer. Your task is to:

1. Extract all action items from the email thread
2. Identify the priority level (high, medium, low)
3. Detect sentiment and tone
4. Summarize key points in bullet format
5. Flag any urgent items or deadlines

Format your response as JSON with these fields:
- summary: Brief overview
- actionItems: Array of action items
- priority: Overall priority (high/medium/low)
- sentiment: Email sentiment (positive/neutral/negative)
- urgentItems: Any time-sensitive items
- keyContacts: Important people mentioned`,
    },
    sampleInputs: {
      emailThread: `From: john@company.com
Subject: Q4 Budget Proposal Review

Hi Team,

Can we schedule a meeting next week to review the Q4 budget proposal? 
Sarah mentioned we need to finalize this by Friday.

Also, please review the attached mockups before the meeting.

Best,
John`,
      includeAttachments: true,
    },
    expectedOutputs: {
      summary: 'Request to schedule Q4 budget review meeting with deadline',
      actionItems: [
        'Schedule meeting for next week',
        'Review Q4 budget proposal',
        'Review attached mockups',
      ],
      priority: 'high',
      sentiment: 'neutral',
      urgentItems: ['Finalize by Friday'],
    },
    tags: ['email', 'inbox', 'productivity', 'founder-ops'],
    sourcePackId: 'founder-ops',
  },

  'doc-summarizer': {
    id: 'doc-summarizer',
    name: 'Document Summarizer',
    description: 'Extract key points, summaries, and questions from long documents',
    icon: '📄',
    category: 'content',
    type: 'content',
    prefilledConfig: {
      trigger: 'manual',
      aiProvider: 'openai',
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 1500,
      systemPrompt: `You are a document summarization expert. Your task is to:

1. Read and understand the document thoroughly
2. Extract the main thesis or purpose
3. Identify 5-7 key points
4. Highlight any actionable recommendations
5. Generate 3-5 questions for deeper understanding
6. Assess document quality and readability

Format your response as JSON with these fields:
- summary: 2-3 sentence overview
- mainThesis: Core argument or purpose
- keyPoints: Array of important takeaways
- recommendations: Actionable items (if any)
- questions: Array of clarifying questions
- readabilityScore: 1-10 scale
- wordCount: Approximate word count`,
    },
    sampleInputs: {
      documentText: 'Long document content here...',
      documentType: 'article',
      targetAudience: 'general',
    },
    expectedOutputs: {
      summary: 'Document overview in 2-3 sentences',
      keyPoints: ['Point 1', 'Point 2', 'Point 3'],
      readabilityScore: 8.5,
    },
    tags: ['documents', 'content', 'knowledge', 'docs-pack'],
    sourcePackId: 'docs-knowledge',
  },

  'ticket-triage': {
    id: 'ticket-triage',
    name: 'Ticket Triage',
    description: 'Automatically classify and prioritize support tickets',
    icon: '🎫',
    category: 'support',
    type: 'task',
    prefilledConfig: {
      trigger: 'webhook',
      aiProvider: 'openai',
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      maxTokens: 800,
      systemPrompt: `You are a support ticket triage specialist. Your task is to:

1. Classify the ticket into a category
2. Determine priority based on urgency and impact
3. Detect customer sentiment
4. Identify if escalation is needed
5. Suggest initial response template
6. Flag for duplicate detection

Categories: Bug, Feature Request, How-To, Account Issue, Billing, Other
Priority: Critical, High, Medium, Low
Sentiment: Frustrated, Neutral, Happy

Format your response as JSON with these fields:
- category: Ticket category
- priority: Priority level
- sentiment: Customer sentiment
- escalate: Boolean (should escalate?)
- suggestedResponse: Brief response template
- estimatedResolutionTime: Time estimate
- assignTo: Suggested team/person`,
    },
    sampleInputs: {
      ticketSubject: 'Cannot login to account',
      ticketBody: 'I\'ve been trying to login for 2 hours and keep getting errors...',
      customerTier: 'enterprise',
      previousTickets: 0,
    },
    expectedOutputs: {
      category: 'Account Issue',
      priority: 'High',
      sentiment: 'Frustrated',
      escalate: true,
      estimatedResolutionTime: '1-2 hours',
    },
    tags: ['support', 'tickets', 'triage', 'support-pack'],
    sourcePackId: 'support-excellence',
  },

  'lead-enrichment': {
    id: 'lead-enrichment',
    name: 'Lead Enrichment',
    description: 'Research and enrich lead information with company details',
    icon: '🎯',
    category: 'sales',
    type: 'call',
    prefilledConfig: {
      trigger: 'manual',
      aiProvider: 'openai',
      model: 'gpt-4',
      temperature: 0.4,
      maxTokens: 1200,
      systemPrompt: `You are a lead enrichment specialist. Your task is to:

1. Research the company based on provided information
2. Identify company size, industry, and funding stage
3. Find key decision makers and their roles
4. Assess product-market fit potential
5. Suggest personalized outreach angle
6. Provide relevant news or recent announcements

Format your response as JSON with these fields:
- companyName: Official company name
- industry: Primary industry
- companySize: Employee count range
- fundingStage: Seed/Series A/B/C/Public
- keyContacts: Array of decision makers with roles
- outreachAngle: Personalized approach suggestion
- fitScore: 1-10 product-market fit assessment
- recentNews: Any relevant announcements`,
    },
    sampleInputs: {
      companyName: 'Acme Corp',
      companyDomain: 'acmecorp.com',
      contactName: 'Jane Smith',
      contactTitle: 'VP of Engineering',
    },
    expectedOutputs: {
      industry: 'SaaS',
      companySize: '50-200',
      fundingStage: 'Series A',
      fitScore: 8.5,
      outreachAngle: 'Focus on scaling infrastructure challenges',
    },
    tags: ['sales', 'leads', 'enrichment', 'sales-ops'],
    sourcePackId: 'sales-ops',
  },

  'followup-writer': {
    id: 'followup-writer',
    name: 'Follow-up Writer',
    description: 'Generate personalized follow-up emails based on context',
    icon: '✍️',
    category: 'sales',
    type: 'email',
    prefilledConfig: {
      trigger: 'manual',
      aiProvider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: `You are a follow-up email specialist. Your task is to:

1. Write a personalized, concise follow-up email
2. Reference specific points from previous conversation
3. Maintain professional yet friendly tone
4. Include clear call-to-action
5. Keep it under 150 words
6. Avoid being pushy or salesy

Tone: Professional, friendly, helpful
Structure: Quick reference → Value add → Clear CTA
Length: 3-4 short paragraphs

Format your response as JSON with these fields:
- subject: Email subject line
- body: Email body text
- tone: Detected tone (professional/casual/formal)
- callToAction: Clear next step
- bestTimeToSend: Suggested send time`,
    },
    sampleInputs: {
      previousConversation: 'Discussed Q4 pricing and implementation timeline',
      recipientName: 'John',
      recipientCompany: 'Tech Startup Inc',
      daysSinceLastContact: 3,
      context: 'Waiting for budget approval',
    },
    expectedOutputs: {
      subject: 'Re: Q4 Implementation Discussion',
      body: 'Hi John,\n\nFollowing up on our Q4 conversation...',
      callToAction: 'Schedule 15-min call to discuss next steps',
      bestTimeToSend: 'Tuesday 10am',
    },
    tags: ['sales', 'email', 'outreach', 'sales-ops'],
    sourcePackId: 'sales-ops',
  },
};

// Helper functions
export const getTemplatesByCategory = (category: string): AgentTemplate[] => {
  return Object.values(AGENT_TEMPLATES).filter((t) => t.category === category);
};

export const getTemplatesByPack = (packId: string): AgentTemplate[] => {
  return Object.values(AGENT_TEMPLATES).filter((t) => t.sourcePackId === packId);
};

export const searchTemplates = (query: string): AgentTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(AGENT_TEMPLATES).filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
};

export const TEMPLATE_CATEGORIES = [
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'support', label: 'Support', icon: '🎧' },
  { id: 'sales', label: 'Sales', icon: '💼' },
  { id: 'ops', label: 'Operations', icon: '⚙️' },
] as const;
