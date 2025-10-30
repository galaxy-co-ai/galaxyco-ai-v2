#!/bin/bash
# Push Docker images to GitHub Container Registry
# Run this after Docker Desktop has restarted

set -e

echo "🐳 Pushing Docker Images to GitHub Container Registry"
echo "======================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Push API image
echo "📦 Pushing API image..."
docker push ghcr.io/galaxy-co-ai/galaxyco-api:latest
if [ $? -eq 0 ]; then
    echo "✅ API image pushed successfully"
else
    echo "❌ Failed to push API image"
    exit 1
fi

echo ""

# Build and push Agents image
echo "📦 Building Agents image..."
docker build --platform linux/amd64 \
    -t ghcr.io/galaxy-co-ai/galaxyco-agents:latest \
    -f services/agents/Dockerfile \
    services/agents/

if [ $? -eq 0 ]; then
    echo "✅ Agents image built successfully"
else
    echo "❌ Failed to build Agents image"
    exit 1
fi

echo ""
echo "📦 Pushing Agents image..."
docker push ghcr.io/galaxy-co-ai/galaxyco-agents:latest

if [ $? -eq 0 ]; then
    echo "✅ Agents image pushed successfully"
else
    echo "❌ Failed to push Agents image"
    exit 1
fi

echo ""
echo "======================================================="
echo "✅ All images pushed successfully!"
echo ""
echo "Images:"
echo "  - ghcr.io/galaxy-co-ai/galaxyco-api:latest"
echo "  - ghcr.io/galaxy-co-ai/galaxyco-agents:latest"
echo ""
echo "Next steps:"
echo "  1. Deploy infrastructure: cd infra/terraform/envs/prod && terraform apply"
echo "  2. Update DNS records to point to ALB"
echo "  3. Run smoke tests"
