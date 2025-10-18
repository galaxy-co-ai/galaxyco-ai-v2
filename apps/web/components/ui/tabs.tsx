"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Tabs component using GalaxyCo.ai Design System tokens
 * Built on Radix UI Tabs primitive with full accessibility
 *
 * @example
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  ["inline-flex items-center justify-center rounded-lg p-1 transition-colors"],
  {
    variants: {
      variant: {
        default: "bg-background-subtle border border-border",
        underline: "border-b border-border bg-transparent",
        pills: "gap-2 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap px-spacing-md py-spacing-sm",
    "text-body-sm font-medium transition-all duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-md text-foreground-muted",
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "hover:text-foreground",
        ],
        underline: [
          "border-b-2 border-transparent rounded-none",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
          "text-foreground-muted hover:text-foreground",
        ],
        pills: [
          "rounded-full text-foreground-muted",
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          "hover:bg-background-subtle hover:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-spacing-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
