import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Code component using GalaxyCo.ai Design System tokens
 * Displays inline or block code with monospace font
 *
 * @example
 * <Code variant="inline">npm install</Code>
 * <Code variant="block" language="typescript">
 * const greeting = "Hello World";
 * console.log(greeting);
 * </Code>
 */
const codeVariants = cva("font-mono", {
  variants: {
    variant: {
      // Inline code within text
      inline: [
        "inline-flex items-center",
        "px-1.5 py-0.5",
        "rounded-sm",
        "bg-muted text-foreground",
        "text-sm",
        "border border-border",
      ],
      // Block code (multi-line)
      block: [
        "block",
        "p-4",
        "rounded-md",
        "bg-background-elevated text-foreground",
        "text-sm",
        "border border-border",
        "overflow-x-auto",
        "whitespace-pre",
      ],
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  /**
   * Programming language (for block variant)
   * Currently for semantic purposes only, syntax highlighting requires additional library
   */
  language?: string;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, language, children, ...props }, ref) => {
    // Use <code> for inline, <pre><code> for block
    if (variant === "block") {
      return (
        <pre
          ref={ref as React.Ref<HTMLPreElement>}
          className={cn(codeVariants({ variant }), className)}
          {...(props as React.HTMLAttributes<HTMLPreElement>)}
        >
          <code data-language={language}>{children}</code>
        </pre>
      );
    }

    return (
      <code
        ref={ref as React.Ref<HTMLElement>}
        className={cn(codeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </code>
    );
  },
);

Code.displayName = "Code";

export { Code, codeVariants };
