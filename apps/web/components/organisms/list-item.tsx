"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ListItemAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "ghost";
  disabled?: boolean;
}

export interface ListItemProps {
  title: string;
  description?: string;
  href?: string;
  avatar?: React.ReactNode;
  badge?: {
    label: string;
    variant?: "default" | "success" | "warning" | "destructive";
  };
  metadata?: Array<{
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
  }>;
  actions?: ListItemAction[];
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  href,
  avatar,
  badge,
  metadata,
  actions,
  isSelected,
  onClick,
  className,
}) => {
  const content = (
    <>
      {/* Avatar/Icon */}
      {avatar && <div className="flex-shrink-0">{avatar}</div>}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">
                {title}
              </h3>
              {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "ghost"}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    action.onClick?.();
                  }}
                  disabled={action.disabled}
                  className="h-8"
                >
                  {action.icon && <span className="mr-1.5">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {metadata.map((meta, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                {meta.icon && (
                  <span className="flex-shrink-0">{meta.icon}</span>
                )}
                <span className="font-medium">{meta.label}:</span>
                <span>{meta.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "flex items-start gap-3 p-4 rounded-lg border border-border",
    "bg-card transition-all duration-200",
    "hover:border-border-hover hover:shadow-sm",
    isSelected && "border-primary bg-accent",
    (href || onClick) && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseClasses,
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        )}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(
          baseClasses,
          "w-full text-left",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        )}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
};

ListItem.displayName = "ListItem";
