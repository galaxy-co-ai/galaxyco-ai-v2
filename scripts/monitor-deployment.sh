#!/bin/bash

# Automated Deployment Monitoring Script
# Monitors Vercel deployment and Sentry errors in real-time

set -e

echo "🔍 GalaxyCo.ai Deployment Monitor"
echo "================================="
echo ""
echo "Deployment: v1.0.0"
echo "Time: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check environment
PROJECT_ROOT="/c/Users/Owner/workspace/galaxyco-ai-2.0"
cd "$PROJECT_ROOT"

# ============================================================================
# 1. Git Status Check
# ============================================================================
echo "📦 Git Status Check"
echo "-------------------"
CURRENT_COMMIT=$(git log --oneline -1)
echo "✅ Current commit: $CURRENT_COMMIT"
CURRENT_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "No tag")
echo "✅ Current tag: $CURRENT_TAG"
echo ""

# ============================================================================
# 2. Vercel Deployment Check
# ============================================================================
echo "🚀 Vercel Deployment Status"
echo "---------------------------"

# Check if we can reach production URL
echo "Testing production URL..."
PROD_URL="https://galaxyco-ai-20.vercel.app"

if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL" --max-time 10 || echo "000")
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✅ Site is live!${NC} (HTTP $HTTP_CODE)"
        echo "   URL: $PROD_URL"
    elif [ "$HTTP_CODE" = "000" ]; then
        echo -e "${YELLOW}⏳ Site not responding yet (timeout)${NC}"
        echo "   This is normal for first 3-5 minutes after deployment"
    else
        echo -e "${RED}❌ Site error: HTTP $HTTP_CODE${NC}"
        echo "   May need to check Vercel dashboard"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available - skipping URL check${NC}"
fi

echo ""
echo "📊 Vercel Dashboard: https://vercel.com/galaxyco-ai/galaxyco-ai-platform/deployments"
echo ""

# ============================================================================
# 3. Health Endpoint Check
# ============================================================================
echo "🏥 Health Endpoint Check"
echo "------------------------"

if command -v curl &> /dev/null; then
    HEALTH_URL="$PROD_URL/api/health"
    echo "Testing: $HEALTH_URL"
    
    HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" --max-time 10 || echo '{"error":"timeout"}')
    
    if echo "$HEALTH_RESPONSE" | grep -q "ok\|status"; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
        echo "   Response: $HEALTH_RESPONSE"
    else
        echo -e "${YELLOW}⏳ Health endpoint not ready yet${NC}"
        echo "   Response: $HEALTH_RESPONSE"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available - skipping health check${NC}"
fi

echo ""

# ============================================================================
# 4. Sentry Error Check
# ============================================================================
echo "🛡️  Sentry Error Monitoring"
echo "---------------------------"

SENTRY_DSN="https://699c1bed0c2be84c0d98970d34c68923@o4510119201603584.ingest.us.sentry.io/4510162095539328"
SENTRY_ORG="galaxyco-ai"
SENTRY_PROJECT="javascript-nextjs"

# Check if sentry-cli is installed
if command -v sentry-cli &> /dev/null; then
    echo "✅ Sentry CLI installed"
    
    # Test Sentry connection
    echo "Testing Sentry connection..."
    if [ -n "$SENTRY_AUTH_TOKEN" ]; then
        echo "✅ Auth token detected - fetching issues..."
        echo ""
        
        # Fetch recent issues using sentry-cli
        ISSUES_OUTPUT=$(sentry-cli issues list --status unresolved 2>&1 || echo "error")
        
        if echo "$ISSUES_OUTPUT" | grep -q "error\|Error"; then
            echo -e "${YELLOW}⚠️  Could not fetch issues (check auth token)${NC}"
        else
            ISSUE_COUNT=$(echo "$ISSUES_OUTPUT" | grep -c "^  " 2>/dev/null || echo "0")
            
            if [ "$ISSUE_COUNT" -eq "0" ]; then
                echo -e "${GREEN}✅ No unresolved errors!${NC}"
            elif [ "$ISSUE_COUNT" -lt "5" ]; then
                echo -e "${YELLOW}⚠️  $ISSUE_COUNT unresolved errors${NC}"
                echo "   Recent issues:"
                echo "$ISSUES_OUTPUT" | head -10
            else
                echo -e "${RED}❌ $ISSUE_COUNT unresolved errors!${NC}"
                echo "   URGENT: Check Sentry dashboard"
                echo "   Top issues:"
                echo "$ISSUES_OUTPUT" | head -10
            fi
        fi
        echo ""
        echo "📊 Full dashboard: https://sentry.io/organizations/$SENTRY_ORG/issues/"
    else
        echo -e "${YELLOW}⚠️  SENTRY_AUTH_TOKEN not set${NC}"
        echo ""
        echo "Send test event with:"
        echo "  SENTRY_DSN=\"$SENTRY_DSN\" sentry-cli send-event -m \"Test message\" --level info"
        echo ""
        echo "For automated monitoring, create auth token at:"
        echo "  https://sentry.io/settings/account/api/auth-tokens/"
        echo ""
        echo "Then set:"
        echo "  export SENTRY_AUTH_TOKEN=sntrys_your_token_here"
    fi
else
    echo -e "${YELLOW}⚠️  Sentry CLI not installed${NC}"
    echo ""
    echo "Install with:"
    echo "  npm install -g @sentry/cli"
    echo ""
    echo "Manual check:"
    echo "  https://sentry.io/organizations/$SENTRY_ORG/issues/"
fi

echo ""

# ============================================================================
# 5. Quick Test Summary
# ============================================================================
echo "📋 Monitoring Summary"
echo "--------------------"
echo "Deployment Status:"
echo "  • Git: $CURRENT_TAG on main branch"
echo "  • Production URL: Check results above"
echo "  • Health Endpoint: Check results above"
echo "  • Sentry Errors: Check results above"
echo ""

# ============================================================================
# 6. Next Steps
# ============================================================================
echo "🎯 Next Steps"
echo "-------------"
echo ""
echo "Immediate (if site is live):"
echo "  1. ✅ Visit: $PROD_URL"
echo "  2. ✅ Test agent creation via UI"
echo "  3. ✅ Check browser console for errors"
echo ""
echo "Within 30 minutes:"
echo "  • Monitor Sentry: https://galaxyco-ai.sentry.io/issues/"
echo "  • Check Vercel metrics: https://vercel.com/galaxyco-ai/galaxyco-ai-platform"
echo "  • Test agent execution with guardrails"
echo ""
echo "If issues detected:"
echo "  • Rollback via Vercel dashboard (< 2 min)"
echo "  • Or run: git revert HEAD && git push origin main"
echo ""

# ============================================================================
# 7. Continuous Monitoring Mode (Optional)
# ============================================================================
if [ "$1" = "--watch" ]; then
    echo "🔁 Watch mode enabled - monitoring every 30 seconds"
    echo "   Press Ctrl+C to stop"
    echo ""
    
    while true; do
        sleep 30
        clear
        bash "$0"
    done
fi

echo "================================="
echo "Monitor complete: $(date)"
echo ""
echo "Run with --watch for continuous monitoring:"
echo "  ./scripts/monitor-deployment.sh --watch"
echo ""
