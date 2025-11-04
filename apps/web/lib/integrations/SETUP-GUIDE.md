# 🚀 Integration Setup Guide - Start to Finish

**Time Required:** 15 minutes  
**Difficulty:** Beginner-friendly  
**Result:** Production-ready integrations

---

## 📋 **Prerequisites**

- [x] GalaxyCo.ai account (you have this!)
- [x] Nango account (free tier is fine)
- [x] Gmail, Slack, or HubSpot account
- [x] 15 minutes of time

---

## 🔧 **Part 1: Nango Configuration** (10 minutes)

### **Step 1: Sign Up for Nango** (2 min)

1. Go to https://www.nango.dev/
2. Click **"Try Nango Cloud"**
3. Sign up (free, no credit card)
4. You'll land on the Nango dashboard

### **Step 2: Get Your Secret Key** (1 min)

1. In Nango dashboard, click **"Environment Settings"** (left sidebar, gear icon)
2. Look for **"Secret Key"** field
3. Click the copy icon
4. **You already have this:** `6c851139-36ac-46f4-ad07-c4d512ecb57b` ✅

### **Step 3: Configure Gmail Integration** (3 min)

1. In Nango dashboard, click **"Integrations"** tab
2. Click **"Configure New Integration"**
3. Search for **"Gmail"** and select it
4. You'll see instructions to set up OAuth:

**A. Create OAuth App in Google:**

1. Go to https://console.cloud.google.com/
2. Create new project (or select existing)
3. Enable **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **"Web application"**
6. Add **Authorized redirect URI:**
   ```
   https://api.nango.dev/oauth/callback
   ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

**B. Configure in Nango:**

1. Paste **Client ID** and **Client Secret** into Nango
2. Add **Scopes** (Nango should auto-populate):
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
3. Click **Save**

### **Step 4: Configure Slack Integration** (2 min)

1. In Nango, click **"Configure New Integration"**
2. Select **"Slack"**

**A. Create Slack App:**

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name: "GalaxyCo.ai"
4. Select your workspace
5. Go to **OAuth & Permissions**
6. Add **Redirect URL:**
   ```
   https://api.nango.dev/oauth/callback
   ```
7. Add **Bot Token Scopes:**
   - `chat:write`
   - `channels:read`
   - `channels:history`
8. Copy **Client ID** and **Client Secret** (under **App Credentials**)

**B. Configure in Nango:**

1. Paste **Client ID** and **Client Secret**
2. Scopes should be:
   - `chat:write`
   - `channels:read`
3. Click **Save**

### **Step 5: Configure HubSpot Integration** (2 min)

1. In Nango, click **"Configure New Integration"**
2. Select **"HubSpot"**

**A. Create HubSpot App:**

1. Go to https://developers.hubspot.com/
2. Click **"Create app"**
3. Name: "GalaxyCo.ai"
4. Go to **Auth** tab
5. Add **Redirect URL:**
   ```
   https://api.nango.dev/oauth/callback
   ```
6. Add **Scopes:**
   - `crm.objects.contacts.write`
   - `crm.objects.contacts.read`
   - `crm.objects.deals.write`
   - `crm.objects.deals.read`
7. Copy **Client ID** and **Client Secret**

**B. Configure in Nango:**

1. Paste **Client ID** and **Client Secret**
2. Add the scopes
3. Click **Save**

---

## ✅ **Part 2: Test Connections in Nango** (3 minutes)

### **Verify Each Integration Works**

For each integration (Gmail, Slack, HubSpot):

1. Go to **"Connections"** tab in Nango
2. Click **"Add Test Connection"**
3. Select the integration
4. Click **"Authorize"**
5. Complete OAuth flow (log in, authorize)
6. Verify connection appears in the list ✅

**If all 3 show "Connected" → You're done with Nango setup! ✅**

---

## 🎯 **Part 3: Use in GalaxyCo** (2 minutes)

### **Test Integration in GalaxyCo.ai**

1. Go to your GalaxyCo.ai app: `http://localhost:3000`
2. Navigate to **Settings** → **Integrations**
3. You should see:
   - ✅ Gmail (Connected)
   - ✅ Slack (Connected)
   - ✅ HubSpot (Connected)

### **Create Your First Real Workflow**

1. Go to **Workflows** → **Examples**
2. Click on **"Auto Lead Capture"**
3. Click **"Use This Workflow"**
4. The Visual Flow Builder opens with the workflow loaded
5. Click **"Test Workflow"**
6. Watch it execute REAL actions! ✨

---

## 🎉 **You're Done!**

You now have:

- ✅ Gmail integration (send/receive emails)
- ✅ Slack integration (post messages)
- ✅ HubSpot integration (manage contacts/deals)
- ✅ 6 pre-built workflow templates
- ✅ Visual Flow Builder with real integrations

---

## 🐛 **Troubleshooting**

### **"Connection not found" in GalaxyCo**

**Problem:** Integration shows as not connected

**Solution:**

1. Go to Nango dashboard → Connections
2. Verify connection exists
3. Check that connection ID matches your userId
4. Try disconnecting and reconnecting in GalaxyCo

### **OAuth Popup Blocked**

**Problem:** OAuth window doesn't open

**Solution:**

1. Allow popups in your browser
2. Try again
3. Should work on second attempt

### **"Invalid redirect URI"**

**Problem:** OAuth fails with redirect error

**Solution:**

1. Double-check redirect URI in provider (Google/Slack/HubSpot)
2. Must exactly match: `https://api.nango.dev/oauth/callback`
3. No trailing slash
4. HTTPS not HTTP

### **"Scope not granted"**

**Problem:** Integration works but some actions fail

**Solution:**

1. Check scopes in Nango configuration
2. Verify scopes match what's in provider OAuth app
3. Reconnect integration to apply new scopes

---

## 📞 **Need Help?**

- **Nango Support:** support@nango.dev (very responsive!)
- **GalaxyCo Support:** support@galaxyco.ai
- **Nango Docs:** https://docs.nango.dev/
- **This Guide:** You're reading it!

---

## 🎯 **Quick Reference**

### **Callback URL** (For all OAuth apps)

```
https://api.nango.dev/oauth/callback
```

### **Gmail Scopes**

```
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/gmail.readonly
```

### **Slack Scopes**

```
chat:write
channels:read
channels:history
users:read
```

### **HubSpot Scopes**

```
crm.objects.contacts.write
crm.objects.contacts.read
crm.objects.deals.write
crm.objects.deals.read
```

---

## ✅ **Completion Checklist**

- [ ] Nango account created
- [ ] Secret key added to `.env.local`
- [ ] Gmail OAuth app created in Google Cloud
- [ ] Gmail configured in Nango
- [ ] Gmail test connection successful
- [ ] Slack app created
- [ ] Slack configured in Nango
- [ ] Slack test connection successful
- [ ] HubSpot app created
- [ ] HubSpot configured in Nango
- [ ] HubSpot test connection successful
- [ ] All 3 integrations show "Connected" in GalaxyCo
- [ ] Tested a workflow example
- [ ] Ready to build custom workflows!

---

**Once all checkboxes are checked, you're ready to automate! 🚀**

**Questions?** Review the [Integration Guide](./INTEGRATION_GUIDE.md) for detailed usage instructions.
