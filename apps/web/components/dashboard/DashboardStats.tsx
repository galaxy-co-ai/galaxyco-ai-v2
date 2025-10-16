"use client";

import {
  Activity,
  CheckCircle,
  TrendingUp,
  Zap,
  Clock,
  TrendingDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  totalAgents?: number;
  activeAgents?: number;
  totalExecutions?: number;
  successRate?: number;
  avgResponseTime?: number;
  weeklyGrowth?: number;
}

interface StatCard {
  id: string;
  label: string;
  value: string | number;
  icon: any;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  color: "primary" | "success" | "warning" | "error" | "info";
}

export default function DashboardStats({
  totalAgents = 12,
  activeAgents = 8,
  totalExecutions = 1247,
  successRate = 94.2,
  avgResponseTime = 1.3,
  weeklyGrowth = 23,
}: DashboardStatsProps) {
  const stats: StatCard[] = [
    {
      id: "total",
      label: "Total Agents",
      value: totalAgents,
      icon: Activity,
      trend: {
        value: weeklyGrowth,
        direction: weeklyGrowth > 0 ? "up" : "down",
      },
      color: "primary",
    },
    {
      id: "active",
      label: "Active Agents",
      value: activeAgents,
      icon: CheckCircle,
      trend: { value: 12, direction: "up" },
      color: "success",
    },
    {
      id: "executions",
      label: "Total Executions",
      value: totalExecutions.toLocaleString(),
      icon: TrendingUp,
      trend: { value: 8.5, direction: "up" },
      color: "info",
    },
    {
      id: "success",
      label: "Success Rate",
      value: `${successRate}%`,
      icon: Zap,
      trend: { value: 2.1, direction: "up" },
      color:
        successRate >= 90 ? "success" : successRate >= 70 ? "warning" : "error",
    },
    {
      id: "response",
      label: "Avg Response Time",
      value: `${avgResponseTime}s`,
      icon: Clock,
      trend: { value: 15, direction: "down" },
      color: "info",
    },
  ];

  const getColorStyles = (color: string) => {
    const colorMap = {
      primary: {
        iconBg: "var(--primary-50)",
        iconColor: "var(--primary-500)",
      },
      success: {
        iconBg: "var(--success-light)",
        iconColor: "var(--success)",
      },
      info: {
        iconBg: "var(--info-light)",
        iconColor: "var(--info)",
      },
      warning: {
        iconBg: "var(--warning-light)",
        iconColor: "var(--warning)",
      },
      error: {
        iconBg: "var(--error-light)",
        iconColor: "var(--error)",
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.trend?.direction === "up" ? TrendingUp : TrendingDown;
        const colorStyles = getColorStyles(stat.color);

        return (
          <Card
            key={stat.id}
            className="animate-fade-in hover:shadow-md transition-shadow cursor-pointer"
            style={{
              padding: "var(--spacing-card)",
            }}
          >
            {/* Header with Icon */}
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "var(--spacing-tight)" }}
            >
              <div
                style={{
                  width: "var(--size-icon-md)",
                  height: "var(--size-icon-md)",
                  borderRadius: "8px",
                  background: colorStyles.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} strokeWidth={2} color={colorStyles.iconColor} />
              </div>

              {/* Trend Indicator */}
              {stat.trend && (
                <div
                  className="flex items-center"
                  style={{
                    gap: "4px",
                    color:
                      stat.trend.direction === "up"
                        ? "var(--success)"
                        : stat.trend.direction === "down"
                          ? "var(--error)"
                          : "var(--text-tertiary)",
                  }}
                >
                  <TrendIcon size={14} strokeWidth={2} />
                  <span
                    style={{ fontSize: "var(--text-label)", fontWeight: "600" }}
                  >
                    {stat.trend.value}%
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <div
                style={{
                  fontSize: "var(--text-label)",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "var(--text-stat)",
                  fontWeight: "700",
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
