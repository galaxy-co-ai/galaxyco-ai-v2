# 🔌 Integrations System

Complete integration infrastructure for GalaxyCo.ai using **Nango**.

## 🔧 Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Nango Secret Key (Server-side only - NEVER expose to client)
NANGO_SECRET_KEY=your-secret-key-here

# Nango Public Key (Client-side safe - used for OAuth flows)
NEXT_PUBLIC_NANGO_KEY=your-public-key-here
```

### 2. Get Your Nango Keys

1. Go to https://app.nango.dev/
2. Navigate to **Environment Settings** or **API Keys**
3. Copy both:
   - **Secret Key** → `NANGO_SECRET_KEY`
   - **Publishable/Public Key** → `NEXT_PUBLIC_NANGO_KEY`

### 3. Configure Integrations in Nango Dashboard

For each integration you want to use:

1. Go to **Integrations** in Nango dashboard
2. Click **Add Integration**
3. Select the provider (Gmail, Slack, HubSpot, etc.)
4. Configure OAuth credentials from the provider
5. Save the integration

## 📚 Available Integrations

### ✅ Gmail

- **Actions:** Send Email, Receive Emails
- **Use Cases:** Email automation, notifications, lead follow-ups
- **Scopes:** `gmail.send`, `gmail.readonly`

### ✅ Slack

- **Actions:** Post Message, Read Channels
- **Use Cases:** Team notifications, alerts, collaboration
- **Scopes:** `chat:write`, `channels:read`

### ✅ HubSpot

- **Actions:** Create/Update Contacts, Create/Update Deals
- **Use Cases:** CRM automation, lead management
- **Scopes:** `crm.objects.contacts.write`, `crm.objects.deals.write`

### ✅ Google Calendar

- **Actions:** Create Event, List Events
- **Use Cases:** Meeting scheduling, calendar automation
- **Scopes:** `calendar`

## 🚀 Usage

### Client-Side (OAuth Flows)

```typescript
import { connectIntegration } from '@/lib/integrations/nango-client';

// Trigger OAuth flow
const result = await connectIntegration('gmail', userId);

if (result.success) {
  console.log('Connected!', result.connectionId);
}
```

### Server-Side (API Calls)

```typescript
import { executeIntegrationRequest } from '@/lib/integrations/nango-server';

// Send email via Gmail
const result = await executeIntegrationRequest({
  integrationId: 'gmail',
  connectionId: userId,
  endpoint: '/gmail/v1/users/me/messages/send',
  method: 'POST',
  data: {
    raw: base64EncodedEmail,
  },
});
```

### In Flow Builder

Users can add integration nodes by:

1. Click "Add Integration" in Flow Builder
2. Select integration (Gmail, Slack, etc.)
3. Choose action (Send Email, Post Message, etc.)
4. Configure parameters
5. Connect to OAuth (if not already connected)

## 🏗️ Architecture

```
lib/integrations/
├── nango-client.ts        # Client-side OAuth
├── nango-server.ts        # Server-side API calls
├── integration-config.ts  # Type-safe config for all integrations
├── gmail/
│   ├── gmail-client.ts    # Gmail-specific helpers
│   ├── gmail-actions.ts   # Send email, receive emails
│   └── gmail-types.ts     # TypeScript types
├── slack/
│   ├── slack-client.ts
│   ├── slack-actions.ts
│   └── slack-types.ts
└── hubspot/
    ├── hubspot-client.ts
    ├── hubspot-actions.ts
    └── hubspot-types.ts
```

## 🔒 Security

- ✅ Secret key ONLY in server-side code
- ✅ Public key safe for client-side
- ✅ OAuth tokens managed by Nango
- ✅ Automatic token refresh
- ✅ Encrypted credential storage

## 📝 Adding New Integrations

1. Add integration config to `integration-config.ts`
2. Create integration directory (e.g., `salesforce/`)
3. Implement action handlers
4. Add integration node to Flow Builder
5. Write tests
6. Document usage

## 🧪 Testing

```bash
# Run integration tests
pnpm test:integration

# Test specific integration
pnpm test tests/integrations/gmail.test.ts
```

## 🐛 Troubleshooting

### "Public key not found"

Make sure `NEXT_PUBLIC_NANGO_KEY` is set in `.env.local` and you've restarted the dev server.

### "OAuth flow failed"

1. Check integration is configured in Nango dashboard
2. Verify OAuth credentials are correct
3. Check browser console for errors

### "Connection not found"

User needs to connect the integration first. Show the connect button in UI.

## 📖 Resources

- [Nango Docs](https://docs.nango.dev/)
- [Nango Integrations](https://docs.nango.dev/integrations/)
- [GalaxyCo Integration Guide](./INTEGRATION_GUIDE.md)
