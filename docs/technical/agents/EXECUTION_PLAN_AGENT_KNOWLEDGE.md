# Agent-Knowledge Integration - Execution Plan

**Phase:** 2.1 - Knowledge Base Tool for Agents  
**Timeline:** 2-3 days  
**Priority:** HIGH 🔥  
**Status:** Ready to Start

---

## 🎯 Goal

Enable agents to search and retrieve information from the knowledge base, creating RAG-powered AI assistants that can answer questions based on uploaded documents.

---

## 📋 Tasks Breakdown

### Day 1: Knowledge Search Tool Implementation

#### Task 1.1: Create Knowledge Base Tool Definition
**File:** `packages/agents-core/src/tools/knowledge-search.ts`  
**Time:** 2 hours

**What to build:**
```typescript
// Define tool for agents to search knowledge base
export const knowledgeSearchTool = {
  name: 'searchKnowledgeBase',
  description: 'Search the knowledge base for relevant information',
  parameters: {
    query: 'string (required) - The search query',
    collectionId: 'string (optional) - Limit search to specific collection',
    limit: 'number (optional) - Max results (default 5)'
  }
}
```

**Key features:**
- ✅ Tool definition following agents-core pattern
- ✅ Zod schema for parameter validation
- ✅ Execute function that calls semantic search API
- ✅ Format results for LLM consumption
- ✅ Include metadata (source, similarity score)

#### Task 1.2: Integrate Tool with Agent Execution
**File:** `apps/web/lib/ai/agent-executor.ts`  
**Time:** 2 hours

**What to build:**
- Register knowledge search tool in agent executor
- Handle tool calls during agent runs
- Pass workspace context to tool
- Error handling & logging

#### Task 1.3: Test Tool Integration
**Time:** 1 hour

**Tests:**
- [ ] Tool can be called from agent
- [ ] Results are properly formatted
- [ ] Collection filtering works
- [ ] Error cases handled gracefully

---

### Day 2: Agent Configuration & UI

#### Task 2.1: Add Knowledge Base Toggle to Agent Config
**Files:**
- `apps/web/components/agents/AgentConfigEditor.tsx`
- Database schema (if needed)

**Time:** 2 hours

**What to build:**
- "Enable Knowledge Base" checkbox in agent config UI
- Collection selector (multi-select)
- "Search entire knowledge base" vs "Specific collections" option
- Save configuration to agent.config.tools array

**UI Design:**
```
┌─────────────────────────────────────┐
│ Knowledge Base Access               │
├─────────────────────────────────────┤
│ ☑ Enable knowledge base search      │
│                                     │
│ Search scope:                       │
│ ○ All collections                   │
│ ● Specific collections              │
│                                     │
│ Selected collections:               │
│ ┌─────────────────────────────┐   │
│ │ ✓ Marketing Docs             │   │
│ │ ✓ Product Specs              │   │
│ │   Legal Documents            │   │
│ └─────────────────────────────┘   │
│                                     │
│ Max results per query: [5]         │
└─────────────────────────────────────┘
```

#### Task 2.2: Update Agent Creation/Edit Flow
**Files:**
- `apps/web/app/agents/new/page.tsx`
- `apps/web/app/agents/[id]/page.tsx`

**Time:** 1.5 hours

**What to update:**
- Include knowledge config section
- Save knowledge settings to agent config
- Load existing knowledge settings when editing
- Validation: If knowledge enabled, at least one collection or "all"

#### Task 2.3: Update Agent Execution to Use Knowledge
**File:** `apps/web/app/api/agents/[id]/execute/route.ts`  
**Time:** 1.5 hours

**What to update:**
- Check if agent has knowledge base enabled
- If yes, inject knowledge search tool
- Pass collection filters from agent config
- Handle tool calls during execution
- Return sources in response

---

### Day 3: Testing, Templates & Polish

#### Task 3.1: Create "Knowledge Agent" Template
**File:** `apps/web/lib/constants/agent-templates.ts`  
**Time:** 1 hour

**Template specs:**
```typescript
{
  name: "Document Q&A Agent",
  slug: "document-qa",
  type: "knowledge",
  description: "Answer questions based on your uploaded documents",
  shortDescription: "Get instant answers from your knowledge base",
  category: "Knowledge & Research",
  
  config: {
    aiProvider: "openai",
    model: "gpt-4-turbo-preview",
    temperature: 0.3,
    systemPrompt: `You are a helpful assistant that answers questions based on the provided knowledge base.

When searching for information:
1. Use the searchKnowledgeBase tool to find relevant documents
2. Cite your sources with document titles
3. If information isn't in the knowledge base, say so clearly
4. Provide accurate, concise answers

Always include source references in your responses.`,
    tools: ["searchKnowledgeBase"],
    knowledgeBase: {
      enabled: true,
      scope: "all",
      maxResults: 5
    }
  },
  
  kpis: {
    successRate: 95,
    avgTimeSaved: "5 minutes per query",
    accuracy: 92,
    avgDuration: "3 seconds"
  }
}
```

#### Task 3.2: Add Template to Marketplace
**Time:** 30 minutes

- Insert template into database (seed script or manual)
- Add icon/cover image
- Test installation flow

#### Task 3.3: End-to-End Testing
**Time:** 2 hours

**Test scenarios:**

1. **Basic Q&A:**
   - Upload sample PDF (product documentation)
   - Install "Document Q&A Agent"
   - Ask: "What are the main features?"
   - Verify: Agent searches knowledge base and answers

2. **Collection Filtering:**
   - Create 2 collections (Marketing, Technical)
   - Upload docs to each
   - Create agent scoped to "Marketing" only
   - Ask marketing question → should find answer
   - Ask technical question → should say "not in knowledge base"

3. **Citation Accuracy:**
   - Agent should mention document titles
   - Verify similarity scores are reasonable (> 0.7 for good matches)
   - Check that irrelevant docs aren't returned

4. **Error Handling:**
   - Empty knowledge base → graceful message
   - Invalid query → error handling
   - Network issues → retry logic

#### Task 3.4: Documentation & Polish
**Time:** 1 hour

**Tasks:**
- [ ] Update user guide with knowledge agent setup
- [ ] Add tooltips to knowledge config UI
- [ ] Create demo video (optional)
- [ ] Add example prompts to agent template
- [ ] Update API docs

---

## 📁 Files to Create/Modify

### New Files (7)
```
packages/agents-core/src/tools/
├── knowledge-search.ts          ← NEW: Tool definition
└── index.ts                     ← UPDATE: Export tool

apps/web/lib/ai/
└── agent-executor.ts            ← NEW: Agent execution with tools

apps/web/components/agents/
├── KnowledgeConfigSection.tsx   ← NEW: UI component
└── CollectionSelector.tsx       ← NEW: Multi-select component

docs/
└── KNOWLEDGE_AGENT_GUIDE.md     ← NEW: User guide
```

### Modified Files (5)
```
apps/web/components/agents/
└── AgentConfigEditor.tsx        ← ADD: Knowledge section

apps/web/app/agents/
├── new/page.tsx                 ← UPDATE: Include knowledge config
└── [id]/page.tsx                ← UPDATE: Include knowledge config

apps/web/app/api/agents/
└── [id]/execute/route.ts        ← UPDATE: Use knowledge tool

apps/web/lib/constants/
└── agent-templates.ts           ← ADD: New template
```

---

## 🔧 Technical Implementation Details

### Knowledge Search Tool Architecture

```typescript
// Tool execution flow:
Agent asks question
    ↓
Agent decides to use searchKnowledgeBase tool
    ↓
Tool receives: { query, collectionId?, limit? }
    ↓
Call semantic search API (/api/knowledge/search)
    ↓
Format results for LLM:
    {
      sources: [
        { title, content, similarity, collection }
      ]
    }
    ↓
LLM synthesizes answer with citations
    ↓
Return response to user
```

### Agent Config Schema Update

```typescript
// Add to agent.config
{
  tools: ["searchKnowledgeBase"],  // Tool names
  knowledgeBase: {
    enabled: boolean,
    scope: "all" | "collections",
    collectionIds: string[],        // If scope = "collections"
    maxResults: number               // Default 5
  }
}
```

---

## ✅ Success Criteria

Before marking this phase complete, verify:

- [ ] **Functionality**
  - [ ] Agent can search knowledge base
  - [ ] Results are relevant (similarity > 0.7)
  - [ ] Citations are accurate
  - [ ] Collection filtering works

- [ ] **User Experience**
  - [ ] Knowledge config UI is intuitive
  - [ ] Agent creation < 3 minutes
  - [ ] Response time < 3 seconds
  - [ ] Error messages are helpful

- [ ] **Quality**
  - [ ] No console errors
  - [ ] Proper error handling
  - [ ] Multi-tenant security enforced
  - [ ] API responses are typed

- [ ] **Documentation**
  - [ ] User guide complete
  - [ ] Code comments added
  - [ ] API endpoints documented

---

## 🚀 Execution Order

### Start Here (Day 1 Morning)
1. Create `knowledge-search.ts` tool
2. Test tool in isolation
3. Integrate with agent executor

### Continue (Day 1 Afternoon - Day 2)
4. Build knowledge config UI components
5. Update agent creation flow
6. Update agent execution API

### Finish (Day 3)
7. Create knowledge agent template
8. Run comprehensive tests
9. Polish & document

---

## 🎓 Learning Resources

If you need references while building:

1. **Agent Tools Pattern:**
   - See existing tools in `packages/agents-core/src/tools/`
   - Follow same structure for consistency

2. **Semantic Search API:**
   - Reference: `apps/web/app/api/knowledge/search/route.ts`
   - Already implemented and working!

3. **Agent Config UI:**
   - Example: `apps/web/components/agents/AgentConfigEditor.tsx`
   - Follow existing patterns for consistency

4. **OpenAI Function Calling:**
   - Your OpenAI documentation folder has examples
   - File: "Using tools.txt"

---

## 🐛 Potential Issues & Solutions

### Issue 1: Tool not being called by agent
**Solution:** Check system prompt includes instructions to use knowledge search

### Issue 2: Slow response times
**Solution:** 
- Limit to 5 results max
- Consider caching frequent queries
- Optimize semantic search API

### Issue 3: Irrelevant results
**Solution:**
- Increase similarity threshold (0.75+)
- Improve text preprocessing
- Better embedding model (future)

### Issue 4: Collection filtering not working
**Solution:**
- Verify workspaceId is passed correctly
- Check multi-tenant isolation
- Debug SQL query with logs

---

## 📊 Progress Tracking

Use this checklist to track progress:

### Day 1: Core Tool Implementation
- [ ] knowledge-search.ts created
- [ ] Tool tested in isolation
- [ ] Agent executor integration
- [ ] Basic end-to-end test passing

### Day 2: UI & Configuration
- [ ] Knowledge config UI built
- [ ] Collection selector working
- [ ] Agent creation flow updated
- [ ] Agent execution updated

### Day 3: Templates & Testing
- [ ] Knowledge agent template created
- [ ] Template in marketplace
- [ ] All test scenarios passing
- [ ] Documentation complete

---

## 🎉 When You're Done

You'll have:
1. ✅ RAG-powered agents that can search knowledge base
2. ✅ Easy-to-use UI for configuring knowledge access
3. ✅ Pre-built "Document Q&A Agent" template
4. ✅ Complete documentation
5. ✅ Your killer feature live!

This will be a **major differentiator** for your platform. Users will be able to:
- Upload their documentation
- Create specialized agents for their domain
- Get accurate answers with citations
- Build custom AI assistants in minutes

---

## 💬 Questions During Implementation?

If you get stuck or need clarification:
1. Check existing code patterns in the codebase
2. Reference the blueprint (`PROJECT_BLUEPRINT.md`)
3. Look at semantic search API (already working!)
4. Ask me for help! 😊

---

**Ready to start?** Let's begin with Task 1.1: Create the knowledge search tool! 🚀
