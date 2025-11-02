# Gmail Integration - Complete Guide

**Status:** ✅ Production Ready
**Last Updated:** November 2, 2025

---

## 📋 Overview

The Gmail integration allows you to send and receive emails directly from your workflows. Connect your Gmail account once and use it across all workflows.

### **Features:**

- ✅ Send emails with dynamic content
- ✅ Receive and search emails
- ✅ Variable replacement in email templates
- ✅ CC/BCC support
- ✅ OAuth 2.0 secure authentication
- ✅ Automatic token refresh

---

## 🔧 Setup

### **1. Configure Google OAuth Credentials**

Before using Gmail integration, you need to set up Google OAuth credentials:

**Required Environment Variables:**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

**Getting Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Web Application)
5. Add redirect URI: `{YOUR_APP_URL}/api/integrations/gmail/callback`
6. Copy Client ID and Client Secret to `.env.local`

### **2. Connect Gmail Account**

1. Navigate to **Settings → Integrations**
2. Click **Connect** on Gmail card
3. Sign in with your Google account
4. Grant permissions
5. You'll be redirected back with success message

---

## 💻 Usage in Workflows

### **Adding Gmail Node to Workflow**

In the Visual Flow Builder, you can add a Gmail integration node that will appear in your workflow diagram.

**Node Configuration:**

```typescript
{
  type: 'integration',
  integration: 'gmail',
  label: 'Send Email',
  config: {
    action: 'send',  // or 'receive', 'search'
    to: 'recipient@example.com',
    subject: 'Your Subject',
    body: 'Email body with {{variables}}'
  }
}
```

---

## 📧 Send Email

Send an email using Gmail.

### **Configuration:**

```typescript
{
  action: 'send',
  to: 'recipient@example.com',
  subject: 'Welcome to GalaxyCo',
  body: 'Hello {{name}}, welcome to our platform!',
  cc: ['manager@example.com'],     // Optional
  bcc: ['archive@example.com']      // Optional
}
```

### **Variable Replacement:**

Use `{{variableName}}` syntax to insert dynamic content:

**Workflow Variables:**

```
Body: "Hello {{userName}}, your order {{orderId}} is ready!"

Variables: {
  userName: "John Doe",
  orderId: "12345"
}

Result: "Hello John Doe, your order 12345 is ready!"
```

**Previous Results:**

```
Body: "New lead: {{lead.name}} ({{lead.email}})"

Previous Results: {
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
[Get New Leads from CRM]
  ↓
[Gmail: Send Welcome Email]
  Config: {
    action: 'send',
    to: '{{lead.email}}',
    subject: 'Welcome {{lead.name}}!',
    body: 'Hello {{lead.name}}, thanks for signing up!'
  }
  ↓
[End]
```

---

## 📥 Receive Emails

Fetch recent emails from your Gmail inbox.

### **Configuration:**

```typescript
{
  action: 'receive',
  maxResults: 10,              // Optional, default: 10, max: 100
  query: 'is:unread',           // Optional, Gmail search query
  labelIds: ['INBOX']           // Optional, filter by labels
}
```

### **Gmail Search Queries:**

```
from:sender@example.com
subject:"Important Message"
is:unread
after:2025/01/01
has:attachment
in:inbox
```

### **Response:**

```json
{
  "action": "receive",
  "count": 5,
  "messages": [
    {
      "id": "msg_123",
      "from": "sender@example.com",
      "subject": "Important Update",
      "receivedAt": "2025-11-02T10:00:00Z"
    }
  ]
}
```

---

## 🔍 Search Emails

Search emails with specific criteria.

### **Configuration:**

```typescript
{
  action: 'search',
  query: 'from:sender@example.com subject:invoice',
  maxResults: 20               // Optional, default: 10
}
```

### **Response:**

Same format as receive action, but filtered by search query.

---

## 🧪 Testing

### **Run Tests:**

```bash
# All Gmail integration tests
pnpm test apps/web/__tests__/integrations/gmail

# Specific test file
pnpm test apps/web/__tests__/integrations/gmail/oauth.test.ts
```

### **Test Coverage:**

- ✅ OAuth flow (authorization URL, token exchange, refresh)
- ✅ Email sending (basic, with CC/BCC, with variables)
- ✅ Email receiving (with queries, with labels)
- ✅ Email searching
- ✅ Variable replacement
- ✅ Error handling
- ✅ Token validation

---

## 🔒 Security

### **OAuth 2.0:**

- Uses secure OAuth 2.0 flow
- Access tokens are encrypted in database
- Automatic token refresh before expiration
- State parameter for CSRF protection

### **Credentials Storage:**

```typescript
// Stored in database (encrypted)
{
  accessToken: string,      // Gmail access token
  refreshToken: string,     // Refresh token for renewal
  expiresAt: number,        // Expiration timestamp
  email: string             // Connected Gmail address
}
```

### **Scopes Required:**

- `gmail.send` - Send emails
- `gmail.readonly` - Read emails
- `gmail.modify` - Modify labels (future use)

---

## 🐛 Troubleshooting

### **"Gmail integration not connected"**

**Solution:** Go to Settings → Integrations and connect your Gmail account.

### **"Invalid credentials"**

**Solution:** Token may have expired. Reconnect Gmail in Settings.

### **"Failed to send email"**

**Possible causes:**

- Invalid email address
- Missing required fields (to, subject, body)
- Gmail API quota exceeded
- Invalid credentials

**Solution:** Check error message, verify configuration, reconnect if needed.

### **"Failed to fetch messages"**

**Possible causes:**

- Invalid query syntax
- No messages match criteria
- Invalid credentials

**Solution:** Verify query syntax, check Gmail account, reconnect if needed.

---

## 📚 API Reference

### **Authorization Endpoint:**

```
GET /api/integrations/gmail/authorize
```

Returns authorization URL for OAuth flow.

### **Callback Endpoint:**

```
GET /api/integrations/gmail/callback?code=...&state=...
```

Handles OAuth callback and stores credentials.

### **Execution Endpoint:**

```
POST /api/workflows/execute-integration

Body: {
  nodeId: string,
  integration: 'gmail',
  config: GmailIntegrationConfig,
  workspaceId: string,
  variables?: Record<string, any>,
  previousResults?: Record<string, any>
}
```

---

## 🎯 Best Practices

### **1. Use Variables:**

Don't hardcode email addresses or content. Use variables for dynamic content.

**Good:**

```typescript
{
  to: '{{customer.email}}',
  subject: 'Order {{order.id}} Confirmation'
}
```

**Bad:**

```typescript
{
  to: 'customer@example.com',  // Hardcoded
  subject: 'Order Confirmation'  // Not dynamic
}
```

### **2. Handle Errors:**

Always add error handling nodes after Gmail actions.

```
[Gmail: Send Email]
  ↓
[Condition: Success?]
  ├─ Yes → [Continue Workflow]
  └─ No  → [Log Error & Notify]
```

### **3. Rate Limiting:**

Gmail has rate limits. For bulk operations:

- Add delays between sends
- Batch process in chunks
- Monitor quota usage

### **4. Template Emails:**

Store email templates in variables for reusability:

```typescript
const emailTemplate = `
Hello {{name}},

Your order {{orderId}} has been shipped!

Tracking: {{trackingNumber}}

Thanks,
GalaxyCo Team
`;

config.body = emailTemplate;
```

---

## 📈 Examples

### **Example 1: Welcome Email Workflow**

```
Natural Language:
"When a new customer signs up, send them a welcome email"

Workflow:
[Trigger: New Customer]
  ↓
[Gmail: Send Welcome Email]
  to: {{customer.email}}
  subject: "Welcome to GalaxyCo!"
  body: "Hello {{customer.name}}, ..."
  ↓
[End]
```

### **Example 2: Daily Digest Workflow**

```
Natural Language:
"Every morning at 9am, fetch unread emails and create a summary"

Workflow:
[Trigger: Schedule 9:00 AM]
  ↓
[Gmail: Receive Emails]
  query: "is:unread"
  maxResults: 20
  ↓
[AI: Summarize Emails]
  ↓
[Slack: Post Summary]
  ↓
[End]
```

### **Example 3: Lead Qualification Workflow**

```
Natural Language:
"When a new lead fills out the form, send personalized email based on their location"

Workflow:
[Trigger: New Lead Form]
  ↓
[Condition: Location = California?]
  ├─ Yes → [Gmail: Send CA-specific Email]
  └─ No  → [Gmail: Send General Email]
  ↓
[CRM: Update Lead Status]
  ↓
[End]
```

---

## 🔄 Migration from Mock to Real

If you have workflows using mock Gmail integration:

1. Connect your Gmail account
2. Workflows will automatically use real Gmail API
3. No code changes needed
4. Test with actual email addresses

---

## 📞 Support

**Need help?**

- Check troubleshooting section above
- View test examples: `apps/web/__tests__/integrations/gmail/`
- Review source code: `apps/web/lib/integrations/gmail/`

---

**Status:** ✅ Production Ready
**Tests:** 12+ comprehensive tests
**Coverage:** OAuth, Send, Receive, Search, Variables, Errors
