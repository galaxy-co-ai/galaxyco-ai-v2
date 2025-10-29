/**
 * GalaxyCo.ai Design System (DEPRECATED - Temporary Stub)
 *
 * ⚠️ THIS FILE IS TEMPORARY
 *
 * STATUS:
 * - Provides fallback values for 37 legacy components
 * - ALL components will be rebuilt from wireframes (see docs/REBUILD-PLAN.md)
 * - Even migrated dashboard components will be replaced
 * - This stub keeps the app functional during redesign
 *
 * REBUILD APPROACH:
 * - New components go in /components/v2/
 * - Use semantic HTML + Tailwind + Pico CSS
 * - NO imports from this file in new components
 * - See docs/NEW-COMPONENT-GUIDE.md for patterns
 *
 * DO NOT SPEND TIME MIGRATING THESE LEGACY COMPONENTS!
 * They will be completely replaced during the UI rebuild.
 */

export const colors = {
  // Primary brand - subtle, professional
  primary: {
    50: "#f5f7ff",
    100: "#ebf0ff",
    200: "#d6e0ff",
    300: "#a3b8ff",
    400: "#7090ff",
    500: "#4d6fff", // Main brand color
    600: "#3d5acc",
    700: "#2d4399",
    800: "#1e2d66",
    900: "#0f1633",
  },

  // Neutrals - clean, readable
  neutral: {
    0: "#ffffff",
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Semantic colors
  success: {
    light: "#d4edda",
    DEFAULT: "#28a745",
    dark: "#155724",
  },
  warning: {
    light: "#fef3c7",
    DEFAULT: "#d97706",
    dark: "#92400e",
  },
  error: {
    light: "#fee",
    DEFAULT: "#dc3545",
    dark: "#c33",
  },
  info: {
    light: "#d1ecf1",
    DEFAULT: "#17a2b8",
    dark: "#0c5460",
  },

  // Background colors (for component compatibility)
  background: {
    primary: "#ffffff", // White
    secondary: "#fafafa", // Neutral-50
    tertiary: "#f5f5f5", // Neutral-100
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Text colors (for component compatibility)
  text: {
    primary: "#171717", // Neutral-900
    secondary: "#525252", // Neutral-600
    tertiary: "#a3a3a3", // Neutral-400
    inverse: "#ffffff", // White
    placeholder: "#d4d4d4", // Neutral-300
  },

  // Border colors (for component compatibility)
  border: {
    default: "#e5e5e5", // Neutral-200
    focus: "#4d6fff", // Primary-500
    error: "#dc3545", // Error DEFAULT
    success: "#28a745", // Success DEFAULT
  },

  // Convenience aliases
  primaryColor: "#4d6fff", // Primary-500
  primaryHover: "#3d5acc", // Primary-600
  primaryLight: "#f5f7ff", // Primary-50
  successColor: "#28a745", // Success DEFAULT
  successLight: "#d4edda", // Success light
  warningColor: "#d97706", // Warning DEFAULT (WCAG AA compliant)
  warningLight: "#fef3c7", // Warning light
  danger: "#dc3545", // Error DEFAULT
  dangerLight: "#fee", // Error light
  infoColor: "#17a2b8", // Info DEFAULT
  infoLight: "#d1ecf1", // Info light
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
};

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.07)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
  card: "0 2px 8px rgba(0, 0, 0, 0.08)",
  cardHover: "0 4px 12px rgba(0, 0, 0, 0.12)",
};

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },

  // Aliases for component compatibility
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const animation = {
  // Timing per design spec
  timing: {
    micro: "120ms", // Quick interactions
    fast: "200ms", // Standard transitions
    medium: "320ms", // Larger movements
    slow: "500ms", // Modal/overlay
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
};
