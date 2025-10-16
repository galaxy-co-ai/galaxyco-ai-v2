---
title: Documentation Quality and Organization Rules
category: rules
status: active
last_updated: 2025-01-12
author: AI Assistant
related: [QUICK_REFERENCE.md, docs/README.md, QUALITY_AUDIT_CHECKLIST.md]
---

# 📋 Documentation Quality & Organization Rules

These rules ensure consistent, high-quality documentation organization for the GalaxyCo.ai v2.0 project.

## 🎯 Core Principles

### 1. Maintain Perfect Structure

- **Project root** must stay clean with only essential files
- **Master hub** (`docs/README.md`) is the single source of navigation truth
- **Categories** must follow established structure
- **Quality** over quantity - organize, don't just create

### 2. Follow Established Standards

- Use **consistent naming** (kebab-case)
- Include **proper frontmatter** in all docs
- **Link related documents** bidirectionally
- **Archive** instead of delete

### 3. User-First Navigation

- **Multiple access paths** (role, task, category, search)
- **Clear categories** with obvious purposes
- **Quick reference** always available
- **Context preservation** across sessions

---

## 🛡️ AI Assistant Rules

### Before Any Documentation Work:

#### ✅ Always Check First

```bash
# Required checks before creating/modifying docs:
1. Review docs/README.md for current structure
2. Check QUICK_REFERENCE.md for existing paths
3. Verify category placement is correct
4. Ensure no duplication with existing content
```

#### ✅ Navigation References

- **Default starting point**: `docs/README.md` for all navigation questions
- **Quick lookups**: `QUICK_REFERENCE.md` for commands and paths
- **Role-based guidance**: Use established role paths (Developer, PM, DevOps, Designer)
- **Task-based shortcuts**: Use established task paths (Setup, Build, Fix, Deploy)

### When Creating Documentation:

#### ✅ File Placement Rules

```
docs/
├── guides/           # Step-by-step how-to instructions
├── technical/        # Deep technical documentation & architecture
├── runbooks/         # Operational procedures & workflows
├── business/         # Strategy, planning, & business context
├── status/          # Current state, progress, & updates
├── reference/       # Quick lookups & comprehensive lists
├── incidents/       # Incident reports & analysis
├── security/        # Security documentation
└── archive/         # Historical documents (YYYY-MM/)
```

#### ✅ Required Standards

1. **File naming**: `kebab-case.md` (e.g., `creating-custom-agents.md`)
2. **Frontmatter**: Always include full metadata block
3. **Categories**: Must fit into established category structure
4. **Links**: Include back-navigation to category and master hub
5. **Quality**: Test all links and verify navigation paths

#### ✅ Frontmatter Template

```markdown
---
title: Clear Descriptive Title
category: guides|technical|runbooks|business|status|reference|incidents|security
status: draft|active|archived
last_updated: YYYY-MM-DD
author: Author Name
related: [other-doc.md, related-doc.md]
---
```

### When Updating Documentation:

#### ✅ Update Process

1. **Modify content** following established standards
2. **Update frontmatter** with new date and changes
3. **Update related docs** if links or structure changed
4. **Update category README** if new document added
5. **Test navigation** to ensure paths still work

#### ✅ Archive Process

1. **Move old docs** to `docs/archive/YYYY-MM/`
2. **Preserve structure** in archive folders
3. **Update links** to point to new locations if needed
4. **Clean up** broken links and references

---

## 🎯 User Interaction Rules

### When User Asks for Documentation:

#### ✅ Navigation Guidance

1. **Start with role**: "Are you a Developer, Product Manager, DevOps, or Designer?"
2. **Then task**: "Are you trying to Setup, Build features, Fix bugs, or Deploy?"
3. **Direct to category**: Guide to appropriate docs/ category
4. **Provide context**: Include related docs and next steps

#### ✅ Quick Responses

- **Setup questions** → `docs/guides/development-setup.md`
- **Architecture questions** → `docs/technical/architecture/README.md`
- **Current status** → `docs/status/README.md`
- **Quick commands** → `QUICK_REFERENCE.md`
- **Troubleshooting** → `docs/guides/troubleshooting.md`

### When User Requests New Documentation:

#### ✅ Before Creating

1. **Check existing**: Search for similar content first
2. **Choose category**: Determine best fit in established structure
3. **Plan placement**: Verify category README exists
4. **Consider audience**: Who will use this and how?

#### ✅ During Creation

1. **Follow template**: Use established frontmatter and format
2. **Link properly**: Include back-navigation and related docs
3. **Test navigation**: Verify all links work
4. **Update indexes**: Add to category README and master hub if major

#### ✅ After Creation

1. **Update category README**: Add new doc to appropriate section
2. **Update master hub**: If new category or major addition
3. **Test user paths**: Verify users can find the new content
4. **Create handoff**: Document what was created and why

---

## 📊 Quality Control Checkpoints

### Daily Maintenance:

- [ ] Keep `docs/status/README.md` current with project progress
- [ ] Create session handoffs in `docs/status/handoffs/`
- [ ] Archive completed work appropriately
- [ ] Update live issues and status as resolved

### Weekly Review:

- [ ] Review and consolidate any duplicate content
- [ ] Update category READMEs with new content
- [ ] Check for broken links or outdated information
- [ ] Archive old sprint reports or completed phases

### Monthly Quality Audit:

- [ ] Full navigation test (all major paths)
- [ ] Content freshness review (update outdated docs)
- [ ] Structure optimization (reorganize if needed)
- [ ] Archive cleanup (organize by date)

---

## 🚫 What Never to Do

### ❌ Never Break the Structure

- Don't scatter files at project root
- Don't create new categories without proper planning
- Don't bypass the established navigation paths
- Don't leave broken links or references

### ❌ Never Ignore Standards

- Don't skip frontmatter in documentation
- Don't use inconsistent naming conventions
- Don't create content without proper categorization
- Don't forget to link related documents

### ❌ Never Delete History

- Don't delete old documentation (archive instead)
- Don't remove context from completed work
- Don't break existing links without redirecting
- Don't lose track of decisions and rationale

---

## 🎯 Success Indicators

### ✅ Good Documentation Health

- Can find any document in <30 seconds
- All links work and lead to current content
- Navigation paths are clear and consistent
- Users can onboard quickly using the structure

### ✅ Good Organization Health

- Project root stays clean (only essential files)
- Categories have clear, distinct purposes
- Archive is organized and accessible
- Documentation grows without becoming unwieldy

### ✅ Good Maintenance Health

- Status docs stay current
- Handoffs preserve context between sessions
- Quality audits happen regularly
- Structure adapts to project needs without breaking

---

## 🔧 Enforcement Mechanisms

### For AI Assistant:

- **Always check** `docs/README.md` before answering navigation questions
- **Always verify** file placement before creating documentation
- **Always update** related documents when making changes
- **Always test** navigation paths after modifications

### For User:

- **Use templates** provided in documentation guidelines
- **Follow conventions** for naming and structure
- **Update indexes** when adding significant content
- **Archive responsibly** instead of deleting

### For Quality:

- **Regular audits** using established checklists
- **Navigation testing** for all major user paths
- **Content reviews** for freshness and accuracy
- **Structure optimization** when growth requires it

---

## 📚 Quick Reference for Rules

### Documentation Creation Checklist:

1. ✅ Check existing structure
2. ✅ Choose correct category
3. ✅ Use proper naming (kebab-case)
4. ✅ Include complete frontmatter
5. ✅ Link related documents
6. ✅ Update category README
7. ✅ Test navigation paths

### Navigation Response Template:

1. 🎯 Identify user role and task
2. 📍 Direct to appropriate category
3. 🔗 Provide specific document links
4. 📖 Include related resources
5. 🚀 Suggest next steps

### Quality Maintenance Routine:

1. 📅 Daily: Update status and handoffs
2. 📅 Weekly: Review and consolidate
3. 📅 Monthly: Full quality audit
4. 📅 Quarterly: Structure optimization

---

## 📞 When in Doubt

### Questions to Ask:

- "Does this follow our established category structure?"
- "Will users be able to find this easily?"
- "Are all navigation paths still working?"
- "Does this maintain our quality standards?"

### Default Actions:

- **Check the master hub**: `docs/README.md`
- **Use the quick reference**: `QUICK_REFERENCE.md`
- **Follow established patterns**: Don't invent new conventions
- **Test before committing**: Verify all links and paths work

---

_These rules ensure our documentation stays organized, accessible, and valuable for both human users and AI assistants._

**Last Updated**: January 12, 2025  
**Status**: Active and Enforced  
**Review Schedule**: Monthly

---

[← Back to Documentation Hub](docs/README.md) | [Quick Reference](QUICK_REFERENCE.md)
