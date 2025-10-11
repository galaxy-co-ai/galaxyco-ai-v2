# Research Workflow Guide 🔍

**How to efficiently gather and document internet research for AI transformation**

---

## 🎯 Quick Start

### 1. Start Your Research Session

```bash
cd docs/working/drafts
cp ../TEMPLATE-RESEARCH.md research-[topic-name].md
```

### 2. Open in Your Editor + Browser

- Keep the research doc open in your editor
- Browse normally, but capture as you go
- Don't wait until the end to document

### 3. Capture Pattern

For each source:

1. Copy URL immediately
2. Paste key quotes/code/info
3. Add your quick notes
4. Move to next source

### 4. When Done Researching

- Write the Executive Summary
- Fill in Recommendations
- Tell AI: "Review research-[topic-name].md"

---

## 📚 Research Scenarios & Strategies

### Scenario 1: Evaluating a Technology/Tool

**Example**: "Should we use Temporal or BullMQ for job orchestration?"

**Strategy**:

1. Fill out "Questions to Answer" first
   - What are we trying to achieve?
   - What scale do we need?
   - What's our budget?

2. Research in this order:
   - Official docs (architecture, capabilities)
   - GitHub (activity, issues, PRs)
   - Real-world usage (blog posts, case studies)
   - Community sentiment (Reddit, HN, Discord)
   - Benchmarks & comparisons

3. Key sections to focus on:
   - Comparison table with "Our Fit" ratings
   - Real-World Examples
   - Cost Analysis
   - Pros & Cons
   - Recommendations

**What to capture**:

````markdown
### Temporal vs BullMQ

**Source**: Temporal Docs - https://docs.temporal.io/

**Key Information**:

- Workflow as code, survives crashes
- Strong consistency guarantees
- Higher complexity, steeper learning curve

**Code Example**:

```typescript
// Paste actual code from docs
```
````

**My Notes**:

- This is overkill for MVP but great for V1
- Cost is ~$100/mo for our scale
- Learning curve = 1-2 weeks

````

---

### Scenario 2: Learning a New Pattern/Concept

**Example**: "How do I implement WebSocket authentication with Clerk?"

**Strategy**:
1. Start with official docs (foundational understanding)
2. Look for example implementations (GitHub, CodeSandbox)
3. Find blog posts (practical experiences)
4. Check for gotchas (Stack Overflow, Issues)

**What to capture**:
```markdown
### WebSocket Auth with Clerk

**Source**: Clerk Docs + Example Repo

**Key Information**:
- Pass token in initial handshake
- Verify on server using Clerk SDK
- Handle token expiry & refresh

**Code Example**:
```typescript
// Client side
const socket = io(url, {
  auth: { token: await clerk.session.getToken() }
});

// Server side
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const session = await clerk.verifyToken(token);
    socket.userId = session.userId;
    next();
  } catch (err) {
    next(new Error('Auth failed'));
  }
});
````

**Gotchas Found**:

- Token expires after 1 hour, need refresh logic
- Need to handle disconnection during auth
- Source: [GitHub Issue #123]

**My Notes**:

- We'll need middleware in apps/api/src/middleware/
- Store socket.userId for tenant filtering

````

---

### Scenario 3: Competitive Analysis

**Example**: "How does Zapier handle their agent marketplace?"

**Strategy**:
1. Use the product extensively
2. Screenshot key flows
3. Note UX patterns
4. Research technical approach
5. Find their engineering blog/talks

**What to capture**:
```markdown
### Zapier Marketplace Analysis

**Source**: Zapier.com + Engineering Blog

**Key Findings**:
- Card-based discovery with search/filters
- Categories: Productivity, Sales, Marketing
- Each "Zap" shows: triggers, actions, popularity
- "Try it" button opens pre-filled builder
- Featured section for curated content

**Screenshots**:
Saved to: docs/working/drafts/assets/zapier-research/
- marketplace-overview.png
- zap-detail-page.png
- search-filters.png

**UX Patterns We Should Adopt**:
1. Quick preview on hover (doesn't navigate away)
2. Clear "New", "Popular", "Trending" badges
3. Author reputation visible
4. "Use This Pack" one-click install

**Technical Approach** (inferred):
- SSR for SEO
- Client-side filtering (fast)
- Lazy loading cards (performance)
- Analytics on every card view/click

**Lessons for GalaxyCo**:
- We need better categorization
- "Trending" based on WSAO metric
- One-click install is table stakes
````

---

### Scenario 4: Debugging/Problem Solving

**Example**: "Why is our LangGraph agent timing out?"

**Strategy**:

1. Collect error messages and stack traces
2. Search for similar issues
3. Check version compatibility
4. Look for known bugs or limitations
5. Find workarounds or solutions

**What to capture**:

````markdown
### LangGraph Timeout Issues

**Problem**:
Agent execution times out after 30s on complex workflows

**Source**: LangGraph GitHub Issues #456

**Root Cause**:
Default timeout in AsyncExecutor is 30s, not configurable in v0.1.x

**Solution Found**:

```python
# Workaround until v0.2.0
from langgraph.async_executor import AsyncExecutor

executor = AsyncExecutor(timeout=300)  # 5 minutes
graph.compile(executor=executor)
```
````

**Version Info**:

- Current: langgraph==0.1.5
- Fixed in: v0.2.0 (not released yet)
- Workaround works: ✅

**Our Action**:

- Apply workaround in services/agents/src/executor.py
- Monitor for v0.2.0 release
- Add to upgrade checklist

**Source**:

- Issue: https://github.com/langchain/langgraph/issues/456
- Workaround: Comment by @user123

````

---

## 🎨 Capture Techniques

### Speed Reading & Capturing

**The "Three Passes" Method**:

**Pass 1 - Skim (5 min)**:
- Scan headings
- Read intro/conclusion
- Note if worth deeper dive
- Capture: Source URL + quality rating

**Pass 2 - Extract (15 min)**:
- Read relevant sections
- Copy key quotes
- Grab code examples
- Capture: Key information bullets

**Pass 3 - Analyze (10 min)**:
- Think about application
- Compare to our needs
- Note questions/concerns
- Capture: "My Notes" section

### Browser Bookmarks → Research Doc

As you browse:
1. Bookmark promising pages with tag "research-[topic]"
2. When done browsing, process bookmarks:
   ```markdown
   ## Sources
   | Source | Type | URL | Quality | Date |
   |--------|------|-----|---------|------|
   | [From bookmark] | Blog | https://... | ⭐⭐⭐⭐ | 2025-10-11 |
````

### Code Examples

When you find good code:

````markdown
**Code Example**:

```language
// PASTE FULL EXAMPLE
// Don't truncate, AI can handle large examples
// Include imports, types, everything
```
````

**Why this works**:

- [Your explanation of what makes this good]

**How we'd adapt it**:

- Change X to Y for our use case
- Add Z for tenant isolation

````

### Screenshots & Diagrams

```bash
# Create assets folder
mkdir -p docs/working/drafts/assets/research-[topic-name]/

# Save screenshots there
# Then reference in doc:
````

```markdown
### Visual Resources

**Screenshot 1**: marketplace-layout.png

- Shows: Card grid with filters on left
- Notable: Hover state reveals quick actions
- Lesson: We should add quick actions too
```

---

## 🔄 AI Transformation Process

### What AI Will Do With Your Research

**IMPORTANT**: AI will revise your research document, not just extract from it!

#### Phase 1: Critical Analysis & Revision

AI will:

1. **Analyze** all findings critically
2. **Filter** what's relevant vs noise
3. **Revise** the document itself:
   - Remove irrelevant information
   - Add critical analysis section
   - Organize by priority (Implement/Defer/Skip)
   - Add trade-off analysis
   - Flag questions for human decision
4. **Move to `reviewed/`** when it meets quality standards

#### Phase 2: Present for Approval

AI will:

1. Show you the revised document
2. Explain what was kept and why
3. Explain what was removed and why
4. Ask clarifying questions
5. Wait for your approval

#### Phase 3: Extract Artifacts (After Approval)

#### 1. Extract Decisions

Creates Architecture Decision Records (ADRs):

```markdown
# ADR-005: Use Temporal for Agent Orchestration

**Date**: 2025-10-11
**Status**: Accepted

## Context

[From your research: problem statement]

## Decision

[From your research: recommendation]

## Consequences

[From your research: pros/cons]
```

#### 2. Generate Implementation Code

Takes your examples and adapts them:

```typescript
// Your research had example from blog
// AI transforms to our pattern:

// apps/api/src/agents/orchestrator.ts
import { Temporal } from "@temporalio/client";
import { getWorkspaceContext } from "@/lib/workspace";

export class AgentOrchestrator {
  // [AI-generated implementation using research patterns]
}
```

#### 3. Create Runbooks

From "How-To" research:

```markdown
# Runbook: Deploy Agent to Production

## Prerequisites

[From research: requirements section]

## Steps

[From research: implementation details]

## Rollback

[From research: gotchas section]
```

#### 4. Update Knowledge Base

Adds to project documentation:

- Architecture docs get technical deep dives
- Best practices get patterns discovered
- Gotchas get added to troubleshooting guides

#### 5. Generate Tasks

Creates actionable todos:

```markdown
## Implementation Tasks (from research)

- [ ] Install temporal SDK: `pnpm add @temporalio/client`
- [ ] Create worker in apps/api/src/workers/
- [ ] Add orchestration service
- [ ] Update agent execution to use workflows
- [ ] Add monitoring for workflow status
```

---

## 💡 Pro Tips

### Do This:

✅ **Capture URLs immediately** - You'll never find that page again
✅ **Copy-paste liberally** - Disk space is cheap, your time isn't
✅ **Include version numbers** - "Works in v2.3 but not v2.4" is critical
✅ **Rate source quality** - AI trusts official docs > random blogs
✅ **Add your thoughts** - "My Notes" sections add crucial context
✅ **Note the date** - Tech info expires fast
✅ **Link related concepts** - Research builds on research

### Don't Do This:

❌ **Wait until done to document** - You'll forget key insights
❌ **Paraphrase everything** - Direct quotes with sources are better
❌ **Skip examples** - Code is often clearer than prose
❌ **Overthink organization** - AI will reorganize, focus on capture
❌ **Self-censor** - Include tangential finds, might be useful later
❌ **Forget context** - "This is cool" isn't helpful. "This solves our X problem" is.

---

## 📊 Research Session Template

Use this structure for a research session:

```markdown
## Session: [Date] - [Topic]

**Goal**: Answer [specific question]
**Time box**: 2 hours
**Success criteria**: Can make decision on [X]

### Hour 1: Broad Discovery

- [ ] Official docs
- [ ] Top 3 blog posts
- [ ] GitHub repos

### Hour 2: Deep Dive

- [ ] Best approach from Hour 1
- [ ] Code examples
- [ ] Real-world usage

### Output:

- Filled research doc
- Clear recommendation
- Next steps identified
```

---

## 🎯 Common Research Topics for GalaxyCo

### High Priority Research Areas:

1. **Agent Orchestration**
   - Temporal vs BullMQ vs custom
   - WebSocket real-time updates
   - Error handling & retry strategies

2. **Multi-tenancy Patterns**
   - Database isolation strategies
   - Row-level security in Postgres
   - Tenant context propagation

3. **LLM Integration**
   - Rate limiting strategies
   - Cost optimization techniques
   - Streaming vs batch responses

4. **Authentication & Authorization**
   - Clerk advanced patterns
   - API key management
   - Workspace-level permissions

5. **Performance & Scaling**
   - Database query optimization
   - Caching strategies
   - Background job patterns

6. **Marketplace & Community**
   - Discovery patterns
   - Rating systems
   - Content moderation

---

## 🚀 Example: Complete Research Flow

### From Start to Integrated Docs

```bash
# 1. Start research
cd docs/working/drafts
cp ../TEMPLATE-RESEARCH.md research-websocket-auth.md

# 2. Research for 90 minutes
# [You gather information, fill the template]

# 3. Request review
# Tell AI: "Review research-websocket-auth.md, focus on implementation"

# 4. AI processes
# - Reads your research
# - Extracts patterns
# - Generates implementation code
# - Creates ADR if decision needed
# - Moves to reviewed/

# 5. AI presents
# "I've created:
#  - Implementation guide in reviewed/
#  - ADR-006-websocket-authentication.md
#  - Code examples adapted to our stack
#  - Added to technical docs
#  Ready to review?"

# 6. You approve
# "Looks good, integrate"

# 7. AI integrates
# - Moves to knowledge base
# - Updates related docs
# - Commits with proper message
# - Archives research doc
```

---

## 📋 Research Checklist

Before saying "done":

- [ ] Answered initial questions from Research Objective?
- [ ] All sources have URLs?
- [ ] Code examples included where relevant?
- [ ] Noted version numbers for tools/libraries?
- [ ] Added your analysis/thoughts?
- [ ] Written Executive Summary?
- [ ] Made a clear recommendation?
- [ ] Listed next steps?
- [ ] Told AI what to focus on in review?

---

**Ready to research?** Copy `TEMPLATE-RESEARCH.md` and start capturing! 🔍

---

_Part of the Working Docs System_
_Last Updated: 2025-10-11_
