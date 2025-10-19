# GalaxyCo.ai 2.0 - Getting Started Guide

**Last Updated**: January 19, 2025

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: >= 20.0.0 ([Download](https://nodejs.org/))
- **pnpm**: >= 9.0.0 (`npm install -g pnpm`)
- **Git**: Latest version
- **Code Editor**: VS Code recommended with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/galaxy-co-ai/galaxyco-ai-v2.git
cd galaxyco-ai-2.0
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Environment Setup

```bash
# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

### 4. Configure Environment Variables

Edit `apps/web/.env.local` with your credentials:

```bash
# Database (Required)
DATABASE_URL="postgresql://username:password@host/database"

# Authentication (Required)
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# AI Providers (At least one required)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_GENERATIVE_AI_API_KEY="..."

# Vector Database (Optional for basic features)
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
PINECONE_INDEX_NAME="..."

# File Storage (Optional)
BLOB_READ_WRITE_TOKEN="..."

# Error Tracking (Optional)
SENTRY_DSN="..."
```

### 5. Database Setup

```bash
# Push schema to database
pnpm -C packages/database db:push

# Or run migrations
pnpm -C packages/database db:migrate
```

### 6. Start Development

```bash
# Start all services
pnpm dev
```

This opens:

- **Web App**: http://localhost:3000
- **Database Studio**: `pnpm -C packages/database db:studio`

---

## Environment Variables Reference

### Required for Core Functionality

#### Database

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
# Neon example: postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb
```

#### Authentication (Clerk)

```bash
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"  # For user sync
```

### AI Providers (Choose One or More)

#### OpenAI

```bash
OPENAI_API_KEY="sk-xxxxxxxxxxxx"
OPENAI_ORGANIZATION_ID="org-xxxxxxxxxxxx"  # Optional
```

#### Anthropic

```bash
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"
```

#### Google

```bash
GOOGLE_GENERATIVE_AI_API_KEY="xxxxxxxxxxxx"
```

### Optional Services

#### Vector Database (Pinecone)

```bash
PINECONE_API_KEY="xxxxxxxxxxxx"
PINECONE_ENVIRONMENT="us-east1-gcp"
PINECONE_INDEX_NAME="galaxyco-vectors"
```

#### File Storage (Vercel Blob)

```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"
```

#### Monitoring

```bash
SENTRY_DSN="https://xxxxxxxxxxxx@sentry.io/xxxxxxxxxxxx"
```

---

## Service Setup Guides

### Neon Database Setup

1. **Create Account**: [neon.tech](https://neon.tech)
2. **Create Project**: Choose region close to users
3. **Get Connection String**:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb
   ```
4. **Configure in .env.local**

### Clerk Authentication Setup

1. **Create Account**: [clerk.com](https://clerk.com)
2. **Create Application**:
   - Choose "Next.js" as framework
   - Enable Google OAuth provider
3. **Get API Keys**:
   - Copy Secret Key and Publishable Key
4. **Configure Webhook** (for user sync):
   - Endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`
   - Copy webhook secret

### AI Provider Setup

#### OpenAI

1. Visit [platform.openai.com](https://platform.openai.com)
2. Create API key with appropriate limits
3. Set spending alerts

#### Anthropic

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Start with Claude-3.5-Sonnet

#### Google AI

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Create API key for Gemini models

---

## Development Workflows

### Starting Development

```bash
# Start everything
pnpm dev

# Start individual services
pnpm -C apps/web dev      # Web app only
pnpm -C apps/api dev      # API server only
```

### Database Operations

```bash
# View/edit data
pnpm -C packages/database db:studio

# Generate migration
pnpm -C packages/database db:generate

# Apply migrations
pnpm -C packages/database db:migrate

# Push schema changes (development)
pnpm -C packages/database db:push

# Check migration status
pnpm -C packages/database db:check
```

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format

# Run all quality checks (pre-commit)
pnpm precommit
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm -C apps/web test
pnpm -C apps/api test

# Run tests in watch mode
pnpm -C apps/web test:watch
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill processes on ports
npx kill-port 3000  # Web app
npx kill-port 3001  # API server
npx kill-port 5555  # Database studio
```

### Database Connection Issues

1. **Check Connection String**: Verify format and credentials
2. **Network Access**: Ensure IP is allowlisted (Neon)
3. **Database Exists**: Create database if it doesn't exist
4. **Test Connection**:
   ```bash
   psql "postgresql://user:pass@host/db"
   ```

### Authentication Issues

1. **Clerk Keys**: Verify publishable and secret keys match
2. **Webhook**: Check webhook URL and secret
3. **HTTPS**: Webhooks require HTTPS in production

### Build Errors

```bash
# Clear cache and reinstall
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Next.js cache
rm -rf apps/web/.next

# Clear Turborepo cache
pnpm clean
```

### Environment Variable Issues

1. **File Location**: Ensure `.env.local` is in correct directory
2. **Prefix**: Public variables need `NEXT_PUBLIC_` prefix
3. **Restart**: Restart dev server after changing variables
4. **Quotes**: Don't use quotes around values in .env files

---

## Editor Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Recommended Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## Production Deployment

### Vercel Deployment

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Add all production variables
3. **Deploy**: Automatic deployment on push to main

### Environment Variables for Production

```bash
# Database (Production)
DATABASE_URL="postgresql://prod-connection-string"

# Authentication
CLERK_SECRET_KEY="sk_live_xxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxx"

# AI Providers (Production keys with higher limits)
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx"

# Monitoring
SENTRY_DSN="production-sentry-dsn"
```

---

## Common Commands Reference

```bash
# Development
pnpm dev                          # Start all services
pnpm build                        # Build all packages
pnpm start                        # Start production build

# Quality
pnpm typecheck                    # Type check all packages
pnpm lint                         # Lint all packages
pnpm format                       # Format all files
pnpm precommit                    # Run all quality checks

# Database
pnpm -C packages/database db:studio    # Database GUI
pnpm -C packages/database db:push      # Push schema changes
pnpm -C packages/database db:generate  # Generate migration
pnpm -C packages/database db:migrate   # Run migrations

# Utilities
pnpm clean                        # Clean build artifacts
npx kill-port 3000               # Kill port process
pnpm install --frozen-lockfile   # Install exact dependencies
```

---

## Next Steps

After setup:

1. **Read Architecture**: [docs/ARCHITECTURE.md](ARCHITECTURE.md)
2. **Understand APIs**: [docs/api/API_DESIGN_SPECIFICATION.md](api/API_DESIGN_SPECIFICATION.md)
3. **Check Database**: [docs/database/SCHEMA.md](database/SCHEMA.md)
4. **View Progress**: [docs/ROADMAP.md](ROADMAP.md)

---

**Need Help?** Check our [troubleshooting](#troubleshooting) section or create an issue.

**Maintained by**: GalaxyCo.ai Engineering Team
