/**
 * GalaxyCo.ai Design System Theme
 *
 * Based on requirements:
 * - Clean & Minimal + Enterprise Professional hybrid
 * - Cool tones with monochrome base
 * - Soft & Modern components
 * - Card-based UI patterns
 *
 * Inspirations: StackAI, OpenSea, OpenAI Agent Builder, Sider, Vercel
 */

export const theme = {
  // Color Palette - Cool tones with monochrome base
  colors: {
    // Neutral/Monochrome foundation
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA', // Background
      100: '#F4F4F5', // Light surfaces
      200: '#E4E4E7', // Borders
      300: '#D4D4D8', // Disabled
      400: '#A1A1AA', // Placeholder
      500: '#71717A', // Muted text
      600: '#52525B', // Secondary text
      700: '#3F3F46', // Primary text
      800: '#27272A', // Dark surfaces
      900: '#18181B', // Near black
    },

    // Primary - Blue (main accent)
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6', // Main
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },

    // Secondary - Purple (premium/special)
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7', // Main
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87',
    },

    // Accent - Teal (success/active)
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Main
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },

    // Semantic colors
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue
  },

  // Typography - Clean, confident
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, monospace",
  },

  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Spacing - Generous whitespace
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
  },

  // Border Radius - Soft & Modern
  radii: {
    none: '0',
    sm: '0.25rem', // 4px - Subtle
    md: '0.5rem', // 8px - Default
    lg: '0.75rem', // 12px - Cards
    xl: '1rem', // 16px - Modals
    '2xl': '1.5rem', // 24px - Large elements
    full: '9999px', // Pills
  },

  // Shadows - Medium depth
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Transitions - Smooth but not slow
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // Breakpoints - Responsive
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index layers
  zIndices: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    toast: 70,
  },
};

// Type exports
export type Theme = typeof theme;
export type Colors = typeof theme.colors;
export type Spacing = typeof theme.spacing;
export type Radii = typeof theme.radii;
export type Shadows = typeof theme.shadows;
