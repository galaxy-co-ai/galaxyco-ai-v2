"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Skeleton component using GalaxyCo.ai Design System tokens
 * Loading placeholder with design system styling
 */
const skeletonVariants = cva(
  [
    "animate-pulse rounded bg-background-subtle"
  ],
  {
    variants: {
      variant: {
        default: "bg-background-subtle",
        card: "bg-background-subtle rounded-lg",
        text: "bg-background-subtle h-4",
        avatar: "bg-background-subtle rounded-full",
        button: "bg-background-subtle rounded h-10"
      },
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
        xl: "h-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface SkeletonProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
