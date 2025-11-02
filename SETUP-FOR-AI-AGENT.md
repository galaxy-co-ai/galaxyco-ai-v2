# Setup for AI Agent - One-Time Configuration

**Quick setup to enable autonomous testing and UI review**

---

## ⚡ **Step 1: Add Test Credentials (30 seconds)**

**Add this line to `apps/web/.env.local`:**

```bash
GALAXYCO_TEST_PASSWORD=EnergyFX3_!
```

**How to do it:**

### Option A: Command Line (Fastest)

```bash
# Run this in terminal
echo "GALAXYCO_TEST_PASSWORD=EnergyFX3_!" >> apps/web/.env.local
```

### Option B: Manual (Open file and paste)

```bash
# Open apps/web/.env.local in editor
# Add the line above
# Save
```

---

## ⚡ **Step 2: Verify Setup (10 seconds)**

```bash
# Test that credential is set
cd apps/web
node -e "console.log(process.env.GALAXYCO_TEST_PASSWORD ? '✅ Ready' : '❌ Not found')"
```

**Should say:** ✅ Ready

---

## ⚡ **Step 3: I Do Everything Else**

**You're done!** I'll now:

- ✅ Run auth setup (saves login state)
- ✅ Screenshot entire app
- ✅ Audit UI automatically
- ✅ Run codebase analysis
- ✅ Show you comprehensive reports

**No more manual work needed.**

---

## 🔐 Security Notes

**This password:**

- ✅ Is stored in .env.local (gitignored - never committed)
- ✅ Is used only for automated testing
- ✅ Accesses shared test account (dalton@galaxyco.ai)
- ✅ Is sanitized from logs and screenshots

**Safe to use for:**

- Automated UI testing
- Screenshot generation
- E2E test flows
- AI autonomous browsing

---

## ✅ That's It!

**After you add that one line to .env.local, I'm fully autonomous for:**

- UI review and iteration
- Screenshot-based analysis
- E2E testing
- Visual regression testing

**Total setup time: 30 seconds**
**Value: Infinite** (autonomous UI iteration)

---

**Just let me know when you've added it and I'll start the audit!**
