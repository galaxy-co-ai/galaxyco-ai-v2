"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TestPanelImproved as TestPanel } from "../../../components/agents/TestPanelImproved";
import {
  colors,
  spacing,
  typography,
  radius,
} from "../../../lib/constants/design-system";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "draft" | "active" | "paused" | "archived";
  type: string;
  trigger: string;
  aiProvider: string;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      setIsLoading(true);
      // TODO: Fetch from database API
      // For now, just set loading false and show not found
      setAgent(null);
      setIsLoading(false);
    };

    if (agentId) {
      loadAgent();
    }
  }, [agentId]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background.tertiary,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: spacing.md }}>🤖</div>
          <p
            style={{
              fontSize: typography.sizes.lg,
              color: colors.text.secondary,
            }}
          >
            Loading agent...
          </p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background.tertiary,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: spacing["2xl"],
            backgroundColor: colors.background.primary,
            borderRadius: radius.lg,
            border: `1px solid ${colors.border.default}`,
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: spacing.lg }}>😕</div>
          <h2
            style={{
              fontSize: typography.sizes["2xl"],
              fontWeight: typography.weights.bold,
              color: colors.text.primary,
              margin: 0,
              marginBottom: spacing.md,
            }}
          >
            Agent not found
          </h2>
          <p
            style={{
              fontSize: typography.sizes.base,
              color: colors.text.secondary,
              margin: 0,
              marginBottom: spacing.xl,
            }}
          >
            The agent you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/agents" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: colors.background.primary,
                backgroundColor: colors.primaryColor,
                border: "none",
                borderRadius: radius.md,
                cursor: "pointer",
              }}
            >
              ← Back to Agents
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    {
      draft: colors.warningColor,
      active: colors.successColor,
      paused: colors.text.tertiary,
      archived: colors.text.tertiary,
    }[agent.status as keyof typeof statusColors] || colors.text.tertiary;

  const statusColors = {
    draft: colors.warningColor,
    active: colors.successColor,
    paused: colors.text.tertiary,
    archived: colors.text.tertiary,
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: colors.background.tertiary,
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: colors.background.primary,
            borderBottom: `1px solid ${colors.border.default}`,
            padding: `${spacing.xl} ${spacing["2xl"]}`,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: spacing.md }}>
              <Link
                href="/agents"
                style={{
                  textDecoration: "none",
                  color: colors.text.secondary,
                  fontSize: typography.sizes.sm,
                }}
              >
                ← Back to Agents
              </Link>
            </div>

            {/* Agent Header */}
            <div
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                gap: spacing.lg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: spacing.lg,
                }}
              >
                <div style={{ fontSize: "64px" }}>{agent.icon}</div>
                <div>
                  <h1
                    style={{
                      fontSize: typography.sizes["3xl"],
                      fontWeight: typography.weights.bold,
                      color: colors.text.primary,
                      margin: 0,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {agent.name}
                  </h1>
                  <p
                    style={{
                      fontSize: typography.sizes.base,
                      color: colors.text.secondary,
                      margin: 0,
                      marginBottom: spacing.md,
                    }}
                  >
                    {agent.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: spacing.sm,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: statusColor,
                        color: colors.background.primary,
                        fontSize: typography.sizes.xs,
                        fontWeight: typography.weights.medium,
                        borderRadius: radius.full,
                        textTransform: "capitalize",
                      }}
                    >
                      {agent.status}
                    </div>
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.secondary,
                        color: colors.text.tertiary,
                        fontSize: typography.sizes.xs,
                        borderRadius: radius.sm,
                      }}
                    >
                      {agent.type}
                    </div>
                    <div
                      style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        backgroundColor: colors.background.secondary,
                        color: colors.text.tertiary,
                        fontSize: typography.sizes.xs,
                        borderRadius: radius.sm,
                      }}
                    >
                      {agent.aiProvider} • {agent.model}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: spacing.sm }}>
                <button
                  type="button"
                  onClick={() => setIsTestPanelOpen(true)}
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    fontSize: typography.sizes.base,
                    fontWeight: typography.weights.semibold,
                    color: colors.background.primary,
                    backgroundColor: colors.primaryColor,
                    border: "none",
                    borderRadius: radius.md,
                    cursor: "pointer",
                    transition: "opacity 200ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  🧪 Test Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: spacing["2xl"],
          }}
        >
          {/* Quick Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: spacing.lg,
              marginBottom: spacing["2xl"],
            }}
          >
            <div
              style={{
                padding: spacing.lg,
                backgroundColor: colors.background.primary,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <h3
                style={{
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: colors.text.secondary,
                  margin: 0,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Trigger Type
              </h3>
              <p
                style={{
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {agent.trigger}
              </p>
            </div>

            <div
              style={{
                padding: spacing.lg,
                backgroundColor: colors.background.primary,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <h3
                style={{
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: colors.text.secondary,
                  margin: 0,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Temperature
              </h3>
              <p
                style={{
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                  margin: 0,
                }}
              >
                {agent.temperature || 0.7}
              </p>
            </div>

            <div
              style={{
                padding: spacing.lg,
                backgroundColor: colors.background.primary,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <h3
                style={{
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: colors.text.secondary,
                  margin: 0,
                  marginBottom: spacing.xs,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Max Tokens
              </h3>
              <p
                style={{
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                  margin: 0,
                }}
              >
                {agent.maxTokens || 500}
              </p>
            </div>
          </div>

          {/* System Prompt */}
          {agent.systemPrompt && (
            <div
              style={{
                padding: spacing.lg,
                backgroundColor: colors.background.primary,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
                marginBottom: spacing["2xl"],
              }}
            >
              <h3
                style={{
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.semibold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.md,
                }}
              >
                System Prompt
              </h3>
              <p
                style={{
                  fontSize: typography.sizes.base,
                  color: colors.text.secondary,
                  margin: 0,
                  fontFamily: "monospace",
                  backgroundColor: colors.background.tertiary,
                  padding: spacing.md,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                {agent.systemPrompt}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div
            style={{
              textAlign: "center",
              padding: spacing["2xl"],
              backgroundColor: colors.background.primary,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: spacing.lg }}>🚀</div>
            <h2
              style={{
                fontSize: typography.sizes["2xl"],
                fontWeight: typography.weights.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: spacing.md,
              }}
            >
              Ready to test this agent?
            </h2>
            <p
              style={{
                fontSize: typography.sizes.base,
                color: colors.text.secondary,
                margin: 0,
                marginBottom: spacing.xl,
              }}
            >
              Click the test button to open the execution panel and try both
              mock and live modes.
            </p>
            <button
              type="button"
              onClick={() => setIsTestPanelOpen(true)}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.semibold,
                color: colors.background.primary,
                backgroundColor: colors.primaryColor,
                border: "none",
                borderRadius: radius.md,
                cursor: "pointer",
              }}
            >
              🧪 Test Agent Now
            </button>
          </div>
        </div>
      </div>

      {/* TestPanel */}
      <TestPanel
        agentId={agent.id}
        agentName={agent.name}
        agentType={agent.type}
        isOpen={isTestPanelOpen}
        onClose={() => setIsTestPanelOpen(false)}
      />
    </>
  );
}
