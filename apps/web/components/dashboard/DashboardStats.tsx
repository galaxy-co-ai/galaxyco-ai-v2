"use client";

import { Activity, CheckCircle, TrendingUp, Zap, Clock } from "lucide-react";
import { colors, radius } from "@/lib/constants/design-system";

interface DashboardStatsProps {
  totalAgents?: number;
  activeAgents?: number;
  totalExecutions?: number;
  successRate?: number;
  avgResponseTime?: number;
}

export default function DashboardStats({
  totalAgents = 0,
  activeAgents = 0,
  totalExecutions = 0,
  successRate = 0,
  avgResponseTime = 0,
}: DashboardStatsProps) {
  const stats = [
    {
      id: "total",
      label: "Total Agents",
      value: totalAgents,
      icon: Activity,
      color: colors.primary[500],
      bgColor: colors.primary[50],
    },
    {
      id: "active",
      label: "Active",
      value: activeAgents,
      icon: CheckCircle,
      color: colors.success.DEFAULT,
      bgColor: colors.success.light,
    },
    {
      id: "executions",
      label: "Executions",
      value: totalExecutions.toLocaleString(),
      icon: TrendingUp,
      color: colors.info.DEFAULT,
      bgColor: colors.info.light,
    },
    {
      id: "success",
      label: "Success Rate",
      value: `${successRate}%`,
      icon: Zap,
      color:
        successRate >= 90
          ? colors.success.DEFAULT
          : successRate >= 70
            ? colors.warning.DEFAULT
            : colors.error.DEFAULT,
      bgColor:
        successRate >= 90
          ? colors.success.light
          : successRate >= 70
            ? colors.warning.light
            : colors.error.light,
    },
    {
      id: "response",
      label: "Avg Response",
      value: `${avgResponseTime}s`,
      icon: Clock,
      color: colors.text.secondary,
      bgColor: colors.background.secondary,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            style={{
              background: colors.background.primary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.border.focus;
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border.default;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: radius.md,
                background: stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={24} strokeWidth={2} color={stat.color} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: colors.text.secondary,
                  marginBottom: "0.25rem",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: colors.text.primary,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
