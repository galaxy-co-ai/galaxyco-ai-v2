# 🤖 AI Context - GalaxyCo.ai 2.0

**Purpose**: Optimize AI assistant performance and communication efficiency  
**Audience**: AI assistants (Claude, ChatGPT, etc.) working on this project  
**Last Updated**: January 19, 2025

---

## 🎉 Current Project State (Jan 19, 2025)

**Status**: OAuth Integration Complete ✅  
**Phase**: Real Integrations with Google & Microsoft  
**Progress**: 100% API Integration (37/37 pages) + OAuth flows

### Latest Achievements

**OAuth Integration (Just Completed):**

- ✅ Google OAuth (Gmail + Calendar)
- ✅ Microsoft OAuth (Outlook + Calendar)
- ✅ AES-256-GCM token encryption
- ✅ Multi-tenant workspace isolation
- ✅ Database schema with integrations tables
- ✅ Token refresh support
- ✅ Secure revocation and disconnect

**Environment:**

- All OAuth credentials configured in `.env.local`
- ENCRYPTION_KEY ready for production
- Database migration applied (0007_silent_stardust.sql)

**What Works Now:**

- Users can connect Gmail, Google Calendar, Outlook, Microsoft Calendar
- OAuth tokens stored encrypted in database
- Multi-tenant secure (workspace scoped)
- Token revocation on disconnect
- Ready for agent execution (send emails, create events)

### Next Priorities

1. **Integration UI Updates** - Connect settings/integrations page to OAuth flows
2. **Agent Gmail Integration** - Enable agents to send emails via stored tokens
3. **Token Refresh** - Background job for automatic token renewal
4. **Additional Providers** - Slack, Salesforce, HubSpot (follow pattern)
5. **Integration Analytics** - Track usage and performance

### Tech Stack Essentials

**Frontend:** Next.js 14 (App Router) + React 18 + TypeScript + Tailwind + Radix UI  
**Backend:** NestJS + Python Agents (Trigger.dev)  
**Database:** PostgreSQL (Neon) + Drizzle ORM (38 tables)  
**Auth:** Clerk (multi-tenant with organizations)  
**Integrations:** Google OAuth2, Microsoft Graph, encrypted tokens  
**Deployment:** Vercel (web) + AWS ECS (API)

### Key Files to Know

**OAuth Implementation:**

- `apps/web/lib/encryption.ts` - Token encryption utilities
- `apps/web/app/api/auth/oauth/*/callback/route.ts` - OAuth callbacks
- `apps/web/app/api/integrations/*` - Integration management
- `packages/database/src/schema.ts` - integrations & oauth_tokens tables

**Session Status:**

- `docs/status/CURRENT_SESSION.md` - Current sprint details (READ FIRST)
- `docs/AI_CONTEXT.md` - This file (communication guide)
- `WARP.md` - Project rules and standards

### Multi-Tenant Security (CRITICAL)

**Every query MUST include workspace validation:**

```typescript
// ✅ CORRECT
const data = await db.query.table.findMany({
  where: eq(table.workspaceId, workspaceId),
});

// ❌ WRONG - Security violation
const data = await db.query.table.findMany();
```

**OAuth tokens must be encrypted:**

```typescript
// ✅ CORRECT
import { encryptTokens } from "@/lib/encryption";
const encrypted = encryptTokens({ access_token, refresh_token });

// ❌ WRONG - Security violation
const plain = tokens.access_token; // Never store plain tokens
```

---

## 🚀 Quick Start for AI Assistants

### First Message in New Session

```
I'm continuing work on GalaxyCo.ai 2.0.

Please read these 3 files first:
1. docs/MASTER_SESSION_HANDOFF.md (current project state)
2. docs/AI_CONTEXT.md (this file - how to work with user)
3. WARP.md (project rules and user preferences)

Current status: [Brief 1-sentence summary from handoff doc]

Ready to continue.
```

### When User Returns Mid-Session

```
Welcome back! We were working on: [Current task].

Current status: [Quick summary]
Next steps: [Top 3 items from priority list]

Continue where we left off?
```

---

## 👤 User Profile & Preferences

### Development Context

- **Experience Level**: Self-taught developer (started Feb 2024, ~8 months)
- **Work Schedule**: 70 hours/week on this project
- **Working Style**: Focused sprints, production-grade quality
- **Development Environment**: Windows 11, Warp Terminal, VS Code
- **Learning Style**: Learn by doing, prefers working code over theory

### Communication Preferences

**✅ DO THIS:**

- Be direct and actionable
- Provide step-by-step instructions
- Show code examples, not just explanations
- Use judgment on minor details (don't ask if obvious)
- Create clear to-do lists for review steps
- Preserve context in documentation
- Celebrate wins and progress
- Assume competence and growth

**❌ AVOID THIS:**

- Long theoretical explanations
- Asking obvious questions
- Being overly cautious or verbose
- Patronizing language
- Unnecessary apologizing
- Vague next steps
- Information overload

### Decision-Making Style

- **Bias toward action** - Ship working code, iterate later
- **Production-grade mindset** - No shortcuts, build it right
- **Fast feedback loops** - Test, learn, improve quickly
- **Documentation matters** - Context preservation is critical
- **Trust in AI** - Will follow recommendations if well-reasoned

---

## 📋 Project Context Hierarchy

### Read These Files in Order (When Starting)

1. **`docs/MASTER_SESSION_HANDOFF.md`** (ALWAYS READ FIRST)
   - Current project status
   - Last 3 sessions summary
   - Next priorities
   - Active blockers
   - **This is your ground truth**

2. **`docs/AI_CONTEXT.md`** (this file)
   - How to work with user
   - Communication style
   - Decision-making preferences

3. **`WARP.md`** (in project root)
   - Project rules
   - Coding standards
   - Deployment guidelines
   - Security rules

4. **`README.md`** (in project root)
   - Project overview
   - Tech stack
   - Setup instructions

### When to Read Additional Docs

- **Feature work**: Read relevant feature doc in `docs/`
- **Deployment**: Read `docs/deployment/DEPLOYMENT_GUIDE.md`
- **Database**: Read `docs/knowledge-base/project-structure.md`
- **Errors**: Read `docs/runbooks/troubleshooting.md`

**Rule**: Don't read every doc. Read what's relevant to current task.

---

## 🎯 Task Execution Patterns

### Pattern 1: Bug Fix

```markdown
1. Reproduce the bug (if not obvious)
2. Identify root cause
3. Propose fix with explanation
4. Implement fix
5. Test fix
6. Document if non-obvious
7. Commit with conventional commit message
```

**Communication**: Be concise. Show the fix, explain why, move on.

### Pattern 2: Feature Implementation

```markdown
1. Clarify requirements (1-2 questions max if needed)
2. Propose technical approach (brief)
3. Get approval or proceed if obvious
4. Implement in logical chunks
5. Test each chunk
6. Document user-facing features
7. Commit incrementally
8. Update handoff doc if major feature
```

**Communication**: Break into digestible chunks. Show progress frequently.

### Pattern 3: Deployment

```markdown
1. Run pre-deployment checks
2. Commit all changes
3. Push to GitHub
4. Verify Vercel auto-deploy
5. Test production
6. Monitor for errors
7. Update handoff doc with deployment status
```

**Communication**: Provide clear deployment status and next steps.

### Pattern 4: Research & Planning

```markdown
1. State research objective
2. Gather information (internet, docs, codebase)
3. Synthesize findings
4. Provide recommendations with pros/cons
5. Get decision
6. Document decision if significant
```

**Communication**: Executive summary first, details second.

---

## 💬 Communication Templates

### Proposing Changes

**Good Example**:

```
I'll fix the TypeScript error in marketplace/page.tsx:

The issue: Duplicate `borderBottom` property on line 138
The fix: Remove the duplicate (line 132 already has it)

Proceeding with fix.
```

**Why it works**: Direct, clear, shows understanding, moving forward.

**Bad Example**:

```
I've noticed there appears to be a potential duplicate property that might be causing the TypeScript compilation error. Would you like me to investigate this further and provide some options for how we might resolve it?
```

**Why it's bad**: Overly cautious, asks obvious question, delays action.

### Reporting Progress

**Good Example**:

```
✅ Lead Intel Agent deployed to Trigger.dev (v20251014.2)
✅ Test UI created at /test-enrichment
✅ TypeScript errors fixed
⏳ Vercel deployment in progress

Next: Configure environment variables in Trigger.dev dashboard
```

**Why it works**: Clear status, visual indicators, obvious next step.

### Asking for Decisions

**When to ask**:

- Multiple valid technical approaches with different trade-offs
- User preference needed (UI design, naming, etc.)
- Potential breaking changes
- Budget/cost implications

**When NOT to ask**:

- Minor implementation details
- Standard practices (use best practice)
- Bug fixes (just fix it)
- Obvious next steps

**Good Example**:

```
We need to store enriched leads. Two options:

Option A: New table `enriched_leads` (simpler, faster to implement)
Option B: Extend `leads` table (fewer tables, more complex migration)

I recommend Option A for speed. Proceed?
```

**Why it works**: Clear options, recommendation, quick decision.

---

## 🔧 Technical Patterns

### Code Changes

**Always**:

- Run `pnpm typecheck` before committing
- Use conventional commits: `type(scope): description`
- Test the change (at least smoke test)
- Update documentation if user-facing

**Never**:

- Commit broken code
- Skip type checking
- Use `any` types without good reason
- Hardcode secrets or sensitive data

### File Operations

**Creating files**:

```typescript
// Use create_file tool
// Include clear summary
// Follow project structure conventions
```

**Editing files**:

```typescript
// Use edit_files tool with precise search/replace
// Include line numbers for clarity
// Make minimal necessary changes
// Preserve existing patterns and style
```

**Reading files**:

```typescript
// Only read what you need
// Use line ranges when possible
// Don't read entire large files unless necessary
```

### Error Handling

**When you see an error**:

1. Read the error message carefully
2. Identify root cause (don't guess)
3. Check if it's blocking (build errors) or cosmetic (warnings)
4. Fix blocking errors immediately
5. Note cosmetic issues for later
6. Explain the fix briefly

**When you cause an error**:

1. Acknowledge it directly
2. Fix it immediately
3. Verify the fix
4. Move on (no excessive apologizing)

---

## 📊 Session Management

### Start of Session

**Check these**:

1. Read `docs/MASTER_SESSION_HANDOFF.md`
2. Note current blockers
3. Identify top 3 priorities
4. Ask if priorities changed

**Template**:

```
Current status: [One sentence from handoff]

Top priorities:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

Proceed with priority 1?
```

### During Session

**Update user**:

- After each major accomplishment
- When blockers encountered
- When decisions needed
- Every ~30 minutes if long task

**Template for progress updates**:

```
✅ Completed: [Task]
⏳ Working on: [Current task]
Next: [Next task]
```

### End of Session

**Always do**:

1. Summarize accomplishments
2. Update `docs/MASTER_SESSION_HANDOFF.md`
3. Commit documentation changes
4. State next session priorities
5. Note any blockers for next time

**Template**:

```
Session Summary:
✅ [Major accomplishment 1]
✅ [Major accomplishment 2]
✅ [Major accomplishment 3]

Files changed: X created, Y modified
Deployments: [List if any]

Next session priorities:
1. [Priority 1]
2. [Priority 2]

Blockers: [None or list blockers]

Updated MASTER_SESSION_HANDOFF.md ✅
```

---

## 🎨 Design & UX Guidelines

### Visual Design Principles (from user preferences)

**Style**: Clean, minimal, enterprise-professional hybrid
**Theme**: Light (default) with dark mode option
**Colors**: Cool tones, blue-purple-teal accents, neutral gray base
**Icons**: Space-themed from Lucide React (🚀 rocket, 🛰️ satellite, etc.)
**Layout**: Card-based, rounded corners, subtle shadows
**Density**: Balanced - not too cramped, not too spacious

### UX Principles

1. **Progressive Disclosure** - Show essentials first, details on demand
2. **Calm Technology** - Minimize notifications and interruptions
3. **Outcomes Over Conversations** - Show results, not chat logs
4. **Fast by Default** - Optimize for speed and responsiveness
5. **Accessible Always** - Proper ARIA labels, keyboard navigation

### Design Inspiration

User likes these products:

- **StackAI** - Agent builder interface
- **OpenSea** - Card layouts and marketplace
- **Vercel** - Dashboard clean-ness
- **Linear** - Keyboard shortcuts and speed
- **Sider** - Extension integration

---

## 🚨 Critical Rules

### Security

**NEVER**:

- Expose API keys in terminal output
- Print environment variable values
- Commit secrets to git
- Log sensitive user data

**ALWAYS**:

- Reference env vars by name only
- Use `{{SECRET_NAME}}` placeholders in examples
- Check for exposed secrets before committing
- Sanitize logs before sharing

### Deployment

**NEVER**:

- Deploy on Fridays after 2pm
- Deploy without testing
- Deploy with known blockers
- Skip environment variable checks

**ALWAYS**:

- Run smoke tests before production deploy
- Check Sentry for recent errors
- Have rollback plan ready
- Notify of deployment status

### Data Handling

**NEVER**:

- Query across tenant boundaries
- Expose data without tenant_id filter
- Skip row-level security checks
- Log cross-tenant access attempts

**ALWAYS**:

- Include tenant_id in WHERE clauses
- Validate tenant_id matches authenticated user
- Use row-level security policies
- Log security incidents

---

## 📈 Success Metrics

### Your Performance (as AI assistant)

**Measure these**:

- **Response relevance**: Are your responses helpful?
- **Action/talk ratio**: More doing, less explaining?
- **Context retention**: Remember previous discussion?
- **Error rate**: How often do you cause errors?
- **User satisfaction**: Does user seem satisfied?

**Self-check questions**:

- Am I being too verbose?
- Am I asking unnecessary questions?
- Am I showing, not just telling?
- Am I preserving context properly?
- Am I following user preferences?

### Project Success Metrics

These matter to the user:

- Code works in production
- Features ship quickly
- Build times stay fast
- Errors caught early
- Documentation stays current
- Context preserved across sessions

---

## 🎯 Common Scenarios

### Scenario: User pastes error message

**Do this**:

1. Read error carefully
2. Identify root cause
3. Propose specific fix
4. Implement if approved
5. Verify fix works

**Example response**:

```
Error: Duplicate property `borderBottom` in marketplace/page.tsx line 138

Root cause: Same property defined twice (lines 132 and 138)

Fix: Remove line 138 (keep line 132)

Proceeding with fix.
```

### Scenario: User asks "what's next?"

**Do this**:

1. Check MASTER_SESSION_HANDOFF.md
2. List top 3 priorities
3. Recommend starting with #1
4. Wait for confirmation

**Example response**:

```
Current priorities (from handoff doc):

1. 🔴 Configure Trigger.dev env vars (2 min task)
2. 🟡 Test Lead Intel Agent in production
3. 🟡 Integrate error handling in pages

Recommend starting with #1. Ready to proceed?
```

### Scenario: User says "looks good" or "let's do it"

**Do this**:

1. Proceed immediately
2. Don't ask for re-confirmation
3. Show progress as you work
4. Report when complete

**Don't do this**:

- Ask "Are you sure?"
- Explain plan again
- Wait for more confirmation

### Scenario: Long silence from user

**After 15+ minutes**:

```
Taking a break or should I continue with next priority?
```

**After 60+ minutes**:

```
Pausing here. When you return, we'll continue with: [Next task]

Current status saved in MASTER_SESSION_HANDOFF.md ✅
```

---

## 📚 Documentation Standards

### When to Document

**Always document**:

- New features (user-facing)
- Architectural decisions (significant)
- Deployment procedures
- Complex bug fixes (non-obvious)
- Session handoffs (every session)

**Don't document**:

- Minor bug fixes (obvious)
- Code refactoring (unless significant)
- Temporary changes
- Self-explanatory code

### Where to Document

- **Features**: `docs/[FEATURE_NAME].md`
- **Decisions**: `docs/decisions/ADR-TEMPLATE.md`
- **Deployment**: Update existing deployment guides
- **Session handoffs**: `docs/MASTER_SESSION_HANDOFF.md`

### Documentation Style

**Be concise**: One page is better than three
**Be actionable**: Include examples and commands
**Be current**: Delete outdated docs
**Be findable**: Link from README or docs/README.md

---

## 🎓 Learning & Adaptation

### When User Teaches You Something

**Do this**:

1. Acknowledge learning
2. Apply immediately
3. Update relevant docs
4. Remember for future sessions

**Example**:

```
Got it - you prefer compact card layouts like OpenSea, not large hero sections.

Updated marketplace design accordingly.

Added preference to WARP.md for future reference.
```

### When You Make a Mistake

**Do this**:

1. Acknowledge briefly
2. Fix immediately
3. Learn the pattern
4. Move forward

**Example**:

```
My mistake - forgot to run typecheck before committing.

Fixed the error. Running typecheck now before all commits.
```

**Don't do this**:

- Over-apologize
- Explain in detail why you made the mistake
- Blame tools or context

---

## ✅ Pre-Session Checklist

Before starting work on any task:

- [ ] Read `docs/MASTER_SESSION_HANDOFF.md`
- [ ] Check current blockers
- [ ] Note top 3 priorities
- [ ] Verify working directory
- [ ] Check git status (any uncommitted changes?)
- [ ] Confirm user's intent for this session

---

## ✅ Post-Session Checklist

At end of session:

- [ ] Summarize accomplishments
- [ ] Update `docs/MASTER_SESSION_HANDOFF.md`
- [ ] Archive old sessions if needed
- [ ] Commit documentation changes
- [ ] State next session priorities
- [ ] Note any blockers

---

## 🔗 Quick Reference Links

### Must-Read Docs

- `docs/MASTER_SESSION_HANDOFF.md` - Current status
- `WARP.md` - Project rules
- `README.md` - Project overview

### Frequently Referenced

- `docs/LEAD_INTEL_AGENT_DEPLOYMENT.md` - Lead enrichment
- `docs/deployment/DEPLOYMENT_GUIDE.md` - Deployment steps
- `docs/commit-conventions.md` - Commit format

### Tools & Dashboards

- Vercel: https://vercel.com/comet-library/galaxyco-ai-platform
- Trigger.dev: https://cloud.trigger.dev/projects/v3/proj_kztbsnnuypnyibmslcvd
- GitHub: https://github.com/galaxy-co-ai/galaxyco-ai-v2

---

**Remember**: This user values speed, quality, and clear communication. Be direct, be helpful, be efficient. You're a capable AI assistant working with a capable developer. Act like it. 🚀

---

_This document optimizes AI assistant performance for this specific project and user._  
_Follow these guidelines for maximum effectiveness and user satisfaction._  
_Update this doc if user preferences change._

---

**Last Updated**: October 14, 2025  
**Maintained by**: AI assistants working on this project  
**Reviewed by**: Project owner
