# GalaxyCo.ai Strategic Planning Session - October 14, 2025

**Session Date:** October 14, 2025  
**Purpose:** Define product vision, target customer, and agent functionality before building  
**Status:** In Progress - Awaiting answers to 10 critical questions

---

## 📋 Context: What Led to This Session

### Your Initial Questions (UI/UX Focus)

**Question 1:** Is there a UI tool we can download/install to achieve better UI results?

**Question 2:** Should I download a UI template from ui8.net and have you read the file instead of trying to create the UI yourself?

**Your concern:** "We are struggling to get the UI correct and now I'm worried our codebase is suffering because of it"

### AI Response Summary

**Recommendation:** Don't buy UI8 templates. Use FREE tools instead:

1. **V0.dev (FREE)** - AI-powered React component generator
   - Generates production-ready React + TypeScript + Tailwind code
   - 60 free credits/month
   - Perfect for custom components

2. **Figma (FREE) + Figma Community**
   - Design components visually
   - Duplicate free kits like "Untitled UI" (3000+ components)
   - Screenshot and feed to V0.dev
   - Total cost: $0

3. **Tailwind UI ($299)** - Optional if budget allows
   - 600+ production components
   - One-time purchase
   - NOT essential - V0 + Figma gives 90% of value for free

**Outcome:** You decided Figma + V0.dev workflow is the right choice (saves $299 for infrastructure)

---

## 🔄 Conversation Pivot: The Real Problem

### Your Follow-Up Request

> "I need you to brainstorm with me:
> - I feel like we haven't defined what our dashboard should actually show users
> - I also feel like we haven't defined our first 3 real agents and their functions
> 
> If we did this, I think you would have a better understanding of how to structure the UI, layout the dashboard, and also how to get the agents actually functioning"

**Your request:** "I do not want you to just automatically build this. I want you to assess this, give me HONEST feedback, and help me refine so we can actually build something of value."

---

## 📝 Your Initial Notes

### Architecture Vision

**Multi-tenant Structure:**
- Company: GalaxyCo.ai
- Users: dalton@galaxyco.ai (each user has own dashboard)
- Admins: Can view agent usage per employee + company-wide
- Knowledge Base: Shared per company, with collections for documents/images/files
- Agents & AI: Can access company knowledge base for personalized workflows

### Navigation Structure

**Top Bar Navigation:**
- Dashboard
- Library (knowledge base)
- Marketplace
- Documentation

**User Dashboard Left Sidebar:**
- **Home button:** Shows overall KPIs, recent activity (user + agents), company info
- **Agent navigation:** Each agent type listed below Home
  - Each agent gets its own dedicated page (not cramming everything on one dashboard)
  - Agent pages show: activity, customizable instructions, knowledge base uploads

**Search/Command Input:**
- Positioned at top of dashboard (underneath topbar navigation)
- Users can search keywords to navigate to related pages

**AI Assistant:**
- Dedicated page in user dashboard
- Always-accessible chat window in bottom right (persistent across all logged-in pages)

### Proposed Agents (Initial Ideas)

1. Lead Generator
2. Marketing Director
3. Document Organizer

---

## 🚨 Critical Feedback from AI

### Problem 1: Identity Crisis

**Marketing site claims:** "500+ Pre-Built Agent Packs"

**Your proposed agents:** Generic business tools (Lead Generator, Marketing Director, Document Organizer)

**Issue:** Your marketing promises role-specific packs for different teams, but you're building generic productivity agents.

**Question:** Who is your ACTUAL first customer?
- Sales teams at B2B companies?
- Marketing agencies?
- Solopreneurs/small business owners?
- Enterprise operations teams?

**Each requires different agents:**
- **Sales teams need:** Lead enrichment, outreach automation, CRM sync
- **Marketing agencies need:** Content generation, campaign analytics, client reporting
- **Solopreneurs need:** All-in-one productivity
- **Enterprise ops need:** Process automation, compliance, legacy system integration

**You need to pick ONE to start.**

---

### Problem 2: Agent Definition Too Vague

#### "Lead Generator"
- **What it does:** ??? (Scrape LinkedIn? Create fake emails? Run ad campaigns?)
- **Inputs needed:** Target audience criteria, budget, channels
- **Outputs produced:** List of contacts? Or qualified conversations?
- **Value metric:** Number of leads? Or number of QUALIFIED leads that convert?
- **Issue:** Too vague to build

#### "Marketing Director"
- **What it does:** ??? (Creates strategy? Runs campaigns? Reviews performance?)
- **Inputs needed:** Business context, goals, budget
- **Outputs produced:** Strategy docs? Ad copy? Analytics reports?
- **Value metric:** Engagement? Revenue? Brand awareness?
- **Issue:** This is a human role, not a specific task

#### "Document Organizer"
- **What it does:** ??? (Auto-tags files? Creates folder structures? Summarizes documents?)
- **Inputs needed:** Messy documents
- **Outputs produced:** Organized folders? Searchable database? Summary reports?
- **Value metric:** Time saved? Findability score?
- **Issue:** Most concrete, but still needs specifics

---

### Problem 3: Dashboard Information Architecture Undefined

**Your description:**
- Home page: Overall KPIs, recent activity, company info
- Each agent: Own page with activity, customization, knowledge base uploads

**Critical questions:**

**A) What are the "Overall KPIs"?**
- Total agent runs?
- Success rate?
- Cost per execution?
- Time saved?
- Revenue generated (if measurable)?

**B) What does "recent activity" mean?**
- Last 10 agent runs?
- Last 10 documents processed?
- Team member actions?
- Agent-generated insights?

**C) What is "company info"?**
- Billing status?
- Team member count?
- Usage vs. plan limits?
- Admin contact?

**Without defining these, we can't design the dashboard.**

---

### Problem 4: Knowledge Base Scope Unclear

**Your statement:** "Each company has its own knowledge base... agents can access this"

**Critical questions:**

**A) What prevents knowledge base chaos?**
- If 50 employees upload random PDFs, how do agents know what's relevant?
- Collections/folders/tags?
- Automatic categorization?
- Who manages KB quality?

**B) How do agents USE the knowledge base?**
- RAG (Retrieval Augmented Generation) - searching docs for context?
- Fine-tuning models on company data?
- Structured data extraction?
- Vector embeddings for semantic search?

**C) What file types ACTUALLY work?**
- PDFs? (Easy)
- Images? (OCR needed)
- Spreadsheets? (Structured data extraction)
- Videos? (Transcription first)
- Code? (Special handling)

---

## 💡 AI's Strategic Recommendations

### OPTION A: Niche Down to Sales Teams (RECOMMENDED)

**Target:** Sales teams at B2B SaaS companies

**Their 3 agents:**

#### 1. Lead Enrichment Agent
- **Input:** LinkedIn URL or email
- **Output:** Full profile (company, role, pain points, recent activity)
- **Value:** Saves 15 min per lead

#### 2. Outreach Sequence Agent
- **Input:** Lead profile + your product description
- **Output:** Personalized 5-email sequence
- **Value:** 3x reply rates vs. generic emails

#### 3. CRM Sync Agent
- **Input:** Email threads, meeting notes
- **Output:** Auto-updated CRM fields, next steps
- **Value:** Reps spend time selling, not data entry

**Dashboard KPIs:**
- Leads enriched this week
- Emails sent / reply rate
- CRM records updated
- Time saved (calculated)

**Knowledge Base:**
- Product documentation
- Competitor analysis
- Customer success stories
- Objection handling scripts

**This is a COMPLETE, SELLABLE PRODUCT.**

---

### OPTION B: Horizontal Productivity Platform (RISKIER)

If you want to stay broad:

#### 1. Research Agent (instead of "Lead Generator")
- **Input:** "Research the top 10 competitors in the CRM space"
- **Process:** Searches web, compiles report with key findings
- **Output:** Formatted doc with sources cited

#### 2. Content Repurposer Agent (instead of "Marketing Director")
- **Input:** Long-form blog post upload
- **Process:** Creates 10 LinkedIn posts, 5 tweets, email newsletter
- **Output:** Multi-format content package

#### 3. Meeting Summary Agent (instead of "Document Organizer")
- **Input:** Zoom transcript upload
- **Process:** Creates summary, action items, assigns owners
- **Output:** Shareable doc + calendar invites

**Dashboard KPIs:**
- Research reports generated
- Content pieces created
- Meetings summarized
- Total time saved (estimated)

---

## 🎯 Your Decision

> "Lets focus on sales teams, then once we have this complete, we will add on for marketing agencies, then once we have both of those, we will add on for enterprise ops. This seems the most realistic to me"

**Expansion roadmap:**
1. **Phase 1:** Sales teams (B2B SaaS) ← START HERE
2. **Phase 2:** Marketing agencies (after sales proven)
3. **Phase 3:** Enterprise ops (after both proven)

**This is the right approach: niche down, prove value, expand.**

---

## 📋 The 10 Critical Questions (AWAITING YOUR ANSWERS)

### SECTION 1: Target Customer Definition

#### Question 1: Who is your ideal first customer?

Be hyper-specific. Answer all of these:

- **Company size:** (e.g., "10-50 employees" or "50-200 employees")
- **Industry:** (e.g., "B2B SaaS companies" or "All B2B companies" or "Any company with a sales team")
- **Sales team size:** (e.g., "2-10 sales reps" or "single sales rep" or "sales teams of 5+")
- **Current tools they use:** (e.g., "HubSpot CRM + LinkedIn Sales Navigator" or "Salesforce" or "Just Gmail and spreadsheets")
- **Annual revenue range:** (e.g., "$500k-$5M ARR" or "$5M-$20M ARR")
- **What they're currently doing manually:** (Describe their current painful workflow)

**Example answer format:**
> "Our first customer is a 25-person B2B SaaS startup doing $2M ARR. They have 5 sales reps using HubSpot CRM and LinkedIn Sales Navigator. Currently, reps spend 2 hours/day manually researching leads on LinkedIn, copying info into HubSpot, and writing personalized cold emails. They hate this and want more time actually talking to prospects."

---

### SECTION 2: Business Model & Value

#### Question 2: What painful task are we solving FIRST?

Pick the #1 most painful thing sales reps do manually:

**Option A:** Lead research/enrichment (finding contact info, company details, pain points)  
**Option B:** Writing personalized outreach emails  
**Option C:** Updating CRM records after calls/meetings  
**Option D:** Something else (describe it)

**Then answer:**
- How much time does this task take per day? (e.g., "2-3 hours")
- How much does it cost the company? (e.g., "Sales rep makes $75k/year = $36/hour × 2.5 hours = $90/day wasted")
- What's the quality issue? (e.g., "Reps rush research so they miss key insights" or "CRM is always out of date")

---

#### Question 3: How much would they pay to solve this?

Be realistic about pricing:

- **Per user per month?** (e.g., "$49/user/month" or "$99/user/month")
- **Per company per month?** (e.g., "$299/month flat rate for up to 10 users")
- **Usage-based?** (e.g., "$0.50 per lead enriched" or "$1 per AI-generated email")

**Also answer:**
- What do competing tools cost? (e.g., "LinkedIn Sales Navigator is $99/month, Apollo.io is $49/month")
- Why would they switch to us vs. using those? (Your differentiation)

---

### SECTION 3: Agent Functionality (The Critical Part)

#### Question 4: Lead Intel Agent - Define the EXACT workflow

**INPUT (be specific):**
- What does the user provide? 
  - LinkedIn profile URL?
  - Just company domain?
  - Email address?
  - CSV upload with multiple leads?

**PROCESS (what data sources):**
- LinkedIn scraping? (Costs $$ and has rate limits - are you okay with this?)
- Company websites? (Free but requires web scraping)
- Crunchbase? (API costs money)
- News articles? (Free via Google News)
- Social media? (Twitter/X, requires API)
- Our knowledge base? (Company's uploaded info about ICPs)

**Which of these do you ACTUALLY want to support in V1?** Rank them 1-5 (1 = must have, 5 = nice to have later)

**OUTPUT:**
- What format? 
  - JSON for API integrations?
  - Formatted text document?
  - Auto-filled form fields?
  - All of the above?

**What SPECIFIC fields should the output include?**
Example:
- Full name
- Job title
- Company name
- Company size
- Industry
- Tech stack used
- Recent news/funding
- Pain points (inferred)
- Best outreach angle (AI-suggested)

**List ALL the fields you want.**

---

#### Question 5: Outreach Writer Agent - Define the EXACT workflow

**INPUT:**
- Lead profile from Agent #1?
- User's product description (from knowledge base)?
- User manually types context?
- Templates from knowledge base?

**PROCESS:**
- Does it generate a single email or a sequence (e.g., 3-5 follow-ups)?
- What tone? (Professional? Casual? User-configurable?)
- Does it pull case studies/testimonials from knowledge base?
- Does it reference recent news about the lead's company?

**OUTPUT:**
- Just text that user copies?
- Directly integrates with email (Gmail API)?
- Saves as draft in user's email?
- Creates HubSpot/Salesforce email task?

**What does "good output" look like?**
- Word count? (e.g., "150-200 words for cold email")
- Structure? (Hook → Value prop → CTA?)
- Personalization level? (Name + company + 1 specific insight?)

**Give me an example of a PERFECT email this agent should generate.**

---

#### Question 6: CRM Sync Agent - Define the EXACT workflow

**INPUT:**
- Email threads (how does agent access these? Gmail API? User forwards emails?)
- Meeting transcripts (Zoom? Google Meet? User uploads?)
- Manual notes user types?
- All of the above?

**PROCESS:**
- What does it extract?
  - Next steps / action items?
  - Deal stage changes?
  - Pain points mentioned?
  - Objections raised?
  - Decision timeline?
  - Competitors mentioned?

**OUTPUT:**
- Updates CRM automatically (via API)?
- Creates suggested updates for user to approve?
- Generates summary document?
- Creates tasks/reminders?

**Which CRMs should we support FIRST?**
- HubSpot (has good API)
- Salesforce (complex but widely used)
- Pipedrive (simple, startup-friendly)
- None initially (just show updates in our UI, let user copy/paste)

**What's realistic for V1?**

---

### SECTION 4: Knowledge Base Strategy

#### Question 7: What goes in the company knowledge base?

For a sales team, what documents/data should be uploaded?

**Check all that apply + add your own:**
- [ ] Product documentation / feature sheets
- [ ] Case studies / customer success stories
- [ ] Competitor analysis / battlecards
- [ ] Ideal Customer Profile (ICP) definitions
- [ ] Objection handling scripts
- [ ] Pricing information
- [ ] Sales playbooks
- [ ] Email templates
- [ ] Call scripts
- [ ] Demo recordings
- [ ] Other: ______________

**How should knowledge be organized?**
- Option A: Flat structure (all files in one bucket, search to find)
- Option B: Collections (e.g., "Product Info", "Competitors", "Objection Handling")
- Option C: Tags (files can have multiple tags)
- Option D: Automatic categorization (AI organizes uploads)

**Which option?**

---

#### Question 8: How do agents USE the knowledge base?

**When Lead Intel Agent runs:**
- Does it check knowledge base for ICP fit? (e.g., "Is this lead in our target industry?")
- Does it reference uploaded competitor info to identify competitive threats?
- Does it pull relevant case studies for similar companies?

**When Outreach Writer Agent runs:**
- Does it pull specific case studies that match the lead's industry?
- Does it reference objection handling for anticipated pushback?
- Does it use approved messaging/templates from knowledge base?

**When CRM Sync Agent runs:**
- Does it check for mentioned competitors against your competitor list?
- Does it flag objections that match your objection handling docs?

**For each agent, tell me: YES - it should use KB, or NO - it doesn't need KB access**

---

### SECTION 5: Dashboard & Metrics

#### Question 9: What are your TOP 3-5 KPIs for the dashboard HOME page?

These should prove that agents are delivering value. Pick your top 3-5:

**Option A - Activity Metrics:**
- [ ] Total leads enriched this week
- [ ] Total emails generated this week
- [ ] Total CRM updates this week

**Option B - Efficiency Metrics:**
- [ ] Time saved this week (calculated)
- [ ] Cost per lead enriched
- [ ] Agent success rate (% of runs that worked)

**Option C - Business Impact Metrics:**
- [ ] Reply rate on AI-generated emails (requires email tracking)
- [ ] Meetings booked from AI outreach
- [ ] Deals influenced by AI research

**Option D - Usage Metrics:**
- [ ] Active users this week
- [ ] Most-used agent
- [ ] Knowledge base documents accessed

**Pick your TOP 3-5 and rank them in order of importance.**

**Also:** What's a "good" number for each? (e.g., "If a rep enriches 20+ leads/week, that's success")

---

#### Question 10: What does the user's FIRST WEEK look like?

Walk me through the onboarding and "aha moment":

**Day 1 - User signs up:**
- What happens first?
  - Create account → Upload knowledge base docs → Run first agent?
  - Watch tutorial video?
  - Pre-filled demo data to explore?

**Day 1 - First agent run:**
- Which agent do they try first? (Lead Intel? Outreach Writer?)
- Do we provide a sample lead to test with?
- What result convinces them "this works"?

**Day 3 - Building habits:**
- What's the daily workflow? (Upload leads in morning → Agent enriches → Write emails → CRM sync at end of day?)
- How many times per day should they interact with agents?

**Day 7 - Success metric:**
- What result proves value? 
  - "Saved 5+ hours this week"?
  - "Enriched 50+ leads"?
  - "Booked 2 meetings from AI emails"?
  - "CRM is actually up to date for once"?

**Describe the ideal first week journey.**

---

## 🎯 Refined Architecture Proposal (from AI)

### Top Navigation (Global)
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Dashboard | Library | Marketplace | Docs | [User]│
└─────────────────────────────────────────────────────────┘
```

### Dashboard Page (Left Sidebar + Main Content)

```
┌──────────┬─────────────────────────────────────────────┐
│          │ 🔍 [Search agents, docs, or type command]  │
│          ├─────────────────────────────────────────────┤
│  [Home]  │                                             │
│          │  📊 Quick Stats Row (4 cards)              │
│          │  ┌──────┬──────┬──────┬──────┐            │
│  ───     │  │Agents│Runs  │Time  │Cost  │            │
│          │  │  3   │ 142  │ 8hrs │ $24  │            │
│  Agent 1 │  └──────┴──────┴──────┴──────┘            │
│  Agent 2 │                                             │
│  Agent 3 │  🤖 Your AI Assistant                      │
│          │  ┌───────────────────────────────────┐    │
│  ───     │  │ "I processed 15 leads today.      │    │
│          │  │  Would you like me to draft       │    │
│  [Chat]  │  │  outreach emails?"                │    │
│          │  └───────────────────────────────────┘    │
│          │                                             │
│          │  📋 Recent Activity (Feed)                 │
│          │  • Lead Enrichment Agent completed 5 tasks│
│          │  • New document uploaded to KB            │
│          │  • Marketing Director generated report    │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

### Individual Agent Page (Example: Lead Enrichment)

```
┌─────────────────────────────────────────────────────────┐
│ Lead Enrichment Agent                      [▶ Run] [⚙️] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📈 Performance This Week                                │
│  ┌─────────┬─────────┬─────────┬─────────┐            │
│  │ Runs    │ Success │ Avg Time│ Cost    │            │
│  │  47     │  94%    │  2.3min │  $8.20  │            │
│  └─────────┴─────────┴─────────┴─────────┘            │
│                                                          │
│  🎯 Quick Actions                                        │
│  [Enrich Single Lead] [Bulk Upload CSV] [Schedule]      │
│                                                          │
│  🧠 Agent Configuration                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │ Enrichment Sources:                            │   │
│  │ ☑ LinkedIn                                     │   │
│  │ ☑ Company Website                              │   │
│  │ ☑ Crunchbase                                   │   │
│  │ ☐ Twitter/X                                    │   │
│  │                                                 │   │
│  │ Custom Instructions:                            │   │
│  │ [Focus on company tech stack...        ]       │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
│  📚 Knowledge Base (Agent-Specific)                      │
│  • ICP_Definition.pdf                                   │
│  • Competitor_List.xlsx                                 │
│  • [+ Add Document]                                     │
│                                                          │
│  📋 Recent Runs                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │ john.doe@acme.com      ✓ Success   2 min ago  │  │
│  │ jane.smith@startup.io   ✓ Success   5 min ago  │  │
│  │ bob@company.com        ⚠ Partial   8 min ago  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps

### What AI Needs from You

**Answer ALL 10 questions above in detail.**

The more specific you are, the better AI can:
1. Design the exact agent workflows
2. Define the database schema
3. Create realistic wireframes
4. Spec out API integrations
5. Build a product that actually solves the problem

### What AI Will Deliver After Your Answers

1. **Complete Functional Specification Document**
   - Agent workflows (input/process/output)
   - Database schema for agents, knowledge base, and metrics
   - API integrations needed
   - Technical architecture

2. **Detailed Wireframes**
   - Dashboard home page with real KPIs
   - Each agent's dedicated page
   - Knowledge base interface
   - AI assistant chat interface

3. **V0.dev Prompts**
   - Ready-to-use prompts for generating UI components
   - Based on REAL agent functionality
   - Not generic placeholders

4. **Implementation Plan**
   - Build ONE agent end-to-end first (prove concept)
   - Get real user feedback
   - Iterate before building others
   - Then polish UI based on working agents

---

## 📚 Supporting Documentation Created

During this session, AI created the following reference documents:

1. **`docs/DESIGN_SYSTEM_FOUNDATION.md`**
   - Core design tokens (colors, typography, spacing)
   - Component patterns (cards, buttons, inputs, badges)
   - Layout patterns (grids, search bars)
   - Quick decision rules for consistent UI

2. **`docs/FIGMA_V0_WORKFLOW.md`**
   - Complete workflow guide for Figma + V0.dev
   - How to use free Figma Community kits
   - How to generate production code with V0
   - Best practices and prompt templates

3. **`docs/FREE_FIGMA_RESOURCES.md`**
   - Curated list of free Figma dashboard kits
   - Untitled UI (3000+ components)
   - Ant Design system
   - Lucide icons (matches your codebase)
   - Brand colors for Figma designs

4. **`docs/V0_PROMPT_MARKETPLACE_CARD.md`**
   - Ready-to-use V0 prompt for marketplace card component
   - Example of how to generate components
   - Template for creating other prompts

---

## 💡 Key Insights from This Session

### What We Learned

1. **UI problems are symptoms, not the root cause**
   - Real problem: Undefined product functionality
   - Can't design UI without knowing what data to show
   - Can't build agents without knowing what they do

2. **Marketing promises must match product reality**
   - Landing page says "500+ agent packs"
   - Need to define at least 3 agents that actually work
   - Better to nail 3 agents than poorly implement 50

3. **Niche-first strategy is correct**
   - Sales teams → Marketing agencies → Enterprise ops
   - Prove value in one vertical before expanding
   - Easier to sell "sales automation" than "generic AI platform"

4. **Free tools can deliver professional results**
   - V0.dev + Figma = $0 investment
   - No need for $300 Tailwind UI or UI8 templates
   - Budget saved for infrastructure and AI API costs

### What Needs to Happen Next

1. **Answer the 10 questions** (your homework)
2. **AI creates complete functional spec** (based on answers)
3. **Build ONE agent end-to-end** (prove concept works)
4. **Then design UI around real functionality** (not before)

---

## 🎯 The Bottom Line

**You made the right call to pause and think strategically.**

Before writing more code:
- ✅ Define target customer precisely
- ✅ Define agent workflows specifically
- ✅ Define success metrics clearly
- ✅ Define knowledge base usage
- ✅ Define first week user journey

**Then** build UI that serves the functionality.

**Not** build UI first and hope functionality fits.

---

**Status:** Awaiting your answers to the 10 questions.

**When ready:** Ping AI with your detailed responses, and the complete functional specification will be created within 24 hours.

---

*End of Strategic Planning Session Archive*
