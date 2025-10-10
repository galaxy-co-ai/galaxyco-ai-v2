"use client";

import { colors, shadows, radius } from "@/lib/constants/design-system";
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

export default function AgentTemplateCard({
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
        padding: "1.5rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered ? shadows.cardHover : shadows.card,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Badge */}
      {template.badgeText && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.25rem 0.75rem",
            background: template.badgeText.includes("TRENDING")
              ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              : template.badgeText === "NEW"
                ? colors.success.DEFAULT
                : colors.primary[500],
            color: "white",
            borderRadius: radius.sm,
            fontSize: "0.75rem",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {template.badgeText}
        </div>
      )}

      {/* Category & Type */}
      <div
        style={{
          fontSize: "0.75rem",
          color: colors.text.tertiary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "0.75rem",
        }}
      >
        {template.category}
      </div>

      {/* Name - Increased to text-xl for better hierarchy */}
      <h3
        style={{
          fontSize: "1.25rem", // text-xl
          fontWeight: "600",
          color: colors.text.primary,
          marginBottom: "0.5rem",
          lineHeight: "1.3",
        }}
      >
        {template.name}
      </h3>

      {/* Description - Reduced to text-sm with more breathing room */}
      <p
        style={{
          fontSize: "0.875rem", // text-sm
          color: colors.text.secondary,
          marginBottom: "1.5rem",
          lineHeight: "1.6",
          flex: 1,
        }}
      >
        {template.shortDescription}
      </p>

      {/* KPIs */}
      {template.kpis && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
            marginBottom: "1.25rem",
            padding: "1rem",
            background: colors.background.secondary,
            borderRadius: radius.md,
          }}
        >
          {template.kpis.successRate && (
            <div>
              <div style={{ fontSize: "0.75rem", color: colors.text.tertiary }}>
                Success Rate
              </div>
              <div
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                {template.kpis.successRate}%
              </div>
            </div>
          )}
          {template.kpis.avgTimeSaved && (
            <div>
              <div style={{ fontSize: "0.75rem", color: colors.text.tertiary }}>
                Time Saved
              </div>
              <div
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                {template.kpis.avgTimeSaved}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Row - Better icon spacing and hierarchy */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          padding: "0.75rem",
          background: colors.background.secondary,
          borderRadius: radius.md,
        }}
      >
        {/* Rating with icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1rem" }}>⭐</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.125rem",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "0.9375rem",
                color: colors.text.primary,
              }}
            >
              {ratingStars}
            </span>
            <span style={{ fontSize: "0.75rem", color: colors.text.tertiary }}>
              {template.reviewCount} reviews
            </span>
          </div>
        </div>

        {/* Installs with icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1rem" }}>👥</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.125rem",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "0.9375rem",
                color: colors.text.primary,
              }}
            >
              {template.installCount.toLocaleString()}
            </span>
            <span style={{ fontSize: "0.75rem", color: colors.text.tertiary }}>
              installs
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Standardized with better spacing */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Install agent:", template.id);
          }}
          style={{
            flex: 1,
            padding: "0.75rem 1.5rem",
            background: colors.primary[500],
            color: "white",
            border: "none",
            borderRadius: radius.lg,
            fontSize: "0.9375rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: shadows.sm,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[600];
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary[500];
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          Install Now
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Preview agent:", template.id);
          }}
          style={{
            padding: "0.75rem 1.25rem",
            background: colors.background.primary,
            color: colors.text.primary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            fontSize: "0.9375rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: shadows.sm,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.neutral[50];
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.background.primary;
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          Preview
        </button>
      </div>

      {/* Tags - Limited to 3 with overflow indicator */}
      {isFeatured && template.tags && template.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.25rem 0.625rem",
                background: colors.primary[50],
                color: colors.primary[600],
                borderRadius: radius.sm,
                fontSize: "0.75rem",
                fontWeight: "500",
              }}
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span
              style={{
                padding: "0.25rem 0.625rem",
                color: colors.text.tertiary,
                fontSize: "0.75rem",
                fontWeight: "500",
              }}
            >
              +{template.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
