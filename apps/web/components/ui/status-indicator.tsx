import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Status Indicator component using GalaxyCo.ai Design System tokens
 * Displays user presence or status with optional label
 *
 * @example
 * <StatusIndicator status="online" />
 * <StatusIndicator status="busy" showLabel />
 * <StatusIndicator status="away" pulse />
 */
const statusIndicatorVariants = cva("inline-flex items-center gap-1.5", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm", // md
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const statusDotVariants = cva("rounded-full", {
  variants: {
    status: {
      online: "bg-success",
      offline: "bg-foreground-subtle",
      busy: "bg-destructive",
      away: "bg-warning",
      inactive: "bg-foreground-muted",
    },
    size: {
      sm: "h-2 w-2", // 8px
      default: "h-2.5 w-2.5", // 10px (md)
      lg: "h-3 w-3", // 12px
    },
    pulse: {
      true: "animate-pulse",
    },
  },
  defaultVariants: {
    status: "offline",
    size: "default",
    pulse: false,
  },
});

export interface StatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size">,
    VariantProps<typeof statusIndicatorVariants> {
  /**
   * Current status
   */
  status: "online" | "offline" | "busy" | "away" | "inactive";

  /**
   * Show status label text
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom label override (defaults to status name)
   */
  label?: string;

  /**
   * Pulse animation for status dot
   * @default false
   */
  pulse?: boolean;
}

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    {
      className,
      status,
      showLabel = false,
      label,
      size,
      pulse = false,
      ...props
    },
    ref,
  ) => {
    const defaultLabels = {
      online: "Online",
      offline: "Offline",
      busy: "Busy",
      away: "Away",
      inactive: "Inactive",
    };

    const statusLabel = label || defaultLabels[status];

    return (
      <span
        ref={ref}
        role="status"
        aria-label={statusLabel}
        className={cn(statusIndicatorVariants({ size }), className)}
        {...props}
      >
        <span
          className={cn(statusDotVariants({ status, size, pulse }))}
          aria-hidden="true"
        />
        {showLabel && (
          <span className="font-medium text-foreground">{statusLabel}</span>
        )}
      </span>
    );
  },
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator, statusIndicatorVariants };
