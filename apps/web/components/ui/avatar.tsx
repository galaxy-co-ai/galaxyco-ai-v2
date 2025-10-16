import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Avatar component using GalaxyCo.ai Design System tokens
 * Built on Radix UI Avatar primitive with fallback and status indicator
 *
 * @example
 * <Avatar src="/avatar.jpg" alt="John Doe" />
 * <Avatar fallback="JD" variant="square" size="lg" />
 * <Avatar src="/avatar.jpg" status="online" />
 */
const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden bg-muted text-foreground font-medium",
  {
    variants: {
      variant: {
        circle: "rounded-full",
        square: "rounded-md",
      },
      size: {
        xs: "h-6 w-6 text-xs", // 24px
        sm: "h-8 w-8 text-xs", // 32px
        default: "h-10 w-10 text-sm", // 40px (md)
        lg: "h-12 w-12 text-base", // 48px
        xl: "h-14 w-14 text-lg", // 56px
        "2xl": "h-16 w-16 text-xl", // 64px
      },
    },
    defaultVariants: {
      variant: "circle",
      size: "default",
    },
  },
);

const statusDotVariants = cva(
  "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        default: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-3.5 w-3.5",
        "2xl": "h-4 w-4",
      },
      status: {
        online: "bg-success",
        offline: "bg-foreground-subtle",
        busy: "bg-destructive",
        away: "bg-warning",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
      "size"
    >,
    VariantProps<typeof avatarVariants> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Fallback text/initials or ReactNode
   */
  fallback?: React.ReactNode;

  /**
   * Status indicator
   */
  status?: "online" | "offline" | "busy" | "away";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, variant, size, src, alt, fallback, status, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ variant, size }), className)}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
        delayMs={600}
      >
        {fallback || alt?.charAt(0).toUpperCase() || "?"}
      </AvatarPrimitive.Fallback>
      {status && (
        <span
          className={cn(statusDotVariants({ size, status }))}
          aria-label={status}
        />
      )}
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar, avatarVariants };
