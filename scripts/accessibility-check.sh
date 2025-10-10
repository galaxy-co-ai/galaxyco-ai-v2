#!/bin/bash

# Accessibility Test Script
# Validates WCAG AA compliance

echo "♿ Running Accessibility Tests..."

# Run accessibility tests
pnpm playwright test tests/accessibility/ --project="Desktop Chrome"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All accessibility tests passed (WCAG AA compliant)!"
else
  echo "❌ Accessibility violations found"
  echo ""
  echo "Common fixes:"
  echo "  • Add alt text to images"
  echo "  • Improve color contrast (4.5:1 for normal text)"
  echo "  • Add ARIA labels to interactive elements"
  echo "  • Ensure proper heading hierarchy (h1 → h2 → h3)"
  echo "  • Make focus states visible"
fi

exit $EXIT_CODE
