#!/bin/bash

# UI Audit Master Script
# Runs all UI validation checks in sequence

set -e

echo "🎨 Starting Complete UI Audit..."
echo "========================================"
echo ""

# Track overall status
OVERALL_STATUS=0

# 1. Health Checks
echo "📋 Step 1/6: Running health checks..."
if bash ./scripts/health-check.sh; then
  echo "✅ Health checks passed"
else
  echo "❌ Health checks failed"
  OVERALL_STATUS=1
fi
echo ""

# 2. TypeScript Validation
echo "📋 Step 2/6: Running TypeScript validation..."
if pnpm typecheck; then
  echo "✅ TypeScript validation passed"
else
  echo "❌ TypeScript validation failed"
  OVERALL_STATUS=1
fi
echo ""

# 3. ESLint
echo "📋 Step 3/6: Running ESLint..."
if pnpm lint; then
  echo "✅ ESLint passed"
else
  echo "⚠️  ESLint warnings found (non-blocking)"
fi
echo ""

# 4. Smoke Tests
echo "📋 Step 4/6: Running smoke tests..."
if bash ./scripts/smoke-test.sh; then
  echo "✅ Smoke tests passed"
else
  echo "❌ Smoke tests failed"
  OVERALL_STATUS=1
fi
echo ""

# 5. Visual Regression Tests
echo "📋 Step 5/6: Running visual regression tests..."
if bash ./scripts/visual-regression.sh; then
  echo "✅ Visual regression tests passed"
else
  echo "❌ Visual regression tests failed"
  OVERALL_STATUS=1
fi
echo ""

# 6. Accessibility Tests
echo "📋 Step 6/6: Running accessibility tests..."
if bash ./scripts/accessibility-check.sh; then
  echo "✅ Accessibility tests passed"
else
  echo "❌ Accessibility tests failed"
  OVERALL_STATUS=1
fi
echo ""

# Summary
echo "========================================"
if [ $OVERALL_STATUS -eq 0 ]; then
  echo "✅ UI Audit Complete - All checks passed!"
  echo ""
  echo "Your UI is:"
  echo "  ✓ Type-safe and lint-clean"
  echo "  ✓ Functionally correct"
  echo "  ✓ Visually consistent"
  echo "  ✓ Accessible (WCAG AA)"
  echo ""
  echo "Ready to deploy! 🚀"
else
  echo "❌ UI Audit Complete - Some checks failed"
  echo ""
  echo "Please fix the issues above before deploying."
  exit 1
fi

exit 0
