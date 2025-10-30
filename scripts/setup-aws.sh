#!/bin/bash
# AWS Configuration Helper Script
# Usage: ./scripts/setup-aws.sh

echo "🔐 AWS Credential Setup"
echo "========================"
echo ""
echo "Please enter your AWS credentials from:"
echo "https://console.aws.amazon.com/iam/home#/security_credentials"
echo ""

read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY

# Configure AWS CLI
"/c/Program Files/Amazon/AWSCLIV2/aws" configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
"/c/Program Files/Amazon/AWSCLIV2/aws" configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
"/c/Program Files/Amazon/AWSCLIV2/aws" configure set region us-east-1
"/c/Program Files/Amazon/AWSCLIV2/aws" configure set output json

echo ""
echo "✅ AWS CLI configured!"
echo ""
echo "Testing connection..."
"/c/Program Files/Amazon/AWSCLIV2/aws" sts get-caller-identity

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! AWS is configured and working."
    echo ""
    echo "Next steps:"
    echo "1. Install Terraform (if not installed)"
    echo "2. Run deployment with: cd infra/terraform/envs/prod && terraform init && terraform apply"
else
    echo ""
    echo "❌ Error: Could not connect to AWS. Please check your credentials."
fi
