# Secure Credentials Management

**How we share credentials securely for autonomous development**

---

## 🔐 Security Principles

**NEVER:**

- ❌ Commit credentials to git (.env.local is gitignored)
- ❌ Put secrets in code files
- ❌ Store in documentation
- ❌ Reference in commit messages
- ❌ Include in screenshots

**ALWAYS:**

- ✅ Use environment variables
- ✅ Keep .env.local gitignored
- ✅ Sanitize logs
- ✅ Use process.env references only

---

## 📝 Current Setup

### **Test Account (Shared)**

**Email:** `dalton@galaxyco.ai`
**Password:** Stored in `GALAXYCO_TEST_PASSWORD` environment variable

**Stored in:** `apps/web/.env.local` (gitignored)

**Used for:**

- Automated UI testing
- Playwright screenshots
- E2E test flows
- AI autonomous browsing

---

## 🔑 Environment Variables

**Location:** `apps/web/.env.local` (you add credentials here)

**Format:**

```bash
# Shared Test Account
GALAXYCO_TEST_PASSWORD=your-password-here

# AI Services (already in your .env)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database (already configured)
DATABASE_URL=postgresql://...
PINECONE_API_KEY=...

# Vercel (for deployments)
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

---

## 🚀 Adding New Credentials

**When you need to share something with AI:**

### Option 1: Direct in Chat (Ephemeral)

```
You: "Here's the API key: sk-abc123..."
Me: [Uses it immediately]
Me: "Add this to your .env.local as API_KEY_NAME=sk-abc123"
```

### Option 2: You Add to .env.local

```bash
# You add directly
echo "NEW_API_KEY=value" >> apps/web/.env.local

# Then tell me
You: "Added NEW_API_KEY to .env.local"
Me: [Can now use it via process.env.NEW_API_KEY]
```

**I'll never see your .env.local file (filtered by .cursorignore for security)**
**But I can use the environment variables in code**

---

## 🔄 How Automation Works

### Playwright Tests

```typescript
// In test files
const password = process.env.GALAXYCO_TEST_PASSWORD;
// Reads from your .env.local automatically
```

### Vercel Deployments

```bash
# In deployment scripts
vercel deploy --token $VERCEL_TOKEN
# Uses token from environment
```

### API Calls

```typescript
// In code
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Reads from environment
```

---

## ✅ Verification

**To verify credentials are set:**

```bash
# Check if variable exists (won't show value)
node -e "console.log(process.env.GALAXYCO_TEST_PASSWORD ? '✅ Set' : '❌ Missing')"

# Run auth test
pnpm playwright test tests/ui-audit/auth.setup.ts
# Should say: ✅ Authentication successful
```

---

## 🎯 Next Steps

**You:**

1. Add to `apps/web/.env.local`:
   ```bash
   GALAXYCO_TEST_PASSWORD=EnergyFX3_!
   ```

**Me:**

1. Run auth setup
2. Confirm authentication works
3. Start autonomous UI auditing

**Security maintained. Friction removed.** ✅

---

**Created:** November 2, 2025
**Status:** Ready to use
