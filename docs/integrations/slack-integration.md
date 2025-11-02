# Slack Integration - Complete Guide

**Status:** ✅ Production Ready  
**Last Updated:** November 2, 2025

---

## 📋 Overview

The Slack integration allows you to send messages and read channels directly from your workflows. Connect your Slack workspace once and use it across all workflows.

### **Features:**

- ✅ Send messages to any channel
- ✅ Reply to threads
- ✅ Read channel history
- ✅ List all channels
- ✅ Create new channels
- ✅ Variable replacement in messages
- ✅ OAuth 2.0 secure authentication

---

## 🔧 Setup

### **1. Configure Slack App Credentials**

Before using Slack integration, you need to create a Slack app:

**Required Environment Variables:**

```bash
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

**Creating a Slack App:**

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name your app and select your workspace
4. Navigate to **OAuth & Permissions**
5. Add redirect URL: `{YOUR_APP_URL}/api/integrations/slack/callback`
6. Add the following **Bot Token Scopes:**
   - `channels:read`
   - `channels:write`
   - `channels:history`
   - `chat:write`
   - `groups:read`
   - `groups:write`
   - `users:read`
7. Copy **Client ID** and **Client Secret** to `.env.local`

### **2. Connect Slack Workspace**

1. Navigate to **Settings → Integrations**
2. Click **Connect** on Slack card
3. Select your Slack workspace
4. Grant permissions
5. You'll be redirected back with success message

---

## 💻 Usage in Workflows

### **Adding Slack Node to Workflow**

In the Visual Flow Builder, add a Slack integration node.

**Node Configuration:**

```typescript
{
  type: 'integration',
  integration: 'slack',
  label: 'Send to Slack',
  config: {
    action: 'send_message',  // or 'read_messages'
    channel: '#general',
    text: 'Message with {{variables}}'
  }
}
```

---

## 💬 Send Message

Send a message to a Slack channel.

### **Configuration:**

```typescript
{
  action: 'send_message',
  channel: 'C12345ABC',        // Channel ID or #channel-name
  text: 'Hello {{userName}}!',
  threadTs: '1234567890.123456' // Optional: Reply to thread
}
```

### **Variable Replacement:**

Use `{{variableName}}` syntax to insert dynamic content:

```
Text: "New lead: {{lead.name}} ({{lead.email}})"

Variables: {
  lead: {
    name: "Jane Smith",
    email: "jane@example.com"
  }
}

Result: "New lead: Jane Smith (jane@example.com)"
```

### **Example Workflow:**

```
[Start]
  ↓
[Get High-Value Leads]
  ↓
[Slack: Notify Sales Team]
  channel: '#sales'
  text: '🔥 New high-value lead: {{lead.name}} - {{lead.company}}'
  ↓
[End]
```

---

## 📖 Read Messages

Read messages from a Slack channel.

### **Configuration:**

```typescript
{
  action: 'read_messages',
  channel: 'C12345ABC',
  limit: 10,                   // Optional, default: 10, max: 100
  oldest: '1234567890.000000', // Optional: Timestamp
  latest: '1234567900.000000'  // Optional: Timestamp
}
```

### **Response:**

```json
{
  "action": "read_messages",
  "channel": "C12345ABC",
  "count": 5,
  "messages": [
    {
      "user": "U12345",
      "text": "Hello team!",
      "ts": "1234567890.123456"
    }
  ]
}
```

### **Example Workflow:**

```
Natural Language:
"Every morning at 9am, read messages from #sales channel and create a summary"

Workflow:
[Trigger: Schedule 9:00 AM]
  ↓
[Slack: Read Messages]
  channel: '#sales'
  limit: 20
  ↓
[AI: Summarize Messages]
  ↓
[Slack: Post Summary]
  channel: '#team-digest'
  ↓
[End]
```

---

## 📋 List Channels

Get all channels in the workspace.

### **Configuration:**

```typescript
{
  action: 'list_channels';
}
```

### **Response:**

```json
{
  "action": "list_channels",
  "count": 10,
  "channels": [
    {
      "id": "C12345",
      "name": "general",
      "isChannel": true,
      "isMember": true,
      "isPrivate": false
    }
  ]
}
```

---

## ➕ Create Channel

Create a new Slack channel.

### **Configuration:**

```typescript
{
  action: 'create_channel',
  name: 'new-project-updates',
  isPrivate: false             // Optional, default: false
}
```

**Note:** Channel names are automatically sanitized (lowercase, alphanumeric + dashes/underscores only).

---

## 🧪 Testing

### **Run Tests:**

```bash
# All Slack integration tests
pnpm test apps/web/__tests__/integrations/slack

# Specific test file
pnpm test apps/web/__tests__/integrations/slack/oauth.test.ts
```

### **Test Coverage:**

- ✅ OAuth flow (authorization URL, token exchange, validation)
- ✅ Message sending (basic, threaded, with variables)
- ✅ Message reading (with filters, timestamps)
- ✅ Channel listing
- ✅ Channel creation (with name sanitization)
- ✅ Error handling
- ✅ Workspace info fetching

---

## 🔒 Security

### **OAuth 2.0:**

- Uses Slack OAuth 2.0 flow
- Bot tokens stored securely in database
- State parameter for CSRF protection
- Workspace-level permissions

### **Credentials Storage:**

```typescript
// Stored in oauth_tokens table
{
  accessToken: string,      // Bot token (xoxb-...)
  tokenType: string,        // 'Bearer'
  scope: string,            // Granted scopes
}
```

### **Scopes Required:**

- `channels:read` - List and view channels
- `channels:write` - Create and manage channels
- `channels:history` - Read message history
- `chat:write` - Send messages
- `groups:read` - Access private channels (if member)
- `users:read` - View user information

---

## 🐛 Troubleshooting

### **"Slack integration not connected"**

**Solution:** Go to Settings → Integrations and connect your Slack workspace.

### **"channel_not_found"**

**Possible causes:**

- Invalid channel ID or name
- Bot not invited to private channel
- Channel was deleted

**Solution:** Verify channel exists, invite bot to private channels, use correct channel ID.

### **"not_in_channel"**

**Solution:** Invite the bot to the channel first with `/invite @YourBotName`.

### **"invalid_auth"**

**Solution:** Token may have been revoked. Reconnect Slack in Settings.

---

## 📚 API Reference

### **Authorization Endpoint:**

```
GET /api/integrations/slack/authorize?workspaceId={workspaceId}
```

Returns authorization URL for OAuth flow.

### **Callback Endpoint:**

```
GET /api/integrations/slack/callback?code=...&state=...
```

Handles OAuth callback and stores credentials.

### **Execution Endpoint:**

```
POST /api/workflows/execute-integration

Body: {
  nodeId: string,
  integration: 'slack',
  config: SlackIntegrationConfig,
  workspaceId: string,
  variables?: Record<string, any>,
  previousResults?: Record<string, any>
}
```

---

## 🎯 Best Practices

### **1. Use Channel IDs:**

For reliability, use channel IDs instead of names:

**Good:**

```typescript
{
  channel: 'C12345ABC'; // Channel ID
}
```

**OK:**

```typescript
{
  channel: '#general'; // Name (will be resolved)
}
```

### **2. Thread Conversations:**

Keep related messages in threads for better organization:

```typescript
// First message
const result1 = await sendSlackMessage({
  channel: '#support',
  text: 'New support ticket #1234',
});

// Reply in thread
await sendSlackMessage({
  channel: '#support',
  text: 'Assigned to John',
  threadTs: result1.ts, // Creates thread
});
```

### **3. Format Messages:**

Use Slack's formatting for better readability:

````typescript
text: '*Bold text* _italic text_ ~strikethrough~';
text: '```code block```';
text: '<https://example.com|Link text>';
````

### **4. Rate Limiting:**

Slack has rate limits (Tier 3: 50+ requests/minute):

- Batch operations when possible
- Add delays for bulk sends
- Monitor error responses

---

## 📈 Examples

### **Example 1: Sales Alert Workflow**

```
Natural Language:
"When a new deal is won, notify the sales team in Slack"

Workflow:
[Trigger: Deal Won]
  ↓
[Slack: Send to #sales]
  text: '🎉 Deal won! {{deal.name}} - ${{deal.amount}}'
  ↓
[End]
```

### **Example 2: Daily Standup Reminder**

```
Natural Language:
"Every weekday at 9am, send standup reminder to #team"

Workflow:
[Trigger: Schedule Mon-Fri 9:00 AM]
  ↓
[Slack: Send Reminder]
  channel: '#team'
  text: '👋 Good morning! Time for daily standup. What did you work on yesterday?'
  ↓
[End]
```

### **Example 3: Support Ticket Integration**

```
Natural Language:
"When a new support ticket arrives, post to #support and create a thread"

Workflow:
[Trigger: New Support Ticket]
  ↓
[Slack: Create Thread]
  channel: '#support'
  text: '🎫 New ticket #{{ticket.id}}: {{ticket.subject}}'
  ↓
[Store Thread TS]
  ↓
[Slack: Add Details]
  channel: '#support'
  threadTs: '{{threadTs}}'
  text: 'From: {{ticket.email}}\nPriority: {{ticket.priority}}'
  ↓
[End]
```

---

## 🔄 Integration with Other Tools

### **Slack + Gmail:**

```
[Gmail: Receive Emails]
  query: 'is:unread'
  ↓
[Condition: High Priority?]
  ├─ Yes → [Slack: Alert #urgent]
  └─ No  → [Continue]
```

### **Slack + CRM:**

```
[Slack: Read #sales Messages]
  ↓
[AI: Extract Lead Info]
  ↓
[CRM: Create Lead]
  ↓
[Slack: Confirm]
  text: '✅ Lead created: {{lead.name}}'
```

---

## 📞 Support

**Need help?**

- Check troubleshooting section above
- View test examples: `apps/web/__tests__/integrations/slack/`
- Review source code: `apps/web/lib/integrations/slack/`
- Slack API docs: [api.slack.com](https://api.slack.com/)

---

**Status:** ✅ Production Ready  
**Tests:** 8+ comprehensive tests  
**Coverage:** OAuth, Send, Read, Channels, Variables, Errors
