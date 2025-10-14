"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isHovered ? "transform -translate-y-1" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "var(--card-height)", /* 260px - consistent height for all cards */
        minHeight: "var(--card-height)",
        padding: "var(--card-padding)", /* 14px - compact padding */
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
            width: "32px", /* Reduced from 40px for density */
            height: "32px",
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
            size={14} /* Reduced from 18px */
            color={getAvatarColor(template.category)}
            strokeWidth={2.5}
          />
        </div>

        {/* Header Info */}
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontSize: "var(--text-xs)", /* 11px - compact labels */
              fontWeight: "var(--font-medium)",
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              lineHeight: "var(--leading-tight)",
              marginBottom: "var(--space-1)", /* 4px */
            }}
          >
            {template.category}
          </div>
          <h3
            style={{
              fontSize: "var(--text-sm)", /* 13px - compact card titles */
              fontWeight: "var(--font-semibold)",
              lineHeight: "var(--leading-tight)", /* 1.25 for tighter spacing */
              color: "var(--text-primary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "var(--space-2)", /* 8px */
            }}
          >
            {template.name}
          </h3>
        </div>
      </div>

      {/* Description - Progressive Disclosure */}
      {(isHovered || isFeatured) && (
        <p
          style={{
            fontSize: "var(--text-xs)", /* 11px - compact description */
            lineHeight: "var(--leading-snug)", /* 1.375 - compact line height */
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "var(--space-2)", /* 8px */
          }}
        >
          {template.shortDescription}
        </p>
      )}

      {/* Stats Row - Compact */}
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-2)", /* 8px - tighter spacing */
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          <Star size={10} fill="var(--warning)" color="var(--warning)" /> {/* Smaller icon */}
          <span
            style={{
              fontSize: "var(--text-xs)", /* 11px */
              fontWeight: "var(--font-semibold)",
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
            ({template.reviewCount})
          </span>
        </div>

        {/* Install Count */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          <Download size={10} color="var(--text-tertiary)" /> {/* Smaller icon */}
          <span 
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)",
            }}
          >
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
          onClick={(e) => {
            e.stopPropagation();
            console.log("Deploy agent:", template.id);
          }}
          className="w-full"
        >
          <Download size={14} className="mr-2" />
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
