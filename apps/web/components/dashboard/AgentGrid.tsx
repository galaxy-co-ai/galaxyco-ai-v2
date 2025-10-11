"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Package } from "lucide-react";
import AgentCard from "./AgentCard";
import { colors, radius } from "@/lib/constants/design-system";
import { mockAgents } from "@/lib/mock-data/dashboard-agents";

interface AgentGridProps {
  searchQuery: string;
  statusFilter: "all" | "active" | "paused" | "error";
  categoryFilter: string;
}

export default function AgentGrid({
  searchQuery,
  statusFilter,
  categoryFilter,
}: AgentGridProps) {
  const [agents, setAgents] = useState(mockAgents);

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || agent.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle toggle with optimistic UI
  const handleToggle = async (agentId: string) => {
    // Optimistic update
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              isActive: !a.isActive,
              status: !a.isActive ? "active" : "paused",
            }
          : a,
      ),
    );

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In real app: await fetch(`/api/agents/${agentId}/toggle`, { method: 'PATCH' });
    } catch (error) {
      // Revert on error
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                isActive: !a.isActive,
                status: !a.isActive ? "active" : "paused",
              }
            : a,
        ),
      );
      console.error("Failed to toggle agent:", error);
    }
  };

  // Empty state - no agents at all
  if (agents.length === 0) {
    return (
      <div
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          background: colors.background.primary,
          border: `2px dashed ${colors.border.default}`,
          borderRadius: radius.lg,
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>
          <Rocket
            size={64}
            color={colors.text.tertiary}
            style={{ display: "inline" }}
          />
        </div>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            color: colors.text.primary,
          }}
        >
          Welcome to Mission Control!
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: colors.text.secondary,
            marginBottom: "2rem",
            maxWidth: "500px",
            margin: "0 auto 2rem",
          }}
        >
          Deploy your first AI agent to start automating your workflows
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/marketplace"
            style={{
              padding: "0.75rem 1.5rem",
              background: colors.primary[500],
              color: "white",
              borderRadius: radius.md,
              fontSize: "0.9375rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Browse Marketplace
          </Link>
          <Link
            href="/agents/create"
            style={{
              padding: "0.75rem 1.5rem",
              background: colors.background.secondary,
              color: colors.text.primary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              fontSize: "0.9375rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Create Custom Agent
          </Link>
        </div>
      </div>
    );
  }

  // Empty state - all agents paused
  const allPaused = agents.every((a) => !a.isActive);
  if (allPaused && statusFilter === "all" && !searchQuery) {
    return (
      <div
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          background: colors.background.primary,
          border: `2px dashed ${colors.border.default}`,
          borderRadius: radius.lg,
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>💤</div>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            color: colors.text.primary,
          }}
        >
          All agents are currently paused
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: colors.text.secondary,
            marginBottom: "2rem",
          }}
        >
          Activate agents to start automating your workflows
        </p>
      </div>
    );
  }

  // No results from filtering
  if (filteredAgents.length === 0) {
    return (
      <div
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            color: colors.text.primary,
          }}
        >
          No agents found
        </h3>
        <p style={{ fontSize: "1rem", color: colors.text.secondary }}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // Agent grid
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {filteredAgents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onToggle={handleToggle} />
      ))}
    </div>
  );
}
