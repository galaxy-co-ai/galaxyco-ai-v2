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

  const getAvatarGradient = (category: string) => {
    const gradients: Record<string, string> = {
      sales: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[600]})`,
      marketing: `linear-gradient(135deg, #ec4899, #be185d)`, // Pink
      operations: `linear-gradient(135deg, #8b5cf6, #6d28d9)`, // Purple
      support: `linear-gradient(135deg, #10b981, #059669)`, // Green
      engineering: `linear-gradient(135deg, #f59e0b, #d97706)`, // Orange
    };
    return (
      gradients[category] ||
      `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[600]})`
    );
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
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "var(--spacing-card)",
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
        {/* Header with Avatar and Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "var(--spacing-default)",
          }}
        >
          {/* Circular Avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: getAvatarGradient(agent.category),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "var(--text-body)",
              fontWeight: "600",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {agent.name.substring(0, 2).toUpperCase()}
          </div>

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
            fontSize: "var(--text-heading-md)",
            fontWeight: "600",
            marginBottom: "var(--spacing-tight)",
            color: "#111827",
          }}
        >
          {agent.name}
        </h3>

        {/* Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "var(--spacing-default)",
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
              fontSize: "var(--text-label)",
              color: "#6B7280",
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
            gap: "var(--spacing-tight)",
            fontSize: "var(--text-label)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6B7280" }}>Today:</span>
            <span style={{ color: "#111827", fontWeight: "600" }}>
              {agent.stats.executionsToday} runs
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6B7280" }}>Success:</span>
            <span
              style={{
                color:
                  agent.stats.successRate >= 90
                    ? "#10B981"
                    : "#F59E0B",
                fontWeight: "600",
              }}
            >
              {agent.stats.successRate}%
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6B7280" }}>Last run:</span>
            <span style={{ color: "#111827", fontWeight: "500" }}>
              {formatLastRun(agent.stats.lastRunAt)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          style={{
            width: "100%",
            marginTop: "var(--spacing-default)",
            padding: "8px 12px",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            color: "#111827",
            fontSize: "var(--text-label)",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F3F4F6";
            e.currentTarget.style.borderColor = "#D1D5DB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F9FAFB";
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          View Details →
        </button>
      </div>
    </Link>
  );
}
