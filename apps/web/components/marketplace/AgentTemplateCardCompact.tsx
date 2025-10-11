"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, Download, Zap, Clock } from "lucide-react";

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
 * Professional OpenSea-style Agent Card
 * - Clean, compact design with circular avatars
 * - Progressive disclosure on hover
 * - One-click deploy action
 * - Popularity and rarity signals
 */
export default function AgentTemplateCardCompact({
  template,
  isFeatured,
}: AgentTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ratingStars = (template.rating / 100).toFixed(1);

  // Generate avatar color based on category
  const getAvatarColor = (category: string) => {
    const colors = {
      Productivity: "var(--primary-500)",
      Knowledge: "var(--accent-500)",
      Development: "var(--success)",
      Data: "var(--info)",
      Security: "var(--error)",
      Analytics: "var(--warning)",
    };
    return colors[category as keyof typeof colors] || "var(--primary-500)";
  };

  return (
    <Card
      variant="interactive"
      hover={true}
      className={`cursor-pointer transition-all duration-200 ${
        isHovered ? "transform -translate-y-1" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minHeight: isFeatured ? "200px" : "160px",
        position: "relative",
      }}
    >
      {/* Badge */}
      {template.badgeText && (
        <div
          className="badge badge-primary"
          style={{
            position: "absolute",
            top: "var(--space-3)",
            right: "var(--space-3)",
            fontSize: "0.75rem",
            zIndex: 2,
          }}
        >
          {template.badgeText}
        </div>
      )}

      {/* Avatar & Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Circular Avatar - No Emoji */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${getAvatarColor(template.category)}20, ${getAvatarColor(template.category)}40)`,
            border: `2px solid ${getAvatarColor(template.category)}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap
            size={18}
            color={getAvatarColor(template.category)}
            strokeWidth={2.5}
          />
        </div>

        {/* Header Info */}
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-medium mb-1"
            style={{
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {template.category}
          </div>
          <h3
            className="text-sm font-semibold leading-tight"
            style={{
              color: "var(--text-primary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {template.name}
          </h3>
        </div>
      </div>

      {/* Description - Progressive Disclosure */}
      {(isHovered || isFeatured) && (
        <p
          className="text-xs mb-3"
          style={{
            color: "var(--text-secondary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {template.shortDescription}
        </p>
      )}

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Star size={12} fill="var(--warning)" color="var(--warning)" />
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {ratingStars}
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            ({template.reviewCount})
          </span>
        </div>

        {/* Install Count */}
        <div className="flex items-center gap-1">
          <Download size={12} color="var(--text-tertiary)" />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {template.installCount > 1000
              ? `${(template.installCount / 1000).toFixed(1)}k`
              : template.installCount}
          </span>
        </div>
      </div>

      {/* KPI Preview - Only on Hover */}
      {isHovered && template.kpis && (
        <div
          className="mb-3 p-2 rounded"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="grid grid-2 gap-2 text-xs">
            {template.kpis.successRate && (
              <div>
                <div style={{ color: "var(--text-tertiary)" }}>Success</div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--success)" }}
                >
                  {template.kpis.successRate}%
                </div>
              </div>
            )}
            {template.kpis.avgTimeSaved && (
              <div>
                <div style={{ color: "var(--text-tertiary)" }}>Saves</div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {template.kpis.avgTimeSaved}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button - One-Click Deploy */}
      {isHovered && (
        <Button
          size="sm"
          leftIcon={<Download size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Deploy agent:", template.id);
          }}
          style={{ width: "100%" }}
        >
          Deploy
        </Button>
      )}

      {/* Tags - Compact Pills */}
      {!isHovered && template.tags && template.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="badge"
              style={{
                fontSize: "0.6875rem",
                padding: "0.125rem 0.375rem",
                background: "var(--bg-secondary)",
                color: "var(--text-tertiary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
