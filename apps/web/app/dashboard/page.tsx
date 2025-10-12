"use client";

import { useState } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AgentFilters from "@/components/dashboard/AgentFilters";
import AgentGrid from "@/components/dashboard/AgentGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { colors } from "@/lib/constants/design-system";
import { mockDashboardStats } from "@/lib/mock-data/dashboard-agents";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "paused" | "error"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background.primary,
      }}
    >
      {/* Page Header */}
      <section
        style={{
          padding: "2rem 1.5rem 1rem",
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Mission Control
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: colors.text.secondary,
              }}
            >
              Monitor and manage your AI agents in real-time
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section style={{ padding: "1.5rem 1.5rem 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <DashboardStats {...mockDashboardStats} />
        </div>
      </section>

      {/* Filters & Search */}
      <section style={{ padding: "1.5rem 1.5rem 1rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <AgentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
        </div>
      </section>

      {/* Agent Grid */}
      <section style={{ padding: "0 1.5rem 2rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <AgentGrid
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section style={{ padding: "0 1.5rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <RecentActivity />
        </div>
      </section>
    </div>
  );
}
