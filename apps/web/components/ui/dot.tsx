import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Dot Indicator component using GalaxyCo.ai Design System tokens
 * Small circular indicator with optional pulse animation
 *
 * @example
 * <Dot variant="success" />
 * <Dot variant="warning" pulse />
 * <Dot size="lg" variant="primary" />
 */
const dotVariants = cva("rounded-full", {
  variants: {
    variant: {
      default: "bg-foreground-muted",
      primary: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    },
    size: {
      xs: "h-1.5 w-1.5", // 6px
      sm: "h-2 w-2", // 8px
      default: "h-2.5 w-2.5", // 10px (md)
      lg: "h-3 w-3", // 12px
    },
    pulse: {
      true: "animate-pulse",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    pulse: false,
  },
});

export interface DotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size">,
    VariantProps<typeof dotVariants> {
  /**
   * Accessible label for the dot (required if dot has semantic meaning)
   */
  label?: string;
}

const Dot = React.forwardRef<HTMLSpanElement, DotProps>(
  ({ className, variant, size, pulse, label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role={label ? "status" : undefined}
        aria-label={label}
        aria-hidden={!label}
        className={cn(dotVariants({ variant, size, pulse }), className)}
        {...props}
      />
    );
  },
);

Dot.displayName = "Dot";

export { Dot, dotVariants };
