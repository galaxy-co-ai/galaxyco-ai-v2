#!/bin/bash

echo "🔐 Adding ENCRYPTION_KEY (CRITICAL for API key encryption)..."
echo ""

# Generate a secure 32-byte encryption key
ENCRYPTION_KEY="fba4e1d8c5f5d6139c366cdad2c4c507e73dc5aab9491a2424731fe771aa4492"

echo "Adding to all environments..."
echo "$ENCRYPTION_KEY" | vercel env add ENCRYPTION_KEY production
echo "$ENCRYPTION_KEY" | vercel env add ENCRYPTION_KEY preview
echo "$ENCRYPTION_KEY" | vercel env add ENCRYPTION_KEY development

echo ""
echo "✅ ENCRYPTION_KEY added successfully!"
echo ""
echo "⚠️  IMPORTANT: This key is used to encrypt user API keys in the database."
echo "   Keep it secure and NEVER change it in production or all encrypted data will be lost!"
