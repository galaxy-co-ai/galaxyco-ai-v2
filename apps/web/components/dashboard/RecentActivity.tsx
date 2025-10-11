"use client";

import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
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
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getStatusConfig = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          color: "var(--success)",
          bg: "var(--success-light)",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "var(--warning)",
          bg: "var(--warning-light)",
        };
      case "error":
        return {
          icon: XCircle,
          color: "var(--error)",
          bg: "var(--error-light)",
        };
      default:
        return {
          icon: Clock,
          color: "var(--text-tertiary)",
          bg: "var(--bg-secondary)",
        };
    }
  };

  return (
    <Card className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-lg)",
              background: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={18} strokeWidth={2} color="var(--primary-500)" />
          </div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Activity
          </h2>
        </div>
        <Link
          href="/dashboard?tab=activity"
          className="text-sm font-medium"
          style={{
            color: "var(--primary-500)",
            textDecoration: "none",
          }}
        >
          View All →
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative">
        {mockRecentActivity.length > 0 ? (
          <>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "8px",
                bottom: "8px",
                width: "2px",
                background: "var(--border-default)",
              }}
            />

            <div className="space-y-0">
              {mockRecentActivity.map((item, index) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={item.id}
                    className="relative flex items-start gap-4 pb-4 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: statusConfig.bg,
                        border: `2px solid var(--bg-primary)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <StatusIcon
                        size={16}
                        strokeWidth={2}
                        color={statusConfig.color}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.agentName}
                          </span>
                          <span
                            className="badge badge-primary"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.125rem 0.5rem",
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>

                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-8">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-4)",
              }}
            >
              <Clock size={24} strokeWidth={2} color="var(--text-tertiary)" />
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No recent activity
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Agent executions will appear here
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
