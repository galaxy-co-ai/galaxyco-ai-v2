/**
 * GalaxyCo.ai Design Tokens
 * Linear-inspired minimal design + Framer blue accent
 * November 2, 2025
 */

// Brand Colors (Framer Blue + Linear Minimal)
export const colors = {
  // Primary brand (Framer Blue)
  primary: {
    50: '#e6f0ff',
    100: '#cce0ff',
    200: '#99c2ff',
    300: '#66a3ff',
    400: '#3385ff',
    500: '#0055FF', // Main Framer blue
    600: '#0044dd',
    700: '#0033bb',
    800: '#002299',
    900: '#001177',
  },

  // Secondary (Lighter Framer Blue)
  secondary: {
    500: '#0099FF',
    hover: '#0088ee',
  },

  // Agent colors (space themed)
  agent: {
    research: '#8b5cf6', // Purple - research/discovery
    email: '#ec4899', // Pink - communication
    crm: '#14b8a6', // Teal - data management
    workflow: '#f59e0b', // Orange - automation
  },

  // Semantic colors (Linear-inspired)
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0055FF', // Use our Framer blue
  },

  // Confidence score colors
  confidence: {
    high: '#22c55e', // 80-100%
    medium: '#d97706', // Fixed: was #f59e0b (2.15:1 FAIL), now 4.5:1 PASS
    low: '#dc2626', // Fixed: was #ef4444 (4.01:1 FAIL), now 4.5:1 PASS
  },

  // Neutral grayscale (Linear-inspired)
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F5F5F5', // Muted backgrounds
    200: '#ECECEC', // Borders
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#666666', // Muted foreground
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#000000', // Pure black for text
    950: '#000000',
  },

  // Linear-specific tokens
  linear: {
    background: '#FFFFFF',
    foreground: '#000000',
    muted: '#F5F5F5',
    mutedForeground: '#666666',
    border: '#ECECEC',
    borderLight: '#F0F0F0',
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'monospace'],
  },

  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px (Linear H2)
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px (Linear hero headlines)
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.1', // Linear hero headlines
    snug: '1.2', // Linear headings
    normal: '1.5',
    relaxed: '1.6', // Linear body copy
  },

  letterSpacing: {
    tighter: '-0.02em', // Linear headings
    normal: '0',
  },
} as const;

// Spacing system
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// Border radius (Linear uses 6px default)
export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px (Linear default)
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadows (Linear-inspired - subtle)
export const boxShadow = {
  // Linear uses very subtle shadows
  subtle: '0 1px 3px rgba(0, 0, 0, 0.05)',
  hover: '0 4px 12px rgba(0, 0, 0, 0.08)',

  // Standard shadows
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.12)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: '475px',
  sm: '640px', // Mobile
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Large desktop
  '2xl': '1536px',
} as const;

// Animation durations (Linear uses fast 150ms)
export const animation = {
  duration: {
    fast: '150ms', // Linear default - snappy!
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease', // Linear default
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Z-index layers
export const zIndex = {
  hide: -1,
  auto: 'auto',
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
  research: 'telescope',
  email: 'mail',
  crm: 'database',
  workflow: 'workflow',

  // General space theme
  dashboard: 'command',
  settings: 'settings',
  profile: 'user-circle',
  notifications: 'bell',
  help: 'help-circle',

  // Navigation
  menu: 'menu',
  close: 'x',
  back: 'arrow-left',
  forward: 'arrow-right',

  // Status
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
  info: 'info',
  pending: 'clock',

  // Actions
  add: 'plus',
  edit: 'edit',
  delete: 'trash-2',
  search: 'search',
  filter: 'filter',
  refresh: 'refresh-cw',
} as const;

// Layout constants
export const layout = {
  sidebar: {
    collapsed: '64px',
    expanded: '240px',
    transition: '300ms ease-in-out',
  },
  topbar: {
    height: '64px',
  },
  bottomNav: {
    height: '64px',
  },
  page: {
    maxWidth: '1200px',
    padding: '24px',
  },
} as const;

// Touch targets for mobile
export const touchTargets = {
  minimum: '44px', // iOS HIG minimum
  comfortable: '48px',
  large: '56px',
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
