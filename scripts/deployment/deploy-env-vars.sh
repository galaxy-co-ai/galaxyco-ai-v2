#!/bin/bash

echo "Setting environment variables for Web App deployment..."

# Web App Environment Variables
vercel env add DATABASE_URL production <<< "postgresql://neondb_owner:npg_GDhkUvK3HZL5@ep-square-tooth-aemnkoa9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
vercel env add NEXT_PUBLIC_ENV production <<< "production"
vercel env add NODE_ENV production <<< "production"
vercel env add NEXT_PUBLIC_API_URL production <<< "https://galaxyco-ai-v2-api.vercel.app"
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production <<< "pk_test_YWNjdXJhdGUtZ2hvc3QtNTEuY2xlcmsuYWNjb3VudHMuZGV2JA"
vercel env add CLERK_SECRET_KEY production <<< "sk_test_yJx6yMOQ6g52VAbLgwmPO9xv02KTYvW5cEhAz8II6Y"
vercel env add NEXT_PUBLIC_ENABLE_MARKETPLACE production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_BUILDER production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_SIM_MODE production <<< "true"

# Add Redis URL for API functionality
vercel env add REDIS_URL production <<< "redis://default:AVLPAAIncDIwZjQwMmJjMTIxYjk0NmI5OTRiZGNmZmY1NTNkODM0NnAyMjExOTk@moved-dragon-21199.upstash.io:6379"

# Add JWT configuration
vercel env add JWT_SECRET production <<< "prod-secret-gAlAxyC0-aI-vErc3l-pr0dUct10n-k3y-2025-s3cUr3"
vercel env add JWT_EXPIRES_IN production <<< "7d"

# Add CORS configuration (will update after deployment)
vercel env add CORS_ORIGIN production <<< "https://galaxyco-ai-platform.vercel.app"

# Add Rate limiting
vercel env add RATE_LIMIT_MAX production <<< "100"
vercel env add RATE_LIMIT_WINDOW_MS production <<< "60000"

# Feature flags
vercel env add ENABLE_MARKETPLACE production <<< "true"
vercel env add ENABLE_BUILDER production <<< "true"
vercel env add ENABLE_SIM_MODE production <<< "true"
vercel env add ENABLE_AUTO_APPROVE production <<< "false"

echo "Environment variables added successfully!"
echo "Now deploying the application..."