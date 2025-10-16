import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  colors,
  typography,
  spacing,
  radius,
} from "@/lib/constants/design-system";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status?: "active" | "draft" | "paused";
  stats?: {
    successRate?: number;
    timeSaved?: string;
    usageCount?: number;
  };
  integrations?: string[];
}

interface AgentCardProps {
  agent: Agent;
  onView?: (agent: Agent) => void;
  onToggle?: (agent: Agent) => void;
  isInstalled?: boolean;
}

export function AgentCard({
  agent,
  onView,
  onToggle,
  isInstalled = false,
}: AgentCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onView?.(agent)}
    >
      <div
        style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}
      >
        {/* Header */}
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: spacing.md }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: colors.primaryLight,
              borderRadius: radius.lg,
            }}
          >
            {agent.icon || "🤖"}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.xs,
              }}
            >
              <h3
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: 0,
                }}
              >
                {agent.name}
              </h3>
              {agent.status && (
                <span
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background:
                      agent.status === "active"
                        ? colors.successLight
                        : colors.neutral[100],
                    color:
                      agent.status === "active"
                        ? colors.successColor
                        : colors.neutral[600],
                    borderRadius: radius.full,
                    textTransform: "uppercase",
                  }}
                >
                  {agent.status}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                margin: 0,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              {agent.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        {agent.stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: spacing.md,
              padding: spacing.md,
              background: colors.neutral[50],
              borderRadius: radius.md,
            }}
          >
            {agent.stats.successRate !== undefined && (
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing.xs,
                  }}
                >
                  Success Rate
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.successColor,
                  }}
                >
                  {agent.stats.successRate}%
                </div>
              </div>
            )}
            {agent.stats.timeSaved && (
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing.xs,
                  }}
                >
                  Time Saved
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                  }}
                >
                  {agent.stats.timeSaved}
                </div>
              </div>
            )}
            {agent.stats.usageCount !== undefined && (
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing.xs,
                  }}
                >
                  Usage
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                  }}
                >
                  {agent.stats.usageCount}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Integrations */}
        {agent.integrations && agent.integrations.length > 0 && (
          <div>
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[500],
                marginBottom: spacing.sm,
              }}
            >
              Integrations
            </div>
            <div style={{ display: "flex", gap: spacing.xs, flexWrap: "wrap" }}>
              {agent.integrations.map((integration) => (
                <span
                  key={integration}
                  style={{
                    fontSize: typography.fontSize.xs,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: colors.neutral[100],
                    color: colors.neutral[700],
                    borderRadius: radius.sm,
                  }}
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {onToggle && (
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              paddingTop: spacing.md,
              borderTop: `1px solid ${colors.neutral[200]}`,
            }}
          >
            <Button
              size="sm"
              variant={isInstalled ? "secondary" : "default"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(agent);
              }}
            >
              {isInstalled ? "Disable" : "Enable"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(agent);
              }}
            >
              Configure
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
