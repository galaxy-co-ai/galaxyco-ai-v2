"use client";

import {
  colors,
  radius,
  shadows,
  animation,
  typography,
  spacing,
} from "@/lib/constants/design-system";
import { CSSProperties, ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

/**
 * Standardized Button Component
 *
 * Variants:
 * - primary: Blue background, white text (main actions)
 * - secondary: White background, gray text with border (secondary actions)
 * - outline: Transparent with blue border (tertiary actions)
 * - ghost: Transparent minimal (low-priority actions)
 * - danger: Red background for destructive actions
 *
 * Sizes:
 * - sm: px-4 py-2 text-sm
 * - md: px-6 py-3 text-base (default)
 * - lg: px-8 py-4 text-lg
 */

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.weights.semibold,
    border: "none",
    borderRadius: radius.lg,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    transition: `all ${animation.timing.fast} ${animation.easing.default}`,
    width: fullWidth ? "100%" : "auto",
    opacity: disabled || loading ? 0.6 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: colors.primary[500],
      color: colors.text.inverse,
      boxShadow: shadows.sm,
    },
    secondary: {
      background: colors.background.primary,
      color: colors.text.primary,
      border: `1px solid ${colors.border.default}`,
      boxShadow: shadows.sm,
    },
    outline: {
      background: "transparent",
      color: colors.primary[600],
      border: `1px solid ${colors.primary[500]}`,
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: colors.text.secondary,
      border: "none",
      boxShadow: "none",
    },
    danger: {
      background: colors.error.DEFAULT,
      color: colors.text.inverse,
      boxShadow: shadows.sm,
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.sizes.sm,
    },
    md: {
      padding: `${spacing.md} ${spacing.xl}`,
      fontSize: typography.sizes.base,
    },
    lg: {
      padding: `${spacing.lg} ${spacing["2xl"]}`,
      fontSize: typography.sizes.lg,
    },
  };

  const hoverStyles: Record<string, CSSProperties> = {
    primary: {
      background: colors.primary[600],
      boxShadow: shadows.md,
    },
    secondary: {
      background: colors.neutral[50],
      boxShadow: shadows.md,
    },
    outline: {
      background: colors.primary[50],
    },
    ghost: {
      background: colors.neutral[100],
    },
    danger: {
      background: colors.error.dark,
      boxShadow: shadows.md,
    },
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, {
            background: variantStyles[variant].background as string,
            boxShadow: (variantStyles[variant].boxShadow as string) || "none",
          });
        }
      }}
    >
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
      )}
      {leftIcon && !loading && (
        <span style={{ display: "flex", alignItems: "center" }}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && !loading && (
        <span style={{ display: "flex", alignItems: "center" }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
}
