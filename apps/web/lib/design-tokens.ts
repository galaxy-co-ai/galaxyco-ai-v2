/**
 * GalaxyCo.ai Design Tokens
 * Complete design system for the nuclear rebuild
 * October 15, 2025
 */

// Brand Colors
export const colors = {
  // Primary brand
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Agent colors (space themed)
  agent: {
    research: "#8b5cf6", // Purple - research/discovery
    email: "#ec4899", // Pink - communication
    crm: "#14b8a6", // Teal - data management
    workflow: "#f59e0b", // Orange - automation
  },

  // Semantic colors
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Confidence score colors
  confidence: {
    high: "#22c55e", // 80-100%
    medium: "#f59e0b", // 50-79%
    low: "#ef4444", // 0-49%
  },

  // Neutral grayscale
  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937", // Dark sidebar
    900: "#111827", // Darkest
    950: "#030712", // Almost black
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["Fira Code", "Consolas", "monospace"],
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
    "5xl": "3rem", // 48px
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
    relaxed: "1.625",
  },
} as const;

// Spacing system
export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Shadows
export const boxShadow = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: "475px",
  sm: "640px", // Mobile
  md: "768px", // Tablet
  lg: "1024px", // Desktop
  xl: "1280px", // Large desktop
  "2xl": "1536px",
} as const;

// Animation durations
export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    linear: "linear",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Z-index layers
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Space-themed icons mapping (using lucide-react)
export const spaceIcons = {
  // Agent types
  research: "telescope",
  email: "mail",
  crm: "database",
  workflow: "workflow",

  // General space theme
  dashboard: "command",
  settings: "settings",
  profile: "user-circle",
  notifications: "bell",
  help: "help-circle",

  // Navigation
  menu: "menu",
  close: "x",
  back: "arrow-left",
  forward: "arrow-right",

  // Status
  success: "check-circle",
  warning: "alert-triangle",
  error: "alert-circle",
  info: "info",
  pending: "clock",

  // Actions
  add: "plus",
  edit: "edit",
  delete: "trash-2",
  search: "search",
  filter: "filter",
  refresh: "refresh-cw",
} as const;

// Layout constants
export const layout = {
  sidebar: {
    collapsed: "64px",
    expanded: "240px",
    transition: "300ms ease-in-out",
  },
  topbar: {
    height: "64px",
  },
  bottomNav: {
    height: "64px",
  },
  page: {
    maxWidth: "1200px",
    padding: "24px",
  },
} as const;

// Touch targets for mobile
export const touchTargets = {
  minimum: "44px", // iOS HIG minimum
  comfortable: "48px",
  large: "56px",
} as const;

// Export all tokens as a single object for convenience
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  breakpoints,
  animation,
  zIndex,
  spaceIcons,
  layout,
  touchTargets,
} as const;

export type DesignTokens = typeof designTokens;
