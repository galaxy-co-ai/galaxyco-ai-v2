# Sentry Authentication Setup

Quick guide to enable automated Sentry monitoring from the terminal.

## ✅ Current Status

- **Sentry DSN**: Configured ✅
- **Error Boundaries**: Installed ✅
- **Agent Tracking**: Instrumented ✅
- **Sentry CLI**: Installed ✅
- **Auth Token**: Not configured yet ⏳

## 🔑 Create Sentry Auth Token (2 minutes)

### Step 1: Go to Sentry Settings

Visit: https://sentry.io/settings/account/api/auth-tokens/

### Step 2: Create New Token

1. Click **"Create New Token"**
2. Name it: `GalaxyCo CLI Monitor`
3. Select scopes:
   - ✅ `project:read`
   - ✅ `org:read`
   - ✅ `event:read`
4. Click **"Create Token"**

### Step 3: Copy Token

You'll see a token like: `sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**IMPORTANT**: Save it immediately - you won't see it again!

### Step 4: Set Environment Variable

#### For Current Session (Temporary)

```bash
export SENTRY_AUTH_TOKEN="sntrys_your_token_here"
```

#### For Permanent Use (Recommended)

**On Windows (Git Bash):**

```bash
echo 'export SENTRY_AUTH_TOKEN="sntrys_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

**On macOS/Linux:**

```bash
echo 'export SENTRY_AUTH_TOKEN="sntrys_your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 5: Verify Setup

```bash
# Test the token
sentry-cli --version

# Fetch recent issues
sentry-cli issues list --status unresolved
```

You should see a list of recent issues (or "No issues found" if none exist).

## 🚀 Using the Monitoring Script

Once the token is set, the monitoring script will automatically fetch Sentry errors:

```bash
# Run once
./scripts/monitor-deployment.sh

# Continuous monitoring (every 30 seconds)
./scripts/monitor-deployment.sh --watch
```

## 📊 What Gets Monitored

With the auth token configured, you'll automatically see:

1. **Real-time error counts** from production
2. **Unresolved issues** in the last hour
3. **Top errors** with direct links to Sentry dashboard
4. **Agent execution errors** with full context (agent ID, workspace, tools used)
5. **Tool execution failures** tagged by tool name

## 🛡️ Security Note

- **Never commit** the auth token to git
- The token is in `.bashrc`/`.zshrc` (ignored by git)
- Tokens can be revoked anytime from Sentry settings
- Create separate tokens for CI/CD environments

## 🔗 Quick Links

- **Sentry Dashboard**: https://sentry.io/organizations/galaxyco-ai/issues/
- **Token Settings**: https://sentry.io/settings/account/api/auth-tokens/
- **Project Settings**: https://sentry.io/organizations/galaxyco-ai/projects/

## ✅ Verification Checklist

- [ ] Created Sentry auth token
- [ ] Added token to environment variables
- [ ] Verified token with `sentry-cli issues list`
- [ ] Ran monitoring script successfully
- [ ] Can see real-time error counts

---

**Need help?** The monitoring script will guide you through setup if the token is missing.
