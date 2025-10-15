#!/bin/bash

echo "🔧 Adding REDIS_URL for caching and rate limiting..."
echo ""

REDIS_URL="redis://default:AVLPAAIncDIwZjQwMmJjMTIxYjk0NmI5OTRiZGNmZmY1NTNkODM0NnAyMjExOTk@moved-dragon-21199.upstash.io:6379"

echo "Adding to all environments..."
echo "$REDIS_URL" | vercel env add REDIS_URL production
echo "$REDIS_URL" | vercel env add REDIS_URL preview
echo "$REDIS_URL" | vercel env add REDIS_URL development

echo ""
echo "✅ REDIS_URL added successfully!"
echo ""
echo "This enables:"
echo "  - Rate limiting on API endpoints"
echo "  - Session caching"
echo "  - Performance optimization"
