#!/bin/bash

# Smoke Test Script
# Quick validation of critical user paths

echo "🔥 Running Smoke Tests..."

# Run only smoke tests
pnpm playwright test tests/smoke/ --project="Desktop Chrome"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All smoke tests passed!"
else
  echo "❌ Smoke tests failed"
fi

exit $EXIT_CODE
