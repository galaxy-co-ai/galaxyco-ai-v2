import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Simplified Button: semantic HTML with Pico CSS defaults.
// Keeps `asChild` for compatibility, ignores visual variants.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: string
  size?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(className)} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

// Backwards-compatible stub. Returns provided className or empty string.
function buttonVariants(_: { variant?: string; size?: string; className?: string } = {}) {
  return _.className ?? ""
}

export { Button, buttonVariants }
