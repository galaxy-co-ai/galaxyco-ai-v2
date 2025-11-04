# 🚀 GalaxyCo.ai Integration Guide

**Complete guide to building workflows with real integrations**

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Configuring Integrations](#configuring-integrations)
3. [Using Integrations in Workflows](#using-integrations-in-workflows)
4. [Available Integrations](#available-integrations)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Usage](#advanced-usage)

---

## 🎯 Getting Started

### Prerequisites

- ✅ GalaxyCo.ai account
- ✅ Nango account (free tier works)
- ✅ Access to the integration you want to use (Gmail, Slack, HubSpot, etc.)

### Environment Setup

Add your Nango secret key to `.env.local`:

```bash
NANGO_SECRET_KEY=your-secret-key-here
```

**Note:** You do NOT need a public key! GalaxyCo uses Nango's modern session token approach.

---

## 🔧 Configuring Integrations

### Step 1: Configure in Nango Dashboard

For each integration (Gmail, Slack, HubSpot):

1. Go to https://app.nango.dev/
2. Navigate to **Integrations** tab
3. Click **Configure New Integration**
4. Select the provider (Gmail, Slack, etc.)
5. Follow provider-specific setup:

#### Gmail Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `https://api.nango.dev/oauth/callback`
6. Copy **Client ID** and **Client Secret** to Nango
7. In Nango, set scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`

#### Slack Setup

1. Go to [Slack API](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name your app and select workspace
4. Go to **OAuth & Permissions**
5. Add **Redirect URL**: `https://api.nango.dev/oauth/callback`
6. Add **Bot Token Scopes**:
   - `chat:write`
   - `channels:read`
   - `channels:history`
   - `users:read`
7. Copy **Client ID** and **Client Secret** to Nango

#### HubSpot Setup

1. Go to [HubSpot Developers](https://developers.hubspot.com/)
2. Create a new app
3. Set **Redirect URL**: `https://api.nango.dev/oauth/callback`
4. Request scopes:
   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
   - `crm.objects.deals.write`
   - `crm.objects.deals.read`
5. Copy **Client ID** and **Client Secret** to Nango

### Step 2: Test Connection in Nango

1. Go to **Connections** tab in Nango
2. Click **Add Test Connection**
3. Select integration
4. Click **Authorize**
5. Complete OAuth flow
6. Verify connection appears in Connections list

---

## 🔌 Using Integrations in Workflows

### Method 1: Visual Flow Builder

1. Go to **Workflows** → **Create Workflow**
2. Describe your workflow in natural language:
   ```
   When a new email arrives from a lead, extract their contact info,
   create a contact in HubSpot, and notify the sales team in Slack
   ```
3. Click **Generate Visual Flow**
4. The AI will create integration nodes automatically
5. Click on integration nodes to configure:
   - Select the integration action (send email, post message, etc.)
   - Fill in parameters
   - Connect your account if not already connected
6. Test the workflow
7. Save and activate

### Method 2: Programmatic (Advanced)

```typescript
import { executeIntegrationAction } from '@/lib/integrations/integration-executor';

// Execute in a Server Action or API route
const result = await executeIntegrationAction({
  integrationId: 'gmail',
  action: 'send_email',
  connectionId: userId, // User's Clerk ID
  parameters: {
    to: 'customer@example.com',
    subject: 'Welcome to GalaxyCo!',
    body: 'Thanks for signing up...',
  },
});

if (result.success) {
  console.log('Email sent!', result.data.messageId);
  console.log('Execution time:', result.executionTime, 'ms');
}
```

---

## 📚 Available Integrations

### ✅ Gmail

**Actions:**

1. **Send Email**
   - **Parameters:** to, subject, body, cc (optional), bcc (optional)
   - **Returns:** messageId, timestamp
   - **Use Case:** Automated email outreach, notifications, follow-ups

2. **Receive Emails**
   - **Parameters:** query (Gmail search), maxResults (optional)
   - **Returns:** Array of emails with full details
   - **Use Case:** Monitor inbox, trigger workflows from emails

**Example:**

```typescript
// Send email
await executeIntegrationAction({
  integrationId: 'gmail',
  action: 'send_email',
  connectionId: userId,
  parameters: {
    to: 'lead@company.com',
    subject: 'Following up on our conversation',
    body: 'Hi there, I wanted to follow up...',
  },
});
```

### ✅ Slack

**Actions:**

1. **Post Message**
   - **Parameters:** channel, text, thread_ts (optional)
   - **Returns:** messageId, timestamp, channel
   - **Use Case:** Team notifications, alerts, updates

2. **Read Channels**
   - **Parameters:** types (optional), limit (optional)
   - **Returns:** Array of channels
   - **Use Case:** Get list of available channels

**Example:**

```typescript
// Post to Slack
await executeIntegrationAction({
  integrationId: 'slack',
  action: 'post_message',
  connectionId: userId,
  parameters: {
    channel: '#sales',
    text: '🎉 New lead captured: John Doe (Acme Corp)',
  },
});
```

### ✅ HubSpot

**Actions:**

1. **Create Contact**
   - **Parameters:** email (required), firstname, lastname, company, phone
   - **Returns:** contactId, createdAt
   - **Use Case:** Add leads to CRM automatically

2. **Update Contact**
   - **Parameters:** contactId, properties (object)
   - **Returns:** contactId, updatedAt
   - **Use Case:** Update existing contact information

3. **Create Deal**
   - **Parameters:** dealname (required), amount, dealstage
   - **Returns:** dealId, createdAt
   - **Use Case:** Track new sales opportunities

4. **Update Deal**
   - **Parameters:** dealId, properties (object)
   - **Returns:** dealId, updatedAt
   - **Use Case:** Update deal status, amount, etc.

**Example:**

```typescript
// Create contact
await executeIntegrationAction({
  integrationId: 'hubspot',
  action: 'create_contact',
  connectionId: userId,
  parameters: {
    email: 'newlead@company.com',
    firstname: 'Jane',
    lastname: 'Smith',
    company: 'Tech Startup Inc',
  },
});

// Create deal
await executeIntegrationAction({
  integrationId: 'hubspot',
  action: 'create_deal',
  connectionId: userId,
  parameters: {
    dealname: 'Q1 2024 Enterprise Deal',
    amount: 50000,
    dealstage: 'qualifiedtobuy',
  },
});
```

### ⏳ Google Calendar (Coming Soon)

**Planned Actions:**

- Create Event
- List Events
- Update Event

---

## 🛠️ Common Workflows

### 1. Lead Capture & Notification

**Trigger:** New email arrives  
**Actions:**

1. Receive Gmail email
2. Extract sender info
3. Create HubSpot contact
4. Post Slack notification to #sales

**Natural Language Prompt:**

```
When a new email arrives in my inbox, extract the sender's email,
create a contact in HubSpot, and notify the sales team in Slack
```

### 2. Follow-Up Automation

**Trigger:** New HubSpot contact created  
**Actions:**

1. Get contact details from HubSpot
2. Generate personalized email with AI
3. Send email via Gmail
4. Create follow-up task in Slack

**Natural Language Prompt:**

```
When a new contact is added to HubSpot, send them a personalized
welcome email via Gmail and create a follow-up reminder in Slack
```

### 3. Team Collaboration

**Trigger:** Important email received  
**Actions:**

1. Receive Gmail emails with specific label
2. Post summary to Slack channel
3. Create HubSpot task for team

**Natural Language Prompt:**

```
Monitor emails labeled "urgent", post summaries to #team-urgent
Slack channel, and create tasks in HubSpot for team members
```

---

## 🐛 Troubleshooting

### "Connection not found"

**Problem:** User hasn't connected the integration yet

**Solution:**

1. Show the `ConnectIntegrationButton` component
2. User clicks and completes OAuth flow
3. Connection is saved automatically

### "OAuth flow failed"

**Possible Causes:**

1. Integration not configured in Nango dashboard
2. Incorrect Client ID/Secret
3. Missing scopes in Nango configuration
4. Callback URL not registered with provider

**Solution:**

1. Verify integration exists in Nango dashboard
2. Double-check OAuth credentials
3. Ensure all required scopes are added
4. Confirm callback URL is `https://api.nango.dev/oauth/callback`

### "Invalid credentials" or "Token expired"

**Problem:** OAuth token has expired or been revoked

**Solution:**

1. Use the `reconnectIntegration()` function
2. User completes re-authorization flow
3. Existing connection is updated with new tokens

### "Rate limit exceeded"

**Problem:** Too many API requests to integration

**Solution:**

1. Implement request throttling in workflows
2. Use Nango's built-in rate limit handling
3. Consider batching operations

---

## 🔐 Security Best Practices

### ✅ DO:

- Use `userId` (from Clerk) as `connectionId`
- Store sensitive data in Nango (handled automatically)
- Validate all parameters before execution
- Handle errors gracefully
- Log integration usage for debugging

### ❌ DON'T:

- Expose `NANGO_SECRET_KEY` to client-side code
- Store OAuth tokens in your database
- Share connections between users
- Skip parameter validation
- Ignore error responses

---

## 🚀 Advanced Usage

### Custom Integration Actions

You can add new actions to existing integrations:

```typescript
// lib/integrations/gmail/gmail-actions.ts

export async function addGmailLabel(connectionId: string, messageId: string, labelId: string) {
  const result = await executeIntegrationRequest({
    integrationId: 'gmail',
    connectionId,
    endpoint: `/gmail/v1/users/me/messages/${messageId}/modify`,
    method: 'POST',
    data: {
      addLabelIds: [labelId],
    },
  });

  return result;
}
```

### Error Handling in Workflows

```typescript
// In workflow execution
try {
  const result = await executeIntegrationAction({
    integrationId: 'gmail',
    action: 'send_email',
    connectionId: userId,
    parameters: emailParams,
  });

  if (!result.success) {
    // Log error
    console.error('Email send failed:', result.error);

    // Notify user
    await executeIntegrationAction({
      integrationId: 'slack',
      action: 'post_message',
      connectionId: userId,
      parameters: {
        channel: '#errors',
        text: `⚠️ Failed to send email: ${result.error}`,
      },
    });
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Workflow execution failed:', error);
}
```

### Conditional Integration Execution

```typescript
// Only execute if certain conditions are met
if (leadScore > 70) {
  // High-value lead - notify immediately
  await executeIntegrationAction({
    integrationId: 'slack',
    action: 'post_message',
    connectionId: userId,
    parameters: {
      channel: '#hot-leads',
      text: `🔥 High-value lead detected: ${leadEmail}`,
    },
  });
} else {
  // Low-value lead - add to nurture campaign
  await executeIntegrationAction({
    integrationId: 'gmail',
    action: 'send_email',
    connectionId: userId,
    parameters: {
      to: leadEmail,
      subject: 'Stay in touch',
      body: 'Thank you for your interest...',
    },
  });
}
```

---

## 📊 Monitoring & Analytics

### Track Integration Usage

```typescript
// Log integration executions
const result = await executeIntegrationAction(params);

// Log to your analytics
await logEvent({
  type: 'integration_execution',
  integration: params.integrationId,
  action: params.action,
  success: result.success,
  executionTime: result.executionTime,
  userId: params.connectionId,
});
```

### Cost Tracking

Different integrations have different rate limits:

- **Gmail:** 15,000 requests/day (free)
- **Slack:** ~50 requests/minute
- **HubSpot:** ~100 requests/10 seconds

Monitor your usage in the Nango dashboard to avoid hitting limits.

---

## 🔄 Migration Guide

### From Mock Integrations

If you were using mock integrations before:

**Old (Mock):**

```typescript
// This was simulated
const result = { success: true, data: { mockData: true } };
```

**New (Real):**

```typescript
// This actually sends the email!
const result = await executeIntegrationAction({
  integrationId: 'gmail',
  action: 'send_email',
  connectionId: userId,
  parameters: { to: 'real@example.com', subject: 'Real Email', body: 'This actually sends!' },
});
```

### Testing Strategy

**Development:**

- Use Nango test connections
- Create test accounts for each integration
- Use test email addresses, Slack test workspaces

**Production:**

- Each user connects their own accounts
- Actions execute with their credentials
- Full multi-tenant isolation

---

## 🎓 Best Practices

### 1. Always Check Connection Status

```typescript
// Before using an integration in a workflow
const status = await fetch(`/api/integrations/status?integrationId=gmail`);
const { connected } = await status.json();

if (!connected) {
  // Show connect button to user
  return <ConnectIntegrationButton integrationId="gmail" />;
}
```

### 2. Handle Errors Gracefully

```typescript
const result = await executeIntegrationAction(params);

if (!result.success) {
  // User-friendly error message
  toast.error('Failed to send email. Please check your connection and try again.');

  // Log technical details for debugging
  console.error('Integration error:', result.error);
}
```

### 3. Use Meaningful Connection IDs

```typescript
// ✅ GOOD - Use Clerk userId
connectionId: userId;

// ❌ BAD - Random IDs
connectionId: 'random-uuid-123';

// ✅ ALSO GOOD - Workspace ID for team integrations
connectionId: workspaceId;
```

### 4. Validate Parameters

```typescript
const validation = validateIntegrationParameters(
  integrationId,
  action,
  parameters
);

if (!validation.valid) {
  console.error('Invalid parameters:', validation.errors);
  return;
}

// Safe to execute
await executeIntegrationAction({ ... });
```

---

## 🔗 Component Reference

### `<ConnectIntegrationButton />`

Triggers OAuth flow for an integration.

```tsx
<ConnectIntegrationButton
  integrationId="gmail"
  onSuccess={(connectionId) => {
    console.log('Connected!', connectionId);
  }}
  onError={(error) => {
    console.error('Failed:', error);
  }}
  variant="default"
  size="sm"
/>
```

### `<IntegrationStatusCard />`

Shows connection status with reconnect/disconnect options.

```tsx
<IntegrationStatusCard
  integrationId="slack"
  onReconnect={() => {
    console.log('Reconnected');
  }}
  onDisconnect={() => {
    console.log('Disconnected');
  }}
/>
```

### `<IntegrationPicker />`

Grid of all available integrations.

```tsx
<IntegrationPicker
  category="communication" // Optional filter
  onConnect={(integrationId, connectionId) => {
    console.log(`Connected to ${integrationId}`);
  }}
/>
```

---

## 🧪 Testing Your Integrations

### Unit Tests

```bash
pnpm test __tests__/integrations/gmail.test.ts
pnpm test __tests__/integrations/slack.test.ts
pnpm test __tests__/integrations/hubspot.test.ts
```

### Integration Tests

```bash
pnpm test __tests__/integrations/integration-executor.test.ts
```

### E2E Tests

```bash
pnpm test __tests__/integrations/e2e/integration-flow.test.ts
```

### Manual Testing

1. Start dev server: `pnpm dev`
2. Navigate to integrations settings
3. Connect each integration
4. Create a test workflow
5. Execute and verify results

---

## 📖 API Reference

### Server-Side Functions

```typescript
// Gmail
import { sendGmailEmail, receiveGmailEmails } from '@/lib/integrations/gmail/gmail-actions';

// Slack
import { postSlackMessage, readSlackChannels } from '@/lib/integrations/slack/slack-actions';

// HubSpot
import {
  createHubSpotContact,
  updateHubSpotContact,
  createHubSpotDeal,
  updateHubSpotDeal,
} from '@/lib/integrations/hubspot/hubspot-actions';

// Unified Executor
import { executeIntegrationAction } from '@/lib/integrations/integration-executor';
```

### Client-Side Functions

```typescript
import {
  connectIntegration,
  connectMultipleIntegrations,
  reconnectIntegration,
} from '@/lib/integrations/nango-client';
```

---

## 💡 Tips & Tricks

### 1. Batch Operations

```typescript
// Instead of sending 100 individual emails
for (const recipient of recipients) {
  await sendGmailEmail(...); // Slow!
}

// Batch them with Promise.all (respect rate limits!)
const results = await Promise.all(
  recipients.slice(0, 10).map(recipient =>
    sendGmailEmail(...)
  )
);
```

### 2. Use Variables in Workflows

```typescript
// Extract data from one step, use in next
const gmailResult = await executeIntegrationAction({
  integrationId: 'gmail',
  action: 'receive_email',
  ...
});

if (gmailResult.success) {
  const senderEmail = gmailResult.data.emails[0].from;

  // Use in HubSpot
  await executeIntegrationAction({
    integrationId: 'hubspot',
    action: 'create_contact',
    parameters: {
      email: senderEmail, // ← Data from previous step
    },
  });
}
```

### 3. Error Recovery

```typescript
// Retry with exponential backoff
async function executeWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await executeIntegrationAction(params);

    if (result.success) return result;

    // Wait before retry (100ms, 200ms, 400ms...)
    await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, i)));
  }

  return { success: false, error: 'Max retries exceeded' };
}
```

---

## 🔗 Resources

- [Nango Documentation](https://docs.nango.dev/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Slack API Docs](https://api.slack.com/)
- [HubSpot API Docs](https://developers.hubspot.com/)
- [GalaxyCo Workflow Builder Guide](../docs/WORKFLOW_BUILDER.md)

---

## 💬 Support

Need help?

- Check the troubleshooting section above
- Review test files for usage examples
- Ask in GalaxyCo Slack community
- Contact support@galaxyco.ai

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
