"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string | ReactNode;
  iconType?: "emoji" | "svg" | "component";
  title: string;
  description: string;
  helpText?: string;
  steps?: string[];
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Enhanced EmptyState Component
 *
 * Professional empty state design with:
 * - Support for emoji, SVG, or custom component icons
 * - Optional helpful steps
 * - Prominent CTA styling
 * - Better visual hierarchy
 */

export function EmptyState({
  icon,
  iconType = "emoji",
  title,
  description,
  helpText,
  steps,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center p-16 bg-secondary/50 rounded-xl border-2 border-dashed border-border max-w-2xl mx-auto",
        className
      )}
    >
      {icon && (
        <div className={cn(
          "mb-6 flex justify-center items-center",
          iconType === "emoji" ? "text-6xl opacity-70" : "text-5xl"
        )}>
          {typeof icon === "string" ? icon : icon}
        </div>
      )}

      <h3 className="text-2xl font-semibold text-foreground mb-4">
        {title}
      </h3>

      <p className={cn(
        "text-base text-muted-foreground max-w-lg mx-auto leading-relaxed",
        helpText || steps ? "mb-6" : "mb-8"
      )}>
        {description}
      </p>

      {/* Optional help text */}
      {helpText && (
        <p className="text-sm text-muted-foreground/80 max-w-lg mx-auto mb-8 italic">
          {helpText}
        </p>
      )}

      {/* Optional helpful steps */}
      {steps && steps.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-6 max-w-lg mx-auto mb-8">
          <div className="text-sm font-semibold text-foreground mb-4 text-left">
            Get started:
          </div>
          <ul className="list-none p-0 m-0 text-left flex flex-col gap-3">
            {steps.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {action && (
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            variant={action.variant || "default"}
            size="lg"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
          {secondaryAction && (
            <Button
              variant="secondary"
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
