/**
 * Design System Constants
 * Re-exports with consistent naming for components
 */

import {
  colors as importedColors,
  spacing as importedSpacing,
  radius as importedRadius,
  shadows as importedShadows,
  typography as importedTypography,
  animation as importedAnimation,
  breakpoints as importedBreakpoints,
  zIndex as importedZIndex,
} from "./constants/design-system";

// Export with COLORS/SPACING naming convention for components
export const COLORS = {
  // Background colors
  background: importedColors.background,

  // Text colors
  text: importedColors.text,

  // Border colors
  border: {
    primary: importedColors.border.default,
    focus: importedColors.border.focus,
    error: importedColors.border.error,
    success: importedColors.border.success,
  },

  // Accent colors (for primary actions, highlights)
  accent: {
    primary: importedColors.primary[500],
    hover: importedColors.primary[600],
    light: importedColors.primary[50],
  },

  // Semantic colors
  success: importedColors.success,
  warning: importedColors.warning,
  error: importedColors.error,
  info: importedColors.info,

  // All primary shades
  primary: importedColors.primary,

  // All neutral shades
  neutral: importedColors.neutral,
};

export const SPACING = {
  xs: importedSpacing.xs,
  sm: importedSpacing.sm,
  md: importedSpacing.md,
  lg: importedSpacing.lg,
  xl: importedSpacing.xl,
  xxl: importedSpacing["2xl"],
  xxxl: importedSpacing["3xl"],
  xxxxl: importedSpacing["4xl"],

  // Radius for border-radius
  radius: {
    sm: importedRadius.sm,
    md: importedRadius.md,
    lg: importedRadius.lg,
    xl: importedRadius.xl,
    full: importedRadius.full,
  },
};

export const TYPOGRAPHY = importedTypography;
export const SHADOWS = importedShadows;
export const ANIMATION = importedAnimation;
export const BREAKPOINTS = importedBreakpoints;
export const Z_INDEX = importedZIndex;

// Also export original constants for backward compatibility
export {
  importedColors as colors,
  importedSpacing as spacing,
  importedRadius as radius,
  importedShadows as shadows,
  importedTypography as typography,
  importedAnimation as animation,
  importedBreakpoints as breakpoints,
  importedZIndex as zIndex,
};
