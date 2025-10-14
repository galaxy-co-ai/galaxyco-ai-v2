#!/bin/bash

# Add environment variables to Preview environment
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview < <(vercel env pull .env.local && grep NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY .env.local | cut -d'=' -f2-)
vercel env add CLERK_SECRET_KEY preview < <(vercel env pull .env.local && grep CLERK_SECRET_KEY .env.local | cut -d'=' -f2-)
vercel env add DATABASE_URL preview < <(vercel env pull .env.local && grep DATABASE_URL .env.local | cut -d'=' -f2-)
vercel env add NEXT_PUBLIC_API_URL preview < <(vercel env pull .env.local && grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2-)
vercel env add NEXT_PUBLIC_ENV preview < <(vercel env pull .env.local && grep NEXT_PUBLIC_ENV .env.local | cut -d'=' -f2-)
vercel env add NODE_ENV preview < <(vercel env pull .env.local && grep NODE_ENV .env.local | cut -d'=' -f2-)
