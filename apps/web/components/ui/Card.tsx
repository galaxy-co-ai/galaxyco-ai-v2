"use client";

import React, { forwardRef, ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "compact" | "comfortable" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Professional Card Component using CSS Design System
 *
 * Ensures consistent card styling matching StackAI/OpenSea quality.
 * Uses CSS variables for spacing, shadows, and colors.
 *
 * Variants:
 * - default: Standard card with base styling
 * - compact: Reduced padding for dense layouts (OpenSea style)
 * - comfortable: Extra padding for spacious layouts
 * - interactive: Hover effects for clickable cards
 *
 * All cards use rounded-lg (12px), subtle shadows, and proper transitions.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding,
      shadow,
      hover = false,
      className = "",
      onClick,
      style,
      ...props
    },
    ref,
  ) => {
    // Use CSS classes from our design system
    const baseClasses = "card";

    const variantClasses = {
      default: "",
      compact: "card-compact",
      comfortable: "card-comfortable",
      interactive: "",
    };

    // Build class names
    const classes = [baseClasses, variantClasses[variant], className]
      .filter(Boolean)
      .join(" ");

    // Custom styles for overrides
    const customStyles: React.CSSProperties = {
      cursor: onClick ? "pointer" : "default",
      ...style,
    };

    // Padding override
    if (padding) {
      const paddingMap = {
        none: "0",
        sm: "var(--space-4)",
        md: "var(--space-6)",
        lg: "var(--space-8)",
      };
      customStyles.padding = paddingMap[padding];
    }

    // Shadow override
    if (shadow) {
      const shadowMap = {
        none: "none",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      };
      customStyles.boxShadow = shadowMap[shadow];
    }

    // Enhanced hover effect for interactive cards
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover || variant === "interactive") {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover || variant === "interactive") {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }
    };

    return (
      <div
        ref={ref}
        className={classes}
        style={customStyles}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Card sub-components for structured content
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          paddingBottom: "var(--space-4)",
          borderBottom: "1px solid var(--border-default)",
          marginBottom: "var(--space-6)",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`flex-1 ${className}`} {...props}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = "CardBody";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  withBorder?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, withBorder = false, className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          paddingTop: withBorder ? "var(--space-4)" : "0",
          borderTop: withBorder ? "1px solid var(--border-default)" : "none",
          marginTop: "var(--space-6)",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

// Extend Card type with sub-components
type CardComponent = typeof Card & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

// Legacy compound component API for backward compatibility
(Card as CardComponent).Header = CardHeader;
(Card as CardComponent).Body = CardBody;
(Card as CardComponent).Footer = CardFooter;

export default Card as CardComponent;
