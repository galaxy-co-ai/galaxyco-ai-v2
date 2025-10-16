"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  side = "right",
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) => {
  const sizeClasses = React.useMemo(() => {
    const isVertical = side === "left" || side === "right";

    if (isVertical) {
      return {
        sm: "w-[280px] sm:w-[320px]",
        md: "w-[320px] sm:w-[400px]",
        lg: "w-[400px] sm:w-[500px]",
        xl: "w-[500px] sm:w-[600px]",
        full: "w-full",
      }[size];
    } else {
      return {
        sm: "h-[200px]",
        md: "h-[300px]",
        lg: "h-[400px]",
        xl: "h-[500px]",
        full: "h-full",
      }[size];
    }
  }, [side, size]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && closeOnOverlayClick) {
          onClose();
        }
      }}
    >
      <SheetContent
        side={side}
        className={cn(sizeClasses, "flex flex-col p-0", className)}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <SheetHeader className="border-b border-border p-6 pb-4 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                {title && (
                  <SheetTitle className="text-lg font-semibold text-foreground">
                    {title}
                  </SheetTitle>
                )}
                {description && (
                  <SheetDescription className="text-sm text-muted-foreground">
                    {description}
                  </SheetDescription>
                )}
              </div>

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 flex-shrink-0"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetHeader>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <SheetFooter className="border-t border-border p-6 pt-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

Drawer.displayName = "Drawer";
