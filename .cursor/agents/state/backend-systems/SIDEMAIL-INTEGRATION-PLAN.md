# 🟢 Sidemail Integration Plan - Phase 2

**Status:** 🔵 Planned - Waiting for Sidemail account credentials  
**Priority:** HIGH - Strategic email platform upgrade  
**Estimated Duration:** 4-6 hours  
**Dependencies:** Sidemail account credentials

---

## 🎯 Objective

**Replace Gmail OAuth as primary email platform with Sidemail for:**
- Transactional emails (password resets, welcome emails, notifications)
- Email marketing campaigns (newsletters, product updates)
- Email automation sequences (onboarding, conversion, churn prevention)
- Contact management (unlimited subscribers, segmentation)

**Keep Gmail OAuth for:**
- User-initiated personal emails (if users explicitly want to send from their own Gmail)
- Specific workflows requiring user's personal email account

---

## 📚 Why Sidemail?

### Complete Email Platform
- ✅ Transactional emails (API-based)
- ✅ Email marketing campaigns (bulk newsletters)
- ✅ Email automation (trigger-based sequences)
- ✅ Contact management (unlimited subscribers)
- ✅ No-code email editor (perfect for non-technical users)
- ✅ Analytics & tracking (open rates, deliveries, bounces)

### Cost-Effective
- $14-19/month for 1,000 emails (all features included)
- Unlimited contacts (no per-subscriber fees)
- Scales with volume

### Developer-Friendly
- REST API (easy integration)
- Code samples (multiple languages)
- Webhooks (real-time events)
- MCP server support

### Strategic Fit
- Natural language first: No-code editor fits non-technical users
- Visual feedback: Real-time analytics and tracking
- AI-powered: Automation can trigger from AI agent actions
- Multi-tenant ready: API supports workspace/user isolation

---

## 🏗️ Implementation Plan

### Step 1: Sidemail API Client (1 hour)
**File:** `apps/web/lib/integrations/sidemail/api.ts`

**Responsibilities:**
- Initialize Sidemail client with API key
- Send transactional emails via API
- Create/update contact profiles
- Trigger email sequences
- Handle errors and retries

**Implementation:**
```typescript
import { configureSidemail } from 'sidemail';

const sidemail = configureSidemail({ 
  apiKey: process.env.SIDEMAIL_API_KEY 
});

export async function sendTransactionalEmail({
  toAddress,
  fromAddress,
  fromName,
  templateName,
  templateProps,
}: {
  toAddress: string;
  fromAddress: string;
  fromName: string;
  templateName: string;
  templateProps: Record<string, any>;
}) {
  return await sidemail.sendEmail({
    toAddress,
    fromAddress,
    fromName,
    templateName,
    templateProps,
  });
}
```

---

### Step 2: Server Actions for Sidemail (1.5 hours)
**File:** `apps/web/lib/actions/sidemail-actions.ts`

**Actions to Create:**
- `sendTransactionalEmail()` - Send transactional emails
- `syncUserToSidemail()` - Sync GalaxyCo user to Sidemail contact
- `updateContactProperties()` - Update contact properties in Sidemail
- `triggerEmailSequence()` - Trigger automation sequence
- `sendMarketingEmail()` - Send marketing campaign

**Pattern:**
```typescript
'use server'

import { sendTransactionalEmail } from '@/lib/integrations/sidemail/api';
import { db } from '@galaxyco/database';
import { z } from 'zod';

const sendEmailSchema = z.object({
  toAddress: z.string().email(),
  templateName: z.string(),
  templateProps: z.record(z.any()),
  workspaceId: z.string(),
});

export async function sendTransactionalEmailAction(data: unknown) {
  const validated = sendEmailSchema.parse(data);
  
  // Multi-tenant security check
  const workspace = await getWorkspace(validated.workspaceId);
  if (!workspace) {
    return { success: false, error: 'Workspace not found' };
  }
  
  try {
    const result = await sendTransactionalEmail({
      toAddress: validated.toAddress,
      fromAddress: workspace.emailFrom || 'noreply@galaxyco.ai',
      fromName: workspace.name || 'GalaxyCo',
      templateName: validated.templateName,
      templateProps: validated.templateProps,
    });
    
    return { success: true, data: result };
  } catch (error) {
    logger.error('Sidemail send error', error);
    return { 
      success: false, 
      error: 'Failed to send email. Please try again.' 
    };
  }
}
```

---

### Step 3: User Sync to Sidemail (1 hour)
**File:** `apps/web/lib/integrations/sidemail/contact-sync.ts`

**Functionality:**
- Sync GalaxyCo users to Sidemail contacts on signup
- Update contact properties when user data changes
- Sync workspace membership and plan information
- Handle unsubscribe events from Sidemail

**Implementation:**
```typescript
export async function syncUserToSidemail({
  userId,
  workspaceId,
  email,
  properties,
}: {
  userId: string;
  workspaceId: string;
  email: string;
  properties: Record<string, any>;
}) {
  await sidemail.contacts.createOrUpdate({
    emailAddress: email,
    identifier: userId,
    customProps: {
      workspace_id: workspaceId,
      ...properties,
    },
  });
}
```

**Integration Points:**
- Hook into user creation (Clerk webhook)
- Hook into workspace membership changes
- Hook into plan upgrades/downgrades
- Periodic sync job (ensure data consistency)

---

### Step 4: Email Automation Sequences (1 hour)
**File:** `apps/web/lib/integrations/sidemail/automation.ts`

**Automation Sequences to Create:**
1. **Onboarding Sequence** (3-5 emails)
   - Day 0: Welcome email with setup guide
   - Day 1: Feature highlights
   - Day 3: First workflow creation prompt
   - Day 7: Getting started tips

2. **Trial-to-Paid Conversion** (3 emails)
   - Day 14: Trial ending reminder
   - Day 19: Last chance to upgrade
   - Day 21: Trial expired (upgrade prompt)

3. **Re-engagement** (2 emails)
   - Inactive 7 days: Check-in email
   - Inactive 14 days: Feature updates email

**Implementation:**
```typescript
export async function triggerOnboardingSequence(userId: string) {
  await sidemail.automations.trigger({
    automationId: 'onboarding-sequence',
    contactIdentifier: userId,
  });
}
```

---

### Step 5: Replace Gmail OAuth for System Emails (1 hour)
**File:** `apps/web/lib/integrations/email-service.ts`

**Decision Logic:**
- System emails → Use Sidemail
- User-initiated emails → Use Gmail OAuth (if user connected)

**Implementation:**
```typescript
export async function sendEmail({
  type,
  toAddress,
  templateName,
  templateProps,
  userId,
  workspaceId,
}: {
  type: 'system' | 'user-initiated';
  toAddress: string;
  templateName: string;
  templateProps: Record<string, any>;
  userId?: string;
  workspaceId: string;
}) {
  if (type === 'system') {
    // Use Sidemail
    return await sendTransactionalEmail({
      toAddress,
      templateName,
      templateProps,
      workspaceId,
    });
  } else {
    // Use Gmail OAuth (if user connected)
    const gmailIntegration = await getGmailIntegration(userId);
    if (!gmailIntegration) {
      throw new Error('Gmail integration not connected');
    }
    return await sendGmailEmail({
      connectionId: gmailIntegration.connectionId,
      to: toAddress,
      subject: templateProps.subject,
      body: templateProps.body,
    });
  }
}
```

---

### Step 6: Update Workflow Execution (30 min)
**File:** `apps/web/app/api/workflows/execute-integration/route.ts`

**Changes:**
- Add Sidemail as email integration option
- Route system emails to Sidemail
- Keep Gmail OAuth for user-initiated workflows

---

## 📊 Integration Checklist

### Setup
- [ ] Create Sidemail account
- [ ] Get API key from dashboard
- [ ] Install Sidemail SDK: `pnpm add sidemail`
- [ ] Add environment variables:
  - `SIDEMAIL_API_KEY`
  - `SIDEMAIL_PROJECT_ID` (if applicable)

### Implementation
- [ ] Create Sidemail API client (`api.ts`)
- [ ] Create Server Actions (`sidemail-actions.ts`)
- [ ] Implement contact sync (`contact-sync.ts`)
- [ ] Create automation sequences (`automation.ts`)
- [ ] Update email service routing (`email-service.ts`)
- [ ] Update workflow execution (`execute-integration/route.ts`)

### Email Templates
- [ ] Welcome email template
- [ ] Password reset template
- [ ] Account activation template
- [ ] Trial ending reminder template
- [ ] Payment receipt template
- [ ] Onboarding sequence templates (3-5 emails)

### Testing
- [ ] Test transactional email sending
- [ ] Test contact sync (create/update)
- [ ] Test automation triggers
- [ ] Test email delivery (check inbox)
- [ ] Test multi-tenant isolation
- [ ] Test error handling

### Documentation
- [ ] Document Sidemail integration
- [ ] Update API documentation
- [ ] Create email template guide
- [ ] Document automation sequences

---

## 🔄 Migration Strategy

### Phase 1: Parallel Running
- Keep Gmail OAuth working
- Add Sidemail alongside
- Route new emails to Sidemail
- Gradually migrate existing emails

### Phase 2: Full Migration
- Route all system emails to Sidemail
- Keep Gmail OAuth only for user-initiated emails
- Monitor delivery rates and performance

### Phase 3: Optimization
- Fine-tune automation sequences
- Optimize contact sync frequency
- A/B test email templates

---

## 📈 Expected Outcomes

### Immediate Value
- ✅ Professional transactional emails
- ✅ Email automation sequences (onboarding, conversion)
- ✅ Marketing campaign capability
- ✅ Better deliverability (no spam folder)

### Strategic Value
- ✅ Unified email platform (one service vs multiple)
- ✅ Cost savings ($14-19/month vs $20+ for multiple services)
- ✅ Better UX (no-code editor for non-technical users)
- ✅ Competitive advantage (automation sequences)

---

## 🚨 Dependencies & Blockers

### Current Blockers
- ❌ Waiting for Sidemail account credentials

### No Blockers Once Credentials Available
- ✅ SDK available (`sidemail` npm package)
- ✅ API documentation complete
- ✅ Integration plan ready
- ✅ Code patterns established

---

## 📝 Files to Create/Modify

### New Files
1. `apps/web/lib/integrations/sidemail/api.ts` - API client
2. `apps/web/lib/integrations/sidemail/actions.ts` - Server Actions
3. `apps/web/lib/integrations/sidemail/contact-sync.ts` - Contact sync
4. `apps/web/lib/integrations/sidemail/automation.ts` - Automation sequences
5. `apps/web/lib/integrations/email-service.ts` - Email routing logic

### Modified Files
1. `apps/web/app/api/workflows/execute-integration/route.ts` - Add Sidemail option
2. `.env.example` - Add Sidemail environment variables
3. `package.json` - Add `sidemail` dependency

---

## ✅ Success Criteria

- [ ] Sidemail API client working
- [ ] Transactional emails sending successfully
- [ ] Contact sync working (users appear in Sidemail)
- [ ] Automation sequences triggering correctly
- [ ] Email delivery rate > 95%
- [ ] Multi-tenant isolation enforced
- [ ] Error handling comprehensive

---

## 🎯 Next Steps

1. **Wait for Sidemail account credentials**
2. **Once credentials available:**
   - Install Sidemail SDK
   - Create API client
   - Implement Server Actions
   - Test email sending
   - Deploy to production

---

**Status:** 🔵 Ready to implement - Waiting for credentials  
**Estimated Start:** After Phase 1 completion + credentials available  
**Priority:** HIGH - Strategic email platform upgrade

