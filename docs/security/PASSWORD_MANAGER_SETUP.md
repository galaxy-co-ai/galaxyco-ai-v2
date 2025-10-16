# Password Manager Setup Guide

## Overview

This guide helps you set up a secure password management solution for storing API keys, database credentials, and other sensitive information.

## Recommended Options

### Option 1: Cloud Password Managers (Recommended for Individual Use)

#### **Bitwarden** (Free & Open Source) ⭐ RECOMMENDED

- **Cost:** Free (Premium: $10/year)
- **Platform:** Windows, Mac, Linux, iOS, Android, Browser
- **Features:**
  - End-to-end encryption
  - Zero-knowledge architecture
  - Open source & audited
  - Unlimited passwords on free tier
  - Self-hosting option available

**Setup Steps:**

1. Go to: https://bitwarden.com/
2. Click "Get Started"
3. Create account with strong master password (save this somewhere safe!)
4. Install desktop app: https://bitwarden.com/download/
5. Install browser extension for easy access

**Storing API Keys:**

```
1. Click "+" to add new item
2. Select type: "Login" or "Secure Note"
3. Name: "GalaxyCo - OpenAI API Key"
4. Username: (leave blank or use "openai")
5. Password: sk-proj-YOUR_KEY_HERE
6. Notes: Generated 2025-10-12, Used for: Production AI agents
7. Save
```

#### **1Password**

- **Cost:** $2.99/month individual
- **Platform:** All platforms
- **Features:** Premium UI, family sharing, travel mode
- **Website:** https://1password.com/

#### **LastPass**

- **Cost:** Free (Premium: $3/month)
- **Platform:** All platforms
- **Features:** Auto-fill, password generator
- **Website:** https://www.lastpass.com/

### Option 2: Local Encrypted Storage (For Advanced Users)

#### **Pass** (Unix Password Manager)

- **Cost:** Free
- **Platform:** Linux, Mac, Windows (WSL)
- **Features:** GPG-encrypted, git-based, command-line
- **Setup:** See instructions below

#### **KeePassXC**

- **Cost:** Free & Open Source
- **Platform:** Windows, Mac, Linux
- **Features:** Offline, encrypted database file
- **Website:** https://keepassxc.org/

### Option 3: Development-Focused Tools

#### **Doppler** (For Teams)

- **Cost:** Free for 5 users
- **Platform:** Web, CLI
- **Features:** Secrets sync, audit logs, integrations
- **Website:** https://www.doppler.com/

## Quick Setup: Bitwarden (5 minutes)

This is the easiest and most secure option for individual developers.

### Step 1: Install Bitwarden

**Windows:**

```bash
# Download installer
curl -LO https://vault.bitwarden.com/download/?app=desktop&platform=windows

# Or visit: https://bitwarden.com/download/
```

**Mac:**

```bash
brew install --cask bitwarden
```

**Linux:**

```bash
# AppImage available at: https://bitwarden.com/download/
```

### Step 2: Create Account

1. Open Bitwarden app
2. Click "Create Account"
3. Enter email address
4. Create STRONG master password (example: `correct-horse-battery-staple-2025!`)
5. **CRITICAL:** Write down your master password on paper and store it safely
6. Verify email
7. Log in

### Step 3: Add Your API Keys

**OpenAI API Key:**

```
Type: Secure Note (or Login)
Name: GalaxyCo - OpenAI API Key
Notes:
  API Key: sk-proj-YOUR_KEY_HERE
  Generated: 2025-10-12
  Purpose: AI agent completions
  Environment: Production & Development
  Project: GalaxyCo.ai v2.0
```

**Anthropic API Key:**

```
Type: Secure Note (or Login)
Name: GalaxyCo - Anthropic API Key
Notes:
  API Key: sk-ant-YOUR_KEY_HERE
  Generated: 2025-10-12
  Purpose: AI agent fallback provider
  Environment: Production & Development
  Project: GalaxyCo.ai v2.0
```

**Database URL:**

```
Type: Login
Name: GalaxyCo - Database (Neon/Vercel)
Username: (your database username)
Password: (your database password)
Notes:
  Full URL: postgresql://user:pass@host:port/database
  Provider: Neon/Vercel Postgres
  Environment: Production
```

### Step 4: Install Browser Extension

1. Go to browser extension store
2. Search "Bitwarden"
3. Install extension
4. Log in with your master password
5. Now you can auto-fill credentials!

## Current API Keys to Store

Based on your project, store these:

### 1. AI Provider Keys

- ✅ OpenAI API Key (NEW - Generated 2025-10-12)
- ✅ Anthropic API Key (NEW - Generated 2025-10-12)
- Google AI Key (if applicable)

### 2. Database & Infrastructure

- Vercel Auth Token
- Database Connection URL
- Clerk Secret Key
- Clerk Publishable Key

### 3. Third-Party Services

- Sentry DSN
- Any other API keys you're using

## Password Manager CLI (Optional)

Bitwarden has a CLI for automation:

```bash
# Install
npm install -g @bitwarden/cli

# Login
bw login

# Get an API key
bw get item "GalaxyCo - OpenAI API Key"

# Copy to clipboard
bw get password "GalaxyCo - OpenAI API Key" | clip
```

## Security Best Practices

### 1. Master Password

- **Use a strong, unique password** (20+ characters)
- **Never reuse** your master password
- **Write it down** and store in a safe physical location
- Consider using a passphrase: `correct-horse-battery-staple-2025!`

### 2. Two-Factor Authentication

Enable 2FA on your password manager:

1. Bitwarden → Settings → Security → Two-step Login
2. Use Authy or Google Authenticator app
3. Save recovery codes in a safe place

### 3. Regular Backups

- Bitwarden: Settings → Export Vault (encrypted)
- Store backup in separate secure location

### 4. Regular Key Rotation

Set calendar reminders:

- API Keys: Every 90 days
- Database passwords: Every 180 days
- Master password: Annually

## Emergency Access

### If You Forget Your Master Password

**Bitwarden:**

- Cannot be recovered (zero-knowledge architecture)
- Use your emergency kit (write down password)
- Set up Emergency Access for trusted person

**Important:** Write down your master password NOW:

```
My Bitwarden Master Password:
_________________________________

Date Created: 2025-10-12
Stored Location: _______________
```

### Recovery Plan

1. **Master password written down:** Store in fireproof safe
2. **Recovery codes saved:** For 2FA backup
3. **Vault export:** Encrypted backup in separate location
4. **Emergency contact:** Trusted person with emergency access

## Integration with Development

### Environment Variables Script

Create a helper script to load from password manager:

```bash
#!/bin/bash
# load-env-from-bitwarden.sh

# Login to Bitwarden CLI
bw login

# Get session key
export BW_SESSION=$(bw unlock --raw)

# Load environment variables
export OPENAI_API_KEY=$(bw get password "GalaxyCo - OpenAI API Key")
export ANTHROPIC_API_KEY=$(bw get password "GalaxyCo - Anthropic API Key")

echo "✅ Environment variables loaded from Bitwarden"
```

Usage:

```bash
source load-env-from-bitwarden.sh
npm run dev
```

## Quick Reference Card

Print this and keep it safe:

```
═══════════════════════════════════════════
  GALAXYCO.AI - PASSWORD MANAGER CARD
═══════════════════════════════════════════

Password Manager: Bitwarden
Website: https://bitwarden.com/
Email: _______________________________
Master Password Location: _____________

Important Items:
  ☐ OpenAI API Key
  ☐ Anthropic API Key
  ☐ Database Credentials
  ☐ Vercel Tokens
  ☐ Clerk Keys

Emergency Access:
  Name: _______________________________
  Email: ______________________________

Recovery Codes Location: ______________

Last Updated: 2025-10-12
═══════════════════════════════════════════
```

## Next Steps

1. ✅ Choose a password manager (Bitwarden recommended)
2. ✅ Create account and set up 2FA
3. ✅ Store your current API keys
4. ✅ Install browser extension
5. ✅ Write down master password in safe place
6. ✅ Export encrypted backup

## Need Help?

- Bitwarden Help: https://bitwarden.com/help/
- Password strength checker: https://www.security.org/how-secure-is-my-password/
- This project's security docs: `docs/security/`

---

**Remember:** Your master password is the key to everything. Choose wisely, store safely, never forget!
