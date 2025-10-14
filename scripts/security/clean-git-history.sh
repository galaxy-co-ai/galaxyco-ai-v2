#!/bin/bash
# Clean Git History - Remove Sensitive Files Permanently
# ⚠️ WARNING: This rewrites git history - coordinate with team first!

set -e

echo "=================================="
echo "🧹 Git History Cleanup"
echo "=================================="
echo ""

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}⚠️  WARNING: This will rewrite git history!${NC}"
echo ""
echo "This script will permanently remove sensitive files from git history."
echo "All team members will need to re-clone or force pull after this."
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo -e "${YELLOW}Installing BFG Repo-Cleaner...${NC}"

# Check if BFG is available
if ! command -v bfg &> /dev/null; then
  echo "BFG Repo-Cleaner not found. Installing..."
  
  # Download BFG (requires Java)
  if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is required but not installed.${NC}"
    echo "Please install Java first: https://www.java.com/download/"
    echo ""
    echo "Alternative: Use git-filter-repo (recommended):"
    echo "  pip install git-filter-repo"
    exit 1
  fi
  
  # Create tmp directory for BFG
  mkdir -p /tmp/bfg
  cd /tmp/bfg
  
  # Download BFG
  curl -LO https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
  
  echo "✅ Downloaded BFG Repo-Cleaner"
  BFG_JAR="/tmp/bfg/bfg-1.14.0.jar"
  
  cd -
else
  BFG_JAR="bfg"
fi

echo ""
echo -e "${YELLOW}Step 1: Create backup${NC}"

BACKUP_DIR="$HOME/galaxyco-ai-2.0-backup-$(date +%Y%m%d-%H%M%S)"
echo "Creating backup at: $BACKUP_DIR"

# Create backup
cp -r . "$BACKUP_DIR"
echo "✅ Backup created"

echo ""
echo -e "${YELLOW}Step 2: Clean files from git history${NC}"

# Files to remove
FILES_TO_REMOVE=(
  "add-optional-env.sh"
  "apps/web/.env.local.backup"
)

echo "Removing sensitive files from git history..."

for file in "${FILES_TO_REMOVE[@]}"; do
  echo "  - $file"
  
  # Use git filter-branch (fallback method)
  git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmatch $file" \
    --prune-empty --tag-name-filter cat -- --all
done

echo "✅ Files removed from history"

echo ""
echo -e "${YELLOW}Step 3: Clean refs and garbage collect${NC}"

# Remove original refs
rm -rf .git/refs/original/

# Expire reflog
git reflog expire --expire=now --all

# Garbage collect
git gc --prune=now --aggressive

echo "✅ Repository cleaned"

echo ""
echo -e "${YELLOW}Step 4: Force push to remote${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT: Run these commands:${NC}"
echo ""
echo "  git push origin --force --all"
echo "  git push origin --force --tags"
echo ""
echo "⚠️  All team members must run:"
echo "  git fetch origin"
echo "  git reset --hard origin/main"
echo ""
echo "Or better yet, re-clone the repository:"
echo "  cd .."
echo "  rm -rf galaxyco-ai-2.0"
echo "  git clone <repository-url>"
echo ""

echo "✅ Git history cleanup complete!"
echo ""
echo "Backup location: $BACKUP_DIR"
