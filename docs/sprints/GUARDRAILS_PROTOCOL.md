# 🛡️ GUARDRAILS PROTOCOL: IA Refactor + Data Integration

**Purpose:** Strict rules to keep us focused on the 3-week Master Checklist without distraction  
**Authority:** This document overrides all other suggestions until checklist complete  
**Last Updated:** 2025-10-18

---

## 🚨 IRON RULES (Non-Negotiable)

### Rule #1: Checklist is Law

- **ONLY work on items in `MASTER_CHECKLIST_IA_REFACTOR.md`**
- If it's not checked off, it doesn't exist
- No "while we're here..." additions
- No "quick wins" that aren't on the list

### Rule #2: One Week at a Time

- **NEVER start Week N+1 tasks before Week N is 100% complete**
- Week completion requires ALL quality gates passing
- Progress tracking table must be updated before advancing

### Rule #3: Stop on Scope Creep

- If ANY task emerges that's marked "OUT OF SCOPE", **STOP IMMEDIATELY**
- Document the request in `SCOPE_CREEP_LOG.md`
- Ask user: "This is out of scope. Add to backlog or pause sprint?"
- Do NOT proceed without explicit written approval

### Rule #4: Quality Gates Block Progress

- **Cannot commit code that fails:**
  - `pnpm typecheck` (0 TypeScript errors)
  - `pnpm lint` (0 ESLint errors)
  - `pnpm build` (must succeed)
- If gates fail, fix immediately before ANY new work

### Rule #5: Session Discipline

- **Every session MUST:**
  1. Start: Read `MASTER_CHECKLIST_IA_REFACTOR.md` + `CURRENT_SESSION.md`
  2. Middle: Check off items as completed
  3. End: Update `CURRENT_SESSION.md` with progress
- No exceptions. No "I'll update it later."

---

## ✅ DECISION PROTOCOL

### When a Question Arises:

**Step 1: Check the Checklist**

- Is it already defined? → Follow the plan
- Is it a blocker? → Log and escalate
- Is it nice-to-have? → Defer to backlog

**Step 2: Check Out-of-Scope List**

- Is it explicitly forbidden? → Reject immediately
- Is it ambiguous? → Ask user

**Step 3: Apply "2-Minute Rule"**

- Can it be decided in <2 min? → AI decides and logs in Decision Log
- Will it take >2 min? → Ask user for explicit approval

**Step 4: Document Everything**

- Log decision in `docs/sprints/DECISIONS_LOG.md`
- Format: `| Date | Decision | Why | Impact | Blocker? |`

---

## 🔒 SCOPE ENFORCEMENT

### Allowed Activities:

✅ Items explicitly in Master Checklist  
✅ Bug fixes that block checklist items  
✅ Quality improvements (if they don't add new features)  
✅ Documentation updates for checklist items  
✅ Refactoring to support checklist items

### Forbidden Activities:

❌ New features not in checklist  
❌ "Improvements" to non-checklist pages  
❌ Technology experiments  
❌ Design system additions  
❌ New component creation (unless checklist requires it)  
❌ Performance optimizations (unless blocking)  
❌ Dependency updates (unless security critical)

### Gray Areas (Require User Approval):

🟡 UI tweaks that affect multiple pages  
🟡 Component refactors that touch >5 files  
🟡 Database schema changes  
🟡 New environment variables  
🟡 Third-party service integrations

---

## 📊 PROGRESS TRACKING AUTOMATION

### Daily Checklist Commands:

```bash
# Morning: Review status
cat docs/sprints/MASTER_CHECKLIST_IA_REFACTOR.md | grep "^- \[x\]" | wc -l  # Count completed
cat docs/sprints/CURRENT_SESSION.md | tail -20  # Review yesterday

# Evening: Update status
# 1. Check off completed items in MASTER_CHECKLIST_IA_REFACTOR.md
# 2. Update CURRENT_SESSION.md with:
#    - What was completed today
#    - Blockers encountered
#    - Next session priority
# 3. Commit: "docs: daily progress update YYYY-MM-DD"
```

### Weekly Quality Gate Script:

```bash
#!/bin/bash
# Run before marking week complete

echo "🔍 Running Week Quality Gates..."

# TypeScript
echo "📘 TypeScript check..."
pnpm typecheck || exit 1

# Linting
echo "🧹 Linting..."
pnpm lint || exit 1

# Build
echo "🏗️ Build check..."
pnpm build || exit 1

# Tests
echo "🧪 Running tests..."
pnpm test:run || exit 1

echo "✅ All quality gates PASSED"
echo "🎉 Week can be marked complete!"
```

---

## 🚫 SCOPE CREEP LOG

### How to Use:

When ANY out-of-scope idea emerges, immediately log it here:

| Date       | Idea                          | Why It Came Up    | User Decision | Deferred To |
| ---------- | ----------------------------- | ----------------- | ------------- | ----------- |
| 2025-10-18 | Example: Add dark mode toggle | User mentioned it | Backlog       | Post-launch |
|            |                               |                   |               |             |
|            |                               |                   |               |             |

**Process:**

1. AI logs the idea
2. AI says: "Logged to backlog. Continuing with checklist."
3. User can review backlog at end of week

---

## 📝 DECISION LOG (Live)

| Date       | Decision                        | Why                            | Impact           | Revisit           |
| ---------- | ------------------------------- | ------------------------------ | ---------------- | ----------------- |
| 2025-10-18 | Phased 3-week approach          | Balance speed + quality        | Clear milestones | After Week 1      |
| 2025-10-18 | Defer Transcriptions to Week 4+ | Too much scope for this sprint | Focused delivery | After IA complete |
| 2025-10-18 | Defer Page Agents to Week 4+    | Major feature, not blocking    | Phased rollout   | After IA complete |
|            |                                 |                                |                  |                   |

---

## 🎯 SESSION RITUALS

### Start of Every Session:

```markdown
1. Read MASTER_CHECKLIST_IA_REFACTOR.md (current week section)
2. Read CURRENT_SESSION.md (what happened last time)
3. Verify git status clean
4. Confirm Week N is active (don't jump ahead)
5. State today's goal: "Today I will complete items X.Y through Z.A"
```

### Middle of Session (Every 30-60 min):

```markdown
1. Check off completed items in checklist
2. Run quality gates if making commits
3. Update CURRENT_SESSION.md with progress notes
```

### End of Every Session:

```markdown
1. Check off all completed items
2. Run quality gates one final time
3. Commit any work with proper message
4. Update CURRENT_SESSION.md:
   - What was completed
   - What's next
   - Any blockers
5. Archive session notes if week complete
6. State next session goal
```

---

## 🛠️ AUTOMATED ENFORCEMENT

### Git Pre-Commit Hook:

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
# Enforce quality gates

echo "🛡️ Guardrails: Running quality gates..."

# Check if working on checklist items
if ! git diff --cached --name-only | grep -q "docs/sprints/MASTER_CHECKLIST"; then
  echo "⚠️  Warning: No checklist updates in commit"
  echo "Did you check off completed items?"
fi

# Run quality gates
pnpm typecheck || exit 1
pnpm lint || exit 1

echo "✅ Guardrails: Quality gates passed"
```

### Weekly Progress Script:

```bash
#!/bin/bash
# Run every Friday

echo "📊 Week Progress Report:"
echo ""

# Count completed items this week
COMPLETED=$(git log --since="1 week ago" --all --grep="feat\|fix" --oneline | wc -l)
echo "Commits this week: $COMPLETED"

# Check quality gates
echo ""
echo "Quality Gates Status:"
pnpm typecheck && echo "✅ TypeScript" || echo "❌ TypeScript"
pnpm lint && echo "✅ Lint" || echo "❌ Lint"
pnpm build && echo "✅ Build" || echo "❌ Build"

# Remind to update docs
echo ""
echo "📝 Before marking week complete:"
echo "- [ ] Update MASTER_CHECKLIST_IA_REFACTOR.md"
echo "- [ ] Archive session notes"
echo "- [ ] Update CURRENT_SESSION.md"
```

---

## 🎓 LESSONS LEARNED

### Common Pitfalls to Avoid:

1. **"While we're here..."** → NO. Log to backlog.
2. **"Quick refactor..."** → Only if it's blocking checklist.
3. **"Better way to do X..."** → Defer if not on checklist.
4. **"User might like Y..."** → Great! Add to backlog for later.

### Red Flags That Mean STOP:

- 🚩 "Let's add a new feature..."
- 🚩 "I should upgrade this dependency..."
- 🚩 "What if we changed the architecture..."
- 🚩 "This would be cool to build..."
- 🚩 "Let me experiment with..."

### When These Appear:

1. Stop immediately
2. Log in SCOPE_CREEP_LOG.md
3. Return to checklist
4. Ask user ONLY if blocking

---

## 🏁 COMPLETION CRITERIA

### A Week is Complete When:

- [ ] 100% of week's checklist items checked off
- [ ] All quality gates passing
- [ ] CURRENT_SESSION.md updated
- [ ] Session notes archived
- [ ] Progress table updated
- [ ] Commit + push complete

### The Sprint is Complete When:

- [ ] All 3 weeks marked complete
- [ ] 80+ pages with real API data
- [ ] New IA live and functional
- [ ] Success criteria met (see Master Checklist)
- [ ] Documentation updated
- [ ] Release tagged: `v2.0.0-ia-complete`

---

## 📞 ESCALATION PROTOCOL

### When to Ask User:

1. **Blockers:** Can't proceed with checklist item
2. **Scope Questions:** Unclear if something is in/out of scope
3. **Breaking Changes:** Would affect user-facing functionality
4. **Budget:** Exceeding time estimates significantly

### How to Ask:

```markdown
🚨 BLOCKER / QUESTION

**Context:** [What you were working on]
**Issue:** [What's blocking or unclear]
**Options:**
A) [Option 1 + tradeoffs]
B) [Option 2 + tradeoffs]
**Recommendation:** [Your suggestion]
**Impact if delayed:** [How this affects timeline]

Please choose A/B or provide direction.
```

---

## 💪 ACCOUNTABILITY MEASURES

### AI Commits To:

- ✅ Only work on checklist items
- ✅ Run quality gates before every commit
- ✅ Update docs at end of every session
- ✅ Flag scope creep immediately
- ✅ Ask questions when genuinely blocked
- ✅ No "I'll fix it later" technical debt

### User Commits To:

- ✅ Review progress weekly
- ✅ Decide scope questions within 24 hours
- ✅ Trust AI to execute checklist autonomously
- ✅ Not introduce new requirements mid-sprint
- ✅ Celebrate weekly milestones

---

**This protocol is ACTIVE and ENFORCED starting 2025-10-18.**

Any deviation requires explicit written approval from user and documentation in DECISIONS_LOG.md.

---

**Signed:**  
AI: Warp Drive (Claude 4.5 Sonnet Thinking)  
User: Dalton (@dalton)  
Date: 2025-10-18
