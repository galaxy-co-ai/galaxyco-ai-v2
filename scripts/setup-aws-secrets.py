#!/usr/bin/env python3
"""
Upload all production secrets to AWS Secrets Manager
Reads from .env.local and creates/updates secrets in AWS
"""

import os
import subprocess
import sys
from pathlib import Path

# AWS Configuration
AWS_CLI = r"C:\Program Files\Amazon\AWSCLIV2\aws.exe"
REGION = "us-east-1"
PREFIX = "galaxyco/prod"

# Secrets to upload (mapping of secret name to env var name)
SECRETS = {
    "database-url": "DATABASE_URL",
    "clerk-secret-key": "CLERK_SECRET_KEY",
    "clerk-publishable-key": "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "encryption-key": "ENCRYPTION_KEY",
    "openai-api-key": "OPENAI_API_KEY",
    "anthropic-api-key": "ANTHROPIC_API_KEY",
    "google-generative-ai-api-key": "GOOGLE_GENERATIVE_AI_API_KEY",
    "pinecone-api-key": "PINECONE_API_KEY",
    "pinecone-environment": "PINECONE_ENVIRONMENT",
    "pinecone-index": "PINECONE_INDEX",
    "blob-read-write-token": "BLOB_READ_WRITE_TOKEN",
    "trigger-secret-key": "TRIGGER_SECRET_KEY",
    "google-client-id": "GOOGLE_CLIENT_ID",
    "google-client-secret": "GOOGLE_CLIENT_SECRET",
    "microsoft-client-id": "MICROSOFT_CLIENT_ID",
    "microsoft-client-secret": "MICROSOFT_CLIENT_SECRET",
    "google-custom-search-api-key": "GOOGLE_CUSTOM_SEARCH_API_KEY",
    "google-custom-search-engine-id": "GOOGLE_CUSTOM_SEARCH_ENGINE_ID",
    "sentry-dsn": "NEXT_PUBLIC_SENTRY_DSN",
}


def load_env_file():
    """Load .env.local file"""
    env_path = Path(".env.local")
    if not env_path.exists():
        print("❌ Error: .env.local not found")
        sys.exit(1)
    
    env_vars = {}
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                env_vars[key] = value
    
    return env_vars


def create_or_update_secret(name, value):
    """Create or update a secret in AWS Secrets Manager"""
    full_name = f"{PREFIX}/{name}"
    print(f"📝 Processing: {full_name}")
    
    try:
        # Try to create the secret
        result = subprocess.run(
            [
                AWS_CLI,
                "secretsmanager",
                "create-secret",
                "--name",
                full_name,
                "--secret-string",
                value,
                "--region",
                REGION,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        
        if result.returncode == 0:
            print(f"   ✅ Created")
            return True
        
        # If it already exists, update it
        if "ResourceExistsException" in result.stderr:
            print(f"   📝 Updating existing secret...")
            result = subprocess.run(
                [
                    AWS_CLI,
                    "secretsmanager",
                    "put-secret-value",
                    "--secret-id",
                    full_name,
                    "--secret-string",
                    value,
                    "--region",
                    REGION,
                ],
                capture_output=True,
                text=True,
                timeout=10,
            )
            
            if result.returncode == 0:
                print(f"   ✅ Updated")
                return True
        
        print(f"   ❌ Error: {result.stderr}")
        return False
        
    except subprocess.TimeoutExpired:
        print(f"   ⏱️  Timeout - skipping")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def main():
    print("🔐 Setting up AWS Secrets Manager for GalaxyCo Production")
    print("=" * 60)
    print()
    
    # Load environment variables
    print("📂 Loading .env.local...")
    env_vars = load_env_file()
    print(f"   Found {len(env_vars)} environment variables")
    print()
    
    # Upload secrets
    success_count = 0
    total_count = len(SECRETS)
    
    for secret_name, env_var_name in SECRETS.items():
        if env_var_name in env_vars:
            if create_or_update_secret(secret_name, env_vars[env_var_name]):
                success_count += 1
        else:
            print(f"⚠️  Warning: {env_var_name} not found in .env.local")
    
    print()
    print("=" * 60)
    print(f"✅ Successfully uploaded {success_count}/{total_count} secrets")
    print()
    print(f"Region: {REGION}")
    print(f"Prefix: {PREFIX}")
    
    if success_count < total_count:
        print()
        print(f"⚠️  {total_count - success_count} secrets failed to upload")
        sys.exit(1)


if __name__ == "__main__":
    main()
