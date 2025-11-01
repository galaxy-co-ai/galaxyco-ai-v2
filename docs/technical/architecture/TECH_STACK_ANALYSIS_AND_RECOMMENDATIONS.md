# GalaxyCo.ai Tech Stack Analysis & Recommendations

**Date:** October 14, 2025  
**Purpose:** Document current tech stack and provide recommendations for the 10 strategic questions  
**Status:** Complete analysis ready for decision-making

---

## 📊 CURRENT TECH STACK (What You Already Have)

### ✅ Frontend (Confirmed)

**Framework & UI:**

- ✅ **Next.js 14** (App Router) - Modern React framework
- ✅ **React 18** - UI library
- ✅ **TypeScript 5.5** - Type safety
- ✅ **Tailwind CSS 3.4** - Utility-first styling
- ✅ **shadcn/ui** (Radix UI components) - Accessible component primitives

**State Management:**

- ✅ **React Context API** (SidebarContext) - Currently using for global state
- ⚠️ **NO Zustand or Redux** - Not installed yet
- ✅ **React Query/TanStack Query** - Mentioned in docs but not in package.json yet

**Icons & Utilities:**

- ✅ **Lucide React** - Icon library
- ✅ **class-variance-authority** - Component variants
- ✅ **clsx + tailwind-merge** - Conditional classes

---

### ✅ Backend (Planned but Incomplete)

**API Layer:**

- 📋 **NestJS** - Mentioned in docs, but `apps/api` directory exists but package.json not reviewed
- 📋 **Python FastAPI** - Mentioned for agents (`services/agents`)
- 📋 **WebSocket support** - Planned via NestJS

**Current Status:**

- ✅ Frontend is built and running
- ⚠️ Backend APIs are partially implemented
- ⚠️ Python agent service exists but needs integration work

---

### ✅ Database & Storage (Confirmed)

**Primary Database:**

- ✅ **PostgreSQL with pgvector** - For structured data + vector embeddings
- ✅ **Neon Database** - Serverless Postgres hosting (MVP choice)
- ✅ **Drizzle ORM** - TypeScript ORM for database operations

**Cache:**

- ✅ **Redis** - Session caching, rate limiting
- ✅ **Upstash Redis** - Serverless Redis hosting (MVP choice)

**File Storage:**

- ✅ **Vercel Blob** - For file uploads (installed: `@vercel/blob`)
- 📋 **AWS S3** - Mentioned for production scaling

---

### ✅ Authentication (Confirmed)

- ✅ **Clerk** - User authentication & authorization
- 📋 **WorkOS** - Planned for enterprise SSO/SCIM (future)

---

### ✅ AI & LLM Infrastructure (Confirmed)

**LLM Providers:**

- ✅ **OpenAI** - Primary AI provider (GPT-4, GPT-4o-mini)
- ✅ **Anthropic Claude** - Secondary option
- ✅ **Google Gemini** - Tertiary option

**AI SDKs:**

- ✅ **Vercel AI SDK** (`ai` package) - Unified LLM interface
- ✅ **@ai-sdk/openai** - OpenAI integration
- ✅ **@ai-sdk/anthropic** - Anthropic integration
- ✅ **@ai-sdk/google** - Google integration

**Vector Database:**

- ✅ **pgvector** (PostgreSQL extension) - Vector embeddings in same database
- ❌ **NO Pinecone/Weaviate** - Using Postgres for everything (good for MVP)

**Agent Framework:**

- 📋 **LangGraph** - Mentioned for Python agents
- ⚠️ **No LangChain detected** - Using custom implementation

---

### ✅ Observability & Monitoring (Confirmed)

- ✅ **Sentry** - Error tracking (`@sentry/nextjs`)
- 📋 **Datadog/Grafana** - Planned for metrics (not installed yet)
- 📋 **PostHog** - Planned for analytics (not installed yet)

---

### ✅ Hosting & Infrastructure (Confirmed)

**Frontend:**

- ✅ **Vercel** - Next.js hosting (auto-deploys from GitHub)

**Backend:**

- 📋 **AWS ECS Fargate** - Planned for NestJS API + Python agents
- ⚠️ **Not deployed yet** - Still in development

**Monorepo Management:**

- ✅ **Turborepo** - Build orchestration
- ✅ **pnpm workspaces** - Package management

---

### ✅ Developer Tools (Confirmed)

- ✅ **Playwright** - E2E testing
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **Husky** - Git hooks
- ✅ **Commitlint** - Commit message standards
- ✅ **TypeScript strict mode** - Type safety

---

### ✅ Utilities & Libraries (Confirmed)

- ✅ **Cheerio** - Web scraping (for company websites)
- ✅ **pdf-parse** - PDF text extraction (for knowledge base)
- ✅ **nanoid** - Unique ID generation
- ✅ **cmdk** - Command palette (likely for search/command input)
- ✅ **svix** - Webhook infrastructure
- ✅ **sonner** - Toast notifications

---

## 🚨 WHAT YOU DON'T HAVE YET (Critical Gaps)

### ❌ Missing: Job Queue System

**Current State:** No background job processing

**Options:**

- **Option A: BullMQ** (mentioned in docs, not installed)
- **Option B: Trigger.dev** ⭐ **RECOMMENDED** (from your external context)
- **Option C: Inngest** (alternative to Trigger.dev)

**Recommendation: Trigger.dev** because:

- ✅ Built for AI workflows
- ✅ TypeScript-native (matches your stack)
- ✅ Long-running tasks with retries
- ✅ Observability built-in
- ✅ Elastic scaling
- ✅ You were already researching it (external context)

---

### ❌ Missing: Email Sending

**Current State:** No email infrastructure

**Options for Outreach Agent:**

- **Option A: Gmail API** (OAuth required, free, user's own email)
- **Option B: Resend** ⭐ **RECOMMENDED** ($20/month, 3k emails free, great DX)
- **Option C: SendGrid** ($15/month, 100 emails/day free)

**Recommendation: Resend** because:

- ✅ Best developer experience
- ✅ React Email integration
- ✅ 3,000 emails/month free
- ✅ After free tier: $20/month for 50k emails
- ✅ Built by Vercel ecosystem developers

---

### ❌ Missing: LinkedIn/Lead Data Source

**Current State:** No lead enrichment data source

**Options for Lead Intel Agent:**

- **Option A: RapidAPI LinkedIn Scraper** (~$50-100/month, 1000 requests)
- **Option B: Bright Data** (~$500/month, reliable but expensive)
- **Option C: Apollo.io API** ⭐ **RECOMMENDED** ($49/month, 1000 leads/month)
- **Option D: Manual user input only** (free, limits autonomy)

**Recommendation: Apollo.io API** because:

- ✅ Legal and compliant (unlike scrapers)
- ✅ Structured data (name, title, company, email)
- ✅ $49/month for 1,000 credits = 1,000 leads
- ✅ Better data quality than scrapers
- ✅ Includes company info + tech stack
- ⚠️ Requires API key (but most affordable legal option)

**Fallback Plan:**

- Start with **manual user input only** (free)
- Add Apollo.io when you have 10+ paying customers

---

### ❌ Missing: CRM Integration

**Current State:** No CRM connections

**Options for CRM Sync Agent:**

- **Option A: HubSpot API** ⭐ **RECOMMENDED** (free tier, good docs, widely used)
- **Option B: Salesforce API** (complex, enterprise-focused)
- **Option C: Pipedrive API** (simple, startup-friendly)
- **Option D: None (V1)** - Show updates in UI, let user copy/paste

**Recommendation: Start with Option D (None for V1)** because:

- ✅ Zero integration complexity
- ✅ Proves value first (agent extracts data correctly)
- ✅ Users can manually copy to their CRM
- ✅ Add HubSpot API in V1.1 after validation

**When you add HubSpot:**

- Use `@hubspot/api-client` npm package
- OAuth flow for user's HubSpot account
- Free tier supports up to 1 million API calls/day

---

### ❌ Missing: Analytics

**Current State:** No user analytics tracking

**Options:**

- **Option A: PostHog** ⭐ **RECOMMENDED** (open source, self-hostable, generous free tier)
- **Option B: Mixpanel** (expensive after free tier)
- **Option C: Amplitude** (good for product analytics)

**Recommendation: PostHog** because:

- ✅ 1 million events/month free
- ✅ Product analytics + session replay + feature flags
- ✅ Open source (can self-host if needed)
- ✅ Built-in A/B testing

---

## 🎯 RECOMMENDATIONS BY USE CASE

### For Lead Intel Agent

**Data Sources (Priority Order):**

1. **Company Website Scraping** (Already have Cheerio ✅)
   - Cost: $0
   - Implementation: Use Cheerio to extract company info
   - Limitation: Only public info

2. **Apollo.io API** (Recommended paid option)
   - Cost: $49/month (1000 leads)
   - Implementation: REST API, easy integration
   - Data: Name, title, company, email, phone, LinkedIn URL

3. **Google News API** (Free)
   - Cost: $0
   - Implementation: Search recent company news
   - Data: Funding, expansions, hiring

4. **Knowledge Base** (Already building this ✅)
   - Cost: $0
   - Implementation: Vector search with pgvector
   - Data: User's ICP definitions, competitor info

**Recommended V1 Stack:**

```
User inputs: LinkedIn URL or company domain
↓
1. Scrape company website (Cheerio)
2. Search company news (Google Custom Search API - 100 free queries/day)
3. Check knowledge base for ICP match (pgvector)
4. Generate AI summary (OpenAI)
↓
Output: Enriched lead profile
```

**Cost:** ~$0-5/month (only if exceed Google free tier)

---

### For Outreach Writer Agent

**Infrastructure:**

1. **Resend** for email sending
   - Cost: Free for 3k emails/month, then $20/month
   - Implementation: Simple REST API
   - Features: Email templates, tracking, deliverability

2. **OpenAI GPT-4o-mini** for email generation
   - Cost: $0.15 per 1M input tokens, $0.60 per 1M output tokens
   - ~200 word email = ~300 tokens = $0.0002 per email
   - 1000 emails = $0.20

3. **Knowledge Base** for case studies/templates
   - Cost: $0 (already building)
   - Implementation: Vector search for relevant examples

**Recommended V1 Stack:**

```
User provides: Lead profile + product description
↓
1. Query knowledge base for relevant case studies (pgvector)
2. Generate personalized email (OpenAI GPT-4o-mini)
3. Show email in UI for user to copy
   (Optional: Send via Resend if user connects email)
↓
Output: Personalized email draft
```

**Cost:** ~$20-25/month (mostly Resend after free tier)

---

### For CRM Sync Agent

**Recommendation: Start WITHOUT CRM integration**

**V1 Implementation:**

```
User provides: Email thread or meeting notes
↓
1. Extract key info using OpenAI (structured output)
   - Next steps
   - Action items
   - Pain points mentioned
   - Decision timeline
   - Competitors mentioned
2. Display extracted data in clean UI
3. Provide "Copy to CRM" button (user manually pastes)
↓
Output: Structured CRM update
```

**V1.1 (After Validation):**

- Add HubSpot OAuth integration
- Auto-populate CRM fields via API
- Cost: $0 (HubSpot API free tier)

---

## 💰 BUDGET ANALYSIS

### Current Monthly Costs (MVP)

| Service           | Cost/Month        | Usage                              |
| ----------------- | ----------------- | ---------------------------------- |
| **Neon Database** | $0-19             | Free tier → $19 (1 GB storage)     |
| **Upstash Redis** | $0-10             | Free tier → $10 (10k commands/day) |
| **Vercel**        | $0-20             | Hobby free → Pro $20               |
| **Clerk**         | $0-25             | Free tier → $25 (10k MAU)          |
| **OpenAI API**    | $20-50            | GPT-4o-mini usage                  |
| **Resend**        | $0-20             | Free 3k emails → $20               |
| **Trigger.dev**   | $0-20             | Free tier → $20 (100k executions)  |
| **Apollo.io**     | $49               | 1000 lead credits                  |
| **Sentry**        | $0                | Free tier (5k events)              |
| **PostHog**       | $0                | Free tier (1M events)              |
| **Total**         | **$89-213/month** | Scales with usage                  |

### Budget Phases

**Phase 1: MVP (0-10 customers)**

- Actual cost: $20-50/month (OpenAI API only)
- Use all free tiers
- Manual lead input (skip Apollo.io)
- Total: **~$30/month**

**Phase 2: Early Adopters (10-50 customers)**

- Add Apollo.io: +$49
- Add Resend: +$20
- Add Trigger.dev: +$20
- Total: **~$120/month**

**Phase 3: Growth (50-200 customers)**

- Upgrade Neon: +$19
- Upgrade Upstash: +$10
- Upgrade Vercel: +$20
- Upgrade Clerk: +$25
- Total: **~$195/month**

**This fits your $200-300/month budget! ✅**

---

## 🏗️ RECOMMENDED ARCHITECTURE (V1)

### Complete Tech Stack for Sales Team Agents

```
┌─────────────────────────────────────────────────┐
│              USER BROWSER                        │
│  (Next.js 14 + React + TypeScript + Tailwind)  │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓ HTTPS
┌─────────────────────────────────────────────────┐
│              VERCEL EDGE                         │
│  • Next.js API Routes                           │
│  • Edge Middleware (Auth)                       │
│  • Static Assets                                │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
┌────────────────┐  ┌────────────────────┐
│   CLERK AUTH   │  │  TRIGGER.DEV       │
│  (User Login)  │  │  (Background Jobs) │
└────────────────┘  └──────────┬─────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────┐
│           AGENT EXECUTION LAYER                  │
│  • Lead Intel Agent                             │
│  • Outreach Writer Agent                        │
│  • CRM Sync Agent                               │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┐
        ↓                   ↓             ↓
┌──────────────┐  ┌──────────────┐  ┌─────────────┐
│  OPENAI API  │  │  APOLLO.IO   │  │  RESEND     │
│  (GPT-4o)    │  │  (Lead Data) │  │  (Email)    │
└──────────────┘  └──────────────┘  └─────────────┘
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
┌────────────────┐  ┌────────────────┐
│  NEON DB       │  │  UPSTASH REDIS │
│  (Postgres +   │  │  (Cache)       │
│   pgvector)    │  │                │
└────────────────┘  └────────────────┘
```

---

## 🚀 IMPLEMENTATION PRIORITIES

### Phase 1: Core Infrastructure (Week 1-2)

**Already Done:**

- ✅ Next.js frontend
- ✅ Clerk authentication
- ✅ Neon database + Drizzle ORM
- ✅ Vercel hosting

**To Do:**

- [ ] Set up Trigger.dev account
- [ ] Install Trigger.dev SDK: `npm install @trigger.dev/sdk`
- [ ] Configure Trigger.dev for agent execution
- [ ] Set up PostHog analytics
- [ ] Configure Resend for email (create account, get API key)

---

### Phase 2: Lead Intel Agent (Week 2-3)

**Implementation:**

```typescript
// trigger/lead-intel-agent.ts
import { task } from '@trigger.dev/sdk/v3';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

export const enrichLead = task({
  id: 'enrich-lead',
  run: async (payload: { linkedinUrl: string; companyDomain: string }) => {
    // 1. Scrape company website
    const companyInfo = await scrapeWebsite(payload.companyDomain);

    // 2. Search recent news (Google Custom Search API)
    const recentNews = await searchNews(payload.companyDomain);

    // 3. Check knowledge base for ICP match
    const icpMatch = await checkKnowledgeBase(companyInfo);

    // 4. Generate AI summary
    const openai = new OpenAI();
    const summary = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a sales research assistant. Analyze this lead data and create a profile.',
        },
        {
          role: 'user',
          content: JSON.stringify({ companyInfo, recentNews, icpMatch }),
        },
      ],
    });

    return {
      profile: summary.choices[0].message.content,
      companyInfo,
      recentNews,
      icpMatch,
    };
  },
});
```

**Dependencies:**

- ✅ Cheerio (already installed)
- [ ] Google Custom Search API (free 100 queries/day)
- ✅ OpenAI (already installed)

---

### Phase 3: Outreach Writer Agent (Week 3-4)

**Implementation:**

```typescript
// trigger/outreach-writer-agent.ts
import { task } from '@trigger.dev/sdk/v3';
import OpenAI from 'openai';
import { Resend } from 'resend';

export const generateOutreach = task({
  id: 'generate-outreach',
  run: async (payload: { leadProfile: any; productDescription: string; userEmail: string }) => {
    // 1. Query knowledge base for relevant case studies
    const caseStudies = await findRelevantCaseStudies(payload.leadProfile.industry);

    // 2. Generate personalized email
    const openai = new OpenAI();
    const email = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate a personalized cold email. 150-200 words. Professional tone.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            lead: payload.leadProfile,
            product: payload.productDescription,
            examples: caseStudies,
          }),
        },
      ],
    });

    // 3. Return email draft (don't send yet - show in UI)
    return {
      emailBody: email.choices[0].message.content,
      subject: generateSubjectLine(payload.leadProfile),
      preview: true, // User must approve before sending
    };
  },
});
```

**Dependencies:**

- ✅ OpenAI (already installed)
- [ ] Resend: `npm install resend`

---

### Phase 4: CRM Sync Agent (Week 4-5)

**Implementation (V1 - No CRM integration):**

```typescript
// trigger/crm-sync-agent.ts
import { task } from '@trigger.dev/sdk/v3';
import OpenAI from 'openai';

export const syncCRM = task({
  id: 'sync-crm',
  run: async (payload: { emailThread?: string; meetingNotes?: string }) => {
    // Use structured output to extract CRM fields
    const openai = new OpenAI();
    const extraction = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract CRM-relevant information from this conversation.',
        },
        {
          role: 'user',
          content: payload.emailThread || payload.meetingNotes || '',
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'crm_update',
          schema: {
            type: 'object',
            properties: {
              nextSteps: { type: 'array', items: { type: 'string' } },
              painPoints: { type: 'array', items: { type: 'string' } },
              timeline: { type: 'string' },
              competitors: { type: 'array', items: { type: 'string' } },
              dealStage: { type: 'string' },
            },
          },
        },
      },
    });

    // Return structured data for user to copy to CRM
    return JSON.parse(extraction.choices[0].message.content);
  },
});
```

---

## 📝 FINAL RECOMMENDATIONS SUMMARY

### What to Use (Confirmed):

**Already Good:**

- ✅ Next.js 14 + React + TypeScript + Tailwind
- ✅ Clerk for auth
- ✅ Neon (Postgres + pgvector)
- ✅ Upstash Redis
- ✅ OpenAI for LLMs
- ✅ Vercel for hosting
- ✅ Drizzle ORM

**Add These (Critical):**

- 🔥 **Trigger.dev** - Background jobs for agent execution
- 🔥 **Resend** - Email sending ($0-20/month)
- 🔥 **PostHog** - Analytics (free tier)
- 💰 **Apollo.io** - Lead data (optional, $49/month, add after 10 customers)

**DON'T Add (Yet):**

- ❌ BullMQ - Use Trigger.dev instead
- ❌ Pinecone - pgvector is enough for MVP
- ❌ Salesforce integration - Too complex for V1
- ❌ Bright Data scraping - Too expensive for MVP

---

### Budget Reality Check:

**Month 1-2 (MVP):** ~$30/month

- Only OpenAI API costs
- Everything else free tier

**Month 3-6 (Early customers):** ~$120/month

- Add Resend, Trigger.dev, Apollo.io
- Still well under $200-300 budget

**Month 6+ (Growth):** ~$195/month

- Upgrade database, cache, hosting
- Fits perfectly in $200-300 budget

---

## 🎯 ACTION ITEMS FOR YOU

### Immediate Setup (Do Today):

1. **Trigger.dev Account**
   - Sign up: https://trigger.dev
   - Create project
   - Get API keys

2. **Resend Account**
   - Sign up: https://resend.com
   - Verify domain (or use their domain for testing)
   - Get API key

3. **PostHog Account**
   - Sign up: https://posthog.com
   - Create project
   - Get API key

4. **Google Custom Search API**
   - Enable in Google Cloud Console
   - Create API key
   - Free 100 queries/day

### Environment Variables to Add:

```bash
# Add to apps/web/.env.local
TRIGGER_DEV_API_KEY=...
RESEND_API_KEY=...
POSTHOG_API_KEY=...
GOOGLE_CUSTOM_SEARCH_API_KEY=...
GOOGLE_SEARCH_ENGINE_ID=...

# Optional (add when ready to pay)
APOLLO_API_KEY=...
```

---

## ✅ YOU'RE READY TO BUILD

With this tech stack, you can build all 3 agents for under $50/month initially, scaling to ~$200/month as you grow.

**No blockers. No expensive tools. Production-ready.**

Now answer the 10 strategic questions with confidence knowing the technical foundation is solid.

---

_Last Updated: October 14, 2025_  
_Next Review: After answering 10 strategic questions_
