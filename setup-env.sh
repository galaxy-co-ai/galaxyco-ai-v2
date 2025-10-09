#!/bin/bash

echo "🔧 Setting up essential environment variables..."
echo "Note: CLI adds variables separately per environment (not as 'shared' like the UI)"
echo ""

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
echo "  - DATABASE_URL (3 entries: Production, Preview, Development)"
echo "  - CLERK_SECRET_KEY (3 entries: Production, Preview, Development)"
echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (3 entries: Production, Preview, Development)"
echo ""
echo "Note: These appear as 3 separate entries per variable due to CLI limitation."
echo "Using the Vercel UI, you can create 'shared' variables instead (1 entry for all environments)."
