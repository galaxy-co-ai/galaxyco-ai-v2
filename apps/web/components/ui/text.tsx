import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Text component using GalaxyCo.ai Design System tokens
 * Versatile text component for body copy, labels, and other text content
 *
 * @example
 * <Text>Default body text</Text>
 * <Text variant="muted" size="sm">Secondary text</Text>
 * <Text as="span" variant="accent">Highlighted text</Text>
 */
const textVariants = cva("", {
  variants: {
    variant: {
      // Default body text
      body: "text-foreground",
      // Muted/secondary text
      muted: "text-foreground-muted",
      // Subtle/tertiary text
      subtle: "text-foreground-subtle",
      // Accent/highlighted text
      accent: "text-primary",
      // Success text
      success: "text-success",
      // Warning text
      warning: "text-warning",
      // Error text
      error: "text-destructive",
    },
    size: {
      xs: "text-xs leading-4", // 12px / 16px - Tiny text
      sm: "text-sm leading-5", // 14px / 20px - Small text
      base: "text-base leading-6", // 16px / 24px - Body text (default)
      lg: "text-lg leading-7", // 18px / 28px - Large text
    },
    weight: {
      normal: "font-normal", // 400
      medium: "font-medium", // 500
      semibold: "font-semibold", // 600
      bold: "font-bold", // 700
    },
  },
  defaultVariants: {
    variant: "body",
    size: "base",
    weight: "normal",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "size">,
    VariantProps<typeof textVariants> {
  /**
   * The HTML element to render
   * @default "p"
   */
  as?: "p" | "span" | "div" | "label";
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, size, weight, as = "p", children, ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ variant, size, weight }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";

export { Text, textVariants };
