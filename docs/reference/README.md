# 📖 Reference Documentation

Quick reference materials and comprehensive lists for GalaxyCo.ai development.

## Quick References

### Essential

- [Environment Variables](environment-variables.md) - All configuration options
- [CLI Commands](cli-commands.md) - Useful development commands
- [API Quick Reference](api-quick-reference.md) - Common API patterns
- [Glossary](glossary.md) - Terms and definitions

### Technical

- [Database Schema Reference](database-schema-reference.md) - Complete schema
- [Component Reference](components.md) - UI component library
- [Utility Functions](utility-functions.md) - Helper functions
- [Type Definitions](type-definitions.md) - TypeScript types

## Configuration

### Environment Variables

Complete list of environment variables with descriptions:

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
```

See [environment-variables.md](environment-variables.md) for complete reference.

### CLI Commands

Common development commands:

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run type-check         # TypeScript checking

# Database
npm run db:push            # Push schema changes
npm run db:migrate         # Run migrations
npm run db:studio          # Open Drizzle Studio

# Testing
npm run test               # Run tests
npm run test:watch         # Watch mode
npm run lint               # Lint code
```

See [cli-commands.md](cli-commands.md) for complete list.

## API Reference

### REST Endpoints

```typescript
// Agent execution
POST /api/agents/:id/execute

// Marketplace
GET /api/marketplace/agents
GET /api/marketplace/agents/:id

// User data
GET /api/user/profile
PATCH /api/user/profile
```

See [api-quick-reference.md](api-quick-reference.md) for complete API documentation.

## Database Schema

### Core Tables

- `users` - User accounts
- `tenants` - Multi-tenant workspaces
- `agents` - Agent definitions
- `agent_executions` - Execution history
- `ai_gateway_logs` - AI provider usage

See [database-schema-reference.md](database-schema-reference.md) for complete schema.

## Glossary

### Key Terms

- **Agent**: An AI-powered automation unit
- **Tenant**: A workspace or organization instance
- **AI Gateway**: Unified interface for AI providers
- **Execution**: A single run of an agent
- **Marketplace**: Collection of reusable agents

See [glossary.md](glossary.md) for complete definitions.

## External Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)

### Tools

- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com/galaxyco-ai/galaxyco-ai-2.0)

See [external-links.md](external-links.md) for more resources.

## Component Library

### UI Components

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

See [components.md](components.md) for complete component reference.

## Conventions

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `PascalCase.types.ts`
- Tests: `*.test.ts`

### Code Style

- Use TypeScript for all code
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages

### Git Workflow

- Branch naming: `feat/`, `fix/`, `chore/`
- Commit format: Conventional Commits
- Pull requests required for main branch

---

📚 **Need something not listed here?** Check the [Technical Documentation](../technical/) for deeper dives.

[← Back to Documentation Hub](../README.md)
