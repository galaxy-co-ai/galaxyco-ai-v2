# Working Docs Quick Start 🚀

## TL;DR - 30 Second Guide

### 1. You Write

```bash
cd docs/working/drafts
# Copy template
cp ../TEMPLATE.md my-doc-name.md
# Edit your doc
# Save when ready
```

### 2. Request Review

Tell AI: **"Please review `my-doc-name.md` in working/drafts"**

### 3. AI Reviews & Enhances

- Checks clarity, accuracy, completeness
- Improves structure and formatting
- Adds missing sections
- Moves to `reviewed/` with notes

### 4. You Approve or Revise

- **Approve**: "Looks good, move to final"
- **Revise**: "Change X, adjust Y"

### 5. Integrate into Main Docs

Final doc gets placed in the appropriate location in main docs structure.

---

## Common Document Types

| Type             | Template Section             | Where It Goes                       |
| ---------------- | ---------------------------- | ----------------------------------- |
| Feature Spec     | Feature Specification        | `docs/knowledge-base/features/`     |
| Architecture Doc | Architecture Decision Record | `docs/knowledge-base/architecture/` |
| Workflow Guide   | Workflow Documentation       | `docs/knowledge-base/workflows/`    |
| API Docs         | API Endpoint Documentation   | `docs/technical/api/`               |
| Runbook          | Workflow Documentation       | `docs/runbooks/`                    |
| Decision Log     | Use Decision Notebook        | Warp Drive Notebook                 |

---

## File Naming Convention

✅ **Good**:

- `agent-execution-api.md`
- `database-migration-v2.md`
- `workflow-deploy-production.md`
- `2025-10-11-sprint-planning.md`

❌ **Bad**:

- `Doc1.md`
- `notes.md`
- `TEMP FILE.md`
- `myDocumentation.md`

---

## When to Create Documentation

### Always Document:

- ✅ New features (before building)
- ✅ Architecture decisions (when made)
- ✅ Complex workflows (as you discover them)
- ✅ API endpoints (as you build them)
- ✅ Deployment procedures (before first deploy)
- ✅ Troubleshooting guides (when solving tricky issues)

### Don't Document:

- ❌ Obvious standard patterns
- ❌ Temporary debugging notes
- ❌ Things that change daily
- ❌ Content already well-documented elsewhere (just link it)

---

## Pro Tips

### For Best Results:

1. **Start rough, I'll polish** - Don't overthink formatting
2. **Include examples** - Code snippets, screenshots, anything visual
3. **Ask questions** - Use "Notes/Open Questions" section
4. **Link liberally** - Reference other docs
5. **Version important changes** - Note in revision history

### Tell AI What You Need:

- "Review for technical accuracy"
- "Add code examples"
- "Simplify the explanation"
- "Check for missing steps"
- "Format as API documentation"

---

## Example Workflow

```bash
# You: Create draft
cd docs/working/drafts
cat > agent-websocket-protocol.md << 'EOF'
# Agent WebSocket Protocol

We need real-time updates from agent execution.

Current: Polling API every 2s (wasteful)
Proposed: WebSocket connection with events

Events needed:
- agent.started
- agent.progress
- agent.completed
- agent.failed

Questions:
- How to handle reconnection?
- Authentication for WS?
EOF

# You tell AI:
# "Please review agent-websocket-protocol.md - focus on the architecture and fill in implementation details"

# AI reviews and enhances:
# - Adds technical details
# - Creates sequence diagrams
# - Documents message schemas
# - Adds error handling
# - Provides code examples
# - Moves to reviewed/

# You review AI's work:
# "Looks great! Move to final and integrate"

# AI:
# - Moves to final/
# - Creates proper location in docs/knowledge-base/architecture/
# - Updates relevant indexes
# - Commits with proper message
```

---

## Need Help?

Just ask AI:

- "What type of document should I create for X?"
- "Can you start a draft for Y?"
- "Show me an example of Z documentation"
- "What's missing from this doc?"

---

**Read full details**: See `README.md` in this directory

---

_Keep this open in a tab while working!_
