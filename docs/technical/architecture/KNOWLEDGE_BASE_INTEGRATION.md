# Knowledge Base Integration

## Overview

The Knowledge Base Integration feature enables AI agents to search and retrieve information from your uploaded documents, URLs, and text notes using semantic search. This Retrieval Augmented Generation (RAG) functionality allows agents to provide accurate, cited answers based on your specific knowledge base.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Usage](#usage)
- [Agent Templates](#agent-templates)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Features

### Core Capabilities

- **Semantic Search**: Uses OpenAI embeddings (text-embedding-3-small) for accurate document retrieval
- **Collection-Based Filtering**: Search across all documents or specific collections
- **Adjustable Result Count**: Configure 1-20 results per query (default: 5)
- **Automatic Relevance Scoring**: Returns similarity scores (0-1) for each result
- **Multi-Document Synthesis**: Agents can combine information from multiple sources
- **Source Citations**: Agents automatically cite sources with relevance scores

### Supported Content Types

- **Documents**: PDFs, TXT, DOCX (automatically extracted and embedded)
- **URLs**: Web pages (scraped and embedded)
- **Text Notes**: Direct text input (embedded on creation)
- **Images**: OCR text extraction (if available)

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                  Agent Builder UI                   │
│  ┌─────────────────────────────────────────────┐   │
│  │    KnowledgeConfigSection Component          │   │
│  │  - Enable/Disable Toggle                     │   │
│  │  - Scope Selection (All/Collections)         │   │
│  │  - Collection Multi-Select                   │   │
│  │  - Max Results Slider                        │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Agent Execution Engine                 │
│  ┌─────────────────────────────────────────────┐   │
│  │     Agent Executor (agent-executor.ts)       │   │
│  │  - Checks knowledgeBase config               │   │
│  │  - Adds knowledge search tool if enabled     │   │
│  │  - Executes with OpenAI function calling     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│            Knowledge Search Tool                    │
│  ┌─────────────────────────────────────────────┐   │
│  │   searchKnowledgeBase Function               │   │
│  │  - Accepts query and optional filters        │   │
│  │  - Generates query embedding                 │   │
│  │  - Performs vector similarity search         │   │
│  │  - Returns ranked results with scores        │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                  │
│  ┌─────────────────────────────────────────────┐   │
│  │  knowledge_items table                       │   │
│  │  - title, type, url, extractedText           │   │
│  │  - embedding (vector)                        │   │
│  │  - collectionId (optional)                   │   │
│  │  - workspaceId (multi-tenant)                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload Phase**:
   - User uploads document/URL to Knowledge Base
   - Content is extracted (PDF parsing, web scraping, etc.)
   - Text is chunked if needed (for large documents)
   - Embeddings are generated using OpenAI
   - Stored in database with metadata

2. **Agent Execution Phase**:
   - User executes agent with a query
   - Agent executor checks if knowledge base is enabled
   - If enabled, adds `searchKnowledgeBase` tool to available tools
   - Agent (via OpenAI) decides when to call the tool
   - Tool performs vector search and returns results
   - Agent synthesizes answer using retrieved information

3. **Response Phase**:
   - Agent provides answer with citations
   - Tool calls are logged for debugging
   - Usage metrics are tracked

## Configuration

### Agent Configuration UI

When creating or editing an agent, you'll find the **Knowledge Base Access** section between the Configuration Form and Advanced Settings.

#### Enable/Disable Toggle

```typescript
knowledgeBase: {
  enabled: boolean; // Turn knowledge base access on/off
}
```

#### Search Scope

```typescript
knowledgeBase: {
  enabled: true,
  scope: 'all' | 'collections';  // Search all or specific collections
}
```

- **All Collections**: Searches across all documents in the knowledge base
- **Specific Collections**: Limits search to selected collections only

#### Collection Selection

When scope is set to `'collections'`, you can select one or more collections:

```typescript
knowledgeBase: {
  enabled: true,
  scope: 'collections',
  collectionIds: ['collection-id-1', 'collection-id-2']
}
```

**Validation**: At least one collection must be selected when using specific collections scope.

#### Max Results

Configure how many documents the agent can retrieve per search:

```typescript
knowledgeBase: {
  enabled: true,
  maxResults: 5  // Range: 1-20, default: 5
}
```

**Guidelines**:

- **1-3 results**: Fast, focused answers (best for specific queries)
- **4-7 results**: Balanced approach (default, recommended)
- **8-15 results**: Comprehensive research (slower, more tokens)
- **16-20 results**: Deep analysis (expensive, use sparingly)

### Database Schema

The agent's knowledge base configuration is stored in the `agents` table:

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- config structure:
{
  "aiProvider": "openai",
  "model": "gpt-4-turbo-preview",
  "systemPrompt": "...",
  "knowledgeBase": {
    "enabled": true,
    "scope": "all",
    "collectionIds": [],
    "maxResults": 5
  }
}
```

### Programmatic Configuration

```typescript
import { useAgentBuilder } from '@/hooks/use-agent-builder';

const MyComponent = () => {
  const { state, updateKnowledgeBase } = useAgentBuilder();

  // Enable knowledge base with all collections
  updateKnowledgeBase({
    enabled: true,
    scope: 'all',
    maxResults: 5,
  });

  // Enable with specific collections
  updateKnowledgeBase({
    enabled: true,
    scope: 'collections',
    collectionIds: ['collection-uuid-1', 'collection-uuid-2'],
    maxResults: 8,
  });

  // Disable knowledge base
  updateKnowledgeBase({
    enabled: false,
  });
};
```

## Usage

### Creating a Knowledge-Enabled Agent

#### Option 1: Using Templates

1. Navigate to **Agents** → **Create New Agent**
2. Select a knowledge-based template:
   - **Document Q&A Agent**: Simple Q&A over your documents
   - **Research Assistant**: Comprehensive research with synthesis
   - **Knowledge Expert**: Technical expert with collection-specific knowledge
3. Configure collections (if needed)
4. Adjust max results
5. Publish the agent

#### Option 2: Custom Agent

1. Create a new agent (or edit existing)
2. Configure basic info and AI settings
3. Scroll to **Knowledge Base Access** section
4. Toggle **Enable Knowledge Base Search**
5. Choose scope and collections
6. Set max results (recommended: 5-7)
7. Update system prompt to include citation instructions
8. Save and publish

### System Prompt Guidelines

For best results, include these instructions in your system prompt:

```
When responding:
1. Use the searchKnowledgeBase tool to find relevant documents
2. Base your answers ONLY on information from the knowledge base
3. Always cite sources by mentioning document titles
4. If information isn't available, clearly state: "I don't have information about that in the knowledge base."
5. Include similarity scores to show confidence
6. Synthesize information from multiple sources when relevant

Format:
- Direct answer with evidence
- Source citations with relevance scores
```

### Example Agent Configuration

```typescript
{
  name: "Company Knowledge Bot",
  description: "Answers questions about company policies and procedures",
  type: "knowledge",
  configuration: {
    trigger: "manual",
    aiProvider: "openai",
    model: "gpt-4-turbo-preview",
    temperature: 0.3,
    systemPrompt: `You are a company knowledge assistant...`,
    maxTokens: 1500
  },
  knowledgeBase: {
    enabled: true,
    scope: "collections",
    collectionIds: ["policies-collection-id", "procedures-collection-id"],
    maxResults: 5
  }
}
```

### Executing Knowledge-Enabled Agents

```typescript
import { executeAgent } from '@/lib/actions/agent-actions';

// Execute agent with knowledge base query
const result = await executeAgent(
  agentId,
  {
    question: 'What is our remote work policy?',
  },
  'live',
);

console.log(result.output);
// "According to the Employee Handbook (95% match), our remote work policy allows..."

console.log(result.toolCalls);
// [
//   {
//     toolName: "searchKnowledgeBase",
//     arguments: { query: "remote work policy" },
//     result: {
//       results: [
//         {
//           id: "...",
//           title: "Employee Handbook",
//           similarity: 0.95,
//           extractedText: "..."
//         }
//       ]
//     }
//   }
// ]
```

## Agent Templates

### Document Q&A Agent

**Purpose**: Simple question-answering over your knowledge base

**Configuration**:

```typescript
{
  model: "gpt-4-turbo-preview",
  temperature: 0.3,
  maxTokens: 1500,
  knowledgeBase: {
    enabled: true,
    scope: "all",
    maxResults: 5
  }
}
```

**Use Cases**:

- Employee onboarding questions
- Product documentation lookup
- Policy clarification
- Quick fact retrieval

### Research Assistant

**Purpose**: Comprehensive research with multi-document synthesis

**Configuration**:

```typescript
{
  model: "gpt-4-turbo-preview",
  temperature: 0.4,
  maxTokens: 2000,
  knowledgeBase: {
    enabled: true,
    scope: "all",
    maxResults: 10
  }
}
```

**Use Cases**:

- Market research
- Competitive analysis
- Literature review
- Trend identification

### Knowledge Expert

**Purpose**: Technical expert with collection-specific knowledge

**Configuration**:

```typescript
{
  model: "gpt-4-turbo-preview",
  temperature: 0.2,
  maxTokens: 1500,
  knowledgeBase: {
    enabled: true,
    scope: "collections",
    collectionIds: ["technical-docs-collection"],
    maxResults: 8
  }
}
```

**Use Cases**:

- Technical support
- Implementation guidance
- Best practice recommendations
- Code review assistance

## API Reference

### Knowledge Search Tool

The `searchKnowledgeBase` tool is automatically added to agents with knowledge base enabled.

#### Tool Definition

```typescript
{
  type: "function",
  function: {
    name: "searchKnowledgeBase",
    description: "Search the knowledge base for relevant documents and information using semantic search",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to find relevant documents"
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return (default: 5)",
          default: 5
        }
      },
      required: ["query"]
    }
  }
}
```

#### Tool Response

```typescript
{
  success: true,
  results: [
    {
      id: "knowledge-item-uuid",
      title: "Document Title",
      type: "document" | "url" | "text",
      url: "https://...",
      extractedText: "Relevant text content...",
      collectionId: "collection-uuid",
      similarity: 0.95,
      createdAt: "2025-01-15T10:00:00Z"
    }
  ],
  totalResults: 5,
  query: "original search query"
}
```

### Agent Execution API

When executing an agent with knowledge base enabled:

```typescript
POST /api/agents/{agentId}/execute

Request:
{
  "inputs": {
    "question": "What is X?"
  },
  "mode": "live"
}

Response:
{
  "success": true,
  "output": {
    "answer": "Based on Document A (95% match)..."
  },
  "metrics": {
    "tokens": 450,
    "cost": 0.0045,
    "latencyMs": 2300
  },
  "toolCalls": [
    {
      "toolName": "searchKnowledgeBase",
      "arguments": { "query": "what is X" },
      "result": { /* search results */ }
    }
  ]
}
```

## Best Practices

### 1. Optimize System Prompts

✅ **DO**:

- Explicitly instruct to use `searchKnowledgeBase` tool
- Require source citations
- Set expectations for "not found" scenarios
- Define response format

❌ **DON'T**:

- Assume the agent will automatically search
- Allow answers without citations
- Use vague instructions

### 2. Collection Organization

✅ **DO**:

- Create topic-specific collections
- Use descriptive collection names
- Limit agents to relevant collections
- Regularly update and maintain collections

❌ **DON'T**:

- Put everything in one collection
- Use generic collection names
- Give agents access to unrelated documents

### 3. Document Preparation

✅ **DO**:

- Use clear, descriptive document titles
- Break large documents into logical chunks
- Include metadata and context
- Remove duplicate content

❌ **DON'T**:

- Upload files with generic names like "doc1.pdf"
- Upload extremely large files (>10MB) without chunking
- Include scanned images without OCR

### 4. Max Results Tuning

**Start Conservative**: Begin with 5 results and adjust based on:

- Query complexity (simple = fewer, complex = more)
- Token budget (more results = more tokens)
- Response time requirements (fewer = faster)
- Answer quality (monitor and adjust)

**Performance Impact**:

```
Results | Avg Tokens | Avg Latency | Use Case
--------|-----------|-------------|----------
1-3     | 200-500   | 1-2s       | Quick facts
4-7     | 500-1000  | 2-3s       | General Q&A
8-12    | 1000-2000 | 3-5s       | Research
13-20   | 2000-4000 | 5-10s      | Deep analysis
```

### 5. Testing and Monitoring

✅ **DO**:

- Test agents with known questions
- Review tool call logs
- Monitor answer quality
- Track relevance scores
- Adjust configurations based on results

❌ **DON'T**:

- Deploy without testing
- Ignore low similarity scores
- Skip validation of citations

### 6. Cost Optimization

**Embedding Costs** (one-time per document):

- text-embedding-3-small: ~$0.00002 per 1K tokens
- Average document (5K tokens): ~$0.0001

**Inference Costs** (per agent execution):

- GPT-4 Turbo: ~$0.01-0.03 per query
- GPT-3.5 Turbo: ~$0.002-0.005 per query

**Cost Reduction Strategies**:

1. Use GPT-3.5 for simple Q&A
2. Limit max results to 5-7
3. Implement caching for common queries
4. Use collection filtering to reduce search space

### 7. Security and Privacy

✅ **DO**:

- Use collection-based access control
- Restrict sensitive documents to specific agents
- Audit agent access patterns
- Implement row-level security

❌ **DON'T**:

- Give all agents access to all documents
- Store PII without proper controls
- Share collections across tenants

## Troubleshooting

### Agent Not Using Knowledge Base

**Symptom**: Agent responds without searching documents

**Solutions**:

1. Verify `knowledgeBase.enabled = true` in agent config
2. Check system prompt includes instructions to use the tool
3. Ensure agent uses OpenAI (Anthropic support coming soon)
4. Review execution logs for tool calls

### No Relevant Results Found

**Symptom**: Search returns empty or low-relevance results

**Solutions**:

1. Check document embeddings are generated
2. Verify collection filters are correct
3. Review search query phrasing
4. Inspect similarity scores (< 0.7 may indicate poor match)
5. Add more relevant documents to knowledge base

### Citations Missing or Incorrect

**Symptom**: Agent doesn't cite sources properly

**Solutions**:

1. Update system prompt with explicit citation requirements
2. Provide citation format examples
3. Ensure document titles are descriptive
4. Review tool call results in execution logs

### Performance Issues

**Symptom**: Slow response times

**Solutions**:

1. Reduce `maxResults` to 5 or fewer
2. Use collection filtering to narrow search
3. Check document sizes (large docs = slow retrieval)
4. Monitor database query performance
5. Consider caching for common queries

### Token Limit Errors

**Symptom**: Execution fails due to context length

**Solutions**:

1. Reduce `maxResults`
2. Decrease `maxTokens` in agent config
3. Shorten system prompt
4. Use GPT-4 Turbo (128K context) instead of GPT-4 (8K)
5. Implement document chunking for large content

### Multi-Tenant Issues

**Symptom**: Cross-workspace data leakage

**Solutions**:

1. Verify `workspaceId` filter in all queries
2. Check row-level security policies
3. Audit agent access patterns
4. Review collection permissions

## Advanced Topics

### Custom Similarity Thresholds

Filter results by similarity score in your system prompt:

```
Only use documents with similarity > 0.8.
If no high-confidence results, respond: "I need more specific information..."
```

### Multi-Query Strategies

For complex questions, instruct agents to search multiple times:

```
For comprehensive answers:
1. Search for the main topic
2. Search for related subtopics
3. Search for examples or case studies
4. Synthesize all findings
```

### Hybrid Search

Combine semantic search with keyword filtering:

```
Use searchKnowledgeBase with:
- Primary query: semantic search
- Collection filter: narrow to relevant docs
- Follow-up searches: refine based on initial results
```

### Agent Chaining

Chain multiple knowledge-enabled agents:

```
Agent 1: Research Assistant (gathers info)
  ↓
Agent 2: Summarizer (condenses findings)
  ↓
Agent 3: Report Writer (formats final output)
```

## Future Enhancements

### Planned Features

- **Anthropic Support**: Claude models with knowledge base
- **Hybrid Search**: Combine semantic + keyword search
- **Reranking**: Re-score results with cross-encoder
- **Caching**: Cache embeddings and common queries
- **Analytics Dashboard**: Track search patterns and quality
- **Auto-Chunking**: Intelligent document splitting
- **Multi-Modal**: Image and audio search support

### Roadmap

**Q2 2025**:

- [ ] Anthropic function calling support
- [ ] Search analytics dashboard
- [ ] Advanced filtering (date, type, metadata)

**Q3 2025**:

- [ ] Hybrid search with reranking
- [ ] Auto-chunking for large documents
- [ ] Query caching system

**Q4 2025**:

- [ ] Multi-modal search (images, audio)
- [ ] Custom embedding models
- [ ] Graph-based document relationships

## Support

For issues or questions:

1. Check this documentation
2. Review execution logs in the dashboard
3. Test with the provided templates
4. Contact support with:
   - Agent ID
   - Execution ID
   - Expected vs. actual behavior
   - System prompt and configuration

## Changelog

### Version 1.0.0 (2025-01-15)

**Initial Release**:

- Knowledge base search tool
- Agent configuration UI
- Three pre-built templates
- Collection-based filtering
- Adjustable max results
- OpenAI function calling integration
- Documentation and best practices

---

**Last Updated**: January 15, 2025  
**Version**: 1.0.0  
**Maintained By**: GalaxyCo.ai Team
