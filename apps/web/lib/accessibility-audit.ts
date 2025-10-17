/**
 * Accessibility Audit Utilities
 *
 * Comprehensive testing utilities for WCAG 2.1 AA compliance
 */

export interface AccessibilityIssue {
  severity: "error" | "warning" | "info";
  element: string;
  description: string;
  wcagRule: string;
  suggestion: string;
}

/**
 * Automated accessibility audit function
 */
export function auditAccessibility(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check for missing alt text on images
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    if (!img.getAttribute("alt")) {
      issues.push({
        severity: "error",
        element: `img:nth-child(${index + 1})`,
        description: "Image missing alt text",
        wcagRule: "WCAG 2.1 - 1.1.1 Non-text Content",
        suggestion: 'Add descriptive alt text or alt="" for decorative images',
      });
    }
  });

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push({
        severity: "warning",
        element: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
        description: `Heading level ${level} skips heading level ${lastLevel + 1}`,
        wcagRule: "WCAG 2.1 - 2.4.6 Headings and Labels",
        suggestion: "Use proper heading hierarchy (h1, h2, h3, etc.)",
      });
    }
    lastLevel = level;
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button, index) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute("aria-label");
    const hasAriaLabelledby = button.getAttribute("aria-labelledby");

    if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        severity: "error",
        element: `button:nth-child(${index + 1})`,
        description: "Button has no accessible name",
        wcagRule: "WCAG 2.1 - 4.1.2 Name, Role, Value",
        suggestion: "Add text content, aria-label, or aria-labelledby",
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="password"], textarea, select',
  );
  inputs.forEach((input, index) => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute("aria-label");
    const hasAriaLabelledby = input.getAttribute("aria-labelledby");

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        severity: "error",
        element: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
        description: "Form control has no accessible label",
        wcagRule: "WCAG 2.1 - 3.3.2 Labels or Instructions",
        suggestion: "Add a label element, aria-label, or aria-labelledby",
      });
    }
  });

  // Check for sufficient color contrast (simplified)
  const elementsToCheck = document.querySelectorAll(
    "p, span, div, button, a, h1, h2, h3, h4, h5, h6",
  );
  elementsToCheck.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // This is a simplified check - in production, use a proper contrast ratio library
    if (color === backgroundColor) {
      issues.push({
        severity: "warning",
        element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
        description: "Potential color contrast issue",
        wcagRule: "WCAG 2.1 - 1.4.3 Contrast (Minimum)",
        suggestion:
          "Ensure text has sufficient contrast ratio (4.5:1 for normal text)",
      });
    }
  });

  // Check for keyboard focusable elements
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  focusableElements.forEach((element, index) => {
    // Check if element is visible but not focusable
    const styles = window.getComputedStyle(element);
    if (styles.display !== "none" && styles.visibility !== "hidden") {
      const tabIndex = element.getAttribute("tabindex");
      if (tabIndex === "-1" && element.tagName !== "DIV") {
        issues.push({
          severity: "warning",
          element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
          description: "Interactive element not keyboard accessible",
          wcagRule: "WCAG 2.1 - 2.1.1 Keyboard",
          suggestion: "Ensure all interactive elements are keyboard accessible",
        });
      }
    }
  });

  return issues;
}

/**
 * Manual accessibility testing checklist
 */
export const accessibilityChecklist = {
  keyboard: [
    "✓ Tab navigation works through all interactive elements",
    "✓ Shift+Tab works in reverse order",
    "✓ Enter/Space activates buttons and links",
    "✓ Escape closes modals and dropdowns",
    "✓ Arrow keys work in menus and lists",
    "✓ Focus is visible on all interactive elements",
    "✓ Focus is trapped in modal dialogs",
  ],

  screenReader: [
    "✓ All content is announced properly",
    "✓ Headings structure makes sense",
    "✓ Form labels are associated correctly",
    "✓ Error messages are announced",
    "✓ Loading states are announced",
    "✓ Dynamic content changes are announced",
    "✓ Skip links work properly",
  ],

  visual: [
    "✓ Text contrast meets WCAG AA standards (4.5:1)",
    "✓ Large text contrast meets standards (3:1)",
    "✓ Color is not the only way to convey information",
    "✓ Focus indicators are clearly visible",
    "✓ Text can be resized to 200% without horizontal scrolling",
    "✓ Content reflows properly at different zoom levels",
  ],

  motor: [
    "✓ Click targets are at least 44px×44px",
    "✓ Interactive elements have adequate spacing",
    "✓ Drag and drop has keyboard alternatives",
    "✓ Hover states have focus equivalents",
    "✓ Timeout warnings are provided for timed content",
  ],

  cognitive: [
    "✓ Error messages are clear and helpful",
    "✓ Forms provide clear instructions",
    "✓ Complex interactions have help text",
    "✓ Page titles are descriptive",
    "✓ Navigation is consistent across pages",
  ],
};

/**
 * Generate accessibility audit report
 */
export function generateAccessibilityReport(): {
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  issues: AccessibilityIssue[];
  checklist: typeof accessibilityChecklist;
  recommendations: string[];
} {
  const issues = auditAccessibility();

  const summary = {
    totalIssues: issues.length,
    errors: issues.filter((i) => i.severity === "error").length,
    warnings: issues.filter((i) => i.severity === "warning").length,
    infos: issues.filter((i) => i.severity === "info").length,
  };

  const recommendations = [
    "Install axe-core browser extension for automated testing",
    "Test with screen readers (NVDA, JAWS, VoiceOver)",
    "Validate HTML markup for semantic correctness",
    "Test keyboard navigation on all pages",
    "Verify color contrast ratios meet WCAG standards",
    "Test with users who have disabilities",
    "Set up automated accessibility testing in CI/CD pipeline",
  ];

  return {
    summary,
    issues,
    checklist: accessibilityChecklist,
    recommendations,
  };
}

/**
 * Performance testing utilities
 */
export function measurePerformance() {
  return {
    // Core Web Vitals
    getCLS: () => {
      // Cumulative Layout Shift - would integrate with web-vitals library
      return "Measure with web-vitals library";
    },

    getFID: () => {
      // First Input Delay
      return "Measure with web-vitals library";
    },

    getLCP: () => {
      // Largest Contentful Paint
      return "Measure with web-vitals library";
    },

    // Custom metrics
    getThemeSwitchTime: () => {
      const start = performance.now();
      document.documentElement.classList.toggle("dark");
      const end = performance.now();
      return end - start;
    },

    getAnimationFrameRate: () => {
      let frames = 0;
      let start = performance.now();

      function countFrames() {
        frames++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(countFrames);
        }
      }

      requestAnimationFrame(countFrames);

      setTimeout(() => {
        // Frame rate measurement complete - could log if needed
        // Intentionally not logged to console
      }, 1000);

      return frames; // Return the frame count for callers to use
    },
  };
}
