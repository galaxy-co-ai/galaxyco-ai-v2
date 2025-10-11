"use client";

import Link from "next/link";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { colors, radius } from "@/lib/constants/design-system";
import {
  mockRecentActivity,
  ActivityItem,
} from "@/lib/mock-data/dashboard-agents";

export default function RecentActivity() {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getStatusIcon = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle size={16} color={colors.success.DEFAULT} />;
      case "warning":
        return <AlertTriangle size={16} color={colors.warning.DEFAULT} />;
      case "error":
        return <XCircle size={16} color={colors.error.DEFAULT} />;
    }
  };

  return (
    <div
      style={{
        background: colors.background.primary,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.lg,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: colors.text.primary,
            margin: 0,
          }}
        >
          Recent Activity
        </h2>
        <Link
          href="/activity"
          style={{
            fontSize: "0.875rem",
            color: colors.primary[500],
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          View All →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {mockRecentActivity.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              borderRadius: radius.md,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.background.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Status Icon */}
            <div style={{ flexShrink: 0 }}>{getStatusIcon(item.status)}</div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: colors.text.primary,
                  }}
                >
                  {item.agentName}
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: colors.text.secondary,
                  }}
                >
                  •
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: colors.text.secondary,
                  }}
                >
                  {item.action}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.text.tertiary,
                flexShrink: 0,
              }}
            >
              {formatTimestamp(item.timestamp)}
            </div>
          </div>
        ))}
      </div>

      {mockRecentActivity.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: colors.text.secondary,
          }}
        >
          No recent activity
        </div>
      )}
    </div>
  );
}
