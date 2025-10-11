# GalaxyCo.ai 2.0 - Project Blueprint

**Last Updated:** October 11, 2025  
**Version:** 0.1.0  
**Status:** Active Development

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [Implemented Features](#implemented-features)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Key Libraries & Utilities](#key-libraries--utilities)
9. [Security & Multi-Tenancy](#security--multi-tenancy)
10. [Deployment](#deployment)

---

## Project Overview

### Vision
**"Make multi-agent AI useful in minutes"**

GalaxyCo.ai 2.0 is an enterprise-grade, multi-tenant platform for creating, managing, and orchestrating AI agents. It provides:
- 🤖 **Multi-Agent Management** - Create and manage diverse AI agents
- 📚 **Knowledge Base (RAG)** - Document management with semantic search
- 🏪 **Marketplace** - Pre-built agent templates and packs
- 🔐 **Enterprise Security** - Multi-tenant isolation, encryption, RBAC
- 🎨 **Modern UI/UX** - Clean, professional design system

### Target Users
- Ambitious non-technical operators
- Small to medium businesses
- Development teams needing AI automation
- Enterprise users requiring secure AI workflows

---

## Architecture

### Monorepo Structure

```
galaxyco-ai-2.0/
├── apps/
│   ├── web/                    # Next.js 14 frontend + API routes
│   └── api/                    # NestJS backend (optional/future)
├── packages/
│   ├── database/               # Drizzle ORM + PostgreSQL schema
│   ├── agents-core/            # Core agent logic & orchestration
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   └── config/                 # Shared configuration
└── docs/                       # Documentation
```

### Key Design Patterns

1. **Multi-Tenant Architecture**
   - Workspace-based isolation
   - `workspaceId` required on all queries
   - Row-level security enforced

2. **API-First Design**
   - RESTful API endpoints
   - Consistent response format
   - Error handling & logging

3. **Component-Based Frontend**
   - Reusable UI components
   - Design system constants
   - Consistent styling patterns

4. **Background Processing**
   - Async embedding generation
   - Fire-and-forget patterns
   - Non-blocking operations

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2 | React framework with App Router |
| **React** | 18.3 | UI library |
| **TypeScript** | 5.5 | Type safety |
| **Clerk** | 5.7+ | Authentication & user management |
| **Vercel** | - | Hosting & deployment |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **Drizzle ORM** | 0.44+ | Database ORM |
| **PostgreSQL** | - | Primary database (Neon) |
| **Vercel Blob** | 2.0 | File storage |

### AI & ML
| Technology | Version | Purpose |
|------------|---------|---------|
| **OpenAI SDK** | 6.2+ | GPT models & embeddings |
| **Anthropic SDK** | 0.65+ | Claude models |
| **Google AI SDK** | 0.24+ | Gemini models |
| **Vercel AI SDK** | 5.0+ | Unified AI interface |
| **pdf-parse** | 2.2+ | PDF text extraction |
| **cheerio** | 1.1+ | Web scraping |

### Development
| Technology | Version | Purpose |
|------------|---------|---------|
| **pnpm** | 9.0+ | Package manager |
| **Turbo** | 2.0+ | Monorepo build system |
| **ESLint** | 9.0+ | Code linting |
| **Prettier** | 3.3+ | Code formatting |
| **Husky** | 9.1+ | Git hooks |
| **Playwright** | 1.56+ | E2E testing |

---

## Database Schema

### Core Entities

#### 1. **Workspaces** (Tenant Boundary)
- Multi-tenant container
- Subscription & billing info
- Encrypted API keys storage
- Settings & configuration

#### 2. **Users**
- Clerk integration for auth
- Profile information
- User preferences
- Last login tracking

#### 3. **Workspace Members**
- User ↔ Workspace relationship
- RBAC (owner, admin, member, viewer)
- Fine-grained permissions
- Invitation tracking

#### 4. **Agents**
- Agent definitions & configurations
- AI provider settings (OpenAI, Anthropic, Google)
- Type: scope, call, email, note, task, roadmap, content, custom, browser, cross-app, knowledge, sales, trending, research, meeting, code, data, security
- Status: draft, active, paused, archived
- Execution tracking

#### 5. **Agent Templates** (Marketplace)
- Pre-built agent configurations
- Metadata (name, description, category)
- KPIs & metrics
- Install counts & ratings
- Trending scores

#### 6. **Agent Packs** (Marketplace)
- Collections of agent templates
- Bundled configurations
- Pricing info

#### 7. **Agent Executions**
- Audit trail of agent runs
- Input/output logging
- Performance metrics (duration, tokens, cost)
- Status tracking

#### 8. **Knowledge Base**

**Collections:**
- Organizational folders for knowledge items
- Color coding & icons
- Item count tracking

**Tags:**
- Workspace-scoped tags
- Usage count tracking

**Knowledge Items:**
- Types: document, url, image, text
- Status: processing, ready, failed
- Source tracking (file, URL)
- Processed content storage
- **Vector embeddings** (JSONB array)
- Embedding model tracking
- Collection assignment
- Tag relationships
- Favorite & archive flags

**Knowledge Item Tags:**
- Many-to-many relationship
- Item ↔ Tag linking

### Indexes & Performance

✅ All tables indexed on:
- `workspaceId` (tenant isolation)
- Foreign keys
- Frequently queried fields (status, type, createdAt)
- Search fields (collection, tags)

---

## Implemented Features

### ✅ Authentication & User Management
- [x] Clerk integration for SSO
- [x] User registration & login
- [x] Workspace creation
- [x] Multi-workspace support
- [x] RBAC (roles & permissions)

### ✅ Knowledge Base (Core Feature)

**Backend (API):**
- [x] Upload API (files, URLs, text)
  - [x] PDF text extraction
  - [x] Plain text processing
  - [x] URL web scraping
  - [x] File size validation (10MB max)
  - [x] MIME type validation
  - [x] Vercel Blob storage integration
- [x] **Auto-embedding generation** (NEW!)
  - [x] Background processing with `setImmediate()`
  - [x] Non-blocking implementation
  - [x] Automatic on upload
- [x] Collections API
  - [x] List collections with item counts
  - [x] Create collection
  - [x] Update collection (name, description, color, icon)
  - [x] Delete collection (cascades to items' collectionId)
- [x] Knowledge Items API
  - [x] List items with pagination
  - [x] Filtering (type, status, collection, search)
  - [x] Sorting (created, updated, title)
  - [x] Get item by ID
  - [x] Update item
  - [x] Delete item
- [x] Embeddings API
  - [x] Generate embeddings for items
  - [x] Batch processing
  - [x] Model: `text-embedding-3-small` (1536 dimensions)
- [x] Semantic Search API
  - [x] Query-based retrieval
  - [x] Cosine similarity ranking
  - [x] Collection filtering
  - [x] Configurable result count

**Frontend (UI):**
- [x] Knowledge Base page (`/knowledge`)
  - [x] Drag & drop file upload
  - [x] File browser upload
  - [x] Upload progress tracking
  - [x] Real-time feedback
- [x] CollectionsSidebar component
  - [x] List all collections
  - [x] Show item counts
  - [x] Active selection state
  - [x] "All Items" default view
  - [x] Edit & delete actions
- [x] CreateCollectionModal component
  - [x] Create new collections
  - [x] Edit existing collections
  - [x] Color picker (8 preset colors)
  - [x] Form validation
- [x] SearchFilterBar component
  - [x] Search by title/content
  - [x] Filter by type (document, image, url, text)
  - [x] Filter by status (processing, ready, failed)
  - [x] Sort options (created, updated, title)
- [x] KnowledgeItemCard component
  - [x] Type-specific icons
  - [x] Status indicators
  - [x] File size display
  - [x] Tag display
  - [x] Favorite icon
  - [x] Hover preview effect
- [x] ItemDetailModal component
  - [x] Full item details
  - [x] Content preview
  - [x] Edit functionality
  - [x] Delete functionality
- [x] EmptyState & LoadingSkeleton components
  - [x] Contextual empty states
  - [x] Loading skeletons for better UX

**Utilities:**
- [x] `embeddings.ts` - Embedding generation & similarity
  - [x] Single & batch embedding generation
  - [x] Cosine similarity calculation
  - [x] Text preparation helpers
  - [x] Most similar item finder
- [x] `document-processor.ts` - Content extraction
  - [x] PDF text extraction
  - [x] Plain text extraction
  - [x] URL web scraping with metadata
  - [x] Summary generation (basic)
- [x] `storage.ts` - Vercel Blob integration
  - [x] File upload to blob storage
  - [x] Unique filename generation

### ✅ Agents System

**Backend:**
- [x] Agent CRUD APIs (basic)
- [x] Agent execution tracking
- [x] AI provider factory (OpenAI, Anthropic, Google)
- [x] Workspace API key management

**Frontend:**
- [x] Agents page (`/agents`)
- [x] Agent creation page (`/agents/new`)
- [x] Agent detail page (`/agents/[id]`)
- [x] Agent components (cards, forms)

**Core Package:**
- [x] `@galaxyco/agents-core` package
- [x] Agent orchestration logic
- [x] Tool definitions
- [x] Guardrails
- [x] Monitoring

### ✅ Marketplace

**Backend:**
- [x] Agent templates schema
- [x] Agent packs schema
- [x] Marketplace APIs (basic)

**Frontend:**
- [x] Marketplace page (`/marketplace`)
- [x] Template browsing
- [x] Install functionality (basic)

### ✅ Dashboard

**Frontend:**
- [x] Dashboard layout
- [x] Overview page
- [x] Navigation sidebar
- [x] User menu

### ✅ Settings

**Pages:**
- [x] Settings page structure
- [x] Workspace settings
- [x] API key management
- [ ] Billing integration

### ✅ Onboarding

**Pages:**
- [x] Onboarding flow
- [x] Workspace creation
- [x] Initial setup wizard

---

## API Endpoints

### Knowledge Base APIs

#### Upload
```
POST /api/knowledge/upload?workspaceId={id}
Content-Type: multipart/form-data OR application/json

Body (file):
- file: File

Body (URL):
{ "type": "url", "url": "https://...", "title": "..." }

Body (text):
{ "type": "text", "text": "...", "title": "..." }

Response:
{
  "success": true,
  "item": { KnowledgeItem },
  "message": "File uploaded and processed successfully. Embeddings generation started."
}
```

#### List Items
```
GET /api/knowledge/list?workspaceId={id}&page={n}&limit={n}&sort={field}&search={q}&type={type}&status={status}&collectionId={id}

Response:
{
  "items": [ KnowledgeItem[] ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Get Item
```
GET /api/knowledge/items/{id}?workspaceId={id}

Response:
{
  "item": { KnowledgeItem }
}
```

#### Update Item
```
PATCH /api/knowledge/items/{id}?workspaceId={id}
Content-Type: application/json

Body:
{
  "title": "Updated Title",
  "collectionId": "uuid",
  "tags": ["tag1", "tag2"],
  "isFavorite": true
}

Response:
{
  "success": true,
  "item": { KnowledgeItem }
}
```

#### Delete Item
```
DELETE /api/knowledge/items/{id}?workspaceId={id}

Response:
{
  "success": true,
  "message": "Knowledge item deleted successfully"
}
```

#### Collections - List
```
GET /api/knowledge/collections?workspaceId={id}

Response:
{
  "collections": [
    {
      "id": "uuid",
      "name": "Marketing Docs",
      "description": "...",
      "color": "#3B82F6",
      "icon": "📁",
      "itemCount": 42,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Collections - Create
```
POST /api/knowledge/collections?workspaceId={id}
Content-Type: application/json

Body:
{
  "name": "New Collection",
  "description": "Description",
  "color": "#3B82F6",
  "icon": "📁"
}

Response:
{
  "success": true,
  "collection": { Collection }
}
```

#### Collections - Update
```
PATCH /api/knowledge/collections/{id}?workspaceId={id}
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#10B981"
}

Response:
{
  "success": true,
  "collection": { Collection }
}
```

#### Collections - Delete
```
DELETE /api/knowledge/collections/{id}?workspaceId={id}

Response:
{
  "success": true,
  "message": "Collection deleted successfully"
}
```

#### Embeddings - Generate
```
POST /api/knowledge/embeddings?workspaceId={id}
Content-Type: application/json

Body:
{
  "itemId": "uuid",  // Optional, process specific item
  "batchSize": 10    // Optional, batch size for processing
}

Response:
{
  "success": true,
  "message": "Processed 10 items: 10 successful, 0 failed",
  "processed": 10,
  "failed": 0,
  "results": [
    { "id": "uuid", "title": "...", "success": true }
  ]
}
```

#### Semantic Search
```
POST /api/knowledge/search?workspaceId={id}
Content-Type: application/json

Body:
{
  "query": "How do I implement RAG?",
  "collectionId": "uuid",  // Optional
  "limit": 10              // Optional, default 10
}

Response:
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "title": "RAG Implementation Guide",
      "type": "document",
      "content": "...",
      "similarity": 0.92,
      "collectionId": "uuid",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "query": "How do I implement RAG?"
}
```

### Agent APIs
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/agents/{id}` - Get agent
- `PATCH /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Delete agent
- `POST /api/agents/{id}/execute` - Execute agent

### Marketplace APIs
- `GET /api/marketplace/templates` - List templates
- `GET /api/marketplace/templates/{slug}` - Get template
- `POST /api/marketplace/templates/{slug}/install` - Install template

---

## Frontend Components

### Layout Components
- `DashboardLayout` - Main dashboard shell
- `Sidebar` - Navigation sidebar
- `TopBar` - Top navigation bar

### Knowledge Base Components
```
components/knowledge/
├── CollectionsSidebar.tsx       ✅ Implemented
├── CreateCollectionModal.tsx    ✅ Implemented
├── EmptyState.tsx              ✅ Implemented
├── ItemDetailModal.tsx         ✅ Implemented
├── KnowledgeItemCard.tsx       ✅ Implemented
└── SearchFilterBar.tsx         ✅ Implemented
```

### Agent Components
```
components/agents/
├── AgentCard.tsx
├── AgentForm.tsx
├── AgentExecutionLog.tsx
└── AgentConfigEditor.tsx
```

### Marketplace Components
```
components/marketplace/
├── TemplateCard.tsx
├── TemplateDetail.tsx
└── CategoryFilter.tsx
```

### UI Components
```
components/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Card.tsx
└── [other primitives]
```

---

## Key Libraries & Utilities

### AI & Embeddings (`lib/`)

**`embeddings.ts`**
- `generateEmbedding(text)` - Single embedding
- `generateEmbeddings(texts[])` - Batch embeddings
- `cosineSimilarity(a, b)` - Similarity calculation
- `findMostSimilar(query, items, topK)` - Ranked results
- `prepareTextForEmbedding(title, content)` - Text formatting

**`document-processor.ts`**
- `extractTextFromPDF(buffer)` - PDF text extraction
- `extractTextFromPlainText(buffer)` - Text file reading
- `scrapeURL(url)` - Web scraping with metadata
- `generateSimpleSummary(text)` - Basic summarization

**`storage.ts`**
- `uploadFileToBlob(buffer, filename, options)` - Vercel Blob upload
- `generateUniqueFilename(filename)` - Unique naming

### AI Providers (`lib/ai/`)

**`factory.ts`**
- AI provider factory pattern
- Unified interface for OpenAI, Anthropic, Google

**`providers/`**
- `openai.ts` - OpenAI GPT models
- `anthropic.ts` - Anthropic Claude models
- `google.ts` - Google Gemini models (future)

### Design System (`lib/design-system/`)

**`COLORS`**
```typescript
{
  text: { primary, secondary, tertiary },
  background: { primary, secondary, tertiary },
  border: { primary, secondary },
  accent: { primary, secondary, success, warning, error }
}
```

**`SPACING`**
```typescript
{
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  radius: { sm, md, lg, full }
}
```

### Actions (`lib/actions/`)
- `agent-actions.ts` - Server actions for agents
- `workspace-actions.ts` - Server actions for workspaces

### Utilities
- `crypto.ts` - AES-256-GCM encryption for API keys
- `retry.ts` - Retry logic with exponential backoff
- `execution-tracker.ts` - Agent execution tracking
- `workspace.ts` - Workspace utilities
- `workspace-utils.ts` - Additional workspace helpers

---

## Security & Multi-Tenancy

### Multi-Tenant Isolation

**Rule (4kR94Z3XhqK4C54vwDDwnq):**
- ✅ ALL queries MUST include `workspaceId` filter
- ✅ NEVER expose data across tenant boundaries
- ✅ Validate `workspaceId` matches authenticated user's tenant
- ✅ Log cross-tenant access attempts as security incidents

**Implementation:**
```typescript
// ✅ CORRECT
const items = await db
  .select()
  .from(knowledgeItems)
  .where(eq(knowledgeItems.workspaceId, workspaceId));

// ❌ WRONG - Missing tenant filter
const items = await db
  .select()
  .from(knowledgeItems);
```

### Authentication
- **Clerk** for SSO & user management
- JWT tokens for API authentication
- Session management
- Organization-based access control

### Encryption
- **API Keys:** AES-256-GCM encryption
- **IV & Auth Tag:** Stored separately for security
- **Master Key:** Environment variable only

### RBAC (Role-Based Access Control)
- **Owner:** Full control
- **Admin:** Manage workspace & members
- **Member:** Use agents & knowledge base
- **Viewer:** Read-only access

### Fine-Grained Permissions
```typescript
permissions: {
  agents: { create, edit, delete, execute },
  packs: { install, uninstall },
  billing: { view, manage },
  members: { invite, remove, changeRole }
}
```

---

## Deployment

### Hosting
- **Frontend & API:** Vercel
- **Database:** Neon (PostgreSQL)
- **File Storage:** Vercel Blob
- **CDN:** Vercel Edge Network

### Environment Variables

**Required:**
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Encryption
ENCRYPTION_KEY=...  # 256-bit key for API key encryption

# Storage
BLOB_READ_WRITE_TOKEN=...

# Monitoring (optional)
SENTRY_DSN=...
```

### Scripts
```json
{
  "dev": "turbo run dev --parallel",
  "build": "turbo run build",
  "lint": "turbo run lint",
  "typecheck": "turbo run typecheck"
}
```

### CI/CD
- Automated via Vercel Git integration
- Preview deployments on pull requests
- Production deployments on `main` branch

---

## Summary

### What's Working ✅
1. **Knowledge Base** - Fully functional with auto-embeddings!
   - Upload (files, URLs, text)
   - Collections management
   - Semantic search
   - Auto-embedding generation (NEW!)
   - Complete UI with sidebar, modals, cards

2. **Authentication** - Clerk SSO working

3. **Database** - Comprehensive schema with multi-tenant isolation

4. **AI Integration** - Multiple providers supported

5. **Design System** - Consistent, polished UI

### What's Next? 
See **[ROADMAP.md](./ROADMAP.md)** for detailed next steps!

---

**Questions or need clarification?** Reference this blueprint as the single source of truth for the current project state.
