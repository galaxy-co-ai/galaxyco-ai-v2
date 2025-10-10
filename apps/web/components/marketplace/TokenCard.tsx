"use client";

import {
  colors,
  spacing,
  radius,
  shadows,
  typography,
} from "@/lib/constants/design-system";
import { useState } from "react";

interface TokenCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    price: string;
    change24h: number;
    volume24h: string;
  };
}

/**
 * OpenSea-style compact token card
 * Used for trending tokens section with dense, scannable information
 */
export default function TokenCard({ token }: TokenCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = token.change24h >= 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.md,
        padding: spacing.md,
        background: colors.background.primary,
        border: `1px solid ${isHovered ? colors.border.focus : colors.border.default}`,
        borderRadius: radius.lg,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered ? shadows.md : shadows.sm,
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "2rem",
          flexShrink: 0,
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.background.secondary,
          borderRadius: radius.md,
        }}
      >
        {token.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {token.name}
        </div>
        <div
          style={{
            fontSize: typography.sizes.xs,
            color: colors.text.tertiary,
            textTransform: "uppercase",
          }}
        >
          {token.symbol}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
          }}
        >
          {token.price}
        </div>
        <div
          style={{
            fontSize: typography.sizes.xs,
            fontWeight: typography.weights.semibold,
            color: isPositive ? colors.success.DEFAULT : colors.error.DEFAULT,
          }}
        >
          {isPositive ? "+" : ""}
          {token.change24h.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
