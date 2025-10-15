# 📚 Documentation Reorganization Proposal

**Created**: 2025-10-15  
**Status**: PROPOSED - Awaiting User Approval  
**Problem**: 177 markdown files across 45 directories with overlapping categories and unclear organization

---

## 🔴 Current Problems

### 1. **Duplicate/Overlapping Directories**
- `archive/`, `archived/`, `archive/legacy/` - 3 different archive locations
- `sessions/`, `session-recaps/`, `working/` - Session docs scattered
- `phases/`, `planning/`, `strategic-plan/` - Planning docs mixed
- `status/`, `working/final/`, `working/reviewed/` - Status unclear

### 2. **No Clear Document Lifecycle**
- No clear path from draft → review → final → archive
- Multiple "handoff" files with no single source of truth (22 found!)
- Unclear which docs are current vs historical

### 3. **Difficulty Finding Information**
- 177 files with no index or navigation
- Similar content in multiple places
- No clear naming conventions

---

## ✅ Proposed New Structure

```
docs/
├── 📋 INDEX.md                          # Master index of all documentation
├── 🎯 CURRENT_SESSION.md                # Always read/update this (symlink from status/)
│
├── 01-getting-started/                  # Quick start guides
│   ├── README.md                        # Overview
│   ├── local-development.md
│   ├── environment-setup.md
│   └── first-time-setup.md
│
├── 02-architecture/                     # System design
│   ├── README.md
│   ├── tech-stack.md
│   ├── database-schema.md
│   ├── api-design.md
│   └── multi-tenancy.md
│
├── 03-features/                         # Feature documentation
│   ├── authentication.md
│   ├── onboarding.md
│   ├── dashboard.md
│   ├── agents/
│   └── workflows/
│
├── 04-development/                      # Developer guides
│   ├── coding-standards.md
│   ├── git-workflow.md
│   ├── testing.md
│   └── deployment.md
│
├── 05-operations/                       # Running the system
│   ├── runbooks/
│   ├── monitoring.md
│   └── troubleshooting.md
│
├── 06-business/                         # Business docs
│   ├── roadmap.md
│   ├── pricing.md
│   └── go-to-market.md
│
├── 07-decisions/                        # ADRs (Architecture Decision Records)
│   ├── 2025-10-15-recharts-for-dashboard.md
│   ├── 2025-10-12-clerk-authentication.md
│   └── template.md
│
├── 08-status/                           # Current state (THIS IS THE IMPORTANT ONE)
│   ├── CURRENT_SESSION.md              # ⭐ ALWAYS CURRENT
│   ├── PROJECT_STATUS.md               # High-level progress
│   ├── KNOWN_ISSUES.md                 # Active bugs/blockers
│   └── sessions/                       # Session history
│       ├── 2025-10-15.md
│       ├── 2025-10-14.md
│       └── ...
│
├── 09-archive/                          # Historical docs
│   ├── 2025-10/
│   ├── 2025-09/
│   └── deprecated/
│
└── 10-reference/                        # Quick reference
    ├── commands.md
    ├── credentials.md                   # Link to SECRETS_CHECKLIST_FILLED.md
    └── keyboard-shortcuts.md
```

---

## 🎯 Key Principles

### 1. **Single Source of Truth**
- `docs/08-status/CURRENT_SESSION.md` - **Always current**, updated every session
- `docs/INDEX.md` - Master navigation to all docs
- No duplicate "handoff" files

### 2. **Clear Numbering**
- Directories prefixed with numbers for logical ordering
- Forces alphabetical sort = logical flow

### 3. **Document Lifecycle**
```
Draft → Review → Active → Archive
└─────┴────────┴────────┴─────────
    working/  current/  archive/
```

### 4. **Naming Convention**
```
# Good
2025-10-15-feature-name.md
authentication-setup.md
adr-001-database-choice.md

# Bad
STUFF.md
notes.md
temp_doc_v2_final_FINAL.md
```

### 5. **README.md in Every Directory**
Every directory has a README.md explaining:
- What belongs here
- How to use the docs
- Links to related docs

---

## 🔧 Migration Plan

### Phase 1: Create New Structure (30 min)
1. Create new numbered directories
2. Create INDEX.md master index
3. Create README.md in each directory
4. Move `docs/status/CURRENT_SESSION.md` to root as canonical file

### Phase 2: Consolidate Session Docs (45 min)
1. Archive all old SESSION_HANDOFF* files to `09-archive/sessions/`
2. Keep only `CURRENT_SESSION.md` as active
3. Date-stamp archived sessions: `SESSION_2025-10-15.md`

### Phase 3: Organize by Category (60 min)
1. Move architecture docs → `02-architecture/`
2. Move feature docs → `03-features/`
3. Move planning → `06-business/`
4. Delete obvious duplicates

### Phase 4: Clean Archive (30 min)
1. Consolidate `archive/`, `archived/`, `legacy/` → `09-archive/`
2. Organize by year-month: `09-archive/2025-10/`
3. Delete any "temp" or "draft" files over 30 days old

### Phase 5: Create Navigation (20 min)
1. Build INDEX.md with links to all active docs
2. Add breadcrumbs to top of each doc
3. Add "Last Updated" timestamps

---

## 📝 Warp Rules to Add

```markdown
# Session Management Protocol

**At START of every session:**
1. ALWAYS read `docs/status/CURRENT_SESSION.md` first
2. Verify "Last Updated" date is recent
3. Confirm it has latest project state
4. If file doesn't exist or is outdated, ASK USER before proceeding

**During session:**
1. Track what you're building in memory
2. Note any decisions made
3. Keep list of files modified

**At END of every session:**
1. Update `docs/status/CURRENT_SESSION.md` with:
   - What was built
   - Current project state
   - Next recommended steps
   - Files modified
   - Known issues
2. Archive previous session to `docs/status/sessions/YYYY-MM-DD.md`
3. Commit with message: `docs: update session status YYYY-MM-DD`
4. Push to git

**NEVER:**
- Create new "handoff" files with different names
- Update old/archived session files
- Skip reading CURRENT_SESSION.md at start
```

---

## 🎬 Implementation

### Option 1: Do It Now (AI Agent)
- I can reorganize everything automatically
- Takes ~3 hours of careful file moving
- Risk: Might misplace some docs

### Option 2: Gradual Migration (Recommended)
- You approve structure above
- I create new structure TODAY
- We migrate docs over next 2-3 sessions
- Lower risk, more control

### Option 3: You Direct
- You tell me what to keep/delete
- I execute your decisions
- Most control, slowest

---

## ✅ Success Criteria

After reorganization, you should be able to:
1. ✅ Find any document in < 10 seconds
2. ✅ Know if a doc is current or archived
3. ✅ Start a new session by reading ONE file
4. ✅ Navigate docs without AI assistance
5. ✅ Onboard new team members with INDEX.md

---

## 🚀 Recommendation

**I recommend Option 2 (Gradual Migration):**

1. **TODAY** (20 min):
   - Create new directory structure
   - Move CURRENT_SESSION.md to canonical location
   - Create INDEX.md
   - Archive obvious duplicates

2. **Next Session** (30 min):
   - Migrate 20-30 most important docs
   - Update INDEX.md
   - Delete confirmed duplicates

3. **Future Sessions** (ongoing):
   - Move docs as we touch them
   - Eventually archive old structure

**Shall I proceed with TODAY's tasks?**

---

**Questions for You:**

1. Do you approve this structure?
2. Any changes you want?
3. Should I proceed with Option 2 (gradual migration) starting today?
4. Any specific docs you KNOW are important and should be prioritized?

