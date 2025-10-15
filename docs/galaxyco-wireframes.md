# 📐 GalaxyCo.ai Wireframe Documentation
## The Autonomous Sales Engine for B2B Professional Services

**Version:** 1.0  
**Date:** October 14, 2025  
**Author:** Dalton Cox & Claude  
**Purpose:** Production wireframes for GalaxyCo.ai MVP

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Architecture Overview](#architecture-overview)
3. [Core Layout Patterns](#core-layout-patterns)
4. [Screen Inventory (All 12 Screens)](#screen-inventory)
5. [Design System](#design-system)
6. [User Flows](#user-flows)
7. [Component Library Mapping](#component-library-mapping)
8. [Mobile Considerations](#mobile-considerations)
9. [Implementation Priority](#implementation-priority)

---

## Product Overview

### What is GalaxyCo.ai?

**The Problem:** B2B sales reps waste 23-35 hours/week on $15/hour busywork instead of talking to prospects.

**The Solution:** Three AI agents working 24/7 while your team sleeps:

1. **Research Agent** → Deep-dives on prospects (company intel, pain points, decision-makers)
2. **Email Agent** → Writes personalized outreach at scale (120+ emails/week per rep)
3. **CRM Agent** → Auto-updates pipeline after every call (no more data entry)

**The Model:** Supervised Automation
- Agent does 95% of work
- User reviews/approves in 5% of time
- User maintains control, agent learns from feedback

### Target Customer

- **Industry:** Consulting firms, fractional executive services, agencies
- **Company Size:** 10-50 employees, $1M-$10M revenue
- **Sales Team:** 2-8 business development reps
- **Current Tools:** HubSpot/Pipedrive, LinkedIn Sales Nav
- **Buyer Persona:** VP of Sales / Head of Business Development (35-50 years old)

### Core Value Proposition

**ROI:** $209K net value created per year for a 5-person BD team  
**Cost:** $5,988/year  
**Return:** 35x ROI

---

## Architecture Overview

### Core Principles

- **Agent-first interface** (not traditional SaaS dashboard)
- **Supervised automation UI** (review queues, approval flows)
- **Action-oriented design** (every screen has clear next step)
- **Trust-building UX** (show confidence scores, agent reasoning)
- **Mobile-ready** (reps work from anywhere)

### Application Shell

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] GalaxyCo.ai    Dashboard       [👤 Dalton Cox]  │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Sidebar     │        Main Content Area                 │
│  (Dark)      │        (Light/White BG)                  │
│              │                                           │
│  🏠 Dashboard│        Dynamic Content                   │
│  🤖 Agents   │        Per Route                         │
│  📊 Prospects│                                           │
│  ✉️  Emails   │                                           │
│  📞 CRM Sync │                                           │
│  🧠 Knowledge│                                           │
│  ⚙️  Settings│                                           │
│              │                                           │
│  ─────────   │                                           │
│  📚 Help     │                                           │
│  👤 Profile  │                                           │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘
```

**Navigation Structure:**
- Dashboard (home, overview metrics)
- Agents (manage Research, Email, CRM agents)
- Prospects (enriched lead database)
- Emails (outreach queue, review & approve)
- CRM Sync (pipeline updates, call notes)
- Knowledge (company context, templates)
- Settings (integrations, team, billing)

---

## Core Layout Patterns

### Pattern 1: Dashboard (Metrics + Action Cards)

**Used for:** Home screen, agent overview  
**Purpose:** Show value, direct to high-priority tasks

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 This Week's Impact                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ 127     │  │ 43      │  │ 18      │  │ 15.2    │   │
│  │ Leads   │  │ Emails  │  │ Meetings│  │ Hours   │   │
│  │ Enriched│  │ Drafted │  │ Booked  │  │ Saved   │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
│  ⚡ Action Required                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ✉️  43 emails ready for review              [Review]│ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 📞 5 call notes ready for CRM sync          [Sync] │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  🤖 Agent Activity (Last 24h)                          │
│  Research Agent: 127 prospects enriched                │
│  Email Agent: 43 outreach emails drafted               │
│  CRM Agent: 18 pipeline updates completed              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Pattern 2: Review Queue (Supervised Automation)

**Used for:** Email review, CRM updates review  
**Purpose:** User reviews agent work, approves/edits

```
┌─────────────────────────────────────────────────────────┐
│  Email Review Queue                    43 pending       │
├─────────────────────────────────────────────────────────┤
│  Showing: 1 of 43                                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ To: Sarah Johnson (sarah@acmeconsulting.com)   │   │
│  │ Subject: Acme Consulting + GalaxyCo partnership │   │
│  │                                                 │   │
│  │ Hi Sarah,                                       │   │
│  │                                                 │   │
│  │ I noticed Acme Consulting just hired 3 new BD  │   │
│  │ reps (congrats on the growth!). With a larger  │   │
│  │ team, manual prospect research becomes a real  │   │
│  │ bottleneck...                                   │   │
│  │                                                 │   │
│  │ [Full email draft shown here]                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Research Agent Insights:                            │
│  • Company size: 35 employees (+8 last quarter)        │
│  • Tech stack: HubSpot, LinkedIn Sales Nav             │
│  • Recent news: $2M Series A funding                   │
│  • Decision maker: Sarah (VP Sales, 3 years tenure)    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ [Edit]   │  │ [Approve]│  │ [Skip]   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  [← Previous]              [Next (42 left) →]          │
└─────────────────────────────────────────────────────────┘
```

### Pattern 3: Data Table (Prospects, Emails, Activity)

**Used for:** Prospect database, email history, agent logs

```
┌─────────────────────────────────────────────────────────┐
│  Prospects Database                  [+ Add Prospect]   │
├─────────────────────────────────────────────────────────┤
│  🔍 Search...          Filters: ▼ All  ▼ Status        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Name         │ Company  │ Enriched │ Status    │Actions│
├──────────────┼──────────┼──────────┼───────────┼───────┤
│ Sarah Johnson│ Acme     │ Oct 14   │ Drafted   │ [⋮]  │
│              │ Consult. │ 9:00 AM  │ email     │       │
├──────────────┼──────────┼──────────┼───────────┼───────┤
│ Mike Chen    │ Beta     │ Oct 14   │ Email     │ [⋮]  │
│              │ Agency   │ 9:15 AM  │ sent      │       │
├──────────────┼──────────┼──────────┼───────────┼───────┤
│ Lisa Park    │ Gamma    │ Oct 14   │ Enriching │ [⋮]  │
│              │ Group    │ 9:30 AM  │ now...    │       │
└─────────────────────────────────────────────────────────┘
```

### Pattern 4: Agent Detail (Configure, Monitor)

**Used for:** Individual agent settings, performance metrics

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Agents                                       │
│                                                         │
│  🔍 Research Agent                          [Configure] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Last 7 Days Performance                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │ 847     │  │ 96%     │  │ 4.2 min │               │
│  │ Prospects│  │ Accuracy│  │ Avg Time│               │
│  │ Enriched│  │ Rate    │  │ per Lead│               │
│  └─────────┘  └─────────┘  └─────────┘               │
│                                                         │
│  ⚙️ Agent Settings                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Data Sources                                    │   │
│  │ ☑ LinkedIn                                      │   │
│  │ ☑ Company websites                              │   │
│  │ ☑ News & hiring signals                         │   │
│  │ ☑ Tech stack detection                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Enrichment Depth                                │   │
│  │ ○ Quick (2 min avg)                             │   │
│  │ ● Standard (4 min avg)                          │   │
│  │ ○ Deep (8 min avg)                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                                      [Save Changes]     │
└─────────────────────────────────────────────────────────┘
```

---

## Screen Inventory

### Screen 1: Welcome / Onboarding

**Route:** `/onboarding` (first login)  
**Purpose:** Explain supervised automation model, set expectations

**Layout:**
```
Modal Overlay (60% screen width, vertically centered)

┌──────────────────────────────────────────┐
│  Welcome to GalaxyCo.ai             [X]  │
├──────────────────────────────────────────┤
│                                          │
│         [🤖 Three Agent Icons]           │
│      Research | Email | CRM              │
│                                          │
│  Your autonomous sales team that works   │
│  while you sleep.                        │
│                                          │
│  📊 Research Agent                       │
│  Deep-dives on 50+ prospects/week        │
│  (company intel, pain points, buyers)    │
│                                          │
│  ✉️  Email Agent                          │
│  Writes 120+ personalized emails/week    │
│  (you review & approve in 15 min)        │
│                                          │
│  📞 CRM Agent                            │
│  Auto-updates your pipeline after calls  │
│  (no more data entry)                    │
│                                          │
│  🔄 How it works:                        │
│  1. Agents do 95% of the work            │
│  2. You review/approve in 5% of time     │
│  3. You stay in control, agents learn    │
│                                          │
│  Let's get you set up! →                │
│                                          │
│              [Get Started]               │
│                                          │
└──────────────────────────────────────────┘
```

**User Journey:**
1. User logs in for first time
2. Modal appears automatically
3. Explains 3-agent model
4. Sets expectation: supervised automation
5. Click "Get Started" → goes to setup wizard

**Setup Wizard Flow:**
```
Step 1: Connect your CRM (HubSpot or Pipedrive)
Step 2: Upload initial prospect list (CSV or integrate)
Step 3: Set your knowledge base (ICP, case studies)
Step 4: Choose enrichment settings
Step 5: Review your first agent-drafted email
```

---

### Screen 2: Dashboard (Home)

**Route:** `/dashboard` (default after login)  
**Purpose:** Show weekly impact, direct to action items

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                            👤 Dalton Cox     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 This Week's Impact                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 127 Prospects│  │ 43 Emails    │  │ 18 Meetings  │ │
│  │ Enriched     │  │ Drafted      │  │ Booked       │ │
│  │ +23% vs last │  │ +15% vs last │  │ +31% vs last │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 15.2 Hours   │  │ 96% User     │  │ 12% Reply    │ │
│  │ Saved        │  │ Satisfaction │  │ Rate         │ │
│  │ $576 value   │  │ ⭐⭐⭐⭐⭐     │  │ vs 8% avg    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ⚡ Action Required                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ✉️  43 emails ready for your review        [Review]│ │
│  │ Agent drafted these based on research insights    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 📞 5 call notes ready for CRM sync          [Sync] │ │
│  │ Agent extracted key quotes and next steps         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🔍 New batch of 50 prospects ready    [View Queue]│ │
│  │ Research Agent finished enrichment overnight      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  🤖 Agent Activity (Last 24 Hours)                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🔍 Research Agent                                 │ │
│  │ • Enriched 127 prospects                          │ │
│  │ • Found 34 decision-makers                        │ │
│  │ • Detected 8 hiring signals                       │ │
│  │ • Identified 12 tech stack matches                │ │
│  │                                    [View Details →]│ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ✉️  Email Agent                                    │ │
│  │ • Drafted 43 personalized emails                  │ │
│  │ • 38 approved & sent                              │ │
│  │ • 5 pending your review                           │ │
│  │ • 4 replies received (12% reply rate)             │ │
│  │                                    [View Details →]│ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 📞 CRM Agent                                      │ │
│  │ • Updated 18 deals in pipeline                    │ │
│  │ • Logged 23 call notes                            │ │
│  │ • Created 12 follow-up tasks                      │ │
│  │ • Synced with HubSpot successfully                │ │
│  │                                    [View Details →]│ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- **Metric Cards** (top row)
  - Large number (primary metric)
  - Label (what it measures)
  - Comparison (% change vs last week)
  - Color-coded (green=good, red=needs attention)
  
- **Action Cards** (middle section)
  - Icon + count (visual hierarchy)
  - Description (what agent did)
  - Primary CTA button (right-aligned)
  - Urgency indicator (border color)

- **Agent Activity Cards** (bottom section)
  - Agent name + icon
  - Bulleted list of activities
  - "View Details" link
  - Expandable (click to see full log)

**User Journey:**
1. User logs in
2. Immediately sees impact (metrics)
3. Sees action items (what needs review)
4. Can click into any action or view agent details
5. Dashboard refreshes as agents work

**Design Notes:**
- Mobile-first: cards stack vertically
- Progressive disclosure: summary → details
- Action-oriented: every card has a CTA
- Trust-building: show agent reasoning

---

### Screen 3: Agents Overview

**Route:** `/agents`  
**Purpose:** Manage all three agents, see performance

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Agents                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your AI Sales Team                                     │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🔍 Research Agent              [Configure]     │    │
│  │                                                │    │
│  │ Status: ⚡ Active                              │    │
│  │ Running: Enriching 50 prospects now...        │    │
│  │                                                │    │
│  │ Last 7 Days:                                   │    │
│  │ • 847 prospects enriched                       │    │
│  │ • 96% accuracy rate                            │    │
│  │ • 4.2 min avg time per lead                    │    │
│  │                                                │    │
│  │ [View Activity Log] [Pause Agent]             │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✉️  Email Agent                  [Configure]    │    │
│  │                                                │    │
│  │ Status: ⏸️  Waiting for review                 │    │
│  │ Queue: 43 emails ready for your approval      │    │
│  │                                                │    │
│  │ Last 7 Days:                                   │    │
│  │ • 284 emails drafted                           │    │
│  │ • 268 approved & sent                          │    │
│  │ • 12.3% reply rate (vs 8% industry avg)       │    │
│  │                                                │    │
│  │ [Review Queue] [View Sent Emails]             │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📞 CRM Agent                    [Configure]    │    │
│  │                                                │    │
│  │ Status: ⚡ Active                              │    │
│  │ Running: Syncing 5 call notes to HubSpot...   │    │
│  │                                                │    │
│  │ Last 7 Days:                                   │    │
│  │ • 127 pipeline updates                         │    │
│  │ • 89 call notes logged                         │    │
│  │ • 43 follow-up tasks created                   │    │
│  │                                                │    │
│  │ [View CRM Sync] [Pause Agent]                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  📊 Team Performance (vs Industry Benchmarks)          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Time Saved: 115 hours/week                     │    │
│  │ Productivity Gain: +340%                       │    │
│  │ Cost Savings: $2,880/month                     │    │
│  │ ROI: 35x                                       │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Agent Card Components:**
- Agent icon + name (header)
- Configure button (top-right)
- Status indicator (Active / Waiting / Paused)
- Current activity (what it's doing right now)
- 7-day performance metrics
- Action buttons (context-specific)

**Status States:**
- ⚡ **Active** (green) = Agent is working now
- ⏸️  **Waiting** (yellow) = Needs user input
- ⏹️  **Paused** (gray) = User manually paused
- ⚠️  **Error** (red) = Something needs attention

**User Journey:**
1. User clicks "Agents" in sidebar
2. Sees overview of all 3 agents
3. Can configure any agent
4. Can pause/resume agents
5. Can dive into activity logs
6. Can see team-wide metrics

---

### Screen 4: Research Agent Detail

**Route:** `/agents/research`  
**Purpose:** Configure, monitor Research Agent

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Agents                                       │
│                                                         │
│  🔍 Research Agent                          [Configure] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Performance (Last 30 Days)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ 3,847   │  │ 96%     │  │ 4.2 min │  │ 287     │   │
│  │ Prospects│  │ Accuracy│  │ Avg Time│  │ Decision│   │
│  │ Enriched│  │ Rate    │  │ per Lead│  │ Makers  │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
│  [Chart: Prospects Enriched Over Time - Last 30 Days]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Line chart showing daily volume]               │   │
│  │ Peak: 187 on Oct 10                             │   │
│  │ Avg: 128/day                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🎯 Data Sources Enabled                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑ LinkedIn profiles & company pages             │   │
│  │ ☑ Company websites & about pages                │   │
│  │ ☑ News articles & press releases                │   │
│  │ ☑ Hiring signals (job postings)                 │   │
│  │ ☑ Tech stack detection (BuiltWith)              │   │
│  │ ☐ Financial data (Crunchbase) - Upgrade         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⚙️ Enrichment Settings                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Enrichment Depth                                │   │
│  │ ○ Quick (2 min avg, basic info)                │   │
│  │ ● Standard (4 min avg, recommended)            │   │
│  │ ○ Deep (8 min avg, comprehensive)              │   │
│  │                                                 │   │
│  │ Focus Areas (select all that apply)            │   │
│  │ ☑ Company intel (size, growth, funding)        │   │
│  │ ☑ Pain points (hiring, tech stack gaps)        │   │
│  │ ☑ Decision-makers (titles, tenure)             │   │
│  │ ☑ Recent news (launches, pivots, wins)         │   │
│  │ ☑ Competitive landscape                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🧠 Knowledge Base Integration                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Agent will reference:                           │   │
│  │ • Your ICP definition                           │   │
│  │ • Your case studies                             │   │
│  │ • Your common objections                        │   │
│  │                                                 │   │
│  │                          [Manage Knowledge →]   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📜 Recent Activity Log                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Oct 14, 10:45 AM - Enriched "Acme Consulting"  │   │
│  │ • Found decision-maker: Sarah Johnson (VP Sales)│   │
│  │ • Detected hiring signal: 3 new BD reps         │   │
│  │ • Tech stack: HubSpot, LinkedIn Sales Nav       │   │
│  │ • Confidence: 98%                 [View Details]│   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Oct 14, 10:42 AM - Enriched "Beta Agency"      │   │
│  │ • Found decision-maker: Mike Chen (Founder)     │   │
│  │ • Recent news: Raised $500k seed round          │   │
│  │ • Tech stack: Pipedrive, Intercom               │   │
│  │ • Confidence: 92%                 [View Details]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Load More Activity]                                   │
│                                                         │
│                                      [Save Changes]     │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Performance metrics (volume, accuracy, speed)
- Visual chart (trend over time)
- Data source toggles (enable/disable)
- Enrichment depth selector (Quick/Standard/Deep)
- Focus area checkboxes (what to prioritize)
- Knowledge base integration indicator
- Real-time activity log (recent enrichments)
- Confidence scores (trust indicator)

---

### Screen 5: Prospects Database

**Route:** `/prospects`  
**Purpose:** View all enriched prospects, search, filter

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Prospects Database                  [+ Add Prospect]   │
├─────────────────────────────────────────────────────────┤
│  🔍 Search by name or company...                        │
│  Filters: ▼ All Statuses  ▼ All Industries  ▼ Sort by  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Name         │ Company  │ Title   │ Status    │ Actions│
├──────────────┼──────────┼─────────┼───────────┼────────┤
│ Sarah Johnson│ Acme     │ VP Sales│ 📧 Email  │ [⋮]   │
│              │ Consult. │         │  drafted  │        │
│ Enriched: Oct 14, 9:00 AM  •  Confidence: 98%          │
│ 💡 Insights: Hiring 3 new BD reps, uses HubSpot        │
├──────────────┼──────────┼─────────┼───────────┼────────┤
│ Mike Chen    │ Beta     │ Founder │ ✅ Email  │ [⋮]   │
│              │ Agency   │ & CEO   │  sent     │        │
│ Enriched: Oct 14, 9:15 AM  •  Confidence: 92%          │
│ 💡 Insights: Raised $500k seed, uses Pipedrive         │
├──────────────┼──────────┼─────────┼───────────┼────────┤
│ Lisa Park    │ Gamma    │ Head of │ 🔍 Enrich-│ [⋮]   │
│              │ Group    │ BD      │  ing...   │        │
│ Started: Oct 14, 9:30 AM  •  ETA: 2 min                │
├──────────────┼──────────┼─────────┼───────────┼────────┤
│ Tom Williams │ Delta    │ CRO     │ 🆕 New    │ [⋮]   │
│              │ Partners │         │  lead     │        │
│ Added: Oct 14, 9:45 AM  •  Pending enrichment          │
└─────────────────────────────────────────────────────────┘
```

**Row Expansion (click on row):**
```
┌─────────────────────────────────────────────────────────┐
│ Sarah Johnson  •  Acme Consulting                  [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 👤 Contact Info                                         │
│ Email: sarah@acmeconsulting.com                         │
│ LinkedIn: linkedin.com/in/sarahjohnson                  │
│ Phone: +1 (555) 123-4567                                │
│                                                         │
│ 🏢 Company Info                                         │
│ Size: 35 employees (+8 in last quarter)                │
│ Revenue: $1M-$5M (estimated)                            │
│ Industry: B2B Professional Services                     │
│ Founded: 2018                                           │
│ Tech Stack: HubSpot, LinkedIn Sales Nav, Slack         │
│                                                         │
│ 💡 Research Agent Insights                              │
│ • Hiring Signal: 3 new BD reps posted Oct 10           │
│ • Recent Funding: $2M Series A (Aug 2024)              │
│ • Decision Maker: Sarah is VP Sales (3 years tenure)   │
│ • Pain Point: Manual prospect research mentioned in    │
│   LinkedIn post                                         │
│ • Competitor Usage: Currently uses Apollo.io           │
│                                                         │
│ 📧 Email Status                                         │
│ Draft ready for review  •  Created Oct 14, 2:00 PM     │
│                               [Review Email Draft →]    │
│                                                         │
│ 📞 Activity Log                                         │
│ Oct 14, 9:00 AM - Enriched by Research Agent           │
│ Oct 14, 2:00 PM - Email drafted by Email Agent         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Status Icons:**
- 🆕 **New lead** = Just added, pending enrichment
- 🔍 **Enriching** = Research Agent working now
- 📧 **Email drafted** = Ready for user review
- ✅ **Email sent** = Approved & sent
- 💬 **Reply received** = Prospect responded
- 📞 **Meeting booked** = On calendar
- ❌ **Bounced** = Email failed

**Kebab Menu (⋮) Actions:**
- View full profile
- Edit prospect info
- Mark as high priority
- Add to sequence
- Export to CSV
- Delete prospect

---

### Screen 6: Email Review Queue

**Route:** `/emails/review`  
**Purpose:** Review agent-drafted emails (supervised automation)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back                  Email Review Queue             │
│                                                         │
│  43 pending your review                                 │
├─────────────────────────────────────────────────────────┤
│  Showing: Email 1 of 43                                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ To: Sarah Johnson                               │   │
│  │     sarah@acmeconsulting.com                    │   │
│  │                                                 │   │
│  │ Subject: Acme Consulting + GalaxyCo — Scale BD  │   │
│  │          without hiring more reps               │   │
│  │                                                 │   │
│  │ Hi Sarah,                                       │   │
│  │                                                 │   │
│  │ I saw that Acme Consulting just hired 3 new    │   │
│  │ BD reps — congrats on the growth! As your team │   │
│  │ scales, manual prospect research becomes a real│   │
│  │ bottleneck (speaking from experience with 50+  │   │
│  │ other consulting firms).                        │   │
│  │                                                 │   │
│  │ Quick question: What's your team currently     │   │
│  │ spending the most time on — research, outreach,│   │
│  │ or CRM updates?                                 │   │
│  │                                                 │   │
│  │ We built GalaxyCo.ai to automate all three:    │   │
│  │                                                 │   │
│  │ • Research Agent deep-dives on 50+ prospects/wk│   │
│  │ • Email Agent drafts personalized outreach     │   │
│  │ • CRM Agent auto-updates HubSpot after calls   │   │
│  │                                                 │   │
│  │ Result: Your reps spend 80% more time talking  │   │
│  │ to prospects (vs. doing busywork).             │   │
│  │                                                 │   │
│  │ Worth a quick 15-min chat to see if this is a  │   │
│  │ fit for Acme?                                   │   │
│  │                                                 │   │
│  │ Best,                                           │   │
│  │ Dalton                                          │   │
│  │                                                 │   │
│  │ P.S. — We're also working with TechConsult and │   │
│  │ Apex Partners (happy to intro you if helpful). │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Why Email Agent drafted this way:                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Research Insights Used:                         │   │
│  │ • Company just hired 3 BD reps (hiring signal) │   │
│  │ • Sarah is VP Sales (decision-maker)           │   │
│  │ • Acme uses HubSpot (mentioned in email)       │   │
│  │ • Industry: B2B consulting (personalized)      │   │
│  │                                                 │   │
│  │ Template Used: "Consulting Firm Scale" (v2.3)  │   │
│  │ Tone: Professional, conversational             │   │
│  │ Length: 142 words (optimal for reply rate)     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📊 Predicted Performance                               │
│  Reply Rate: 14-18% (vs 8% industry avg)               │
│  Meeting Book Rate: 4-6% (based on similar emails)     │
│                                                         │
│  ✏️  [Edit Email]                                       │
│  ✅  [Approve & Send]                                   │
│  ⏭️   [Skip This One]                                   │
│  ❌  [Mark as Bad Example] (Agent learns)              │
│                                                         │
│  [← Previous]              [Next (42 left) →]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Edit Mode (click "Edit Email"):**
```
┌─────────────────────────────────────────────────────────┐
│  Editing Email to Sarah Johnson                    [×]  │
├─────────────────────────────────────────────────────────┤
│  Subject:                                               │
│  [Acme Consulting + GalaxyCo — Scale BD without...]    │
│                                                         │
│  Email Body:                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Hi Sarah,                                       │   │
│  │                                                 │   │
│  │ I saw that Acme Consulting just hired 3 new... │   │
│  │ [Full editable text area]                      │   │
│  │                                                 │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Agent will learn from your edits                    │
│                                                         │
│  [Cancel]  [Save & Approve]  [Save as Template]        │
└─────────────────────────────────────────────────────────┘
```

**Keyboard Shortcuts:**
- `E` = Edit
- `A` = Approve
- `S` = Skip
- `→` = Next
- `←` = Previous

**Bulk Actions (top of queue):**
```
┌─────────────────────────────────────────────────────────┐
│  □ Select All (43 emails)                               │
│  [Approve Selected]  [Skip Selected]  [Export to CSV]   │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 7: Sent Emails (History)

**Route:** `/emails/sent`  
**Purpose:** View sent emails, track performance

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Sent Emails                                            │
├─────────────────────────────────────────────────────────┤
│  🔍 Search...    Filters: ▼ All  ▼ Date  ▼ Status      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ To           │ Subject     │ Sent     │ Status  │Actions│
├──────────────┼─────────────┼──────────┼─────────┼───────┤
│ Sarah Johnson│ Acme + Gal..│ Oct 14   │ 💬 Reply│ [⋮]  │
│              │             │ 2:15 PM  │ received│       │
│ Reply: "Hi Dalton, yes let's chat. Fri @ 2pm?"         │
├──────────────┼─────────────┼──────────┼─────────┼───────┤
│ Mike Chen    │ Beta Agency│ Oct 14   │ ✅ Opened│ [⋮]  │
│              │ Growth      │ 2:20 PM  │ 3x      │       │
│ Opened: Oct 14 2:45 PM, Oct 14 3:12 PM, Oct 14 4:01 PM │
├──────────────┼─────────────┼──────────┼─────────┼───────┤
│ Lisa Park    │ Gamma + Gal│ Oct 14   │ 📧 Sent │ [⋮]  │
│              │ Partnership │ 2:25 PM  │         │       │
│ Not opened yet                                          │
└─────────────────────────────────────────────────────────┘
```

**Row Expansion:**
```
┌─────────────────────────────────────────────────────────┐
│ Sarah Johnson  •  Acme Consulting                  [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📧 Original Email                                       │
│ Sent: Oct 14, 2:15 PM                                   │
│ Subject: Acme Consulting + GalaxyCo — Scale BD...      │
│ [Full email text shown here]                            │
│                                                         │
│ 💬 Reply Received                                       │
│ Oct 14, 3:42 PM (1 hour 27 min later)                  │
│ "Hi Dalton, yes let's chat. How about Friday @ 2pm?"   │
│                                                         │
│ 📊 Email Performance                                    │
│ • Opened: Oct 14, 2:47 PM (32 min after send)          │
│ • Clicked link: Yes (calendly link)                    │
│ • Reply received: Oct 14, 3:42 PM                      │
│ • Meeting booked: Yes (Oct 16, 2:00 PM)                │
│                                                         │
│ 🤖 Agent Analysis                                       │
│ Reply sentiment: Positive (87% confidence)              │
│ Next action: Meeting confirmed, add to CRM             │
│                                                         │
│ [Reply to Sarah] [View in CRM] [Add to Sequence]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Performance Dashboard (top of page):**
```
┌─────────────────────────────────────────────────────────┐
│  📊 Email Performance (Last 7 Days)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ 268        │  │ 12.3%      │  │ 4.5%       │       │
│  │ Emails Sent│  │ Reply Rate │  │ Meeting    │       │
│  │            │  │ (vs 8% avg)│  │ Book Rate  │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 8: CRM Sync

**Route:** `/crm-sync`  
**Purpose:** Review CRM updates before syncing

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  CRM Sync                                               │
├─────────────────────────────────────────────────────────┤
│  5 updates ready to sync to HubSpot                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Call with Sarah Johnson (Acme Consulting)      │   │
│  │ Oct 14, 3:00 PM  •  32 min duration            │   │
│  │                                                 │   │
│  │ 📞 Call Recording Analyzed by CRM Agent        │   │
│  │                                                 │   │
│  │ Key Quotes:                                     │   │
│  │ • "We're hiring 3 more reps next quarter"      │   │
│  │ • "Manual research is killing us right now"    │   │
│  │ • "Need to see pricing and case studies"       │   │
│  │                                                 │   │
│  │ Next Steps:                                     │   │
│  │ • Send pricing deck by Oct 15                  │   │
│  │ • Schedule demo for Oct 18                     │   │
│  │ • Intro to existing customer (TechConsult)     │   │
│  │                                                 │   │
│  │ Deal Stage Update:                              │   │
│  │ From: Prospecting                               │   │
│  │ To: Qualified Lead                              │   │
│  │                                                 │   │
│  │ Sentiment: Very Positive (92% confidence)      │   │
│  │                                                 │   │
│  │ [Edit Updates] [Approve & Sync] [Skip]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Call with Mike Chen (Beta Agency)              │   │
│  │ Oct 14, 2:15 PM  •  18 min duration            │   │
│  │                                                 │   │
│  │ 📞 Call Recording Analyzed by CRM Agent        │   │
│  │                                                 │   │
│  │ Key Quotes:                                     │   │
│  │ • "Not a priority right now, check back in Q1" │   │
│  │ • "Budget is tight after funding round"        │   │
│  │                                                 │   │
│  │ Next Steps:                                     │   │
│  │ • Follow up in January 2025                    │   │
│  │ • Add to nurture sequence                      │   │
│  │                                                 │   │
│  │ Deal Stage Update:                              │   │
│  │ From: Qualified Lead                            │   │
│  │ To: Not Now (Nurture)                           │   │
│  │                                                 │   │
│  │ Sentiment: Neutral (68% confidence)            │   │
│  │                                                 │   │
│  │ [Edit Updates] [Approve & Sync] [Skip]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Bulk Approve All (5)] [Export to CSV]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**CRM Integration Status (sidebar or top):**
```
┌─────────────────────────────────────────┐
│ 🔗 Connected to HubSpot                 │
│ Last sync: Oct 14, 4:05 PM             │
│ Next sync: Auto (when you approve)     │
│                                         │
│ [View HubSpot Dashboard →]              │
│ [Manage Integration]                    │
└─────────────────────────────────────────┘
```

---

### Screen 9: Knowledge Base

**Route:** `/knowledge`  
**Purpose:** Manage company context for agents

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Knowledge Base                        [+ Add Context]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your Company Context                                   │
│  Agents use this to personalize outreach and research   │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🎯 Ideal Customer Profile (ICP)                │    │
│  │                                                │    │
│  │ Industry: B2B Professional Services            │    │
│  │ Company Size: 10-50 employees                  │    │
│  │ Revenue: $1M-$10M                              │    │
│  │ Sales Team: 2-8 BD reps                        │    │
│  │                                                │    │
│  │ Current Tools: HubSpot, Pipedrive, LinkedIn    │    │
│  │ Sales Nav                                      │    │
│  │                                                │    │
│  │ Key Buyer: VP Sales, Head of BD (age 35-50)   │    │
│  │                                                │    │
│  │                              [Edit] [Delete]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📚 Case Studies                                 │    │
│  │                                                │    │
│  │ 1. TechConsult (35 employees)                  │    │
│  │    Result: 340% productivity gain, 15.2        │    │
│  │    hours/week saved per rep                    │    │
│  │                                                │    │
│  │ 2. Apex Partners (28 employees)                │    │
│  │    Result: 12.8% reply rate (vs 7% before),    │    │
│  │    $48k saved annually                         │    │
│  │                                                │    │
│  │ 3. Summit Advisors (42 employees)              │    │
│  │    Result: 50+ qualified leads/month, 80%+     │    │
│  │    retention                                   │    │
│  │                                                │    │
│  │                              [Edit] [Delete]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 💬 Common Objections & Responses                │    │
│  │                                                │    │
│  │ Objection: "Too expensive"                     │    │
│  │ Response: Show ROI calculator — $209k value    │    │
│  │ created for $6k cost = 35x return              │    │
│  │                                                │    │
│  │ Objection: "We already use Apollo/Clay"        │    │
│  │ Response: Those are point solutions. We do     │    │
│  │ research + emails + CRM in one supervised flow │    │
│  │                                                │    │
│  │ Objection: "Not ready to automate sales yet"   │    │
│  │ Response: This is supervised automation — you  │    │
│  │ review & approve everything. Think of it as a  │    │
│  │ super-assistant, not a replacement             │    │
│  │                                                │    │
│  │                              [Edit] [Delete]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🏢 Your Company Info                            │    │
│  │                                                │    │
│  │ Name: GalaxyCo.ai                              │    │
│  │ Website: galaxyco.ai                           │    │
│  │ Tagline: The Autonomous Sales Engine for B2B  │    │
│  │                                                │    │
│  │ Team:                                          │    │
│  │ • Jason Pelt (Network & Strategy)              │    │
│  │ • Dalton Cox (Product & Execution)             │    │
│  │                                                │    │
│  │                              [Edit] [Delete]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Add Context Modal:**
```
┌──────────────────────────────────────────┐
│  Add to Knowledge Base              [×]  │
├──────────────────────────────────────────┤
│                                          │
│  Context Type:                           │
│  ○ ICP Definition                        │
│  ○ Case Study                            │
│  ○ Objection/Response                    │
│  ○ Company Info                          │
│  ○ Other                                 │
│                                          │
│  Title:                                  │
│  [________________________]              │
│                                          │
│  Content:                                │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │ [Text area for content]            │ │
│  │                                    │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  💡 Agents will reference this when:     │
│  ☑ Researching prospects                 │
│  ☑ Drafting emails                       │
│  ☑ Analyzing calls                       │
│                                          │
│  [Cancel]  [Save to Knowledge Base]      │
│                                          │
└──────────────────────────────────────────┘
```

---

### Screen 10: Settings - Integrations

**Route:** `/settings/integrations`  
**Purpose:** Connect CRM, email, LinkedIn

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
│                                                         │
│  Integrations  Profile  Team  Billing  API Keys        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Connected Integrations                                 │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [HubSpot Logo]  HubSpot              ✅ Active │    │
│  │                                                │    │
│  │ Connected: Oct 1, 2024                         │    │
│  │ Syncing: Contacts, Deals, Activities           │    │
│  │                                                │    │
│  │ [View Settings] [Disconnect]                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Available Integrations                                 │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Pipedrive Logo]  Pipedrive       [Connect]    │    │
│  │ CRM integration for pipeline management        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [LinkedIn Logo]  LinkedIn Sales Nav [Connect]  │    │
│  │ Enhanced prospect research and data            │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Gmail Logo]  Gmail                [Connect]    │    │
│  │ Send emails through your account               │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Outlook Logo]  Outlook            [Connect]    │    │
│  │ Send emails through Microsoft 365              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Calendly Logo]  Calendly          [Connect]    │    │
│  │ Auto-include booking links in emails          │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 11: Settings - Team

**Route:** `/settings/team`  
**Purpose:** Manage team members, roles

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
│                                                         │
│  Integrations  Profile  Team  Billing  API Keys        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Team Members                         [+ Invite Member] │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ Name         │ Email            │ Role │ Actions│   │
│  ├──────────────┼──────────────────┼──────┼────────┤   │
│  │ Dalton Cox   │ dalton@galaxy... │ Owner│ [⋮]   │   │
│  │ Jason Pelt   │ jason@galaxy...  │ Admin│ [⋮]   │   │
│  │ Sarah Jones  │ sarah@galaxy...  │ User │ [⋮]   │   │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Roles & Permissions                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │ Owner: Full access, billing management         │    │
│  │ Admin: Manage team, configure agents           │    │
│  │ User: View & approve agent work                │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 12: Settings - Billing

**Route:** `/settings/billing`  
**Purpose:** Manage subscription, usage

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
│                                                         │
│  Integrations  Profile  Team  Billing  API Keys        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Current Plan                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ Team Plan                          $499/month  │    │
│  │ Up to 10 users                                 │    │
│  │ All 3 agents included                          │    │
│  │ Unlimited prospects                            │    │
│  │                                                │    │
│  │ Next billing: Nov 1, 2024                      │    │
│  │                                                │    │
│  │ [Change Plan] [Cancel Subscription]            │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Usage This Month                                       │
│  ┌────────────────────────────────────────────────┐    │
│  │ • 3,847 prospects enriched                     │    │
│  │ • 1,284 emails drafted                         │    │
│  │ • 127 CRM updates                              │    │
│  │                                                │    │
│  │ All within plan limits ✅                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Payment Method                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ Visa •••• 4242                                 │    │
│  │ Expires: 12/2025                               │    │
│  │                                                │    │
│  │ [Update Payment Method]                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Billing History                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ Date       │ Amount  │ Status  │ Invoice       │   │
│  ├────────────┼─────────┼─────────┼───────────────┤   │
│  │ Oct 1, 2024│ $499    │ Paid ✅ │ [Download PDF]│   │
│  │ Sep 1, 2024│ $499    │ Paid ✅ │ [Download PDF]│   │
│  │ Aug 1, 2024│ $499    │ Paid ✅ │ [Download PDF]│   │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Design System

### Color Palette

```scss
// Primary/Brand
$brand-primary: #6366F1;      // Indigo (agents, AI features)
$brand-secondary: #8B5CF6;    // Purple (premium features)
$brand-accent: #10B981;       // Green (success, approvals)

// Backgrounds
$bg-dark: #1F2937;           // Sidebar background (dark gray)
$bg-light: #FFFFFF;          // Main content background
$bg-muted: #F9FAFB;          // Subtle backgrounds (cards)
$bg-hover: #F3F4F6;          // Hover states

// Text
$text-primary: #111827;      // Headings, primary text
$text-secondary: #6B7280;    // Body text, descriptions
$text-muted: #9CA3AF;        // Placeholder text, disabled

// Borders
$border-default: #E5E7EB;    // Standard borders
$border-focus: #6366F1;      // Focus states

// Status Colors
$status-active: #10B981;     // Green (agent active, success)
$status-waiting: #F59E0B;    // Orange (needs review)
$status-paused: #6B7280;     // Gray (paused, inactive)
$status-error: #EF4444;      // Red (errors, critical)

// Agent Colors (for identification)
$agent-research: #3B82F6;    // Blue
$agent-email: #8B5CF6;       // Purple
$agent-crm: #10B981;         // Green
```

### Typography

```scss
// Font Family
$font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", 
               Roboto, "Helvetica Neue", Arial, sans-serif;
$font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;

// Font Sizes
$text-xs: 12px;    // Captions, labels
$text-sm: 14px;    // Body text (small), tables
$text-base: 16px;  // Body text (default)
$text-lg: 18px;    // Subheadings
$text-xl: 20px;    // Section headings
$text-2xl: 24px;   // Page headings
$text-3xl: 30px;   // Dashboard metrics
$text-4xl: 36px;   // Hero headings

// Font Weights
$weight-normal: 400;
$weight-medium: 500;
$weight-semibold: 600;
$weight-bold: 700;
```

### Spacing Scale (Tailwind-inspired)

```scss
$space-1: 4px;     // 0.25rem
$space-2: 8px;     // 0.5rem
$space-3: 12px;    // 0.75rem
$space-4: 16px;    // 1rem
$space-5: 20px;    // 1.25rem
$space-6: 24px;    // 1.5rem
$space-8: 32px;    // 2rem
$space-10: 40px;   // 2.5rem
$space-12: 48px;   // 3rem
$space-16: 64px;   // 4rem
```

### Border Radius

```scss
$radius-sm: 6px;    // Inputs, small buttons
$radius-md: 8px;    // Buttons, cards
$radius-lg: 12px;   // Modals, large cards
$radius-xl: 16px;   // Hero cards, dashboard widgets
$radius-full: 9999px; // Pills, status badges
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

// Agent glow effects (for status indicators)
$glow-research: 0 0 20px rgba(59, 130, 246, 0.3);
$glow-email: 0 0 20px rgba(139, 92, 246, 0.3);
$glow-crm: 0 0 20px rgba(16, 185, 129, 0.3);
```

---

## User Flows

### Flow 1: First-Time User Onboarding

```
1. User signs up → Email verification
   ↓
2. Logs in for first time → Welcome modal appears
   ↓
3. Reads about 3-agent model, clicks "Get Started"
   ↓
4. Setup Wizard Step 1: Connect CRM (HubSpot or Pipedrive)
   - OAuth flow
   - Permission grants
   ↓
5. Setup Wizard Step 2: Upload initial prospects
   - CSV upload OR
   - Import from CRM OR
   - Add manually
   ↓
6. Setup Wizard Step 3: Set knowledge base
   - ICP definition
   - Company info
   - (Optional) Case studies, objections
   ↓
7. Setup Wizard Step 4: Configure Research Agent
   - Choose enrichment depth
   - Select data sources
   ↓
8. Setup Wizard Step 5: Review first agent-drafted email
   - Research Agent enriches 1 prospect
   - Email Agent drafts 1 email
   - User reviews, approves (or edits)
   ↓
9. Setup complete! → Goes to Dashboard
   ↓
10. Dashboard shows "Agents are working now..." (enriching uploaded prospects)
```

### Flow 2: Daily Email Review Routine

```
1. User logs in (morning routine)
   ↓
2. Dashboard shows "43 emails ready for review"
   ↓
3. Clicks [Review] button
   ↓
4. Email Review Queue opens (Screen 6)
   ↓
5. Sees email #1 of 43
   - Reads drafted email
   - Sees research insights
   - Checks predicted performance
   ↓
6. Decision:
   - [Approve] → Email #2 appears
   - [Edit] → Makes changes, approves → Email #2
   - [Skip] → Email #2 (comes back later)
   - [Mark as Bad] → Agent learns, Email #2
   ↓
7. Repeats for 43 emails (or uses bulk approve)
   ↓
8. All approved emails sent automatically
   ↓
9. User sees "43 emails sent!" confirmation
   ↓
10. Goes to Dashboard or Sent Emails to track replies
```

### Flow 3: Call Notes → CRM Sync

```
1. User has sales call (outside GalaxyCo)
   ↓
2. Call recording uploaded to GalaxyCo OR
   CRM Agent auto-detects call in calendar
   ↓
3. CRM Agent analyzes recording:
   - Transcribes audio
   - Extracts key quotes
   - Identifies next steps
   - Determines deal stage change
   - Assesses sentiment
   ↓
4. User gets notification: "5 call notes ready for CRM sync"
   ↓
5. User clicks notification → goes to CRM Sync (Screen 8)
   ↓
6. Reviews first call note:
   - Reads extracted quotes
   - Checks next steps
   - Verifies deal stage update
   ↓
7. Decision:
   - [Approve & Sync] → Updates HubSpot
   - [Edit] → Fixes details, syncs
   - [Skip] → Doesn't sync this one
   ↓
8. Repeat for all 5 calls (or bulk approve)
   ↓
9. All approved updates synced to HubSpot
   ↓
10. User sees "5 deals updated in HubSpot" confirmation
```

### Flow 4: Adding a New Prospect Manually

```
1. User on Prospects Database (Screen 5)
   ↓
2. Clicks [+ Add Prospect] button
   ↓
3. Modal appears:
   - Name field
   - Email field
   - Company field
   - LinkedIn URL (optional)
   ↓
4. User fills in fields, clicks [Add Prospect]
   ↓
5. Prospect appears in table with status "🔍 Enriching..."
   ↓
6. Research Agent works (2-8 min depending on depth setting)
   ↓
7. Status changes to "🆕 Enriched"
   ↓
8. Email Agent auto-drafts email (if auto-draft enabled)
   ↓
9. User gets notification: "1 new email ready for review"
   ↓
10. User reviews email when ready
```

### Flow 5: Configuring Knowledge Base

```
1. User navigates to Knowledge Base (Screen 9)
   ↓
2. Clicks [+ Add Context] button
   ↓
3. Modal appears with context type options:
   - ICP Definition
   - Case Study
   - Objection/Response
   - Company Info
   - Other
   ↓
4. User selects "Case Study"
   ↓
5. Fills in:
   - Title: "TechConsult Success Story"
   - Content: [Full case study details]
   - Checkboxes: When agents should use this
   ↓
6. Clicks [Save to Knowledge Base]
   ↓
7. Case study appears in Knowledge Base list
   ↓
8. Agents immediately start using it:
   - Research Agent references it in insights
   - Email Agent mentions it in outreach
   - CRM Agent uses it for context
```

---

## Component Library Mapping (Hyper UI)

| GalaxyCo Element | Hyper UI Component | Customization Notes |
|---|---|---|
| Sidebar Navigation | `Navigation > Sidebar` | Dark theme, agent icons |
| Dashboard Metric Cards | `Cards > Stat Card` | Large numbers, comparison badges |
| Action Cards | `Cards > Action Card` | Icon + description + CTA button |
| Agent Status Cards | `Cards > Status Card` | Color-coded borders, glow effects |
| Data Tables | `Tables > Sortable Table` | Add search, filters, expandable rows |
| Email Review Queue | Custom Component | Card + navigation controls |
| Review Buttons | `Buttons > Button Group` | Approve/Edit/Skip actions |
| Prospect Detail Modal | `Overlays > Slide-over` | Right-side panel |
| Knowledge Base Cards | `Cards > Content Card` | Edit/delete actions |
| Settings Tabs | `Navigation > Tabs` | Horizontal tab nav |
| Integration Cards | `Cards > Feature Card` | Logo + description + connect button |
| Status Badges | `Badges > Status Badge` | Color-coded (active/waiting/paused) |
| Search Bars | `Forms > Input with Icon` | Magnifying glass icon |
| Dropdowns | `Forms > Select` | Filters, sorting |

### Custom Components to Build

1. **Email Review Card**
   - Base: Hyper UI Card
   - Add: Email preview, research insights panel, action buttons
   - Features: Expand/collapse, edit mode

2. **Agent Activity Log**
   - Base: Hyper UI Timeline
   - Add: Agent icons, confidence scores, "View Details" expansion

3. **Supervised Automation Controls**
   - Base: Hyper UI Button Group
   - Add: Bulk actions, keyboard shortcuts, progress indicator

4. **Prospect Enrichment Status**
   - Base: Hyper UI Progress Bar
   - Add: Real-time updates, estimated time remaining

5. **CRM Sync Preview**
   - Base: Hyper UI Card
   - Add: Diff view (before/after), approval controls

---

## Mobile Considerations

### Responsive Breakpoints

```scss
$breakpoint-sm: 640px;   // Mobile
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
```

### Mobile Adaptations

1. **Sidebar → Bottom Nav**
   - On mobile: Sidebar collapses to bottom nav bar
   - 5 icons: Dashboard, Agents, Prospects, Emails, More
   - Fixed position, always visible

2. **Dashboard Cards → Vertical Stack**
   - Metric cards: 2 cols → 1 col
   - Action cards: Full width
   - Swipeable carousel for agent activity

3. **Email Review → Full Screen**
   - Email preview takes full screen
   - Swipe left/right to navigate
   - Bottom sheet for research insights

4. **Tables → Card List**
   - Prospect table becomes stacked cards
   - Key info displayed prominently
   - Tap to expand full details

5. **Modals → Slide-up Sheets**
   - All modals become bottom sheets
   - Swipe down to dismiss
   - Larger touch targets (min 44px)

---

## Implementation Priority

### Phase 1: MVP (Weeks 1-4)

**Must-Have Screens:**
1. Onboarding (Screen 1)
2. Dashboard (Screen 2)
3. Agents Overview (Screen 3)
4. Prospects Database (Screen 5)
5. Email Review Queue (Screen 6)
6. Settings - Integrations (Screen 10)

**Core Features:**
- Connect HubSpot/Pipedrive
- Upload prospects (CSV)
- Research Agent enrichment
- Email Agent drafting
- Supervised review flow
- Basic knowledge base (ICP only)

**Tech Stack:**
- Frontend: React 18 + TypeScript, Vite, Tailwind, Radix UI
- Backend: Node + Express (TS), Drizzle ORM, PostgreSQL
- AI: OpenAI API, Anthropic API
- Auth: Clerk

---

### Phase 2: Full Product (Weeks 5-8)

**Additional Screens:**
4. Research Agent Detail (Screen 4)
7. Sent Emails (Screen 7)
8. CRM Sync (Screen 8)
9. Knowledge Base (Screen 9)
11. Settings - Team (Screen 11)
12. Settings - Billing (Screen 12)

**Additional Features:**
- Call recording analysis (CRM Agent)
- Advanced knowledge base (case studies, objections)
- Team collaboration
- Performance analytics
- Email templates library
- LinkedIn Sales Nav integration

---

### Phase 3: Scale (Weeks 9-12)

**Advanced Features:**
- Agent marketplace (pre-built templates)
- Custom agent builder
- Advanced analytics dashboard
- Webhooks & API
- White-label options
- Enterprise features (SSO, SAML)

---

## Next Steps

1. **Review & Validate:** Confirm all screens captured accurately
2. **Design System Setup:** Create Tailwind config with brand colors
3. **Component Library:** Build Hyper UI components with GalaxyCo styling
4. **Screen Implementation:** Start with Phase 1 MVP screens
5. **Agent Integration:** Wire up OpenAI/Anthropic APIs
6. **User Testing:** Validate flows with target customers

---

**End of GalaxyCo.ai Wireframe Documentation**
