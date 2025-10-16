import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Caption component using GalaxyCo.ai Design System tokens
 * Small text labels, captions, and helper text with optional leading icons
 *
 * @example
 * <Caption>Default caption text</Caption>
 * <Caption variant="muted">Secondary caption</Caption>
 * <Caption variant="error" icon={<AlertCircle />}>Error message</Caption>
 */
const captionVariants = cva("inline-flex items-center gap-1.5 font-normal", {
  variants: {
    variant: {
      // Default caption
      default: "text-foreground",
      // Muted/secondary
      muted: "text-foreground-muted",
      // Subtle/tertiary
      subtle: "text-foreground-subtle",
      // Success state
      success: "text-success",
      // Warning state
      warning: "text-warning",
      // Error state
      error: "text-destructive",
    },
    size: {
      xs: "text-xs leading-4", // 12px - Tiny captions
      sm: "text-sm leading-5", // 14px - Small captions
    },
  },
  defaultVariants: {
    variant: "default",
    size: "xs",
  },
});

export interface CaptionProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size">,
    VariantProps<typeof captionVariants> {
  /**
   * Optional icon to display before the text
   * Icon should be sized appropriately (16px recommended)
   */
  icon?: React.ReactNode;
}

const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(captionVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0 h-4 w-4">{icon}</span>}
        {children}
      </span>
    );
  },
);

Caption.displayName = "Caption";

export { Caption, captionVariants };
