import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Textarea component using GalaxyCo.ai Design System tokens
 * Enhanced with auto-resize and character count features
 *
 * @example
 * <Textarea placeholder="Enter description" />
 * <Textarea autoResize maxLength={500} showCount />
 * <Textarea variant="destructive" error="This field is required" />
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
  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below textarea
   */
  helperText?: string;

  /**
   * Auto-resize textarea to fit content
   * @default false
   */
  autoResize?: boolean;

  /**
   * Show character count
   * @default false
   */
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      error,
      helperText,
      autoResize = false,
      showCount = false,
      maxLength,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize logic
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // Character count logic
    React.useEffect(() => {
      if (showCount && value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value, showCount]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            textareaVariants({
              variant: error ? "destructive" : variant,
              size,
              className,
            }),
            autoResize && "resize-none",
          )}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${props.id}-error`
              : helperText
                ? `${props.id}-helper`
                : undefined
          }
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {(showCount || error || helperText) && (
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span
              id={error ? `${props.id}-error` : `${props.id}-helper`}
              className={cn(
                error ? "text-destructive" : "text-foreground-muted",
              )}
            >
              {error || helperText}
            </span>
            {showCount && (
              <span className="text-foreground-muted">
                {charCount}
                {maxLength && `/${maxLength}`}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
