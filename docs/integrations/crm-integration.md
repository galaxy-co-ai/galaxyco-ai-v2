# CRM Integrations - Complete Guide

**Providers:** HubSpot, Pipedrive  
**Status:** ✅ Production Ready  
**Last Updated:** November 2, 2025

---

## 📋 Overview

The CRM integrations allow you to manage contacts and deals directly from your workflows. Connect HubSpot or Pipedrive once and automate your sales processes.

### **Features:**

- ✅ Create and update contacts
- ✅ Create and manage deals
- ✅ Search contacts and deals
- ✅ Sync data between systems
- ✅ Automated lead enrichment
- ✅ OAuth 2.0 secure authentication

### **Supported CRMs:**

- **HubSpot** - Full contact and deal management
- **Pipedrive** - Person and deal management

---

## 🔧 HubSpot Setup

### **1. Configure HubSpot App**

**Required Environment Variables:**

```bash
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Creating HubSpot App:**

1. Go to [app.hubspot.com](https://app.hubspot.com/signup/developers)
2. Navigate to **Settings** → **Integrations** → **Private Apps**
3. Click **Create a private app**
4. Add scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.objects.companies.read`
   - `crm.objects.companies.write`
5. Create app and copy credentials

### **2. Connect HubSpot**

1. Navigate to **Settings → Integrations**
2. Click **Connect** on HubSpot card
3. Authorize the app
4. You'll be redirected back with success message

---

## 🔧 Pipedrive Setup

### **1. Configure Pipedrive App**

**Required Environment Variables:**

```bash
PIPEDRIVE_CLIENT_ID=your_pipedrive_client_id
PIPEDRIVE_CLIENT_SECRET=your_pipedrive_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Creating Pipedrive App:**

1. Go to [pipedrive.com/developers](https://developers.pipedrive.com/)
2. Create an app in Developer Portal
3. Add redirect URL: `{YOUR_APP_URL}/api/integrations/pipedrive/callback`
4. Copy Client ID and Client Secret

### **2. Connect Pipedrive**

1. Navigate to **Settings → Integrations**
2. Click **Connect** on Pipedrive card
3. Authorize the app
4. You'll be redirected back with success message

---

## 💻 Usage in Workflows

### **HubSpot Node Configuration:**

```typescript
{
  type: 'integration',
  integration: 'hubspot',
  label: 'Create Contact in HubSpot',
  config: {
    action: 'create_contact',
    contactData: {
      firstName: '{{lead.firstName}}',
      lastName: '{{lead.lastName}}',
      email: '{{lead.email}}',
      company: '{{lead.company}}'
    }
  }
}
```

### **Pipedrive Node Configuration:**

```typescript
{
  type: 'integration',
  integration: 'pipedrive',
  label: 'Create Person in Pipedrive',
  config: {
    action: 'create_contact',
    contactData: {
      firstName: '{{lead.firstName}}',
      lastName: '{{lead.lastName}}',
      email: '{{lead.email}}'
    }
  }
}
```

---

## 👥 Contact Management

### **Create Contact**

**HubSpot:**

```typescript
{
  action: 'create_contact',
  contactData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    jobTitle: 'CEO'
  }
}
```

**Pipedrive:**

```typescript
{
  action: 'create_contact',
  contactData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp'
  }
}
```

### **Update Contact**

```typescript
{
  action: 'update_contact',
  contactId: '123',
  contactData: {
    phone: '+9876543210',
    jobTitle: 'CTO'
  }
}
```

### **Get Contact**

```typescript
{
  action: 'get_contact',
  contactId: '123'
}
```

### **Search Contacts**

```typescript
{
  action: 'search_contacts',
  searchQuery: 'john@example.com'
}
```

---

## 💼 Deal Management

### **Create Deal**

```typescript
{
  action: 'create_deal',
  dealData: {
    title: 'Enterprise Deal',
    value: 50000,
    currency: 'USD',
    stage: 'prospecting',
    contactId: '123',  // Link to contact
    expectedCloseDate: '2025-12-31'
  }
}
```

### **Response:**

```json
{
  "action": "create_deal",
  "dealId": "456",
  "deal": {
    "id": "456",
    "title": "Enterprise Deal",
    "value": 50000,
    "currency": "USD",
    "stage": "prospecting",
    "createdAt": "2025-11-02T00:00:00Z"
  }
}
```

---

## 📈 Workflow Examples

### **Example 1: Auto-Create CRM Contacts**

```
Natural Language:
"When a new lead fills out the form, create a contact in HubSpot"

Workflow:
[Trigger: New Lead Form]
  ↓
[HubSpot: Create Contact]
  contactData: {
    firstName: '{{form.firstName}}',
    lastName: '{{form.lastName}}',
    email: '{{form.email}}',
    company: '{{form.company}}'
  }
  ↓
[Slack: Notify Sales]
  text: '✅ New contact created: {{contact.firstName}} {{contact.lastName}}'
  ↓
[End]
```

### **Example 2: Lead Enrichment Pipeline**

```
Natural Language:
"When a new email comes in, search CRM for the contact, and if not found, create them"

Workflow:
[Gmail: Receive Emails]
  query: 'is:unread'
  ↓
[HubSpot: Search Contacts]
  searchQuery: '{{email.from}}'
  ↓
[Condition: Contact Found?]
  ├─ Yes → [Update Last Contact Date]
  └─ No  → [Create New Contact]
  ↓
[Slack: Notify]
  ↓
[End]
```

### **Example 3: Deal Creation Automation**

```
Natural Language:
"When a prospect schedules a demo, create a deal in Pipedrive and notify sales"

Workflow:
[Trigger: Demo Scheduled]
  ↓
[Pipedrive: Create Contact]
  contactData: '{{prospect.data}}'
  ↓
[Pipedrive: Create Deal]
  dealData: {
    title: 'Demo - {{prospect.company}}',
    value: 25000,
    contactId: '{{contact.id}}'
  }
  ↓
[Slack: Alert #sales]
  text: '📅 Demo scheduled: {{prospect.name}} - Deal created!'
  ↓
[End]
```

---

## 🧪 Testing

### **Run Tests:**

```bash
# All CRM integration tests
pnpm test apps/web/__tests__/integrations/crm

# Specific provider
pnpm test apps/web/__tests__/integrations/crm/hubspot.test.ts
pnpm test apps/web/__tests__/integrations/crm/pipedrive.test.ts
```

### **Test Coverage:**

**HubSpot (7 tests):**

- ✅ OAuth flow
- ✅ Create/update/get contact
- ✅ Create deal
- ✅ Search contacts

**Pipedrive (7 tests):**

- ✅ OAuth flow
- ✅ Create/update/get person
- ✅ Create deal
- ✅ Search persons

---

## 🔒 Security

### **OAuth 2.0:**

- Secure OAuth 2.0 flow for both providers
- Tokens stored in encrypted database
- Automatic token refresh (HubSpot)
- State parameter for CSRF protection

### **Credentials Storage:**

```typescript
// Stored in oauth_tokens table
{
  accessToken: string,
  refreshToken: string,  // HubSpot only
  expiresAt: Date,       // HubSpot only
  tokenType: 'Bearer'
}
```

---

## 🐛 Troubleshooting

### **"CRM integration not connected"**

**Solution:** Go to Settings → Integrations and connect HubSpot or Pipedrive.

### **"Contact not found"**

**Solution:** Verify contact ID is correct, use search to find contacts first.

### **"Invalid credentials"**

**Solution:** Token may have expired (HubSpot) or been revoked. Reconnect in Settings.

### **"Missing required field"**

**Solution:** Ensure contactData includes firstName, lastName, and email at minimum.

---

## 🎯 Best Practices

### **1. Search Before Create:**

Avoid duplicates by searching first:

```
[Search Contact]
  ↓
[Condition: Found?]
  ├─ Yes → [Update Contact]
  └─ No  → [Create Contact]
```

### **2. Link Contacts to Deals:**

Always link deals to contacts for better tracking:

```typescript
{
  action: 'create_deal',
  dealData: {
    title: 'New Deal',
    value: 50000,
    contactId: '{{contact.id}}'  // Link to contact
  }
}
```

### **3. Use Variables:**

Make workflows reusable with variables:

```typescript
contactData: {
  firstName: '{{lead.firstName}}',  // From previous step
  email: '{{lead.email}}'
}
```

### **4. Error Handling:**

Add error handling for CRM operations:

```
[Create Contact]
  ↓
[Condition: Success?]
  ├─ Yes → [Create Deal]
  └─ No  → [Slack: Alert Error]
```

---

## 📊 Field Mapping

### **Contact Fields:**

| Field     | HubSpot Property | Pipedrive Field | Required |
| --------- | ---------------- | --------------- | -------- |
| firstName | firstname        | name (part 1)   | ✅       |
| lastName  | lastname         | name (part 2)   | ✅       |
| email     | email            | email           | ✅       |
| phone     | phone            | phone           | ❌       |
| company   | company          | org_id          | ❌       |
| jobTitle  | jobtitle         | -               | ❌       |

### **Deal Fields:**

| Field             | HubSpot Property | Pipedrive Field     | Required |
| ----------------- | ---------------- | ------------------- | -------- |
| title             | dealname         | title               | ✅       |
| value             | amount           | value               | ✅       |
| currency          | -                | currency            | ❌       |
| stage             | dealstage        | stage_id            | ❌       |
| contactId         | associations     | person_id           | ❌       |
| expectedCloseDate | closedate        | expected_close_date | ❌       |

---

## 🔄 Migration Between CRMs

You can easily migrate data between HubSpot and Pipedrive:

```
[HubSpot: Get Contacts]
  ↓
[Loop: Each Contact]
  ↓
[Pipedrive: Create Person]
  contactData: '{{contact}}'
  ↓
[End Loop]
```

---

## 📚 API Reference

### **Authorization Endpoints:**

```
GET /api/integrations/hubspot/authorize?workspaceId={id}
GET /api/integrations/pipedrive/authorize?workspaceId={id}
```

### **Callback Endpoints:**

```
GET /api/integrations/hubspot/callback?code=...&state=...
GET /api/integrations/pipedrive/callback?code=...&state=...
```

### **Execution Endpoint:**

```
POST /api/workflows/execute-integration

Body: {
  nodeId: string,
  integration: 'hubspot' | 'pipedrive',
  config: CRMIntegrationConfig,
  workspaceId: string,
  variables?: Record<string, any>,
  previousResults?: Record<string, any>
}
```

---

## 📞 Support

**Need help?**

- Check troubleshooting section above
- View test examples: `apps/web/__tests__/integrations/crm/`
- Review source code: `apps/web/lib/integrations/crm/`
- HubSpot API: [developers.hubspot.com](https://developers.hubspot.com/)
- Pipedrive API: [developers.pipedrive.com](https://developers.pipedrive.com/)

---

**Status:** ✅ Production Ready  
**Tests:** 14+ comprehensive tests  
**Coverage:** OAuth, Contacts, Deals, Search, Errors  
**Providers:** HubSpot, Pipedrive
