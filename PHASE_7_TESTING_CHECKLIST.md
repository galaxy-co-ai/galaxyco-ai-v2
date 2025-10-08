# Phase 7: Complete Testing Checklist

**Date**: 2025-10-08  
**Tester**: Ready for manual testing  
**Environment**: Local Development

---

## ✅ Pre-Test Setup

### 1. Start All Services

```bash
# Terminal 1: Next.js Web App
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web
pnpm dev
# Should run on: http://localhost:3000

# Terminal 2: NestJS API
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/api
pnpm dev
# Should run on: http://localhost:4000

# Terminal 3: Python FastAPI (optional for Phase 7)
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/services/agents
uvicorn app:app --reload
# Should run on: http://localhost:5001
```

### 2. Database Check
- [ ] Neon database is accessible
- [ ] Drizzle schema is up to date
- [ ] No pending migrations

### 3. Environment Variables
- [ ] Clerk keys are set
- [ ] Database URL is correct
- [ ] All `.env.local` files are present

---

## 📋 Test Scenarios

### Scenario 1: New User Onboarding (Founder Role)

**Goal**: Test complete onboarding flow for a Founder persona

**Steps**:
1. [ ] Visit `http://localhost:3000`
2. [ ] Click "Sign Up"
3. [ ] Create a new account (use test email: `test+founder@example.com`)
4. [ ] Verify redirect to `/onboarding`
5. [ ] **Step 1 - Welcome**:
   - [ ] See welcome message with 🚀 icon
   - [ ] "Get Started" button is visible
   - [ ] Click "Get Started"
6. [ ] **Step 2 - Role & Industry**:
   - [ ] Select "Founder" role
   - [ ] Verify founder card is highlighted
   - [ ] Select "Technology" industry from dropdown
   - [ ] Verify "Continue →" button is enabled
   - [ ] Click "Continue →"
7. [ ] **Step 3 - Pain Points**:
   - [ ] Type in free text: "Too many meetings, not enough time for strategy"
   - [ ] Click "Reporting" chip
   - [ ] Click "Meeting notes" chip
   - [ ] Verify chips are highlighted
   - [ ] Click "Continue →"
8. [ ] **Step 4 - Tools**:
   - [ ] Select "Gmail", "Slack", "Google Drive", "Notion"
   - [ ] Verify selected tools are highlighted
   - [ ] Click "Continue →"
9. [ ] **Step 5 - Data Sensitivity**:
   - [ ] Click "No" (standard security)
   - [ ] Verify button is highlighted
   - [ ] Click "Continue →"
10. [ ] **Step 6 - Summary**:
    - [ ] Verify recommended pack is "Founder Ops" (🚀)
    - [ ] See 3 agents listed: Daily Digest, Doc Analyzer, Meeting Prep
    - [ ] Click "Create My Workspace"
11. [ ] **Verify Redirect**:
    - [ ] Redirects to `/dashboard`
    - [ ] No errors in browser console

**Expected Results**:
- ✅ Workspace created with name like "First's Founder Ops Workspace"
- ✅ Onboarding profile saved in `workspaces.settings`
- ✅ User added as workspace owner

---

### Scenario 2: Dashboard First Load (Founder)

**Goal**: Verify personalized dashboard renders correctly

**Steps**:
1. [ ] **Header Section**:
   - [ ] See "Welcome back, [Name]! 👋"
   - [ ] See workspace name
   - [ ] See user role (Owner)
   - [ ] "Create Agent" button visible
2. [ ] **Starter Pack Banner**:
   - [ ] See gradient card with 🚀 icon
   - [ ] Title: "Founder Ops is ready"
   - [ ] Description mentions the pack
   - [ ] "View Pack Details" button present
3. [ ] **Progress Tracker (Right Sidebar)**:
   - [ ] "Setup Progress" card visible
   - [ ] Progress bar shows 25% (1/4 complete)
   - [ ] Step 1 "Complete your profile" has ✓ checkmark
   - [ ] Step 2 "Enable your first agent" is pending
   - [ ] Step 3 "Connect your tools" is pending
   - [ ] Step 4 "Explore the marketplace" is pending
4. [ ] **Next Best Actions**:
   - [ ] 3 action cards visible
   - [ ] Card 1: "Enable your first agent" (🤖)
   - [ ] Card 2: "Connect your tools" (🔗)
   - [ ] Card 3: "Explore Marketplace" (🛍️)
   - [ ] All cards have hover effects
5. [ ] **Your Agents Section**:
   - [ ] Title: "Your Agents (Founder Ops)"
   - [ ] 3 agent cards visible:
     - [ ] Daily Digest Agent (📧)
     - [ ] Document Analyzer (📄)
     - [ ] Meeting Prep Assistant (📅)
   - [ ] Each card shows:
     - [ ] Icon and name
     - [ ] Description
     - [ ] Status badge (DRAFT)
     - [ ] Stats: 0% success, 0h saved, 0 usage
     - [ ] Integration chips
     - [ ] "Enable" and "Configure" buttons
6. [ ] **Recent Activity**:
   - [ ] Empty state with 📊 icon
   - [ ] Message: "No activity yet"
7. [ ] **Product Tour**:
   - [ ] Tour overlay appears automatically after 500ms
   - [ ] Step 1/5: "Welcome to GalaxyCo.ai!"
   - [ ] Click "Next →"
   - [ ] Step 2/5: "Track Your Setup Progress"
   - [ ] Click "Next →"
   - [ ] Step 3/5: "Your Agents"
   - [ ] Click "Next →"
   - [ ] Step 4/5: "Next Best Actions"
   - [ ] Click "Next →"
   - [ ] Step 5/5: "Create Custom Agents"
   - [ ] Click "Get Started 🚀"
   - [ ] Tour disappears
   - [ ] Refresh page - tour does NOT appear again

**Expected Results**:
- ✅ All sections render correctly
- ✅ No blank states (sample data everywhere)
- ✅ Progress tracker shows correct completion
- ✅ Tour only shows once per user

---

### Scenario 3: New User Onboarding (Sales Role)

**Goal**: Test pack derivation for Sales persona

**Steps**:
1. [ ] Sign out (if logged in)
2. [ ] Create new account: `test+sales@example.com`
3. [ ] Complete onboarding:
   - [ ] Role: **Sales**
   - [ ] Industry: **E-commerce**
   - [ ] Pain Points: Select "Lead follow-up" chip
   - [ ] Tools: Select "Gmail", "HubSpot", "Salesforce"
   - [ ] Sensitivity: **No**
4. [ ] **Verify Summary**:
   - [ ] Recommended pack: "Sales Ops" (📈)
   - [ ] 3 agents: Lead Enrichment, Follow-up Writer, Pipeline Tracker
5. [ ] **Verify Dashboard**:
   - [ ] Banner shows "Sales Ops is ready"
   - [ ] 3 Sales Ops agents visible with correct icons

**Expected Results**:
- ✅ Correct pack derived (Sales Ops, not Founder Ops)
- ✅ Dashboard personalized for Sales role

---

### Scenario 4: New User Onboarding (Support Role)

**Goal**: Test pack derivation for Support persona

**Steps**:
1. [ ] Sign out
2. [ ] Create new account: `test+support@example.com`
3. [ ] Complete onboarding:
   - [ ] Role: **Support**
   - [ ] Industry: **Technology**
   - [ ] Pain Points: Select "Customer tickets"
   - [ ] Tools: Select "Slack", "Zendesk"
   - [ ] Sensitivity: **Yes** (sensitive data)
4. [ ] **Verify Summary**:
   - [ ] Recommended pack: "Support Excellence" (💬)
   - [ ] 3 agents: Ticket Triage, Response Drafter, Sentiment Monitor
5. [ ] **Verify Dashboard**:
   - [ ] Banner shows "Support Excellence is ready"
   - [ ] 3 Support agents visible

**Expected Results**:
- ✅ Correct pack derived (Support Excellence)
- ✅ Sensitivity flag saved in settings

---

### Scenario 5: Back Navigation During Onboarding

**Goal**: Test back button preserves state

**Steps**:
1. [ ] Start new onboarding flow
2. [ ] Step 2: Select "Product" role, "Healthcare" industry
3. [ ] Click "Continue →"
4. [ ] Step 3: Add pain points
5. [ ] Click "Continue →"
6. [ ] Step 4: Select tools
7. [ ] **Click "← Back"**
8. [ ] **Verify**:
   - [ ] Returns to Step 3
   - [ ] Pain points still selected
9. [ ] **Click "← Back" again**
10. [ ] **Verify**:
    - [ ] Returns to Step 2
    - [ ] Role and industry still selected
11. [ ] Click "Continue →" twice to reach Step 4
12. [ ] Verify tools are still selected

**Expected Results**:
- ✅ All form state is preserved on back navigation
- ✅ No data loss

---

### Scenario 6: Onboarding Validation

**Goal**: Test form validation

**Steps**:
1. [ ] Start new onboarding
2. [ ] Step 1: Click "Get Started"
3. [ ] Step 2: Try clicking "Continue →" without selecting role
   - [ ] **Verify**: Button is disabled
4. [ ] Select role but leave industry blank
   - [ ] **Verify**: Button still disabled
5. [ ] Select industry
   - [ ] **Verify**: Button is now enabled
6. [ ] Step 3: Leave both free text and chips empty
   - [ ] **Verify**: Button is disabled
7. [ ] Add free text OR select a chip
   - [ ] **Verify**: Button is enabled
8. [ ] Step 4: Don't select any tools
   - [ ] **Verify**: Button is enabled (tools are optional)
9. [ ] Step 5: Don't select Yes or No
   - [ ] **Verify**: Button is disabled
10. [ ] Select either option
    - [ ] **Verify**: Button is enabled

**Expected Results**:
- ✅ Required fields are enforced
- ✅ Optional fields don't block progress

---

### Scenario 7: UI/UX Polish

**Goal**: Verify design system implementation

**Steps**:
1. [ ] **Typography**:
   - [ ] All text uses Inter/system fonts
   - [ ] Headings have proper hierarchy (H1 > H2 > H3)
   - [ ] Font sizes match design system
2. [ ] **Colors**:
   - [ ] Primary color is #4d6fff
   - [ ] Neutrals are clean and consistent
   - [ ] Success/error colors are semantic
3. [ ] **Animations**:
   - [ ] Progress bar transition is smooth (320ms)
   - [ ] Button hovers lift up (translateY)
   - [ ] Card hovers have shadow increase
   - [ ] All animations feel responsive
4. [ ] **Spacing**:
   - [ ] Consistent padding/margins throughout
   - [ ] No cramped or overly spacious sections
5. [ ] **Interactions**:
   - [ ] Hover states on all clickable elements
   - [ ] Focus states visible (keyboard navigation)
   - [ ] Loading states show when appropriate

**Expected Results**:
- ✅ Design system is consistently applied
- ✅ No visual bugs or inconsistencies

---

### Scenario 8: Mobile Responsiveness (Bonus)

**Goal**: Test mobile layouts

**Steps**:
1. [ ] Open browser DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Test iPhone 12 Pro (390x844)
4. [ ] **Onboarding**:
   - [ ] All steps are readable
   - [ ] Buttons are tappable
   - [ ] Grid layouts stack properly
5. [ ] **Dashboard**:
   - [ ] Two-column layout stacks to one column
   - [ ] Progress tracker appears below main content
   - [ ] Agent cards stack vertically

**Expected Results**:
- ✅ Usable on mobile (basic responsiveness)

---

## 🐛 Known Issues to Document

As you test, document any issues here:

| Issue | Severity | Description | Status |
|-------|----------|-------------|--------|
| Example | Low | Tour button has typo | Fixed |
|  |  |  |  |
|  |  |  |  |

---

## ✅ Final Sign-Off

After completing all tests above:

- [ ] All critical scenarios pass
- [ ] No major bugs found
- [ ] UI/UX meets design spec
- [ ] Performance is acceptable (<3s initial load)
- [ ] Console has no errors
- [ ] Phase 7 is production-ready

---

**Testing Completed By**: _________________  
**Date**: _________________  
**Sign-Off**: _________________  

---

## 🚀 Next Steps After Testing

Once Phase 7 testing is complete:
1. Update `PHASE_7_COMPLETE.md` with test results
2. Commit all Phase 7 changes
3. Update `SESSION_HANDOFF.md`
4. Begin Phase 8: Agent Builder UI
