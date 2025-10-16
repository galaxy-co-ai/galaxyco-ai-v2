"use client";

import { AgentTemplate } from "@/lib/constants/agent-templates";
import {
  colors,
  spacing,
  radius,
  shadows,
  typography,
  animation,
} from "@/lib/constants/design-system";

interface TemplateCardProps {
  template: AgentTemplate;
  onSelect: (template: AgentTemplate) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <div
      onClick={() => onSelect(template)}
      style={{
        background: colors.neutral[0],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: radius.lg,
        padding: spacing.xl,
        cursor: "pointer",
        transition: `all ${animation.timing.fast} ${animation.easing.default}`,
        boxShadow: shadows.card,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = shadows.cardHover;
        e.currentTarget.style.borderColor = colors.primary["300"];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = shadows.card;
        e.currentTarget.style.borderColor = colors.neutral[200];
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "3rem",
          marginBottom: spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "72px",
          height: "72px",
          background: colors.primaryLight,
          borderRadius: radius.lg,
        }}
      >
        {template.icon}
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing.sm,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        {template.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.neutral[600],
          lineHeight: typography.lineHeight.relaxed,
          marginBottom: spacing.lg,
          flex: 1,
        }}
      >
        {template.description}
      </p>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: spacing.xs,
          flexWrap: "wrap",
          marginBottom: spacing.md,
        }}
      >
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.neutral[600],
              background: colors.neutral[100],
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: radius.sm,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: spacing.md,
          borderTop: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <span
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.neutral[500],
            textTransform: "uppercase",
            fontWeight: typography.fontWeight.medium,
            letterSpacing: "0.05em",
          }}
        >
          {template.category}
        </span>
        <span
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.primaryHover,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          Use Template →
        </span>
      </div>
    </div>
  );
}
