#!/bin/bash

# Accessibility Audit Script Wrapper
# 
# Starts dev server, runs accessibility audit, then stops server
# 
# Usage: pnpm a11y:audit

set -e

echo "🔍 Starting Accessibility Audit"
echo "================================"

# Start dev server in background
echo "Starting dev server..."
pnpm dev > /dev/null 2>&1 &
DEV_SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 10

# Function to cleanup on exit
cleanup() {
  echo "Stopping dev server..."
  kill $DEV_SERVER_PID 2>/dev/null || true
}

trap cleanup EXIT

# Run accessibility audit
echo "Running accessibility audit..."
tsx scripts/a11y-audit.ts "$@"

# Cleanup handled by trap
echo "✅ Audit complete!"

