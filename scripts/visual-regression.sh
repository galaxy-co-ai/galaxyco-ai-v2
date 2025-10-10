#!/bin/bash

# Visual Regression Test Script
# Captures screenshots and compares to baseline

echo "📸 Running Visual Regression Tests..."

# Check if --update-baseline flag is passed
if [[ "$1" == "--update-baseline" ]]; then
  echo "🔄 Updating baseline screenshots..."
  pnpm playwright test tests/visual/ --update-snapshots
  
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Baseline screenshots updated successfully!"
    echo ""
    echo "Don't forget to commit the updated baselines:"
    echo "  git add tests/visual/"
    echo "  git commit -m \"test(visual): update baseline screenshots\""
  else
    echo "❌ Failed to update baseline screenshots"
  fi
else
  echo "🔍 Comparing against baseline..."
  pnpm playwright test tests/visual/

  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ No visual regressions detected!"
  else
    echo "❌ Visual regressions detected"
    echo ""
    echo "To review differences:"
    echo "  pnpm playwright show-report"
    echo ""
    echo "If changes are intentional, update the baseline:"
    echo "  ./scripts/visual-regression.sh --update-baseline"
  fi
fi

exit $EXIT_CODE
