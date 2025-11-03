# Multi-Agent Coordination Master Plan

**Purpose:** Master coordination document for all 6 agents

**Last Updated:** ${new Date().toISOString()}

---

## 🎯 Agent Roster

### 1. 🔵 Frontend Architect Agent
- **Scope:** React/Next.js, UI components, client-side
- **Branch:** `feature/frontend-agent`
- **Context:** `.cursor/context/frontend-architect-context.md`

### 2. 🟢 Backend Systems Agent
- **Scope:** APIs, databases, server-side logic
- **Branch:** `feature/backend-agent`
- **Context:** `.cursor/context/backend-systems-context.md`

### 3. 🟠 DevOps & Infrastructure Agent
- **Scope:** Deployment, CI/CD, infrastructure
- **Branch:** `feature/devops-agent`
- **Context:** `.cursor/context/devops-infrastructure-context.md`

### 4. 🎨 UI/UX Design Agent
- **Scope:** Design thinking, wireframes, design systems
- **Branch:** `feature/ui-agent`
- **Context:** `.cursor/context/ui-ux-design-context.md`

### 5. 🟣 Quality & Testing Agent
- **Scope:** Testing, QA, code quality
- **Branch:** `feature/qa-agent`
- **Context:** `.cursor/context/quality-testing-context.md`

### 6. 🔧 Cursor Engineer Agent
- **Scope:** Cursor optimization, MCP servers, environment
- **Branch:** `feature/cursor-engineer`
- **Context:** `.cursor/context/cursor-engineer-context.md`

---

## 🔄 Coordination Protocols

### File Conflict Resolution

**When agents need same file:**
1. Conflict detection system activates
2. Agents coordinate via messaging
3. Sequential execution (one agent at a time)
4. File locks prevent conflicts

### Cross-Agent Dependencies

**Frontend ↔ Backend:**
- Frontend needs API → Backend creates endpoint
- Backend needs UI → Frontend creates component
- Coordination via messaging system

**UI/UX ↔ Frontend:**
- UI/UX creates design → Frontend implements
- Frontend needs design → UI/UX provides specs
- Design review process

**All Agents ↔ Cursor Engineer:**
- Cursor Engineer optimizes environment
- All agents benefit from optimization
- Cursor Engineer creates reference docs

---

## 📋 Daily Workflow

### Morning Routine

1. **Check handoff files** - Resume from previous sessions
2. **Check out agent branch** - `git checkout feature/[agent]-agent`
3. **Review context files** - Read agent-specific context
4. **Start work** - Begin assigned tasks

### During Work

1. **Coordinate via messaging** - If conflicts arise
2. **Save progress** - Auto-save before context limit
3. **Document decisions** - Update handoff files
4. **Push changes** - Commit and push to branch

### End of Day

1. **Create handoff** - Save session state
2. **Push to GitHub** - Backup work
3. **Update status** - Document progress

---

## ✅ Quality Standards

**All agents must:**
- ✅ Follow GalaxyCo development standards
- ✅ Use TypeScript strict mode
- ✅ Validate input with Zod
- ✅ Include error handling
- ✅ Write user-friendly error messages
- ✅ Filter by orgId (multi-tenant isolation)

---

## 🚀 Getting Started

1. **Activate agent** - Copy kickoff message from `.cursor/agents/KICKOFF-MESSAGES.md`
2. **Check out branch** - `git checkout feature/[agent]-agent`
3. **Read context** - Review `.cursor/context/[agent]-context.md`
4. **Begin work** - Start assigned tasks

---

**Status:** ✅ Ready for Production Use

