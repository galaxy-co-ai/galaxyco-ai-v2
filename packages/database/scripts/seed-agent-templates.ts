/**
 * Seed Agent Templates for GalaxyCo.ai Marketplace
 *
 * Based on SESSION_HANDOFF_MARKETPLACE_v1.md
 * Run with: pnpm ts-node scripts/seed-agent-templates.ts
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { agentTemplates } from '../src/schema';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../.env.local') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const templates = [
  {
    name: 'Browser Automation Agent',
    slug: 'browser-automation-agent',
    description:
      'Automates web applications through UI interactions to file forms, reconcile data, and QA flows. Operates like a human user, clicking buttons, filling forms, and extracting data from web pages.',
    shortDescription: 'Operates web apps via UI to file forms, reconcile data, QA flows',
    category: 'Automation',
    type: 'browser' as const,
    iconUrl: '🤖',
    badgeText: 'TRENDING #1',
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt:
        'You are a browser automation agent. Analyze web pages and execute precise UI interactions based on user instructions.',
      tools: ['browser', 'screenshot', 'dom-parser'],
      inputs: [
        { name: 'targetUrl', type: 'string', required: true },
        { name: 'actions', type: 'array', required: true },
        { name: 'extractData', type: 'boolean', required: false },
      ],
      outputs: [
        { name: 'status', type: 'string' },
        { name: 'extractedData', type: 'object' },
        { name: 'screenshots', type: 'array' },
      ],
    },
    kpis: {
      successRate: 95,
      avgTimeSaved: '2 hours/task',
      accuracy: 98,
      avgDuration: '45 seconds',
    },
    tags: ['automation', 'web', 'browser', 'ui-testing'],
    installCount: 2543,
    rating: 490, // 4.9 * 100
    reviewCount: 142,
    installs24h: 89,
    installs7d: 324,
    installs30d: 1247,
    trendingScore: 950,
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date('2025-09-15'),
  },
  {
    name: 'Knowledge RAG Agent',
    slug: 'knowledge-rag-agent',
    description:
      'Answers questions with citations from connected knowledge sources. Uses retrieval-augmented generation to provide accurate, sourced responses with source tiles showing where information came from.',
    shortDescription: 'Answers with citations from connected sources with source tiles',
    category: 'Knowledge',
    type: 'knowledge' as const,
    iconUrl: '📚',
    badgeText: 'POPULAR',
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4-turbo',
      temperature: 0.5,
      maxTokens: 3000,
      systemPrompt:
        'You are a knowledge retrieval agent. Answer questions accurately using only information from provided sources. Always cite your sources.',
      tools: ['vector-search', 'citation-formatter'],
      inputs: [
        { name: 'query', type: 'string', required: true },
        { name: 'sources', type: 'array', required: true },
        { name: 'maxSources', type: 'number', required: false },
      ],
      outputs: [
        { name: 'answer', type: 'string' },
        { name: 'citations', type: 'array' },
        { name: 'confidence', type: 'number' },
      ],
    },
    kpis: {
      successRate: 92,
      avgTimeSaved: '30 min/query',
      accuracy: 96,
      avgDuration: '12 seconds',
    },
    tags: ['knowledge', 'rag', 'search', 'citations'],
    installCount: 1847,
    rating: 480, // 4.8 * 100
    reviewCount: 98,
    installs24h: 42,
    installs7d: 234,
    installs30d: 892,
    trendingScore: 720,
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date('2025-08-20'),
  },
  {
    name: 'Sales GTM Copilot',
    slug: 'sales-gtm-copilot',
    description:
      'Comprehensive sales operations agent handling prospecting, enrichment, CRM updates, and sequence personalization. Automates the entire sales workflow from lead discovery to follow-up.',
    shortDescription: 'Prospecting, enrichment, CRM updates, sequence personalization',
    category: 'Sales',
    type: 'sales' as const,
    iconUrl: '💼',
    badgeText: 'NEW',
    config: {
      aiProvider: 'anthropic' as const,
      model: 'claude-3-opus',
      temperature: 0.7,
      maxTokens: 4000,
      systemPrompt:
        'You are a sales operations copilot. Help with lead research, personalized outreach, and CRM management.',
      tools: ['crm-api', 'linkedin-scraper', 'email-composer'],
      inputs: [
        { name: 'leadData', type: 'object', required: true },
        { name: 'action', type: 'string', required: true },
      ],
      outputs: [
        { name: 'enrichedData', type: 'object' },
        { name: 'personalizedMessage', type: 'string' },
        { name: 'crmUpdates', type: 'array' },
      ],
    },
    kpis: {
      successRate: 88,
      avgTimeSaved: '3 hours/day',
      accuracy: 91,
    },
    tags: ['sales', 'gtm', 'crm', 'prospecting'],
    installCount: 923,
    rating: 470, // 4.7 * 100
    reviewCount: 67,
    installs24h: 28,
    installs7d: 156,
    installs30d: 512,
    trendingScore: 580,
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date('2025-10-01'),
  },
  {
    name: 'Meeting Notes Orchestrator',
    slug: 'meeting-notes-orchestrator',
    description:
      'Transcribes meetings, assigns tasks, and schedules follow-ups automatically. Integrates with calendars and project management tools to ensure nothing falls through the cracks.',
    shortDescription: 'Transcribes, assigns tasks, schedules follow-ups automatically',
    category: 'Productivity',
    type: 'meeting' as const,
    iconUrl: '📝',
    badgeText: null,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4-turbo',
      temperature: 0.4,
      maxTokens: 3500,
      systemPrompt:
        'You are a meeting notes orchestrator. Extract action items, decisions, and key points from meeting transcripts.',
      tools: ['transcription', 'task-creator', 'calendar-api'],
      inputs: [
        { name: 'audio', type: 'file', required: true },
        { name: 'attendees', type: 'array', required: true },
      ],
      outputs: [
        { name: 'transcript', type: 'string' },
        { name: 'actionItems', type: 'array' },
        { name: 'summary', type: 'string' },
      ],
    },
    kpis: {
      successRate: 91,
      avgTimeSaved: '45 min/meeting',
      accuracy: 94,
    },
    tags: ['productivity', 'meetings', 'transcription', 'tasks'],
    installCount: 1567,
    rating: 485, // 4.85 * 100
    reviewCount: 124,
    installs24h: 34,
    installs7d: 198,
    installs30d: 723,
    trendingScore: 650,
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date('2025-09-10'),
  },
  {
    name: 'Cross-App Do-It-For-Me',
    slug: 'cross-app-do-it-for-me',
    description:
      'Executes multi-app requests in one prompt. Coordinates actions across calendar, email, docs, and other tools to complete complex workflows with a single command.',
    shortDescription: 'Executes multi-app requests in one prompt (calendar, email, docs)',
    category: 'Productivity',
    type: 'cross-app' as const,
    iconUrl: '🔗',
    badgeText: null,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.6,
      maxTokens: 3000,
      systemPrompt:
        'You are a cross-app automation agent. Break down complex requests into multi-step workflows across different applications.',
      tools: ['calendar-api', 'email-api', 'docs-api', 'slack-api'],
      inputs: [
        { name: 'request', type: 'string', required: true },
        { name: 'context', type: 'object', required: false },
      ],
      outputs: [
        { name: 'plan', type: 'array' },
        { name: 'results', type: 'object' },
        { name: 'status', type: 'string' },
      ],
    },
    kpis: {
      successRate: 90,
      avgTimeSaved: '1.5 hours/day',
      accuracy: 93,
    },
    tags: ['productivity', 'automation', 'integration', 'workflow'],
    installCount: 1234,
    rating: 475, // 4.75 * 100
    reviewCount: 89,
    installs24h: 23,
    installs7d: 167,
    installs30d: 589,
    trendingScore: 560,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-09-05'),
  },
  {
    name: 'Research & Web Summary',
    slug: 'research-web-summary',
    description:
      'Synthesizes web and internal sources to produce comprehensive briefs with citations. Perfect for market research, competitive analysis, and due diligence.',
    shortDescription: 'Synthesizes web + internal sources; produces brief with citations',
    category: 'Knowledge',
    type: 'research' as const,
    iconUrl: '🔍',
    badgeText: null,
    config: {
      aiProvider: 'anthropic' as const,
      model: 'claude-3-sonnet',
      temperature: 0.5,
      maxTokens: 4000,
      systemPrompt:
        'You are a research agent. Gather information from multiple sources and synthesize comprehensive reports.',
      tools: ['web-search', 'scraper', 'summarizer'],
      inputs: [
        { name: 'topic', type: 'string', required: true },
        { name: 'sources', type: 'array', required: false },
        { name: 'depth', type: 'string', required: false },
      ],
      outputs: [
        { name: 'report', type: 'string' },
        { name: 'sources', type: 'array' },
        { name: 'keyFindings', type: 'array' },
      ],
    },
    kpis: {
      successRate: 87,
      avgTimeSaved: '45 min/query',
      accuracy: 89,
    },
    tags: ['research', 'analysis', 'web', 'citations'],
    installCount: 892,
    rating: 465, // 4.65 * 100
    reviewCount: 76,
    installs24h: 19,
    installs7d: 134,
    installs30d: 445,
    trendingScore: 420,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-09-01'),
  },
  {
    name: 'Code & Data Assistant',
    slug: 'code-data-assistant',
    description:
      'Refactors code, writes tests, reviews PRs, and works with SQL/Notebooks. A full-stack development companion that understands your codebase.',
    shortDescription: 'Refactors code, writes tests, reviews PRs; SQL/Notebooks',
    category: 'Development',
    type: 'code' as const,
    iconUrl: '💻',
    badgeText: null,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4-turbo',
      temperature: 0.3,
      maxTokens: 4000,
      systemPrompt:
        'You are a code assistant. Help with code review, refactoring, test generation, and SQL queries.',
      tools: ['code-parser', 'linter', 'test-generator', 'sql-formatter'],
      inputs: [
        { name: 'code', type: 'string', required: true },
        { name: 'task', type: 'string', required: true },
        { name: 'language', type: 'string', required: false },
      ],
      outputs: [
        { name: 'modifiedCode', type: 'string' },
        { name: 'explanation', type: 'string' },
        { name: 'suggestions', type: 'array' },
      ],
    },
    kpis: {
      successRate: 93,
      avgTimeSaved: '3 hours/day',
      accuracy: 96,
    },
    tags: ['development', 'code', 'testing', 'sql'],
    installCount: 1678,
    rating: 480, // 4.8 * 100
    reviewCount: 134,
    installs24h: 37,
    installs7d: 212,
    installs30d: 789,
    trendingScore: 680,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-08-25'),
  },
  {
    name: 'Data Extraction Agent',
    slug: 'data-extraction-agent',
    description:
      'Monitors pages, extracts structured data, and pushes to Sheets/DB. Perfect for competitive intelligence, price monitoring, and lead generation.',
    shortDescription: 'Monitors pages, extracts structured data, pushes to Sheets/DB',
    category: 'Data',
    type: 'data' as const,
    iconUrl: '📊',
    badgeText: null,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2500,
      systemPrompt:
        'You are a data extraction agent. Extract structured information from web pages and documents.',
      tools: ['scraper', 'parser', 'sheets-api', 'db-connector'],
      inputs: [
        { name: 'url', type: 'string', required: true },
        { name: 'schema', type: 'object', required: true },
        { name: 'destination', type: 'string', required: true },
      ],
      outputs: [
        { name: 'extractedData', type: 'array' },
        { name: 'recordsCreated', type: 'number' },
        { name: 'status', type: 'string' },
      ],
    },
    kpis: {
      successRate: 94,
      avgTimeSaved: '5 hours/week',
      accuracy: 97,
    },
    tags: ['data', 'extraction', 'scraping', 'automation'],
    installCount: 1123,
    rating: 470, // 4.7 * 100
    reviewCount: 98,
    installs24h: 21,
    installs7d: 145,
    installs30d: 523,
    trendingScore: 490,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-09-12'),
  },
  {
    name: 'Trust & Security Checker',
    slug: 'trust-security-checker',
    description:
      'Runs static checks on agents to show security grade and remediation steps. Ensures your AI agents follow best practices and security guidelines.',
    shortDescription: 'Runs static checks on agents; shows grade and remediation',
    category: 'Security',
    type: 'security' as const,
    iconUrl: '🔒',
    badgeText: 'NEW',
    config: {
      aiProvider: 'anthropic' as const,
      model: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 3000,
      systemPrompt:
        'You are a security auditor. Analyze agent configurations for security vulnerabilities and best practices.',
      tools: ['security-scanner', 'compliance-checker'],
      inputs: [
        { name: 'agentConfig', type: 'object', required: true },
        { name: 'checkLevel', type: 'string', required: false },
      ],
      outputs: [
        { name: 'grade', type: 'string' },
        { name: 'issues', type: 'array' },
        { name: 'recommendations', type: 'array' },
      ],
    },
    kpis: {
      successRate: 96,
      avgTimeSaved: '30 min/agent',
      accuracy: 98,
    },
    tags: ['security', 'audit', 'compliance', 'best-practices'],
    installCount: 567,
    rating: 455, // 4.55 * 100
    reviewCount: 42,
    installs24h: 15,
    installs7d: 89,
    installs30d: 287,
    trendingScore: 380,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-10-05'),
  },
  {
    name: 'Trending Ranking Agent',
    slug: 'trending-ranking-agent',
    description:
      'Computes Trending/Top leaderboards for Agents/Packs based on install velocity, ratings, and engagement metrics.',
    shortDescription: 'Computes Trending/Top leaderboards for Agents/Packs',
    category: 'Analytics',
    type: 'trending' as const,
    iconUrl: '📈',
    badgeText: null,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.1,
      maxTokens: 2000,
      systemPrompt:
        'You are a trending analytics agent. Calculate trending scores and rankings based on metrics.',
      tools: ['analytics-api', 'metrics-calculator'],
      inputs: [
        { name: 'timeWindow', type: 'string', required: true },
        { name: 'entityType', type: 'string', required: true },
      ],
      outputs: [
        { name: 'rankings', type: 'array' },
        { name: 'trendingScores', type: 'object' },
        { name: 'insights', type: 'array' },
      ],
    },
    kpis: {
      successRate: 99,
      avgTimeSaved: '2 hours/week',
      accuracy: 99,
    },
    tags: ['analytics', 'trending', 'metrics', 'ranking'],
    installCount: 734,
    rating: 460, // 4.6 * 100
    reviewCount: 54,
    installs24h: 12,
    installs7d: 78,
    installs30d: 312,
    trendingScore: 350,
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date('2025-09-18'),
  },
];

async function seedTemplates() {
  try {
    console.log('🌱 Starting to seed agent templates...\n');

    // Check if templates already exist
    const existing = await db.select().from(agentTemplates).limit(1);

    if (existing.length > 0) {
      console.log('⚠️  Templates already exist. Skipping seed.');
      console.log('   To re-seed, delete existing templates first.\n');
      return;
    }

    // Insert all templates
    const inserted = await db.insert(agentTemplates).values(templates).returning();

    console.log(`✅ Successfully seeded ${inserted.length} agent templates!\n`);
    console.log('Templates created:');
    inserted.forEach((template, i) => {
      console.log(`  ${i + 1}. ${template.name} (${template.slug})`);
      console.log(`     - Category: ${template.category}`);
      console.log(
        `     - Rating: ${(template.rating! / 100).toFixed(2)}⭐ (${template.reviewCount} reviews)`,
      );
      console.log(`     - Installs: ${template.installCount}`);
      console.log('');
    });

    console.log('🎉 Seed completed successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    throw error;
  }
}

// Run the seed
seedTemplates()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
