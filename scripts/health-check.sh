#!/usr/bin/env bash
# Health Check Script for GalaxyCo.ai Development Environment
# Verifies all systems are operational before starting development

set -e

echo "🏥 Running GalaxyCo.ai Health Checks..."
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
OVERALL_STATUS=0

# Function to print status
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    OVERALL_STATUS=1
  fi
}

# 1. Check Node.js version
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  REQUIRED_VERSION="v20"
  # Extract major version number
  MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
  if [[ $MAJOR_VERSION -ge 20 ]]; then
    print_status 0 "Node.js version: $NODE_VERSION"
  else
    print_status 1 "Node.js version: $NODE_VERSION (Expected: $REQUIRED_VERSION+)"
  fi
else
  print_status 1 "Node.js not found"
fi

# 2. Check pnpm
echo ""
echo "📦 Checking pnpm..."
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm --version)
  print_status 0 "pnpm version: $PNPM_VERSION"
else
  print_status 1 "pnpm not found (Run: npm install -g pnpm)"
fi

# 3. Check environment variables
echo ""
echo "🔐 Checking Environment Variables..."
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web

if [ -f ".env.local" ]; then
  print_status 0 ".env.local file exists"
  
  # Check for required vars (without revealing values)
  REQUIRED_VARS=("DATABASE_URL" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "CLERK_SECRET_KEY")
  
  for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env.local; then
      print_status 0 "$var is set"
    else
      print_status 1 "$var is missing"
    fi
  done
else
  print_status 1 ".env.local file not found"
fi

# 4. Check TypeScript compilation
echo ""
echo "📝 Checking TypeScript..."
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/apps/web
if pnpm typecheck &> /dev/null; then
  print_status 0 "TypeScript compilation passed"
else
  print_status 1 "TypeScript compilation failed (Run: pnpm typecheck)"
fi

# 5. Check dependencies
echo ""
echo "📚 Checking Dependencies..."
cd /c/Users/Owner/workspace/galaxyco-ai-2.0
if [ -d "node_modules" ]; then
  print_status 0 "Dependencies installed"
else
  print_status 1 "Dependencies not installed (Run: pnpm install)"
fi

# 6. Check database connection (optional - requires runtime)
echo ""
echo "🗄️  Checking Database Configuration..."
cd /c/Users/Owner/workspace/galaxyco-ai-2.0/packages/database
if [ -f "drizzle.config.ts" ]; then
  print_status 0 "Drizzle configuration exists"
else
  print_status 1 "Drizzle configuration missing"
fi

# Final summary
echo ""
echo "========================================"
if [ $OVERALL_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ All health checks passed!${NC}"
  echo ""
  echo "You're ready to start development:"
  echo "  pnpm dev"
  exit 0
else
  echo -e "${RED}✗ Some health checks failed${NC}"
  echo ""
  echo "Please fix the issues above before starting development."
  exit 1
fi
