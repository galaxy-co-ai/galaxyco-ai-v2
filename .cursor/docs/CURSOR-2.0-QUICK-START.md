# 🚀 Cursor 2.0 Quick Start Guide

**For GalaxyCo.ai Development Team**

---

## ✅ Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Cursor 2.0 installed (released Oct 29, 2025)
- [ ] GitHub Personal Access Token (for GitHub MCP)
- [ ] Brave Search API Key (for Brave Search MCP)
- [ ] Database URL configured in environment variables

---

## 🎯 Key Features You'll Use Daily

### 1. Agent Interface (Your AI Teammate)

**What it does:** Acts as your AI pair programmer for complex tasks

**When to use:**

- Multi-file refactoring
- Creating new features from scratch
- Debugging complex issues
- Writing tests

**How to use:**

1. Open Agent panel (Cmd+L or Ctrl+L)
2. Describe your task in natural language
3. Review Agent's plan
4. Approve execution or provide feedback

**Example tasks:**

```
"Create a new SaveMessage feature with server action,
database migration, and React component with loading states"

"Refactor all authentication code to use the new Clerk SDK"

"Find and fix all instances where we're not filtering by orgId"
```

---

### 2. Tab Autocomplete (Predict Your Next Move)

**What it does:** Predicts and completes your code as you type

**When to use:**

- Writing boilerplate code
- Following established patterns
- Implementing repetitive logic
- Creating component structures

**How to use:**

1. Start typing
2. Wait for gray suggestion (< 100ms)
3. Press Tab to accept
4. Continue coding

**Tips:**

- Trust Tab for common patterns
- Press Esc to dismiss unwanted suggestions
- Tab learns from your codebase over time

---

### 3. Inline Edit (Quick Natural Language Edits)

**What it does:** Edit code using natural language commands

**When to use:**

- Quick refactoring
- Renaming across scope
- Adding error handling
- Updating function signatures

**How to use:**

1. Select code you want to edit
2. Press Cmd+K (Mac) or Ctrl+K (Windows)
3. Type natural language instruction
4. Review and accept changes

**Example commands:**

```
"Add try-catch error handling"
"Rename this to fetchUserData"
"Add TypeScript types to all parameters"
"Extract this into a separate function"
```

---

### 4. Bugbot (Automatic Issue Detection)

**What it does:** Finds and suggests fixes for code issues

**When to use:**

- After writing new code
- Before committing
- When you see unexpected behavior
- During code review

**How to use:**

1. Bugbot runs automatically (yellow lightbulb icon)
2. Click lightbulb to see issues
3. Review suggested fix
4. Accept or modify fix

**What Bugbot catches:**

- TypeScript errors
- Linting issues
- Common bugs (null checks, async/await)
- Performance issues

---

## 🔧 MCP Servers (Superpowers)

### Kibo UI MCP ✅ ACTIVE

**What:** Access to 1,101 component patterns
**Use:** Find and implement complex UI components

**Example:**

```
Agent: "Show me all button variants from Kibo UI"
Agent: "Create a data table with sorting using Kibo UI"
```

### Filesystem MCP ✅ ACTIVE

**What:** Enhanced file operations
**Use:** Better file reading, writing, searching

### Memory MCP ✅ ACTIVE

**What:** Persistent knowledge across sessions
**Use:** Remember patterns, decisions, gotchas

### GitHub MCP 🟡 PENDING

**What:** Direct GitHub access
**Use:** Create issues, review PRs, search code

### PostgreSQL MCP 🟡 PENDING

**What:** Direct database queries
**Use:** Query data, inspect schema, debug

### Brave Search MCP 🟡 PENDING

**What:** Web research capabilities
**Use:** Find docs, examples, latest info

---

## 📋 Daily Workflow

### Morning Routine

1. **Check Agent Status:**
   - Ensure Cursor 2.0 is running
   - Verify MCP servers are connected

2. **Review Context:**
   - Open `.cursor/context.md`
   - Check `.cursor/current-sprint.md`
   - Review your task list

3. **Start Coding:**
   - Use Agent for complex tasks
   - Use Tab for repetitive code
   - Use Inline Edit for quick changes

### During Development

1. **Let Tab Help:**
   - Trust autocomplete for patterns
   - Accept suggestions when appropriate
   - Provide feedback (Esc for bad suggestions)

2. **Delegate to Agent:**
   - Multi-file tasks
   - Complex refactoring
   - Test creation

3. **Quick Edits with Cmd+K:**
   - Small changes
   - Refactoring
   - Type additions

### Before Committing

1. **Run Bugbot:**
   - Check for issues
   - Fix any warnings
   - Review suggestions

2. **Quality Checks:**

   ```bash
   pnpm quality
   ```

3. **Test Your Changes:**
   ```bash
   pnpm test
   ```

---

## 💡 Pro Tips

### For Agent Tasks

✅ **DO:**

- Provide clear, specific instructions
- Give context about the codebase
- Review Agent's plan before executing
- Ask Agent to explain complex changes

❌ **DON'T:**

- Give vague instructions
- Skip reviewing Agent's changes
- Trust Agent blindly for critical code
- Use Agent for simple one-line changes

### For Tab Autocomplete

✅ **DO:**

- Press Tab confidently for common patterns
- Let Tab complete boilerplate
- Use Tab for import statements
- Accept Tab for component structures

❌ **DON'T:**

- Accept every suggestion without reading
- Use Tab for complex business logic
- Rely on Tab for critical algorithms

### For Inline Edit (Cmd+K)

✅ **DO:**

- Use for quick refactoring
- Use for renaming in scope
- Use for adding error handling
- Use for type additions

❌ **DON'T:**

- Use for large refactoring (use Agent)
- Skip reviewing the changes
- Use for complex logic changes

---

## 🎯 Common Tasks & How to Do Them

### Creating a New Feature

**Method:** Use Agent

```
Agent: "Create a new SaveMessage feature:
1. Create server action in app/actions/save-message.ts
2. Add database schema in packages/database/schema/messages.ts
3. Create React component in components/messages/SaveMessage.tsx
4. Add loading states and error handling
5. Follow GalaxyCo patterns (orgId filtering, try-catch, Zod validation)"
```

### Refactoring Code

**Method:** Use Inline Edit (Cmd+K) for small changes, Agent for large changes

**Small refactor:**

1. Select function
2. Press Cmd+K
3. "Extract this into a separate function with TypeScript types"

**Large refactor:**

```
Agent: "Refactor all API routes to use Server Actions instead"
```

### Debugging Issues

**Method:** Use Bugbot + Agent

1. Let Bugbot identify issues
2. Review suggestions
3. If complex, ask Agent: "Help me debug why this async function is failing"

### Adding Tests

**Method:** Use Agent

```
Agent: "Create comprehensive tests for the SaveMessage component:
- Unit tests for the server action
- Component tests for UI interactions
- Integration tests for the full flow
Use Vitest and follow GalaxyCo testing patterns"
```

### Searching Codebase

**Method:** Use Cursor's codebase search

1. Cmd+P (Quick Open)
2. Type `@` to search symbols
3. Type `#` to search by semantic meaning

**Example:**

```
@SaveMessage  # Find SaveMessage symbol
#authentication flow  # Find auth-related code
```

---

## 🔍 Troubleshooting

### Agent Not Responding

**Check:**

1. Cursor 2.0 is installed (Help → About)
2. Internet connection active
3. No firewall blocking Cursor
4. Restart Cursor if needed

### Tab Autocomplete Too Slow

**Solutions:**

1. Check `.cursor/settings.json` - `tab.delay` should be 50ms
2. Ensure codebase indexing is complete (bottom right status)
3. Close other heavy applications
4. Restart Cursor to clear cache

### MCP Server Not Working

**Check:**

1. `.cursor/mcp.json` configuration is correct
2. Environment variables are set (GitHub token, etc.)
3. Internet connection active
4. Try restarting MCP server (restart Cursor)

### Bugbot Missing Issues

**Check:**

1. Bugbot is enabled (`.cursor/settings.json`)
2. File has been saved
3. Wait a few seconds for analysis
4. Check status bar for Bugbot icon

---

## 📚 Resources

### Documentation

- [Cursor 2.0 Features](https://cursor.com/features)
- [Cursor Docs](https://docs.cursor.com)
- [MCP Protocol](https://modelcontextprotocol.io)

### GalaxyCo Resources

- `.cursor/context.md` - Project vision and context
- `.cursor/galaxyco-rules.md` - Development standards
- `.cursor/component-guide.md` - Component patterns
- `.cursorrules` - Quick reference rules

### Getting Help

- **Team:** Ask in #engineering channel
- **Cursor Community:** [forum.cursor.com](https://forum.cursor.com)
- **This Repo:** Check `.cursor/docs/` for guides

---

## ✅ Quick Reference Card

| Task            | Method      | Shortcut        |
| --------------- | ----------- | --------------- |
| Complex task    | Agent       | Cmd+L / Ctrl+L  |
| Quick edit      | Inline Edit | Cmd+K / Ctrl+K  |
| Code completion | Tab         | Tab             |
| Fix issues      | Bugbot      | Click lightbulb |
| Search codebase | Quick Open  | Cmd+P / Ctrl+P  |
| Chat with code  | Chat        | Cmd+J / Ctrl+J  |

---

**Questions?** Check `.cursor/docs/troubleshooting.md` or ask in #engineering

**Ready to code?** Let's build something amazing! 🚀
