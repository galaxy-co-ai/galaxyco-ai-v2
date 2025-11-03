# 🤝 Agent Communication Protocol

**Purpose:** Ensure accurate, timely communication between agents

**Last Updated:** ${new Date().toISOString()}

---

## 📨 Message Types

### 1. File Access Request

**When:** Agent needs to modify file outside their scope or file is locked

**Format:**
```json
{
  "type": "file_access_request",
  "from": "frontend-architect",
  "to": "backend-systems",
  "file": "apps/web/lib/actions/agents.ts",
  "reason": "Need to update API call signature",
  "priority": "medium",
  "timestamp": "2025-11-03T..."
}
```

**Response:**
```json
{
  "type": "file_access_approval",
  "approved": true,
  "message": "File is available. Proceed.",
  "estimatedWaitTime": 0
}
```

### 2. API Schema Change Notification

**When:** Backend changes API structure

**Format:**
```json
{
  "type": "api_schema_change",
  "from": "backend-systems",
  "to": ["frontend-architect"],
  "changes": {
    "endpoint": "/api/agents",
    "method": "POST",
    "changes": ["Added 'priority' field", "Removed 'status' field"]
  },
  "timestamp": "2025-11-03T..."
}
```

### 3. Design Specification Delivery

**When:** UI/UX Design Agent completes design, Frontend needs to implement

**Format:**
```json
{
  "type": "design_specification",
  "from": "ui-ux-design",
  "to": "frontend-architect",
  "spec": {
    "component": "AgentCard",
    "wireframe": "docs/wireframes/agent-card.md",
    "designTokens": {...},
    "requirements": ["Loading states", "Error handling"]
  },
  "timestamp": "2025-11-03T..."
}
```

### 4. Coordination Request

**When:** Agents need to coordinate on shared work

**Format:**
```json
{
  "type": "coordination_request",
  "from": "frontend-architect",
  "to": "backend-systems",
  "request": "Can we schedule API endpoint changes for tomorrow?",
  "priority": "low",
  "timestamp": "2025-11-03T..."
}
```

---

## 🔄 Communication Flow

### Step 1: Identify Need

Agent realizes they need:
- File access outside scope
- Information from another agent
- Coordination on shared work

### Step 2: Send Message

```typescript
// Via messaging system
await messaging.send({
  from: 'frontend-architect',
  to: 'backend-systems',
  type: 'file_access_request',
  file: 'apps/web/lib/actions/agents.ts',
  reason: 'Need to update API call',
  priority: 'medium',
});
```

### Step 3: Receive & Review

Receiving agent:
1. Checks message queue
2. Reviews request
3. Determines response

### Step 4: Respond

```typescript
await messaging.respond({
  messageId: '...',
  approved: true,
  message: 'File is available. Proceed.',
});
```

### Step 5: Execute

Requesting agent:
1. Receives approval
2. Proceeds with work
3. Releases lock when done

---

## 🎯 Priority Levels

### Critical
- **Response Time:** Immediate
- **Use Cases:** Production bug, security issue
- **Protocol:** Stop all work, address immediately

### High
- **Response Time:** < 5 minutes
- **Use Cases:** Blocking feature work
- **Protocol:** Prioritize over other work

### Medium
- **Response Time:** < 30 minutes
- **Use Cases:** Feature coordination
- **Protocol:** Address during current work session

### Low
- **Response Time:** < 2 hours
- **Use Cases:** Future planning, questions
- **Protocol:** Address when convenient

---

## ✅ Communication Checklist

**Before sending message:**
- [ ] Is this really necessary? (Can I work around it?)
- [ ] Have I checked file locks?
- [ ] Is my request clear and specific?
- [ ] Is priority set correctly?

**When receiving message:**
- [ ] Read message immediately
- [ ] Review request carefully
- [ ] Check file/context status
- [ ] Respond within priority timeframe
- [ ] Be helpful and clear

---

## 🚫 Communication Anti-Patterns

❌ **Don't:**
- Modify files without checking locks
- Send vague requests
- Ignore coordination requests
- Work on locked files
- Assume silence means approval

✅ **Do:**
- Check locks before modifying
- Be specific in requests
- Respond promptly
- Respect file locks
- Wait for explicit approval

---

**Status:** ✅ Active Protocol
**Last Updated:** ${new Date().toISOString()}

