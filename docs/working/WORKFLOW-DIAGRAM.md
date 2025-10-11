# Documentation Workflow Diagram

## 📋 The Full Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOCUMENTATION LIFECYCLE                      │
└─────────────────────────────────────────────────────────────────┘

    You Write                AI Reviews              You Decide          Integrate
       ▼                         ▼                       ▼                  ▼
  ┌─────────┐              ┌─────────┐            ┌─────────┐         ┌─────────┐
  │ drafts/ │──────────────▶│reviewed/│───────────▶│ final/  │────────▶│Main Docs│
  └─────────┘              └─────────┘            └─────────┘         └─────────┘
       │                         │                       │                  │
       │                         ▼                       │                  │
       │                   ┌─────────┐                  │                  │
       │                   │Needs    │                  │                  │
       └───────────────────│Revision?│◀─────────────────┘                  │
                           └─────────┘                                     │
                                 │                                         │
                                 ▼                                         ▼
                           ┌─────────┐                            ┌────────────────┐
                           │_archive/│                            │knowledge-base/ │
                           └─────────┘                            │runbooks/       │
                                                                  │technical/      │
                                                                  │etc.            │
                                                                  └────────────────┘
```

---

## 🎯 States & Actions

### State 1: DRAFT

**Location**: `docs/working/drafts/`  
**Owner**: You  
**Status**: Initial creation, unreviewed

**Actions**:

- Write content in your editor
- Use TEMPLATE.md as starting point
- Don't worry about perfection
- Save when ready for review

**Next Step**: Request AI review

---

### State 2: IN REVIEW

**Location**: Being analyzed by AI  
**Owner**: AI  
**Status**: Being enhanced and improved

**AI Actions**:

- Check clarity and completeness
- Add missing sections
- Improve formatting
- Add code examples
- Enhance structure
- Fix typos/grammar

**Next Step**: Move to `reviewed/`

---

### State 3: REVIEWED

**Location**: `docs/working/reviewed/`  
**Owner**: You (to approve)  
**Status**: Enhanced and ready for your approval

**Your Options**:

- ✅ **Approve** → Move to `final/`
- 🔄 **Revise** → Back to drafts with feedback
- ❌ **Reject** → Archive or delete

**Next Step**: Your decision

---

### State 4: FINAL

**Location**: `docs/working/final/`  
**Owner**: AI (to integrate)  
**Status**: Approved, ready for integration

**AI Actions**:

- Determine appropriate location in main docs
- Move file to correct directory
- Update documentation indexes
- Create git commit
- Archive old version if replacing

**Next Step**: Integration complete

---

### State 5: ARCHIVED

**Location**: `docs/working/_archive/`  
**Owner**: System  
**Status**: Historical reference only

**Contains**:

- Superseded versions
- Rejected drafts
- Outdated documents

---

## 🔄 Common Workflows

### Quick Enhancement

```
You: drafts/quick-note.md (rough notes)
      ↓
AI:  reviewed/quick-note.md (polished)
      ↓
You: "Approve"
      ↓
AI:  knowledge-base/quick-note.md (integrated)
```

### Iterative Refinement

```
You: drafts/complex-spec.md (initial)
      ↓
AI:  reviewed/complex-spec.md (v1 enhanced)
      ↓
You: "Needs more examples in section 3"
      ↓
AI:  reviewed/complex-spec.md (v2 with examples)
      ↓
You: "Approve"
      ↓
AI:  final/complex-spec.md → integrated
```

### Collaborative Development

```
You: drafts/feature-x.md (outline + questions)
      ↓
AI:  reviewed/feature-x.md (filled in answers)
      ↓
You: "Add implementation section"
      ↓
AI:  reviewed/feature-x.md (with implementation)
      ↓
You: drafts/feature-x.md (add specific details)
      ↓
AI:  reviewed/feature-x.md (integrated your additions)
      ↓
You: "Perfect, finalize"
      ↓
AI:  Integrated into main docs
```

---

## 📊 Document Lifecycle Stats

| Stage     | Typical Duration | Your Role  | AI Role     |
| --------- | ---------------- | ---------- | ----------- |
| Draft     | 15-60 min        | Write      | Wait        |
| Review    | 2-5 min          | Wait       | Enhance     |
| Reviewed  | 5-15 min         | Decide     | Wait        |
| Final     | 1-2 min          | Wait       | Integrate   |
| **Total** | **~30-90 min**   | **Active** | **Support** |

---

## 💡 Tips for Each Stage

### In Drafts:

- ✅ Focus on content, not formatting
- ✅ Include examples, even rough ones
- ✅ Ask questions in notes section
- ✅ Link to related resources
- ❌ Don't perfectionism-paralysis yourself

### In Review:

- ✅ Trust the AI to enhance
- ✅ Provide specific feedback
- ✅ Iterate if needed
- ❌ Don't accept if not satisfied

### In Final:

- ✅ AI handles integration
- ✅ Check git commits
- ✅ Verify proper location
- ❌ Don't manually move files

---

## 🎯 Success Metrics

**Good Documentation Workflow**:

- ⏱️ Draft → Integrated < 2 hours
- 🔄 Revisions needed: 0-1
- ✅ Clarity: High (future you understands)
- 🔗 Links: Connected to related docs
- 📝 Examples: Present and working

---

## 🚨 Red Flags

Watch out for:

- ⚠️ Docs stuck in drafts > 1 week (finish or archive)
- ⚠️ Multiple revisions (unclear requirements?)
- ⚠️ No examples (too abstract)
- ⚠️ No links (exists in isolation)
- ⚠️ No "why" (just "what" and "how")

---

**Quick Reference**: See `QUICK-START.md` for condensed version

---

_Visual representation of the working docs system_
