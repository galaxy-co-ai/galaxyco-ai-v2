import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Textarea component using GalaxyCo.ai Design System tokens
 * Extends Input styling for multi-line text input
 */
const textareaVariants = cva(
  [
    "flex min-h-[80px] w-full rounded border px-4 py-3 text-sm transition-colors duration-fast",
    "placeholder:text-foreground-subtle",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-background-subtle read-only:cursor-default",
    "resize-vertical",
  ],
  {
    variants: {
      variant: {
        // Default textarea styling
        default: [
          "border-border bg-background-subtle text-foreground",
          "hover:border-border-hover",
        ],
        // Error state
        destructive: [
          "border-destructive bg-background-subtle text-foreground",
          "focus:ring-destructive focus:border-destructive",
        ],
        // Success state
        success: [
          "border-success bg-background-subtle text-foreground",
          "focus:ring-success focus:border-success",
        ],
      },
      size: {
        sm: "min-h-[60px] px-3 py-2 text-sm",
        default: "min-h-[80px] px-4 py-3 text-sm",
        lg: "min-h-[120px] px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          textareaVariants({
            variant: error ? "destructive" : variant,
            size,
            className,
          }),
        )}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
