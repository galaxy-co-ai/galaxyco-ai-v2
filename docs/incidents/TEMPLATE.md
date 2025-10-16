# [Short Description of Incident]

**Date**: YYYY-MM-DD  
**Duration**: [How long it took to resolve]  
**Severity**: [🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low]  
**Category**: [🐛 Bug / 🗄️ Database / 🔐 Auth / 🚀 Deployment / ⚡ Performance / 🔧 Configuration / 📦 Dependencies / 🤔 UX]

---

## Summary

[2-3 sentence summary of what went wrong]

---

## Impact

- **User Impact**: [What users experienced]
- **Developer Impact**: [How it blocked development]
- **Business Impact**: [Time lost, features delayed, etc.]

---

## Timeline

| Time  | Event                 |
| ----- | --------------------- |
| HH:MM | Problem first noticed |
| HH:MM | Started investigation |
| HH:MM | Identified root cause |
| HH:MM | Applied fix           |
| HH:MM | Verified resolution   |

---

## Root Cause

### What Happened

[Detailed explanation of what went wrong]

### Why It Happened

[The underlying reason - missing validation, race condition, etc.]

### Where It Happened

- **File(s)**: `path/to/file.ts`
- **Function(s)**: `functionName()`
- **Line(s)**: L123-L145
- **Component**: [Backend/Frontend/Database/etc.]

---

## Error Messages

```
Paste exact error messages here
```

### Key Indicators

- Error code: [if applicable]
- Stack trace highlights: [relevant parts]
- Log patterns: [what to grep for]

---

## Investigation Process

### What We Tried (That Didn't Work)

1. [First attempt and why it failed]
2. [Second attempt and why it failed]
3. [etc.]

### What We Tried (That Worked)

[The solution that actually resolved it]

### Key Insight

[The "aha!" moment that led to the solution]

---

## Solution

### Immediate Fix

```typescript
// Code changes made (if applicable)
```

```bash
# Commands run (if applicable)
```

### Why This Worked

[Explanation of why this fixed the issue]

---

## Prevention

### Short Term (Implemented Today)

- [ ] [Immediate safeguard added]
- [ ] [Script created to detect this]
- [ ] [Documentation updated]

### Medium Term (This Week)

- [ ] [Better error handling to add]
- [ ] [Test to write]
- [ ] [Monitoring to set up]

### Long Term (This Month)

- [ ] [Architecture change needed]
- [ ] [Tool/process improvement]
- [ ] [Training/documentation expansion]

---

## Automation Created

### Diagnostic Script

**Location**: `scripts/diagnose-[issue].sh`  
**Purpose**: Detects this issue before it causes problems

```bash
#!/usr/bin/env bash
# Quick description
# Usage: ./scripts/diagnose-[issue].sh
```

### Cleanup Script

**Location**: `scripts/cleanup-[issue].sh`  
**Purpose**: Automatically fixes this issue if it occurs

```bash
#!/usr/bin/env bash
# Quick description
# Usage: ./scripts/cleanup-[issue].sh
```

### Health Check Addition

Added check to `scripts/health-check.sh`:

- [ ] Detects [condition]
- [ ] Alerts if [problem found]

---

## Related Issues

- Similar to: [Link to related incident]
- Caused by: [Link to upstream issue]
- Led to: [Link to downstream effect]

---

## Learnings

### Technical Lessons

1. [What we learned about the system]
2. [What we learned about the tools]
3. [What we learned about debugging]

### Process Lessons

1. [How we could have caught this earlier]
2. [How we could have debugged faster]
3. [How we can prevent similar issues]

### Questions Raised

- [ ] [Unanswered question to investigate]
- [ ] [Potential improvement to explore]
- [ ] [Tool or process to consider]

---

## Action Items

- [ ] Update documentation: [specific docs to update]
- [ ] Add tests: [specific test scenarios]
- [ ] Create alerts: [what to monitor]
- [ ] Team discussion: [topics to cover]
- [ ] Tool evaluation: [tools to research]

---

## References

- **PR**: [Link to PR with fix]
- **Logs**: [Link to log files or snippets]
- **Screenshots**: [Link to any relevant screenshots]
- **External Resources**: [Stack Overflow, docs, etc.]

---

## Follow-Up

**Review Date**: [When to review if prevention worked]  
**Reviewed**: [ ] Yes / [ ] No  
**Recurred**: [ ] Yes / [ ] No  
**Notes**: [Any notes from follow-up]

---

**Documented by**: [Your name]  
**Reviewed by**: [If applicable]  
**Last Updated**: YYYY-MM-DD
