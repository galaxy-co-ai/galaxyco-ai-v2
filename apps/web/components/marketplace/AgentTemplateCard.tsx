"use client";

import { colors, shadows, radius } from "@/lib/constants/design-system";
import { logger } from "@/lib/utils/logger";
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
        background: "var(--bg-primary)",
        border: `1px solid ${isHovered ? "var(--border-focus)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)", // 16px - compact card padding
        cursor: "pointer",
        transition: "var(--transition-base)",
        boxShadow: isHovered
          ? "var(--shadow-card-hover)"
          : "var(--shadow-card)",
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
            top: "var(--space-3)",
            right: "var(--space-3)",
            padding: "var(--space-1) var(--space-2)", // 4px 8px - compact badge
            background: template.badgeText.includes("TRENDING")
              ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              : template.badgeText === "NEW"
                ? colors.success.DEFAULT
                : colors.primary[500],
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)", // 11px
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "0.5px",
          }}
        >
          {template.badgeText}
        </div>
      )}

      {/* Category & Type */}
      <div
        style={{
          fontSize: "var(--text-xs)", // 11px - compact label
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "var(--space-2)", // 8px
        }}
      >
        {template.category}
      </div>

      {/* Name - Compact sizing */}
      <h3
        style={{
          fontSize: "var(--text-lg)", // 16px - card title
          fontWeight: "var(--weight-semibold)",
          color: "var(--text-primary)",
          marginBottom: "var(--space-2)", // 8px
          lineHeight: "var(--leading-tight)",
        }}
      >
        {template.name}
      </h3>

      {/* Description - Compact sizing */}
      <p
        style={{
          fontSize: "var(--text-sm)", // 13px - compact description
          color: "var(--text-secondary)",
          marginBottom: "var(--space-3)", // 12px
          lineHeight: "var(--leading-snug)",
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
            gap: "var(--space-2)", // 8px - tighter
            marginBottom: "var(--space-3)", // 12px
            padding: "var(--space-3)", // 12px - compact inner padding
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {template.kpis.successRate && (
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                }}
              >
                Success Rate
              </div>
              <div
                style={{
                  fontSize: "var(--text-lg)", // 16px
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--text-primary)",
                }}
              >
                {template.kpis.successRate}%
              </div>
            </div>
          )}
          {template.kpis.avgTimeSaved && (
            <div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                }}
              >
                Time Saved
              </div>
              <div
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--text-primary)",
                }}
              >
                {template.kpis.avgTimeSaved}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Row - Compact */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-2)",
          marginBottom: "var(--space-3)",
          padding: "var(--space-2)", // 8px - compact stats padding
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
        }}
      >
        {/* Rating with icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span style={{ fontSize: "var(--text-sm)" }}>⭐</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <span
              style={{
                fontWeight: "var(--weight-semibold)",
                fontSize: "var(--text-sm)",
                color: "var(--text-primary)",
              }}
            >
              {ratingStars}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              {template.reviewCount}
            </span>
          </div>
        </div>

        {/* Installs with icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <span style={{ fontSize: "var(--text-sm)" }}>🔥</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <span
              style={{
                fontWeight: "var(--weight-semibold)",
                fontSize: "var(--text-sm)",
                color: "var(--text-primary)",
              }}
            >
              {template.installCount > 1000
                ? `${(template.installCount / 1000).toFixed(1)}k`
                : template.installCount}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              installs
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Compact */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            logger.debug("Install agent clicked", { templateId: template.id });
          }}
          style={{
            flex: 1,
            padding: "var(--space-2) var(--space-4)", // 8px 16px
            background: "var(--primary-500)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)", // 13px
            fontWeight: "var(--weight-semibold)",
            cursor: "pointer",
            transition: "var(--transition-base)",
            boxShadow: "var(--shadow-sm)",
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
            padding: "var(--space-2) var(--space-3)", // 8px 12px
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            cursor: "pointer",
            transition: "var(--transition-base)",
            boxShadow: "var(--shadow-sm)",
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
