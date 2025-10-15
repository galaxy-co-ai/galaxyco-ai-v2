#!/bin/bash

# Sentry Error Monitoring Script
# Fetches recent errors from Sentry

echo "🛡️  Checking Sentry for recent errors..."
echo ""

# Check if SENTRY_AUTH_TOKEN is set
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "⚠️  SENTRY_AUTH_TOKEN not set"
  echo ""
  echo "To enable automated Sentry error checking:"
  echo "1. Create an auth token at: https://sentry.io/settings/account/api/auth-tokens/"
  echo "2. Add to your environment: export SENTRY_AUTH_TOKEN=your_token_here"
  echo ""
  echo "For now, check Sentry manually:"
  echo "  https://galaxyco-ai.sentry.io/issues/"
  echo ""
  exit 0
fi

# If token is set, fetch errors (future implementation)
echo "✅ Sentry integration ready"
echo ""
echo "Recent errors:"
echo "  https://galaxyco-ai.sentry.io/issues/"
echo ""
echo "Note: Automated error fetching will be implemented in next iteration"

exit 0
