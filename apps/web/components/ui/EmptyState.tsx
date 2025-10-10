"use client";

import { ReactNode } from "react";
import {
  colors,
  typography,
  spacing,
  radius,
} from "@/lib/constants/design-system";
import { Button } from "./Button";

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
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
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
}: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: spacing["4xl"],
        background: colors.background.secondary,
        borderRadius: radius.xl,
        border: `2px dashed ${colors.border.default}`,
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: iconType === "emoji" ? "4rem" : "3rem",
            marginBottom: spacing.xl,
            opacity: iconType === "emoji" ? 0.7 : 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {typeof icon === "string" ? icon : icon}
        </div>
      )}

      <h3
        style={{
          fontSize: typography.sizes["2xl"],
          fontWeight: typography.weights.semibold,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: typography.sizes.base,
          color: colors.text.secondary,
          maxWidth: "480px",
          margin: "0 auto",
          marginBottom: helpText || steps ? spacing.lg : spacing.xl,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Optional help text */}
      {helpText && (
        <p
          style={{
            fontSize: typography.sizes.sm,
            color: colors.text.tertiary,
            maxWidth: "480px",
            margin: "0 auto",
            marginBottom: spacing.xl,
            fontStyle: "italic",
          }}
        >
          {helpText}
        </p>
      )}

      {/* Optional helpful steps */}
      {steps && steps.length > 0 && (
        <div
          style={{
            background: colors.background.primary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            padding: spacing.xl,
            maxWidth: "480px",
            margin: `0 auto ${spacing.xl}`,
          }}
        >
          <div
            style={{
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
              marginBottom: spacing.md,
              textAlign: "left",
            }}
          >
            Get started:
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: spacing.sm,
            }}
          >
            {steps.map((step, index) => (
              <li
                key={index}
                style={{
                  fontSize: typography.sizes.sm,
                  color: colors.text.secondary,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: spacing.sm,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: colors.primary[100],
                    color: colors.primary[600],
                    fontSize: typography.sizes.xs,
                    fontWeight: typography.weights.semibold,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {action && (
        <div
          style={{
            display: "flex",
            gap: spacing.md,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant={action.variant || "primary"}
            size="lg"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
          {secondaryAction && (
            <Button
              variant="outline"
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
