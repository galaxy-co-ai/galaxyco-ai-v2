# 🎯 Cursor Environment Optimization - Master Plan

**Purpose:** Configure Cursor for maximum AI development productivity
**Status:** 🚀 IMPLEMENTING TONIGHT

---

## 🤖 Essential MCP Servers

### ✅ Already Configured

1. **GitKraken** - Git operations, GitHub API
2. **Kibo UI** - Component library (fixed tonight)

### 🚧 To Add Tonight

### 3. **Filesystem MCP Server**

**Purpose:** Better file operations, search, watching

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Owner\\workspace\\galaxyco-ai-2.0"
      ]
    }
  }
}
```

### 4. **GitHub MCP Server**

**Purpose:** Issues, PRs, repo management

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<from-env>"
      }
    }
  }
}
```

### 5. **PostgreSQL MCP Server**

**Purpose:** Direct database queries, schema inspection

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "<from-env>"
      }
    }
  }
}
```

### 6. **Brave Search MCP Server**

**Purpose:** Real-time web research

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "<from-env>"
      }
    }
  }
}
```

### 7. **Memory MCP Server**

**Purpose:** Persistent knowledge across sessions

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### 8. **Sequential Thinking MCP**

**Purpose:** Enhanced reasoning for complex problems

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

---

## 📋 Essential Project Commands

### Development Commands

```yaml
# Start dev server
dev:
  command: 'cd apps/web && pnpm dev'
  description: 'Start Next.js dev server'

# Run all tests
test:
  command: 'cd apps/web && pnpm test:run tests/unit tests/component'
  description: 'Run unit and component tests'

# Type check everything
typecheck:
  command: 'turbo run typecheck'
  description: 'Type check all packages'

# Lint and fix
lint:
  command: 'turbo run lint -- --fix'
  description: 'Lint all packages and auto-fix'

# Format code
format:
  command: 'prettier --write .'
  description: 'Format all code with Prettier'

# Full quality check
quality:
  command: 'turbo run typecheck && turbo run lint && prettier --check .'
  description: 'Run all quality checks'
```

### Database Commands

```yaml
# Push schema changes
db:push:
  command: 'cd packages/database && pnpm db:push'
  description: 'Push schema changes to database'

# Generate migrations
db:generate:
  command: 'cd packages/database && pnpm db:generate'
  description: 'Generate database migrations'

# Open studio
db:studio:
  command: 'cd packages/database && pnpm db:studio'
  description: 'Open Drizzle Studio'
```

### Deployment Commands

```yaml
# Build for production
build:
  command: 'turbo run build'
  description: 'Build all packages for production'

# Deploy web
deploy:web:
  command: 'cd apps/web && vercel --prod'
  description: 'Deploy web app to Vercel'
```

---

## 📝 Enhanced Project Rules

### Add to `.cursorrules`

```markdown
## 🎨 UI/UX Excellence Standards

### Visual Design

- All new pages must match Make.com Grid quality level
- Use 3D isometric nodes for workflow visualization
- Apply Framer brand colors (#0055FF, #0099FF) exclusively
- Follow Kibo UI component patterns strictly
- Reference v0.dev templates for professional layouts

### Component Standards

- Every card uses Kibo UI CreditCard component
- All loading states use Kibo UI Spinner
- Status indicators use Kibo UI Status component
- No custom UI components without approval

### Animation Standards

- Use Framer Motion for all animations
- Spring physics (stiffness: 300, damping: 25)
- 60fps minimum
- Smooth transitions (<200ms)
- Purposeful, not gratuitous

### Spacing System (8px Grid)

- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px
- Card padding: 24px (p-6)
- Section spacing: 48-64px
- Container max-width: 1280px

### Typography Hierarchy

- H1: text-5xl lg:text-7xl font-bold
- H2: text-3xl lg:text-4xl font-semibold
- H3: text-xl lg:text-2xl font-semibold
- Body: text-base
- Small: text-sm text-muted-foreground

## 🤖 AI Assistant Integration

### Inline AI Requirements

- Every input field gets AI suggestions button
- Context-aware AI prompts
- Show AI confidence scores
- Display reasoning/sources
- One-click accept/reject

### Grid Canvas Requirements

- 3D isometric nodes (Make.com style)
- Grid overview mode
- Context sidebar panel
- Animated connections
- Dependency visualization
- Error state indicators
- Real-time execution feedback

## 🧪 Testing Requirements

### Must Test After Every Change

- Run: pnpm test:run tests/unit tests/component
- All tests must pass before commit
- Add tests for new features
- No decreasing coverage

### Quality Gates

- TypeScript: 0 errors (strict mode)
- Linter: 0 errors, warnings acceptable
- Tests: 100% passing
- Prettier: formatted

## 📚 Documentation Requirements

### Every Feature Needs

- Component-level JSDoc comments
- README in feature directory
- Usage examples
- Props/API documentation
- Migration notes (if applicable)

### Session Handoffs

- Update `.cursor/current-sprint.md`
- Document decisions made
- Note patterns learned
- Create handoff for next session
```

---

## 🛠️ Project Commands to Add

### Create: `.cursor/commands.json`

```json
{
  "commands": [
    {
      "name": "dev",
      "command": "cd apps/web && pnpm dev",
      "description": "Start Next.js dev server"
    },
    {
      "name": "test",
      "command": "cd apps/web && pnpm test:run tests/unit tests/component",
      "description": "Run all tests"
    },
    {
      "name": "quality",
      "command": "turbo run typecheck && turbo run lint && prettier --check .",
      "description": "Full quality check"
    },
    {
      "name": "fix",
      "command": "turbo run lint -- --fix && prettier --write .",
      "description": "Auto-fix linting and formatting"
    },
    {
      "name": "build",
      "command": "turbo run build",
      "description": "Build all packages"
    },
    {
      "name": "db:push",
      "command": "cd packages/database && pnpm db:push",
      "description": "Push database schema"
    },
    {
      "name": "db:studio",
      "command": "cd packages/database && pnpm db:studio",
      "description": "Open Drizzle Studio"
    },
    {
      "name": "clean",
      "command": "turbo run clean && rm -rf node_modules && pnpm install",
      "description": "Clean install everything"
    }
  ]
}
```

---

## 🎯 Complete MCP Configuration

### Updated `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "kibo-ui": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.kibo-ui.com/api/mcp/mcp"]
    },
    "gitkraken": {
      "command": "gk",
      "args": ["mcp"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\Owner\\workspace\\galaxyco-ai-2.0"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

## 📊 Cursor Settings Optimization

### Recommended Settings

```json
{
  "cursor.ai.model": "claude-sonnet-4.5",
  "cursor.ai.codebaseIndexing": true,
  "cursor.ai.privacyMode": false,
  "cursor.composer.enabled": true,
  "cursor.chat.enabled": true,
  "cursor.chat.contextFiles": 20,
  "cursor.chat.codebaseSearch": true,
  "cursor.terminal.integrated": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "onFocusChange"
}
```

---

## 🚀 Execution Plan (Tonight)

### Phase 1: MCP Server Research & Config (1 hour)

- ✅ Research complete
- 🚧 Update .cursor/mcp.json
- 🚧 Add filesystem server
- 🚧 Add GitHub server
- 🚧 Add PostgreSQL server
- 🚧 Add memory server
- 🚧 Test all connections

### Phase 2: Project Commands (30 min)

- Create .cursor/commands.json
- Add 8 essential commands
- Test each command
- Document usage

### Phase 3: Enhanced Rules (30 min)

- Update .cursorrules
- Add UI/UX standards
- Add Grid canvas requirements
- Add testing requirements
- Add documentation standards

### Phase 4: Documentation (30 min)

- Complete MCP server guide
- Command reference
- Best practices doc
- Quick start guide

---

## ✅ Benefits

### With Complete MCP Setup:

- 🚀 **Filesystem:** Faster file operations
- 🐙 **GitHub:** Direct issue/PR management
- 🗄️ **PostgreSQL:** Query database directly
- 🧠 **Memory:** Persistent knowledge
- 🎨 **Kibo UI:** Component documentation

### With Project Commands:

- ⚡ Quick access to common tasks
- 🎯 One-click testing
- 🔄 Easy quality checks
- 📦 Simplified workflows

### With Enhanced Rules:

- 🎨 Consistent UI quality (Make.com level)
- 📐 Enforced standards
- 🧪 Required testing
- 📚 Better documentation

---

## 🎯 Expected Outcomes

**Tonight I'll configure:**

- ✅ 6 MCP servers (filesystem, github, postgres, memory + existing 2)
- ✅ 8 project commands
- ✅ Enhanced project rules
- ✅ Complete documentation

**Tomorrow you'll have:**

- ⚡ Faster AI assistance (more context)
- 🎯 One-click commands
- 📐 Enforced quality standards
- 🚀 Optimal development environment

---

**Adding to overnight mission... Executing now! 🚀**
