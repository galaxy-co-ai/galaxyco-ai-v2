# GalaxyCo.ai 2.0

**Make multi-agent AI useful in minutes.**

A platform where users get a personalized dashboard with AI agent "Packs" that deliver measurable outcomes (WSAO - Weekly Successful Agent Outcomes) from Day 1.

---

## 🚀 Vision

GalaxyCo.ai combines:

- **StackAI's enterprise polish**
- **OpenSea's card-driven discovery**
- **OpenAI Agent Builder's simplicity**
- **Sider's human knowledge UI**

To deliver real work through multi-agent collaboration.

### Key Differentiators

1. **Multi-Agent Native** - Packs (teams of agents) as the primary unit
2. **Personal AI Assistant (PAA)** - Always-on helper assigned to every user
3. **Dual-Mode Builder** - Visual node editor ↔ DSL with bidirectional sync
4. **Sim Mode** - Demo everything with fixtures before connecting real tools
5. **Citations Everywhere** - Full transparency on agent knowledge sources
6. **Community Marketplace** - Card-based discovery with KPIs and ratings

---

## 📋 Project Structure

```
galaxyco-ai-2.0/
├── apps/
│   ├── web/                    # Next.js 14 frontend (Vercel)
│   └── api/                    # NestJS backend (AWS ECS)
├── services/
│   └── agents/                 # Python agents with LangGraph (AWS ECS)
├── packages/
│   ├── ui/                     # Shared React components
│   ├── config/                 # Shared configs (tsconfig, eslint)
│   └── types/                  # Shared TypeScript types
├── infra/
│   └── terraform/              # Infrastructure as Code
│       ├── modules/            # Reusable TF modules
│       └── envs/               # Environment configs (dev, prod)
├── scripts/                    # Utility scripts
├── warp/                       # Warp Drive kit
│   ├── notebooks/              # Runbooks
│   ├── workflows/              # Automated workflows
│   ├── rules/                  # Coding standards
│   └── prompts/                # AI prompts
├── docs/                       # Product documentation
└── .github/
    └── workflows/              # CI/CD pipelines
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **State**: React Query + Zustand
- **Hosting**: Vercel

### Backend

- **API**: NestJS (REST + WebSocket)
- **Agents**: Python 3.11 + FastAPI + LangGraph
- **Hosting**: AWS ECS Fargate

### Data

- **Database**: Postgres with pgvector (Neon for MVP)
- **Cache**: Redis (Upstash for MVP)
- **Storage**: AWS S3
- **Search**: Postgres FTS → Typesense (later)

### Services

- **Auth**: Clerk → WorkOS (SSO/SCIM for enterprise)
- **Payments**: Stripe
- **LLM**: OpenAI (primary) + Anthropic (optional)
- **Observability**: Sentry + Datadog/Grafana
- **Analytics**: PostHog
- **Orchestration**: BullMQ (MVP) → Temporal Cloud (V1)

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: 20+
- **pnpm**: 9+
- **Python**: 3.11+
- **Docker**: Latest
- **Git**: Latest

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/galaxyco-ai-2.0.git
cd galaxyco-ai-2.0
```

### 2. Install Dependencies

```bash
# Install root dependencies and all workspaces
pnpm install

# Install Python dependencies
cd services/agents
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

See `SECRETS_CHECKLIST.md` for comprehensive guide.

**Quick start for local development:**

1. Copy example files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
cp services/agents/.env.example services/agents/.env
```

2. Fill in your credentials (see `SECRETS_CHECKLIST.md`)

**Minimum required for local development:**

- Neon Postgres connection string
- Upstash Redis connection string
- Clerk keys (publishable + secret)
- OpenAI API key

### 4. Run Development Servers

```bash
# Start all services (web, api, agents)
pnpm dev

# Or start individually:
pnpm --filter web dev        # Next.js on http://localhost:3000
pnpm --filter api dev         # NestJS on http://localhost:4000
cd services/agents && uvicorn app:app --reload  # Python on http://localhost:5001
```

### 5. Run Database Migrations

```bash
pnpm --filter api db:migrate
```

---

## 📚 Documentation

### **For AI Assistants**

- **[AI_CONTEXT.md](./AI_CONTEXT.md)** - 🤖 **START HERE** - Complete project context for AI assistants (451 lines)
- **[WARP.md](./WARP.md)** - Comprehensive project rules and standards (authoritative)
- **[.github/AI_INSTRUCTIONS.md](./.github/AI_INSTRUCTIONS.md)** - GitHub AI tooling integration (Copilot, Cursor, etc.)

### **For Humans**

- **[SECRETS_CHECKLIST.md](./SECRETS_CHECKLIST.md)** - Complete guide to all environment variables and secrets
- **[GALAXYCO_2.0_ANALYSIS_AND_PLAN.md](./GALAXYCO_2.0_ANALYSIS_AND_PLAN.md)** - Comprehensive project plan and phased roadmap
- **[docs/](./docs/)** - Full product documentation (specs, architecture, wireframes)
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick commands and shortcuts
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines (coming soon)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture deep dive (coming soon)

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter web test
pnpm --filter api test

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

---

## 🚀 Deployment

### Vercel (Web)

The Next.js app deploys automatically to Vercel on push to `main` or `develop`.

**Manual deploy:**

```bash
cd apps/web
vercel --prod
```

### AWS ECS (API & Agents)

Deployed via GitHub Actions and Terraform.

**Build Docker images:**

```bash
# API
docker build -t galaxyco-api -f apps/api/Dockerfile .

# Agents
docker build -t galaxyco-agents -f services/agents/Dockerfile .
```

**Deploy via GitHub Actions:**

- Push to `develop` → deploys to staging
- Push to `main` → deploys to production (with approval)

See `.github/workflows/` for CI/CD pipelines.

---

## 🏗️ Infrastructure

Infrastructure is managed with Terraform.

### Setup Terraform State Backend

```bash
# Create S3 bucket for state
aws s3 mb s3://galaxyco-terraform-state --region us-east-1

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name galaxyco-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Deploy Infrastructure

```bash
cd infra/terraform/envs/dev

# Initialize
terraform init

# Plan
terraform plan -var-file=terraform.tfvars

# Apply
terraform apply -var-file=terraform.tfvars
```

**Note**: Never commit `terraform.tfvars` - it contains secrets!

---

## 📦 Available Scripts

### Root Level

- `pnpm dev` - Start all services in dev mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all TypeScript
- `pnpm test` - Run all tests
- `pnpm clean` - Clean all build artifacts

### Web (apps/web)

- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code
- `pnpm typecheck` - Type check

### API (apps/api)

- `pnpm dev` - Start NestJS dev server with watch
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code
- `pnpm typecheck` - Type check
- `pnpm db:migrate` - Run database migrations

### Agents (services/agents)

- `uvicorn app:app --reload` - Start Python dev server
- `pytest` - Run tests
- `black .` - Format code
- `mypy .` - Type check

---

## 🔐 Security

- **Never commit secrets** to git
- Store sensitive values in environment variables
- Use AWS Secrets Manager for production
- Enable 2FA on all service accounts
- Rotate API keys every 90 days
- Set spending limits on paid APIs

See `SECRETS_CHECKLIST.md` for comprehensive security guidelines.

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000 (Next.js)
npx kill-port 3000

# Kill process on port 4000 (NestJS)
npx kill-port 4000
```

### Database connection issues

- Verify Neon connection string in `.env.local`
- Check if Neon project is running
- Ensure IP allowlist includes your IP (if configured)

### Redis connection issues

- Verify Upstash connection string
- Check if Upstash database is active

### Python dependencies

```bash
cd services/agents
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📊 Project Status

**Current Phase**: Phase 2 - Repository Initialization ✅

**Next Phase**: Phase 3 - Infrastructure Provisioning

See `GALAXYCO_2.0_ANALYSIS_AND_PLAN.md` for detailed roadmap.

---

## 🤝 Contributing

We follow Conventional Commits with GalaxyCo.ai scopes:

**Format**: `type(scope): message`

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Scopes**: `web`, `api`, `agents`, `infra`, `db`, `docs`

**Examples**:

- `feat(web): add onboarding flow`
- `fix(api): handle missing workspace_id`
- `docs(readme): update setup instructions`

---

## 📄 License

Proprietary - All rights reserved

---

## 💬 Support

- **Issues**: GitHub Issues
- **Email**: support@galaxyco.ai (coming soon)
- **Discord**: Coming soon

---

## 🎯 Quick Links

- [Product Documentation](./docs/)
- [Secrets Checklist](./SECRETS_CHECKLIST.md)
- [Project Plan](./GALAXYCO_2.0_ANALYSIS_AND_PLAN.md)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [AWS Console](https://console.aws.amazon.com)
- [Neon Dashboard](https://console.neon.tech)
- [Upstash Dashboard](https://console.upstash.com)
- [Clerk Dashboard](https://dashboard.clerk.com)

---

**Built with ❤️ to make multi-agent AI useful in minutes**

## 🚀 CI/CD Pipeline

Automated workflows for continuous integration, security scanning, and deployment.

- **CI Pipeline:** TypeScript, lint, format, build checks
- **Security Scanning:** npm audit, CodeQL, secret scanning, OWASP
- **Deploy Pipeline:** Staging and production with gated approvals

See [`docs/deployment/GITHUB_SECRETS_SETUP.md`](./docs/deployment/GITHUB_SECRETS_SETUP.md) for configuration.
