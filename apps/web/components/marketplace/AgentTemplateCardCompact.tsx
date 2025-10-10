"use client";

import {
  colors,
  shadows,
  radius,
  spacing,
  typography,
} from "@/lib/constants/design-system";
import { useState } from "react";

interface AgentTemplateCardProps {
  template: {
    id: string;
    name: string;
    shortDescription: string;
    category: string;
    type: string;
    badgeText?: string;
    rating: number;
    reviewCount: number;
    installCount: number;
    installs24h?: number;
    kpis?: {
      successRate?: number;
      avgTimeSaved?: string;
      accuracy?: number;
    };
    tags: string[];
  };
  isFeatured?: boolean;
}

/**
 * Compact OpenSea-style Agent Card
 * - Minimal info shown by default
 * - Details revealed on hover
 * - Much smaller footprint
 */
export default function AgentTemplateCardCompact({
  template,
  isFeatured,
}: AgentTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ratingStars = (template.rating / 100).toFixed(1);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        background: colors.background.primary,
        border: `1px solid ${isHovered ? colors.border.focus : colors.border.default}`,
        borderRadius: radius.lg,
        padding: spacing.md,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered ? shadows.md : shadows.sm,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        minHeight: isFeatured ? "180px" : "140px",
      }}
    >
      {/* Badge */}
      {template.badgeText && (
        <div
          style={{
            position: "absolute",
            top: spacing.sm,
            right: spacing.sm,
            padding: `2px ${spacing.sm}`,
            background: colors.primary[500],
            color: "white",
            borderRadius: radius.sm,
            fontSize: typography.sizes.xs,
            fontWeight: typography.weights.semibold,
            zIndex: 1,
          }}
        >
          {template.badgeText}
        </div>
      )}

      {/* Category */}
      <div
        style={{
          fontSize: typography.sizes.xs,
          color: colors.text.tertiary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: spacing.xs,
        }}
      >
        {template.category}
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.semibold,
          color: colors.text.primary,
          marginBottom: spacing.sm,
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: "2.6em",
        }}
      >
        {template.name}
      </h3>

      {/* Description - only on hover or featured */}
      {(isHovered || isFeatured) && (
        <p
          style={{
            fontSize: typography.sizes.xs,
            color: colors.text.secondary,
            marginBottom: spacing.sm,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {template.shortDescription}
        </p>
      )}

      {/* Stats - compact single row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: typography.sizes.xs,
          color: colors.text.secondary,
          marginBottom: isHovered ? spacing.sm : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
          <span>⭐</span>
          <span
            style={{
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
            }}
          >
            {ratingStars}
          </span>
        </div>
        <div>{template.installCount.toLocaleString()} installs</div>
      </div>

      {/* KPIs - only on hover */}
      {isHovered && template.kpis && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: spacing.xs,
            marginBottom: spacing.sm,
            padding: spacing.sm,
            background: colors.background.secondary,
            borderRadius: radius.sm,
            fontSize: typography.sizes.xs,
          }}
        >
          {template.kpis.successRate && (
            <div>
              <div style={{ color: colors.text.tertiary }}>Success</div>
              <div
                style={{
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                }}
              >
                {template.kpis.successRate}%
              </div>
            </div>
          )}
          {template.kpis.avgTimeSaved && (
            <div>
              <div style={{ color: colors.text.tertiary }}>Saves</div>
              <div
                style={{
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                }}
              >
                {template.kpis.avgTimeSaved}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button - only on hover */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Install agent:", template.id);
          }}
          style={{
            width: "100%",
            padding: `${spacing.sm} ${spacing.md}`,
            background: colors.primary[500],
            color: "white",
            border: "none",
            borderRadius: radius.md,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.semibold,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary[500];
          }}
        >
          Install
        </button>
      )}

      {/* Tags - show 2 on hover */}
      {isHovered && template.tags && template.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: spacing.xs,
            marginTop: spacing.sm,
            flexWrap: "wrap",
          }}
        >
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              style={{
                padding: `2px ${spacing.sm}`,
                background: colors.primary[50],
                color: colors.primary[600],
                borderRadius: radius.sm,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.medium,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
