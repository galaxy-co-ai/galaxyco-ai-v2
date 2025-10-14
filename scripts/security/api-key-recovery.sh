#!/bin/bash
# API Key Exposure Recovery Script
# This script helps recover from an API key exposure incident

set -e

echo "=================================="
echo "🚨 API Key Exposure Recovery"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Remove exposed files from git${NC}"
echo "Files to remove:"
echo "  - add-optional-env.sh"
echo "  - apps/web/.env.local.backup"
echo ""

# Check if files exist in git
if git ls-files --error-unmatch add-optional-env.sh 2>/dev/null; then
  echo "⚠️  add-optional-env.sh is tracked by git"
  read -p "Remove from git? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git rm --cached add-optional-env.sh
    echo "✅ Removed add-optional-env.sh from git"
  fi
fi

if git ls-files --error-unmatch apps/web/.env.local.backup 2>/dev/null; then
  echo "⚠️  apps/web/.env.local.backup is tracked by git"
  read -p "Remove from git? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git rm --cached apps/web/.env.local.backup
    echo "✅ Removed apps/web/.env.local.backup from git"
  fi
fi

echo ""
echo -e "${YELLOW}Step 2: Add to .gitignore${NC}"

# Add files to .gitignore if not already there
if ! grep -q "add-optional-env.sh" .gitignore 2>/dev/null; then
  echo "# Prevent accidental key exposure" >> .gitignore
  echo "add-optional-env.sh" >> .gitignore
  echo "*.backup" >> .gitignore
  echo "✅ Added patterns to .gitignore"
fi

echo ""
echo -e "${YELLOW}Step 3: Update .gitignore protection${NC}"

# Ensure comprehensive .gitignore coverage
cat >> .gitignore << 'EOF'

# Additional API key protection
*.env.backup
*.env.local.backup
**/add-optional-env*.sh
**/*.backup
.env.*.backup
EOF

echo "✅ Enhanced .gitignore protection"

echo ""
echo -e "${YELLOW}Step 4: Clean local sensitive files${NC}"

# Securely delete sensitive files
if [ -f "add-optional-env.sh" ]; then
  read -p "Delete add-optional-env.sh locally? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f add-optional-env.sh
    echo "✅ Deleted add-optional-env.sh"
  fi
fi

if [ -f "apps/web/.env.local.backup" ]; then
  read -p "Delete apps/web/.env.local.backup locally? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f apps/web/.env.local.backup
    echo "✅ Deleted apps/web/.env.local.backup"
  fi
fi

echo ""
echo -e "${YELLOW}Step 5: Commit changes${NC}"
echo "Run the following commands:"
echo ""
echo "  git add .gitignore"
echo "  git commit -m 'security: remove exposed API keys and enhance .gitignore'"
echo "  git push origin main"
echo ""

echo -e "${GREEN}=================================="
echo "Next Steps (MANUAL ACTIONS REQUIRED):"
echo "==================================${NC}"
echo ""
echo "1. 🔑 Generate NEW API keys:"
echo "   • OpenAI: https://platform.openai.com/api-keys"
echo "   • Anthropic: https://console.anthropic.com/settings/keys"
echo ""
echo "2. 📝 Update .env.local with NEW keys:"
echo "   • Edit: apps/web/.env.local"
echo "   • Never commit this file!"
echo ""
echo "3. 🔐 Update Vercel environment variables:"
echo "   • Go to: https://vercel.com/YOUR_PROJECT/settings/environment-variables"
echo "   • Update OPENAI_API_KEY"
echo "   • Update ANTHROPIC_API_KEY"
echo ""
echo "4. 🧹 Clean git history (OPTIONAL but recommended):"
echo "   See: scripts/clean-git-history.sh"
echo ""
echo "5. ✅ Test the new keys:"
echo "   • Run: npm run dev"
echo "   • Test: curl http://localhost:3000/api/agents/health?mode=quick"
echo ""
echo -e "${RED}⚠️  IMPORTANT: The exposed keys are ALREADY INVALID${NC}"
echo "   Both providers auto-rotate keys when exposed to public repos"
echo ""
