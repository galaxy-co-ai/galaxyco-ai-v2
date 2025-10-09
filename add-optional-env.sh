#!/bin/bash

echo "🔧 Adding optional environment variables for enhanced functionality..."
echo ""

# Redis for rate limiting and caching
REDIS_URL="redis://default:AVLPAAIncDIwZjQwMmJjMTIxYjk0NmI5OTRiZGNmZmY1NTNkODM0NnAyMjExOTk@moved-dragon-21199.upstash.io:6379"

# OpenAI for AI agent functionality
OPENAI_API_KEY="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"

echo "📦 Adding REDIS_URL (for rate limiting & caching)..."
echo "$REDIS_URL" | vercel env add REDIS_URL production
echo "$REDIS_URL" | vercel env add REDIS_URL preview
echo "$REDIS_URL" | vercel env add REDIS_URL development

echo ""
echo "🤖 Adding OPENAI_API_KEY (for AI agents)..."
echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY production
echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY preview
echo "$OPENAI_API_KEY" | vercel env add OPENAI_API_KEY development

echo ""
echo "✅ Optional environment variables added!"
echo ""
echo "Added variables:"
echo "  - REDIS_URL (Upstash Redis for caching/rate limiting)"
echo "  - OPENAI_API_KEY (OpenAI API for AI agents)"
echo ""
echo "Not added (not needed yet):"
echo "  - Stripe keys (add when implementing payments)"
echo "  - Sentry (add when you want error tracking)"
echo "  - PostHog (add when you want analytics)"
echo "  - AWS credentials (add if using S3/CloudFront)"
