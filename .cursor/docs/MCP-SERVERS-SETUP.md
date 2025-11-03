# 🔌 MCP Servers Setup Guide

**For GalaxyCo.ai Development Team**

---

## 📋 Overview

Model Context Protocol (MCP) servers extend Cursor's capabilities by connecting to external tools and data sources. This guide covers how to set up and use MCP servers for GalaxyCo.

---

## ✅ Currently Active Servers

### 1. Kibo UI MCP
**Status:** ✅ Active  
**What it does:** Provides access to 1,101 UI component patterns

**Usage:**
```
Agent: "Show me all button variants from Kibo UI"
Agent: "Create a data table with Kibo UI components"
Agent: "Find a dropdown component with search functionality"
```

**Benefits:**
- Access to comprehensive component library
- Consistent UI patterns
- Pre-built complex components

---

### 2. Filesystem MCP
**Status:** ✅ Active  
**What it does:** Enhanced file operations within the workspace

**Usage:**
- Better file searching
- Improved file reading/writing
- Directory operations
- File metadata access

**Benefits:**
- Faster file operations
- More reliable file handling
- Better error reporting

---

### 3. Memory MCP
**Status:** ✅ Active  
**What it does:** Persistent knowledge across Cursor sessions

**Usage:**
```
Agent: "Remember that we use Server Actions instead of API routes"
Agent: "What patterns have we established for error handling?"
Agent: "Recall the orgId filtering requirement"
```

**Benefits:**
- Agent remembers project patterns
- Consistent behavior across sessions
- Learns from your codebase

---

## 🟡 Pending MCP Servers (Ready to Install)

### 4. GitHub MCP Server

**Status:** 🟡 Pending  
**Priority:** HIGH  
**What it does:** Direct GitHub integration for issues, PRs, and code search

**Setup Steps:**

1. **Create GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `read:org`, `workflow`
   - Copy the token

2. **Add to environment variables:**
   ```bash
   # Add to .env.local or system environment
   GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Update .cursor/mcp.json:**
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
         }
       }
     }
   }
   ```

4. **Restart Cursor**

5. **Test the server:**
   ```
   Agent: "List recent issues in the GalaxyCo repository"
   Agent: "Show me open PRs that need review"
   ```

**Benefits:**
- Create/update GitHub issues without leaving IDE
- Review PRs inline
- Search across repositories
- Access code from other repos

---

### 5. PostgreSQL MCP Server

**Status:** 🟡 Pending  
**Priority:** HIGH (especially for Backend Agent)  
**What it does:** Direct database queries and schema inspection

**Setup Steps:**

1. **Verify DATABASE_URL is set:**
   ```bash
   # Should already be in your environment
   echo $DATABASE_URL
   ```

2. **Update .cursor/mcp.json:**
   ```json
   {
     "mcpServers": {
       "postgres": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-postgres",
           "${DATABASE_URL}"
         ]
       }
     }
   }
   ```

3. **Restart Cursor**

4. **Test the server:**
   ```
   Agent: "Show me the schema for the users table"
   Agent: "Query the last 10 messages in the database"
   Agent: "Check if there are any workspaces without proper orgId"
   ```

**Benefits:**
- Query database directly from Cursor
- Inspect schema without external tools
- Debug data issues quickly
- Verify multi-tenant isolation

**Security Note:** ⚠️ Be careful with queries. Always review before executing.

---

### 6. Brave Search MCP Server

**Status:** 🟡 Pending  
**Priority:** MEDIUM  
**What it does:** Web research capabilities for finding docs and examples

**Setup Steps:**

1. **Get Brave Search API Key:**
   - Go to https://brave.com/search/api/
   - Sign up for API access (has free tier)
   - Copy your API key

2. **Add to environment variables:**
   ```bash
   # Add to .env.local or system environment
   BRAVE_API_KEY=your_api_key_here
   ```

3. **Update .cursor/mcp.json:**
   ```json
   {
     "mcpServers": {
       "brave-search": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-brave-search"],
         "env": {
           "BRAVE_API_KEY": "${BRAVE_API_KEY}"
         }
       }
     }
   }
   ```

4. **Restart Cursor**

5. **Test the server:**
   ```
   Agent: "Search for Next.js 15 Server Actions best practices"
   Agent: "Find examples of Drizzle ORM migrations"
   Agent: "Look up the latest Clerk authentication patterns"
   ```

**Benefits:**
- Research without leaving IDE
- Find documentation and examples
- Stay updated on latest practices
- Competitive analysis

---

### 7. Sequential Thinking MCP Server

**Status:** 🟡 Pending  
**Priority:** MEDIUM  
**What it does:** Enhanced reasoning for complex problems

**Setup Steps:**

1. **Update .cursor/mcp.json:**
   ```json
   {
     "mcpServers": {
       "sequential-thinking": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
       }
     }
   }
   ```

2. **Restart Cursor**

3. **Test the server:**
   ```
   Agent: "Use sequential thinking to design the SaveMessage feature architecture"
   Agent: "Break down the visual flow builder implementation step by step"
   ```

**Benefits:**
- Better problem-solving for complex features
- More thorough architectural analysis
- Step-by-step reasoning visible
- Improved code quality

**Note:** No API keys required - works out of the box!

---

## 🚀 Quick Installation Guide

**To add ALL pending MCP servers at once:**

1. **Set up environment variables:**
   ```bash
   # Add to .env.local
   GITHUB_TOKEN=ghp_your_github_token
   BRAVE_API_KEY=your_brave_api_key
   # DATABASE_URL should already exist
   ```

2. **Replace .cursor/mcp.json with:**
   ```bash
   # Backup current config
   cp .cursor/mcp.json .cursor/mcp.json.backup
   
   # Copy enhanced config
   cp .cursor/mcp.json.enhanced .cursor/mcp.json
   
   # Remove the _comment and _pendingServers sections
   # Move servers from _pendingServers to mcpServers
   ```

3. **Restart Cursor**

4. **Verify all servers are working:**
   - Check status bar for MCP server icons
   - Test each server with a simple query
   - Check for any error messages

---

## 🔍 Troubleshooting

### MCP Server Not Showing Up

**Check:**
1. JSON syntax is correct (no trailing commas)
2. Environment variables are set correctly
3. Cursor has been restarted
4. Internet connection is active

**Fix:**
```bash
# Verify JSON syntax
cat .cursor/mcp.json | jq .

# Check environment variables
echo $GITHUB_TOKEN
echo $BRAVE_API_KEY
echo $DATABASE_URL

# Restart Cursor completely
```

---

### Server Shows Error Status

**Check:**
1. API keys are valid
2. Network isn't blocking the connection
3. npx can download packages

**Fix:**
```bash
# Test npx can download
npx -y @modelcontextprotocol/server-memory --help

# Check Cursor logs (Help → Show Logs)
# Look for MCP-related errors
```

---

### Server Is Slow

**Optimize:**
1. Check internet connection speed
2. Verify not hitting API rate limits
3. Consider local caching
4. Check Cursor settings for performance

**Monitor:**
```
Expected response times:
- Filesystem MCP: < 100ms
- Memory MCP: < 500ms
- GitHub MCP: < 2s
- PostgreSQL MCP: < 1s
- Brave Search MCP: < 3s
- Sequential Thinking: < 2s
```

---

## 📊 Usage Best Practices

### When to Use Each Server

**Kibo UI:**
- Building new UI components
- Need component inspiration
- Want consistent patterns

**Filesystem:**
- File operations (reading, writing)
- Directory navigation
- File metadata queries

**Memory:**
- Ask about project patterns
- Recall previous decisions
- Check established conventions

**GitHub:**
- Create/update issues
- Review PRs
- Search code in repos
- Check issue status

**PostgreSQL:**
- Debug database issues
- Verify data structure
- Check multi-tenant isolation
- Inspect schema

**Brave Search:**
- Research latest practices
- Find documentation
- Look up examples
- Competitive analysis

**Sequential Thinking:**
- Complex architectural decisions
- Multi-step problem solving
- Feature planning
- Algorithm design

---

## 🎯 Example Workflows

### Creating a New Feature

```
1. Use Sequential Thinking:
   "Break down the SaveMessage feature into components"

2. Use Brave Search:
   "Find best practices for React Server Actions"

3. Use Kibo UI:
   "Show me form components for message input"

4. Use Memory:
   "What patterns do we use for database mutations?"

5. Use Agent:
   "Create the SaveMessage feature following GalaxyCo patterns"

6. Use PostgreSQL:
   "Verify the messages table schema is correct"

7. Use GitHub:
   "Create an issue to track SaveMessage testing"
```

### Debugging an Issue

```
1. Use PostgreSQL:
   "Query the database to see if orgId filtering is working"

2. Use Memory:
   "What are common causes of orgId filtering failures?"

3. Use Brave Search:
   "Search for Drizzle ORM where clause best practices"

4. Use Agent:
   "Fix all queries to include orgId filtering"

5. Use GitHub:
   "Create a PR with the fixes"
```

---

## 📚 Resources

- [MCP Protocol Docs](https://modelcontextprotocol.io)
- [Cursor MCP Guide](https://docs.cursor.com/mcp)
- [GalaxyCo Optimization Plan](.cursor/CURSOR-OPTIMIZATION-PLAN-2025.md)
- [Cursor 2.0 Quick Start](.cursor/docs/CURSOR-2.0-QUICK-START.md)

---

## ✅ Checklist for Full Setup

- [ ] GitHub token created and added to environment
- [ ] Brave API key created and added to environment
- [ ] DATABASE_URL verified in environment
- [ ] .cursor/mcp.json updated with all servers
- [ ] Cursor restarted
- [ ] Each server tested with sample query
- [ ] Team trained on MCP server usage
- [ ] Documentation bookmarked

---

**Questions?** Check the troubleshooting section or ask in #engineering

**Ready to supercharge Cursor?** Follow the setup steps above! 🚀

