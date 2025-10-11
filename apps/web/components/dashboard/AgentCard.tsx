"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { colors, radius } from "@/lib/constants/design-system";

interface AgentStats {
  executionsToday: number;
  successRate: number;
  lastRunAt: Date | null;
  avgResponseTime: number;
}

interface Agent {
  id: string;
  name: string;
  icon: string;
  category: string;
  isActive: boolean;
  status: "active" | "paused" | "error";
  stats: AgentStats;
}

interface AgentCardProps {
  agent: Agent;
  onToggle: (agentId: string) => Promise<void>;
}

export default function AgentCard({ agent, onToggle }: AgentCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    try {
      await onToggle(agent.id);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return colors.success.DEFAULT;
      case "paused":
        return colors.text.tertiary;
      case "error":
        return colors.error.DEFAULT;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusLabel = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "paused":
        return "Paused";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const formatLastRun = (date: Date | null) => {
    if (!date) return "Never";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Link
      href={`/agents/${agent.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: colors.background.primary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.lg,
          padding: "1.5rem",
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border.focus;
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border.default;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Header with Icon and Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "2.5rem" }}>{agent.icon}</div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            style={{
              position: "relative",
              width: "44px",
              height: "24px",
              background: agent.isActive
                ? colors.success.DEFAULT
                : colors.background.tertiary,
              border: "none",
              borderRadius: "12px",
              cursor: isToggling ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              opacity: isToggling ? 0.5 : 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: agent.isActive ? "22px" : "2px",
                width: "20px",
                height: "20px",
                background: "white",
                borderRadius: "50%",
                transition: "left 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>

        {/* Agent Name */}
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            color: colors.text.primary,
          }}
        >
          {agent.name}
        </h3>

        {/* Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: getStatusColor(agent.status),
            }}
          />
          <span
            style={{
              fontSize: "0.875rem",
              color: colors.text.secondary,
              fontWeight: "500",
            }}
          >
            {getStatusLabel(agent.status)}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            fontSize: "0.875rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: colors.text.secondary }}>Today:</span>
            <span style={{ color: colors.text.primary, fontWeight: "600" }}>
              {agent.stats.executionsToday} runs
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: colors.text.secondary }}>Success:</span>
            <span
              style={{
                color:
                  agent.stats.successRate >= 90
                    ? colors.success.DEFAULT
                    : colors.warning.DEFAULT,
                fontWeight: "600",
              }}
            >
              {agent.stats.successRate}%
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: colors.text.secondary }}>Last run:</span>
            <span style={{ color: colors.text.primary, fontWeight: "500" }}>
              {formatLastRun(agent.stats.lastRunAt)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.5rem",
            background: colors.background.secondary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            color: colors.text.primary,
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.background.tertiary;
            e.currentTarget.style.borderColor = colors.border.focus;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.background.secondary;
            e.currentTarget.style.borderColor = colors.border.default;
          }}
        >
          View Details →
        </button>
      </div>
    </Link>
  );
}
