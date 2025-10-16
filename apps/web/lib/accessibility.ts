/**
 * Accessibility and Keyboard Navigation Utilities
 *
 * Helper functions for improving accessibility and keyboard navigation
 */

/**
 * Focus management utilities
 */
export const focus = {
  /**
   * Focus the first focusable element within a container
   */
  first: (container: HTMLElement | null) => {
    if (!container) return false;

    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;

    if (focusable) {
      focusable.focus();
      return true;
    }
    return false;
  },

  /**
   * Focus the last focusable element within a container
   */
  last: (container: HTMLElement | null) => {
    if (!container) return false;

    const focusable = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];

    const lastFocusable = focusable[focusable.length - 1];
    if (lastFocusable) {
      lastFocusable.focus();
      return true;
    }
    return false;
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trap: (container: HTMLElement, event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  },

  /**
   * Focus an element and scroll it into view
   */
  scrollIntoView: (element: HTMLElement | null) => {
    if (!element) return;

    element.focus();
    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  },
};

/**
 * Keyboard shortcuts utilities
 */
export const keyboard = {
  /**
   * Check if a keyboard shortcut matches the event
   */
  matches: (event: KeyboardEvent, shortcut: string) => {
    const parts = shortcut.toLowerCase().split("+");
    const key = parts.pop()?.trim();

    const modifiers = {
      ctrl: parts.includes("ctrl") || parts.includes("cmd"),
      alt: parts.includes("alt"),
      shift: parts.includes("shift"),
      meta: parts.includes("meta") || parts.includes("cmd"),
    };

    return (
      event.key.toLowerCase() === key &&
      event.ctrlKey === modifiers.ctrl &&
      event.altKey === modifiers.alt &&
      event.shiftKey === modifiers.shift &&
      event.metaKey === modifiers.meta
    );
  },

  /**
   * Common keyboard shortcuts for the app
   */
  shortcuts: {
    // Navigation
    goHome: "ctrl+shift+h",
    goToAgents: "ctrl+shift+a",
    goToMarketplace: "ctrl+shift+m",
    goToKnowledge: "ctrl+shift+k",

    // Actions
    newAgent: "ctrl+shift+n",
    search: "ctrl+k",
    save: "ctrl+s",

    // UI
    toggleTheme: "ctrl+shift+t",
    openCommandPalette: "ctrl+p",
  },

  /**
   * Add a keyboard shortcut listener
   */
  addShortcut: (shortcut: string, handler: (event: KeyboardEvent) => void) => {
    const listener = (event: KeyboardEvent) => {
      if (keyboard.matches(event, shortcut)) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener("keydown", listener);

    // Return cleanup function
    return () => {
      document.removeEventListener("keydown", listener);
    };
  },
};

/**
 * ARIA utilities
 */
export const aria = {
  /**
   * Generate a unique ID for ARIA attributes
   */
  generateId: (prefix: string = "aria") => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Live region announcements
   */
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Screen reader only text
   */
  srOnly: "absolute left-[-10000px] top-auto w-[1px] h-[1px] overflow-hidden",
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Hide content from screen readers
   */
  hide: (element: HTMLElement) => {
    element.setAttribute("aria-hidden", "true");
  },

  /**
   * Show content to screen readers
   */
  show: (element: HTMLElement) => {
    element.removeAttribute("aria-hidden");
  },

  /**
   * Make content screen reader only
   */
  only: (className: string = "") => {
    return `sr-only ${className}`.trim();
  },
};

/**
 * Color contrast utilities
 */
export const contrast = {
  /**
   * Check if colors meet WCAG contrast requirements
   */
  meetsWCAG: (
    foreground: string,
    background: string,
    level: "AA" | "AAA" = "AA",
  ) => {
    // This is a simplified check - in production, use a proper contrast ratio library
    const ratios = { AA: 4.5, AAA: 7.0 };
    // Implementation would calculate actual contrast ratio
    return true; // Placeholder
  },

  /**
   * Get appropriate text color for background
   */
  getTextColor: (backgroundColor: string) => {
    // Simplified logic - in production, use proper luminance calculation
    return backgroundColor.includes("dark") || backgroundColor.includes("black")
      ? "text-white"
      : "text-black";
  },
};

/**
 * Focus visible utilities for custom focus indicators
 */
export const focusVisible = {
  classes: {
    ring: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    outline:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    subtle:
      "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
  },
};
