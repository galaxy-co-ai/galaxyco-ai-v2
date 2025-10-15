#!/bin/bash
# Quick Cleanup - Immediate Actions Only
# Run this FIRST before anything else

echo "🚨 Quick API Key Cleanup"
echo "========================"
echo ""

cd /c/Users/Owner/workspace/galaxyco-ai-2.0

echo "Step 1: Removing exposed files from git..."

# Check and remove add-optional-env.sh
if git ls-files --error-unmatch add-optional-env.sh 2>/dev/null; then
  git rm --cached add-optional-env.sh
  echo "✅ Removed add-optional-env.sh from git tracking"
else
  echo "ℹ️  add-optional-env.sh not tracked by git"
fi

# Check and remove .env.local.backup
if git ls-files --error-unmatch apps/web/.env.local.backup 2>/dev/null; then
  git rm --cached apps/web/.env.local.backup
  echo "✅ Removed apps/web/.env.local.backup from git tracking"
else
  echo "ℹ️  apps/web/.env.local.backup not tracked by git"
fi

echo ""
echo "Step 2: Updating .gitignore..."

# Add protection to .gitignore
cat >> .gitignore << 'EOF'

# Additional API key protection (added 2025-10-12)
*.env.backup
*.env.local.backup
**/add-optional-env*.sh
**/*.backup
.env.*.backup
EOF

echo "✅ Updated .gitignore"

echo ""
echo "Step 3: Staging changes..."
git add .gitignore

echo ""
echo "✅ Quick cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run: git commit -m 'security: remove exposed API keys and enhance .gitignore'"
echo "2. Run: git push origin main"
echo "3. Generate new API keys (see docs/incidents/API_KEY_EXPOSURE_RECOVERY.md)"
echo ""
