#!/bin/bash

echo "🧹 Cleaning all environment variables from Vercel..."

# Remove from Development
echo "Removing from Development..."
vercel env rm DATABASE_URL development -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development -y 2>/dev/null || true
vercel env rm CLERK_SECRET_KEY development -y 2>/dev/null || true

# Remove from Preview
echo "Removing from Preview..."
vercel env rm NEXT_PUBLIC_API_URL preview -y 2>/dev/null || true
vercel env rm DATABASE_URL preview -y 2>/dev/null || true
vercel env rm CLERK_SECRET_KEY preview -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview -y 2>/dev/null || true

# Remove from Production
echo "Removing from Production..."
vercel env rm ENABLE_AUTO_APPROVE production -y 2>/dev/null || true
vercel env rm ENABLE_SIM_MODE production -y 2>/dev/null || true
vercel env rm ENABLE_BUILDER production -y 2>/dev/null || true
vercel env rm ENABLE_MARKETPLACE production -y 2>/dev/null || true
vercel env rm RATE_LIMIT_WINDOW_MS production -y 2>/dev/null || true
vercel env rm RATE_LIMIT_MAX production -y 2>/dev/null || true
vercel env rm CORS_ORIGIN production -y 2>/dev/null || true
vercel env rm JWT_EXPIRES_IN production -y 2>/dev/null || true
vercel env rm JWT_SECRET production -y 2>/dev/null || true
vercel env rm REDIS_URL production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_ENABLE_SIM_MODE production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_ENABLE_BUILDER production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_ENABLE_MARKETPLACE production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_API_URL production -y 2>/dev/null || true
vercel env rm NODE_ENV production -y 2>/dev/null || true
vercel env rm NEXT_PUBLIC_ENV production -y 2>/dev/null || true
vercel env rm DATABASE_URL production -y 2>/dev/null || true
vercel env rm plain production -y 2>/dev/null || true
vercel env rm CLERK_SECRET_KEY production -y 2>/dev/null || true

echo "✅ All environment variables removed"
