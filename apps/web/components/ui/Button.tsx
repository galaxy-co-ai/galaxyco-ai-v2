"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

/**
 * Professional Button Component using CSS Design System
 *
 * Variants:
 * - primary: Blue background, white text (main actions)
 * - secondary: White background, gray text with border (secondary actions)
 * - ghost: Transparent minimal (low-priority actions)
 * - danger: Red background for destructive actions
 *
 * Sizes:
 * - sm: Compact padding and smaller text
 * - md: Standard size (default)
 * - lg: Larger padding and text
 */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      children,
      disabled,
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    // Build class names using our CSS design system
    const baseClasses = "btn";
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "",
      danger: "",
    };
    const sizeClasses = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Custom styles for ghost and danger variants not in base CSS
    const customStyles: React.CSSProperties = {
      width: fullWidth ? "100%" : "auto",
      ...style,
    };

    if (variant === "ghost") {
      customStyles.background = "transparent";
      customStyles.color = "var(--text-secondary)";
      customStyles.border = "none";
      customStyles.boxShadow = "none";
      customStyles.padding = "var(--space-2) var(--space-3)";
    }

    if (variant === "danger") {
      customStyles.background = "var(--error)";
      customStyles.color = "var(--text-inverse)";
    }

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        style={customStyles}
        {...props}
      >
        {loading ? (
          <Loader2
            size={16}
            style={{ animation: "spin 0.6s linear infinite" }}
          />
        ) : (
          leftIcon && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {leftIcon}
            </span>
          )
        )}
        {children}
        {rightIcon && !loading && (
          <span style={{ display: "flex", alignItems: "center" }}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
