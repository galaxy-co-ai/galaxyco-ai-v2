# Working Docs System - Complete Index 📚

**Last Updated**: 2025-10-11

---

## 🎯 Start Here

### New to the System?

1. Read: **AI-COLLABORATION-PRINCIPLES.md** (CRITICAL - how AI works with you)
2. Read: **QUICK-START.md** (2 minutes)
3. Review: **WORKFLOW-DIAGRAM.md** (visual overview)
4. Choose your template and go!

### Quick Actions

| I want to...            | Use this file          | Location                                           |
| ----------------------- | ---------------------- | -------------------------------------------------- |
| Create a feature spec   | `TEMPLATE.md`          | `cp TEMPLATE.md drafts/my-feature.md`              |
| Document research       | `TEMPLATE-RESEARCH.md` | `cp TEMPLATE-RESEARCH.md drafts/research-topic.md` |
| Understand the workflow | `WORKFLOW-DIAGRAM.md`  | Just read it                                       |
| Get research tips       | `RESEARCH-WORKFLOW.md` | Reference guide                                    |
| See full details        | `README.md`            | Complete documentation                             |

---

## 📁 Directory Structure

```
working/
├── INDEX.md                    ← YOU ARE HERE
├── README.md                   ← Full system documentation
├── QUICK-START.md              ← 30-second guide
├── WORKFLOW-DIAGRAM.md         ← Visual workflow explanation
├── RESEARCH-WORKFLOW.md        ← How to capture research effectively
│
├── TEMPLATE.md                 ← General documentation template
├── TEMPLATE-RESEARCH.md        ← Deep research template
│
├── drafts/                     ← CREATE YOUR DOCS HERE
│   └── .gitkeep
│
├── reviewed/                   ← AI-enhanced docs (awaiting approval)
│
├── final/                      ← Approved docs (ready for integration)
│
└── _archive/                   ← Historical versions
```

---

## 📖 File Guide

### 📘 Documentation Files

#### **README.md** - The Complete Guide

**Size**: ~5.6 KB  
**Read Time**: 10-15 minutes  
**When to use**: First time setup, need detailed reference

**Contains**:

- Full workflow explanation
- All document type templates
- Documentation standards
- File naming conventions
- Tips for great documentation

**Best for**: Understanding the entire system

---

#### **QUICK-START.md** - The Speed Run

**Size**: ~3.7 KB  
**Read Time**: 2 minutes  
**When to use**: Every time you create a doc

**Contains**:

- 30-second workflow overview
- Common document types table
- File naming examples
- When to document (checklist)
- Pro tips

**Best for**: Quick reference while working

---

#### **WORKFLOW-DIAGRAM.md** - The Visual Guide

**Size**: ~6.6 KB  
**Read Time**: 5 minutes  
**When to use**: Confused about the process

**Contains**:

- ASCII workflow diagram
- State explanations (Draft → Review → Final)
- Common workflow examples
- Document lifecycle stats
- Success metrics
- Red flags to watch for

**Best for**: Understanding how docs flow through the system

---

#### **RESEARCH-WORKFLOW.md** - The Research Bible

**Size**: ~12 KB  
**Read Time**: 15-20 minutes  
**When to use**: Before starting research sessions

**Contains**:

- Research scenarios & strategies
- Capture techniques (3-pass method)
- Code example patterns
- AI transformation explanation
- Pro tips (dos and don'ts)
- Research session template
- Complete example flow

**Best for**: Learning how to effectively capture internet research

---

### 📄 Template Files

#### **TEMPLATE.md** - General Purpose

**Size**: ~1.2 KB  
**When to use**:

- Feature specifications
- Architecture docs
- Workflow guides
- API documentation
- General documentation

**Includes sections**:

- Overview & Purpose
- Detailed Content
- Acceptance Criteria
- Related Documentation
- Notes/Open Questions
- Revision History

**Copy command**:

```bash
cp TEMPLATE.md drafts/my-document.md
```

---

#### **TEMPLATE-RESEARCH.md** - Deep Research

**Size**: ~10 KB  
**When to use**:

- Evaluating technologies/tools
- Learning new patterns
- Competitive analysis
- Problem-solving research
- Architecture decisions

**Includes sections**:

- Research Objective
- Executive Summary (write last!)
- Research Sources (with quality ratings)
- Detailed Findings
- Patterns & Best Practices
- Technical Deep Dive
- Pros & Cons Analysis
- Real-World Examples
- Challenges & Gotchas
- Metrics & Benchmarks
- Security Considerations
- Cost Analysis
- Recommendations & Next Steps
- AI Review Checklist

**Copy command**:

```bash
cp TEMPLATE-RESEARCH.md drafts/research-topic-name.md
```

---

## 🔄 Workflow Quick Reference

### The 5-State Lifecycle

```
1. DRAFT     → You create in drafts/
2. REVIEW    → AI enhances
3. REVIEWED  → AI moves to reviewed/, you approve
4. FINAL     → AI moves to final/, prepares integration
5. ARCHIVED  → AI integrates and archives
```

### Commands

```bash
# Create new doc
cd docs/working/drafts
cp ../TEMPLATE.md my-feature.md

# Create research doc
cp ../TEMPLATE-RESEARCH.md research-topic.md

# Edit in your editor
# [Make changes, save]

# Request AI review
# In chat: "Please review my-feature.md in working/drafts"

# After AI review
# In chat: "Looks good, integrate" OR "Change X in section Y"
```

---

## 🎨 Document Type Decision Tree

```
Need to document something?
│
├─ Is it RESEARCH from internet?
│  └─ YES → Use TEMPLATE-RESEARCH.md
│           Focus on: Sources, comparisons, recommendations
│
└─ Is it PROJECT DOCUMENTATION?
   └─ YES → Use TEMPLATE.md
            │
            ├─ Feature spec? → Include user stories, acceptance criteria
            ├─ Architecture? → Include diagrams, technical details
            ├─ API docs? → Include endpoint specs, examples
            ├─ Workflow? → Include step-by-step, troubleshooting
            └─ General? → Adapt template as needed
```

---

## 💡 Pro Tips by Scenario

### 📝 Creating a Feature Spec

1. Start with: `cp TEMPLATE.md drafts/feature-[name].md`
2. Focus on: User story, acceptance criteria, technical approach
3. Tell AI: "Review for completeness and add implementation details"

### 🔍 Documenting Research

1. Start with: `cp TEMPLATE-RESEARCH.md drafts/research-[topic].md`
2. Focus on: Sources, comparisons, your analysis
3. Tell AI: "Extract decisions and create implementation guide"

### 🏗️ Architecture Decision

1. Start with: `cp TEMPLATE.md drafts/adr-[name].md`
2. Focus on: Context, decision, consequences, alternatives
3. Tell AI: "Convert to ADR format and add to architecture docs"

### 📚 Creating a Runbook

1. Start with: `cp TEMPLATE.md drafts/runbook-[name].md`
2. Focus on: Prerequisites, steps, troubleshooting
3. Tell AI: "Format as runbook and add to runbooks directory"

---

## 📊 Quality Checklist

### Before Requesting Review

**For All Docs**:

- [ ] Title is clear and descriptive
- [ ] Author and date filled in
- [ ] Purpose/objective is stated
- [ ] Main content sections complete
- [ ] Relevant examples included
- [ ] Links to related docs added

**For Research Docs**:

- [ ] All sources have URLs
- [ ] Sources have quality ratings
- [ ] Code examples included where relevant
- [ ] Your analysis/thoughts added
- [ ] Executive summary completed
- [ ] Clear recommendation made
- [ ] Next steps identified

**For Feature Docs**:

- [ ] User story defined
- [ ] Acceptance criteria listed
- [ ] Technical approach outlined
- [ ] Dependencies identified
- [ ] Testing strategy included

---

## 🚀 Common Workflows

### Quick Enhancement

```
You: Create draft (15 min)
AI:  Review & enhance (2 min)
You: Approve (5 min)
AI:  Integrate (1 min)
────────────────────────
Total: ~23 minutes
```

### Deep Research

```
You: Research & document (90 min)
AI:  Review & extract (5 min)
You: Review AI's work (10 min)
AI:  Create artifacts (3 min)
────────────────────────────
Total: ~108 minutes
```

### Iterative Refinement

```
You: Initial draft (20 min)
AI:  First review (2 min)
You: Feedback (5 min)
AI:  Second review (2 min)
You: Approve (3 min)
AI:  Integrate (1 min)
──────────────────────
Total: ~33 minutes
```

---

## 🎯 What AI Does During Review

### Analysis Phase

- ✅ Check clarity and completeness
- ✅ Verify technical accuracy
- ✅ Ensure consistent formatting
- ✅ Validate code examples
- ✅ Check for missing sections

### Enhancement Phase

- ✅ Improve structure and organization
- ✅ Add missing context
- ✅ Enhance code examples
- ✅ Add cross-references
- ✅ Improve readability

### Integration Phase

- ✅ Extract action items
- ✅ Create ADRs if needed
- ✅ Generate implementation code
- ✅ Update related docs
- ✅ Place in correct location
- ✅ Commit with proper message

---

## 📍 Where Docs End Up

### Integration Destinations

| Doc Type              | Final Location                      | Example                     |
| --------------------- | ----------------------------------- | --------------------------- |
| Architecture Decision | `docs/knowledge-base/architecture/` | `ADR-005-websocket-auth.md` |
| Feature Spec          | `docs/knowledge-base/features/`     | `agent-execution-flow.md`   |
| Workflow Guide        | `docs/knowledge-base/workflows/`    | `deploying-agents.md`       |
| API Documentation     | `docs/technical/api/`               | `agent-endpoints.md`        |
| Runbook               | `docs/runbooks/`                    | `rollback-deployment.md`    |
| Research Output       | Multiple locations                  | ADRs, guides, code examples |

---

## 🔍 Finding Existing Docs

### Search Commands

```bash
# Find docs by keyword
grep -r "websocket" docs/knowledge-base/

# Find recent docs
find docs/knowledge-base/ -name "*.md" -mtime -7

# Find docs by type
ls docs/knowledge-base/architecture/
ls docs/knowledge-base/features/
ls docs/runbooks/
```

### Or Just Ask AI

```
"Where is the documentation for agent execution?"
"Show me all architecture decisions about authentication"
"What docs exist for deployment?"
```

---

## ❓ Common Questions

### Q: Which template should I use?

**A**:

- Documenting internet research? → `TEMPLATE-RESEARCH.md`
- Everything else? → `TEMPLATE.md`

### Q: Do I need to fill every section?

**A**: No! Skip sections that don't apply. AI will adapt.

### Q: Can I create my own template?

**A**: Yes! Just tell AI what structure you need.

### Q: What if I just have rough notes?

**A**: Perfect! That's what drafts are for. AI will polish.

### Q: How detailed should my research be?

**A**: Include everything interesting. AI will prioritize.

### Q: Can I request specific AI actions?

**A**: Yes! Use the "AI Review Checklist" section in templates.

### Q: What happens to old versions?

**A**: Moved to `_archive/` with timestamp.

---

## 🎓 Learning Path

### Day 1: Getting Started

1. Read `QUICK-START.md`
2. Copy `TEMPLATE.md` and create a test doc
3. Request AI review
4. Understand the workflow

### Day 2: First Real Doc

1. Create documentation for something you're working on
2. Use appropriate template
3. Request review with specific instructions
4. Learn from AI enhancements

### Day 3: Research Session

1. Copy `TEMPLATE-RESEARCH.md`
2. Research a topic for the project
3. Capture as you go (don't wait!)
4. See how AI transforms it

### Day 7: Mastery

- You're creating docs naturally
- Templates are second nature
- AI reviews save you time
- Documentation is always up to date

---

## 🔗 External Resources

### Markdown Guides

- [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/)
- [GitHub Markdown](https://guides.github.com/features/mastering-markdown/)

### Documentation Best Practices

- [Write the Docs](https://www.writethedocs.org/)
- [Google Developer Docs Style Guide](https://developers.google.com/style)

---

## 📞 Need Help?

### In Chat

- "How do I document X?"
- "Which template for Y?"
- "Show me an example of Z"
- "What's wrong with my doc?"

### Quick Answers

All questions answered by AI in real-time!

---

## 🎉 You're Ready!

Pick a template and start creating. The system will guide you through the rest.

**Remember**:

- Don't overthink it
- Draft → Review → Integrate
- AI is here to help polish
- Documentation gets better with practice

---

**Happy Documenting!** 📝

---

_This index is your map to the working docs system_  
_Bookmark it, reference it, use it!_

---

Last Updated: 2025-10-11  
Maintained by: galaxy-co-ai + AI Assistant
