/**
 * Database Seed Script
 *
 * Populates database with sample data for testing and demonstration.
 * Run with: npx tsx scripts/database/seed-database.ts
 *
 * SECURITY: This script creates test data. DO NOT run in production!
 */

// Load environment variables FIRST (before any imports)
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
console.log('📄 Loading environment from:', envPath);
dotenv.config({ path: envPath });

// Now import database after env is loaded
import { db } from '../../packages/database/src/client.js';
import {
  users,
  workspaces,
  workspaceMembers,
  agents,
  agentTemplates,
  knowledgeItems,
  knowledgeCollections,
} from '../../packages/database/src/schema.js';
import { eq } from 'drizzle-orm';

// Get Clerk user ID from environment or use default
// Set CLERK_USER_ID_FOR_SEED in .env.local to your actual Clerk user ID
const CLERK_USER_ID = process.env.CLERK_USER_ID_FOR_SEED || 'user_test_owner_1';

console.log('🌱 Using Clerk User ID for seed:', CLERK_USER_ID);

// Sample user data
const SAMPLE_USERS = [
  {
    clerkUserId: CLERK_USER_ID,
    email: 'demo@galaxyco.ai',
    firstName: 'Demo',
    lastName: 'User',
    avatarUrl: null,
  },
  {
    clerkUserId: 'user_test_member_1',
    email: 'member@galaxyco-test.com',
    firstName: 'Test',
    lastName: 'Member',
    avatarUrl: null,
  },
];

// Sample workspace data
const SAMPLE_WORKSPACE = {
  name: 'Test Workspace',
  slug: 'test-workspace-demo',
  subscriptionTier: 'professional' as const,
  subscriptionStatus: 'active',
  settings: {
    branding: {
      primaryColor: '#6366f1',
    },
    features: {
      ai_provider: 'openai',
      max_agents: 50,
    },
  },
};

// Sample agents with various configurations
const SAMPLE_AGENTS = [
  {
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and provides instant support',
    type: 'custom' as const,
    status: 'active' as const,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt:
        'You are a helpful customer support agent. Be friendly, professional, and solution-oriented.',
      tools: [],
      triggers: [{ type: 'webhook', config: {} }],
      knowledgeBase: {
        enabled: true,
        scope: 'all' as const,
        collectionIds: [],
        maxResults: 5,
      },
    },
  },
  {
    name: 'Lead Qualifier',
    description: 'Qualifies incoming leads and scores them based on fit',
    type: 'sales' as const,
    status: 'active' as const,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 800,
      systemPrompt:
        'You are a sales qualification agent. Ask relevant questions to assess lead quality and provide a qualification score.',
      tools: [],
      triggers: [{ type: 'manual', config: {} }],
      knowledgeBase: {
        enabled: false,
        scope: 'all' as const,
        collectionIds: [],
        maxResults: 5,
      },
    },
  },
  {
    name: 'Content Summarizer',
    description: 'Summarizes long documents and extracts key insights',
    type: 'content' as const,
    status: 'active' as const,
    config: {
      aiProvider: 'anthropic' as const,
      model: 'claude-3-sonnet',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt:
        'You are a content summarization expert. Extract key points and create concise, actionable summaries.',
      tools: [],
      triggers: [{ type: 'manual', config: {} }],
      knowledgeBase: {
        enabled: false,
        scope: 'all' as const,
        collectionIds: [],
        maxResults: 5,
      },
    },
  },
  {
    name: 'Meeting Notes Generator',
    description: 'Generates structured meeting notes from transcripts',
    type: 'meeting' as const,
    status: 'draft' as const,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.4,
      maxTokens: 1500,
      systemPrompt:
        'You generate structured meeting notes. Include key decisions, action items, and next steps.',
      tools: [],
      triggers: [{ type: 'schedule', config: {} }],
      knowledgeBase: {
        enabled: false,
        scope: 'all' as const,
        collectionIds: [],
        maxResults: 5,
      },
    },
  },
  {
    name: 'Code Review Assistant',
    description: 'Reviews code changes and provides improvement suggestions',
    type: 'code' as const,
    status: 'paused' as const,
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2000,
      systemPrompt:
        'You are a code review expert. Analyze code for bugs, performance issues, and best practices.',
      tools: [],
      triggers: [{ type: 'event', config: {} }],
      knowledgeBase: {
        enabled: true,
        scope: 'collections' as const,
        collectionIds: [],
        maxResults: 10,
      },
    },
  },
];

// Sample agent templates for marketplace
const SAMPLE_TEMPLATES = [
  {
    name: 'Email Support Agent',
    slug: 'email-support-agent',
    description: 'Automatically respond to customer emails with intelligent, context-aware replies',
    shortDescription: 'AI-powered email support automation',
    category: 'customer-support',
    type: 'email' as const,
    iconUrl: null,
    coverImageUrl: null,
    badgeText: 'Popular',
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'You are a professional email support agent. Write clear, helpful responses.',
      tools: ['email-integration'],
      triggers: [{ type: 'webhook', config: {} }],
    },
    kpis: {
      successRate: 94,
      avgTimeSaved: '45 minutes/day',
      accuracy: 92,
      avgDuration: '3 seconds',
    },
    authorName: 'GalaxyCo Team',
    tags: ['email', 'support', 'automation'],
    installCount: 1247,
    rating: 480,
    reviewCount: 89,
    installs24h: 15,
    installs7d: 78,
    installs30d: 312,
    trendingScore: 95,
    isPublished: true,
    isFeatured: true,
  },
  {
    name: 'Sales Lead Scorer',
    slug: 'sales-lead-scorer',
    description: 'Automatically score and qualify sales leads based on conversation data',
    shortDescription: 'AI lead qualification and scoring',
    category: 'sales',
    type: 'sales' as const,
    iconUrl: null,
    coverImageUrl: null,
    badgeText: 'Trending',
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 800,
      systemPrompt: 'You are a sales qualification expert. Assess leads and provide scores.',
      tools: ['crm-integration'],
      triggers: [{ type: 'webhook', config: {} }],
    },
    kpis: {
      successRate: 88,
      avgTimeSaved: '2 hours/week',
      accuracy: 85,
      avgDuration: '5 seconds',
    },
    authorName: 'GalaxyCo Team',
    tags: ['sales', 'leads', 'qualification'],
    installCount: 892,
    rating: 455,
    reviewCount: 67,
    installs24h: 22,
    installs7d: 94,
    installs30d: 287,
    trendingScore: 98,
    isPublished: true,
    isFeatured: true,
  },
  {
    name: 'Document Q&A Agent',
    slug: 'document-qa-agent',
    description: 'Answer questions about uploaded documents using AI-powered search',
    shortDescription: 'Intelligent document Q&A',
    category: 'knowledge',
    type: 'knowledge' as const,
    iconUrl: null,
    coverImageUrl: null,
    badgeText: 'New',
    config: {
      aiProvider: 'openai' as const,
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1200,
      systemPrompt: 'You answer questions based on document context. Be accurate and cite sources.',
      tools: ['vector-search'],
      triggers: [{ type: 'manual', config: {} }],
    },
    kpis: {
      successRate: 91,
      avgTimeSaved: '30 minutes/query',
      accuracy: 89,
      avgDuration: '2 seconds',
    },
    authorName: 'GalaxyCo Team',
    tags: ['knowledge', 'documents', 'qa'],
    installCount: 543,
    rating: 465,
    reviewCount: 34,
    installs24h: 18,
    installs7d: 67,
    installs30d: 156,
    trendingScore: 87,
    isPublished: true,
    isFeatured: false,
  },
];

// Sample knowledge collections
const SAMPLE_COLLECTIONS = [
  {
    name: 'Product Documentation',
    description: 'Official product documentation and guides',
    icon: '📚',
  },
  {
    name: 'Customer FAQs',
    description: 'Frequently asked questions from customers',
    icon: '❓',
  },
  {
    name: 'Company Policies',
    description: 'Internal policies and procedures',
    icon: '📋',
  },
];

// Sample knowledge items
const SAMPLE_KNOWLEDGE_ITEMS = [
  {
    title: 'Getting Started Guide',
    type: 'document' as const,
    status: 'ready' as const,
    content: 'This is a comprehensive getting started guide for new users...',
    fileName: 'getting-started.pdf',
    fileSize: 245000,
    tags: ['onboarding', 'guide'],
    isFavorite: true,
  },
  {
    title: 'API Documentation',
    type: 'url' as const,
    status: 'ready' as const,
    content: 'Complete API reference documentation...',
    sourceUrl: 'https://docs.example.com/api',
    tags: ['api', 'developer'],
    isFavorite: false,
  },
  {
    title: 'Troubleshooting Common Issues',
    type: 'text' as const,
    status: 'ready' as const,
    content: 'Common issues and their solutions...',
    tags: ['troubleshooting', 'support'],
    isFavorite: false,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Create users
    console.log('Creating users...');
    const createdUsers = [];

    for (const userData of SAMPLE_USERS) {
      // Check if user already exists
      const existing = await db.query.users.findFirst({
        where: eq(users.clerkUserId, userData.clerkUserId),
      });

      if (existing) {
        console.log(`  ✓ User ${userData.email} already exists`);
        createdUsers.push(existing);
      } else {
        const [user] = await db.insert(users).values(userData).returning();
        console.log(`  ✓ Created user: ${user.email}`);
        createdUsers.push(user);
      }
    }

    // 2. Create workspace
    console.log('\nCreating workspace...');
    const existingWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, SAMPLE_WORKSPACE.slug),
    });

    let workspace;
    if (existingWorkspace) {
      console.log(`  ✓ Workspace "${SAMPLE_WORKSPACE.name}" already exists`);
      workspace = existingWorkspace;
    } else {
      [workspace] = await db.insert(workspaces).values(SAMPLE_WORKSPACE).returning();
      console.log(`  ✓ Created workspace: ${workspace.name}`);
    }

    // 3. Create workspace memberships
    console.log('\nCreating workspace memberships...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const role = i === 0 ? 'owner' : 'member';

      // Check if membership exists
      const existingMembership = await db.query.workspaceMembers.findFirst({
        where: (members, { and, eq }) =>
          and(eq(members.workspaceId, workspace.id), eq(members.userId, user.id)),
      });

      if (existingMembership) {
        console.log(`  ✓ Membership for ${user.email} already exists`);
      } else {
        await db.insert(workspaceMembers).values({
          workspaceId: workspace.id,
          userId: user.id,
          role: role as 'owner' | 'member',
          isActive: true,
        });
        console.log(`  ✓ Created membership: ${user.email} as ${role}`);
      }
    }

    // 4. Create agents
    console.log('\nCreating sample agents...');
    const owner = createdUsers[0];

    for (const agentData of SAMPLE_AGENTS) {
      // Check if agent already exists
      const existingAgent = await db.query.agents.findFirst({
        where: (agents, { and, eq }) =>
          and(eq(agents.workspaceId, workspace.id), eq(agents.name, agentData.name)),
      });

      if (existingAgent) {
        console.log(`  ✓ Agent "${agentData.name}" already exists`);
      } else {
        await db.insert(agents).values({
          ...agentData,
          workspaceId: workspace.id,
          createdBy: owner.id,
          isCustom: true,
        });
        console.log(`  ✓ Created agent: ${agentData.name}`);
      }
    }

    // 5. Create agent templates
    console.log('\nCreating marketplace templates...');

    for (const templateData of SAMPLE_TEMPLATES) {
      // Check if template already exists
      const existingTemplate = await db.query.agentTemplates.findFirst({
        where: eq(agentTemplates.slug, templateData.slug),
      });

      if (existingTemplate) {
        console.log(`  ✓ Template "${templateData.name}" already exists`);
      } else {
        await db.insert(agentTemplates).values({
          ...templateData,
          authorId: owner.id,
          publishedAt: new Date(),
        });
        console.log(`  ✓ Created template: ${templateData.name}`);
      }
    }

    // 6. Create knowledge collections
    console.log('\nCreating knowledge collections...');
    const createdCollections = [];

    for (const collectionData of SAMPLE_COLLECTIONS) {
      // Check if collection already exists
      const existingCollection = await db.query.knowledgeCollections.findFirst({
        where: (collections, { and, eq }) =>
          and(eq(collections.workspaceId, workspace.id), eq(collections.name, collectionData.name)),
      });

      if (existingCollection) {
        console.log(`  ✓ Collection "${collectionData.name}" already exists`);
        createdCollections.push(existingCollection);
      } else {
        const [collection] = await db
          .insert(knowledgeCollections)
          .values({
            ...collectionData,
            workspaceId: workspace.id,
            createdBy: owner.id,
          })
          .returning();
        console.log(`  ✓ Created collection: ${collection.name}`);
        createdCollections.push(collection);
      }
    }

    // 7. Create knowledge items
    console.log('\nCreating knowledge items...');

    for (let i = 0; i < SAMPLE_KNOWLEDGE_ITEMS.length; i++) {
      const itemData = SAMPLE_KNOWLEDGE_ITEMS[i];
      const collection = createdCollections[i % createdCollections.length];

      // Check if item already exists
      const existingItem = await db.query.knowledgeItems.findFirst({
        where: (items, { and, eq }) =>
          and(eq(items.workspaceId, workspace.id), eq(items.title, itemData.title)),
      });

      if (existingItem) {
        console.log(`  ✓ Knowledge item "${itemData.title}" already exists`);
      } else {
        await db.insert(knowledgeItems).values({
          ...itemData,
          workspaceId: workspace.id,
          collectionId: collection.id,
          uploadedBy: owner.id,
        });
        console.log(`  ✓ Created knowledge item: ${itemData.title}`);
      }
    }

    console.log('\n✅ Database seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Workspace: ${workspace.name}`);
    console.log(`   - Agents: ${SAMPLE_AGENTS.length}`);
    console.log(`   - Templates: ${SAMPLE_TEMPLATES.length}`);
    console.log(`   - Collections: ${createdCollections.length}`);
    console.log(`   - Knowledge Items: ${SAMPLE_KNOWLEDGE_ITEMS.length}`);
    console.log('\n🎉 Your database is ready for testing!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log('👋 Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });
