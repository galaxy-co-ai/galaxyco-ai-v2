#!/bin/bash

echo "🔧 Setting up essential environment variables..."

# Database URL
DATABASE_URL="postgresql://neondb_owner:npg_GDhkUvK3HZL5@ep-square-tooth-aemnkoa9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Clerk keys (cleaned up - no escaped newlines)
CLERK_SECRET_KEY="sk_test_yJx6yMOQ6g52VAbLgwmPO9xv02KTYvW5cEhAz8II6Y"
CLERK_PUBLISHABLE_KEY="pk_test_YWNjdXJhdGUtZ2hvc3QtNTEuY2xlcmsuYWNjb3VudHMuZGV2JA"

echo "📦 Adding to Production..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$CLERK_SECRET_KEY" | vercel env add CLERK_SECRET_KEY production
echo "$CLERK_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

echo "🔍 Adding to Preview..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
echo "$CLERK_SECRET_KEY" | vercel env add CLERK_SECRET_KEY preview
echo "$CLERK_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

echo "💻 Adding to Development..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL development
echo "$CLERK_SECRET_KEY" | vercel env add CLERK_SECRET_KEY development
echo "$CLERK_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development

echo "✅ Essential environment variables configured!"
echo ""
echo "Configured variables:"
echo "  - DATABASE_URL"
echo "  - CLERK_SECRET_KEY"
echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
