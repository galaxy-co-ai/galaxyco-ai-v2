# Working Docs Directory

**Purpose**: Collaborative workspace for documentation in active development

## 📁 Directory Structure

```
working/
├── README.md              # This file - workflow guide
├── drafts/                # Your initial documentation (unreviewed)
├── reviewed/              # AI-reviewed & polished docs
├── final/                 # Approved docs ready for production
└── _archive/              # Old versions for reference
```

## 🔄 Documentation Workflow

### 1️⃣ **You Create** → Place in `drafts/`

When you write documentation, place it in the `drafts/` folder:

```bash
# Example
docs/working/drafts/agent-execution-flow.md
docs/working/drafts/database-schema-v2.md
```

### 2️⃣ **AI Reviews** → Moves to `reviewed/`

I will:

- ✅ Check for clarity, completeness, and accuracy
- ✅ Enhance formatting and structure
- ✅ Add missing sections or examples
- ✅ Ensure consistency with project standards
- ✅ Move to `reviewed/` folder with revision notes

### 3️⃣ **You Approve** → Moves to `final/`

After you review my changes:

- If approved → Move to `final/` and integrate into main docs
- If needs revision → I'll update based on your feedback

### 4️⃣ **Integration** → Deploy to main docs

Final docs get moved to appropriate locations:

- Architecture docs → `docs/knowledge-base/architecture/`
- Feature specs → `docs/knowledge-base/features/`
- Workflows → `docs/knowledge-base/workflows/`
- Runbooks → `docs/runbooks/`
- etc.

---

## 📝 Document Types & Templates

### **Architecture Decision Record (ADR)**

```markdown
# ADR-###: [Title]

**Date**: YYYY-MM-DD
**Status**: Draft | Reviewed | Accepted | Deprecated
**Deciders**: [Who made the decision]

## Context

What is the issue we're trying to solve?

## Decision

What did we decide?

## Consequences

What becomes easier or harder?

## Alternatives Considered

What other options did we explore?
```

### **Feature Specification**

```markdown
# Feature: [Name]

## Overview

Brief description of the feature

## User Story

As a [user type], I want [goal] so that [benefit]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Technical Approach

How we'll build it

## Dependencies

What else needs to exist first

## Testing Strategy

How we'll verify it works

## Rollout Plan

How we'll deploy it
```

### **Workflow Documentation**

```markdown
# Workflow: [Name]

## Purpose

Why this workflow exists

## Prerequisites

What you need before starting

## Steps

1. Step one with example
2. Step two with example

## Troubleshooting

Common issues and solutions

## Related Documentation

Links to related docs
```

### **API Endpoint Documentation**

```markdown
# Endpoint: [Method] /path/to/endpoint

## Purpose

What this endpoint does

## Authentication

Required auth level

## Request

### Headers

### Body Schema

### Example

## Response

### Success (200)

### Error Cases

## Implementation Notes

Gotchas, edge cases, etc.
```

### **Research Document**

```markdown
# Research: [Topic Name]

## Research Objective

What you're trying to learn and why

## Executive Summary

Key findings and recommendations (write last)

## Research Sources

List all sources with quality ratings

## Detailed Findings

Capture information from each source

## Recommendations & Next Steps

What action to take based on research

## AI Review Checklist

What you want AI to focus on
```

**For deep research**: Use `TEMPLATE-RESEARCH.md` - comprehensive template for internet research compilation

---

## 🎯 Documentation Standards

### **Formatting Rules**

- Use clear, descriptive headings (H2 ##, H3 ###)
- Code blocks must specify language: \`\`\`typescript
- Include examples for all code snippets
- Use tables for structured data
- Add emojis for visual scanning (sparingly)
- Keep lines under 120 characters

### **Content Rules**

- Write in present tense ("The system does X" not "will do")
- Be specific (avoid "soon", "later", "basically")
- Include "Why" not just "What" and "How"
- Link to related documentation
- Update last modified date
- Add your name as author/contributor

### **File Naming**

- Use kebab-case: `agent-execution-flow.md`
- Include version if relevant: `api-spec-v2.md`
- Prefix with category: `runbook-deploy-agents.md`
- Date prefix for dated docs: `2025-10-11-sprint-planning.md`

---

## 🚀 Quick Start

### For You:

```bash
# Create a new doc
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/docs/working/drafts
touch my-new-feature-spec.md

# Edit in your editor
# When ready, let AI know: "Please review my-new-feature-spec.md in working/drafts"
```

### For AI:

```bash
# Check for new drafts
ls docs/working/drafts/

# Review and move to reviewed
# Add review notes at top of file
# Commit with message: "docs(review): reviewed my-new-feature-spec"
```

---

## 📋 Current Inventory

### In Progress

- [ ] None yet - ready for your first doc!

### Reviewed (Awaiting Approval)

- [ ] None yet

### Recently Finalized

- [ ] None yet

---

## 💡 Tips for Great Documentation

1. **Start with "Why"** - Explain the problem before the solution
2. **Use Examples** - Code samples, screenshots, diagrams
3. **Think Future You** - Will you understand this in 6 months?
4. **Link Generously** - Connect related concepts
5. **Version Control** - Note when things change and why
6. **Keep It Fresh** - Delete outdated docs, don't hoard
7. **Test It** - Follow your own instructions to verify accuracy

---

**Questions?** Ask in any session and I'll help refine this workflow!

---

_Last Updated: 2025-10-11_
_Maintained by: galaxy-co-ai + AI Assistant_
