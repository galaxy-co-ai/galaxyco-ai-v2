"use client";

import {
  colors,
  radius,
  shadows,
  animation,
  spacing,
} from "@/lib/constants/design-system";
import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: keyof typeof spacing | "none";
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}

/**
 * Standardized Card Component
 *
 * Ensures consistent card styling across the entire application.
 * All cards use:
 * - rounded-xl (12px border radius)
 * - p-6 (24px padding) by default
 * - shadow-sm default, shadow-md on hover
 * - bg-white background
 *
 * @param variant - 'default' (shadow-sm), 'elevated' (shadow-md), 'outlined' (border only)
 * @param padding - Spacing value from design system (default: 'xl' = 24px)
 * @param hover - Enable hover effects (lift + shadow increase)
 * @param onClick - Makes card clickable with cursor pointer
 */
export function Card({
  children,
  variant = "default",
  padding = "xl",
  hover = false,
  onClick,
  style,
  className = "",
}: CardProps) {
  const baseStyles: CSSProperties = {
    background: colors.background.primary,
    borderRadius: radius.xl,
    padding: padding === "none" ? "0" : spacing[padding],
    transition: `all ${animation.timing.fast} ${animation.easing.default}`,
    cursor: onClick ? "pointer" : "default",
  };

  // Variant-specific base styles
  const variantStyles: CSSProperties = {
    ...(variant === "default" && {
      boxShadow: shadows.sm,
      border: `1px solid ${colors.border.default}`,
    }),
    ...(variant === "elevated" && {
      boxShadow: shadows.md,
      border: "none",
    }),
    ...(variant === "outlined" && {
      boxShadow: "none",
      border: `1px solid ${colors.border.default}`,
    }),
  };

  // Hover styles
  const hoverStyles: CSSProperties = hover
    ? {
        boxShadow: variant === "elevated" ? shadows.lg : shadows.md,
        transform: "translateY(-2px)",
        borderColor: variant !== "elevated" ? colors.border.focus : undefined,
      }
    : {};

  return (
    <div
      className={className}
      onClick={onClick}
      style={{ ...baseStyles, ...variantStyles, ...style }}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow =
            variant === "elevated" ? shadows.md : shadows.sm;
          e.currentTarget.style.transform = "translateY(0)";
          if (variant !== "elevated") {
            e.currentTarget.style.borderColor = colors.border.default;
          }
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Card.Header - Optional header section with consistent spacing
 */
Card.Header = function CardHeader({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        marginBottom: spacing.lg,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Card.Body - Main content area with consistent spacing
 */
Card.Body = function CardBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        flex: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Card.Footer - Footer section with optional border-top
 */
Card.Footer = function CardFooter({
  children,
  withBorder = false,
  style,
}: {
  children: ReactNode;
  withBorder?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        marginTop: spacing.lg,
        paddingTop: withBorder ? spacing.lg : 0,
        borderTop: withBorder ? `1px solid ${colors.border.default}` : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
