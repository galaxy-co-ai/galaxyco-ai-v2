#!/bin/bash
# Upload all production secrets to AWS Secrets Manager
# This script reads from .env.local and creates secrets in AWS

set -e

AWS_CLI="/c/Program Files/Amazon/AWSCLIV2/aws"
REGION="us-east-1"
PREFIX="galaxyco/prod"

echo "🔐 Setting up AWS Secrets Manager for GalaxyCo Production"
echo "========================================================="
echo ""

# Function to create or update secret
create_secret() {
    local name=$1
    local value=$2
    
    echo "📝 Creating secret: $PREFIX/$name"
    
    # Try to create the secret
    "$AWS_CLI" secretsmanager create-secret \
        --name "$PREFIX/$name" \
        --secret-string "$value" \
        --region "$REGION" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        # If creation fails (already exists), update it
        echo "   Secret exists, updating..."
        "$AWS_CLI" secretsmanager put-secret-value \
            --secret-id "$PREFIX/$name" \
            --secret-string "$value" \
            --region "$REGION" >/dev/null
    fi
    
    echo "   ✅ Done"
}

# Load environment variables from .env.local
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    exit 1
fi

# Export variables from .env.local
set -a
source .env.local
set +a

echo "Creating secrets from .env.local..."
echo ""

# Core Database & Auth
create_secret "database-url" "$DATABASE_URL"
create_secret "clerk-secret-key" "$CLERK_SECRET_KEY"
create_secret "clerk-publishable-key" "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
create_secret "encryption-key" "$ENCRYPTION_KEY"

# AI Services
create_secret "openai-api-key" "$OPENAI_API_KEY"
create_secret "anthropic-api-key" "$ANTHROPIC_API_KEY"
create_secret "google-generative-ai-api-key" "$GOOGLE_GENERATIVE_AI_API_KEY"

# Vector Database
create_secret "pinecone-api-key" "$PINECONE_API_KEY"
create_secret "pinecone-environment" "$PINECONE_ENVIRONMENT"
create_secret "pinecone-index" "$PINECONE_INDEX"

# File Storage
create_secret "blob-read-write-token" "$BLOB_READ_WRITE_TOKEN"

# Background Jobs
create_secret "trigger-secret-key" "$TRIGGER_SECRET_KEY"

# OAuth Integrations
create_secret "google-client-id" "$GOOGLE_CLIENT_ID"
create_secret "google-client-secret" "$GOOGLE_CLIENT_SECRET"
create_secret "microsoft-client-id" "$MICROSOFT_CLIENT_ID"
create_secret "microsoft-client-secret" "$MICROSOFT_CLIENT_SECRET"

# Search & Enrichment
create_secret "google-custom-search-api-key" "$GOOGLE_CUSTOM_SEARCH_API_KEY"
create_secret "google-custom-search-engine-id" "$GOOGLE_CUSTOM_SEARCH_ENGINE_ID"

# Monitoring
create_secret "sentry-dsn" "$NEXT_PUBLIC_SENTRY_DSN"

echo ""
echo "========================================================="
echo "✅ All secrets uploaded to AWS Secrets Manager!"
echo ""
echo "Region: $REGION"
echo "Prefix: $PREFIX"
echo ""
echo "To verify:"
echo "  $AWS_CLI secretsmanager list-secrets --region $REGION | grep $PREFIX"
