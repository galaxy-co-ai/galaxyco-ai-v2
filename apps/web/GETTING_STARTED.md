# 🚀 Getting Started with GalaxyCo.ai Web App

Welcome to the GalaxyCo.ai web application! This guide will help you get up and running quickly.

## 📋 Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Git**
- **OpenAI** or **Anthropic API key** (for AI chat feature)
- **Clerk** account (for authentication)

## 🛠️ Setup

### 1. Install Dependencies

```bash
# From the monorepo root
pnpm install

# Or from apps/web
cd apps/web
pnpm install
```

### 2. Environment Variables

Copy the example env file and add your keys:

```bash
cp .env.example .env.local
```

Required variables in `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Chat (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database (if using real backend)
DATABASE_URL=postgresql://...
```

### 3. Run Development Server

```bash
pnpm dev
```

App will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
apps/web/
├── app/                    # Next.js 14 App Router
│   ├── (app)/             # Authenticated routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── agents/        # Agent management
│   │   ├── workflows/     # Workflow builder
│   │   ├── prospects/     # Prospect database
│   │   ├── emails/        # Email review queue
│   │   └── settings/      # User settings
│   ├── (auth)/            # Auth routes (sign-in/sign-up)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout with Clerk
├── components/
│   ├── layout/            # Layout components (AppShell, Sidebar, etc.)
│   ├── chat/              # AI chat widget
│   ├── dashboard/         # Dashboard-specific components
│   ├── shared/            # Reusable components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
│   ├── design-tokens.ts   # Design system
│   ├── fixtures.ts        # Mock data
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
└── styles/
    └── globals.css        # Global styles
```

## 🎯 Key Features

### AI Chat Assistant

- Click the floating chat button (bottom-right)
- Ask questions about agents, workflows, prospects
- Powered by OpenAI (GPT-4) or Anthropic (Claude)
- Chat history persisted in localStorage

### Dashboard

- Overview of key metrics
- Active agents list with status
- Recent activity feed
- Quick action buttons

### Agents

- Create and manage AI agents
- Types: Research, Email, CRM Sync
- View metrics and configuration
- Start/pause/configure agents

### Workflows

- Multi-step automation pipelines
- Chain agents together
- Visual step display
- Track execution metrics

### Prospects

- Table view with enrichment data
- Confidence scores
- Company and contact info
- LinkedIn integration

### Emails

- Review AI-generated emails
- Research insights with confidence scores
- Approve, edit, or reject
- Track email status

### Settings

- Profile management
- Integration connections (HubSpot, Gmail, LinkedIn)
- Notification preferences

## 🎨 Design System

### Colors

- **Primary**: Blue (#3b82f6)
- **Agent Colors**: Purple (research), Pink (email), Teal (CRM)
- **Semantic**: Green (success), Orange (warning), Red (error)
- **Neutrals**: Complete grayscale (0-950)

### Typography

- **Font**: Inter (sans), Fira Code (mono)
- **Sizes**: xs (12px) → 5xl (48px)

### Components

- All components are in `components/`
- Shared components in `components/shared/`
- Use `cn()` utility for className merging

## 🧪 Development

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm build && pnpm start
```

## 📦 Key Dependencies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **OpenAI SDK** - AI chat (OpenAI)
- **Lucide React** - Icons
- **Radix UI** - Accessible components

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Environment Variables for Production

Make sure to set all variables from `.env.local` in your deployment platform.

## 📝 Mock Data

The app includes comprehensive mock data for development:

- **3 Agents** with full metrics
- **1 Workflow** with 3 steps
- **3 Prospects** with enrichment data
- **1 Email** with research insights
- **Dashboard stats** with trends
- **3 Integrations** (HubSpot, Gmail, LinkedIn)

All mock data is in `lib/fixtures.ts`

## 🎓 Learning Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Clerk Auth](https://clerk.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives)
- [OpenAI API](https://platform.openai.com/docs)

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### TypeScript errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Build errors

```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm build
```

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run `pnpm typecheck` and `pnpm lint`
4. Commit with conventional commit message
5. Push and create PR

## 📞 Support

- Check `AI_CONTEXT.md` for full project context
- Review `WARP.md` for project rules
- Use the AI chat assistant for in-app help

---

**Built with ❤️ by the GalaxyCo team**
